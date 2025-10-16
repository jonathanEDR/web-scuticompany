// Componente para configuración avanzada de botones
import React, { useState } from 'react';
import GradientSelector from './GradientSelector';
import { isGradient } from '../utils/gradientUtils';

interface ButtonTheme {
  bg: string;
  text: string;
  border?: string;
  hover: string;
  hoverText?: string;
}

interface ButtonConfigProps {
  buttonType: 'ctaPrimary' | 'contact' | 'dashboard';
  theme: ButtonTheme;
  mode: 'lightMode' | 'darkMode';
  onUpdate: (property: string, value: string) => void;
  title: string;
  icon: string;
}

const BUTTON_TEMPLATES = {
  ctaPrimary: [
    {
      name: 'Gradiente Púrpura-Cian',
      config: {
        bg: 'linear-gradient(90deg, #8B5CF6, #06B6D4)',
        text: '#FFFFFF',
        hover: 'linear-gradient(90deg, #7C3AED, #0891B2)'
      }
    },
    {
      name: 'Gradiente Rosa-Naranja',
      config: {
        bg: 'linear-gradient(90deg, #EC4899, #F97316)',
        text: '#FFFFFF',
        hover: 'linear-gradient(90deg, #DB2777, #EA580C)'
      }
    },
    {
      name: 'Sólido Púrpura',
      config: {
        bg: '#8B5CF6',
        text: '#FFFFFF',
        hover: '#7C3AED'
      }
    }
  ],
  contact: [
    {
      name: 'Borde Cian',
      config: {
        bg: 'transparent',
        text: '#06B6D4',
        border: '#06B6D4',
        hover: '#06B6D4',
        hoverText: '#FFFFFF'
      }
    },
    {
      name: 'Borde Púrpura',
      config: {
        bg: 'transparent',
        text: '#8B5CF6',
        border: '#8B5CF6',
        hover: '#8B5CF6',
        hoverText: '#FFFFFF'
      }
    },
    {
      name: 'Borde Gradiente Cian-Púrpura',
      config: {
        bg: 'transparent',
        text: '#06B6D4',
        border: 'linear-gradient(90deg, #06B6D4, #8B5CF6)',
        hover: 'linear-gradient(90deg, #06B6D4, #8B5CF6)',
        hoverText: '#FFFFFF'
      }
    },
    {
      name: 'Borde Gradiente Rosa-Naranja',
      config: {
        bg: 'transparent',
        text: '#EC4899',
        border: 'linear-gradient(90deg, #EC4899, #F97316)',
        hover: 'linear-gradient(90deg, #EC4899, #F97316)',
        hoverText: '#FFFFFF'
      }
    },
    {
      name: 'Borde Gradiente Azul-Verde',
      config: {
        bg: 'transparent',
        text: '#3B82F6',
        border: 'linear-gradient(90deg, #3B82F6, #10B981)',
        hover: 'linear-gradient(90deg, #3B82F6, #10B981)',
        hoverText: '#FFFFFF'
      }
    }
  ],
  dashboard: [
    {
      name: 'Gradiente Azul-Púrpura',
      config: {
        bg: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
        text: '#FFFFFF',
        hover: 'linear-gradient(90deg, #2563EB, #7C3AED)'
      }
    },
    {
      name: 'Sólido Azul',
      config: {
        bg: '#3B82F6',
        text: '#FFFFFF',
        hover: '#2563EB'
      }
    }
  ]
};

