import React, { createRef } from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { View } from "react-native";
import { InputFile } from "../input-file";

// Mock expo-image-picker
jest.mock("expo-image-picker", () => ({
  MediaType: {
    Images: "images",
    Videos: "videos",
    All: "all",
  },
  requestMediaLibraryPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted" })
  ),
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [{ uri: "file:///test-image.jpg" }],
    })
  ),
}));

test("renders button by default", () => {
  const { getByText } = render(
    <InputFile placeholder="Select file" />
  );
  expect(getByText("Select file")).toBeTruthy();
});

test("forwards common props (style, testID)", () => {
  const { getByTestId } = render(
    <InputFile testID="input-file" style={{ marginTop: 10 }} />
  );
  expect(getByTestId("input-file")).toBeTruthy();
});

test("handles onFileSelect callback", async () => {
  const onFileSelect = jest.fn();
  const { getByText } = render(
    <InputFile onFileSelect={onFileSelect} placeholder="Select" />
  );
  
  const button = getByText("Select");
  fireEvent.press(button);
  
  // Wait for async operation
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  // onFileSelect should be called with the URI
  expect(onFileSelect).toHaveBeenCalled();
});

test("displays preview when value is provided", () => {
  const { getByTestId } = render(
    <InputFile value="file:///test-image.jpg" testID="input-file" />
  );
  
  const container = getByTestId("input-file");
  expect(container).toBeTruthy();
});

test("displays 'Change' text when file is selected", () => {
  const { getByText } = render(
    <InputFile value="file:///test-image.jpg" />
  );
  
  expect(getByText("Change")).toBeTruthy();
});

test("handles placeholder prop", () => {
  const { getByText } = render(
    <InputFile placeholder="Choose image" />
  );
  
  expect(getByText("Choose image")).toBeTruthy();
});

test("handles mediaTypes prop", () => {
  const { getByText } = render(
    <InputFile mediaTypes="videos" placeholder="Select" />
  );
  
  expect(getByText("Select")).toBeTruthy();
});

test("handles allowsEditing prop", () => {
  const { getByText } = render(
    <InputFile allowsEditing={false} placeholder="Select" />
  );
  
  expect(getByText("Select")).toBeTruthy();
});

test("handles aspect prop", () => {
  const { getByText } = render(
    <InputFile aspect={[16, 9]} placeholder="Select" />
  );
  
  expect(getByText("Select")).toBeTruthy();
});

test("handles quality prop", () => {
  const { getByText } = render(
    <InputFile quality={0.5} placeholder="Select" />
  );
  
  expect(getByText("Select")).toBeTruthy();
});

test("asChild renders child without wrapper", () => {
  const onFileSelect = jest.fn();
  const { getByTestId } = render(
    <InputFile asChild onFileSelect={onFileSelect}>
      <View testID="child-view" />
    </InputFile>
  );
  
  const child = getByTestId("child-view");
  expect(child).toBeTruthy();
});

test("forwards ref to underlying View", () => {
  const ref = createRef<any>();
  render(<InputFile ref={ref} testID="input-file" />);
  expect(ref.current).toBeTruthy();
});

test("handles remove action", () => {
  const onFileSelect = jest.fn();
  const { getByText } = render(
    <InputFile value="file:///test.jpg" onFileSelect={onFileSelect} />
  );
  
  const removeButton = getByText("Remove");
  fireEvent.press(removeButton);
  
  expect(onFileSelect).toHaveBeenCalledWith(null);
});

