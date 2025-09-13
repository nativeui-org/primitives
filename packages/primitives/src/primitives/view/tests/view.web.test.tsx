import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { View } from "../view";

test("forwards web a11y props", () => {
  render(<View role="region" aria-label="Hero" />);
  expect(screen.getByLabelText("Hero")).toHaveAttribute("role", "region");
});

test("asChild outputs child without wrapper", () => {
  const { container } = render(
    <View asChild role="region" aria-label="Sidebar">
      <section />
    </View>
  );
  const node = container.firstElementChild!;
  expect(node.tagName).toBe("SECTION");
  expect(node.getAttribute("role")).toBe("region");
  expect(node.getAttribute("aria-label")).toBe("Sidebar");
});

test("forwards ref to the real DOM node", () => {
  const ref = createRef<HTMLElement>();
  const { container } = render(<View ref={ref} />);
  expect(ref.current).toBe(container.firstElementChild);
});
