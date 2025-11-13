import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Radio } from "../radio";
import { RadioGroup } from "../../radiogroup";

test("renders unchecked radio", () => {
  const { getByTestId } = render(<Radio testID="radio" />);
  
  const radio = getByTestId("radio");
  expect(radio).toBeTruthy();
});

test("renders checked radio", () => {
  const { getByTestId } = render(<Radio checked={true} testID="radio" />);
  
  const radio = getByTestId("radio");
  expect(radio).toBeTruthy();
});

test("renders disabled radio", () => {
  const { getByTestId } = render(<Radio disabled={true} testID="radio" />);
  
  const radio = getByTestId("radio");
  expect(radio).toBeTruthy();
});

test("calls onCheckedChange when pressed", () => {
  const handleChange = jest.fn();
  const { getByTestId } = render(<Radio onCheckedChange={handleChange} testID="radio" />);
  
  const radio = getByTestId("radio");
  fireEvent.press(radio);
  
  expect(handleChange).toHaveBeenCalledWith(true);
});

test("supports asChild", () => {
  const { getByTestId } = render(
    <Radio asChild>
      <div testID="custom-radio">
        Custom radio
      </div>
    </Radio>
  );
  
  const customRadio = getByTestId("custom-radio");
  expect(customRadio).toBeTruthy();
});

test("forwards ref", () => {
  const ref = React.createRef<any>();
  
  render(<Radio ref={ref} testID="radio" />);
  
  expect(ref.current).toBeTruthy();
});

test("works with RadioGroup", () => {
  const handleChange = jest.fn();
  
  const { getByTestId } = render(
    <RadioGroup value="option1" onValueChange={handleChange}>
      <Radio value="option1" testID="radio1" />
      <Radio value="option2" testID="radio2" />
    </RadioGroup>
  );
  
  const radio1 = getByTestId("radio1");
  const radio2 = getByTestId("radio2");
  
  expect(radio1).toBeTruthy();
  expect(radio2).toBeTruthy();
  
  fireEvent.press(radio2);
  expect(handleChange).toHaveBeenCalledWith("option2");
});

