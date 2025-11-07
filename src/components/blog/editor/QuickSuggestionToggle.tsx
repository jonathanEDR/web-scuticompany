/**
 * 🎯 QuickSuggestionToggle Component
 * Control directo de sugerencias automáticas desde el editor
 * con toggle visual, shortcuts y persistencia local
 */

import React, { useState, useEffect } from 'react';
import { Zap, ZapOff, Settings } from 'lucide-react';
import { useQuickSuggestionControl } from '../../../hooks/useQuickSuggestionControl';

interface QuickSuggestionToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showSettings?: boolean;
  onSettingsClick?: () => void;
}

export const QuickSuggestionToggle: React.FC<QuickSuggestionToggleProps> = ({
  className = '',
  size = 'md',
  showLabel = true,
  showSettings = false,
  onSettingsClick
}) => {
  const {
    localEnabled,
    globalEnabled,
    isOverridden,
    isLoading,
    toggleLocal,
    syncWithGlobal,
    getEffectiveState
  } = useQuickSuggestionControl();

  const [isAnimating, setIsAnimating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Estado efectivo (combinado local + global)
  const effectiveState = getEffectiveState();
  const isEnabled = effectiveState.enabled;

  // Configuración de tamaños
  const sizeConfig = {
    sm: {
      button: 'px-3 py-1.5 text-sm',
      icon: 'w-4 h-4',
      dot: 'w-1.5 h-1.5',
      text: 'text-xs'
    },
    md: {
      button: 'px-4 py-2 text-sm',
      icon: 'w-5 h-5',
      dot: 'w-2 h-2',
      text: 'text-sm'
    },
    lg: {
      button: 'px-5 py-3 text-base',
      icon: 'w-6 h-6',
      dot: 'w-2.5 h-2.5',
      text: 'text-base'
    }
  };

  const config = sizeConfig[size];

  // Animación al cambiar estado
  const handleToggle = async () => {
    try {
      setIsAnimating(true);
      await toggleLocal();
    } catch (error) {
      console.error('Error toggling suggestions:', error);
    } finally {
      // Animación de feedback
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  };

  // Información del estado para tooltip
  const getStatusInfo = () => {
    if (isLoading) return { text: 'Cargando...', color: 'text-gray-500' };
    
    if (!globalEnabled) {
      return { 
        text: 'Deshabilitado globalmente', 
        color: 'text-red-500',
        detail: 'Configurar desde Panel de Agentes'
      };
    }
    
    if (isOverridden) {
      return { 
        text: isEnabled ? 'Activado localmente' : 'Desactivado localmente', 
        color: isEnabled ? 'text-blue-500' : 'text-orange-500',
        detail: 'Override temporal - se sincronizará automáticamente'
      };
    }
    
    return { 
      text: isEnabled ? 'Activo' : 'Inactivo', 
      color: isEnabled ? 'text-green-500' : 'text-gray-500',
      detail: 'Sincronizado con configuración global'
    };
  };

  const statusInfo = getStatusInfo();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+S para toggle
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        handleToggle();
      }
      // Ctrl+Shift+R para sync con global
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        syncWithGlobal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleLocal, syncWithGlobal]);

  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`}>
      {/* Toggle Button */}
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={`
            inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-200
            ${config.button}
            ${isEnabled 
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25' 
              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
            }
            ${isAnimating ? 'scale-95' : 'scale-100'}
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
            ${!globalEnabled ? 'opacity-60' : ''}
          `}
        >
          {/* Loading State */}
          {isLoading ? (
            <div className={`${config.icon} animate-spin`}>
              <div className="rounded-full border-2 border-current border-t-transparent" />
            </div>
          ) : (
            /* Icon Based on State */
            isEnabled ? (
              <Zap className={`${config.icon} ${isAnimating ? 'animate-pulse' : ''}`} />
            ) : (
              <ZapOff className={`${config.icon}`} />
            )
          )}

          {/* Status Indicator Dot */}
          <div className={`
            ${config.dot} rounded-full transition-colors duration-200
            ${isEnabled ? 'bg-green-400' : 'bg-gray-400'}
            ${isAnimating ? 'animate-ping' : ''}
          `} />

          {/* Label */}
          {showLabel && (
            <span className="font-medium">
              {isLoading ? 'Cargando...' : (isEnabled ? 'Sugerencias ON' : 'Sugerencias OFF')}
            </span>
          )}

          {/* Override Indicator */}
          {isOverridden && !isLoading && (
            <div className={`${config.dot} rounded-full bg-orange-400 animate-pulse`} />
          )}
        </button>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
            <div className="bg-gray-900 dark:bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              <div className={`font-medium ${statusInfo.color}`}>
                {statusInfo.text}
              </div>
              {statusInfo.detail && (
                <div className="text-gray-300 dark:text-gray-400 mt-1">
                  {statusInfo.detail}
                </div>
              )}
              <div className="text-gray-400 mt-1 text-xs">
                Ctrl+Shift+S: Toggle • Ctrl+Shift+R: Sync
              </div>
              {/* Arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45" />
            </div>
          </div>
        )}
      </div>

      {/* Settings Button */}
      {showSettings && onSettingsClick && (
        <button
          onClick={onSettingsClick}
          className={`
            p-2 rounded-lg transition-colors duration-200
            text-gray-500 dark:text-gray-400
            hover:text-gray-700 dark:hover:text-gray-200
            hover:bg-gray-100 dark:hover:bg-gray-800
            ${config.text}
          `}
          title="Configuración de Sugerencias"
        >
          <Settings className={config.icon} />
        </button>
      )}

      {/* Quick Status Bar (for debugging) */}
      {import.meta.env.DEV && (
        <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
          G:{globalEnabled ? '✓' : '✗'} | L:{localEnabled ? '✓' : '✗'} | O:{isOverridden ? '✓' : '✗'}
        </div>
      )}
    </div>
  );
};

export default QuickSuggestionToggle;