import * as React from "react";
import { Platform, View as RNView, type ViewProps as RNViewProps } from "react-native";
import { cn } from "../utils/cn";
import { Slot } from "./slot";

export type ViewProps = Omit<RNViewProps, "style"> & {
  className?: string;
  style?: RNViewProps["style"];
  asChild?: boolean;
  role?:
    | "presentation" | "none" | "group" | "region" | "article" | "main"
    | "button" | "link" | "list" | "listitem" | "img" | "separator" | "heading";
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  tabIndex?: 0 | -1;   // web only
  dir?: "ltr" | "rtl" | "auto"; // web only
};

export const View = React.forwardRef<any, ViewProps>(function View(
  { className, asChild, role, tabIndex, dir, ...rest },
  ref
) {
  // a11y mapping
  const webA11y =
    Platform.OS === "web"
      ? { role, tabIndex, dir }
      : undefined;

  const nativeA11y =
    Platform.OS !== "web" && role
      ? { accessibilityRole: role as any }
      : undefined;

  const Comp: any = asChild ? Slot : RNView;

  return (
    <Comp
      ref={ref}
      {...webA11y}
      {...nativeA11y}
      {...rest}
      className={cn(className)}
    />
  );
});
