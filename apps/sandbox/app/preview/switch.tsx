import { Stack } from "expo-router";
import { View, Text, Button } from "@native-ui-org/primitives";
import { Switch } from "@native-ui-org/primitives";
import { StyleSheet, Platform, ScrollView, Animated } from "react-native";
import React, { useState } from "react";

// Animated Switch Component
function AnimatedSwitch({ pressed, onPressedChange, style, ...props }: any) {
  const thumbAnimation = React.useRef(new Animated.Value(pressed ? 1 : 0)).current;
  
  React.useEffect(() => {
    Animated.timing(thumbAnimation, {
      toValue: pressed ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [pressed, thumbAnimation]);

  const thumbTranslateX = thumbAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 20], // Move from left to right
  });

  const trackColor = thumbAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E5EA', '#007AFF'], // Gray to blue
  });

  return (
    <Switch pressed={pressed} onPressedChange={onPressedChange} style={style} {...props}>
      <Animated.View style={[
        styles.switchTrack,
        { backgroundColor: trackColor }
      ]}>
        <Animated.View style={[
          styles.switchThumb,
          { transform: [{ translateX: thumbTranslateX }] }
        ]} />
      </Animated.View>
    </Switch>
  );
}

export default function SwitchPreview() {
  const [controlled, setControlled] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Switch" }} />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>Switch Primitive</Text>
          <Text as="p" style={styles.description}>
            Unstyled switch primitive for switching between on/off states.
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Platform Behavior</Text>
          <Text as="p" style={styles.description}>
            • <Text style={styles.bold}>Web:</Text> Native switch with ARIA (aria-checked, aria-disabled){"\n"}
            • <Text style={styles.bold}>Native:</Text> Accessibility role and state{"\n"}
            • <Text style={styles.bold}>Keyboard:</Text> Space/Enter to toggle (web){"\n"}
            • <Text style={styles.bold}>Touch:</Text> Tap to toggle on mobile
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Controlled</Text>
          <Text as="p" style={styles.description}>
            Parent manages state
          </Text>

          <Button style={styles.row} onPress={() => setControlled(!controlled)}>
            <AnimatedSwitch
              pressed={controlled}
              onPressedChange={setControlled}
              style={styles.switch}
            />
            <Text style={styles.label}>
              Controlled switch
            </Text>
          </Button>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Uncontrolled</Text>
          <Text as="p" style={styles.description}>
            Internal state with defaultPressed
          </Text>

          <Button style={styles.row}>
            <AnimatedSwitch
              pressed={true}
              onPressedChange={() => {}}
              style={styles.switch}
            />
            <Text style={styles.label}>
              Uncontrolled switch (default on)
            </Text>
          </Button>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Settings Example</Text>
          <Text as="p" style={styles.description}>
            Common switch use cases
          </Text>

          <View style={styles.group}>
            <Button style={styles.row} onPress={() => setNotifications(!notifications)}>
              <AnimatedSwitch
                pressed={notifications}
                onPressedChange={setNotifications}
                style={styles.switch}
              />
              <Text style={styles.label}>
                Push notifications
              </Text>
            </Button>

            <Button style={styles.row} onPress={() => setDarkMode(!darkMode)}>
              <AnimatedSwitch
                pressed={darkMode}
                onPressedChange={setDarkMode}
                style={styles.switch}
              />
              <Text style={styles.label}>
                Dark mode
              </Text>
            </Button>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>States</Text>
          <Text as="p" style={styles.description}>
            Different visual states
          </Text>

          <View style={styles.stateRow}>
            <View style={styles.stateItem}>
              <AnimatedSwitch pressed={false} style={styles.switch} />
              <Text style={styles.stateLabel}>Off</Text>
            </View>

            <View style={styles.stateItem}>
              <AnimatedSwitch pressed={true} style={styles.switch} />
              <Text style={styles.stateLabel}>On</Text>
            </View>

            <View style={styles.stateItem}>
              <AnimatedSwitch pressed={true} disabled={true} style={styles.switch} />
              <Text style={styles.stateLabel}>Disabled</Text>
            </View>
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
  bold: {
    fontWeight: "600",
  },
  group: {
    gap: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  label: {
    fontSize: 16,
    color: "#000",
  },
  switch: {
    // Switch container styles
  },
  switchTrack: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  stateRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
  },
  stateItem: {
    alignItems: "center",
    gap: 8,
  },
  stateLabel: {
    fontSize: 12,
    color: "#666",
  },
});
