import * as React from "react";
import { View, Image, Text, type ViewProps, type ImageProps, type TextProps } from "react-native";
import { Slot } from "../slot";

export type AvatarProps = ViewProps & {
  /**
   * The image source for the avatar.
   */
  src?: string;

  /**
   * The fallback text to display when no image is provided.
   * Usually initials or a single character.
   */
  fallback?: string;

  /**
   * The size of the avatar.
   * Can be a number (pixels) or a predefined size.
   */
  size?: number | "xs" | "sm" | "md" | "lg" | "xl";

  /**
   * The shape of the avatar.
   */
  shape?: "circle" | "square";

  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;
};

/**
 * Avatar component for displaying user profile images with fallback text.
 * 
 * @example
 * // Basic usage with image
 * <Avatar src="https://example.com/avatar.jpg" fallback="JD" />
 * 
 * @example
 * // Different sizes
 * <Avatar src="..." size="sm" fallback="AB" />
 * <Avatar src="..." size="lg" fallback="XY" />
 * 
 * @example
 * // Square avatar
 * <Avatar src="..." shape="square" fallback="CD" />
 * 
 * @example
 * // With asChild
 * <Avatar asChild size="md">
 *   <Pressable>
 *     <Image source={{ uri: "..." }} />
 *   </Pressable>
 * </Avatar>
 */
export const Avatar = React.forwardRef<any, AvatarProps>((props, ref) => {
  const { 
    src, 
    fallback, 
    size = "md", 
    shape = "circle", 
    asChild, 
    children, 
    style, 
    ...rest 
  } = props;

  // Convert size to number
  const sizeValue = React.useMemo(() => {
    if (typeof size === "number") return size;
    
    const sizeMap = {
      xs: 24,
      sm: 32,
      md: 40,
      lg: 48,
      xl: 64,
    };
    
    return sizeMap[size];
  }, [size]);

  const avatarStyle = React.useMemo(() => {
    return {
      width: sizeValue,
      height: sizeValue,
      borderRadius: shape === "circle" ? sizeValue / 2 : 8,
      backgroundColor: "#e0e0e0",
      overflow: "hidden" as any,
      justifyContent: "center" as any,
      alignItems: "center" as any,
    };
  }, [sizeValue, shape]);

  const textStyle = React.useMemo(() => {
    return {
      fontSize: Math.max(sizeValue * 0.4, 12),
      fontWeight: "600" as any,
      color: "#666",
    };
  }, [sizeValue]);

  const Comp = asChild ? Slot : View;

  return (
    <Comp
      ref={ref}
      style={[avatarStyle, style]}
      {...rest}
    >
      {asChild ? (
        children
      ) : (
        <>
          {src ? (
            <Image
              source={{ uri: src }}
              style={{
                width: "100%",
                height: "100%",
              }}
              resizeMode="cover"
            />
          ) : (
            <Text style={textStyle}>
              {fallback || "?"}
            </Text>
          )}
        </>
      )}
    </Comp>
  );
});

Avatar.displayName = "Avatar";
