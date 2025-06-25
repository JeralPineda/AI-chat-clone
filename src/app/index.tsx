import { ListItem } from "@/components/list-item";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="bg-white dark:bg-black flex-1 justify-center items-center">
      <Text className="text-dark dark:text-white text-3xl font-semibold">Hello World</Text>
      <ListItem />
      <StatusBar style="auto" />
    </View>
  );
}
