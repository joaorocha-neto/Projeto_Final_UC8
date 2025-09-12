import React, { createContext, useContext, useEffect, useState } from "react";
import { getToken, saveToken, removeToken } from "./authStorage";
import { getCurrentUser, User } from "./accounts/userProfile";
import api from "./api";

interface AuthContextData {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (
    imageUri: string | null,
  ) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  async function checkAuthState() {
    try {
      setIsLoading(true);
      const token = await getToken();

      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.log("Token inválido, removendo...");
          await removeToken();
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(token: string) {
    try {
      await saveToken(token);

      try {
        const userData = await getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário após login:", error);
        await removeToken();
        setUser(null);
        setIsAuthenticated(false);
        throw new Error("Token inválido ou usuário não encontrado");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  }

  async function logout() {
    try {
      await removeToken();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
  }

  async function refreshUser() {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      await logout();
      throw error;
    }
  }

  // A função que estava faltando
  async function updateProfile(
    imageUri: string | null,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (imageUri) {
        const formData = new FormData();
        formData.append("profile_picture", {
          uri: imageUri,
          name: "profile_pic.jpg",
          type: "image/jpeg",
        } as any);

        await api.patch("accounts/profile/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.patch("accounts/profile/", { profile_picture: null });
      }

      // Atualiza os dados do usuário no estado
      await refreshUser();

      return { success: true }; // Retorna sucesso
    } catch (error: any) {
      console.error("Erro ao atualizar o perfil:", error);
      let errorMessage = "Erro desconhecido ao atualizar a foto de perfil";
      if (error.response?.data?.profile_picture) {
        errorMessage = error.response.data.profile_picture.join(" ");
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      return { success: false, error: errorMessage }; // Retorna o erro
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        refreshUser,
        updateProfile, // Agora a função existe e pode ser passada
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}
