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

export const setProfile = async (): Promise<Profile> => {
  try {
    const response = await api.get("accounts/profile/");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar perfil", error);
    throw error;
  }
};

export const listUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get("/accounts/list_users/");
    return response.data;
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
