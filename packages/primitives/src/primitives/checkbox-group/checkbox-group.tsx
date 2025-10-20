import * as React from "react";
import { View, type ViewProps } from "react-native";
import { Slot } from "../slot";
import { CheckboxContext } from "../checkbox";

export type CheckboxGroupProps = ViewProps & {
  /**
   * The value of the checked checkboxes.
   */
  value?: string[];

  /**
   * The default value of the checked checkboxes.
   */
  defaultValue?: string[];

  /**
   * Whether the group is disabled.
   */
  disabled?: boolean;

  /**
   * Whether the group is required.
   */
  required?: boolean;

  /**
   * Callback fired when the group value changes.
   */
  onValueChange?: (value: string[]) => void;

  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;
};

/**
 * CheckboxGroup component for managing multiple checkboxes.
 * 
 * @example
 * // Basic usage
 * <CheckboxGroup value={selectedValues} onValueChange={setSelectedValues}>
 *   <Checkbox value="option1" />
 *   <Checkbox value="option2" />
 * </CheckboxGroup>
 * 
 * @example
 * // With asChild
 * <CheckboxGroup asChild value={values}>
 *   <View>
 *     <Checkbox value="option1" />
 *     <Checkbox value="option2" />
 *   </View>
 * </CheckboxGroup>
 */
export const CheckboxGroup = React.forwardRef<any, CheckboxGroupProps>((props, ref) => {
  const {
    value: valueProp,
    defaultValue = [],
    disabled = false,
    required = false,
    onValueChange,
    asChild,
    children,
    style,
    ...rest
  } = props;

  const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue);
  const value = valueProp ?? internalValue;

  const handleValueChange = React.useCallback((newValue: string[]) => {
    if (valueProp === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  }, [valueProp, onValueChange]);

  const contextValue = React.useMemo(() => ({
    value,
    onValueChange: handleValueChange,
    disabled,
    required,
  }), [value, handleValueChange, disabled, required]);

  const Comp = asChild ? Slot : View;

  return (
    <CheckboxContext.Provider value={contextValue}>
      <Comp
        ref={ref}
        style={style}
        role="group"
        accessibilityLabel="Checkbox group"
        {...rest}
      >
        {children}
      </Comp>
    </CheckboxContext.Provider>
  );
});

CheckboxGroup.displayName = "CheckboxGroup";
