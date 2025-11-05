import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Clock, 
  User, 
  Calendar,
  Search as SearchIcon
} from 'lucide-react';
import { useBlogPosts } from '../../../hooks/blog';
import { useCategories } from '../../../hooks/blog';
import { BlogCard, SEOHead } from '../../../components/blog/common';
import PublicFooter from '../../../components/public/PublicFooter';

const BlogHome: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const postsPerPage = 9;

  // Fetch posts with filters
  const { 
    posts, 
    loading: postsLoading, 
    error: postsError,
    pagination,
    refetch: refetchPosts
  } = useBlogPosts({
    page: currentPage,
    limit: postsPerPage,
    isPublished: true,
    categoria: selectedCategory || undefined
  });

  // Fetch featured posts (latest 3 published)
  const { 
    posts: featuredPosts
  } = useBlogPosts({
    page: 1,
    limit: 3,
    isPublished: true,
    isPinned: true
  });

  // Fetch categories
  const { 
    categories, 
    loading: categoriesLoading 
  } = useCategories();

  // Handle category filter
  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* SEO Head */}
      <SEOHead 
        title="Blog Web Scuti - Desarrollo Web y Tecnología"
        description="Descubre las últimas tendencias en desarrollo web, diseño y tecnología. Artículos, tutoriales y consejos para desarrolladores y empresarios."
        type="website"
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Blog de Web Scuti</h1>
            <p className="text-xl text-blue-100 dark:text-blue-200 mb-8">
              Descubre las últimas tendencias en desarrollo web, diseño y tecnología
            </p>
            <Link
              to="/blog/search"
              className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            >
              <SearchIcon size={20} />
              Buscar artículos
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {featuredPosts && featuredPosts.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-blue-600 dark:text-blue-400" size={24} />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Artículos Destacados</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <BlogCard
                key={post._id}
                post={post}
                variant="featured"
              />
            ))}
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Posts Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedCategory 
                  ? `Artículos en: ${categories?.find(c => c._id === selectedCategory)?.name || 'Categoría'}`
                  : 'Todos los Artículos'
                }
              </h2>
              {selectedCategory && (
                <button
                  onClick={() => handleCategoryClick(null)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  Ver todos
                </button>
              )}
            </div>

            {postsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
                    <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : postsError ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
                <p className="text-red-600 dark:text-red-400">Error al cargar los artículos</p>
                <button
                  onClick={() => refetchPosts()}
                  className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  Reintentar
                </button>
              </div>
            ) : posts && posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <BlogCard
                      key={post._id}
                      post={post}
                      variant="default"
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    
                    <div className="flex gap-2">
                      {[...Array(pagination.pages)].map((_, i) => {
                        const page = i + 1;
                        // Show first, last, current, and adjacent pages
                        if (
                          page === 1 ||
                          page === pagination.pages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-4 py-2 rounded-lg ${
                                page === currentPage
                                  ? 'bg-blue-600 dark:bg-blue-700 text-white'
                                  : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return <span key={page} className="px-2 text-gray-500 dark:text-gray-400">...</span>;
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.pages}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-lg">No hay artículos para mostrar</p>
                {selectedCategory && (
                  <button
                    onClick={() => handleCategoryClick(null)}
                    className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    Ver todos los artículos
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Categorías</h3>
              {categoriesLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-gray-200 dark:bg-gray-700 h-8 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : categories && categories.length > 0 ? (
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryClick(null)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === null
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Todas</span>
                      {pagination && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">{pagination.total}</span>
                      )}
                    </div>
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => handleCategoryClick(category._id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category._id
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{category.image?.alt || '📁'}</span>
                          <span>{category.name}</span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {category.postCount || 0}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No hay categorías</p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                    <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total de artículos</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {pagination?.total || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                    <User className="text-green-600 dark:text-green-400" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Autores</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {categories?.length || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                    <Clock className="text-purple-600 dark:text-purple-400" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tiempo promedio</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">5 min</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
};

export default BlogHome;
