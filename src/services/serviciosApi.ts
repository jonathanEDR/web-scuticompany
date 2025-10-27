/**
 * 🌐 API SERVICE - MÓDULO DE SERVICIOS
 * Cliente API completo para interactuar con los endpoints de servicios
 */

import axios, { type AxiosError, type AxiosInstance } from 'axios';
import { getBackendUrl } from '../utils/apiConfig';
import type {
  ServiciosResponse,
  ServicioResponse,
  ServicioFilters,
  PaginationParams,
  ServicioDashboardStats,
  PaquetesResponse,
  PaqueteResponse,
  CreateServicioRequest,
  UpdateServicioRequest,
  CreatePaqueteRequest,
  UpdatePaqueteRequest,
  ApiResponse,
  ServicioStats,
  VentasStats,
  ConversionMetrics
} from '../types/servicios';

// ============================================
// CONFIGURACIÓN
// ============================================

const API_BASE_URL = getBackendUrl();

/**
 * Cliente axios configurado para servicios
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/servicios`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// INTERCEPTORES
// ============================================

/**
 * Interceptor para agregar token de autenticación
 */
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Obtener token de Clerk si existe
      if (window.Clerk?.session) {
        const token = await window.Clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('[ServiciosAPI] Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    console.error('[ServiciosAPI] Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor para logging en desarrollo
 */
if (import.meta.env.DEV) {
  apiClient.interceptors.request.use(
    (config) => {
      console.log(`[ServiciosAPI] ${config.method?.toUpperCase()} ${config.url}`, config.params);
      return config;
    }
  );

  apiClient.interceptors.response.use(
    (response) => {
      console.log(`[ServiciosAPI] Response:`, response.data);
      return response;
    },
    (error) => {
      console.error('[ServiciosAPI] Response Error:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
}

// ============================================
// MANEJO DE ERRORES
// ============================================

interface ApiErrorResponse {
  message: string;
  code?: string;
  status?: number;
}

/**
 * Maneja errores de la API y los convierte a un formato consistente
 */
function handleApiError(error: unknown): ApiErrorResponse {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    
    // Error con respuesta del servidor
    if (axiosError.response) {
      return {
        message: axiosError.response.data?.message || 
                 axiosError.response.data?.error ||
                 'Error en la operación',
        code: axiosError.code,
        status: axiosError.response.status
      };
    }
    
    // Error de red (sin respuesta)
    if (axiosError.request) {
      return {
        message: 'Error de conexión. Verifica tu conexión a internet.',
        code: axiosError.code,
        status: 0
      };
    }
  }
  
  // Error desconocido
  return {
    message: error instanceof Error ? error.message : 'Error desconocido',
    code: 'UNKNOWN_ERROR',
    status: 0
  };
}

// ============================================
// API - SERVICIOS CRUD
// ============================================

export const serviciosApi = {
  /**
   * Obtener todos los servicios con filtros y paginación
   */
  getAll: async (
    filters?: ServicioFilters,
    pagination?: PaginationParams
  ): Promise<ServiciosResponse> => {
    try {
      const params = { ...filters, ...pagination };
      const { data } = await apiClient.get<ServiciosResponse>('/', { params });
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Obtener un servicio por ID o slug
   */
  getById: async (id: string, includePaquetes = true): Promise<ServicioResponse> => {
    try {
      const { data } = await apiClient.get<ServicioResponse>(`/${id}`, {
        params: { includePaquetes }
      });
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Crear un nuevo servicio
   */
  create: async (servicioData: CreateServicioRequest): Promise<ServicioResponse> => {
    try {
      const { data } = await apiClient.post<ServicioResponse>('/', servicioData);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Actualizar un servicio existente
   */
  update: async (id: string, servicioData: UpdateServicioRequest): Promise<ServicioResponse> => {
    try {
      const { data } = await apiClient.put<ServicioResponse>(`/${id}`, servicioData);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Eliminar un servicio (hard delete)
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const { data } = await apiClient.delete<ApiResponse<void>>(`/${id}`);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Eliminar suavemente un servicio (soft delete)
   */
  softDelete: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const { data } = await apiClient.delete<ApiResponse<void>>(`/${id}/soft`);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Restaurar un servicio eliminado
   */
  restore: async (id: string): Promise<ServicioResponse> => {
    try {
      const { data } = await apiClient.patch<ServicioResponse>(`/${id}/restaurar`);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // ============================================
  // ACCIONES ESPECIALES
  // ============================================

  /**
   * Duplicar un servicio existente
   */
  duplicate: async (id: string): Promise<ServicioResponse> => {
    try {
      const { data } = await apiClient.post<ServicioResponse>(`/${id}/duplicar`);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Cambiar el estado de un servicio
   */
  changeStatus: async (id: string, estado: string): Promise<ServicioResponse> => {
    try {
      const { data } = await apiClient.patch<ServicioResponse>(`/${id}/estado`, { estado });
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Cambiar el estado de múltiples servicios
   */
  bulkChangeStatus: async (
    ids: string[],
    estado: string
  ): Promise<ApiResponse<{ updated: number }>> => {
    try {
      const { data } = await apiClient.patch<ApiResponse<{ updated: number }>>(
        '/bulk/estado',
        { ids, estado }
      );
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // ============================================
  // BÚSQUEDA Y FILTROS
  // ============================================

  /**
   * Buscar servicios por texto
   */
  search: async (query: string, filters?: ServicioFilters): Promise<ServiciosResponse> => {
    try {
      const params = { q: query, ...filters };
      const { data } = await apiClient.get<ServiciosResponse>('/buscar', { params });
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Obtener servicios destacados
   */
  getFeatured: async (limit?: number): Promise<ServiciosResponse> => {
    try {
      const params = limit ? { limit } : {};
      const { data } = await apiClient.get<ServiciosResponse>('/destacados', { params });
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Obtener top servicios más vendidos
   */
  getTopSelling: async (limit = 5): Promise<ServiciosResponse> => {
    try {
      const { data } = await apiClient.get<ServiciosResponse>('/top/vendidos', {
        params: { limit }
      });
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Obtener servicios por categoría
   */
  getByCategory: async (categoria: string): Promise<ServiciosResponse> => {
    try {
      const { data } = await apiClient.get<ServiciosResponse>(`/categoria/${categoria}`);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Obtener servicios por etiqueta
   */
  getByTag: async (tag: string): Promise<ServiciosResponse> => {
    try {
      const { data } = await apiClient.get<ServiciosResponse>(`/etiqueta/${tag}`);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // ============================================
  // ESTADÍSTICAS Y DASHBOARD
  // ============================================

  /**
   * Obtener dashboard completo con todas las métricas
   */
  getDashboard: async (): Promise<ApiResponse<ServicioDashboardStats>> => {
    try {
      const { data } = await apiClient.get<ApiResponse<ServicioDashboardStats>>('/dashboard');
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Obtener estadísticas generales de servicios
   */
  getStats: async (): Promise<ApiResponse<ServicioStats>> => {
    try {
      const { data } = await apiClient.get<ApiResponse<ServicioStats>>('/stats');
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Obtener estadísticas de ventas
   */
  getSalesStats: async (): Promise<ApiResponse<VentasStats>> => {
    try {
      const { data } = await apiClient.get<ApiResponse<VentasStats>>('/stats/ventas');
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Obtener métricas de conversión
   */
  getConversionMetrics: async (): Promise<ApiResponse<ConversionMetrics>> => {
    try {
      const { data } = await apiClient.get<ApiResponse<ConversionMetrics>>('/stats/conversion');
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // ============================================
  // PAQUETES DE SERVICIOS
  // ============================================

  /**
   * Obtener todos los paquetes de un servicio
   */
  getPaquetes: async (servicioId: string): Promise<PaquetesResponse> => {
    try {
      const { data } = await apiClient.get<PaquetesResponse>(`/${servicioId}/paquetes`);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Crear un nuevo paquete para un servicio
   */
  createPaquete: async (
    servicioId: string,
    paqueteData: CreatePaqueteRequest
  ): Promise<PaqueteResponse> => {
    try {
      const { data } = await apiClient.post<PaqueteResponse>(
        `/${servicioId}/paquetes`,
        paqueteData
      );
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Actualizar un paquete existente
   */
  updatePaquete: async (
    paqueteId: string,
    paqueteData: UpdatePaqueteRequest
  ): Promise<PaqueteResponse> => {
    try {
      const { data } = await apiClient.put<PaqueteResponse>(
        `/paquetes/${paqueteId}`,
        paqueteData
      );
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Eliminar un paquete
   */
  deletePaquete: async (paqueteId: string): Promise<ApiResponse<void>> => {
    try {
      const { data } = await apiClient.delete<ApiResponse<void>>(`/paquetes/${paqueteId}`);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Duplicar un paquete
   */
  duplicatePaquete: async (paqueteId: string): Promise<PaqueteResponse> => {
    try {
      const { data } = await apiClient.post<PaqueteResponse>(`/paquetes/${paqueteId}/duplicar`);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Obtener el paquete más popular de un servicio
   */
  getMostPopularPaquete: async (servicioId: string): Promise<PaqueteResponse> => {
    try {
      const { data } = await apiClient.get<PaqueteResponse>(
        `/${servicioId}/paquetes/mas-popular`
      );
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // ============================================
  // PLANTILLAS
  // ============================================

  /**
   * Obtener todas las plantillas de servicios
   */
  getTemplates: async (): Promise<ServiciosResponse> => {
    try {
      const { data } = await apiClient.get<ServiciosResponse>('/plantillas');
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Crear un servicio desde una plantilla
   */
  createFromTemplate: async (
    templateId: string,
    customData?: Partial<CreateServicioRequest>
  ): Promise<ServicioResponse> => {
    try {
      const { data } = await apiClient.post<ServicioResponse>('/desde-plantilla', {
        templateId,
        ...customData
      });
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// ============================================
// EXPORTACIONES
// ============================================

export default serviciosApi;

/**
 * Tipos exportados para uso externo
 */
export type { ApiErrorResponse };
