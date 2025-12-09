/**
 * 📰 RelatedPosts Component
 * Muestra posts relacionados basados en categoría y tags
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { useBlogPosts } from '../../../hooks/blog';
import { BlogCard } from '../common';
import type { BlogPost } from '../../../types/blog';

// Estilos configurables desde CMS
export interface RelatedPostsStyles {
  sectionBackground?: { light?: string; dark?: string };
  sectionBorder?: { light?: string; dark?: string };
  cardBackground?: { light?: string; dark?: string };
  cardBorder?: { light?: string; dark?: string };
  titleColor?: { light?: string; dark?: string };
  buttonBackground?: { light?: string; dark?: string };
  buttonText?: { light?: string; dark?: string };
  linkColor?: { light?: string; dark?: string };
}

interface RelatedPostsProps {
  currentPost: BlogPost;
  maxPosts?: number;
  className?: string;
  styles?: RelatedPostsStyles;
  theme?: 'light' | 'dark';
  showCategoryLink?: boolean;
  showExploreButton?: boolean;
  title?: string;
}

export default function RelatedPosts({
  currentPost,
  maxPosts = 4,
  className = '',
  styles,
  theme = 'light',
  showCategoryLink = true,
  showExploreButton = true,
  title = 'Artículos Relacionados'
}: RelatedPostsProps) {
  
  // Calcular estilos dinámicos desde CMS
  const currentStyles = {
    sectionBackground: theme === 'dark' ? styles?.sectionBackground?.dark : styles?.sectionBackground?.light,
    sectionBorder: theme === 'dark' ? styles?.sectionBorder?.dark : styles?.sectionBorder?.light,
    cardBackground: theme === 'dark' ? styles?.cardBackground?.dark : styles?.cardBackground?.light,
    cardBorder: theme === 'dark' ? styles?.cardBorder?.dark : styles?.cardBorder?.light,
    titleColor: theme === 'dark' ? styles?.titleColor?.dark : styles?.titleColor?.light,
    buttonBackground: theme === 'dark' ? styles?.buttonBackground?.dark : styles?.buttonBackground?.light,
    buttonText: theme === 'dark' ? styles?.buttonText?.dark : styles?.buttonText?.light,
    linkColor: theme === 'dark' ? styles?.linkColor?.dark : styles?.linkColor?.light,
  };

  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  
  // Extraer nombres de tags válidos (solo si están populated como objetos con name)
  const validTagNames = useMemo(() => {
    if (!currentPost.tags || currentPost.tags.length === 0) return [];
    
    return currentPost.tags
      .slice(0, 3)
      .map(tag => {
        // Si es un objeto con propiedad 'name', usar eso
        if (typeof tag === 'object' && tag !== null && 'name' in tag) {
          const name = (tag as { name: string }).name;
          // Validar que el name tampoco sea un ID
          if (name && typeof name === 'string' && !/^[a-f0-9]+$/i.test(name)) {
            return name;
          }
          return null;
        }
        // Si es un string que parece cualquier tipo de ID (solo caracteres hex), ignorarlo
        // Esto cubre ObjectIds de 24 chars, IDs truncados, y cualquier string solo-hex
        if (typeof tag === 'string' && /^[a-f0-9]+$/i.test(tag)) {
          return null;
        }
        // Si es un string normal (nombre del tag con letras/palabras), usarlo
        if (typeof tag === 'string' && tag.length > 0 && tag.length < 100) {
          return tag;
        }
        return null;
      })
      .filter((name): name is string => name !== null && name.length > 0);
  }, [currentPost.tags]);
  
  // Buscar posts de la misma categoría (siempre funciona)
  const { posts: categoryPosts } = useBlogPosts({
    limit: maxPosts + 2,
    categoria: currentPost.category?._id,
    isPublished: true
  });

  // Solo buscar por tags si tenemos nombres válidos
  const { posts: tagPosts } = useBlogPosts(
    validTagNames.length > 0 
      ? {
          limit: maxPosts,
          tags: validTagNames,
          isPublished: true
        }
      : { limit: 0 } // No hacer la petición si no hay tags válidos
  );

  useEffect(() => {
    if (categoryPosts || tagPosts) {
      // Combinar y filtrar posts
      const allRelated = [
        ...(categoryPosts || []),
        ...(tagPosts || [])
      ];

      // Remover el post actual, duplicados, y posts sin imagen o datos esenciales
      const uniquePosts = allRelated
        .filter(post => post._id !== currentPost._id)
        .filter(post => post.featuredImage && post.title && post.slug) // Solo posts completos
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
    <section 
      className={`related-posts rounded-xl shadow-sm p-6 sm:p-8 ${!currentStyles.sectionBackground ? 'bg-white dark:bg-gray-800' : ''} ${!currentStyles.sectionBorder ? 'border border-gray-200 dark:border-gray-700' : ''} ${className}`}
      style={{
        backgroundColor: currentStyles.sectionBackground || undefined,
        borderColor: currentStyles.sectionBorder || undefined,
        borderWidth: currentStyles.sectionBorder ? '1px' : undefined,
        borderStyle: currentStyles.sectionBorder ? 'solid' : undefined,
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <TrendingUp className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h2 
            className={`text-2xl font-bold ${!currentStyles.titleColor ? 'text-gray-900 dark:text-white' : ''}`}
            style={{ color: currentStyles.titleColor || undefined }}
          >
            {title}
          </h2>
        </div>
        
        {showCategoryLink && (
          <Link
            to="/blog"
            className={`hidden sm:inline-flex items-center gap-2 text-sm font-medium transition-colors ${!currentStyles.linkColor ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300' : 'hover:opacity-80'}`}
            style={{ color: currentStyles.linkColor || undefined }}
          >
            Ver más artículos
            <ArrowRight size={16} />
          </Link>
        )}
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
      {showCategoryLink && (
        <Link
          to="/blog"
          className={`sm:hidden mt-6 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${!currentStyles.linkColor ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300' : 'hover:opacity-80'}`}
          style={{ color: currentStyles.linkColor || undefined }}
        >
          Ver más artículos
          <ArrowRight size={16} />
        </Link>
      )}

      {/* CTA para más contenido */}
      {showExploreButton && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <Link
            to="/blog"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md ${!currentStyles.buttonBackground ? 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800' : 'hover:opacity-90'}`}
            style={{
              background: currentStyles.buttonBackground || undefined,
              color: currentStyles.buttonText || undefined,
            }}
          >
            Explorar más artículos
            <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </section>
  );
}