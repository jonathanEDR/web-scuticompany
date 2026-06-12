/**
 * 💬 CRM MESSAGES - Página de Gestión de Mensajería
 * Panel administrativo completo para gestionar todos los mensajes del CRM
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, ClipboardList, Send, FileText, CheckCheck, Trash2, Loader2, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { MessageFiltersComponent } from '../../components/crm/messages/MessageFilters';
import { ComposerModal } from '../../components/crm/messages/ComposerModal';
import { TemplatesView } from '../../components/crm/templates/TemplatesView';
import { ConversationPanel } from '../../components/crm/messages/ConversationPanel';
import SmartDashboardLayout from '../../components/SmartDashboardLayout';
import { useDashboardHeaderGradient } from '../../hooks/cms/useDashboardHeaderGradient';
import type {
  LeadMessage,
  MessageFilters,
  MessageStats
} from '../../types/message.types';
import { messageService, formatRelativeTime, extractLeadId } from '../../services/messageService';
import { crmService } from '../../services/crmService';
import { MESSAGE_TYPE_LABELS, MESSAGE_PRIORITY_COLORS } from '../../types/message.types';

type ViewMode = 'messages' | 'templates';

/**
 * 🎨 Componente Principal CrmMessages
 */
export const CrmMessages: React.FC = () => {
  // 🎨 Obtener gradiente del header del sidebar para consistencia visual
  const { headerGradient } = useDashboardHeaderGradient();
  
  // 🔗 Parámetros de URL para abrir conversación desde notificaciones
  const [searchParams, setSearchParams] = useSearchParams();
  const urlLeadId = searchParams.get('leadId');
  const urlMessageId = searchParams.get('messageId');
  
  // Flag para evitar abrir múltiples veces
  const hasOpenedFromUrl = useRef(false);
  
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
  
  // Panel de conversación
  const [showConversation, setShowConversation] = useState(false);
  const [selectedConversationLead, setSelectedConversationLead] = useState<any>(null);
  const [selectedConversationMessage, setSelectedConversationMessage] = useState<LeadMessage | null>(null);
  
  // Selección múltiple
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());

  // Composer Modal (la lógica de destinatarios vive en ComposerModal)
  const [showComposer, setShowComposer] = useState(false);
  const [composerMode, setComposerMode] = useState<'internal' | 'client'>('internal');

  // ========================================
  // 🔄 EFFECTS
  // ========================================

  useEffect(() => {
    if (viewMode === 'messages') {
      loadMessages();
      loadStats();
    }
  }, [viewMode, messageFilters.page]);

  /**
   * 🔔 Abrir conversación desde notificación (URL params)
   */
  useEffect(() => {
    const openConversationFromUrl = async () => {
      // Solo procesar si hay parámetros y no hemos abierto ya
      if (!urlLeadId || hasOpenedFromUrl.current || showConversation) return;
      
      hasOpenedFromUrl.current = true;
      
      try {
        // Cargar datos del lead
        const response = await crmService.getLead(urlLeadId);
        
        if (response.success && response.data) {
          const leadData = response.data;
          
          // Si tenemos messageId, intentar cargar ese mensaje específico
          let messageData = null;
          if (urlMessageId) {
            try {
              const msgResponse = await messageService.getMessage(urlMessageId);
              if (msgResponse.success && msgResponse.data) {
                messageData = msgResponse.data;
              }
            } catch (msgError) {
              console.warn('No se pudo cargar el mensaje específico:', msgError);
            }
          }
          
          // Abrir panel de conversación
          setSelectedConversationLead(leadData);
          setSelectedConversationMessage(messageData);
          setShowConversation(true);
          
          // Limpiar los parámetros de URL después de procesar
          setSearchParams({}, { replace: true });
        }
      } catch (error) {
        console.error('Error abriendo conversación desde URL:', error);
        hasOpenedFromUrl.current = false; // Permitir reintentar
      }
    };
    
    // Esperar a que los mensajes se carguen antes de procesar URL
    if (messages.length > 0 || !isLoadingMessages) {
      openConversationFromUrl();
    }
  }, [urlLeadId, urlMessageId, messages.length, isLoadingMessages, showConversation, setSearchParams]);

  // ========================================
  // 📩 FUNCIONES DE MENSAJES
  // ========================================

  const loadMessages = async () => {
    setIsLoadingMessages(true);
    try {
      // Filtrar para excluir notas internas de la lista principal
      // Las notas internas solo se ven dentro del panel de conversación
      const filtersWithoutInternalNotes = {
        ...messageFilters,
        // Solo mostrar mensajes de cliente y respuestas en la bandeja principal
        excluirNotasInternas: true,
      };

      // Si hay texto de búsqueda, usar searchMessages
      if (messageFilters.search && messageFilters.search.length >= 3) {
        const response = await messageService.searchMessages(filtersWithoutInternalNotes);
        if (response.success && response.data) {
          // Filtrar notas internas del resultado
          const mensajesFiltrados = (response.data.mensajes || []).filter(
            (m: any) => m.tipo !== 'nota_interna'
          );
          // Agrupar por Lead: mostrar solo el último mensaje de cada conversación
          const mensajesAgrupados = agruparMensajesPorLead(mensajesFiltrados);
          setMessages(mensajesAgrupados);
        }
      } else {
        // Si no hay búsqueda, cargar conversaciones agregadas
        // El backend agrupa por lead, excluye notas internas y pagina en servidor
        const response = await messageService.getConversations({
          page: messageFilters.page || 1,
          limit: messageFilters.limit || 50,
        });
        if (response.success && response.data) {
          setMessages(response.data.conversaciones.map((c) => c.ultimoMensaje));
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

  /**
   * 🔄 Agrupar mensajes por Lead
   * Muestra solo el mensaje más reciente de cada conversación (Lead)
   * Esto evita que aparezcan múltiples filas para el mismo Lead
   */
  const agruparMensajesPorLead = (mensajes: LeadMessage[]): LeadMessage[] => {
    const mensajesPorLead = new Map<string, LeadMessage>();
    
    // Ordenar por fecha más reciente primero
    const mensajesOrdenados = [...mensajes].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Agrupar: solo guardar el primer mensaje (más reciente) de cada Lead
    for (const mensaje of mensajesOrdenados) {
      const leadId = extractLeadId(mensaje.leadId);

      if (!mensajesPorLead.has(leadId)) {
        mensajesPorLead.set(leadId, mensaje);
      }
    }
    
    // Retornar como array ordenado por fecha
    return Array.from(mensajesPorLead.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const loadStats = async () => {
    try {
      const response = await messageService.getMessageStats();
      if (response.success && response.data) {
        const stats: MessageStats = {
          total: response.data.total || 0,
          noLeidos: response.data.noLeidos || 0,
          enviados: response.data.enviados || 0,
          respondidos: response.data.respondidos || 0,
          porTipo: response.data.porTipo || {},
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
   * 💬 Abrir panel de conversación
   */
  const handleOpenConversation = async (message: LeadMessage) => {
    try {
      // Obtener información del lead
      let leadData = null;
      
      if (typeof message.leadId === 'object' && message.leadId !== null) {
        // Ya tenemos la info del lead populada
        const leadInfo = message.leadId as any;
        leadData = {
          _id: leadInfo._id,
          nombre: leadInfo.nombre || 'Lead',
          correo: leadInfo.correo,
          estado: leadInfo.estado,
          usuarioRegistrado: leadInfo.usuarioRegistrado,
        };
      } else if (typeof message.leadId === 'string') {
        // Necesitamos cargar el lead completo
        const response = await crmService.getLead(message.leadId);
        if (response.success && response.data) {
          leadData = response.data;
        }
      }

      if (leadData) {
        setSelectedConversationLead(leadData);
        setSelectedConversationMessage(message);
        setShowConversation(true);
      } else {
        console.error('No se pudo obtener información del lead');
        alert('Error: No se pudo obtener información de la solicitud');
      }
    } catch (error) {
      console.error('Error abriendo conversación:', error);
      alert('Error al abrir la conversación');
    }
  };

  /**
   * 🔄 Cerrar panel de conversación
   */
  const handleCloseConversation = () => {
    setShowConversation(false);
    setSelectedConversationLead(null);
    setSelectedConversationMessage(null);
  };

  /**
   * 🔄 Callback optimizado cuando se envía un mensaje desde el panel de conversación
   * Solo actualiza las estadísticas y el mensaje más reciente del lead en la lista
   * SIN recargar toda la tabla de mensajes para evitar re-renders innecesarios
   */
  const handleConversationMessageSent = useCallback(async () => {
    // 1. Solo actualizar las estadísticas (ligero)
    try {
      const response = await messageService.getMessageStats();
      if (response.success && response.data) {
        setStats({
          total: response.data.total || 0,
          noLeidos: response.data.noLeidos || 0,
          enviados: response.data.enviados || 0,
          respondidos: response.data.respondidos || 0,
          porTipo: response.data.porTipo || {},
        });
      }
    } catch (error) {
      console.error('Error actualizando estadísticas:', error);
    }

    // 2. Actualizar solo el mensaje del lead actual en la lista (si existe)
    if (selectedConversationLead?._id) {
      try {
        // Obtener el último mensaje de este lead específico
        const response = await messageService.getLeadMessages(selectedConversationLead._id, {
          limit: 1,
          incluirPrivados: false,
        });
        
        if (response.success && response.data?.mensajes && response.data.mensajes.length > 0) {
          const latestMessage = response.data.mensajes[0];
          
          // Actualizar solo este mensaje en la lista existente
          setMessages(prevMessages => {
            // Buscar si ya existe un mensaje de este lead
            const leadId = selectedConversationLead._id;
            const existingIndex = prevMessages.findIndex(m => extractLeadId(m.leadId) === leadId);

            if (existingIndex >= 0) {
              // Reemplazar el mensaje existente con el más reciente
              const updatedMessages = [...prevMessages];
              updatedMessages[existingIndex] = latestMessage;
              // Re-ordenar por fecha
              return updatedMessages.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
            } else {
              // Agregar el nuevo mensaje al inicio
              return [latestMessage, ...prevMessages];
            }
          });
        }
      } catch (error) {
        console.error('Error actualizando mensaje en lista:', error);
      }
    }
  }, [selectedConversationLead?._id]);

  /**
   * Abrir composer de mensajes
   * (la carga de leads/usuarios/plantillas la maneja ComposerModal)
   */
  const handleOpenComposer = (mode: 'internal' | 'client' = 'internal') => {
    setComposerMode(mode);
    setShowComposer(true);
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
    <SmartDashboardLayout>
      <div className="w-full">
        {/* Header - 🎨 Usando gradiente dinámico del sidebar */}
        <div 
          className="rounded-2xl p-6 md:p-8 mb-8 text-white shadow-xl"
          style={{ background: headerGradient }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                <MessageCircle size={36} strokeWidth={1.5} />
                Gestión de Mensajes
              </h1>
              <p className="text-white/90 text-lg">
                Administra todos los mensajes y plantillas del sistema
              </p>
            </div>

            {/* Toggle View Mode + Nuevo Mensaje */}
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              {/* Botones de Vista - Siempre visibles */}
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => setViewMode('messages')}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                    viewMode === 'messages'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="sm:hidden"><MessageCircle size={14} strokeWidth={1.5} /></span>
                  <span className="hidden sm:flex items-center gap-1.5"><MessageCircle size={14} strokeWidth={1.5} />Mensajes</span>
                </button>
                <button
                  onClick={() => setViewMode('templates')}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                    viewMode === 'templates'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="sm:hidden"><ClipboardList size={14} strokeWidth={1.5} /></span>
                  <span className="hidden sm:flex items-center gap-1.5"><ClipboardList size={14} strokeWidth={1.5} />Plantillas</span>
                </button>
              </div>

              {/* Botones de Acción - solo visible en modo mensajes */}
              {viewMode === 'messages' && (
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <button
                    onClick={() => handleOpenComposer('client')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Send size={14} strokeWidth={1.5} />
                    <span>Mensaje a Cliente</span>
                  </button>
                  <button
                    onClick={() => handleOpenComposer('internal')}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <FileText size={14} strokeWidth={1.5} />
                    <span>Nota Interna</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          {stats && viewMode === 'messages' && (
            <div className="mt-4 sm:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 sm:p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.total}
                </div>
                <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">Total Mensajes</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-2 sm:p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">
                  {stats.noLeidos}
                </div>
                <div className="text-xs sm:text-sm text-red-700 dark:text-red-300">No Leídos</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-2 sm:p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.enviados}
                </div>
                <div className="text-xs sm:text-sm text-green-700 dark:text-green-300">Enviados</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-2 sm:p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.respondidos}
                </div>
                <div className="text-xs sm:text-sm text-purple-700 dark:text-purple-300">Respondidos</div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mb-8">
        {/* VISTA: MENSAJES */}
        {viewMode === 'messages' && (
          <div className="space-y-6">
            {/* Filtros colapsables */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <MessageFiltersComponent
                onFilterChange={handleFilterChange}
                currentFilters={messageFilters}
                compact={true}
                defaultExpanded={false}
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
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm flex items-center gap-1.5"
                  >
                    <CheckCheck size={14} strokeWidth={1.5} />Marcar como leídos
                  </button>
                  <button
                    onClick={() => setSelectedMessages(new Set())}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm flex items-center gap-1.5"
                  >
                    <X size={14} strokeWidth={1.5} />Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Tabla de Mensajes */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 size={36} strokeWidth={1.5} className="animate-spin mb-2 text-gray-400 dark:text-gray-500 mx-auto" />
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
                          className={`hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer ${
                            !message.leido ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''
                          }`}
                          onClick={() => handleOpenConversation(message)}
                        >
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
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
                                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded animate-pulse">
                                  Nuevo
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              {getMessageTypeBadge(message.tipo)}
                              {message.tipo === 'respuesta_cliente' && (
                                <MessageCircle size={14} strokeWidth={1.5} className="text-purple-600 dark:text-purple-400 flex-shrink-0" title="Respuesta del cliente" />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {/* Avatar del Lead: foto real del usuario registrado, o inicial con color */}
                              {(() => {
                                const LEAD_COLORS = [
                                  'from-blue-500 to-blue-700',
                                  'from-emerald-500 to-emerald-700',
                                  'from-violet-500 to-violet-700',
                                  'from-orange-500 to-orange-700',
                                  'from-pink-500 to-pink-700',
                                  'from-teal-500 to-teal-700',
                                  'from-amber-500 to-amber-700',
                                  'from-cyan-500 to-cyan-700',
                                ];
                                const lead = typeof message.leadId === 'object' ? message.leadId : null;
                                const leadName = lead?.nombre || 'Lead';
                                const profileImage = lead?.usuarioRegistrado?.profileImage;
                                const initial = leadName[0]?.toUpperCase() || 'L';
                                const colorClass = LEAD_COLORS[leadName.charCodeAt(0) % LEAD_COLORS.length];

                                if (profileImage) {
                                  return (
                                    <img
                                      src={profileImage}
                                      alt={leadName}
                                      className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-white dark:ring-gray-700"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                        if (fallback) fallback.style.display = 'flex';
                                      }}
                                    />
                                  );
                                }
                                return (
                                  <div className={`w-8 h-8 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                                    {initial}
                                  </div>
                                );
                              })()}
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {typeof message.leadId === 'object' && message.leadId?.nombre 
                                    ? message.leadId.nombre 
                                    : `Lead #${typeof message.leadId === 'string' 
                                        ? message.leadId.substring(0, 8) 
                                        : message.leadId?._id?.substring(0, 8) || 'N/A'}`}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {typeof message.leadId === 'object' && message.leadId?.correo 
                                    ? message.leadId.correo 
                                    : 'Ver conversación →'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 max-w-md">
                            <div className="flex items-start gap-2">
                              <span className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                                {message.tipo === 'mensaje_cliente' ? '→' : '←'}
                              </span>
                              <div>
                                <div className="text-sm text-gray-900 dark:text-white line-clamp-2">
                                  {message.contenido.substring(0, 100)}
                                  {message.contenido.length > 100 && '...'}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  {message.tipo === 'mensaje_cliente' ? 'Enviado al cliente' : 'Respuesta del cliente'}
                                </div>
                              </div>
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
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleOpenConversation(message)}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                title="Abrir conversación"
                              >
                                <MessageCircle size={16} strokeWidth={1.5} />
                              </button>
                              {!message.leido && (
                                <button
                                  onClick={() => handleMarkAsRead(message._id)}
                                  className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-1.5 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                  title="Marcar como leído"
                                >
                                  <CheckCheck size={16} strokeWidth={1.5} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteMessage(message._id)}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 size={16} strokeWidth={1.5} />
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
                  <MessageCircle size={48} strokeWidth={1.5} className="mx-auto mb-2 text-gray-400 dark:text-gray-500" />
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
        {viewMode === 'templates' && <TemplatesView />}
      </div>

      {/* Modal: Message Composer */}
      {showComposer && (
        <ComposerModal
          mode={composerMode}
          onClose={() => setShowComposer(false)}
          onMessageSent={() => {
            loadMessages();
            loadStats();
          }}
        />
      )}

      {/* Panel: Conversación */}
      {showConversation && selectedConversationLead && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/30 z-40"
            onClick={handleCloseConversation}
          />
          {/* Panel */}
          <ConversationPanel
            lead={selectedConversationLead}
            initialMessage={selectedConversationMessage || undefined}
            onClose={handleCloseConversation}
            onMessageSent={handleConversationMessageSent}
          />
        </>
      )}
      </div>
    </SmartDashboardLayout>
  );
};

export default CrmMessages;
