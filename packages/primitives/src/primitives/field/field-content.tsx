import * as React from "react";
import { View, type ViewProps } from "../view";

export type FieldContentProps = ViewProps;

/**
 * Flex column that groups label and description when the label sits beside the control.
 * Not required if you have no description.
 */
const FieldContent = React.forwardRef<any, FieldContentProps>((props, ref) => {
  const { style, ...rest } = props;
  
  const contentStyle = React.useMemo(() => {
    return [
      {
        flexDirection: "column" as const,
        flex: 1,
        gap: 4,
      },
      style,
    ];
  }, [style]);
  
  return <View ref={ref} style={contentStyle} {...rest} />;
});

FieldContent.displayName = "FieldContent";

export { FieldContent };

