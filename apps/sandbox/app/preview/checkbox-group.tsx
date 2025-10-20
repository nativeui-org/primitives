import { Stack } from "expo-router";
import { View, Text } from "@native-ui-org/primitives";
import { Checkbox, CheckboxGroup, CheckboxLabel, CheckboxIndicator } from "@native-ui-org/primitives";
import { StyleSheet, Platform, ScrollView, Pressable } from "react-native";
import React, { useState } from "react";

export default function CheckboxGroupPreview() {
  const [notifications, setNotifications] = useState<string[]>(["email"]);
  const [tasks, setTasks] = useState<string[]>(["task-1"]);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Checkbox Group" }} />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>CheckboxGroup Primitive</Text>
          <Text as="p" style={styles.description}>
            Manage multiple checkboxes with coordinated state. Perfect for settings and multi-select.
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Platform Behavior</Text>
          <Text as="p" style={styles.description}>
            • <Text style={styles.bold}>Web:</Text> Group semantics with role="group"{"\n"}
            • <Text style={styles.bold}>Native:</Text> Coordinated state across checkboxes{"\n"}
            • <Text style={styles.bold}>State:</Text> Array of selected values{"\n"}
            • <Text style={styles.bold}>Controlled:</Text> Parent manages selections
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Notification Settings</Text>
          <Text as="p" style={styles.description}>
            User preferences for notifications
          </Text>
          
          <CheckboxGroup value={notifications} onValueChange={setNotifications}>
            <View style={styles.group}>
              <Pressable style={styles.row} onPress={() => {
                setNotifications(prev => 
                  prev.includes("email") 
                    ? prev.filter(v => v !== "email") 
                    : [...prev, "email"]
                );
              }}>
                <Checkbox id="email" value="email" style={styles.checkboxBox}>
                  <CheckboxIndicator>
                    <View style={styles.checkmark} />
                  </CheckboxIndicator>
                </Checkbox>
                <CheckboxLabel htmlFor="email" style={styles.label}>
                  Email notifications
                </CheckboxLabel>
              </Pressable>
              
              <Pressable style={styles.row} onPress={() => {
                setNotifications(prev => 
                  prev.includes("push") 
                    ? prev.filter(v => v !== "push") 
                    : [...prev, "push"]
                );
              }}>
                <Checkbox id="push" value="push" style={styles.checkboxBox}>
                  <CheckboxIndicator>
                    <View style={styles.checkmark} />
                  </CheckboxIndicator>
                </Checkbox>
                <CheckboxLabel htmlFor="push" style={styles.label}>
                  Push notifications
                </CheckboxLabel>
              </Pressable>
              
              <Pressable style={styles.row} onPress={() => {
                setNotifications(prev => 
                  prev.includes("sms") 
                    ? prev.filter(v => v !== "sms") 
                    : [...prev, "sms"]
                );
              }}>
                <Checkbox id="sms" value="sms" style={styles.checkboxBox}>
                  <CheckboxIndicator>
                    <View style={styles.checkmark} />
                  </CheckboxIndicator>
                </Checkbox>
                <CheckboxLabel htmlFor="sms" style={styles.label}>
                  SMS alerts
                </CheckboxLabel>
              </Pressable>
            </View>
          </CheckboxGroup>
          
          <Text style={styles.hint}>
            Selected: {notifications.join(", ") || "none"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Todo List</Text>
          <Text as="p" style={styles.description}>
            Task completion tracker
          </Text>
          
          <CheckboxGroup value={tasks} onValueChange={setTasks}>
            <View style={styles.group}>
              <Pressable style={styles.row} onPress={() => {
                setTasks(prev => 
                  prev.includes("task-1") 
                    ? prev.filter(v => v !== "task-1") 
                    : [...prev, "task-1"]
                );
              }}>
                <Checkbox id="task-1" value="task-1" style={styles.checkboxBox}>
                  <CheckboxIndicator>
                    <View style={styles.checkmark} />
                  </CheckboxIndicator>
                </Checkbox>
                <CheckboxLabel 
                  htmlFor="task-1" 
                  style={[styles.label, tasks.includes("task-1") && styles.completed]}
                >
                  Review pull request #42
                </CheckboxLabel>
              </Pressable>
              
              <Pressable style={styles.row} onPress={() => {
                setTasks(prev => 
                  prev.includes("task-2") 
                    ? prev.filter(v => v !== "task-2") 
                    : [...prev, "task-2"]
                );
              }}>
                <Checkbox id="task-2" value="task-2" style={styles.checkboxBox}>
                  <CheckboxIndicator>
                    <View style={styles.checkmark} />
                  </CheckboxIndicator>
                </Checkbox>
                <CheckboxLabel 
                  htmlFor="task-2" 
                  style={[styles.label, tasks.includes("task-2") && styles.completed]}
                >
                  Update documentation
                </CheckboxLabel>
              </Pressable>
              
              <Pressable style={styles.row} onPress={() => {
                setTasks(prev => 
                  prev.includes("task-3") 
                    ? prev.filter(v => v !== "task-3") 
                    : [...prev, "task-3"]
                );
              }}>
                <Checkbox id="task-3" value="task-3" style={styles.checkboxBox}>
                  <CheckboxIndicator>
                    <View style={styles.checkmark} />
                  </CheckboxIndicator>
                </Checkbox>
                <CheckboxLabel 
                  htmlFor="task-3" 
                  style={[styles.label, tasks.includes("task-3") && styles.completed]}
                >
                  Fix navigation bug
                </CheckboxLabel>
              </Pressable>
            </View>
          </CheckboxGroup>
          
          <Text style={styles.hint}>
            {tasks.length} of 3 completed
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Uncontrolled Group</Text>
          <Text as="p" style={styles.description}>
            Group manages its own state with defaultValue
          </Text>
          
          <CheckboxGroup defaultValue={["option-1"]}>
            <View style={styles.group}>
              <Pressable style={styles.row} onPress={(e: any) => {
                const checkbox = (e.currentTarget as HTMLElement)?.querySelector('[role="checkbox"]');
                (checkbox as any)?.click?.();
              }}>
                <Checkbox id="option-1" value="option-1" style={styles.checkboxBox}>
                  <CheckboxIndicator>
                    <View style={styles.checkmark} />
                  </CheckboxIndicator>
                </Checkbox>
                <CheckboxLabel htmlFor="option-1" style={styles.label}>
                  Option 1 (default selected)
                </CheckboxLabel>
              </Pressable>
              
              <Pressable style={styles.row} onPress={(e: any) => {
                const checkbox = (e.currentTarget as HTMLElement)?.querySelector('[role="checkbox"]');
                (checkbox as any)?.click?.();
              }}>
                <Checkbox id="option-2" value="option-2" style={styles.checkboxBox}>
                  <CheckboxIndicator>
                    <View style={styles.checkmark} />
                  </CheckboxIndicator>
                </Checkbox>
                <CheckboxLabel htmlFor="option-2" style={styles.label}>
                  Option 2
                </CheckboxLabel>
              </Pressable>
            </View>
          </CheckboxGroup>
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
    gap: 12,
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
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    width: 12,
    height: 12,
    backgroundColor: "#007AFF",
    borderRadius: 2,
  },
  indeterminateMark: {
    width: 12,
    height: 2,
    backgroundColor: "#007AFF",
  },
  completed: {
    textDecorationLine: "line-through",
    opacity: 0.6,
    color: "#666",
  },
  hint: {
    fontSize: 14,
    color: "#666",
    marginTop: 12,
    fontStyle: "italic",
  },
});