import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { Toggle } from "../toggle";
import { Text } from "react-native";

describe("Toggle (Web)", () => {
  it("renders toggle button", () => {
    render(
      <Toggle testID="toggle">
        <Text>Toggle me</Text>
      </Toggle>
    );

    expect(screen.getByTestId("toggle")).toBeInTheDocument();
  });

  it("handles press events", () => {
    const onPressedChange = jest.fn();
    
    render(
      <Toggle testID="toggle" onPressedChange={onPressedChange}>
        <Text>Toggle me</Text>
      </Toggle>
    );

    const toggleElement = screen.getByTestId("toggle");
    fireEvent.click(toggleElement);
    
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it("toggles between pressed states", () => {
    const onPressedChange = jest.fn();
    
    render(
      <Toggle testID="toggle" pressed={false} onPressedChange={onPressedChange}>
        <Text>Toggle me</Text>
      </Toggle>
    );

    const toggleElement = screen.getByTestId("toggle");
    fireEvent.click(toggleElement);
    
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it("respects disabled state", () => {
    const onPressedChange = jest.fn();
    
    render(
      <Toggle testID="toggle" disabled onPressedChange={onPressedChange}>
        <Text>Toggle me</Text>
      </Toggle>
    );

    const toggleElement = screen.getByTestId("toggle");
    fireEvent.click(toggleElement);
    
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it("supports defaultPressed", () => {
    render(
      <Toggle testID="toggle" defaultPressed={true}>
        <Text>Toggle me</Text>
      </Toggle>
    );

    const toggleElement = screen.getByTestId("toggle");
    expect(toggleElement).toHaveAttribute("aria-pressed", "true");
  });

  it("supports value prop", () => {
    render(
      <Toggle testID="toggle" value="test-value">
        <Text>Toggle me</Text>
      </Toggle>
    );

    const toggleElement = screen.getByTestId("toggle");
    // For now, just check that the component renders with a value prop
    expect(toggleElement).toBeInTheDocument();
  });
});
