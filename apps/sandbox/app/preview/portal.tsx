import { Stack } from "expo-router";
import { View, Text, Portal } from "@native-ui-org/primitives";
import { StyleSheet, Platform, ScrollView, Pressable } from "react-native";
import React, { useState } from "react";

export default function PortalPreview() {
  const [showPortal, setShowPortal] = useState(false);
  const [showCustomPortal, setShowCustomPortal] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Portal" }} />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>Portal Primitive</Text>
          <Text as="p" style={styles.description}>
            Render children outside the normal React tree hierarchy.
            Essential for overlays, modals, and floating UI components.
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Platform Behavior</Text>
          <Text as="p" style={styles.description}>
            • <Text style={styles.bold}>Web:</Text> Uses ReactDOM.createPortal() to render to DOM container{"\n"}
            • <Text style={styles.bold}>Native:</Text> Renders children normally (no portal behavior needed){"\n"}
            • <Text style={styles.bold}>SSR Safe:</Text> Waits for mount to avoid hydration issues{"\n"}
            • <Text style={styles.bold}>Custom Container:</Text> Specify where to render (web only)
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Basic Portal</Text>
          <Text as="p" style={styles.description}>
            Renders content to document.body on web, normally on native
          </Text>

          <Pressable style={styles.button} onPress={() => setShowPortal(!showPortal)}>
            <Text style={styles.buttonText}>
              {showPortal ? "Hide" : "Show"} Portal Content
            </Text>
          </Pressable>

          {showPortal && (
            <Portal>
              <View style={styles.portalContent}>
                <Text style={styles.portalTitle}>Portal Content</Text>
                <Text style={styles.portalText}>
                  This content is rendered outside the normal React tree!
                </Text>
                <Text style={styles.portalText}>
                  On web: Rendered to document.body
                </Text>
                <Text style={styles.portalText}>
                  On native: Rendered normally
                </Text>
                <Pressable
                  style={styles.closeButton}
                  onPress={() => setShowPortal(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
              </View>
            </Portal>
          )}
        </View>

        {Platform.OS === "web" && (
          <View style={styles.section}>
            <Text as="h3" style={styles.subTitle}>Custom Container (Web Only)</Text>
            <Text as="p" style={styles.description}>
              Specify a custom DOM container to render into
            </Text>

            <Pressable style={styles.button} onPress={() => setShowCustomPortal(!showCustomPortal)}>
              <Text style={styles.buttonText}>
                {showCustomPortal ? "Hide" : "Show"} Custom Portal
              </Text>
            </Pressable>

            <View style={styles.customContainer}>
              <Text style={styles.containerLabel}>Custom Container:</Text>
              <View testID="custom-portal-root" style={styles.customRoot}>
                <Text style={styles.containerText}>Portal will render here</Text>
              </View>
            </View>


            {showCustomPortal && (
              <Portal container={document.getElementById("custom-portal-root")}>
                <View style={styles.customPortalContent}>
                  <Text style={styles.portalTitle}>Custom Portal!</Text>
                  <Text style={styles.portalText}>
                    Rendered in the custom container above
                  </Text>
                  <Pressable
                    style={styles.closeButton}
                    onPress={() => setShowCustomPortal(false)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </Pressable>
                </View>
              </Portal>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Use Cases</Text>
          <Text as="p" style={styles.description}>
            • <Text style={styles.bold}>Modals:</Text> Escape z-index stacking context{"\n"}
            • <Text style={styles.bold}>Tooltips:</Text> Render above all content{"\n"}
            • <Text style={styles.bold}>Dropdowns:</Text> Avoid overflow hidden issues{"\n"}
            • <Text style={styles.bold}>Floating UI:</Text> Position relative to viewport{"\n"}
            • <Text style={styles.bold}>Notifications:</Text> Global overlay system
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Implementation</Text>
          <Text as="p" style={styles.description}>
            Portal uses ReactDOM.createPortal() on web and renders normally on native.
            It's SSR-safe by waiting for mount and handles custom containers gracefully.
          </Text>
        </View>
      </View>
    </ScrollView >
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
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  portalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    margin: 20,
    ...Platform.select({
      web: {
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
        border: "1px solid #e0e0e0",
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
  portalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  portalText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 12,
  },
  closeButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
  },
  customContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
  },
  containerLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 8,
  },
  customRoot: {
    minHeight: 100,
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 16,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  containerText: {
    fontSize: 14,
    color: "#6c757d",
    fontStyle: "italic",
  },
  customPortalContent: {
    backgroundColor: "#e3f2fd",
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#2196f3",
  },
});
