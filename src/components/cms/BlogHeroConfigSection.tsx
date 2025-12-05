/**
 * 🎯 BlogHeroConfigSection
 * Configuración del Hero Section para la página del Blog
 * Soporta imagen de fondo O gradiente de colores
 */

import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Type, BarChart3, Search, Image, Upload, Trash2 } from 'lucide-react';
import type { PageData } from '../../types/cms';
import { uploadImage } from '../../services/imageService';

interface BlogHeroConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
}

const BlogHeroConfigSection: React.FC<BlogHeroConfigSectionProps> = ({
  pageData,
  updateContent
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'content' | 'background' | 'stats' | 'search'>('content');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Obtener configuración actual del hero del blog
  const blogHero = pageData?.content?.blogHero || {
    title: 'Blog',
    titleHighlight: 'Tech',
    subtitle: 'Las últimas noticias y tendencias tecnológicas',
    backgroundImage: '',
    backgroundOverlay: 0.5,
    gradientFrom: '#3b82f6',
    gradientTo: '#9333ea',
    showStats: true,
    stats: {
      articlesLabel: 'Artículos',
      readersCount: '15K+',
      readersLabel: 'Lectores'
    },
    search: {
      placeholder: 'Buscar noticias...',
      buttonText: 'Buscar'
    },
    styles: {
      light: {
        titleColor: '#ffffff',
        titleHighlightColor: '#fde047',
        subtitleColor: '#bfdbfe',
        statsValueColor: '#ffffff',
        statsLabelColor: '#bfdbfe'
      },
      dark: {
        titleColor: '#ffffff',
        titleHighlightColor: '#fde047',
        subtitleColor: '#bfdbfe',
        statsValueColor: '#ffffff',
        statsLabelColor: '#bfdbfe'
      }
    }
  };

  const handleUpdate = (field: string, value: any) => {
    updateContent(`blogHero.${field}`, value);
  };

  const handleStyleUpdate = (mode: 'light' | 'dark', field: string, value: string) => {
    const currentStyles = blogHero.styles || {};
    const modeStyles = currentStyles[mode] || {};
    updateContent(`blogHero.styles.${mode}`, {
      ...modeStyles,
      [field]: value
    });
  };

  // Manejar subida de imagen usando el servicio centralizado
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Usar el servicio centralizado de imágenes (igual que otros módulos)
      const imageData = await uploadImage({
        file,
        category: 'banner',
        title: 'Blog Hero Background',
        alt: 'Fondo del hero del blog'
      });

      if (imageData?.url) {
        handleUpdate('backgroundImage', imageData.url);
        console.log('✅ Imagen subida correctamente:', imageData.url);
      } else {
        throw new Error('No se recibió la URL de la imagen');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error instanceof Error ? error.message : 'Error al subir la imagen. Inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Eliminar imagen
  const handleRemoveImage = () => {
    handleUpdate('backgroundImage', '');
  };

  // Generar estilo de fondo dinámico
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">📰</span>
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Blog Hero Section
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configura la portada del blog
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {isExpanded ? 'Ocultar' : 'Mostrar'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-6">
          {/* Sub-tabs */}
          <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button
              onClick={() => setActiveSubTab('content')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                activeSubTab === 'content'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <Type className="w-4 h-4" />
              Contenido
            </button>
            <button
              onClick={() => setActiveSubTab('background')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                activeSubTab === 'background'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <Image className="w-4 h-4" />
              Fondo
            </button>
            <button
              onClick={() => setActiveSubTab('stats')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                activeSubTab === 'stats'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Estadísticas
            </button>
            <button
              onClick={() => setActiveSubTab('search')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                activeSubTab === 'search'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <Search className="w-4 h-4" />
              Búsqueda
            </button>
          </div>

          {/* Content Tab */}
          {activeSubTab === 'content' && (
            <div className="space-y-6">
              {/* Título Principal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={blogHero.title || 'Blog'}
                    onChange={(e) => handleUpdate('title', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Blog"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Palabra Destacada (color diferente)
                  </label>
                  <input
                    type="text"
                    value={blogHero.titleHighlight || 'Tech'}
                    onChange={(e) => handleUpdate('titleHighlight', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tech"
                  />
                </div>
              </div>

              {/* Subtítulo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={blogHero.subtitle || ''}
                  onChange={(e) => handleUpdate('subtitle', e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Las últimas noticias y tendencias tecnológicas"
                />
              </div>

              {/* Colores de texto */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Colores de Texto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Color Título
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={blogHero.styles?.light?.titleColor || '#ffffff'}
                        onChange={(e) => handleStyleUpdate('light', 'titleColor', e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={blogHero.styles?.light?.titleColor || '#ffffff'}
                        onChange={(e) => handleStyleUpdate('light', 'titleColor', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Color Destacado
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={blogHero.styles?.light?.titleHighlightColor || '#fde047'}
                        onChange={(e) => handleStyleUpdate('light', 'titleHighlightColor', e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={blogHero.styles?.light?.titleHighlightColor || '#fde047'}
                        onChange={(e) => handleStyleUpdate('light', 'titleHighlightColor', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Color Subtítulo
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={blogHero.styles?.light?.subtitleColor || '#bfdbfe'}
                        onChange={(e) => handleStyleUpdate('light', 'subtitleColor', e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={blogHero.styles?.light?.subtitleColor || '#bfdbfe'}
                        onChange={(e) => handleStyleUpdate('light', 'subtitleColor', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview del título */}
              <div 
                className="p-6 rounded-xl text-center"
                style={getBackgroundStyle()}
              >
                <h1 
                  className="text-3xl font-bold"
                  style={{ color: blogHero.styles?.light?.titleColor || '#ffffff' }}
                >
                  {blogHero.title || 'Blog'}{' '}
                  <span style={{ color: blogHero.styles?.light?.titleHighlightColor || '#fde047' }}>
                    {blogHero.titleHighlight || 'Tech'}
                  </span>
                </h1>
                <p 
                  className="mt-2"
                  style={{ color: blogHero.styles?.light?.subtitleColor || '#bfdbfe' }}
                >
                  {blogHero.subtitle || 'Las últimas noticias y tendencias tecnológicas'}
                </p>
              </div>
            </div>
          )}

          {/* Background Tab */}
          {activeSubTab === 'background' && (
            <div className="space-y-6">
              {/* Imagen de fondo */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      🖼️ Imagen de Fondo
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Si subes una imagen, se usará en lugar del gradiente
                    </p>
                  </div>
                  {blogHero.backgroundImage && (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-full">
                      ✓ Imagen activa
                    </span>
                  )}
                </div>

                {/* Preview o Upload */}
                {blogHero.backgroundImage ? (
                  <div className="relative">
                    <div 
                      className="w-full h-48 rounded-xl bg-cover bg-center"
                      style={{ backgroundImage: `url(${blogHero.backgroundImage})` }}
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                      title="Eliminar imagen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
                      Imagen de fondo activa
                    </div>
                  </div>
                ) : (
                  <div 
                    className="w-full h-48 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-2"></div>
                        <span className="text-gray-500 dark:text-gray-400">Subiendo imagen...</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                        <span className="text-gray-600 dark:text-gray-300 font-medium">Subir imagen de fondo</span>
                        <span className="text-sm text-gray-400">JPG, PNG o WebP (máx. 5MB)</span>
                      </>
                    )}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Overlay control (solo si hay imagen) */}
                {blogHero.backgroundImage && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Oscurecer imagen: {Math.round((blogHero.backgroundOverlay || 0.5) * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={blogHero.backgroundOverlay || 0.5}
                      onChange={(e) => handleUpdate('backgroundOverlay', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Sin oscurecer</span>
                      <span>Muy oscuro</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Gradiente de fondo (siempre visible como fallback) */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      🎨 Gradiente de Fondo
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {blogHero.backgroundImage 
                        ? 'Se usará si eliminas la imagen de fondo'
                        : 'Colores del gradiente actual'
                      }
                    </p>
                  </div>
                  {!blogHero.backgroundImage && (
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm rounded-full">
                      ✓ Gradiente activo
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Color Inicio
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={blogHero.gradientFrom || '#3b82f6'}
                        onChange={(e) => handleUpdate('gradientFrom', e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={blogHero.gradientFrom || '#3b82f6'}
                        onChange={(e) => handleUpdate('gradientFrom', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Color Fin
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={blogHero.gradientTo || '#9333ea'}
                        onChange={(e) => handleUpdate('gradientTo', e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={blogHero.gradientTo || '#9333ea'}
                        onChange={(e) => handleUpdate('gradientTo', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview de fondo */}
              <div 
                className="p-8 rounded-xl text-center"
                style={getBackgroundStyle()}
              >
                <h1 
                  className="text-3xl font-bold"
                  style={{ color: blogHero.styles?.light?.titleColor || '#ffffff' }}
                >
                  {blogHero.title || 'Blog'}{' '}
                  <span style={{ color: blogHero.styles?.light?.titleHighlightColor || '#fde047' }}>
                    {blogHero.titleHighlight || 'Tech'}
                  </span>
                </h1>
                <p 
                  className="mt-2"
                  style={{ color: blogHero.styles?.light?.subtitleColor || '#bfdbfe' }}
                >
                  {blogHero.subtitle || 'Las últimas noticias y tendencias tecnológicas'}
                </p>
                <div className="mt-4 text-xs text-white/70">
                  {blogHero.backgroundImage ? '📷 Usando imagen de fondo' : '🎨 Usando gradiente'}
                </div>
              </div>
            </div>
          )}

          {/* Stats Tab */}
          {activeSubTab === 'stats' && (
            <div className="space-y-6">
              {/* Toggle de estadísticas */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    Mostrar Estadísticas
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Muestra el contador de artículos y lectores
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={blogHero.showStats !== false}
                    onChange={(e) => handleUpdate('showStats', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Configuración de estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Etiqueta de Artículos
                  </label>
                  <input
                    type="text"
                    value={blogHero.stats?.articlesLabel || 'Artículos'}
                    onChange={(e) => handleUpdate('stats.articlesLabel', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Artículos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contador de Lectores
                  </label>
                  <input
                    type="text"
                    value={blogHero.stats?.readersCount || '15K+'}
                    onChange={(e) => handleUpdate('stats.readersCount', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="15K+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Etiqueta de Lectores
                  </label>
                  <input
                    type="text"
                    value={blogHero.stats?.readersLabel || 'Lectores'}
                    onChange={(e) => handleUpdate('stats.readersLabel', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Lectores"
                  />
                </div>
              </div>

              {/* Preview de estadísticas */}
              <div 
                className="p-6 rounded-xl text-center"
                style={getBackgroundStyle()}
              >
                <div className="flex justify-center gap-8 text-white">
                  <div className="text-center">
                    <div className="text-2xl font-bold">0+</div>
                    <div className="text-blue-200 text-sm">{blogHero.stats?.articlesLabel || 'Artículos'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{blogHero.stats?.readersCount || '15K+'}</div>
                    <div className="text-blue-200 text-sm">{blogHero.stats?.readersLabel || 'Lectores'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search Tab */}
          {activeSubTab === 'search' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Placeholder del Buscador
                  </label>
                  <input
                    type="text"
                    value={blogHero.search?.placeholder || 'Buscar noticias...'}
                    onChange={(e) => handleUpdate('search.placeholder', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Buscar noticias..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Texto del Botón
                  </label>
                  <input
                    type="text"
                    value={blogHero.search?.buttonText || 'Buscar'}
                    onChange={(e) => handleUpdate('search.buttonText', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Buscar"
                  />
                </div>
              </div>

              {/* Preview del buscador */}
              <div 
                className="p-6 rounded-xl"
                style={getBackgroundStyle()}
              >
                <div className="max-w-xl mx-auto">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Search className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder={blogHero.search?.placeholder || 'Buscar noticias...'}
                      className="w-full pl-12 pr-24 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg border-0"
                      readOnly
                    />
                    <button 
                      className="absolute right-2 top-2 bg-blue-600 text-white px-6 py-2 rounded-md font-medium"
                    >
                      {blogHero.search?.buttonText || 'Buscar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogHeroConfigSection;
