/**
 * 📋 GESTIÓN DE SERVICIOS OPTIMIZADA
 * Versión mejorada con lazy loading, paginación virtual y caché
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServicios } from '../../hooks/useServicios';
import { useNotification } from '../../hooks/useNotification';
import { useVirtualPagination } from '../../hooks/useVirtualPagination';
import { useAuth } from '../../contexts/AuthContext';
import { FiltersPanel } from '../../components/servicios/FiltersPanel';
import { SortSelector } from '../../components/servicios/SortSelector';
import { ServicioCard } from '../../components/servicios/ServicioCard';
import { SearchWithAutocomplete } from '../../components/common/SearchWithAutocomplete';
import { PaginationControls } from '../../components/common/PaginationControls';
import { SkeletonGrid } from '../../components/common/Skeleton';
import { CreateServicioModal } from '../../components/servicios/CreateServicioModal';
import GestionCategoriasModal from '../../components/servicios/GestionCategoriasModal';
import type { ServicioFilters, SortOption } from '../../types/filters';
import { SORT_OPTIONS } from '../../types/filters';
import type { Servicio } from '../../types/servicios';

// ============================================
// ICONOS
// ============================================

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ListIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const ServiciosManagementOptimized = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const { shouldUseClientDashboard } = useAuth();

  // Determinar la ruta correcta del dashboard según el tipo de usuario
  const dashboardPath = shouldUseClientDashboard ? '/dashboard/client' : '/dashboard/admin';

  // ============================================
  // ESTADOS
  // ============================================

  const [filters, setFilters] = useState<ServicioFilters>({});
  const [currentSort, setCurrentSort] = useState<SortOption>(SORT_OPTIONS[0]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);

  // ============================================
  // HOOKS
  // ============================================

  const {
    servicios,
    loading,
    error,
    deleteServicio: deleteServicioHook,
    duplicateServicio: duplicateServicioHook,
    refresh
  } = useServicios({ autoFetch: true });

  // ============================================
  // FILTRADO Y ORDENAMIENTO CON MEMOIZATION
  // ============================================

  const serviciosFiltrados = useMemo(() => {
    let filtered = [...servicios];

    // Búsqueda por texto
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.titulo.toLowerCase().includes(search) ||
        s.descripcion?.toLowerCase().includes(search) ||
        s.descripcionCorta?.toLowerCase().includes(search) ||
        s.etiquetas?.some(t => t.toLowerCase().includes(search))
      );
    }

    // Aplicar filtros
    if (filters.categorias?.length) {
      filtered = filtered.filter(s => filters.categorias?.includes(s.categoria));
    }

    if (filters.precioMin !== undefined) {
      filtered = filtered.filter(s => s.precio !== undefined && s.precio >= filters.precioMin!);
    }

    if (filters.precioMax !== undefined) {
      filtered = filtered.filter(s => s.precio !== undefined && s.precio <= filters.precioMax!);
    }

    if (filters.tipoPrecio?.length) {
      filtered = filtered.filter(s => filters.tipoPrecio?.includes(s.tipoPrecio as any));
    }

    if (filters.estado?.length) {
      filtered = filtered.filter(s => filters.estado?.includes(s.estado as any));
    }

    if (filters.destacado === true) {
      filtered = filtered.filter(s => s.destacado === true);
    }

    if (filters.activo === true) {
      filtered = filtered.filter(s => s.activo === true);
    }

    if (filters.visibleEnWeb === true) {
      filtered = filtered.filter(s => s.visibleEnWeb === true);
    }

    // Ordenar
    filtered.sort((a, b) => {
      const { field, order } = currentSort;
      let aValue: any = a[field as keyof Servicio];
      let bValue: any = b[field as keyof Servicio];

      if (field === 'createdAt' || field === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [servicios, searchTerm, filters, currentSort]);

  // ============================================
  // PAGINACIÓN VIRTUAL
  // ============================================

  const {
    pageData,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    itemsPerPage,
    setItemsPerPage,
    startIndex,
    endIndex,
    totalItems
  } = useVirtualPagination({
    data: serviciosFiltrados,
    itemsPerPage: 12,
    initialPage: 1
  });

  // ============================================
  // CONTADOR DE FILTROS ACTIVOS
  // ============================================

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categorias?.length) count++;
    if (filters.precioMin !== undefined) count++;
    if (filters.precioMax !== undefined) count++;
    if (filters.tipoPrecio?.length) count++;
    if (filters.estado?.length) count++;
    if (filters.destacado) count++;
    if (filters.activo) count++;
    if (filters.visibleEnWeb) count++;
    return count;
  }, [filters]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleEdit = (id: string) => {
    navigate(`/dashboard/servicios/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      try {
        await deleteServicioHook(id);
        success('Servicio eliminado exitosamente');
      } catch (err) {
        showError('Error al eliminar el servicio');
      }
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateServicioHook(id);
      success('Servicio duplicado exitosamente');
    } catch (err) {
      showError('Error al duplicar el servicio');
    }
  };

  const handleResetFilters = () => {
    setFilters({});
    setSearchTerm('');
    goToPage(1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              {/* Breadcrumb Navigation */}
              <nav className="flex items-center gap-1 sm:gap-2 mb-3" aria-label="Breadcrumb">
                <button
                  onClick={() => navigate(dashboardPath)}
                  className="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                >
                  <ArrowLeftIcon />
                  <span className="hidden xs:inline">
                    {shouldUseClientDashboard ? 'Panel Cliente' : 'Dashboard Admin'}
                  </span>
                  <span className="xs:hidden">🏠</span>
                </button>
                <span className="text-gray-400 dark:text-gray-600 text-sm">/</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white px-2 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  📋 <span className="hidden sm:inline">Gestión de </span>Servicios
                </span>
              </nav>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                📋 Gestión de Servicios
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {totalItems} servicios totales
                {activeFiltersCount > 0 && ` • ${activeFiltersCount} filtro${activeFiltersCount > 1 ? 's' : ''} activo${activeFiltersCount > 1 ? 's' : ''}`}
              </p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50 flex-shrink-0"
                title="Refrescar"
              >
                <RefreshIcon />
                <span className="hidden sm:inline">Refrescar</span>
              </button>
              
              <button
                onClick={() => setShowCategoriesModal(true)}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm flex-shrink-0"
                title="Gestionar Categorías"
              >
                <span>🏷️</span>
                <span className="hidden md:inline">Categorías</span>
                <span className="hidden lg:inline">Gestionar Categorías</span>
              </button>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-sm flex-1 sm:flex-none justify-center sm:justify-start"
              >
                <PlusIcon />
                <span className="hidden sm:inline">Nuevo Servicio</span>
                <span className="sm:hidden">Nuevo</span>
              </button>
            </div>
          </div>

          {/* Barra de búsqueda */}
          <SearchWithAutocomplete
            servicios={servicios}
            onSearch={setSearchTerm}
            placeholder="Buscar servicios..."
            className="mb-4"
          />

          {/* Controles */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 relative
                ${showFilters
                  ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
              title={showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
            >
              <FilterIcon />
              <span className="hidden sm:inline">Filtros</span>
              <span className="sm:hidden">{showFilters ? 'Ocultar' : 'Filtros'}</span>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                  {activeFiltersCount}
                </span>
              )}
              {/* Indicador visual de estado en móvil */}
              {showFilters && (
                <span className="lg:hidden absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></span>
              )}
            </button>

            <SortSelector
              currentSort={currentSort}
              onSortChange={setCurrentSort}
            />

            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`
                  p-2 rounded-lg transition-colors
                  ${viewMode === 'grid'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
                title="Vista en cuadrícula"
              >
                <GridIcon />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`
                  p-2 rounded-lg transition-colors
                  ${viewMode === 'list'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
                title="Vista en lista"
              >
                <ListIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Layout con Filtros y Contenido lado a lado */}
        <div className="flex flex-col lg:flex-row gap-6 relative">
          {/* Panel de filtros - Sidebar */}
          <div className={`
            ${showFilters ? 'block' : 'hidden'} lg:block
            w-full lg:w-80 flex-shrink-0
          `}>
            <div className="lg:sticky lg:top-6">
              <FiltersPanel
                filters={filters}
                onFiltersChange={setFilters}
                onClose={() => setShowFilters(false)}
                isOpen={showFilters}
                resultCount={totalItems}
              />
            </div>
          </div>

          {/* Contenido principal */}
          <div className={`
            flex-1 min-w-0 
            ${showFilters ? 'lg:ml-0' : 'lg:ml-0'}
          `}>
            {/* Contenido */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {loading ? (
              <SkeletonGrid items={12} columns={viewMode === 'grid' ? 3 : 1} />
            ) : pageData.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No se encontraron servicios
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm || activeFiltersCount > 0
                    ? 'Intenta ajustar los filtros o la búsqueda'
                    : 'Comienza creando tu primer servicio'
                  }
                </p>
                {(searchTerm || activeFiltersCount > 0) && (
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Grid/List de servicios - LAYOUT MEJORADO */}
                <div className={`
                  ${viewMode === 'grid'
                    ? showFilters 
                      ? 'grid grid-cols-1 xl:grid-cols-2 gap-6'
                      : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                  }
                  mb-6
                `}>
                  {pageData.map((servicio) => (
                    <ServicioCard
                      key={servicio._id}
                      servicio={servicio}
                      onEdit={() => handleEdit(servicio._id)}
                      onDelete={() => handleDelete(servicio._id)}
                      onDuplicate={() => handleDuplicate(servicio._id)}
                      showActions={true}
                      viewMode="admin"
                    />
                  ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                    className="mt-6"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de crear servicio */}
      <CreateServicioModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={async () => {
          setShowCreateModal(false);
          await refresh(); // Refrescar sin recargar toda la página
          success('Servicio creado', 'El servicio se agregó correctamente');
        }}
      />

      {/* Modal de gestión de categorías */}
      <GestionCategoriasModal
        isOpen={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
        onCategoryChange={async () => {
          await refresh(); // Refrescar servicios cuando cambian las categorías
        }}
      />
    </div>
  );
};

export default ServiciosManagementOptimized;
