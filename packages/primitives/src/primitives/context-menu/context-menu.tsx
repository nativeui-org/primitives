import * as React from "react";
import { Platform, View, Pressable, type ViewProps } from "react-native";
import { Slot } from "../slot";

export type ContextMenuProps = ViewProps & {
  /**
   * Whether the context menu is open.
   */
  open?: boolean;

  /**
   * The default open state (uncontrolled).
   */
  defaultOpen?: boolean;

  /**
   * Callback when the open state changes.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * The content of the context menu.
   */
  children: React.ReactNode;
};

export type ContextMenuTriggerProps = ViewProps & {
  /**
   * The content that triggers the context menu.
   */
  children: React.ReactNode;

  /**
   * Whether the trigger is disabled.
   */
  disabled?: boolean;
};

export type ContextMenuContentProps = ViewProps & {
  /**
   * The content of the context menu.
   */
  children: React.ReactNode;

  /**
   * Whether to force mount the content (for animations).
   */
  forceMount?: boolean;
};

export type ContextMenuItemProps = ViewProps & {
  /**
   * Whether the item is disabled.
   */
  disabled?: boolean;

  /**
   * Whether the item has destructive styling.
   */
  destructive?: boolean;

  /**
   * Callback when the item is pressed.
   */
  onPress?: () => void;

  /**
   * The content of the menu item.
   */
  children: React.ReactNode;
};

export type ContextMenuSeparatorProps = ViewProps;

// Context for managing state
export const ContextMenuContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<any>;
}>({
  open: false,
  onOpenChange: () => {},
  triggerRef: { current: null },
});

export const useContextMenu = () => React.useContext(ContextMenuContext);

/**
 * ContextMenu component for displaying context menus on right-click (web) or long press (native).
 * 
 * @example
 * <ContextMenu>
 *   <ContextMenuTrigger>
 *     <ChatItem chat={chat} />
 *   </ContextMenuTrigger>
 *   <ContextMenuContent>
 *     <ContextMenuItem onPress={() => share(chat)}>
 *       <Text>Share</Text>
 *     </ContextMenuItem>
 *   </ContextMenuContent>
 * </ContextMenu>
 */
export const ContextMenu = React.forwardRef<any, ContextMenuProps>((props, ref) => {
  const { open: openProp, defaultOpen = false, onOpenChange, children, ...rest } = props;
  
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const triggerRef = React.useRef<any>(null);
  
  const open = openProp ?? internalOpen;
  
  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (openProp === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  }, [openProp, onOpenChange]);

  const contextValue = React.useMemo(() => ({
    open,
    onOpenChange: handleOpenChange,
    triggerRef,
  }), [open, handleOpenChange]);

  return (
    <ContextMenuContext.Provider value={contextValue}>
      <View ref={ref} {...rest}>
        {children}
      </View>
    </ContextMenuContext.Provider>
  );
});

ContextMenu.displayName = "ContextMenu";

/**
 * ContextMenuTrigger component that triggers the context menu.
 */
export const ContextMenuTrigger = React.forwardRef<any, ContextMenuTriggerProps>((props, ref) => {
  const { children, disabled, ...rest } = props;
  const { onOpenChange, triggerRef } = useContextMenu();

  const handleContextMenu = React.useCallback((e: any) => {
    if (Platform.OS === "web" && !disabled) {
      e.preventDefault();
      
      // Store mouse position globally with a unique key for this context menu
      const contextKey = `contextMenu_${Date.now()}_${Math.random()}`;
      (window as any).lastContextMenuX = e.clientX;
      (window as any).lastContextMenuY = e.clientY;
      (window as any).lastContextMenuKey = contextKey;
      
      console.log("Context menu triggered!", e.clientX, e.clientY, contextKey); // Debug
      onOpenChange(true);
    }
  }, [disabled, onOpenChange]);

  const handleLongPress = React.useCallback(() => {
    if (Platform.OS !== "web" && !disabled) {
      onOpenChange(true);
    }
  }, [disabled, onOpenChange]);

  // Add event listener directly for web
  React.useEffect(() => {
    if (Platform.OS === "web" && triggerRef.current) {
      const element = triggerRef.current as HTMLElement;
      element.addEventListener("contextmenu", handleContextMenu);
      return () => element.removeEventListener("contextmenu", handleContextMenu);
    }
  }, [handleContextMenu]);

  return (
    <Pressable
      ref={(node: any) => {
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
        triggerRef.current = node;
      }}
      onLongPress={handleLongPress}
      {...rest}
    >
      {children}
    </Pressable>
  );
});

ContextMenuTrigger.displayName = "ContextMenuTrigger";

/**
 * ContextMenuContent component that renders the context menu content.
 */
