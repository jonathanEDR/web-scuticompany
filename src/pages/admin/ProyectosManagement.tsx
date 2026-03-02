/**
 * 📊 GESTIÓN ADMIN DE PROYECTOS
 * Panel administrativo para ver, crear, editar y eliminar proyectos
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SmartDashboardLayout from '../../components/SmartDashboardLayout';
import ProjectAIChatModal from '../../components/admin/ProjectAIChatModal';
import { proyectosApi } from '../../services/proyectosApi';
import type { Proyecto, ProyectoStatsResponse } from '../../types/proyecto';
import { PROYECTO_CATEGORIAS, PROYECTO_ESTADOS } from '../../types/proyecto';

const ProyectosManagement: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [stats, setStats] = useState<ProyectoStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [eliminando, setEliminando] = useState<string | null>(null);
  const [showAIChat, setShowAIChat] = useState(false);

  // ========================================
  // CARGA DE DATOS
  // ========================================

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      const [proyectosRes, statsRes] = await Promise.all([
        proyectosApi.getAllProyectosAdmin({
          categoria: (filtroCategoria || undefined) as any,
          estado: (filtroEstado || undefined) as any,
          search: busqueda || undefined,
          limit: 100,
        }),
        proyectosApi.getEstadisticas(),
      ]);
      setProyectos(proyectosRes.data);
      setStats(statsRes);
    } catch (error) {
      console.error('Error cargando proyectos:', error);
    } finally {
      setLoading(false);
    }
  }, [filtroCategoria, filtroEstado, busqueda]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // ========================================
  // ACCIONES
  // ========================================

  const handleEliminar = async (proyecto: Proyecto) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${proyecto.nombre}"?\n\nEsta acción no se puede deshacer.`)) return;
    try {
      setEliminando(proyecto._id);
      await proyectosApi.eliminarProyecto(proyecto._id);
      cargarDatos();
    } catch (error: any) {
      alert(error.message || 'Error al eliminar');
    } finally {
      setEliminando(null);
    }
  };

  const toggleVisibilidad = async (proyecto: Proyecto) => {
    try {
      await proyectosApi.actualizarProyecto(proyecto._id, {
        visibleEnPortfolio: !proyecto.visibleEnPortfolio,
      });
      cargarDatos();
    } catch (error: any) {
      alert(error.message || 'Error al actualizar');
    }
  };

  const toggleDestacado = async (proyecto: Proyecto) => {
    try {
      await proyectosApi.actualizarProyecto(proyecto._id, {
        destacado: !proyecto.destacado,
      });
      cargarDatos();
    } catch (error: any) {
      alert(error.message || 'Error al actualizar');
    }
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <>
    <SmartDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              🚀 Gestión de Proyectos
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Administra tu portafolio y asigna clientes a proyectos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAIChat(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/25"
            >
              ✨ Crear con IA
            </button>
            <button
              onClick={() => navigate('/dashboard/proyectos/nuevo')}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25"
            >
              ➕ Nuevo Proyecto
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-4">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.total || 0}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Proyectos</div>
            </div>
            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.activos || 0}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Activos</div>
            </div>
            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.enPortfolio || 0}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">En Portafolio</div>
            </div>
            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-4">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.totalClientes || 0}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Clientes Asignados</div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="🔍 Buscar proyectos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition"
          >
            <option value="">Todas las categorías</option>
            {Object.entries(PROYECTO_CATEGORIAS).map(([key, val]) => (
              <option key={key} value={key}>{val.icon} {val.label}</option>
            ))}
          </select>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition"
          >
            <option value="">Todos los estados</option>
            {Object.entries(PROYECTO_ESTADOS).map(([key, val]) => (
              <option key={key} value={key}>{val.icon} {val.label}</option>
            ))}
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-purple-600" />
          </div>
        )}

        {/* Tabla de proyectos */}
        {!loading && (
          <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/10">
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Proyecto</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Categoría</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Estado</th>
                    <th className="text-center px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Portfolio</th>
                    <th className="text-center px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Destacado</th>
                    <th className="text-center px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Clientes</th>
                    <th className="text-center px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Vistas</th>
                    <th className="text-right px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                  {proyectos.map((proyecto) => {
                    const categoriaInfo = PROYECTO_CATEGORIAS[proyecto.categoria] || PROYECTO_CATEGORIAS.otro;
                    const estadoInfo = PROYECTO_ESTADOS[proyecto.estado] || PROYECTO_ESTADOS.activo;

                    return (
                      <tr key={proyecto._id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition">
                        {/* Proyecto */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                              {proyecto.imagenPrincipal ? (
                                <img src={proyecto.imagenPrincipal} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-lg">
                                  {proyecto.icono || '🚀'}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">
                                {proyecto.nombre}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[200px]">
                                {proyecto.descripcionCorta}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Categoría */}
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: `${categoriaInfo.color}15`, color: categoriaInfo.color }}>
                            {categoriaInfo.icon} {categoriaInfo.label}
                          </span>
                        </td>

                        {/* Estado */}
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${estadoInfo.bgColor}`}>
                            {estadoInfo.icon} {estadoInfo.label}
                          </span>
                        </td>

                        {/* Visible en Portfolio */}
                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => toggleVisibilidad(proyecto)}
                            className={`text-lg transition hover:scale-110 ${
                              proyecto.visibleEnPortfolio ? '' : 'opacity-30'
                            }`}
                            title={proyecto.visibleEnPortfolio ? 'Visible en portafolio' : 'Oculto del portafolio'}
                          >
                            {proyecto.visibleEnPortfolio ? '👁️' : '🙈'}
                          </button>
                        </td>

                        {/* Destacado */}
                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => toggleDestacado(proyecto)}
                            className={`text-lg transition hover:scale-110 ${
                              proyecto.destacado ? '' : 'opacity-30'
                            }`}
                            title={proyecto.destacado ? 'Proyecto destacado' : 'No destacado'}
                          >
                            {proyecto.destacado ? '⭐' : '☆'}
                          </button>
                        </td>

                        {/* Clientes */}
                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => navigate(`/dashboard/proyectos/${proyecto._id}/clientes`)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition"
                          >
                            👥 {proyecto.assignedClients?.length || 0}
                          </button>
                        </td>

                        {/* Vistas */}
                        <td className="px-5 py-4 text-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{proyecto.vistas || 0}</span>
                        </td>

                        {/* Acciones */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => navigate(`/dashboard/proyectos/${proyecto._id}/editar`)}
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition text-gray-500 dark:text-gray-400 hover:text-purple-600"
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <a
                              href={`/proyectos/${proyecto.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition text-gray-500 dark:text-gray-400 hover:text-blue-600"
                              title="Ver en portafolio"
                            >
                              🔗
                            </a>
                            <button
                              onClick={() => handleEliminar(proyecto)}
                              disabled={eliminando === proyecto._id}
                              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition text-gray-500 dark:text-gray-400 hover:text-red-600 disabled:opacity-50"
                              title="Eliminar"
                            >
                              {eliminando === proyecto._id ? '⏳' : '🗑️'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty state */}
            {proyectos.length === 0 && (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📁</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  No hay proyectos
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Crea tu primer proyecto para comenzar
                </p>
                <button
                  onClick={() => navigate('/dashboard/proyectos/nuevo')}
                  className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
                >
                  ➕ Crear Proyecto
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </SmartDashboardLayout>

    {/* AI Chat Modal */}
    <ProjectAIChatModal
      isOpen={showAIChat}
      onClose={() => setShowAIChat(false)}
      onProjectCreated={() => {
        setShowAIChat(false);
        cargarDatos();
      }}
    />
    </>
  );
};

export default ProyectosManagement;
