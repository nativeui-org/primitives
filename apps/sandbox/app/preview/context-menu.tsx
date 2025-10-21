import { Stack } from "expo-router";
import { View, Text, showAlert } from "@native-ui-org/primitives";

import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator
} from "@native-ui-org/context-menu";
import { StyleSheet, Platform, ScrollView } from "react-native";
import React from "react";
import { Share, Edit, Archive, Download, Trash2 } from "lucide-react-native";

export default function ContextMenuPreview() {
  React.useEffect(() => {
    console.log('PREVIEW: Platform.OS =', Platform.OS);
    console.log('PREVIEW: typeof window =', typeof window);
    console.log('PREVIEW: typeof document =', typeof document);
    console.log('PREVIEW: navigator.userAgent =', typeof navigator !== 'undefined' ? navigator.userAgent : 'no navigator');
  }, []);

  const handleShare = async () => {
    console.log("Share clicked!");
    await showAlert({
      title: "Share",
      message: "Chat shared successfully!",
    });
  };

  const handleRename = async () => {
    console.log("Rename clicked!");
    await showAlert({
      title: "Rename",
      message: "Chat renamed successfully!",
    });
  };

  const handleDelete = async () => {
    console.log("Delete clicked!");
    const result = await showAlert({
      title: "Delete Chat",
      message: "Are you sure you want to delete this chat? This action cannot be undone.",
      buttons: [
        { text: "Cancel", value: "cancel", style: "cancel" },
        { text: "Delete", value: "delete", style: "destructive" },
      ],
    });

    if (result === "delete") {
      console.log("Chat deleted!");
    }
  };

  const handleArchive = async () => {
    console.log("Archive clicked!");
    await showAlert({
      title: "Archive",
      message: "Chat archived successfully!",
    });
  };

  const handleExport = async () => {
    console.log("Export clicked!");
    await showAlert({
      title: "Export",
      message: "Chat exported successfully!",
    });
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
                <ContextMenuItem
                  onPress={handleShare}
                  iosIcon="square.and.arrow.up"
                  androidIcon="share"
                >
                  {Platform.OS === 'web' ? (
                    <>
                      <Share size={16} color="#666" />
                      <Text>Share chat</Text>
                    </>
                  ) : (
                    <Text>Share chat</Text>
                  )}
                </ContextMenuItem>
                <ContextMenuItem
                  onPress={handleRename}
                  iosIcon="pencil"
                  androidIcon="edit"
                  icon="✏️"
                >
                  {Platform.OS === 'web' ? (
                    <>
                      <Edit size={16} color="#666" />
                      <Text>Rename</Text>
                    </>
                  ) : (
                    <Text>Rename</Text>
                  )}
                </ContextMenuItem>
                <ContextMenuItem
                  onPress={handleArchive}
                  iosIcon="archivebox"
                  androidIcon="archive"
                  icon="📦"
                >
                  {Platform.OS === 'web' ? (
                    <>
                      <Archive size={16} color="#666" />
                      <Text>Archive</Text>
                    </>
                  ) : (
                    <Text>Archive</Text>
                  )}
                </ContextMenuItem>
                <ContextMenuItem
                  onPress={handleExport}
                  iosIcon="square.and.arrow.down"
                  androidIcon="download"
                  icon="💾"
                >
                  {Platform.OS === 'web' ? (
                    <>
                      <Download size={16} color="#666" />
                      <Text>Export</Text>
                    </>
                  ) : (
                    <Text>Export</Text>
                  )}
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                  onPress={handleDelete}
                  destructive
                  iosIcon="trash"
                  androidIcon="delete"
                  icon="🗑️"
                >
                  {Platform.OS === 'web' ? (
                    <>
                      <Trash2 size={16} color="#ef4444" />
                      <Text>Delete</Text>
                    </>
                  ) : (
                    <Text>Delete</Text>
                  )}
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
                <ContextMenuItem
                  onPress={handleShare}
                  iosIcon="square.and.arrow.up"
                  androidIcon="share"
                  icon="📤"
                >
                  {Platform.OS === 'web' ? (
                    <>
                      <Share size={16} color="#666" />
                      <Text>Share chat</Text>
                    </>
                  ) : (
                    <Text>Share chat</Text>
                  )}
                </ContextMenuItem>
                <ContextMenuItem
                  onPress={handleRename}
                  iosIcon="pencil"
                  androidIcon="edit"
                  icon="✏️"
                >
                  {Platform.OS === 'web' ? (
                    <>
                      <Edit size={16} color="#666" />
                      <Text>Rename</Text>
                    </>
                  ) : (
                    <Text>Rename</Text>
                  )}
                </ContextMenuItem>
                <ContextMenuItem
                  onPress={handleArchive}
                  iosIcon="archivebox"
                  androidIcon="archive"
                  icon="📦"
                >
                  {Platform.OS === 'web' ? (
                    <>
                      <Archive size={16} color="#666" />
                      <Text>Archive</Text>
                    </>
                  ) : (
                    <Text>Archive</Text>
                  )}
                </ContextMenuItem>
                <ContextMenuItem
                  onPress={handleExport}
                  iosIcon="square.and.arrow.down"
                  androidIcon="download"
                  icon="💾"
                >
                  {Platform.OS === 'web' ? (
                    <>
                      <Download size={16} color="#666" />
                      <Text>Export</Text>
                    </>
                  ) : (
                    <Text>Export</Text>
                  )}
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                  onPress={handleDelete}
                  destructive
                  iosIcon="trash"
                  androidIcon="delete"
                  icon="🗑️"
                >
                  {Platform.OS === 'web' ? (
                    <>
                      <Trash2 size={16} color="#ef4444" />
                      <Text>Delete</Text>
                    </>
                  ) : (
                    <Text>Delete</Text>
                  )}
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
                <ContextMenuItem
                  onPress={handleShare}
                  iosIcon="square.and.arrow.up"
                  androidIcon="share"
                  icon="📤"
                >
                  {Platform.OS === 'web' ? (
                    <>
                      <Share size={16} color="#666" />
                      <Text>Share chat</Text>
                    </>
                  ) : (
                    <Text>Share chat</Text>
                  )}
                </ContextMenuItem>
                <ContextMenuItem
                  onPress={handleRename}
                  iosIcon="pencil"
                  androidIcon="edit"
                  icon="✏️"
                >
                  {Platform.OS === 'web' ? (
                    <>
                      <Edit size={16} color="#666" />
                      <Text>Rename</Text>
                    </>
                  ) : (
                    <Text>Rename</Text>
                  )}
                </ContextMenuItem>
                <ContextMenuItem
                  onPress={handleArchive}
                  iosIcon="archivebox"
                  androidIcon="archive"
                  icon="📦"
                >
                  {Platform.OS === 'web' ? (
                    <>
                      <Archive size={16} color="#666" />
                      <Text>Archive</Text>
                    </>
                  ) : (
                    <Text>Archive</Text>
                  )}
                </ContextMenuItem>
                <ContextMenuItem
                  onPress={handleExport}
                  iosIcon="square.and.arrow.down"
                  androidIcon="download"
                  icon="💾"
                >
                  {Platform.OS === 'web' ? (
                    <>
                      <Download size={16} color="#666" />
                      <Text>Export</Text>
                    </>
                  ) : (
                    <Text>Export</Text>
                  )}
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                  onPress={handleDelete}
                  destructive
                  iosIcon="trash"
                  androidIcon="delete"
                  icon="🗑️"
                >
                  {Platform.OS === 'web' ? (
                    <>
                      <Trash2 size={16} color="#ef4444" />
                      <Text>Delete</Text>
                    </>
                  ) : (
                    <Text>Delete</Text>
                  )}
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
                <ContextMenuItem
                  onPress={() => showAlert({ title: "Open", message: "Opening document.pdf" })}
                  iosIcon="doc"
                  androidIcon="document"
                  icon="📄"
                >
                  <Text>Open</Text>
                </ContextMenuItem>
                <ContextMenuItem
                  onPress={() => showAlert({ title: "Download", message: "Downloading document.pdf" })}
                  iosIcon="square.and.arrow.down"
                  androidIcon="download"
                  icon="⬇️"
                >
                  <Text>Download</Text>
                </ContextMenuItem>
                <ContextMenuItem
                  onPress={() => showAlert({ title: "Copy", message: "Copied document.pdf" })}
                  iosIcon="doc.on.doc"
                  androidIcon="copy"
                  icon="📋"
                >
                  <Text>Copy</Text>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                  onPress={() => showAlert({ title: "Rename", message: "Renaming document.pdf" })}
                  iosIcon="pencil"
                  androidIcon="edit"
                  icon="✏️"
                >
                  {Platform.OS === 'web' ? (
                    <>
                      <Edit size={16} color="#666" />
                      <Text>Rename</Text>
                    </>
                  ) : (
                    <Text>Rename</Text>
                  )}
                </ContextMenuItem>
                <ContextMenuItem
                  onPress={() => showAlert({ title: "Move", message: "Moving document.pdf" })}
                  iosIcon="arrow.up.arrow.down"
                  androidIcon="move"
                  icon="📁"
                >
                  <Text>Move</Text>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                  onPress={() => showAlert({ title: "Delete", message: "Deleting document.pdf" })}
                  destructive
                  iosIcon="trash"
                  androidIcon="delete"
                  icon="🗑️"
                >
                  {Platform.OS === 'web' ? (
                    <>
                      <Trash2 size={16} color="#ef4444" />
                      <Text>Delete</Text>
                    </>
                  ) : (
                    <Text>Delete</Text>
                  )}
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
                <ContextMenuItem
                  onPress={() => showAlert({ title: "Open", message: "Opening Projects folder" })}
                  iosIcon="folder"
                  androidIcon="folder"
                  icon="📁"
                >
                  <Text>Open</Text>
                </ContextMenuItem>
                <ContextMenuItem
                  onPress={() => showAlert({ title: "New File", message: "Creating new file in Projects" })}
                  iosIcon="doc.badge.plus"
                  androidIcon="document"
                  icon="📄"
                >
                  <Text>New File</Text>
                </ContextMenuItem>
                <ContextMenuItem
                  onPress={() => showAlert({ title: "New Folder", message: "Creating new folder in Projects" })}
                  iosIcon="folder.badge.plus"
                  androidIcon="folder"
                  icon="📁"
                >
                  <Text>New Folder</Text>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                  onPress={() => showAlert({ title: "Rename", message: "Renaming Projects folder" })}
                  iosIcon="pencil"
                  androidIcon="edit"
                  icon="✏️"
                >
                  {Platform.OS === 'web' ? (
                    <>
                      <Edit size={16} color="#666" />
                      <Text>Rename</Text>
                    </>
                  ) : (
                    <Text>Rename</Text>
                  )}
                </ContextMenuItem>
                <ContextMenuItem
                  onPress={() => showAlert({ title: "Move", message: "Moving Projects folder" })}
                  iosIcon="arrow.up.arrow.down"
                  androidIcon="move"
                  icon="📁"
                >
                  <Text>Move</Text>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                  onPress={() => showAlert({ title: "Delete", message: "Deleting Projects folder" })}
                  destructive
                  iosIcon="trash"
                  androidIcon="delete"
                  icon="🗑️"
                >
                  {Platform.OS === 'web' ? (
                    <>
                      <Trash2 size={16} color="#ef4444" />
                      <Text>Delete</Text>
                    </>
                  ) : (
                    <Text>Delete</Text>
                  )}
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
              <ContextMenuItem
                onPress={handleShare}
                iosIcon="square.and.arrow.up"
                androidIcon="share"
                icon="📤"
              >
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
        cursor: "not-allowed" as any,
        ":hover": {
          backgroundColor: "#fff",
        },
      },
    }),
  },
});
