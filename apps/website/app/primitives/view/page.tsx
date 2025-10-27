"use client";
import { View } from "@native-ui-org/primitives";

export default function ViewDemo() {
  return (
    <main className="container py-8">
      <h1 className="text-2xl font-semibold mb-4">View</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <h2 className="text-sm text-muted-foreground">Basic</h2>
          <View style={{ padding: 16, backgroundColor: "#f4f4f5", borderRadius: 8 }}>
            <View style={{ height: 48, backgroundColor: "#e4e4e7", borderRadius: 6 }} />
          </View>
        </div>
        <div className="space-y-2">
          <h2 className="text-sm text-muted-foreground">Flex Row</h2>
          <View style={{ padding: 12, backgroundColor: "#f4f4f5", borderRadius: 8, gap: 8, flexDirection: "row" }}>
            <View style={{ flex: 1, height: 40, backgroundColor: "#e4e4e7", borderRadius: 6 }} />
            <View style={{ width: 40, height: 40, backgroundColor: "#e4e4e7", borderRadius: 6 }} />
          </View>
        </div>
        <div className="space-y-2">
          <h2 className="text-sm text-muted-foreground">Centered</h2>
          <View style={{ padding: 12, backgroundColor: "#f4f4f5", borderRadius: 8, height: 120, alignItems: "center", justifyContent: "center" }}>
            <View style={{ width: 64, height: 64, backgroundColor: "#e4e4e7", borderRadius: 9999 }} />
          </View>
        </div>
      </div>
    </main>
  );
}
