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

  const handleSend = async (message: string) => {
    if (!chat) return;

    addNewMessage(chat.id, {
      id: Date.now().toString(),
      role: "user",
      message,
    });
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
