/**
 * 📁 API SERVICE - MÓDULO DE PROYECTOS
 * Cliente API para interactuar con los endpoints del portal de proyectos
 */

import axios, { type AxiosInstance } from 'axios';
import { getBackendUrl } from '../utils/apiConfig';
import type {
  Proyecto,
  CreateProyectoRequest,
  UpdateProyectoRequest,
  ProyectoFilters,
  ProyectoStatsResponse,
  CategoriaProyecto,
  PaginationInfo
} from '../types/proyecto';

// ============================================
// CONFIGURACIÓN
// ============================================

const API_BASE_URL = getBackendUrl();

const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/proyectos`,
  timeout: 15000,
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
      console.error('[ProyectosAPI] Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    console.error('[ProyectosAPI] Request Error:', error);
    return Promise.reject(error);
  }
);

if (import.meta.env.DEV) {
  apiClient.interceptors.request.use(
    (config) => {
      console.debug(`[ProyectosAPI] ${config.method?.toUpperCase()} ${config.url}`, config.params);
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
// 📌 ENDPOINTS PÚBLICOS
// ============================================

async function getPortfolio(params?: {
  categoria?: string;
  destacado?: boolean;
  limit?: number;
  page?: number;
}): Promise<{ data: Proyecto[]; pagination: PaginationInfo }> {
  try {
    const response = await apiClient.get('/', { params });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

async function getProyectoBySlug(slug: string): Promise<Proyecto> {
  try {
    const response = await apiClient.get(`/detalle/${slug}`);
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

async function getCategorias(): Promise<CategoriaProyecto[]> {
  try {
    const response = await apiClient.get('/categorias');
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

// ============================================
// 🛡️ ENDPOINTS ADMIN
// ============================================

async function getAllProyectosAdmin(params?: ProyectoFilters): Promise<{
  data: Proyecto[];
  pagination: PaginationInfo;
}> {
  try {
    const response = await apiClient.get('/admin/all', { params });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

async function getProyectoAdmin(id: string): Promise<Proyecto> {
  try {
    const response = await apiClient.get(`/admin/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

async function crearProyecto(data: CreateProyectoRequest): Promise<Proyecto> {
  try {
    const response = await apiClient.post('/admin', data);
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

async function actualizarProyecto(id: string, data: UpdateProyectoRequest): Promise<Proyecto> {
  try {
    const response = await apiClient.put(`/admin/${id}`, data);
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

async function eliminarProyecto(id: string): Promise<void> {
  try {
    await apiClient.delete(`/admin/${id}`);
  } catch (error) {
    throw new Error(handleError(error));
  }
}

async function getEstadisticas(): Promise<ProyectoStatsResponse> {
  try {
    const response = await apiClient.get('/admin/stats');
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

// ============================================
// EXPORTAR API CLIENT
// ============================================

export const proyectosApi = {
  // Públicos
  getPortfolio,
  getProyectoBySlug,
  getCategorias,

  // Admin
  getAllProyectosAdmin,
  getProyectoAdmin,
  crearProyecto,
  actualizarProyecto,
  eliminarProyecto,
  getEstadisticas,
};

export default proyectosApi;
