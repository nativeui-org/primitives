import { Stack } from "expo-router";
import { View, Text, Button } from "@native-ui-org/primitives";
import { SwitchGroup, Switch } from "@native-ui-org/primitives";
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

export default function SwitchGroupPreview() {
  const [controlled, setControlled] = useState(["option1"]);
  const [settings, setSettings] = useState(["notifications", "darkMode"]);
  const [filters, setFilters] = useState(["electronics"]);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "SwitchGroup" }} />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>SwitchGroup Primitive</Text>
          <Text as="p" style={styles.description}>
            Unstyled switch group primitive for managing multiple switches with coordinated state.
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Platform Behavior</Text>
          <Text as="p" style={styles.description}>
            • <Text style={styles.bold}>Web:</Text> Native group with ARIA (role="group"){"\n"}
            • <Text style={styles.bold}>Native:</Text> Accessibility group semantics{"\n"}
            • <Text style={styles.bold}>State:</Text> Coordinated value management{"\n"}
            • <Text style={styles.bold}>Multiple:</Text> Allow multiple selections
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Controlled</Text>
          <Text as="p" style={styles.description}>
            Parent manages state
          </Text>

          <View style={styles.group}>
            <Button style={styles.row} onPress={() => {
                  const newValue = controlled.includes("option1")
                    ? controlled.filter(v => v !== "option1")
                    : [...controlled, "option1"];
                  setControlled(newValue);
                }}>
              <AnimatedSwitch 
                pressed={controlled.includes("option1")} 
                onPressedChange={() => {
                  const newValue = controlled.includes("option1")
                    ? controlled.filter(v => v !== "option1")
                    : [...controlled, "option1"];
                  setControlled(newValue);
                }}
                style={styles.switch}
              />
              <Text style={styles.label}>Option 1</Text>
            </Button>

            <Button style={styles.row} onPress={() => {
                  const newValue = controlled.includes("option2")
                    ? controlled.filter(v => v !== "option2")
                    : [...controlled, "option2"];
                  setControlled(newValue);
                }}>
              <AnimatedSwitch 
                pressed={controlled.includes("option2")} 
                onPressedChange={() => {
                  const newValue = controlled.includes("option2")
                    ? controlled.filter(v => v !== "option2")
                    : [...controlled, "option2"];
                  setControlled(newValue);
                }}
                style={styles.switch}
              />
              <Text style={styles.label}>Option 2</Text>
            </Button>

            <Button style={styles.row} onPress={() => {
                  const newValue = controlled.includes("option3")
                    ? controlled.filter(v => v !== "option3")
                    : [...controlled, "option3"];
                  setControlled(newValue);
                }}>
              <AnimatedSwitch 
                pressed={controlled.includes("option3")} 
                onPressedChange={() => {
                  const newValue = controlled.includes("option3")
                    ? controlled.filter(v => v !== "option3")
                    : [...controlled, "option3"];
                  setControlled(newValue);
                }}
                style={styles.switch}
              />
              <Text style={styles.label}>Option 3</Text>
            </Button>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Settings Panel</Text>
          <Text as="p" style={styles.description}>
            Common switch group use case
          </Text>

          <View style={styles.group}>
            <Button style={styles.row} onPress={() => {
                  const newValue = settings.includes("notifications")
                    ? settings.filter(v => v !== "notifications")
                    : [...settings, "notifications"];
                  setSettings(newValue);
                }}>
              <AnimatedSwitch 
                pressed={settings.includes("notifications")} 
                onPressedChange={() => {
                  const newValue = settings.includes("notifications")
                    ? settings.filter(v => v !== "notifications")
                    : [...settings, "notifications"];
                  setSettings(newValue);
                }}
                style={styles.switch}
              />
              <Text style={styles.label}>Push notifications</Text>
            </Button>

            <Button style={styles.row} onPress={() => {
                  const newValue = settings.includes("email")
                    ? settings.filter(v => v !== "email")
                    : [...settings, "email"];
                  setSettings(newValue);
                }}>
              <AnimatedSwitch 
                pressed={settings.includes("email")} 
                onPressedChange={() => {
                  const newValue = settings.includes("email")
                    ? settings.filter(v => v !== "email")
                    : [...settings, "email"];
                  setSettings(newValue);
                }}
                style={styles.switch}
              />
              <Text style={styles.label}>Email updates</Text>
            </Button>

            <Button style={styles.row} onPress={() => {
                  const newValue = settings.includes("darkMode")
                    ? settings.filter(v => v !== "darkMode")
                    : [...settings, "darkMode"];
                  setSettings(newValue);
                }}>
              <AnimatedSwitch 
                pressed={settings.includes("darkMode")} 
                onPressedChange={() => {
                  const newValue = settings.includes("darkMode")
                    ? settings.filter(v => v !== "darkMode")
                    : [...settings, "darkMode"];
                  setSettings(newValue);
                }}
                style={styles.switch}
              />
              <Text style={styles.label}>Dark mode</Text>
            </Button>
          </View>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Filter Controls</Text>
          <Text as="p" style={styles.description}>
            Multiple selection filters
          </Text>

          <View style={styles.group}>
            <Text style={styles.filterTitle}>Filter by category:</Text>
            
            <Button style={styles.row} onPress={() => {
                  const newValue = filters.includes("electronics")
                    ? filters.filter(v => v !== "electronics")
                    : [...filters, "electronics"];
                  setFilters(newValue);
                }}>
              <AnimatedSwitch 
                pressed={filters.includes("electronics")} 
                onPressedChange={() => {
                  const newValue = filters.includes("electronics")
                    ? filters.filter(v => v !== "electronics")
                    : [...filters, "electronics"];
                  setFilters(newValue);
                }}
                style={styles.switch}
              />
              <Text style={styles.label}>Electronics</Text>
            </Button>

            <Button style={styles.row} onPress={() => {
                  const newValue = filters.includes("clothing")
                    ? filters.filter(v => v !== "clothing")
                    : [...filters, "clothing"];
                  setFilters(newValue);
                }}>
              <AnimatedSwitch 
                pressed={filters.includes("clothing")} 
                onPressedChange={() => {
                  const newValue = filters.includes("clothing")
                    ? filters.filter(v => v !== "clothing")
                    : [...filters, "clothing"];
                  setFilters(newValue);
                }}
                style={styles.switch}
              />
              <Text style={styles.label}>Clothing</Text>
            </Button>

            <Button style={styles.row} onPress={() => {
                  const newValue = filters.includes("books")
                    ? filters.filter(v => v !== "books")
                    : [...filters, "books"];
                  setFilters(newValue);
                }}>
              <AnimatedSwitch 
                pressed={filters.includes("books")} 
                onPressedChange={() => {
                  const newValue = filters.includes("books")
                    ? filters.filter(v => v !== "books")
                    : [...filters, "books"];
                  setFilters(newValue);
                }}
                style={styles.switch}
              />
              <Text style={styles.label}>Books</Text>
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
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
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
});
