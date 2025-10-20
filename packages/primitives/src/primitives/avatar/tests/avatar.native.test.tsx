import React from "react";
import { render } from "@testing-library/react-native";
import { Avatar } from "../avatar";
import { View } from "react-native";

test("renders with image", () => {
  const { getByTestId } = render(
    <Avatar 
      src="https://example.com/avatar.jpg" 
      fallback="JD" 
      testID="avatar"
    />
  );

  expect(getByTestId("avatar")).toBeTruthy();
});

test("renders fallback when no image", () => {
  const { getByTestId } = render(
    <Avatar fallback="AB" testID="avatar" />
  );

  const avatar = getByTestId("avatar");
  expect(avatar).toBeTruthy();
});

test("renders question mark when no fallback", () => {
  const { getByTestId } = render(
    <Avatar testID="avatar" />
  );

  const avatar = getByTestId("avatar");
  expect(avatar).toBeTruthy();
});

test("supports different sizes", () => {
  const { getByTestId, rerender } = render(
    <Avatar size="sm" testID="avatar" />
  );
  expect(getByTestId("avatar")).toBeTruthy();

  rerender(<Avatar size="lg" testID="avatar" />);
  expect(getByTestId("avatar")).toBeTruthy();

  rerender(<Avatar size={80} testID="avatar" />);
  expect(getByTestId("avatar")).toBeTruthy();
});

test("supports different shapes", () => {
  const { getByTestId, rerender } = render(
    <Avatar shape="circle" testID="avatar" />
  );
  expect(getByTestId("avatar")).toBeTruthy();

  rerender(<Avatar shape="square" testID="avatar" />);
  expect(getByTestId("avatar")).toBeTruthy();
});

test("supports asChild", () => {
  const { getByTestId } = render(
    <Avatar asChild>
      <View testID="custom-element">
        Custom content
      </View>
    </Avatar>
  );

  expect(getByTestId("custom-element")).toBeTruthy();
});

test("forwards ref", () => {
  const ref = React.createRef<any>();
  
  render(
    <Avatar ref={ref} testID="avatar">
      Content
    </Avatar>
  );

  expect(ref.current).toBeTruthy();
});
