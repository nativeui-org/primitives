import * as React from "react";
import { type TextProps } from "react-native";
import { Text } from "../text";
import { View } from "../view";

export type FieldErrorProps = TextProps & {
  /**
   * Array of error objects with optional message property.
   * Useful for React Hook Form or other validation libraries.
   */
  errors?: Array<{ message?: string } | undefined>;
};

/**
 * Error message component for form fields.
 * Displays validation errors, either from children or errors array.
 */
const FieldError = React.forwardRef<any, FieldErrorProps>((props, ref) => {
  const { errors, children, style, ...rest } = props;
  
  const errorStyle = React.useMemo(() => {
    return [
      {
        fontSize: 14,
        color: "#FF3B30",
      },
      style,
    ];
  }, [style]);
  
  // If errors array is provided, render list of errors
  if (errors && errors.length > 0) {
    const errorMessages = errors
      .filter((e) => e?.message)
      .map((e) => e!.message!);
    
    if (errorMessages.length === 0) {
      return null;
    }
    
    if (errorMessages.length === 1) {
      return (
        <Text ref={ref} style={errorStyle} {...rest}>
          {errorMessages[0]}
        </Text>
      );
    }
    
    return (
      <View>
        {errorMessages.map((message) => (
          <Text key={message} style={errorStyle} {...rest}>
            {message}
          </Text>
        ))}
      </View>
    );
  }
  
  // Otherwise render children
  if (!children) {
    return null;
  }
  
  return (
    <Text ref={ref} style={errorStyle} {...rest}>
      {children}
    </Text>
  );
});

FieldError.displayName = "FieldError";

export { FieldError };

