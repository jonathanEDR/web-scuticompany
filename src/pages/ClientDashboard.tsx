/**
 * 👤 Client Dashboard
 * Dashboard simplificado para roles USER y CLIENT
 * Interfaz limpia enfocada en consumo de contenido y servicios
 */

import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import RoleBadge from '../components/RoleBadge';
import { formatUserName } from '../types/roles';
import { blogPostApi } from '../services/blog';
import type { BlogPost } from '../types/blog';
import { getImageUrl } from '../utils/imageUtils';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    document.title = 'Mi Dashboard | Web Scuti';
    loadFeaturedPosts();
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (featuredPosts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredPosts.length);
    }, 8000); // Cambiar cada 8 segundos

    return () => clearInterval(interval);
  }, [featuredPosts.length]);

  const loadFeaturedPosts = async () => {
    try {
      setLoading(true);
      // Obtener posts destacados o populares
      const [featuredResponse, popularResponse] = await Promise.allSettled([
        blogPostApi.getFeaturedPosts(),
        blogPostApi.getPopularPosts(6)
      ]);

      let posts: BlogPost[] = [];
      
      // Priorizar posts destacados
      if (featuredResponse.status === 'fulfilled' && featuredResponse.value.data?.length > 0) {
        posts = featuredResponse.value.data;
      } else if (popularResponse.status === 'fulfilled' && popularResponse.value.data?.length > 0) {
        posts = popularResponse.value.data;
      }

      // Mezclar aleatoriamente y tomar solo 1
      const shuffled = posts.sort(() => Math.random() - 0.5).slice(0, 5);
      setFeaturedPosts(shuffled);
      setCurrentIndex(0); // Reset index cuando se cargan nuevos posts
      
      // Debug: Verificar las imágenes
      console.log('📰 Posts cargados:', shuffled.map(p => ({
        title: p.title,
        featuredImage: p.featuredImage,
        featuredImageProcessed: p.featuredImage ? getImageUrl(p.featuredImage) : null,
        author: p.author?.firstName || p.author?.email
      })));
    } catch (error) {
      console.error('Error cargando posts destacados:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextPost = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredPosts.length);
  };

  const prevPost = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredPosts.length) % featuredPosts.length);
  };

  const goToPost = (index: number) => {
    setCurrentIndex(index);
  };

  if (!user) {
    return null;
  }

  const userName = formatUserName(user);

  return (
    <div className="max-w-7xl mx-auto">
        {/* Header de Bienvenida */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-600 dark:via-purple-600 dark:to-pink-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                ¡Bienvenido, {userName}! 👋
              </h1>
              <p className="text-blue-100 dark:text-purple-100 text-lg">
                Estamos felices de verte de nuevo
              </p>
            </div>
            <div className="hidden md:block">
              <RoleBadge role={user.role} size="lg" />
            </div>
          </div>
        </div>

        {/* Panel de Posts Destacados del Blog */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <span className="text-3xl">📰</span>
                Noticias y Artículos Destacados
              </h2>
              {featuredPosts.length > 1 && (
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {currentIndex + 1} / {featuredPosts.length}
                </span>
              )}
            </div>
            <button
              onClick={loadFeaturedPosts}
              className="text-sm px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualizar
            </button>
          </div>

          {loading ? (
            <div className="animate-pulse">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
                <div className="w-full md:w-1/2 bg-gray-200 dark:bg-gray-700 h-80 rounded-lg"></div>
              </div>
            </div>
          ) : featuredPosts.length > 0 ? (
            <div className="relative">
              {/* Carousel container */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {featuredPosts.map((post) => (
                    <div key={post._id} className="min-w-full">
                      <a
                        href={`/blog/${post.slug}`}
                        className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] flex flex-col md:flex-row block"
                      >
                        {/* Contenido del texto - Izquierda */}
                        <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
                          {/* Badge de categoría */}
                          {post.category && (
                            <div className="inline-flex items-center gap-2 mb-4">
                              <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-bold shadow-lg">
                                📁 {typeof post.category === 'object' ? post.category.name : post.category}
                              </span>
                            </div>
                          )}

                          {/* Título */}
                          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {post.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed line-clamp-4">
                            {post.excerpt}
                          </p>
                          
                          {/* Tags */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                              {post.tags.slice(0, 4).map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full font-medium"
                                >
                                  #{typeof tag === 'object' ? tag.name : tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Metadata y CTA */}
                          <div className="space-y-4 mt-auto">
                            {/* Separador */}
                            <div className="border-t border-gray-200 dark:border-gray-600 pt-4"></div>
                            
                            {/* Autor y estadísticas */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {post.author && typeof post.author === 'object' && (
                                  <>
                                    {post.author.profileImage ? (
                                      <img
                                        src={post.author.profileImage}
                                        alt={post.author.firstName || 'Autor'}
                                        className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-600 shadow-md"
                                      />
                                    ) : (
                                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                        {(post.author.firstName || post.author.email || 'U').charAt(0).toUpperCase()}
                                      </div>
                                    )}
                                    <div className="flex flex-col">
                                      <span className="font-bold text-gray-900 dark:text-white text-base">
                                        {post.author.firstName || post.author.email?.split('@')[0] || 'Anónimo'}
                                      </span>
                                      {post.publishedAt && (
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                          {new Date(post.publishedAt).toLocaleDateString('es-ES', { 
                                            day: 'numeric', 
                                            month: 'long',
                                            year: 'numeric'
                                          })}
                                        </span>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-2 font-semibold">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  {post.analytics?.views || 0}
                                </span>
                                {post.analytics?.likes && post.analytics.likes > 0 && (
                                  <span className="flex items-center gap-2 font-semibold">
                                    ❤️ {post.analytics.likes}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* CTA de leer más */}
                            <div className="inline-flex items-center gap-3 text-blue-600 dark:text-blue-400 font-bold text-lg group-hover:gap-4 transition-all">
                              Leer artículo completo
                              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Imagen destacada - Derecha */}
                        <div className="relative w-full md:w-1/2 h-80 md:h-auto overflow-hidden">
                          {post.featuredImage ? (
                            <img
                              src={getImageUrl(post.featuredImage)}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ESin imagen%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                              <span className="text-9xl">📰</span>
                            </div>
                          )}
                          {/* Overlay gradient sutil */}
                          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-gray-50/20 dark:to-gray-900/20"></div>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Controles del carrusel */}
              {featuredPosts.length > 1 && (
                <>
                  {/* Botones Anterior/Siguiente */}
                  <button
                    onClick={prevPost}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
                    aria-label="Post anterior"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextPost}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
                    aria-label="Post siguiente"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Indicadores de puntos */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {featuredPosts.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToPost(index)}
                        className={`transition-all duration-300 rounded-full ${
                          index === currentIndex
                            ? 'w-8 h-2 bg-blue-600 dark:bg-blue-400'
                            : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                        }`}
                        aria-label={`Ir al post ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📭</span>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No hay posts destacados disponibles en este momento
              </p>
            </div>
          )}
        </div>

        {/* Accesos Rápidos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🚀</span>
            Accesos Rápidos
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/dashboard/profile"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:shadow-lg transition-all duration-200 group"
            >
              <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                👤
              </span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 text-center">
                Mi Perfil
              </span>
            </a>

            <a
              href="/dashboard/mi-blog"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:shadow-lg transition-all duration-200 group"
            >
              <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                📚
              </span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 text-center">
                Mi Actividad
              </span>
            </a>
          </div>
        </div>
      </div>
  );
}
