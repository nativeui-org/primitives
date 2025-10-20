import React from "react";
import { render } from "@testing-library/react-native";
import { AspectRatio } from "../aspect-ratio";
import { Text, View } from "react-native";

test("renders with number ratio", () => {
  const { getByTestId } = render(
    <AspectRatio ratio={16/9} testID="aspect-ratio">
      <Text>Content</Text>
    </AspectRatio>
  );

  expect(getByTestId("aspect-ratio")).toBeTruthy();
});

test("renders with string ratio", () => {
  const { getByTestId } = render(
    <AspectRatio ratio="1:1" testID="aspect-ratio">
      <Text>Square content</Text>
    </AspectRatio>
  );

  expect(getByTestId("aspect-ratio")).toBeTruthy();
});

test("supports asChild", () => {
  const { getByTestId } = render(
    <AspectRatio ratio="4:3" asChild>
      <View testID="custom-element">
        <Text>Custom element</Text>
      </View>
    </AspectRatio>
  );

  expect(getByTestId("custom-element")).toBeTruthy();
});

test("forwards ref", () => {
  const ref = React.createRef<any>();
  
  render(
    <AspectRatio ratio="16:9" ref={ref}>
      <Text>Content</Text>
    </AspectRatio>
  );

  expect(ref.current).toBeTruthy();
});

test("handles invalid ratio gracefully", () => {
  const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  
  const { getByTestId } = render(
    <AspectRatio ratio="invalid" testID="aspect-ratio">
      <Text>Content</Text>
    </AspectRatio>
  );

  expect(getByTestId("aspect-ratio")).toBeTruthy();
  expect(consoleSpy).toHaveBeenCalledWith(
    expect.stringContaining("Invalid aspect ratio")
  );
  
  consoleSpy.mockRestore();
});

test("parses different ratio formats", () => {
  const { getByTestId, rerender } = render(
    <AspectRatio ratio="16:9" testID="aspect-ratio">
      <Text>16:9</Text>
    </AspectRatio>
  );
  expect(getByTestId("aspect-ratio")).toBeTruthy();

  rerender(
    <AspectRatio ratio="4/3" testID="aspect-ratio">
      <Text>4/3</Text>
    </AspectRatio>
  );
  expect(getByTestId("aspect-ratio")).toBeTruthy();

  rerender(
    <AspectRatio ratio={1} testID="aspect-ratio">
      <Text>1:1</Text>
    </AspectRatio>
  );
  expect(getByTestId("aspect-ratio")).toBeTruthy();
});
