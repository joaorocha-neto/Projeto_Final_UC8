import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from "../services/authContext";
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { tabRoutes } from '../navigation/tabRoutes';

type SettingsScreenNavigationProp = BottomTabNavigationProp<
  Record<typeof tabRoutes[number]['name'], undefined>,
  'Settings'
>;

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { logout } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 py-6">
        <View className="bg-blue-700 rounded-xl p-6 mb-8">
          <Text className="text-3xl font-bold text-white text-center">Configurações</Text>
          <Text className="text-lg text-purple-100 text-center mt-2">Opções</Text>
        </View>

        <View className="bg-gray-100 rounded-lg p-4 mb-6">
          
        </View>

        <View>
          
          <TouchableOpacity
            className="bg-red-700 rounded-lg p-4"
            onPress={logout}
          >
            <Text className="text-white text-center font-semibold text-lg">Sair do App</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
