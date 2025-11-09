/**
 * 🎯 useServicesAgentOptimized Hook
 * 
 * Optimizaciones para reducir queries excesivas:
 * - Debouncing automático (500ms)
 * - Memoización de resultados
 * - Limitación de requests concurrentes
 * - Cancelación de requests pendientes
 */

import { useCallback, useRef, useState } from 'react';
import { servicesAgentService } from '../services/servicesAgentService';

interface UseServicesAgentOptions {
  debounceMs?: number;
  maxConcurrent?: number;
  cacheResults?: boolean;
}

interface ContentGenerationParams {
  serviceId: string;
  contentType: 'full_description' | 'short_description' | 'features' | 'benefits' | 'faq';
  style?: 'formal' | 'casual' | 'technical';
}

export const useServicesAgentOptimized = (
  options: UseServicesAgentOptions = {}
) => {
  const {
    debounceMs = 500,
    maxConcurrent = 1,
    cacheResults = true
  } = options;

  // Estado
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs para control
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const pendingRequestsRef = useRef<number>(0);
  const resultsCache = useRef<Map<string, any>>(new Map());

  /**
   * Generar contenido con debounce
   */
  const generateContent = useCallback(
    async (params: ContentGenerationParams) => {
      return new Promise((resolve, reject) => {
        // Cancelar request anterior si existe
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
          console.log(`⏭️ [useServicesAgent] Cancelado request anterior`);
        }

        // Crear key para caché
        const cacheKey = `${params.serviceId}-${params.contentType}-${params.style || 'formal'}`;

        // Verificar cache
        if (cacheResults && resultsCache.current.has(cacheKey)) {
          console.log(`💾 [useServicesAgent] ✅ Resultado en cache: ${cacheKey}`);
          resolve(resultsCache.current.get(cacheKey));
          return;
        }

        // Debounce la ejecución
        debounceTimerRef.current = setTimeout(async () => {
          // Verificar límite de requests concurrentes
          if (pendingRequestsRef.current >= maxConcurrent) {
            console.log(`⏸️ [useServicesAgent] En espera (${pendingRequestsRef.current}/${maxConcurrent} activos)`);
            
            // Esperar a que termine uno
            const checkInterval = setInterval(async () => {
              if (pendingRequestsRef.current < maxConcurrent) {
                clearInterval(checkInterval);
                // Reintentar
                const result = await generateContent(params);
                resolve(result);
              }
            }, 100);
            return;
          }

          // Ejecutar request
          pendingRequestsRef.current++;
          setIsLoading(true);
          setError(null);

          try {
            console.log(`🚀 [useServicesAgent] Generando ${params.contentType}...`);
            
            const response = await servicesAgentService.generateContent(
              params.serviceId,
              params.contentType,
              params.style
            );

            // Guardar en cache
            if (cacheResults) {
              resultsCache.current.set(cacheKey, response);
              console.log(`💾 [useServicesAgent] Resultado cacheado`);
            }

            console.log(`✅ [useServicesAgent] Éxito - ${params.contentType}`);
            resolve(response);
          } catch (err: any) {
            const errorMsg = err.message || 'Error generating content';
            console.error(`❌ [useServicesAgent] Error:`, errorMsg);
            setError(errorMsg);
            reject(err);
          } finally {
            pendingRequestsRef.current--;
            setIsLoading(pendingRequestsRef.current > 0);
            debounceTimerRef.current = null;
          }
        }, debounceMs);
      });
    },
    [debounceMs, maxConcurrent, cacheResults]
  );

  /**
   * Analizar servicio con debounce
   */
  const analyzeService = useCallback(
    async (serviceId: string) => {
      return new Promise((resolve, reject) => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        const cacheKey = `analyze-${serviceId}`;

        if (cacheResults && resultsCache.current.has(cacheKey)) {
          console.log(`💾 [useServicesAgent] Análisis en cache`);
          resolve(resultsCache.current.get(cacheKey));
          return;
        }

        debounceTimerRef.current = setTimeout(async () => {
          pendingRequestsRef.current++;
          setIsLoading(true);
          setError(null);

          try {
            console.log(`📊 [useServicesAgent] Analizando servicio...`);
            
            const response = await servicesAgentService.analyzeService(serviceId, {});

            if (cacheResults) {
              resultsCache.current.set(cacheKey, response);
            }

            console.log(`✅ [useServicesAgent] Análisis completado`);
            resolve(response);
          } catch (err: any) {
            setError(err.message);
            reject(err);
          } finally {
            pendingRequestsRef.current--;
            setIsLoading(false);
          }
        }, debounceMs);
      });
    },
    [debounceMs, cacheResults]
  );

  /**
   * Limpiar cache
   */
  const clearCache = useCallback(() => {
    resultsCache.current.clear();
    console.log(`🧹 [useServicesAgent] Cache limpiado`);
  }, []);

  /**
   * Cancelar requests pendientes
   */
  const cancel = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    console.log(`⏹️ [useServicesAgent] Operación cancelada`);
  }, []);

  /**
   * Debug info
   */
  const debug = useCallback(() => {
    console.group('🎯 [useServicesAgent] Debug Info');
    console.log('Cargando:', isLoading);
    console.log('Error:', error);
    console.log('Requests activos:', pendingRequestsRef.current);
    console.log('Cache entries:', resultsCache.current.size);
    console.log('Configuración:', { debounceMs, maxConcurrent, cacheResults });
    console.groupEnd();
  }, [isLoading, error, debounceMs, maxConcurrent, cacheResults]);

  return {
    generateContent,
    analyzeService,
    clearCache,
    cancel,
    debug,
    isLoading,
    error,
    cacheSize: resultsCache.current.size,
    pendingRequests: pendingRequestsRef.current
  };
};

export default useServicesAgentOptimized;
