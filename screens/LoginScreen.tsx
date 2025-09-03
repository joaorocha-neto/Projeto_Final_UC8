import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from "../services/authContext";
import { login as loginAPI } from "../services/accounts/login";

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    if (!username || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      const data = await loginAPI(username, password);
      await login(data.token);

      const userName = data.user_data?.username ||
        data.user?.username ||
        data.username ||
        username;

      Alert.alert('Login realizado!', `Bem-vindo, ${userName}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        Alert.alert('Erro', err.message);
      } else {
        Alert.alert('Erro', 'Algo deu errado');
      }
    }
  };

  const isLarge = Dimensions.get("screen").width >= 768;

  return (
    <SafeAreaView className="flex-1 bg-blue-50 justify-center">
      <View className={`bg-white border border-gray-300 rounded-xl py-8 shadow ${isLarge ? 'mx-72' : 'mx-8'}`}>
        <Text className="text-gray-800 font-bold text-2xl text-center mb-8">
          Login
        </Text>

        <View className="px-5">
          <Text className="mt-6 mx-5 text-lg font-bold mb-2 text-gray-800">
            Usuário:
          </Text>
          <TextInput
            className="bg-white px-4 py-3 mx-5 rounded-lg border border-gray-200 text-base"
            placeholder="Digite seu usuário..."
            placeholderTextColor="#888"
            onChangeText={setUsername}
            value={username}
            autoCapitalize="none"
            keyboardType="default"
          />

          <Text className="mt-6 mx-5 text-lg font-bold mb-2 text-gray-800">
            Senha:
          </Text>
          <TextInput
            className="bg-white px-4 py-3 mx-5 rounded-lg border border-gray-200 text-base"
            placeholder="Digite sua senha..."
            placeholderTextColor="#888"
            onChangeText={setPassword}
            value={password}
            secureTextEntry
          />
        </View>


        <TouchableOpacity
          onPress={handleLogin}
          className="bg-blue-500 px-12 py-3 mt-6 self-center rounded-lg"
        >
          <Text className="text-white font-bold text-lg">Enviar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
