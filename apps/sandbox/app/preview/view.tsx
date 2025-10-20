import { View, Text } from "@native-ui-org/primitives";
import { Platform, ScrollView, StyleSheet } from "react-native";
import { Stack } from "expo-router";

export default function PreviewView() {
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "View" }} />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>View Primitive</Text>
          <Text as="p" style={styles.description}>
            The fundamental layout container for React Native applications. Provides cross-platform accessibility and supports the asChild pattern for composition.
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Platform Behavior</Text>
          <Text as="p" style={styles.description}>
            • <Text style={styles.bold}>Web:</Text> Renders as div with proper accessibility attributes{"\n"}
            • <Text style={styles.bold}>Native:</Text> Uses React Native View component{"\n"}
            • <Text style={styles.bold}>Accessibility:</Text> Supports accessibilityRole and accessibilityState{"\n"}
            • <Text style={styles.bold}>Composition:</Text> asChild pattern for flexible rendering
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Basic Container</Text>
          <Text as="p" style={styles.description}>
            Simple container with padding and background
          </Text>
          
          <View style={styles.basicContainer}>
            <Text style={styles.basicText}>Simple View container</Text>
            <Text style={styles.basicSubtext}>
              Basic building block for layouts
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Flexbox Layout</Text>
          <Text as="p" style={styles.description}>
            Flexible layout with equal-width columns
          </Text>
          
          <View style={styles.flexRow}>
            <View style={styles.flexItem1}>
              <Text style={styles.flexText}>Flex 1</Text>
            </View>
            <View style={styles.flexItem2}>
              <Text style={styles.flexText}>Flex 1</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Nested Views</Text>
          <Text as="p" style={styles.description}>
            Complex nested structure with multiple levels
          </Text>
          
          <View style={styles.nestedContainer}>
            <Text style={styles.nestedTitle}>Nested Views</Text>
            <View style={styles.nestedLevel1}>
              <Text style={styles.nestedText}>Child View Level 1</Text>
              <View style={styles.nestedLevel2}>
                <Text style={styles.nestedText2}>Child View Level 2</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>asChild Pattern</Text>
          <Text as="p" style={styles.description}>
            Using asChild to render child without wrapper
          </Text>
          
          <View asChild>
            <View style={styles.asChildContainer}>
              <Text style={styles.asChildText}>This View uses asChild</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Accessibility Features</Text>
          <Text as="p" style={styles.description}>
            View supports accessibility roles and states
          </Text>
          
          <View 
            style={styles.accessibleContainer}
            accessibilityRole="button"
            accessibilityLabel="Accessible button container"
            accessibilityHint="Double tap to activate"
          >
            <Text style={styles.accessibleText}>Accessible Container</Text>
            <Text style={styles.accessibleSubtext}>
              This View has accessibilityRole="button"
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Cross-Platform Semantic</Text>
          <Text as="p" style={styles.description}>
            Using semantic HTML elements on web, regular Text on native
          </Text>
          
          <View style={styles.semanticContainer}>
            <Text as="h2" style={styles.semanticTitle}>
              Cross-Platform Title
            </Text>
            <Text as="p" style={styles.semanticText}>
              This works on both web and mobile! On web, this renders as semantic HTML
              (h2 and p tags) for SEO. On mobile, it renders as regular Text components.
            </Text>
            <Text as="p" style={styles.semanticText}>
              Platform: <Text style={styles.bold}>{Platform.OS}</Text>
            </Text>
          </View>
        </View>

        {Platform.OS === "web" && (
          <View style={styles.section}>
            <Text as="h3" style={styles.subTitle}>Web-Only Semantic HTML</Text>
            <Text as="p" style={styles.description}>
              Using asChild with semantic HTML elements for better SEO
            </Text>
            
            <View asChild>
              <section style={styles.sectionElement}>
                <Text as="h2" style={styles.sectionTitle}>
                  Semantic Section Element
                </Text>
                <Text as="p" style={styles.sectionText}>
                  This is a proper HTML section with h2 and p tags on web.
                </Text>
              </section>
            </View>

            <View asChild>
              <article style={styles.articleElement}>
                <Text as="h3" style={styles.articleTitle}>
                  Article Element
                </Text>
                <Text as="p" style={styles.articleText}>
                  Using asChild to render semantic article, header, and footer elements.
                </Text>
                <Text as="span" style={styles.articleSpan}>
                  Perfect for SEO and accessibility
                </Text>
              </article>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Best Practices</Text>
          <Text as="p" style={styles.description}>
            • Use <Text style={styles.bold}>semantic structure</Text> for better accessibility{"\n"}
            • Apply <Text style={styles.bold}>consistent spacing</Text> with padding and margin{"\n"}
            • Leverage <Text style={styles.bold}>flexbox</Text> for responsive layouts{"\n"}
            • Add <Text style={styles.bold}>accessibility attributes</Text> when needed{"\n"}
            • Use <Text style={styles.bold}>asChild</Text> for composition patterns
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
  basicContainer: {
    padding: 16,
    backgroundColor: "white",
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
  basicText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  basicSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  flexRow: {
    flexDirection: "row",
    gap: 12,
  },
  flexItem1: {
    flex: 1,
    padding: 16,
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
  },
  flexItem2: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f3e5f5",
    borderRadius: 8,
  },
  flexText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  nestedContainer: {
    backgroundColor: "white",
    padding: 16,
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
  nestedTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000",
  },
  nestedLevel1: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 6,
  },
  nestedText: {
    fontSize: 14,
    color: "#333",
  },
  nestedLevel2: {
    backgroundColor: "#e0e0e0",
    padding: 10,
    marginTop: 8,
    borderRadius: 4,
  },
  nestedText2: {
    fontSize: 12,
    color: "#555",
  },
  asChildContainer: {
    padding: 16,
    backgroundColor: "#fff3e0",
    borderRadius: 8,
  },
  asChildText: {
    fontSize: 14,
    color: "#000",
  },
  accessibleContainer: {
    padding: 16,
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  accessibleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  accessibleSubtext: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  semanticContainer: {
    backgroundColor: "white",
    padding: 16,
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
  semanticTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000",
  },
  semanticText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    lineHeight: 20,
  },
  sectionElement: {
    padding: 16,
    backgroundColor: "#fff3e0",
    borderRadius: 8,
    marginBottom: 12,
    ...Platform.select({
      web: {
        display: "flex",
        flexDirection: "column",
      },
    }),
  },
  articleElement: {
    padding: 16,
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    ...Platform.select({
      web: {
        display: "flex",
        flexDirection: "column",
      },
    }),
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  articleText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  articleSpan: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
});