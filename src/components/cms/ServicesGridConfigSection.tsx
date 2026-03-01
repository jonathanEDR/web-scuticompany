/**
 * 🎴 CONFIGURACIÓN DE SECCIÓN DE SERVICIOS
 * Permite personalizar la sección de servicios destacados y el diseño de tarjetas
 */

import React, { useState } from 'react';
import ManagedImageSelector from '../ManagedImageSelector';
import type { PageData } from '../../types/cms';

interface ServicesGridConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
}

const ServicesGridConfigSection: React.FC<ServicesGridConfigSectionProps> = ({
  pageData,
  updateContent
}) => {
  const [collapsed, setCollapsed] = useState(true);

  // Obtener configuración actual o usar valores por defecto
  const gridConfig = (pageData?.content as any)?.servicesGrid || {
    // Sección de servicios destacados
    featuredSection: {
      title: '★ Servicios Destacados',
      showIcon: true,
      icon: '★',
      backgroundImage: {
        light: '',
        dark: ''
      },
      backgroundOpacity: 0.1,
      backgroundOverlay: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(6, 182, 212, 0.05))'
    },
    
    // Sección de todos los servicios
    allServicesSection: {
      title: '■ Todos los Servicios',
      showIcon: true,
      icon: '■'
    },
    
    // Diseño de tarjetas
    cardDesign: {
      // Bordes
      borderRadius: '1rem',
      borderWidth: '1px',
      borderColor: '#e5e7eb',
      borderColorDark: '#374151',
      
      // Sombras
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      shadowHover: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      
      // Fondo
      backgroundColor: '#ffffff',
      backgroundColorDark: '#1f2937',
      
      // Imagen
      imageHeight: '12rem',
      imageObjectFit: 'cover',
      
      // Badge destacado
      featuredBadge: {
        text: '★ Destacado',
        gradient: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
        textColor: '#ffffff'
      },
      
      // Categoría
      categoryStyle: {
        borderRadius: '9999px',
        fontSize: '0.75rem',
        padding: '0.25rem 0.75rem'
      },
      
      // Título
      titleColor: '#111827',
      titleColorDark: '#f9fafb',
      titleHoverColor: '#8B5CF6',
      titleHoverColorDark: '#A78BFA',
      
      // Descripción
      descriptionColor: '#4b5563',
      descriptionColorDark: '#d1d5db',
      
      // Características
      featureTagBg: '#f9fafb',
      featureTagBgDark: '#374151',
      featureTagText: '#4b5563',
      featureTagTextDark: '#d1d5db',
      
      // Precio
      priceColor: '#8B5CF6',
      priceColorDark: '#A78BFA',
      
      // Botón
      buttonGradient: 'linear-gradient(90deg, #8B5CF6, #3B82F6)',
      buttonGradientHover: 'linear-gradient(90deg, #7C3AED, #2563EB)',
      buttonTextColor: '#ffffff',
      buttonBorderRadius: '0.5rem',
      
      // Etiquetas
      tagBg: 'rgba(139, 92, 246, 0.1)',
      tagText: '#8B5CF6'
    }
  };

  const handleUpdate = (field: string, value: any) => {
    updateContent(`servicesGrid.${field}`, value);
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 border border-gray-100 dark:border-gray-700/50">
      {/* Encabezado colapsable */}
      <button
        type="button"
        className="w-full flex items-center justify-between text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded transition-colors"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-expanded={!collapsed}
      >
        <span className="flex items-center gap-2">
          🎴 Configuración de Sección de Servicios
        </span>
        <span className="ml-2 text-lg">
          {collapsed ? '▼ Mostrar' : '▲ Ocultar'}
        </span>
      </button>

      {!collapsed && (
        <div className="space-y-4">
          
          {/* ===== SECCIÓN DESTACADOS ===== */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              ⭐ Sección "Servicios Destacados"
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Título de la sección
                </label>
                <input
                  type="text"
                  value={gridConfig.featuredSection?.title || '⭐ Servicios Destacados'}
                  onChange={(e) => handleUpdate('featuredSection.title', e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Icono
                </label>
                <input
                  type="text"
                  value={gridConfig.featuredSection?.icon || '★'}
                  onChange={(e) => handleUpdate('featuredSection.icon', e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-purple-500"
                  placeholder="★ ☆ ✶ ● ◆"
                />
              </div>
            </div>

            {/* Colores del Título e Icono */}
            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                🎨 Colores del Título e Icono
              </h4>
              
              {/* Nota importante sobre emojis */}
              <div className="mb-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg border border-amber-300 dark:border-amber-700">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  💡 <strong>Nota:</strong> Los emojis (⭐🌟) son imágenes y <strong>no cambian de color</strong> con CSS. 
                  Para usar colores personalizados, usa símbolos unicode como: <strong>★ ✦ ✧ ● ◆ ▶</strong>
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Modo Claro */}
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                    ☀️ Modo Claro
                  </h5>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Color del Título */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Color del Título
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={gridConfig.featuredSection?.titleColor || '#1f2937'}
                          onChange={(e) => handleUpdate('featuredSection.titleColor', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={gridConfig.featuredSection?.titleColor || '#1f2937'}
                          onChange={(e) => handleUpdate('featuredSection.titleColor', e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          placeholder="#1f2937"
                        />
                      </div>
                    </div>
                    
                    {/* Color del Icono */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Color del Icono
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={gridConfig.featuredSection?.iconColor || '#f59e0b'}
                          onChange={(e) => handleUpdate('featuredSection.iconColor', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={gridConfig.featuredSection?.iconColor || '#f59e0b'}
                          onChange={(e) => handleUpdate('featuredSection.iconColor', e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          placeholder="#f59e0b"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Modo Oscuro */}
                <div className="p-4 bg-gray-800 rounded-lg shadow-sm">
                  <h5 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    🌙 Modo Oscuro
                  </h5>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Color del Título */}
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        Color del Título
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={gridConfig.featuredSection?.titleColorDark || '#f9fafb'}
                          onChange={(e) => handleUpdate('featuredSection.titleColorDark', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                        />
                        <input
                          type="text"
                          value={gridConfig.featuredSection?.titleColorDark || '#f9fafb'}
                          onChange={(e) => handleUpdate('featuredSection.titleColorDark', e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-600 rounded-lg bg-gray-700 text-white text-sm"
                          placeholder="#f9fafb"
                        />
                      </div>
                    </div>
                    
                    {/* Color del Icono */}
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        Color del Icono
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={gridConfig.featuredSection?.iconColorDark || '#fbbf24'}
                          onChange={(e) => handleUpdate('featuredSection.iconColorDark', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                        />
                        <input
                          type="text"
                          value={gridConfig.featuredSection?.iconColorDark || '#fbbf24'}
                          onChange={(e) => handleUpdate('featuredSection.iconColorDark', e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-600 rounded-lg bg-gray-700 text-white text-sm"
                          placeholder="#fbbf24"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Imagen de fondo */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-4">
              <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">
                💡 <strong>Imagen de fondo:</strong> Esta imagen cubrirá el panel de filtros y la sección de servicios destacados.
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                🎨 Para imágenes de alta calidad, usa opacidad del 80-100% y activa "Tarjetas transparentes".
              </p>
            </div>
            
            {/* Opción de tarjetas transparentes */}
            <div className="mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gridConfig.cardDesign?.transparentCards || false}
                  onChange={(e) => handleUpdate('cardDesign.transparentCards', e.target.checked)}
                  className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-1 dark:bg-gray-700 dark:border-gray-600"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    🪟 Tarjetas transparentes
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Las tarjetas de servicios no tendrán fondo, dejando ver la imagen de fondo
                  </p>
                </div>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  🌞 Imagen de fondo (tema claro)
                </label>
                <ManagedImageSelector
                  currentImage={gridConfig.featuredSection?.backgroundImage?.light || ''}
                  onImageSelect={(url) => handleUpdate('featuredSection.backgroundImage.light', url)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  🌙 Imagen de fondo (tema oscuro)
                </label>
                <ManagedImageSelector
                  currentImage={gridConfig.featuredSection?.backgroundImage?.dark || ''}
                  onImageSelect={(url) => handleUpdate('featuredSection.backgroundImage.dark', url)}
                />
              </div>
            </div>

            {/* Opacidad de fondo */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Opacidad de la imagen: {Math.round((gridConfig.featuredSection?.backgroundOpacity || 0.1) * 100)}%
                <span className="ml-2 text-xs text-gray-500">
                  {(gridConfig.featuredSection?.backgroundOpacity || 0.1) >= 0.9 ? '🔥 Ultra HD' : 
                   (gridConfig.featuredSection?.backgroundOpacity || 0.1) >= 0.7 ? '✨ Alta calidad' : 
                   (gridConfig.featuredSection?.backgroundOpacity || 0.1) >= 0.4 ? '👍 Normal' : '💨 Sutil'}
                </span>
              </label>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={(gridConfig.featuredSection?.backgroundOpacity || 0.1) * 100}
                onChange={(e) => handleUpdate('featuredSection.backgroundOpacity', parseInt(e.target.value) / 100)}
                className="w-full h-2 bg-gradient-to-r from-gray-300 via-purple-400 to-purple-600 rounded-lg appearance-none cursor-pointer dark:from-gray-600 dark:via-purple-500 dark:to-purple-400"
              />
            </div>
          </div>

          {/* ===== DISEÑO DE TARJETAS ===== */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              🎨 Diseño de Tarjetas de Servicio
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Border radius */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Redondeo de esquinas
                </label>
                <select
                  value={gridConfig.cardDesign?.borderRadius || '1rem'}
                  onChange={(e) => handleUpdate('cardDesign.borderRadius', e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="0.5rem">Pequeño</option>
                  <option value="1rem">Normal</option>
                  <option value="1.5rem">Grande</option>
                  <option value="2rem">Extra grande</option>
                </select>
              </div>

              {/* Altura de imagen */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Altura de imagen
                </label>
                <select
                  value={gridConfig.cardDesign?.imageHeight || '12rem'}
                  onChange={(e) => handleUpdate('cardDesign.imageHeight', e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="10rem">Pequeña (160px)</option>
                  <option value="12rem">Normal (192px)</option>
                  <option value="14rem">Grande (224px)</option>
                  <option value="16rem">Extra grande (256px)</option>
                </select>
              </div>

              {/* Ajuste de imagen */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Ajuste de imagen
                </label>
                <select
                  value={gridConfig.cardDesign?.imageObjectFit || 'cover'}
                  onChange={(e) => handleUpdate('cardDesign.imageObjectFit', e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="cover">Cubrir (recorta)</option>
                  <option value="contain">Contener (completa)</option>
                  <option value="fill">Estirar</option>
                </select>
              </div>
            </div>

            {/* Colores */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {/* Color de título */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Color título (claro)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={gridConfig.cardDesign?.titleColor || '#111827'}
                    onChange={(e) => handleUpdate('cardDesign.titleColor', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={gridConfig.cardDesign?.titleColor || '#111827'}
                    onChange={(e) => handleUpdate('cardDesign.titleColor', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Color de título oscuro */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Color título (oscuro)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={gridConfig.cardDesign?.titleColorDark || '#f9fafb'}
                    onChange={(e) => handleUpdate('cardDesign.titleColorDark', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={gridConfig.cardDesign?.titleColorDark || '#f9fafb'}
                    onChange={(e) => handleUpdate('cardDesign.titleColorDark', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Color de precio */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Color precio
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={gridConfig.cardDesign?.priceColor || '#8B5CF6'}
                    onChange={(e) => handleUpdate('cardDesign.priceColor', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={gridConfig.cardDesign?.priceColor || '#8B5CF6'}
                    onChange={(e) => handleUpdate('cardDesign.priceColor', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Color hover título */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Color título hover
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={gridConfig.cardDesign?.titleHoverColor || '#8B5CF6'}
                    onChange={(e) => handleUpdate('cardDesign.titleHoverColor', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={gridConfig.cardDesign?.titleHoverColor || '#8B5CF6'}
                    onChange={(e) => handleUpdate('cardDesign.titleHoverColor', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ===== TIPOGRAFÍA DE TARJETAS ===== */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              🔤 Tipografía de Tarjetas de Servicio
            </h3>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-4">
              <p className="text-sm text-purple-700 dark:text-purple-300">
                💡 <strong>Consejo:</strong> Montserrat es ideal para títulos modernos. 
                Combina diferentes fuentes para títulos y descripciones para un diseño único.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Fuente para títulos */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Fuente de títulos
                </label>
                <select
                  value={gridConfig.cardDesign?.titleFontFamily || 'inherit'}
                  onChange={(e) => handleUpdate('cardDesign.titleFontFamily', e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-purple-500"
                  style={{ fontFamily: gridConfig.cardDesign?.titleFontFamily || 'inherit' }}
                >
                  <option value="inherit" style={{ fontFamily: 'inherit' }}>Por defecto (Sistema)</option>
                  <option value="'Montserrat', sans-serif" style={{ fontFamily: 'Montserrat, sans-serif' }}>Montserrat</option>
                  <option value="'Poppins', sans-serif" style={{ fontFamily: 'Poppins, sans-serif' }}>Poppins</option>
                  <option value="'Inter', sans-serif" style={{ fontFamily: 'Inter, sans-serif' }}>Inter</option>
                  <option value="'Roboto', sans-serif" style={{ fontFamily: 'Roboto, sans-serif' }}>Roboto</option>
                  <option value="'Open Sans', sans-serif" style={{ fontFamily: 'Open Sans, sans-serif' }}>Open Sans</option>
                  <option value="'Lato', sans-serif" style={{ fontFamily: 'Lato, sans-serif' }}>Lato</option>
                  <option value="'Raleway', sans-serif" style={{ fontFamily: 'Raleway, sans-serif' }}>Raleway</option>
                  <option value="'Nunito', sans-serif" style={{ fontFamily: 'Nunito, sans-serif' }}>Nunito</option>
                  <option value="'Playfair Display', serif" style={{ fontFamily: 'Playfair Display, serif' }}>Playfair Display</option>
                </select>
              </div>

              {/* Fuente para descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Fuente de descripción
                </label>
                <select
                  value={gridConfig.cardDesign?.descriptionFontFamily || 'inherit'}
                  onChange={(e) => handleUpdate('cardDesign.descriptionFontFamily', e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-purple-500"
                  style={{ fontFamily: gridConfig.cardDesign?.descriptionFontFamily || 'inherit' }}
                >
                  <option value="inherit" style={{ fontFamily: 'inherit' }}>Por defecto (Sistema)</option>
                  <option value="'Montserrat', sans-serif" style={{ fontFamily: 'Montserrat, sans-serif' }}>Montserrat</option>
                  <option value="'Poppins', sans-serif" style={{ fontFamily: 'Poppins, sans-serif' }}>Poppins</option>
                  <option value="'Inter', sans-serif" style={{ fontFamily: 'Inter, sans-serif' }}>Inter</option>
                  <option value="'Roboto', sans-serif" style={{ fontFamily: 'Roboto, sans-serif' }}>Roboto</option>
                  <option value="'Open Sans', sans-serif" style={{ fontFamily: 'Open Sans, sans-serif' }}>Open Sans</option>
                  <option value="'Lato', sans-serif" style={{ fontFamily: 'Lato, sans-serif' }}>Lato</option>
                  <option value="'Raleway', sans-serif" style={{ fontFamily: 'Raleway, sans-serif' }}>Raleway</option>
                  <option value="'Nunito', sans-serif" style={{ fontFamily: 'Nunito, sans-serif' }}>Nunito</option>
                  <option value="'Playfair Display', serif" style={{ fontFamily: 'Playfair Display, serif' }}>Playfair Display</option>
                </select>
              </div>

              {/* Vista previa */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Vista previa
                </label>
                <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
                  <h4 
                    className="text-base font-bold mb-1"
                    style={{ 
                      fontFamily: gridConfig.cardDesign?.titleFontFamily || 'inherit',
                      fontWeight: gridConfig.cardDesign?.titleFontWeight || '700',
                      color: gridConfig.cardDesign?.titleColor || '#111827'
                    }}
                  >
                    Título de Servicio
                  </h4>
                  <p 
                    className="text-xs text-gray-600 dark:text-gray-400"
                    style={{ 
                      fontFamily: gridConfig.cardDesign?.descriptionFontFamily || 'inherit',
                      fontWeight: gridConfig.cardDesign?.descriptionFontWeight || '400'
                    }}
                  >
                    Descripción del servicio aquí
                  </p>
                </div>
              </div>
            </div>

            {/* Peso de fuente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Peso de títulos
                </label>
                <select
                  value={gridConfig.cardDesign?.titleFontWeight || '700'}
                  onChange={(e) => handleUpdate('cardDesign.titleFontWeight', e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="400">Normal (400)</option>
                  <option value="500">Medio (500)</option>
                  <option value="600">Semi-Bold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">Extra Bold (800)</option>
                  <option value="900">Black (900)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Peso de descripción
                </label>
                <select
                  value={gridConfig.cardDesign?.descriptionFontWeight || '400'}
                  onChange={(e) => handleUpdate('cardDesign.descriptionFontWeight', e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="300">Light (300)</option>
                  <option value="400">Normal (400)</option>
                  <option value="500">Medio (500)</option>
                  <option value="600">Semi-Bold (600)</option>
                  <option value="700">Bold (700)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ===== BADGE DESTACADO ===== */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              🏷️ Badge "Destacado"
            </h3>
            
            {/* Texto e Icono del badge */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Icono del badge
                </label>
                <input
                  type="text"
                  value={gridConfig.cardDesign?.featuredBadge?.icon || '★'}
                  onChange={(e) => handleUpdate('cardDesign.featuredBadge.icon', e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="★ ☆ ✶ ●"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Texto del badge
                </label>
                <input
                  type="text"
                  value={gridConfig.cardDesign?.featuredBadge?.text || 'Destacado'}
                  onChange={(e) => handleUpdate('cardDesign.featuredBadge.text', e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            {/* Color del icono del badge */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-4 border border-yellow-200 dark:border-yellow-800">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                🌟 Color del Icono del Badge
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Color del Icono
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={gridConfig.cardDesign?.featuredBadge?.iconColor || '#fbbf24'}
                      onChange={(e) => handleUpdate('cardDesign.featuredBadge.iconColor', e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer border-2 border-gray-200 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      value={gridConfig.cardDesign?.featuredBadge?.iconColor || '#fbbf24'}
                      onChange={(e) => handleUpdate('cardDesign.featuredBadge.iconColor', e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                      placeholder="#fbbf24"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <div className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-2 rounded-lg">
                    💡 <strong>Nota:</strong> Los emojis (⭐) no cambian de color con CSS. Usa símbolos unicode (★) o texto para ver el color aplicado.
                  </div>
                </div>
              </div>
            </div>

            {/* Colores del gradiente */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-4">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                🎨 Colores del Gradiente del Badge
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Color 1 */}
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Color 1 (Inicio)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={gridConfig.cardDesign?.featuredBadge?.color1 || '#8B5CF6'}
                      onChange={(e) => {
                        handleUpdate('cardDesign.featuredBadge.color1', e.target.value);
                        const color2 = gridConfig.cardDesign?.featuredBadge?.color2 || '#EC4899';
                        handleUpdate('cardDesign.featuredBadge.gradient', `linear-gradient(90deg, ${e.target.value}, ${color2})`);
                      }}
                      className="w-12 h-10 rounded cursor-pointer border-2 border-gray-200 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      value={gridConfig.cardDesign?.featuredBadge?.color1 || '#8B5CF6'}
                      onChange={(e) => {
                        handleUpdate('cardDesign.featuredBadge.color1', e.target.value);
                        const color2 = gridConfig.cardDesign?.featuredBadge?.color2 || '#EC4899';
                        handleUpdate('cardDesign.featuredBadge.gradient', `linear-gradient(90deg, ${e.target.value}, ${color2})`);
                      }}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                      placeholder="#8B5CF6"
                    />
                  </div>
                </div>

                {/* Color 2 */}
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Color 2 (Fin)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={gridConfig.cardDesign?.featuredBadge?.color2 || '#EC4899'}
                      onChange={(e) => {
                        handleUpdate('cardDesign.featuredBadge.color2', e.target.value);
                        const color1 = gridConfig.cardDesign?.featuredBadge?.color1 || '#8B5CF6';
                        handleUpdate('cardDesign.featuredBadge.gradient', `linear-gradient(90deg, ${color1}, ${e.target.value})`);
                      }}
                      className="w-12 h-10 rounded cursor-pointer border-2 border-gray-200 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      value={gridConfig.cardDesign?.featuredBadge?.color2 || '#EC4899'}
                      onChange={(e) => {
                        handleUpdate('cardDesign.featuredBadge.color2', e.target.value);
                        const color1 = gridConfig.cardDesign?.featuredBadge?.color1 || '#8B5CF6';
                        handleUpdate('cardDesign.featuredBadge.gradient', `linear-gradient(90deg, ${color1}, ${e.target.value})`);
                      }}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                      placeholder="#EC4899"
                    />
                  </div>
                </div>

                {/* Vista previa */}
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Vista previa
                  </label>
                  <div className="flex items-center justify-center h-10 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <span 
                      className="text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1"
                      style={{ background: gridConfig.cardDesign?.featuredBadge?.gradient || `linear-gradient(90deg, ${gridConfig.cardDesign?.featuredBadge?.color1 || '#8B5CF6'}, ${gridConfig.cardDesign?.featuredBadge?.color2 || '#EC4899'})` }}
                    >
                      <span style={{ color: gridConfig.cardDesign?.featuredBadge?.iconColor || '#fbbf24' }}>
                        {gridConfig.cardDesign?.featuredBadge?.icon || '★'}
                      </span>
                      <span>{gridConfig.cardDesign?.featuredBadge?.text || 'Destacado'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Presets rápidos */}
              <div className="mt-4">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  ⚡ Presets rápidos
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'Morado-Rosa', c1: '#8B5CF6', c2: '#EC4899' },
                    { name: 'Morado-Azul', c1: '#8B5CF6', c2: '#3B82F6' },
                    { name: 'Naranja-Rojo', c1: '#F59E0B', c2: '#EF4444' },
                    { name: 'Verde-Azul', c1: '#10B981', c2: '#3B82F6' },
                    { name: 'Rosa-Naranja', c1: '#EC4899', c2: '#F97316' },
                    { name: 'Azul-Cyan', c1: '#3B82F6', c2: '#06B6D4' },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        handleUpdate('cardDesign.featuredBadge.color1', preset.c1);
                        handleUpdate('cardDesign.featuredBadge.color2', preset.c2);
                        handleUpdate('cardDesign.featuredBadge.gradient', `linear-gradient(90deg, ${preset.c1}, ${preset.c2})`);
                      }}
                      className="px-3 py-1.5 text-xs font-medium rounded-full text-white shadow-sm hover:scale-105 transition-transform"
                      style={{ background: `linear-gradient(90deg, ${preset.c1}, ${preset.c2})` }}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ===== BOTÓN VER DETALLES ===== */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              🔘 Botón "Ver detalles"
            </h3>
            
            {/* Texto e Icono del botón */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Texto del botón
                </label>
                <input
                  type="text"
                  value={gridConfig.cardDesign?.buttonText || 'Ver detalles'}
                  onChange={(e) => handleUpdate('cardDesign.buttonText', e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Icono del botón
                </label>
                <input
                  type="text"
                  value={gridConfig.cardDesign?.buttonIcon || '→'}
                  onChange={(e) => handleUpdate('cardDesign.buttonIcon', e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="→ ▶ ➔ ›"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Posición del icono
                </label>
                <select
                  value={gridConfig.cardDesign?.buttonIconPosition || 'right'}
                  onChange={(e) => handleUpdate('cardDesign.buttonIconPosition', e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="left">← Izquierda</option>
                  <option value="right">Derecha →</option>
                  <option value="none">Sin icono</option>
                </select>
              </div>
            </div>

            {/* Tipo de fondo */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Tipo de fondo
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="buttonBgType"
                    checked={!gridConfig.cardDesign?.buttonSolidColor}
                    onChange={() => {
                      handleUpdate('cardDesign.buttonSolidColor', false);
                      const c1 = gridConfig.cardDesign?.buttonColor1 || '#8B5CF6';
                      const c2 = gridConfig.cardDesign?.buttonColor2 || '#3B82F6';
                      handleUpdate('cardDesign.buttonGradient', `linear-gradient(90deg, ${c1}, ${c2})`);
                    }}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">🌈 Gradiente</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="buttonBgType"
                    checked={gridConfig.cardDesign?.buttonSolidColor === true}
                    onChange={() => {
                      handleUpdate('cardDesign.buttonSolidColor', true);
                      const c1 = gridConfig.cardDesign?.buttonColor1 || '#8B5CF6';
                      handleUpdate('cardDesign.buttonGradient', c1);
                    }}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">🎯 Color sólido</span>
                </label>
              </div>
            </div>

            {/* Colores del gradiente/sólido */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-4">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                🎨 {gridConfig.cardDesign?.buttonSolidColor ? 'Color del Botón' : 'Colores del Gradiente del Botón'}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Color 1 */}
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {gridConfig.cardDesign?.buttonSolidColor ? 'Color' : 'Color 1 (Inicio)'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={gridConfig.cardDesign?.buttonColor1 || '#8B5CF6'}
                      onChange={(e) => {
                        handleUpdate('cardDesign.buttonColor1', e.target.value);
                        if (gridConfig.cardDesign?.buttonSolidColor) {
                          handleUpdate('cardDesign.buttonGradient', e.target.value);
                        } else {
                          const color2 = gridConfig.cardDesign?.buttonColor2 || '#3B82F6';
                          handleUpdate('cardDesign.buttonGradient', `linear-gradient(90deg, ${e.target.value}, ${color2})`);
                        }
                      }}
                      className="w-12 h-10 rounded cursor-pointer border-2 border-gray-200 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      value={gridConfig.cardDesign?.buttonColor1 || '#8B5CF6'}
                      onChange={(e) => {
                        handleUpdate('cardDesign.buttonColor1', e.target.value);
                        if (gridConfig.cardDesign?.buttonSolidColor) {
                          handleUpdate('cardDesign.buttonGradient', e.target.value);
                        } else {
                          const color2 = gridConfig.cardDesign?.buttonColor2 || '#3B82F6';
                          handleUpdate('cardDesign.buttonGradient', `linear-gradient(90deg, ${e.target.value}, ${color2})`);
                        }
                      }}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                      placeholder="#8B5CF6"
                    />
                  </div>
                </div>

                {/* Color 2 - solo si es gradiente */}
                {!gridConfig.cardDesign?.buttonSolidColor && (
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Color 2 (Fin)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={gridConfig.cardDesign?.buttonColor2 || '#3B82F6'}
                        onChange={(e) => {
                          handleUpdate('cardDesign.buttonColor2', e.target.value);
                          const color1 = gridConfig.cardDesign?.buttonColor1 || '#8B5CF6';
                          handleUpdate('cardDesign.buttonGradient', `linear-gradient(90deg, ${color1}, ${e.target.value})`);
                        }}
                        className="w-12 h-10 rounded cursor-pointer border-2 border-gray-200 dark:border-gray-600"
                      />
                      <input
                        type="text"
                        value={gridConfig.cardDesign?.buttonColor2 || '#3B82F6'}
                        onChange={(e) => {
                          handleUpdate('cardDesign.buttonColor2', e.target.value);
                          const color1 = gridConfig.cardDesign?.buttonColor1 || '#8B5CF6';
                          handleUpdate('cardDesign.buttonGradient', `linear-gradient(90deg, ${color1}, ${e.target.value})`);
                        }}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>
                )}

                {/* Vista previa */}
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Vista previa
                  </label>
                  <div className="flex items-center justify-center h-10 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <span 
                      className="text-white text-sm font-medium px-3 py-1.5 shadow-lg cursor-pointer transition-transform hover:scale-105 flex items-center gap-2"
                      style={{ 
                        background: gridConfig.cardDesign?.buttonGradient || `linear-gradient(90deg, ${gridConfig.cardDesign?.buttonColor1 || '#8B5CF6'}, ${gridConfig.cardDesign?.buttonColor2 || '#3B82F6'})`,
                        borderRadius: gridConfig.cardDesign?.buttonBorderRadius || '0.5rem'
                      }}
                    >
                      {gridConfig.cardDesign?.buttonIconPosition === 'left' && gridConfig.cardDesign?.buttonIconPosition !== 'none' && (
                        <span>{gridConfig.cardDesign?.buttonIcon || '→'}</span>
                      )}
                      <span>{gridConfig.cardDesign?.buttonText || 'Ver detalles'}</span>
                      {(gridConfig.cardDesign?.buttonIconPosition === 'right' || !gridConfig.cardDesign?.buttonIconPosition) && gridConfig.cardDesign?.buttonIconPosition !== 'none' && (
                        <span>{gridConfig.cardDesign?.buttonIcon || '→'}</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Presets rápidos */}
              <div className="mt-4">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  ⚡ Presets rápidos
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'Morado-Azul', c1: '#8B5CF6', c2: '#3B82F6', solid: false },
                    { name: 'Morado-Rosa', c1: '#8B5CF6', c2: '#EC4899', solid: false },
                    { name: 'Verde-Azul', c1: '#10B981', c2: '#3B82F6', solid: false },
                    { name: 'Naranja-Rojo', c1: '#F59E0B', c2: '#EF4444', solid: false },
                    { name: 'Azul-Cyan', c1: '#3B82F6', c2: '#06B6D4', solid: false },
                    { name: 'Morado', c1: '#8B5CF6', c2: '#8B5CF6', solid: true },
                    { name: 'Azul', c1: '#3B82F6', c2: '#3B82F6', solid: true },
                    { name: 'Verde', c1: '#10B981', c2: '#10B981', solid: true },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        handleUpdate('cardDesign.buttonColor1', preset.c1);
                        handleUpdate('cardDesign.buttonColor2', preset.c2);
                        handleUpdate('cardDesign.buttonSolidColor', preset.solid);
                        handleUpdate('cardDesign.buttonGradient', preset.solid ? preset.c1 : `linear-gradient(90deg, ${preset.c1}, ${preset.c2})`);
                      }}
                      className="px-3 py-1.5 text-xs font-medium rounded-full text-white shadow-sm hover:scale-105 transition-transform"
                      style={{ background: preset.solid ? preset.c1 : `linear-gradient(90deg, ${preset.c1}, ${preset.c2})` }}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ===== CONTENIDO DE TARJETAS ===== */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              📋 Contenido de Tarjetas (Uniformidad)
            </h3>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                💡 <strong>Consejo:</strong> Configura qué elementos mostrar para lograr tarjetas uniformes. 
                Menos elementos = más uniformidad visual.
              </p>
            </div>

            {/* Grid de toggles para elementos */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              {/* Mostrar Imagen */}
              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="checkbox"
                  checked={gridConfig.cardDesign?.contentConfig?.showImage !== false}
                  onChange={(e) => handleUpdate('cardDesign.contentConfig.showImage', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">🖼️ Imagen</span>
                </div>
              </label>

              {/* Mostrar Badge Destacado */}
              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="checkbox"
                  checked={gridConfig.cardDesign?.contentConfig?.showFeaturedBadge !== false}
                  onChange={(e) => handleUpdate('cardDesign.contentConfig.showFeaturedBadge', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">⭐ Badge</span>
                </div>
              </label>

              {/* Mostrar Categoría */}
              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="checkbox"
                  checked={gridConfig.cardDesign?.contentConfig?.showCategory !== false}
                  onChange={(e) => handleUpdate('cardDesign.contentConfig.showCategory', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">🏷️ Categoría</span>
                </div>
              </label>

              {/* Mostrar Descripción */}
              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="checkbox"
                  checked={gridConfig.cardDesign?.contentConfig?.showDescription !== false}
                  onChange={(e) => handleUpdate('cardDesign.contentConfig.showDescription', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">📝 Descripción</span>
                </div>
              </label>

              {/* Mostrar Características */}
              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="checkbox"
                  checked={gridConfig.cardDesign?.contentConfig?.showFeatures !== false}
                  onChange={(e) => handleUpdate('cardDesign.contentConfig.showFeatures', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">✓ Características</span>
                </div>
              </label>

              {/* Mostrar Precio */}
              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="checkbox"
                  checked={gridConfig.cardDesign?.contentConfig?.showPrice !== false}
                  onChange={(e) => handleUpdate('cardDesign.contentConfig.showPrice', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">💰 Precio</span>
                </div>
              </label>

              {/* Mostrar Tags */}
              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="checkbox"
                  checked={gridConfig.cardDesign?.contentConfig?.showTags || false}
                  onChange={(e) => handleUpdate('cardDesign.contentConfig.showTags', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">#️⃣ Tags</span>
                </div>
              </label>

              {/* Mostrar Botón */}
              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="checkbox"
                  checked={gridConfig.cardDesign?.contentConfig?.showButton !== false}
                  onChange={(e) => handleUpdate('cardDesign.contentConfig.showButton', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">🔘 Botón</span>
                </div>
              </label>
            </div>

            {/* Configuración de límites */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Líneas del título */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Líneas de título
                </label>
                <select
                  value={gridConfig.cardDesign?.contentConfig?.titleMaxLines || 2}
                  onChange={(e) => handleUpdate('cardDesign.contentConfig.titleMaxLines', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value={1}>1 línea</option>
                  <option value={2}>2 líneas</option>
                  <option value={3}>3 líneas</option>
                </select>
              </div>

              {/* Líneas de descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Líneas de descripción
                </label>
                <select
                  value={gridConfig.cardDesign?.contentConfig?.descriptionMaxLines || 2}
                  onChange={(e) => handleUpdate('cardDesign.contentConfig.descriptionMaxLines', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  disabled={gridConfig.cardDesign?.contentConfig?.showDescription === false}
                >
                  <option value={1}>1 línea</option>
                  <option value={2}>2 líneas</option>
                  <option value={3}>3 líneas</option>
                </select>
              </div>

              {/* Máximo de características */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Máx. características
                </label>
                <select
                  value={gridConfig.cardDesign?.contentConfig?.maxFeatures ?? 3}
                  onChange={(e) => handleUpdate('cardDesign.contentConfig.maxFeatures', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  disabled={gridConfig.cardDesign?.contentConfig?.showFeatures === false}
                >
                  <option value={0}>Ninguna</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </div>
            </div>

            {/* 🎨 Colores de resaltado de características */}
            {gridConfig.cardDesign?.contentConfig?.showFeatures !== false && (
              <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
                  🎨 Colores de Resaltado de Características
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                  Configura los colores del fondo, texto y borde de las características resaltadas
                </p>
                
                {/* Estilo de resaltado */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Estilo de resaltado
                  </label>
                  <div className="flex gap-3">
                    <label className={`flex-1 flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      gridConfig.cardDesign?.contentConfig?.featureHighlightStyle !== 'box' 
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' 
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="featureHighlightStyle"
                        value="highlight"
                        checked={gridConfig.cardDesign?.contentConfig?.featureHighlightStyle !== 'box'}
                        onChange={() => handleUpdate('cardDesign.contentConfig.featureHighlightStyle', 'highlight')}
                        className="w-4 h-4 text-purple-600"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">✨ Resaltado</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Estilo marcador fluido</p>
                      </div>
                    </label>
                    <label className={`flex-1 flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      gridConfig.cardDesign?.contentConfig?.featureHighlightStyle === 'box' 
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' 
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="featureHighlightStyle"
                        value="box"
                        checked={gridConfig.cardDesign?.contentConfig?.featureHighlightStyle === 'box'}
                        onChange={() => handleUpdate('cardDesign.contentConfig.featureHighlightStyle', 'box')}
                        className="w-4 h-4 text-purple-600"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">📦 Caja</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Estilo tarjeta/badge</p>
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Modo claro */}
                <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    ☀️ Modo Claro
                  </label>
                  
                  {/* Fondo con opción de gradiente */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                        Fondo
                      </label>
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={gridConfig.cardDesign?.contentConfig?.featureHighlightBgGradient === true}
                          onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightBgGradient', e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-600 dark:text-gray-400">Usar gradiente</span>
                      </label>
                    </div>
                    
                    {gridConfig.cardDesign?.contentConfig?.featureHighlightBgGradient ? (
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Color Inicio</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={gridConfig.cardDesign?.contentConfig?.featureHighlightBgGradientFrom || '#F3E8FF'}
                              onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightBgGradientFrom', e.target.value)}
                              className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                            />
                            <input
                              type="text"
                              value={gridConfig.cardDesign?.contentConfig?.featureHighlightBgGradientFrom || '#F3E8FF'}
                              onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightBgGradientFrom', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="#F3E8FF"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Color Fin</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={gridConfig.cardDesign?.contentConfig?.featureHighlightBgGradientTo || '#E9D5FF'}
                              onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightBgGradientTo', e.target.value)}
                              className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                            />
                            <input
                              type="text"
                              value={gridConfig.cardDesign?.contentConfig?.featureHighlightBgGradientTo || '#E9D5FF'}
                              onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightBgGradientTo', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="#E9D5FF"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Dirección</label>
                          <select
                            value={gridConfig.cardDesign?.contentConfig?.featureHighlightBgGradientDir || 'to-r'}
                            onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightBgGradientDir', e.target.value)}
                            className="w-full h-10 px-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="to-r">→ Derecha</option>
                            <option value="to-l">← Izquierda</option>
                            <option value="to-t">↑ Arriba</option>
                            <option value="to-b">↓ Abajo</option>
                            <option value="to-tr">↗ Diagonal ↗</option>
                            <option value="to-br">↘ Diagonal ↘</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={gridConfig.cardDesign?.contentConfig?.featureHighlightBgColor || '#F3E8FF'}
                          onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightBgColor', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={gridConfig.cardDesign?.contentConfig?.featureHighlightBgColor || '#F3E8FF'}
                          onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightBgColor', e.target.value)}
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                          placeholder="#F3E8FF"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Texto */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Texto
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={gridConfig.cardDesign?.contentConfig?.featureHighlightTextColor || '#6B21A8'}
                        onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightTextColor', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={gridConfig.cardDesign?.contentConfig?.featureHighlightTextColor || '#6B21A8'}
                        onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightTextColor', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                        placeholder="#6B21A8"
                      />
                    </div>
                  </div>
                  
                  {/* Borde con checkbox */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                        Borde
                      </label>
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={gridConfig.cardDesign?.contentConfig?.featureHighlightShowBorder !== false}
                          onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightShowBorder', e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-600 dark:text-gray-400">Mostrar borde</span>
                      </label>
                    </div>
                    {gridConfig.cardDesign?.contentConfig?.featureHighlightShowBorder !== false && (
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={gridConfig.cardDesign?.contentConfig?.featureHighlightBorderColor || '#C084FC'}
                          onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightBorderColor', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={gridConfig.cardDesign?.contentConfig?.featureHighlightBorderColor || '#C084FC'}
                          onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightBorderColor', e.target.value)}
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                          placeholder="#C084FC"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Modo oscuro */}
                <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    🌙 Modo Oscuro
                  </label>
                  
                  {/* Fondo con opción de gradiente */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-medium text-gray-400">
                        Fondo
                      </label>
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={gridConfig.cardDesign?.contentConfig?.featureHighlightBgGradientDark === true}
                          onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightBgGradientDark', e.target.checked)}
                          className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-400">Usar gradiente</span>
                      </label>
                    </div>
                    
                    {gridConfig.cardDesign?.contentConfig?.featureHighlightBgGradientDark ? (
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Color Inicio</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={gridConfig.cardDesign?.contentConfig?.featureHighlightBgGradientFromDark || '#581C87'}
                              onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightBgGradientFromDark', e.target.value)}
                              className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                            />
                            <input
                              type="text"
                              value={gridConfig.cardDesign?.contentConfig?.featureHighlightBgGradientFromDark || '#581C87'}
                              onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightBgGradientFromDark', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-700 text-white"
                              placeholder="#581C87"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Color Fin</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={gridConfig.cardDesign?.contentConfig?.featureHighlightBgGradientToDark || '#7C3AED'}
                              onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightBgGradientToDark', e.target.value)}
                              className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                            />
                            <input
                              type="text"
                              value={gridConfig.cardDesign?.contentConfig?.featureHighlightBgGradientToDark || '#7C3AED'}
                              onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightBgGradientToDark', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-600 rounded bg-gray-700 text-white"
                              placeholder="#7C3AED"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Dirección</label>
                          <select
                            value={gridConfig.cardDesign?.contentConfig?.featureHighlightBgGradientDirDark || 'to-r'}
                            onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightBgGradientDirDark', e.target.value)}
                            className="w-full h-10 px-2 text-xs border border-gray-600 rounded bg-gray-700 text-white"
                          >
                            <option value="to-r">→ Derecha</option>
                            <option value="to-l">← Izquierda</option>
                            <option value="to-t">↑ Arriba</option>
                            <option value="to-b">↓ Abajo</option>
                            <option value="to-tr">↗ Diagonal ↗</option>
                            <option value="to-br">↘ Diagonal ↘</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={gridConfig.cardDesign?.contentConfig?.featureHighlightBgColorDark || '#581C87'}
                          onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightBgColorDark', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                        />
                        <input
                          type="text"
                          value={gridConfig.cardDesign?.contentConfig?.featureHighlightBgColorDark || '#581C87'}
                          onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightBgColorDark', e.target.value)}
                          className="flex-1 px-3 py-2 text-sm border border-gray-600 rounded bg-gray-700 text-white font-mono"
                          placeholder="#581C87"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Texto */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Texto
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={gridConfig.cardDesign?.contentConfig?.featureHighlightTextColorDark || '#E9D5FF'}
                        onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightTextColorDark', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                      />
                      <input
                        type="text"
                        value={gridConfig.cardDesign?.contentConfig?.featureHighlightTextColorDark || '#E9D5FF'}
                        onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightTextColorDark', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-600 rounded bg-gray-700 text-white font-mono"
                        placeholder="#E9D5FF"
                      />
                    </div>
                  </div>
                  
                  {/* Borde con checkbox */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-medium text-gray-400">
                        Borde
                      </label>
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={gridConfig.cardDesign?.contentConfig?.featureHighlightShowBorderDark !== false}
                          onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightShowBorderDark', e.target.checked)}
                          className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-400">Mostrar borde</span>
                      </label>
                    </div>
                    {gridConfig.cardDesign?.contentConfig?.featureHighlightShowBorderDark !== false && (
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={gridConfig.cardDesign?.contentConfig?.featureHighlightBorderColorDark || '#7C3AED'}
                          onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightBorderColorDark', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer border border-gray-600"
                        />
                        <input
                          type="text"
                          value={gridConfig.cardDesign?.contentConfig?.featureHighlightBorderColorDark || '#7C3AED'}
                          onChange={(e) => handleUpdate('cardDesign.contentConfig.featureHighlightBorderColorDark', e.target.value)}
                          className="flex-1 px-3 py-2 text-sm border border-gray-600 rounded bg-gray-700 text-white font-mono"
                          placeholder="#7C3AED"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Vista previa */}
                <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Vista previa ({gridConfig.cardDesign?.contentConfig?.featureHighlightStyle === 'box' ? '📦 Caja' : '✨ Resaltado'}):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Característica 1', 'Característica 2'].map((text, idx) => {
                      const isBoxStyle = gridConfig.cardDesign?.contentConfig?.featureHighlightStyle === 'box';
                      const bgStyle = gridConfig.cardDesign?.contentConfig?.featureHighlightBgGradient
                        ? `linear-gradient(${
                            gridConfig.cardDesign?.contentConfig?.featureHighlightBgGradientDir === 'to-r' ? 'to right' :
                            gridConfig.cardDesign?.contentConfig?.featureHighlightBgGradientDir === 'to-l' ? 'to left' :
                            gridConfig.cardDesign?.contentConfig?.featureHighlightBgGradientDir === 'to-t' ? 'to top' :
                            gridConfig.cardDesign?.contentConfig?.featureHighlightBgGradientDir === 'to-b' ? 'to bottom' :
                            gridConfig.cardDesign?.contentConfig?.featureHighlightBgGradientDir === 'to-tr' ? 'to top right' :
                            gridConfig.cardDesign?.contentConfig?.featureHighlightBgGradientDir === 'to-br' ? 'to bottom right' : 'to right'
                          }, ${gridConfig.cardDesign?.contentConfig?.featureHighlightBgGradientFrom || '#F3E8FF'}, ${gridConfig.cardDesign?.contentConfig?.featureHighlightBgGradientTo || '#E9D5FF'})`
                        : (gridConfig.cardDesign?.contentConfig?.featureHighlightBgColor || '#F3E8FF');
                      const showBorder = gridConfig.cardDesign?.contentConfig?.featureHighlightShowBorder !== false;
                      
                      return (
                        <span
                          key={idx}
                          className={`font-medium ${isBoxStyle ? 'text-xs px-2.5 py-1.5 rounded-md' : 'text-sm'}`}
                          style={isBoxStyle ? {
                            background: bgStyle,
                            color: gridConfig.cardDesign?.contentConfig?.featureHighlightTextColor || '#6B21A8',
                            borderWidth: showBorder ? '1px' : '0',
                            borderStyle: 'solid',
                            borderColor: showBorder ? (gridConfig.cardDesign?.contentConfig?.featureHighlightBorderColor || '#C084FC') : 'transparent'
                          } : {
                            color: gridConfig.cardDesign?.contentConfig?.featureHighlightTextColor || '#6B21A8',
                            background: bgStyle,
                            padding: '0.1em 0.35em',
                            borderRadius: '0.2em',
                            lineHeight: '1.5',
                            borderWidth: showBorder ? '1px' : '0',
                            borderStyle: 'solid',
                            borderColor: showBorder ? (gridConfig.cardDesign?.contentConfig?.featureHighlightBorderColor || '#C084FC') : 'transparent'
                          }}
                        >
                          ✓ {text}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 mt-4">

              {/* Máximo de tags */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Máx. tags
                </label>
                <select
                  value={gridConfig.cardDesign?.contentConfig?.maxTags ?? 3}
                  onChange={(e) => handleUpdate('cardDesign.contentConfig.maxTags', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  disabled={!gridConfig.cardDesign?.contentConfig?.showTags}
                >
                  <option value={0}>Ninguno</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </div>
            </div>

            {/* Altura mínima de tarjeta */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Altura mínima de tarjeta (para uniformidad)
              </label>
              <select
                value={gridConfig.cardDesign?.contentConfig?.minCardHeight || 'auto'}
                onChange={(e) => handleUpdate('cardDesign.contentConfig.minCardHeight', e.target.value)}
                className="w-full md:w-1/3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="auto">Automático (se ajusta al contenido)</option>
                <option value="400px">400px - Compacta</option>
                <option value="450px">450px - Normal</option>
                <option value="500px">500px - Media</option>
                <option value="550px">550px - Grande</option>
                <option value="600px">600px - Extra grande</option>
              </select>
            </div>
          </div>

          {/* ===== VISTA PREVIA DE TARJETA ===== */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              👁️ Vista Previa de Tarjeta
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Esta vista previa refleja tu configuración de contenido actual.
            </p>
            
            {/* Tarjeta de vista previa */}
            <div className="flex justify-center">
              <div 
                className="w-full max-w-sm bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl group flex flex-col"
                style={{
                  borderRadius: gridConfig.cardDesign?.borderRadius || '1rem',
                  minHeight: gridConfig.cardDesign?.contentConfig?.minCardHeight || undefined
                }}
              >
                {/* Badge destacado - condicional */}
                {gridConfig.cardDesign?.contentConfig?.showFeaturedBadge !== false && (
                  <div className="absolute top-4 right-4 z-10">
                    <span 
                      className="text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1"
                      style={{
                        background: gridConfig.cardDesign?.featuredBadge?.gradient || 'linear-gradient(90deg, #8B5CF6, #EC4899)'
                      }}
                    >
                      <span style={{ color: gridConfig.cardDesign?.featuredBadge?.iconColor || '#fbbf24' }}>
                        {gridConfig.cardDesign?.featuredBadge?.icon || '★'}
                      </span>
                      <span>{gridConfig.cardDesign?.featuredBadge?.text || 'Destacado'}</span>
                    </span>
                  </div>
                )}

                {/* Imagen placeholder - condicional */}
                {gridConfig.cardDesign?.contentConfig?.showImage !== false && (
                  <div className="relative">
                    <div 
                      className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 flex items-center justify-center overflow-hidden"
                      style={{
                        height: gridConfig.cardDesign?.imageHeight || '12rem'
                      }}
                    >
                      <div className="text-6xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                        🚀
                      </div>
                    </div>
                  </div>
                )}

                {/* Contenido */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Categoría - condicional */}
                  {gridConfig.cardDesign?.contentConfig?.showCategory !== false && (
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200">
                        💼 Desarrollo Web
                      </span>
                    </div>
                  )}

                  {/* Título - con líneas configurables */}
                  <h3 
                    className={`text-lg font-bold mb-3 transition-colors ${
                      gridConfig.cardDesign?.contentConfig?.titleMaxLines === 1 ? 'line-clamp-1' :
                      gridConfig.cardDesign?.contentConfig?.titleMaxLines === 3 ? 'line-clamp-3' : 'line-clamp-2'
                    }`}
                    style={{
                      color: gridConfig.cardDesign?.titleColor || '#111827'
                    }}
                  >
                    Servicio de Ejemplo Profesional
                  </h3>

                  {/* Descripción - condicional */}
                  {gridConfig.cardDesign?.contentConfig?.showDescription !== false && (
                    <p className={`text-gray-600 dark:text-gray-300 text-sm mb-4 ${
                      gridConfig.cardDesign?.contentConfig?.descriptionMaxLines === 1 ? 'line-clamp-1' :
                      gridConfig.cardDesign?.contentConfig?.descriptionMaxLines === 3 ? 'line-clamp-3' : 'line-clamp-2'
                    }`}>
                      Esta es una descripción de ejemplo para mostrar cómo se verá el texto en la tarjeta.
                    </p>
                  )}

                  {/* Características - condicional */}
                  {gridConfig.cardDesign?.contentConfig?.showFeatures !== false && 
                   (gridConfig.cardDesign?.contentConfig?.maxFeatures ?? 3) > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {Array.from({ length: Math.min(gridConfig.cardDesign?.contentConfig?.maxFeatures ?? 3, 3) }).map((_, idx) => (
                          <span key={idx} className="text-xs bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                            ✓ Característica {idx + 1}
                          </span>
                        ))}
                        {(gridConfig.cardDesign?.contentConfig?.maxFeatures ?? 3) < 5 && (
                          <span className="text-xs text-gray-400 dark:text-gray-500 px-2 py-1">
                            +2 más
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Espaciador */}
                  <div className="flex-1"></div>

                  {/* Footer con precio y botón */}
                  <div className="flex items-center justify-between mt-auto">
                    {/* Precio - condicional */}
                    {gridConfig.cardDesign?.contentConfig?.showPrice !== false ? (
                      <div 
                        className="text-2xl font-bold"
                        style={{
                          color: gridConfig.cardDesign?.priceColor || '#8B5CF6'
                        }}
                      >
                        $299
                        <span className="text-sm text-gray-500 ml-1">USD</span>
                      </div>
                    ) : (
                      <div className="flex-1"></div>
                    )}
                    
                    {/* Botón - condicional */}
                    {gridConfig.cardDesign?.contentConfig?.showButton !== false && (
                      <span 
                        className="text-white px-3 py-1.5 font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm cursor-pointer"
                        style={{
                          background: gridConfig.cardDesign?.buttonGradient || 'linear-gradient(90deg, #8B5CF6, #3B82F6)',
                          borderRadius: gridConfig.cardDesign?.buttonBorderRadius || '0.5rem'
                        }}
                      >
                        {gridConfig.cardDesign?.buttonText || 'Ver detalles'}
                      </span>
                    )}
                  </div>

                  {/* Etiquetas - condicional */}
                  {gridConfig.cardDesign?.contentConfig?.showTags && 
                   (gridConfig.cardDesign?.contentConfig?.maxTags ?? 3) > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex flex-wrap gap-1">
                        {Array.from({ length: Math.min(gridConfig.cardDesign?.contentConfig?.maxTags ?? 3, 3) }).map((_, idx) => (
                          <span key={idx} className="text-xs text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-1 rounded-full">
                            #{['webdev', 'react', 'diseño'][idx]}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Indicadores de configuración activa */}
            <div className="flex flex-wrap justify-center mt-4 gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${gridConfig.cardDesign?.contentConfig?.showImage !== false ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 line-through'}`}>
                🖼️ Imagen
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${gridConfig.cardDesign?.contentConfig?.showCategory !== false ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 line-through'}`}>
                🏷️ Categoría
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${gridConfig.cardDesign?.contentConfig?.showDescription !== false ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 line-through'}`}>
                📝 Descripción
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${gridConfig.cardDesign?.contentConfig?.showFeatures !== false ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 line-through'}`}>
                ✓ Características
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${gridConfig.cardDesign?.contentConfig?.showPrice !== false ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 line-through'}`}>
                💰 Precio
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${gridConfig.cardDesign?.contentConfig?.showTags ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 line-through'}`}>
                #️⃣ Tags
              </span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default ServicesGridConfigSection;
