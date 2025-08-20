import React from "react";
import "./global.css"; 
import AppNavigator from "./navigation/AppNavigator";
import "react-native-gesture-handler";
import AppLoading from "expo-app-loading";
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from "@expo-google-fonts/poppins";

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return <AppNavigator />;
}
