import "../../global.css";

import { Drawer } from "expo-router/drawer";
import { StyleSheet, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesome5 } from "@expo/vector-icons";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import HistoryChatDrawer from "@/components/history-chat-drawer";

const myTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "white",
  },
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <ThemeProvider value={myTheme}>
        <Drawer
          drawerContent={HistoryChatDrawer}
          screenOptions={{
            headerTitle: "",
            headerStyle: { backgroundColor: "black" },
            drawerInactiveTintColor: "white",
            drawerStyle: {
              borderRightColor: "gray",
              borderRightWidth: StyleSheet.hairlineWidth,
            },
          }}
        >
          <Drawer.Screen
            name="index"
            options={{
              drawerLabel: "ChatGPT",
              drawerIcon: ({ focused, color, size }) => <FontAwesome5 name="atom" size={18} color="white" />,
            }}
          />

          <Drawer.Screen
            name="chat/[id]"
            options={{
              drawerItemStyle: {
                display: "none",
              },
            }}
          />

          <StatusBar style="auto" />
        </Drawer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
