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
  ClienteAsignado,
  PaginationInfo
} from '../types/proyecto';

// ============================================
// CONFIGURACIÓN
// ============================================

const API_BASE_URL = getBackendUrl();

/**
 * Cliente axios configurado para proyectos
 */
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

/**
 * Interceptor para agregar token de autenticación automáticamente
 */
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

/**
 * Interceptor de logging en desarrollo
 */
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

/**
 * Obtener portafolio público de proyectos
 */
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

/**
 * Obtener detalle de un proyecto público por slug
 */
async function getProyectoBySlug(slug: string): Promise<Proyecto> {
  try {
    const response = await apiClient.get(`/detalle/${slug}`);
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

/**
 * Obtener categorías de proyectos con conteo
 */
async function getCategorias(): Promise<CategoriaProyecto[]> {
  try {
    const response = await apiClient.get('/categorias');
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

// ============================================
// 🔐 ENDPOINTS CLIENTE
// ============================================

/**
 * Obtener proyectos asignados al usuario logueado
 */
async function getMisProyectos(): Promise<{ data: Proyecto[]; total: number }> {
  try {
    const response = await apiClient.get('/cliente/mis-proyectos');
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

/**
 * Obtener URL de acceso a un sistema
 */
async function accederProyecto(id: string): Promise<{ nombre: string; url: string }> {
  try {
    const response = await apiClient.get(`/cliente/${id}/acceso`);
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

/**
 * Verificar si el usuario tiene acceso a un proyecto
 */
async function verificarAcceso(id: string): Promise<boolean> {
  try {
    const response = await apiClient.get(`/cliente/${id}/verificar-acceso`);
    return response.data.data.tieneAcceso;
  } catch (error) {
    return false;
  }
}

// ============================================
// 🛡️ ENDPOINTS ADMIN
// ============================================

/**
 * Obtener todos los proyectos (panel admin)
 */
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

/**
 * Obtener un proyecto específico (admin)
 */
async function getProyectoAdmin(id: string): Promise<Proyecto> {
  try {
    const response = await apiClient.get(`/admin/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

/**
 * Crear un nuevo proyecto
 */
async function crearProyecto(data: CreateProyectoRequest): Promise<Proyecto> {
  try {
    const response = await apiClient.post('/admin', data);
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

/**
 * Actualizar un proyecto existente
 */
async function actualizarProyecto(id: string, data: UpdateProyectoRequest): Promise<Proyecto> {
  try {
    const response = await apiClient.put(`/admin/${id}`, data);
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

/**
 * Eliminar un proyecto
 */
async function eliminarProyecto(id: string): Promise<void> {
  try {
    await apiClient.delete(`/admin/${id}`);
  } catch (error) {
    throw new Error(handleError(error));
  }
}

/**
 * Asignar clientes a un proyecto
 */
async function asignarClientes(proyectoId: string, clientIds: string[]): Promise<Proyecto> {
  try {
    const response = await apiClient.put(`/admin/${proyectoId}/clientes`, { clientIds });
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

/**
 * Obtener clientes disponibles para asignación
 */
async function getClientesDisponibles(search?: string): Promise<ClienteAsignado[]> {
  try {
    const response = await apiClient.get('/admin/clientes-disponibles', {
      params: search ? { search } : undefined
    });
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
}

/**
 * Obtener estadísticas de proyectos
 */
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
  
  // Cliente
  getMisProyectos,
  accederProyecto,
  verificarAcceso,
  
  // Admin
  getAllProyectosAdmin,
  getProyectoAdmin,
  crearProyecto,
  actualizarProyecto,
  eliminarProyecto,
  asignarClientes,
  getClientesDisponibles,
  getEstadisticas,
};

export default proyectosApi;
