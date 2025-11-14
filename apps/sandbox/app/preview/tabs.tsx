import { Stack } from "expo-router";
import { View, Text } from "@native-ui-org/primitives";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@native-ui-org/primitives";
import { StyleSheet, Platform, ScrollView } from "react-native";
import React from "react";

export default function TabsPreview() {
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Tabs" }} />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>Tabs Primitive</Text>
          <Text as="p" style={styles.description}>
            Organize content into tabbed sections. On web: classic tabs. On iOS/Android: native dropdown button.
          </Text>
        </View>

        {/* Example 1: Normal tabs, no styling */}
        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Example 1: Normal Tabs</Text>
          <Text as="p" style={styles.description}>
            Basic tabs without any custom styling
          </Text>

          <Tabs 
              defaultValue="tab1"
              style={Platform.OS !== "web" ? styles.nativeTabsButton : undefined}
              backgroundColor={Platform.OS !== "web" ? "#F2F2F7" : undefined}
              borderColor={Platform.OS !== "web" ? "#E5E5EA" : undefined}
              cornerRadius={Platform.OS !== "web" ? 10 : undefined}
            >
              <TabsList>
                <TabsTrigger value="tab1" iosIcon="house.fill" androidIcon="home" icon="🏠">Home</TabsTrigger>
                <TabsTrigger value="tab2" iosIcon="person.fill" androidIcon="person" icon="👤">Profile</TabsTrigger>
                <TabsTrigger value="tab3" iosIcon="gear" androidIcon="settings" icon="⚙️">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="tab1">
                <View style={styles.tabContent}>
                  <Text style={styles.tabTitle}>Home Tab</Text>
                  <Text style={styles.tabText}>
                    This is the content for the Home tab. You can see that the content is properly displayed with full width.
                  </Text>
                </View>
              </TabsContent>

              <TabsContent value="tab2">
                <View style={styles.tabContent}>
                  <Text style={styles.tabTitle}>Profile Tab</Text>
                  <Text style={styles.tabText}>
                    This is the content for the Profile tab. The content should take the full width available.
                  </Text>
                </View>
              </TabsContent>

              <TabsContent value="tab3">
                <View style={styles.tabContent}>
                  <Text style={styles.tabTitle}>Settings Tab</Text>
                  <Text style={styles.tabText}>
                    This is the content for the Settings tab. All content should be properly sized and visible.
                  </Text>
                </View>
              </TabsContent>
            </Tabs>
        </View>

        {/* Example 2: Right aligned button */}
        {Platform.OS !== "web" && (
          <View style={styles.section}>
            <Text as="h3" style={styles.subTitle}>Example 2: Right Aligned Button</Text>
            <Text as="p" style={styles.description}>
              Button aligned to the right with auto width
            </Text>

            <View style={styles.rightAlignedContainer}>
              <Tabs 
                defaultValue="option1" 
                alignment="right"
                style={styles.nativeTabsButtonAuto}
                backgroundColor="#F2F2F7"
                borderColor="#E5E5EA"
                cornerRadius={10}
              >
                <TabsList>
                  <TabsTrigger value="option1" iosIcon="star.fill" androidIcon="star" icon="⭐">Option 1</TabsTrigger>
                  <TabsTrigger value="option2" iosIcon="heart.fill" androidIcon="favorite" icon="❤️">Option 2</TabsTrigger>
                  <TabsTrigger value="option3" iosIcon="bookmark.fill" androidIcon="bookmark" icon="🔖">Option 3</TabsTrigger>
                </TabsList>

                <TabsContent value="option1">
                  <View style={styles.tabContent}>
                    <Text style={styles.tabTitle}>Option 1 Selected</Text>
                    <Text style={styles.tabText}>
                      The button is aligned to the right. The content below should take full width and be properly displayed.
                    </Text>
                  </View>
                </TabsContent>

                <TabsContent value="option2">
                  <View style={styles.tabContent}>
                    <Text style={styles.tabTitle}>Option 2 Selected</Text>
                    <Text style={styles.tabText}>
                      The button is aligned to the right. The content below should take full width and be properly displayed.
                    </Text>
                  </View>
                </TabsContent>

                <TabsContent value="option3">
                  <View style={styles.tabContent}>
                    <Text style={styles.tabTitle}>Option 3 Selected</Text>
                    <Text style={styles.tabText}>
                      The button is aligned to the right. The content below should take full width and be properly displayed.
                    </Text>
                  </View>
                </TabsContent>
              </Tabs>
            </View>
          </View>
        )}

        {/* Example 3: Custom styling */}
        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Example 3: Custom Styled</Text>
          <Text as="p" style={styles.description}>
            Custom colors and styling with blue background
          </Text>

          <Tabs 
              defaultValue="home" 
              backgroundColor={Platform.OS !== "web" ? "#007AFF" : undefined}
              textColor={Platform.OS !== "web" ? "#FFFFFF" : undefined}
              borderColor={Platform.OS !== "web" ? "#0051D5" : undefined}
              cornerRadius={Platform.OS !== "web" ? 20 : undefined}
              showChevron={Platform.OS !== "web" ? true : undefined}
              chevronIcon={Platform.OS !== "web" ? "arrow.down.circle.fill" : undefined}
              style={Platform.OS !== "web" ? styles.nativeTabsButton : undefined}
            >
              <TabsList>
                <TabsTrigger value="home" iosIcon="house.fill" androidIcon="home" icon="🏠">Home</TabsTrigger>
                <TabsTrigger value="search" iosIcon="magnifyingglass" androidIcon="search" icon="🔍">Search</TabsTrigger>
                <TabsTrigger value="profile" iosIcon="person.fill" androidIcon="person" icon="👤">Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="home">
                <View style={styles.tabContent}>
                  <Text style={styles.tabTitle}>Home</Text>
                  <Text style={styles.tabText}>
                    Custom styled button with blue background. The content should be properly displayed with full width.
                  </Text>
                </View>
              </TabsContent>

              <TabsContent value="search">
                <View style={styles.tabContent}>
                  <Text style={styles.tabTitle}>Search</Text>
                  <Text style={styles.tabText}>
                    Custom styled button with blue background. The content should be properly displayed with full width.
                  </Text>
                </View>
              </TabsContent>

              <TabsContent value="profile">
                <View style={styles.tabContent}>
                  <Text style={styles.tabTitle}>Profile</Text>
                  <Text style={styles.tabText}>
                    Custom styled button with blue background. The content should be properly displayed with full width.
                  </Text>
                </View>
              </TabsContent>
            </Tabs>
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
  tabContent: {
    padding: 16,
    backgroundColor: Platform.OS === "web" ? "#f9fafb" : "#fff",
    borderRadius: 8,
    marginTop: Platform.OS === "web" ? 16 : 0, // TabsContent already has marginTop on native
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  nativeTabsButton: {
    height: 44,
    marginBottom: 16,
    width: "100%",
  },
  nativeTabsButtonAuto: {
    height: 44,
    marginBottom: 16,
    minWidth: 150,
  },
  rightAlignedContainer: {
    width: "100%",
    alignItems: "flex-end" as any,
    marginBottom: 16,
    alignSelf: "stretch" as any,
  },
});
