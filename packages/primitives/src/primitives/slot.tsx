import * as React from "react";

type InjectedProps = Record<string, unknown>;
const EVENT_RE = /^on[A-Z]/;

/**
 * Slot
 *
 * A utility component that allows passing props down to a child element
 * without wrapping it in an extra DOM node or native view.
 *
 * - Merges `className` values.
 * - Composes event handlers (child handler is called first).
 * - Child props always take precedence over slot props.
 * - Forwards refs correctly.
 *
 * Inspired by Radix UI's Slot, adapted for React Native + Web.
 */
export function Slot(props: { children?: React.ReactNode } & InjectedProps) {
  const { children, ...slotProps } = props;

  if (!React.isValidElement(children)) {
    // Only a single valid React element can be slotted
    return React.Children.count(children) > 1 ? React.Children.only(null) : null;
  }

  const childProps = (children.props ?? {}) as Record<string, any>;
  const injected = (slotProps ?? {}) as Record<string, any>;

  const next: Record<string, any> = { ...childProps };

  // Merge className values
  if (typeof injected.className === "string" && injected.className.length) {
    next.className = [childProps.className, injected.className].filter(Boolean).join(" ");
  }

  // Compose event handlers (child first, then slot)
  for (const key of Object.keys(injected)) {
    const val = injected[key];
    if (EVENT_RE.test(key) && typeof val === "function") {
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

  // Copy all other props, but never overwrite child's
  for (const [k, v] of Object.entries(injected)) {
    if (k === "className" || EVENT_RE.test(k)) continue;
    if (next[k] === undefined) next[k] = v;
  }

  // Ref handling: compose forwarded ref with child's ref
  const childType = (children as any).type;
  let refProp: { ref?: React.Ref<any> } = {};
  if (childType !== React.Fragment) {
    const childRef: any = (children as any).ref ?? children.props.ref;
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
