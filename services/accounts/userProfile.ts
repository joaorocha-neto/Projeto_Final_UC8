import api from "../api";

export interface User {
  id: number;
  username: string;
  nome: string;
  email: string;
  is_superuser: boolean;
  groups: number[];
  profile: Profile;
}

export interface Profile {
  profile_picture: string;
}

export interface CreateUserData {
  username: string;
  nome: string;
  password: string;
  confirm_password: string;
  email?: string;
  groups: number[];
  is_superuser?: boolean;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
}

export interface CreateUserResponse {
  message: string;
  user: User;
  token: string;
}

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get("/accounts/current_user/");
    const user = response.data;

    if (
      user.profile &&
      user.profile.profile_picture &&
      !user.profile.profile_picture.startsWith("http")
    ) {
      const baseURL = "https://zeladoria.tsr.net.br";
      user.profile.profile_picture = `${baseURL}${user.profile.profile_picture}`;
    }

    return user;
  } catch (error: any) {
    console.error("Erro ao obter dados do usuário:", error);
    throw error;
  }
};

export const setProfile = async (imageUri: string): Promise<Profile> => {
  try {
    // 1. Criar um objeto FormData para encapsular o arquivo
    const formData = new FormData();

    // Extrai o nome do arquivo a partir da URI local
    const filename = imageUri.split('/').pop();
    
    // Tenta adivinhar o tipo do arquivo (ex: 'image/jpeg')
    const match = /\.(\w+)$/.exec(filename!);
    const type = match ? `image/${match[1]}` : `image`;

    // 2. Adicionar a imagem ao FormData
    // O nome do campo ('profile_picture') deve ser exatamente o que sua API espera
    formData.append('profile_picture', {
      uri: imageUri,
      name: filename,
      type,
    } as any); // O 'as any' é usado para compatibilidade com a tipagem do React Native

    // 3. Enviar os dados usando o método PUT e o cabeçalho correto
    const response = await api.put("accounts/profile/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Sua lógica de prefixar a URL já está na função getCurrentUser,
    // então não precisa ser refeita aqui.
    return response.data;

  } catch (error) {
    console.error("Erro ao ATUALIZAR o perfil:", error);
    throw error;
  }
};

export const listUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get("/accounts/list_users/");
    const users: User[] = response.data;

    const baseURL = "https://zeladoria.tsr.net.br";
    
    return users.map(user => {
      if (
        user.profile &&
        user.profile.profile_picture &&
        !user.profile.profile_picture.startsWith("http")
      ) {
        user.profile.profile_picture = `${baseURL}${user.profile.profile_picture}`;
      }
      return user;
    });

  } catch (error: any) {
    console.error("Erro ao listar usuários:", error);
    throw error;
  }
};

export const createUser = async (
  userData: CreateUserData,
): Promise<CreateUserResponse> => {
  try {
    const response = await api.post("/accounts/create_user/", userData);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
};

export const changePassword = async (
  passwordData: ChangePasswordData,
): Promise<{ message: string }> => {
  try {
    const response = await api.post("/accounts/change_password/", passwordData);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao alterar senha:", error);
    throw error;
  }
};

