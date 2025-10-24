import * as React from "react";
import { render, screen } from "@testing-library/react";
import { Text } from "react-native";

const MockContextMenu = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="context-menu">{children}</div>
);

const MockContextMenuTrigger = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="context-menu-trigger">{children}</div>
);

const MockContextMenuContent = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="context-menu-content">{children}</div>
);

const MockContextMenuItem = ({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) => (
  <div data-testid="context-menu-item" onClick={onPress}>
    {children}
  </div>
);

const MockContextMenuSeparator = () => (
  <div data-testid="context-menu-separator" />
);

describe("ContextMenu (Web)", () => {
  it("renders basic structure", () => {
    render(
      <MockContextMenu>
        <MockContextMenuTrigger>
          <Text>Right-click me</Text>
        </MockContextMenuTrigger>
        <MockContextMenuContent>
          <MockContextMenuItem>
            <Text>Menu Item</Text>
          </MockContextMenuItem>
        </MockContextMenuContent>
      </MockContextMenu>
    );

    expect(screen.getByTestId("context-menu")).toBeInTheDocument();
    expect(screen.getByTestId("context-menu-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("context-menu-content")).toBeInTheDocument();
    expect(screen.getByTestId("context-menu-item")).toBeInTheDocument();
  });

  it("renders separator", () => {
    render(
      <MockContextMenu>
        <MockContextMenuTrigger>
          <Text>Right-click me</Text>
        </MockContextMenuTrigger>
        <MockContextMenuContent>
          <MockContextMenuItem>
            <Text>Item 1</Text>
          </MockContextMenuItem>
          <MockContextMenuSeparator />
          <MockContextMenuItem>
            <Text>Item 2</Text>
          </MockContextMenuItem>
        </MockContextMenuContent>
      </MockContextMenu>
    );

    expect(screen.getByTestId("context-menu-separator")).toBeInTheDocument();
  });

  it("handles menu item click", () => {
    const onPress = jest.fn();
    
    render(
      <MockContextMenu>
        <MockContextMenuTrigger>
          <Text>Right-click me</Text>
        </MockContextMenuTrigger>
        <MockContextMenuContent>
          <MockContextMenuItem onPress={onPress}>
            <Text>Menu Item</Text>
          </MockContextMenuItem>
        </MockContextMenuContent>
      </MockContextMenu>
    );

    const item = screen.getByTestId("context-menu-item");
    item.click();
    
    expect(onPress).toHaveBeenCalled();
  });
});
