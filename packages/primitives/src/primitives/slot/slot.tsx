import * as React from "react";
import { Platform } from "react-native";

type InjectedProps = Record<string, unknown>;
const EVENT_RE = /^on[A-Z]/;
const RN_SPECIFIC_PROPS = new Set([
  "onPress",
  "onPressIn",
  "onPressOut",
  "onLongPress",
  "accessibilityRole",
  "accessibilityState",
  "accessibilityLabel",
  "accessibilityHint",
  "accessible",
]);

/**
 * Slot
 *
 * A tiny utility that lets a parent component "become" its child
 * by cloning it with additional props, without adding an extra wrapper.
 *
 * Philosophy:
 * - RN-first, no styling: we do NOT touch `className` or `style`.
 * - Child props always win over injected props (no surprises).
 * - Event handlers are composed (child first, then injected).
 * - Refs are composed (forwarded ref + child's ref).
 *
 * Typical usage: <View asChild><section /></View>
 * This renders <section> directly with View's props, avoiding a wrapper node.
 */
export function Slot(props: { children?: React.ReactNode } & InjectedProps): React.ReactElement | null {
  const { children, ...injected } = props;

  if (!React.isValidElement(children)) {
    return null;
  }

  const childProps = (children.props ?? {}) as Record<string, any>;
  const next: Record<string, any> = { ...childProps };

  for (const key of Object.keys(injected)) {
    const val = (injected as any)[key];
    if (EVENT_RE.test(key) && typeof val === "function") {
      if (Platform.OS === "web") {
        const childType = (children as any).type;
        const isDOMElement = typeof childType === "string";
        if (isDOMElement && RN_SPECIFIC_PROPS.has(key)) {
          continue;
        }
      }

      const theirs = childProps[key];
      const ours = val;
      next[key] =
        typeof theirs === "function"
          ? (...args: unknown[]) => {
            (theirs as any)(...args);
            (ours as any)(...args);
          }
          : ours;
    }
  }

  for (const [k, v] of Object.entries(injected)) {
    if (EVENT_RE.test(k)) continue;

    if (Platform.OS === "web") {
      const childType = (children as any).type;
      const isDOMElement = typeof childType === "string";

      if (isDOMElement) {
        if (k === "testID") {
          if (next["data-testid"] === undefined) {
            next["data-testid"] = v;
          }
          continue;
        }

        if (RN_SPECIFIC_PROPS.has(k)) {
          continue;
        }
      }
    }

    if (next[k] === undefined) next[k] = v;
  }

  const childType = (children as any).type;
  const refProp: { ref?: React.Ref<any> } = {};
  if (childType !== React.Fragment) {
    const childRef: any = (children as any).ref ?? (children.props as any).ref;
    refProp.ref = (node: any) => {
      const fwd = (props as any).ref;
      if (typeof fwd === "function") fwd(node);
      else if (fwd && "current" in fwd) (fwd as any).current = node;

      if (typeof childRef === "function") childRef(node);
      else if (childRef && "current" in childRef) childRef.current = node;
    };
  }

  return React.cloneElement(children as any, { ...next, ...refProp });
}
