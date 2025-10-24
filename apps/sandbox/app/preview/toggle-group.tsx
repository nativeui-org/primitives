import { Stack } from "expo-router";
import { View, Text } from "@native-ui-org/primitives";
import { ToggleGroup, Toggle } from "@native-ui-org/primitives";
import { StyleSheet, Platform, ScrollView, Pressable } from "react-native";
import React, { useState } from "react";

export default function ToggleGroupPreview() {
  const [formatting, setFormatting] = useState<string[]>([]);
  const [alignment, setAlignment] = useState<string[]>([]);
  const [theme, setTheme] = useState<string[]>([]);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "ToggleGroup" }} />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>ToggleGroup Primitive</Text>
          <Text as="p" style={styles.description}>
            Unstyled toggle group primitive for managing multiple toggles with coordinated state.
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Platform Behavior</Text>
          <Text as="p" style={styles.description}>
            • <Text style={styles.bold}>Web:</Text> Native group with ARIA (role="group"){"\n"}
            • <Text style={styles.bold}>Native:</Text> Accessibility group semantics{"\n"}
            • <Text style={styles.bold}>State:</Text> Coordinated value management{"\n"}
            • <Text style={styles.bold}>Multiple:</Text> Allow multiple selections
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Text Formatting Toolbar</Text>
          <Text as="p" style={styles.description}>
            Multiple formatting options
          </Text>

          <ToggleGroup 
            testID="formatting-group"
            value={formatting} 
            onValueChange={setFormatting}
            style={styles.group}
          >
            <View style={styles.toolbar}>
              <Toggle value="bold" style={styles.toggle}>
                <View style={[
                  styles.toggleButton,
                  formatting.includes("bold") && styles.toggleButtonActive
                ]}>
                  <Text style={[
                    styles.toggleText,
                    formatting.includes("bold") && styles.toggleTextActive
                  ]}>
                    B
                  </Text>
                </View>
              </Toggle>

              <Toggle value="italic" style={styles.toggle}>
                <View style={[
                  styles.toggleButton,
                  formatting.includes("italic") && styles.toggleButtonActive
                ]}>
                  <Text style={[
                    styles.toggleText,
                    formatting.includes("italic") && styles.toggleTextActive
                  ]}>
                    I
                  </Text>
                </View>
              </Toggle>

              <Toggle value="underline" style={styles.toggle}>
                <View style={[
                  styles.toggleButton,
                  formatting.includes("underline") && styles.toggleButtonActive
                ]}>
                  <Text style={[
                    styles.toggleText,
                    formatting.includes("underline") && styles.toggleTextActive
                  ]}>
                    U
                  </Text>
                </View>
              </Toggle>

              <Toggle value="strikethrough" style={styles.toggle}>
                <View style={[
                  styles.toggleButton,
                  formatting.includes("strikethrough") && styles.toggleButtonActive
                ]}>
                  <Text style={[
                    styles.toggleText,
                    formatting.includes("strikethrough") && styles.toggleTextActive
                  ]}>
                    S
                  </Text>
                </View>
              </Toggle>
            </View>
          </ToggleGroup>
          <Text style={styles.currentValue}>Active: {formatting.join(", ") || "None"}</Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Text Alignment</Text>
          <Text as="p" style={styles.description}>
            Alignment controls
          </Text>

          <ToggleGroup 
            testID="alignment-group"
            value={alignment} 
            onValueChange={setAlignment}
            style={styles.group}
          >
            <View style={styles.toolbar}>
              <Toggle value="left" style={styles.toggle}>
                <View style={[
                  styles.toggleButton,
                  alignment.includes("left") && styles.toggleButtonActive
                ]}>
                  <Text style={[
                    styles.toggleText,
                    alignment.includes("left") && styles.toggleTextActive
                  ]}>
                    ←
                  </Text>
                </View>
              </Toggle>

              <Toggle value="center" style={styles.toggle}>
                <View style={[
                  styles.toggleButton,
                  alignment.includes("center") && styles.toggleButtonActive
                ]}>
                  <Text style={[
                    styles.toggleText,
                    alignment.includes("center") && styles.toggleTextActive
                  ]}>
                    ↔
                  </Text>
                </View>
              </Toggle>

              <Toggle value="right" style={styles.toggle}>
                <View style={[
                  styles.toggleButton,
                  alignment.includes("right") && styles.toggleButtonActive
                ]}>
                  <Text style={[
                    styles.toggleText,
                    alignment.includes("right") && styles.toggleTextActive
                  ]}>
                    →
                  </Text>
                </View>
              </Toggle>

              <Toggle value="justify" style={styles.toggle}>
                <View style={[
                  styles.toggleButton,
                  alignment.includes("justify") && styles.toggleButtonActive
                ]}>
                  <Text style={[
                    styles.toggleText,
                    alignment.includes("justify") && styles.toggleTextActive
                  ]}>
                    ≡
                  </Text>
                </View>
              </Toggle>
            </View>
          </ToggleGroup>
          <Text style={styles.currentValue}>Active: {alignment.join(", ") || "None"}</Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Theme Selection</Text>
          <Text as="p" style={styles.description}>
            Multiple theme options
          </Text>

          <ToggleGroup 
            testID="theme-group"
            value={theme} 
            onValueChange={setTheme}
            style={styles.group}
          >
            <View style={styles.themeGroup}>
              <Toggle value="light" style={styles.toggle}>
                <View style={[
                  styles.themeButton,
                  theme.includes("light") && styles.themeButtonActive
                ]}>
                  <Text style={[
                    styles.themeText,
                    theme.includes("light") && styles.themeTextActive
                  ]}>
                    ☀️ Light
                  </Text>
                </View>
              </Toggle>

              <Toggle value="dark" style={styles.toggle}>
                <View style={[
                  styles.themeButton,
                  theme.includes("dark") && styles.themeButtonActive
                ]}>
                  <Text style={[
                    styles.themeText,
                    theme.includes("dark") && styles.themeTextActive
                  ]}>
                    🌙 Dark
                  </Text>
                </View>
              </Toggle>

              <Toggle value="auto" style={styles.toggle}>
                <View style={[
                  styles.themeButton,
                  theme.includes("auto") && styles.themeButtonActive
                ]}>
                  <Text style={[
                    styles.themeText,
                    theme.includes("auto") && styles.themeTextActive
                  ]}>
                    🔄 Auto
                  </Text>
                </View>
              </Toggle>
            </View>
          </ToggleGroup>
          <Text style={styles.currentValue}>Active: {theme.join(", ") || "None"}</Text>
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
  group: {
    marginBottom: 16,
  },
  toolbar: {
    flexDirection: "row",
    gap: 8,
  },
  themeGroup: {
    gap: 8,
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
  themeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#F2F2F7",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  themeButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#0056CC",
  },
  themeText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  themeTextActive: {
    color: "#FFFFFF",
  },
  currentValue: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
});
