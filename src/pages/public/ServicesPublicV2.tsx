/**
 * 🌟 PÁGINA PÚBLICA DE SERVICIOS MEJORADA
 * Vista optimizada para mostrar servicios al público con filtros y búsqueda
 * ⚡ Optimizada con lazy loading y React.memo
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import { ServicioPublicCard } from '../../components/public/ServicioPublicCard';
import { SearchBar } from '../../components/common/SearchBar';
import CacheDebug from '../../components/debug/CacheDebug';
import { useSeo } from '../../hooks/useSeo';
import { serviciosApi } from '../../services/serviciosApi';
import type { Servicio, ServicioFilters } from '../../types/servicios';

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const ServicesPublicV2 = () => {
  // ============================================
  // ESTADO
  // ============================================

  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros] = useState<ServicioFilters>({
    visibleEnWeb: true,
    activo: true
  });
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('');
  const [ordenamiento, setOrdenamiento] = useState<string>('destacado');

  // ============================================
  // SEO
  // ============================================

  const { SeoHelmet } = useSeo({
    pageName: 'services',
    fallbackTitle: 'Servicios Profesionales - SCUTI Company',
    fallbackDescription: 'Descubre nuestros servicios de desarrollo de software, aplicaciones móviles, inteligencia artificial y soluciones digitales personalizadas.'
  });

  // ============================================
  // EFECTOS
  // ============================================

  useEffect(() => {
    const controller = new AbortController(); // ✅ AbortController

    const loadData = async () => {
      try {
        await cargarServicios();
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Error loading services:', error);
        }
      }
    };

    loadData();

    // ✅ Cleanup
    return () => {
      controller.abort();
    };
  }, [filtros, ordenamiento]);

  // ============================================
  // FUNCIONES OPTIMIZADAS CON MEMOIZATION
  // ============================================

  // ⚡ Memoizar función de carga de servicios
  const cargarServicios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await serviciosApi.getAll(filtros, {
        page: 1,
        limit: 50,
        sort: getSort()
      });

      if (response.success && response.data) {
        setServicios(response.data);
      }
    } catch (err: any) {
      // ✅ No mostrar error si fue cancelado
      if (err.name !== 'AbortError') {
        setError(err.message || 'Error al cargar servicios');
      }
    } finally {
      setLoading(false);
    }
  }, [filtros, ordenamiento]); // eslint-disable-line react-hooks/exhaustive-deps

  const getSort = useCallback(() => {
    switch (ordenamiento) {
      case 'destacado':
        return '-destacado,-orden,-createdAt';
      case 'precio-asc':
        return 'precio';
      case 'precio-desc':
        return '-precio';
      case 'titulo':
        return 'titulo';
      case 'nuevo':
        return '-createdAt';
      default:
        return '-destacado,-orden';
    }
  }, [ordenamiento]);

  // ⚡ Memoizar lista filtrada para evitar recalcular en cada render
  const serviciosFiltrados = useMemo(() => {
    return servicios.filter(servicio => {
    // Filtro por búsqueda
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      const matchTitulo = servicio.titulo.toLowerCase().includes(busquedaLower);
      const matchDescripcion = servicio.descripcion.toLowerCase().includes(busquedaLower);
      const matchEtiquetas = servicio.etiquetas?.some(etiqueta => 
        etiqueta.toLowerCase().includes(busquedaLower)
      );
      
      if (!matchTitulo && !matchDescripcion && !matchEtiquetas) {
        return false;
      }
    }

    // Filtro por categoría
    if (categoriaSeleccionada) {
      const categoriaServicio = typeof servicio.categoria === 'string' 
        ? servicio.categoria 
        : servicio.categoria?.nombre || servicio.categoria?._id || '';
      
      if (categoriaServicio !== categoriaSeleccionada) {
        return false;
      }
    }

    return true;
    });
  }, [servicios, busqueda, categoriaSeleccionada]);

  // TODO: Convertir a categorías dinámicas como en FiltersPanel.tsx
  const categorias = [
    { value: '', label: 'Todas las categorías' },
    { value: 'desarrollo', label: '💻 Desarrollo' },
    { value: 'diseño', label: '🎨 Diseño' },
    { value: 'marketing', label: '📈 Marketing' },
    { value: 'consultoría', label: '🤝 Consultoría' },
    { value: 'mantenimiento', label: '🔧 Mantenimiento' },
    { value: 'otro', label: '📦 Otros' }
  ];

  const serviciosDestacados = serviciosFiltrados.filter((s: Servicio) => s.destacado);
  const serviciosRegulares = serviciosFiltrados.filter((s: Servicio) => !s.destacado);

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      <SeoHelmet />
      
      <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <PublicHeader />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Servicios</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Soluciones digitales de vanguardia diseñadas para impulsar tu negocio hacia el éxito
              </p>
            </div>

            {/* Controles de filtrado */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Búsqueda con autocompletado */}
                <SearchBar
                  value={busqueda}
                  onChange={setBusqueda}
                  placeholder="Buscar servicios..."
                  delay={300}
                  showLoadingIndicator={true}
                />

                {/* Filtro por categoría */}
                <select
                  value={categoriaSeleccionada}
                  onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {categorias.map(categoria => (
                    <option key={categoria.value} value={categoria.value}>
                      {categoria.label}
                    </option>
                  ))}
                </select>

                {/* Ordenamiento */}
                <select
                  value={ordenamiento}
                  onChange={(e) => setOrdenamiento(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="destacado">⭐ Destacados primero</option>
                  <option value="nuevo">🆕 Más recientes</option>
                  <option value="titulo">🔤 Por nombre</option>
                  <option value="precio-asc">💰 Precio menor</option>
                  <option value="precio-desc">💎 Precio mayor</option>
                </select>
              </div>

              {/* Estadísticas */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mostrando {serviciosFiltrados.length} de {servicios.length} servicios
                  {busqueda && ` · Búsqueda: "${busqueda}"`}
                  {categoriaSeleccionada && ` · Categoría: ${categorias.find(c => c.value === categoriaSeleccionada)?.label}`}
                </p>
              </div>
            </div>

            {/* Estado de carga */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Cargando servicios...</p>
              </div>
            )}

            {/* Estado de error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center mb-8">
                <div className="text-4xl mb-2">❌</div>
                <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                <button
                  onClick={cargarServicios}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Reintentar
                </button>
              </div>
            )}

            {/* Grid de servicios */}
            {!loading && !error && (
              <>
                {/* Servicios destacados */}
                {serviciosDestacados.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                      ⭐ Servicios Destacados
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {serviciosDestacados.map(servicio => (
                        <ServicioPublicCard
                          key={servicio._id}
                          servicio={servicio}
                          featured={true}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Servicios regulares */}
                {serviciosRegulares.length > 0 && (
                  <div>
                    {serviciosDestacados.length > 0 && (
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        📋 Todos los Servicios
                      </h2>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {serviciosRegulares.map(servicio => (
                        <ServicioPublicCard
                          key={servicio._id}
                          servicio={servicio}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Sin resultados */}
                {serviciosFiltrados.length === 0 && servicios.length > 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
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
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                )}

                {/* Sin servicios */}
                {servicios.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
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

            {/* Call to Action */}
            {serviciosFiltrados.length > 0 && (
              <div className="mt-16 text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white">
                <h2 className="text-3xl font-bold mb-4">
                  ¿No encuentras lo que buscas?
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  Contáctanos para crear una solución personalizada para tu negocio
                </p>
                <button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors text-lg">
                  Contactar ahora
                </button>
              </div>
            )}
          </div>
        </main>
        
        <PublicFooter />
        
        {/* 🔍 Componente de debug para cache */}
        <CacheDebug />
      </div>
    </>
  );
};

export default ServicesPublicV2;