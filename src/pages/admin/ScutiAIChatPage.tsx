/**
 * SCUTI AI Chat Page
 * Página principal del chatbot inteligente
 * 
 * Esta es la interfaz principal de SCUTI AI que permite a los usuarios
 * interactuar con el GerenteGeneral de forma conversacional.
 * 
 * Features:
 * - Chat en tiempo real con GerenteGeneral
 * - Gestión de múltiples conversaciones
 * - Routing inteligente automático
 * - Historial persistente
 * - Responsive design
 */

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import SmartDashboardLayout from '../../components/SmartDashboardLayout';
import { useScutiAI } from '../../hooks/useScutiAI';
import SessionList from '../../components/scuti-ai/SessionList';
import ChatHeader from '../../components/scuti-ai/ChatHeader';
import MessageBubble from '../../components/scuti-ai/MessageBubble';
import ChatInput from '../../components/scuti-ai/ChatInput';
import CanvasEditor from '../../components/scuti-ai/CanvasEditor';
import CategoryQuickActions from '../../components/scuti-ai/CategoryQuickActions';
import EventDetailModal from '../../components/agenda/EventDetailModal';
import type { CategoryType } from '../../types/scuti-ai';
import { 
  AlertCircle, 
  Loader2, 
  Sparkles
} from 'lucide-react';

const ScutiAIChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Estado para categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  
  // Estado para panel colapsado
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Estado para modal de eventos
  const [showEventDetailModal, setShowEventDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const {
    // Estado
    sessions,
    activeSession,
    messages,
    systemStatus,
    error,

    // Canvas
    canvasVisible,
    canvasExpanded,
    canvasMode,
    canvasContent,

    // Loading states
    loadingSessions,
    loadingMessages,
    sending,

    // Acciones
    selectSession,
    createNewSession,
    sendMessage,
    completeSession,
    loadSystemStatus,
    clearError,

    // Canvas actions
    hideCanvas,
    toggleCanvasExpand,
    showCanvas: _showCanvas // No usado directamente, el canvas se abre automáticamente
  } = useScutiAI();

  // Cargar estado del sistema al montar
  useEffect(() => {
    loadSystemStatus();
  }, [loadSystemStatus]);

  // Auto-scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Listener para opciones seleccionadas en el Canvas
  useEffect(() => {
    const handleOptionSelected = (event: Event) => {
      const customEvent = event as CustomEvent<{ value: string }>;
      const optionValue = customEvent.detail.value;
      
      console.log('🎯 Opción seleccionada:', optionValue);
      
      // Enviar el valor de la opción como mensaje
      sendMessage(optionValue);
    };

    window.addEventListener('scuti-ai-option-selected', handleOptionSelected);

    return () => {
      window.removeEventListener('scuti-ai-option-selected', handleOptionSelected);
    };
  }, [sendMessage]);

  // Handlers
  const handleSendMessage = (messageText: string) => {
    sendMessage(messageText);
    // Resetear categoría al enviar mensaje
    setSelectedCategory(null);
  };

  // Handlers de navegación de categorías
  const handleCategorySelect = (category: CategoryType) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handleCategoryActionClick = (prompt: string) => {
    sendMessage(prompt);
    setSelectedCategory(null);
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleExport = () => {
    if (!activeSession || messages.length === 0) return;

    // Crear contenido de exportación
    const content = messages
      .map(msg => `[${msg.role}] ${msg.content}`)
      .join('\n\n');

    // Crear blob y descargar
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scuti-ai-chat-${activeSession.sessionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearConversation = () => {
    if (!activeSession) return;

    if (window.confirm('¿Estás seguro de que quieres eliminar esta conversación?')) {
      completeSession(activeSession.sessionId);
      createNewSession();
    }
  };

  const handleSettings = () => {
    navigate('/dashboard/agents');
  };

  // Handler para cuando se hace click en un item del canvas
  const handleCanvasItemClick = async (itemId: string, itemTitle?: string) => {
    // Si es un evento, cargar y mostrar el modal de detalles
    if (canvasContent?.type === 'event_list') {
      try {
        const token = await getToken();
        const response = await fetch(`http://localhost:5000/api/events/${itemId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setSelectedEvent(data.data);
          setShowEventDetailModal(true);
        } else {
          console.error('Error cargando evento:', response.status);
        }
      } catch (error) {
        console.error('Error al cargar evento:', error);
      }
      return;
    }
    
    // Si es un blog, enviar comando automático para verlo
    if (itemTitle) {
      sendMessage(`ver blog: ${itemTitle} (id: ${itemId})`);
    } else {
      sendMessage(`ver blog id: ${itemId}`);
    }
  };

  // Handler para cuando se hace click en editar blog
  const handleEditBlog = (blogId: string) => {
    // Navegar a la página de edición de blog
    navigate(`/dashboard/blog/posts/${blogId}/edit`);
  };

  return (
    <SmartDashboardLayout>
      <div className="flex h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-950">
        {/* Sidebar - Lista de conversaciones compacta y colapsable */}
        <div className={`flex-shrink-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'w-14' : 'w-64'
        }`}>
          <SessionList
            sessions={sessions}
            activeSession={activeSession}
            onSelectSession={selectSession}
            onNewSession={createNewSession}
            loading={loadingSessions}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={handleToggleSidebar}
          />
        </div>

        {/* Área principal de chat */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <ChatHeader
            session={activeSession}
            systemStatus={systemStatus}
            onExport={handleExport}
            onClear={handleClearConversation}
            onSettings={handleSettings}
          />

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
              {/* Estado vacío - Mostrar categorías o acciones contextuales */}
              {messages.length === 0 && !loadingMessages && (
                <>
                  {selectedCategory ? (
                    // Vista de acciones rápidas contextuales
                    <CategoryQuickActions
                      category={selectedCategory}
                      onBack={handleBackToCategories}
                      onActionClick={handleCategoryActionClick}
                      disabled={sending}
                    />
                  ) : (
                    // Vista inicial con tarjetas de categorías - COMPACTO
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                        <Sparkles size={32} className="text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        ¡Hola! Soy SCUTI AI
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mb-4">
                        Selecciona una categoría para comenzar:
                      </p>
                      <div className="grid grid-cols-2 gap-3 max-w-xl">
                        <button
                          onClick={() => handleCategorySelect('blog')}
                          className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-left hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all transform hover:scale-105 hover:shadow-md border border-transparent hover:border-blue-300 dark:hover:border-blue-700"
                        >
                          <div className="text-xl mb-1">📝</div>
                          <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-0.5">
                            Contenido & Blog
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Crear y optimizar artículos
                          </p>
                        </button>
                        <button
                          onClick={() => handleCategorySelect('servicios')}
                          className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all transform hover:scale-105 hover:shadow-md border border-transparent hover:border-purple-300 dark:hover:border-purple-700"
                        >
                          <div className="text-xl mb-1">💼</div>
                          <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-0.5">
                            Servicios
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Analizar y gestionar portafolio
                          </p>
                        </button>
                        <button
                          onClick={() => handleCategorySelect('seo')}
                          className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-left hover:bg-green-100 dark:hover:bg-green-900/30 transition-all transform hover:scale-105 hover:shadow-md border border-transparent hover:border-green-300 dark:hover:border-green-700"
                        >
                          <div className="text-xl mb-1">🔍</div>
                          <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-0.5">
                            SEO
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Optimización y análisis
                          </p>
                        </button>
                        <button
                          onClick={() => handleCategorySelect('agenda')}
                          className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg text-left hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-all transform hover:scale-105 hover:shadow-md border border-transparent hover:border-pink-300 dark:hover:border-pink-700"
                        >
                          <div className="text-xl mb-1">📅</div>
                          <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-0.5">
                            Agenda
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Gestionar eventos y reuniones
                          </p>
                        </button>
                      </div>
                      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                        ¿En qué puedo ayudarte hoy?
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Loading inicial */}
              {loadingMessages && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={32} className="animate-spin text-blue-600" />
                </div>
              )}

              {/* Mensajes */}
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isLatest={index === messages.length - 1}
                />
              ))}

              {/* Typing indicator */}
              {sending && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <span className="text-sm">🤖</span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900 dark:text-red-100">
                      Error al procesar mensaje
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                  </div>
                  <button
                    onClick={clearError}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <ChatInput
            onSend={handleSendMessage}
            disabled={!activeSession}
            loading={sending}
            selectedCategory={selectedCategory}
          />
        </div>

        {/* Canvas Editor */}
        <CanvasEditor
          isVisible={canvasVisible}
          isExpanded={canvasExpanded}
          mode={canvasMode}
          content={canvasContent}
          onClose={hideCanvas}
          onToggleExpand={toggleCanvasExpand}
          onItemClick={handleCanvasItemClick}
          onEditClick={handleEditBlog}
        />

        {/* Event Detail Modal */}
        {selectedEvent && (
          <EventDetailModal
            show={showEventDetailModal}
            event={selectedEvent}
            onClose={() => {
              setShowEventDetailModal(false);
              setSelectedEvent(null);
            }}
            onEdit={undefined}
            onDelete={undefined}
            onStatusChange={undefined}
            isLoading={false}
          />
        )}
      </div>
    </SmartDashboardLayout>
  );
};

export default ScutiAIChatPage;
