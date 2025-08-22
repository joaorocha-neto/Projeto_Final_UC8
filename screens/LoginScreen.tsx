import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from "../services/authContext";

// Mock login function - replace with your actual API call
async function loginRequest(username: string, password: string) {
  if (username && password) {
    return {
      token: 'mock-token-' + Date.now(),
      user_data: { username }
    };
  }
  throw new Error('Usuário ou senha inválidos');
}

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    try {
      const data = await loginRequest(username, password);
      await login(data.token);
      Alert.alert('Login realizado!', `Bem-vindo, ${data.user_data.username}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        Alert.alert('Erro', err.message);
      } else {
        Alert.alert('Erro', 'Algo deu errado');
      }
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-blue-50 justify-center">
      <View className="shadow-xl bg-white border border-gray-300 rounded-xl py-32 m-8">
        <Text className="text-gray-800 font-bold text-4xl text-center mb-10">Login</Text>

        <View>
          <Text className="mx-5 text-lg font-bold mb-2">Usuário:</Text>
          <TextInput
            className="bg-white px-6 mx-5 rounded-xl border border-gray-200 shadow"
            placeholder="Digite seu usuário..."
            placeholderTextColor="#888"
            onChangeText={setUsername}
            value={username}
            autoCapitalize="none"
            keyboardType="default"
          />

          <Text className="mt-7 mx-5 text-lg font-bold mb-2">Senha:</Text>
          <TextInput
            className="bg-white px-6 mx-5 rounded-xl border border-gray-200 shadow"
            placeholder="Digite sua senha..."
            placeholderTextColor="#888"
            onChangeText={setPassword}
            value={password}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          className="bg-blue-700 px-16 py-3 mt-7 self-center items-center rounded-lg"
        >
          <Text className="text-white font-bold text-xl">Enviar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
