import { Message } from "@/types/types";
import { markdownStyles } from "@/utils/markdown";
import { Image, View } from "react-native";
import Markdown from "react-native-markdown-display";

interface MessageListItemProps {
  messageItem: Message;
}

export default function MessageListItem({ messageItem }: MessageListItemProps) {
  const { role, message, image } = messageItem;
  const isUser = role === "user";

  return (
    <View className={`mb-3 px-2 ${isUser ? "items-end" : "items-start"}`}>
      {!!image && (
        <Image
          source={{ uri: image }}
          className={`rounded-lg mb-2 ${isUser ? "w-40 h-40" : "w-full aspect-square"}`}
          resizeMode="cover"
        />
      )}

      {!!message && (
        <View
          className={`rounded-2xl p-4 ${isUser && "bg-[#262626]"} max-w-[70%]`}
        >
          <Markdown style={markdownStyles}>{message}</Markdown>
        </View>
      )}
    </View>
  );
}
