/**
 * 🔍 MESSAGE FILTERS - Filtros y Búsqueda de Mensajes
 * Componente para filtrar mensajes por diferentes criterios
 */

import React, { useState, useEffect } from 'react';
import type { MessageFilters as IMessageFilters, MessageType, MessageStats } from '../../../types/message.types';
import { MESSAGE_TYPE_LABELS } from '../../../types/message.types';

interface MessageFiltersProps {
  onFilterChange: (filters: IMessageFilters) => void;
  currentFilters: IMessageFilters;
  stats?: MessageStats;
  showPrivateFilter?: boolean;
  showDateFilter?: boolean;
  compact?: boolean;
}

/**
 * 🎨 Componente MessageFiltersComponent
 */
export const MessageFiltersComponent: React.FC<MessageFiltersProps> = ({
  onFilterChange,
  currentFilters,
  stats,
  showPrivateFilter = true,
  showDateFilter = false,
  compact = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || '');
  const [isExpanded, setIsExpanded] = useState(!compact);

  // ========================================
  // 🔄 EFECTOS
  // ========================================

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== currentFilters.search) {
        handleFilterChange({ search: searchTerm || undefined });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ========================================
  // 🔄 HANDLERS
  // ========================================

  const handleFilterChange = (newFilters: Partial<IMessageFilters>) => {
    onFilterChange({
      ...currentFilters,
      ...newFilters,
      page: 1, // Reset a primera página al filtrar
    });
  };

  const handleTipoChange = (tipo: MessageType | 'all') => {
    handleFilterChange({ tipo });
  };

  const handleLeidoChange = (leido: boolean | undefined) => {
    handleFilterChange({ leido });
  };

  const handlePrivadoChange = (incluirPrivados: boolean) => {
    handleFilterChange({ incluirPrivados });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    onFilterChange({
      page: 1,
      limit: currentFilters.limit || 50,
    });
  };

  // ========================================
  // 📊 HELPERS
  // ========================================

  const hasActiveFilters = () => {
    return !!(
      currentFilters.search ||
      (currentFilters.tipo && currentFilters.tipo !== 'all') ||
      currentFilters.leido !== undefined ||
      currentFilters.incluirPrivados
    );
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (currentFilters.search) count++;
    if (currentFilters.tipo && currentFilters.tipo !== 'all') count++;
    if (currentFilters.leido !== undefined) count++;
    if (currentFilters.incluirPrivados) count++;
    return count;
  };

  // ========================================
  // 🎨 RENDER COMPACT
  // ========================================

  if (compact && !isExpanded) {
    return (
      <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        {/* Búsqueda compacta */}
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Buscar mensajes..."
            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Botón expandir */}
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-1"
        >
          <span>⚙️</span>
          Filtros
          {hasActiveFilters() && (
            <span className="ml-1 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </button>
      </div>
    );
  }

  // ========================================
  // 🎨 RENDER FULL
  // ========================================

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <span>🔍</span>
          Filtros y Búsqueda
        </h3>

        <div className="flex items-center gap-2">
          {/* Contador de filtros activos */}
          {hasActiveFilters() && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
              {getActiveFilterCount()} activo(s)
            </span>
          )}

          {/* Botones */}
          {compact && (
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
            >
              ▼
            </button>
          )}
        </div>
      </div>

      {/* Estadísticas (si están disponibles) */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {stats.total}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              {stats.noLeidos}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">No leídos</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {stats.enviados}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Enviados</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {stats.respondidos}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Respondidos</div>
          </div>
        </div>
      )}

      {/* Búsqueda de texto */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Buscar por texto
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar en asunto o contenido..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              ✖
            </button>
          )}
        </div>
      </div>

      {/* Tipo de mensaje */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tipo de mensaje
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleTipoChange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !currentFilters.tipo || currentFilters.tipo === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            🌐 Todos
          </button>
          {Object.entries(MESSAGE_TYPE_LABELS).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleTipoChange(key as MessageType)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentFilters.tipo === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Estado de lectura */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
          Estado de lectura
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleLeidoChange(undefined)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentFilters.leido === undefined
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            🌐 Todos
          </button>
          <button
            type="button"
            onClick={() => handleLeidoChange(false)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentFilters.leido === false
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            🔔 No leídos
          </button>
          <button
            type="button"
            onClick={() => handleLeidoChange(true)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentFilters.leido === true
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            ✅ Leídos
          </button>
        </div>
      </div>

      {/* Mensajes privados */}
      {showPrivateFilter && (
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={currentFilters.incluirPrivados || false}
              onChange={(e) => handlePrivadoChange(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              🔒 Incluir mensajes privados (notas internas)
            </span>
          </label>
        </div>
      )}

      {/* Fechas (opcional) */}
      {showDateFilter && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Desde
            </label>
            <input
              type="date"
              value={currentFilters.desde || ''}
              onChange={(e) =>
                handleFilterChange({ desde: e.target.value || undefined })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hasta
            </label>
            <input
              type="date"
              value={currentFilters.hasta || ''}
              onChange={(e) =>
                handleFilterChange({ hasta: e.target.value || undefined })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm"
            />
          </div>
        </div>
      )}

      {/* Acciones */}
      {hasActiveFilters() && (
        <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            🗑️ Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageFiltersComponent;
