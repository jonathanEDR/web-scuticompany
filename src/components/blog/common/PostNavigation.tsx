/**
 * 📍 PostNavigation Component
 * Navegación entre posts anterior y siguiente
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { useBlogPosts } from '../../../hooks/blog';
import type { BlogPost } from '../../../types/blog';

interface PostNavigationProps {
  currentPost: BlogPost;
  className?: string;
}

interface NavigationPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  readingTime: number;
  featuredImage?: string;
}

export default function PostNavigation({
  currentPost,
  className = ''
}: PostNavigationProps) {
  
  const [previousPost, setPreviousPost] = useState<NavigationPost | null>(null);
  const [nextPost, setNextPost] = useState<NavigationPost | null>(null);
  
  // Obtener posts de la misma categoría para navegación
  const { posts } = useBlogPosts({
    categoria: currentPost.category._id,
    isPublished: true,
    limit: 50, // Suficientes para encontrar anterior/siguiente
    sort: 'publishedAt'
  });

  useEffect(() => {
    if (!posts || posts.length === 0) return;

    const currentIndex = posts.findIndex(post => post._id === currentPost._id);
    
    if (currentIndex === -1) return;

    // Post anterior (más reciente)
    if (currentIndex > 0) {
      setNextPost({
        _id: posts[currentIndex - 1]._id,
        title: posts[currentIndex - 1].title,
        slug: posts[currentIndex - 1].slug,
        excerpt: posts[currentIndex - 1].excerpt,
        publishedAt: posts[currentIndex - 1].publishedAt,
        readingTime: posts[currentIndex - 1].readingTime,
        featuredImage: posts[currentIndex - 1].featuredImage
      });
    } else {
      setNextPost(null);
    }

    // Post siguiente (más antiguo)
    if (currentIndex < posts.length - 1) {
      setPreviousPost({
        _id: posts[currentIndex + 1]._id,
        title: posts[currentIndex + 1].title,
        slug: posts[currentIndex + 1].slug,
        excerpt: posts[currentIndex + 1].excerpt,
        publishedAt: posts[currentIndex + 1].publishedAt,
        readingTime: posts[currentIndex + 1].readingTime,
        featuredImage: posts[currentIndex + 1].featuredImage
      });
    } else {
      setPreviousPost(null);
    }
  }, [posts, currentPost._id]);

  // Si no hay posts anterior ni siguiente, no mostrar el componente
  if (!previousPost && !nextPost) {
    return null;
  }

  return (
    <nav className={`post-navigation ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-blue-600 dark:bg-blue-500 rounded-full"></span>
          Navegación en {currentPost.category.name}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Post Anterior */}
          {previousPost ? (
            <Link
              to={`/blog/${previousPost.slug}`}
              className="group flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
            >
              <div className="flex-shrink-0 mt-1">
                <ChevronLeft className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">← Anterior</p>
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 transition-colors mb-2">
                  {previousPost.title}
                </h4>
                {previousPost.excerpt && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {previousPost.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span className="hidden sm:inline">{new Date(previousPost.publishedAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{previousPost.readingTime} min</span>
                  </div>
                </div>
              </div>
              {previousPost.featuredImage && (
                <div className="hidden sm:block flex-shrink-0">
                  <img
                    src={previousPost.featuredImage}
                    alt={previousPost.title}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  />
                </div>
              )}
            </Link>
          ) : (
            <div className="flex items-center justify-center p-5 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-sm text-gray-500 dark:text-gray-400">No hay artículo anterior</p>
            </div>
          )}

          {/* Post Siguiente */}
          {nextPost ? (
            <Link
              to={`/blog/${nextPost.slug}`}
              className="group flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
            >
              {nextPost.featuredImage && (
                <div className="hidden sm:block flex-shrink-0">
                  <img
                    src={nextPost.featuredImage}
                    alt={nextPost.title}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2 text-right">Siguiente →</p>
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 transition-colors mb-2 text-right">
                  {nextPost.title}
                </h4>
                {nextPost.excerpt && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2 text-right">
                    {nextPost.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-end gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span className="hidden sm:inline">{new Date(nextPost.publishedAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{nextPost.readingTime} min</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 mt-1">
                <ChevronRight className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" size={20} />
              </div>
            </Link>
          ) : (
            <div className="flex items-center justify-center p-5 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-sm text-gray-500 dark:text-gray-400">No hay artículo siguiente</p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}