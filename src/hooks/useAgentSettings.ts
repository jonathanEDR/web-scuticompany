/**
 * 🎛️ useAgentSettings Hook
 * Hook para obtener y gestionar configuraciones de agentes en tiempo real
 */

import { useState, useEffect, useCallback } from 'react';
import { agentConfigService, type AgentConfigData } from '../services/agentConfigService';

interface AgentSettings {
  config: AgentConfigData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAgentSettings = (agentName: string): AgentSettings => {
  const [config, setConfig] = useState<AgentConfigData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await agentConfigService.getConfig(agentName);
      
      if (response.success && response.data) {
        setConfig(response.data);
      } else {
        console.warn(`⚠️ [useAgentSettings] No config found for ${agentName}`);
        setError(response.error || 'No se encontró configuración');
        setConfig(null);
      }
    } catch (err: any) {
      console.error(`❌ [useAgentSettings] Error loading config for ${agentName}:`, err);
      setError(err.message || 'Error al cargar configuración');
      setConfig(null);
    } finally {
      setLoading(false);
    }
  }, [agentName]);

  // Cargar configuración al montar o cambiar agentName
  useEffect(() => {
    if (agentName) {
      fetchConfig();
    }
  }, [fetchConfig, agentName]);

  return {
    config,
    loading,
    error,
    refetch: fetchConfig
  };
};

// Hook específico para obtener solo las configuraciones de sugerencias
export const useAutoSuggestionSettings = (agentName: string = 'blog') => {
  const { config, loading, error, refetch } = useAgentSettings(agentName);

  // Extraer configuraciones específicas de sugerencias
  const suggestionSettings = config ? {
    enabled: config.enabled && config.config.autoSuggestions,
    debounceMs: config.config.suggestionDebounceMs || 800,
    minLength: config.config.suggestionMinLength || 10,
    contextLength: config.config.suggestionContextLength || 200
  } : {
    enabled: false,
    debounceMs: 800,
    minLength: 10,
    contextLength: 200
  };

  return {
    settings: suggestionSettings,
    loading,
    error,
    refetch
  };
};

export default useAgentSettings;