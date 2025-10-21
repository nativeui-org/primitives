import * as React from "react";
import { Platform, View, Pressable, Modal, Animated, Dimensions, Text, type ViewProps } from "react-native";
import { Slot } from "../slot";

type NativeMenuItem = {
  label: string;
  onPress?: () => void;
  destructive?: boolean;
  disabled?: boolean;
  icon?: string;
};

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
   * Icon for the menu item (native only).
   */
  icon?: string;

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
  nativeItems: NativeMenuItem[];
  registerNativeItem: (item: NativeMenuItem) => void;
  clearNativeItems: () => void;
}>({
  open: false,
  onOpenChange: () => {},
  triggerRef: { current: null },
  nativeItems: [],
  registerNativeItem: () => {},
  clearNativeItems: () => {},
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
  const [nativeItems, setNativeItems] = React.useState<NativeMenuItem[]>([]);
  const triggerRef = React.useRef<any>(null);
  
  const open = openProp ?? internalOpen;
  
  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (openProp === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  }, [openProp, onOpenChange]);

  const registerNativeItem = React.useCallback((item: NativeMenuItem) => {
    setNativeItems(prev => [...prev, item]);
  }, []);

  const clearNativeItems = React.useCallback(() => {
    setNativeItems([]);
  }, []);

  const contextValue = React.useMemo(() => ({
    open,
    onOpenChange: handleOpenChange,
    triggerRef,
    nativeItems,
    registerNativeItem,
    clearNativeItems,
  }), [open, handleOpenChange, nativeItems, registerNativeItem, clearNativeItems]);

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
      delayLongPress={500}
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
  const { open, onOpenChange, triggerRef, nativeItems } = useContextMenu();
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const contentRef = React.useRef<HTMLDivElement>(null);
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const overlayAnim = React.useRef(new Animated.Value(0)).current;

  // Calculate position when opening
  React.useEffect(() => {
    if (open && Platform.OS === "web") {
      const mouseX = (window as any).lastContextMenuX || 0;
      const mouseY = (window as any).lastContextMenuY || 0;
      
      setPosition({ x: mouseX, y: mouseY });
    }
  }, [open]);

  // Animate bottom sheet on native
  React.useEffect(() => {
    if (Platform.OS !== "web") {
      if (open) {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(overlayAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(overlayAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  }, [open, slideAnim, overlayAnim]);

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

    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    if (Platform.OS === "web") {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
      document.addEventListener("wheel", preventScroll, { passive: false });
      document.addEventListener("touchmove", preventScroll, { passive: false });
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.body.style.overflow = "";
        document.removeEventListener("wheel", preventScroll);
        document.removeEventListener("touchmove", preventScroll);
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
    const screenHeight = Dimensions.get("window").height;
    const translateY = slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [screenHeight, 0],
    });

    const overlayOpacity = overlayAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.5],
    });

    return (
      <Modal
        visible={open}
        transparent
        animationType="none"
        onRequestClose={() => onOpenChange(false)}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            opacity: overlayOpacity,
          }}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={() => onOpenChange(false)}
          />
          <Animated.View
            style={{
              backgroundColor: "#1a1a1a",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingTop: 12,
              paddingBottom: 34, // Safe area bottom
              transform: [{ translateY }],
            }}
          >
            {/* Handle bar */}
            <View
              style={{
                width: 36,
                height: 4,
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                borderRadius: 2,
                alignSelf: "center",
                marginBottom: 20,
              }}
            />
            
            {/* Menu items */}
            {nativeItems.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  if (!item.disabled) {
                    item.onPress?.();
                    onOpenChange(false);
                  }
                }}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                  opacity: item.disabled ? 0.5 : pressed ? 0.7 : 1,
                })}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    marginRight: 16,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 20 }}>
                    {item.icon || "•"}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    color: item.destructive ? "#ff3b30" : "#ffffff",
                    fontWeight: "400",
                  }}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </Animated.View>
        </Animated.View>
      </Modal>
    );
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
  const { children, disabled = false, destructive = false, onPress, icon, ...rest } = props;
  const { onOpenChange, registerNativeItem } = useContextMenu();

  // Extract text label from children for native menu
  const getTextLabel = (children: React.ReactNode): string => {
    if (typeof children === "string") return children;
    if (React.isValidElement(children)) {
      const props = children.props as any;
      if (props && props.children) {
        return getTextLabel(props.children);
      }
    }
    if (Array.isArray(children)) {
      return children.map(getTextLabel).join("");
    }
    return "";
  };

  // Register native item on mount for native platforms
  React.useEffect(() => {
    if (Platform.OS !== "web") {
      const label = getTextLabel(children);
      registerNativeItem({ label, onPress, destructive, disabled, icon });
    }
  }, [children, onPress, destructive, disabled, icon, registerNativeItem]);

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

  // On native, render nothing (items are collected via useEffect and shown in native menu)
  return null;
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

  // On native, separators are not shown in ActionSheet/Alert
  return null;
});

ContextMenuSeparator.displayName = "ContextMenuSeparator";
