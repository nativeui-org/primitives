import React, { createRef } from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { View } from "react-native";
import { Input } from "../input";

test("renders TextInput by default", () => {
  const { getByTestId } = render(
    <Input testID="input" placeholder="Enter text" />
  );
  expect(getByTestId("input")).toBeTruthy();
});

test("forwards common props (style, testID, placeholder)", () => {
  const { getByTestId } = render(
    <Input 
      testID="input" 
      style={{ backgroundColor: "red" }}
      placeholder="Enter your name"
    />
  );
  const input = getByTestId("input");
  expect(input).toBeTruthy();
});

test("handles onChangeText", () => {
  const onChangeText = jest.fn();
  const { getByTestId } = render(
    <Input testID="input" onChangeText={onChangeText} />
  );
  
  fireEvent.changeText(getByTestId("input"), "Hello");
  expect(onChangeText).toHaveBeenCalledWith("Hello");
});

test("handles value prop (controlled)", () => {
  const { getByTestId, rerender } = render(
    <Input testID="input" value="initial" />
  );
  
  const input = getByTestId("input");
  expect(input.props.value).toBe("initial");
  
  rerender(<Input testID="input" value="updated" />);
  expect(input.props.value).toBe("updated");
});

test("handles defaultValue prop (uncontrolled)", () => {
  const { getByTestId } = render(
    <Input testID="input" defaultValue="default" />
  );
  
  const input = getByTestId("input");
  expect(input.props.defaultValue).toBe("default");
});

test("asChild renders child without wrapper", () => {
  const onChangeText = jest.fn();
  const { getByTestId } = render(
    <Input asChild onChangeText={onChangeText}>
      <View testID="child-view">
        <Input testID="nested-input" />
      </View>
    </Input>
  );
  
  const child = getByTestId("child-view");
  expect(child).toBeTruthy();
});

test("forwards ref to underlying TextInput", () => {
  const ref = createRef<any>();
  render(<Input ref={ref} testID="input" />);
  expect(ref.current).toBeTruthy();
});

test("handles multiline prop", () => {
  const { getByTestId } = render(
    <Input testID="input" multiline numberOfLines={4} />
  );
  
  const input = getByTestId("input");
  expect(input.props.multiline).toBe(true);
  expect(input.props.numberOfLines).toBe(4);
});

test("handles secureTextEntry prop", () => {
  const { getByTestId } = render(
    <Input testID="input" secureTextEntry />
  );
  
  const input = getByTestId("input");
  expect(input.props.secureTextEntry).toBe(true);
});

test("handles keyboardType prop", () => {
  const { getByTestId } = render(
    <Input testID="input" keyboardType="email-address" />
  );
  
  const input = getByTestId("input");
  expect(input.props.keyboardType).toBe("email-address");
});

test("handles editable prop", () => {
  const { getByTestId } = render(
    <Input testID="input" editable={false} />
  );
  
  const input = getByTestId("input");
  expect(input.props.editable).toBe(false);
});

