import * as React from "react";
import { Platform, Text as RNText, type TextProps as RNTextProps } from "react-native";
import { Slot } from "../slot";

type WebA11yProps = {
  role?: string;
  tabIndex?: number;
  [key: `aria-${string}`]: any;
  href?: string;
  hrefAttrs?: Record<string, any>;
};

/**
 * Cross-platform Text primitive.
 *
 * - Wraps React Native's `Text` with identical API.
 * - Adds optional `asChild` prop to render another component
 *   (e.g. `h1`, `p`, `span`, custom element) without an extra wrapper.
 * - Adds optional `as` prop to render semantic HTML elements on web
 *   while preserving React Native Web's styling system.
 * - Forwards all standard `Text` props, including accessibility and layout.
 * - On web, React Native Web already supports `role`, `tabIndex`, `aria-*`, `href`.
 *   On native, these props are ignored.
 */
export type TextProps = RNTextProps & WebA11yProps & {
  /**
   * Replace the host element by cloning the child.
   * Useful to avoid extra wrappers or to render semantic elements on web.
   */
  asChild?: boolean;

  /**
   * Render as a specific HTML element on web (e.g. "h1", "p", "span").
   * On React Native, this prop is ignored and the component renders as Text.
   * React Native Web will materialize the appropriate semantic HTML element.
   *
   * @example
   * <Text as="h1">Main Title</Text> // renders <h1> on web, <Text> on native
   * <Text as="p">Paragraph text</Text> // renders <p> on web, <Text> on native
   */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "a";

  /**
   * CSS class name for styling (Tailwind).
   */
  className?: string;
};

function mapAsToA11y(as?: TextProps["as"]): WebA11yProps {
  if (!as) return {};
  if (as === "p") return { role: "paragraph" };
  if (as === "span") return {};
  if (as === "a") return {};
  const level = Number(String(as).replace("h", ""));
  if (!Number.isNaN(level)) return { role: "heading", ["aria-level"]: level };
  return {};
}

/**
 * Text primitive: use anywhere you would normally use `Text`.
 *
 * @example
 * <Text style={{ fontSize: 16 }}>Hello World</Text>
 *
 * @example
 * // Using as prop to render semantic HTML elements on web
 * <Text as="h1" style={{ fontSize: 24, fontWeight: 'bold' }}>
 *   Main Title
 * </Text>
 *
 * @example
 * // Using asChild to render a custom element
 * <Text asChild role="heading" aria-level="2">
 *   <h2>Custom Heading</h2>
 * </Text>
 */
export const Text = React.forwardRef<any, TextProps>((props, ref) => {
  const { asChild, as, role, children, ...rest } = props;

  if (asChild) {
    const Comp: any = Slot;
    return <Comp ref={ref} role={role} {...rest}>{children}</Comp>;
  }

  if (Platform.OS === "web" && as) {
    const webA11y = mapAsToA11y(as);
    const finalRole = (webA11y.role || role) as any;
    return (
      <Slot ref={ref} role={finalRole} {...rest}>
        {React.createElement(as, {}, children)}
      </Slot>
    );
  }

  const webA11y = mapAsToA11y(as);
  const finalRole = (webA11y.role || role) as any;
  return <RNText ref={ref} role={finalRole} {...rest}>{children}</RNText>;
});

Text.displayName = "Text";
