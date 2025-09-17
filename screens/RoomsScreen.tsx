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
  RefreshControl,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { tabRoutes } from "../navigation/tabRoutes";
import {
  Sala,
  getSalas,
  marcarComoLimpa,
  createSala,
  updateSala,
  deleteSala,
  CreateSalaData,
  UpdateSalaData,
} from "../services/rooms/salas";
import { useAuth } from "../services/authContext";
import { Ionicons } from "@expo/vector-icons";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";

type RoomsScreenNavigationProp = BottomTabNavigationProp<
  Record<(typeof tabRoutes)[number]["name"], undefined>,
  "Rooms"
>;

interface RoomsScreenProps {
  navigation: RoomsScreenNavigationProp;
}

// Componente principal para a tela de Salas
const RoomsScreen: React.FC<RoomsScreenProps> = ({ navigation }) => {
  // Hook de autenticação para obter informações do usuário logado
  const { user } = useAuth();
  // Estados para gerenciar a lista de salas e o estado de carregamento
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // Estados para controlar a visibilidade dos modais
  const [showObservacoesModal, setShowObservacoesModal] = useState(false);
  const [selectedSala, setSelectedSala] = useState<Sala | null>(null);
  const [observacoes, setObservacoes] = useState("");
  const [marcandoLimpa, setMarcandoLimpa] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // Estado para a sala que está sendo editada ou excluída
  const [editingSala, setEditingSala] = useState<Sala | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  // Estado para os dados do formulário de criação/edição
  const [formData, setFormData] = useState<CreateSalaData>({
    nome_numero: "",
    capacidade: 0,
    descricao: "",
    localizacao: "",
    ativa: true,
  });

  // Efeito para buscar as salas na montagem do componente
  useEffect(() => {
    fetchSalas();
  }, []);

  // Função para buscar a lista de salas da API
  const fetchSalas = async () => {
    try {
      setLoading(true);
      const data = await getSalas();
      setSalas(data);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível carregar as salas");
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar a lista de salas com o gesto de "puxar para baixo"
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getSalas();
      setSalas(data);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível atualizar as salas");
    } finally {
      setRefreshing(false);
    }
  };

  // Lida com o clique no botão "Marcar como Limpa"
  const handleMarcarComoLimpa = (sala: Sala) => {
    setSelectedSala(sala);
    setObservacoes("");
    setShowObservacoesModal(true);
  };

  // Confirma a ação de marcar uma sala como limpa
  const confirmarMarcarComoLimpa = async () => {
    if (!selectedSala) return;

    try {
      setMarcandoLimpa(true);
      await marcarComoLimpa(selectedSala.id, observacoes || undefined);

      Alert.alert("Sucesso", "Sala marcada como limpa!");
      setShowObservacoesModal(false);
      setSelectedSala(null);
      setObservacoes("");

      await fetchSalas();
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível marcar a sala como limpa");
    } finally {
      setMarcandoLimpa(false);
    }
  };

  // Retorna a cor do texto com base no status de limpeza
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Limpa":
        return "text-green-600";
      case "Limpeza Pendente":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // Lida com o clique no botão de edição de sala
  const handleEditSala = (sala: Sala) => {
    setEditingSala(sala);
    setFormData({
      nome_numero: sala.nome_numero,
      capacidade: sala.capacidade,
      descricao: sala.descricao,
      localizacao: sala.localizacao,
      ativa: sala.ativa,
    });
    setShowEditModal(true);
  };

  // Lida com o clique no botão de criação de sala
  const handleCreateSala = () => {
    setEditingSala(null);
    setFormData({
      nome_numero: "",
      capacidade: 0,
      descricao: "",
      localizacao: "",
      ativa: true,
    });
    setShowCreateModal(true);
  };

  // Lida com o clique no botão de exclusão de sala
  const handleDeleteSala = (sala: Sala) => {
    setEditingSala(sala);
    setShowDeleteConfirm(true);
  };

  // Salva a sala (criação ou edição) na API
  const saveSala = async () => {
    if (
      !formData.nome_numero ||
      !formData.descricao ||
      !formData.localizacao ||
      formData.capacidade <= 0
    ) {
      Alert.alert("Erro", "Por favor, preencha todos os campos corretamente");
      return;
    }

    try {
      setSaving(true);

      if (editingSala) {
        await updateSala(editingSala.id, formData);
        Alert.alert("Sucesso", "Sala atualizada com sucesso!");
      } else {
        await createSala(formData);
        Alert.alert("Sucesso", "Sala criada com sucesso!");
      }

      setShowEditModal(false);
      setShowCreateModal(false);
      setEditingSala(null);
      setFormData({
        nome_numero: "",
        capacidade: 0,
        descricao: "",
        localizacao: "",
        ativa: true,
      });

      await fetchSalas();
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível salvar a sala");
    } finally {
      setSaving(false);
    }
  };

  // Confirma a exclusão de uma sala
  const confirmDeleteSala = async () => {
    if (!editingSala) return;

    try {
      setDeleting(true);
      await deleteSala(editingSala.qr_code_id);
      Alert.alert("Sucesso", "Sala excluída com sucesso!");
      setShowDeleteConfirm(false);
      setEditingSala(null);

      await fetchSalas();
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível excluir a sala");
    } finally {
      setDeleting(false);
    }
  };

  // Formata a data e hora da última limpeza
  const displayLastCleanedTime = (utcDateTimeString: string | null): string => {
    if (!utcDateTimeString) {
      return "Nunca foi limpa";
    }

    try {
      const dateObjectUTC = parseISO(utcDateTimeString);
      return format(dateObjectUTC, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      console.error("Erro ao processar data/hora:", error);
      return "Data Inválida";
    }
  };

  // Verifica se a tela é grande (para layout adaptável)
  const isLarge = Dimensions.get("screen").width >= 768;

  return (
    // Contêiner principal da tela
    <SafeAreaView className="flex-1 bg-white">
      <View className={`flex-1 px-4 ${isLarge ? "mx-8" : "mx-0"}`}>
        {/* Cabeçalho da tela */}
        <View className="bg-azul_senac rounded-xl p-6 mb-4 mt-4">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-3xl font-bold text-white text-center">
                Salas Disponíveis
              </Text>
              <Text className="text-lg text-green-100 text-center mt-2">
                Veja informações de cada sala
              </Text>
            </View>
            <View className="flex-row items-center justify-end">
              {/* Botão para criar nova sala (visível apenas para superusuários) */}
              {user?.is_superuser && (
                <TouchableOpacity
                  className="bg-white rounded-full"
                  onPress={() => setShowCreateModal(true)}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={30}
                    color="#F7941D"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Exibe o indicador de carregamento ou a lista de salas */}
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="text-gray-600 mt-4">Carregando salas...</Text>
          </View>
        ) : (
          /* Lista rolável de salas */
          <ScrollView
            className="flex-1 mb-6"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#2563EB"]}
                tintColor="#2563EB"
              />
            }
          >
            {/* Mapeia a lista de salas para exibir cada cartão */}
            {salas.map((sala) => (
              /* Cartão de uma sala individual */
              <View key={sala.id} className="bg-gray-100 rounded-lg p-4 mb-4">
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="text-xl font-semibold text-azul_senac flex-1">
                    {sala.nome_numero}
                  </Text>
                  {/* Etiqueta de status de limpeza (Limpa ou Pendente) */}
                  <View
                    className={`px-2 py-1 rounded-md ${sala.status_limpeza === "Limpa" ? "bg-green-100" : "bg-red-100"}`}
                  >
                    <Text
                      className={`text-xs font-medium ${getStatusColor(sala.status_limpeza)}`}
                    >
                      {sala.status_limpeza}
                    </Text>
                  </View>
                </View>

                {/* Detalhes da sala */}
                <Text className="text-base text-gray-700 mb-1">
                  Capacidade: {sala.capacidade} pessoas
                </Text>

                <View className="flex-row items-center mb-1">
                  {sala.descricao ? (
                    <>
                      <Ionicons name="help-outline" size={12} color="#6b7280" />
                      <Text className="text-xs text-gray-500 ml-1">
                        {sala.descricao}
                      </Text>
                    </>
                  ) : null}
                </View>

                <View className="flex-row items-center mb-1">
                  <Ionicons name="time" size={12} color="#004A8D" />
                  <Text className="text-xs text-gray-500 ml-1">
                    Ultima limpeza:{" "}
                    {displayLastCleanedTime(sala.ultima_limpeza_data_hora)}{" "}
                    {sala.ultima_limpeza_funcionario ? (
                      <Text>por {sala.ultima_limpeza_funcionario}</Text>
                    ) : null}
                  </Text>
                </View>

                <View className="flex-row items-center mb-1">
                  <Ionicons name="location" size={12} color="#F7941D" />
                  <Text className="text-xs text-gray-500 ml-1">
                    Localização: {sala.localizacao}
                  </Text>
                </View>

                {/* Seção de botões de ação */}
                <View className="border-t border-gray-200 pt-2 mt-2">
                  {/* Botão para marcar a sala como limpa */}
                  <TouchableOpacity
                    className={`rounded-lg p-2 mt-2 ${sala.status_limpeza === "Limpa" ? "bg-azul_claro_senac" : "bg-azul_senac"}`}
                    onPress={() => handleMarcarComoLimpa(sala)}
                    disabled={sala.status_limpeza === "Limpa"}
                  >
                    <View className="flex-row items-center justify-center">
                      {sala.status_limpeza === "Limpa" && (
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color="#d1d5db"
                        />
                      )}
                      <Text
                        className={`text-center font-semibold text-sm ${sala.status_limpeza === "Limpa" ? "text-gray-300" : "text-white"} ${sala.status_limpeza === "Limpa" ? "ml-1" : ""}`}
                      >
                        {sala.status_limpeza === "Limpa"
                          ? "Limpa"
                          : "Marcar como Limpa"}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Botões de administrador (visíveis apenas para superusuários) */}
                  {user?.is_superuser && (
                    <View className="flex-row mt-2 space-x-2 gap-2">
                      {/* Botão de edição */}
                      <TouchableOpacity
                        className="bg-laranja_senac rounded-lg p-2 flex-1"
                        onPress={() => handleEditSala(sala)}
                      >
                        <Text className="text-white text-center font-semibold text-xs">
                          Editar
                        </Text>
                      </TouchableOpacity>

                      {/* Botão de exclusão */}
                      <TouchableOpacity
                        className="bg-red-700 rounded-lg p-2 flex-1"
                        onPress={() => handleDeleteSala(sala)}
                      >
                        <Text className="text-white text-center font-semibold text-xs">
                          Excluir
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Modal: Marcar como Limpa */}
        <Modal
          visible={showObservacoesModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowObservacoesModal(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View
              className={`bg-gray-100 rounded-xl w-full p-6 ${isLarge ? "max-w-xl" : "max-w-sm"}`}
            >
              <Text className="text-xl font-bold text-gray-900 mb-4 text-center">
                Marcar como Limpa
              </Text>

              {selectedSala && (
                <Text className="text-sm text-gray-600 mb-4 text-center">
                  Sala: {selectedSala.nome_numero}
                </Text>
              )}

              {/* Campo para Observações */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Observações (opcional):
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 text-base"
                  placeholder="Digite observações sobre a limpeza..."
                  value={observacoes}
                  onChangeText={setObservacoes}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Botões do modal de observações */}
              <View className="flex-row justify-between">
                <TouchableOpacity
                  className="bg-gray-500 rounded-lg p-3 flex-1 mr-2"
                  onPress={() => {
                    setShowObservacoesModal(false);
                    setSelectedSala(null);
                    setObservacoes("");
                  }}
                  disabled={marcandoLimpa}
                >
                  <Text className="text-white text-center font-semibold">
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-azul_senac rounded-lg p-3 flex-1 ml-2"
                  onPress={confirmarMarcarComoLimpa}
                  disabled={marcandoLimpa}
                >
                  {marcandoLimpa ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text className="text-white text-center font-semibold">
                      Confirmar
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal: Criar ou Editar Sala */}
        <Modal
          visible={showCreateModal || showEditModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
          }}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View
              className={`bg-gray-200 rounded-xl w-full p-6 ${isLarge ? "max-w-xl" : "max-w-sm"}`}
            >
              <Text className="text-xl font-bold text-gray-900 mb-4 text-center">
                {editingSala ? "Editar Sala" : "Criar Nova Sala"}
              </Text>

              {/* Formulário de criação/edição */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Nome/Número da Sala:
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 text-base"
                  placeholder="Ex: Sala 101"
                  value={formData.nome_numero}
                  onChangeText={(text) =>
                    setFormData({ ...formData, nome_numero: text })
                  }
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Capacidade:
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 text-base"
                  placeholder="Ex: 30"
                  value={formData.capacidade.toString()}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      capacidade: parseInt(text) || 0,
                    })
                  }
                  keyboardType="numeric"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Descrição:
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 text-base"
                  placeholder="Descrição da sala..."
                  value={formData.descricao}
                  onChangeText={(text) =>
                    setFormData({ ...formData, descricao: text })
                  }
                  multiline
                  numberOfLines={2}
                />
              </View>

              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Localização:
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 text-base"
                  placeholder="Ex: Bloco 1"
                  value={formData.localizacao}
                  onChangeText={(text) =>
                    setFormData({ ...formData, localizacao: text })
                  }
                />
              </View>

              {/* Botões do modal de criação/edição */}
              <View className="flex-row justify-between">
                <TouchableOpacity
                  className="bg-gray-500 rounded-lg p-3 flex-1 mr-2"
                  onPress={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setEditingSala(null);
                    setFormData({
                      nome_numero: "",
                      capacidade: 0,
                      descricao: "",
                      localizacao: "",
                      ativa: true,
                    });
                  }}
                  disabled={saving}
                >
                  <Text className="text-white text-center font-semibold">
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-azul_senac rounded-lg p-3 flex-1 ml-2"
                  onPress={saveSala}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text className="text-white text-center font-semibold">
                      {editingSala ? "Atualizar" : "Criar"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal: Confirmação de Exclusão */}
        <Modal
          visible={showDeleteConfirm}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDeleteConfirm(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View
              className={`bg-gray-200 rounded-lg w-full p-6 ${isLarge ? "max-w-xl" : "max-w-sm"}`}
            >
              <Text className="text-xl font-bold text-red-700 mb-4 text-center">
                Confirmar Exclusão
              </Text>

              {editingSala && (
                <Text className="text-sm text-gray-600 mb-4 text-center">
                  Tem certeza que deseja excluir a sala "
                  {editingSala.nome_numero}"?
                </Text>
              )}

              <Text className="text-xs text-gray-500 mb-6 text-center">
                Esta ação não pode ser desfeita.
              </Text>

              {/* Botões do modal de exclusão */}
              <View className="flex-row justify-between">
                <TouchableOpacity
                  className="bg-gray-500 rounded-lg p-3 flex-1 mr-2"
                  onPress={() => {
                    setShowDeleteConfirm(false);
                    setEditingSala(null);
                  }}
                  disabled={deleting}
                >
                  <Text className="text-white text-center font-semibold">
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-red-700 rounded-lg p-3 flex-1 ml-2"
                  onPress={confirmDeleteSala}
                  disabled={deleting}
                >
                  {deleting ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text className="text-white text-center font-semibold">
                      Excluir
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default RoomsScreen;