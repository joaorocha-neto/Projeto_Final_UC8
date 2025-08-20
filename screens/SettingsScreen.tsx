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
  const [autoSync, setAutoSync] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 py-6">
        <View className="bg-blue-700 rounded-xl p-6 mb-8">
          <Text className="text-3xl font-bold text-white text-center">Configurações</Text>
          <Text className="text-lg text-purple-100 text-center mt-2">Opções</Text>
        </View>
        
        <View className="bg-gray-100 rounded-lg p-4 mb-6">
          <View className="flex-row justify-between items-center py-3 border-b border-gray-300">
            <Text className="text-gray-900 text-lg">Notificações</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#374151', true: '#7C3AED' }}
              thumbColor={notifications ? '#A855F7' : '#9CA3AF'}
            />
          </View>
          
          <View className="flex-row justify-between items-center py-3">
            <Text className="text-gray-900 text-lg">Sincronização Automática</Text>
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
            className="bg-blue-900 rounded-lg p-4 mb-4"
            onPress={() => navigation.navigate('Home')}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Voltar ao Início
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-blue-900 rounded-lg p-4 mb-4"
            onPress={() => navigation.navigate('Profile')}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Ver Perfil
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-red-700 rounded-lg p-4"
            onPress={() => {
              console.log('Logout pressed');
              navigation.navigate('Login')
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