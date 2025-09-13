import * as React from "react";
import { View as RNView, type ViewProps as RNViewProps } from "react-native";
import { Slot } from "../slot";

/**
 * Cross-platform View primitive.
 *
 * - Wraps React Native's `View` with identical API.
 * - Adds optional `asChild` prop to render another component
 *   (e.g. `section`, `motion.div`, custom element) without an extra wrapper.
 * - Forwards all standard `View` props, including accessibility and layout.
 * - On web, React Native Web already supports `role`, `tabIndex`, `aria-*`.
 *   On native, these props are ignored.
 */
export type ViewProps = RNViewProps & {
  /**
   * Replace the host element by cloning the child.
   * Useful to avoid extra wrappers or to render semantic elements on web.
   */
  asChild?: boolean;
};

/**
 * View primitive: use anywhere you would normally use `View`.
 *
 * @example
 * <View style={{ padding: 16 }}>
 *   <Text>Hello</Text>
 * </View>
 *
 * @example
 * // Using asChild to render a semantic <section> on web
 * <View asChild role="region" aria-label="Hero section">
 *   <section>content</section>
 * </View>
 */
export const View = React.forwardRef<any, ViewProps>((props, ref) => {
  const { asChild, ...rest } = props;
  const Comp: any = asChild ? Slot : RNView;
  return <Comp ref={ref} {...rest} />;
});

View.displayName = "View";
