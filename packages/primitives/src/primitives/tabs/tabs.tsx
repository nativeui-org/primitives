import * as React from "react";
import { View, Pressable, Platform, Text, type ViewProps, type PressableProps } from "react-native";
import { Slot } from "../slot";

// Import native tabs view for iOS/Android
// Use the same pattern as ContextMenu - import directly from native-modules package
let NativeTabsView: React.ComponentType<any> | null = null;

if (Platform.OS !== "web") {
  try {
    // Import directly from the native-modules package source, same pattern as ContextMenu
    // @ts-ignore - dynamic import for native modules
    const tabsModule = require("@native-ui-org/native-modules/src/tabs");
    NativeTabsView = tabsModule?.NativeUiOrgTabsView || tabsModule?.default || null;
    
    if (!NativeTabsView && __DEV__) {
      console.warn("[Tabs] NativeUiOrgTabsView not found in @native-ui-org/native-modules/src/tabs");
    }
  } catch (error: any) {
    if (__DEV__) {
      console.warn("[Tabs] Failed to load native tabs view:", error?.message || error);
      console.warn("[Tabs] This is expected if the module is not available or Metro needs to resolve it.");
    }
  }
}

// Context to share state between Tabs components
type TabsContextValue = {
  value: string;
  onValueChange: (value: string) => void;
  disabled: boolean;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs");
  }
  return context;
}

// Generate unique IDs for accessibility
let idCounter = 0;
function useUniqueId(prefix: string): string {
  const idRef = React.useRef<string | null>(null);
  if (idRef.current === null) {
    idRef.current = `${prefix}-${++idCounter}`;
  }
  return idRef.current;
}

/* ---------------------------------- Tabs ---------------------------------- */

export type TabsProps = ViewProps & {
  /**
   * The controlled value of the active tab.
   */
  value?: string;

  /**
   * Default value (uncontrolled).
   */
  defaultValue?: string;

  /**
   * Callback when value changes.
   */
  onValueChange?: (value: string) => void;

  /**
   * Whether the tabs are disabled.
   */
  disabled?: boolean;

  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;

  /**
   * Orientation of tabs (web only).
   */
  orientation?: "horizontal" | "vertical";

  /**
   * Variant style (native only).
   */
  variant?: "default" | "compact" | "minimal";

  /**
   * Text alignment (native only).
   */
  alignment?: "left" | "center" | "right";

  /**
   * SF Symbol name for chevron icon (native only).
   */
  chevronIcon?: string;

  /**
   * Show chevron icon (native only).
   */
  showChevron?: boolean;

  /**
   * Background color (native only, hex string).
   */
  backgroundColor?: string;

  /**
   * Text color (native only, hex string).
   */
  textColor?: string;

  /**
   * Border color (native only, hex string).
   */
  borderColor?: string;

  /**
   * Corner radius (native only).
   */
  cornerRadius?: number;
};

/**
 * Tabs component for organizing content into tabbed sections.
 * 
 * @example
 * <Tabs defaultValue="tab1">
 *   <TabsList>
 *     <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *     <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">Content 1</TabsContent>
 *   <TabsContent value="tab2">Content 2</TabsContent>
 * </Tabs>
 */
