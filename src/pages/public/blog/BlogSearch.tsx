import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { useBlogPosts } from '../../../hooks/blog';
import { useCategories } from '../../../hooks/blog';
import { BlogCard } from '../../../components/blog/common';
import { FilterSidebar } from '../../../components/blog/search';
import type { BlogFilters } from '../../../types/blog';
import PublicFooter from '../../../components/public/PublicFooter';

const BlogSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  
  // Get filters from URL
  const searchQuery = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('categoria') || undefined;
  const tagFilter = searchParams.get('tag') || undefined;
  const sortBy = (searchParams.get('sort') || 'createdAt') as BlogFilters['sort'];

  const { 
    posts, 
    loading, 
    error,
    pagination,
    refetch
  } = useBlogPosts({
    page: currentPage,
    limit: 12,
    search: searchQuery || undefined,
    categoria: categoryFilter,
    tags: tagFilter ? [tagFilter] : undefined,
    sort: sortBy,
    isPublished: true
  });

  const { categories } = useCategories();

  useEffect(() => {
    setSearchInput(searchQuery);
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, tagFilter, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('q', searchInput.trim());
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const handleFilterChange = (filters: { categories?: string[]; tags?: string[]; sortBy?: string }) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (filters.categories && filters.categories.length > 0) {
      newParams.set('categoria', filters.categories[0]);
    } else {
      newParams.delete('categoria');
    }
    
    if (filters.tags && filters.tags.length > 0) {
      newParams.set('tag', filters.tags[0]);
    } else {
      newParams.delete('tag');
    }
    
    if (filters.sortBy) {
      newParams.set('sort', filters.sortBy);
    }
    
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || categoryFilter || tagFilter || sortBy !== 'createdAt';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Buscar Artículos
              </h1>
              <Link
                to="/blog"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Volver al blog
              </Link>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Buscar por título, contenido o tags..."
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-3 mb-4 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Filter size={20} />
              <span className="font-medium">
                {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
              </span>
            </button>

            {/* Filter Sidebar */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
              <FilterSidebar
                filters={{
                  categories: categoryFilter ? [categoryFilter] : [],
                  tags: tagFilter ? [tagFilter] : [],
                  sortBy: sortBy
                }}
                onFiltersChange={handleFilterChange}
                categories={categories || []}
              />
            </div>
          </aside>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  {searchQuery && (
                    <p className="text-gray-600 dark:text-gray-400 mb-1">
                      Resultados para: <span className="font-semibold text-gray-900 dark:text-white">"{searchQuery}"</span>
                    </p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {loading ? 'Buscando...' : `${pagination?.total || 0} artículos encontrados`}
                  </p>
                </div>
                
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    <X size={18} />
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>

            {/* Results Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
                    <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
                <p className="text-red-600 dark:text-red-400 mb-4">Error al cargar los resultados</p>
                <button
                  onClick={() => refetch()}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
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
                  <div className="mt-8 flex justify-center items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    
                    <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      Página {currentPage} de {pagination.pages}
                    </span>

                    <button
                      onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
                      disabled={currentPage === pagination.pages}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-12 text-center">
                <SearchIcon className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No se encontraron resultados
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Intenta con otros términos de búsqueda o ajusta los filtros
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
};

export default BlogSearch;
