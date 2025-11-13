import { Stack } from "expo-router";
import { View, Text } from "@native-ui-org/primitives";
import { Radio, RadioLabel, RadioIndicator } from "@native-ui-org/primitives";
import { StyleSheet, Platform, ScrollView, Pressable } from "react-native";
import React, { useState } from "react";

export default function RadioPreview() {
  const [controlled, setControlled] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Radio" }} />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>Radio Primitive</Text>
          <Text as="p" style={styles.description}>
            Unstyled radio primitive. Use RadioIndicator to show checked state.
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Platform Behavior</Text>
          <Text as="p" style={styles.description}>
            • <Text style={styles.bold}>Web:</Text> Native label with ARIA (aria-checked, aria-disabled, aria-required){"\n"}
            • <Text style={styles.bold}>Native:</Text> Accessibility role and state{"\n"}
            • <Text style={styles.bold}>Keyboard:</Text> Space/Enter to toggle (web){"\n"}
            • <Text style={styles.bold}>Form:</Text> Hidden input for HTML form submission
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Controlled</Text>
          <Text as="p" style={styles.description}>
            Parent manages state
          </Text>

          <Pressable style={styles.row} onPress={() => setControlled(!controlled)}>
            <Radio
              id="controlled"
              checked={controlled}
              onCheckedChange={(checked) => setControlled(checked)}
              style={styles.radioBox}
            >
              <RadioIndicator>
                <View style={styles.dot} />
              </RadioIndicator>
            </Radio>
            <RadioLabel htmlFor="controlled" style={styles.label}>
              Controlled radio
            </RadioLabel>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Uncontrolled</Text>
          <Text as="p" style={styles.description}>
            Internal state with defaultChecked
          </Text>

          <Pressable style={styles.row}>
            <Radio
              id="uncontrolled"
              defaultChecked={true}
              style={styles.radioBox}
            >
              <RadioIndicator>
                <View style={styles.dot} />
              </RadioIndicator>
            </Radio>
            <RadioLabel htmlFor="uncontrolled" style={styles.label}>
              Uncontrolled radio (default checked)
            </RadioLabel>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>States</Text>
          <Text as="p" style={styles.description}>
            Different visual states
          </Text>

          <View style={styles.stateRow}>
            <View style={styles.stateItem}>
              <Radio checked={false} style={styles.radioBox}>
                <RadioIndicator>
                  <View style={styles.dot} />
                </RadioIndicator>
              </Radio>
              <Text style={styles.stateLabel}>Unchecked</Text>
            </View>

            <View style={styles.stateItem}>
              <Radio checked={true} style={styles.radioBox}>
                <RadioIndicator>
                  <View style={styles.dot} />
                </RadioIndicator>
              </Radio>
              <Text style={styles.stateLabel}>Checked</Text>
            </View>

            <View style={styles.stateItem}>
              <Radio checked={true} disabled={true} style={styles.radioBox}>
                <RadioIndicator>
                  <View style={styles.dot} />
                </RadioIndicator>
              </Radio>
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
  group: {
    gap: 16,
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
  radioBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
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

