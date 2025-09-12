// apps/sandbox/app/index.tsx
import { Link } from "expo-router";
import { View, Text } from "@native-ui-org/primitives";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white">
      <Text className="text-xl font-bold">Sandbox</Text>
      <Link href="/preview/view">Preview View</Link>
      <Link href="/preview/text">Preview Text</Link>
      <Link href="/preview/pressable">Preview Pressable</Link>
    </View>
  );
}
