import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatInput({
  onSend,
  isLoading,
}: {
  onSend: (message: string) => Promise<void>;
  isLoading?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    try {
      await onSend(message.trim());
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View
        className="bg-[#262626] rounded-t-2xl"
        style={{ paddingBottom: insets.bottom }}
      >
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Ask anything..."
          placeholderTextColor="gray"
          multiline
          className="pt-6 pb-2 px-4 text-white"
          keyboardAppearance="dark"
        />

        <View className="flex-row justify-between px-4 items-center">
          <MaterialCommunityIcons name="plus" size={24} color="white" />

          {!!message ? (
            <MaterialCommunityIcons
              name="arrow-up-circle"
              size={30}
              color="white"
              className="ml-auto"
              onPress={handleSend}
              disabled={isLoading}
            />
          ) : (
            <View className="flex-row ml-auto bg-white rounded-full p-2 items-center gap-1">
              <MaterialCommunityIcons
                name="account-voice"
                size={15}
                color="black"
              />
              <Text className="text-black text-xs">Voice</Text>
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
