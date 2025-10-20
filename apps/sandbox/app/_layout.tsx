// apps/sandbox/app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AlertDialogProvider } from "@native-ui-org/primitives";

export default function Layout() {
  return (
    <AlertDialogProvider>
      <Stack />
      <StatusBar style="auto" />
    </AlertDialogProvider>
  );
}
