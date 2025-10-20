import * as React from "react";
import { View, Pressable, Platform, type ViewProps } from "react-native";
import { Slot } from "../slot";

export type CheckboxProps = ViewProps & {
  /**
   * Whether the checkbox is checked.
   */
  checked?: boolean;

  /**
   * Whether the checkbox is in an indeterminate state.
   */
  indeterminate?: boolean;

  /**
   * Whether the checkbox is disabled.
   */
  disabled?: boolean;

  /**
   * Whether the checkbox is required.
   */
  required?: boolean;

  /**
   * The value of the checkbox (used in groups).
   */
  value?: string;

  /**
   * Unique identifier for the checkbox (used with CheckboxLabel).
   */
  id?: string;

  /**
   * Callback fired when the checkbox state changes.
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;
};

export const CheckboxContext = React.createContext<{
  value?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
  required?: boolean;
}>({});

export const CheckboxItemContext = React.createContext<{
  id?: string;
  checked?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}>({});

export const useCheckbox = () => {
  const context = React.useContext(CheckboxContext);
  return context;
};

export const useCheckboxItem = () => {
  const context = React.useContext(CheckboxItemContext);
  return context;
};

/**
 * Checkbox component for selecting one or more options.
 * 
 * @example
 * // Basic usage
 * <Checkbox checked={isChecked} onCheckedChange={setIsChecked} />
 * 
 * @example
 * // With asChild
 * <Checkbox asChild checked={isChecked}>
 *   <Pressable>
 *     <CustomCheckboxIcon />
 *   </Pressable>
 * </Checkbox>
 */
export const Checkbox = React.forwardRef<any, CheckboxProps>((props, ref) => {
  const {
    checked: checkedProp,
    indeterminate = false,
    disabled: disabledProp,
    required = false,
    value,
    id,
    onCheckedChange,
    asChild,
    children,
    style,
    ...rest
  } = props;

  const groupContext = useCheckbox();
  const isInGroup = groupContext.value !== undefined;
  const checked = isInGroup 
    ? groupContext.value?.includes(value || "") ?? false
    : checkedProp ?? false;
  const disabled = disabledProp ?? groupContext.disabled ?? false;

  const handlePress = React.useCallback(() => {
    if (disabled) return;

    if (isInGroup && groupContext.onValueChange && value) {
      const currentValue = groupContext.value || [];
      const newValue = checked
        ? currentValue.filter(v => v !== value)
        : [...currentValue, value];
      groupContext.onValueChange(newValue);
    } else if (onCheckedChange) {
      onCheckedChange(!checked);
    }
  }, [disabled, isInGroup, groupContext, value, checked, onCheckedChange]);

  const itemContextValue = React.useMemo(() => ({
    id,
    checked,
    disabled,
    onPress: handlePress,
  }), [id, checked, disabled, handlePress]);

  const Comp = asChild ? Slot : Pressable;

  const checkboxElement = (
    <Comp
      ref={ref}
      onPress={handlePress}
      disabled={disabled}
      style={style}
      accessibilityRole="checkbox"
      accessibilityState={{
        checked: indeterminate ? "mixed" : checked,
        disabled,
      }}
      {...(Platform.OS !== "web" && { accessibilityRequired: required })}
      {...(id && Platform.OS === "web" && { id })}
      {...rest}
    >
      {asChild ? children : (
        <View
          style={{
            width: 20,
            height: 20,
            borderWidth: 2,
            borderColor: checked ? "#007AFF" : "#ccc",
            backgroundColor: checked ? "#007AFF" : "transparent",
            borderRadius: 4,
            justifyContent: "center",
            alignItems: "center",
            opacity: disabled ? 0.5 : 1,
          }}
        >
          {checked && !indeterminate && (
            <View
              style={{
                width: 6,
                height: 10,
                borderBottomWidth: 2,
                borderRightWidth: 2,
                borderColor: "white",
                transform: [{ rotate: "45deg" }],
              }}
            />
          )}
          {indeterminate && (
            <View
              style={{
                width: 8,
                height: 2,
                backgroundColor: "white",
              }}
            />
          )}
        </View>
      )}
    </Comp>
  );

  return (
    <CheckboxItemContext.Provider value={itemContextValue}>
      {checkboxElement}
    </CheckboxItemContext.Provider>
  );
});

Checkbox.displayName = "Checkbox";