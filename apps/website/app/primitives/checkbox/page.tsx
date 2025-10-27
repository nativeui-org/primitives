"use client";
import { View, Text, Checkbox } from "@native-ui-org/primitives";
import * as React from "react";

export default function CheckboxDemo() {
  const [checked, setChecked] = React.useState(true);
  return (
    <main className="container py-8">
      <h1 className="text-2xl font-semibold mb-4">Checkbox</h1>
      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Checkbox checked={checked} onCheckedChange={(v) => setChecked(v === true)}>
            <View style={{ width: 20, height: 20, borderRadius: 4, backgroundColor: checked ? "#18181b" : "transparent", borderWidth: checked ? 0 : 2, borderColor: "#d4d4d8", alignItems: "center", justifyContent: "center" }}>
              {checked && <View style={{ width: 10, height: 10, backgroundColor: "#fff" }} />}
            </View>
          </Checkbox>
          <Text as="span">{checked ? "Checked" : "Unchecked"}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Checkbox defaultChecked={false}>
            <View style={{ width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: "#d4d4d8" }} />
          </Checkbox>
          <Text as="span">Uncontrolled</Text>
        </View>
      </View>
    </main>
  );
}
