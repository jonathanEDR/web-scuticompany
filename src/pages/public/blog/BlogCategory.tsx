import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Folder } from 'lucide-react';
import { useBlogPosts } from '../../../hooks/blog';
import { useCategories } from '../../../hooks/blog';
import { BlogCard, CategoryBadge } from '../../../components/blog/common';
import PublicFooter from '../../../components/public/PublicFooter';

const BlogCategory: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  const { categories, loading: categoriesLoading } = useCategories();
  
  // Find category by slug
  const category = categories?.find(c => c.slug === slug);

  const { 
    posts, 
    loading: postsLoading, 
    error,
    pagination,
    refetch
  } = useBlogPosts({
    page: currentPage,
    limit: postsPerPage,
    categoria: category?._id,
    isPublished: true
  });

  useEffect(() => {
    if (category) {
      document.title = `${category.name} | Blog Web Scuti`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [category]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (categoriesLoading || (postsLoading && !posts)) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="bg-gray-200 h-8 w-32 rounded"></div>
            <div className="bg-gray-200 h-12 w-64 rounded"></div>
            <div className="bg-gray-200 h-6 w-96 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="bg-gray-200 h-48 rounded mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Category not found
  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Folder className="mx-auto text-gray-400 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Categoría no encontrada
            </h2>
            <p className="text-gray-600 mb-6">
              La categoría que buscas no existe o ha sido eliminada.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft size={20} />
              Volver al blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
          >
            <ArrowLeft size={20} />
            Volver al blog
          </Link>

          <div className="mb-4">
            <CategoryBadge category={category} />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {category.name}
          </h1>

          {category.description && (
            <p className="text-xl text-gray-600 max-w-3xl">
              {category.description}
            </p>
          )}

          <div className="mt-6 flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Folder size={18} />
              <span>
                {pagination?.total || 0} {(pagination?.total || 0) === 1 ? 'artículo' : 'artículos'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="container mx-auto px-4 py-12">
        {postsLoading && !posts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">Error al cargar los artículos</p>
            <button
              onClick={() => refetch()}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Reintentar
            </button>
          </div>
        ) : posts && posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="px-2">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Folder className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay artículos en esta categoría
            </h3>
            <p className="text-gray-600 mb-6">
              Aún no se han publicado artículos en "{category.name}"
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft size={20} />
              Ver todos los artículos
            </Link>
          </div>
        )}
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
};

export default BlogCategory;
