import api from "../api";

export interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
  groups: number;
  profile: Profile
}

export interface Profile {
  profile_picture: string | null;
}

export interface CreateUserData {
  username: string;
  password: string;
  confirm_password: string;
  email?: string;
  is_staff?: boolean;
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
    return response.data;
  } catch (error: any) {
    console.error("Erro ao obter dados do usuário:", error);
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


export const createUser = async (userData: CreateUserData): Promise<CreateUserResponse> => {
  try {
    const response = await api.post("/accounts/create_user/", userData);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
};


export const changePassword = async (passwordData: ChangePasswordData): Promise<{ message: string }> => {
  try {
    const response = await api.post("/accounts/change_password/", passwordData);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao alterar senha:", error);
    throw error;
  }
};
