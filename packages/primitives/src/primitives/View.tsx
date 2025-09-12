import React, { forwardRef } from "react";
import { View as RNView, ViewProps as RNViewProps } from "react-native";
import { cn } from "../utils/cn";

export type ViewProps = RNViewProps & { className?: string };

export const View = forwardRef<any, ViewProps>(function View({ className, ...props }, ref) {
  return <RNView ref={ref} className={cn(className)} {...props} />;
});
