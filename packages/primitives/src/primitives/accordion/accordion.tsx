import * as React from "react";
import { View, type ViewProps } from "react-native";
import { Slot } from "../slot";
import { Button, type ButtonProps } from "../button";

// Context to share state between Accordion components
type AccordionContextValue =
  | {
      type: "single";
      value: string;
      onValueChange: (value: string) => void;
      disabled: boolean;
    }
  | {
      type: "multiple";
      value: string[];
      onValueChange: (value: string[]) => void;
      disabled: boolean;
    };

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion");
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

/* ---------------------------------- Accordion ---------------------------------- */

export type AccordionSingleProps = ViewProps & {
  /**
   * Type of accordion - single allows only one item open at a time.
   */
  type: "single";

  /**
   * The controlled value of the item to expand (single mode).
   */
  value?: string;

  /**
   * Default value (uncontrolled, single mode).
   */
  defaultValue?: string;

  /**
   * Callback when value changes (single mode).
   */
  onValueChange?: (value: string) => void;

  /**
   * Whether the accordion is disabled.
   */
  disabled?: boolean;

  /**
   * Whether an item can be collapsed after being expanded.
   */
  collapsible?: boolean;

  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;
};

export type AccordionMultipleProps = ViewProps & {
  /**
   * Type of accordion - multiple allows multiple items to be open.
   */
  type: "multiple";

  /**
   * The controlled values of the items to expand (multiple mode).
   */
  value?: string[];

  /**
   * Default values (uncontrolled, multiple mode).
   */
  defaultValue?: string[];

  /**
   * Callback when values change (multiple mode).
   */
  onValueChange?: (value: string[]) => void;

  /**
   * Whether the accordion is disabled.
   */
  disabled?: boolean;

  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;
};

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

/**
 * Accordion root component.
 * Manages the expanded state of accordion items.
 *
 * @example
 * <Accordion type="single" defaultValue="item-1">
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger><Text>Section 1</Text></AccordionTrigger>
 *     <AccordionContent><Text>Content 1</Text></AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 */
export const Accordion = React.forwardRef<any, AccordionProps>((props, ref) => {
  const { type, disabled = false, asChild, children, ...rest } = props;

  // Handle single type
  if (type === "single") {
    const {
      value: controlledValue,
      defaultValue = "",
      onValueChange,
      collapsible = true,
    } = props as AccordionSingleProps;

    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        // If collapsible is false and trying to close the current item, do nothing
        if (!collapsible && newValue === value) {
          return;
        }

        if (!isControlled) {
          setUncontrolledValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [isControlled, collapsible, value, onValueChange]
    );

    const contextValue = React.useMemo(
      () => ({
        type: "single" as const,
        value,
        onValueChange: handleValueChange,
        disabled,
      }),
      [value, handleValueChange, disabled]
    );

    const Comp = asChild ? Slot : View;

    return (
      <AccordionContext.Provider value={contextValue}>
        <Comp ref={ref} {...rest}>
          {children}
        </Comp>
      </AccordionContext.Provider>
    );
  }

  // Handle multiple type
  const {
    value: controlledValue,
    defaultValue = [],
    onValueChange,
  } = props as AccordionMultipleProps;

  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = React.useCallback(
    (newValue: string[]) => {
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange]
  );

  const contextValue = React.useMemo(
    () => ({
      type: "multiple" as const,
      value,
      onValueChange: handleValueChange,
      disabled,
    }),
    [value, handleValueChange, disabled]
  );

  const Comp = asChild ? Slot : View;

  return (
    <AccordionContext.Provider value={contextValue}>
      <Comp ref={ref} {...rest}>
        {children}
      </Comp>
    </AccordionContext.Provider>
  );
});

Accordion.displayName = "Accordion";

/* ---------------------------------- AccordionItem ---------------------------------- */

type AccordionItemContextValue = {
  value: string;
  open: boolean;
  disabled: boolean;
  triggerId: string;
  contentId: string;
};

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext() {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error("AccordionTrigger and AccordionContent must be used within AccordionItem");
  }
  return context;
}

/**
 * Hook to access the accordion item state (useful for custom triggers/content).
 * Must be used within AccordionItem.
 */
