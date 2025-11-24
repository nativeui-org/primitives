import * as React from "react";
import { View } from "../view";
import { type ViewProps } from "../view";
import { Button } from "../button";
import { type ButtonProps } from "../button";
import { Slot } from "../slot";

/* ---------------------------------- Context ---------------------------------- */

type AlertDialogContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
};

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(null);

function useAlertDialogContext() {
  const context = React.useContext(AlertDialogContext);
  if (!context) {
    throw new Error("AlertDialog components must be used within AlertDialog");
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

/* ---------------------------------- AlertDialog (Root) ---------------------------------- */

export type AlertDialogProps = ViewProps & {
  /**
   * Whether the alert dialog is open.
   */
  open?: boolean;

  /**
   * Callback when open state changes.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;
};

/**
 * AlertDialog root component.
 * Manages the alert dialog state and provides context.
 */
export const AlertDialog = React.forwardRef<any, AlertDialogProps>((props, ref) => {
  const { open = false, onOpenChange, asChild, children, ...rest } = props;

  const titleId = useUniqueId("alert-dialog-title");
  const descriptionId = useUniqueId("alert-dialog-description");

  const contextValue = React.useMemo(
    () => ({
      open,
      onOpenChange: onOpenChange || (() => { }),
      titleId,
      descriptionId,
    }),
    [open, onOpenChange, titleId, descriptionId]
  );

  const Comp = asChild ? Slot : View;

  return (
    <AlertDialogContext.Provider value={contextValue}>
      <Comp ref={ref} {...rest}>
        {children}
      </Comp>
    </AlertDialogContext.Provider>
  );
});

AlertDialog.displayName = "AlertDialog";

/* ---------------------------------- AlertDialogOverlay ---------------------------------- */

export type AlertDialogOverlayProps = ButtonProps & {
  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;
};

/**
 * AlertDialog overlay (backdrop).
 * Closes dialog on press if not disabled.
 */
export const AlertDialogOverlay = React.forwardRef<any, AlertDialogOverlayProps>(
  (props, ref) => {
    const { asChild, onPress, children, ...rest } = props;
    const context = useAlertDialogContext();

    if (!context.open) {
      return null;
    }

    return (
      <Button ref={ref} onPress={onPress} {...rest} role="button">
        {children}
      </Button>
    );
  }
);

export type AlertDialogTitleProps = ViewProps;

export const AlertDialogTitle = React.forwardRef<any, AlertDialogTitleProps>(
  (props, ref) => {
    const { children, ...rest } = props;
    const context = useAlertDialogContext();

    return (
      <View ref={ref} id={context.titleId} {...rest}>
        {children}
      </View>
    );
  }
);

AlertDialogTitle.displayName = "AlertDialogTitle";

/* ---------------------------------- AlertDialogDescription ---------------------------------- */

export type AlertDialogDescriptionProps = ViewProps & {
  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;
};

/**
 * AlertDialog description.
 */
export const AlertDialogDescription = React.forwardRef<any, AlertDialogDescriptionProps>(
  (props, ref) => {
    const { asChild, children, ...rest } = props;
    const context = useAlertDialogContext();

    const Comp = asChild ? Slot : View;

    return (
      <Comp ref={ref} id={context.descriptionId} {...rest}>
        {children}
      </Comp>
    );
  }
);

AlertDialogDescription.displayName = "AlertDialogDescription";

/* ---------------------------------- AlertDialogAction ---------------------------------- */

export type AlertDialogActionProps = ButtonProps & {
  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;
};

/**
 * AlertDialog action button.
 * Closes the dialog when pressed.
 */
export const AlertDialogAction = React.forwardRef<any, AlertDialogActionProps>(
  (props, ref) => {
    const { asChild, onPress, children, ...rest } = props;
    const context = useAlertDialogContext();

    const handlePress = React.useCallback(
      (event: any) => {
        context.onOpenChange(false);
        onPress?.(event);
      },
      [context, onPress]
    );

    const Comp: any = asChild ? Slot : Button;

    return (
      <Comp ref={ref} onPress={handlePress} {...rest} role="button">
        {children}
      </Comp>
    );
  }
);

AlertDialogAction.displayName = "AlertDialogAction";

/* ---------------------------------- AlertDialogCancel ---------------------------------- */

export type AlertDialogCancelProps = ButtonProps & {
  /**
   * Replace the host element by cloning the child.
   */
  asChild?: boolean;
};

/**
 * AlertDialog cancel button.
 * Closes the dialog when pressed.
 */
export const AlertDialogCancel = React.forwardRef<any, AlertDialogCancelProps>(
  (props, ref) => {
    const { asChild, onPress, children, ...rest } = props;
    const context = useAlertDialogContext();

    const handlePress = React.useCallback(
      (event: any) => {
        context.onOpenChange(false);
        onPress?.(event);
      },
      [context, onPress]
    );

    const Comp: any = asChild ? Slot : Button;

    return (
      <Comp ref={ref} onPress={handlePress} {...rest} role="button">
        {children}
      </Comp>
    );
  }
);

AlertDialogCancel.displayName = "AlertDialogCancel";

