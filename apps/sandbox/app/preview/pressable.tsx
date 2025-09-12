// apps/sandbox/app/preview/pressable.tsx
import { View, Text, Pressable } from "@native-ui-org/primitives";

export default function PreviewPressable() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-red-50">
      <Text className="text-lg">Preview of Pressable primitive</Text>
      <Pressable className="px-4 py-2 bg-red-500 rounded-lg">
        <Text className="text-white">Click me</Text>
      </Pressable>
    </View>
  );
}
