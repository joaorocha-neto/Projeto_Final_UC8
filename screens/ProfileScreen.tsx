import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-4">
        <View className="bg-blue-700 rounded-xl p-6 mb-8">
          <Text className="text-3xl font-bold text-white text-center">Perfil do Usuário</Text>
          <Text className="text-lg text-green-100 text-center mt-2">Suas informações pessoais</Text>
        </View>
        
        <View className="bg-gray-100 rounded-lg p-6 mb-8 w-full max-w-sm">
          <Text className="text-gray-900 text-lg font-semibold mb-2">Nome:</Text>
          <Text className="text-gray-700 text-base mb-4">João Neto</Text>
          
          <Text className="text-gray-900 text-lg font-semibold mb-2">Email:</Text>
          <Text className="text-gray-700 text-base mb-4">joao@email.com</Text>
          
          <Text className="text-gray-900 text-lg font-semibold mb-2">Categoria:</Text>
          <Text className="text-green-700 text-base">Zelador</Text>
        </View>
        
        <View className="w-full max-w-xs">
          <TouchableOpacity
            className="bg-blue-900 rounded-lg p-4 mb-4"
            onPress={() => navigation.navigate('Home')}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Voltar ao Início
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-blue-900 rounded-lg p-4"
            onPress={() => navigation.navigate('Settings')}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Configurações
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;