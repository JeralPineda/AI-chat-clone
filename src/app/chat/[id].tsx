import ChatInput from "@/components/chat-input";
import MessageListItem from "@/components/message-list-item";
import { useChatStore } from "@/store/chat-store";
import { Message } from "@/types/types";
import { useLocalSearchParams } from "expo-router";
import { FlatList, Text, View } from "react-native";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();

  const chat = useChatStore((state) =>
    state.chatHistory.find((chat) => chat.id === id)
  );
  const addNewMessage = useChatStore((state) => state.addNewMessage);

  console.log("🚀 [id].tsx -> #16 -> chat ~", JSON.stringify(chat, null, 2));

  const handleSend = async (message: string) => {
    if (!chat) return;

    addNewMessage(chat.id, {
      id: Date.now().toString(),
      role: "user",
      message,
    });

    const previousResponseId =
      chat.messages[chat.messages.length - 1]?.responseId;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          previousResponseId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      const aiResponseMessage = {
        id: Date.now().toString(),
        message: data.responseMessage,
        responseId: data.responseId,
        role: "assistant" as const,
      };

      addNewMessage(chat.id, aiResponseMessage);
    } catch (error) {
      console.error("Chat error:", error);
    }
  };

  if (!chat) {
    return (
      <View className="bg-black flex-1 justify-center items-center">
        <Text className="text-white">Chat {id} not found</Text>
      </View>
    );
  }

  return (
    <View className="bg-black flex-1">
      <FlatList
        data={chat?.messages as Message[]}
        renderItem={({ item }) => <MessageListItem messageItem={item} />}
        showsVerticalScrollIndicator={false}
      />

      <ChatInput onSend={handleSend} isLoading={false} />
    </View>
  );
}
