import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from "../alert-dialog";
import { Text } from "react-native";

test("renders AlertDialog when open", () => {
  render(
    <AlertDialog open>
      <AlertDialogOverlay>
        <AlertDialogContent testID="content">
          <AlertDialogTitle>
            <Text>Title</Text>
          </AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );

  expect(screen.getByTestId("content")).toBeInTheDocument();
});

test("hides AlertDialog when closed", () => {
  render(
    <AlertDialog open={false}>
      <AlertDialogOverlay>
        <AlertDialogContent testID="content">
          <AlertDialogTitle>
            <Text>Title</Text>
          </AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );

  expect(screen.queryByTestId("content")).not.toBeInTheDocument();
});

test("AlertDialogContent has correct ARIA attributes", () => {
  render(
    <AlertDialog open>
      <AlertDialogOverlay>
        <AlertDialogContent testID="content">
          <AlertDialogTitle>
            <Text>Title</Text>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <Text>Description</Text>
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );

  const content = screen.getByTestId("content");
  expect(content).toHaveAttribute("role", "alertdialog");
  expect(content).toHaveAttribute("aria-modal", "true");
  expect(content).toHaveAttribute("aria-labelledby");
  expect(content).toHaveAttribute("aria-describedby");
});

test("AlertDialogTitle has correct id", () => {
  render(
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogTitle testID="title">
          <Text>My Title</Text>
        </AlertDialogTitle>
      </AlertDialogContent>
    </AlertDialog>
  );

  const title = screen.getByTestId("title");
  expect(title).toHaveAttribute("id");
  expect(title.getAttribute("id")).toMatch(/alert-dialog-title-/);
});

test("AlertDialogDescription has correct id", () => {
  render(
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogDescription testID="description">
          <Text>My Description</Text>
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );

  const description = screen.getByTestId("description");
  expect(description).toHaveAttribute("id");
  expect(description.getAttribute("id")).toMatch(/alert-dialog-description-/);
});

test("forwards ref to root element", () => {
  const ref = createRef<any>();
  render(
    <AlertDialog open ref={ref}>
      <AlertDialogContent>
        <Text>Content</Text>
      </AlertDialogContent>
    </AlertDialog>
  );

  expect(ref.current).toBeTruthy();
});

test("forwards ref to content element", () => {
  const ref = createRef<any>();
  render(
    <AlertDialog open>
      <AlertDialogContent ref={ref}>
        <Text>Content</Text>
      </AlertDialogContent>
    </AlertDialog>
  );

  expect(ref.current).toBeTruthy();
});

test("supports asChild on content", () => {
  render(
    <AlertDialog open>
      <AlertDialogContent asChild>
        <article data-testid="custom">
          <Text>Content</Text>
        </article>
      </AlertDialogContent>
    </AlertDialog>
  );

  const content = screen.getByTestId("custom");
  expect(content.tagName).toBe("ARTICLE");
  expect(content).toHaveAttribute("role", "alertdialog");
});

test("throws error when components used outside AlertDialog", () => {
  const consoleError = jest.spyOn(console, "error").mockImplementation(() => { });

  expect(() => {
    render(
      <AlertDialogContent>
        <Text>Content</Text>
      </AlertDialogContent>
    );
  }).toThrow("AlertDialog components must be used within AlertDialog");

  consoleError.mockRestore();
});