export function useAccordionItem() {
  return useAccordionItemContext();
}

export type AccordionItemProps = ViewProps & {
  /**
   * Unique value for this accordion item.
   */
  value: string;

  /**
   * Whether this item is disabled.
   */
  disabled?: boolean;

  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;
};

/**
 * AccordionItem component.
 * Wraps an accordion trigger and content pair.
 */
export const AccordionItem = React.forwardRef<any, AccordionItemProps>((props, ref) => {
  const { value, disabled: itemDisabled, asChild, children, ...rest } = props;
  const accordion = useAccordionContext();

  const disabled = itemDisabled ?? accordion.disabled;

  // Determine if this item is open
  const open = React.useMemo(() => {
    if (accordion.type === "single") {
      return (accordion as Extract<AccordionContextValue, { type: "single" }>).value === value;
    }
    return (accordion as Extract<AccordionContextValue, { type: "multiple" }>).value.includes(value);
  }, [accordion, value]);

  const triggerId = useUniqueId("accordion-trigger");
  const contentId = useUniqueId("accordion-content");

  const contextValue = React.useMemo(
    () => ({
      value,
      open,
      disabled,
      triggerId,
      contentId,
    }),
    [value, open, disabled, triggerId, contentId]
  );

  const Comp = asChild ? Slot : View;

  return (
    <AccordionItemContext.Provider value={contextValue}>
      <Comp ref={ref} {...rest}>
        {children}
      </Comp>
    </AccordionItemContext.Provider>
  );
});

AccordionItem.displayName = "AccordionItem";

/* ---------------------------------- AccordionTrigger ---------------------------------- */

export type AccordionTriggerProps = ButtonProps & {
  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;
};

/**
 * AccordionTrigger button.
 * Toggles the expanded state of its accordion item.
 */
export const AccordionTrigger = React.forwardRef<any, AccordionTriggerProps>(
  (props, ref) => {
    const { asChild, onPress, disabled: disabledProp, children, ...rest } = props;
    const accordion = useAccordionContext();
    const item = useAccordionItemContext();

    const disabled = disabledProp ?? item.disabled;

    const handlePress = React.useCallback(
      (event: any) => {
        if (!disabled) {
          if (accordion.type === "single") {
            // Toggle in single mode (close if already open, open if closed)
            const newValue = item.open ? "" : item.value;
            (accordion as Extract<AccordionContextValue, { type: "single" }>).onValueChange(newValue);
          } else {
            // Toggle in multiple mode
            const currentValues = (accordion as Extract<AccordionContextValue, { type: "multiple" }>).value;
            const newValues = item.open
              ? currentValues.filter((v) => v !== item.value)
              : [...currentValues, item.value];
            (accordion as Extract<AccordionContextValue, { type: "multiple" }>).onValueChange(newValues);
          }
        }
        onPress?.(event);
      },
      [disabled, accordion, item, onPress]
    );

    const Comp: any = asChild ? Slot : Button;

    // Web accessibility props
    const webA11yProps = {
      role: "button" as any,
      "aria-expanded": item.open,
      "aria-controls": item.contentId,
      id: item.triggerId,
    };

    // Native accessibility props
    const nativeA11yProps = {
      accessibilityRole: "button" as any,
      accessibilityState: { expanded: item.open, disabled },
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

AccordionTrigger.displayName = "AccordionTrigger";

/* ---------------------------------- AccordionContent ---------------------------------- */

export type AccordionContentProps = ViewProps & {
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
 * AccordionContent container.
 * Hidden when collapsed, visible when expanded.
 */
export const AccordionContent = React.forwardRef<any, AccordionContentProps>(
  (props, ref) => {
    const { asChild, forceMount, children, style, ...rest } = props;
    const item = useAccordionItemContext();

    const isOpen = item.open;
    const shouldRender = forceMount || isOpen;

    if (!shouldRender) {
      return null;
    }

    const Comp = asChild ? Slot : View;

    // Web accessibility props
    const webA11yProps = {
      role: "region" as any,
      id: item.contentId,
      "aria-labelledby": item.triggerId,
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

AccordionContent.displayName = "AccordionContent";

