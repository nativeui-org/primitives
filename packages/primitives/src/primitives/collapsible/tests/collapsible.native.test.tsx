import React, { createRef } from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../collapsible";
import { View, Text } from "react-native";

test("renders collapsible components", () => {
  const { getByTestId } = render(
    <Collapsible testID="root">
      <CollapsibleTrigger testID="trigger">
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent testID="content">
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  expect(getByTestId("root")).toBeTruthy();
  expect(getByTestId("trigger")).toBeTruthy();
});

test("content is hidden by default", () => {
  const { queryByTestId } = render(
    <Collapsible>
      <CollapsibleTrigger>
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent testID="content">
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  expect(queryByTestId("content")).toBeNull();
});

test("content is visible when defaultOpen is true", () => {
  const { getByTestId } = render(
    <Collapsible defaultOpen>
      <CollapsibleTrigger>
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent testID="content">
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  expect(getByTestId("content")).toBeTruthy();
});

test("trigger toggles content visibility (uncontrolled)", () => {
  const { getByTestId, queryByTestId } = render(
    <Collapsible>
      <CollapsibleTrigger testID="trigger">
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent testID="content">
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  // Initially hidden
  expect(queryByTestId("content")).toBeNull();

  // Click trigger
  fireEvent.press(getByTestId("trigger"));
  expect(getByTestId("content")).toBeTruthy();

  // Click again to hide
  fireEvent.press(getByTestId("trigger"));
  expect(queryByTestId("content")).toBeNull();
});

test("controlled mode with open prop", () => {
  const onOpenChange = jest.fn();
  const { getByTestId, queryByTestId, rerender } = render(
    <Collapsible open={false} onOpenChange={onOpenChange}>
      <CollapsibleTrigger testID="trigger">
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent testID="content">
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  // Initially closed
  expect(queryByTestId("content")).toBeNull();

  // Click trigger
  fireEvent.press(getByTestId("trigger"));
  expect(onOpenChange).toHaveBeenCalledWith(true);

  // Rerender with open=true
  rerender(
    <Collapsible open={true} onOpenChange={onOpenChange}>
      <CollapsibleTrigger testID="trigger">
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent testID="content">
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  expect(getByTestId("content")).toBeTruthy();
});

test("disabled state prevents toggling", () => {
  const { getByTestId, queryByTestId } = render(
    <Collapsible disabled>
      <CollapsibleTrigger testID="trigger">
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent testID="content">
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  fireEvent.press(getByTestId("trigger"));
  expect(queryByTestId("content")).toBeNull();
});

test("trigger can be individually disabled", () => {
  const { getByTestId, queryByTestId } = render(
    <Collapsible>
      <CollapsibleTrigger testID="trigger" disabled>
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent testID="content">
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  fireEvent.press(getByTestId("trigger"));
  expect(queryByTestId("content")).toBeNull();
});

test("forwards ref to root element", () => {
  const ref = createRef<any>();
  render(
    <Collapsible ref={ref}>
      <CollapsibleTrigger>
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  expect(ref.current).toBeTruthy();
});

test("forwards ref to trigger element", () => {
  const ref = createRef<any>();
  render(
    <Collapsible>
      <CollapsibleTrigger ref={ref}>
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  expect(ref.current).toBeTruthy();
});

test("forwards ref to content element", () => {
  const ref = createRef<any>();
  render(
    <Collapsible defaultOpen>
      <CollapsibleTrigger>
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent ref={ref}>
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  expect(ref.current).toBeTruthy();
});

test("supports asChild on root", () => {
  const { toJSON } = render(
    <Collapsible asChild>
      <View testID="custom">
        <CollapsibleTrigger>
          <Text>Toggle</Text>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Text>Content</Text>
        </CollapsibleContent>
      </View>
    </Collapsible>
  );

  const tree = toJSON() as any;
  expect(tree.props.testID).toBe("custom");
});

test("supports asChild on trigger", () => {
  const { getByTestId } = render(
    <Collapsible>
      <CollapsibleTrigger asChild>
        <View testID="custom-trigger">
          <Text>Toggle</Text>
        </View>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  expect(getByTestId("custom-trigger")).toBeTruthy();
});

test("supports asChild on content", () => {
  const { getByTestId } = render(
    <Collapsible defaultOpen>
      <CollapsibleTrigger>
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent asChild>
        <View testID="custom-content">
          <Text>Content</Text>
        </View>
      </CollapsibleContent>
    </Collapsible>
  );

  expect(getByTestId("custom-content")).toBeTruthy();
});

test("forceMount keeps content mounted when closed", () => {
  const { toJSON } = render(
    <Collapsible>
      <CollapsibleTrigger testID="trigger">
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent testID="content" forceMount>
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  // Content is mounted even when closed
  const tree = toJSON() as any;
  const content = tree.children.find((child: any) => child.props.testID === "content");
  
  expect(content).toBeTruthy();
  expect(content.props.style).toEqual(
    expect.arrayContaining([expect.objectContaining({ display: "none" })])
  );
});

test("trigger has correct accessibility props", () => {
  const { getByTestId } = render(
    <Collapsible>
      <CollapsibleTrigger testID="trigger">
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  const trigger = getByTestId("trigger");
  expect(trigger.props.accessibilityRole).toBe("button");
  expect(trigger.props.accessibilityState).toEqual({ expanded: false, disabled: false });
});

test("trigger accessibility state updates when opened", () => {
  const { getByTestId } = render(
    <Collapsible defaultOpen>
      <CollapsibleTrigger testID="trigger">
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  const trigger = getByTestId("trigger");
  expect(trigger.props.accessibilityState).toEqual({ expanded: true, disabled: false });
});

test("custom onPress handler is called", () => {
  const onPress = jest.fn();
  const { getByTestId } = render(
    <Collapsible>
      <CollapsibleTrigger testID="trigger" onPress={onPress}>
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  fireEvent.press(getByTestId("trigger"));
  expect(onPress).toHaveBeenCalledTimes(1);
});

test("throws error when trigger used outside Collapsible", () => {
  // Suppress console.error for this test
  const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

  expect(() => {
    render(
      <CollapsibleTrigger>
        <Text>Toggle</Text>
      </CollapsibleTrigger>
    );
  }).toThrow("Collapsible components must be used within a Collapsible");

  consoleError.mockRestore();
});

test("throws error when content used outside Collapsible", () => {
  const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

  expect(() => {
    render(
      <CollapsibleContent>
        <Text>Content</Text>
      </CollapsibleContent>
    );
  }).toThrow("Collapsible components must be used within a Collapsible");

  consoleError.mockRestore();
});

