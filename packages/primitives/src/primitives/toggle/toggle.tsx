import * as React from "react";
import { Platform } from "react-native";
import { Slot } from "../slot";
import { Button, type ButtonProps } from "../button";
import { ToggleGroupContext } from "../toggle-group/context";

export type ToggleProps = ButtonProps & {
  /**
   * Whether the toggle is pressed/active.
   */
  pressed?: boolean;

  /**
   * The default pressed state (uncontrolled).
   */
  defaultPressed?: boolean;

  /**
   * Callback when the pressed state changes.
   */
  onPressedChange?: (pressed: boolean) => void;

  /**
   * The value of the toggle (used in groups).
   */
  value?: string;

  /**
   * Whether the toggle is disabled.
   */
  disabled?: boolean;

  /**
   * Replace the host element by cloning the child.
   * Useful to avoid extra wrappers or to render semantic elements on web.
   */
  asChild?: boolean;
};

/**
 * Toggle component for button-like toggles (like formatting buttons).
 * 
 * @example
 * <Toggle pressed={isBold} onPressedChange={setIsBold}>
 *   <Text style={{ fontWeight: 'bold' }}>B</Text>
 * </Toggle>
 */
export const Toggle = React.forwardRef<any, ToggleProps>(function Toggle(props, ref) {
  const { 
    pressed: pressedProp, 
    defaultPressed = false, 
    onPressedChange, 
    value,
    disabled = false,
    asChild = false,
    ...rest 
  } = props;
  
  const [internalPressed, setInternalPressed] = React.useState(defaultPressed);
  
  const groupContext = React.useContext(ToggleGroupContext);
  
  const isPressed = React.useMemo(() => {
    if (pressedProp !== undefined) {
      return pressedProp;
    }
    
    if (groupContext && value) {
      return groupContext.value.includes(value);
    }
    
    return internalPressed;
  }, [pressedProp, groupContext, value, internalPressed]);
  
  const handlePress = React.useCallback(() => {
    if (disabled || (groupContext?.disabled)) return;
    
    const newPressed = !isPressed;
    
    if (groupContext && value) {
      const newValue = newPressed 
        ? [...groupContext.value, value]
        : groupContext.value.filter(v => v !== value);
      groupContext.onValueChange(newValue);
    } else {
      if (pressedProp === undefined) {
        setInternalPressed(newPressed);
      }
      
      onPressedChange?.(newPressed);
    }
  }, [isPressed, pressedProp, onPressedChange, disabled, groupContext, value]);

  const Comp: any = asChild ? Slot : Button;
  
  const toggleProps = {
    ref,
    onPress: handlePress,
    disabled: disabled || groupContext?.disabled,
    accessibilityRole: "button",
    accessibilityState: {
      selected: isPressed,
      disabled: disabled || groupContext?.disabled,
    },
    ...rest,
  };

  // Add ARIA attributes for web
  if (Platform.OS === "web") {
    (toggleProps as any)["aria-pressed"] = isPressed;
    (toggleProps as any)["aria-disabled"] = disabled || groupContext?.disabled;
    if (value) {
      (toggleProps as any)["value"] = value;
    }
  }
  
  return <Comp {...toggleProps} />;
});

Toggle.displayName = "Toggle";
