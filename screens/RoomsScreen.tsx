import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { tabRoutes } from "../navigation/tabRoutes";
import { Sala, getSalas } from "../services/rooms/salas";

type RoomsScreenNavigationProp = BottomTabNavigationProp<
  Record<typeof tabRoutes[number]["name"], undefined>,
  "Rooms"
>;

interface RoomsScreenProps {
  navigation: RoomsScreenNavigationProp;
}

const RoomsScreen: React.FC<RoomsScreenProps> = ({ navigation }) => {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const data = await getSalas();
        setSalas(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalas();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4">
        <View className="bg-blue-700 rounded-xl p-6 mb-4 mt-4">
          <Text className="text-3xl font-bold text-white text-center">
            Salas Disponíveis
          </Text>
          <Text className="text-lg text-green-100 text-center mt-2">
            Veja informações de cada sala
          </Text>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="text-gray-600 mt-4">Carregando salas...</Text>
          </View>
        ) : (
          <ScrollView className="flex-1 mb-6">
            {salas.map((sala) => (
              <View key={sala.id} className="bg-gray-100 rounded-lg p-4 mb-4">
                <Text className="text-xl font-semibold text-gray-900">
                  {sala.nome_numero}
                </Text>
                <Text className="text-base text-gray-700 mt-1">
                  Capacidade: {sala.capacidade} pessoas
                </Text>
                <Text className="text-sm text-gray-600 mt-1">{sala.descricao}</Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Localização: {sala.localizacao}
                </Text>
                <Text className="text-xs text-gray-500">
                  Status limpeza: {sala.status_limpeza}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}

        <View className="w-full max-w-xs self-center mb-6">
          
          <TouchableOpacity
            className="bg-blue-900 rounded-lg p-4"
            onPress={() => navigation.navigate("Settings")}
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

export default RoomsScreen;
