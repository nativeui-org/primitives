import React, { createRef } from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Slot } from "../slot";
import { View, Text, Pressable } from "react-native";

test("renders child element without wrapper", () => {
  const { toJSON } = render(
    <Slot testID="slot">
      <View testID="child" />
    </Slot>
  );
  const tree = toJSON() as any;
  expect(tree.type).toBe("View");
  expect(tree.props.testID).toBe("child");
});

test("merges props from parent to child", () => {
  const { getByTestId } = render(
    <Slot accessible={true} accessibilityLabel="Merged label">
      <View testID="child" />
    </Slot>
  );
  const child = getByTestId("child");
  expect(child.props.accessible).toBe(true);
  expect(child.props.accessibilityLabel).toBe("Merged label");
});

test("child props take precedence over parent props", () => {
  const { getByTestId } = render(
    <Slot testID="parent" accessibilityLabel="Parent label">
      <View testID="child" accessibilityLabel="Child label" />
    </Slot>
  );
  const child = getByTestId("child");
  expect(child.props.testID).toBe("child");
  expect(child.props.accessibilityLabel).toBe("Child label");
});

test("composes event handlers (child first, then parent)", () => {
  const callOrder: string[] = [];
  const childHandler = jest.fn(() => callOrder.push('child'));
  const parentHandler = jest.fn(() => callOrder.push('parent'));

  const { getByTestId } = render(
    <Slot onPress={parentHandler}>
      <Pressable testID="pressable" onPress={childHandler}>
        <Text>Press me</Text>
      </Pressable>
    </Slot>
  );

  const pressable = getByTestId("pressable");
  fireEvent.press(pressable);

  expect(childHandler).toHaveBeenCalledTimes(1);
  expect(parentHandler).toHaveBeenCalledTimes(1);
  expect(callOrder).toEqual(['child', 'parent']);
});

test("parent handler runs even if child has no handler", () => {
  const parentHandler = jest.fn();

  const { getByTestId } = render(
    <Slot onPress={parentHandler}>
      <Pressable testID="pressable">
        <Text>Press me</Text>
      </Pressable>
    </Slot>
  );

  const pressable = getByTestId("pressable");
  fireEvent.press(pressable);

  expect(parentHandler).toHaveBeenCalledTimes(1);
});

test("forwards ref to child element", () => {
  const ref = createRef<any>();
  render(
    <Slot ref={ref}>
      <View testID="child" />
    </Slot>
  );
  expect(ref.current).toBeTruthy();
});

test("composes refs (both parent and child refs work)", () => {
  const parentRef = createRef<any>();
  const childRef = createRef<any>();

  render(
    <Slot ref={parentRef}>
      <View ref={childRef} testID="child" />
    </Slot>
  );

  expect(parentRef.current).toBeTruthy();
  expect(childRef.current).toBeTruthy();
  expect(parentRef.current).toBe(childRef.current);
});

test("works with callback refs", () => {
  let parentNode: any = null;
  let childNode: any = null;

  render(
    <Slot ref={(node: any) => { parentNode = node; }}>
      <View ref={(node: any) => { childNode = node; }} testID="child" />
    </Slot>
  );

  expect(parentNode).toBeTruthy();
  expect(childNode).toBeTruthy();
  expect(parentNode).toBe(childNode);
});

test("returns null for invalid children (non-element)", () => {
  const { toJSON } = render(
    <Slot>
      Hello world
    </Slot>
  );
  expect(toJSON()).toBeNull();
});

test("returns null for multiple children", () => {
  const { toJSON } = render(
    <Slot>
      <View />
      <View />
    </Slot>
  );
  expect(toJSON()).toBeNull();
});

test("returns null for null/undefined children", () => {
  const { toJSON: json1 } = render(<Slot>{null}</Slot>);
  const { toJSON: json2 } = render(<Slot>{undefined}</Slot>);
  
  expect(json1()).toBeNull();
  expect(json2()).toBeNull();
});

test("merges style prop correctly", () => {
  const { getByTestId } = render(
    <Slot style={{ padding: 16, margin: 8 }}>
      <View testID="child" style={{ padding: 24 }} />
    </Slot>
  );
  
  const child = getByTestId("child");
  // Child's style takes precedence
  expect(child.props.style).toEqual({ padding: 24 });
});

test("injects props that child doesn't have", () => {
  const { getByTestId } = render(
    <Slot accessible={true} testID="fromParent">
      <View />
    </Slot>
  );
  
  const view = getByTestId("fromParent");
  expect(view.props.accessible).toBe(true);
});

test("handles event handler composition with multiple event types", () => {
  const onPressChild = jest.fn();
  const onPressParent = jest.fn();
  const onLongPressChild = jest.fn();
  const onLongPressParent = jest.fn();

  const { getByTestId } = render(
    <Slot onPress={onPressParent} onLongPress={onLongPressParent}>
      <Pressable 
        testID="pressable" 
        onPress={onPressChild}
        onLongPress={onLongPressChild}
      >
        <Text>Press me</Text>
      </Pressable>
    </Slot>
  );

  const pressable = getByTestId("pressable");
  
  fireEvent.press(pressable);
  expect(onPressChild).toHaveBeenCalledTimes(1);
  expect(onPressParent).toHaveBeenCalledTimes(1);
  
  fireEvent(pressable, 'longPress');
  expect(onLongPressChild).toHaveBeenCalledTimes(1);
  expect(onLongPressParent).toHaveBeenCalledTimes(1);
});

