import * as React from "react";
import { Pressable, Platform, type ViewProps } from "react-native";
import { Slot } from "../slot";

export type RadioProps = Omit<ViewProps, "children"> & {
  /**
   * The controlled checked state.
   */
  checked?: boolean;

  /**
   * The default checked state (uncontrolled).
   */
  defaultChecked?: boolean;

  /**
   * Whether the radio is disabled.
   */
  disabled?: boolean;

  /**
   * Whether the radio is required.
   */
  required?: boolean;

  /**
   * The value (used in RadioGroup).
   */
  value?: string;

  /**
   * The name for form submission (web only).
   */
  name?: string;

  /**
   * The unique ID for the radio.
   */
  id?: string;

  /**
   * Callback when the checked state changes.
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;

  /**
   * The radio indicator and content.
   */
  children?: React.ReactNode;
};

export const RadioContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}>({});

export const RadioItemContext = React.createContext<{
  checked: boolean;
  disabled: boolean;
}>({
  checked: false,
  disabled: false,
});

export const useRadio = () => React.useContext(RadioContext);
export const useRadioItem = () => React.useContext(RadioItemContext);

/**
 * Radio component for selecting a single option from a group.
 * 
 * @example
 * <Radio checked={isChecked} onCheckedChange={setIsChecked} />
 * 
 * @example
 * <Radio asChild checked={isChecked}>
 *   <Pressable><CustomIndicator /></Pressable>
 * </Radio>
 */
export const Radio = React.forwardRef<any, RadioProps>((props, ref) => {
  const {
    checked: checkedProp,
    defaultChecked = false,
    disabled: disabledProp = false,
    required = false,
    value,
    name,
    id,
    onCheckedChange,
    asChild,
    children,
    ...rest
  } = props;

  const groupContext = useRadio();
  const isInGroup = groupContext.value !== undefined;

  const [internalChecked, setInternalChecked] = React.useState<boolean>(defaultChecked);
  
  const checked: boolean = React.useMemo(() => {
    if (isInGroup && value) {
      return groupContext.value === value;
    }
    return checkedProp ?? internalChecked;
  }, [isInGroup, value, groupContext.value, checkedProp, internalChecked]);

  const disabled = disabledProp || groupContext.disabled || false;

  const handleToggle = React.useCallback(() => {
    if (disabled) return;

    if (isInGroup && groupContext.onValueChange && value) {
      groupContext.onValueChange(value);
    } else {
      const nextChecked = !checked;
      if (checkedProp === undefined) {
        setInternalChecked(nextChecked);
      }
      onCheckedChange?.(nextChecked);
    }
  }, [disabled, checked, isInGroup, groupContext, value, checkedProp, onCheckedChange]);

  const handleKeyDown = React.useCallback((e: any) => {
    if (Platform.OS === "web" && (e.key === " " || e.key === "Enter")) {
      e.preventDefault();
      handleToggle();
    }
  }, [handleToggle]);

  const itemContextValue = React.useMemo(() => ({
    checked,
    disabled,
  }), [checked, disabled]);

  const Comp = asChild ? Slot : Pressable;

  return (
    <RadioItemContext.Provider value={itemContextValue}>
      <Comp
        ref={ref}
        role="radio"
        onPress={handleToggle}
        disabled={disabled}
        accessibilityRole="radio"
        accessibilityState={{
          checked,
          disabled,
        }}
        {...(Platform.OS === "web" && {
          "aria-checked": checked,
          "aria-disabled": disabled,
          "aria-required": required,
          tabIndex: disabled ? -1 : 0,
          onKeyDown: handleKeyDown,
        })}
        {...(id && { id })}
        {...rest}
      >
        {children}
      </Comp>

      {Platform.OS === "web" && name && (
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          required={required}
          tabIndex={-1}
          style={{
            position: "absolute",
            opacity: 0,
            pointerEvents: "none",
            width: 1,
            height: 1,
          }}
          onChange={() => {}}
        />
      )}
    </RadioItemContext.Provider>
  );
});

Radio.displayName = "Radio";

