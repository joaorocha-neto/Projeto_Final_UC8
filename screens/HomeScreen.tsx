import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabNavigationProp } from "../navigation/types";
import { Ionicons } from "@expo/vector-icons";

interface HomeScreenProps {
  navigation: TabNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4">
        <View className="bg-blue-700 rounded-xl p-6 mb-6 mt-4">
          <Text className="text-3xl font-bold text-white text-center">
            Sistema de Zeladoria
          </Text>
          <Text className="text-lg text-green-100 text-center mt-2">
            Gerencie salas e controle de limpeza
          </Text>
        </View>

        <View className="bg-gray-100 rounded-lg p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <Ionicons name="phone-portrait" size={24} color="#111827" />
            <Text className="text-xl font-semibold text-gray-900 ml-2">
              Como Funciona o App
            </Text>
          </View>
          <Text className="text-sm text-gray-600 mb-2">
            Este aplicativo permite gerenciar salas e controlar o status de limpeza de forma eficiente.
          </Text>
        </View>

        <View className="bg-gray-100 rounded-lg p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <Ionicons name="business" size={24} color="#111827" />
            <Text className="text-xl font-semibold text-gray-900 ml-2">
              Funcionalidades Principais
            </Text>
          </View>

          <View className="mb-3">
            <View className="flex-row items-center mb-1">
              <Ionicons name="eye" size={16} color="#374151" />
              <Text className="text-base font-semibold text-gray-800 ml-2">
                Visualizar Salas
              </Text>
            </View>
            <Text className="text-sm text-gray-600">
              Veja todas as salas disponíveis com informações detalhadas como capacidade, localização e status de limpeza.
            </Text>
          </View>

          <View className="mb-3">
            <View className="flex-row items-center mb-1">
              <Ionicons name="checkmark-circle" size={16} color="#374151" />
              <Text className="text-base font-semibold text-gray-800 ml-2">
                Marcar como Limpa
              </Text>
            </View>
            <Text className="text-sm text-gray-600">
              Registre quando uma sala foi limpa, adicionando observações opcionais sobre o trabalho realizado.
            </Text>
          </View>

          <View className="mb-3">
            <View className="flex-row items-center mb-1">
              <Ionicons name="stats-chart" size={16} color="#374151" />
              <Text className="text-base font-semibold text-gray-800 ml-2">
                Controle de Status
              </Text>
            </View>
            <Text className="text-sm text-gray-600">
              Acompanhe quais salas estão limpas (verde) ou precisam de limpeza (vermelho).
            </Text>
          </View>

          <View className="mb-3">
            <View className="flex-row items-center mb-1">
              <Ionicons name="shield-checkmark" size={16} color="#374151" />
              <Text className="text-base font-semibold text-gray-800 ml-2">
                Gerenciamento (Administradores)
              </Text>
            </View>
            <Text className="text-sm text-gray-600">
              Crie, edite e exclua salas conforme necessário (apenas para superusuários).
            </Text>
          </View>
        </View>

        <View className="bg-gray-100 rounded-lg p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <Ionicons name="help-circle" size={24} color="#111827" />
            <Text className="text-xl font-semibold text-gray-900 ml-2">
              Como Usar
            </Text>
          </View>

          <View className="mb-3">
            <Text className="text-base font-semibold text-gray-800 mb-1">
              1. Acesse a aba "Salas"
            </Text>
            <Text className="text-sm text-gray-600">
              Visualize todas as salas disponíveis no sistema.
            </Text>
          </View>

          <View className="mb-3">
            <Text className="text-base font-semibold text-gray-800 mb-1">
              2. Verifique o Status
            </Text>
            <Text className="text-sm text-gray-600">
              Cada sala mostra se está limpa ou precisa de limpeza.
            </Text>
          </View>

          <View className="mb-3">
            <Text className="text-base font-semibold text-gray-800 mb-1">
              3. Marque como Limpa
            </Text>
            <Text className="text-sm text-gray-600">
              Após limpar uma sala, toque no botão "Marcar como Limpa" e adicione observações se necessário.
            </Text>
          </View>

          <View className="mb-3">
            <Text className="text-base font-semibold text-gray-800 mb-1">
              4. Atualize a Lista
            </Text>
            <Text className="text-sm text-gray-600">
              Puxe a tela para baixo para atualizar a lista de salas e ver as mudanças.
            </Text>
          </View>
        </View>

        <View className="bg-gray-100 rounded-lg p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <Ionicons name="person" size={24} color="#111827" />
            <Text className="text-xl font-semibold text-gray-900 ml-2">
              Perfil
            </Text>
          </View>
          <Text className="text-sm text-gray-600 mb-3">
            Acesse suas informações de perfil, altere sua senha e visualize seu perfil.
          </Text>

          <TouchableOpacity
            className="bg-blue-600 rounded-lg p-3"
            onPress={() => navigation.navigate("Settings")}
          >
            <Text className="text-white text-center font-semibold text-base">
              Ir para Perfil
            </Text>
          </TouchableOpacity>
        </View>

        <View className="bg-gray-100 rounded-lg p-4 mb-6">
          <View className="flex-row items-center mb-3">
            <Ionicons name="play-circle" size={24} color="#111827" />
            <Text className="text-xl font-semibold text-gray-900 ml-2">
              Começar Agora
            </Text>
          </View>
          <Text className="text-sm text-gray-600 mb-3">
            Acesse a seção de salas para começar a gerenciar a limpeza.
          </Text>

          <TouchableOpacity
            className="bg-blue-600 rounded-lg p-3"
            onPress={() => navigation.navigate("Rooms")}
          >
            <Text className="text-white text-center font-semibold text-base">
              Acessar Salas
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
