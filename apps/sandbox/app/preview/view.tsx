import { View, Text } from "@native-ui-org/primitives";
import { Platform, ScrollView } from "react-native";
import { Stack } from "expo-router";

export default function PreviewView() {
  return (
    <ScrollView style={{ flex: 1 }}>
      {/* Route naming */}
      <Stack.Screen options={{ title: "Preview View" }} />

      <View style={{ flex: 1, padding: 20, backgroundColor: "#f9f9f9" }}>
        {/* Basic View */}
        <Text style={{ fontSize: 18, marginBottom: 20, fontWeight: "bold" }}>
          View Primitive Examples
        </Text>

        {/* Simple container */}
        <View style={{ padding: 16, backgroundColor: "white", marginBottom: 16, borderRadius: 8 }}>
          <Text style={{ fontSize: 16 }}>Simple View container</Text>
          <Text style={{ fontSize: 14, color: "#666", marginTop: 8 }}>
            Basic building block for layouts
          </Text>
        </View>

        {/* Flexbox layout */}
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
          <View style={{ flex: 1, padding: 16, backgroundColor: "#e3f2fd", borderRadius: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "600" }}>Flex 1</Text>
          </View>
          <View style={{ flex: 1, padding: 16, backgroundColor: "#f3e5f5", borderRadius: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "600" }}>Flex 1</Text>
          </View>
        </View>

        {/* Nested Views */}
        <View style={{ backgroundColor: "white", padding: 16, marginBottom: 16, borderRadius: 8 }}>
          <Text style={{ fontSize: 16, marginBottom: 12 }}>Nested Views</Text>
          <View style={{ backgroundColor: "#f5f5f5", padding: 12, borderRadius: 6 }}>
            <Text style={{ fontSize: 14, color: "#333" }}>Child View Level 1</Text>
            <View style={{ backgroundColor: "#e0e0e0", padding: 10, marginTop: 8, borderRadius: 4 }}>
              <Text style={{ fontSize: 12, color: "#555" }}>Child View Level 2</Text>
            </View>
          </View>
        </View>

        {/* Using asChild */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 14, marginBottom: 8, color: "#666" }}>
            Using asChild (renders child without wrapper):
          </Text>
          <View asChild>
            <View style={{ padding: 16, backgroundColor: "#fff3e0", borderRadius: 8 }}>
              <Text style={{ fontSize: 14 }}>This View uses asChild</Text>
            </View>
          </View>
        </View>

        {/* Accessibility example */}
        <View
          role="region"
          aria-label="Info section"
          style={{ padding: 16, backgroundColor: "#e8f5e9", borderRadius: 8, marginBottom: 16 }}
        >
          <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 4 }}>
            Accessible View
          </Text>
          <Text style={{ fontSize: 12, color: "#2e7d32" }}>
            With role and aria-label for web accessibility
          </Text>
        </View>

        {/* Cross-platform "as" prop example */}
        <View style={{ backgroundColor: "white", padding: 16, marginBottom: 16, borderRadius: 8 }}>
          <Text as="h2" style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
            Cross-Platform Title
          </Text>
          <Text as="p" style={{ fontSize: 14, color: "#333", marginBottom: 8 }}>
            This works on both web and mobile! On web, this renders as semantic HTML
            (h2 and p tags) for SEO. On mobile, it renders as regular Text components.
          </Text>
          <Text as="p" style={{ fontSize: 14, color: "#666" }}>
            Platform: <Text style={{ fontWeight: "600" }}>{Platform.OS}</Text>
          </Text>
        </View>

        {/* Web only - using asChild with semantic HTML */}
        {Platform.OS === "web" && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, marginBottom: 8, color: "#666" }}>
              Web only - Semantic HTML elements:
            </Text>

            <View asChild>
              <section style={{ padding: 16, backgroundColor: "#fff3e0", borderRadius: 8, marginBottom: 12, display: 'flex', flexDirection: 'column' }}>
                <Text as="h2" style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
                  Semantic Section Element
                </Text>
                <Text as="p" style={{ fontSize: 14, color: "#666" }}>
                  This is a proper HTML section with h2 and p tags on web.
                </Text>
              </section>
            </View>

            <View asChild>
              <article style={{ padding: 16, backgroundColor: "#e3f2fd", borderRadius: 8, display: 'flex', flexDirection: 'column' }}>
                <Text as="h3" style={{ fontSize: 15, fontWeight: "600", marginBottom: 8 }}>
                  Article Element
                </Text>
                <Text as="p" style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                  Using asChild to render semantic article, header, and footer elements.
                </Text>
                <Text as="span" style={{ fontSize: 12, color: "#999", fontStyle: "italic" }}>
                  Perfect for SEO and accessibility
                </Text>
              </article>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
