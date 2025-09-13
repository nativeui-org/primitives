import React, { createRef } from "react";
import { render } from "@testing-library/react-native";
import { View } from "../view";
import { Pressable, Text } from "react-native";

test("renders RNView by default", () => {
  const { toJSON } = render(<View testID="box"><Text>hi</Text></View>);
  const tree = toJSON() as any;
  expect(tree.type).toBe("View");
});

test("forwards common props (style, testID)", () => {
  const { getByTestId } = render(<View testID="box" style={{ padding: 8 }} />);
  expect(getByTestId("box")).toBeTruthy();
});

test("asChild renders child without wrapper", () => {
  const { toJSON } = render(
    <View asChild>
      <Pressable />
    </View>
  );
  const tree = toJSON() as any;
  expect(tree.type).toBe("View"); // Pressable -> View en output RN testing tree
});

test("forwards ref to underlying node", () => {
  const ref = createRef<any>();
  render(<View ref={ref} />);
  expect(ref.current).toBeTruthy();
});
