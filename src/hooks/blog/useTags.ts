/**
 * 🏷️ Hook para Tags del Blog
 * Maneja la obtención y gestión de tags
 */

import { useState, useEffect, useCallback } from 'react';
import { blogTagApi } from '../../services/blog';
import type { BlogTag, BlogPost, PaginationInfo } from '../../types/blog';

interface UseTagsReturn {
  tags: BlogTag[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para obtener todos los tags
 */
export function useTags(): UseTagsReturn {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await blogTagApi.getAllTags();
      
      if (response.success && response.data) {
        // Ordenar por popularidad (postCount) y luego por nombre
        const sorted = response.data.sort((a, b) => {
          if ((b.postCount || 0) !== (a.postCount || 0)) {
            return (b.postCount || 0) - (a.postCount || 0);
          }
          return a.name.localeCompare(b.name);
        });
        setTags(sorted);
      }
    } catch (err: any) {
      console.error('[useTags] Error:', err);
      setError(err.message || 'Error al cargar tags');
      setTags([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    loading,
    error,
    refetch: fetchTags,
  };
}

/**
 * Hook para obtener tags populares
 */
export function usePopularTags(limit: number = 10) {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await blogTagApi.getPopularTags(limit);
      
      if (response.success && response.data) {
        setTags(response.data);
      }
    } catch (err: any) {
      console.error('[usePopularTags] Error:', err);
      setError(err.message || 'Error al cargar tags populares');
      setTags([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    loading,
    error,
    refetch: fetchTags,
  };
}

/**
 * Hook para obtener un tag específico con sus posts
 */
export function useTag(slug: string | undefined) {
  const [tag, setTag] = useState<BlogTag | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchTag = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await blogTagApi.getTagBySlug(slug);
        
        if (response.success && response.data) {
          setTag(response.data);
        }
      } catch (err: any) {
        console.error('[useTag] Error:', err);
        setError(err.message || 'Error al cargar tag');
        setTag(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTag();
  }, [slug]);

  return { tag, loading, error };
}

/**
 * Hook para obtener posts de un tag
 */
export function useTagPosts(
  slug: string | undefined,
  page: number = 1,
  limit: number = 10
) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await blogTagApi.getTagPosts(slug, page, limit);
        
        if (response.data) {
          setPosts(response.data);
          setPagination(response.pagination || null);
        }
      } catch (err: any) {
        console.error('[useTagPosts] Error:', err);
        setError(err.message || 'Error al cargar posts del tag');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [slug, page, limit]);

  return { posts, pagination, loading, error };
}

export default useTags;
