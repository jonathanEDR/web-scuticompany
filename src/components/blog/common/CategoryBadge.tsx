/**
 * 🏷️ CategoryBadge Component
 * Badge visual para mostrar categorías del blog
 */

import { Link } from 'react-router-dom';
import type { BlogCategory } from '../../../types/blog';

interface CategoryBadgeProps {
  category: BlogCategory;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  clickable?: boolean;
  className?: string;
}

export default function CategoryBadge({
  category,
  size = 'md',
  showIcon = true,
  clickable = true,
  className = ''
}: CategoryBadgeProps) {
  
  // Estilos por tamaño
  const sizeClasses = {
    xs: 'text-xs px-2 py-0.5',
    sm: 'text-sm px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  // Estilos base del badge
  const badgeClass = `
    inline-flex items-center gap-1.5
    ${sizeClasses[size]}
    font-medium rounded-full
    transition-all duration-200
    ${clickable ? 'hover:shadow-md hover:scale-105 cursor-pointer' : ''}
    ${className}
  `;

  // Estilos de color basados en el color de la categoría
  const colorStyle = {
    backgroundColor: category.color + '15', // 15 = ~8% opacity
    color: category.color,
    borderColor: category.color + '40', // 40 = ~25% opacity
  };

  const content = (
    <>
      {showIcon && category.image?.alt && (
        <span 
          className={`${iconSizes[size]} flex-shrink-0`}
          dangerouslySetInnerHTML={{ __html: category.image.alt }}
        />
      )}
      <span className="truncate">{category.name}</span>
    </>
  );

  if (clickable) {
    return (
      <Link
        to={`/blog/categoria/${category.slug}`}
        className={badgeClass}
        style={colorStyle}
        title={category.description}
      >
        {content}
      </Link>
    );
  }

  return (
    <span
      className={`${badgeClass} border`}
      style={colorStyle}
      title={category.description}
    >
      {content}
    </span>
  );
}
