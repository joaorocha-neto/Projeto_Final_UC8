import api from "../api";

export interface Sala {
    id: number;
		qr_code_id: string; 
		nome_numero: string; 
		capacidade: number;
		validade_limpeza_horas: number;
		descricao: string;
		instrucoes: string | null;
		localizacao: string;
		ativa: boolean;
		imagem: string | null;
		responsaveis: number[];
		status_limpeza: string;
		ultima_limpeza_data_hora: string | null; 
		ultima_limpeza_funcionario: string | null; 
}

export interface CreateSalaData {
  nome_numero: string;
  capacidade: number;
  descricao: string;
  localizacao: string;
  ativa: boolean;
}

export interface UpdateSalaData {
  nome_numero?: string;
  capacidade?: number;
  descricao?: string;
  localizacao?: string;
}

export interface LimpezaRegistro {
  qr_code_id: string; 
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

export async function getSala(qr_code_id: number): Promise<Sala> {
  try {
    const response = await api.get<Sala>(`/salas/${qr_code_id}/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar sala:", error);
    throw error;
  }
}

export async function createSala(salaData: CreateSalaData): Promise<Sala> {
  const novaSala = new FormData()
    novaSala.append("nome_numero", salaData.nome_numero)
    novaSala.append("capacidade", salaData.capacidade.toString())
    novaSala.append("descricao", salaData.descricao)
    novaSala.append("localizacao", salaData.localizacao)
  try {
    const response = await api.post<Sala>("/salas/", novaSala,{
      headers : {
        "Content-Type" : "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.log(error)
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

export async function deleteSala(qr_code_id: string): Promise<void> {
  try {
    await api.delete(`/salas/${qr_code_id}/`);
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
