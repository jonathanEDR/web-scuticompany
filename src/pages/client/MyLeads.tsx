/**
 * 📊 MIS LEADS - Lista de Proyectos del Cliente
 * Vista completa de todos los proyectos/leads del cliente autenticado
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Lead } from '../../services/crmService';
import { crmService } from '../../services/crmService';
import { messageService } from '../../services/messageService';

interface LeadWithUnread extends Lead {
  unreadCount?: number;
}

export default function MyLeads() {
  const navigate = useNavigate();

  // ========================================
  // 📊 STATE
  // ========================================
  const [leads, setLeads] = useState<LeadWithUnread[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<LeadWithUnread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'reciente' | 'nombre' | 'estado'>('reciente');

  // ========================================
  // 🔄 EFFECTS
  // ========================================
  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [leads, searchTerm, filterEstado, sortBy]);

  // ========================================
  // 📊 FUNCIONES DE CARGA
  // ========================================

  const loadLeads = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Cargar leads del cliente
      const response = await crmService.getClientLeads();
      const clientLeads = response.data?.leads || [];

      // Cargar contadores de mensajes no leídos para cada lead
      const leadsWithUnread = await Promise.all(
        clientLeads.map(async (lead) => {
          try {
            const messagesResponse = await messageService.getLeadMessages(lead._id, {
              limit: 100,
              incluirPrivados: false,
            });
            const unreadCount = (messagesResponse.data?.mensajes || []).filter(
              (msg) => !msg.leido
            ).length;
            return { ...lead, unreadCount };
          } catch {
            return { ...lead, unreadCount: 0 };
          }
        })
      );

      setLeads(leadsWithUnread);
    } catch (err: any) {
      console.error('Error cargando leads:', err);
      setError(err.message || 'Error al cargar los proyectos');
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================
  // 🎯 FILTROS Y ORDENAMIENTO
  // ========================================

  const applyFilters = () => {
    let result = [...leads];

    // Filtro por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (lead) =>
          lead.nombre.toLowerCase().includes(term) ||
          lead.correo.toLowerCase().includes(term) ||
          lead.empresa?.toLowerCase().includes(term) ||
          lead.tipoServicio.toLowerCase().includes(term)
      );
    }

    // Filtro por estado
    if (filterEstado !== 'all') {
      result = result.filter((lead) => lead.estado === filterEstado);
    }

    // Ordenamiento
    result.sort((a, b) => {
      switch (sortBy) {
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        case 'estado':
          return a.estado.localeCompare(b.estado);
        case 'reciente':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredLeads(result);
  };

  // ========================================
  // 🎨 HELPERS
  // ========================================

  const getEstadoColor = (estado: string): string => {
    const colores: Record<string, string> = {
      nuevo: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      contactado: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      calificado: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      propuesta: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      negociacion: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      ganado: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      perdido: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      pausado: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  };

  const getTipoServicioIcon = (tipo: string): string => {
    const iconos: Record<string, string> = {
      web: '🌐',
      app: '📱',
      ecommerce: '🛒',
      sistemas: '⚙️',
      consultoria: '💼',
      diseño: '🎨',
      marketing: '📈',
      otro: '📦',
    };
    return iconos[tipo] || '📦';
  };

  const getPrioridadColor = (prioridad: string): string => {
    const colores: Record<string, string> = {
      baja: 'text-gray-500',
      media: 'text-blue-500',
      alta: 'text-orange-500',
      urgente: 'text-red-500',
    };
    return colores[prioridad] || 'text-gray-500';
  };

  // ========================================
  // 🎨 RENDER
  // ========================================

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error al Cargar</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadLeads}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                📊 Mis Proyectos
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {filteredLeads.length} {filteredLeads.length === 1 ? 'proyecto' : 'proyectos'}
                {filterEstado !== 'all' && ` en estado "${filterEstado}"`}
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/client')}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:shadow-md transition-all text-gray-700 dark:text-gray-300"
            >
              ← Volver al Portal
            </button>
          </div>

          {/* Filtros */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Búsqueda */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  🔍 Buscar
                </label>
                <input
                  type="text"
                  placeholder="Nombre, email, empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Filtro por Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  📌 Estado
                </label>
                <select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">Todos los estados</option>
                  <option value="nuevo">Nuevo</option>
                  <option value="contactado">Contactado</option>
                  <option value="calificado">Calificado</option>
                  <option value="propuesta">Propuesta</option>
                  <option value="negociacion">Negociación</option>
                  <option value="ganado">Ganado</option>
                  <option value="perdido">Perdido</option>
                  <option value="pausado">Pausado</option>
                </select>
              </div>

              {/* Ordenar por */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  🔄 Ordenar por
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="reciente">Más recientes</option>
                  <option value="nombre">Nombre (A-Z)</option>
                  <option value="estado">Estado</option>
                </select>
              </div>
            </div>

            {/* Botón Limpiar Filtros */}
            {(searchTerm || filterEstado !== 'all' || sortBy !== 'reciente') && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterEstado('all');
                    setSortBy('reciente');
                  }}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  ✖️ Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Lista de Proyectos */}
        {filteredLeads.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No se encontraron proyectos
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || filterEstado !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Aún no tienes proyectos activos'}
            </p>
            {(searchTerm || filterEstado !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterEstado('all');
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Ver todos los proyectos
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLeads.map((lead) => (
              <div
                key={lead._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-green-500"
                onClick={() => navigate(`/dashboard/client/lead/${lead._id}`)}
              >
                <div className="p-6">
                  {/* Header del Card */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-3xl">
                        {getTipoServicioIcon(lead.tipoServicio)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                          {lead.nombre}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {lead.tipoServicio.charAt(0).toUpperCase() + lead.tipoServicio.slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(lead.estado)}`}>
                        {lead.estado.replace(/_/g, ' ')}
                      </span>
                      {lead.unreadCount && lead.unreadCount > 0 && (
                        <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full font-semibold">
                          {lead.unreadCount} nuevo{lead.unreadCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Descripción */}
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                    {lead.descripcionProyecto}
                  </p>

                  {/* Información */}
                  <div className="space-y-2 mb-4">
                    {lead.empresa && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>🏢</span>
                        <span>{lead.empresa}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>📧</span>
                      <span>{lead.correo}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>📞</span>
                      <span>{lead.celular}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`${getPrioridadColor(lead.prioridad)}`}>
                        {lead.prioridad === 'urgente' && '🔴'}
                        {lead.prioridad === 'alta' && '🟠'}
                        {lead.prioridad === 'media' && '🟡'}
                        {lead.prioridad === 'baja' && '⚪'}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        Prioridad: {lead.prioridad}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Creado {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/client/lead/${lead._id}`);
                        }}
                        className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Ver Detalles →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
