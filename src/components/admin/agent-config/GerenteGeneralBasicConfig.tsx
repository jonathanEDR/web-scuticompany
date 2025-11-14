/**
 * Panel de Configuración Básica para GerenteGeneral
 * Gestiona parámetros fundamentales del coordinador
 */

import React from 'react';
import { Save, RotateCcw, AlertCircle } from 'lucide-react';
import type { GerenteGeneralConfigData } from '../../../services/gerenteGeneralService';

interface GerenteGeneralBasicConfigProps {
  config: GerenteGeneralConfigData | null;
  onConfigChange: (section: string, key: string, value: any) => void;
  onSave: () => Promise<void>;
  onReset: () => Promise<void>;
  isSaving: boolean;
  isLoading: boolean;
}

export const GerenteGeneralBasicConfig: React.FC<GerenteGeneralBasicConfigProps> = ({
  config,
  onConfigChange,
  onSave,
  onReset,
  isSaving,
  isLoading
}) => {
  if (!config) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No hay configuración disponible para el Gerente General
          </p>
        </div>
      </div>
    );
  }

  // Verificar que config.config existe
  if (!config.config) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-yellow-400 mb-4" />
          <p className="text-yellow-600 dark:text-yellow-400">
            Configuración del Gerente General incompleta
          </p>
          <p className="text-sm text-gray-500 mt-2">
            La estructura de configuración no tiene las propiedades requeridas
          </p>
        </div>
      </div>
    );
  }

  // Valores seguros con fallbacks
  const safeConfig = {
    timeout: config.config.timeout ?? 30,
    maxTokens: config.config.maxTokens ?? 1500,
    temperature: config.config.temperature ?? 0.6
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600 dark:text-gray-400">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Sección: Parámetros Básicos de OpenAI */}
      <div className="p-6 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Parámetros Básicos de OpenAI
        </h3>

        {/* Timeout */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Timeout Global (segundos)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="10"
              max="300"
              step="5"
              value={safeConfig.timeout}
              onChange={(e) => onConfigChange('config', 'timeout', parseInt(e.target.value))}
              disabled={!config.enabled || isSaving}
              className="flex-1 h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
            />
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 w-20 text-right">
              {safeConfig.timeout}s
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Tiempo máximo de espera para operaciones del coordinador
          </p>
        </div>

        {/* Max Tokens */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Tokens Máximos
          </label>
          <input
            type="number"
            min="500"
            max="4000"
            step="100"
            value={safeConfig.maxTokens}
            onChange={(e) => onConfigChange('config', 'maxTokens', parseInt(e.target.value))}
            disabled={!config.enabled || isSaving}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Límite de tokens para respuestas del modelo (500-4000)
          </p>
        </div>

        {/* Temperature */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Temperatura (Creatividad vs Precisión)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value=              {safeConfig.temperature}
              onChange={(e) => onConfigChange('config', 'temperature', parseFloat(e.target.value))}
              disabled={!config.enabled || isSaving}
              className="flex-1 h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
            />
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 w-12 text-right">
              {config.config.temperature.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>Preciso (0.0)</span>
            <span>Creativo (1.0)</span>
          </div>
        </div>
      </div>

      {/* SECCIÓN TEMPORALMENTE DESHABILITADA: Orquestación Multi-Agente
          Razón: orchestrationConfig no está implementado en backend
          TODO: Agregar orchestrationConfig al método getConfigurationSummary() del backend
      */}

      {/* Sección: Contexto Centralizado */}
      <div className="p-6 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Gestión de Contexto Centralizado
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              TTL de Sesión (ms)
            </label>
            <input
              type="number"
              min="300000"
              max="86400000"
              step="60000"
              value={config.contextConfig.sessionTTL}
              onChange={(e) =>
                onConfigChange('contextConfig', 'sessionTTL', parseInt(e.target.value))
              }
              disabled={!config.enabled || isSaving}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {Math.round(config.contextConfig.sessionTTL / 60000)} minutos
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Máximo de Sesiones Activas
            </label>
            <input
              type="number"
              min="10"
              max="1000"
              value={config.contextConfig.maxSessions}
              onChange={(e) =>
                onConfigChange('contextConfig', 'maxSessions', parseInt(e.target.value))
              }
              disabled={!config.enabled || isSaving}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg disabled:opacity-50"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Compartición de Contexto Entre Agentes
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.contextConfig.enableContextSharing}
                onChange={(e) =>
                  onConfigChange('contextConfig', 'enableContextSharing', e.target.checked)
                }
                disabled={!config.enabled || isSaving}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enriquecimiento Automático de Contexto
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.contextConfig.enableContextEnrichment}
                onChange={(e) =>
                  onConfigChange('contextConfig', 'enableContextEnrichment', e.target.checked)
                }
                disabled={!config.enabled || isSaving}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tamaño de Memoria de Contexto
          </label>
          <input
            type="number"
            min="10"
            max="500"
            value={config.contextConfig.contextMemorySize}
            onChange={(e) =>
              onConfigChange('contextConfig', 'contextMemorySize', parseInt(e.target.value))
            }
            disabled={!config.enabled || isSaving}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg disabled:opacity-50"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Número máximo de contextos a almacenar en memoria
          </p>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onSave}
          disabled={isSaving || isLoading || !config.enabled}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <Save size={18} />
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </button>

        <button
          onClick={onReset}
          disabled={isSaving || isLoading}
          className="flex items-center gap-2 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <RotateCcw size={18} />
          Restaurar Valores Por Defecto
        </button>
      </div>
    </div>
  );
};

export default GerenteGeneralBasicConfig;
