import React from "react";
import { render, screen } from "@testing-library/react";
import { AspectRatio } from "../aspect-ratio";
import { View, Text } from "react-native";

test("renders with number ratio", () => {
  render(
    <AspectRatio ratio={16/9} testID="aspect-ratio">
      <Text>Content</Text>
    </AspectRatio>
  );

  const container = screen.getByTestId("aspect-ratio");
  expect(container).toBeInTheDocument();
});

test("renders with string ratio", () => {
  render(
    <AspectRatio ratio="1:1" testID="aspect-ratio">
      <Text>Square content</Text>
    </AspectRatio>
  );

  const container = screen.getByTestId("aspect-ratio");
  expect(container).toBeInTheDocument();
});

test("supports asChild", () => {
  render(
    <AspectRatio ratio="4:3" asChild>
      <div data-testid="custom-element">
        <Text>Custom element</Text>
      </div>
    </AspectRatio>
  );

  const customElement = screen.getByTestId("custom-element");
  expect(customElement).toBeInTheDocument();
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
  
  render(
    <AspectRatio ratio="invalid" testID="aspect-ratio">
      <Text>Content</Text>
    </AspectRatio>
  );

  const container = screen.getByTestId("aspect-ratio");
  expect(container).toBeInTheDocument();
  expect(consoleSpy).toHaveBeenCalledWith(
    expect.stringContaining("Invalid aspect ratio")
  );
  
  consoleSpy.mockRestore();
});

test("parses different ratio formats", () => {
  const { rerender } = render(
    <AspectRatio ratio="16:9" testID="aspect-ratio">
      <Text>16:9</Text>
    </AspectRatio>
  );
  expect(screen.getByTestId("aspect-ratio")).toBeInTheDocument();

  rerender(
    <AspectRatio ratio="4/3" testID="aspect-ratio">
      <Text>4/3</Text>
    </AspectRatio>
  );
  expect(screen.getByTestId("aspect-ratio")).toBeInTheDocument();

  rerender(
    <AspectRatio ratio={1} testID="aspect-ratio">
      <Text>1:1</Text>
    </AspectRatio>
  );
  expect(screen.getByTestId("aspect-ratio")).toBeInTheDocument();
});
