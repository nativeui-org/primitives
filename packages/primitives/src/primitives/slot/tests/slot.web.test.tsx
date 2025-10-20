import React, { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Slot } from "../slot";

test("renders child element without wrapper", () => {
  const { container } = render(
    <Slot data-testid="slot">
      <div data-testid="child">Content</div>
    </Slot>
  );
  
  const child = screen.getByTestId("child");
  expect(child.tagName).toBe("DIV");
  expect(container.firstElementChild).toBe(child);
});

test("merges props from parent to child", () => {
  render(
    <Slot role="region" aria-label="Merged label">
      <section data-testid="child">Content</section>
    </Slot>
  );
  
  const child = screen.getByTestId("child");
  expect(child).toHaveAttribute("role", "region");
  expect(child).toHaveAttribute("aria-label", "Merged label");
});

test("child props take precedence over parent props", () => {
  render(
    <Slot data-testid="parent" aria-label="Parent label">
      <div data-testid="child" aria-label="Child label">Content</div>
    </Slot>
  );
  
  const child = screen.getByTestId("child");
  expect(child).toHaveAttribute("data-testid", "child");
  expect(child).toHaveAttribute("aria-label", "Child label");
});

test("composes event handlers (child first, then parent)", () => {
  const callOrder: string[] = [];
  const childHandler = jest.fn(() => callOrder.push('child'));
  const parentHandler = jest.fn(() => callOrder.push('parent'));

  render(
    <Slot onClick={parentHandler}>
      <button data-testid="button" onClick={childHandler}>
        Click me
      </button>
    </Slot>
  );

  const button = screen.getByTestId("button");
  fireEvent.click(button);

  expect(childHandler).toHaveBeenCalledTimes(1);
  expect(parentHandler).toHaveBeenCalledTimes(1);
  expect(callOrder).toEqual(['child', 'parent']);
});

test("parent handler runs even if child has no handler", () => {
  const parentHandler = jest.fn();

  render(
    <Slot onClick={parentHandler}>
      <button data-testid="button">Click me</button>
    </Slot>
  );

  const button = screen.getByTestId("button");
  fireEvent.click(button);

  expect(parentHandler).toHaveBeenCalledTimes(1);
});

test("forwards ref to child DOM element", () => {
  const ref = createRef<HTMLDivElement>();
  
  const { container } = render(
    <Slot ref={ref}>
      <div data-testid="child">Content</div>
    </Slot>
  );

  expect(ref.current).toBe(container.firstElementChild);
});

test("composes refs (both parent and child refs work)", () => {
  const parentRef = createRef<HTMLDivElement>();
  const childRef = createRef<HTMLDivElement>();

  const { container } = render(
    <Slot ref={parentRef}>
      <div ref={childRef} data-testid="child">Content</div>
    </Slot>
  );

  expect(parentRef.current).toBeTruthy();
  expect(childRef.current).toBeTruthy();
  expect(parentRef.current).toBe(childRef.current);
  expect(parentRef.current).toBe(container.firstElementChild);
});

test("works with callback refs", () => {
  let parentNode: HTMLElement | null = null;
  let childNode: HTMLElement | null = null;

  render(
    <Slot ref={(node) => (parentNode = node)}>
      <div ref={(node) => (childNode = node)} data-testid="child">Content</div>
    </Slot>
  );

  expect(parentNode).toBeTruthy();
  expect(childNode).toBeTruthy();
  expect(parentNode).toBe(childNode);
});

test("returns null for invalid children (text node)", () => {
  const { container } = render(
    <Slot>
      Hello world
    </Slot>
  );
  expect(container.firstChild).toBeNull();
});

test("returns null for multiple children", () => {
  // When there are multiple children, Slot returns null
  // We need to wrap in a try-catch since React.Children.only throws
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  
  const { container } = render(
    <Slot>
      <div>First</div>
      <div>Second</div>
    </Slot>
  );
  
  expect(container.firstChild).toBeNull();
  consoleError.mockRestore();
});

