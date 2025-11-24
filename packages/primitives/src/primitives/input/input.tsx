import * as React from "react";
import { TextInput, type TextInputProps, type TextInput as RNTextInput } from "react-native";
import { Slot } from "../slot";

export type InputProps = TextInputProps & {
  /**
   * Replace the host element by cloning the child.
   * Useful to avoid extra wrappers or to render semantic elements on web.
   */
  asChild?: boolean;
};

/**
 * Cross-platform Input primitive for text inputs.
 *
 * - Wraps React Native's `TextInput` with identical API.
 * - Adds optional `asChild` prop to render another component
 *   without an extra wrapper.
 * - Compatible with React Hook Form and native forms.
 * - Default `role` is "textbox" on web.
 */
const Input = React.forwardRef<RNTextInput, InputProps>((props, ref) => {
  const { asChild, ...rest } = props;
  const Comp: any = asChild ? Slot : TextInput;
  
  // Input already supports id via TextInputProps, so we just pass it through
  return <Comp ref={ref} role="textbox" {...rest} />;
});

Input.displayName = "Input";

export { Input };

