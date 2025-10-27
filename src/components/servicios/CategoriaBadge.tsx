/**
 * 🏷️ BADGE DE CATEGORÍA - CategoriaBadge
 * Componente para mostrar la categoría de un servicio con iconos y colores
 */

import React from 'react';

// ============================================
// CONFIGURACIÓN DE CATEGORÍAS
// ============================================

interface CategoriaConfig {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
}

const categoriaConfig: Record<string, CategoriaConfig> = {
  desarrollo: {
    label: 'Desarrollo',
    icon: '💻',
    color: 'text-blue-300',
    bgColor: 'bg-blue-600/20 border-blue-500/50'
  },
  diseño: {
    label: 'Diseño',
    icon: '🎨',
    color: 'text-pink-300',
    bgColor: 'bg-pink-600/20 border-pink-500/50'
  },
  marketing: {
    label: 'Marketing',
    icon: '📊',
    color: 'text-green-300',
    bgColor: 'bg-green-600/20 border-green-500/50'
  },
  consultoría: {
    label: 'Consultoría',
    icon: '💼',
    color: 'text-purple-300',
    bgColor: 'bg-purple-600/20 border-purple-500/50'
  },
  mantenimiento: {
    label: 'Mantenimiento',
    icon: '🔧',
    color: 'text-orange-300',
    bgColor: 'bg-orange-600/20 border-orange-500/50'
  },
  otro: {
    label: 'Otro',
    icon: '📦',
    color: 'text-gray-300',
    bgColor: 'bg-gray-600/20 border-gray-500/50'
  }
};

// ============================================
// TIPOS
// ============================================

interface CategoriaBadgeProps {
  categoria: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// ============================================
// COMPONENTE
// ============================================

/**
 * Badge para mostrar la categoría de un servicio
 * 
 * @example
 * ```tsx
 * <CategoriaBadge categoria="desarrollo" />
 * <CategoriaBadge categoria="marketing" showIcon={false} />
 * ```
 */
export const CategoriaBadge: React.FC<CategoriaBadgeProps> = ({
  categoria,
  showIcon = true,
  size = 'md',
  className = ''
}) => {
  // Obtener configuración de la categoría
  const config = categoriaConfig[categoria.toLowerCase()] || categoriaConfig.otro;

  // Tamaños
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 
        ${sizeClasses[size]}
        ${config.color}
        ${config.bgColor}
        border rounded-full font-semibold
        ${className}
      `}
      title={`Categoría: ${config.label}`}
    >
      {showIcon && <span className="text-sm">{config.icon}</span>}
      <span>{config.label}</span>
    </span>
  );
};

export default CategoriaBadge;
