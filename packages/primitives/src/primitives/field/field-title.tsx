import * as React from "react";
import { type TextProps } from "react-native";
import { Text } from "../text";

export type FieldTitleProps = TextProps;

/**
 * Renders a title with label styling inside FieldContent.
 * Useful for choice cards or complex field layouts.
 */
const FieldTitle = React.forwardRef<any, FieldTitleProps>((props, ref) => {
  const { style, ...rest } = props;
  
  const titleStyle = React.useMemo(() => {
    return [
      {
        fontSize: 16,
        fontWeight: "500" as const,
      },
      style,
    ];
  }, [style]);
  
  return (
    <Text ref={ref} style={titleStyle} {...rest} />
  );
});

FieldTitle.displayName = "FieldTitle";

export { FieldTitle };

