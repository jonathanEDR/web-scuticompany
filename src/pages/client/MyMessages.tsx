/**
 * 💬 MIS MENSAJES - Inbox de Mensajes del Cliente
 * Vista de todos los mensajes públicos del cliente
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
import { checkIfNeedsOnboarding, executeWelcomeOnboarding } from '../../services/onboardingService';

export default function MyMessages() {
  const navigate = useNavigate();
  const { user: clerkUser } = useUser();

  // ========================================
  // 📊 STATE
  // ========================================
  const [messages, setMessages] = useState<LeadMessage[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<LeadMessage[]>([]);
  const [selectedLead, setSelectedLead] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<LeadMessage | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false);
  const [onboardingMessage, setOnboardingMessage] = useState<string | null>(null);

  // ========================================
  // 🔄 EFFECTS
  // ========================================
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [messages, selectedLead]);

  // ========================================
  // 🎉 FUNCIÓN DE ONBOARDING
  // ========================================
  
  const checkAndExecuteOnboarding = async () => {
    if (!clerkUser) return;
    
    setIsCheckingOnboarding(true);
    
    try {
      console.log('🔍 Verificando si necesita onboarding...');
      
      // Verificar si necesita onboarding
      const checkResult = await checkIfNeedsOnboarding();
      
      if (checkResult.needsOnboarding) {
        console.log('🎉 Ejecutando onboarding de bienvenida...');
        setOnboardingMessage('¡Configurando tu cuenta por primera vez! 🎉');
        
        const userInfo = {
          clerkId: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || ''
        };
        
        const result = await executeWelcomeOnboarding(userInfo);
        
        if (result.success) {
          console.log('✅ Onboarding completado exitosamente');
          setOnboardingMessage('¡Cuenta configurada! Te hemos enviado un mensaje de bienvenida 📩');
          
          // Limpiar mensaje después de unos segundos
          setTimeout(() => setOnboardingMessage(null), 5000);
        } else {
          console.error('❌ Error en onboarding:', result.error);
        }
      } else {
        console.log('ℹ️ Usuario no necesita onboarding:', checkResult.reason);
      }
    } catch (error) {
      console.error('❌ Error verificando onboarding:', error);
    } finally {
      setIsCheckingOnboarding(false);
    }
  };

  // ========================================
  // 📊 FUNCIONES DE CARGA
  // ========================================

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 🎉 VERIFICAR Y EJECUTAR ONBOARDING SI ES NECESARIO
      await checkAndExecuteOnboarding();

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
            incluirPrivados: false, // Solo mensajes públicos
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

    setFilteredMessages(result);
  };

  // Aplicar guard de seguridad adicional para filtrar mensajes privados
  const secureFilteredMessages = useFilterPrivateMessages(filteredMessages);

  // ========================================
  // 📨 ACCIONES DE MENSAJES
  // ========================================

  const handleReply = async () => {
    if (!selectedMessage || !replyContent.trim()) return;

    setIsSending(true);
    try {
      await messageService.replyMessage({
        messageId: selectedMessage._id,
        contenido: replyContent.trim(),
        esPrivado: false, // Las respuestas de clientes siempre son públicas
      });

      // Recargar mensajes
      await loadData();

      // Limpiar y cerrar
      setReplyContent('');
      setSelectedMessage(null);
    } catch (err: any) {
      console.error('Error enviando respuesta:', err);
      alert('Error al enviar la respuesta. Por favor intenta de nuevo.');
    } finally {
      setIsSending(false);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await messageService.markAsRead(messageId);
      
      // Actualizar estado local
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

  const getTipoMensajeBadge = (tipo: string): string => {
    const badges: Record<string, string> = {
      nota_interna: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      mensaje_cliente: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      respuesta_cliente: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      email: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      sms: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      notificacion: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    };
    return badges[tipo] || 'bg-gray-100 text-gray-800';
  };

  const getTipoMensajeLabel = (tipo: string): string => {
    const labels: Record<string, string> = {
      nota_interna: 'Nota Interna',
      mensaje_cliente: 'Mensaje',
      respuesta_cliente: 'Respuesta',
      email: 'Email',
      sms: 'SMS',
      notificacion: 'Notificación',
    };
    return labels[tipo] || tipo;
  };

  // ========================================
  // 🎨 RENDER
  // ========================================

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando mensajes...</p>
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
            onClick={loadData}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.leido).length;

  return (
    <SmartDashboardLayout>
      <div className="w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 dark:from-green-700 dark:via-blue-700 dark:to-purple-700 rounded-2xl p-6 md:p-8 mb-8 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                <span className="text-4xl">💬</span>
                Mis Mensajes
              </h1>
              <p className="text-green-100 dark:text-blue-100 text-lg">
                {filteredMessages.length} {filteredMessages.length === 1 ? 'mensaje' : 'mensajes'}
                {unreadCount > 0 && ` • ${unreadCount} sin leer`}
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/client')}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-all text-white border border-white/30"
            >
              ← Volver al Portal
            </button>
          </div>
        </div>

          {/* Filtro por Lead */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📊 Filtrar por Proyecto
            </label>
            <select
              value={selectedLead}
              onChange={(e) => setSelectedLead(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todos los proyectos</option>
              {leads.map((lead) => (
                <option key={lead._id} value={lead._id}>
                  {lead.nombre} ({lead.tipoServicio})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notificación de Onboarding */}
        {onboardingMessage && (
          <div className="mb-6 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {isCheckingOnboarding ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  ) : (
                    <div className="text-2xl">🎉</div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    {onboardingMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}



        {/* Lista de Mensajes */}
        {secureFilteredMessages.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No hay mensajes
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedLead !== 'all'
                ? 'No hay mensajes en este proyecto'
                : 'Los mensajes del equipo aparecerán aquí'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {secureFilteredMessages.map((message) => (
              <div
                key={message._id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all ${
                  !message.leido ? 'border-l-4 border-green-500' : ''
                }`}
              >
                <div className="p-6">
                  {/* Header del Mensaje */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white text-lg font-bold">
                        {message.autor.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {message.autor.nombre}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getTipoMensajeBadge(message.tipo)}`}>
                            {getTipoMensajeLabel(message.tipo)}
                          </span>
                          {!message.leido && (
                            <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full font-semibold">
                              NUEVO
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <span>📊 {getLeadName(message.leadId)}</span>
                          <span>📅 {new Date(message.createdAt).toLocaleDateString()}</span>
                          <span>🕐 {new Date(message.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Asunto */}
                  {message.asunto && (
                    <div className="mb-3">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {message.asunto}
                      </h4>
                    </div>
                  )}

                  {/* Contenido */}
                  <div className="prose dark:prose-invert max-w-none mb-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {message.contenido}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {!message.leido && (
                      <button
                        onClick={() => handleMarkAsRead(message._id)}
                        className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        ✓ Marcar como leído
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedMessage(message)}
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      ↩️ Responder
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/client/lead/${message.leadId}`)}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      📊 Ver Proyecto
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Respuesta */}
        {selectedMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header del Modal */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  ↩️ Responder Mensaje
                </h2>
                <button
                  onClick={() => {
                    setSelectedMessage(null);
                    setReplyContent('');
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mensaje Original (Quote) */}
              <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border-l-4 border-green-500">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {selectedMessage.autor.nombre}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(selectedMessage.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {selectedMessage.asunto && (
                  <div className="font-medium text-gray-900 dark:text-white mb-2">
                    {selectedMessage.asunto}
                  </div>
                )}
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {selectedMessage.contenido}
                </p>
              </div>

              {/* Editor de Respuesta */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tu Respuesta
                </label>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white resize-none"
                />
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {replyContent.length} / 10,000 caracteres
                  </span>
                  {replyContent.length > 10000 && (
                    <span className="text-red-600">
                      Excede el límite de caracteres
                    </span>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedMessage(null);
                    setReplyContent('');
                  }}
                  disabled={isSending}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReply}
                  disabled={isSending || !replyContent.trim() || replyContent.length > 10000}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Enviando...
                    </span>
                  ) : (
                    '✉️ Enviar Respuesta'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        )}
    </SmartDashboardLayout>
  );
}
