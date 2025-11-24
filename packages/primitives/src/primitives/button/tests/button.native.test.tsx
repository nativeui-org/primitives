import React, { createRef } from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { View } from "react-native";
import { Button } from "../button";
import { Text } from "../../text";

test("renders Pressable by default", () => {
  const { toJSON } = render(
    <Button testID="button">
      <Text>Press me</Text>
    </Button>
  );
  const tree = toJSON() as any;
  // Pressable usually renders a View in the test output structure depending on version, 
  // but type check validates component existence.
  expect(tree.type).toBe("View"); 
});

test("forwards common props (style, testID)", () => {
  const { getByTestId } = render(
    <Button testID="button" style={{ backgroundColor: "red" }}>
      <Text>Button</Text>
    </Button>
  );
  expect(getByTestId("button")).toBeTruthy();
});

test("handles onPress", () => {
  const onPress = jest.fn();
  const { getByTestId } = render(
    <Button testID="button" onPress={onPress}>
      <Text>Press me</Text>
    </Button>
  );
  
  fireEvent.press(getByTestId("button"));
  expect(onPress).toHaveBeenCalled();
});

test("asChild renders child without wrapper", () => {
  // When using asChild with Button (Pressable), the child receives the props.
  // Slot merges props.
  const onPress = jest.fn();
  const { getByTestId } = render(
    <Button asChild onPress={onPress}>
      <View testID="child-view">
        <Text>Child</Text>
      </View>
    </Button>
  );
  
  const child = getByTestId("child-view");
  fireEvent.press(child);
  expect(onPress).toHaveBeenCalled();
});

test("forwards ref to underlying node", () => {
  const ref = createRef<any>();
  render(
    <Button ref={ref}>
      <Text>Hello</Text>
    </Button>
  );
  expect(ref.current).toBeTruthy();
});