test("returns null for null/undefined children", () => {
  const { container: c1 } = render(<Slot>{null}</Slot>);
  const { container: c2 } = render(<Slot>{undefined}</Slot>);
  
  expect(c1.firstChild).toBeNull();
  expect(c2.firstChild).toBeNull();
});

test("works with semantic HTML elements", () => {
  render(
    <Slot role="banner" aria-label="Site header">
      <header data-testid="header">
        <h1>My Site</h1>
      </header>
    </Slot>
  );
  
  const header = screen.getByTestId("header");
  expect(header.tagName).toBe("HEADER");
  expect(header).toHaveAttribute("role", "banner");
  expect(header).toHaveAttribute("aria-label", "Site header");
});

test("merges className correctly (child takes precedence)", () => {
  render(
    <Slot className="parent-class">
      <div data-testid="child" className="child-class">Content</div>
    </Slot>
  );
  
  const child = screen.getByTestId("child");
  expect(child).toHaveClass("child-class");
  expect(child).not.toHaveClass("parent-class");
});

test("merges style prop correctly (child takes precedence)", () => {
  render(
    <Slot style={{ padding: "16px", margin: "8px" }}>
      <div data-testid="child" style={{ padding: "24px" }}>Content</div>
    </Slot>
  );
  
  const child = screen.getByTestId("child");
  expect(child).toHaveStyle({ padding: "24px" });
});

test("injects props that child doesn't have", () => {
  render(
    <Slot tabIndex={0} aria-hidden="false">
      <div data-testid="child">Content</div>
    </Slot>
  );
  
  const child = screen.getByTestId("child");
  expect(child).toHaveAttribute("tabindex", "0");
  expect(child).toHaveAttribute("aria-hidden", "false");
});

test("handles complex event handler composition with event objects", () => {
  const childHandler = jest.fn((e) => e);
  const parentHandler = jest.fn((e) => e);

  render(
    <Slot onClick={parentHandler}>
      <button data-testid="button" onClick={childHandler}>
        Click me
      </button>
    </Slot>
  );

  const button = screen.getByTestId("button");
  fireEvent.click(button);

  expect(childHandler).toHaveBeenCalledTimes(1);
  expect(parentHandler).toHaveBeenCalledTimes(1);
  
  const childEvent = childHandler.mock.calls[0][0];
  const parentEvent = parentHandler.mock.calls[0][0];
  expect(childEvent).toBe(parentEvent);
});

test("composes multiple event handlers", () => {
  const handlers = {
    childClick: jest.fn(),
    parentClick: jest.fn(),
    childMouseEnter: jest.fn(),
    parentMouseEnter: jest.fn(),
  };

  render(
    <Slot onClick={handlers.parentClick} onMouseEnter={handlers.parentMouseEnter}>
      <button 
        data-testid="button" 
        onClick={handlers.childClick}
        onMouseEnter={handlers.childMouseEnter}
      >
        Hover and click me
      </button>
    </Slot>
  );

  const button = screen.getByTestId("button");
  
  fireEvent.mouseEnter(button);
  expect(handlers.childMouseEnter).toHaveBeenCalledTimes(1);
  expect(handlers.parentMouseEnter).toHaveBeenCalledTimes(1);
  
  fireEvent.click(button);
  expect(handlers.childClick).toHaveBeenCalledTimes(1);
  expect(handlers.parentClick).toHaveBeenCalledTimes(1);
});

test("works with Fragment (but ref is ignored)", () => {
  const ref = createRef<any>();
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  
  const { container } = render(
    <Slot ref={ref} data-custom="test">
      <React.Fragment>
        <div>Content</div>
      </React.Fragment>
    </Slot>
  );

  // Fragment is rendered but ref is not attached (fragments don't support refs)
  expect(container.firstElementChild?.textContent).toBe("Content");
  // Note: ref.current will be undefined because Fragments don't accept refs
  
  consoleError.mockRestore();
});

