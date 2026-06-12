/**
 * 💬 SERVICIO DE MENSAJERÍA CRM
 * Gestión completa de mensajes y plantillas del sistema CRM
 */

import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type {
  LeadMessage,
  MessageTemplate,
  MessageFilters,
  TemplateFilters,
  CreateInternalMessageData,
  CreateClientMessageData,
  ReplyMessageData,
  CreateTemplateData,
  UpdateTemplateData,
  UseTemplateData,
  MessageListResponse,
  TemplateListResponse,
  UnreadMessagesResponse,
  SearchMessagesResponse,
  ConversationListResponse,
  ApiResponse,
} from '../types/message.types';

// ========================================
// 🔧 CONFIGURACIÓN
// ========================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Instancia de axios configurada para CRM
 */
const createApiInstance = (): AxiosInstance => {
  const api = axios.create({
    baseURL: `${API_URL}/crm`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 🔒 Interceptor para agregar token de Clerk
  api.interceptors.request.use(
    async (config) => {
      try {
        // Obtener token de Clerk
        const token = await window.Clerk?.session?.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('❌ Error obteniendo token de Clerk:', error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 📝 Interceptor para manejo de errores
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      if (status === 401) {
        console.error('🚫 No autenticado:', message);
        // Aquí podrías disparar un evento para redirigir al login
      } else if (status === 403) {
        console.error('🚫 Sin permisos:', message);
      } else if (status === 404) {
        console.error('❌ No encontrado:', message);
      } else {
        console.error('❌ Error en la petición:', message);
      }

      return Promise.reject(error);
    }
  );

  return api;
};

const api = createApiInstance();

// Declaración global de Clerk
declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: () => Promise<string | null>;
      };
    };
  }
}

// ========================================
// 💬 SERVICIO DE MENSAJES
// ========================================

