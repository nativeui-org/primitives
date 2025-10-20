import React from "react";
import { render, screen } from "@testing-library/react";
import { Avatar } from "../avatar";

test("renders with image", () => {
  render(
    <Avatar 
      src="https://example.com/avatar.jpg" 
      fallback="JD" 
      testID="avatar"
    />
  );

  const avatar = screen.getByTestId("avatar");
  expect(avatar).toBeInTheDocument();
});

test("renders fallback when no image", () => {
  render(
    <Avatar fallback="AB" testID="avatar" />
  );

  const avatar = screen.getByTestId("avatar");
  expect(avatar).toBeInTheDocument();
  expect(avatar).toHaveTextContent("AB");
});

test("renders question mark when no fallback", () => {
  render(
    <Avatar testID="avatar" />
  );

  const avatar = screen.getByTestId("avatar");
  expect(avatar).toBeInTheDocument();
  expect(avatar).toHaveTextContent("?");
});

test("supports different sizes", () => {
  const { rerender } = render(
    <Avatar size="sm" testID="avatar" />
  );
  expect(screen.getByTestId("avatar")).toBeInTheDocument();

  rerender(<Avatar size="lg" testID="avatar" />);
  expect(screen.getByTestId("avatar")).toBeInTheDocument();

  rerender(<Avatar size={80} testID="avatar" />);
  expect(screen.getByTestId("avatar")).toBeInTheDocument();
});

test("supports different shapes", () => {
  const { rerender } = render(
    <Avatar shape="circle" testID="avatar" />
  );
  expect(screen.getByTestId("avatar")).toBeInTheDocument();

  rerender(<Avatar shape="square" testID="avatar" />);
  expect(screen.getByTestId("avatar")).toBeInTheDocument();
});

test("supports asChild", () => {
  render(
    <Avatar asChild>
      <div data-testid="custom-element">
        Custom content
      </div>
    </Avatar>
  );

  const customElement = screen.getByTestId("custom-element");
  expect(customElement).toBeInTheDocument();
});

test("forwards ref", () => {
  const ref = React.createRef<any>();
  
  render(
    <Avatar ref={ref} testID="avatar">
      Content
    </Avatar>
  );

  expect(ref.current).toBeTruthy();
});
