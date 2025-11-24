import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import { View, type ViewProps } from "../view";
import { FieldProvider } from "./field-context";

export type FieldSetProps = ViewProps;

/**
 * Container that renders a semantic fieldset.
 * Groups related form fields together for accessibility.
 */
const FieldSet = React.forwardRef<any, FieldSetProps>((props, ref) => {
  const { style, children, ...rest } = props;
  
  const setStyle = React.useMemo(() => {
    const baseStyle = {
      flexDirection: "column" as const,
      gap: 16,
    };
    return [baseStyle, style];
  }, [style]);
  
  if (Platform.OS === "web") {
    // Convert React Native style array to CSS object for web
    const webStyle = StyleSheet.flatten(setStyle);
    const cssStyle: React.CSSProperties = {
      display: "flex",
      flexDirection: "column",
      gap: webStyle.gap ? `${webStyle.gap}px` : "16px",
      margin: 0,
      padding: 0,
      border: "none",
      width: "100%",
      boxSizing: "border-box",
      minWidth: 0,
    };
    
    // Filter out React Native specific props for web fieldset
    const webProps: any = {
      style: cssStyle,
    };
    if (rest.testID) webProps["data-testid"] = rest.testID;
    if (rest.id) webProps.id = rest.id;
    if (rest.accessibilityLabel) webProps["aria-label"] = rest.accessibilityLabel;
    
    return (
      <FieldProvider>
        <fieldset ref={ref} {...webProps}>
          {children}
        </fieldset>
      </FieldProvider>
    );
  }
  
  return (
    <FieldProvider>
      <View ref={ref} style={setStyle} role="group" {...rest}>
        {children}
      </View>
    </FieldProvider>
  );
});

FieldSet.displayName = "FieldSet";

export { FieldSet };

