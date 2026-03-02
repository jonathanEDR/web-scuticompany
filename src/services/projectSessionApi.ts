/**
 * 🤖 API Service - Sesiones de Creación de Proyectos con IA
 * Cliente API para el flujo conversacional de creación de proyectos
 */

import axios, { type AxiosInstance } from 'axios';
import { getBackendUrl } from '../utils/apiConfig';

// ============================================
// TIPOS
// ============================================

export interface ProjectSessionMessage {
  role: 'user' | 'agent' | 'system';
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface ProjectSessionQuestion {
  id: string;
  question: string;
  type: 'select' | 'text' | 'tags';
  required?: boolean;
  options?: Array<{
    value: string;
    label: string;
    description?: string;
  }>;
  placeholder?: string;
}

export interface ProjectSessionAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'danger';
  description?: string;
}

export interface ProjectSessionContext {
  stage: string;
  progress: number;
  sessionId?: string;
  collected?: Record<string, unknown>;
}

export interface StartSessionResponse {
  sessionId: string;
  message: string;
  context: ProjectSessionContext;
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
  stage?: string;
  progress?: number;
  questions?: ProjectSessionQuestion[];
  actions?: ProjectSessionAction[];
  context?: ProjectSessionContext;
  summary?: Record<string, unknown>;
  shouldGenerate?: boolean;
  status?: string;
  pollUrl?: string;
  error?: string;
  code?: string;
}

export interface ProjectSessionData {
  sessionId: string;
  status: 'active' | 'generating' | 'completed' | 'cancelled' | 'expired';
  stage: string;
  progress: number;
  collected: Record<string, unknown>;
  conversationHistory: ProjectSessionMessage[];
  generation?: {
    generationId: string;
    status: string;
    startedAt: string;
    completedAt?: string;
    projectData?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    error?: { message: string; code: string };
  };
  createdProject?: {
    _id: string;
    nombre: string;
    slug: string;
    estado: string;
    categoria: string;
    visibleEnPortfolio: boolean;
  };
  generationStatus?: {
    generationId: string;
    status: string;
    startedAt: string;
    estimatedCompletion: string;
  };
  result?: Record<string, unknown>;
  actions?: ProjectSessionAction[];
  metadata: {
    startedFrom: string;
    totalMessages: number;
    regenerationCount: number;
  };
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface ProjectSessionListItem {
  sessionId: string;
  status: string;
  stage: string;
  progress: number;
  collected: { nombre?: string };
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

// ============================================
// CONFIGURACIÓN
// ============================================

const API_BASE_URL = getBackendUrl();

const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/agents/project/session`,
  timeout: 30000, // 30s para permitir llamadas a OpenAI
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// INTERCEPTORES
// ============================================

apiClient.interceptors.request.use(
  async (config) => {
    try {
      if (window.Clerk?.session) {
        const token = await window.Clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('[ProjectSessionAPI] Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    console.error('[ProjectSessionAPI] Request Error:', error);
    return Promise.reject(error);
  }
);

if (import.meta.env.DEV) {
  apiClient.interceptors.request.use(
    (config) => {
      console.debug(`[ProjectSessionAPI] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    }
  );
}

// ============================================
// MANEJO DE ERRORES
// ============================================

function handleError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'Error de conexión';
  }
  return error instanceof Error ? error.message : 'Error desconocido';
}

// ============================================
// API METHODS
// ============================================

/**
 * Iniciar nueva sesión de creación de proyecto con IA
 */
async function startSession(startedFrom: string = 'dashboard'): Promise<StartSessionResponse> {
  try {
    const response = await apiClient.post('/start', { startedFrom });
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

/**
 * Enviar mensaje en una sesión activa
 */
async function sendMessage(sessionId: string, message: string): Promise<SendMessageResponse> {
  try {
    const response = await apiClient.post(`/${sessionId}/message`, { message });
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

/**
 * Obtener estado de una sesión
 */
async function getSession(sessionId: string): Promise<ProjectSessionData> {
  try {
    const response = await apiClient.get(`/${sessionId}`);
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

/**
 * Generar proyecto directamente
 */
async function generateProject(sessionId: string): Promise<{ status: string; message: string; pollUrl: string }> {
  try {
    const response = await apiClient.post(`/${sessionId}/generate`);
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

/**
 * Cancelar sesión
 */
async function cancelSession(sessionId: string): Promise<void> {
  try {
    await apiClient.delete(`/${sessionId}`);
  } catch (error) {
    throw new Error(handleError(error));
  }
}

/**
 * Listar sesiones del usuario
 */
async function listSessions(params?: {
  status?: string;
  limit?: number;
  page?: number;
}): Promise<{ sessions: ProjectSessionListItem[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
  try {
    const response = await apiClient.get('/', { params });
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

/**
 * Polling: espera a que la generación complete
 */
async function pollSessionUntilComplete(
  sessionId: string,
  onUpdate?: (session: ProjectSessionData) => void,
  maxAttempts: number = 30,
  intervalMs: number = 2000
): Promise<ProjectSessionData> {
  for (let i = 0; i < maxAttempts; i++) {
    const session = await getSession(sessionId);
    
    if (onUpdate) {
      onUpdate(session);
    }
    
    // Si ya no está generando, retornar
    if (session.status !== 'generating') {
      return session;
    }
    
    // Si la generación falló
    if (session.generation?.status === 'failed') {
      throw new Error(session.generation.error?.message || 'La generación falló');
    }
    
    // Esperar antes del siguiente intento
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  
  throw new Error('Tiempo de espera agotado. La generación está tomando más de lo esperado.');
}

// ============================================
// EXPORTS
// ============================================

export const projectSessionApi = {
  startSession,
  sendMessage,
  getSession,
  generateProject,
  cancelSession,
  listSessions,
  pollSessionUntilComplete,
};

export default projectSessionApi;
