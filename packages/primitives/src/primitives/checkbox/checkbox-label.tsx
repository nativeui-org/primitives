import * as React from "react";
import { Pressable, Platform, type TextProps } from "react-native";
import { Text } from "../text";

export type CheckboxLabelProps = TextProps & {
  /**
   * The ID of the checkbox this label is associated with.
   */
  htmlFor: string;
};

/**
 * CheckboxLabel component for labeling checkboxes with clickable text.
 * 
 * @example
 * // Basic usage
 * <Checkbox id="terms" checked={agreed} onCheckedChange={setAgreed} />
 * <CheckboxLabel htmlFor="terms">I agree to terms</CheckboxLabel>
 */
export const CheckboxLabel = React.forwardRef<any, CheckboxLabelProps>((props, ref) => {
  const { htmlFor, children, style, ...rest } = props;

  if (Platform.OS === "web") {
    return (
      <label 
        htmlFor={htmlFor} 
        style={{ 
          cursor: "pointer",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        <Text ref={ref} style={style} {...rest}>
          {children}
        </Text>
      </label>
    );
  }

  return (
    <Text ref={ref} style={style} {...rest}>
      {children}
    </Text>
  );
});

CheckboxLabel.displayName = "CheckboxLabel";