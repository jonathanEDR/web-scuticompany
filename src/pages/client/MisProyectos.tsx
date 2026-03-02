/**
 * 🚀 MIS PROYECTOS (Vista Cliente)
 * Muestra los proyectos asignados al cliente con botón de acceso al sistema
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { proyectosApi } from '../../services/proyectosApi';
import type { Proyecto } from '../../types/proyecto';
import { PROYECTO_CATEGORIAS, PROYECTO_ESTADOS } from '../../types/proyecto';

const MisProyectos: React.FC = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [accediendo, setAccediendo] = useState<string | null>(null);

  useEffect(() => {
    cargarMisProyectos();
  }, []);

  const cargarMisProyectos = async () => {
    try {
      setLoading(true);
      const res = await proyectosApi.getMisProyectos();
      setProyectos(res.data);
    } catch (error) {
      console.error('Error cargando mis proyectos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceder = async (id: string) => {
    try {
      setAccediendo(id);
      const data = await proyectosApi.accederProyecto(id);
      window.open(data.url, '_blank', 'noopener,noreferrer');
    } catch (error: any) {
      alert(error.message || 'Error al acceder al sistema');
    } finally {
      setAccediendo(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-purple-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Cargando tus proyectos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          🚀 Mis Proyectos
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Accede a los sistemas y proyectos asignados a tu cuenta
        </p>
      </div>

      {/* Empty state */}
      {proyectos.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No tienes proyectos asignados
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Cuando un administrador te asigne acceso a un proyecto o sistema, aparecerá aquí
          </p>
          <Link
            to="/proyectos"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            🌟 Ver Portafolio Público
          </Link>
        </div>
      )}

      {/* Grid de proyectos */}
      {proyectos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectos.map((proyecto) => {
            const categoriaInfo = PROYECTO_CATEGORIAS[proyecto.categoria] || PROYECTO_CATEGORIAS.otro;
            const estadoInfo = PROYECTO_ESTADOS[proyecto.estado] || PROYECTO_ESTADOS.activo;
            const estaAccediendo = accediendo === proyecto._id;

            return (
              <div
                key={proyecto._id}
                className="group bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-purple-500/5 hover:border-purple-200 dark:hover:border-purple-500/30 transition-all duration-300"
              >
                {/* Imagen */}
                <div className="relative h-40 overflow-hidden">
                  {proyecto.imagenPrincipal ? (
                    <img
                      src={proyecto.imagenPrincipal}
                      alt={proyecto.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center text-5xl">
                      {proyecto.icono || '🚀'}
                    </div>
                  )}
                  
                  {/* Estado badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow ${estadoInfo.bgColor}`}>
                      {estadoInfo.icon} {estadoInfo.label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition truncate">
                      {proyecto.nombre}
                    </h3>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mb-3"
                    style={{ backgroundColor: `${categoriaInfo.color}15`, color: categoriaInfo.color }}>
                    {categoriaInfo.icon} {categoriaInfo.label}
                  </span>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    {proyecto.descripcionCorta}
                  </p>

                  {/* Tecnologías */}
                  {proyecto.tecnologias && proyecto.tecnologias.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {proyecto.tecnologias.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 rounded-md">
                          {tech.nombre}
                        </span>
                      ))}
                      {proyecto.tecnologias.length > 3 && (
                        <span className="text-xs text-gray-400">+{proyecto.tecnologias.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {proyecto.tieneUrl && (
                      <button
                        onClick={() => handleAcceder(proyecto._id)}
                        disabled={estaAccediendo}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50"
                      >
                        {estaAccediendo ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        ) : (
                          <>🚀 Acceder al Sistema</>
                        )}
                      </button>
                    )}

                    <Link
                      to={`/proyectos/${proyecto.slug}`}
                      className="px-4 py-2.5 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-200 dark:hover:bg-white/20 transition"
                    >
                      Detalles
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MisProyectos;
