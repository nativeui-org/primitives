import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Radio } from "../radio";
import { RadioGroup } from "../../radiogroup";

test("renders unchecked radio", () => {
  render(<Radio testID="radio" />);
  
  const radio = screen.getByTestId("radio");
  expect(radio).toBeInTheDocument();
});

test("renders checked radio", () => {
  render(<Radio checked={true} testID="radio" />);
  
  const radio = screen.getByTestId("radio");
  expect(radio).toBeInTheDocument();
});

test("renders disabled radio", () => {
  render(<Radio disabled={true} testID="radio" />);
  
  const radio = screen.getByTestId("radio");
  expect(radio).toBeInTheDocument();
});

test("calls onCheckedChange when clicked", () => {
  const handleChange = jest.fn();
  render(<Radio onCheckedChange={handleChange} testID="radio" />);
  
  const radio = screen.getByTestId("radio");
  fireEvent.click(radio);
  
  expect(handleChange).toHaveBeenCalledWith(true);
});

test("supports asChild", () => {
  render(
    <Radio asChild>
      <div data-testid="custom-radio">
        Custom radio
      </div>
    </Radio>
  );
  
  const customRadio = screen.getByTestId("custom-radio");
  expect(customRadio).toBeInTheDocument();
});

test("forwards ref", () => {
  const ref = React.createRef<any>();
  
  render(<Radio ref={ref} testID="radio" />);
  
  expect(ref.current).toBeTruthy();
});

test("works with RadioGroup", () => {
  const handleChange = jest.fn();
  
  render(
    <RadioGroup value="option1" onValueChange={handleChange}>
      <Radio value="option1" testID="radio1" />
      <Radio value="option2" testID="radio2" />
    </RadioGroup>
  );
  
  const radio1 = screen.getByTestId("radio1");
  const radio2 = screen.getByTestId("radio2");
  
  expect(radio1).toBeInTheDocument();
  expect(radio2).toBeInTheDocument();
  
  fireEvent.click(radio2);
  expect(handleChange).toHaveBeenCalledWith("option2");
});

