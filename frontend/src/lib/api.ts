import type { Achievement, CourseStatus, UserProgress } from "@/types/roadmap";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8081";

interface CursoProgressoResponse {
  cursoId: string;
  status: CourseStatus;
  studiedMinutes: number;
}

interface ConquistaResponse {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  desbloqueada: boolean;
  desbloqueadaEm: string | null;
}

export interface SnapshotResponse {
  usuario: UserProgress;
  cursos: CursoProgressoResponse[];
  conquistas: ConquistaResponse[];
}

export interface SessaoEstudoResponse {
  curso: CursoProgressoResponse;
  usuario: UserProgress;
  subiuDeNivel: boolean;
  conquistasDesbloqueadas: ConquistaResponse[];
}

function paraAchievement(conquista: ConquistaResponse): Achievement {
  return {
    id: conquista.id,
    title: conquista.titulo,
    description: conquista.descricao,
    icon: conquista.icone,
    unlocked: conquista.desbloqueada,
    unlockedAt: conquista.desbloqueadaEm ?? undefined,
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) {
    throw new Error(`Falha na chamada ${path}: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchSnapshot(): Promise<SnapshotResponse> {
  return request<SnapshotResponse>("/progresso");
}

export async function atualizarStatusCurso(
  cursoId: string,
  status: CourseStatus,
  duracaoTotalMinutos: number,
): Promise<CursoProgressoResponse> {
  return request<CursoProgressoResponse>(`/cursos/${cursoId}`, {
    method: "PATCH",
    body: JSON.stringify({ status, duracaoTotalMinutos }),
  });
}

export async function registrarSessaoEstudo(
  cursoId: string,
  minutos: number,
  duracaoTotalMinutos: number,
): Promise<SessaoEstudoResponse> {
  return request<SessaoEstudoResponse>(`/cursos/${cursoId}/sessoes-estudo`, {
    method: "POST",
    body: JSON.stringify({ minutos, duracaoTotalMinutos }),
  });
}

export async function desbloquearConquista(conquistaId: string): Promise<Achievement> {
  const conquista = await request<ConquistaResponse>(`/conquistas/${conquistaId}/desbloquear`, {
    method: "POST",
  });
  return paraAchievement(conquista);
}

export { paraAchievement };
