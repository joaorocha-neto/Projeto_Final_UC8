import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../services/authContext";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { tabRoutes } from "../navigation/tabRoutes";
import {
  getCurrentUser,
  changePassword,
  listUsers,
  createUser,
  User,
  ChangePasswordData,
  CreateUserData,
  setProfile,
} from "../services/accounts/userProfile";
import { Ionicons } from "@expo/vector-icons";
import ProfileImagePicker from "../components/ProfileImagePicker";

type SettingsScreenNavigationProp = BottomTabNavigationProp<
  Record<(typeof tabRoutes)[number]["name"], undefined>,
  "Settings"
>;

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  {/* Definição do Componente e Hooks de Estado */}
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

  {/* Função para lidar com a seleção de nova imagem de perfil */}
  const handleImageSelected = async (imageUri: string) => {
    setIsUpdatingProfile(true);
    try {
      const result = await updateProfile(imageUri);
      if (result.success) {
        Alert.alert("Sucesso", "Foto de perfil atualizada com sucesso!");
      } else {
        Alert.alert("Erro", result.error || "Erro ao atualizar foto de perfil");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao atualizar foto de perfil");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  {/* Função para lidar com a remoção da imagem de perfil */}
  const handleImageRemoved = async () => {
    setIsUpdatingProfile(true);
    try {
      const result = await updateProfile(null);
      if (result.success) {
        Alert.alert("Sucesso", "Foto de perfil removida com sucesso!");
      } else {
        Alert.alert("Erro", result.error || "Erro ao remover foto de perfil");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao remover foto de perfil");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const [userData, setUserData] = useState<CreateUserData>({
    username: "",
    nome: "",
    password: "",
    confirm_password: "",
    email: "",
    groups: [],
    is_superuser: false,
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);

  {/* Funções para logs de sucesso e erro no carregamento da imagem */}
  const handleImageLoadSuccess = () => {
    const Perfil =
      "SUCESSO: Imagem de perfil foi puxada e carregada corretamente da API.";
    console.log(Perfil);
    setImageError(false);
  };

  const handleImageLoadError = () => {
    const Perfil =
      "ERRO: A URL da imagem foi puxada da API, mas falhou ao carregar. Usando fallback.";
    console.log(Perfil);
    setImageError(true);
  };

  {/* Funções para fechar os modais e resetar os estados */}
  const closeChangePasswordModal = () => {
    setShowChangePassword(false);
    setPasswordData({
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    });
  };

  const closeCreateUserModal = () => {
    setShowCreateUser(false);
    setUserData({
      username: "",
      nome: "",
      password: "",
      confirm_password: "",
      email: "",
      groups: [],
      is_superuser: false,
    });
  };

  {/* Função para alterar a senha do usuário */}
  const handleChangePassword = async () => {
    if (
      !passwordData.old_password ||
      !passwordData.new_password ||
      !passwordData.confirm_new_password
    ) {
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
      closeChangePasswordModal();
      console.log("Sucesso sla")
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

  {/* Função para buscar e exibir a lista de usuários */}
  const handleListUsers = async () => {
  try {
    setLoadingUsers(true);
    const usersList = await listUsers();

    // ADICIONE ESTA LINHA PARA VER OS DADOS
    console.log("Dados recebidos da API de lista:", JSON.stringify(usersList, null, 2));

    setUsers(usersList);
    setShowUserList(true);
  } catch (error: any) {
    Alert.alert("Erro", "Não foi possível carregar a lista de usuários");
  } finally {
    setLoadingUsers(false);
  }
};

  {/* Função para criar um novo usuário */}
  const handleCreateUser = async () => {
    if (
      !userData.username ||
      !userData.password ||
      !userData.confirm_password
    ) {
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
      closeCreateUserModal();
    } catch (error: any) {
      if (error.response?.status === 400) {

        let mensagemAcumulada: string = "";

        error.response.data.password.forEach((m: string) => {
          console.log(m);
          mensagemAcumulada += "-  " + m + "\n\n";
        })

        console.log(mensagemAcumulada);


        Alert.alert("Erro", mensagemAcumulada);
      }
      else {
        Alert.alert("Erro", "Não foi possível criar o usuário");
      }

    } finally {
      setCreatingUser(false);
    }
  };

  const isLarge = Dimensions.get("screen").width >= 768;
  
  {/* Início da Renderização do Componente Visual (JSX) */}
  return (
    <SafeAreaView edges={["left", "right", "top"]} className="flex-1 bg-white">
      <View className={`flex-1 px-4 ${isLarge ? "mx-8" : "mx-0"}`}>
        {/* Cabeçalho da Página de Perfil */}
        <View className="bg-azul_senac rounded-xl p-6 mb-6 mt-4">
          <Text className="text-3xl font-bold text-white text-center">
            Perfil do Usuário
          </Text>
          <Text className="text-lg text-green-100 text-center mt-2">
            Gerencie suas informações e configurações
          </Text>
        </View>

        {/* Exibição de Carregamento enquanto os dados do usuário não chegam */}
        {!user ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="text-gray-600 mt-4">Carregando perfil...</Text>
          </View>
        ) : (
          <ScrollView className="flex-1">
            {user && (
              /* Card de Informações Pessoais do Usuário */
              <View className="bg-gray-100 rounded-lg p-4 mb-4">
                {/* Título do Card de Informações */}
                <View className="flex-row items-center mb-3">
                  <Ionicons
                    name="information-circle"
                    size={24}
                    color="#111827"
                  />
                  <Text className="text-xl font-semibold text-gray-900 ml-2">
                    Informações Pessoais
                  </Text>
                </View>

                {/* Componente para Seleção e Exibição da Foto de Perfil */}
                <View className="items-center mb-4">
                  <ProfileImagePicker
                    currentImageUri={user.profile?.profile_picture}
                    onImageRemoved={handleImageRemoved}
                    onImageSelected={handleImageSelected}
                  />
                  <Text className="text-lg font-semibold text-gray-900 text-center mt-3">
                    {user.username}
                  </Text>
                  <Text className="text-sm text-gray-600 text-center">
                    {user.is_superuser
                      ? "Administrador"
                      : "Usuário Comum"}
                  </Text>
                </View>

                {/* Campo de Nome do Usuário */}
                <View className="mb-2">
                  <Text className="text-sm font-medium text-gray-700">
                    Nome:
                  </Text>
                  <Text className="text-base text-gray-900">
                    {user.nome}
                  </Text>
                </View>

                {/* Campo de E-mail do Usuário */}
                <View className="mb-2">
                  <Text className="text-sm font-medium text-gray-700">
                    E-mail:
                  </Text>
                  <Text className="text-base text-gray-900">
                    {user.email || "Não informado"}
                  </Text>
                </View>

                {/* Campo de Equipe/Grupo do Usuário */}
                <View className="mb-2">
                  <Text className="text-sm font-medium text-gray-700">
                    Equipe:
                  </Text>

                  {Array.isArray(user.groups) && user.groups.length > 0 ? (
                    user.groups.includes(1) && user.groups.includes(2) ? (
                      <Text className="text-base text-gray-900">Administrador Pleno</Text>
                    ) : (
                      user.groups.map((group, index) => (
                        <Text key={index} className="text-base text-gray-900">
                          {group === 1
                            ? "Zelador"
                            : group === 2
                              ? "Solicitante de Serviços"
                              : "Equipe desconhecida"}
                        </Text>
                      ))
                    )
                  ) : (
                    <Text className="text-base text-gray-900">Administrador</Text>
                  )}
                </View>

                {/* Selo de Administrador (visível apenas para superusuários) */}
                {(user.is_superuser) && (
                  <View className="bg-blue-50 rounded-lg p-3 mt-2">
                    <View className="flex-row items-center">
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#004A8D"
                      />
                      <Text className="text-sm text-azul_senac ml-2">
                        Você possui privilégios administrativos
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Card de Gerenciamento de Usuários (Apenas Admins) */}
            {user?.is_superuser && (
              <View className="bg-gray-100 rounded-lg p-4 mb-4">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="people" size={24} color="#111827" />
                  <Text className="text-xl font-semibold text-gray-900 ml-2">
                    Gerenciamento de Usuários
                  </Text>
                </View>

                {/* Botão para Listar Usuários */}
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

                {/* Botão para Abrir Modal de Criação de Usuário */}
                <TouchableOpacity
                  className="bg-laranja_senac rounded-lg p-3"
                  onPress={() => setShowCreateUser(true)}
                >
                  <View className="flex-row items-center justify-center">
                    <Ionicons
                      name="person-add-outline"
                      size={20}
                      color="#ffffff"
                    />
                    <Text className="text-white text-center font-semibold text-base ml-2">
                      Criar Novo Usuário
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Card de Opções de Segurança */}
            <View className="bg-gray-100 rounded-lg p-4 mb-4">
              <View className="flex-row items-center mb-3">
                <Ionicons name="shield-checkmark" size={24} color="#111827" />
                <Text className="text-xl font-semibold text-gray-900 ml-2">
                  Segurança
                </Text>
              </View>
              {/* Botão para Alterar Senha */}
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

            {/* Botão de Logout/Sair da Conta */}
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

        {/* Modal para Exibir a Lista de Usuários */}
        <Modal
          visible={showUserList}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowUserList(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50 p-4">
            <View
              className={`bg-white rounded-lg w-full p-6 max-h-[80%] ${isLarge ? "max-w-xl" : "max-w-sm"
                }`}
            >
              {/* Cabeçalho do Modal de Lista de Usuários */}
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-gray-900">
                  Lista de Usuários
                </Text>
                <TouchableOpacity onPress={() => setShowUserList(false)}>
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {/* Lista Rolável de Usuários */}
              <ScrollView>
                {users.map((userItem) => (
                  /* Item Individual da Lista de Usuários */
                  <View
                    key={userItem.id}
                    className="flex-row items-center bg-gray-50 rounded-lg p-3 mb-2"
                  >
                    {userItem.profile?.profile_picture ? (
                      <Image
                        source={{ uri: userItem.profile.profile_picture }}
                        className="w-12 h-12 rounded-full mr-4"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-12 h-12 rounded-full mr-4 bg-gray-200 flex items-center justify-center">
                        <Ionicons name="person" size={24} color="#6b7280" />
                      </View>
                    )}

                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-900">
                        {userItem.username}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {userItem.email || "Sem e-mail"}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-1">
                        {userItem.is_superuser
                          ? "Administrador"
                          : "Usuário Comum"}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Modal para o Formulário de Criação de Novo Usuário */}
        <Modal
          visible={showCreateUser}
          transparent={true}
          animationType="slide"
          onRequestClose={closeCreateUserModal}
        >
          <View className="flex-1 justify-center items-center bg-black/50 p-4">
            <ScrollView
              className="w-full"
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                className={`bg-white rounded-lg w-full p-6 ${isLarge ? "max-w-xl" : "max-w-sm"
                  }`}
              >
                {/* Cabeçalho do Modal de Criação */}
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-xl font-bold text-gray-900">
                    Criar Novo Usuário
                  </Text>
                  <TouchableOpacity onPress={closeCreateUserModal}>
                    <Ionicons name="close" size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>

                {/* Campo de Nome Completo */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Nome completo (opcional):
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 text-base"
                    placeholder="Digite o nome completo"
                    value={userData.nome}
                    onChangeText={(text) =>
                      setUserData({ ...userData, nome: text })
                    }
                  />
                </View>

                {/* Campo de Nome de Usuário */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Nome de usuário:
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 text-base"
                    placeholder="Digite o nome de usuário"
                    value={userData.username}
                    onChangeText={(text) =>
                      setUserData({ ...userData, username: text })
                    }
                  />
                </View>

                {/* Campo de E-mail */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    E-mail (opcional):
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 text-base"
                    placeholder="Digite o e-mail"
                    value={userData.email}
                    onChangeText={(text) =>
                      setUserData({ ...userData, email: text })
                    }
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                {/* Campo de Senha */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Senha:
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 text-base"
                    placeholder="Digite a senha"
                    secureTextEntry
                    value={userData.password}
                    onChangeText={(text) =>
                      setUserData({ ...userData, password: text })
                    }
                  />
                </View>

                {/* Campo de Confirmação de Senha */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Confirmar senha:
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 text-base"
                    placeholder="Confirme a senha"
                    secureTextEntry
                    value={userData.confirm_password}
                    onChangeText={(text) =>
                      setUserData({ ...userData, confirm_password: text })
                    }
                  />
                </View>

                {/* Seção de Seleção de Tipo/Grupo de Usuário */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Tipo de Usuário:
                  </Text>

                  <TouchableOpacity
                    className="flex-row items-center mb-2"
                    onPress={() =>
                      setUserData({
                        ...userData,
                        is_superuser: !userData.is_superuser,
                      })
                    }
                  >
                    <Ionicons
                      name={
                        userData.is_superuser ? "checkbox" : "square-outline"
                      }
                      size={20}
                      color="#004A8D"
                    />
                    <Text className="text-sm text-gray-700 ml-2">
                      Administrador
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-row items-center mb-2"
                    onPress={() => {
                      const newGroups = [...userData.groups];
                      const index = newGroups.indexOf(1);
                      if (index > -1) {
                        newGroups.splice(index, 1);
                      } else {
                        newGroups.push(1);
                      }
                      setUserData({
                        ...userData,
                        groups: newGroups,
                      });
                    }}
                  >
                    <Ionicons
                      name={
                        userData.groups.includes(1) ? "checkbox" : "square-outline"
                      }
                      size={20}
                      color="#004A8D"
                    />
                    <Text className="text-sm text-gray-700 ml-2">
                      Zelador
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-row items-center"
                    onPress={() => {
                      const newGroups = [...userData.groups];
                      const index = newGroups.indexOf(2);
                      if (index > -1) {
                        newGroups.splice(index, 1);
                      } else {
                        newGroups.push(2);
                      }
                      setUserData({
                        ...userData,
                        groups: newGroups,
                      });
                    }}
                  >
                    <Ionicons
                      name={
                        userData.groups.includes(2) ? "checkbox" : "square-outline"
                      }
                      size={20}
                      color="#004A8D"
                    />
                    <Text className="text-sm text-gray-700 ml-2">
                      Solicitante de Serviços
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {/* Botões de Ação do Modal (Cancelar/Criar) */}
                <View className="flex-row justify-between">
                  <TouchableOpacity
                    className="bg-gray-500 rounded-lg p-3 flex-1 mr-2"
                    onPress={closeCreateUserModal}
                    disabled={creatingUser}
                  >
                    <Text className="text-white text-center font-semibold">
                      Cancelar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="bg-green-600 rounded-lg p-3 flex-1 ml-2"
                    onPress={handleCreateUser}
                    disabled={creatingUser}
                  >
                    {creatingUser ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text className="text-white text-center font-semibold">
                        Criar
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>

        {/* Modal para o Formulário de Alteração de Senha */}
        <Modal
          visible={showChangePassword}
          transparent={true}
          animationType="slide"
          onRequestClose={closeChangePasswordModal}
        >
          <View className="flex-1 justify-center items-center bg-black/50 p-4">
            <ScrollView
              className="w-full"
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                className={`bg-white rounded-lg w-full p-6 ${isLarge ? "max-w-xl" : "max-w-sm"
                  }`}
              >
                {/* Cabeçalho do Modal de Alteração de Senha */}
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-xl font-bold text-gray-900">
                    Alterar Senha
                  </Text>
                  <TouchableOpacity onPress={closeChangePasswordModal}>
                    <Ionicons name="close" size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                
                {/* Campo de Senha Atual */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Senha atual:
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 text-base"
                    placeholder="Digite sua senha atual"
                    secureTextEntry
                    value={passwordData.old_password}
                    onChangeText={(text) =>
                      setPasswordData({ ...passwordData, old_password: text })
                    }
                  />
                </View>
                
                {/* Campo de Nova Senha */}
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Nova senha:
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 text-base"
                    placeholder="Digite a nova senha"
                    secureTextEntry
                    value={passwordData.new_password}
                    onChangeText={(text) =>
                      setPasswordData({ ...passwordData, new_password: text })
                    }
                  />
                </View>

                {/* Campo de Confirmação da Nova Senha */}
                <View className="mb-6">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Confirmar nova senha:
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 text-base"
                    placeholder="Digite novamente a nova senha"
                    secureTextEntry
                    value={passwordData.confirm_new_password}
                    onChangeText={(text) =>
                      setPasswordData({
                        ...passwordData,
                        confirm_new_password: text,
                      })
                    }
                  />
                </View>
                
                {/* Botões de Ação do Modal (Cancelar/Alterar) */}
                <View className="flex-row justify-between">
                  <TouchableOpacity
                    className="bg-gray-500 rounded-lg p-3 flex-1 mr-2"
                    onPress={closeChangePasswordModal}
                    disabled={changingPassword}
                  >
                    <Text className="text-white text-center font-semibold">
                      Cancelar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="bg-blue-700 rounded-lg p-3 flex-1 ml-2"
                    onPress={handleChangePassword}
                    disabled={changingPassword}
                  >
                    {changingPassword ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text className="text-white text-center font-semibold">
                        Alterar
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;