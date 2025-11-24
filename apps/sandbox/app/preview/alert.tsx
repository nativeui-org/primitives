import { Stack } from "expo-router";
import { View, Text, showAlert, Button } from "@native-ui-org/primitives";
import { StyleSheet, Platform, ScrollView } from "react-native";
import React from "react";

export default function AlertPreview() {
  const [lastResult, setLastResult] = React.useState<string>("");

  const handleBasicAlert = async () => {
    await showAlert({
      title: "Information",
      message: "This is a basic alert with a single OK button.",
    });
    setLastResult("Basic alert dismissed");
  };

  const handleConfirm = async () => {
    const result = await showAlert({
      title: "Confirm Action",
      message: "Are you sure you want to proceed?",
      buttons: [
        { text: "Cancel", value: "cancel", style: "cancel" },
        { text: "Confirm", value: "confirm", style: "default" },
      ],
    });
    setLastResult(`Confirm result: ${result || "dismissed"}`);
  };

  const handleDestructive = async () => {
    const result = await showAlert({
      title: "Delete Item",
      message: "This action cannot be undone. Are you sure?",
      buttons: [
        { text: "Cancel", value: "cancel", style: "cancel" },
        { text: "Delete", value: "delete", style: "destructive", autoFocus: true },
      ],
    });
    setLastResult(`Destructive result: ${result || "cancelled"}`);
  };

  const handleThreeButtons = async () => {
    const result = await showAlert({
      title: "Save Changes?",
      message: "You have unsaved changes. What would you like to do?",
      buttons: [
        { text: "Don't Save", value: "discard", style: "destructive" },
        { text: "Cancel", value: "cancel", style: "cancel" },
        { text: "Save", value: "save", style: "default", autoFocus: true },
      ],
    });
    setLastResult(`Three buttons result: ${result || "dismissed"}`);
  };

  const handleNonCancelable = async () => {
    const result = await showAlert({
      title: "Action Required",
      message: "You must make a choice to continue.",
      buttons: [
        { text: "Option A", value: "a" },
        { text: "Option B", value: "b" },
      ],
      cancelable: false,
    });
    setLastResult(`Non-cancelable result: ${result}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Alert" }} />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>Show Alert API</Text>
          <Text as="p" style={styles.description}>
            Promise-based alerts that use native dialogs on mobile and custom dialogs on web.
          </Text>
        </View>

        {lastResult ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>Last result: {lastResult}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Basic Alert</Text>
          <Text as="p" style={styles.description}>
            Simple notification with single OK button
          </Text>

          <Button style={styles.button} onPress={handleBasicAlert}>
            <Text style={styles.buttonText}>Show Basic Alert</Text>
          </Button>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Confirmation</Text>
          <Text as="p" style={styles.description}>
            Two buttons: Cancel and Confirm
          </Text>

          <Button style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>Show Confirm Dialog</Text>
          </Button>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Destructive Action</Text>
          <Text as="p" style={styles.description}>
            Delete confirmation with destructive styling
          </Text>

          <Button style={styles.button} onPress={handleDestructive}>
            <Text style={styles.buttonText}>Show Delete Confirm</Text>
          </Button>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Three Buttons</Text>
          <Text as="p" style={styles.description}>
            Save, Don't Save, or Cancel
          </Text>

          <Button style={styles.button} onPress={handleThreeButtons}>
            <Text style={styles.buttonText}>Show Save Dialog</Text>
          </Button>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Non-Cancelable</Text>
          <Text as="p" style={styles.description}>
            Must choose an option (Escape won't work on web)
          </Text>

          <Button style={styles.button} onPress={handleNonCancelable}>
            <Text style={styles.buttonText}>Show Required Choice</Text>
          </Button>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Platform Behavior</Text>
          <Text as="p" style={styles.description}>
            • <Text style={styles.bold}>Mobile:</Text> Uses native Alert.alert(){"\n"}
            • <Text style={styles.bold}>Web:</Text> Custom dialog with keyboard support{"\n"}
            • <Text style={styles.bold}>Promise-based:</Text> Async/await support{"\n"}
            • <Text style={styles.bold}>Typed:</Text> Type-safe button values
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Keyboard Support (Web)</Text>
          <Text as="p" style={styles.description}>
            • <Text style={styles.bold}>Escape:</Text> Close if cancelable{"\n"}
            • <Text style={styles.bold}>Tab:</Text> Navigate between buttons{"\n"}
            • <Text style={styles.bold}>Enter:</Text> Activate focused button{"\n"}
            • <Text style={styles.bold}>Auto-focus:</Text> Set autoFocus on a button
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.OS === "web" ? "#fff" : "#f2f2f7",
  },
  content: {
    ...Platform.select({
      web: {
        maxWidth: 800,
        marginHorizontal: "auto",
        width: "100%",
        paddingHorizontal: 24,
        paddingVertical: 32,
      },
      default: {
        padding: 16,
      },
    }),
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  bold: {
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  resultBox: {
    backgroundColor: "#f0f9ff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  resultText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
});

