import * as React from "react";
import { type TextProps } from "react-native";
import { Text } from "../text";

export type FieldDescriptionProps = TextProps;

/**
 * Helper text component for form fields.
 * Provides additional context or instructions for the field.
 */
const FieldDescription = React.forwardRef<any, FieldDescriptionProps>((props, ref) => {
  const { style, ...rest } = props;
  
  const descriptionStyle = React.useMemo(() => {
    const baseStyle = {
      fontSize: 14,
      color: "#666",
    };
    return [baseStyle, style];
  }, [style]);
  
  return (
    <Text ref={ref} style={descriptionStyle} {...rest} />
  );
});

FieldDescription.displayName = "FieldDescription";

export { FieldDescription };

