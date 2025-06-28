import "../../global.css";

import HistoryChatDrawer from "@/components/history-chat-drawer";
import { FontAwesome5 } from "@expo/vector-icons";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
              borderRightColor: "#363636a1",
              borderRightWidth: StyleSheet.hairlineWidth,
            },
          }}
        >
          <Drawer.Screen
            name="index"
            options={{
              drawerLabel: "ChatGPT",
              drawerIcon: () => (
                <FontAwesome5 name="atom" size={18} color="white" />
              ),
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
        </Drawer>

        <StatusBar style="light" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
