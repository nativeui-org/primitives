import * as React from "react";
import { Platform } from "react-native";

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

  // On web, render to portal container
  const ReactDOM = require("react-dom");
  const targetContainer = container || document.body;
  
  return ReactDOM.createPortal(children, targetContainer);
});

Portal.displayName = "Portal";
