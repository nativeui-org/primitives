import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Checkbox } from "../checkbox";

test("renders unchecked checkbox", () => {
  render(<Checkbox testID="checkbox" />);
  
  const checkbox = screen.getByTestId("checkbox");
  expect(checkbox).toBeInTheDocument();
});

test("renders checked checkbox", () => {
  render(<Checkbox checked={true} testID="checkbox" />);
  
  const checkbox = screen.getByTestId("checkbox");
  expect(checkbox).toBeInTheDocument();
});

test("renders indeterminate checkbox", () => {
  render(<Checkbox indeterminate={true} testID="checkbox" />);
  
  const checkbox = screen.getByTestId("checkbox");
  expect(checkbox).toBeInTheDocument();
});

test("renders disabled checkbox", () => {
  render(<Checkbox disabled={true} testID="checkbox" />);
  
  const checkbox = screen.getByTestId("checkbox");
  expect(checkbox).toBeInTheDocument();
});

test("calls onCheckedChange when clicked", () => {
  const handleChange = jest.fn();
  render(<Checkbox onCheckedChange={handleChange} testID="checkbox" />);
  
  const checkbox = screen.getByTestId("checkbox");
  fireEvent.click(checkbox);
  
  expect(handleChange).toHaveBeenCalledWith(true);
});

test("supports asChild", () => {
  render(
    <Checkbox asChild>
      <div data-testid="custom-checkbox">
        Custom checkbox
      </div>
    </Checkbox>
  );
  
  const customCheckbox = screen.getByTestId("custom-checkbox");
  expect(customCheckbox).toBeInTheDocument();
});

test("forwards ref", () => {
  const ref = React.createRef<any>();
  
  render(<Checkbox ref={ref} testID="checkbox" />);
  
  expect(ref.current).toBeTruthy();
});