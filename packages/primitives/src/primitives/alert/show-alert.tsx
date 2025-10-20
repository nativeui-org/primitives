import { Platform, Alert } from "react-native";

export type AlertButton<Value = string> = {
  /**
   * Button text label
   */
  text: string;

  /**
   * Value returned when button is pressed
   */
  value?: Value;

  /**
   * Button style (visual hint)
   */
  style?: "default" | "cancel" | "destructive";

  /**
   * Auto-focus this button on web
   */
  autoFocus?: boolean;
};

export type ShowAlertOptions<Value = string> = {
  /**
   * Alert title
   */
  title?: string;

  /**
   * Alert message/description
   */
  message?: string;

  /**
   * Alert buttons
   */
  buttons?: AlertButton<Value>[];

  /**
   * Whether the alert can be dismissed by tapping outside or pressing Escape
   */
  cancelable?: boolean;
};

// Web-specific alert state management
type WebAlertState = {
  open: boolean;
  options: ShowAlertOptions<any> | null;
  resolve: ((value: any) => void) | null;
};

let webAlertState: WebAlertState = {
  open: false,
  options: null,
  resolve: null,
};

const webAlertListeners = new Set<(state: WebAlertState) => void>();

function updateWebAlertState(newState: Partial<WebAlertState>) {
  webAlertState = { ...webAlertState, ...newState };
  webAlertListeners.forEach((listener) => listener(webAlertState));
}

/**
 * Hook to access the current web alert state.
 * Used internally by AlertDialogProvider.
 */
export function useWebAlertState() {
  const [state, setState] = React.useState(webAlertState);

  React.useEffect(() => {
    webAlertListeners.add(setState);
    return () => {
      webAlertListeners.delete(setState);
    };
  }, []);

  return state;
}

/**
 * Close the current web alert and resolve with value.
 */
export function resolveWebAlert(value: any) {
  if (webAlertState.resolve) {
    webAlertState.resolve(value);
  }
  updateWebAlertState({ open: false, options: null, resolve: null });
}

/**
 * Show an alert dialog.
 * 
 * On mobile (iOS/Android): Uses native Alert.alert()
 * On web: Shows a custom AlertDialog component
 * 
 * @returns Promise that resolves with the button value when pressed
 * 
 * @example
 * const result = await showAlert({
 *   title: "Delete file?",
 *   message: "This action cannot be undone.",
 *   buttons: [
 *     { text: "Cancel", value: "cancel", style: "cancel" },
 *     { text: "Delete", value: "delete", style: "destructive" },
 *   ],
 * });
 * 
 * if (result === "delete") {
 *   // Delete the file
 * }
 */
export function showAlert<Value = string>(
  options: ShowAlertOptions<Value>
): Promise<Value | undefined> {
  return new Promise((resolve) => {
    if (Platform.OS !== "web") {
      // Native Alert.alert
      const buttons: AlertButton<Value>[] = options.buttons || [
        { text: "OK", value: undefined as any, style: "default" }
      ];
      
      Alert.alert(
        options.title || "",
        options.message,
        buttons.map((btn) => ({
          text: btn.text,
          style: btn.style,
          onPress: () => resolve(btn.value as Value),
        })),
        { cancelable: options.cancelable ?? true }
      );
    } else {
      // Web AlertDialog
      updateWebAlertState({
        open: true,
        options,
        resolve,
      });
    }
  });
}

// React import for useWebAlertState hook
import * as React from "react";

