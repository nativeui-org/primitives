import { Stack } from "expo-router";
import { View, Text, useCollapsible } from "@native-ui-org/primitives";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@native-ui-org/primitives";
import { StyleSheet, Platform, ScrollView } from "react-native";
import React from "react";

function ChevronIcon({ color = "#666" }: { color?: string }) {
  const { open } = useCollapsible();
  
  return (
    <View
      style={[
        styles.chevron,
        { borderTopColor: color },
        open && styles.chevronRotated,
      ]}
    />
  );
}

export default function CollapsiblePreview() {
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(true);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Collapsible" }} />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>Basic (Uncontrolled)</Text>
          <Text as="p" style={styles.description}>
            Click to toggle content visibility
          </Text>

          <Collapsible style={styles.collapsible}>
            <CollapsibleTrigger style={styles.trigger}>
              <Text style={styles.triggerText}>Show more information</Text>
              <ChevronIcon />
            </CollapsibleTrigger>
            <CollapsibleContent style={styles.content_}>
              <Text style={styles.contentText}>
                This is the collapsible content. It can contain any React Native components.
              </Text>
            </CollapsibleContent>
          </Collapsible>
        </View>

        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>Controlled State</Text>
          <Text as="p" style={styles.description}>
            State managed externally: {open1 ? "Open" : "Closed"}
          </Text>

          <Collapsible 
            open={open1} 
            onOpenChange={setOpen1}
            style={styles.collapsible}
          >
            <CollapsibleTrigger style={styles.trigger}>
              <Text style={styles.triggerText}>
                {open1 ? "Hide" : "Show"} details
              </Text>
              <ChevronIcon />
            </CollapsibleTrigger>
            <CollapsibleContent style={styles.content_}>
              <Text style={styles.contentText}>
                This collapsible is controlled. The parent component manages its state.
              </Text>
            </CollapsibleContent>
          </Collapsible>
        </View>

        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>Default Open</Text>
          <Text as="p" style={styles.description}>
            Starts in the open state
          </Text>

          <Collapsible defaultOpen style={styles.collapsible}>
            <CollapsibleTrigger style={styles.trigger}>
              <Text style={styles.triggerText}>FAQ: What is React Native?</Text>
              <ChevronIcon />
            </CollapsibleTrigger>
            <CollapsibleContent style={styles.content_}>
              <Text style={styles.contentText}>
                React Native is a framework for building native mobile applications using React.
                It allows you to write code once and deploy to both iOS and Android platforms.
              </Text>
            </CollapsibleContent>
          </Collapsible>
        </View>

        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>Disabled</Text>
          <Text as="p" style={styles.description}>
            Cannot be toggled
          </Text>

          <Collapsible disabled style={styles.collapsible}>
            <CollapsibleTrigger style={[styles.trigger, styles.disabledTrigger]}>
              <Text style={[styles.triggerText, styles.disabledText]}>
                Disabled (can't open)
              </Text>
              <ChevronIcon color="#999" />
            </CollapsibleTrigger>
            <CollapsibleContent style={styles.content_}>
              <Text style={styles.contentText}>
                This content won't show because the collapsible is disabled.
              </Text>
            </CollapsibleContent>
          </Collapsible>
        </View>

        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>Multiple Collapsibles</Text>
          <Text as="p" style={styles.description}>
            Multiple items can be open simultaneously
          </Text>

          <View style={styles.group}>
            <Collapsible style={styles.collapsible}>
              <CollapsibleTrigger style={styles.trigger}>
                <Text style={styles.triggerText}>Section 1</Text>
                <ChevronIcon />
              </CollapsibleTrigger>
              <CollapsibleContent style={styles.content_}>
                <Text style={styles.contentText}>Content for section 1</Text>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible style={styles.collapsible}>
              <CollapsibleTrigger style={styles.trigger}>
                <Text style={styles.triggerText}>Section 2</Text>
                <ChevronIcon />
              </CollapsibleTrigger>
              <CollapsibleContent style={styles.content_}>
                <Text style={styles.contentText}>Content for section 2</Text>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible 
              open={open2} 
              onOpenChange={setOpen2}
              style={styles.collapsible}
            >
              <CollapsibleTrigger style={styles.trigger}>
                <Text style={styles.triggerText}>Section 3 (Controlled)</Text>
                <ChevronIcon />
              </CollapsibleTrigger>
              <CollapsibleContent style={styles.content_}>
                <Text style={styles.contentText}>Content for section 3</Text>
              </CollapsibleContent>
            </Collapsible>
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
    fontSize: 20,
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
  group: {
    gap: 12,
  },
  collapsible: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    overflow: "hidden",
    marginBottom: 12,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  triggerText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    flex: 1,
  },
  chevron: {
    width: 0,
    height: 0,
    marginLeft: 12,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderStyle: "solid",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  chevronRotated: {
    transform: [{ rotate: "180deg" }],
  },
  content_: {
    padding: 16,
    backgroundColor: "#fff",
  },
  contentText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  disabledTrigger: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#999",
  },
});

