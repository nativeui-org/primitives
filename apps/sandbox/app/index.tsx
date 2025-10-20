import { Link, Stack } from "expo-router";
import { View, Text } from "@native-ui-org/primitives";
import { StyleSheet, Platform } from "react-native";

const primitives = [
  { name: "View", path: "/preview/view", description: "Layout container with cross‑platform a11y & asChild" },
  { name: "Text", path: "/preview/text", description: "Unified Text: RN on mobile, semantic tags on web" },
  { name: "Collapsible", path: "/preview/collapsible", description: "Expandable content with controlled/uncontrolled state" },
  { name: "Accordion", path: "/preview/accordion", description: "Grouped collapsibles with single or multiple selection" },
  { name: "Alert", path: "/preview/alert", description: "Cross-platform alerts: native on mobile, custom on web" },
  { name: "Portal", path: "/preview/portal", description: "Render children outside React tree" },
  { name: "Aspect Ratio", path: "/preview/aspect-ratio", description: "Maintain specific aspect ratios for responsive content" },
  { name: "Avatar", path: "/preview/avatar", description: "User profile images with intelligent fallback text support" },
  { name: "Checkbox", path: "/preview/checkbox", description: "Individual checkbox with clickable labels" },
  { name: "CheckboxGroup", path: "/preview/checkbox-group", description: "Manage multiple checkboxes with coordinated state" },
];

export default function Home() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Primitives" }} />

      <View style={styles.header}>
        <Text as="h1" style={styles.title}>Primitives</Text>
        <Text as="p" style={styles.subtitle}>@native-ui-org</Text>
      </View>

      <View style={styles.list}>
        {primitives.map((primitive, index) => (
          <View key={primitive.name}>
            <Link href={primitive.path}>
              <View style={styles.item}>
                <Text as="h2" style={styles.itemTitle}>{primitive.name}</Text>
                <Text as="p" style={styles.itemDescription}>{primitive.description}</Text>
              </View>
            </Link>
            {index < primitives.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      web: {
        paddingHorizontal: 24,
        paddingVertical: 32,
      },
      default: {
        backgroundColor: "#f2f2f7",
      },
    }),
  },
  header: {
    ...Platform.select({
      web: {
        marginBottom: 24,
      },
      default: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
        backgroundColor: "#f2f2f7",
      },
    }),
  },
  title: {
    ...Platform.select({
      web: {
        fontSize: 28,
        fontWeight: "700",
        color: "#000",
      },
      default: {
        fontSize: 34,
        fontWeight: "700",
        color: "#000",
        letterSpacing: 0.4,
      },
    }),
  },
  subtitle: {
    ...Platform.select({
      web: {
        fontSize: 15,
        color: "#666",
        marginTop: 4,
      },
      default: {
        fontSize: 13,
        color: "#8e8e93",
        marginTop: 2,
      },
    }),
  },
  list: {
    ...Platform.select({
      web: {
        gap: 0,
      },
      default: {
        backgroundColor: "white",
        borderRadius: 10,
        marginHorizontal: 16,
        overflow: "hidden",
      },
    }),
  },
  item: {
    ...Platform.select({
      web: {
        paddingVertical: 14,
      },
      default: {
        paddingVertical: 12,
        paddingHorizontal: 16,
      },
    }),
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Platform.OS === "web" ? "#e5e5e5" : "#c6c6c8",
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: Platform.OS === "web" ? "500" : "400",
    color: "#000",
  },
  itemDescription: {
    fontSize: 13,
    color: Platform.OS === "web" ? "#666" : "#8e8e93",
    marginTop: 2,
  },
});
