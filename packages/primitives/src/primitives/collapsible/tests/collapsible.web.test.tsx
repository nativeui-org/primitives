import React, { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../collapsible";
import { Text } from "react-native";

test("renders collapsible components", () => {
  render(
    <Collapsible testID="root">
      <CollapsibleTrigger testID="trigger">
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent testID="content">
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  expect(screen.getByTestId("root")).toBeInTheDocument();
  expect(screen.getByTestId("trigger")).toBeInTheDocument();
});

test("content is hidden by default", () => {
  render(
    <Collapsible>
      <CollapsibleTrigger>
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent testID="content">
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  expect(screen.queryByTestId("content")).not.toBeInTheDocument();
});

test("content is visible when defaultOpen is true", () => {
  render(
    <Collapsible defaultOpen>
      <CollapsibleTrigger>
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent testID="content">
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  expect(screen.getByTestId("content")).toBeInTheDocument();
});

test("trigger toggles content visibility (uncontrolled)", () => {
  render(
    <Collapsible>
      <CollapsibleTrigger testID="trigger">
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent testID="content">
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  const trigger = screen.getByTestId("trigger");

  // Initially hidden
  expect(screen.queryByTestId("content")).not.toBeInTheDocument();

  // Click trigger
  fireEvent.click(trigger);
  expect(screen.getByTestId("content")).toBeInTheDocument();

  // Click again to hide
  fireEvent.click(trigger);
  expect(screen.queryByTestId("content")).not.toBeInTheDocument();
});

test("controlled mode with open prop", () => {
  const onOpenChange = jest.fn();
  const { rerender } = render(
    <Collapsible open={false} onOpenChange={onOpenChange}>
      <CollapsibleTrigger testID="trigger">
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent testID="content">
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  // Initially closed
  expect(screen.queryByTestId("content")).not.toBeInTheDocument();

  // Click trigger
  fireEvent.click(screen.getByTestId("trigger"));
  expect(onOpenChange).toHaveBeenCalledWith(true);

  // Rerender with open=true
  rerender(
    <Collapsible open={true} onOpenChange={onOpenChange}>
      <CollapsibleTrigger testID="trigger">
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent testID="content">
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  expect(screen.getByTestId("content")).toBeInTheDocument();
});

test("disabled state prevents toggling", () => {
  render(
    <Collapsible disabled>
      <CollapsibleTrigger testID="trigger">
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent testID="content">
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  fireEvent.click(screen.getByTestId("trigger"));
  expect(screen.queryByTestId("content")).not.toBeInTheDocument();
});

test("trigger can be individually disabled", () => {
  render(
    <Collapsible>
      <CollapsibleTrigger testID="trigger" disabled>
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent testID="content">
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  fireEvent.click(screen.getByTestId("trigger"));
  expect(screen.queryByTestId("content")).not.toBeInTheDocument();
});

test("forwards ref to root element", () => {
  const ref = createRef<HTMLDivElement>();
  const { container } = render(
    <Collapsible ref={ref}>
      <CollapsibleTrigger>
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  expect(ref.current).toBe(container.firstElementChild);
});

test("forwards ref to trigger element", () => {
  const ref = createRef<HTMLElement>();
  render(
    <Collapsible>
      <CollapsibleTrigger ref={ref}>
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  expect(ref.current).toBeInTheDocument();
});

test("forwards ref to content element", () => {
  const ref = createRef<HTMLDivElement>();
  render(
    <Collapsible defaultOpen>
      <CollapsibleTrigger>
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent ref={ref}>
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  expect(ref.current).toBeInTheDocument();
});

test("supports asChild on root", () => {
  render(
    <Collapsible asChild>
      <section data-testid="custom">
        <CollapsibleTrigger>
          <Text>Toggle</Text>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Text>Content</Text>
        </CollapsibleContent>
      </section>
    </Collapsible>
  );

  const element = screen.getByTestId("custom");
  expect(element.tagName).toBe("SECTION");
});

test("supports asChild on trigger", () => {
  render(
    <Collapsible>
      <CollapsibleTrigger asChild>
        <button data-testid="custom-trigger"><Text>Toggle</Text></button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  const trigger = screen.getByTestId("custom-trigger");
  expect(trigger.tagName).toBe("BUTTON");
});

test("supports asChild on content", () => {
  render(
    <Collapsible defaultOpen>
      <CollapsibleTrigger>
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent asChild>
        <article data-testid="custom-content"><Text>Content</Text></article>
      </CollapsibleContent>
    </Collapsible>
  );

  const content = screen.getByTestId("custom-content");
  expect(content.tagName).toBe("ARTICLE");
});

test("forceMount keeps content mounted when closed", () => {
  render(
    <Collapsible>
      <CollapsibleTrigger>
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent testID="content" forceMount>
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  const content = screen.getByTestId("content");
  expect(content).toBeInTheDocument();
  expect(content).toHaveStyle({ display: "none" });
});

test("trigger has correct ARIA attributes when closed", () => {
  render(
    <Collapsible>
      <CollapsibleTrigger testID="trigger">
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  const trigger = screen.getByTestId("trigger");
  expect(trigger).toHaveAttribute("role", "button");
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(trigger).toHaveAttribute("aria-controls");
  expect(trigger).toHaveAttribute("id");
});

test("trigger has correct ARIA attributes when open", () => {
  render(
    <Collapsible defaultOpen>
      <CollapsibleTrigger testID="trigger">
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent testID="content">
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  const trigger = screen.getByTestId("trigger");
  const content = screen.getByTestId("content");

  expect(trigger).toHaveAttribute("aria-expanded", "true");
  
  const contentId = content.getAttribute("id");
  const triggerId = trigger.getAttribute("id");
  
  expect(trigger).toHaveAttribute("aria-controls", contentId);
  expect(content).toHaveAttribute("aria-labelledby", triggerId);
});

test("content has correct ARIA attributes", () => {
  render(
    <Collapsible defaultOpen>
      <CollapsibleTrigger>
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent testID="content">
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  const content = screen.getByTestId("content");
  expect(content).toHaveAttribute("role", "region");
  expect(content).toHaveAttribute("id");
  expect(content).toHaveAttribute("aria-labelledby");
});

test("trigger and content IDs are properly associated", () => {
  render(
    <Collapsible defaultOpen>
      <CollapsibleTrigger testID="trigger">
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent testID="content">
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  const trigger = screen.getByTestId("trigger");
  const content = screen.getByTestId("content");

  const triggerId = trigger.getAttribute("id");
  const contentId = content.getAttribute("id");

  expect(trigger.getAttribute("aria-controls")).toBe(contentId);
  expect(content.getAttribute("aria-labelledby")).toBe(triggerId);
});

test("custom onPress handler is called", () => {
  const onPress = jest.fn();
  render(
    <Collapsible>
      <CollapsibleTrigger testID="trigger" onPress={onPress}>
        <Text>Toggle</Text>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Text>Content</Text>
      </CollapsibleContent>
    </Collapsible>
  );

  fireEvent.click(screen.getByTestId("trigger"));
  expect(onPress).toHaveBeenCalledTimes(1);
});

test("multiple collapsibles work independently", () => {
  render(
    <>
      <Collapsible>
        <CollapsibleTrigger testID="trigger1">
          <Text>Toggle 1</Text>
        </CollapsibleTrigger>
        <CollapsibleContent testID="content1">
          <Text>Content 1</Text>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible>
        <CollapsibleTrigger testID="trigger2">
          <Text>Toggle 2</Text>
        </CollapsibleTrigger>
        <CollapsibleContent testID="content2">
          <Text>Content 2</Text>
        </CollapsibleContent>
      </Collapsible>
    </>
  );

  // Open first
  fireEvent.click(screen.getByTestId("trigger1"));
  expect(screen.getByTestId("content1")).toBeInTheDocument();
  expect(screen.queryByTestId("content2")).not.toBeInTheDocument();

  // Open second
  fireEvent.click(screen.getByTestId("trigger2"));
  expect(screen.getByTestId("content1")).toBeInTheDocument();
  expect(screen.getByTestId("content2")).toBeInTheDocument();

  // Close first
  fireEvent.click(screen.getByTestId("trigger1"));
  expect(screen.queryByTestId("content1")).not.toBeInTheDocument();
  expect(screen.getByTestId("content2")).toBeInTheDocument();
});

test("throws error when trigger used outside Collapsible", () => {
  const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

  expect(() => {
    render(
      <CollapsibleTrigger>
        <Text>Toggle</Text>
      </CollapsibleTrigger>
    );
  }).toThrow("Collapsible components must be used within a Collapsible");

  consoleError.mockRestore();
});

test("throws error when content used outside Collapsible", () => {
  const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

  expect(() => {
    render(
      <CollapsibleContent>
        <Text>Content</Text>
      </CollapsibleContent>
    );
  }).toThrow("Collapsible components must be used within a Collapsible");

  consoleError.mockRestore();
});
