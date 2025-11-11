/**
 * 🌟 TARJETA PÚBLICA DE SERVICIO
 * Componente optimizado para mostrar servicios al público
 * ⚡ Optimizado con React.memo para prevenir re-renders innecesarios
 */

import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import type { Servicio } from '../../types/servicios';

// ============================================
// TIPOS
// ============================================

interface ServicioPublicCardProps {
  servicio: Servicio;
  featured?: boolean;
  showPrice?: boolean;
  className?: string;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const ServicioPublicCard: React.FC<ServicioPublicCardProps> = ({
  servicio,
  featured = false,
  showPrice = true,
  className = ''
}) => {
  // ============================================
  // FUNCIONES AUXILIARES
  // ============================================

  const formatPrice = () => {
    if (!showPrice) return null;
    
    switch (servicio.tipoPrecio) {
      case 'fijo':
        return (
          <div className="text-2xl font-bold text-purple-600">
            ${servicio.precio?.toLocaleString()}
            <span className="text-sm text-gray-500 ml-1">{servicio.moneda}</span>
          </div>
        );
      case 'rango':
        return (
          <div className="text-lg font-semibold text-purple-600">
            ${servicio.precioMin?.toLocaleString()} - ${servicio.precioMax?.toLocaleString()}
            <span className="text-sm text-gray-500 ml-1">{servicio.moneda}</span>
          </div>
        );
      case 'paquetes':
        return (
          <div className="text-lg font-semibold text-purple-600">
            Desde ${servicio.precioMin?.toLocaleString()}
            <span className="text-sm text-gray-500 ml-1">{servicio.moneda}</span>
          </div>
        );
      case 'personalizado':
        return (
          <div className="text-lg font-semibold text-gray-600">
            Consultar precio
          </div>
        );
      default:
        return null;
    }
  };

  // Función para obtener el color de la categoría (compatible con string y objeto)
  const getCategoryColor = (categoria: any) => {
    // Si es un objeto categoría, usar su color
    if (categoria && typeof categoria === 'object' && categoria.color) {
      return `text-white`;
    }
    
    // Fallback para categorías string (legacy)
    const categoriaStr = typeof categoria === 'string' ? categoria : categoria?.nombre || 'otro';
    const colors = {
      desarrollo: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
      marketing: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
      diseño: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200',
      consultoria: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200',
      mantenimiento: 'bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200',
      otro: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200'
    };
    return colors[categoriaStr as keyof typeof colors] || colors.otro;
  };

  // Función para obtener el nombre de la categoría
  const getCategoryName = (categoria: any) => {
    if (!categoria) return 'Sin categoría';
    
    // Si es un objeto categoría
    if (typeof categoria === 'object' && categoria.nombre) {
      return categoria.nombre;
    }
    
    // Si es un string (legacy)
    if (typeof categoria === 'string') {
      return categoria.charAt(0).toUpperCase() + categoria.slice(1);
    }
    
    return 'Sin categoría';
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={`
      group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl 
      transition-all duration-300 transform hover:-translate-y-2
      border border-gray-100 dark:border-gray-700 overflow-hidden
      ${featured ? 'ring-2 ring-purple-500 ring-opacity-50' : ''}
      ${className}
    `}>
      {/* Badge de destacado */}
      {servicio.destacado && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            ⭐ Destacado
          </span>
        </div>
      )}

      {/* Imagen principal */}
      <div className="relative h-48 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 overflow-hidden">
        {servicio.imagen ? (
          <img
            src={servicio.imagen}
            alt={servicio.titulo}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div 
              className="text-6xl opacity-80"
              style={{ color: servicio.colorIcono || '#8B5CF6' }}
            >
              {servicio.icono || '🚀'}
            </div>
          </div>
        )}
        
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Contenido */}
      <div className="p-6">
        {/* Categoría */}
        <div className="flex items-center justify-between mb-3">
          <span 
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(servicio.categoria)}`}
            style={{
              backgroundColor: servicio.categoria?.color || undefined,
              color: servicio.categoria?.color ? 'white' : undefined
            }}
          >
            {servicio.categoria?.icono && (
              <span className="mr-1">{servicio.categoria.icono}</span>
            )}
            {getCategoryName(servicio.categoria)}
          </span>
          
          {servicio.requiereContacto && (
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              💬 Consulta
            </span>
          )}
        </div>

        {/* Título */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {servicio.titulo}
        </h3>

        {/* Descripción corta */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {servicio.descripcionCorta || servicio.descripcion}
        </p>

        {/* Características destacadas */}
        {servicio.caracteristicas && servicio.caracteristicas.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {servicio.caracteristicas.slice(0, 3).map((caracteristica, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 px-2 py-1 rounded border border-gray-200 dark:border-gray-600"
                >
                  ✓ {caracteristica}
                </span>
              ))}
              {servicio.caracteristicas.length > 3 && (
                <span className="text-xs text-gray-400 dark:text-gray-500 px-2 py-1">
                  +{servicio.caracteristicas.length - 3} más
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer con precio y botón */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {formatPrice()}
          </div>
          
          <Link
            to={`/servicios/${servicio.slug || servicio._id}`}
            onClick={() => {
              // Ensure scroll to top when navigating
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
            className="
              bg-gradient-to-r from-purple-600 to-blue-600 
              hover:from-purple-700 hover:to-blue-700
              text-white px-4 py-2 rounded-lg font-medium
              transition-all duration-200 transform hover:scale-105
              shadow-lg hover:shadow-xl
              text-sm
            "
          >
            Ver detalles
          </Link>
        </div>

        {/* Etiquetas */}
        {servicio.etiquetas && servicio.etiquetas.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-1">
              {servicio.etiquetas.slice(0, 4).map((etiqueta, idx) => (
                <span
                  key={idx}
                  className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full"
                >
                  #{etiqueta}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ⚡ Optimización: Memo para prevenir re-renders innecesarios
export default memo(ServicioPublicCard);