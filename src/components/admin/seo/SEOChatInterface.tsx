/**
 * 💬 SEO Chat Interface
 * Interface de chat para interacción con el SEO Agent
 * Solo disponible para Admin Dashboard
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useSEOCanvasContext } from '../../../contexts/SEOCanvasContext';

const SEOChatInterface: React.FC = () => {
  const {
    chatHistory,
    isLoading,
    sendChatMessage,
    clearChatHistory,
    activeMode
  } = useSEOCanvasContext();

  const [message, setMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll al final del chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Auto-resize del textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;

    const messageToSend = message.trim();
    setMessage('');
    
    await sendChatMessage(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // Comandos sugeridos según el modo
  const getSuggestedCommands = () => {
    switch (activeMode) {
      case 'analysis':
        return [
          'Analiza el SEO de este contenido',
          'Qué palabras clave recomendarías?',
          'Cómo puedo mejorar la legibilidad?'
        ];
      case 'structure':
        return [
          'Genera una estructura para un artículo sobre...',
          'Qué secciones debería incluir?',
          'Cómo organizar el contenido para SEO?'
        ];
      case 'review':
        return [
          'Revisa el SEO completo de este post',
          'Qué errores detectas?',
          'Dame una checklist de optimización'
        ];
      default:
        return [
          'Hola, ayúdame con el SEO de mi contenido',
          'Qué puedes hacer por mí?',
          'Analiza este texto'
        ];
    }
  };

  const suggestedCommands = getSuggestedCommands();

  return (
    <div className="flex flex-col h-full">
      {/* Header del chat */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-gray-900">SEO Assistant</span>
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            )}
          </div>
          
          {chatHistory.length > 0 && (
            <button
              onClick={clearChatHistory}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Limpiar chat
            </button>
          )}
        </div>
      </div>

      {/* Mensajes del chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 && (
          <div className="text-center py-8">
            <Bot className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              ¡Hola! Soy tu asistente SEO. ¿En qué puedo ayudarte hoy?
            </p>
            
            {/* Comandos sugeridos */}
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Comandos sugeridos:</p>
              {suggestedCommands.map((command, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(command)}
                  className="block w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {command}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[80%] rounded-lg px-4 py-2 
                ${chat.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
                }
              `}
            >
              <div className="flex items-start space-x-2">
                {chat.role === 'assistant' && (
                  <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                )}
                {chat.role === 'user' && (
                  <User className="h-4 w-4 mt-1 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">{chat.content}</p>
                  <p className={`text-xs mt-1 ${
                    chat.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {new Date(chat.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div ref={chatEndRef} />
      </div>

      {/* Input del chat */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje... (Enter para enviar, Shift+Enter para nueva línea)"
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SEOChatInterface;