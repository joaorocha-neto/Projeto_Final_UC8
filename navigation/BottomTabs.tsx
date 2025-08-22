import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { tabRoutes } from './tabRoutes';
import { Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();

export type StackParamList = {
  [key: string]: undefined;
};

const BottomTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1E40AF',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      {tabRoutes.map((route) => {
        const Stack = createStackNavigator<StackParamList>();
        const StackScreen = () => (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={route.name} component={route.component} />
          </Stack.Navigator>
        );

        return (
          <Tab.Screen
            key={route.name}
            name={route.name}
            component={StackScreen}
            options={{
              tabBarLabel: ({ color }) => <Text style={{ color }}>{route.label}</Text>,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export default BottomTabs;