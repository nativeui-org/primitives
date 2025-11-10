import { share } from "./activity-view";
import type { ShareOptions, ShareResult } from "./activity-view";
import { Slot } from "../slot";
import type { ReactNode } from "react";

export type ActivityViewProps = {
  /**
   * Content to share
   */
  shareOptions: ShareOptions;

  /**
   * Children to render (typically a button)
   */
  children: ReactNode;

  /**
   * Callback when share completes
   */
  onShareComplete?: (result: ShareResult) => void;
};

/**
 * ActivityView component for native platforms.
 * On mobile, this directly uses the native share sheet.
 */
export function ActivityView({ shareOptions, children, onShareComplete }: ActivityViewProps) {
  const handlePress = async () => {
    try {
      const result = await share(shareOptions);
      onShareComplete?.(result);
    } catch {
      onShareComplete?.({ action: "dismissedAction" });
    }
  };

  return (
    <Slot onPress={handlePress}>
      {children}
    </Slot>
  );
}

