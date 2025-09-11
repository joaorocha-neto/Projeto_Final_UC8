import React, { useState } from 'react';
// TouchableWithoutFeedback foi adicionado para corrigir o problema
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator, Modal, TouchableWithoutFeedback } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons";

interface ProfileImagePickerProps {
    currentImageUri?: string | null;
    onImageSelected: (imageUri: string) => void;
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
        if (status !== 'granted') {
            Alert.alert(
                'Permissão Necessária',
                'Precisamos de permissão para acessar sua galeria de fotos.',
                [{ text: 'OK' }]
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
            console.error('Erro ao selecionar imagem:', error);
            Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
        } finally {
            setIsLoading(false);
        }
    };

    const takePhoto = async () => {
        setIsOptionsModalVisible(false);
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permissão Necessária',
                'Precisamos de permissão para acessar sua câmera.',
                [{ text: 'OK' }]
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
            console.error('Erro ao tirar foto:', error);
            Alert.alert('Erro', 'Não foi possível tirar a foto.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleRemoveRequest = () => {
        setIsOptionsModalVisible(false);
        setIsRemoveModalVisible(true);
    };

    const confirmRemoveImage = () => {
        setIsRemoveModalVisible(false);
        onImageRemoved();
    };

    return (
        <View className="items-center">
            {/* ... (Visual da imagem e botão de editar não mudam) ... */}
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
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                            onError={() => setImageLoadError(true)}
                        />
                    ) : (
                        <View className="flex-1 items-center justify-center bg-gray-200">
                           <Ionicons name="person" size={size * 0.5} color="#A0A0A0" />
                        </View>
                    )}
                </View>

                {isLoading && (
                    <View
                        className="absolute inset-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    >
                        <ActivityIndicator size="large" color="#FFFFFF" />
                    </View>
                )}
            </View>

            <TouchableOpacity
                onPress={() => setIsOptionsModalVisible(true)}
                disabled={isLoading}
                className="px-6 py-3 rounded-xl flex-row items-center bg-blue-50 mt-3 active:bg-blue-100"
                style={{ opacity: isLoading ? 0.6 : 1 }}
            >
                <Text className="font-medium text-blue-600">
                    {imageLoadError ? 'Tentar Novamente' : (currentImageUri ? 'Editar Foto' : 'Adicionar Foto')}
                </Text>
            </TouchableOpacity>

            {/* --- MODAL DE OPÇÕES CORRIGIDO --- */}
            <Modal
                visible={isOptionsModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsOptionsModalVisible(false)}
            >
                {/* 1. Componente de toque para o fundo, que fecha o modal */}
                <TouchableWithoutFeedback onPress={() => setIsOptionsModalVisible(false)}>
                    <View className="flex-1 justify-end bg-black/50">
                        {/* 2. Componente de toque para o conteúdo, que EVITA o fechamento */}
                        <TouchableWithoutFeedback onPress={() => {}}>
                            <View className="bg-white rounded-t-2xl p-2 pb-4">
                                <Text className="text-lg font-bold text-center text-gray-800 my-4">
                                    Alterar Foto de Perfil
                                </Text>
                                
                                <TouchableOpacity onPress={pickImage} className="flex-row items-center p-4 rounded-lg active:bg-gray-100">
                                    <Ionicons name="image-outline" size={24} color="#3B82F6" />
                                    <Text className="ml-4 text-base text-gray-700">Escolher da Galeria</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={takePhoto} className="flex-row items-center p-4 rounded-lg active:bg-gray-100">
                                    <Ionicons name="camera-outline" size={24} color="#3B82F6" />
                                    <Text className="ml-4 text-base text-gray-700">Tirar Foto</Text>
                                </TouchableOpacity>

                                {currentImageUri && (
                                    <TouchableOpacity onPress={handleRemoveRequest} className="flex-row items-center p-4 rounded-lg active:bg-gray-100">
                                        <Ionicons name="trash-outline" size={24} color="#EF4444" />
                                        <Text className="ml-4 text-base text-red-600">Remover Foto</Text>
                                    </TouchableOpacity>
                                )}

                                <View className="h-px bg-gray-200 my-2" />

                                <TouchableOpacity onPress={() => setIsOptionsModalVisible(false)} className="items-center justify-center p-4 rounded-lg active:bg-gray-100">
                                    <Text className="text-base font-semibold text-gray-600">Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* --- MODAL DE CONFIRMAÇÃO DE REMOÇÃO (Inalterado) --- */}
            <Modal
                visible={isRemoveModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsRemoveModalVisible(false)}
            >
                {/* ... (código do modal de confirmação permanece o mesmo) ... */}
            </Modal>
        </View>
    );
};

export default ProfileImagePicker;