import api from "../api";

interface LoginResponse {
  username: string;
  password: string;
  token: string;
  user_data: {
    id: number;
    username: string;
    email: string;
    is_staff: boolean;
    is_superuser: boolean;
  };
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>("/accounts/login/", {
      username,
      password,
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.detail || "Erro no login");
    } else {
      throw new Error("Erro de conexão");
    }
  }
}