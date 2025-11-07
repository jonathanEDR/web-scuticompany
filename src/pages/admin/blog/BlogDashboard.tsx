/**
 * 📊 BlogDashboard Component
 * Panel de control principal del blog con estadísticas
 */

import { useEffect, useState } from 'react';
import { 
  FileText, MessageCircle, Eye, TrendingUp, 
  Users, Calendar, BarChart3, Clock, Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCategories, useAdminPosts } from '../../../hooks/blog';
import { useModerationStats } from '../../../hooks/blog/useModerationQueue';
import { BlogAnalyticsDashboard } from '../../../components/blog/analytics/BlogAnalyticsDashboard';
import { SEOCanvasModal } from '../../../components/admin/seo';
import { useAuth } from '../../../contexts/AuthContext';

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalComments: number;
  totalAuthors: number;
  postsThisMonth: number;
  avgReadingTime: number;
}

export default function BlogDashboard() {
  
  // Estado para las pestañas
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics'>('dashboard');
  
  // Estado para SEO Canvas
  const [isSEOCanvasOpen, setIsSEOCanvasOpen] = useState(false);
  const [selectedPostForSEO, setSelectedPostForSEO] = useState<any>(null);
  const [seoCanvasInitialMode, setSeoCanvasInitialMode] = useState<'chat' | 'analysis' | 'structure' | 'review'>('chat');
  
  // Hook de autenticación para verificar permisos
  const { role } = useAuth();
  
  // Usar useAdminPosts para obtener TODOS los posts (incluye borradores)
  const { posts, loading: postsLoading, error: postsError } = useAdminPosts({ 
    limit: 100 // Cargar más posts para estadísticas precisas
  });
  
  // Cargar estadísticas de moderación para comentarios pendientes
  const { stats: moderationStats } = useModerationStats();
  
  const { categories, loading: categoriesLoading } = useCategories();

  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    totalComments: 0,
    totalAuthors: 0,
    postsThisMonth: 0,
    avgReadingTime: 0
  });

  // Calcular estadísticas
  useEffect(() => {
    if (posts && posts.length > 0) {
      const published = posts.filter(p => p.isPublished).length;
      const draft = posts.filter(p => !p.isPublished).length;
      const totalViews = posts.reduce((sum, p) => sum + (p.stats?.views || 0), 0);
      const totalComments = posts.reduce((sum, p) => sum + (p.stats?.commentsCount || 0), 0);
      const avgReading = posts.reduce((sum, p) => sum + p.readingTime, 0) / posts.length;
      
      // Posts este mes
      const now = new Date();
      const thisMonth = posts.filter(p => {
        const postDate = new Date(p.createdAt);
        return postDate.getMonth() === now.getMonth() && 
               postDate.getFullYear() === now.getFullYear();
      }).length;

      setStats({
        totalPosts: posts.length,
        publishedPosts: published,
        draftPosts: draft,
        totalViews,
        totalComments,
        totalAuthors: new Set(posts.filter(p => p.author).map(p => p.author!._id)).size,
        postsThisMonth: thisMonth,
        avgReadingTime: Math.round(avgReading)
      });
    }
  }, [posts]);

  // Tarjetas de estadísticas
  const statCards = [
    {
      label: 'Total de Posts',
      value: stats.totalPosts,
      icon: FileText,
      color: 'blue',
      trend: `+${stats.postsThisMonth} este mes`
    },
    {
      label: 'Publicados',
      value: stats.publishedPosts,
      icon: TrendingUp,
      color: 'green',
      trend: `${stats.draftPosts} borradores`
    },
    {
      label: 'Vistas Totales',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'purple',
      trend: 'Últimos 30 días'
    },
    {
      label: 'Comentarios',
      value: moderationStats?.pending || 0,
      icon: MessageCircle,
      color: 'orange',
      trend: `${moderationStats?.pending || 0} pendientes de moderar`
    },
    {
      label: 'Autores Activos',
      value: stats.totalAuthors,
      icon: Users,
      color: 'pink',
      trend: 'Colaboradores'
    },
    {
      label: 'Tiempo de Lectura',
      value: `${stats.avgReadingTime} min`,
      icon: Clock,
      color: 'indigo',
      trend: 'Promedio'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    pink: 'bg-pink-100 text-pink-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  };

  return (
    <div className="blog-dashboard space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Panel del Blog</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona y monitorea el contenido de tu blog
          </p>
        </div>

        <div className="flex gap-3">
          {/* Botón SEO Canvas - Solo para ADMIN/SUPER_ADMIN */}
          {(role === 'ADMIN' || role === 'SUPER_ADMIN') && (
            <button
              onClick={() => {
                setSelectedPostForSEO(null);
                setSeoCanvasInitialMode('chat');
                setIsSEOCanvasOpen(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors font-medium shadow-sm border-2 border-green-300 dark:border-green-600"
            >
              <Target className="w-5 h-5" />
              <span>SEO Canvas</span>
            </button>
          )}
          
          <Link
            to="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors font-medium shadow-sm"
          >
            <Eye className="w-5 h-5" />
            <span>Ver Blog</span>
          </Link>
          
          <Link
            to="/dashboard/blog/posts/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors font-medium shadow-sm"
          >
            <FileText className="w-5 h-5" />
            <span>Nuevo Post</span>
          </Link>
        </div>
      </div>

      {/* Pestañas de Navegación */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            📊 Dashboard General
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            🤖 Analytics con IA
          </button>
        </div>
      </div>

      {/* Contenido Condicional */}
      {activeTab === 'dashboard' ? (
        <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const isCommentsCard = stat.label === 'Comentarios';
          
          const cardContent = (
            <div
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-shadow ${
                isCommentsCard ? 'hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer' : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.trend}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
          
          return isCommentsCard ? (
            <Link key={index} to="/dashboard/blog/moderation">
              {cardContent}
            </Link>
          ) : (
            <div key={index}>
              {cardContent}
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Posts Recientes */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Posts Recientes</h2>
              <Link
                to="/dashboard/blog/posts/new"
                className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                <FileText className="w-4 h-4" />
                <span>Crear Post</span>
              </Link>
            </div>
          </div>

          <div className="p-6">
            {postsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-10 h-10 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : !posts || posts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No hay posts aún
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Comienza creando tu primer artículo
                </p>
                <Link
                  to="/dashboard/blog/posts/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Crear Post</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.slice(0, 5).map((post) => (
                  <div
                    key={post._id}
                    className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-100 dark:border-gray-600"
                  >
                    {post.featuredImage && (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/dashboard/blog/posts/${post._id}/edit`}
                        className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1"
                      >
                        {post.title}
                      </Link>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.stats?.views || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {post.stats?.commentsCount || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.createdAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                        {!post.isPublished && (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                            Borrador
                          </span>
                        )}
                      </div>
                      
                      {/* Acciones del post - Solo para ADMIN/SUPER_ADMIN */}
                      {(role === 'ADMIN' || role === 'SUPER_ADMIN') && (
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => {
                              setSelectedPostForSEO(post);
                              setSeoCanvasInitialMode('analysis');
                              setIsSEOCanvasOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors text-xs font-medium"
                          >
                            <Target className="w-3 h-3" />
                            <span>SEO Canvas</span>
                          </button>
                          
                          <Link
                            to={`/dashboard/blog/posts/${post._id}/edit`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-xs font-medium"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Editar</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Categorías */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Categorías</h2>
                <Link
                  to="/dashboard/blog/categories"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  Gestionar
                </Link>
              </div>
            </div>

            <div className="p-6">
              {categoriesLoading ? (
                <div className="flex justify-center py-6">
                  <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : !categories || categories.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
                  No hay categorías
                </p>
              ) : (
                <div className="space-y-3">
                  {categories.slice(0, 8).map((category) => (
                    <div
                      key={category._id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {category.postCount || 0}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Acciones Rápidas
            </h2>
            <div className="space-y-2">
              <Link
                to="/dashboard/blog/posts/new"
                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Crear nuevo post
                </span>
              </Link>
              <Link
                to="/dashboard/blog/categories"
                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <BarChart3 className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Gestionar categorías
                </span>
              </Link>
              <button
                onClick={() => alert('Página de moderación de comentarios próximamente')}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors w-full text-left"
              >
                <MessageCircle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Moderar comentarios
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
        </>
      ) : (
        /* Analytics con IA */
        <BlogAnalyticsDashboard />
      )}

      {/* SEO Canvas Modal */}
      <SEOCanvasModal
        isOpen={isSEOCanvasOpen}
        onClose={() => {
          setIsSEOCanvasOpen(false);
          setSelectedPostForSEO(null);
          setSeoCanvasInitialMode('chat');
        }}
        initialMode={seoCanvasInitialMode}
        postContext={selectedPostForSEO ? {
          postId: selectedPostForSEO._id,
          title: selectedPostForSEO.title,
          content: selectedPostForSEO.content,
          description: selectedPostForSEO.metaDescription,
          keywords: selectedPostForSEO.keywords
        } : undefined}
      />
    </div>
  );
}
