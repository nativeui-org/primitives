import { Stack } from "expo-router";
import { View, Text } from "@native-ui-org/primitives";
import { 
  ContextMenu, 
  ContextMenuTrigger, 
  ContextMenuContent, 
  ContextMenuItem, 
  ContextMenuSeparator 
} from "@native-ui-org/primitives";
import { StyleSheet, Platform, ScrollView, Alert } from "react-native";
import React from "react";

export default function ContextMenuPreview() {
  const handleShare = () => {
    console.log("Share clicked!");
    Alert.alert("Share", "Chat shared!");
  };

  const handleRename = () => {
    console.log("Rename clicked!");
    Alert.alert("Rename", "Chat renamed!");
  };

  const handleDelete = () => {
    console.log("Delete clicked!");
    Alert.alert("Delete", "Chat deleted!");
  };

  const handleArchive = () => {
    console.log("Archive clicked!");
    Alert.alert("Archive", "Chat archived!");
  };

  const handleExport = () => {
    console.log("Export clicked!");
    Alert.alert("Export", "Chat exported!");
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Context Menu" }} />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>ContextMenu Primitive</Text>
          <Text as="p" style={styles.description}>
            Cross-platform context menu. Right-click on web, long press on native.
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Platform Behavior</Text>
          <Text as="p" style={styles.description}>
            • <Text style={styles.bold}>Web:</Text> Right-click triggers custom menu with Portal{"\n"}
            • <Text style={styles.bold}>Native:</Text> Long press triggers native context menu{"\n"}
            • <Text style={styles.bold}>Keyboard:</Text> Escape to close, Enter/Space to select{"\n"}
            • <Text style={styles.bold}>Positioning:</Text> Auto-adjusts to avoid screen edges
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Chat List Example</Text>
          <Text as="p" style={styles.description}>
            Simulate ChatGPT-style chat list with context actions
          </Text>

          <View style={styles.chatList}>
            <ContextMenu>
              <ContextMenuTrigger>
                <View style={styles.chatItem}>
                  <View style={styles.chatAvatar}>
                    <Text style={styles.chatAvatarText}>AI</Text>
                  </View>
                  <View style={styles.chatContent}>
                    <Text style={styles.chatTitle}>React Native Help</Text>
                    <Text style={styles.chatSubtitle}>How to implement context menus...</Text>
                  </View>
                </View>
              </ContextMenuTrigger>
              
              <ContextMenuContent>
                <ContextMenuItem onPress={handleShare}>
                  <View style={styles.menuItem}>
                    <Text style={styles.menuItemText}>📤 Share</Text>
                  </View>
                </ContextMenuItem>
                <ContextMenuItem onPress={handleRename}>
                  <View style={styles.menuItem}>
                    <Text style={styles.menuItemText}>✏️ Rename</Text>
                  </View>
                </ContextMenuItem>
                <ContextMenuItem onPress={handleArchive}>
                  <View style={styles.menuItem}>
                    <Text style={styles.menuItemText}>📦 Archive</Text>
                  </View>
                </ContextMenuItem>
                <ContextMenuItem onPress={handleExport}>
                  <View style={styles.menuItem}>
                    <Text style={styles.menuItemText}>💾 Export</Text>
                  </View>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onPress={handleDelete} destructive>
                  <View style={styles.menuItem}>
                    <Text style={[styles.menuItemText, styles.destructive]}>🗑️ Delete</Text>
                  </View>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>

            <ContextMenu>
              <ContextMenuTrigger>
                <View style={styles.chatItem}>
                  <View style={styles.chatAvatar}>
                    <Text style={styles.chatAvatarText}>JS</Text>
                  </View>
                  <View style={styles.chatContent}>
                    <Text style={styles.chatTitle}>JavaScript Tips</Text>
                    <Text style={styles.chatSubtitle}>Best practices for async/await...</Text>
                  </View>
                </View>
              </ContextMenuTrigger>
              
              <ContextMenuContent>
                <ContextMenuItem onPress={handleShare}>
                  <View style={styles.menuItem}>
                    <Text style={styles.menuItemText}>📤 Share</Text>
                  </View>
                </ContextMenuItem>
                <ContextMenuItem onPress={handleRename}>
                  <View style={styles.menuItem}>
                    <Text style={styles.menuItemText}>✏️ Rename</Text>
                  </View>
                </ContextMenuItem>
                <ContextMenuItem onPress={handleArchive}>
                  <View style={styles.menuItem}>
                    <Text style={styles.menuItemText}>📦 Archive</Text>
                  </View>
                </ContextMenuItem>
                <ContextMenuItem onPress={handleExport}>
                  <View style={styles.menuItem}>
                    <Text style={styles.menuItemText}>💾 Export</Text>
                  </View>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onPress={handleDelete} destructive>
                  <View style={styles.menuItem}>
                    <Text style={[styles.menuItemText, styles.destructive]}>🗑️ Delete</Text>
                  </View>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>

            <ContextMenu>
              <ContextMenuTrigger>
                <View style={styles.chatItem}>
                  <View style={styles.chatAvatar}>
                    <Text style={styles.chatAvatarText}>UX</Text>
                  </View>
                  <View style={styles.chatContent}>
                    <Text style={styles.chatTitle}>UI/UX Design</Text>
                    <Text style={styles.chatSubtitle}>Creating accessible interfaces...</Text>
                  </View>
                </View>
              </ContextMenuTrigger>
              
              <ContextMenuContent>
                <ContextMenuItem onPress={handleShare}>
                  <Text>Share</Text>
                </ContextMenuItem>
                <ContextMenuItem onPress={handleRename}>
                  <Text>Rename</Text>
                </ContextMenuItem>
                <ContextMenuItem onPress={handleArchive}>
                  <Text>Archive</Text>
                </ContextMenuItem>
                <ContextMenuItem onPress={handleExport}>
                  <Text>Export</Text>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onPress={handleDelete} destructive>
                  <Text>Delete</Text>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>File Browser Example</Text>
          <Text as="p" style={styles.description}>
            File system context menu with different actions
          </Text>

          <View style={styles.fileList}>
            <ContextMenu>
              <ContextMenuTrigger>
                <View style={styles.fileItem}>
                  <Text style={styles.fileIcon}>📄</Text>
                  <Text style={styles.fileName}>document.pdf</Text>
                </View>
              </ContextMenuTrigger>
              
              <ContextMenuContent>
                <ContextMenuItem onPress={() => Alert.alert("Open", "Opening document.pdf")}>
                  <Text>Open</Text>
                </ContextMenuItem>
                <ContextMenuItem onPress={() => Alert.alert("Download", "Downloading document.pdf")}>
                  <Text>Download</Text>
                </ContextMenuItem>
                <ContextMenuItem onPress={() => Alert.alert("Copy", "Copied document.pdf")}>
                  <Text>Copy</Text>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onPress={() => Alert.alert("Rename", "Renaming document.pdf")}>
                  <Text>Rename</Text>
                </ContextMenuItem>
                <ContextMenuItem onPress={() => Alert.alert("Move", "Moving document.pdf")}>
                  <Text>Move</Text>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onPress={() => Alert.alert("Delete", "Deleting document.pdf")} destructive>
                  <Text>Delete</Text>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>

            <ContextMenu>
              <ContextMenuTrigger>
                <View style={styles.fileItem}>
                  <Text style={styles.fileIcon}>📁</Text>
                  <Text style={styles.fileName}>Projects</Text>
                </View>
              </ContextMenuTrigger>
              
              <ContextMenuContent>
                <ContextMenuItem onPress={() => Alert.alert("Open", "Opening Projects folder")}>
                  <Text>Open</Text>
                </ContextMenuItem>
                <ContextMenuItem onPress={() => Alert.alert("New File", "Creating new file in Projects")}>
                  <Text>New File</Text>
                </ContextMenuItem>
                <ContextMenuItem onPress={() => Alert.alert("New Folder", "Creating new folder in Projects")}>
                  <Text>New Folder</Text>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onPress={() => Alert.alert("Rename", "Renaming Projects folder")}>
                  <Text>Rename</Text>
                </ContextMenuItem>
                <ContextMenuItem onPress={() => Alert.alert("Move", "Moving Projects folder")}>
                  <Text>Move</Text>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onPress={() => Alert.alert("Delete", "Deleting Projects folder")} destructive>
                  <Text>Delete</Text>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Disabled Context Menu</Text>
          <Text as="p" style={styles.description}>
            Context menu can be disabled
          </Text>

          <ContextMenu>
            <ContextMenuTrigger disabled>
              <View style={[styles.chatItem, styles.disabledItem]}>
                <View style={styles.chatAvatar}>
                  <Text style={styles.chatAvatarText}>🔒</Text>
                </View>
                <View style={styles.chatContent}>
                  <Text style={styles.chatTitle}>Locked Chat</Text>
                  <Text style={styles.chatSubtitle}>This chat is locked and cannot be modified</Text>
                </View>
              </View>
            </ContextMenuTrigger>
            
            <ContextMenuContent>
              <ContextMenuItem onPress={handleShare}>
                <Text>Share</Text>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
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
  chatList: {
    gap: 8,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    ...Platform.select({
      web: {
        cursor: "pointer",
        ":hover": {
          backgroundColor: "#f9f9f9",
        },
      },
    }),
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  chatAvatarText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  chatContent: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  chatSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  fileList: {
    gap: 8,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    ...Platform.select({
      web: {
        cursor: "pointer",
        ":hover": {
          backgroundColor: "#f9f9f9",
        },
      },
    }),
  },
  fileIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  fileName: {
    fontSize: 16,
    color: "#000",
  },
  disabledItem: {
    opacity: 0.5,
    ...Platform.select({
      web: {
        cursor: "not-allowed",
        ":hover": {
          backgroundColor: "#fff",
        },
      },
    }),
  },
});
