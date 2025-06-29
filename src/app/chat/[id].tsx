import ChatInput from "@/components/chat-input";
import MessageListItem from "@/components/message-list-item";
import { useChatStore } from "@/store/chat-store";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

export default function ChatScreen() {
  const flatListRef = useRef<FlatList | null>(null);
  const { id } = useLocalSearchParams<{ id: string }>();
  const chat = useChatStore((state) =>
    state.chatHistory.find((chat) => chat.id === id)
  );
  const addNewMessage = useChatStore((state) => state.addNewMessage);
  const setIsWaitingForResponse = useChatStore(
    (state) => state.setIsWaitingForResponse
  );
  const isWaitingForResponse = useChatStore(
    (state) => state.isWaitingForResponse
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    return () => clearTimeout(timeout);
  }, [chat?.messages]);

  const handleSend = async (message: string, imageBase64: string | null) => {
    if (!chat) return;

    setIsWaitingForResponse(true);

    addNewMessage(chat.id, {
      id: Date.now().toString(),
      role: "user",
      message,
      ...(imageBase64 && { image: imageBase64 }),
    });

    const previousResponseId =
      chat.messages[chat.messages.length - 1]?.responseId;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          imageBase64,
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
    } finally {
      setIsWaitingForResponse(false);
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
        ref={flatListRef}
        data={chat?.messages || []}
        renderItem={({ item }) => <MessageListItem messageItem={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 15 }}
        ListFooterComponent={() =>
          isWaitingForResponse && (
            <Text className="text-gray-400 px-6 mb-4 animate-pulse">
              Waiting for response...
            </Text>
          )
        }
      />

      <ChatInput onSend={handleSend} />
    </View>
  );
}
