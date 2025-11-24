import * as React from "react";
import { type ViewProps } from "../view";
import { View } from "../view";
import { Slot } from "../slot";

export type AspectRatioProps = ViewProps & {
  /**
   * The aspect ratio of the container.
   * Can be a number (e.g., 16/9) or a string (e.g., "16/9", "1:1", "4:3").
   */
  ratio: number | string;

  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;
};

/**
 * AspectRatio component maintains a specific aspect ratio for its content.
 * 
 * @example
 * // Using number
 * <AspectRatio ratio={16/9}>
 *   <Image source={{ uri: '...' }} />
 * </AspectRatio>
 * 
 * @example
 * // Using string
 * <AspectRatio ratio="1:1">
 *   <View>Square content</View>
 * </AspectRatio>
 * 
 * @example
 * // With asChild
 * <AspectRatio ratio="4:3" asChild>
 *   <Button>
 *     <Text>Clickable content</Text>
 *   </Button>
 * </AspectRatio>
 */
export const AspectRatio = React.forwardRef<any, AspectRatioProps>((props, ref) => {
  const { ratio, asChild, children, style, ...rest } = props;

  // Parse ratio to number
  const aspectRatio = React.useMemo(() => {
    if (typeof ratio === "number") {
      return ratio;
    }

    // Parse string ratios like "16:9", "1:1", "4/3"
    const match = ratio.toString().match(/^(\d+(?:\.\d+)?)[:/](\d+(?:\.\d+)?)$/);
    if (match) {
      const [, width, height] = match;
      return parseFloat(width!) / parseFloat(height!);
    }

    // Fallback to 1:1 if parsing fails
    console.warn(`Invalid aspect ratio: ${ratio}. Using 1:1 as fallback.`);
    return 1;
  }, [ratio]);

  const aspectRatioStyle = React.useMemo(() => {
    return Platform.select({
      web: {
        // Web supports aspect-ratio CSS property
        aspectRatio: aspectRatio,
      },
      default: {
        // Native fallback using padding-bottom trick
        height: 0,
        paddingBottom: `${(1 / aspectRatio) * 100}%` as any,
        position: "relative" as any,
      },
    });
  }, [aspectRatio]);

  const contentStyle = React.useMemo(() => {
    return Platform.select({
      web: {
        // Web: content fills the aspect ratio container
        width: "100%" as any,
        height: "100%" as any,
      },
      default: {
        // Native: absolute positioning to fill the padding-bottom container
        position: "absolute" as any,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    });
  }, []);

  const Comp = asChild ? Slot : View;

  return (
    <Comp
      ref={ref}
      style={[aspectRatioStyle, style]}
      {...rest}
    >
      {asChild ? (
        children
      ) : (
        <View style={contentStyle}>
          {children}
        </View>
      )}
    </Comp>
  );
});

AspectRatio.displayName = "AspectRatio";

// Import Platform
import { Platform } from "react-native";
