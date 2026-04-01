/**
 * 🎣 Hook para obtener un Post Individual
 * Maneja la carga de un post específico por slug
 * ✅ Optimizado con cache para evitar recargas innecesarias
 * ✅ Ahora expone relatedPosts del backend para evitar llamadas extra
 * ✅ Compatible con pre-renderizado SEO (no muestra error durante build)
 */

import { useState, useEffect, useCallback } from 'react';
import { blogPostApi } from '../../services/blog';
import blogCache from '../../utils/blogCache';
import type { BlogPost } from '../../types/blog';

/**
 * 🔍 Detecta si estamos en modo pre-renderizado (react-snap, Vercel build, etc.)
 * Esto evita mostrar "Artículo no encontrado" durante el build cuando la API no responde
 */
const isPrerendering = (): boolean => {
  if (typeof window === 'undefined') return true;
  if (typeof navigator === 'undefined') return true;
  
  // Detectar react-snap
  if (navigator.userAgent?.includes('ReactSnap')) return true;
  
  // Detectar Puppeteer/Headless Chrome (usado por react-snap y Vercel)
  if (navigator.userAgent?.includes('HeadlessChrome')) return true;
  
  // Detectar crawlers de build
  if (navigator.userAgent?.includes('Prerender')) return true;
  if (navigator.userAgent?.includes('Vercel-Build')) return true;
  
  // Variable de entorno para modo de build
  if ((window as any).__PRERENDER_INJECTED !== undefined) return true;
  
  return false;
};

/**
 * 🔍 Obtener datos de post pre-renderizados inyectados por middleware o prerender-blog.js
 * Esto evita que React haga una llamada API innecesaria cuando los datos ya están en el HTML
 */
const getPrerenderedPostData = (slug: string): { post: BlogPost; relatedPosts: BlogPost[] } | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const prerendered = (window as any).__PRERENDERED_BLOG_POST__;
    if (prerendered && prerendered.slug === slug) {
      return {
        post: prerendered as BlogPost,
        relatedPosts: (window as any).__PRERENDERED_RELATED_POSTS__ || []
      };
    }
  } catch {
    // Silenciar errores de parsing
  }
  
  return null;
};

interface UseBlogPostReturn {
  post: BlogPost | null;
  relatedPosts: BlogPost[];  // ✅ Ahora se exponen los posts relacionados
  loading: boolean;
  error: string | null;
  isPrerendering: boolean; // ✅ Nuevo: indica si estamos en modo pre-renderizado
  refetch: () => Promise<void>;
  updateLocalPost: (updatedPost: BlogPost) => void;
}

/**
 * Hook para obtener un post por su slug
 * ✅ Devuelve también relatedPosts del backend (evita llamadas API extra)
 * ✅ Maneja correctamente el pre-renderizado SEO
 * ✅ Optimizado: loading inteligente basado en caché existente
 */
export function useBlogPost(slug: string | undefined): UseBlogPostReturn {
  // ✅ Inicialización inteligente: verificar datos pre-renderizados y luego caché
  const prerenderedData = slug ? getPrerenderedPostData(slug) : null;
  const initialCached = slug ? (prerenderedData || blogCache.get<{ post: BlogPost; relatedPosts: BlogPost[] }>('POST_DETAIL', slug)) : null;
  
  const [post, setPost] = useState<BlogPost | null>(initialCached?.post || null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>(initialCached?.relatedPosts || []);
  const [loading, setLoading] = useState(!initialCached && !!slug); // ✅ No loading si hay caché o datos pre-renderizados
  const [error, setError] = useState<string | null>(null);
  const prerenderMode = isPrerendering();

  const fetchPost = useCallback(async () => {
    if (!slug) {
      setPost(null);
      setRelatedPosts([]);
      setLoading(false);
      return;
    }

    // 🔍 En modo pre-renderizado, solo marcar como no-loading sin error
    // El contenido estático ya fue generado por prerender-blog.js
    if (prerenderMode) {
      console.log('[useBlogPost] Modo pre-renderizado detectado, omitiendo fetch API');
      setLoading(false);
      // No setear error - dejar que el HTML estático pre-renderizado sea visible
      return;
    }

    // ✅ Si ya tenemos datos pre-renderizados, usarlos directamente sin llamar a la API
    const prerendered = getPrerenderedPostData(slug);
    if (prerendered) {
      console.log('[useBlogPost] Usando datos pre-renderizados del HTML');
      setPost(prerendered.post);
      setRelatedPosts(prerendered.relatedPosts);
      setLoading(false);
      // Guardar en caché para navegación subsecuente
      blogCache.set('POST_DETAIL', slug, prerendered);
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
      // ✅ No mostrar error si estamos en pre-renderizado (el contenido estático existe)
      if (!prerenderMode) {
        setError(err.message || 'Error al cargar el post');
        setPost(null);
        setRelatedPosts([]);
      }
    } finally {
      setLoading(false);
    }
  }, [slug, prerenderMode]);

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
    isPrerendering: prerenderMode,
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
