import React, { useState } from 'react';
import { useCRM } from '../../hooks/useCRM';
import { useAuth } from '../../contexts/AuthContext';
import SmartDashboardLayout from '../../components/SmartDashboardLayout';
import { StatusBadge, PriorityBadge, OrigenBadge } from '../../components/crm/Badges';
import { Button, LoadingSpinner, Card } from '../../components/UI';
import { LeadFormModal } from '../../components/crm/LeadFormModal';
import { LeadDetailModal } from '../../components/crm/LeadDetailModal';
import { CrmStats } from '../../components/crm/CrmStats';
import type { Lead, CreateLeadData, UpdateLeadData } from '../../services/crmService';

/**
 * 💼 Página principal de gestión de Leads CRM
 */
const LeadsManagement: React.FC = () => {
  const { hasPermission } = useAuth();
  const {
    leads,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    changePage,
    setSelectedLead,
    selectedLead,
    createLead,
    updateLead,
    changeStatus,
    addActivity,
    refresh
  } = useCRM();

  // Estados para modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStats, setShowStats] = useState(false); // Toggle para vista de estadísticas

  // ========================================
  // 🔍 BÚSQUEDA Y FILTROS
  // ========================================
  const handleSearch = (value: string) => {
    updateFilters({ search: value });
  };

  const handleFilterChange = (key: string, value: string) => {
    updateFilters({ [key]: value });
  };

  // ========================================
  // 📄 ACCIONES DE LEAD
  // ========================================
  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetailModal(true);
  };

  const handleCreateLead = () => {
    setShowCreateModal(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowEditModal(true);
  };

  const handleDeleteLead = async (lead: Lead) => {
    if (!window.confirm(`¿Estás seguro de eliminar el lead "${lead.nombre}"?`)) {
      return;
    }
    // La eliminación se implementará con el hook
    console.log('Eliminar lead:', lead);
  };

  // ========================================
  // 💾 HANDLERS DEL FORMULARIO
  // ========================================
  const handleSubmitCreate = async (data: CreateLeadData) => {
    try {
      await createLead(data);
      setShowCreateModal(false);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Error al crear el lead' };
    }
  };

  const handleSubmitEdit = async (data: UpdateLeadData) => {
    if (!selectedLead) return { success: false, error: 'No hay lead seleccionado' };
    
    try {
      await updateLead(selectedLead._id, data);
      setShowEditModal(false);
      setSelectedLead(null);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Error al actualizar el lead' };
    }
  };

  // ========================================
  // 🔄 HANDLERS DEL MODAL DE DETALLE
  // ========================================
  const handleEditFromDetail = (lead: Lead) => {
    setShowDetailModal(false);
    setTimeout(() => {
      handleEditLead(lead);
    }, 100);
  };

  const handleChangeStatus = async (leadId: string, nuevoEstado: Lead['estado']) => {
    try {
      await changeStatus(leadId, nuevoEstado);
      await refresh();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const handleAddActivity = async (leadId: string, tipo: string, descripcion: string) => {
    try {
      await addActivity(leadId, tipo, descripcion);
      await refresh();
    } catch (error) {
      console.error('Error al agregar actividad:', error);
    }
  };

  // ========================================
  // 🎨 RENDERIZADO
  // ========================================
  return (
    <SmartDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              💼 Gestión de Leads
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Administra y da seguimiento a todos tus contactos y oportunidades de negocio
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Toggle Vista */}
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setShowStats(false)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  !showStats 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                📋 Lista
              </button>
              <button
                onClick={() => setShowStats(true)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  showStats 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                📊 Estadísticas
              </button>
            </div>

            {hasPermission('MANAGE_CONTENT') && !showStats && (
              <Button
                onClick={handleCreateLead}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <span className="mr-2">➕</span>
                Nuevo Lead
              </Button>
            )}
          </div>
        </div>

        {/* Contenido Principal: Vista de Estadísticas o Lista */}
        {showStats ? (
          /* Vista de Estadísticas Completas */
          <CrmStats />
        ) : (
          <>
            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Leads</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{pagination.totalRecords}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Nuevos</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {leads.filter(l => l.estado === 'nuevo').length}
                </p>
              </div>
              <div className="text-4xl">🆕</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">En Proceso</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {leads.filter(l => ['contactado', 'calificado', 'propuesta', 'negociacion'].includes(l.estado)).length}
                </p>
              </div>
              <div className="text-4xl">⚡</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Ganados</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {leads.filter(l => l.estado === 'ganado').length}
                </p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
          </Card>
        </div>

        {/* Filtros y Búsqueda */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="🔍 Buscar por nombre, email, empresa..."
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filtro Estado */}
            <select
              value={filters.estado || 'all'}
              onChange={(e) => handleFilterChange('estado', e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
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

            {/* Filtro Prioridad */}
            <select
              value={filters.prioridad || 'all'}
              onChange={(e) => handleFilterChange('prioridad', e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las prioridades</option>
              <option value="urgente">🔥 Urgente</option>
              <option value="alta">⬆️ Alta</option>
              <option value="media">➡️ Media</option>
              <option value="baja">⬇️ Baja</option>
            </select>

            {/* Botón Refrescar */}
            <Button
              onClick={refresh}
              variant="ghost"
              className="flex items-center justify-center gap-2"
            >
              🔄 Refrescar
            </Button>
          </div>
        </Card>

        {/* Tabla de Leads */}
        <Card>
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200">❌ {error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" text="Cargando leads..." />
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No hay leads disponibles
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {filters.search || filters.estado !== 'all' 
                  ? 'Intenta con otros filtros de búsqueda'
                  : 'Comienza creando tu primer lead'}
              </p>
            </div>
          ) : (
            <>
              {/* Tabla Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Contacto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Servicio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Prioridad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Origen
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {leads.map((lead) => (
                      <tr 
                        key={lead._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                        onClick={() => handleViewLead(lead)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                              {lead.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {lead.nombre}
                              </div>
                              {lead.empresa && (
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {lead.empresa}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{lead.correo}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{lead.celular}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                            {getTipoServicioLabel(lead.tipoServicio)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge estado={lead.estado} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <PriorityBadge prioridad={lead.prioridad} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <OrigenBadge origen={lead.origen} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(lead.createdAt).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewLead(lead);
                              }}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Ver detalles"
                            >
                              👁️
                            </button>
                            {hasPermission('MANAGE_CONTENT') && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditLead(lead);
                                  }}
                                  className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                                  title="Editar"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteLead(lead);
                                  }}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  title="Eliminar"
                                >
                                  🗑️
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards Mobile */}
              <div className="md:hidden space-y-4">
                {leads.map((lead) => (
                  <div
                    key={lead._id}
                    onClick={() => handleViewLead(lead)}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {lead.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {lead.nombre}
                          </h3>
                          {lead.empresa && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">{lead.empresa}</p>
                          )}
                        </div>
                      </div>
                      <StatusBadge estado={lead.estado} size="sm" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>📧</span>
                        <span>{lead.correo}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>📞</span>
                        <span>{lead.celular}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <PriorityBadge prioridad={lead.prioridad} size="sm" />
                        <OrigenBadge origen={lead.origen} size="sm" />
                      </div>
                    </div>

                    {/* Botones de acción mobile */}
                    {hasPermission('MANAGE_CONTENT') && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditLead(lead);
                          }}
                          className="flex-1 py-2 text-sm text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg transition-colors"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLead(lead);
                          }}
                          className="flex-1 py-2 text-sm text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 rounded-lg transition-colors"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Paginación */}
              {pagination.total > 1 && (
                <div className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Mostrando {pagination.count} de {pagination.totalRecords} leads
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => changePage(pagination.current - 1)}
                      disabled={pagination.current === 1}
                      variant="ghost"
                      size="sm"
                    >
                      ← Anterior
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.total) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => changePage(page)}
                            className={`px-3 py-1 rounded text-sm ${
                              pagination.current === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    <Button
                      onClick={() => changePage(pagination.current + 1)}
                      disabled={pagination.current === pagination.total}
                      variant="ghost"
                      size="sm"
                    >
                      Siguiente →
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
          </>
        )}
      </div>

      {/* 📝 Modales */}
      <LeadFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleSubmitCreate}
        mode="create"
      />

      <LeadFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedLead(null);
        }}
        onSubmit={handleSubmitEdit}
        lead={selectedLead}
        mode="edit"
      />

      <LeadDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedLead(null);
        }}
        lead={selectedLead}
        onEdit={handleEditFromDetail}
        onChangeStatus={handleChangeStatus}
        onAddActivity={handleAddActivity}
      />
    </SmartDashboardLayout>
  );
};

/**
 * Helper para obtener label del tipo de servicio
 */
const getTipoServicioLabel = (tipo: string): string => {
  const labels: Record<string, string> = {
    web: 'Sitio Web',
    app: 'App Móvil',
    ecommerce: 'E-commerce',
    sistemas: 'Sistemas',
    consultoria: 'Consultoría',
    diseño: 'Diseño',
    marketing: 'Marketing',
    otro: 'Otro'
  };
  return labels[tipo] || tipo;
};

export default LeadsManagement;
