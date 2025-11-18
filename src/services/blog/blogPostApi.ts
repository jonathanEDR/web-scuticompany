/**
 * 📡 Servicio de API para Posts del Blog
 * Maneja todas las peticiones relacionadas con posts
 */

import axios, { AxiosError } from 'axios';
import { getApiUrl } from '../../utils/apiConfig';
import { setupAuthInterceptor } from './blogApiClientSetup';
import type {
  BlogPost,
  CreatePostDto,
  UpdatePostDto,
  BlogFilters,
  ApiResponse,
  PaginatedResponse
} from '../../types/blog';

// ============================================
// CONFIGURACIÓN DE AXIOS
// ============================================

// Cliente para peticiones autenticadas
const blogApiClient = axios.create({
  baseURL: `${getApiUrl()}/blog`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: parseInt(import.meta.env.VITE_BLOG_API_TIMEOUT || '15000'),
});

// Cliente para peticiones públicas (sin autenticación)
const publicBlogApiClient = axios.create({
  baseURL: `${getApiUrl()}/blog`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: parseInt(import.meta.env.VITE_BLOG_API_TIMEOUT || '15000'),
});

// ============================================
// INTERCEPTORES
// ============================================

// Configurar interceptor de autenticación solo para cliente autenticado
setupAuthInterceptor(blogApiClient);

// Interceptor para manejo de respuestas y errores (MEJORADO)
[blogApiClient, publicBlogApiClient].forEach(client => {
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const config = error.config;
      const url = config?.url || 'unknown';
      
      if (error.response) {
        // Error del servidor con respuesta
        const status = error.response.status;
        const data = error.response.data as any;

        // Log específico según el tipo de error
        if (status === 401) {
          console.error(`[BlogAPI] 401 No autorizado en ${url} - Token inválido o expirado`);
        } else if (status === 403) {
          console.error(`[BlogAPI] 403 Acceso denegado en ${url} - Permisos insuficientes`);
        } else if (status === 404) {
          console.error(`[BlogAPI] 404 Recurso no encontrado: ${url}`);
        } else if (status === 429) {
          console.error(`[BlogAPI] 429 Rate limit excedido en ${url} - Demasiadas peticiones`);
        } else if (status >= 500) {
          console.error(`[BlogAPI] ${status} Error del servidor en ${url}:`, data?.message || 'Error interno');
        }

        // Mensaje de error más específico
        const errorMessage = data?.message || 
                           (status === 429 ? 'Demasiadas peticiones, intenta más tarde' :
                            status === 404 ? 'Recurso no encontrado' :
                            status === 403 ? 'Acceso denegado' :
                            status === 401 ? 'No autorizado' :
                            'Error en la petición');

        return Promise.reject(new Error(errorMessage));
      } else if (error.request) {
        // Petición enviada pero sin respuesta
        console.error(`[BlogAPI] Sin respuesta del servidor para ${url}:`, {
          timeout: error.code === 'ECONNABORTED',
          network: error.message.includes('Network Error'),
          code: error.code
        });
        
        const errorMessage = error.code === 'ECONNABORTED' 
          ? 'Tiempo de espera agotado - El servidor tardó demasiado en responder'
          : 'No se pudo conectar con el servidor - Verifica tu conexión';
          
        return Promise.reject(new Error(errorMessage));
      } else {
        // Error al configurar la petición
        console.error('[BlogAPI] Error de configuración:', error.message);
        return Promise.reject(error);
      }
    }
  );
});

// ============================================
// API DE POSTS PÚBLICOS
// ============================================

/**
 * Obtiene lista paginada de posts públicos
 */
const getAllPosts = async (
  filters?: BlogFilters
): Promise<ApiResponse<PaginatedResponse<BlogPost>>> => {
  const response = await publicBlogApiClient.get('/posts', { params: filters });
  return response.data;
};

/**
 * Obtiene un post por su slug
 */
const getPostBySlug = async (slug: string): Promise<ApiResponse<BlogPost>> => {
  const response = await publicBlogApiClient.get(`/posts/${slug}`);
  return response.data;
};

/**
 * Obtiene posts destacados
 */