export const ContextMenuContent = React.forwardRef<any, ContextMenuContentProps>((props, ref) => {
  const { children, forceMount } = props;
  const { open, onOpenChange, triggerRef } = useContextMenu();
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Calculate position when opening
  React.useEffect(() => {
    if (open && Platform.OS === "web") {
      const mouseX = (window as any).lastContextMenuX || 0;
      const mouseY = (window as any).lastContextMenuY || 0;
      
      setPosition({ x: mouseX, y: mouseY });
    }
  }, [open]);

  // Handle escape key
  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    if (Platform.OS === "web") {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, onOpenChange]);

  // Handle click outside
  React.useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (triggerRef.current && !triggerRef.current.contains(target)) {
        onOpenChange(false);
      }
    };

    if (Platform.OS === "web") {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.body.style.overflow = "";
      };
    }
  }, [open, onOpenChange]);

  // Adjust position after render to avoid overflow (only once when opening)
  React.useLayoutEffect(() => {
    if (!open || !contentRef.current || Platform.OS !== "web") return;
    
    const menu = contentRef.current;
    const menuRect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = position.x;
    let y = position.y;
    let needsAdjustment = false;

    // Adjust horizontal position if menu overflows
    if (menuRect.right > viewportWidth - 8) {
      x = Math.max(8, viewportWidth - menuRect.width - 8);
      needsAdjustment = true;
    }
    if (menuRect.left < 8) {
      x = 8;
      needsAdjustment = true;
    }

    // Adjust vertical position if menu overflows
    if (menuRect.bottom > viewportHeight - 8) {
      y = Math.max(8, viewportHeight - menuRect.height - 8);
      needsAdjustment = true;
    }
    if (menuRect.top < 8) {
      y = 8;
      needsAdjustment = true;
    }

    // Update position only if necessary
    if (needsAdjustment) {
      setPosition({ x, y });
    }
  }, [open]);

  if (!open && !forceMount) {
    return null;
  }

  if (Platform.OS !== "web") {
    // On native, we'll implement this later with native context menus
    return null;
  }

  if (Platform.OS === "web") {
    const ReactDOM = require("react-dom");
    return ReactDOM.createPortal(
      <div
        ref={(node) => {
          (contentRef as any).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as any).current = node;
        }}
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          zIndex: 999999,
          minWidth: 220,
          maxWidth: 280,
          backgroundColor: "#ffffff",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          borderRadius: 10,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06)",
          padding: 6,
          fontSize: 14,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          overflow: "hidden",
        } as any}
      >
        {children}
      </div>,
      document.body
    );
  }

  return null;
});

ContextMenuContent.displayName = "ContextMenuContent";

/**
 * ContextMenuItem component for individual menu items.
 */
export const ContextMenuItem = React.forwardRef<any, ContextMenuItemProps>((props, ref) => {
  const { children, disabled = false, destructive = false, onPress, ...rest } = props;
  const { onOpenChange } = useContextMenu();

  const handlePress = React.useCallback(() => {
    if (!disabled) {
      onPress?.();
      onOpenChange(false);
    }
  }, [disabled, onPress, onOpenChange]);

  const handleKeyDown = React.useCallback((e: any) => {
    if (Platform.OS === "web" && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      handlePress();
    }
  }, [handlePress]);

  if (Platform.OS === "web") {
    // Filter out React Native specific props for web
    const { onPress, accessibilityRole, accessibilityState, ...webProps } = rest as any;
    
    return (
      <div
        ref={ref}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onClick={handlePress}
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          padding: "8px 10px",
          margin: "2px 0",
          textAlign: "left",
          backgroundColor: "transparent",
          border: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          color: destructive ? "#ef4444" : "#1f2937",
          opacity: disabled ? 0.5 : 1,
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 400,
          lineHeight: "20px",
          transition: "background-color 0.12s ease, color 0.12s ease",
          userSelect: "none",
          WebkitUserSelect: "none",
          outline: "none",
        } as any}
        onMouseEnter={(e: any) => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor = destructive ? "rgba(239, 68, 68, 0.08)" : "rgba(0, 0, 0, 0.04)";
          }
        }}
        onMouseLeave={(e: any) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
        {...webProps}
      >
        {children}
      </div>
    );
  }

  return (
    <Slot
      ref={ref}
      role="menuitem"
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="menuitem"
      accessibilityState={{ disabled }}
      {...rest}
    >
      {children}
    </Slot>
  );
});

ContextMenuItem.displayName = "ContextMenuItem";

/**
 * ContextMenuSeparator component for visual separation between menu items.
 */
export const ContextMenuSeparator = React.forwardRef<any, ContextMenuSeparatorProps>((props, ref) => {
  if (Platform.OS === "web") {
    // Filter out React Native specific props for web
    const { accessibilityRole, ...webProps } = props as any;
    
    return (
      <div
        ref={ref}
        role="separator"
        style={{
          height: 1,
          backgroundColor: "rgba(0, 0, 0, 0.06)",
          margin: "6px 4px",
        } as any}
        {...webProps}
      />
    );
  }

  return (
    <Slot
      ref={ref}
      role="separator"
      accessibilityRole="separator"
      {...props}
    />
  );
});

ContextMenuSeparator.displayName = "ContextMenuSeparator";