export const messageService = {
  /**
   * 📋 Obtener timeline de mensajes de un lead
   * GET /api/crm/leads/:id/messages
   */
  getLeadMessages: async (
    leadId: string,
    filters?: MessageFilters
  ): Promise<MessageListResponse> => {
    try {
      const params: any = {
        page: filters?.page || 1,
        limit: filters?.limit || 50,
      };

      if (filters?.incluirPrivados !== undefined) {
        params.incluirPrivados = filters.incluirPrivados;
      }
      if (filters?.tipo && filters.tipo !== 'all') {
        params.tipo = filters.tipo;
      }

      const response = await api.get(`/leads/${leadId}/messages`, { params });
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo mensajes del lead:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * 📝 Enviar mensaje interno (nota privada)
   * POST /api/crm/leads/:id/messages/internal
   */
  sendInternalMessage: async (
    data: CreateInternalMessageData
  ): Promise<ApiResponse<LeadMessage>> => {
    try {
      const response = await api.post(
        `/leads/${data.leadId}/messages/internal`,
        {
          contenido: data.contenido,
          asunto: data.asunto,
          prioridad: data.prioridad || 'normal',
          etiquetas: data.etiquetas || [],
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Error enviando mensaje interno:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * 💬 Enviar mensaje a cliente
   * POST /api/crm/leads/:id/messages/client
   */
  sendClientMessage: async (
    data: CreateClientMessageData
  ): Promise<ApiResponse<LeadMessage>> => {
    try {
      const response = await api.post(
        `/leads/${data.leadId}/messages/client`,
        {
          contenido: data.contenido,
          asunto: data.asunto,
          prioridad: data.prioridad || 'normal',
          canal: data.canal || 'sistema',
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Error enviando mensaje a cliente:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * ↩️ Responder a un mensaje
   * POST /api/crm/messages/:messageId/reply
   */
  replyMessage: async (
    data: ReplyMessageData
  ): Promise<ApiResponse<LeadMessage>> => {
    try {
      const response = await api.post(`/messages/${data.messageId}/reply`, {
        contenido: data.contenido,
        esPrivado: data.esPrivado || false,
      });
      return response.data;
    } catch (error: any) {
      console.error('❌ Error respondiendo mensaje:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * 📩 Obtener un mensaje específico por ID
   * GET /api/crm/messages/:messageId
   */
  getMessage: async (messageId: string): Promise<ApiResponse<LeadMessage>> => {
    try {
      const response = await api.get(`/messages/${messageId}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo mensaje:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * ✅ Marcar mensaje como leído
   * PATCH /api/crm/messages/:messageId/read
   */
  markAsRead: async (messageId: string): Promise<ApiResponse<LeadMessage>> => {
    try {
      const response = await api.patch(`/messages/${messageId}/read`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error marcando mensaje como leído:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * 🗑️ Eliminar mensaje (soft delete)
   * DELETE /api/crm/messages/:messageId
   */
  deleteMessage: async (messageId: string): Promise<ApiResponse> => {
    try {
      const response = await api.delete(`/messages/${messageId}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error eliminando mensaje:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * 🔔 Obtener mensajes no leídos
   * GET /api/crm/messages/unread
   */
  getUnreadMessages: async (): Promise<UnreadMessagesResponse> => {
    try {
      const response = await api.get('/messages/unread');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo mensajes no leídos:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * 📊 Obtener estadísticas de mensajes
   * GET /api/crm/messages/stats
   */
  getMessageStats: async (): Promise<ApiResponse<{
    total: number;
    noLeidos: number;
    enviados: number;
    respondidos: number;
    porTipo: Record<string, number>;
  }>> => {
    try {
      const response = await api.get('/messages/stats');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo estadísticas de mensajes:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * 🗂️ Obtener conversaciones (último mensaje por lead + contadores)
   * GET /api/crm/messages/conversations
   * Agrupación y paginación se hacen en el servidor
   */
  getConversations: async (
    filters: { page?: number; limit?: number } = {}
  ): Promise<ConversationListResponse> => {
    try {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 50,
      };

      const response = await api.get('/messages/conversations', { params });
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo conversaciones:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * 🔍 Buscar mensajes
   * GET /api/crm/messages/search
   */
  searchMessages: async (
    filters: MessageFilters
  ): Promise<SearchMessagesResponse> => {
    try {
      const params: any = {
        q: filters.search,
        page: filters.page || 1,
        limit: filters.limit || 20,
      };

      if (filters.leadId) params.leadId = filters.leadId;
      if (filters.tipo && filters.tipo !== 'all') params.tipo = filters.tipo;
      if (filters.desde) params.desde = filters.desde;
      if (filters.hasta) params.hasta = filters.hasta;

      const response = await api.get('/messages/search', { params });
      return response.data;
    } catch (error: any) {
      console.error('❌ Error buscando mensajes:', error);
      throw error.response?.data || error;
    }
  },
};

// ========================================
// 📋 SERVICIO DE PLANTILLAS
// ========================================

export const templateService = {
  /**
   * 📚 Obtener todas las plantillas
   * GET /api/crm/templates
   */
  getTemplates: async (
    filters?: TemplateFilters
  ): Promise<TemplateListResponse> => {
    try {
      const params: any = {
        page: filters?.page || 1,
        limit: filters?.limit || 20,
      };

      if (filters?.tipo && filters.tipo !== 'all') params.tipo = filters.tipo;
      if (filters?.categoria && filters.categoria !== 'all')
        params.categoria = filters.categoria;
      if (filters?.favoritos) params.favoritos = 'true';
      if (filters?.search) params.search = filters.search;

      const response = await api.get('/templates', { params });
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo plantillas:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * 📄 Obtener plantilla por ID
   * GET /api/crm/templates/:id
   */
  getTemplate: async (id: string): Promise<ApiResponse<MessageTemplate>> => {
    try {
      const response = await api.get(`/templates/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo plantilla:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * ➕ Crear nueva plantilla
   * POST /api/crm/templates
   */
  createTemplate: async (
    data: CreateTemplateData
  ): Promise<ApiResponse<MessageTemplate>> => {
    try {
      const response = await api.post('/templates', data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error creando plantilla:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * ✏️ Actualizar plantilla
   * PUT /api/crm/templates/:id
   */
  updateTemplate: async (
    id: string,
    data: UpdateTemplateData
  ): Promise<ApiResponse<MessageTemplate>> => {
    try {
      const response = await api.put(`/templates/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error actualizando plantilla:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * 🗑️ Eliminar plantilla
   * DELETE /api/crm/templates/:id
   */
  deleteTemplate: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await api.delete(`/templates/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error eliminando plantilla:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * 📋 Usar plantilla (con variables)
   * POST /api/crm/templates/:id/use
   */
  useTemplate: async (
    templateId: string,
    data: UseTemplateData
  ): Promise<ApiResponse<{ contenidoFinal: string }>> => {
    try {
      const response = await api.post(`/templates/${templateId}/use`, data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error usando plantilla:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * ⭐ Toggle favorito de plantilla
   * POST /api/crm/templates/:id/favorite
   */
  toggleFavorite: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await api.post(`/templates/${id}/favorite`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error toggle favorito:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * 📊 Obtener estadísticas de plantillas
   * GET /api/crm/templates/stats
   */
  getTemplateStats: async (): Promise<
    ApiResponse<{
      total: number;
      porTipo: any;
      masUsadas: MessageTemplate[];
    }>
  > => {
    try {
      const response = await api.get('/templates/stats');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error obteniendo estadísticas:', error);
      throw error.response?.data || error;
    }
  },
};

// ========================================
// 🎯 HELPERS Y UTILIDADES
// ========================================

/**
 * Reemplazar variables en contenido de plantilla
 */
export const replaceTemplateVariables = (
  content: string,
  variables: Record<string, string>
): string => {
  let result = content;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, value);
  });
  return result;
};

/**
 * Validar contenido de mensaje
 */
export const validateMessageContent = (
  content: string,
  maxLength: number = 10000
): { valid: boolean; error?: string } => {
  if (!content || content.trim().length === 0) {
    return { valid: false, error: 'El contenido no puede estar vacío' };
  }

  if (content.length > maxLength) {
    return {
      valid: false,
      error: `El contenido no puede exceder ${maxLength} caracteres`,
    };
  }

  return { valid: true };
};

/**
 * Extraer variables de un texto
 */
export const extractVariables = (content: string): string[] => {
  const regex = /\{([a-zA-Z0-9_]+)\}/g;
  const matches = content.matchAll(regex);
  return Array.from(matches, (m) => m[1]);
};

/**
 * Formatear fecha relativa
 */
export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInMs = now.getTime() - messageDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMinutes < 1) return 'Ahora';
  if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
  if (diffInHours < 24) return `Hace ${diffInHours}h`;
  if (diffInDays < 7) return `Hace ${diffInDays}d`;

  return messageDate.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: messageDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

/**
 * Extraer el ID de un leadId que puede venir como string o poblado como objeto
 */
export const extractLeadId = (leadId: LeadMessage['leadId']): string => {
  return typeof leadId === 'object' && leadId !== null ? leadId._id : leadId;
};

/**
 * Determinar si un mensaje fue enviado por el equipo (no por el cliente)
 */
export const isMessageFromTeam = (message: LeadMessage): boolean => {
  // Criterio 1: El tipo de mensaje NO es respuesta_cliente
  const notClientResponse = message.tipo !== 'respuesta_cliente';

  // Criterio 2: El autor tiene rol de admin/moderador/sistema
  const isTeamRole = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SYSTEM'].includes(message.autor?.rol || '');

  // Criterio 3: El autor se llama "Sistema" o "SCUTI" (mensajes automáticos)
  const isSystemAuthor = message.autor?.nombre?.toLowerCase().includes('sistema') ||
                         message.autor?.nombre?.toLowerCase().includes('scuti');

  return notClientResponse || isTeamRole || !!isSystemAuthor;
};

/**
 * Contar mensajes no leídos en un array
 */
export const countUnreadMessages = (messages: LeadMessage[]): number => {
  return messages.filter((m) => !m.leido && !m.eliminado).length;
};

/**
 * Filtrar mensajes según criterios
 */
export const filterMessages = (
  messages: LeadMessage[],
  filters: MessageFilters
): LeadMessage[] => {
  return messages.filter((message) => {
    // Filtro por tipo
    if (filters.tipo && filters.tipo !== 'all' && message.tipo !== filters.tipo) {
      return false;
    }

    // Filtro por leído
    if (filters.leido !== undefined && message.leido !== filters.leido) {
      return false;
    }

    // Filtro por privado
    if (filters.esPrivado !== undefined && message.esPrivado !== filters.esPrivado) {
      return false;
    }

    // Filtro por búsqueda de texto
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const contenidoMatch = message.contenido.toLowerCase().includes(searchLower);
      const asuntoMatch = message.asunto?.toLowerCase().includes(searchLower);
      if (!contenidoMatch && !asuntoMatch) {
        return false;
      }
    }

    // Filtro por fecha
    if (filters.desde) {
      const messageDate = new Date(message.createdAt);
      const fromDate = new Date(filters.desde);
      if (messageDate < fromDate) return false;
    }

    if (filters.hasta) {
      const messageDate = new Date(message.createdAt);
      const toDate = new Date(filters.hasta);
      if (messageDate > toDate) return false;
    }

    return true;
  });
};

/**
 * Agrupar mensajes por fecha
 */
export const groupMessagesByDate = (
  messages: LeadMessage[]
): Record<string, LeadMessage[]> => {
  return messages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(message);
    return groups;
  }, {} as Record<string, LeadMessage[]>);
};

// ========================================
// 📤 EXPORT DEFAULT
// ========================================

export default {
  ...messageService,
  templates: templateService,
  utils: {
    replaceTemplateVariables,
    validateMessageContent,
    extractVariables,
    formatRelativeTime,
    extractLeadId,
    isMessageFromTeam,
    countUnreadMessages,
    filterMessages,
    groupMessagesByDate,
  },
};
