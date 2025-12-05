/**
 * 🎯 Featured Blog Card
 * Tarjeta destacada para el blog - estilo maqueta con imagen de fondo
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { extractFirstImage } from '../../../utils/blog';
import type { BlogPost } from '../../../types/blog';
import type { FeaturedPostsConfig } from '../../../hooks/blog/useBlogCmsConfig';

interface FeaturedBlogCardProps {
  post: BlogPost;
  variant?: 'hero' | 'small';
  config?: FeaturedPostsConfig;
}

export const FeaturedBlogCard: React.FC<FeaturedBlogCardProps> = ({
  post,
  variant = 'hero',
  config
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Estilos desde config o defaults
  const heroStyles = config?.heroCard || {};
  const smallStyles = config?.smallCard || {};
  const fontFamily = config?.fontFamily || 'Montserrat';

  // Obtener imagen con fallback
  const getPostImage = (): string | null => {
    if (post.featuredImage) return post.featuredImage;
    const contentImage = extractFirstImage(post.content);
    if (contentImage) return contentImage;
    if (post.images && post.images.length > 0) {
      const firstImage = post.images[0];
      return typeof firstImage === 'string' ? firstImage : firstImage.url;
    }
    return null;
  };
  const postImage = getPostImage();

  // Variante Hero - Tarjeta estilo maqueta con franja superpuesta
  if (variant === 'hero') {
    return (
      <article 
        className="relative group overflow-hidden rounded-2xl shadow-lg h-[450px] md:h-[550px]"
        style={{ 
          fontFamily: `'${fontFamily}', sans-serif`,
          border: `${heroStyles.cardBorderWidth || 2}px solid ${heroStyles.cardBorderColor || 'transparent'}`
        }}
      >
        {/* Imagen de fondo - Ocupa toda la tarjeta */}
        <div className="absolute inset-0">
          {postImage ? (
            <img
              src={postImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800" />
          )}
        </div>

        {/* Franja oscura superpuesta - Con margen inferior para ver la imagen */}
        <div 
          className="absolute bottom-6 left-0 right-0 mx-0 p-5 md:p-6"
          style={{ 
            backgroundColor: heroStyles.contentBgColor || 'rgba(0,0,0,0.92)',
          }}
        >
          {/* Fecha */}
          <div 
            className="flex items-center gap-2 text-xs md:text-sm mb-2"
            style={{ color: heroStyles.dateColor || '#9ca3af' }}
          >
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
          </div>

          {/* Título */}
          <h3 
            className="text-lg md:text-xl font-bold mb-2 leading-tight group-hover:opacity-80 transition-opacity"
            style={{ 
              color: heroStyles.titleColor || '#ffffff',
              fontFamily: `'${fontFamily}', sans-serif`
            }}
          >
            <Link to={`/blog/${post.slug}`} className="block">
              {post.title}
            </Link>
          </h3>

          {/* Extracto */}
          <p 
            className="text-xs md:text-sm mb-3 line-clamp-2"
            style={{ 
              color: heroStyles.excerptColor || '#d1d5db',
              fontFamily: `'${fontFamily}', sans-serif`
            }}
          >
            {post.excerpt}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 text-xs rounded-md font-medium"
                  style={{
                    backgroundColor: heroStyles.tagBgColor || 'rgba(255,255,255,0.1)',
                    color: heroStyles.tagTextColor || '#d1d5db',
                    border: `1px solid ${heroStyles.tagBorderColor || 'rgba(255,255,255,0.2)'}`
                  }}
                >
                  {typeof tag === 'string' ? tag : tag.name}
                </span>
              ))}
              {post.tags.length > 2 && (
                <span className="text-xs text-gray-400 py-1">
                  +{post.tags.length - 2} más
                </span>
              )}
            </div>
          )}

          {/* Botón Ver más */}
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300"
            style={{
              backgroundColor: heroStyles.buttonBgColor || 'transparent',
              color: heroStyles.buttonTextColor || '#00ffff',
              border: `${heroStyles.buttonBorderWidth || 2}px solid ${heroStyles.buttonBorderColor || '#00ffff'}`,
              fontFamily: `'${fontFamily}', sans-serif`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = heroStyles.buttonBorderColor || '#00ffff';
              e.currentTarget.style.color = '#000000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = heroStyles.buttonBgColor || 'transparent';
              e.currentTarget.style.color = heroStyles.buttonTextColor || '#00ffff';
            }}
          >
            Ver más
          </Link>
        </div>
      </article>
    );
  }

  // Variante Small - Tarjeta pequeña sin imagen
  return (
    <article 
      className="rounded-xl p-5 hover:shadow-lg transition-all duration-300 group border"
      style={{
        backgroundColor: smallStyles.bgColor || '#ffffff',
        borderColor: smallStyles.borderColor || '#e5e7eb',
        fontFamily: `'${fontFamily}', sans-serif`
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = smallStyles.hoverBorderColor || '#93c5fd';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = smallStyles.borderColor || '#e5e7eb';
      }}
    >
      {/* Categoría badge */}
      {post.category && (
        <span 
          className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4"
          style={{
            backgroundColor: smallStyles.categoryBgColor || '#2563eb',
            color: smallStyles.categoryTextColor || '#ffffff'
          }}
        >
          {typeof post.category === 'string' ? post.category : post.category.name}
        </span>
      )}

      {/* Fecha */}
      <div 
        className="flex items-center gap-2 text-sm mb-3"
        style={{ color: smallStyles.dateColor || '#6b7280' }}
      >
        <Calendar className="w-4 h-4" />
        <time dateTime={post.publishedAt}>
          {formatDate(post.publishedAt)}
        </time>
      </div>

      {/* Título */}
      <h3 
        className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors leading-tight"
        style={{ color: smallStyles.titleColor || '#111827' }}
      >
        <Link to={`/blog/${post.slug}`} className="block">
          {post.title}
        </Link>
      </h3>

      {/* Extracto */}
      <p 
        className="text-sm line-clamp-2"
        style={{ color: smallStyles.excerptColor || '#4b5563' }}
      >
        {post.excerpt}
      </p>
    </article>
  );
};

export default FeaturedBlogCard;
