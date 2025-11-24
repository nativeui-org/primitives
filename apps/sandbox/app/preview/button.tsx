import { View, Text, Button } from "@native-ui-org/primitives";
import { Platform, StyleSheet, ScrollView } from "react-native";
import { Stack } from "expo-router";

export default function PreviewButton() {
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Button" }} />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>Button Primitive</Text>
          <Text as="p" style={styles.description}>
            Unstyled, accessible button component that wraps React Native's Pressable.
            Supports asChild for custom composition.
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Basic Usage</Text>
          <Text as="p" style={styles.description}>
            Standard button usage with onPress handler.
          </Text>
          
          <View style={styles.demoContainer}>
            <Button 
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed
              ]}
              onPress={() => console.log("Pressed")}
            >
              <Text style={styles.buttonText}>Standard Button</Text>
            </Button>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Composition (asChild)</Text>
          <Text as="p" style={styles.description}>
            Use asChild to add button behavior to any component.
          </Text>
          
          <View style={styles.demoContainer}>
            <Button asChild onPress={() => console.log("Custom Pressed")}>
              <View style={styles.customButton}>
                 <Text style={styles.customButtonText}>Custom Child Button</Text>
              </View>
            </Button>
          </View>
        </View>

        <View style={styles.section}>
            <Text as="h3" style={styles.subTitle}>States & Accessibility</Text>
            <Text as="p" style={styles.description}>
                Automatically handles accessibility roles and press states.
            </Text>
             <View style={styles.demoContainer}>
                <Button 
                    disabled 
                    style={[styles.button, styles.buttonDisabled]}
                    accessibilityLabel="Disabled Button"
                >
                    <Text style={styles.buttonText}>Disabled Button</Text>
                </Button>
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
  demoContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    alignItems: 'flex-start',
    gap: 16,
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
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  customButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  customButtonPressed: {
    backgroundColor: "#e6f2ff",
  },
  customButtonText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 16,
  },
});

