import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";
import ChatInput from "@/components/chat-input";
import { useChatStore } from "@/store/chat-store";
import { router } from "expo-router";
import { Message } from "@/types/types";

export default function HomeScreen() {
  const createNewChat = useChatStore((state) => state.createNewChat);
  const addNewMessage = useChatStore((state) => state.addNewMessage);

  const handleSend = async (message: string, imageBase64: string | null) => {
    const newChatId = createNewChat(message.slice(0, 50));

    addNewMessage(newChatId, {
      id: Date.now().toString(),
      role: "user",
      message,
      ...(imageBase64 && { image: imageBase64 }),
    });

    router.push(`/chat/${newChatId}`);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, imageBase64 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      const apiResponseMessage: Message = {
        id: Date.now().toString(),
        message: data.responseMessage,
        responseId: data.responseId,
        role: "assistant",
      };

      addNewMessage(newChatId, apiResponseMessage);
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
