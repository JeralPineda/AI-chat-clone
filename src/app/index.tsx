import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";
import ChatInput from "@/components/chat-input";

export default function HomeScreen() {
  const handleSend = async (message: string) => {
    console.log("🚀 index.tsx -> #6 -> message ~", message);
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
