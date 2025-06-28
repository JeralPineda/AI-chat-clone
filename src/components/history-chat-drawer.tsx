import { useChatStore } from "@/store/chat-store";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { router, usePathname } from "expo-router";

export default function HistoryChatDrawer(props: DrawerContentComponentProps) {
  const chatHistory = useChatStore((state) => state.chatHistory);

  const pathName = usePathname();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

      {chatHistory.map((chat) => (
        <DrawerItem
          key={chat.id}
          label={chat.title}
          inactiveTintColor="white"
          focused={pathName === `/chat/${chat.id}`}
          onPress={() => router.push(`/chat/${chat.id}`)}
        />
      ))}
    </DrawerContentScrollView>
  );
}
