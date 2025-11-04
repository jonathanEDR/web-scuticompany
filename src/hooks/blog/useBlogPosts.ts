/**
 * 🎣 Hook para gestión de Posts del Blog
 * Maneja la obtención y estado de posts
 */

import { useState, useEffect, useCallback } from 'react';
import { blogPostApi } from '../../services/blog';
import type { BlogPost, BlogFilters, PaginationInfo } from '../../types/blog';

interface UseBlogPostsReturn {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
  refetch: () => Promise<void>;
  refresh: () => void;
}

/**
 * Hook para obtener lista de posts con filtros
 */
export function useBlogPosts(filters?: BlogFilters): UseBlogPostsReturn {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await blogPostApi.getAllPosts(filters);
      
      if (response.success && response.data) {
        setPosts(response.data.data);
        setPagination(response.data.pagination);
      } else {
        throw new Error('Error al cargar posts');
      }
    } catch (err: any) {
      console.error('❌ [useBlogPosts] Error:', err);
      setError(err.message || 'Error al cargar los posts');
      setPosts([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const refresh = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    pagination,
    refetch: fetchPosts,
    refresh,
  };
}

/**
 * Hook para obtener posts destacados
 */
export function useFeaturedPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await blogPostApi.getFeaturedPosts();
        
        if (response.success && response.data) {
          setPosts(response.data);
        }
      } catch (err: any) {
        console.error('[useFeaturedPosts] Error:', err);
        setError(err.message || 'Error al cargar posts destacados');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { posts, loading, error };
}

/**
 * Hook para obtener posts populares
 */
export function usePopularPosts(limit: number = 5) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await blogPostApi.getPopularPosts(limit);
        
        if (response.success && response.data) {
          setPosts(response.data);
        }
      } catch (err: any) {
        console.error('[usePopularPosts] Error:', err);
        setError(err.message || 'Error al cargar posts populares');
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, [limit]);

  return { posts, loading, error };
}

/**
 * Hook para búsqueda de posts
 */
export function useSearchPosts(query: string, filters?: Partial<BlogFilters>) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const search = useCallback(async () => {
    if (!query || query.trim().length < 2) {
      setPosts([]);
      setPagination(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await blogPostApi.searchPosts(query, filters);
      
      if (response.success && response.data) {
        setPosts(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      console.error('[useSearchPosts] Error:', err);
      setError(err.message || 'Error en la búsqueda');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [query, JSON.stringify(filters)]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      search();
    }, 500); // Debounce de 500ms

    return () => clearTimeout(debounceTimer);
  }, [search]);

  return { posts, loading, error, pagination, search };
}

export default useBlogPosts;
