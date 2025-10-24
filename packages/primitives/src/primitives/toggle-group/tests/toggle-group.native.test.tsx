import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ToggleGroup } from "../toggle-group";
import { Toggle } from "../../toggle";
import { Text } from "react-native";

describe("ToggleGroup (Native)", () => {
  it("renders toggle group", () => {
    const { getByTestId } = render(
      <ToggleGroup testID="toggle-group">
        <Toggle value="option1">
          <Text>Option 1</Text>
        </Toggle>
        <Toggle value="option2">
          <Text>Option 2</Text>
        </Toggle>
      </ToggleGroup>
    );

    expect(getByTestId("toggle-group")).toBeTruthy();
  });

  it("manages multiple toggle values", () => {
    const onValueChange = jest.fn();
    
    const { getByTestId } = render(
      <ToggleGroup testID="toggle-group" value={["option1"]} onValueChange={onValueChange}>
        <Toggle value="option1" testID="toggle1">
          <Text>Option 1</Text>
        </Toggle>
        <Toggle value="option2" testID="toggle2">
          <Text>Option 2</Text>
        </Toggle>
      </ToggleGroup>
    );

    const toggle1 = getByTestId("toggle1");
    const toggle2 = getByTestId("toggle2");
    
    // Option 1 should be pressed initially
    expect(toggle1.props.accessibilityState.selected).toBe(true);
    expect(toggle2.props.accessibilityState.selected).toBe(false);
    
    // Click option 2 to add it
    fireEvent.press(toggle2);
    expect(onValueChange).toHaveBeenCalledWith(["option1", "option2"]);
    
    // Click option 1 to remove it
    fireEvent.press(toggle1);
    expect(onValueChange).toHaveBeenCalledWith([]);
  });

  it("supports default value", () => {
    const { getByTestId } = render(
      <ToggleGroup testID="toggle-group" defaultValue={["option2"]}>
        <Toggle value="option1" testID="toggle1">
          <Text>Option 1</Text>
        </Toggle>
        <Toggle value="option2" testID="toggle2">
          <Text>Option 2</Text>
        </Toggle>
      </ToggleGroup>
    );

    const toggle1 = getByTestId("toggle1");
    const toggle2 = getByTestId("toggle2");
    
    expect(toggle1.props.accessibilityState.selected).toBe(false);
    expect(toggle2.props.accessibilityState.selected).toBe(true);
  });

  it("respects disabled state", () => {
    const onValueChange = jest.fn();
    
    const { getByTestId } = render(
      <ToggleGroup testID="toggle-group" disabled onValueChange={onValueChange}>
        <Toggle value="option1" testID="toggle1">
          <Text>Option 1</Text>
        </Toggle>
        <Toggle value="option2" testID="toggle2">
          <Text>Option 2</Text>
        </Toggle>
      </ToggleGroup>
    );

    const toggle1 = getByTestId("toggle1");
    fireEvent.press(toggle1);
    
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
