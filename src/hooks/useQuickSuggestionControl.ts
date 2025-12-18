/**
 * 🎛️ useQuickSuggestionControl Hook
 * Gestiona estado local + sincronización con configuración global
 * para control directo de sugerencias desde el editor
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAutoSuggestionSettings } from './useAgentSettings';

interface QuickSuggestionState {
  localEnabled: boolean | null; // null = usar configuración global
  globalEnabled: boolean;
  isOverridden: boolean; // true si hay override local
  isLoading: boolean;
  lastSync: number | null;
}

interface EffectiveState {
  enabled: boolean;
  source: 'global' | 'local';
  canToggle: boolean;
}

const LOCAL_STORAGE_KEY = 'webscuti_quick_suggestions';
const SYNC_INTERVAL = 60000; // 60 segundos
const OVERRIDE_TIMEOUT = 300000; // 5 minutos para override temporal

export const useQuickSuggestionControl = () => {
  // Estado del hook de configuración global
  const { settings: globalSettings, loading: globalLoading, refetch } = useAutoSuggestionSettings('blog');

  // Estado local del componente
  // ✅ Por defecto DESACTIVADO (localEnabled: false) para evitar llamadas innecesarias
  const [localState, setLocalState] = useState<QuickSuggestionState>({
    localEnabled: false, // ✅ Desactivado por defecto al abrir el editor
    globalEnabled: false,
    isOverridden: true, // ✅ Override activo desde el inicio
    isLoading: true,
    lastSync: null
  });

  // Cargar estado desde localStorage al inicializar (solo si el usuario lo activó manualmente)
  useEffect(() => {
    const loadLocalState = () => {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          
          // Verificar si el override ha expirado
          const now = Date.now();
          const hasExpired = parsed.timestamp && (now - parsed.timestamp > OVERRIDE_TIMEOUT);
          
          if (hasExpired) {
            // Override expirado, volver a desactivado por defecto
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            return { localEnabled: false, isOverridden: true };
          }
          
          return {
            localEnabled: parsed.localEnabled,
            isOverridden: true
          };
        }
      } catch (error) {
        console.error('Error loading local suggestion state:', error);
      }
      
      // ✅ Por defecto desactivado
      return { localEnabled: false, isOverridden: true };
    };

    const { localEnabled, isOverridden } = loadLocalState();
    
    setLocalState(prev => ({
      ...prev,
      localEnabled,
      isOverridden,
      isLoading: globalLoading
    }));
  }, []);

  // Sincronizar con estado global cuando cambie
  useEffect(() => {
    if (!globalLoading && globalSettings) {
      setLocalState(prev => ({
        ...prev,
        globalEnabled: globalSettings.enabled ?? false,
        isLoading: false,
        lastSync: Date.now()
      }));
    }
  }, [globalSettings, globalLoading]);

  // Auto-sync periódico con configuración global
  useEffect(() => {
    if (localState.isOverridden) {
      const interval = setInterval(() => {
        refetch(); // Recargar configuración global
      }, SYNC_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [localState.isOverridden, refetch]);

  // Guardar estado local en localStorage
  const saveLocalState = useCallback((newLocalEnabled: boolean | null) => {
    try {
      if (newLocalEnabled === null) {
        // Remover override
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } else {
        // Guardar override con timestamp
        const stateToSave = {
          localEnabled: newLocalEnabled,
          timestamp: Date.now()
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
      }
    } catch (error) {
      console.error('Error saving local suggestion state:', error);
    }
  }, []);

  // Toggle estado local (override temporal)
  const toggleLocal = useCallback(() => {
    setLocalState(prev => {
      // Calcular estado efectivo actual
      const currentEnabled = prev.localEnabled !== null ? prev.localEnabled : prev.globalEnabled;
      const newLocalEnabled = !currentEnabled;
      
      // Guardar inmediatamente en localStorage
      try {
        const stateToSave = {
          localEnabled: newLocalEnabled,
          timestamp: Date.now()
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (error) {
        console.error('Error saving local suggestion state:', error);
      }
      
      return {
        ...prev,
        localEnabled: newLocalEnabled,
        isOverridden: true
      };
    });
  }, []);

  // Sincronizar con configuración global (remover override)
  const syncWithGlobal = useCallback(() => {
    setLocalState(prev => ({
      ...prev,
      localEnabled: null,
      isOverridden: false
    }));
    
    saveLocalState(null);
    
    // Refetch para asegurar sincronización
    refetch();
  }, [saveLocalState, refetch]);

  // Obtener estado efectivo (combinando local + global) - REACTIVO
  // ✅ Siempre usa el estado local ya que por defecto está desactivado
  const getEffectiveState = useCallback((): EffectiveState => {
    // Siempre usamos el estado local (que por defecto es false)
    return {
      enabled: localState.localEnabled ?? false,
      source: 'local',
      canToggle: true
    };
  }, [localState]);

  // Estado efectivo calculado reactivamente
  const effectiveState = useMemo(() => getEffectiveState(), [getEffectiveState]);

  // Limpiar override expirado automáticamente
  useEffect(() => {
    if (localState.isOverridden) {
      const checkExpiration = () => {
        try {
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            const now = Date.now();
            const hasExpired = parsed.timestamp && (now - parsed.timestamp > OVERRIDE_TIMEOUT);
            
            if (hasExpired) {
              syncWithGlobal();
            }
          }
        } catch (error) {
          console.error('Error checking override expiration:', error);
        }
      };

      // Verificar expiración cada minuto
      const interval = setInterval(checkExpiration, 60000);
      return () => clearInterval(interval);
    }
  }, [localState.isOverridden, syncWithGlobal]);

  return {
    // Estados
    localEnabled: localState.localEnabled,
    globalEnabled: localState.globalEnabled,
    isOverridden: localState.isOverridden,
    isLoading: localState.isLoading,
    lastSync: localState.lastSync,
    
    // Estado efectivo
    getEffectiveState,
    
    // Acciones
    toggleLocal,
    syncWithGlobal,
    
    // Utilidades
    canToggle: effectiveState.canToggle,
    effectiveEnabled: effectiveState.enabled,
    source: effectiveState.source,
    
    // ✅ Exponer configuración global para evitar llamadas duplicadas
    globalSettings
  };
};

export default useQuickSuggestionControl;