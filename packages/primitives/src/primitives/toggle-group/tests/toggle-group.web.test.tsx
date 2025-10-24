import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { ToggleGroup } from "../toggle-group";
import { Toggle } from "../../toggle";
import { Text } from "react-native";

describe("ToggleGroup (Web)", () => {
  it("renders toggle group", () => {
    render(
      <ToggleGroup testID="toggle-group">
        <Toggle value="option1">
          <Text>Option 1</Text>
        </Toggle>
        <Toggle value="option2">
          <Text>Option 2</Text>
        </Toggle>
      </ToggleGroup>
    );

    expect(screen.getByTestId("toggle-group")).toBeInTheDocument();
  });

  it("manages multiple toggle values", () => {
    const onValueChange = jest.fn();
    
    render(
      <ToggleGroup testID="toggle-group" value={["option1"]} onValueChange={onValueChange}>
        <Toggle value="option1" testID="toggle1">
          <Text>Option 1</Text>
        </Toggle>
        <Toggle value="option2" testID="toggle2">
          <Text>Option 2</Text>
        </Toggle>
      </ToggleGroup>
    );

    const toggle1 = screen.getByTestId("toggle1");
    const toggle2 = screen.getByTestId("toggle2");
    
    // Option 1 should be pressed initially
    expect(toggle1).toHaveAttribute("aria-pressed", "true");
    expect(toggle2).toHaveAttribute("aria-pressed", "false");
    
    // Click option 2 to add it
    fireEvent.click(toggle2);
    expect(onValueChange).toHaveBeenCalledWith(["option1", "option2"]);
    
    // Click option 1 to remove it
    fireEvent.click(toggle1);
    expect(onValueChange).toHaveBeenCalledWith([]);
  });

  it("supports default value", () => {
    render(
      <ToggleGroup testID="toggle-group" defaultValue={["option2"]}>
        <Toggle value="option1" testID="toggle1">
          <Text>Option 1</Text>
        </Toggle>
        <Toggle value="option2" testID="toggle2">
          <Text>Option 2</Text>
        </Toggle>
      </ToggleGroup>
    );

    const toggle1 = screen.getByTestId("toggle1");
    const toggle2 = screen.getByTestId("toggle2");
    
    expect(toggle1).toHaveAttribute("aria-pressed", "false");
    expect(toggle2).toHaveAttribute("aria-pressed", "true");
  });

  it("respects disabled state", () => {
    const onValueChange = jest.fn();
    
    render(
      <ToggleGroup testID="toggle-group" disabled onValueChange={onValueChange}>
        <Toggle value="option1" testID="toggle1">
          <Text>Option 1</Text>
        </Toggle>
        <Toggle value="option2" testID="toggle2">
          <Text>Option 2</Text>
        </Toggle>
      </ToggleGroup>
    );

    const toggle1 = screen.getByTestId("toggle1");
    fireEvent.click(toggle1);
    
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
