import * as React from "react";
import { Platform, StyleSheet, type TextProps } from "react-native";
import { Text } from "../text";

export type FieldLegendProps = TextProps & {
  /**
   * Variant of the legend.
   * - "legend": Larger, bold styling (default)
   * - "label": Label-sized styling for nested fieldsets
   */
  variant?: "legend" | "label";
};

/**
 * Legend element for a FieldSet.
 * Provides a title/heading for a group of related fields.
 */
const FieldLegend = React.forwardRef<any, FieldLegendProps>((props, ref) => {
  const { variant = "legend", style, ...rest } = props;
  
  const legendStyle = React.useMemo(() => {
    const baseStyle: any = {};
    
    if (variant === "legend") {
      baseStyle.fontSize = 18;
      baseStyle.fontWeight = "600";
      baseStyle.marginBottom = 4;
    } else {
      baseStyle.fontSize = 16;
      baseStyle.fontWeight = "500";
    }
    
    return [baseStyle, style];
  }, [variant, style]);
  
  if (Platform.OS === "web") {
    // Convert React Native style array to CSS object for web
    const webStyle = StyleSheet.flatten(legendStyle);
    const cssStyle: React.CSSProperties = {
      fontSize: webStyle.fontSize ? `${webStyle.fontSize}px` : variant === "legend" ? "18px" : "16px",
      fontWeight: webStyle.fontWeight || (variant === "legend" ? "600" : "500"),
      marginBottom: webStyle.marginBottom ? `${webStyle.marginBottom}px` : variant === "legend" ? "4px" : "0",
      color: webStyle.color || "inherit",
      padding: 0,
      border: "none",
      width: "100%",
      boxSizing: "border-box",
    };
    
    return (
      <legend ref={ref} style={cssStyle}>
        <Text {...rest} />
      </legend>
    );
  }
  
  return (
    <Text ref={ref} style={legendStyle} role="heading" aria-level={variant === "legend" ? 3 : 4} {...rest} />
  );
});

FieldLegend.displayName = "FieldLegend";

export { FieldLegend };

