import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";
import ChatInput from "@/components/chat-input";
import { useChatStore } from "@/store/chat-store";
import { router } from "expo-router";

export default function HomeScreen() {
  const createNewChat = useChatStore((state) => state.createNewChat);
  const addNewMessage = useChatStore((state) => state.addNewMessage);

  const handleSend = async (message: string) => {
    const newChatId = createNewChat(message.slice(0, 50));
    addNewMessage(newChatId, {
      id: Date.now().toString(),
      role: "user",
      message,
    });
    router.push(`/chat/${newChatId}`);

    try {
      const response = await fetch("/api/chat");
      const data = await response.json();
      console.log("🚀 index.tsx -> #22 -> data ~", data);
    } catch (error) {
      console.log("🚀 index.tsx -> #21 -> Chat error ~", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="bg-black flex-1 justify-center">
        <View className="flex-1">
          <Text className="text-white text-3xl font-semibold">Hello World</Text>
        </View>

        <ChatInput onSend={handleSend} isLoading={false} />
      </View>
    </TouchableWithoutFeedback>
  );
}
