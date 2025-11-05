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
  timeout: 15000,
});

// Cliente para peticiones públicas (sin autenticación)
const publicBlogApiClient = axios.create({
  baseURL: `${getApiUrl()}/blog`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ============================================
// INTERCEPTORES
// ============================================

// Configurar interceptor de autenticación solo para cliente autenticado
setupAuthInterceptor(blogApiClient);

// Interceptor para manejo de respuestas y errores
blogApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Error del servidor con respuesta
      const status = error.response.status;
      const data = error.response.data as any;

      if (status === 401) {
        console.error('[BlogAPI] No autorizado - Token inválido o expirado');
        // Opcional: Redirigir a login
      } else if (status === 403) {
        console.error('[BlogAPI] Acceso denegado - Permisos insuficientes');
      } else if (status === 404) {
        console.error('[BlogAPI] Recurso no encontrado');
      } else if (status === 429) {
        console.error('[BlogAPI] Demasiadas peticiones - Rate limit excedido');
      }

      return Promise.reject(new Error(data?.message || 'Error en la petición'));
    } else if (error.request) {
      // Petición enviada pero sin respuesta
      console.error('[BlogAPI] Sin respuesta del servidor');
      return Promise.reject(new Error('No se pudo conectar con el servidor'));
    } else {
      // Error al configurar la petición
      console.error('[BlogAPI] Error:', error.message);
      return Promise.reject(error);
    }
  }
);

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
  console.log('🔍 [BlogAPI] Toggle like iniciado para postId:', postId);
  const response = await blogApiClient.post(`/posts/${postId}/like`);
  console.log('✅ [BlogAPI] Toggle like respuesta:', response.data);
  return response.data;
};

/**
 * Marca/desmarca bookmark en un post
 */
const toggleBookmark = async (postId: string): Promise<ApiResponse<void>> => {
  console.log('🔍 [BlogAPI] Toggle bookmark iniciado para postId:', postId);
  const response = await blogApiClient.post(`/posts/${postId}/bookmark`);
  console.log('✅ [BlogAPI] Toggle bookmark respuesta:', response.data);
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
