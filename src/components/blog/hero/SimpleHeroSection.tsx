/**
 * 🎯 Simple Hero Section
 * Hero limpio y directo para blog de noticias tech
 * Ahora con soporte para configuración CMS y búsqueda integrada
 */

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useBlogCmsConfig, DEFAULT_BLOG_HERO_CONFIG } from '../../../hooks/blog';
import { useTheme } from '../../../contexts/ThemeContext';

interface SimpleHeroSectionProps {
  totalPosts?: number;
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export const SimpleHeroSection: React.FC<SimpleHeroSectionProps> = ({
  totalPosts = 0,
  onSearch,
  searchQuery = ''
}) => {
  // Estado local para el input de búsqueda
  const [inputValue, setInputValue] = useState(searchQuery);
  
  // Sincronizar con prop externa
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Obtener configuración del CMS y tema actual
  const { config, loading } = useBlogCmsConfig();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const blogHero = config?.blogHero || DEFAULT_BLOG_HERO_CONFIG;
  
  // Tipografía
  const fontFamily = blogHero.fontFamily || 'Montserrat';

  // Obtener estilos del buscador según el tema
  const inputStyles = isDarkMode 
    ? blogHero.search?.inputStyles?.dark 
    : blogHero.search?.inputStyles?.light;
  const buttonStyles = isDarkMode 
    ? blogHero.search?.buttonStyles?.dark 
    : blogHero.search?.buttonStyles?.light;

  // Generar estilo de fondo dinámico (imagen tiene prioridad sobre gradiente)
  const getBackgroundStyle = () => {
    if (blogHero.backgroundImage) {
      return {
        backgroundImage: `linear-gradient(rgba(0,0,0,${blogHero.backgroundOverlay || 0.5}), rgba(0,0,0,${blogHero.backgroundOverlay || 0.5})), url(${blogHero.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    return {
      background: `linear-gradient(to right, ${blogHero.gradientFrom || '#3b82f6'}, ${blogHero.gradientTo || '#9333ea'})`
    };
  };

  // Manejar búsqueda
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(inputValue.trim());
    }
  };

  // Generar estilos del texto destacado (soporta gradiente + fondo)
  // Retorna estilos separados para el contenedor (badge) y el texto (gradiente)
  const getHighlightStyles = () => {
    const useGradient = blogHero.styles?.light?.titleHighlightUseGradient;
    const hasBackground = blogHero.highlightStyle?.hasBackground;
    
    // Estilos del contenedor (badge/fondo)
    const containerStyle: React.CSSProperties = {
      fontStyle: blogHero.highlightStyle?.italic ? 'italic' : 'normal',
      backgroundColor: hasBackground 
        ? (blogHero.highlightStyle?.backgroundColor || '#8b5cf6') 
        : 'transparent',
      padding: hasBackground 
        ? (blogHero.highlightStyle?.padding || '4px 16px') 
        : '0',
      borderRadius: hasBackground 
        ? (blogHero.highlightStyle?.borderRadius || '8px') 
        : '0',
      display: 'inline-block',
    };

    // Estilos del texto (color sólido o gradiente)
    const textStyle: React.CSSProperties = useGradient ? {
      background: `linear-gradient(${blogHero.styles?.light?.titleHighlightGradientDirection || 'to right'}, ${blogHero.styles?.light?.titleHighlightGradientFrom || '#8b5cf6'}, ${blogHero.styles?.light?.titleHighlightGradientTo || '#06b6d4'})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    } : {
      color: blogHero.styles?.light?.titleHighlightColor || '#fde047',
    };

    return { containerStyle, textStyle, useGradient };
  };

  // Limpiar búsqueda
  const handleClear = () => {
    setInputValue('');
    if (onSearch) {
      onSearch('');
    }
  };

  // Mientras el CMS carga (sin caché): skeleton neutro sin colores del tema
  if (loading) {
    const skeletonBg = isDarkMode ? '#111827' : '#f3f4f6';
    const barColor = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    return (
      <section
        className="animate-pulse"
        style={{ backgroundColor: skeletonBg }}
      >
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Título skeleton */}
            <div className="flex justify-center items-center gap-3 flex-wrap">
              <div className="h-12 w-36 rounded-lg" style={{ backgroundColor: barColor }} />
              <div className="h-12 w-52 rounded-lg" style={{ backgroundColor: barColor }} />
            </div>
            {/* Subtítulo skeleton */}
            <div className="flex justify-center">
              <div className="h-5 w-72 rounded-full" style={{ backgroundColor: barColor }} />
            </div>
            {/* Stats skeleton */}
            <div className="flex justify-center gap-10">
              <div className="space-y-2">
                <div className="h-8 w-14 rounded mx-auto" style={{ backgroundColor: barColor }} />
                <div className="h-4 w-20 rounded mx-auto" style={{ backgroundColor: barColor }} />
              </div>
              <div className="space-y-2">
                <div className="h-8 w-14 rounded mx-auto" style={{ backgroundColor: barColor }} />
                <div className="h-4 w-20 rounded mx-auto" style={{ backgroundColor: barColor }} />
              </div>
            </div>
            {/* Barra de búsqueda skeleton */}
            <div className="max-w-xl mx-auto h-14 rounded-full" style={{ backgroundColor: barColor }} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="text-white"
      style={{
        ...getBackgroundStyle(),
        fontFamily: `'${fontFamily}', sans-serif`
      }}
    >
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Título con estilos de resaltado configurables */}
          <h1 className="text-4xl lg:text-6xl font-bold mb-4 inline-flex items-center gap-2 flex-wrap justify-center">
            <span 
              style={{ 
                color: blogHero.styles?.light?.titleColor || '#ffffff',
                fontStyle: blogHero.titleStyle?.italic ? 'italic' : 'normal',
                backgroundColor: blogHero.titleStyle?.hasBackground 
                  ? (blogHero.titleStyle?.backgroundColor || '#ffffff') 
                  : 'transparent',
                padding: blogHero.titleStyle?.hasBackground 
                  ? (blogHero.titleStyle?.padding || '4px 16px') 
                  : '0',
                borderRadius: blogHero.titleStyle?.hasBackground 
                  ? (blogHero.titleStyle?.borderRadius || '8px') 
                  : '0',
              }}
            >
              {blogHero.title}
            </span>
            {/* Texto destacado con soporte para fondo + gradiente */}
            {blogHero.titleHighlight && (() => {
              const { containerStyle, textStyle } = getHighlightStyles();
              return (
                <span style={containerStyle}>
                  <span style={textStyle}>{blogHero.titleHighlight}</span>
                </span>
              );
            })()}
          </h1>

          {/* Subtítulo Simple */}
          <p 
            className="text-lg mb-8"
            style={{ color: blogHero.styles?.light?.subtitleColor || '#bfdbfe' }}
          >
            {blogHero.subtitle}
          </p>

          {/* Stats Simple */}
          {blogHero.showStats !== false && (
            <div className="flex justify-center gap-8 mb-8 text-sm">
              <div className="text-center">
                <div 
                  className="text-2xl font-bold"
                  style={{ color: blogHero.styles?.light?.statsValueColor || '#ffffff' }}
                >
                  {totalPosts}+
                </div>
                <div style={{ color: blogHero.styles?.light?.statsLabelColor || '#bfdbfe' }}>
                  {blogHero.stats?.articlesLabel || 'Artículos'}
                </div>
              </div>
              <div className="text-center">
                <div 
                  className="text-2xl font-bold"
                  style={{ color: blogHero.styles?.light?.statsValueColor || '#ffffff' }}
                >
                  {blogHero.stats?.readersCount || '15K+'}
                </div>
                <div style={{ color: blogHero.styles?.light?.statsLabelColor || '#bfdbfe' }}>
                  {blogHero.stats?.readersLabel || 'Lectores'}
                </div>
              </div>
            </div>
          )}

          {/* Search Bar con funcionalidad integrada y estilos configurables */}
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            {/* Wrapper para borde con gradiente */}
            <div 
              className="relative"
              style={inputStyles?.useGradientBorder ? {
                padding: inputStyles?.borderWidth || '2px',
                background: `linear-gradient(${inputStyles?.gradientBorderDirection || 'to right'}, ${inputStyles?.gradientBorderFrom || '#8b5cf6'}, ${inputStyles?.gradientBorderTo || '#06b6d4'})`,
                borderRadius: inputStyles?.borderRadius || '9999px',
              } : undefined}
            >
              <div className="relative">
                <Search 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                  style={{ color: inputStyles?.iconColor || '#9ca3af' }}
                />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={blogHero.search?.placeholder || 'Buscar noticias...'}
                  className="w-full pl-12 pr-28 py-4 shadow-lg focus:ring-2 focus:ring-white/20 focus:outline-none"
                  style={{
                    backgroundColor: inputStyles?.backgroundColor || (isDarkMode ? '#1f2937' : '#ffffff'),
                    color: inputStyles?.textColor || (isDarkMode ? '#ffffff' : '#1f2937'),
                    border: inputStyles?.useGradientBorder 
                      ? 'none' 
                      : `${inputStyles?.borderWidth || '2px'} solid ${inputStyles?.borderColor || (isDarkMode ? '#374151' : '#e5e7eb')}`,
                    borderRadius: inputStyles?.borderRadius || '9999px',
                  }}
                />
                {/* Botón para limpiar */}
                {inputValue && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-24 top-1/2 transform -translate-y-1/2 hover:opacity-70 p-1"
                    style={{ color: inputStyles?.iconColor || '#9ca3af' }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button 
                  type="submit"
                  className="absolute right-2 top-2 px-6 py-2 font-medium transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: buttonStyles?.backgroundColor || '#2563eb',
                    color: buttonStyles?.textColor || '#ffffff',
                    borderRadius: buttonStyles?.borderRadius || '9999px',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = buttonStyles?.hoverBackgroundColor || '#1d4ed8';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = buttonStyles?.backgroundColor || '#2563eb';
                  }}
                >
                  {blogHero.search?.buttonText || 'Buscar'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};