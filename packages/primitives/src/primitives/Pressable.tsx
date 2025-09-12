import React, { forwardRef, useState } from "react";
import {
  Platform,
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
  View
} from "react-native";
import { cn } from "../utils/cn";

type PressableHost = React.ComponentType<any>;
const PressableBase = RNPressable as unknown as PressableHost;

export type PressableProps = RNPressableProps & {
  className?: string;
  role?: "button" | "link";
  href?: string;
  target?: string;
};

type WebExtras = { role?: "button" | "link"; tabIndex?: 0 | -1; href?: string; target?: string; };
type NativeExtras = { accessibilityRole?: "button" | "link" };

export const Pressable = forwardRef<any, PressableProps>(function Pressable(
  { className, role = "button", disabled, onPressIn, onPressOut, ...rest },
  ref
) {
  const [pressed, setPressed] = useState(false);

  return (
    <PressableBase
      ref={ref}
      {...(Platform.OS === "web"
        ? ({ role, tabIndex: (disabled ? -1 : 0) as 0 | -1 } satisfies WebExtras)
        : ({ accessibilityRole: role } satisfies NativeExtras))}
      disabled={disabled}
      data-pressed={pressed || undefined}
      onPressIn={(e: any) => { setPressed(true); onPressIn?.(e); }}
      onPressOut={(e: any) => { setPressed(false); onPressOut?.(e); }}
      className={cn("items-center justify-center", className)}
      {...rest}
    />
  );
});
