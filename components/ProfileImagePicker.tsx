import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

interface ProfileImagePickerProps {
  currentImageUri?: string | null;
  onImageSelected: (imageUri: string) => any;
  onImageRemoved: () => void;
  size?: number;
}

const ProfileImagePicker: React.FC<ProfileImagePickerProps> = ({
  currentImageUri,
  onImageSelected,
  onImageRemoved,
  size = 120,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);
  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);

  React.useEffect(() => {
    setImageLoadError(false);
  }, [currentImageUri]);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão Necessária",
        "Precisamos de permissão para acessar sua galeria de fotos.",
        [{ text: "OK" }],
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    setIsOptionsModalVisible(false);
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    } finally {
      setIsLoading(false);
    }
  };

  const takePhoto = async () => {
    setIsOptionsModalVisible(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão Necessária",
        "Precisamos de permissão para acessar sua câmera.",
        [{ text: "OK" }],
      );
      return;
    }

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erro ao tirar foto:", error);
      Alert.alert("Erro", "Não foi possível tirar a foto.");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmRemoveImage = () => {
    setIsRemoveModalVisible(false);
    onImageRemoved();
  };

  return (
    <View className="items-center">
      <View className="relative">
        <View
          className="rounded-full border-4 overflow-hidden border-gray-200"
          style={{
            width: size,
            height: size,
          }}
        >
          {currentImageUri && !imageLoadError ? (
            <Image
              className="rounded-full"
              source={{ uri: currentImageUri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
              onError={() => setImageLoadError(true)}
            />
          ) : (
            <View className="flex-1 items-center justify-center bg-gray-200 rounded-full">
              <Ionicons name="person" size={size * 0.5} color="#004A8D" />
            </View>
          )}
        </View>

        {isLoading && (
          <View
            className="absolute inset-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={() => setIsOptionsModalVisible(true)}
        disabled={isLoading}
        className="p-2 px-4 rounded-xl flex-row items-center mt-3 active:bg-blue-100"
        style={{ opacity: isLoading ? 0.6 : 1 }}
      >
        <Text className="font-medium text-azul_senac">
          {imageLoadError
            ? "Tentar Novamente"
            : currentImageUri
              ? "Editar"
              : "Adicionar Foto"}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isOptionsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsOptionsModalVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setIsOptionsModalVisible(false)}
        >
          <View className="flex-1 justify-end bg-black/50">
            <TouchableWithoutFeedback onPress={() => {}}>
              <View className="bg-white p-2 pb-4 "
              style={{
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              }}
              >
                
                <Text className="text-lg font-bold text-center text-gray-800 my-4">
                  Alterar Foto de Perfil
                </Text>

                <TouchableOpacity
                  onPress={pickImage}
                  className="flex-row items-center p-4 rounded-lg active:bg-gray-100"
                >
                  <Ionicons name="image" size={24} color="#004A8D" />
                  <Text className="text-base text-gray-700">
                    Escolher da Galeria
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={takePhoto}
                  className="flex-row items-center p-4 rounded-lg active:bg-gray-100"
                >
                  <Ionicons name="camera" size={24} color="#004A8D" />
                  <Text className="ml-4 text-base text-gray-700">
                    Tirar Foto
                  </Text>
                </TouchableOpacity>

                {currentImageUri && (
                  <TouchableOpacity
                    onPress={confirmRemoveImage}
                    className="flex-row items-center p-4 rounded-lg active:bg-gray-100"
                  >
                    <Ionicons name="trash-outline" size={24} color="#EF4444" />
                    <Text className="ml-4 text-base text-red-600">
                      Remover Foto
                    </Text>
                  </TouchableOpacity>
                )}

                <View className="h-px bg-gray-200 my-2" />

                <TouchableOpacity
                  onPress={() => setIsOptionsModalVisible(false)}
                  className="items-center justify-center p-4 rounded-lg active:bg-gray-100"
                >
                  <Text className="text-base font-semibold text-gray-600">
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={isRemoveModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsRemoveModalVisible(false)}
        >
        <TouchableOpacity className="h-40 w-40 bg-black" onPress={confirmRemoveImage}></TouchableOpacity>  
      </Modal>
    </View>
  );
};

export default ProfileImagePicker;
