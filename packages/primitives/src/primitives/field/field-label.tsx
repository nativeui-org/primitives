import * as React from "react";
import { Platform, type TextProps } from "react-native";
import { Text } from "../text";
import { Slot } from "../slot";
import { useFieldContext } from "./field-context";

export type FieldLabelProps = TextProps & {
  /**
   * The ID of the input this label is associated with.
   * On web, this creates a native label-input association.
   * On mobile, this triggers the associated control when the label is pressed.
   */
  htmlFor?: string;
  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;
};

/**
 * Label component for form fields.
 * Renders as a semantic <label> on web for proper form association.
 * On mobile, can trigger associated controls when pressed.
 */
const FieldLabel = React.forwardRef<any, FieldLabelProps>((props, ref) => {
  const { htmlFor, asChild, children, style, onPress, ...rest } = props;
  const { triggerControl } = useFieldContext();

  const handlePress = React.useCallback(
    (e: any) => {
      // On mobile, trigger the associated control if htmlFor is provided
      if (htmlFor && Platform.OS !== "web") {
        triggerControl(htmlFor);
      }
      // Call custom onPress if provided
      onPress?.(e);
    },
    [htmlFor, triggerControl, onPress]
  );

  if (asChild) {
    const Comp: any = Slot;
    return <Comp ref={ref} {...rest}>{children}</Comp>;
  }

  if (Platform.OS === "web") {
    return (
      <label
        htmlFor={htmlFor}
        style={{
          cursor: htmlFor ? "pointer" : "default",
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

  // On mobile, make label pressable if htmlFor is provided
  if (htmlFor) {
    return (
      <Text
        ref={ref}
        style={[{ cursor: "pointer" }, style]}
        onPress={handlePress}
        {...rest}
      >
        {children}
      </Text>
    );
  }

  return (
    <Text ref={ref} style={style} {...rest}>
      {children}
    </Text>
  );
});

FieldLabel.displayName = "FieldLabel";

export { FieldLabel };