export const Tabs = React.forwardRef<any, TabsProps>((props, ref) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
    disabled = false,
    asChild,
    orientation = "horizontal",
    children,
    style,
    variant,
    alignment,
    chevronIcon,
    showChevron,
    backgroundColor,
    textColor,
    borderColor,
    cornerRadius,
    ...rest
  } = props;

  const [internalValue, setInternalValue] = React.useState<string>(defaultValue || "");
  const value = valueProp ?? internalValue;

  const handleValueChange = React.useCallback((newValue: string) => {
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

  const Comp = asChild ? Slot : View;

  // Collect tabs data for native platforms
  const tabsData = React.useMemo(() => {
    if (Platform.OS === "web") return null;
    
    const tabs: Array<{ value: string; label: string; icon?: string }> = [];
    const getTextLabel = (children: React.ReactNode): string => {
      if (typeof children === "string") return children;
      if (React.isValidElement(children)) {
        const childProps = children.props as any;
        if (childProps && childProps.children) {
          return getTextLabel(childProps.children);
        }
      }
      if (Array.isArray(children)) {
        return children.map(getTextLabel).join("");
      }
      return "Tab";
    };

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const childType = (child.type as any)?.displayName;
        if (childType === "TabsList") {
          const childProps = child.props as { children?: React.ReactNode };
          React.Children.forEach(childProps.children, (trigger) => {
            if (React.isValidElement(trigger) && (trigger.type as any)?.displayName === "TabsTrigger") {
              const triggerProps = trigger.props as { 
                value?: string; 
                children?: React.ReactNode; 
                icon?: React.ReactNode;
                iosIcon?: string;
                androidIcon?: string;
              };
              const triggerValue = triggerProps.value;
              const triggerLabel = getTextLabel(triggerProps.children);
              
              // Get the appropriate icon based on platform
              let triggerIcon: string | undefined;
              if (Platform.OS === "ios") {
                triggerIcon = triggerProps.iosIcon;
              } else if (Platform.OS === "android") {
                triggerIcon = triggerProps.androidIcon;
              }
              // For web, icon is React.ReactNode, not a string, so we don't pass it to native
              
              if (triggerValue) {
                tabs.push({ value: triggerValue, label: triggerLabel, icon: triggerIcon });
              }
            }
          });
        }
      }
    });
    return tabs;
  }, [children]);

  // On native platforms, render the native tabs view
  if (Platform.OS !== "web" && NativeTabsView && tabsData && tabsData.length > 0) {
    if (__DEV__) {
      console.log("[Tabs] Rendering native tabs view with data:", tabsData, "selectedValue:", value);
    }
    return (
      <TabsContext.Provider value={contextValue}>
        <View style={[{ flexDirection: 'column' }, style]}>
          <NativeTabsView
            tabs={tabsData}
            selectedValue={value}
            onValueChange={(event: { nativeEvent: { value: string } }) => {
              handleValueChange(event.nativeEvent.value);
            }}
            variant={variant}
            alignment={alignment}
            chevronIcon={chevronIcon}
            showChevron={showChevron}
            backgroundColor={backgroundColor}
            textColor={textColor}
            borderColor={borderColor}
            cornerRadius={cornerRadius}
            style={typeof style === 'object' && style !== null && !Array.isArray(style) && 'width' in style ? { width: (style as any).width } : undefined}
          />
          {/* Render content panels - only selected content is rendered by TabsContent */}
          {React.Children.toArray(children).map((child) => {
            if (React.isValidElement(child)) {
              const childType = (child.type as any)?.displayName;
              if (childType === "TabsContent") {
                // Clone the child to ensure it has access to the context
                return React.cloneElement(child as React.ReactElement<any>, {
                  key: child.key || `tabs-content-${(child.props as any)?.value}`,
                });
              }
              if (childType === "TabsList") {
                // Skip TabsList on native - it's handled by the native view
                return null;
              }
            }
            return child;
          })}
        </View>
      </TabsContext.Provider>
    );
  }

  // Debug: log why native view is not being used
  if (Platform.OS !== "web" && __DEV__) {
    if (!NativeTabsView) {
      console.warn("[Tabs] NativeTabsView is null, falling back to web implementation");
    } else if (!tabsData || tabsData.length === 0) {
      console.warn("[Tabs] tabsData is empty, falling back to web implementation", tabsData);
    }
  }

  return (
    <TabsContext.Provider value={contextValue}>
      <Comp
        ref={ref}
        style={style}
        role={Platform.OS === "web" ? "tablist" : undefined}
        aria-orientation={Platform.OS === "web" ? orientation : undefined}
        {...rest}
      >
        {children}
      </Comp>
    </TabsContext.Provider>
  );
});

Tabs.displayName = "Tabs";

/* ---------------------------------- TabsList ---------------------------------- */

export type TabsListProps = ViewProps & {
  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;
};

/**
 * Container for TabsTrigger components.
 */
export const TabsList = React.forwardRef<any, TabsListProps>((props, ref) => {
  const { asChild, children, style, ...rest } = props;
  const { value, disabled } = useTabsContext();

  const Comp = asChild ? Slot : View;

  if (Platform.OS === "web") {
    return (
      <Comp
        ref={ref}
        style={[
          {
            display: "flex",
            flexDirection: "row",
            gap: 8,
            borderBottomWidth: 1,
            borderBottomColor: "#e5e7eb",
          },
          style,
        ]}
        role="tablist"
        {...rest}
      >
        {children}
      </Comp>
    );
  }

  // On native, render children invisibly to collect tab data
  // The actual UI will be rendered by TabsTrigger
  return (
    <View style={{ opacity: 0, position: "absolute", pointerEvents: "none" }}>
      {children}
    </View>
  );
});

