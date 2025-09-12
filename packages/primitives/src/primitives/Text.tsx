import React, { forwardRef } from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";
import { cn } from "../utils/cn";

export type TextProps = RNTextProps & { className?: string };

export const Text = forwardRef<any, TextProps>(function Text({ className, ...props }, ref) {
  return <RNText ref={ref} className={cn("text-base", className)} {...props} />;
});
