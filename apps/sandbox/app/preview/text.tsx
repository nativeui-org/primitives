import { View, Text } from "@native-ui-org/primitives";
import { Platform } from "react-native";
import { Stack } from "expo-router";

export default function PreviewText() {
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f0f0f0" }}>
      {/* Route naming */}
      <Stack.Screen options={{ title: "Preview Text" }} />
      
      {/* Basic Text */}
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Basic Text primitive
      </Text>

      {/* Semantic HTML elements on web */}
      <Text as="h1" style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        Main Title (h1 on web)
      </Text>

      <Text as="h2" style={{ fontSize: 20, fontWeight: "600", marginBottom: 10 }}>
        Subtitle (h2 on web)
      </Text>

      <Text as="p" style={{ fontSize: 16, marginBottom: 15 }}>
        This is a paragraph that will render as a proper &lt;p&gt; tag on web,
        but as a Text component on React Native. This provides semantic meaning
        for screen readers and SEO.
      </Text>

      <Text as="span" style={{ color: "blue", fontWeight: "bold" }}>
        Inline text (span on web)
      </Text>

      {/* Using asChild */}
      {Platform.OS === "web" && (
        <View style={{ marginTop: 20 }}>
          <Text asChild>
            <p style={{ fontSize: 14, fontStyle: "italic", color: "gray" }}>This text is only available on Web, and uses asChild to rend without wrapper</p>
          </Text>
        </View>
      )}

      {/* Accessibility example */}
      <Text
        as="h3"
        role="heading"
        aria-level="3"
        style={{ fontSize: 18, fontWeight: "500", marginTop: 20 }}
      >
        Accessible Heading
      </Text>
    </View>
  );
}
