import * as React from "react";
import { View, type ViewProps } from "../view";
import { Platform } from "react-native";

export type FieldProps = ViewProps & {
  /**
   * Orientation of the field layout.
   * - "vertical": Label above, control below (default)
   * - "horizontal": Label and control side by side
   * - "responsive": Adapts based on container queries
   */
  orientation?: "vertical" | "horizontal" | "responsive";
};

/**
 * Core wrapper for a single form field.
 * Provides orientation control and spacing for labels, controls, and helper text.
 */
const Field = React.forwardRef<any, FieldProps>((props, ref) => {
  const { orientation = "vertical", style, ...rest } = props;
  
  const fieldStyle = React.useMemo(() => {
    const baseStyle: any = {};
    
    if (orientation === "horizontal") {
      baseStyle.flexDirection = "row" as const;
      baseStyle.alignItems = "center";
      baseStyle.gap = 12;
    } else {
      baseStyle.flexDirection = "column" as const;
      baseStyle.gap = 4;
    }
    
    return [baseStyle, style];
  }, [orientation, style]);
  
  return <View ref={ref} style={fieldStyle} role="group" {...rest} />;
});

Field.displayName = "Field";

export { Field };

