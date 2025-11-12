/**
 * 🎯 useServiciosCache Hook
 * Hook personalizado para cache optimizado de servicios públicos
 * Previene race conditions y re-renders innecesarios
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import serviciosCache, { SERVICIOS_CACHE_TTL } from '../utils/serviciosCache';
import type { Servicio, ServicioFilters } from '../types/servicios';

interface UseServiciosCacheOptions {
  enabled?: boolean;
  onSuccess?: (data: any, fromCache?: boolean) => void;
  onError?: (error: Error) => void;
}

interface UseServiciosCacheReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
  isFromCache: boolean;
}

/**
 * Hook para cache de servicios con control de race conditions
 */
export function useServiciosCache<T>(
  cacheKey: keyof typeof SERVICIOS_CACHE_TTL,
  identifier: string | Record<string, any>,
  fetchFn: () => Promise<T>,
  options: UseServiciosCacheOptions = {}
): UseServiciosCacheReturn<T> {
  const { enabled = true, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  // Referencia para evitar race conditions
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const fetchIdRef = useRef(0);

  // Función para cargar datos (con cache o fetch)
  const loadData = useCallback(async (force = false) => {
    if (!enabled) return;

    // Cancelar request anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Incrementar ID de fetch para detectar requests obsoletos
    const currentFetchId = ++fetchIdRef.current;

    try {
      setLoading(true);
      setError(null);

      // 1. Intentar obtener del cache si no es forzado
      if (!force) {
        const cachedData = serviciosCache.get<T>(cacheKey, identifier);
        if (cachedData) {
          if (isMountedRef.current) {
            setData(cachedData);
            setIsFromCache(true);
            setLoading(false);
            onSuccess?.(cachedData, true); // Pasar true para indicar que es del cache
          }
          return;
        }
      }

      // 2. Crear nuevo AbortController para este request
      abortControllerRef.current = new AbortController();

      // 3. Hacer fetch si no hay cache válido
      const fetchedData = await fetchFn();

      // 4. Verificar si este request sigue siendo el más reciente
      if (currentFetchId !== fetchIdRef.current) {
        console.log('[useServiciosCache] Request obsoleto, ignorando resultado');
        return;
      }

      // 5. Verificar si el componente sigue montado
      if (!isMountedRef.current) {
        return;
      }

      // 6. Guardar en cache
      serviciosCache.set(cacheKey, identifier, fetchedData);

      // 7. Actualizar estado
      setData(fetchedData);
      setIsFromCache(false);
      onSuccess?.(fetchedData, false); // Pasar false para indicar que es de API

    } catch (err: any) {
      // Ignorar errores de requests cancelados
      if (err.name === 'AbortError' || err.name === 'CanceledError') {
        console.log('[useServiciosCache] Request cancelado');
        return;
      }

      // Verificar si este request sigue siendo el más reciente
      if (currentFetchId !== fetchIdRef.current) {
        return;
      }

      if (isMountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        onError?.(err instanceof Error ? err : new Error(errorMessage));
        console.error(`[useServiciosCache] Error loading data:`, err);
      }
    } finally {
      if (isMountedRef.current && currentFetchId === fetchIdRef.current) {
        setLoading(false);
      }
    }
  }, [cacheKey, identifier, fetchFn, enabled, onSuccess, onError]);

  // Función para refetch (fuerza nueva carga)
  const refetch = useCallback(async () => {
    // Limpiar cache específico
    serviciosCache.remove(cacheKey, identifier);
    await loadData(true);
  }, [cacheKey, identifier, loadData]);

  // Función para limpiar cache manualmente
  const clearCache = useCallback(() => {
    serviciosCache.remove(cacheKey, identifier);
    setData(null);
    setIsFromCache(false);
  }, [cacheKey, identifier]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
    isFromCache
  };
}

/**
 * Hook especializado para lista de servicios
 */
export function useServiciosList(
  filters: ServicioFilters = {},
  options: UseServiciosCacheOptions = {}
) {
  const fetchFn = useCallback(async () => {
    const { serviciosApi } = await import('../services/serviciosApi');
    const response = await serviciosApi.getAll(filters);
    return response.data || [];
  }, [filters]);

  return useServiciosCache<Servicio[]>(
    'SERVICIOS_LIST',
    filters,
    fetchFn,
    options
  );
}

/**
 * Hook especializado para detalle de servicio
 */
export function useServicioDetail(
  slug: string,
  options: UseServiciosCacheOptions = {}
) {
  const fetchFn = useCallback(async () => {
    const { serviciosApi } = await import('../services/serviciosApi');
    const response = await serviciosApi.getAll();
    
    const servicio = response.data.find(s => s.slug === slug || s._id === slug);
    
    if (!servicio) {
      throw new Error('Servicio no encontrado');
    }
    
    if (!servicio.activo || !servicio.visibleEnWeb) {
      throw new Error('Este servicio no está disponible actualmente');
    }
    
    return servicio;
  }, [slug]);

  return useServiciosCache<Servicio>(
    'SERVICIO_DETAIL',
    slug,
    fetchFn,
    options
  );
}

/**
 * Hook para servicios destacados
 */
export function useServiciosDestacados(options: UseServiciosCacheOptions = {}) {
  const fetchFn = useCallback(async () => {
    const { serviciosApi } = await import('../services/serviciosApi');
    const response = await serviciosApi.getAll({ destacado: true, visibleEnWeb: true, activo: true });
    return response.data || [];
  }, []);

  return useServiciosCache<Servicio[]>(
    'SERVICIOS_FEATURED',
    'destacados',
    fetchFn,
    options
  );
}

/**
 * Hook para servicios por categoría
 */
export function useServiciosByCategoria(
  categoria: string,
  options: UseServiciosCacheOptions = {}
) {
  const fetchFn = useCallback(async () => {
    const { serviciosApi } = await import('../services/serviciosApi');
    const response = await serviciosApi.getAll({ 
      categoria,
      visibleEnWeb: true, 
      activo: true 
    });
    return response.data || [];
  }, [categoria]);

  return useServiciosCache<Servicio[]>(
    'SERVICIOS_BY_CATEGORY',
    { categoria },
    fetchFn,
    options
  );
}

export default useServiciosCache;
