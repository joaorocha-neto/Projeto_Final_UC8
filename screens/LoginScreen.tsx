import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../services/authContext";
import { login as loginAPI } from "../services/accounts/login";

import FloatingLabelInput from "../components/FloatingLabelInput";

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [hasUsernameBeenTouched, setHasUsernameBeenTouched] = useState(false);
  const [hasPasswordBeenTouched, setHasPasswordBeenTouched] = useState(false);

  const getBorderColor = (hasBeenTouched: boolean, value: string) => {
    if (hasBeenTouched && !value) {
      return "border-red-500";
    }
    return "border-gray-300";
  };

  async function handleLogin() {
    setHasUsernameBeenTouched(true);
    setHasPasswordBeenTouched(true);

    if (!username || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    try {
      const data = await loginAPI(username, password);
      await login(data.token);
      const userName =
        data.user_data?.username ||
        data.user?.username ||
        data.username ||
        username;
      Alert.alert("Login realizado!", `Bem-vindo, ${userName}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        Alert.alert("Erro", err.message);
      } else {
        Alert.alert("Erro", "Algo deu errado");
      }
    }
  }

  const isLarge = Dimensions.get("screen").width >= 768;

  const usernameBorderColor = getBorderColor(hasUsernameBeenTouched, username);
  const passwordBorderColor = getBorderColor(hasPasswordBeenTouched, password);

  return (
    <SafeAreaView className="flex-1 bg-blue-50 justify-center">
      <KeyboardAvoidingView
        behavior="padding"
        className={`bg-white border border-gray-300 rounded-xl py-8 shadow ${isLarge ? "mx-72" : "mx-8"}`}
      >
        <Image
          source={require("../IMG/SenacLogo.png")}
          className="h-20 w-28 mx-auto"
        />

        <Text className="text-azul_senac font-extrabold text-4xl text-center mb-8">
          Login
        </Text>

        <View className="px-5 gap-6">
          <View>
            <FloatingLabelInput
              label="Digite seu Usuário"
              value={username}
              onChangeText={setUsername}
              borderColor={usernameBorderColor}
              onBlur={() => setHasUsernameBeenTouched(true)}
              nameIcon="person"
            />
            {hasUsernameBeenTouched && !username && (
              <Text className="text-red-500 text-sm mt-1 mx-1">
                O campo usuário é obrigatório.
              </Text>
            )}
          </View>

          <View>
            <FloatingLabelInput
              label="Digite sua Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              borderColor={passwordBorderColor}
              onBlur={() => setHasPasswordBeenTouched(true)}
              nameIcon="lock-closed"
            />
            {hasPasswordBeenTouched && !password && (
              <Text className="text-red-500 text-sm mt-1 mx-1">
                O campo senha é obrigatório.
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          className="bg-azul_senac px-12 py-3 mt-8 self-center rounded-lg mb-8"
        >
          <Text className="text-white font-bold text-lg">Entrar</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