TabsList.displayName = "TabsList";

/* ---------------------------------- TabsTrigger ---------------------------------- */

export type TabsTriggerProps = Omit<PressableProps, "children"> & {
  /**
   * The value of this tab.
   */
  value: string;

  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;

  /**
   * Tab label content.
   */
  children: React.ReactNode;
};

/**
 * Button that activates a tab.
 */
export const TabsTrigger = React.forwardRef<any, TabsTriggerProps>((props, ref) => {
  const { value, asChild, children, style, disabled: disabledProp, ...rest } = props;
  const { value: selectedValue, onValueChange, disabled: tabsDisabled } = useTabsContext();
  const id = useUniqueId("tabs-trigger");

  const disabled = disabledProp || tabsDisabled;
  const isSelected = selectedValue === value;

  const handlePress = React.useCallback(() => {
    if (!disabled) {
      onValueChange(value);
    }
  }, [disabled, onValueChange, value]);

  const Comp = asChild ? Slot : Pressable;

  if (Platform.OS === "web") {
    return (
      <Comp
        ref={ref}
        role="tab"
        aria-selected={isSelected}
        aria-controls={`tabs-content-${id}`}
        id={`tabs-trigger-${id}`}
        onPress={handlePress}
        disabled={disabled}
        style={[
          {
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderBottomWidth: isSelected ? 2 : 0,
            borderBottomColor: "#007AFF",
            backgroundColor: "transparent",
            opacity: disabled ? 0.5 : 1,
            ...(Platform.OS === "web" && {
              cursor: disabled ? "not-allowed" : "pointer",
            } as any),
          },
          style,
        ]}
        {...rest}
      >
        {children}
      </Comp>
    );
  }

  // On native, render invisibly - the native module will render the button
  // Wrap children in Text if it's a string to avoid React Native error
  const renderChildren = () => {
    if (typeof children === "string") {
      return <Text>{children}</Text>;
    }
    return children;
  };

  return (
    <View style={{ opacity: 0, position: "absolute", pointerEvents: "none" }}>
      {renderChildren()}
    </View>
  );
});

TabsTrigger.displayName = "TabsTrigger";

/* ---------------------------------- TabsContent ---------------------------------- */

export type TabsContentProps = ViewProps & {
  /**
   * The value of the tab this content belongs to.
   */
  value: string;

  /**
   * Whether to force mount the content even when not selected.
   */
  forceMount?: boolean;

  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;
};

/**
 * Content panel for a tab.
 */
export const TabsContent = React.forwardRef<any, TabsContentProps>((props, ref) => {
  const { value, forceMount = false, asChild, children, style, ...rest } = props;
  const context = useTabsContext();
  const selectedValue = context?.value || "";
  const id = useUniqueId("tabs-content");

  const isSelected = selectedValue === value;
  const shouldRender = forceMount || isSelected;

  if (__DEV__ && Platform.OS !== "web") {
    console.log(`[TabsContent] value="${value}", selectedValue="${selectedValue}", isSelected=${isSelected}, shouldRender=${shouldRender}`);
  }

  const Comp = asChild ? Slot : View;

  if (Platform.OS === "web") {
    if (!shouldRender) return null;

    return (
      <Comp
        ref={ref}
        role="tabpanel"
        id={`tabs-content-${id}`}
        aria-labelledby={`tabs-trigger-${id}`}
        hidden={!isSelected}
        style={[
          {
            display: isSelected ? "flex" : "none",
            padding: 16,
          },
          style,
        ]}
        {...rest}
      >
        {children}
      </Comp>
    );
  }

  // On native, render content normally
  if (!shouldRender) {
    if (__DEV__) {
      console.log(`[TabsContent] Not rendering content for value="${value}" because shouldRender=false`);
    }
    return null;
  }

  if (__DEV__) {
    console.log(`[TabsContent] Rendering content for value="${value}"`);
  }

  return (
    <Comp
      ref={ref}
      style={[
        Platform.OS === "ios" || Platform.OS === "android" ? {
          marginTop: 16,
        } : undefined,
        style,
      ]}
      {...rest}
    >
      {children}
    </Comp>
  );
});

TabsContent.displayName = "TabsContent";

