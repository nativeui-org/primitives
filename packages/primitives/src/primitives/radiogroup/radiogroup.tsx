import * as React from "react";
import { View, type ViewProps } from "react-native";
import { Slot } from "../slot";
import { RadioContext } from "../radio";

export type RadioGroupProps = ViewProps & {
  /**
   * The value of the selected radio.
   */
  value?: string;

  /**
   * The default value of the selected radio.
   */
  defaultValue?: string;

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
  onValueChange?: (value: string) => void;

  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;
};

/**
 * RadioGroup component for managing multiple radios as a group.
 * Only one radio can be selected at a time.
 * 
 * @example
 * // Basic usage
 * <RadioGroup value={selectedValue} onValueChange={setSelectedValue}>
 *   <Radio value="option1" />
 *   <Radio value="option2" />
 * </RadioGroup>
 * 
 * @example
 * // With asChild
 * <RadioGroup asChild value={value}>
 *   <View>
 *     <Radio value="option1" />
 *     <Radio value="option2" />
 *   </View>
 * </RadioGroup>
 */
export const RadioGroup = React.forwardRef<any, RadioGroupProps>((props, ref) => {
  const {
    value: valueProp,
    defaultValue,
    disabled = false,
    required = false,
    onValueChange,
    asChild,
    children,
    style,
    ...rest
  } = props;

  const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue);
  const value = valueProp ?? internalValue;

  const handleValueChange = React.useCallback((newValue: string) => {
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
    <RadioContext.Provider value={contextValue}>
      <Comp
        ref={ref}
        style={style}
        role="radiogroup"
        accessibilityLabel="Radio group"
        {...rest}
      >
        {children}
      </Comp>
    </RadioContext.Provider>
  );
});

RadioGroup.displayName = "RadioGroup";

