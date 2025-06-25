import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View className="bg-black flex-1">
      <Text className="text-white">Chat Screen: {id}</Text>
    </View>
  );
}
