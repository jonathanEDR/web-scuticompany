/**
 * 📋 GESTIÓN DE SERVICIOS OPTIMIZADA
 * Versión mejorada con lazy loading, paginación virtual y caché
 * 
 * 🎯 Integraciones:
 * - Services Canvas para análisis y optimización con IA
 * - Acciones rápidas desde las tarjetas de servicio
 */

import { useState, useMemo, useEffect, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServicios } from '../../hooks/useServicios';
import { useNotification } from '../../hooks/useNotification';
import { useLoadMore } from '../../hooks/useLoadMore';
import { useAuth } from '../../contexts/AuthContext';
import { useServicesManagementCache } from '../../hooks/useServicesManagementCache';
import { FiltersPanel } from '../../components/servicios/FiltersPanel';
import { SortSelector } from '../../components/servicios/SortSelector';
import { ServicioCard } from '../../components/servicios/ServicioCard';
import { SearchWithAutocomplete } from '../../components/common/SearchWithAutocomplete';
import { SkeletonGrid } from '../../components/common/Skeleton';
import { CreateServicioModal } from '../../components/servicios/CreateServicioModal';
import GestionCategoriasModal from '../../components/servicios/GestionCategoriasModal';
import ServicesCanvasModal from '../../components/admin/services/ServicesCanvasModal';
import useServicesCanvas, { servicioToServiceContext } from '../../hooks/useServicesCanvas'; // 🆕 Importar convertidor
import type { ServicioFilters, SortOption } from '../../types/filters';
import { SORT_OPTIONS } from '../../types/filters';
import type { Servicio } from '../../types/servicios';
import { useDashboardHeaderGradient } from '../../hooks/cms/useDashboardHeaderGradient';
import {
  Sparkles,
  Plus,
  Filter,
  LayoutGrid,
  List,
  RefreshCw,
  ArrowLeft,
  Home,
  ClipboardList,
  Tag,
  Search,
  ChevronDown,
  Check,
} from 'lucide-react';

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const ServiciosManagementOptimized = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const { shouldUseClientDashboard } = useAuth();

  // Colores del tema dinámico (mismo origen que el Sidebar/CMS)
  const { headerGradient, colors } = useDashboardHeaderGradient();
  const themeVars = {
    '--srv-from': colors.from,
    '--srv-via': colors.via,
    '--srv-to': colors.to,
  } as CSSProperties;
  
  // Services Canvas hook
  const { 
    isOpen: isCanvasOpen, 
    openCanvas,
    closeCanvas,
    updateAllServices // 🆕 Función para actualizar contexto global
  } = useServicesCanvas();

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
  } = useServicios({ autoFetch: true, fetchAll: true });

  // 🎨 Hook para cache de servicios
  const { invalidateAllCache } = useServicesManagementCache();

  // ============================================
  // SINCRONIZACIÓN CON SERVICES CANVAS
  // ============================================

  // Actualizar contexto global cuando cambien los servicios
  useEffect(() => {
    if (servicios.length > 0) {
      const servicesContext = servicios.map(servicioToServiceContext);
      updateAllServices(servicesContext);
    }
  }, [servicios, updateAllServices]);

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
      filtered = filtered.filter(s => {
        // Manejar ambos casos: categoría poblada (objeto) o no poblada (string/ObjectId)
        const categoriaSlug = typeof s.categoria === 'object' && s.categoria !== null
          ? s.categoria.slug
          : s.categoria;
        return filters.categorias?.includes(categoriaSlug);
      });
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
  // LOAD MORE - Sistema "Ver más"
  // ============================================

  const {
    visibleData,
    hasMore,
    loadMore,
    reset: resetLoadMore,
    visibleCount,
    totalItems,
    remainingItems
  } = useLoadMore({
    data: serviciosFiltrados,
    initialItems: 10,
    increment: 10
  });

  // Resetear "Ver más" cuando cambian los filtros o búsqueda
  useEffect(() => {
    resetLoadMore();
  }, [searchTerm, filters, currentSort, resetLoadMore]);

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
        invalidateAllCache();
        
        success('Servicio eliminado exitosamente');
      } catch (err) {
        showError('Error al eliminar el servicio');
      }
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateServicioHook(id);
      invalidateAllCache();
      
      success('Servicio duplicado exitosamente');
    } catch (err) {
      showError('Error al duplicar el servicio');
    }
  };

  const handleResetFilters = () => {
    setFilters({});
    setSearchTerm('');
    resetLoadMore();
  };

  const handleRefresh = async () => {
    invalidateAllCache();
    await refresh();
  };

  const handleOpenGlobalServicesCanvas = () => {
    openCanvas('portfolio'); // 🆕 Abrir en modo portafolio por defecto para análisis global
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900" style={themeVars}>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2 mb-3" aria-label="Breadcrumb">
            <button
              onClick={() => navigate(dashboardPath)}
              className="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[color:var(--srv-from)] transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent"
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
              <span className="hidden xs:inline">
                {shouldUseClientDashboard ? 'Panel Cliente' : 'Dashboard Admin'}
              </span>
              <span className="xs:hidden">
                <Home size={16} strokeWidth={1.5} />
              </span>
            </button>
            <span className="text-gray-400 dark:text-gray-600 text-sm">/</span>
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-900 dark:text-white px-2 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <ClipboardList size={14} strokeWidth={1.5} className="text-[color:var(--srv-from)]" />
              <span className="hidden sm:inline">Gestión de&nbsp;</span>Servicios
            </span>
          </nav>

          {/* Banner con gradiente dinámico (consistente con Agenda) */}
          <div
            className="rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl mb-4"
            style={{ background: headerGradient }}
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0">
                  <ClipboardList size={28} strokeWidth={1.5} className="text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-0.5">
                    Gestión de Servicios
                  </h1>
                  <p className="text-sm text-white/80">
                    {totalItems} servicios totales
                    {activeFiltersCount > 0 && ` • ${activeFiltersCount} filtro${activeFiltersCount > 1 ? 's' : ''} activo${activeFiltersCount > 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 disabled:opacity-50 flex-shrink-0"
                  title="Refrescar"
                >
                  <RefreshCw size={18} strokeWidth={1.5} />
                  <span className="hidden sm:inline">Refrescar</span>
                </button>

                <button
                  onClick={() => setShowCategoriesModal(true)}
                  className="px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 flex-shrink-0"
                  title="Gestionar Categorías"
                >
                  <Tag size={18} strokeWidth={1.5} />
                  <span className="hidden md:inline">Categorías</span>
                </button>

                <button
                  onClick={handleOpenGlobalServicesCanvas}
                  className="px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg hover:bg-white/20 transition-all flex items-center gap-2 flex-shrink-0"
                  title="Services Canvas IA - Análisis de portafolio, pricing inteligente y generación de contenido"
                >
                  <Sparkles size={18} strokeWidth={1.5} />
                  <span className="hidden sm:inline">Services Canvas</span>
                  <span className="sm:hidden">IA</span>
                </button>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 sm:px-5 py-2 bg-white text-[color:var(--srv-from)] rounded-lg font-semibold hover:bg-white/90 transition-all shadow-lg flex items-center gap-2 flex-1 sm:flex-none justify-center"
                >
                  <Plus size={18} strokeWidth={2} />
                  <span className="hidden sm:inline">Nuevo Servicio</span>
                  <span className="sm:hidden">Nuevo</span>
                </button>
              </div>
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
                  ? 'border-[color:var(--srv-from)] text-[color:var(--srv-from)]'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
              style={
                showFilters
                  ? { backgroundColor: 'color-mix(in srgb, var(--srv-from) 10%, transparent)' }
                  : undefined
              }
              title={showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
            >
              <Filter size={18} strokeWidth={1.5} />
              <span className="hidden sm:inline">Filtros</span>
              <span className="sm:hidden">{showFilters ? 'Ocultar' : 'Filtros'}</span>
              {activeFiltersCount > 0 && (
                <span
                  className="px-2 py-0.5 text-white text-xs rounded-full"
                  style={{ backgroundColor: 'var(--srv-from)' }}
                >
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
                    ? 'text-[color:var(--srv-from)]'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
                style={
                  viewMode === 'grid'
                    ? { backgroundColor: 'color-mix(in srgb, var(--srv-from) 12%, transparent)' }
                    : undefined
                }
                title="Vista en cuadrícula"
              >
                <LayoutGrid size={18} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`
                  p-2 rounded-lg transition-colors
                  ${viewMode === 'list'
                    ? 'text-[color:var(--srv-from)]'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
                style={
                  viewMode === 'list'
                    ? { backgroundColor: 'color-mix(in srgb, var(--srv-from) 12%, transparent)' }
                    : undefined
                }
                title="Vista en lista"
              >
                <List size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Layout con Filtros y Contenido lado a lado */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 relative">
          {/* Panel de filtros - Sidebar */}
          <div className={`
            ${showFilters ? 'block' : 'hidden'}
            w-full lg:w-72 xl:w-80 flex-shrink-0
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
          <div className="flex-1 min-w-0">
            {/* Contenido */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {loading ? (
              <SkeletonGrid items={12} columns={viewMode === 'grid' ? 3 : 1} />
            ) : visibleData.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                <Search size={56} strokeWidth={1.5} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
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
                    className="px-4 py-2 text-white rounded-lg transition-all hover:brightness-110"
                    style={{ background: `linear-gradient(to right, var(--srv-from), var(--srv-to))` }}
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
                    ? 'grid gap-4 lg:gap-6 mb-6'
                    : 'space-y-4 mb-6'
                  }
                `}
                style={{
                  gridTemplateColumns: viewMode === 'grid' 
                    ? showFilters 
                      ? 'repeat(auto-fill, minmax(260px, 1fr))'
                      : 'repeat(auto-fit, minmax(300px, 1fr))'
                    : undefined
                }}>
                  {visibleData.map((servicio) => (
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

                {/* Botón Ver Más */}
                {hasMore && (
                  <div className="flex flex-col items-center gap-3 mt-6 mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Mostrando {visibleCount} de {totalItems} servicios
                    </p>
                    <button
                      onClick={loadMore}
                      className="px-6 py-3 text-white rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 hover:brightness-110 font-medium"
                      style={{ background: `linear-gradient(to right, var(--srv-from), var(--srv-to))` }}
                    >
                      <ChevronDown size={18} strokeWidth={1.5} />
                      Ver más ({remainingItems} restantes)
                    </button>
                  </div>
                )}

                {/* Indicador cuando se muestran todos */}
                {!hasMore && totalItems > 0 && (
                  <div className="flex justify-center mt-6 mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full inline-flex items-center gap-1.5">
                      <Check size={14} strokeWidth={1.5} className="text-green-500" />
                      Mostrando todos los {totalItems} servicios
                    </p>
                  </div>
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
          invalidateAllCache();
          
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
          await refresh();
        }}
      />

      {/* Services Canvas Modal */}
      <ServicesCanvasModal
        isOpen={isCanvasOpen}
        onClose={closeCanvas}
        allServices={servicios.map(servicioToServiceContext)}
      />
    </div>
  );
};

export default ServiciosManagementOptimized;
