import * as React from "react";
import { View, type ViewProps } from "react-native";
import { Slot } from "../slot";
import { SwitchGroupContext } from "./context";

export type SwitchGroupProps = ViewProps & {
  /**
   * Array of pressed values.
   */
  value?: string[];

  /**
   * Default pressed values (uncontrolled).
   */
  defaultValue?: string[];

  /**
   * Whether the group is disabled.
   */
  disabled?: boolean;

  /**
   * Callback when group value changes.
   */
  onValueChange?: (value: string[]) => void;

  /**
   * Replace the host element by cloning the child.
   * Useful to avoid extra wrappers or to render semantic elements on web.
   */
  asChild?: boolean;
};

/**
 * SwitchGroup component for managing multiple switches with coordinated state.
 * 
 * @example
 * <SwitchGroup value={values} onValueChange={setValues}>
 *   <Switch value="option1" />
 *   <Switch value="option2" />
 * </SwitchGroup>
 */
export const SwitchGroup = React.forwardRef<any, SwitchGroupProps>(function SwitchGroup(props, ref) {
  const { 
    value: valueProp, 
    defaultValue = [], 
    onValueChange, 
    disabled = false,
    asChild = false,
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
  }), [value, handleValueChange, disabled]);

  const Comp: any = asChild ? Slot : View;
  
  return (
    <SwitchGroupContext.Provider value={contextValue}>
      <Comp
        ref={ref}
        role="group"
        {...rest}
      />
    </SwitchGroupContext.Provider>
  );
});

SwitchGroup.displayName = "SwitchGroup";
