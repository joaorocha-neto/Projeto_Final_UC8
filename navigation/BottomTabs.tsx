import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { tabRoutes } from "./tabRoutes";
import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useWindowDimensions, View } from "react-native";

const Tab = createBottomTabNavigator();

const BottomTabs: React.FC = () => {
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3B82F6",
        animation: "shift",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E7EB",
        },
      }}
    >
      {tabRoutes.map((route) => (
        <Tab.Screen
          key={route.name}
          name={route.name}
          component={route.component}
          options={{
            tabBarLabel: ({ color }) => (
              <Text style={{ color, fontSize: 12, fontWeight: "600" }}>
                {route.label}
              </Text>
            ),
            tabBarIcon: ({ color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap = "home";

              switch (route.name) {
                case "Home":
                  iconName = "home-outline";
                  break;
                case "Rooms":
                  iconName = "layers-outline";
                  break;
                case "Settings":
                  iconName = "person-outline";
                  break;
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default BottomTabs;
