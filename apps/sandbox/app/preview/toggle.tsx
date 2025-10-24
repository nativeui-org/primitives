import { Stack } from "expo-router";
import { View, Text } from "@native-ui-org/primitives";
import { Toggle } from "@native-ui-org/primitives";
import { StyleSheet, Platform, ScrollView, Pressable } from "react-native";
import React, { useState } from "react";

export default function TogglePreview() {
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [alignment, setAlignment] = useState<string[]>([]);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Toggle" }} />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>Toggle Primitive</Text>
          <Text as="p" style={styles.description}>
            Unstyled toggle primitive for button-like toggles (like formatting buttons).
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Platform Behavior</Text>
          <Text as="p" style={styles.description}>
            • <Text style={styles.bold}>Web:</Text> Native button with ARIA (aria-pressed, aria-disabled){"\n"}
            • <Text style={styles.bold}>Native:</Text> Accessibility role and state{"\n"}
            • <Text style={styles.bold}>Keyboard:</Text> Space/Enter to toggle (web){"\n"}
            • <Text style={styles.bold}>Touch:</Text> Tap to toggle on mobile
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Controlled</Text>
          <Text as="p" style={styles.description}>
            Parent manages state
          </Text>

          <Pressable style={styles.row} onPress={() => setBold(!bold)}>
            <Toggle
              pressed={bold}
              onPressedChange={setBold}
              style={styles.toggle}
            >
              <View style={[
                styles.toggleButton,
                bold && styles.toggleButtonActive
              ]}>
                <Text style={[
                  styles.toggleText,
                  bold && styles.toggleTextActive
                ]}>
                  B
                </Text>
              </View>
            </Toggle>
            <Text style={styles.label}>
              Bold formatting
            </Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Uncontrolled</Text>
          <Text as="p" style={styles.description}>
            Internal state with defaultPressed
          </Text>

          <Pressable style={styles.row}>
            <Toggle
              defaultPressed={true}
              style={styles.toggle}
            >
              <View style={[
                styles.toggleButton,
                styles.toggleButtonActive
              ]}>
                <Text style={[
                  styles.toggleText,
                  styles.toggleTextActive
                ]}>
                  I
                </Text>
              </View>
            </Toggle>
            <Text style={styles.label}>
              Uncontrolled toggle (default active)
            </Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Text Formatting Toolbar</Text>
          <Text as="p" style={styles.description}>
            Common toggle use case - formatting buttons
          </Text>

          <View style={styles.toolbar}>
            <Pressable style={styles.row} onPress={() => setBold(!bold)}>
              <Toggle
                pressed={bold}
                onPressedChange={setBold}
                style={styles.toggle}
              >
                <View style={[
                  styles.toggleButton,
                  bold && styles.toggleButtonActive
                ]}>
                  <Text style={[
                    styles.toggleText,
                    bold && styles.toggleTextActive
                  ]}>
                    B
                  </Text>
                </View>
              </Toggle>
            </Pressable>

            <Pressable style={styles.row} onPress={() => setItalic(!italic)}>
              <Toggle
                pressed={italic}
                onPressedChange={setItalic}
                style={styles.toggle}
              >
                <View style={[
                  styles.toggleButton,
                  italic && styles.toggleButtonActive
                ]}>
                  <Text style={[
                    styles.toggleText,
                    italic && styles.toggleTextActive
                  ]}>
                    I
                  </Text>
                </View>
              </Toggle>
            </Pressable>

            <Pressable style={styles.row} onPress={() => setUnderline(!underline)}>
              <Toggle
                pressed={underline}
                onPressedChange={setUnderline}
                style={styles.toggle}
              >
                <View style={[
                  styles.toggleButton,
                  underline && styles.toggleButtonActive
                ]}>
                  <Text style={[
                    styles.toggleText,
                    underline && styles.toggleTextActive
                  ]}>
                    U
                  </Text>
                </View>
              </Toggle>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>States</Text>
          <Text as="p" style={styles.description}>
            Different visual states
          </Text>

          <View style={styles.stateRow}>
            <View style={styles.stateItem}>
              <Toggle pressed={false} style={styles.toggle}>
                <View style={styles.toggleButton}>
                  <Text style={styles.toggleText}>Off</Text>
                </View>
              </Toggle>
              <Text style={styles.stateLabel}>Inactive</Text>
            </View>

            <View style={styles.stateItem}>
              <Toggle pressed={true} style={styles.toggle}>
                <View style={[styles.toggleButton, styles.toggleButtonActive]}>
                  <Text style={[styles.toggleText, styles.toggleTextActive]}>On</Text>
                </View>
              </Toggle>
              <Text style={styles.stateLabel}>Active</Text>
            </View>

            <View style={styles.stateItem}>
              <Toggle pressed={true} disabled={true} style={styles.toggle}>
                <View style={[styles.toggleButton, styles.toggleButtonActive, styles.toggleDisabled]}>
                  <Text style={[styles.toggleText, styles.toggleTextActive]}>D</Text>
                </View>
              </Toggle>
              <Text style={styles.stateLabel}>Disabled</Text>
            </View>
          </View>
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
    marginBottom: 32,
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
    marginBottom: 16,
    lineHeight: 20,
  },
  bold: {
    fontWeight: "600",
  },
  toolbar: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  label: {
    fontSize: 16,
    color: "#000",
  },
  toggle: {
    // Toggle container styles
  },
  toggleButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  toggleButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#0056CC",
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },
  toggleDisabled: {
    opacity: 0.5,
  },
  stateRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
  },
  stateItem: {
    alignItems: "center",
    gap: 8,
  },
  stateLabel: {
    fontSize: 12,
    color: "#666",
  },
});
