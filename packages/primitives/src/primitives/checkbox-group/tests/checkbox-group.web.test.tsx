import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CheckboxGroup } from "../checkbox-group";
import { Checkbox } from "../../checkbox";

test("checkbox group manages values", () => {
  const handleChange = jest.fn();
  render(
    <CheckboxGroup value={["option1"]} onValueChange={handleChange}>
      <Checkbox value="option1" testID="checkbox1" />
      <Checkbox value="option2" testID="checkbox2" />
    </CheckboxGroup>
  );
  
  const checkbox1 = screen.getByTestId("checkbox1");
  const checkbox2 = screen.getByTestId("checkbox2");
  
  expect(checkbox1).toBeInTheDocument();
  expect(checkbox2).toBeInTheDocument();
  
  fireEvent.click(checkbox2);
  expect(handleChange).toHaveBeenCalledWith(["option1", "option2"]);
});

test("checkbox group supports asChild", () => {
  render(
    <CheckboxGroup asChild>
      <div data-testid="custom-group">
        <Checkbox value="option1" testID="checkbox1" />
      </div>
    </CheckboxGroup>
  );
  
  const customGroup = screen.getByTestId("custom-group");
  expect(customGroup).toBeInTheDocument();
});

test("checkbox group forwards ref", () => {
  const ref = React.createRef<any>();
  
  render(
    <CheckboxGroup ref={ref}>
      <Checkbox value="option1" testID="checkbox1" />
    </CheckboxGroup>
  );
  
  expect(ref.current).toBeTruthy();
});
