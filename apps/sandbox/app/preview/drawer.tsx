import { Stack } from "expo-router";
import {
  View,
  Text,
  Drawer,
  DrawerHandle,
  DrawerContent,
  DrawerOverlay,
  useDrawer,
} from "@native-ui-org/primitives";
import { StyleSheet, Platform, ScrollView, Pressable } from "react-native";
import React from "react";

function HandleBar() {
  return (
    <View style={styles.handleBar}>
      <View style={styles.handleBarLine} />
    </View>
  );
}

function SnapIndicator() {
  const { currentSnapIndex } = useDrawer();
  return (
    <Text style={styles.drawerText}>
      Current snap index: {currentSnapIndex}
    </Text>
  );
}

export default function DrawerPreview() {
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [openSnap, setOpenSnap] = React.useState(false);
  const [openStatic, setOpenStatic] = React.useState(false);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Drawer" }} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>
            Drawer Primitive
          </Text>
          <Text as="p" style={styles.description}>
            Bottom drawer component with smooth resizing and snap points. Perfect
            for modals, bottom sheets, and expandable content panels.
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>
            Platform Behavior
          </Text>
          <Text as="p" style={styles.description}>
            • <Text style={styles.bold}>Web:</Text> Uses mouse/touch events for
            resizing{"\n"}
            • <Text style={styles.bold}>Native:</Text> Uses PanResponder for
            native gestures{"\n"}
            • <Text style={styles.bold}>Performance:</Text> Optimized for 60fps
            with Animated API{"\n"}
            • <Text style={styles.bold}>Resizing:</Text> Drag handle to resize,
            snaps to nearest snap point
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>
            Basic Drawer (Uncontrolled)
          </Text>
          <Text as="p" style={styles.description}>
            Simple drawer with default snap points
          </Text>

          <Pressable style={styles.button} onPress={() => setOpen1(true)}>
            <Text style={styles.buttonText}>Show Basic Drawer</Text>
          </Pressable>

          <Drawer
            open={open1}
            onOpenChange={setOpen1}
            snapPoints={[0.3, 0.6, 0.9]}
            initialSnapIndex={1}
          >
            <DrawerOverlay />
            <DrawerContent style={styles.drawerContent}>
              <DrawerHandle style={styles.drawerHandle}>
                <HandleBar />
              </DrawerHandle>
              <View style={styles.drawerInner}>
                <Text style={styles.drawerTitle}>Basic Drawer</Text>
                <Text style={styles.drawerText}>
                  This is a basic drawer with three snap points. Drag the handle
                  to resize it.
                </Text>
              </View>
            </DrawerContent>
          </Drawer>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>
            Controlled Drawer
          </Text>
          <Text as="p" style={styles.description}>
            State managed externally: {open2 ? "Open" : "Closed"}
          </Text>

          <Pressable
            style={styles.button}
            onPress={() => setOpen2(true)}
          >
            <Text style={styles.buttonText}>Open Controlled Drawer</Text>
          </Pressable>

          <Drawer open={open2} onOpenChange={setOpen2} snapPoints={[0.4, 0.8]}>
            <DrawerOverlay />
            <DrawerContent style={styles.drawerContent}>
              <DrawerHandle style={styles.drawerHandle}>
                <HandleBar />
              </DrawerHandle>
              <ScrollView style={styles.drawerInner}>
                <Text style={styles.drawerTitle}>Controlled Drawer</Text>
                <Text style={styles.drawerText}>
                  This drawer is controlled by the parent component. The state
                  is managed externally.
                </Text>
                <SnapIndicator />
              </ScrollView>
            </DrawerContent>
          </Drawer>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>
            Drawer with Snap Points
          </Text>
          <Text as="p" style={styles.description}>
            Multiple snap points with callback
          </Text>

          <Pressable
            style={styles.button}
            onPress={() => setOpenSnap(true)}
          >
            <Text style={styles.buttonText}>Open Drawer with Snap Points</Text>
          </Pressable>

          <Drawer
            open={openSnap}
            onOpenChange={setOpenSnap}
            snapPoints={[0.25, 0.5, 0.75]}
            initialSnapIndex={1}
          >
            <DrawerOverlay />
            <DrawerContent style={styles.drawerContent}>
              <DrawerHandle style={styles.drawerHandle}>
                <HandleBar />
              </DrawerHandle>
              <ScrollView style={styles.drawerInner}>
                <Text style={styles.drawerTitle}>Drawer with Snap Points</Text>
                <Text style={styles.drawerText}>
                  This drawer has three snap points: 25%, 50%, and 75% of
                  screen height.
                </Text>
                <SnapIndicator />
                <Text style={styles.drawerText}>
                  Drag the handle to resize and see it snap to the nearest
                  point.
                </Text>
              </ScrollView>
            </DrawerContent>
          </Drawer>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>
            Non-Resizable Drawer
          </Text>
          <Text as="p" style={styles.description}>
            Fixed height drawer without resizing
          </Text>

          <Pressable style={styles.button} onPress={() => setOpenStatic(true)}>
            <Text style={styles.buttonText}>Open Non-Resizable Drawer</Text>
          </Pressable>

          <Drawer
            open={openStatic}
            onOpenChange={setOpenStatic}
            resizable={false}
            snapPoints={[0.6]}
          >
            <DrawerOverlay />
            <DrawerContent style={styles.drawerContent}>
              <View style={styles.drawerInner}>
                <Text style={styles.drawerTitle}>
                  Non-Resizable Drawer
                </Text>
                <Text style={styles.drawerText}>
                  This drawer has resizing disabled. It can only be opened or
                  closed.
                </Text>
              </View>
            </DrawerContent>
          </Drawer>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.OS === "web" ? "#fff" : "#f2f2f7",
  },
  scrollView: {
    flex: 1,
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
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  drawerContent: {
    backgroundColor: "#fff",
  },
  drawerHandle: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ccc",
  },
  handleBarLine: {
    width: "100%",
    height: "100%",
    backgroundColor: "#999",
    borderRadius: 2,
  },
  drawerInner: {
    padding: 20,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000",
  },
  drawerText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

