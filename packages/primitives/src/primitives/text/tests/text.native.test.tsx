import React, { createRef } from "react";
import { render } from "@testing-library/react-native";
import { Text } from "../text";

test("renders RNText by default", () => {
  const { toJSON } = render(<Text testID="text">Hello World</Text>);
  const tree = toJSON() as any;
  expect(tree.type).toBe("Text");
});

test("ignores as prop on native", () => {
  const { toJSON } = render(<Text as="h1" testID="text">Title</Text>);
  const tree = toJSON() as any;
  expect(tree.type).toBe("Text");
});

test("forwards common props (style, testID)", () => {
  const { getByTestId } = render(
    <Text testID="text" style={{ fontSize: 16, color: "red" }}>
      Styled text
    </Text>
  );
  expect(getByTestId("text")).toBeTruthy();
});

test("asChild renders child without wrapper", () => {
  const { toJSON } = render(
    <Text asChild>
      <Text>Child text</Text>
    </Text>
  );
  const tree = toJSON() as any;
  expect(tree.type).toBe("Text");
});

test("forwards ref to underlying node", () => {
  const ref = createRef<any>();
  render(<Text ref={ref}>Hello</Text>);
  expect(ref.current).toBeTruthy();
});

test("handles accessibility props", () => {
  const { toJSON } = render(
    <Text accessibilityRole="header" accessibilityLabel="Accessible text">
      Accessible text
    </Text>
  );
  const tree = toJSON() as any;
  expect(tree.type).toBe("Text");
});
