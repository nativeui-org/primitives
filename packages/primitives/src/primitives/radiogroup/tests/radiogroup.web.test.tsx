import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { RadioGroup } from "../radiogroup";
import { Radio } from "../../radio";

test("radio group manages value", () => {
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

test("radio group supports asChild", () => {
  render(
    <RadioGroup asChild>
      <div data-testid="custom-group">
        <Radio value="option1" testID="radio1" />
      </div>
    </RadioGroup>
  );
  
  const customGroup = screen.getByTestId("custom-group");
  expect(customGroup).toBeInTheDocument();
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
  render(
    <RadioGroup defaultValue="option1" onValueChange={handleChange}>
      <Radio value="option1" testID="radio1" />
      <Radio value="option2" testID="radio2" />
    </RadioGroup>
  );
  
  const radio2 = screen.getByTestId("radio2");
  fireEvent.click(radio2);
  
  expect(handleChange).toHaveBeenCalledWith("option2");
});

test("radio group disables all radios when disabled", () => {
  render(
    <RadioGroup disabled>
      <Radio value="option1" testID="radio1" />
      <Radio value="option2" testID="radio2" />
    </RadioGroup>
  );
  
  const radio1 = screen.getByTestId("radio1");
  const radio2 = screen.getByTestId("radio2");
  
  expect(radio1).toHaveAttribute("aria-disabled", "true");
  expect(radio2).toHaveAttribute("aria-disabled", "true");
});

