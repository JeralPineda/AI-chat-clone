import ChatInput from "@/components/chat-input";
import MessageListItem from "@/components/message-list-item";
import {
  createAIImage,
  getSpeechResponse,
  getTextResponse,
} from "@/services/chat-service";
import { useChatStore } from "@/store/chat-store";
import { Message } from "@/types/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { FlatList, Text, View } from "react-native";

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

  const handleSend = async (
    message: string,
    imageBase64: string | null,
    isImageGeneration: boolean,
    audioBase64: string | null
  ) => {
    if (!chat) return;

    setIsWaitingForResponse(true);

    if (!audioBase64) {
      addNewMessage(chat.id, {
        id: Date.now().toString(),
        role: "user",
        message,
        ...(imageBase64 && { image: imageBase64 }),
      });
    }

    const previousResponseId = chat.messages.findLast(
      (message) => message.responseId
    )?.responseId;

    try {
      let data;

      if (audioBase64) {
        data = await getSpeechResponse(audioBase64, previousResponseId);
        const myMessage: Message = {
          id: Date.now().toString(),
          role: "user",
          message: data.transcribedMessage,
        };
        addNewMessage(chat.id, myMessage);
      } else if (isImageGeneration) {
        data = await createAIImage(message);
      } else {
        data = await getTextResponse(message, imageBase64, previousResponseId);
      }

      const aiResponseMessage: Message = isImageGeneration
        ? {
            id: Date.now().toString(),
            role: "assistant",
            image: data.image,
          }
        : {
            id: Date.now().toString(),
            role: "assistant",
            message: data.responseMessage,
            responseId: data.responseId,
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
