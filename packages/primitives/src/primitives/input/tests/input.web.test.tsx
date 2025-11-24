import React, { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "../input";

test("renders as input by default", () => {
  render(<Input placeholder="Enter text" />);
  const input = screen.getByPlaceholderText("Enter text");
  expect(input).toBeInTheDocument();
  expect(input.tagName.toLowerCase()).toBe("input");
});

test("has correct role attribute", () => {
  render(<Input placeholder="Enter text" />);
  const input = screen.getByPlaceholderText("Enter text");
  expect(input).toHaveAttribute("role", "textbox");
});

test("forwards common props (style, placeholder)", () => {
  render(
    <Input 
      testID="input" 
      placeholder="Enter your name"
      style={{ fontSize: 16 }}
    />
  );
  const input = screen.getByPlaceholderText("Enter your name");
  expect(input).toBeInTheDocument();
});

test("handles onChangeText", () => {
  const onChangeText = jest.fn();
  render(<Input onChangeText={onChangeText} placeholder="Test" />);
  
  const input = screen.getByPlaceholderText("Test");
  fireEvent.change(input, { target: { value: "Hello" } });
  
  // onChangeText is called with the new value
  expect(onChangeText).toHaveBeenCalled();
});

test("handles value prop (controlled)", () => {
  const { rerender } = render(
    <Input value="initial" placeholder="Test" />
  );
  
  let input = screen.getByPlaceholderText("Test") as HTMLInputElement;
  expect(input.value).toBe("initial");
  
  rerender(<Input value="updated" placeholder="Test" />);
  input = screen.getByPlaceholderText("Test") as HTMLInputElement;
  expect(input.value).toBe("updated");
});

test("handles defaultValue prop (uncontrolled)", () => {
  render(<Input defaultValue="default" placeholder="Test" />);
  
  const input = screen.getByPlaceholderText("Test") as HTMLInputElement;
  expect(input.defaultValue).toBe("default");
});

test("asChild outputs child without wrapper", () => {
  const { container } = render(
    <Input asChild role="textbox">
      <input type="text" placeholder="Custom input" />
    </Input>
  );
  
  const input = container.querySelector('input[placeholder="Custom input"]');
  expect(input).toBeInTheDocument();
  expect(input).toHaveAttribute("role", "textbox");
});

test("forwards ref to the real DOM node", () => {
  const ref = createRef<HTMLInputElement>();
  const { container } = render(<Input ref={ref} placeholder="Test" />);
  expect(ref.current).toBe(container.querySelector("input"));
});

test("handles multiline prop (renders as textarea)", () => {
  render(<Input multiline numberOfLines={4} placeholder="Message" />);
  const textarea = screen.getByPlaceholderText("Message");
  expect(textarea.tagName.toLowerCase()).toBe("textarea");
});

test("handles type prop for password", () => {
  render(<Input secureTextEntry placeholder="Password" />);
  const input = screen.getByPlaceholderText("Password") as HTMLInputElement;
  expect(input.type).toBe("password");
});

test("handles keyboardType prop (maps to input type)", () => {
  const { rerender } = render(
    <Input keyboardType="email-address" placeholder="Email" />
  );
  let input = screen.getByPlaceholderText("Email") as HTMLInputElement;
  expect(input.type).toBe("email");
  
  rerender(<Input keyboardType="numeric" placeholder="Number" />);
  input = screen.getByPlaceholderText("Number") as HTMLInputElement;
  expect(input.type).toBe("number");
});

test("handles disabled prop", () => {
  render(<Input editable={false} placeholder="Disabled" />);
  const input = screen.getByPlaceholderText("Disabled") as HTMLInputElement;
  expect(input.disabled).toBe(true);
});

