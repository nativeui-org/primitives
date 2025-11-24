import React, { createRef } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { InputFile } from "../input-file";

// Mock FileReader
global.FileReader = class FileReader {
  result: string | null = null;
  onloadend: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;

  readAsDataURL(file: Blob) {
    setTimeout(() => {
      this.result = "data:image/jpeg;base64,/9j/4AAQSkZJRg==";
      if (this.onloadend) {
        this.onloadend(new ProgressEvent("loadend"));
      }
    }, 0);
  }
} as any;

// Mock document.createElement and methods
const mockClick = jest.fn();
const mockFileInput = {
  type: "file",
  accept: "",
  multiple: false,
  style: { display: "none" },
  click: mockClick,
  onchange: null as any,
  files: null as FileList | null,
};

const originalCreateElement = document.createElement;
document.createElement = jest.fn((tagName: string) => {
  if (tagName === "input") {
    return mockFileInput as any;
  }
  return originalCreateElement.call(document, tagName);
}) as any;

test("renders button by default", () => {
  render(<InputFile placeholder="Select file" />);
  expect(screen.getByText("Select file")).toBeInTheDocument();
});

test("forwards common props (style, testID)", () => {
  render(<InputFile testID="input-file" style={{ marginTop: 10 }} />);
  expect(screen.getByTestId("input-file")).toBeInTheDocument();
});

test("handles onFileSelect callback on web", async () => {
  const onFileSelect = jest.fn();
  render(<InputFile onFileSelect={onFileSelect} placeholder="Select" />);
  
  const button = screen.getByText("Select");
  fireEvent.click(button);
  
  // Simulate file selection
  const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
  const fileList = {
    0: file,
    length: 1,
    item: (index: number) => (index === 0 ? file : null),
    [Symbol.iterator]: function* () {
      yield file;
    },
  } as FileList;
  
  mockFileInput.files = fileList;
  if (mockFileInput.onchange) {
    mockFileInput.onchange(new Event("change") as any);
  }
  
  await waitFor(() => {
    expect(onFileSelect).toHaveBeenCalled();
  });
});

test("displays preview when value is provided", () => {
  render(<InputFile value="data:image/jpeg;base64,/9j/4AAQSkZJRg==" />);
  
  const img = document.querySelector("img");
  expect(img).toBeInTheDocument();
});

test("displays 'Change' text when file is selected", () => {
  render(<InputFile value="data:image/jpeg;base64,/9j/4AAQSkZJRg==" />);
  
  expect(screen.getByText("Change")).toBeInTheDocument();
});

test("handles placeholder prop", () => {
  render(<InputFile placeholder="Choose image" />);
  
  expect(screen.getByText("Choose image")).toBeInTheDocument();
});

test("handles accept prop (web only)", () => {
  render(<InputFile accept="image/*" placeholder="Select" />);
  
  const button = screen.getByText("Select");
  fireEvent.click(button);
  
  expect(mockFileInput.accept).toBe("image/*");
});

test("handles multiple prop (web only)", () => {
  render(<InputFile multiple placeholder="Select" />);
  
  const button = screen.getByText("Select");
  fireEvent.click(button);
  
  expect(mockFileInput.multiple).toBe(true);
});

test("asChild renders child without wrapper", () => {
  const onFileSelect = jest.fn();
  const { container } = render(
    <InputFile asChild onFileSelect={onFileSelect}>
      <div data-testid="child-view" />
    </InputFile>
  );
  
  const child = container.querySelector('[data-testid="child-view"]');
  expect(child).toBeInTheDocument();
});

test("forwards ref to underlying View", () => {
  const ref = createRef<HTMLDivElement>();
  const { container } = render(<InputFile ref={ref} testID="input-file" />);
  expect(ref.current).toBe(container.firstElementChild);
});

test("handles remove action", async () => {
  const onFileSelect = jest.fn();
  render(<InputFile value="data:image/jpeg;base64,/9j/4AAQSkZJRg==" onFileSelect={onFileSelect} />);
  
  const removeButton = screen.getByText("Remove");
  fireEvent.click(removeButton);
  
  await waitFor(() => {
    expect(onFileSelect).toHaveBeenCalledWith(null);
  });
});

test("creates file input with correct attributes", () => {
  render(<InputFile accept=".pdf,.doc" multiple placeholder="Select" />);
  
  const button = screen.getByText("Select");
  fireEvent.click(button);
  
  expect(mockFileInput.accept).toBe(".pdf,.doc");
  expect(mockFileInput.multiple).toBe(true);
});