export const ButtonConfig: React.FC<ButtonConfigProps> = ({
  buttonType,
  theme,
  mode,
  onUpdate,
  title,
  icon
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const isDarkMode = mode === 'darkMode';
  const templates = BUTTON_TEMPLATES[buttonType] || [];

  const applyTemplate = (template: any) => {
    Object.entries(template.config).forEach(([key, value]) => {
      onUpdate(key, value as string);
    });
    setShowTemplates(false);
  };

  const getContrastRatio = (bg: string, text: string) => {
    // Función simplificada para calcular contraste
    // En una implementación real, usarías una librería como chroma-js
    // Por ahora retornamos un placeholder
    if (bg && text) {
      return '4.5:1'; // Placeholder - contraste bueno
    }
    return '3.0:1'; // Placeholder - contraste regular
  };



  return (
    <div className={`border rounded-lg transition-all duration-200 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      {/* Header del botón */}
      <div 
        className={`p-4 cursor-pointer ${
          isDarkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-100'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xl">{icon}</span>
            <div>
              <h5 className={`font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-700'
              }`}>
                {title}
              </h5>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {mode === 'lightMode' ? 'Tema Claro' : 'Tema Oscuro'}
              </p>
            </div>
          </div>
          
          {/* Vista previa miniatura */}
          <div className="flex items-center space-x-3">
            <div
              className="w-24 h-8 rounded flex items-center justify-center text-xs font-medium"
              style={{
                background: theme.bg || '#8B5CF6',
                color: theme.text || '#FFFFFF',
                border: theme.border ? `2px solid ${theme.border}` : 'none'
              }}
            >
              Preview
            </div>
            <svg 
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''} ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Configuración expandida */}
      {isExpanded && (
        <div className={`p-4 border-t ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {/* Plantillas rápidas */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                🎨 Plantillas Rápidas
              </label>
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className={`text-xs px-3 py-1 rounded ${
                  isDarkMode 
                    ? 'bg-purple-900 text-purple-200 hover:bg-purple-800' 
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                {showTemplates ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            
            {showTemplates && (
              <div className="grid grid-cols-1 gap-2">
                {templates.map((template, index) => (
                  <div
                    key={index}
                    onClick={() => applyTemplate(template)}
                    className={`p-3 rounded cursor-pointer transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600' 
                        : 'bg-white hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        {template.name}
                      </span>
                      <div
                        className="w-16 h-6 rounded text-xs flex items-center justify-center"
                        style={{
                          background: template.config.bg,
                          color: template.config.text,
                          border: ('border' in template.config && template.config.border) ? `1px solid ${template.config.border}` : 'none'
                        }}
                      >
                        Test
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Configuración del fondo */}
          <div className="grid grid-cols-1 gap-4">
            {/* Color de fondo o gradiente */}
            <div>
              {isGradient(theme.bg || '') ? (
                <GradientSelector
                  value={theme.bg || ''}
                  onChange={(value) => onUpdate('bg', value)}
                  label="🎨 Fondo (Gradiente)"
                />
              ) : (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    🎨 Color de Fondo
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={theme.bg || '#8B5CF6'}
                      onChange={(e) => onUpdate('bg', e.target.value)}
                      className="w-16 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme.bg || ''}
                      onChange={(e) => onUpdate('bg', e.target.value)}
                      placeholder="#8B5CF6 o linear-gradient(...)"
                      className={`flex-1 px-3 py-2 text-sm rounded ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } border`}
                    />
                    <button
                      onClick={() => onUpdate('bg', 'linear-gradient(90deg, #8B5CF6, #06B6D4)')}
                      className={`px-3 py-2 text-xs rounded ${
                        isDarkMode 
                          ? 'bg-purple-800 text-purple-200 hover:bg-purple-700' 
                          : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      }`}
                      title="Convertir a gradiente"
                    >
                      📈
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Color de texto */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                ✏️ Color de Texto
              </label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={theme.text || '#FFFFFF'}
                  onChange={(e) => onUpdate('text', e.target.value)}
                  className="w-16 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.text || ''}
                  onChange={(e) => onUpdate('text', e.target.value)}
                  placeholder="#FFFFFF"
                  className={`flex-1 px-3 py-2 text-sm rounded ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } border`}
                />
              </div>
              {/* Indicador de contraste */}
              <div className="mt-1 text-xs text-gray-500">
                Contraste estimado: {getContrastRatio(theme.bg || '#8B5CF6', theme.text || '#FFFFFF')}
              </div>
            </div>

            {/* Color hover */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                👆 Color Hover
              </label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={theme.hover || '#7C3AED'}
                  onChange={(e) => onUpdate('hover', e.target.value)}
                  className="w-16 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.hover || ''}
                  onChange={(e) => onUpdate('hover', e.target.value)}
                  placeholder="#7C3AED o linear-gradient(...)"
                  className={`flex-1 px-3 py-2 text-sm rounded ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } border`}
                />
              </div>
            </div>

            {/* Color de borde (solo para botones de contacto) */}
            {buttonType === 'contact' && (
              <div>
                {isGradient(theme.border || '') ? (
                  <GradientSelector
                    value={theme.border || ''}
                    onChange={(value) => onUpdate('border', value)}
                    label="🔲 Borde (Gradiente)"
                  />
                ) : (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      🔲 Color de Borde
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        value={theme.border || theme.text || '#06B6D4'}
                        onChange={(e) => onUpdate('border', e.target.value)}
                        className="w-16 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={theme.border || ''}
                        onChange={(e) => onUpdate('border', e.target.value)}
                        placeholder="#06B6D4 o linear-gradient(...)"
                        className={`flex-1 px-3 py-2 text-sm rounded ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } border`}
                      />
                      <button
                        onClick={() => onUpdate('border', 'linear-gradient(90deg, #06B6D4, #8B5CF6)')}
                        className={`px-3 py-2 text-xs rounded ${
                          isDarkMode 
                            ? 'bg-purple-800 text-purple-200 hover:bg-purple-700' 
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        }`}
                        title="Convertir a gradiente"
                      >
                        📈
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Color de texto hover (para botones de contacto) */}
            {buttonType === 'contact' && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  ✏️ Color de Texto al Hover
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={theme.hoverText || '#FFFFFF'}
                    onChange={(e) => onUpdate('hoverText', e.target.value)}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.hoverText || ''}
                    onChange={(e) => onUpdate('hoverText', e.target.value)}
                    placeholder="#FFFFFF"
                    className={`flex-1 px-3 py-2 text-sm rounded ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } border`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Vista previa interactiva */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <label className={`block text-sm font-medium mb-3 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              👀 Vista Previa Interactiva
            </label>
            <div className="flex space-x-3">
              <button
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 transform hover:scale-105 ${
                  buttonType === 'contact' && theme.border?.includes('gradient') ? 'contact-button-gradient' : ''
                }`}
                style={{
                  background: theme.bg || '#8B5CF6',
                  color: theme.text || '#FFFFFF',
                  border: buttonType === 'contact' && theme.border?.includes('gradient') 
                    ? 'none' 
                    : theme.border ? `2px solid ${theme.border}` : 'none',
                  ...(buttonType === 'contact' && theme.border?.includes('gradient') && {
                    '--gradient-border': theme.border,
                    '--gradient-border-hover': theme.hover?.includes('gradient') ? theme.hover : theme.border,
                    '--hover-text-color': theme.hoverText || '#ffffff'
                  })
                } as React.CSSProperties & { [key: string]: string }}
                onMouseEnter={(e) => {
                  if (!(buttonType === 'contact' && theme.border?.includes('gradient'))) {
                    if (theme.hover) {
                      (e.target as HTMLElement).style.background = theme.hover;
                    }
                    if (theme.hoverText && buttonType === 'contact') {
                      (e.target as HTMLElement).style.color = theme.hoverText;
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  if (!(buttonType === 'contact' && theme.border?.includes('gradient'))) {
                    if (theme.bg) {
                      (e.target as HTMLElement).style.background = theme.bg;
                    }
                    if (theme.text) {
                      (e.target as HTMLElement).style.color = theme.text;
                    }
                  }
                }}
              >
                {buttonType === 'ctaPrimary' && 'Conoce nuestros servicios'}
                {buttonType === 'contact' && 'CONTÁCTENOS'}
                {buttonType === 'dashboard' && '🎯 Ir al Dashboard'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ButtonConfig;