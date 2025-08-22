import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { tabRoutes } from '../navigation/tabRoutes';

type RoomsScreenNavigationProp = BottomTabNavigationProp<
  Record<typeof tabRoutes[number]['name'], undefined>,
  'Rooms'
>;

interface RoomsScreenProps {
  navigation: RoomsScreenNavigationProp;
}

const salas = [
  { id: 1, nome: 'SmartLabs', capacidade: 30, info: 'Sala equipada com projetor e ar-condicionado.' },
  { id: 2, nome: 'Lab 2', capacidade: 35, info: 'Sala equipada com computadores potentes, projetor e ar-condicionado.' },
  { id: 3, nome: 'Lab 3', capacidade: 20, info: 'Sala equipada com notebooks fracos, projetor e ar-condicionado.' }, 
  { id: 4, nome: 'Labs', capacidade: 20, info: 'Sala de desenvolvimento.' },
  { id: 5, nome: 'Auditorio', capacidade: 80, info: 'Sala de apresentação de trabalhos.' },
];

const RoomsScreen: React.FC<RoomsScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4">
        
        {/* Título */}
        <View className="bg-blue-700 rounded-xl p-6 mb-4 mt-4">
          <Text className="text-3xl font-bold text-white text-center">Salas Disponíveis</Text>
          <Text className="text-lg text-green-100 text-center mt-2">Veja informações de cada sala</Text>
        </View>

        {/* Lista com Scroll */}
        <ScrollView className="flex-1 mb-6">
          {salas.map((sala) => (
            <View key={sala.id} className="bg-gray-100 rounded-lg p-4 mb-4">
              <Text className="text-xl font-semibold text-gray-900">{sala.nome}</Text>
              <Text className="text-base text-gray-700 mt-1">Capacidade: {sala.capacidade} pessoas</Text>
              <Text className="text-sm text-gray-600 mt-1">{sala.info}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Botões de navegação */}
        <View className="w-full max-w-xs self-center mb-6">
          <TouchableOpacity
            className="bg-blue-900 rounded-lg p-4 mb-4"
            onPress={() => navigation.navigate('Home')}
          >
            <Text className="text-white text-center font-semibold text-lg">Voltar ao Início</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-blue-900 rounded-lg p-4"
            onPress={() => navigation.navigate('Settings')}
          >
            <Text className="text-white text-center font-semibold text-lg">Configurações</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default RoomsScreen;
