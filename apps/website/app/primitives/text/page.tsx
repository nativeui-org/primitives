"use client";
import { Text, View } from "@native-ui-org/primitives";

export default function TextDemo() {
  return (
    <main className="container py-8">
      <h1 className="text-2xl font-semibold mb-4">Text</h1>
      <View style={{ gap: 12 }}>
        <Text as="h1" style={{ fontSize: 28, fontWeight: "700" }}>Heading 1</Text>
        <Text as="h2" style={{ fontSize: 24, fontWeight: "600" }}>Heading 2</Text>
        <Text as="p" style={{ fontSize: 16 }}>Paragraph with <Text style={{ fontWeight: "600" }}>inline emphasis</Text> and accessible semantics.</Text>
        <Text as="span" style={{ fontSize: 12, color: "#71717a" }}>Muted caption</Text>
        <Text as="a" href="#" style={{ color: "#2563eb" }}>Link</Text>
      </View>
    </main>
  );
}
