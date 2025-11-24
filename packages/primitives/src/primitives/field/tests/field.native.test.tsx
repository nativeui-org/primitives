import { render } from "@testing-library/react-native";
import { Field, FieldLabel, FieldDescription, FieldGroup } from "../index";

test("renders Field wrapper", () => {
  const { getByTestId } = render(
    <Field testID="field">
      <FieldLabel>Test Label</FieldLabel>
    </Field>
  );
  expect(getByTestId("field")).toBeTruthy();
});

test("renders FieldLabel", () => {
  const { getByText } = render(
    <FieldLabel htmlFor="test-input">Test Label</FieldLabel>
  );
  expect(getByText("Test Label")).toBeTruthy();
});

test("renders FieldDescription", () => {
  const { getByText } = render(
    <FieldDescription>Helper text</FieldDescription>
  );
  expect(getByText("Helper text")).toBeTruthy();
});

test("renders FieldGroup", () => {
  const { getByTestId } = render(
    <FieldGroup testID="group">
      <Field>
        <FieldLabel>Field 1</FieldLabel>
      </Field>
    </FieldGroup>
  );
  expect(getByTestId("group")).toBeTruthy();
});

test("Field supports vertical orientation", () => {
  const { getByTestId } = render(
    <Field testID="field" orientation="vertical">
      <FieldLabel>Label</FieldLabel>
    </Field>
  );
  expect(getByTestId("field")).toBeTruthy();
});

test("Field supports horizontal orientation", () => {
  const { getByTestId } = render(
    <Field testID="field" orientation="horizontal">
      <FieldLabel>Label</FieldLabel>
    </Field>
  );
  expect(getByTestId("field")).toBeTruthy();
});
