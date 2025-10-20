import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Checkbox } from "../checkbox";
import { View } from "react-native";

test("renders unchecked checkbox", () => {
  const { getByTestId } = render(<Checkbox testID="checkbox" />);
  
  const checkbox = getByTestId("checkbox");
  expect(checkbox).toBeTruthy();
});

test("renders checked checkbox", () => {
  const { getByTestId } = render(<Checkbox checked={true} testID="checkbox" />);
  
  const checkbox = getByTestId("checkbox");
  expect(checkbox).toBeTruthy();
});

test("renders indeterminate checkbox", () => {
  const { getByTestId } = render(<Checkbox indeterminate={true} testID="checkbox" />);
  
  const checkbox = getByTestId("checkbox");
  expect(checkbox).toBeTruthy();
});

test("renders disabled checkbox", () => {
  const { getByTestId } = render(<Checkbox disabled={true} testID="checkbox" />);
  
  const checkbox = getByTestId("checkbox");
  expect(checkbox).toBeTruthy();
});

test("calls onCheckedChange when pressed", () => {
  const handleChange = jest.fn();
  const { getByTestId } = render(<Checkbox onCheckedChange={handleChange} testID="checkbox" />);
  
  const checkbox = getByTestId("checkbox");
  fireEvent.press(checkbox);
  
  expect(handleChange).toHaveBeenCalledWith(true);
});

test("supports asChild", () => {
  const { getByTestId } = render(
    <Checkbox asChild>
      <View testID="custom-checkbox">
        Custom checkbox
      </View>
    </Checkbox>
  );
  
  const customCheckbox = getByTestId("custom-checkbox");
  expect(customCheckbox).toBeTruthy();
});

test("forwards ref", () => {
  const ref = React.createRef<any>();
  
  render(<Checkbox ref={ref} testID="checkbox" />);
  
  expect(ref.current).toBeTruthy();
});