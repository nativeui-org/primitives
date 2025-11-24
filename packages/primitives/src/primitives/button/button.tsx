import * as React from "react";
import { Pressable, type PressableProps, type View } from "react-native";
import { Slot } from "../slot";

export type ButtonProps = PressableProps & {
    /**
     * Replace the host element by cloning the child.
     * Useful to avoid extra wrappers or to render semantic elements on web.
     */
    asChild?: boolean;
};

/**
 * Cross-platform Button primitive.
 *
 * - Wraps React Native's `Pressable` with identical API.
 * - Adds optional `asChild` prop to render another component
 *   without an extra wrapper.
 * - Default `role` is "button".
 */
const Button = React.forwardRef<View, ButtonProps>((props, ref) => {
    const { asChild, ...rest } = props;
    const Comp: any = asChild ? Slot : Pressable;

    return <Comp ref={ref} role="button" {...rest} />;
});

Button.displayName = "Button";

export { Button };

