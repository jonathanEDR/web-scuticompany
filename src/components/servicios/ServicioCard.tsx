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
  // DEBUG LOGS PARA IMÁGENES
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
        relative rounded-xl border overflow-hidden 
        transition-all duration-300
        ${viewMode === 'admin' 
          ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10' 
          : 'bg-gray-800/50 border-gray-700/50 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 backdrop-blur-sm'
        }
        ${className}
      `}
    >
      {/* Header con imagen/icono y badges */}
      <div
        className={`p-5 border-b ${viewMode === 'admin' ? 'border-gray-200 dark:border-gray-700' : 'border-gray-700/50'}`}
        style={{
          background: viewMode === 'admin' 
            ? `linear-gradient(135deg, ${servicio.colorFondo}08 0%, transparent 100%)`
            : `linear-gradient(135deg, ${servicio.colorFondo}15 0%, transparent 100%)`
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            {/* Imagen o Icono - MÁS GRANDE */}
            {(() => {
              if (servicio.imagen) {
                return (
                  <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-md">
                    <img
                      src={servicio.imagen}
                      alt={servicio.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              }
              
              return (
                <div
                  className="flex-shrink-0 text-5xl w-24 h-24 flex items-center justify-center rounded-xl shadow-md"
                  style={{
                    backgroundColor: `${servicio.colorIcono}${viewMode === 'admin' ? '15' : '20'}`,
                    border: `2px solid ${servicio.colorIcono}${viewMode === 'admin' ? '30' : '40'}`
                  }}
                >
                  {servicio.icono}
                </div>
              );
            })()}

            {/* Título y badges */}
            <div className="flex-1 min-w-0">
              <h3 className={`text-xl font-bold mb-2 truncate ${viewMode === 'admin' ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
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
            <span className="flex-shrink-0 text-xs bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-500/50 px-3 py-1 rounded-full font-semibold shadow-sm">
              ⭐ Destacado
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Descripción - MEJOR CONTRASTE */}
        <p className={`mb-4 line-clamp-3 min-h-[4.5rem] leading-relaxed ${viewMode === 'admin' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-300'}`}>
          {servicio.descripcionCorta || servicio.descripcion}
        </p>

        {/* Precio - MÁS VISIBLE */}
        <div className="mb-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-500/30">
          <div className={`text-3xl font-bold ${viewMode === 'admin' ? 'text-purple-600 dark:text-purple-400' : 'text-purple-400'}`}>
            {formatPrice()}
          </div>
          {formatDuration() && (
            <div className={`text-sm mt-1 ${viewMode === 'admin' ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400'}`}>
              ⏱️ Duración: {formatDuration()}
            </div>
          )}
        </div>

        {/* Características - MEJOR LEGIBILIDAD */}
        {servicio.caracteristicas && servicio.caracteristicas.length > 0 && (
          <ul className="space-y-2 mb-4">
            {servicio.caracteristicas.slice(0, 3).map((car, idx) => (
              <li key={idx} className={`flex items-start gap-2 text-sm ${viewMode === 'admin' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-300'}`}>
                <span className="text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0 text-base">✓</span>
                <span className="line-clamp-1">{car}</span>
              </li>
            ))}
            {servicio.caracteristicas.length > 3 && (
              <li className={`text-xs ${viewMode === 'admin' ? 'text-gray-500 dark:text-gray-500' : 'text-gray-500'}`}>
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
                className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                  viewMode === 'admin' 
                    ? 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600' 
                    : 'bg-gray-700/50 text-gray-400'
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Métricas (solo en admin) - MÁS DESTACADO */}
        {viewMode === 'admin' && (
          <div className="flex items-center justify-between gap-3 text-sm mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-500/30">
              <span className="text-blue-600 dark:text-blue-400">💰</span>
              <span className="font-bold text-blue-700 dark:text-blue-300">{servicio.vecesVendido}</span>
              <span className="text-gray-600 dark:text-gray-400 text-xs">ventas</span>
            </div>
            {servicio.rating && (
              <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-lg border border-yellow-200 dark:border-yellow-500/30">
                <span className="text-yellow-500">⭐</span>
                <span className="font-bold text-yellow-700 dark:text-yellow-300">{servicio.rating.toFixed(1)}</span>
                <span className="text-gray-600 dark:text-gray-400 text-xs">/5</span>
              </div>
            )}
            {servicio.ingresoTotal > 0 && (
              <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-500/30">
                <span className="text-green-600 dark:text-green-400">💵</span>
                <span className="font-bold text-green-700 dark:text-green-300">${servicio.ingresoTotal.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}

        {/* Acciones */}
        {showActions && viewMode === 'admin' ? (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit?.(servicio._id)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2.5 rounded-lg transition-all font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              title="Editar servicio"
            >
              <span>✏️</span>
              <span>Editar</span>
            </button>
            <button
              onClick={() => onDuplicate?.(servicio._id)}
              className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md"
              title="Duplicar servicio"
            >
              📋
            </button>
            <button
              onClick={() => onDelete?.(servicio._id)}
              className="px-4 py-2.5 bg-red-50 dark:bg-red-600/20 hover:bg-red-100 dark:hover:bg-red-600/30 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-500/50 rounded-lg transition-colors shadow-sm hover:shadow-md"
              title="Eliminar servicio"
            >
              🗑️
            </button>
          </div>
        ) : (
          <Link
            to={`/servicios/${servicio.slug || servicio._id}`}
            onClick={() => {
              // Ensure scroll to top when navigating
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
            className="block w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-3 rounded-lg transition-all font-semibold shadow-lg hover:shadow-purple-500/50"
          >
            Ver detalles →
          </Link>
        )}
      </div>

      {/* Overlay de estado no disponible */}
      {!servicio.activo && (
        <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="text-center bg-white dark:bg-gray-800 px-6 py-4 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="text-5xl mb-2">🚫</div>
            <div className="text-gray-900 dark:text-white font-bold text-lg">No disponible</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">Servicio desactivado</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicioCard;
