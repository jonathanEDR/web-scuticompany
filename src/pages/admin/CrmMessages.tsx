/**
 * 💬 CRM MESSAGES - Página de Gestión de Mensajería
 * Panel administrativo completo para gestionar todos los mensajes del CRM
 */

import React, { useState, useEffect } from 'react';
import { MessageFiltersComponent } from '../../components/crm/messages/MessageFilters';
import { TemplateEditor } from '../../components/crm/templates/TemplateEditor';
import { MessageComposer } from '../../components/crm/messages/MessageComposer';
import { Modal } from '../../components/common/Modal';
import type { 
  LeadMessage, 
  MessageTemplate, 
  MessageFilters, 
  MessageStats,
  CreateInternalMessageData,
  CreateClientMessageData 
} from '../../types/message.types';
import { messageService, templateService } from '../../services/messageService';
import { crmService } from '../../services/crmService';
import { MESSAGE_TYPE_LABELS, MESSAGE_PRIORITY_COLORS } from '../../types/message.types';
import { formatRelativeTime } from '../../services/messageService';

type ViewMode = 'messages' | 'templates';
type TemplateModalMode = 'selector' | 'editor' | null;

/**
 * 🎨 Componente Principal CrmMessages
 */
export const CrmMessages: React.FC = () => {
  // ========================================
  // 📊 STATE
  // ========================================
  
  const [viewMode, setViewMode] = useState<ViewMode>('messages');
  
  // Mensajes
  const [messages, setMessages] = useState<LeadMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messageFilters, setMessageFilters] = useState<MessageFilters>({
    page: 1,
    limit: 50,
  });
  const [stats, setStats] = useState<MessageStats | null>(null);
  
  // Plantillas
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [templateModal, setTemplateModal] = useState<TemplateModalMode>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | undefined>();
  const [templateFavorites, setTemplateFavorites] = useState<string[]>([]);

  // Selección múltiple
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());

  // Composer Modal
  const [showComposer, setShowComposer] = useState(false);
  const [composerMode, setComposerMode] = useState<'internal' | 'client'>('internal');
  const [selectedLead, setSelectedLead] = useState<string>('');
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);

  // ========================================
  // 🔄 EFFECTS
  // ========================================

  useEffect(() => {
    if (viewMode === 'messages') {
      loadMessages();
      loadStats();
    } else {
      loadTemplates();
    }
  }, [viewMode, messageFilters.page]);

  // ========================================
  // 📩 FUNCIONES DE MENSAJES
  // ========================================

  const loadMessages = async () => {
    setIsLoadingMessages(true);
    try {
      // Si hay texto de búsqueda, usar searchMessages
      if (messageFilters.search && messageFilters.search.length >= 3) {
        const response = await messageService.searchMessages(messageFilters);
        if (response.success && response.data) {
          setMessages(response.data.mensajes || []);
        }
      } else {
        // Si no hay búsqueda, cargar todos los mensajes
        const response = await messageService.getAllMessages(messageFilters);
        if (response.success && response.data) {
          setMessages(response.data.mensajes || []);
        }
      }
    } catch (error) {
      console.error('Error cargando mensajes:', error);
      // En caso de error, mostrar array vacío
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await messageService.getUnreadMessages();
      if (response.success && response.data) {
        // Crear stats básicos
        const stats: MessageStats = {
          total: response.data.total || 0,
          noLeidos: response.data.mensajes?.length || 0,
          enviados: 0,
          respondidos: 0,
          porTipo: {},
        };
        setStats(stats);
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const handleFilterChange = (filters: MessageFilters) => {
    setMessageFilters({ ...messageFilters, ...filters, page: 1 });
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const response = await messageService.markAsRead(messageId);
      if (response.success) {
        await loadMessages();
        await loadStats();
      }
    } catch (error) {
      console.error('Error marcando como leído:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (selectedMessages.size === 0) {
      alert('Selecciona al menos un mensaje');
      return;
    }

    try {
      const promises = Array.from(selectedMessages).map(id => 
        messageService.markAsRead(id)
      );
      await Promise.all(promises);
      setSelectedMessages(new Set());
      await loadMessages();
      await loadStats();
    } catch (error) {
      console.error('Error marcando mensajes como leídos:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este mensaje?')) {
      return;
    }

    try {
      const response = await messageService.deleteMessage(messageId);
      if (response.success) {
        await loadMessages();
        await loadStats();
      }
    } catch (error) {
      console.error('Error eliminando mensaje:', error);
    }
  };

  const toggleMessageSelection = (messageId: string) => {
    const newSelection = new Set(selectedMessages);
    if (newSelection.has(messageId)) {
      newSelection.delete(messageId);
    } else {
      newSelection.add(messageId);
    }
    setSelectedMessages(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedMessages.size === messages.length) {
      setSelectedMessages(new Set());
    } else {
      setSelectedMessages(new Set(messages.map(m => m._id)));
    }
  };

  /**
   * Cargar lista de leads para el composer
   */
  const loadLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const response = await crmService.getLeads({
        page: 1,
        limit: 100,
      });
      if (response.success && response.data) {
        setLeads(response.data || []);
      }
    } catch (error) {
      console.error('Error cargando leads:', error);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  /**
   * Abrir composer de mensajes
   */
  const handleOpenComposer = (mode: 'internal' | 'client' = 'internal') => {
    setComposerMode(mode);
    setShowComposer(true);
    if (leads.length === 0) {
      loadLeads();
    }
  };

  /**
   * Cerrar composer
   */
  const handleCloseComposer = () => {
    setShowComposer(false);
    setSelectedLead('');
  };

  /**
   * Enviar mensaje desde composer
   */
  const handleSendMessage = async (data: CreateInternalMessageData | CreateClientMessageData) => {
    try {
      if (composerMode === 'internal') {
        await messageService.sendInternalMessage(data as CreateInternalMessageData);
      } else {
        await messageService.sendClientMessage(data as CreateClientMessageData);
      }
      
      handleCloseComposer();
      loadMessages(); // Recargar lista
      
      // Mostrar notificación de éxito (opcional)
      console.log('✅ Mensaje enviado correctamente');
    } catch (error) {
      console.error('❌ Error enviando mensaje:', error);
      // Aquí podrías mostrar un toast de error
    }
  };

  // ========================================
  // 📋 FUNCIONES DE PLANTILLAS
  // ========================================

  const loadTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const response = await templateService.getTemplates();
      if (response.success && response.data) {
        setTemplates(response.data.plantillas || []);
      }
    } catch (error) {
      console.error('Error cargando plantillas:', error);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const handleSaveTemplate = async (data: Partial<MessageTemplate>) => {
    try {
      let response;
      if (selectedTemplate) {
        response = await templateService.updateTemplate(selectedTemplate._id, data);
      } else {
        response = await templateService.createTemplate(data as any);
      }

      if (response.success) {
        setTemplateModal(null);
        setSelectedTemplate(undefined);
        await loadTemplates();
      } else {
        alert(response.message || 'Error al guardar plantilla');
      }
    } catch (error) {
      console.error('Error guardando plantilla:', error);
      alert('Error al guardar la plantilla');
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta plantilla?')) {
      return;
    }

    try {
      const response = await templateService.deleteTemplate(templateId);
      if (response.success) {
        await loadTemplates();
      }
    } catch (error) {
      console.error('Error eliminando plantilla:', error);
    }
  };

  const handleToggleFavorite = async (templateId: string) => {
    try {
      const response = await templateService.toggleFavorite(templateId);
      if (response.success) {
        // Toggle en el estado local
        setTemplateFavorites(prev => {
          const newFavorites = new Set(prev);
          if (newFavorites.has(templateId)) {
            newFavorites.delete(templateId);
          } else {
            newFavorites.add(templateId);
          }
          return Array.from(newFavorites);
        });
        await loadTemplates();
      }
    } catch (error) {
      console.error('Error toggle favorito:', error);
    }
  };

  // ========================================
  // 🎨 RENDER HELPERS
  // ========================================

  const getMessageTypeBadge = (tipo: string) => {
    const colors: Record<string, string> = {
      nota_interna: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      mensaje_cliente: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      respuesta_cliente: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[tipo] || 'bg-gray-100 text-gray-700'}`}>
        {MESSAGE_TYPE_LABELS[tipo as keyof typeof MESSAGE_TYPE_LABELS] || tipo}
      </span>
    );
  };

  const getPriorityBadge = (prioridad: string) => {
    const color = MESSAGE_PRIORITY_COLORS[prioridad as keyof typeof MESSAGE_PRIORITY_COLORS] || 'gray';
    const colors: Record<string, string> = {
      gray: 'bg-gray-500',
      blue: 'bg-blue-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
    };

    return (
      <span className={`w-2 h-2 rounded-full ${colors[color]}`} title={prioridad}></span>
    );
  };

  // ========================================
  // 🎨 RENDER PRINCIPAL
  // ========================================

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <span>💬</span>
                Gestión de Mensajería CRM
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Administra todos los mensajes y plantillas del sistema
              </p>
            </div>

            {/* Toggle View Mode + Nuevo Mensaje */}
            <div className="flex gap-2">
              {/* Botón Nuevo Mensaje - solo visible en modo mensajes */}
              {viewMode === 'messages' && (
                <div className="flex gap-2 mr-4">
                  <button
                    onClick={() => handleOpenComposer('client')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <span>✉️</span>
                    Mensaje a Cliente
                  </button>
                  <button
                    onClick={() => handleOpenComposer('internal')}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <span>📝</span>
                    Nota Interna
                  </button>
                </div>
              )}

              <button
                onClick={() => setViewMode('messages')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'messages'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                💬 Mensajes
              </button>
              <button
                onClick={() => setViewMode('templates')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'templates'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                📋 Plantillas
              </button>
            </div>
          </div>

          {/* Stats */}
          {stats && viewMode === 'messages' && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.total}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Total Mensajes</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {stats.noLeidos}
                </div>
                <div className="text-sm text-red-700 dark:text-red-300">No Leídos</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.enviados}
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">Enviados</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.respondidos}
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300">Respondidos</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* VISTA: MENSAJES */}
        {viewMode === 'messages' && (
          <div className="space-y-6">
            {/* Filtros */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <MessageFiltersComponent
                onFilterChange={handleFilterChange}
                currentFilters={messageFilters}
                stats={stats || undefined}
              />
            </div>

            {/* Acciones Batch */}
            {selectedMessages.size > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 flex items-center justify-between">
                <div className="text-sm text-blue-900 dark:text-blue-300">
                  <strong>{selectedMessages.size}</strong> mensaje{selectedMessages.size !== 1 ? 's' : ''} seleccionado{selectedMessages.size !== 1 ? 's' : ''}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                  >
                    ✅ Marcar como leídos
                  </button>
                  <button
                    onClick={() => setSelectedMessages(new Set())}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                  >
                    ✖ Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Tabla de Mensajes */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin text-4xl mb-2">⏳</div>
                    <p className="text-gray-600 dark:text-gray-400">Cargando mensajes...</p>
                  </div>
                </div>
              ) : messages.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedMessages.size === messages.length && messages.length > 0}
                            onChange={toggleSelectAll}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Estado
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Tipo
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Lead
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Contenido
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Autor
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Fecha
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {messages.map((message) => (
                        <tr
                          key={message._id}
                          className={`hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors ${
                            !message.leido ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''
                          }`}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedMessages.has(message._id)}
                              onChange={() => toggleMessageSelection(message._id)}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {getPriorityBadge(message.prioridad)}
                              {!message.leido && (
                                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded">
                                  Nuevo
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {getMessageTypeBadge(message.tipo)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              Lead #{message.leadId.toString().substring(0, 8)}
                            </div>
                          </td>
                          <td className="px-4 py-3 max-w-md">
                            <div className="text-sm text-gray-900 dark:text-white truncate">
                              {message.contenido.substring(0, 100)}
                              {message.contenido.length > 100 && '...'}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {message.autor.nombre}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {formatRelativeTime(message.createdAt)}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {!message.leido && (
                                <button
                                  onClick={() => handleMarkAsRead(message._id)}
                                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                  title="Marcar como leído"
                                >
                                  ✅
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteMessage(message._id)}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                title="Eliminar"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-4xl mb-2">💬</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No hay mensajes
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Los mensajes aparecerán aquí cuando se envíen
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VISTA: PLANTILLAS */}
        {viewMode === 'templates' && (
          <div className="space-y-6">
            {/* Header con botón crear */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Plantillas de Mensajes
              </h2>
              <button
                onClick={() => {
                  setSelectedTemplate(undefined);
                  setTemplateModal('editor');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                ➕ Nueva Plantilla
              </button>
            </div>

            {/* Grid de Plantillas */}
            {isLoadingTemplates ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin text-4xl mb-2">⏳</div>
                  <p className="text-gray-600 dark:text-gray-400">Cargando plantillas...</p>
                </div>
              </div>
            ) : templates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div
                    key={template._id}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {template.titulo}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {template.descripcion}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleFavorite(template._id)}
                        className="text-xl"
                      >
                        {templateFavorites.includes(template._id) ? '⭐' : '☆'}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {getMessageTypeBadge(template.tipo)}
                      {template.categoria && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded text-xs">
                          {template.categoria}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Usado {template.vecesUsada} veces
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedTemplate(template);
                            setTemplateModal('editor');
                          }}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template._id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-4xl mb-2">📋</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No hay plantillas
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Crea tu primera plantilla para agilizar la comunicación
                </p>
                <button
                  onClick={() => {
                    setSelectedTemplate(undefined);
                    setTemplateModal('editor');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  ➕ Crear Primera Plantilla
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Message Composer */}
      {showComposer && (
        <Modal
          isOpen={showComposer}
          onClose={handleCloseComposer}
          title={composerMode === 'internal' ? '📝 Nueva Nota Interna' : '✉️ Mensaje a Cliente'}
          size="lg"
        >
          <div className="space-y-4">
            {/* Selector de Lead */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seleccionar Proyecto
              </label>
              {isLoadingLeads ? (
                <div className="text-sm text-gray-500">Cargando proyectos...</div>
              ) : (
                <select
                  value={selectedLead}
                  onChange={(e) => setSelectedLead(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Seleccione un proyecto</option>
                  {leads.map((lead) => (
                    <option key={lead._id} value={lead._id}>
                      {lead.nombre} - {lead.empresa || 'Sin empresa'} ({lead.tipoServicio})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Message Composer */}
            {selectedLead && (
              <MessageComposer
                leadId={selectedLead}
                leadData={leads.find(l => l._id === selectedLead)}
                messageType={composerMode}
                onSend={handleSendMessage}
                onCancel={handleCloseComposer}
                templates={templates}
                showSubject={true}
                showPriority={true}
              />
            )}
          </div>
        </Modal>
      )}

      {/* Modal: Template Editor */}
      {templateModal === 'editor' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <TemplateEditor
              template={selectedTemplate}
              onSave={handleSaveTemplate}
              onCancel={() => {
                setTemplateModal(null);
                setSelectedTemplate(undefined);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CrmMessages;
