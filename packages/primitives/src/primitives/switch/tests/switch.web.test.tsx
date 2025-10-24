import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { Switch } from "../switch";
import { Text } from "react-native";

describe("Switch (Web)", () => {
  it("renders switch button", () => {
    render(
      <Switch testID="switch">
        <Text>Switch me</Text>
      </Switch>
    );

    expect(screen.getByTestId("switch")).toBeInTheDocument();
  });

  it("handles press events", () => {
    const onPressedChange = jest.fn();
    
    render(
      <Switch testID="switch" onPressedChange={onPressedChange}>
        <Text>Switch me</Text>
      </Switch>
    );

    const switchElement = screen.getByTestId("switch");
    fireEvent.click(switchElement);
    
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it("toggles between pressed states", () => {
    const onPressedChange = jest.fn();
    
    render(
      <Switch testID="switch" pressed={false} onPressedChange={onPressedChange}>
        <Text>Switch me</Text>
      </Switch>
    );

    const switchElement = screen.getByTestId("switch");
    fireEvent.click(switchElement);
    
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it("respects disabled state", () => {
    const onPressedChange = jest.fn();
    
    render(
      <Switch testID="switch" disabled onPressedChange={onPressedChange}>
        <Text>Switch me</Text>
      </Switch>
    );

    const switchElement = screen.getByTestId("switch");
    fireEvent.click(switchElement);
    
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it("supports defaultPressed", () => {
    render(
      <Switch testID="switch" defaultPressed={true}>
        <Text>Switch me</Text>
      </Switch>
    );

    const switchElement = screen.getByTestId("switch");
    expect(switchElement).toHaveAttribute("aria-checked", "true");
  });

  it("supports value prop", () => {
    render(
      <Switch testID="switch" value="test-value">
        <Text>Switch me</Text>
      </Switch>
    );

    const switchElement = screen.getByTestId("switch");
    // For now, just check that the component renders with a value prop
    expect(switchElement).toBeInTheDocument();
  });
});
