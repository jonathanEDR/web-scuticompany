/**
 * 👥 ASIGNACIÓN DE CLIENTES A PROYECTO
 * Permite al admin asignar/desasignar clientes de un proyecto
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SmartDashboardLayout from '../../components/SmartDashboardLayout';
import { proyectosApi } from '../../services/proyectosApi';
import type { Proyecto, ClienteAsignado } from '../../types/proyecto';

const ProyectoAsignacion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [clientesDisponibles, setClientesDisponibles] = useState<ClienteAsignado[]>([]);
  const [clientesAsignados, setClientesAsignados] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  // ========================================
  // CARGA
  // ========================================

  useEffect(() => {
    if (id) cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [proyectoRes, clientesRes] = await Promise.all([
        proyectosApi.getProyectoAdmin(id!),
        proyectosApi.getClientesDisponibles(),
      ]);
      setProyecto(proyectoRes);
      setClientesDisponibles(clientesRes);
      setClientesAsignados(
        (proyectoRes.assignedClients || []).map((c: any) => (typeof c === 'string' ? c : c._id))
      );
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // TOGGLE CLIENTE
  // ========================================

  const toggleCliente = (clienteId: string) => {
    setClientesAsignados((prev) =>
      prev.includes(clienteId) ? prev.filter((id) => id !== clienteId) : [...prev, clienteId]
    );
    setGuardadoExitoso(false);
  };

  const seleccionarTodos = () => {
    setClientesAsignados(clientesFiltrados.map((c) => c._id));
    setGuardadoExitoso(false);
  };

  const deseleccionarTodos = () => {
    setClientesAsignados([]);
    setGuardadoExitoso(false);
  };

  // ========================================
  // GUARDAR
  // ========================================

  const handleGuardar = async () => {
    try {
      setGuardando(true);
      await proyectosApi.asignarClientes(id!, clientesAsignados);
      setGuardadoExitoso(true);
      setTimeout(() => setGuardadoExitoso(false), 3000);
    } catch (error: any) {
      alert(error.message || 'Error al asignar clientes');
    } finally {
      setGuardando(false);
    }
  };

  // ========================================
  // FILTRADO
  // ========================================

  const clientesFiltrados = clientesDisponibles.filter((c) => {
    if (!busqueda.trim()) return true;
    const term = busqueda.toLowerCase();
    const nombre = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
    const email = (c.email || '').toLowerCase();
    return nombre.includes(term) || email.includes(term);
  });

  // ========================================
  // RENDER
  // ========================================

  if (loading) {
    return (
      <SmartDashboardLayout>
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-purple-600" />
        </div>
      </SmartDashboardLayout>
    );
  }

  if (!proyecto) {
    return (
      <SmartDashboardLayout>
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400">Proyecto no encontrado</p>
        </div>
      </SmartDashboardLayout>
    );
  }

  return (
    <SmartDashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/dashboard/proyectos')}
              className="text-sm text-gray-400 hover:text-purple-600 transition mb-2 inline-flex items-center gap-1"
            >
              ← Volver a proyectos
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              👥 Asignar Clientes
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Proyecto: <span className="font-semibold text-purple-600 dark:text-purple-400">{proyecto.nombre}</span>
            </p>
          </div>
          <button
            onClick={handleGuardar}
            disabled={guardando}
            className={`px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 ${
              guardadoExitoso
                ? 'bg-green-600 text-white shadow-green-500/25'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/25'
            }`}
          >
            {guardando ? '⏳ Guardando...' : guardadoExitoso ? '✅ Guardado' : '💾 Guardar Asignaciones'}
          </button>
        </div>

        {/* Info card */}
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-purple-600 dark:text-purple-400 font-bold text-2xl">{clientesAsignados.length}</span>
              <span className="text-gray-600 dark:text-gray-400 ml-1">clientes asignados</span>
            </div>
            <div className="border-l border-purple-200 dark:border-purple-500/30 pl-4">
              <span className="text-gray-600 dark:text-gray-400">{clientesDisponibles.length} clientes disponibles</span>
            </div>
            {proyecto.tieneUrl && (
              <div className="border-l border-purple-200 dark:border-purple-500/30 pl-4">
                <span className="text-green-600 dark:text-green-400">🔗 Tiene URL de sistema</span>
              </div>
            )}
          </div>
        </div>

        {/* Búsqueda y acciones */}
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="🔍 Buscar clientes..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition"
          />
          <button
            type="button"
            onClick={seleccionarTodos}
            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 transition"
          >
            Seleccionar todos
          </button>
          <button
            type="button"
            onClick={deseleccionarTodos}
            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 transition"
          >
            Deseleccionar todos
          </button>
        </div>

        {/* Lista de clientes */}
        <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden">
          <div className="divide-y divide-gray-50 dark:divide-white/5">
            {clientesFiltrados.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                {busqueda ? 'No se encontraron clientes con ese criterio' : 'No hay clientes disponibles'}
              </div>
            )}
            {clientesFiltrados.map((cliente) => {
              const asignado = clientesAsignados.includes(cliente._id);
              return (
                <label
                  key={cliente._id}
                  className={`flex items-center gap-4 px-5 py-4 cursor-pointer transition-all ${
                    asignado
                      ? 'bg-purple-50/50 dark:bg-purple-900/10'
                      : 'hover:bg-gray-50 dark:hover:bg-white/[0.02]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={asignado}
                    onChange={() => toggleCliente(cliente._id)}
                    className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 dark:bg-white/10 dark:border-white/20"
                  />

                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    asignado
                      ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
                      : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                  }`}>
                    {(cliente.firstName?.[0] || '?').toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${
                      asignado ? 'text-purple-900 dark:text-purple-300' : 'text-gray-900 dark:text-white'
                    }`}>
                      {cliente.firstName} {cliente.lastName}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{cliente.email}</p>
                  </div>

                  {/* Role badge */}
                  {cliente.role && (
                    <span className="px-2.5 py-1 bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 rounded-full text-xs font-medium">
                      {cliente.role}
                    </span>
                  )}

                  {/* Check indicator */}
                  {asignado && (
                    <span className="text-purple-600 dark:text-purple-400 text-lg">✓</span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </SmartDashboardLayout>
  );
};

export default ProyectoAsignacion;
