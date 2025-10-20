import * as React from "react";
import { useCheckboxItem } from "./checkbox";

export type CheckboxIndicatorProps = {
  /**
   * Content to render when checked.
   */
  children?: React.ReactNode;

  /**
   * Whether to force mount the indicator even when unchecked.
   */
  forceMount?: boolean;
};

/**
 * CheckboxIndicator renders its children only when the checkbox is checked or indeterminate.
 * 
 * @example
 * <Checkbox>
 *   <CheckboxIndicator>✓</CheckboxIndicator>
 * </Checkbox>
 */
export const CheckboxIndicator = React.forwardRef<any, CheckboxIndicatorProps>((props, ref) => {
  const { children, forceMount } = props;
  const { checked } = useCheckboxItem();

  if (!forceMount && !checked) {
    return null;
  }

  return <>{children}</>;
});

CheckboxIndicator.displayName = "CheckboxIndicator";
