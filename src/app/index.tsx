import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";
import ChatInput from "@/components/chat-input";
import { useChatStore } from "@/store/chat-store";
import { router } from "expo-router";
import { Message } from "@/types/types";
import {
  createAIImage,
  getSpeechResponse,
  getTextResponse,
} from "@/services/chat-service";

export default function HomeScreen() {
  const createNewChat = useChatStore((state) => state.createNewChat);
  const addNewMessage = useChatStore((state) => state.addNewMessage);
  const setIsWaitingForResponse = useChatStore(
    (state) => state.setIsWaitingForResponse
  );

  const handleSend = async (
    message: string,
    imageBase64: string | null,
    isImageGeneration: boolean,
    audioBase64: string | null
  ) => {
    setIsWaitingForResponse(true);

    const newChatId = createNewChat(message.slice(0, 50) || "New Chat");

    if (!audioBase64) {
      addNewMessage(newChatId, {
        id: Date.now().toString(),
        role: "user",
        message,
        ...(imageBase64 && { image: imageBase64 }),
      });
    }

    router.push(`/chat/${newChatId}`);

    try {
      let data;

      if (audioBase64) {
        data = await getSpeechResponse(audioBase64);
        const myMessage: Message = {
          id: Date.now().toString(),
          role: "user",
          message: data.transcribedMessage,
        };
        addNewMessage(newChatId, myMessage);
      } else if (isImageGeneration) {
        data = await createAIImage(message);
      } else {
        data = await getTextResponse(message, imageBase64);
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

      addNewMessage(newChatId, aiResponseMessage);
    } catch (error) {
      console.log("🚀 index.tsx -> #21 -> Chat error ~", error);
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="bg-black flex-1 justify-center">
        <View className="flex-1">
          <Text className="text-white text-3xl font-semibold">Hello World</Text>
        </View>

        <ChatInput onSend={handleSend} />
      </View>
    </TouchableWithoutFeedback>
  );
}
