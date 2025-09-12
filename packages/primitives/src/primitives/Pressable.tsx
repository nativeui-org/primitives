import React, { forwardRef, useState } from "react";
import {
  Platform,
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
} from "react-native";
import { cn } from "../utils/cn";

// tes props publiques (pas besoin d'y mettre tabIndex)
export type PressableProps = RNPressableProps & {
  className?: string;
  role?: "button" | "link";
  href?: string;   // web only
  target?: string; // web only
};

// types internes pour la branche web/natif
type WebExtras = {
  role?: "button" | "link";
  tabIndex?: 0 | -1;
  href?: string;
  target?: string;
};

type NativeExtras = {
  accessibilityRole?: "button" | "link";
};

export const Pressable = forwardRef<any, PressableProps>(function Pressable(
  { className, role = "button", disabled, onPressIn, onPressOut, ...rest },
  ref
) {
  const [pressed, setPressed] = useState(false);

  return (
    <RNPressable
      ref={ref}
      // 1) spread conditionnel direct pour éviter l’union stockée
      {...(Platform.OS === "web"
        ? ({
          role,
          // 2) literal type: force 0 | -1, pas number
          tabIndex: (disabled ? -1 : 0) as 0 | -1,
        } satisfies WebExtras)
        : ({ accessibilityRole: role } satisfies NativeExtras))}
      disabled={disabled}
      data-pressed={pressed || undefined}
      onPressIn={(e) => {
        setPressed(true);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        setPressed(false);
        onPressOut?.(e);
      }}
      className={cn("items-center justify-center", className)}
      {...rest}
    />
  );
});
