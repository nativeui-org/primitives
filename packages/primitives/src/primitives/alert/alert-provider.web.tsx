import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import { View, Text } from "../..";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./alert-dialog";
import { useWebAlertState, resolveWebAlert, type AlertButton } from "./show-alert";
import { Portal } from "../portal";

/**
 * AlertDialogProvider for Web.
 * Renders the alert dialog portal and handles keyboard interactions.
 * 
 * Must be placed at the root of your app on web.
 */
export function AlertDialogProvider({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== "web") {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <WebAlertDialogPortal />
    </>
  );
}

function WebAlertDialogPortal() {
  const state = useWebAlertState();
  const contentRef = React.useRef<any>(null);

  // Handle Escape key
  React.useEffect(() => {
    if (!state.open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state.options?.cancelable !== false) {
        e.preventDefault();
        const cancelButton = state.options?.buttons?.find((b) => b.style === "cancel");
        resolveWebAlert(cancelButton?.value ?? undefined);
      }
    };

    if (Platform.OS === "web") {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [state.open, state.options]);

  // Focus trap
  React.useEffect(() => {
    if (!state.open || Platform.OS !== "web") return;

    const previousActiveElement = document.activeElement as HTMLElement;

    // Focus the first autofocus button or the content
    setTimeout(() => {
      const autoFocusButton = state.options?.buttons?.find((b) => b.autoFocus);
      if (autoFocusButton) {
        const buttonIndex = state.options!.buttons!.indexOf(autoFocusButton);
        const buttonElements = contentRef.current?.querySelectorAll("button");
        buttonElements?.[buttonIndex]?.focus();
      } else {
        contentRef.current?.focus?.();
      }
    }, 0);

    return () => {
      previousActiveElement?.focus?.();
    };
  }, [state.open, state.options]);

  if (!state.open || !state.options) {
    return null;
  }

  const buttons = state.options.buttons || [{ text: "OK", value: undefined }];
  const hasCancel = buttons.some((b) => b.style === "cancel");

  return (
    <Portal>
      <AlertDialog open={state.open}>
        <AlertDialogOverlay style={styles.overlay}>
          <View style={styles.centeredView}>
            <AlertDialogContent
              ref={contentRef}
              style={styles.content}
              onStartShouldSetResponder={() => true}
            >
              {state.options.title && (
                <AlertDialogTitle style={styles.titleContainer}>
                  <Text style={styles.title}>{state.options.title}</Text>
                </AlertDialogTitle>
              )}

              {state.options.message && (
                <AlertDialogDescription style={styles.descriptionContainer}>
                  <Text style={styles.description}>{state.options.message}</Text>
                </AlertDialogDescription>
              )}

              <View style={styles.buttons}>
                {buttons.map((button, index) => {
                  const isCancel = button.style === "cancel";
                  const isDestructive = button.style === "destructive";

                  const ButtonComp = isCancel ? AlertDialogCancel : AlertDialogAction;

                  return (
                    <ButtonComp
                      key={index}
                      style={[
                        styles.button,
                        isDestructive && styles.buttonDestructive,
                        isCancel && styles.buttonCancel,
                      ]}
                      onPress={() => resolveWebAlert(button.value)}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          isDestructive && styles.buttonTextDestructive,
                          isCancel && styles.buttonTextCancel,
                        ]}
                      >
                        {button.text}
                      </Text>
                    </ButtonComp>
                  );
                })}
              </View>
            </AlertDialogContent>
          </View>
        </AlertDialogOverlay>
      </AlertDialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...Platform.select({
      web: {
        position: "fixed" as any,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      default: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
    }),
  },
  centeredView: {
    ...Platform.select({
      web: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      },
      default: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
      },
    }),
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    minWidth: 280,
    maxWidth: 400,
    ...Platform.select({
      web: {
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
    }),
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: "#007AFF",
  },
  buttonCancel: {
    backgroundColor: "#f0f0f0",
  },
  buttonDestructive: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  buttonTextCancel: {
    color: "#000",
  },
  buttonTextDestructive: {
    color: "#fff",
  },
});

