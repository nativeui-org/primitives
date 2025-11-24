import { render } from "@testing-library/react-native";
import { Field, FieldLabel, FieldSet, FieldLegend } from "../index";

test("renders Field wrapper on web", () => {
  const { getByRole } = render(
    <Field>
      <FieldLabel htmlFor="test-input">Test Label</FieldLabel>
    </Field>
  );
  expect(getByRole("group")).toBeTruthy();
});

test("renders FieldLabel as label element on web", () => {
  const { getByText } = render(
    <FieldLabel htmlFor="test-input">Test Label</FieldLabel>
  );
  expect(getByText("Test Label")).toBeTruthy();
});

test("renders FieldSet as fieldset element on web", () => {
  const { container } = render(
    <FieldSet>
      <FieldLegend>Test Legend</FieldLegend>
    </FieldSet>
  );
  const fieldset = container.querySelector("fieldset");
  expect(fieldset).toBeTruthy();
});

test("renders FieldLegend as legend element on web", () => {
  const { getByText } = render(
    <FieldSet>
      <FieldLegend>Test Legend</FieldLegend>
    </FieldSet>
  );
  expect(getByText("Test Legend")).toBeTruthy();
});
