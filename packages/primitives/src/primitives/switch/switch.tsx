import * as React from "react";
import { Platform, Animated } from "react-native";
import { Slot } from "../slot";
import { Button, type ButtonProps } from "../button";
import { SwitchGroupContext } from "../switch-group/context";
import { useFieldContext } from "../field/field-context";

export type SwitchProps = ButtonProps & {
  /**
   * Whether the switch is pressed/on.
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
   * The value of the switch (used in groups).
   */
  value?: string;

  /**
   * Whether the switch is disabled.
   */
  disabled?: boolean;

  /**
   * The unique ID for the switch (for label association).
   */
  id?: string;

  /**
   * Replace the host element by cloning the child.
   * Useful to avoid extra wrappers or to render semantic elements on web.
   */
  asChild?: boolean;
};

/**
 * Switch component for switching between on/off states.
 * 
 * @example
 * <Switch pressed={isOn} onPressedChange={setIsOn}>
 *   <Text>Switch me</Text>
 * </Switch>
 */
export const Switch = React.forwardRef<any, SwitchProps>(function Switch(props, ref) {
  const { 
    pressed: pressedProp, 
    defaultPressed = false, 
    onPressedChange, 
    value,
    disabled = false,
    id,
    asChild = false,
    ...rest 
  } = props;
  
  const [internalPressed, setInternalPressed] = React.useState(defaultPressed);
  
  const thumbAnimation = React.useRef(new Animated.Value(defaultPressed ? 1 : 0)).current;
  
  const groupContext = React.useContext(SwitchGroupContext);
  const fieldContext = useFieldContext();
  
  const isPressed = React.useMemo(() => {
    if (pressedProp !== undefined) {
      return pressedProp;
    }
    
    if (groupContext && value) {
      return groupContext.value.includes(value);
    }
    
    return internalPressed;
  }, [pressedProp, groupContext, value, internalPressed]);
  
  React.useEffect(() => {
    Animated.timing(thumbAnimation, {
      toValue: isPressed ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isPressed, thumbAnimation]);
  
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

  // Register with FieldContext if id is provided
  React.useEffect(() => {
    if (id && fieldContext.registerControl) {
      fieldContext.registerControl(id, handlePress);
      return () => {
        fieldContext.unregisterControl?.(id);
      };
    }
  }, [id, handlePress, fieldContext]);

  const Comp: any = asChild ? Slot : Button;
  
  const switchProps = {
    ref,
    onPress: handlePress,
    disabled: disabled || groupContext?.disabled,
    accessibilityRole: "switch",
    accessibilityState: {
      checked: isPressed,
      disabled: disabled || groupContext?.disabled,
    },
    // Add animation data for styling
    _thumbAnimation: thumbAnimation,
    _isPressed: isPressed,
    ...rest,
  };

  // Add ARIA attributes for web
  if (Platform.OS === "web") {
    (switchProps as any)["aria-checked"] = isPressed;
    (switchProps as any)["aria-disabled"] = disabled || groupContext?.disabled;
    if (id) {
      (switchProps as any).id = id;
    }
    if (value) {
      (switchProps as any)["value"] = value;
    }
  } else if (id) {
    (switchProps as any).id = id;
  }
  
  return <Comp {...switchProps} />;
});

Switch.displayName = "Switch";