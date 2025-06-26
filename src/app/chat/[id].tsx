import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import chatHistory from "@/assets/data/chatHistory.json";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();

  const chat = chatHistory.find((chat) => chat.id === id);

  if (!chat) {
    return (
      <View className="bg-black flex-1 justify-center items-center">
        <Text className="text-white">Chat {id} not found</Text>
      </View>
    );
  }

  return (
    <View className="bg-black flex-1">
      <Text className="text-white">Chat Screen: {chat?.title}</Text>
    </View>
  );
}
