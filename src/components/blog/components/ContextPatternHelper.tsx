/**
 * 🎨 ContextPatternHelper Component
 * Panel de ayuda que muestra sugerencias de patrones #...# 
 * mientras el usuario escribe
 */

import React from 'react';
import { Hash, Sparkles, Info, X } from 'lucide-react';
import { type ContextPattern } from '../parsers/contextParser';

interface ContextPatternHelperProps {
  isTypingPattern: boolean;
  suggestions: string[];
  activePattern?: ContextPattern | null;
  onSuggestionClick: (suggestion: string) => void;
  onClose?: () => void;
  position?: { x: number; y: number };
  className?: string;
}

export const ContextPatternHelper: React.FC<ContextPatternHelperProps> = ({
  isTypingPattern,
  suggestions,
  activePattern,
  onSuggestionClick,
  onClose,
  position,
  className = ''
}) => {
  // No mostrar si no hay sugerencias y no hay patrón activo
  if (!isTypingPattern && !activePattern) return null;

  return (
    <div
      className={`fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 ${className}`}
      style={position ? {
        left: `${position.x}px`,
        top: `${position.y}px`
      } : undefined}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isTypingPattern ? 'Patrones Disponibles' : 'Patrón Activo'}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-3 h-3 text-gray-400" />
          </button>
        )}
      </div>

      {/* Patrón Activo */}
      {activePattern && !isTypingPattern && (
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {activePattern.contextText}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tipo: {activePattern.type}
              </p>
              {activePattern.modifiers && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {Object.entries(activePattern.modifiers).map(([key, value]) => (
                    <span
                      key={key}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                    >
                      {key}: {value}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lista de Sugerencias */}
      {isTypingPattern && suggestions.length > 0 && (
        <div className="max-h-64 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion}-${index}`}
              onClick={() => onSuggestionClick(suggestion)}
              className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left group"
            >
              <Hash className="w-4 h-4 text-gray-400 group-hover:text-purple-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white font-mono">
                {suggestion}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Mensaje de ayuda cuando está escribiendo pero no hay sugerencias */}
      {isTypingPattern && suggestions.length === 0 && (
        <div className="p-4 text-center">
          <Info className="w-5 h-5 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Escribe para ver sugerencias de patrones
          </p>
        </div>
      )}

      {/* Footer con ejemplos rápidos */}
      <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          <strong>Ejemplos rápidos:</strong>
        </p>
        <div className="flex flex-wrap gap-1">
          {[
            '#expandir#',
            '#resumir#',
            '#continuar#',
            '#ejemplos#'
          ].map((example) => (
            <button
              key={example}
              onClick={() => onSuggestionClick(example)}
              className="inline-flex items-center px-2 py-1 rounded text-xs bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Info adicional */}
      <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Usa <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900/40 rounded font-mono">#</code> para crear patrones.
            Ejemplo: <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900/40 rounded font-mono">#expandir con ejemplos#</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContextPatternHelper;