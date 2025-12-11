/**
 * 🎣 Hook para obtener un Post Individual
 * Maneja la carga de un post específico por slug
 * ✅ Optimizado con cache para evitar recargas innecesarias
 * ✅ Ahora expone relatedPosts del backend para evitar llamadas extra
 */

import { useState, useEffect, useCallback } from 'react';
import { blogPostApi } from '../../services/blog';
import blogCache from '../../utils/blogCache';
import type { BlogPost } from '../../types/blog';

interface UseBlogPostReturn {
  post: BlogPost | null;
  relatedPosts: BlogPost[];  // ✅ Ahora se exponen los posts relacionados
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateLocalPost: (updatedPost: BlogPost) => void;
}

/**
 * Hook para obtener un post por su slug
 * ✅ Devuelve también relatedPosts del backend (evita llamadas API extra)
 */
export function useBlogPost(slug: string | undefined): UseBlogPostReturn {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    if (!slug) {
      setPost(null);
      setRelatedPosts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // ✅ Intentar obtener del cache primero
      const cached = blogCache.get<{ post: BlogPost; relatedPosts: BlogPost[] }>('POST_DETAIL', slug);
      
      if (cached) {
        setPost(cached.post);
        setRelatedPosts(cached.relatedPosts || []);
        setLoading(false);
        return;
      }
      
      // Si no está en cache, hacer petición al servidor
      const response = await blogPostApi.getPostBySlug(slug);
      
      if (response.success && response.data) {
        // El backend devuelve { success: true, data: { post, relatedPosts } }
        const responseData = response.data as any;
        setPost(responseData.post);
        setRelatedPosts(responseData.relatedPosts || []);
        
        // ✅ Guardar en cache
        blogCache.set('POST_DETAIL', slug, responseData);
      } else {
        throw new Error('Post no encontrado');
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar el post');
      setPost(null);
      setRelatedPosts([]);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  // Función para actualizar el post localmente sin hacer otra petición
  const updateLocalPost = useCallback((updatedPost: BlogPost) => {
    setPost(updatedPost);
  }, []);

  return {
    post,
    relatedPosts,
    loading,
    error,
    refetch: fetchPost,
    updateLocalPost,
  };
}

/**
 * Hook para acciones de interacción con el post
 */
export function usePostInteractions(postId: string) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar estado inicial desde localStorage
  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem('blog_liked_posts') || '[]');
    const bookmarkedPosts = JSON.parse(localStorage.getItem('blog_bookmarked_posts') || '[]');
    
    setLiked(likedPosts.includes(postId));
    setBookmarked(bookmarkedPosts.includes(postId));
  }, [postId]);

  const toggleLike = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 [FRONTEND] Intentando toggle like, postId:', postId);
      const response = await blogPostApi.toggleLike(postId);
      console.log('✅ [FRONTEND] Respuesta toggle like:', response);
      
      // Actualizar estado local
      const likedPosts = JSON.parse(localStorage.getItem('blog_liked_posts') || '[]');
      
      if (liked) {
        // Remover like
        const updated = likedPosts.filter((id: string) => id !== postId);
        localStorage.setItem('blog_liked_posts', JSON.stringify(updated));
        setLiked(false);
      } else {
        // Agregar like
        likedPosts.push(postId);
        localStorage.setItem('blog_liked_posts', JSON.stringify(likedPosts));
        setLiked(true);
      }
    } catch (err: any) {
      setError(err.message || 'Error al dar like');
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 [FRONTEND] Intentando toggle bookmark, postId:', postId);
      const response = await blogPostApi.toggleBookmark(postId);
      console.log('✅ [FRONTEND] Respuesta toggle bookmark:', response);
      
      // Actualizar estado local
      const bookmarkedPosts = JSON.parse(localStorage.getItem('blog_bookmarked_posts') || '[]');
      
      if (bookmarked) {
        // Remover bookmark
        const updated = bookmarkedPosts.filter((id: string) => id !== postId);
        localStorage.setItem('blog_bookmarked_posts', JSON.stringify(updated));
        setBookmarked(false);
      } else {
        // Agregar bookmark
        bookmarkedPosts.push(postId);
        localStorage.setItem('blog_bookmarked_posts', JSON.stringify(bookmarkedPosts));
        setBookmarked(true);
      }
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return {
    liked,
    bookmarked,
    loading,
    error,
    toggleLike,
    toggleBookmark,
  };
}

export default useBlogPost;
