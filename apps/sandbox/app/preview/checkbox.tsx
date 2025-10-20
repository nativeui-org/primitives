import { Stack } from "expo-router";
import { View, Text } from "@native-ui-org/primitives";
import { Checkbox, CheckboxLabel } from "@native-ui-org/primitives";
import { StyleSheet, Platform, ScrollView, Pressable } from "react-native";
import React, { useState } from "react";

export default function CheckboxPreview() {
  const [basic, setBasic] = useState(false);
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [newsletter, setNewsletter] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Checkbox" }} />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>Checkbox Primitive</Text>
          <Text as="p" style={styles.description}>
            Single checkbox component for individual selections. Click the label to toggle.
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Platform Behavior</Text>
          <Text as="p" style={styles.description}>
            • <Text style={styles.bold}>Web:</Text> Native label element with ARIA attributes{"\n"}
            • <Text style={styles.bold}>Native:</Text> Touch-friendly with accessibility support{"\n"}
            • <Text style={styles.bold}>Labels:</Text> Click text to toggle checkbox state
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Basic Usage</Text>
          <Text as="p" style={styles.description}>
            Simple checkbox with clickable label
          </Text>
          
          <Pressable style={styles.row} onPress={() => setBasic(!basic)}>
            <Checkbox 
              id="basic"
              checked={basic} 
              onCheckedChange={setBasic}
            />
            <CheckboxLabel htmlFor="basic" style={styles.label}>
              Enable feature
            </CheckboxLabel>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Form Example</Text>
          <Text as="p" style={styles.description}>
            Agreement checkboxes for terms and privacy
          </Text>
          
          <View style={styles.group}>
            <Pressable style={styles.row} onPress={() => setTerms(!terms)}>
              <Checkbox 
                id="terms"
                checked={terms} 
                onCheckedChange={setTerms}
                required
              />
              <CheckboxLabel htmlFor="terms" style={styles.label}>
                I agree to the Terms of Service
              </CheckboxLabel>
            </Pressable>
            
            <Pressable style={styles.row} onPress={() => setPrivacy(!privacy)}>
              <Checkbox 
                id="privacy"
                checked={privacy} 
                onCheckedChange={setPrivacy}
                required
              />
              <CheckboxLabel htmlFor="privacy" style={styles.label}>
                I have read the Privacy Policy
              </CheckboxLabel>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Default Checked</Text>
          <Text as="p" style={styles.description}>
            Checkbox starting in checked state
          </Text>
          
          <Pressable style={styles.row} onPress={() => setNewsletter(!newsletter)}>
            <Checkbox 
              id="newsletter"
              checked={newsletter} 
              onCheckedChange={setNewsletter}
            />
            <CheckboxLabel htmlFor="newsletter" style={styles.label}>
              Subscribe to newsletter
            </CheckboxLabel>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>States</Text>
          <Text as="p" style={styles.description}>
            Different visual states
          </Text>
          
          <View style={styles.stateRow}>
            <View style={styles.stateItem}>
              <Checkbox checked={false} />
              <Text style={styles.stateLabel}>Unchecked</Text>
            </View>
            
            <View style={styles.stateItem}>
              <Checkbox checked={true} />
              <Text style={styles.stateLabel}>Checked</Text>
            </View>
            
            <View style={styles.stateItem}>
              <Checkbox indeterminate={true} />
              <Text style={styles.stateLabel}>Indeterminate</Text>
            </View>
            
            <View style={styles.stateItem}>
              <Checkbox checked={true} disabled={true} />
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
    gap: 12,
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