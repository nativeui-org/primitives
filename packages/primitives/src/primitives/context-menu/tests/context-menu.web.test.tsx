import * as React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "../context-menu";
import { View, Text } from "../../view";

// Mock Portal for testing
jest.mock("../../portal", () => ({
  Portal: ({ children }: { children: React.ReactNode }) => <div data-testid="portal">{children}</div>,
}));

describe("ContextMenu (Web)", () => {
  beforeEach(() => {
    // Mock window.innerWidth and innerHeight
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  it("renders trigger and content", () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger testID="trigger">
          <Text>Right-click me</Text>
        </ContextMenuTrigger>
        <ContextMenuContent testID="content">
          <ContextMenuItem testID="item">
            <Text>Menu Item</Text>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    expect(screen.getByTestId("trigger")).toBeInTheDocument();
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
  });

  it("opens context menu on right-click", () => {
    const onOpenChange = jest.fn();
    
    render(
      <ContextMenu onOpenChange={onOpenChange}>
        <ContextMenuTrigger testID="trigger">
          <Text>Right-click me</Text>
        </ContextMenuTrigger>
        <ContextMenuContent testID="content">
          <ContextMenuItem testID="item">
            <Text>Menu Item</Text>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const trigger = screen.getByTestId("trigger");
    fireEvent.contextMenu(trigger);

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("closes context menu on escape key", () => {
    const onOpenChange = jest.fn();
    
    render(
      <ContextMenu open={true} onOpenChange={onOpenChange}>
        <ContextMenuTrigger testID="trigger">
          <Text>Right-click me</Text>
        </ContextMenuTrigger>
        <ContextMenuContent testID="content">
          <ContextMenuItem testID="item">
            <Text>Menu Item</Text>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes context menu when clicking outside", () => {
    const onOpenChange = jest.fn();
    
    render(
      <div>
        <ContextMenu open={true} onOpenChange={onOpenChange}>
          <ContextMenuTrigger testID="trigger">
            <Text>Right-click me</Text>
          </ContextMenuTrigger>
          <ContextMenuContent testID="content">
            <ContextMenuItem testID="item">
              <Text>Menu Item</Text>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        <div data-testid="outside">Outside element</div>
      </div>
    );

    const outside = screen.getByTestId("outside");
    fireEvent.mouseDown(outside);
    
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("handles menu item press", () => {
    const onPress = jest.fn();
    const onOpenChange = jest.fn();
    
    render(
      <ContextMenu open={true} onOpenChange={onOpenChange}>
        <ContextMenuTrigger testID="trigger">
          <Text>Right-click me</Text>
        </ContextMenuTrigger>
        <ContextMenuContent testID="content">
          <ContextMenuItem testID="item" onPress={onPress}>
            <Text>Menu Item</Text>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const item = screen.getByTestId("item");
    fireEvent.click(item);
    
    expect(onPress).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("handles keyboard navigation on menu item", () => {
    const onPress = jest.fn();
    
    render(
      <ContextMenu open={true}>
        <ContextMenuTrigger testID="trigger">
          <Text>Right-click me</Text>
        </ContextMenuTrigger>
        <ContextMenuContent testID="content">
          <ContextMenuItem testID="item" onPress={onPress}>
            <Text>Menu Item</Text>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const item = screen.getByTestId("item");
    fireEvent.keyDown(item, { key: "Enter" });
    
    expect(onPress).toHaveBeenCalled();
  });

  it("disables menu item when disabled prop is true", () => {
    const onPress = jest.fn();
    
    render(
      <ContextMenu open={true}>
        <ContextMenuTrigger testID="trigger">
          <Text>Right-click me</Text>
        </ContextMenuTrigger>
        <ContextMenuContent testID="content">
          <ContextMenuItem testID="item" disabled onPress={onPress}>
            <Text>Disabled Item</Text>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const item = screen.getByTestId("item");
    fireEvent.click(item);
    
    expect(onPress).not.toHaveBeenCalled();
  });

  it("renders separator", () => {
    render(
      <ContextMenu open={true}>
        <ContextMenuTrigger testID="trigger">
          <Text>Right-click me</Text>
        </ContextMenuTrigger>
        <ContextMenuContent testID="content">
          <ContextMenuItem testID="item1">
            <Text>Item 1</Text>
          </ContextMenuItem>
          <ContextMenuSeparator testID="separator" />
          <ContextMenuItem testID="item2">
            <Text>Item 2</Text>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    expect(screen.getByTestId("separator")).toBeInTheDocument();
  });

  it("supports destructive menu items", () => {
    render(
      <ContextMenu open={true}>
        <ContextMenuTrigger testID="trigger">
          <Text>Right-click me</Text>
        </ContextMenuTrigger>
        <ContextMenuContent testID="content">
          <ContextMenuItem testID="item" destructive>
            <Text>Delete</Text>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const item = screen.getByTestId("item");
    expect(item).toHaveStyle({ color: "#dc2626" });
  });

  it("prevents context menu when trigger is disabled", () => {
    const onOpenChange = jest.fn();
    
    render(
      <ContextMenu onOpenChange={onOpenChange}>
        <ContextMenuTrigger testID="trigger" disabled>
          <Text>Right-click me</Text>
        </ContextMenuTrigger>
        <ContextMenuContent testID="content">
          <ContextMenuItem testID="item">
            <Text>Menu Item</Text>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const trigger = screen.getByTestId("trigger");
    fireEvent.contextMenu(trigger);

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("supports forceMount for content", () => {
    render(
      <ContextMenu open={false}>
        <ContextMenuTrigger testID="trigger">
          <Text>Right-click me</Text>
        </ContextMenuTrigger>
        <ContextMenuContent testID="content" forceMount>
          <ContextMenuItem testID="item">
            <Text>Menu Item</Text>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    expect(screen.getByTestId("content")).toBeInTheDocument();
  });
});
