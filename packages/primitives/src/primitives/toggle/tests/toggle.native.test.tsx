import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Toggle } from "../toggle";
import { Text } from "react-native";

describe("Toggle (Native)", () => {
  it("renders toggle button", () => {
    const { getByTestId } = render(
      <Toggle testID="toggle">
        <Text>Toggle me</Text>
      </Toggle>
    );

    expect(getByTestId("toggle")).toBeTruthy();
  });

  it("handles press events", () => {
    const onPressedChange = jest.fn();
    
    const { getByTestId } = render(
      <Toggle testID="toggle" onPressedChange={onPressedChange}>
        <Text>Toggle me</Text>
      </Toggle>
    );

    const toggleElement = getByTestId("toggle");
    fireEvent.press(toggleElement);
    
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it("respects disabled state", () => {
    const onPressedChange = jest.fn();
    
    const { getByTestId } = render(
      <Toggle testID="toggle" disabled onPressedChange={onPressedChange}>
        <Text>Toggle me</Text>
      </Toggle>
    );

    const toggleElement = getByTestId("toggle");
    fireEvent.press(toggleElement);
    
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it("supports defaultPressed", () => {
    const { getByTestId } = render(
      <Toggle testID="toggle" defaultPressed={true}>
        <Text>Toggle me</Text>
      </Toggle>
    );

    const toggleElement = getByTestId("toggle");
    expect(toggleElement.props.accessibilityState.selected).toBe(true);
  });
});
