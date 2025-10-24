import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { SwitchGroup } from "../switch-group";
import { Switch } from "../../switch";
import { Text } from "react-native";

describe("SwitchGroup (Web)", () => {
  it("renders switch group", () => {
    render(
      <SwitchGroup testID="switch-group">
        <Switch value="option1">
          <Text>Option 1</Text>
        </Switch>
        <Switch value="option2">
          <Text>Option 2</Text>
        </Switch>
      </SwitchGroup>
    );

    expect(screen.getByTestId("switch-group")).toBeInTheDocument();
  });

  it("manages multiple switch values", () => {
    const onValueChange = jest.fn();
    
    render(
      <SwitchGroup testID="switch-group" value={["option1"]} onValueChange={onValueChange}>
        <Switch value="option1" testID="switch1">
          <Text>Option 1</Text>
        </Switch>
        <Switch value="option2" testID="switch2">
          <Text>Option 2</Text>
        </Switch>
      </SwitchGroup>
    );

    const switch1 = screen.getByTestId("switch1");
    const switch2 = screen.getByTestId("switch2");
    
    // Option 1 should be pressed initially
    expect(switch1).toHaveAttribute("aria-checked", "true");
    expect(switch2).toHaveAttribute("aria-checked", "false");
    
    // Click option 2 to add it
    fireEvent.click(switch2);
    expect(onValueChange).toHaveBeenCalledWith(["option1", "option2"]);
    
    // Click option 1 to remove it
    fireEvent.click(switch1);
    expect(onValueChange).toHaveBeenCalledWith([]);
  });

  it("supports default value", () => {
    render(
      <SwitchGroup testID="switch-group" defaultValue={["option2"]}>
        <Switch value="option1" testID="switch1">
          <Text>Option 1</Text>
        </Switch>
        <Switch value="option2" testID="switch2">
          <Text>Option 2</Text>
        </Switch>
      </SwitchGroup>
    );

    const switch1 = screen.getByTestId("switch1");
    const switch2 = screen.getByTestId("switch2");
    
    expect(switch1).toHaveAttribute("aria-checked", "false");
    expect(switch2).toHaveAttribute("aria-checked", "true");
  });

  it("respects disabled state", () => {
    const onValueChange = jest.fn();
    
    render(
      <SwitchGroup testID="switch-group" disabled onValueChange={onValueChange}>
        <Switch value="option1" testID="switch1">
          <Text>Option 1</Text>
        </Switch>
        <Switch value="option2" testID="switch2">
          <Text>Option 2</Text>
        </Switch>
      </SwitchGroup>
    );

    const switch1 = screen.getByTestId("switch1");
    fireEvent.click(switch1);
    
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
