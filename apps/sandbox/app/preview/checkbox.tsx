import { Stack } from "expo-router";
import { View, Text, Button } from "@native-ui-org/primitives";
import { Checkbox, CheckboxLabel, CheckboxIndicator } from "@native-ui-org/primitives";
import { StyleSheet, Platform, ScrollView } from "react-native";
import React, { useState } from "react";

export default function CheckboxPreview() {
  const [controlled, setControlled] = useState(false);
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Checkbox" }} />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>Checkbox Primitive</Text>
          <Text as="p" style={styles.description}>
            Unstyled checkbox primitive. Use CheckboxIndicator to show checked state.
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

          <Button style={styles.row} onPress={() => setControlled(!controlled)}>
            <Checkbox
              id="controlled"
              checked={controlled}
              onCheckedChange={(checked) => setControlled(checked === true)}
              style={styles.checkboxBox}
            >
              <CheckboxIndicator>
                <View style={styles.checkmark} />
              </CheckboxIndicator>
            </Checkbox>
            <CheckboxLabel htmlFor="controlled" style={styles.label}>
              Controlled checkbox
            </CheckboxLabel>
          </Button>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Uncontrolled</Text>
          <Text as="p" style={styles.description}>
            Internal state with defaultChecked
          </Text>

          <Button style={styles.row}>
            <Checkbox
              id="uncontrolled"
              defaultChecked={true}
              style={styles.checkboxBox}
            >
              <CheckboxIndicator>
                <View style={styles.checkmark} />
              </CheckboxIndicator>
            </Checkbox>
            <CheckboxLabel htmlFor="uncontrolled" style={styles.label}>
              Uncontrolled checkbox (default checked)
            </CheckboxLabel>
          </Button>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Form Example</Text>
          <Text as="p" style={styles.description}>
            Agreement checkboxes with validation
          </Text>

          <View style={styles.group}>
            <Button style={styles.row} onPress={() => setTerms(!terms)}>
              <Checkbox
                id="terms"
                name="terms"
                checked={terms}
                onCheckedChange={(checked) => setTerms(checked === true)}
                required
                style={styles.checkboxBox}
              >
                <CheckboxIndicator>
                  <View style={styles.checkmark} />
                </CheckboxIndicator>
              </Checkbox>
              <CheckboxLabel htmlFor="terms" style={styles.label}>
                I agree to the Terms of Service
              </CheckboxLabel>
            </Button>

            <Button style={styles.row} onPress={() => setPrivacy(!privacy)}>
              <Checkbox
                id="privacy"
                name="privacy"
                checked={privacy}
                onCheckedChange={(checked) => setPrivacy(checked === true)}
                required
                style={styles.checkboxBox}
              >
                <CheckboxIndicator>
                  <View style={styles.checkmark} />
                </CheckboxIndicator>
              </Checkbox>
              <CheckboxLabel htmlFor="privacy" style={styles.label}>
                I have read the Privacy Policy
              </CheckboxLabel>
            </Button>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>States</Text>
          <Text as="p" style={styles.description}>
            Different visual states
          </Text>

          <View style={styles.stateRow}>
            <View style={styles.stateItem}>
              <Checkbox checked={false} style={styles.checkboxBox}>
                <CheckboxIndicator>
                  <View style={styles.checkmark} />
                </CheckboxIndicator>
              </Checkbox>
              <Text style={styles.stateLabel}>Unchecked</Text>
            </View>

            <View style={styles.stateItem}>
              <Checkbox checked={true} style={styles.checkboxBox}>
                <CheckboxIndicator>
                  <View style={styles.checkmark} />
                </CheckboxIndicator>
              </Checkbox>
              <Text style={styles.stateLabel}>Checked</Text>
            </View>

            <View style={styles.stateItem}>
              <Checkbox checked="indeterminate" style={styles.checkboxBox}>
                <CheckboxIndicator>
                  <View style={styles.indeterminateMark} />
                </CheckboxIndicator>
              </Checkbox>
              <Text style={styles.stateLabel}>Indeterminate</Text>
            </View>

            <View style={styles.stateItem}>
              <Checkbox checked={true} disabled={true} style={styles.checkboxBox}>
                <CheckboxIndicator>
                  <View style={styles.checkmark} />
                </CheckboxIndicator>
              </Checkbox>
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
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  checkmark: {
    width: 12,
    height: 12,
    backgroundColor: "#007AFF",
    borderRadius: 2,
  },
  indeterminateMark: {
    width: 12,
    height: 2,
    backgroundColor: "#007AFF",
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