import * as React from "react";
import { Platform, type TextProps } from "react-native";
import { Text } from "../text";

export type RadioLabelProps = TextProps & {
  /**
   * The ID of the radio this label is associated with.
   */
  htmlFor: string;
};

/**
 * RadioLabel component for labeling radios with clickable text.
 * 
 * @example
 * // Basic usage
 * <Radio id="option1" value="option1" />
 * <RadioLabel htmlFor="option1">Option 1</RadioLabel>
 */
export const RadioLabel = React.forwardRef<any, RadioLabelProps>((props, ref) => {
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

RadioLabel.displayName = "RadioLabel";

