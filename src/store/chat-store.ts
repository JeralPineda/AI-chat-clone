import { Chat, Message } from "@/types/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ChatStore {
  chatHistory: Chat[];
  isWaitingForResponse: boolean;

  setIsWaitingForResponse: (isWaitingForResponse: boolean) => void;
  createNewChat: (title: string) => string;
  addNewMessage: (chatId: string, message: Message) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      chatHistory: [],
      isWaitingForResponse: false,

      setIsWaitingForResponse: (isWaitingForResponse: boolean) => {
        set({
          isWaitingForResponse,
        });
      },

      createNewChat: (title: string) => {
        const newChat: Chat = {
          id: Date.now().toString(),
          title,
          messages: [],
        };

        set((state) => ({
          chatHistory: [newChat, ...state.chatHistory],
        }));

        return newChat.id;
      },

      addNewMessage: (chatId: string, message: Message) => {
        set((state) => ({
          chatHistory: state.chatHistory.map((chat) =>
            chat.id === chatId
              ? { ...chat, messages: [...chat.messages, message] }
              : chat
          ),
        }));
      },
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
