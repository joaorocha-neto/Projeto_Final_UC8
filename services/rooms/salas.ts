import api from "../api";

export interface Sala {
  id: number;
  imagem: string;
  nome_numero: string;
  capacidade: number;
  descricao: string;
  localizacao: string;
  status_limpeza: string;
  ultima_limpeza_data_hora: string | null;
  ultima_limpeza_funcionario: string | null;
}

export interface CreateSalaData {
  nome_numero: string;
  capacidade: number;
  descricao: string;
  localizacao: string;
}

export interface UpdateSalaData {
  nome_numero?: string;
  capacidade?: number;
  descricao?: string;
  localizacao?: string;
}

export interface LimpezaRegistro {
  id: number;
  sala: number;
  sala_nome: string;
  data_hora_limpeza: string;
  funcionario_responsavel: {
    id: number;
    username: string;
  };
  observacoes: string;
}

export interface MarcarComoLimpaData {
  observacoes?: string;
}

export async function getSalas(filtros?: {
  localizacao?: string;
  status_limpeza?: string;
}): Promise<Sala[]> {
  try {
    let url = "/salas/";
    const params = new URLSearchParams();

    if (filtros?.localizacao) {
      params.append("localizacao", filtros.localizacao);
    }
    if (filtros?.status_limpeza) {
      params.append("status_limpeza", filtros.status_limpeza);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get<Sala[]>(url);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar salas:", error);
    throw error;
  }
}

export async function getSala(id: number): Promise<Sala> {
  try {
    const response = await api.get<Sala>(`/salas/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar sala:", error);
    throw error;
  }
}

export async function createSala(salaData: CreateSalaData): Promise<Sala> {
  try {
    const response = await api.post<Sala>("/salas/", salaData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar sala:", error);
    throw error;
  }
}

export async function updateSala(
  id: number,
  salaData: UpdateSalaData,
): Promise<Sala> {
  try {
    const response = await api.patch<Sala>(`/salas/${id}/`, salaData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar sala:", error);
    throw error;
  }
}

export async function deleteSala(id: number): Promise<void> {
  try {
    await api.delete(`/salas/${id}/`);
  } catch (error) {
    console.error("Erro ao excluir sala:", error);
    throw error;
  }
}

export async function marcarComoLimpa(
  id: number,
  observacoes?: string,
): Promise<LimpezaRegistro> {
  try {
    const data: MarcarComoLimpaData = {};
    if (observacoes) {
      data.observacoes = observacoes;
    }

    const response = await api.post<LimpezaRegistro>(
      `/salas/${id}/marcar_como_limpa/`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao marcar sala como limpa:", error);
    throw error;
  }
}

export async function getRegistrosLimpeza(
  salaId?: number,
): Promise<LimpezaRegistro[]> {
  try {
    let url = "/limpezas/";
    if (salaId) {
      url += `?sala_id=${salaId}`;
    }

    const response = await api.get<LimpezaRegistro[]>(url);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar registros de limpeza:", error);
    throw error;
  }
}
