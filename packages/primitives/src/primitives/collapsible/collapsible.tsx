import * as React from "react";
import { View, type ViewProps } from "react-native";
import { Slot } from "../slot";
import { Button, type ButtonProps } from "../button";

// Context to share state between Collapsible components
type CollapsibleContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled: boolean;
  contentId: string;
  triggerId: string;
};

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null);

function useCollapsibleContext() {
  const context = React.useContext(CollapsibleContext);
  if (!context) {
    throw new Error("Collapsible components must be used within a Collapsible");
  }
  return context;
}

/**
 * Hook to access the collapsible state (useful for custom triggers/content).
 * Must be used within Collapsible.
 */
export function useCollapsible() {
  return useCollapsibleContext();
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

/* ---------------------------------- Collapsible ---------------------------------- */

export type CollapsibleProps = ViewProps & {
  /**
   * Whether the collapsible is open (controlled).
   */
  open?: boolean;

  /**
   * Default open state (uncontrolled).
   */
  defaultOpen?: boolean;

  /**
   * Callback when open state changes.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Whether the collapsible is disabled.
   */
  disabled?: boolean;

  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;
};

/**
 * Collapsible root component.
 * Manages open/closed state and provides context to children.
 *
 * @example
 * <Collapsible>
 *   <CollapsibleTrigger><Text>Toggle</Text></CollapsibleTrigger>
 *   <CollapsibleContent><Text>Content</Text></CollapsibleContent>
 * </Collapsible>
 */
export const Collapsible = React.forwardRef<any, CollapsibleProps>((props, ref) => {
  const {
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
    asChild,
    children,
    ...rest
  } = props;

  // Uncontrolled state
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  const contentId = useUniqueId("collapsible-content");
  const triggerId = useUniqueId("collapsible-trigger");

  const contextValue = React.useMemo(
    () => ({
      open,
      onOpenChange: handleOpenChange,
      disabled,
      contentId,
      triggerId,
    }),
    [open, handleOpenChange, disabled, contentId, triggerId]
  );

  const Comp = asChild ? Slot : View;

  return (
    <CollapsibleContext.Provider value={contextValue}>
      <Comp ref={ref} {...rest}>
        {children}
      </Comp>
    </CollapsibleContext.Provider>
  );
});

Collapsible.displayName = "Collapsible";

/* ---------------------------------- CollapsibleTrigger ---------------------------------- */

export type CollapsibleTriggerProps = ButtonProps & {
  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;
};

/**
 * Collapsible trigger button.
 * Toggles the open/closed state when pressed.
 *
 * @example
 * <CollapsibleTrigger>
 *   <Text>Show more</Text>
 * </CollapsibleTrigger>
 */
export const CollapsibleTrigger = React.forwardRef<any, CollapsibleTriggerProps>(
  (props, ref) => {
    const { asChild, onPress, disabled: disabledProp, children, ...rest } = props;
    const context = useCollapsibleContext();

    const disabled = disabledProp ?? context.disabled;

    const handlePress = React.useCallback(
      (event: any) => {
        if (!disabled) {
          context.onOpenChange(!context.open);
        }
        onPress?.(event);
      },
      [disabled, context, onPress]
    );

    const Comp: any = asChild ? Slot : Button;

    // Web accessibility props
    const webA11yProps = {
      role: "button" as any,
      "aria-expanded": context.open,
      "aria-controls": context.contentId,
      id: context.triggerId,
    };

    // Native accessibility props
    const nativeA11yProps = {
      accessibilityRole: "button" as any,
      accessibilityState: { expanded: context.open, disabled },
    };

    return (
      <Comp
        ref={ref}
        onPress={handlePress}
        disabled={disabled}
        {...webA11yProps}
        {...nativeA11yProps}
        {...rest}
      >
        {children}
      </Comp>
    );
  }
);

CollapsibleTrigger.displayName = "CollapsibleTrigger";

/* ---------------------------------- CollapsibleContent ---------------------------------- */

export type CollapsibleContentProps = ViewProps & {
  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;

  /**
   * Force mount the content even when closed (useful for animations).
   */
  forceMount?: boolean;
};

/**
 * Collapsible content container.
 * Hidden when collapsed, visible when expanded.
 *
 * @example
 * <CollapsibleContent>
 *   <Text>Hidden content that appears when expanded</Text>
 * </CollapsibleContent>
 */
export const CollapsibleContent = React.forwardRef<any, CollapsibleContentProps>(
  (props, ref) => {
    const { asChild, forceMount, children, style, ...rest } = props;
    const context = useCollapsibleContext();

    const isOpen = context.open;
    const shouldRender = forceMount || isOpen;

    if (!shouldRender) {
      return null;
    }

    const Comp = asChild ? Slot : View;

    // Web accessibility props
    const webA11yProps = {
      role: "region" as any,
      id: context.contentId,
      "aria-labelledby": context.triggerId,
    };

    // Hide with display: none when closed (unless forceMount is true)
    const computedStyle = [
      style,
      !isOpen && forceMount ? { display: "none" as any } : undefined,
    ];

    return (
      <Comp ref={ref} style={computedStyle} {...webA11yProps} {...rest}>
        {children}
      </Comp>
    );
  }
);

CollapsibleContent.displayName = "CollapsibleContent";

