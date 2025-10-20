import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { CheckboxGroup } from "../checkbox-group";
import { Checkbox } from "../../checkbox";
import { View } from "react-native";

test("checkbox group manages values", () => {
  const handleChange = jest.fn();
  const { getByTestId } = render(
    <CheckboxGroup value={["option1"]} onValueChange={handleChange}>
      <Checkbox value="option1" testID="checkbox1" />
      <Checkbox value="option2" testID="checkbox2" />
    </CheckboxGroup>
  );
  
  const checkbox1 = getByTestId("checkbox1");
  const checkbox2 = getByTestId("checkbox2");
  
  expect(checkbox1).toBeTruthy();
  expect(checkbox2).toBeTruthy();
  
  fireEvent.press(checkbox2);
  expect(handleChange).toHaveBeenCalledWith(["option1", "option2"]);
});

test("checkbox group supports asChild", () => {
  const { getByTestId } = render(
    <CheckboxGroup asChild>
      <View testID="custom-group">
        <Checkbox value="option1" testID="checkbox1" />
      </View>
    </CheckboxGroup>
  );
  
  const customGroup = getByTestId("custom-group");
  expect(customGroup).toBeTruthy();
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
