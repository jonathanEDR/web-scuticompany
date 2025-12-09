/**
 * 📸 PostHero Component - Hero compacto para posts
 * Combina imagen destacada con título y metadata de forma elegante
 * Soporta tema claro y oscuro
 */

import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Eye, ArrowLeft } from 'lucide-react';
import { CategoryBadge, ReadingTimeIndicator, LikeButton, FavoriteButton } from './';
import { getImageUrl } from '../../../utils/imageUtils';
import LazyImage from './LazyImage';
import type { BlogPost } from '../../../types/blog';

interface PostHeroProps {
  post: BlogPost;
  variant?: 'overlay' | 'split' | 'compact';
  className?: string;
  // CMS Configuration Props
  showBreadcrumb?: boolean;
  showBackButton?: boolean;
  showCategory?: boolean;
  showReadingTime?: boolean;
  showPublishDate?: boolean;
  showAuthor?: boolean;
  overlayOpacity?: number;
}

export default function PostHero({ 
  post, 
  variant = 'overlay',
  className = '',
  // CMS defaults
  showBreadcrumb = true,
  showBackButton = true,
  showCategory = true,
  showReadingTime = true,
  showPublishDate = true,
  showAuthor = true,
  overlayOpacity = 60
}: PostHeroProps) {
  
  // Calcular opacidad del overlay
  const overlayOpacityValue = overlayOpacity / 100;
  
  // Variante Overlay: Imagen con título superpuesto
  if (variant === 'overlay' && post.featuredImage) {
    return (
      <header className={`post-hero relative ${className}`}>
        {/* Imagen de fondo */}
        <div className="relative h-[280px] sm:h-[320px] lg:h-[380px] overflow-hidden">
          <LazyImage
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {/* Overlay oscuro gradiente - Opacidad configurable */}
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" 
            style={{ opacity: overlayOpacityValue }}
          />
          
          {/* Contenido superpuesto */}
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pb-8">
              {/* Breadcrumb */}
              {(showBreadcrumb || showBackButton) && (
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white font-medium mb-4 transition-colors"
                >
                  <ArrowLeft size={16} />
                  Volver al blog
                </Link>
              )}

              {/* Category */}
              {showCategory && post.category && (
                <div className="mb-3">
                  <CategoryBadge category={post.category} />
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight max-w-4xl">
                {post.title}
              </h1>

              {/* Meta compacto */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
                {/* Author */}
                {showAuthor && post.author && (
                  <div className="flex items-center gap-2">
                    {post.author.avatar ? (
                      <LazyImage
                        src={getImageUrl(post.author.avatar)}
                        alt={`${post.author.firstName || ''} ${post.author.lastName || ''}`}
                        className="w-7 h-7 rounded-full object-cover border-2 border-white/30"
                        width={28}
                        height={28}
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                        <User className="text-white" size={14} />
                      </div>
                    )}
                    <span className="font-medium text-white">
                      {post.author.firstName || ''} {post.author.lastName || ''}
                    </span>
                  </div>
                )}
                
                {showAuthor && post.author && showPublishDate && <span className="text-white/40">•</span>}
                
                {/* Date */}
                {showPublishDate && (
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </time>
                  </div>
                )}
                
                {showPublishDate && showReadingTime && <span className="text-white/40">•</span>}
                
                {/* Reading Time */}
                {showReadingTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <ReadingTimeIndicator minutes={post.readingTime} variant="minimal" />
                  </div>
                )}

                {/* Views */}
                {post.stats?.views && (
                  <>
                    <span className="hidden sm:inline text-white/40">•</span>
                    <div className="hidden sm:flex items-center gap-1.5">
                      <Eye size={14} />
                      <span>{post.stats.views.toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Acciones debajo de la imagen */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-2xl line-clamp-2">
                {post.excerpt}
              </p>
            )}
            
            {/* Botones */}
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <LikeButton postId={post._id} size="sm" />
              <FavoriteButton postId={post._id} size="sm" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Variante Compact: Sin imagen o imagen pequeña
  return (
    <header className={`post-hero bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="py-6 lg:py-8">
          {/* Breadcrumb */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Volver al blog
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
            {/* Imagen pequeña lateral (si existe) */}
            {post.featuredImage && (
              <div className="lg:order-2 mb-4 lg:mb-0 lg:flex-shrink-0">
                <div className="w-full lg:w-48 h-32 lg:h-32 rounded-xl overflow-hidden shadow-md">
                  <LazyImage
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Contenido principal */}
            <div className="flex-1 lg:order-1">
              {/* Category */}
              {post.category && (
                <div className="mb-3">
                  <CategoryBadge category={post.category} />
                </div>
              )}

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed max-w-3xl">
                  {post.excerpt}
                </p>
              )}

              {/* Meta Bar */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                {/* Author */}
                {post.author && (
                  <div className="flex items-center gap-2">
                    {post.author.avatar ? (
                      <LazyImage
                        src={getImageUrl(post.author.avatar)}
                        alt={`${post.author.firstName || ''} ${post.author.lastName || ''}`}
                        className="w-6 h-6 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        width={24}
                        height={24}
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <User className="text-purple-600 dark:text-purple-400" size={12} />
                      </div>
                    )}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {post.author.firstName || ''} {post.author.lastName || ''}
                    </span>
                  </div>
                )}
                
                <span className="text-gray-300 dark:text-gray-600">•</span>
                
                {/* Date */}
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-gray-400" />
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                
                <span className="text-gray-300 dark:text-gray-600">•</span>
                
                {/* Reading Time */}
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-gray-400" />
                  <ReadingTimeIndicator minutes={post.readingTime} variant="minimal" />
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Botones */}
                <div className="flex items-center gap-2">
                  <LikeButton postId={post._id} size="sm" />
                  <FavoriteButton postId={post._id} size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
