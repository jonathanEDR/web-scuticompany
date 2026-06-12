/**
 * 📊 GESTIÓN ADMIN DE SISTEMAS (Catálogo de venta)
 * Panel administrativo para ver, crear, editar y eliminar sistemas
 *
 * Diseño alineado al sistema del dashboard:
 * - Gradiente del header desde useDashboardHeaderGradient (misma config del Sidebar)
 * - Iconos Lucide monocromos (sin emojis de colores)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Plus, Search, Eye, EyeOff, Star, Pencil,
  ExternalLink, Trash2, Package, Loader2
} from 'lucide-react';
import SmartDashboardLayout from '../../components/SmartDashboardLayout';
import ProjectAIChatModal from '../../components/admin/ProjectAIChatModal';
import { useDashboardHeaderGradient } from '../../hooks/cms/useDashboardHeaderGradient';
import { proyectosApi } from '../../services/proyectosApi';
import type { Proyecto, ProyectoStatsResponse } from '../../types/proyecto';
import { PROYECTO_CATEGORIAS, PROYECTO_ESTADOS } from '../../types/proyecto';

const ProyectosManagement: React.FC = () => {
  const navigate = useNavigate();
  const { headerGradient } = useDashboardHeaderGradient();

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
        {/* Header con gradiente del sistema (misma config del Sidebar) */}
        <div className="rounded-2xl p-6 lg:p-8 text-white shadow-xl" style={{ background: headerGradient }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Package size={32} strokeWidth={1.5} className="text-white/90 flex-shrink-0" />
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold">
                  Gestión de Sistemas
                </h1>
                <p className="text-white/80 mt-1">
                  Administra tu catálogo de sistemas en venta y asigna clientes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAIChat(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold backdrop-blur-sm transition-colors"
              >
                <Sparkles size={16} strokeWidth={2} />
                Crear con IA
              </button>
              <button
                onClick={() => navigate('/dashboard/proyectos/nuevo')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-purple-700 font-bold hover:bg-white/90 shadow-lg transition-all"
              >
                <Plus size={16} strokeWidth={2.5} />
                Nuevo Sistema
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards - acento único del sistema */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { valor: stats.total || 0, label: 'Total Sistemas' },
              { valor: stats.activos || 0, label: 'Activos' },
              { valor: stats.enPortfolio || 0, label: 'En Catálogo' },
            ].map((card, idx) => (
              <div key={idx} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-4">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{card.valor}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{card.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar sistemas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition"
          >
            <option value="">Todas las categorías</option>
            {Object.entries(PROYECTO_CATEGORIAS).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition"
          >
            <option value="">Todos los estados</option>
            {Object.entries(PROYECTO_ESTADOS).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
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
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Sistema</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Categoría</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Estado</th>
                    <th className="text-center px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Catálogo</th>
                    <th className="text-center px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Destacado</th>
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
                                <div className="w-full h-full bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800/40 flex items-center justify-center">
                                  <Package size={18} strokeWidth={1.5} className="text-purple-500 dark:text-purple-400" />
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

                        {/* Categoría - pill neutra del tema */}
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10">
                            {categoriaInfo.label}
                          </span>
                        </td>

                        {/* Estado - color semántico sutil, sin emoji */}
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${estadoInfo.bgColor}`}>
                            {estadoInfo.label}
                          </span>
                        </td>

                        {/* Visible en Catálogo */}
                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => toggleVisibilidad(proyecto)}
                            className={`p-2 rounded-lg transition hover:bg-gray-100 dark:hover:bg-white/10 ${
                              proyecto.visibleEnPortfolio
                                ? 'text-purple-600 dark:text-purple-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                            title={proyecto.visibleEnPortfolio ? 'Visible en el catálogo' : 'Oculto del catálogo'}
                          >
                            {proyecto.visibleEnPortfolio
                              ? <Eye size={18} strokeWidth={1.5} />
                              : <EyeOff size={18} strokeWidth={1.5} />}
                          </button>
                        </td>

                        {/* Destacado */}
                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => toggleDestacado(proyecto)}
                            className={`p-2 rounded-lg transition hover:bg-gray-100 dark:hover:bg-white/10 ${
                              proyecto.destacado
                                ? 'text-purple-600 dark:text-purple-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                            title={proyecto.destacado ? 'Sistema destacado' : 'No destacado'}
                          >
                            <Star size={18} strokeWidth={1.5} fill={proyecto.destacado ? 'currentColor' : 'none'} />
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
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400"
                              title="Editar"
                            >
                              <Pencil size={16} strokeWidth={1.5} />
                            </button>
                            <a
                              href={`/sistemas/${proyecto.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400"
                              title="Ver en el catálogo"
                            >
                              <ExternalLink size={16} strokeWidth={1.5} />
                            </a>
                            <button
                              onClick={() => handleEliminar(proyecto)}
                              disabled={eliminando === proyecto._id}
                              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition text-gray-400 dark:text-gray-500 hover:text-red-600 disabled:opacity-50"
                              title="Eliminar"
                            >
                              {eliminando === proyecto._id
                                ? <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
                                : <Trash2 size={16} strokeWidth={1.5} />}
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
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800/40 flex items-center justify-center">
                  <Package size={28} strokeWidth={1.5} className="text-purple-500 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  No hay sistemas
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Crea tu primer sistema para comenzar a vender
                </p>
                <button
                  onClick={() => navigate('/dashboard/proyectos/nuevo')}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-white rounded-xl font-semibold transition hover:opacity-90"
                  style={{ background: headerGradient }}
                >
                  <Plus size={16} strokeWidth={2.5} />
                  Crear Sistema
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
