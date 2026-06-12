import React, { useState, useEffect } from 'react';
import {
  ClipboardList, MessageCircle, ListChecks, Clock,
  Zap, Pencil, Eye, Phone, DollarSign, CheckCircle, XCircle,
  Rocket, Sparkles, Ban, RefreshCw, Trophy, Play,
  User, Briefcase, Settings, Building2, Mail, Wrench,
  Calendar, Hash, Target, Globe, FileText, Tag,
  Plus, Inbox, Loader2, Send
} from 'lucide-react';
import { ActivityTimeline } from './ActivityTimeline';
import { StatusBadge, PriorityBadge, OrigenBadge } from './Badges';
import { MessageTimeline } from './messages/MessageTimeline';
import { MessageComposer } from './messages/MessageComposer';
import type { Lead } from '../../services/crmService';
import type { LeadMessage, MessageTemplate } from '../../types/message.types';
import { messageService, templateService } from '../../services/messageService';

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onEdit?: (lead: Lead) => void;
  onChangeStatus?: (leadId: string, nuevoEstado: Lead['estado']) => Promise<void>;
  onAddActivity?: (leadId: string, tipo: string, descripcion: string) => Promise<void>;
}

type TabType = 'general' | 'activities' | 'messages' | 'history';

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

  const [messages, setMessages] = useState<LeadMessage[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showComposer, setShowComposer] = useState(false);
  const [composerType, setComposerType] = useState<'internal' | 'client'>('internal');

  useEffect(() => {
    if (isOpen && lead) {
      loadMessages();
      loadTemplates();
    }
  }, [isOpen, lead]);

  if (!isOpen || !lead) return null;

  const loadMessages = async () => {
    if (!lead) return;
    setIsLoadingMessages(true);
    try {
      const response = await messageService.getLeadMessages(lead._id);
      if (response.success && response.data) {
        setMessages(response.data.mensajes || []);
        const unread = (response.data.mensajes || []).filter(
          (msg: LeadMessage) => !msg.leido && msg.tipo !== 'nota_interna'
        ).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await templateService.getTemplates();
      if (response.success && response.data) {
        setTemplates(response.data.plantillas || []);
      }
    } catch (error) {
      console.error('Error al cargar plantillas:', error);
    }
  };

  const handleSendMessage = async (data: {
    contenido: string;
    prioridad?: string;
    etiquetas?: string[];
  }) => {
    if (!lead) return;
    try {
      let response;
      if (composerType === 'internal') {
        response = await messageService.sendInternalMessage({
          leadId: lead._id,
          contenido: data.contenido,
          prioridad: (data.prioridad as any) || 'normal',
          etiquetas: data.etiquetas || [],
        });
      } else {
        response = await messageService.sendClientMessage({
          leadId: lead._id,
          contenido: data.contenido,
          prioridad: (data.prioridad as any) || 'normal',
        });
      }
      if (response.success) {
        setShowComposer(false);
        await loadMessages();
      } else {
        alert(response.message || 'Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      alert('Error al enviar el mensaje');
    }
  };

  const handleInitReply = (messageId: string) => {
    console.log('Iniciar respuesta a mensaje:', messageId);
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const response = await messageService.markAsRead(messageId);
      if (response.success) await loadMessages();
    } catch (error) {
      console.error('Error al marcar como leído:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este mensaje?')) return;
    try {
      const response = await messageService.deleteMessage(messageId);
      if (response.success) {
        await loadMessages();
      } else {
        alert(response.message || 'Error al eliminar el mensaje');
      }
    } catch (error) {
      console.error('Error al eliminar mensaje:', error);
      alert('Error al eliminar el mensaje');
    }
  };

  const handleRefreshMessages = async () => {
    await loadMessages();
  };

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

  const getTipoServicioLabel = (tipo: string) => {
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
              className="text-white hover:text-gray-200 transition-colors"
            >
              <XCircle size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-1.5 py-3 px-4 font-medium transition-colors border-b-2 ${
                activeTab === 'general'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <ClipboardList size={15} strokeWidth={1.5} />
              Información General
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-1.5 py-3 px-4 font-medium transition-colors border-b-2 relative ${
                activeTab === 'messages'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <MessageCircle size={15} strokeWidth={1.5} />
              Mensajes
              {unreadCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`flex items-center gap-1.5 py-3 px-4 font-medium transition-colors border-b-2 ${
                activeTab === 'activities'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <ListChecks size={15} strokeWidth={1.5} />
              Actividades {lead.actividades && `(${lead.actividades.length})`}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 py-3 px-4 font-medium transition-colors border-b-2 ${
                activeTab === 'history'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Clock size={15} strokeWidth={1.5} />
              Historial
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
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                  <Zap size={14} strokeWidth={1.5} />
                  Acciones Rápidas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(lead)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors text-sm"
                    >
                      <Pencil size={14} strokeWidth={1.5} />
                      Editar Lead
                    </button>
                  )}

                  {onChangeStatus && (
                    <>
                      {lead.estado === 'nuevo' && (
                        <button
                          onClick={() => handleChangeStatus('en_revision')}
                          className="flex items-center gap-1.5 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors text-sm"
                        >
                          <Eye size={14} strokeWidth={1.5} />
                          Marcar en Revisión
                        </button>
                      )}

                      {lead.estado === 'en_revision' && (
                        <button
                          onClick={() => handleChangeStatus('contactando')}
                          className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors text-sm"
                        >
                          <Phone size={14} strokeWidth={1.5} />
                          Comenzar a Contactar
                        </button>
                      )}

                      {lead.estado === 'contactando' && (
                        <button
                          onClick={() => handleChangeStatus('cotizacion')}
                          className="flex items-center gap-1.5 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
                        >
                          <DollarSign size={14} strokeWidth={1.5} />
                          Enviar Cotización
                        </button>
                      )}

                      {lead.estado === 'cotizacion' && (
                        <>
                          <button
                            onClick={() => handleChangeStatus('aprobado')}
                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm"
                          >
                            <CheckCircle size={14} strokeWidth={1.5} />
                            Marcar como Aprobado
                          </button>
                          <button
                            onClick={() => handleChangeStatus('rechazado')}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                          >
                            <XCircle size={14} strokeWidth={1.5} />
                            Marcar como Rechazado
                          </button>
                        </>
                      )}

                      {lead.estado === 'aprobado' && (
                        <button
                          onClick={() => handleChangeStatus('en_desarrollo')}
                          className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm"
                        >
                          <Rocket size={14} strokeWidth={1.5} />
                          Iniciar Desarrollo
                        </button>
                      )}

                      {lead.estado === 'en_desarrollo' && (
                        <button
                          onClick={() => handleChangeStatus('completado')}
                          className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
                        >
                          <Sparkles size={14} strokeWidth={1.5} />
                          Marcar como Completado
                        </button>
                      )}

                      {!['completado', 'rechazado', 'cancelado'].includes(lead.estado) && (
                        <button
                          onClick={() => handleChangeStatus('cancelado')}
                          className="flex items-center gap-1.5 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                        >
                          <Ban size={14} strokeWidth={1.5} />
                          Cancelar Solicitud
                        </button>
                      )}

                      {(lead.estado === 'rechazado' || lead.estado === 'cancelado') && (
                        <button
                          onClick={() => handleChangeStatus('en_revision')}
                          className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                        >
                          <RefreshCw size={14} strokeWidth={1.5} />
                          Reactivar Solicitud
                        </button>
                      )}

                      {lead.estado === 'contactado' && (
                        <button
                          onClick={() => handleChangeStatus('calificado')}
                          className="flex items-center gap-1.5 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
                        >
                          <CheckCircle size={14} strokeWidth={1.5} />
                          Marcar como Calificado
                        </button>
                      )}

                      {lead.estado === 'calificado' && (
                        <button
                          onClick={() => handleChangeStatus('propuesta')}
                          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm"
                        >
                          <FileText size={14} strokeWidth={1.5} />
                          Enviar Propuesta
                        </button>
                      )}

                      {lead.estado === 'propuesta' && (
                        <button
                          onClick={() => handleChangeStatus('negociacion')}
                          className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm"
                        >
                          <DollarSign size={14} strokeWidth={1.5} />
                          Iniciar Negociación
                        </button>
                      )}

                      {!['ganado', 'perdido', 'pausado', 'completado', 'rechazado', 'cancelado'].includes(lead.estado) && (
                        <>
                          <button
                            onClick={() => handleChangeStatus('ganado')}
                            className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
                          >
                            <Trophy size={14} strokeWidth={1.5} />
                            Cerrar como Ganado
                          </button>
                          <button
                            onClick={() => handleChangeStatus('perdido')}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                          >
                            <XCircle size={14} strokeWidth={1.5} />
                            Marcar como Perdido
                          </button>
                        </>
                      )}

                      {lead.estado === 'pausado' && (
                        <button
                          onClick={() => handleChangeStatus('contactado')}
                          className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                        >
                          <Play size={14} strokeWidth={1.5} />
                          Reactivar Lead
                        </button>
                      )}

                      {lead.estado === 'perdido' && (
                        <button
                          onClick={() => handleChangeStatus('contactado')}
                          className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                        >
                          <RefreshCw size={14} strokeWidth={1.5} />
                          Reabrir Lead
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Información del Cliente */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <User size={18} strokeWidth={1.5} />
                  Información del Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoField label="Nombre Completo" value={lead.nombre} icon={<User size={18} strokeWidth={1.5} />} />
                  <InfoField label="Empresa" value={lead.empresa || 'No especificada'} icon={<Building2 size={18} strokeWidth={1.5} />} />
                  <InfoField label="Correo Electrónico" value={lead.correo} icon={<Mail size={18} strokeWidth={1.5} />} />
                  <InfoField label="Celular" value={lead.celular} icon={<Phone size={18} strokeWidth={1.5} />} />
                </div>
              </div>

              {/* Información del Proyecto */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Briefcase size={18} strokeWidth={1.5} />
                  Información del Proyecto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoField label="Tipo de Servicio" value={getTipoServicioLabel(lead.tipoServicio)} icon={<Wrench size={18} strokeWidth={1.5} />} />
                  <InfoField label="Presupuesto Estimado" value={formatCurrency(lead.presupuestoEstimado)} icon={<DollarSign size={18} strokeWidth={1.5} />} />
                  <InfoField label="Fecha Deseada" value={formatDate(lead.fechaDeseada)} icon={<Calendar size={18} strokeWidth={1.5} />} />
                  <div className="flex items-start gap-2">
                    <Target size={20} strokeWidth={1.5} className="mt-0.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Prioridad</label>
                      <div className="mt-1">
                        <PriorityBadge prioridad={lead.prioridad} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe size={20} strokeWidth={1.5} className="mt-0.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
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
                  <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
                    <FileText size={14} strokeWidth={1.5} />
                    Descripción del Proyecto
                  </label>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {lead.descripcionProyecto}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                {lead.tags && lead.tags.length > 0 && (
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
                      <Tag size={14} strokeWidth={1.5} />
                      Etiquetas
                    </label>
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
                  <Settings size={18} strokeWidth={1.5} />
                  Información del Sistema
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoField label="Fecha de Creación" value={formatDate(lead.createdAt)} icon={<Calendar size={18} strokeWidth={1.5} />} />
                  <InfoField label="Última Actualización" value={formatDate(lead.updatedAt)} icon={<RefreshCw size={18} strokeWidth={1.5} />} />
                  <InfoField label="ID del Lead" value={lead._id} icon={<Hash size={18} strokeWidth={1.5} />} />
                </div>
              </div>
            </div>
          )}

          {/* TAB: Mensajes */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setComposerType('internal');
                    setShowComposer(!showComposer);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <FileText size={15} strokeWidth={1.5} />
                  {showComposer && composerType === 'internal' ? 'Cancelar' : 'Nueva Nota Interna'}
                </button>
                <button
                  onClick={() => {
                    setComposerType('client');
                    setShowComposer(!showComposer);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Send size={15} strokeWidth={1.5} />
                  {showComposer && composerType === 'client' ? 'Cancelar' : 'Mensaje a Cliente'}
                </button>
                <button
                  onClick={handleRefreshMessages}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <RefreshCw size={15} strokeWidth={1.5} />
                  Actualizar
                </button>
              </div>

              {showComposer && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <MessageComposer
                    leadId={lead._id}
                    messageType={composerType}
                    onSend={handleSendMessage}
                    templates={templates}
                    onCancel={() => setShowComposer(false)}
                  />
                </div>
              )}

              {isLoadingMessages ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 size={40} strokeWidth={1.5} className="animate-spin mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">Cargando mensajes...</p>
                  </div>
                </div>
              ) : messages.length > 0 ? (
                <MessageTimeline
                  leadId={lead._id}
                  messages={messages}
                  onRefresh={handleRefreshMessages}
                  onReply={handleInitReply}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDeleteMessage}
                  canReply={true}
                  canDelete={true}
                  canViewPrivate={true}
                />
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <MessageCircle size={48} strokeWidth={1.5} className="mx-auto mb-3 opacity-40" />
                  <p className="text-lg font-medium mb-2">No hay mensajes aún</p>
                  <p className="text-sm">Crea el primer mensaje para este lead</p>
                </div>
              )}
            </div>
          )}

          {/* TAB: Actividades */}
          {activeTab === 'activities' && (
            <div className="space-y-6">
              {onAddActivity && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <Plus size={14} strokeWidth={1.5} />
                    Agregar Nueva Actividad
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <select
                      value={newActivity.tipo}
                      onChange={(e) => setNewActivity({ ...newActivity, tipo: e.target.value })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="nota">Nota</option>
                      <option value="llamada">Llamada</option>
                      <option value="email">Email</option>
                      <option value="reunion">Reunión</option>
                      <option value="propuesta">Propuesta</option>
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

              {lead.actividades && lead.actividades.length > 0 ? (
                <ActivityTimeline actividades={lead.actividades} />
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Inbox size={48} strokeWidth={1.5} className="mx-auto mb-3 opacity-40" />
                  <p>No hay actividades registradas</p>
                </div>
              )}
            </div>
          )}

          {/* TAB: Historial */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock size={18} strokeWidth={1.5} />
                Historial de Cambios
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
                        <RefreshCw size={20} strokeWidth={1.5} className="mt-0.5 text-gray-400 flex-shrink-0" />
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
                  <ClipboardList size={48} strokeWidth={1.5} className="mx-auto mb-3 opacity-40" />
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

const InfoField: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="flex items-start gap-2">
    <span className="mt-0.5 text-gray-500 dark:text-gray-400 flex-shrink-0">{icon}</span>
    <div>
      <label className="text-sm text-gray-500 dark:text-gray-400">{label}</label>
      <p className="text-gray-900 dark:text-white font-medium">{value}</p>
    </div>
  </div>
);

export default LeadDetailModal;
