import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoSync, setAutoSync] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-1 px-4 py-6">
        <View className="bg-purple-700 rounded-xl p-6 mb-8">
          <Text className="text-3xl font-bold text-white text-center">Configurações</Text>
          <Text className="text-lg text-purple-100 text-center mt-2">Personalize seu app</Text>
        </View>
        
        <View className="bg-gray-800 rounded-lg p-4 mb-6">
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-lg">Notificações</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#374151', true: '#7C3AED' }}
              thumbColor={notifications ? '#A855F7' : '#9CA3AF'}
            />
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
            <Text className="text-white text-lg">Modo Escuro</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#374151', true: '#7C3AED' }}
              thumbColor={darkMode ? '#A855F7' : '#9CA3AF'}
            />
          </View>
          
          <View className="flex-row justify-between items-center py-3">
            <Text className="text-white text-lg">Sincronização Automática</Text>
            <Switch
              value={autoSync}
              onValueChange={setAutoSync}
              trackColor={{ false: '#374151', true: '#7C3AED' }}
              thumbColor={autoSync ? '#A855F7' : '#9CA3AF'}
            />
          </View>
        </View>
        
        <View>
          <TouchableOpacity
            className="bg-blue-600 rounded-lg p-4 mb-4"
            onPress={() => navigation.navigate('Home')}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Voltar ao Início
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-green-600 rounded-lg p-4 mb-4"
            onPress={() => navigation.navigate('Profile')}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Ver Perfil
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-red-600 rounded-lg p-4"
            onPress={() => {
              // Here you could add logout functionality
              console.log('Logout pressed');
            }}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Sair do App
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;