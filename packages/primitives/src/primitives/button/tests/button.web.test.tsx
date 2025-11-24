import React, { createRef } from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { View } from "react-native";
import { Button } from "../button";
import { Text } from "../../text";

// Note: On web, Pressable renders a div with role="button" by default in recent RNW versions
// or we explicitly passed role="button".

test("renders correctly on web", () => {
  const { getByRole } = render(
    <Button>
      <Text>Press me</Text>
    </Button>
  );
  
  expect(getByRole("button")).toBeTruthy();
});

test("handles onPress on web", () => {
  const onPress = jest.fn();
  const { getByRole } = render(
    <Button onPress={onPress}>
      <Text>Press me</Text>
    </Button>
  );
  
  fireEvent.press(getByRole("button"));
  expect(onPress).toHaveBeenCalled();
});

test("asChild renders child without wrapper on web", () => {
  const onPress = jest.fn();
  const { getByTestId } = render(
    <Button asChild onPress={onPress}>
      <View testID="child-view">
        <Text>Child</Text>
      </View>
    </Button>
  );
  
  const child = getByTestId("child-view");
  // Slot logic should pass down onPress
  fireEvent.press(child);
  expect(onPress).toHaveBeenCalled();
});

