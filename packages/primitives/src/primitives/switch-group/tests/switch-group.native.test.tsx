import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SwitchGroup } from "../switch-group";
import { Switch } from "../../switch";
import { Text } from "react-native";

describe("SwitchGroup (Native)", () => {
  it("renders switch group", () => {
    const { getByTestId } = render(
      <SwitchGroup testID="switch-group">
        <Switch value="option1">
          <Text>Option 1</Text>
        </Switch>
        <Switch value="option2">
          <Text>Option 2</Text>
        </Switch>
      </SwitchGroup>
    );

    expect(getByTestId("switch-group")).toBeTruthy();
  });

  it("manages multiple switch values", () => {
    const onValueChange = jest.fn();
    
    const { getByTestId } = render(
      <SwitchGroup testID="switch-group" value={["option1"]} onValueChange={onValueChange}>
        <Switch value="option1" testID="switch1">
          <Text>Option 1</Text>
        </Switch>
        <Switch value="option2" testID="switch2">
          <Text>Option 2</Text>
        </Switch>
      </SwitchGroup>
    );

    const switch1 = getByTestId("switch1");
    const switch2 = getByTestId("switch2");
    
    // Option 1 should be pressed initially
    expect(switch1.props.accessibilityState.checked).toBe(true);
    expect(switch2.props.accessibilityState.checked).toBe(false);
    
    // Click option 2 to add it
    fireEvent.press(switch2);
    expect(onValueChange).toHaveBeenCalledWith(["option1", "option2"]);
    
    // Click option 1 to remove it
    fireEvent.press(switch1);
    expect(onValueChange).toHaveBeenCalledWith([]);
  });

  it("supports default value", () => {
    const { getByTestId } = render(
      <SwitchGroup testID="switch-group" defaultValue={["option2"]}>
        <Switch value="option1" testID="switch1">
          <Text>Option 1</Text>
        </Switch>
        <Switch value="option2" testID="switch2">
          <Text>Option 2</Text>
        </Switch>
      </SwitchGroup>
    );

    const switch1 = getByTestId("switch1");
    const switch2 = getByTestId("switch2");
    
    expect(switch1.props.accessibilityState.checked).toBe(false);
    expect(switch2.props.accessibilityState.checked).toBe(true);
  });

  it("respects disabled state", () => {
    const onValueChange = jest.fn();
    
    const { getByTestId } = render(
      <SwitchGroup testID="switch-group" disabled onValueChange={onValueChange}>
        <Switch value="option1" testID="switch1">
          <Text>Option 1</Text>
        </Switch>
        <Switch value="option2" testID="switch2">
          <Text>Option 2</Text>
        </Switch>
      </SwitchGroup>
    );

    const switch1 = getByTestId("switch1");
    fireEvent.press(switch1);
    
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
