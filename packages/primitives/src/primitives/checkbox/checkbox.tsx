import * as React from "react";
import { Platform, type ViewProps } from "react-native";
import { Slot } from "../slot";
import { Button } from "../button";

export type CheckedState = boolean | "indeterminate";

export type CheckboxProps = Omit<ViewProps, "children"> & {
  /**
   * The controlled checked state.
   */
  checked?: CheckedState;

  /**
   * The default checked state (uncontrolled).
   */
  defaultChecked?: CheckedState;

  /**
   * Whether the checkbox is disabled.
   */
  disabled?: boolean;

  /**
   * Whether the checkbox is required.
   */
  required?: boolean;

  /**
   * The value (used in CheckboxGroup).
   */
  value?: string;

  /**
   * The name for form submission (web only).
   */
  name?: string;

  /**
   * The unique ID for the checkbox.
   */
  id?: string;

  /**
   * Callback when the checked state changes.
   */
  onCheckedChange?: (checked: CheckedState) => void;

  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;

  /**
   * The checkbox indicator and content.
   */
  children?: React.ReactNode;
};

export const CheckboxContext = React.createContext<{
  value?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
  required?: boolean;
}>({});

export const CheckboxItemContext = React.createContext<{
  checked: CheckedState;
  disabled: boolean;
}>({
  checked: false,
  disabled: false,
});

export const useCheckbox = () => React.useContext(CheckboxContext);
export const useCheckboxItem = () => React.useContext(CheckboxItemContext);

/**
 * Checkbox component for selecting options.
 * 
 * @example
 * <Checkbox checked={isChecked} onCheckedChange={setIsChecked} />
 * 
 * @example
 * <Checkbox asChild checked={isChecked}>
 *   <Button><CustomIndicator /></Button>
 * </Checkbox>
 */
export const Checkbox = React.forwardRef<any, CheckboxProps>((props, ref) => {
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

  const groupContext = useCheckbox();
  const isInGroup = groupContext.value !== undefined;

  const [internalChecked, setInternalChecked] = React.useState<CheckedState>(defaultChecked);
  
  const checked: CheckedState = React.useMemo(() => {
    if (isInGroup && value) {
      return groupContext.value?.includes(value) ?? false;
    }
    return checkedProp ?? internalChecked;
  }, [isInGroup, value, groupContext.value, checkedProp, internalChecked]);

  const disabled = disabledProp || groupContext.disabled || false;

  const handleToggle = React.useCallback(() => {
    if (disabled) return;

    const nextChecked: CheckedState = checked === "indeterminate" ? true : !checked;

    if (isInGroup && groupContext.onValueChange && value) {
      const currentValue = groupContext.value || [];
      const newValue = checked 
        ? currentValue.filter(v => v !== value)
        : [...currentValue, value];
      groupContext.onValueChange(newValue);
    } else {
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

  const ariaChecked = checked === "indeterminate" ? "mixed" : checked;

  const Comp = asChild ? Slot : Button;

  return (
    <CheckboxItemContext.Provider value={itemContextValue}>
      <Comp
        ref={ref}
        role="checkbox"
        onPress={handleToggle}
        disabled={disabled}
        accessibilityRole="checkbox"
        accessibilityState={{
          checked: ariaChecked === "mixed" ? "mixed" : ariaChecked,
          disabled,
        }}
        {...(Platform.OS === "web" && {
          "aria-checked": ariaChecked,
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
          type="checkbox"
          name={name}
          value={value}
          checked={checked === true}
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
    </CheckboxItemContext.Provider>
  );
});

Checkbox.displayName = "Checkbox";