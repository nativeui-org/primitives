import * as React from "react";
import { View, type ViewProps } from "../view";
import { Text, type TextProps } from "../text";

export type FieldSeparatorProps = ViewProps & {
  /**
   * Optional text content to display in the separator.
   */
  children?: React.ReactNode;
};

/**
 * Visual divider to separate sections inside a FieldGroup.
 * Can include optional inline content (e.g., "Or continue with").
 */
const FieldSeparator = React.forwardRef<any, FieldSeparatorProps>((props, ref) => {
  const { children, style, ...rest } = props;
  
  const separatorStyle = React.useMemo(() => {
    return [
      {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: 12,
        marginVertical: 16,
      },
      style,
    ];
  }, [style]);
  
  const lineStyle = React.useMemo(() => {
    return {
      flex: 1,
      height: 1,
      backgroundColor: "#E5E5EA",
    };
  }, []);
  
  if (children) {
    return (
      <View ref={ref} style={separatorStyle} {...rest}>
        <View style={lineStyle} />
        <Text style={{ fontSize: 14, color: "#666" }}>{children}</Text>
        <View style={lineStyle} />
      </View>
    );
  }
  
  return (
    <View ref={ref} style={separatorStyle} {...rest}>
      <View style={lineStyle} />
    </View>
  );
});

FieldSeparator.displayName = "FieldSeparator";

export { FieldSeparator };

