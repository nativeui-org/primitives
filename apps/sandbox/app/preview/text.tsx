import { View, Text } from "@native-ui-org/primitives";
import { Platform, StyleSheet, ScrollView } from "react-native";
import { Stack } from "expo-router";

export default function PreviewText() {
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Text" }} />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>Text Primitive</Text>
          <Text as="p" style={styles.description}>
            Unified text component that renders semantic HTML elements on web and regular Text components on native. Provides consistent typography and accessibility across platforms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Platform Behavior</Text>
          <Text as="p" style={styles.description}>
            • <Text style={styles.bold}>Web:</Text> Renders semantic HTML (h1, h2, p, span) with proper accessibility{"\n"}
            • <Text style={styles.bold}>Native:</Text> Uses React Native Text component{"\n"}
            • <Text style={styles.bold}>Typography:</Text> Consistent font rendering across platforms{"\n"}
            • <Text style={styles.bold}>Accessibility:</Text> Automatic ARIA attributes and semantic meaning
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Semantic HTML Elements</Text>
          <Text as="p" style={styles.description}>
            Using the 'as' prop to render semantic HTML on web
          </Text>
          
          <View style={styles.semanticContainer}>
            <Text as="h1" style={styles.h1}>
              Main Title (h1 on web)
            </Text>

            <Text as="h2" style={styles.h2}>
              Subtitle (h2 on web)
            </Text>

            <Text as="h3" style={styles.h3}>
              Section Title (h3 on web)
            </Text>

            <Text as="p" style={styles.paragraph}>
              This is a paragraph that will render as a proper &lt;p&gt; tag on web,
              but as a Text component on React Native. This provides semantic meaning
              for screen readers and SEO.
            </Text>

            <Text as="span" style={styles.span}>
              This is inline text using span element
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Typography Hierarchy</Text>
          <Text as="p" style={styles.description}>
            Different text sizes and weights for content hierarchy
          </Text>
          
          <View style={styles.typographyContainer}>
            <Text style={styles.displayText}>Display Text</Text>
            <Text style={styles.headlineText}>Headline Text</Text>
            <Text style={styles.titleText}>Title Text</Text>
            <Text style={styles.subtitleText}>Subtitle Text</Text>
            <Text style={styles.bodyText}>Body Text</Text>
            <Text style={styles.captionText}>Caption Text</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Text Styling</Text>
          <Text as="p" style={styles.description}>
            Various text styles and formatting options
          </Text>
          
          <View style={styles.stylingContainer}>
            <Text style={styles.boldText}>Bold Text</Text>
            <Text style={styles.italicText}>Italic Text</Text>
            <Text style={styles.underlineText}>Underlined Text</Text>
            <Text style={styles.strikethroughText}>Strikethrough Text</Text>
            <Text style={styles.coloredText}>Colored Text</Text>
            <Text style={styles.highlightedText}>Highlighted Text</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Cross-Platform Example</Text>
          <Text as="p" style={styles.description}>
            Same component, different rendering based on platform
          </Text>
          
          <View style={styles.platformContainer}>
            <Text as="h2" style={styles.platformTitle}>
              Cross-Platform Title
            </Text>
            <Text as="p" style={styles.platformText}>
              This text component automatically adapts to the platform:
            </Text>
            <Text as="p" style={styles.platformText}>
              • <Text style={styles.bold}>Web:</Text> Renders as &lt;h2&gt; and &lt;p&gt; tags{"\n"}
              • <Text style={styles.bold}>Native:</Text> Renders as Text components{"\n"}
              • <Text style={styles.bold}>Platform:</Text> <Text style={styles.bold}>{Platform.OS}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Accessibility Features</Text>
          <Text as="p" style={styles.description}>
            Automatic accessibility attributes and semantic meaning
          </Text>
          
          <View style={styles.accessibilityContainer}>
            <Text as="h1" style={styles.accessibilityTitle}>
              Accessible Heading
            </Text>
            <Text as="p" style={styles.accessibilityText}>
              This heading automatically gets proper ARIA attributes on web
              and accessibilityRole on native for screen readers.
            </Text>
            <Text as="p" style={styles.accessibilityText}>
              Screen readers will announce this as a heading level 1,
              providing better navigation for users with disabilities.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Best Practices</Text>
          <Text as="p" style={styles.description}>
            • Use <Text style={styles.bold}>semantic elements</Text> (h1, h2, p) for better SEO{"\n"}
            • Maintain <Text style={styles.bold}>typography hierarchy</Text> for readability{"\n"}
            • Apply <Text style={styles.bold}>consistent spacing</Text> and colors{"\n"}
            • Test with <Text style={styles.bold}>screen readers</Text> for accessibility{"\n"}
            • Use <Text style={styles.bold}>asChild</Text> pattern when needed
          </Text>
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
  semanticContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    ...Platform.select({
      web: {
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      },
    }),
  },
  h1: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 16,
    color: "#000",
  },
  h2: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000",
  },
  h3: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
    color: "#333",
  },
  span: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  typographyContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    ...Platform.select({
      web: {
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      },
    }),
  },
  displayText: {
    fontSize: 48,
    fontWeight: "700",
    marginBottom: 16,
    color: "#000",
  },
  headlineText: {
    fontSize: 32,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8,
    color: "#666",
  },
  bodyText: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
    color: "#333",
  },
  captionText: {
    fontSize: 12,
    color: "#999",
  },
  stylingContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    ...Platform.select({
      web: {
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      },
    }),
  },
  boldText: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#000",
  },
  italicText: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 8,
    color: "#000",
  },
  underlineText: {
    fontSize: 16,
    textDecorationLine: "underline",
    marginBottom: 8,
    color: "#000",
  },
  strikethroughText: {
    fontSize: 16,
    textDecorationLine: "line-through",
    marginBottom: 8,
    color: "#000",
  },
  coloredText: {
    fontSize: 16,
    color: "#007AFF",
    marginBottom: 8,
  },
  highlightedText: {
    fontSize: 16,
    backgroundColor: "#FFEB3B",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    color: "#000",
  },
  platformContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    ...Platform.select({
      web: {
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      },
    }),
  },
  platformTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000",
  },
  platformText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
    color: "#333",
  },
  accessibilityContainer: {
    backgroundColor: "#f0f8ff",
    padding: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  accessibilityTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#007AFF",
  },
  accessibilityText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
    color: "#333",
  },
});