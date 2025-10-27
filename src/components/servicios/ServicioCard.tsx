/**
 * 🎴 CARD DE SERVICIO - ServicioCard
 * Componente para mostrar un servicio en formato tarjeta
 */

import React from 'react';
import { Link } from 'react-router-dom';
import type { Servicio } from '../../types/servicios';
import { EstadoBadge } from './EstadoBadge';
import { CategoriaBadge } from './CategoriaBadge';

// ============================================
// TIPOS
// ============================================

interface ServicioCardProps {
  servicio: Servicio;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onChangeStatus?: (id: string, estado: string) => void;
  showActions?: boolean;
  viewMode?: 'admin' | 'public' | 'grid' | 'list';
  className?: string;
}

// ============================================
// COMPONENTE
// ============================================

/**
 * Tarjeta de servicio con toda la información relevante
 * 
 * @example
 * ```tsx
 * // Modo público
 * <ServicioCard servicio={servicio} viewMode="public" />
 * 
 * // Modo admin con acciones
 * <ServicioCard 
 *   servicio={servicio}
 *   viewMode="admin"
 *   showActions
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export const ServicioCard: React.FC<ServicioCardProps> = ({
  servicio,
  onEdit,
  onDelete,
  onDuplicate,
  showActions = false,
  viewMode = 'public',
  className = ''
}) => {
  // ============================================
  // FUNCIONES AUXILIARES
  // ============================================

  /**
   * Formatear precio según el tipo
   */
  const formatPrice = (): string => {
    if (servicio.tipoPrecio === 'paquetes' && servicio.precioMin && servicio.precioMax) {
      return `${servicio.moneda} $${servicio.precioMin.toLocaleString()} - $${servicio.precioMax.toLocaleString()}`;
    }
    if (servicio.tipoPrecio === 'fijo' && servicio.precio) {
      return `${servicio.moneda} $${servicio.precio.toLocaleString()}`;
    }
    if (servicio.tipoPrecio === 'rango' && servicio.precioMin && servicio.precioMax) {
      return `${servicio.moneda} $${servicio.precioMin.toLocaleString()} - $${servicio.precioMax.toLocaleString()}`;
    }
    if (servicio.tipoPrecio === 'personalizado') {
      return 'Precio personalizado';
    }
    if (servicio.tipoPrecio === 'suscripcion') {
      return `Desde ${servicio.moneda} $${servicio.precioMin?.toLocaleString() || 0}/mes`;
    }
    return 'Consultar precio';
  };

  /**
   * Formatear duración
   */
  const formatDuration = (): string | null => {
    if (!servicio.duracion) return null;
    const { valor, unidad } = servicio.duracion;
    return `${valor} ${unidad}`;
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div
      className={`
        relative rounded-lg border border-gray-700/50 overflow-hidden 
        hover:border-purple-500/50 transition-all duration-300
        hover:shadow-lg hover:shadow-purple-500/10
        bg-gray-800/50 backdrop-blur-sm
        ${className}
      `}
    >
      {/* Header con icono y badges */}
      <div
        className="p-6 border-b border-gray-700/50"
        style={{
          background: `linear-gradient(135deg, ${servicio.colorFondo}15 0%, transparent 100%)`
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            {/* Icono */}
            <div
              className="flex-shrink-0 text-4xl p-3 rounded-lg"
              style={{
                backgroundColor: `${servicio.colorIcono}20`,
                border: `2px solid ${servicio.colorIcono}40`
              }}
            >
              {servicio.icono}
            </div>

            {/* Título y badges */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white mb-2 truncate">
                {servicio.titulo}
              </h3>
              <div className="flex flex-wrap gap-2">
                <CategoriaBadge categoria={servicio.categoria} size="sm" />
                {viewMode === 'admin' && (
                  <EstadoBadge estado={servicio.estado} size="sm" />
                )}
              </div>
            </div>
          </div>

          {/* Badge destacado */}
          {servicio.destacado && (
            <span className="flex-shrink-0 text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 px-3 py-1 rounded-full font-semibold">
              ⭐ Destacado
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Descripción */}
        <p className="text-gray-300 mb-4 line-clamp-3 min-h-[4.5rem]">
          {servicio.descripcionCorta || servicio.descripcion}
        </p>

        {/* Precio */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-purple-400">
            {formatPrice()}
          </div>
          {formatDuration() && (
            <div className="text-sm text-gray-400 mt-1">
              ⏱️ Duración: {formatDuration()}
            </div>
          )}
        </div>

        {/* Características */}
        {servicio.caracteristicas && servicio.caracteristicas.length > 0 && (
          <ul className="space-y-2 mb-4">
            {servicio.caracteristicas.slice(0, 3).map((car, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                <span className="line-clamp-1">{car}</span>
              </li>
            ))}
            {servicio.caracteristicas.length > 3 && (
              <li className="text-xs text-gray-500">
                +{servicio.caracteristicas.length - 3} características más
              </li>
            )}
          </ul>
        )}

        {/* Tecnologías/Etiquetas */}
        {servicio.etiquetas && servicio.etiquetas.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {servicio.etiquetas.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-gray-700/50 text-gray-400 px-2 py-1 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Métricas (solo en admin) */}
        {viewMode === 'admin' && (
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-4 pb-4 border-b border-gray-700/50">
            <span className="flex items-center gap-1">
              💰 <span className="font-semibold">{servicio.vecesVendido}</span> ventas
            </span>
            {servicio.rating && (
              <span className="flex items-center gap-1">
                ⭐ <span className="font-semibold">{servicio.rating.toFixed(1)}</span>/5
              </span>
            )}
            {servicio.ingresoTotal > 0 && (
              <span className="flex items-center gap-1 text-green-400">
                💵 <span className="font-semibold">${servicio.ingresoTotal.toLocaleString()}</span>
              </span>
            )}
          </div>
        )}

        {/* Acciones */}
        {showActions && viewMode === 'admin' ? (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit?.(servicio._id)}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              title="Editar servicio"
            >
              ✏️ Editar
            </button>
            <button
              onClick={() => onDuplicate?.(servicio._id)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
              title="Duplicar servicio"
            >
              📋
            </button>
            <button
              onClick={() => onDelete?.(servicio._id)}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/50 rounded-lg transition-colors"
              title="Eliminar servicio"
            >
              🗑️
            </button>
          </div>
        ) : (
          <Link
            to={`/servicios/${servicio.slug || servicio._id}`}
            className="block w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-3 rounded-lg transition-all font-semibold shadow-lg hover:shadow-purple-500/50"
          >
            Ver detalles →
          </Link>
        )}
      </div>

      {/* Overlay de estado no disponible */}
      {!servicio.activo && (
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">🚫</div>
            <div className="text-white font-semibold">No disponible</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicioCard;
