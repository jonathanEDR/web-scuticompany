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
  const isLoadingRef = useRef(false); // ⚡ Prevenir múltiples requests simultáneos
  const retryCountRef = useRef(0); // ⚡ Contador de reintentos
  const maxRetriesRef = useRef(2); // ⚡ Máximo de 2 reintentos
  const lastErrorTimeRef = useRef(0); // ⚡ Timestamp del último error

  // Función para cargar datos (con cache o fetch)
  const loadData = useCallback(async (force = false) => {
    if (!enabled) return;
    
    // ⚡ Si ya hay una carga pendiente y no es forzada, saltarse
    if (isLoadingRef.current && !force) {
      return;
    }

    // ⚡ NUEVO: Evitar reintentos infinitos
    const now = Date.now();
    if (retryCountRef.current > maxRetriesRef.current && (now - lastErrorTimeRef.current) < 5000) {
      console.warn('[useServiciosCache] ⚠️ Máximo número de reintentos alcanzado, esperando...');
      return;
    }

    // Cancelar request anterior si existe
    if (abortControllerRef.current) {
      try {
        abortControllerRef.current.abort();
      } catch (e) {
        // Silenciar errores
      }
    }

    // Incrementar ID de fetch para detectar requests obsoletos
    const currentFetchId = ++fetchIdRef.current;

    try {
      setLoading(true);
      isLoadingRef.current = true;
      setError(null);

      // 1. Intentar obtener del cache si no es forzado
      if (!force) {
        const cachedData = serviciosCache.get<T>(cacheKey, identifier);
        if (cachedData) {
          if (isMountedRef.current) {
            setData(cachedData);
            setIsFromCache(true);
            setLoading(false);
            isLoadingRef.current = false;
            retryCountRef.current = 0; // ⚡ Resetear contador
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
      retryCountRef.current = 0; // ⚡ Resetear contador en éxito
      onSuccess?.(fetchedData, false); // Pasar false para indicar que es de API

    } catch (err: any) {
      // Ignorar errores de requests cancelados
      if (err.name === 'AbortError' || err.name === 'CanceledError') {
        return;
      }

      // Verificar si este request sigue siendo el más reciente
      if (currentFetchId !== fetchIdRef.current) {
        return;
      }

      // ⚡ NUEVO: Incrementar contador de reintentos en error
      retryCountRef.current++;
      lastErrorTimeRef.current = Date.now();

      if (isMountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        console.error(`❌ [useServiciosCache] Error (intento ${retryCountRef.current}/${maxRetriesRef.current + 1}):`, errorMessage);
        onError?.(err instanceof Error ? err : new Error(errorMessage));
      }
    } finally {
      if (isMountedRef.current && currentFetchId === fetchIdRef.current) {
        setLoading(false);
        isLoadingRef.current = false; // ⚡ Resetear flag de carga
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
      
      // ⚡ Cancelar cualquier request en vuelo
      if (abortControllerRef.current) {
        try {
          abortControllerRef.current.abort();
        } catch (e) {
          // Silenciar errores de abort
        }
        abortControllerRef.current = null;
      }
      
      // ⚡ Limpiar referencias
      fetchIdRef.current = 0;
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
    
    try {
      const response = await serviciosApi.getAll(filters);
      
      // 🔍 Guardar timestamp de la última actualización para detectar cambios
      const lastUpdateKey = 'lastServiciosUpdate';
      const currentTime = Date.now();
      
      if (response.data && Array.isArray(response.data)) {
        // Verificar si hay servicios recién creados (últimos 2 minutos)
        const recentServices = response.data.filter((servicio: any) => {
          const createdAt = new Date(servicio.createdAt).getTime();
          const updatedAt = new Date(servicio.updatedAt).getTime();
          const recentThreshold = currentTime - (2 * 60 * 1000); // 2 minutos
          
          return createdAt > recentThreshold || updatedAt > recentThreshold;
        });
        
        if (recentServices.length > 0) {
          console.log(`� [FRONTEND] Detectados ${recentServices.length} servicios recientes, invalidando cache...`);
          const { invalidateServiciosCache } = await import('../utils/serviciosCache');
          invalidateServiciosCache('SERVICIOS_');
        }
        
        // Actualizar timestamp
        localStorage.setItem(lastUpdateKey, currentTime.toString());
      }
      
      // Retornar respuesta completa para acceder a datos de paginación
      return response;
    } catch (error) {
      console.error('❌ [FRONTEND] Error fetching servicios:', error);
      throw error;
    }
  }, [filters]);

  return useServiciosCache<any>(
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
    
    // Primero intentar obtener por slug específico si es posible
    try {
      // Intentar búsqueda eficiente - buscar solo en servicios activos/visibles
      const response = await serviciosApi.getAll({ 
        visibleEnWeb: true, 
        activo: true 
      });
      
      const servicio = response.data.find(s => s.slug === slug || s._id === slug);
      
      if (!servicio) {
        throw new Error('Servicio no encontrado');
      }
      
      if (!servicio.activo || !servicio.visibleEnWeb) {
        throw new Error('Este servicio no está disponible actualmente');
      }
      
      return servicio;
    } catch (error) {
      // Si falla, hacer fallback a búsqueda sin filtros
      const response = await serviciosApi.getAll();
      const servicio = response.data.find(s => s.slug === slug || s._id === slug);
      
      if (!servicio) {
        throw new Error('Servicio no encontrado');
      }
      
      if (!servicio.activo || !servicio.visibleEnWeb) {
        throw new Error('Este servicio no está disponible actualmente');
      }
      
      return servicio;
    }
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
