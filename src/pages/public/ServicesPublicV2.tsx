/**
 * 🌟 PÁGINA PÚBLICA DE SERVICIOS MEJORADA
 * Vista optimizada para mostrar servicios al público con filtros y búsqueda
 * ⚡ Optimizada con lazy loading y React.memo
 */

import { useState, useMemo, useEffect } from 'react';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import FloatingChatWidget from '../../components/floating-chat/FloatingChatWidget';
import { ServicioPublicCard } from '../../components/public/ServicioPublicCard';
import { SearchBar } from '../../components/common/SearchBar';
import { useSeo } from '../../hooks/useSeo';
import { useServiciosList } from '../../hooks/useServiciosCache';
import { categoriasApi, type Categoria } from '../../services/categoriasApi';
import { invalidateServiciosCache } from '../../utils/serviciosCache';
import type { Servicio, ServicioFilters } from '../../types/servicios';

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const ServicesPublicV2 = () => {
  // ============================================
  // ESTADO
  // ============================================

  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('');
  const [ordenamiento, setOrdenamiento] = useState<string>('destacado');
  const [filterKey, setFilterKey] = useState(0); // Key para forzar re-animación
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  
  // ✨ NUEVO: Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // 10 servicios por página
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Detectar cambios en filtros para trigger animación y resetear paginación
  useEffect(() => {
    setFilterKey(prev => prev + 1);
    // Resetear a la primera página cuando cambien los filtros
    setCurrentPage(1);
  }, [busqueda, categoriaSeleccionada, ordenamiento]);

  // 🔄 Cargar categorías dinámicamente desde la API
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const response = await categoriasApi.getAll({ activas: true });
        setCategorias(response.data);
      } catch (error) {
        console.error('Error cargando categorías:', error);
        // Fallback a categorías por defecto en caso de error
        setCategorias([]);
      }
    };

    loadCategorias();
  }, []);

  // ============================================
  // FILTROS PARA EL CACHE - AHORA INCLUYEN BÚSQUEDA Y CATEGORÍA
  // ============================================

  const filtros: ServicioFilters = useMemo(() => ({
    visibleEnWeb: true,
    activo: true,
    // ✨ NUEVO: Pasar búsqueda y categoría al backend
    ...(busqueda && { search: busqueda }),
    ...(categoriaSeleccionada && { categoria: categoriaSeleccionada })
  }), [busqueda, categoriaSeleccionada]);

  // ✨ NUEVO: Filtros con paginación incluida
  const filtrosConPaginacion = useMemo(() => ({
    ...filtros,
    page: currentPage,
    limit: itemsPerPage,
    sort: ordenamiento === 'destacado' ? '-destacado,-createdAt' : ordenamiento
  }), [filtros, currentPage, itemsPerPage, ordenamiento]);

  // ============================================
  // HOOK DE CACHE - REEMPLAZA USEEFFECT + API CALL
  // ============================================

  const {
    data: serviciosResponse = null,
    loading,
    error,
    refetch: recargarServicios,
    isFromCache
  } = useServiciosList(filtrosConPaginacion, {
    enabled: true,
    onSuccess: (data) => {
      console.log('\n════════════════════════════════════════════════════════════════');
      console.log('📡 [FRONTEND] Servicios cargados exitosamente');
      console.log('════════════════════════════════════════════════════════════════');
      console.log('📦 Total servicios:', data?.total || 0);
      console.log('📄 Página actual:', data?.page || 1);
      console.log('📄 Total páginas:', data?.pages || 1);
      console.log('📦 Servicios en esta página:', data?.data?.length || 0);
      console.log('💾 Desde cache:', isFromCache ? 'SÍ ✅' : 'NO ❌ (Fresco desde backend)');
      console.log('⏰ Timestamp:', new Date().toISOString());
      
      // 🔍 DEBUG: Ver slugs de cada servicio
      if (data?.data && Array.isArray(data.data)) {
        data.data.forEach((serv: any, idx: number) => {
          console.log(`  ├─ Servicio ${idx + 1}: ID=${serv._id} | SLUG=${serv.slug || 'SIN SLUG'} | TÍTULO=${serv.titulo}`);
        });
      }
      
      console.log('════════════════════════════════════════════════════════════════\n');
      
      // ✨ NUEVO: Actualizar información de paginación
      if (data && typeof data === 'object' && 'total' in data) {
        setTotalItems(data.total || 0);
        setTotalPages(data.pages || 1);
      }
    },
    onError: () => {
      console.error('\n════════════════════════════════════════════════════════════════');
      console.error('❌ [FRONTEND] Error cargando servicios');
      console.error('════════════════════════════════════════════════════════════════\n');
    }
  });

  // Extraer servicios del response
  const servicios = serviciosResponse?.data || [];

  // 🔄 Función para invalidar cache y recargar
  const recargarConInvalidacion = async () => {
    try {
      console.log('🗑️ [FRONTEND] Invalidando cache y recargando servicios...');
      
      // 1. Invalidar cache local
      invalidateServiciosCache();
      
      // 2. Recargar servicios
      await recargarServicios();
      
      console.log('✅ [FRONTEND] Cache invalidado y servicios recargados');
    } catch (error) {
      console.error('❌ [FRONTEND] Error al invalidar cache y recargar:', error);
    }
  };

  // ============================================
  // SEO
  // ============================================

  const { SeoHelmet } = useSeo({
    pageName: 'services',
    fallbackTitle: 'Servicios Profesionales - SCUTI Company',
    fallbackDescription: 'Descubre nuestros servicios de desarrollo de software, aplicaciones móviles, inteligencia artificial y soluciones digitales personalizadas.'
  });

  // ============================================
  // FUNCIONES OPTIMIZADAS CON MEMOIZATION
  // ============================================

  // ⚡ Memoizar lista filtrada para evitar recalcular en cada render
  // ✨ AHORA: El backend ya filtra, solo usamos los datos directamente
  const serviciosFiltrados = useMemo(() => {
    // Los datos ya vienen filtrados del backend
    if (!servicios) return [];
    return servicios;
  }, [servicios]);

  // ⚡ Aplicar ordenamiento a los servicios filtrados
  const serviciosOrdenados = useMemo(() => {
    if (!serviciosFiltrados) return [];
    
    const sorted = [...serviciosFiltrados];
    
    switch (ordenamiento) {
      case 'destacado':
        return sorted.sort((a, b) => {
          if (a.destacado && !b.destacado) return -1;
          if (!a.destacado && b.destacado) return 1;
          return (b.orden || 0) - (a.orden || 0);
        });
      case 'precio-asc':
        return sorted.sort((a, b) => (a.precio || 0) - (b.precio || 0));
      case 'precio-desc':
        return sorted.sort((a, b) => (b.precio || 0) - (a.precio || 0));
      case 'titulo':
        return sorted.sort((a, b) => a.titulo.localeCompare(b.titulo));
      case 'nuevo':
        return sorted.sort((a, b) => 
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
      default:
        return sorted;
    }
  }, [serviciosFiltrados, ordenamiento]);

  const serviciosDestacados = serviciosOrdenados.filter((s: Servicio) => s.destacado);
  const serviciosRegulares = serviciosOrdenados.filter((s: Servicio) => !s.destacado);

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      <SeoHelmet />
      
      <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <PublicHeader />
        
        <main className="container mx-auto px-4 py-12">
          {/* Header con animación */}
          <div className="text-center mb-12 animate-fade-in-down max-w-7xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Servicios</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Soluciones digitales de vanguardia diseñadas para impulsar tu negocio hacia el éxito
            </p>
          </div>

          {/* Layout con Sidebar + Contenido */}
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* SIDEBAR - Barra Lateral de Filtros */}
              <aside className="lg:w-72 flex-shrink-0 animate-fade-in delay-100">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-24">
                  
                  {/* Header del Sidebar */}
                  <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="text-gray-400">🔍</span>
                      Filtrar servicios
                    </h2>
                  </div>

                  <div className="p-5 space-y-5">
                    
                    {/* Búsqueda */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                          Buscar
                        </label>
                        <button
                          onClick={recargarConInvalidacion}
                          disabled={loading}
                          className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors disabled:opacity-50 flex items-center gap-1"
                          title="Actualizar servicios"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Actualizar
                        </button>
                      </div>
                      <SearchBar
                        value={busqueda}
                        onChange={setBusqueda}
                        placeholder="Buscar..."
                        delay={300}
                        showLoadingIndicator={true}
                      />
                    </div>

                    {/* Separador */}
                    <div className="border-t border-gray-100 dark:border-gray-700"></div>

                    {/* Categorías */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                        Categoría
                      </label>
                      <div className="space-y-1">
                        {/* Opción "Todas las categorías" */}
                        <button
                          key=""
                          onClick={() => setCategoriaSeleccionada('')}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            categoriaSeleccionada === ''
                              ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          Todas las categorías
                        </button>

                        {/* Categorías dinámicas */}
                        {categorias.map(categoria => (
                          <button
                            key={categoria.slug}
                            onClick={() => setCategoriaSeleccionada(categoria.slug)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              categoriaSeleccionada === categoria.slug
                                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                          >
                            {categoria.icono} {categoria.nombre}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Separador */}
                    <div className="border-t border-gray-100 dark:border-gray-700"></div>

                    {/* Ordenamiento */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                        Ordenar
                      </label>
                      <select
                        value={ordenamiento}
                        onChange={(e) => setOrdenamiento(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="destacado">⭐ Destacados</option>
                        <option value="nuevo">🆕 Recientes</option>
                        <option value="titulo">🔤 A-Z</option>
                        <option value="precio-asc">💰 Menor precio</option>
                        <option value="precio-desc">💎 Mayor precio</option>
                      </select>
                    </div>

                    {/* Resultados */}
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Resultados:
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {serviciosFiltrados.length} de {servicios?.length || 0}
                        </span>
                      </div>
                      
                      {isFromCache && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                          <span>⚡</span>
                          <span>Carga optimizada</span>
                        </div>
                      )}
                    </div>

                    {/* Botón Limpiar Filtros */}
                    {(busqueda || categoriaSeleccionada !== '') && (
                      <button
                        onClick={() => {
                          setBusqueda('');
                          setCategoriaSeleccionada('');
                        }}
                        className="w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <span className="text-base">×</span>
                        <span>Limpiar filtros</span>
                      </button>
                    )}
                  </div>
                </div>
              </aside>

              {/* CONTENIDO PRINCIPAL - Grid de Servicios */}
              <div className="flex-1 min-w-0">{/* min-w-0 previene overflow */}

                {/* Estado de carga con skeleton */}
                {loading && (
                  <div className="animate-fade-in">
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400 animate-pulse">Cargando servicios...</p>
                    </div>
                    
                    {/* Skeleton cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-pulse">
                          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4 shimmer"></div>
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3 shimmer"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 shimmer"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 shimmer"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Estado de error con animación */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center mb-8 animate-scale-in">
                    <div className="text-4xl mb-2 animate-bounce">❌</div>
                    <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                    <button
                      onClick={() => recargarConInvalidacion()}
                      className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      🔄 Recargar servicios
                    </button>
                  </div>
                )}

                {/* Grid de servicios */}
                {!loading && !error && (
                  <>
                    {/* Servicios destacados con animación en cascada */}
                    {serviciosDestacados.length > 0 && (
                      <div className="mb-12 animate-fade-in-up delay-200">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                          ⭐ Servicios Destacados
                        </h2>
                        <div key={`destacados-${filterKey}`} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {serviciosDestacados.map((servicio) => (
                            <div key={servicio._id} className="filter-item">
                              <ServicioPublicCard
                                servicio={servicio}
                                featured={true}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Servicios regulares con animación en cascada */}
                    {serviciosRegulares.length > 0 && (
                      <div className="animate-fade-in-up delay-300">
                        {serviciosDestacados.length > 0 && (
                          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                            📋 Todos los Servicios
                          </h2>
                        )}
                        <div key={`regulares-${filterKey}`} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {serviciosRegulares.map((servicio) => (
                            <div key={servicio._id} className="filter-item">
                              <ServicioPublicCard
                                servicio={servicio}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sin resultados con animación */}
                    {serviciosFiltrados.length === 0 && (servicios?.length || 0) > 0 && (
                      <div className="text-center py-12 animate-scale-in">
                        <div className="text-6xl mb-4 animate-bounce">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          No se encontraron servicios
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          Intenta ajustar los filtros o términos de búsqueda
                        </p>
                        <button
                          onClick={() => {
                            setBusqueda('');
                            setCategoriaSeleccionada('');
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                        >
                          Limpiar filtros
                        </button>
                      </div>
                    )}

                    {/* Sin servicios con animación */}
                    {(servicios?.length || 0) === 0 && !loading && (
                      <div className="text-center py-12 animate-fade-in">
                        <div className="text-6xl mb-4 animate-pulse">📦</div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          Próximamente
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Estamos preparando servicios increíbles para ti
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* ✨ NUEVO: Controles de Paginación */}
                {!loading && !error && totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-12 mb-8 gap-4 animate-fade-in-up">
                    {/* Información de paginación */}
                    <div className="text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
                      Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} servicios
                    </div>
                    
                    {/* Controles de navegación */}
                    <div className="flex items-center gap-2 order-1 sm:order-2">
                      {/* Botón Anterior */}
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Anterior
                      </button>

                      {/* Números de página */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNumber;
                          if (totalPages <= 5) {
                            pageNumber = i + 1;
                          } else if (currentPage <= 3) {
                            pageNumber = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i;
                          } else {
                            pageNumber = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`w-10 h-10 text-sm font-medium rounded-lg transition-all duration-300 ${
                                currentPage === pageNumber
                                  ? 'bg-purple-600 text-white shadow-lg'
                                  : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}
                      </div>

                      {/* Botón Siguiente */}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        Siguiente
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Call to Action con animación */}
                {serviciosFiltrados.length > 0 && (
                  <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 lg:p-12 text-white animate-fade-in-up delay-500 hover-glow">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                      ¿No encuentras lo que buscas?
                    </h2>
                    <p className="text-lg lg:text-xl mb-8 opacity-90">
                      Contáctanos para crear una solución personalizada para tu negocio
                    </p>
                    <button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-all duration-300 text-lg hover:scale-105">
                      Contactar ahora
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        </main>
        
        <PublicFooter />
        
        {/* 💬 Chatbot de Ventas Flotante */}
        <FloatingChatWidget />
      </div>
    </>
  );
};

export default ServicesPublicV2;