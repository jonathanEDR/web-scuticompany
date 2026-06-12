/**
 * 🏷️ BADGE DE ESTADO - EstadoBadge
 * Componente para mostrar el estado de un servicio con colores y estilos específicos
 */

import React from 'react';
import { Check, Settings, Pause, XCircle, Ban, type LucideIcon } from 'lucide-react';

// ============================================
// CONFIGURACIÓN DE ESTADOS
// ============================================

interface EstadoConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: LucideIcon;
}

const estadoConfig: Record<string, EstadoConfig> = {
  activo: {
    label: 'Activo',
    color: 'text-green-700 dark:text-green-300',
    bgColor: 'bg-green-500/20 border-green-500/50',
    icon: Check
  },
  desarrollo: {
    label: 'En desarrollo',
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'bg-blue-500/20 border-blue-500/50',
    icon: Settings
  },
  pausado: {
    label: 'Pausado',
    color: 'text-yellow-700 dark:text-yellow-300',
    bgColor: 'bg-yellow-500/20 border-yellow-500/50',
    icon: Pause
  },
  descontinuado: {
    label: 'Descontinuado',
    color: 'text-red-700 dark:text-red-300',
    bgColor: 'bg-red-500/20 border-red-500/50',
    icon: XCircle
  },
  agotado: {
    label: 'Agotado',
    color: 'text-gray-700 dark:text-gray-300',
    bgColor: 'bg-gray-500/20 border-gray-500/50',
    icon: Ban
  }
};

// ============================================
// TIPOS
// ============================================

interface EstadoBadgeProps {
  estado: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// ============================================
// COMPONENTE
// ============================================

/**
 * Badge para mostrar el estado de un servicio
 * 
 * @example
 * ```tsx
 * <EstadoBadge estado="activo" />
 * <EstadoBadge estado="pausado" showIcon size="lg" />
 * ```
 */
export const EstadoBadge: React.FC<EstadoBadgeProps> = ({
  estado,
  showIcon = true,
  size = 'md',
  className = ''
}) => {
  // Obtener configuración del estado
  const config = estadoConfig[estado.toLowerCase()] || estadoConfig.activo;
  const Icon = config.icon;

  // Tamaños
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  const iconSizes = { sm: 12, md: 14, lg: 16 };

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
      title={`Estado: ${config.label}`}
    >
      {showIcon && <Icon size={iconSizes[size]} strokeWidth={1.5} />}
      <span>{config.label}</span>
    </span>
  );
};

export default EstadoBadge;
