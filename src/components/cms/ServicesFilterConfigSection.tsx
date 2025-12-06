/**
 * 🔍 CONFIGURACIÓN DE FILTROS DE SERVICIOS
 * Permite personalizar la sección de filtros en la página de servicios
 */

import React, { useState } from 'react';
import type { PageData } from '../../types/cms';

interface ServicesFilterConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
}

const ServicesFilterConfigSection: React.FC<ServicesFilterConfigSectionProps> = ({
  pageData,
  updateContent
}) => {
  const [collapsed, setCollapsed] = useState(false);

  // Obtener configuración actual o usar valores por defecto
  const filterConfig = (pageData?.content as any)?.servicesFilter || {
    // Sección de búsqueda
    searchTitle: 'BUSCAR',
    searchDescription: 'Escribe aquí para encontrar el servicio que necesitas...',
    searchPlaceholder: 'Busca un servicio...',
    
    // Sección de categorías
    categoriesTitle: 'CATEGORÍAS',
    showAllCategoriesText: 'Todas las categorías',
    
    // Sección de ordenamiento
    sortTitle: 'ORDENAR',
    sortOptions: [
      { value: 'destacado', label: '⭐ Destacados', icon: '⭐' },
      { value: 'nuevo', label: '🆕 Recientes', icon: '🆕' },
      { value: 'titulo', label: '🔤 A-Z', icon: '🔤' },
      { value: 'precio-asc', label: '💰 Menor precio', icon: '💰' },
      { value: 'precio-desc', label: '💎 Mayor precio', icon: '💎' }
    ],
    
    // Resultados
    resultsText: 'Resultados:',
    
    // Estilos
    styles: {
      // Borde del contenedor - Modo Claro
      borderStyle: 'gradient', // 'solid', 'gradient', 'none'
      borderGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
      borderColor: '#8B5CF6',
      borderGradientFrom: '#8B5CF6',
      borderGradientTo: '#06B6D4',
      borderGradientDirection: '135deg',
      // Borde del contenedor - Modo Oscuro
      borderStyleDark: 'gradient',
      borderGradientDark: 'linear-gradient(135deg, #A78BFA, #22D3EE)',
      borderColorDark: '#A78BFA',
      borderGradientFromDark: '#A78BFA',
      borderGradientToDark: '#22D3EE',
      borderGradientDirectionDark: '135deg',
      // Configuración general del borde
      borderWidth: '2px',
      borderRadius: '1rem',
      
      // Fondo
      backgroundColor: '#ffffff',
      backgroundColorDark: '#1e293b',
      
      // Títulos de sección
      sectionTitleColor: '#8B5CF6',
      sectionTitleColorDark: '#A78BFA',
      
      // Texto
      textColor: '#374151',
      textColorDark: '#D1D5DB',
      
      // Categoría activa
      activeCategoryBg: 'rgba(139, 92, 246, 0.1)',
      activeCategoryBgDark: 'rgba(139, 92, 246, 0.2)',
      activeCategoryText: '#8B5CF6',
      activeCategoryTextDark: '#A78BFA',
      activeCategoryBorder: '#8B5CF6',
      activeCategoryBorderDark: '#A78BFA'
    }
  };

  const handleUpdateFilter = (field: string, value: any) => {
    updateContent(`servicesFilter.${field}`, value);
  };

  const handleUpdateStyle = (field: string, value: string) => {
    updateContent(`servicesFilter.styles.${field}`, value);
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
      {/* Encabezado colapsable */}
      <button
        type="button"
        className="w-full flex items-center justify-between text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded transition-colors"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-expanded={!collapsed}
      >
        <span className="flex items-center gap-2">
          🔍 Configuración de Filtros de Servicios
        </span>
        <span className="ml-2 text-lg">
          {collapsed ? '▼ Mostrar' : '▲ Ocultar'}
        </span>
      </button>

      {!collapsed && (
        <div className="space-y-8">
          
          {/* ===== SECCIÓN DE BÚSQUEDA ===== */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              🔎 Sección de Búsqueda
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Título de la sección
                </label>
                <input
                  type="text"
                  value={filterConfig.searchTitle}
                  onChange={(e) => handleUpdateFilter('searchTitle', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="BUSCAR"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Placeholder del input
                </label>
                <input
                  type="text"
                  value={filterConfig.searchPlaceholder}
                  onChange={(e) => handleUpdateFilter('searchPlaceholder', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Busca un servicio..."
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Descripción debajo del título
                </label>
                <input
                  type="text"
                  value={filterConfig.searchDescription}
                  onChange={(e) => handleUpdateFilter('searchDescription', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Escribe aquí para encontrar el servicio..."
                />
              </div>
            </div>
          </div>

          {/* ===== SECCIÓN DE CATEGORÍAS ===== */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              📂 Sección de Categorías
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Título de la sección
                </label>
                <input
                  type="text"
                  value={filterConfig.categoriesTitle}
                  onChange={(e) => handleUpdateFilter('categoriesTitle', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="CATEGORÍAS"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Texto "Todas las categorías"
                </label>
                <input
                  type="text"
                  value={filterConfig.showAllCategoriesText}
                  onChange={(e) => handleUpdateFilter('showAllCategoriesText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Todas las categorías"
                />
              </div>
            </div>
          </div>

          {/* ===== SECCIÓN DE ORDENAMIENTO ===== */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              📊 Sección de Ordenamiento
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Título de la sección
                </label>
                <input
                  type="text"
                  value={filterConfig.sortTitle}
                  onChange={(e) => handleUpdateFilter('sortTitle', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="ORDENAR"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Texto de resultados
                </label>
                <input
                  type="text"
                  value={filterConfig.resultsText}
                  onChange={(e) => handleUpdateFilter('resultsText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Resultados:"
                />
              </div>
            </div>
          </div>

          {/* ===== ESTILOS VISUALES ===== */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              🎨 Estilos del Panel de Filtros
            </h3>
            
            {/* Configuración del borde por tema */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Modo Claro */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  ☀️ Borde - Modo Claro
                </h4>
                
                <div className="space-y-3">
                  {/* Tipo de borde */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Tipo de borde
                    </label>
                    <select
                      value={filterConfig.styles?.borderStyle || 'gradient'}
                      onChange={(e) => handleUpdateStyle('borderStyle', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="gradient">✨ Gradiente</option>
                      <option value="solid">▬ Sólido</option>
                      <option value="none">○ Sin borde</option>
                    </select>
                  </div>
                  
                  {filterConfig.styles?.borderStyle === 'gradient' ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Color Inicio</label>
                          <div className="flex gap-1">
                            <input
                              type="color"
                              value={filterConfig.styles?.borderGradientFrom || '#8B5CF6'}
                              onChange={(e) => handleUpdateStyle('borderGradientFrom', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={filterConfig.styles?.borderGradientFrom || '#8B5CF6'}
                              onChange={(e) => handleUpdateStyle('borderGradientFrom', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Color Fin</label>
                          <div className="flex gap-1">
                            <input
                              type="color"
                              value={filterConfig.styles?.borderGradientTo || '#06B6D4'}
                              onChange={(e) => handleUpdateStyle('borderGradientTo', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={filterConfig.styles?.borderGradientTo || '#06B6D4'}
                              onChange={(e) => handleUpdateStyle('borderGradientTo', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Dirección</label>
                        <select
                          value={filterConfig.styles?.borderGradientDirection || '135deg'}
                          onChange={(e) => handleUpdateStyle('borderGradientDirection', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="90deg">Horizontal →</option>
                          <option value="180deg">Vertical ↓</option>
                          <option value="135deg">Diagonal ↘</option>
                          <option value="45deg">Diagonal ↗</option>
                          <option value="270deg">Vertical ↑</option>
                          <option value="0deg">Horizontal ←</option>
                        </select>
                      </div>
                      {/* Vista previa */}
                      <div 
                        className="h-3 rounded-full"
                        style={{
                          background: `linear-gradient(${filterConfig.styles?.borderGradientDirection || '135deg'}, ${filterConfig.styles?.borderGradientFrom || '#8B5CF6'}, ${filterConfig.styles?.borderGradientTo || '#06B6D4'})`
                        }}
                      />
                    </div>
                  ) : filterConfig.styles?.borderStyle === 'solid' ? (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Color del borde</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={filterConfig.styles?.borderColor || '#8B5CF6'}
                          onChange={(e) => handleUpdateStyle('borderColor', e.target.value)}
                          className="w-10 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={filterConfig.styles?.borderColor || '#8B5CF6'}
                          onChange={(e) => handleUpdateStyle('borderColor', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              
              {/* Modo Oscuro */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  🌙 Borde - Modo Oscuro
                </h4>
                
                <div className="space-y-3">
                  {/* Tipo de borde */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Tipo de borde
                    </label>
                    <select
                      value={filterConfig.styles?.borderStyleDark || 'gradient'}
                      onChange={(e) => handleUpdateStyle('borderStyleDark', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="gradient">✨ Gradiente</option>
                      <option value="solid">▬ Sólido</option>
                      <option value="none">○ Sin borde</option>
                    </select>
                  </div>
                  
                  {filterConfig.styles?.borderStyleDark === 'gradient' || (filterConfig.styles?.borderStyleDark === undefined && filterConfig.styles?.borderStyle === 'gradient') ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Color Inicio</label>
                          <div className="flex gap-1">
                            <input
                              type="color"
                              value={filterConfig.styles?.borderGradientFromDark || '#A78BFA'}
                              onChange={(e) => handleUpdateStyle('borderGradientFromDark', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={filterConfig.styles?.borderGradientFromDark || '#A78BFA'}
                              onChange={(e) => handleUpdateStyle('borderGradientFromDark', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Color Fin</label>
                          <div className="flex gap-1">
                            <input
                              type="color"
                              value={filterConfig.styles?.borderGradientToDark || '#22D3EE'}
                              onChange={(e) => handleUpdateStyle('borderGradientToDark', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={filterConfig.styles?.borderGradientToDark || '#22D3EE'}
                              onChange={(e) => handleUpdateStyle('borderGradientToDark', e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Dirección</label>
                        <select
                          value={filterConfig.styles?.borderGradientDirectionDark || '135deg'}
                          onChange={(e) => handleUpdateStyle('borderGradientDirectionDark', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="90deg">Horizontal →</option>
                          <option value="180deg">Vertical ↓</option>
                          <option value="135deg">Diagonal ↘</option>
                          <option value="45deg">Diagonal ↗</option>
                          <option value="270deg">Vertical ↑</option>
                          <option value="0deg">Horizontal ←</option>
                        </select>
                      </div>
                      {/* Vista previa */}
                      <div 
                        className="h-3 rounded-full"
                        style={{
                          background: `linear-gradient(${filterConfig.styles?.borderGradientDirectionDark || '135deg'}, ${filterConfig.styles?.borderGradientFromDark || '#A78BFA'}, ${filterConfig.styles?.borderGradientToDark || '#22D3EE'})`
                        }}
                      />
                    </div>
                  ) : filterConfig.styles?.borderStyleDark === 'solid' ? (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Color del borde</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={filterConfig.styles?.borderColorDark || '#A78BFA'}
                          onChange={(e) => handleUpdateStyle('borderColorDark', e.target.value)}
                          className="w-10 h-8 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={filterConfig.styles?.borderColorDark || '#A78BFA'}
                          onChange={(e) => handleUpdateStyle('borderColorDark', e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            
            {/* Configuración general del borde */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Ancho del borde */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Ancho del borde
                </label>
                <select
                  value={filterConfig.styles?.borderWidth || '2px'}
                  onChange={(e) => handleUpdateStyle('borderWidth', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="1px">1px - Fino</option>
                  <option value="2px">2px - Normal</option>
                  <option value="3px">3px - Grueso</option>
                  <option value="4px">4px - Extra grueso</option>
                </select>
              </div>
              
              {/* Radio del borde */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Radio del borde
                </label>
                <select
                  value={filterConfig.styles?.borderRadius || '1rem'}
                  onChange={(e) => handleUpdateStyle('borderRadius', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="0">Sin redondeo</option>
                  <option value="0.5rem">Pequeño</option>
                  <option value="1rem">Normal</option>
                  <option value="1.5rem">Grande</option>
                  <option value="2rem">Extra grande</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Color de título de sección */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Color de títulos (claro)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={filterConfig.styles?.sectionTitleColor || '#8B5CF6'}
                    onChange={(e) => handleUpdateStyle('sectionTitleColor', e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={filterConfig.styles?.sectionTitleColor || '#8B5CF6'}
                    onChange={(e) => handleUpdateStyle('sectionTitleColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              {/* Color de título de sección (oscuro) */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Color de títulos (oscuro)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={filterConfig.styles?.sectionTitleColorDark || '#A78BFA'}
                    onChange={(e) => handleUpdateStyle('sectionTitleColorDark', e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={filterConfig.styles?.sectionTitleColorDark || '#A78BFA'}
                    onChange={(e) => handleUpdateStyle('sectionTitleColorDark', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              {/* Radio del borde */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Redondeo del borde
                </label>
                <select
                  value={filterConfig.styles?.borderRadius || '1rem'}
                  onChange={(e) => handleUpdateStyle('borderRadius', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="0.5rem">Pequeño</option>
                  <option value="1rem">Normal</option>
                  <option value="1.5rem">Grande</option>
                  <option value="2rem">Extra grande</option>
                </select>
              </div>
            </div>
          </div>

          {/* ===== TIPOGRAFÍA DEL PANEL ===== */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              🔤 Tipografía del Panel de Filtros
            </h3>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-4">
              <p className="text-sm text-purple-700 dark:text-purple-300">
                💡 <strong>Consejo:</strong> Selecciona la fuente que mejor represente tu marca. 
                Montserrat es moderna y profesional, Playfair Display es elegante.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Fuente para títulos */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Fuente de títulos
                </label>
                <select
                  value={filterConfig.styles?.titleFontFamily || 'inherit'}
                  onChange={(e) => handleUpdateStyle('titleFontFamily', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  style={{ fontFamily: filterConfig.styles?.titleFontFamily || 'inherit' }}
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

              {/* Fuente para contenido */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Fuente de contenido
                </label>
                <select
                  value={filterConfig.styles?.contentFontFamily || 'inherit'}
                  onChange={(e) => handleUpdateStyle('contentFontFamily', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  style={{ fontFamily: filterConfig.styles?.contentFontFamily || 'inherit' }}
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
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Vista previa
                </label>
                <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
                  <p 
                    className="text-sm font-bold uppercase tracking-wide mb-1"
                    style={{ 
                      fontFamily: filterConfig.styles?.titleFontFamily || 'inherit',
                      color: filterConfig.styles?.sectionTitleColor || '#8B5CF6'
                    }}
                  >
                    BUSCAR
                  </p>
                  <p 
                    className="text-xs text-gray-600 dark:text-gray-400"
                    style={{ fontFamily: filterConfig.styles?.contentFontFamily || 'inherit' }}
                  >
                    Texto de ejemplo para contenido
                  </p>
                </div>
              </div>
            </div>

            {/* Peso de fuente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Peso de títulos
                </label>
                <select
                  value={filterConfig.styles?.titleFontWeight || '700'}
                  onChange={(e) => handleUpdateStyle('titleFontWeight', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Peso de contenido
                </label>
                <select
                  value={filterConfig.styles?.contentFontWeight || '400'}
                  onChange={(e) => handleUpdateStyle('contentFontWeight', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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

          {/* ===== TAMAÑO DEL PANEL ===== */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              📐 Tamaño del Panel de Filtros
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Ancho del panel */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Ancho del panel
                </label>
                <select
                  value={filterConfig.styles?.panelWidth || '20rem'}
                  onChange={(e) => handleUpdateStyle('panelWidth', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="16rem">Compacto (256px)</option>
                  <option value="18rem">Pequeño (288px)</option>
                  <option value="20rem">Normal (320px)</option>
                  <option value="22rem">Grande (352px)</option>
                  <option value="24rem">Extra grande (384px)</option>
                </select>
              </div>

              {/* Padding interno */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Padding interno
                </label>
                <select
                  value={filterConfig.styles?.panelPadding || '1.5rem'}
                  onChange={(e) => handleUpdateStyle('panelPadding', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="1rem">Compacto (16px)</option>
                  <option value="1.25rem">Pequeño (20px)</option>
                  <option value="1.5rem">Normal (24px)</option>
                  <option value="2rem">Grande (32px)</option>
                  <option value="2.5rem">Extra grande (40px)</option>
                </select>
              </div>

              {/* Espaciado entre secciones */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Espaciado entre secciones
                </label>
                <select
                  value={filterConfig.styles?.sectionGap || '1.5rem'}
                  onChange={(e) => handleUpdateStyle('sectionGap', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="1rem">Compacto (16px)</option>
                  <option value="1.5rem">Normal (24px)</option>
                  <option value="2rem">Amplio (32px)</option>
                  <option value="2.5rem">Extra amplio (40px)</option>
                </select>
              </div>

              {/* Altura mínima */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Altura mínima
                </label>
                <select
                  value={filterConfig.styles?.minHeight || 'auto'}
                  onChange={(e) => handleUpdateStyle('minHeight', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="auto">Automática</option>
                  <option value="400px">Pequeña (400px)</option>
                  <option value="500px">Normal (500px)</option>
                  <option value="600px">Grande (600px)</option>
                  <option value="700px">Extra grande (700px)</option>
                  <option value="100%">Altura completa</option>
                </select>
              </div>
            </div>

            {/* Configuración adicional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Posición sticky */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Posición fija (sticky)
                </label>
                <select
                  value={filterConfig.styles?.stickyTop || '6rem'}
                  onChange={(e) => handleUpdateStyle('stickyTop', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="4rem">Muy arriba (64px)</option>
                  <option value="5rem">Arriba (80px)</option>
                  <option value="6rem">Normal (96px)</option>
                  <option value="7rem">Abajo (112px)</option>
                  <option value="8rem">Muy abajo (128px)</option>
                </select>
              </div>

              {/* Sombra */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Sombra
                </label>
                <select
                  value={filterConfig.styles?.shadow || 'none'}
                  onChange={(e) => handleUpdateStyle('shadow', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="none">Sin sombra</option>
                  <option value="sm">Sutil</option>
                  <option value="md">Normal</option>
                  <option value="lg">Grande</option>
                  <option value="xl">Extra grande</option>
                </select>
              </div>
            </div>
          </div>

          {/* ===== VISTA PREVIA ===== */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              👁️ Vista Previa del Panel
            </h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Vista previa del panel de filtros con la configuración actual:
              </p>
              <div 
                className="bg-white dark:bg-gray-800 overflow-hidden"
                style={{
                  width: filterConfig.styles?.panelWidth || '20rem',
                  maxWidth: '100%',
                  minHeight: filterConfig.styles?.minHeight === 'auto' ? undefined : filterConfig.styles?.minHeight,
                  padding: filterConfig.styles?.panelPadding || '1.5rem',
                  borderRadius: filterConfig.styles?.borderRadius || '1rem',
                  border: filterConfig.styles?.borderStyle === 'none' 
                    ? 'none' 
                    : filterConfig.styles?.borderStyle === 'gradient'
                      ? `${filterConfig.styles?.borderWidth || '2px'} solid transparent`
                      : `${filterConfig.styles?.borderWidth || '2px'} solid ${filterConfig.styles?.borderColor || '#8B5CF6'}`,
                  backgroundImage: filterConfig.styles?.borderStyle === 'gradient'
                    ? `linear-gradient(white, white), ${filterConfig.styles?.borderGradient || 'linear-gradient(135deg, #8B5CF6, #06B6D4)'}`
                    : undefined,
                  backgroundOrigin: 'border-box',
                  backgroundClip: filterConfig.styles?.borderStyle === 'gradient' ? 'padding-box, border-box' : undefined,
                  boxShadow: filterConfig.styles?.shadow === 'none' ? 'none' :
                             filterConfig.styles?.shadow === 'sm' ? '0 1px 2px rgba(0,0,0,0.05)' :
                             filterConfig.styles?.shadow === 'md' ? '0 4px 6px rgba(0,0,0,0.1)' :
                             filterConfig.styles?.shadow === 'lg' ? '0 10px 15px rgba(0,0,0,0.1)' :
                             filterConfig.styles?.shadow === 'xl' ? '0 20px 25px rgba(0,0,0,0.15)' : 'none'
                }}
              >
                {/* Sección Buscar */}
                <div style={{ marginBottom: filterConfig.styles?.sectionGap || '1.5rem' }}>
                  <p 
                    className="text-sm font-bold uppercase tracking-wide mb-1"
                    style={{ color: filterConfig.styles?.sectionTitleColor || '#8B5CF6' }}
                  >
                    {filterConfig.searchTitle || 'BUSCAR'}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    {filterConfig.searchDescription || 'Escribe aquí para encontrar...'}
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-400">
                    🔍 {filterConfig.searchPlaceholder || 'Busca un servicio...'}
                  </div>
                </div>

                {/* Sección Categorías */}
                <div style={{ marginBottom: filterConfig.styles?.sectionGap || '1.5rem' }}>
                  <p 
                    className="text-sm font-bold uppercase tracking-wide mb-2"
                    style={{ color: filterConfig.styles?.sectionTitleColor || '#8B5CF6' }}
                  >
                    {filterConfig.categoriesTitle || 'CATEGORÍAS'}
                  </p>
                  <div className="space-y-1">
                    <div className="px-3 py-1.5 rounded-lg text-sm text-purple-600 bg-purple-50">
                      {filterConfig.showAllCategoriesText || 'Todas las categorías'}
                    </div>
                    <div className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                      Desarrollo
                    </div>
                    <div className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                      Diseño
                    </div>
                  </div>
                </div>

                {/* Sección Ordenar */}
                <div>
                  <p 
                    className="text-sm font-bold uppercase tracking-wide mb-2"
                    style={{ color: filterConfig.styles?.sectionTitleColor || '#8B5CF6' }}
                  >
                    {filterConfig.sortTitle || 'ORDENAR'}
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-600 flex justify-between">
                    <span>⭐ Destacados</span>
                    <span>▼</span>
                  </div>
                </div>

                {/* Resultados */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
                  <span className="text-gray-500">{filterConfig.resultsText || 'Resultados:'}</span>
                  <span className="font-bold text-gray-900">10 de 10</span>
                </div>
              </div>
              
              {/* Información del tamaño */}
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                  📏 Ancho: {filterConfig.styles?.panelWidth || '20rem'}
                </span>
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                  📦 Padding: {filterConfig.styles?.panelPadding || '1.5rem'}
                </span>
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                  ↕️ Gap: {filterConfig.styles?.sectionGap || '1.5rem'}
                </span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default ServicesFilterConfigSection;
