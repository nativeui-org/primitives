import * as React from "react";
import { useRadioItem } from "./radio";

export type RadioIndicatorProps = {
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
 * RadioIndicator renders its children only when the radio is checked.
 * 
 * @example
 * <Radio>
 *   <RadioIndicator>●</RadioIndicator>
 * </Radio>
 */
export const RadioIndicator = React.forwardRef<any, RadioIndicatorProps>((props, ref) => {
  const { children, forceMount } = props;
  const { checked } = useRadioItem();

  if (!forceMount && !checked) {
    return null;
  }

  return <>{children}</>;
});

RadioIndicator.displayName = "RadioIndicator";

