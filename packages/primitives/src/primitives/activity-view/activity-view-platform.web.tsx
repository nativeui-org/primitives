import { useCallback } from "react";
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
 * ActivityView component for web.
 * Uses the native Web Share API (navigator.share()) directly.
 */
export function ActivityView({ shareOptions, children, onShareComplete }: ActivityViewProps) {
  const handlePress = useCallback(() => {
    share(shareOptions)
      .then((result) => {
        onShareComplete?.(result);
      })
      .catch(() => {
        onShareComplete?.({ action: "dismissedAction" });
      });
  }, [shareOptions, onShareComplete]);

  return (
    <Slot onPress={handlePress}>
      {children}
    </Slot>
  );
}
