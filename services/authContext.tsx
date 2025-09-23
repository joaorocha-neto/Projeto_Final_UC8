import React, { createContext, useContext, useEffect, useState } from "react";
import { getToken, saveToken, removeToken } from "./authStorage";
// 1. IMPORTE A FUNÇÃO 'setProfile' AQUI
import { getCurrentUser, User, setProfile } from "./accounts/userProfile";
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
    // ... (sem alterações aqui)
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
    // ... (sem alterações aqui)
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
    // ... (sem alterações aqui)
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
    // ... (sem alterações aqui)
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      await logout();
      throw error;
    }
  }

  // 2. SUBSTITUA SUA FUNÇÃO 'updateProfile' POR ESTA VERSÃO CORRIGIDA
  async function updateProfile(
    imageUri: string | null,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (imageUri) {
        // AQUI ESTÁ A MUDANÇA PRINCIPAL
        // Agora chamamos a função centralizada que sabe como fazer o upload
        await setProfile(imageUri);
      } else {
        // Para remover a foto, enviamos um valor nulo para o campo.
        // Usamos PUT para consistência com a função de upload.
        await api.put("accounts/profile/", { profile_picture: null });
      }

      // Esta parte já estava correta: buscar os dados atualizados após a mudança
      await refreshUser();

      return { success: true };
    } catch (error: any) {
      console.error("Erro ao atualizar o perfil:", error.response?.data || error);
      let errorMessage = "Erro desconhecido ao atualizar a foto de perfil";
      if (error.response?.data?.profile_picture) {
        errorMessage = error.response.data.profile_picture.join(" ");
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      return { success: false, error: errorMessage };
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
        updateProfile, // A função agora está correta e simplificada
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