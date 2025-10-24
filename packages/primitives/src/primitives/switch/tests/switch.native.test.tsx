import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Switch } from "../switch";
import { Text } from "react-native";

describe("Switch (Native)", () => {
  it("renders switch button", () => {
    const { getByTestId } = render(
      <Switch testID="switch">
        <Text>Switch me</Text>
      </Switch>
    );

    expect(getByTestId("switch")).toBeTruthy();
  });

  it("handles press events", () => {
    const onPressedChange = jest.fn();
    
    const { getByTestId } = render(
      <Switch testID="switch" onPressedChange={onPressedChange}>
        <Text>Switch me</Text>
      </Switch>
    );

    const switchElement = getByTestId("switch");
    fireEvent.press(switchElement);
    
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it("respects disabled state", () => {
    const onPressedChange = jest.fn();
    
    const { getByTestId } = render(
      <Switch testID="switch" disabled onPressedChange={onPressedChange}>
        <Text>Switch me</Text>
      </Switch>
    );

    const switchElement = getByTestId("switch");
    fireEvent.press(switchElement);
    
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it("supports defaultPressed", () => {
    const { getByTestId } = render(
      <Switch testID="switch" defaultPressed={true}>
        <Text>Switch me</Text>
      </Switch>
    );

    const switchElement = getByTestId("switch");
    expect(switchElement.props.accessibilityState.checked).toBe(true);
  });
});
