/**
 * 💬 MIS MENSAJES - Inbox de Mensajes del Cliente (Versión Mejorada)
 * Vista de lista compacta con detalle al hacer clic
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import SmartDashboardLayout from '../../components/SmartDashboardLayout';
import type { LeadMessage } from '../../types/message.types';
import type { Lead } from '../../services/crmService';
import { messageService } from '../../services/messageService';
import { crmService } from '../../services/crmService';
import { useFilterPrivateMessages } from '../../components/guards/PrivateMessageGuard';
// import { checkIfNeedsOnboarding, executeWelcomeOnboarding } from '../../services/onboardingService';
import { Mail, MailOpen, Reply, X, Send, Loader, Filter, Inbox, Search } from 'lucide-react';

export default function MyMessages() {
  const navigate = useNavigate();
  const { user: _clerkUser } = useUser();

  // ========================================
  // 📊 STATE
  // ========================================
  const [messages, setMessages] = useState<LeadMessage[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<LeadMessage[]>([]);
  const [selectedLead, setSelectedLead] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<LeadMessage | null>(null);
  const [showMessageDetail, setShowMessageDetail] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // ========================================
  // 🔄 EFFECTS
  // ========================================
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [messages, selectedLead, searchTerm]);

  // ========================================
  // 📊 FUNCIONES DE CARGA
  // ========================================

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Cargar leads del cliente
      const leadsResponse = await crmService.getClientLeads();
      const clientLeads = leadsResponse.data?.leads || [];
      setLeads(clientLeads);

      // Cargar mensajes de todos los leads
      const allMessages: LeadMessage[] = [];
      for (const lead of clientLeads) {
        try {
          const messagesResponse = await messageService.getLeadMessages(lead._id, {
            limit: 100,
            incluirPrivados: false,
          });
          const leadMessages = messagesResponse.data?.mensajes || [];
          allMessages.push(...leadMessages);
        } catch (err) {
          console.warn(`No se pudieron cargar mensajes del lead ${lead._id}`);
        }
      }

      // Ordenar por fecha (más reciente primero)
      allMessages.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setMessages(allMessages);
    } catch (err: any) {
      console.error('Error cargando datos:', err);
      setError(err.message || 'Error al cargar los mensajes');
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================
  // 🎯 FILTROS
  // ========================================

  const applyFilters = () => {
    let result = [...messages];

    // Filtro por lead
    if (selectedLead !== 'all') {
      result = result.filter((msg) => msg.leadId === selectedLead);
    }

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((msg) =>
        msg.contenido.toLowerCase().includes(term) ||
        msg.asunto?.toLowerCase().includes(term) ||
        msg.autor.nombre.toLowerCase().includes(term)
      );
    }

    setFilteredMessages(result);
  };

  const secureFilteredMessages = useFilterPrivateMessages(filteredMessages);

  // ========================================
  // 📨 ACCIONES DE MENSAJES
  // ========================================

  const handleMessageClick = async (message: LeadMessage) => {
    setSelectedMessage(message);
    setShowMessageDetail(true);
    
    // Marcar como leído si no lo está
    if (!message.leido) {
      await handleMarkAsRead(message._id);
    }
  };

  const handleCloseDetail = () => {
    setShowMessageDetail(false);
    setSelectedMessage(null);
    setReplyContent('');
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyContent.trim()) return;

    setIsSending(true);
    try {
      await messageService.replyMessage({
        messageId: selectedMessage._id,
        contenido: replyContent.trim(),
        esPrivado: false,
      });

      await loadData();
      handleCloseDetail();
    } catch (err: any) {
      console.error('Error enviando respuesta:', err);
      alert('Error al enviar la respuesta');
    } finally {
      setIsSending(false);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await messageService.markAsRead(messageId);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, leido: true } : msg
        )
      );
    } catch (err) {
      console.error('Error marcando como leído:', err);
    }
  };

  // ========================================
  // 🎨 HELPERS
  // ========================================

  const getLeadName = (leadId: string): string => {
    const lead = leads.find((l) => l._id === leadId);
    return lead ? lead.nombre : 'Proyecto Desconocido';
  };

  const getMessagePreview = (content: string, maxLength: number = 100): string => {
    const cleaned = content.replace(/\n/g, ' ').trim();
    if (cleaned.length <= maxLength) return cleaned;
    return cleaned.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `Hace ${minutes} min`;
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Ayer';
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('es-ES', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    }
  };

  const unreadCount = messages.filter((m) => !m.leido).length;

  // ========================================
  // 🎨 RENDER
  // ========================================

  if (isLoading) {
    return (
      <SmartDashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-green-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">Cargando mensajes...</p>
          </div>
        </div>
      </SmartDashboardLayout>
    );
  }

  if (error) {
    return (
      <SmartDashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error al Cargar</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={loadData}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              🔄 Reintentar
            </button>
          </div>
        </div>
      </SmartDashboardLayout>
    );
  }

  return (
    <SmartDashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl p-8 mb-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Inbox className="w-10 h-10" />
                Mis Mensajes
              </h1>
              <p className="text-green-100 text-lg">
                {filteredMessages.length} {filteredMessages.length === 1 ? 'mensaje' : 'mensajes'}
                {unreadCount > 0 && ` • ${unreadCount} sin leer`}
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/client')}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-all border border-white/30"
            >
              ← Volver
            </button>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar mensajes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Filtro por proyecto */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedLead}
                onChange={(e) => setSelectedLead(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Todos los proyectos</option>
                {leads.map((lead) => (
                  <option key={lead._id} value={lead._id}>
                    {lead.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Mensajes */}
        {secureFilteredMessages.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <Inbox className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No hay mensajes
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? 'No se encontraron mensajes con ese criterio' : 'Los mensajes del equipo aparecerán aquí'}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {secureFilteredMessages.map((message) => (
                <div
                  key={message._id}
                  onClick={() => handleMessageClick(message)}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                    !message.leido ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white text-lg font-bold">
                        {message.autor.nombre.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${!message.leido ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                            {message.autor.nombre}
                          </h3>
                          {!message.leido && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          📊 {getLeadName(message.leadId)}
                        </span>
                      </div>

                      {message.asunto && (
                        <h4 className={`text-sm mb-1 ${!message.leido ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                          {message.asunto}
                        </h4>
                      )}

                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {getMessagePreview(message.contenido)}
                      </p>
                    </div>

                    {/* Icono de estado */}
                    <div className="flex-shrink-0">
                      {message.leido ? (
                        <MailOpen className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Mail className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal de Detalle del Mensaje */}
        {showMessageDetail && selectedMessage && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              
              {/* Header del Modal */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white text-lg font-bold">
                    {selectedMessage.autor.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedMessage.autor.nombre}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedMessage.autor.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseDetail}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Contenido del Mensaje */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Metadata */}
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <span>📊 {getLeadName(selectedMessage.leadId)}</span>
                  <span>•</span>
                  <span>{new Date(selectedMessage.createdAt).toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                  <span>•</span>
                  <span>{new Date(selectedMessage.createdAt).toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</span>
                </div>

                {/* Asunto */}
                {selectedMessage.asunto && (
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {selectedMessage.asunto}
                  </h3>
                )}

                {/* Contenido */}
                <div className="prose dark:prose-invert max-w-none">
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.contenido}
                  </div>
                </div>
              </div>

              {/* Footer con Respuesta */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Reply className="w-4 h-4 inline mr-2" />
                    Tu Respuesta
                  </label>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white resize-none"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={handleCloseDetail}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={handleReply}
                    disabled={!replyContent.trim() || isSending}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSending ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Enviar Respuesta
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SmartDashboardLayout>
  );
}
