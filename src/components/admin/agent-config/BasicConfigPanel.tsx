/**
 * Configuración Básica del Agente
 * Parámetros fundamentales de operación
 */

import React from 'react';
import { Save, RotateCcw } from 'lucide-react';
import type { AgentConfigData } from '../../../services/agentConfigService';

interface BasicConfigPanelProps {
  config: AgentConfigData;
  onConfigChange: (section: string, key: string, value: any) => void;
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
}

export const BasicConfigPanel: React.FC<BasicConfigPanelProps> = ({
  config,
  onConfigChange,
  onSave,
  onReset,
  isSaving
}) => {
  return (
    <div className="space-y-6">
      {/* Timeout Configuration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Timeout (segundos)
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="5"
            max="120"
            value={config.config.timeout}
            onChange={(e) => onConfigChange('config', 'timeout', parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            disabled={!config.enabled}
          />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-16 text-right">
            {config.config.timeout}s
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Tiempo máximo de espera para operaciones del agente
        </p>
      </div>

      {/* Max Tokens */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tokens Máximos
        </label>
        <input
          type="number"
          min="500"
          max="4000"
          step="100"
          value={config.config.maxTokens}
          onChange={(e) => onConfigChange('config', 'maxTokens', parseInt(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!config.enabled}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Número máximo de tokens para la respuesta del modelo (500-4000)
        </p>
      </div>

      {/* Temperature */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Temperatura
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={config.config.temperature}
            onChange={(e) => onConfigChange('config', 'temperature', parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            disabled={!config.enabled}
          />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-12 text-right">
            {config.config.temperature}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>Preciso (0.0)</span>
          <span>Creativo (1.0)</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Controla la creatividad vs precisión de las respuestas
        </p>
      </div>

      {/* Max Tags Per Post */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Etiquetas Máximas por Post
        </label>
        <input
          type="number"
          min="3"
          max="20"
          value={config.config.maxTagsPerPost}
          onChange={(e) => onConfigChange('config', 'maxTagsPerPost', parseInt(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!config.enabled}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Número máximo de etiquetas a generar por publicación (3-20)
        </p>
      </div>

      {/* SEO Score Threshold */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Umbral de Score SEO
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="100"
            value={config.config.seoScoreThreshold}
            onChange={(e) => onConfigChange('config', 'seoScoreThreshold', parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            disabled={!config.enabled}
          />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-12 text-right">
            {config.config.seoScoreThreshold}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Score mínimo para considerar el contenido optimizado para SEO
        </p>
      </div>

      {/* Auto Optimization Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Auto-optimización SEO</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Permite al agente optimizar automáticamente el contenido para SEO
          </p>
        </div>
        <button
          onClick={() => onConfigChange('config', 'autoOptimization', !config.config.autoOptimization)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            config.config.autoOptimization ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          disabled={!config.enabled}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              config.config.autoOptimization ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={onSave}
          disabled={isSaving || !config.enabled}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Guardar Configuración</span>
            </>
          )}
        </button>
        
        <button
          onClick={onReset}
          disabled={isSaving}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <RotateCcw size={18} />
          <span>Resetear</span>
        </button>
      </div>
    </div>
  );
};

export default BasicConfigPanel;
