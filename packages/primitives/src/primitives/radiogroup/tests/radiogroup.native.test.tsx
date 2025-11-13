import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { RadioGroup } from "../radiogroup";
import { Radio } from "../../radio";

test("radio group manages value", () => {
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

test("radio group supports asChild", () => {
  const { getByTestId } = render(
    <RadioGroup asChild>
      <div testID="custom-group">
        <Radio value="option1" testID="radio1" />
      </div>
    </RadioGroup>
  );
  
  const customGroup = getByTestId("custom-group");
  expect(customGroup).toBeTruthy();
});

test("radio group forwards ref", () => {
  const ref = React.createRef<any>();
  
  render(
    <RadioGroup ref={ref}>
      <Radio value="option1" testID="radio1" />
    </RadioGroup>
  );
  
  expect(ref.current).toBeTruthy();
});

test("radio group supports uncontrolled mode", () => {
  const handleChange = jest.fn();
  const { getByTestId } = render(
    <RadioGroup defaultValue="option1" onValueChange={handleChange}>
      <Radio value="option1" testID="radio1" />
      <Radio value="option2" testID="radio2" />
    </RadioGroup>
  );
  
  const radio2 = getByTestId("radio2");
  fireEvent.press(radio2);
  
  expect(handleChange).toHaveBeenCalledWith("option2");
});

test("radio group disables all radios when disabled", () => {
  const { getByTestId } = render(
    <RadioGroup disabled>
      <Radio value="option1" testID="radio1" />
      <Radio value="option2" testID="radio2" />
    </RadioGroup>
  );
  
  const radio1 = getByTestId("radio1");
  const radio2 = getByTestId("radio2");
  
  expect(radio1).toBeTruthy();
  expect(radio2).toBeTruthy();
  
  // Both radios should be disabled (check accessibilityState)
  expect(radio1.props.accessibilityState?.disabled).toBe(true);
  expect(radio2.props.accessibilityState?.disabled).toBe(true);
});

