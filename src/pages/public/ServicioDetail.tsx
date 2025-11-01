/**
 * 📄 PÁGINA DE DETALLES DEL SERVICIO
 * Página pública para mostrar información completa de un servicio
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { serviciosApi } from '../../services/serviciosApi';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import ContactModal from '../../components/public/ContactModal';
import { useSeo } from '../../hooks/useSeo';
import type { Servicio } from '../../types/servicios';
import { debugApiConfig, testApiConnection } from '../../utils/debugApi';

export const ServicioDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // SEO dinámico
  const { SeoHelmet } = useSeo({
    pageName: 'servicio-detalle',
    fallbackTitle: servicio ? `${servicio.titulo} - Scuti Company` : 'Servicio - Scuti Company',
    fallbackDescription: servicio?.descripcionCorta || 'Servicios profesionales de desarrollo de software'
  });

  useEffect(() => {
    const fetchServicio = async () => {
      if (!slug) {
        setError('Servicio no encontrado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // DEBUG: En caso de error, mostrar información detallada
        console.log('🔍 ServicioDetail - Debugging info:');
        debugApiConfig();
        
        // Intentar buscar por slug primero, luego por ID
        console.log('📡 Fetching servicios from API...');
        const response = await serviciosApi.getAll();
        console.log('✅ API Response:', response);
        
        const servicioEncontrado = response.data.find(s => 
          s.slug === slug || s._id === slug
        );

        if (!servicioEncontrado) {
          console.error('❌ Servicio no encontrado:', { slug, availableServices: response.data.length });
          setError('Servicio no encontrado');
        } else if (!servicioEncontrado.activo || !servicioEncontrado.visibleEnWeb) {
          console.error('❌ Servicio no disponible:', { 
            slug, 
            activo: servicioEncontrado.activo, 
            visibleEnWeb: servicioEncontrado.visibleEnWeb 
          });
          setError('Este servicio no está disponible actualmente');
        } else {
          console.log('✅ Servicio encontrado:', servicioEncontrado);
          setServicio(servicioEncontrado);
        }
      } catch (err) {
        console.error('❌ Error al cargar servicio:', err);
        
        // Ejecutar test de conectividad en caso de error
        testApiConnection().catch(testErr => 
          console.error('❌ Connection test failed:', testErr)
        );
        
        setError('Error al cargar el servicio');
      } finally {
        setLoading(false);
      }
    };

    fetchServicio();
  }, [slug]);

  const formatPrice = (servicio: Servicio) => {
    if (servicio.tipoPrecio === 'personalizado') {
      return 'Precio personalizado';
    }
    if (servicio.tipoPrecio === 'rango' && servicio.precioMin && servicio.precioMax) {
      return `$${servicio.precioMin} - $${servicio.precioMax} USD`;
    }
    if (servicio.tipoPrecio === 'fijo' && servicio.precio) {
      return `$${servicio.precio} USD`;
    }
    if (servicio.tipoPrecio === 'rango' && servicio.precioMin) {
      return `Desde $${servicio.precioMin} USD`;
    }
    return 'Consultar precio';
  };

  const getDurationText = (servicio: Servicio) => {
    if (!servicio.duracion) return null;
    const { valor, unidad } = servicio.duracion;
    return `⏱️ Duración: ${valor} ${unidad}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <SeoHelmet />
        <PublicHeader />
        <div className="pt-20 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Cargando servicio...</p>
              </div>
            </div>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (error || !servicio) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <SeoHelmet />
        <PublicHeader />
        <div className="pt-20 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <div className="text-8xl mb-6">🚫</div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {error || 'Servicio no encontrado'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                El servicio que buscas no está disponible o no existe.
              </p>
              <Link
                to="/servicios"
                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-semibold"
              >
                ← Volver a servicios
              </Link>
            </div>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SeoHelmet />
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-gray-50 dark:from-gray-900 via-purple-100/20 dark:via-purple-900/20 to-blue-100/20 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">Inicio</Link></li>
              <li>{'>'}</li>
              <li><Link to="/servicios" className="hover:text-gray-900 dark:hover:text-white transition-colors">Servicios</Link></li>
              <li>{'>'}</li>
              <li className="text-gray-900 dark:text-white">{servicio.titulo}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Información principal */}
            <div>
              {/* Categoría */}
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  {typeof servicio.categoria === 'string' ? servicio.categoria : servicio.categoria?.nombre || 'Sin categoría'}
                </span>
                {servicio.destacado && (
                  <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    ⭐ Destacado
                  </span>
                )}
              </div>

              {/* Título */}
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {servicio.titulo}
              </h1>

              {/* Descripción corta */}
              {servicio.descripcionCorta && (
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                  {servicio.descripcionCorta}
                </p>
              )}

              {/* Precio y duración */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg px-6 py-4 border border-gray-300 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Precio</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(servicio)}
                  </div>
                </div>
                
                {getDurationText(servicio) && (
                  <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg px-6 py-4 border border-gray-300 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Duración</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {servicio.duracion?.valor} {servicio.duracion?.unidad}
                    </div>
                  </div>
                )}
              </div>

              {/* Badges informativos adicionales */}
              {(servicio.tiempoEntrega || servicio.garantia || servicio.soporte) && (
                <div className="flex flex-wrap gap-3 mb-8">
                  {servicio.tiempoEntrega && (
                    <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/50 px-4 py-2 rounded-full border border-blue-300 dark:border-blue-700">
                      <span className="text-lg">⏱️</span>
                      <div>
                        <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">Entrega:</span>
                        <span className="ml-1 text-sm font-semibold text-blue-900 dark:text-blue-100">
                          {servicio.tiempoEntrega}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {servicio.garantia && (
                    <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/50 px-4 py-2 rounded-full border border-green-300 dark:border-green-700">
                      <span className="text-lg">🛡️</span>
                      <div>
                        <span className="text-xs text-green-700 dark:text-green-300 font-medium">Garantía:</span>
                        <span className="ml-1 text-sm font-semibold text-green-900 dark:text-green-100">
                          {servicio.garantia}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {servicio.soporte && (
                    <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/50 px-4 py-2 rounded-full border border-purple-300 dark:border-purple-700">
                      <span className="text-lg">💬</span>
                      <div>
                        <span className="text-xs text-purple-700 dark:text-purple-300 font-medium">Soporte:</span>
                        <span className="ml-1 text-sm font-semibold text-purple-900 dark:text-purple-100 capitalize">
                          {servicio.soporte}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-purple-500/50 transform hover:scale-105"
                >
                  💬 Solicitar Cotización
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-400 dark:border-gray-600 hover:border-gray-500 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-semibold rounded-lg transition-colors"
                >
                  ← Volver
                </button>
              </div>
            </div>

            {/* Imagen principal */}
            <div className="lg:order-first lg:order-none">
              {servicio.imagen ? (
                <img
                  src={servicio.imagen}
                  alt={servicio.titulo}
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-purple-100 dark:from-purple-600/20 to-blue-100 dark:to-blue-600/20 rounded-2xl flex items-center justify-center border border-gray-300 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-6xl mb-4">
                      {servicio.icono || '🚀'}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Imagen del servicio</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Descripción detallada */}
      {servicio.descripcion && (
        <section className="py-16 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                📋 Descripción del Servicio
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div 
                  className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: servicio.descripcion.replace(/\n/g, '<br>') }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Descripción Rica (Contenido Personalizado) */}
      {servicio.descripcionRica && servicio.descripcionRica.trim() && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                📝 Información Detallada
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none bg-white/80 dark:bg-gray-800/30 rounded-lg p-8 border border-gray-300 dark:border-gray-700">
                <div 
                  className="text-gray-700 dark:text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: servicio.descripcionRica
                      // Headers
                      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 mt-6">$1</h3>')
                      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">$1</h2>')
                      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8">$1</h1>')
                      // Bold
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
                      // Italic
                      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                      // Lists
                      .replace(/^\- (.*$)/gim, '<li class="ml-4 mb-2">• $1</li>')
                      .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4 mb-2">$1. $2</li>')
                      // Line breaks
                      .replace(/\n/g, '<br>')
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Video */}
      {servicio.videoUrl && servicio.videoUrl.trim() && (
        <section className="py-16 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              🎥 Video del Servicio
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="relative rounded-lg overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={servicio.videoUrl.replace('watch?v=', 'embed/')}
                  title="Video del servicio"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full border-0"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Galería Personalizada */}
      {servicio.galeriaImagenes && servicio.galeriaImagenes.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              🖼️ Galería del Servicio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicio.galeriaImagenes.map((imagen, index) => (
                <div key={index} className="group overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={imagen}
                    alt={`${servicio.titulo} - Imagen ${index + 1}`}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contenido Adicional */}
      {servicio.contenidoAdicional && servicio.contenidoAdicional.trim() && (
        <section className="py-16 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                💡 Información Adicional
              </h2>
              <div className="bg-gradient-to-r from-purple-100/80 dark:from-purple-900/20 to-blue-100/80 dark:to-blue-900/20 rounded-lg p-8 border border-purple-300/50 dark:border-purple-500/30">
                <div 
                  className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-lg"
                  dangerouslySetInnerHTML={{ __html: servicio.contenidoAdicional.replace(/\n/g, '<br>') }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Características */}
      {servicio.caracteristicas && servicio.caracteristicas.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              ✨ ¿Qué incluye este servicio?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicio.caracteristicas.map((caracteristica, index) => (
                <div
                  key={index}
                  className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-300 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">✅</div>
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">{caracteristica}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tecnologías */}
      {servicio.tecnologias && servicio.tecnologias.length > 0 && (
        <section className="py-16 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              🛠️ Tecnologías que utilizamos
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {servicio.tecnologias.map((tecnologia, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                >
                  {tecnologia}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Beneficios */}
      {servicio.beneficios && servicio.beneficios.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              🎯 Beneficios Clave
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {servicio.beneficios.map((beneficio, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-2xl shadow-lg">
                      ⭐
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white font-semibold text-lg leading-relaxed">
                        {beneficio}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Incluye / No Incluye */}
      {((servicio.incluye && servicio.incluye.length > 0) || (servicio.noIncluye && servicio.noIncluye.length > 0)) && (
        <section className="py-16 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              📋 ¿Qué está incluido?
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Lo que INCLUYE */}
              {servicio.incluye && servicio.incluye.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8 border-2 border-green-300 dark:border-green-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-xl">
                      ✅
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Incluye
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {servicio.incluye.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-green-600 dark:text-green-400 text-xl mt-0.5">✓</span>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Lo que NO INCLUYE */}
              {servicio.noIncluye && servicio.noIncluye.length > 0 && (
                <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-8 border-2 border-red-300 dark:border-red-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-xl">
                      ❌
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      No Incluye
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {servicio.noIncluye.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-red-600 dark:text-red-400 text-xl mt-0.5">✗</span>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* FAQ - Preguntas Frecuentes */}
      {servicio.faq && servicio.faq.length > 0 && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              ❓ Preguntas Frecuentes
            </h2>
            <div className="space-y-4">
              {servicio.faq.map((item, index) => (
                <details
                  key={index}
                  className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-purple-400 dark:hover:border-purple-500 transition-colors"
                >
                  <summary className="cursor-pointer px-6 py-4 font-semibold text-gray-900 dark:text-white flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <span className="flex items-center gap-3">
                      <span className="text-purple-600 dark:text-purple-400">Q:</span>
                      {item.pregunta}
                    </span>
                    <span className="text-purple-600 dark:text-purple-400 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      <span className="font-semibold text-purple-600 dark:text-purple-400 mr-2">A:</span>
                      {item.respuesta}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Galería de imágenes adicionales */}
      {servicio.imagenes && servicio.imagenes.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              🖼️ Galería del Proyecto
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicio.imagenes.map((imagen, index) => (
                <div key={index} className="group overflow-hidden rounded-lg">
                  <img
                    src={imagen}
                    alt={`${servicio.titulo} - Imagen ${index + 1}`}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Etiquetas */}
      {servicio.etiquetas && servicio.etiquetas.length > 0 && (
        <section className="py-16 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              🏷️ Etiquetas
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {servicio.etiquetas.map((etiqueta, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium"
                >
                  #{etiqueta}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para comenzar tu proyecto?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Nuestro equipo de expertos está listo para ayudarte a llevar tu idea al siguiente nivel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              💬 Solicitar Cotización Gratuita
            </button>
            <Link
              to="/servicios"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition-colors"
            >
              Ver todos los servicios
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />

      {/* Modal de contacto */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        servicioInfo={servicio ? {
          titulo: servicio.titulo,
          descripcionCorta: servicio.descripcionCorta,
          precio: servicio.precio ? `$${servicio.precio} ${servicio.moneda}` : undefined,
          duracion: servicio.duracion ? `${servicio.duracion.valor} ${servicio.duracion.unidad}` : undefined,
          categoria: typeof servicio.categoria === 'string' ? servicio.categoria : servicio.categoria?.nombre || 'Sin categoría'
        } : undefined}
        data={{
          title: servicio ? `Solicitar Cotización - ${servicio.titulo}` : 'Solicitar Cotización',
          subtitle: 'OBTÉN TU COTIZACIÓN',
          description: 'Déjanos tus datos y nos pondremos en contacto contigo para brindarte la mejor asesoría.',
          fields: {
            mensajePlaceholder: servicio 
              ? `Hola, estoy interesado en el servicio "${servicio.titulo}". Me gustaría recibir más información y una cotización personalizada.`
              : 'Describe tu proyecto, necesidades o consulta...'
          },
          messages: {
            success: '¡Gracias! Hemos recibido tu solicitud. Te contactaremos pronto.',
            error: 'Error al enviar la solicitud. Por favor, intenta nuevamente.'
          }
        }}
      />
    </div>
  );
};

export default ServicioDetail;