import { useLocalSearchParams } from "expo-router";
import {
  FlatList,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import chatHistory from "@/assets/data/chatHistory.json";
import ChatInput from "@/components/chat-input";
import MessageListItem from "@/components/message-list-item";
import { Message } from "@/types/message";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();

  const chat = chatHistory.find((chat) => chat.id === id);

  const handleSend = async (message: string) => {
    console.log("🚀 [id].tsx -> #12 -> message ~", message);
  };

  if (!chat) {
    return (
      <View className="bg-black flex-1 justify-center items-center">
        <Text className="text-white">Chat {id} not found</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="bg-black flex-1">
        <FlatList
          data={chat?.messages as Message[]}
          renderItem={({ item }) => <MessageListItem messageItem={item} />}
          contentContainerStyle={{ paddingTop: 15 }}
        />

        <ChatInput onSend={handleSend} isLoading={false} />
      </View>
    </TouchableWithoutFeedback>
  );
}
