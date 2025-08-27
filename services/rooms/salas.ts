import api from "../api";

export interface Sala {
  id: number;
  nome_numero: string;
  capacidade: number;
  descricao: string;
  localizacao: string;
  status_limpeza: string;
  ultima_limpeza_data_hora: string | null;
  ultima_limpeza_funcionario: string | null;
}

export async function getSalas(): Promise<Sala[]> {
  try {
    const response = await api.get<Sala[]>("/salas", {
        headers:{
            'Content-Type' : 'application/json',
            'Authorization' : 'Token f6fe39b4288b6f3ccb161640820a529d087f21ce'
        }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar salas:", error);
    throw error;
  }
}
