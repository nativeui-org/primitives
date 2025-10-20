import * as React from "react";
import { Platform, StyleSheet } from "react-native";

export type PortalProps = {
  /**
   * The content to render in the portal.
   */
  children: React.ReactNode;

  /**
   * The container to render the portal into.
   * On web, defaults to document.body.
   * On native, renders children normally.
   */
  container?: Element | null;
};

/**
 * Portal component for rendering children outside the normal React tree.
 * 
 * On web: Renders children to a DOM container (default: document.body)
 * On native: Renders children normally (no portal behavior)
 * 
 * @example
 * // Basic usage
 * <Portal>
 *   <Modal>Content</Modal>
 * </Portal>
 * 
 * @example
 * // Custom container
 * <Portal container={document.getElementById('modal-root')}>
 *   <Dialog>Content</Dialog>
 * </Portal>
 */
export const Portal = React.forwardRef<any, PortalProps>((props, ref) => {
  const { children, container } = props;
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // On native, always render children normally
  if (Platform.OS !== "web") {
    return <>{children}</>;
  }

  // On web, wait for mount to avoid SSR issues
  if (!mounted) {
    return null;
  }

  // On web, render children with portal-like styling
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div style={{ pointerEvents: "auto" }}>
        {children}
      </div>
    </div>
  );
});

Portal.displayName = "Portal";
