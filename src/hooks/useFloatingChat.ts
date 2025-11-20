/**
 * useFloatingChat Hook
 * Hook personalizado para gestionar el estado del chat flotante
 * 
 * Características:
 * - Gestión de mensajes en memoria
 * - Conexión con el backend (GerenteGeneral)
 * - Estados de loading
 * - Notificaciones de mensajes nuevos
 * - Sesión única persistente
 */

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import salesChatService from '../services/salesChatService';
import type { ChatMessage } from '../types/scutiAI.types';

export const useFloatingChat = () => {
  const { userId } = useAuth();

  // ============================================
  // ESTADO
  // ============================================

  // UI
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Mensajes
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Notificaciones
  const [unreadCount, setUnreadCount] = useState(0);

  // Sesión
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Sistema
  const [systemStatus, setSystemStatus] = useState<string>('operational');

  // ============================================
  // EFECTOS
  // ============================================

  // Crear sesión al montar (funciona para usuarios autenticados y anónimos)
  useEffect(() => {
    if (!sessionId) {
      // 🆕 Generar sessionId único (con o sin userId)
      const identifier = userId || 'anonymous';
      const newSessionId = `floating-chat-${identifier}-${Date.now()}`;
      setSessionId(newSessionId);
      console.log('✅ Floating chat session created:', newSessionId, `(${userId ? 'authenticated' : 'anonymous'})`);
    }
  }, [sessionId, userId]);

  // Incrementar unread cuando llega un mensaje del asistente y el chat está cerrado
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages, isOpen]);

  // Resetear unread cuando se abre el chat
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  // ============================================
  // ACCIONES
  // ============================================

  /**
   * Abrir/cerrar chat
   */
  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  /**
   * Cerrar chat
   */
  const closeChat = useCallback(() => {
    setIsOpen(false);
    setIsExpanded(false);
  }, []);

  /**
   * Expandir/contraer ventana
   */
  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  /**
   * Enviar mensaje
   */
  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim()) {
      console.warn('⚠️ Mensaje vacío');
      return;
    }

    if (!sessionId) {
      console.error('❌ No sessionId available');
      return;
    }

    // 🆕 Permitir mensajes sin userId (usuarios anónimos)
    const userIdentifier = userId || 'anonymous';
    console.log(`📤 Sending message as: ${userIdentifier}`);

    setLoading(true);

    try {
      // Crear mensaje del usuario
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: messageText,
        timestamp: new Date()
      };

      // Agregar mensaje del usuario inmediatamente
      setMessages(prev => [...prev, userMessage]);

      console.log('📤 Sending message to Asesor de Ventas SCUTI:', messageText);

      // Enviar directamente al Asesor de Ventas SCUTI (con userId opcional)
      const result = await salesChatService.sendMessage(
        messageText,
        sessionId,
        { userId: userIdentifier }
      );

      if (result.success && result.data) {
        // Agregar respuesta del asistente
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: result.data.response || 'Sin respuesta',
          timestamp: new Date(),
          agentUsed: result.data.agent || 'GerenteGeneral',
          metadata: result.data.metadata
        };

        setMessages(prev => [...prev, assistantMessage]);
        console.log('✅ Response received from:', result.data.agent);

        // Actualizar estado del sistema (siempre operational si hay respuesta exitosa)
        setSystemStatus('operational');
      } else {
        throw new Error(result.error || 'Error al enviar mensaje');
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);

      // Agregar mensaje de error
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor, intenta nuevamente.',
        timestamp: new Date(),
        agentUsed: 'System'
      };

      setMessages(prev => [...prev, errorMessage]);
      setSystemStatus('error');
    } finally {
      setLoading(false);
    }
  }, [userId, sessionId]);

  /**
   * Limpiar conversación
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    console.log('🧹 Messages cleared');
  }, []);

  /**
   * Reiniciar sesión
   */
  const resetSession = useCallback(() => {
    const identifier = userId || 'anonymous';
    const newSessionId = `floating-chat-${identifier}-${Date.now()}`;
    setSessionId(newSessionId);
    setMessages([]);
    setUnreadCount(0);
    console.log('🔄 Session reset:', newSessionId, `(${userId ? 'authenticated' : 'anonymous'})`);
  }, [userId]);

  // ============================================
  // RETORNO
  // ============================================

  return {
    // Estado UI
    isOpen,
    isExpanded,
    
    // Mensajes
    messages,
    loading,
    
    // Notificaciones
    unreadCount,
    
    // Sistema
    systemStatus,
    sessionId,
    
    // Acciones
    toggleChat,
    closeChat,
    toggleExpand,
    sendMessage,
    clearMessages,
    resetSession
  };
};

export default useFloatingChat;
