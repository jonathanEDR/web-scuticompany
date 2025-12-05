/**
 * 🎯 All News Card
 * Tarjeta para la sección "Todas las Noticias" - Estilo Maqueta
 * Soporta 3 variantes: image-overlay, text-only, compact
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Newspaper } from 'lucide-react';
import { extractFirstImage } from '../../../utils/blog';
import type { BlogPost } from '../../../types/blog';

export interface AllNewsCardConfig {
  // Variante de la tarjeta
  variant?: 'image-overlay' | 'text-only' | 'compact';
  // Colores
  overlayColor?: string;
  overlayOpacity?: number;
  bgColor?: string;
  titleColor?: string;
  excerptColor?: string;
  dateColor?: string;
  categoryBgColor?: string;
  categoryTextColor?: string;
  categoryPosition?: 'left' | 'center' | 'right';
  tagBgColor?: string;
  tagTextColor?: string;
  tagBorderColor?: string;
  // Botón
  showButton?: boolean;
  buttonText?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  buttonBorderColor?: string;
  buttonHoverBgColor?: string;
  buttonHoverTextColor?: string;
  // Autor
  showAuthor?: boolean;
  authorNameColor?: string;
  authorDateColor?: string;
  // Tamaño
  cardHeight?: string;
  cardWidth?: string;
  // Otros
  borderRadius?: string;
  fontFamily?: string;
}

interface AllNewsCardProps {
  post: BlogPost;
  variant?: 'image-overlay' | 'text-only' | 'compact';
  config?: AllNewsCardConfig;
  className?: string;
}

export const AllNewsCard: React.FC<AllNewsCardProps> = ({
  post,
  variant = 'image-overlay',
  config = {},
  className = ''
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const fontFamily = config.fontFamily || 'Montserrat';

  // Helper para obtener el nombre del autor
  const getAuthorName = (author: BlogPost['author']) => {
    if (!author) return 'Anónimo';
    return author.displayName || author.blogProfile?.displayName || 
           `${author.firstName || ''} ${author.lastName || ''}`.trim() || 
           author.username || 'Autor';
  };

  // Helper para obtener el avatar del autor (misma lógica que AuthorCard)
  const getAuthorAvatar = (author: BlogPost['author']) => {
    if (!author) return null;
    // Priorizar blogProfile.avatar (igual que AuthorCard)
    return author.blogProfile?.avatar || author.avatar || author.profileImage || null;
  };

  // Variante: Imagen con overlay (tarjetas laterales de la maqueta)
  if (variant === 'image-overlay') {
    // Calcular posición de la categoría
    const categoryPositionClass = config.categoryPosition === 'left' 
      ? 'left-4' 
      : config.categoryPosition === 'right' 
        ? 'right-4' 
        : 'left-1/2 transform -translate-x-1/2';

    // Imagen de fondo con fallback (igual que BlogCard)
    const getBackgroundImage = (): string | null => {
      // 1. Primero intentar featuredImage
      if (post.featuredImage) return post.featuredImage;
      // 2. Luego intentar extraer del contenido
      const contentImage = extractFirstImage(post.content);
      if (contentImage) return contentImage;
      // 3. Finalmente intentar el array de images
      if (post.images && post.images.length > 0) {
        const firstImage = post.images[0];
        return typeof firstImage === 'string' ? firstImage : firstImage.url;
      }
      return null;
    };
    const backgroundImage = getBackgroundImage();

    return (
      <article 
        className={`relative group overflow-hidden ${className}`}
        style={{ 
          borderRadius: config.borderRadius || '16px',
          fontFamily: `'${fontFamily}', sans-serif`,
          height: config.cardHeight || '400px',
          width: config.cardWidth || '100%'
        }}
      >
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          {backgroundImage ? (
            <img
              src={backgroundImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ 
                backgroundColor: config.bgColor || '#1f2937',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              <Newspaper className="w-16 h-16 text-white/30" />
            </div>
          )}
        </div>

        {/* Overlay gradiente - Normal */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-0"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)'
          }}
        />

        {/* Overlay hover - Fondo sólido que aparece en hover */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            backgroundColor: config.bgColor || '#1e1b4b',
            opacity: undefined // Se controla con las clases
          }}
        />

        {/* Categoría en la parte superior - Siempre visible */}
        {post.category && (
          <div className={`absolute top-4 z-10 ${categoryPositionClass}`}>
            <span 
              className="inline-block px-4 py-1.5 text-sm font-semibold rounded-full"
              style={{
                backgroundColor: config.categoryBgColor || '#8b5cf6',
                color: config.categoryTextColor || '#ffffff'
              }}
            >
              {typeof post.category === 'string' ? post.category : post.category.name}
            </span>
          </div>
        )}

        {/* Contenido normal (sin hover) - Título y autor en la parte inferior */}
        <div className="absolute bottom-0 left-0 right-0 p-6 transition-opacity duration-300 group-hover:opacity-0">
          {/* Título */}
          <h3 
            className="text-xl font-bold mb-4 leading-tight"
            style={{ color: config.titleColor || '#ffffff' }}
          >
            <Link to={`/blog/${post.slug}`} className="block">
              {post.title}
            </Link>
          </h3>

          {/* Autor y fecha */}
          {config.showAuthor !== false && post.author && (
            <div className="flex items-center gap-3">
              {getAuthorAvatar(post.author) ? (
                <img 
                  src={getAuthorAvatar(post.author)!} 
                  alt={getAuthorName(post.author)}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                />
              ) : (
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white/30 text-white font-semibold text-sm"
                  style={{ backgroundColor: config.categoryBgColor || '#8b5cf6' }}
                >
                  {getAuthorName(post.author).charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p 
                  className="text-sm font-medium"
                  style={{ color: config.authorNameColor || '#ffffff' }}
                >
                  {getAuthorName(post.author)}
                </p>
                <p 
                  className="text-xs"
                  style={{ color: config.authorDateColor || '#9ca3af' }}
                >
                  {formatDate(post.publishedAt)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Contenido expandido (en hover) - Título, extracto, tags y botón */}
        <div className="absolute inset-0 p-6 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          {/* Título */}
          <h3 
            className="text-2xl font-bold mb-3 leading-tight mt-12"
            style={{ color: config.titleColor || '#ffffff' }}
          >
            <Link to={`/blog/${post.slug}`} className="block hover:underline">
              {post.title}
            </Link>
          </h3>

          {/* Extracto */}
          <p 
            className="text-sm mb-4 line-clamp-3 flex-grow"
            style={{ color: config.excerptColor || '#d1d5db' }}
          >
            {post.excerpt}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs rounded-full border"
                  style={{
                    backgroundColor: config.tagBgColor || 'rgba(139, 92, 246, 0.3)',
                    borderColor: config.tagBorderColor || 'rgba(139, 92, 246, 0.5)',
                    color: config.tagTextColor || '#ffffff'
                  }}
                >
                  {typeof tag === 'string' ? tag : tag.name}
                </span>
              ))}
              {post.tags.length > 2 && (
                <span 
                  className="text-xs px-2 py-1"
                  style={{ color: config.excerptColor || '#9ca3af' }}
                >
                  +{post.tags.length - 2} más
                </span>
              )}
            </div>
          )}

          {/* Botón Ver más */}
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-full border-2 transition-all duration-300 hover:scale-105 self-start"
            style={{
              borderColor: config.buttonBorderColor || '#ffffff',
              color: config.buttonTextColor || '#ffffff',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = config.buttonHoverBgColor || '#ffffff';
              e.currentTarget.style.color = config.buttonHoverTextColor || '#1e1b4b';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = config.buttonTextColor || '#ffffff';
            }}
          >
            Ver más
          </Link>
        </div>
      </article>
    );
  }

  // Variante: Solo texto (tarjeta central de la maqueta) - Versión simple
  if (variant === 'text-only') {
    return (
      <article 
        className={`p-6 h-full flex flex-col ${className}`}
        style={{ 
          backgroundColor: config.bgColor || '#1e1b4b',
          borderRadius: config.borderRadius || '16px',
          fontFamily: `'${fontFamily}', sans-serif`
        }}
      >
        {/* Título grande */}
        <h3 
          className="text-2xl font-bold mb-4 leading-tight"
          style={{ color: config.titleColor || '#ffffff' }}
        >
          <Link to={`/blog/${post.slug}`} className="block hover:opacity-80 transition-opacity">
            {post.title}
          </Link>
        </h3>

        {/* Extracto */}
        <p 
          className="text-sm mb-4 flex-grow line-clamp-4"
          style={{ color: config.excerptColor || '#d1d5db' }}
        >
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="inline-block px-3 py-1 text-xs font-medium rounded"
                style={{
                  backgroundColor: config.tagBgColor || 'rgba(139, 92, 246, 0.3)',
                  color: config.tagTextColor || '#c4b5fd',
                  border: `1px solid ${config.tagBgColor || 'rgba(139, 92, 246, 0.5)'}`
                }}
              >
                {typeof tag === 'string' ? tag : tag.name}
              </span>
            ))}
            {post.tags.length > 2 && (
              <span 
                className="text-xs py-1"
                style={{ color: config.excerptColor || '#9ca3af' }}
              >
                +{post.tags.length - 2} más
              </span>
            )}
          </div>
        )}

        {/* Botón Ver más */}
        {config.showButton !== false && (
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 w-fit mt-auto hover:opacity-80"
            style={{
              backgroundColor: config.buttonBgColor || 'transparent',
              color: config.buttonTextColor || '#ffffff',
              border: `2px solid ${config.buttonBorderColor || '#ffffff'}`
            }}
          >
            {config.buttonText || 'Ver más'}
          </Link>
        )}
      </article>
    );
  }

  // Variante: Compacta (para grids más pequeños)
  return (
    <article 
      className={`overflow-hidden ${className}`}
      style={{ 
        borderRadius: config.borderRadius || '12px',
        backgroundColor: config.bgColor || '#ffffff',
        fontFamily: `'${fontFamily}', sans-serif`
      }}
    >
      {/* Imagen */}
      {post.featuredImage && (
        <div className="relative h-40">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {post.category && (
            <div className="absolute top-3 left-3">
              <span 
                className="inline-block px-3 py-1 text-xs font-semibold rounded-full"
                style={{
                  backgroundColor: config.categoryBgColor || '#2563eb',
                  color: config.categoryTextColor || '#ffffff'
                }}
              >
                {typeof post.category === 'string' ? post.category : post.category.name}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Contenido */}
      <div className="p-4">
        <div 
          className="flex items-center gap-2 text-xs mb-2"
          style={{ color: config.dateColor || '#6b7280' }}
        >
          <Calendar className="w-3 h-3" />
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </div>

        <h3 
          className="text-base font-bold mb-2 line-clamp-2"
          style={{ color: config.titleColor || '#111827' }}
        >
          <Link to={`/blog/${post.slug}`} className="hover:opacity-80 transition-opacity">
            {post.title}
          </Link>
        </h3>

        <p 
          className="text-sm line-clamp-2"
          style={{ color: config.excerptColor || '#4b5563' }}
        >
          {post.excerpt}
        </p>
      </div>
    </article>
  );
};

export default AllNewsCard;
