import { Stack } from "expo-router";
import { View, Text, useAccordionItem } from "@native-ui-org/primitives";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@native-ui-org/primitives";
import { StyleSheet, Platform, ScrollView } from "react-native";
import React from "react";

// Chevron icon using CSS borders (no external deps)
function ChevronIcon({ color = "#666" }: { color?: string }) {
  const { open } = useAccordionItem();
  
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

export default function AccordionPreview() {
  const [singleValue, setSingleValue] = React.useState("item-1");
  const [multipleValue, setMultipleValue] = React.useState(["item-1", "item-3"]);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Accordion" }} />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>Accordion Primitive</Text>
          <Text as="p" style={styles.description}>
            Grouped collapsible components with single or multiple selection modes. Perfect for FAQs, navigation menus, and content organization.
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Platform Behavior</Text>
          <Text as="p" style={styles.description}>
            • <Text style={styles.bold}>Web:</Text> Uses ARIA attributes (aria-expanded, aria-controls, role="button"){"\n"}
            • <Text style={styles.bold}>Native:</Text> Uses accessibilityRole and accessibilityState{"\n"}
            • <Text style={styles.bold}>Selection:</Text> Single or multiple item selection modes{"\n"}
            • <Text style={styles.bold}>Composition:</Text> asChild pattern for flexible rendering
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Single Mode (Uncontrolled)</Text>
          <Text as="p" style={styles.description}>
            Only one item can be open at a time
          </Text>

          <Accordion type="single" defaultValue="item-1" collapsible style={styles.accordion}>
            <AccordionItem value="item-1" style={styles.item}>
              <AccordionTrigger style={styles.trigger}>
                <Text style={styles.triggerText}>What is React Native?</Text>
                <ChevronIcon />
              </AccordionTrigger>
              <AccordionContent style={styles.content_}>
                <Text style={styles.contentText}>
                  React Native is a framework for building native mobile applications using React.
                  It allows you to write code once and deploy to both iOS and Android platforms.
                </Text>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" style={styles.item}>
              <AccordionTrigger style={styles.trigger}>
                <Text style={styles.triggerText}>How does it work?</Text>
                <ChevronIcon />
              </AccordionTrigger>
              <AccordionContent style={styles.content_}>
                <Text style={styles.contentText}>
                  React Native uses native components instead of web components.
                  Your JavaScript code communicates with native modules via a bridge.
                </Text>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" style={styles.item}>
              <AccordionTrigger style={styles.trigger}>
                <Text style={styles.triggerText}>Why use primitives?</Text>
                <ChevronIcon />
              </AccordionTrigger>
              <AccordionContent style={styles.content_}>
                <Text style={styles.contentText}>
                  Primitives provide a solid, unstyled foundation for building design systems.
                  They handle behavior, accessibility, and cross-platform compatibility.
                </Text>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </View>

        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>Single Mode (Controlled)</Text>
          <Text as="p" style={styles.description}>
            Current value: {singleValue || "none"}
          </Text>

          <Accordion 
            type="single" 
            value={singleValue} 
            onValueChange={setSingleValue}
            collapsible
            style={styles.accordion}
          >
            <AccordionItem value="item-1" style={styles.item}>
              <AccordionTrigger style={styles.trigger}>
                <Text style={styles.triggerText}>Features</Text>
                <ChevronIcon />
              </AccordionTrigger>
              <AccordionContent style={styles.content_}>
                <Text style={styles.contentText}>
                  • Cross-platform (iOS, Android, Web){"\n"}
                  • Hot reloading{"\n"}
                  • Native performance{"\n"}
                  • Large ecosystem
                </Text>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" style={styles.item}>
              <AccordionTrigger style={styles.trigger}>
                <Text style={styles.triggerText}>Getting Started</Text>
                <ChevronIcon />
              </AccordionTrigger>
              <AccordionContent style={styles.content_}>
                <Text style={styles.contentText}>
                  1. Install Node.js and npm{"\n"}
                  2. Run: npx react-native init MyApp{"\n"}
                  3. Start coding!
                </Text>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" style={styles.item}>
              <AccordionTrigger style={styles.trigger}>
                <Text style={styles.triggerText}>Resources</Text>
                <ChevronIcon />
              </AccordionTrigger>
              <AccordionContent style={styles.content_}>
                <Text style={styles.contentText}>
                  • Official documentation{"\n"}
                  • Community forums{"\n"}
                  • GitHub repository{"\n"}
                  • Video tutorials
                </Text>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </View>

        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>Multiple Mode</Text>
          <Text as="p" style={styles.description}>
            Multiple items can be open simultaneously
          </Text>

          <Accordion 
            type="multiple" 
            value={multipleValue}
            onValueChange={setMultipleValue}
            style={styles.accordion}
          >
            <AccordionItem value="item-1" style={styles.item}>
              <AccordionTrigger style={styles.trigger}>
                <Text style={styles.triggerText}>Installation</Text>
                <ChevronIcon />
              </AccordionTrigger>
              <AccordionContent style={styles.content_}>
                <Text style={styles.contentText}>
                  npm install @native-ui-org/primitives
                </Text>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" style={styles.item}>
              <AccordionTrigger style={styles.trigger}>
                <Text style={styles.triggerText}>Import</Text>
                <ChevronIcon />
              </AccordionTrigger>
              <AccordionContent style={styles.content_}>
                <Text style={styles.contentText}>
                  {`import { View, Text } from "@native-ui-org/primitives";`}
                </Text>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" style={styles.item}>
              <AccordionTrigger style={styles.trigger}>
                <Text style={styles.triggerText}>Usage</Text>
                <ChevronIcon />
              </AccordionTrigger>
              <AccordionContent style={styles.content_}>
                <Text style={styles.contentText}>
                  {`<View style={{ padding: 16 }}>\n  <Text>Hello World</Text>\n</View>`}
                </Text>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Text as="p" style={[styles.description, { marginTop: 12 }]}>
            Open items: {multipleValue.join(", ") || "none"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>Non-Collapsible</Text>
          <Text as="p" style={styles.description}>
            In single mode, at least one item must remain open
          </Text>

          <Accordion 
            type="single" 
            defaultValue="item-1"
            collapsible={false}
            style={styles.accordion}
          >
            <AccordionItem value="item-1" style={styles.item}>
              <AccordionTrigger style={styles.trigger}>
                <Text style={styles.triggerText}>Always One Open</Text>
                <ChevronIcon />
              </AccordionTrigger>
              <AccordionContent style={styles.content_}>
                <Text style={styles.contentText}>
                  This section can't be closed if it's the only one open.
                  Try opening another section first.
                </Text>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" style={styles.item}>
              <AccordionTrigger style={styles.trigger}>
                <Text style={styles.triggerText}>Option 2</Text>
                <ChevronIcon />
              </AccordionTrigger>
              <AccordionContent style={styles.content_}>
                <Text style={styles.contentText}>
                  Open this to be able to close the first one.
                </Text>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </View>

        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>Disabled Item</Text>
          <Text as="p" style={styles.description}>
            Individual items can be disabled
          </Text>

          <Accordion type="single" collapsible style={styles.accordion}>
            <AccordionItem value="item-1" style={styles.item}>
              <AccordionTrigger style={styles.trigger}>
                <Text style={styles.triggerText}>Active Item</Text>
                <ChevronIcon />
              </AccordionTrigger>
              <AccordionContent style={styles.content_}>
                <Text style={styles.contentText}>
                  This item works normally
                </Text>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" disabled style={styles.item}>
              <AccordionTrigger style={[styles.trigger, styles.disabledTrigger]}>
                <Text style={[styles.triggerText, styles.disabledText]}>
                  Disabled Item
                </Text>
                <ChevronIcon color="#999" />
              </AccordionTrigger>
              <AccordionContent style={styles.content_}>
                <Text style={styles.contentText}>
                  This won't show
                </Text>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  bold: {
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  accordion: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    overflow: "hidden",
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
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

