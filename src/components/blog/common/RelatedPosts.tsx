/**
 * 📰 RelatedPosts Component
 * Muestra posts relacionados basados en categoría y tags
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { useBlogPosts } from '../../../hooks/blog';
import { BlogCard } from '../common';
import type { BlogPost } from '../../../types/blog';

interface RelatedPostsProps {
  currentPost: BlogPost;
  maxPosts?: number;
  className?: string;
}

export default function RelatedPosts({
  currentPost,
  maxPosts = 4,
  className = ''
}: RelatedPostsProps) {
  
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  
  // Buscar posts de la misma categoría
  const { posts: categoryPosts } = useBlogPosts({
    limit: maxPosts + 2, // Traer extras en caso de que uno sea el actual
    categoria: currentPost.category._id,
    isPublished: true
  });

  // Buscar posts con tags similares
  const tagNames = currentPost.tags?.slice(0, 3).map(tag => 
    typeof tag === 'string' ? tag : tag.name
  );
  
  const { posts: tagPosts } = useBlogPosts({
    limit: maxPosts,
    tags: tagNames,
    isPublished: true
  });

  useEffect(() => {
    if (categoryPosts || tagPosts) {
      // Combinar y filtrar posts
      const allRelated = [
        ...(categoryPosts || []),
        ...(tagPosts || [])
      ];

      // Remover el post actual y duplicados
      const uniquePosts = allRelated
        .filter(post => post._id !== currentPost._id)
        .reduce((acc, current) => {
          const exists = acc.find(post => post._id === current._id);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, [] as BlogPost[])
        .slice(0, maxPosts);

      setRelatedPosts(uniquePosts);
    }
  }, [categoryPosts, tagPosts, currentPost._id, maxPosts]);

  if (!relatedPosts.length) {
    return null;
  }

  return (
    <section className={`related-posts bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <TrendingUp className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Artículos Relacionados
          </h2>
        </div>
        
        <Link
          to={`/blog/categoria/${currentPost.category.slug}`}
          className="hidden sm:inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
        >
          Ver más en {currentPost.category.name}
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedPosts.map((post) => (
          <BlogCard
            key={post._id}
            post={post}
            variant="compact"
            showExcerpt={false}
            showAuthor={false}
            showStats={false}
            showTags={false}
          />
        ))}
      </div>

      {/* Mobile CTA */}
      <Link
        to={`/blog/categoria/${currentPost.category.slug}`}
        className="sm:hidden mt-6 flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
      >
        Ver más en {currentPost.category.name}
        <ArrowRight size={16} />
      </Link>

      {/* CTA para más contenido */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors shadow-sm hover:shadow-md"
        >
          Explorar más artículos
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}