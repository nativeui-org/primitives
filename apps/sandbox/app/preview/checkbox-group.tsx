import { Stack } from "expo-router";
import { View, Text } from "@native-ui-org/primitives";
import { Checkbox, CheckboxGroup, CheckboxLabel } from "@native-ui-org/primitives";
import { StyleSheet, Platform, ScrollView, Pressable } from "react-native";
import React, { useState } from "react";

export default function CheckboxGroupPreview() {
  const [notifications, setNotifications] = useState<string[]>(["email"]);
  const [tasks, setTasks] = useState<string[]>(["task-1"]);
  const [filters, setFilters] = useState<string[]>(["all"]);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Checkbox Group" }} />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text as="h2" style={styles.sectionTitle}>CheckboxGroup Primitive</Text>
          <Text as="p" style={styles.description}>
            Manage multiple related checkboxes with coordinated state. Perfect for settings and filters.
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Platform Behavior</Text>
          <Text as="p" style={styles.description}>
            • <Text style={styles.bold}>Web:</Text> Group semantics with proper ARIA{"\n"}
            • <Text style={styles.bold}>Native:</Text> Coordinated state management{"\n"}
            • <Text style={styles.bold}>State:</Text> Controlled and uncontrolled modes{"\n"}
            • <Text style={styles.bold}>Values:</Text> Array of selected values
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Basic Group</Text>
          <Text as="p" style={styles.description}>
            Multiple checkboxes with shared state
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
                <Checkbox id="email" value="email" />
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
                <Checkbox id="push" value="push" />
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
                <Checkbox id="sms" value="sms" />
                <CheckboxLabel htmlFor="sms" style={styles.label}>
                  SMS notifications
                </CheckboxLabel>
              </Pressable>
            </View>
          </CheckboxGroup>
          
          <Text style={styles.hint}>
            Selected: {notifications.length > 0 ? notifications.join(", ") : "none"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text as="h3" style={styles.subTitle}>Todo List</Text>
          <Text as="p" style={styles.description}>
            Task management with strikethrough effect
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
                <Checkbox id="task-1" value="task-1" />
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
                <Checkbox id="task-2" value="task-2" />
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
                <Checkbox id="task-3" value="task-3" />
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
          <Text as="h3" style={styles.subTitle}>Filters</Text>
          <Text as="p" style={styles.description}>
            Product category filters
          </Text>
          
          <CheckboxGroup value={filters} onValueChange={setFilters}>
            <View style={styles.group}>
              <Pressable style={styles.row} onPress={() => {
                setFilters(prev => 
                  prev.includes("all") 
                    ? prev.filter(v => v !== "all") 
                    : [...prev, "all"]
                );
              }}>
                <Checkbox id="all" value="all" />
                <CheckboxLabel htmlFor="all" style={styles.label}>
                  All categories
                </CheckboxLabel>
              </Pressable>
              
              <Pressable style={styles.row} onPress={() => {
                setFilters(prev => 
                  prev.includes("electronics") 
                    ? prev.filter(v => v !== "electronics") 
                    : [...prev, "electronics"]
                );
              }}>
                <Checkbox id="electronics" value="electronics" />
                <CheckboxLabel htmlFor="electronics" style={styles.label}>
                  Electronics
                </CheckboxLabel>
              </Pressable>
              
              <Pressable style={styles.row} onPress={() => {
                setFilters(prev => 
                  prev.includes("clothing") 
                    ? prev.filter(v => v !== "clothing") 
                    : [...prev, "clothing"]
                );
              }}>
                <Checkbox id="clothing" value="clothing" />
                <CheckboxLabel htmlFor="clothing" style={styles.label}>
                  Clothing
                </CheckboxLabel>
              </Pressable>
            </View>
          </CheckboxGroup>
          
          <Text style={styles.hint}>
            Active filters: {filters.length}
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
