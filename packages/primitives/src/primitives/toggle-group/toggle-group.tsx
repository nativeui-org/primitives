import * as React from "react";
import { View, type ViewProps } from "react-native";
import { Slot } from "../slot";
import { ToggleGroupContext } from "./context";

export type ToggleGroupProps = ViewProps & {
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
 * ToggleGroup component for managing multiple toggles with coordinated state.
 * 
 * @example
 * <ToggleGroup value={values} onValueChange={setValues}>
 *   <Toggle value="bold">Bold</Toggle>
 *   <Toggle value="italic">Italic</Toggle>
 * </ToggleGroup>
 */
export const ToggleGroup = React.forwardRef<any, ToggleGroupProps>(function ToggleGroup(props, ref) {
  const { 
    value: valueProp, 
    defaultValue = [], 
    onValueChange, 
    disabled = false,
    asChild = false,
    children,
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

  const Comp: any = asChild ? Slot : View;

  const contextValue = React.useMemo(() => ({
    value,
    onValueChange: handleValueChange,
    disabled,
  }), [value, handleValueChange, disabled]);
  
  return (
    <ToggleGroupContext.Provider value={contextValue}>
      <Comp ref={ref} role="group" {...rest}>
        {children}
      </Comp>
    </ToggleGroupContext.Provider>
  );
});

ToggleGroup.displayName = "ToggleGroup";
