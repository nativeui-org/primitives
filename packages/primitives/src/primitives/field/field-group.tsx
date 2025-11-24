import * as React from "react";
import { View, type ViewProps } from "../view";
import { FieldProvider } from "./field-context";

export type FieldGroupProps = ViewProps;

/**
 * Layout wrapper that stacks Field components.
 * Provides consistent spacing and enables container queries for responsive layouts.
 * Also provides FieldContext for label-control associations.
 */
const FieldGroup = React.forwardRef<any, FieldGroupProps>((props, ref) => {
  const { style, ...rest } = props;
  
  const groupStyle = React.useMemo(() => {
    return [
      {
        flexDirection: "column" as const,
        gap: 16,
      },
      style,
    ];
  }, [style]);
  
  return (
    <FieldProvider>
      <View ref={ref} style={groupStyle} {...rest} />
    </FieldProvider>
  );
});

FieldGroup.displayName = "FieldGroup";

export { FieldGroup };

