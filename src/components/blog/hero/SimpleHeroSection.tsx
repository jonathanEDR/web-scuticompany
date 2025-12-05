/**
 * 🎯 Simple Hero Section
 * Hero limpio y directo para blog de noticias tech
 * Ahora con soporte para configuración CMS y búsqueda integrada
 */

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useBlogCmsConfig, DEFAULT_BLOG_HERO_CONFIG } from '../../../hooks/blog';

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

  // Obtener configuración del CMS
  const { config } = useBlogCmsConfig();
  const blogHero = config?.blogHero || DEFAULT_BLOG_HERO_CONFIG;
  
  // Tipografía
  const fontFamily = blogHero.fontFamily || 'Montserrat';

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

  // Limpiar búsqueda
  const handleClear = () => {
    setInputValue('');
    if (onSearch) {
      onSearch('');
    }
  };

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
          
          {/* Título Simple */}
          <h1 
            className="text-4xl lg:text-6xl font-bold mb-4"
            style={{ color: blogHero.styles?.light?.titleColor || '#ffffff' }}
          >
            {blogHero.title || 'Blog'}{' '}
            <span style={{ color: blogHero.styles?.light?.titleHighlightColor || '#fde047' }}>
              {blogHero.titleHighlight || 'Tech'}
            </span>
          </h1>

          {/* Subtítulo Simple */}
          <p 
            className="text-lg mb-8"
            style={{ color: blogHero.styles?.light?.subtitleColor || '#bfdbfe' }}
          >
            {blogHero.subtitle || 'Las últimas noticias y tendencias tecnológicas'}
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

          {/* Search Bar con funcionalidad integrada */}
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={blogHero.search?.placeholder || 'Buscar noticias...'}
                className="w-full pl-12 pr-28 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg border-0 focus:ring-2 focus:ring-white/20 focus:outline-none"
              />
              {/* Botón para limpiar */}
              {inputValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-24 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button 
                type="submit"
                className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                {blogHero.search?.buttonText || 'Buscar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};