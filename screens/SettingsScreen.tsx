import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, TextInput, Modal, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../services/authContext";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { tabRoutes } from "../navigation/tabRoutes";
import { getCurrentUser, changePassword, listUsers, createUser, User, ChangePasswordData, CreateUserData, setProfile } from "../services/accounts/userProfile";
import { Ionicons } from "@expo/vector-icons";
import ProfileImagePicker from "../components/ProfileImagePicker";

type SettingsScreenNavigationProp = BottomTabNavigationProp<
  Record<typeof tabRoutes[number]["name"], undefined>,
  "Settings"
>;

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { logout, user, refreshUser, updateProfile } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  const [IsUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const handleImageSelected = async (imageUri: string) => {
    setIsUpdatingProfile(true);
    try {
      const result = await updateProfile(imageUri); // 'result' agora é um objeto
      if (result.success) {
        Alert.alert('Sucesso', 'Foto de perfil atualizada com sucesso!');
      } else {
        Alert.alert('Erro', result.error || 'Erro ao atualizar foto de perfil');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar foto de perfil');
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  
  const handleImageRemoved = async () => {
    setIsUpdatingProfile(true);
    try {
      const result = await updateProfile(null); // 'result' agora é um objeto
      if (result.success) {
        Alert.alert('Sucesso', 'Foto de perfil removida com sucesso!');
      } else {
        Alert.alert('Erro', result.error || 'Erro ao remover foto de perfil');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao remover foto de perfil');
    } finally {
      setIsUpdatingProfile(false);
    }
  };


  const [userData, setUserData] = useState<CreateUserData>({
    username: "",
    password: "",
    confirm_password: "",
    email: "",
    is_staff: false,
    is_superuser: false,
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);

  const handleImageLoadSuccess = () => {
    const Perfil = "SUCESSO: Imagem de perfil foi puxada e carregada corretamente da API.";
    console.log(Perfil);
    setImageError(false);
  };

  const handleImageLoadError = () => {
    const Perfil = "ERRO: A URL da imagem foi puxada da API, mas falhou ao carregar. Usando fallback.";
    console.log(Perfil);
    setImageError(true);
  };

  const handleChangePassword = async () => {
    if (!passwordData.old_password || !passwordData.new_password || !passwordData.confirm_new_password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_new_password) {
      Alert.alert("Erro", "As novas senhas não coincidem");
      return;
    }

    try {
      setChangingPassword(true);
      await changePassword(passwordData);
      Alert.alert("Sucesso", "Senha alterada com sucesso!");
      setShowChangePassword(false);
      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_new_password: "",
      });
      await refreshUser();
    } catch (error: any) {
      console.error("Erro ao alterar senha:", error);
      let errorMessage = "Erro ao alterar senha";

      if (error.response?.data?.old_password) {
        errorMessage = "Senha atual incorreta";
      } else if (error.response?.data?.new_password) {
        errorMessage = "As novas senhas não coincidem";
      }

      Alert.alert("Erro", errorMessage);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleListUsers = async () => {
    try {
      setLoadingUsers(true);
      const usersList = await listUsers();
      setUsers(usersList);
      setShowUserList(true);
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível carregar a lista de usuários");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleCreateUser = async () => {
    if (!userData.username || !userData.password || !userData.confirm_password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (userData.password !== userData.confirm_password) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    try {
      setCreatingUser(true);
      await createUser(userData);
      Alert.alert("Sucesso", "Usuário criado com sucesso!");
      setShowCreateUser(false);
      setUserData({
        username: "",
        password: "",
        confirm_password: "",
        email: "",
        is_staff: false,
        is_superuser: false,
      });
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível criar o usuário");
    } finally {
      setCreatingUser(false);
    }
  };

  const isLarge = Dimensions.get("screen").width >= 768;


  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className={`flex-1 px-4 ${isLarge ? 'mx-8' : 'mx-0'}`}>
        <View className="bg-azul_senac rounded-xl p-6 mb-6 mt-4">
          <Text className="text-3xl font-bold text-white text-center">
            Perfil do Usuário
          </Text>
          <Text className="text-lg text-green-100 text-center mt-2">
            Gerencie suas informações e configurações
          </Text>
        </View>

        {!user ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="text-gray-600 mt-4">Carregando perfil...</Text>
          </View>
        ) : (
          <ScrollView className="flex-1 mb-6">
            {user && (
              <View className="bg-gray-100 rounded-lg p-4 mb-4">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="information-circle" size={24} color="#111827" />
                  <Text className="text-xl font-semibold text-gray-900 ml-2">
                    Informações Pessoais
                  </Text>
                </View>

                <View className="items-center mb-4">
                   {/* {user.profile?.profile_picture ?  (  */}
                    <ProfileImagePicker
                      currentImageUri={user.profile?.profile_picture}
                      onImageRemoved={handleImageRemoved}
                      onImageSelected={handleImageSelected}
                      />
                   {/* ) : (
                    <View className="w-24 h-24 rounded-full bg-azul_senac justify-center items-center">
                      <Ionicons name="person" size={50} color="#ffffff" />
                    </View>
                  )}  */}
                  <Text className="text-lg font-semibold text-gray-900 text-center mt-3">
                    {user.username}
                  </Text>
                  <Text className="text-sm text-gray-600 text-center">
                    {user.is_superuser ? "Super Administrador" :
                      user.is_staff ? "Administrador" : "Usuário Comum"}
                  </Text>
                </View>

                <View className="mb-2">
                  <Text className="text-sm font-medium text-gray-700">Nome de usuário:</Text>
                  <Text className="text-base text-gray-900">{user.username}</Text>
                </View>

                <View className="mb-2">
                  <Text className="text-sm font-medium text-gray-700">E-mail:</Text>
                  <Text className="text-base text-gray-900">{user.email || "Não informado"}</Text>
                </View>

                <View className="mb-2">
                  <Text className="text-sm font-medium text-gray-700">ID do usuário:</Text>
                  <Text className="text-base text-gray-900">{user.id}</Text>
                </View>

                {(user.is_staff || user.is_superuser) && (
                  <View className="bg-blue-50 rounded-lg p-3 mt-2">
                    <View className="flex-row items-center">
                      <Ionicons name="checkmark-circle" size={16} color="#004A8D" />
                      <Text className="text-sm text-azul_senac ml-2">
                        Você possui privilégios administrativos
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}

            {user?.is_superuser && (
              <View className="bg-gray-100 rounded-lg p-4 mb-4">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="people" size={24} color="#111827" />
                  <Text className="text-xl font-semibold text-gray-900 ml-2">
                    Gerenciamento de Usuários
                  </Text>
                </View>

                <TouchableOpacity
                  className="bg-azul_senac rounded-lg p-3 mb-2"
                  onPress={handleListUsers}
                  disabled={loadingUsers}
                >
                  <View className="flex-row items-center justify-center">
                    {loadingUsers ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Ionicons name="list" size={20} color="#ffffff" />
                    )}
                    <Text className="text-white text-center font-semibold text-base ml-2">
                      Listar Usuários
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-laranja_senac rounded-lg p-3"
                  onPress={() => setShowCreateUser(true)}
                >
                  <View className="flex-row items-center justify-center">
                    <Ionicons name="person-add-outline" size={20} color="#ffffff" />
                    <Text className="text-white text-center font-semibold text-base ml-2">
                      Criar Novo Usuário
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            <View className="bg-gray-100 rounded-lg p-4 mb-4">
              <View className="flex-row items-center mb-3">
                <Ionicons name="shield-checkmark" size={24} color="#111827" />
                <Text className="text-xl font-semibold text-gray-900 ml-2">
                  Segurança
                </Text>
              </View>
              <TouchableOpacity
                className="bg-red-700 rounded-lg p-3 mb-2"
                onPress={() => setShowChangePassword(true)}
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="key" size={20} color="#ffffff" />
                  <Text className="text-white text-center font-semibold text-base ml-2">
                    Alterar Senha
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View className="w-full max-w-xs self-center mb-6">
              <TouchableOpacity
                className="bg-red-700 rounded-lg p-4"
                onPress={logout}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  Sair
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        <Modal
          visible={showUserList}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowUserList(false)}
        >
        </Modal>

        <Modal
          visible={showCreateUser}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCreateUser(false)}
        >
        </Modal>

        <Modal
          visible={showChangePassword}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowChangePassword(false)}
        >
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;