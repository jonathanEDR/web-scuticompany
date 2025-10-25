import React, { useState } from 'react';
import { ActivityTimeline } from './ActivityTimeline';
import { StatusBadge, PriorityBadge, OrigenBadge } from './Badges';
import type { Lead } from '../../services/crmService';

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onEdit?: (lead: Lead) => void;
  onChangeStatus?: (leadId: string, nuevoEstado: Lead['estado']) => Promise<void>;
  onAddActivity?: (leadId: string, tipo: string, descripcion: string) => Promise<void>;
}

type TabType = 'general' | 'activities' | 'history';

/**
 * 🔍 Modal de vista detallada del Lead
 */
export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  isOpen,
  onClose,
  lead,
  onEdit,
  onChangeStatus,
  onAddActivity
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [newActivity, setNewActivity] = useState({ tipo: 'nota', descripcion: '' });
  const [isAddingActivity, setIsAddingActivity] = useState(false);

  if (!isOpen || !lead) return null;

  // ========================================
  // 🔄 HANDLERS
  // ========================================
  const handleChangeStatus = async (nuevoEstado: Lead['estado']) => {
    if (onChangeStatus && window.confirm(`¿Cambiar el estado del lead a "${nuevoEstado}"?`)) {
      await onChangeStatus(lead._id, nuevoEstado);
    }
  };

  const handleAddActivity = async () => {
    if (!newActivity.descripcion.trim()) {
      alert('Por favor ingresa una descripción para la actividad');
      return;
    }

    setIsAddingActivity(true);
    try {
      if (onAddActivity) {
        await onAddActivity(lead._id, newActivity.tipo, newActivity.descripcion);
        setNewActivity({ tipo: 'nota', descripcion: '' });
      }
    } catch (error) {
      console.error('Error al agregar actividad:', error);
      alert('Error al agregar la actividad');
    } finally {
      setIsAddingActivity(false);
    }
  };

  // ========================================
  // 📊 HELPERS
  // ========================================
  const getTipoServicioLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      web: '🌐 Sitio Web',
      app: '📱 App Móvil',
      ecommerce: '🛒 E-commerce',
      sistemas: '💻 Sistemas',
      consultoria: '👨‍💼 Consultoría',
      diseño: '🎨 Diseño',
      marketing: '📢 Marketing',
      otro: '📌 Otro'
    };
    return labels[tipo] || tipo;
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'No especificado';
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'USD' }).format(value);
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return 'No especificada';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // ========================================
  // 🎨 RENDERIZADO
  // ========================================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white text-2xl font-bold">
                {lead.nombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{lead.nombre}</h2>
                {lead.empresa && (
                  <p className="text-blue-100">{lead.empresa}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge estado={lead.estado} />
                  <PriorityBadge prioridad={lead.prioridad} />
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-3 px-4 font-medium transition-colors border-b-2 ${
                activeTab === 'general'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              📋 Información General
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`py-3 px-4 font-medium transition-colors border-b-2 ${
                activeTab === 'activities'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              📝 Actividades {lead.actividades && `(${lead.actividades.length})`}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-3 px-4 font-medium transition-colors border-b-2 ${
                activeTab === 'history'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              📜 Historial
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB: Información General */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Acciones Rápidas */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  ⚡ Acciones Rápidas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(lead)}
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors text-sm"
                    >
                      ✏️ Editar Lead
                    </button>
                  )}
                  
                  {/* Botones de cambio de estado según el estado actual */}
                  {onChangeStatus && (
                    <>
                      {/* Si es nuevo, mostrar Contactar */}
                      {lead.estado === 'nuevo' && (
                        <button
                          onClick={() => handleChangeStatus('contactado')}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                        >
                          � Marcar como Contactado
                        </button>
                      )}

                      {/* Si está contactado, mostrar Calificar */}
                      {lead.estado === 'contactado' && (
                        <button
                          onClick={() => handleChangeStatus('calificado')}
                          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
                        >
                          ✅ Marcar como Calificado
                        </button>
                      )}

                      {/* Si está calificado, mostrar Enviar Propuesta */}
                      {lead.estado === 'calificado' && (
                        <button
                          onClick={() => handleChangeStatus('propuesta')}
                          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm"
                        >
                          � Enviar Propuesta
                        </button>
                      )}

                      {/* Si hay propuesta, mostrar Negociar */}
                      {lead.estado === 'propuesta' && (
                        <button
                          onClick={() => handleChangeStatus('negociacion')}
                          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm"
                        >
                          💰 Iniciar Negociación
                        </button>
                      )}

                      {/* Si está en negociación o cualquier estado activo, mostrar Ganado y Perdido */}
                      {!['ganado', 'perdido', 'pausado'].includes(lead.estado) && (
                        <>
                          <button
                            onClick={() => handleChangeStatus('ganado')}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
                          >
                            🎉 Cerrar como Ganado
                          </button>
                          <button
                            onClick={() => handleChangeStatus('perdido')}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                          >
                            ❌ Marcar como Perdido
                          </button>
                        </>
                      )}

                      {/* Botón para pausar (excepto si ya está pausado, ganado o perdido) */}
                      {!['pausado', 'ganado', 'perdido'].includes(lead.estado) && (
                        <button
                          onClick={() => handleChangeStatus('pausado')}
                          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                        >
                          ⏸️ Pausar Lead
                        </button>
                      )}

                      {/* Si está pausado, permitir reactivar */}
                      {lead.estado === 'pausado' && (
                        <button
                          onClick={() => handleChangeStatus('contactado')}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                        >
                          ▶️ Reactivar Lead
                        </button>
                      )}

                      {/* Si está perdido, permitir reabrir */}
                      {lead.estado === 'perdido' && (
                        <button
                          onClick={() => handleChangeStatus('contactado')}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                        >
                          🔄 Reabrir Lead
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Información del Cliente */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>👤</span> Información del Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoField label="Nombre Completo" value={lead.nombre} icon="👤" />
                  <InfoField label="Empresa" value={lead.empresa || 'No especificada'} icon="🏢" />
                  <InfoField label="Correo Electrónico" value={lead.correo} icon="📧" />
                  <InfoField label="Celular" value={lead.celular} icon="📞" />
                </div>
              </div>

              {/* Información del Proyecto */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>💼</span> Información del Proyecto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoField label="Tipo de Servicio" value={getTipoServicioLabel(lead.tipoServicio)} icon="🛠️" />
                  <InfoField label="Presupuesto Estimado" value={formatCurrency(lead.presupuestoEstimado)} icon="💰" />
                  <InfoField label="Fecha Deseada" value={formatDate(lead.fechaDeseada)} icon="📅" />
                  <div className="flex items-start gap-2">
                    <span className="text-xl">🎯</span>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Prioridad</label>
                      <div className="mt-1">
                        <PriorityBadge prioridad={lead.prioridad} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xl">🌐</span>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Origen</label>
                      <div className="mt-1">
                        <OrigenBadge origen={lead.origen} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Descripción del Proyecto */}
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">📝 Descripción del Proyecto</label>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {lead.descripcionProyecto}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                {lead.tags && lead.tags.length > 0 && (
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">🏷️ Etiquetas</label>
                    <div className="flex flex-wrap gap-2">
                      {lead.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Información del Sistema */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>⚙️</span> Información del Sistema
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoField label="Fecha de Creación" value={formatDate(lead.createdAt)} icon="📆" />
                  <InfoField label="Última Actualización" value={formatDate(lead.updatedAt)} icon="🔄" />
                  <InfoField label="ID del Lead" value={lead._id} icon="🆔" />
                </div>
              </div>
            </div>
          )}

          {/* TAB: Actividades */}
          {activeTab === 'activities' && (
            <div className="space-y-6">
              {/* Formulario para agregar actividad */}
              {onAddActivity && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    ➕ Agregar Nueva Actividad
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <select
                      value={newActivity.tipo}
                      onChange={(e) => setNewActivity({ ...newActivity, tipo: e.target.value })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="nota">📝 Nota</option>
                      <option value="llamada">📞 Llamada</option>
                      <option value="email">📧 Email</option>
                      <option value="reunion">🤝 Reunión</option>
                      <option value="propuesta">📄 Propuesta</option>
                    </select>
                    <input
                      type="text"
                      value={newActivity.descripcion}
                      onChange={(e) => setNewActivity({ ...newActivity, descripcion: e.target.value })}
                      placeholder="Descripción de la actividad..."
                      className="md:col-span-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={handleAddActivity}
                      disabled={isAddingActivity}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isAddingActivity ? 'Agregando...' : 'Agregar'}
                    </button>
                  </div>
                </div>
              )}

              {/* Timeline de actividades */}
              {lead.actividades && lead.actividades.length > 0 ? (
                <ActivityTimeline actividades={lead.actividades} />
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p className="text-4xl mb-2">📭</p>
                  <p>No hay actividades registradas</p>
                </div>
              )}
            </div>
          )}

          {/* TAB: Historial */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                📜 Historial de Cambios
              </h3>
              {lead.actividades && lead.actividades.length > 0 ? (
                <div className="space-y-3">
                  {lead.actividades
                    .filter(act => act.tipo === 'cambio_estado')
                    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                    .map((activity, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-start gap-3"
                      >
                        <span className="text-2xl">🔄</span>
                        <div className="flex-1">
                          <p className="text-gray-900 dark:text-white font-medium">
                            {activity.descripcion}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(activity.fecha).toLocaleString('es-ES')}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p className="text-4xl mb-2">📋</p>
                  <p>No hay historial de cambios</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 📋 Componente auxiliar para mostrar información
 */
const InfoField: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon }) => (
  <div className="flex items-start gap-2">
    <span className="text-xl">{icon}</span>
    <div>
      <label className="text-sm text-gray-500 dark:text-gray-400">{label}</label>
      <p className="text-gray-900 dark:text-white font-medium">{value}</p>
    </div>
  </div>
);

export default LeadDetailModal;
