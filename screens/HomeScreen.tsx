import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { tabRoutes } from '../navigation/tabRoutes';

type HomeScreenNavigationProp = BottomTabNavigationProp<
  Record<typeof tabRoutes[number]['name'], undefined>,
  'Home'
>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center px-4">
        <View className="bg-blue-700 rounded-xl p-6 mb-8">
          <Text className="text-4xl font-bold text-white text-center">Tela Principal</Text>
          <Text className="text-lg text-blue-100 text-center mt-2">Tela Início</Text>
        </View>

        <View className="w-full max-w-52">
          <TouchableOpacity
            className="bg-blue-900 rounded-lg p-4 mb-4"
            onPress={() => navigation.navigate('Profile')}
          >
            <Text className="text-white text-center font-semibold text-lg">Ir para Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-blue-900 rounded-lg p-4 mb-4"
            onPress={() => navigation.navigate('Rooms')}
          >
            <Text className="text-white text-center font-semibold text-lg">Ir para Salas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-blue-900 rounded-lg p-4 mb-4"
            onPress={() => navigation.navigate('Settings')}
          >
            <Text className="text-white text-center font-semibold text-lg">Configurações</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;