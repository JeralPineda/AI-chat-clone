import { Message } from "@/types/types";
import { markdownStyles } from "@/utils/markdown";
import { View } from "react-native";
import Markdown from "react-native-markdown-display";

interface MessageListItemProps {
  messageItem: Message;
}

export default function MessageListItem({ messageItem }: MessageListItemProps) {
  const { role, message } = messageItem;
  const isUser = role === "user";

  return (
    <View
      className={`flex-row mb-3 px-2 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <View
        className={`rounded-2xl p-4 ${isUser && "bg-[#262626]"} max-w-[70%]`}
      >
        <Markdown style={markdownStyles}>{message}</Markdown>
      </View>
    </View>
  );
}
