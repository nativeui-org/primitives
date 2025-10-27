"use client";
import { View, Text, Switch } from "@native-ui-org/primitives";
import React from "react";

export default function SwitchDemo() {
  const [on, setOn] = React.useState(false);
  return (
    <main className="container py-8">
      <h1 className="text-2xl font-semibold mb-4">Switch</h1>
      <View style={{ gap: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Switch pressed={on} onPressedChange={setOn} style={{ width: 50, height: 30 }}>
            <View style={{ flex: 1, backgroundColor: on ? "#22c55e" : "#e5e7eb", borderRadius: 16, padding: 2, justifyContent: "center" }}>
              <View style={{ width: 26, height: 26, borderRadius: 9999, backgroundColor: "#fff", transform: [{ translateX: on ? 20 : 2 }] }} />
            </View>
          </Switch>
          <Text as="span">{on ? "On" : "Off"}</Text>
        </View>
      </View>
    </main>
  );
}
