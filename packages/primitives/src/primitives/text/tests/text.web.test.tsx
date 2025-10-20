import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { Text } from "../text";

test("renders as Text by default", () => {
  render(<Text>Hello World</Text>);
  expect(screen.getByText("Hello World")).toBeInTheDocument();
});

test("forwards web a11y props", () => {
  render(<Text role="heading" aria-level="1">Main Title</Text>);
  const element = screen.getByRole("heading", { level: 1 });
  expect(element).toHaveAttribute("role", "heading");
  expect(element).toHaveAttribute("aria-level", "1");
});

test("renders as HTML element when as prop is provided", () => {
  render(<Text as="h1">Main Title</Text>);
  const element = screen.getByText("Main Title");
  expect(element.tagName).toBe("H1");
});

test("renders as different HTML elements", () => {
  const { rerender } = render(<Text as="p">Paragraph text</Text>);
  expect(screen.getByText("Paragraph text").tagName).toBe("P");
  
  rerender(<Text as="span">Span text</Text>);
  expect(screen.getByText("Span text").tagName).toBe("SPAN");
  
  rerender(<Text as="strong">Strong text</Text>);
  expect(screen.getByText("Strong text").tagName).toBe("STRONG");
});

test("asChild outputs child without wrapper", () => {
  const { container } = render(
    <Text asChild role="heading" aria-level="2">
      <h2>Custom Heading</h2>
    </Text>
  );
  const node = container.firstElementChild!;
  expect(node.tagName).toBe("H2");
  expect(node.getAttribute("role")).toBe("heading");
  expect(node.getAttribute("aria-level")).toBe("2");
});

test("forwards ref to the real DOM node", () => {
  const ref = createRef<HTMLElement>();
  const { container } = render(<Text ref={ref}>Hello</Text>);
  expect(ref.current).toBe(container.firstElementChild);
});

test("forwards ref when using as prop", () => {
  const ref = createRef<HTMLElement>();
  const { container } = render(<Text as="h1" ref={ref}>Title</Text>);
  expect(ref.current).toBe(container.firstElementChild);
});

test("forwards style and other props", () => {
  render(<Text style={{ fontSize: 18, color: "red" }} testID="text">Styled text</Text>);
  const element = screen.getByTestId("text");
  expect(element).toBeInTheDocument();
});