const getFeaturedPosts = async (): Promise<ApiResponse<BlogPost[]>> => {
  const response = await publicBlogApiClient.get('/posts/featured');
  return response.data;
};

/**
 * Obtiene posts populares
 */
const getPopularPosts = async (limit: number = 5): Promise<ApiResponse<BlogPost[]>> => {
  const response = await publicBlogApiClient.get('/posts/popular', {
    params: { limit }
  });
  return response.data;
};

/**
 * Obtiene posts configurados para mostrar en header menu
 */
const getHeaderMenuPosts = async (): Promise<ApiResponse<BlogPost[]>> => {
  const response = await publicBlogApiClient.get('/posts/header-menu');
  return response.data;
};

/**
 * Busca posts por término
 */
const searchPosts = async (
  query: string,
  filters?: Partial<BlogFilters>
): Promise<ApiResponse<PaginatedResponse<BlogPost>>> => {
  const response = await publicBlogApiClient.get('/posts/search', {
    params: { q: query, ...filters }
  });
  return response.data;
};

// ============================================
// API DE POSTS ADMINISTRATIVOS
// ============================================

/**
 * Obtiene todos los posts (incluye borradores) - Admin
 */
const getAllAdminPosts = async (
  filters?: BlogFilters
): Promise<ApiResponse<PaginatedResponse<BlogPost>>> => {
  const response = await blogApiClient.get('/admin/posts', { params: filters });
  return response.data;
};

/**
 * Obtiene un post por ID (incluye borradores) - Admin
 */
const getPostById = async (id: string): Promise<ApiResponse<BlogPost>> => {
  const response = await blogApiClient.get(`/admin/posts/${id}`);
  return response.data;
};

/**
 * Crea un nuevo post - Admin
 */
const createPost = async (
  data: CreatePostDto
): Promise<ApiResponse<BlogPost>> => {
  const response = await blogApiClient.post('/posts', data);
  return response.data;
};

/**
 * Actualiza un post existente - Admin
 */
const updatePost = async (
  id: string,
  data: UpdatePostDto
): Promise<ApiResponse<BlogPost>> => {
  const response = await blogApiClient.put(`/posts/${id}`, data);
  return response.data;
};

/**
 * Elimina un post - Admin
 */
const deletePost = async (id: string): Promise<ApiResponse<void>> => {
  const response = await blogApiClient.delete(`/posts/${id}`);
  return response.data;
};

/**
 * Publica un post - Admin
 */
const publishPost = async (id: string): Promise<ApiResponse<BlogPost>> => {
  const response = await blogApiClient.patch(`/posts/${id}/publish`);
  return response.data;
};

/**
 * Despublica un post - Admin
 */
const unpublishPost = async (id: string): Promise<ApiResponse<BlogPost>> => {
  const response = await blogApiClient.patch(`/posts/${id}/unpublish`);
  return response.data;
};

/**
 * Duplica un post - Admin
 */
const duplicatePost = async (id: string): Promise<ApiResponse<BlogPost>> => {
  const response = await blogApiClient.post(`/posts/${id}/duplicate`);
  return response.data;
};

// ============================================
// INTERACCIONES DE USUARIO
// ============================================

/**
 * Marca/desmarca like en un post
 */
const toggleLike = async (postId: string): Promise<ApiResponse<void>> => {
  const response = await blogApiClient.post(`/posts/${postId}/like`);
  return response.data;
};

/**
 * Marca/desmarca bookmark en un post
 */
const toggleBookmark = async (postId: string): Promise<ApiResponse<void>> => {
  const response = await blogApiClient.post(`/posts/${postId}/bookmark`);
  return response.data;
};

// ============================================
// EXPORTACIÓN
// ============================================

export const blogPostApi = {
  // Públicos
  getAllPosts,
  getPostBySlug,
  getFeaturedPosts,
  getHeaderMenuPosts,
  getPopularPosts,
  searchPosts,
  
  // Admin
  admin: {
    getAllPosts: getAllAdminPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    publishPost,
    unpublishPost,
    duplicatePost,
  },
  
  // Interacciones
  toggleLike,
  toggleBookmark,
};

export default blogPostApi;
