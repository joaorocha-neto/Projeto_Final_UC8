import { SafeAreaView } from "react-native-safe-area-context";
import "./global.css"
import { Text, View } from "react-native";
 
export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <SafeAreaView>
        <View className="bg-blue-700 rounded-xl p-4">
          <Text className="text-6xl font-bold">Bora bill</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}