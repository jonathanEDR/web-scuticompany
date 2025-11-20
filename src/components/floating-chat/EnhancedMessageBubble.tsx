/**
 * Enhanced MessageBubble Component  
 * Versión mejorada que puede modificar su contenido dinámicamente
 * Para unificar listas de texto con botones interactivos
 */

import React, { useState } from 'react';
import { User, Copy, CheckCircle } from 'lucide-react';
import type { ChatMessage } from '../../types/scutiAI.types';
import InteractiveButtons from '../floating-chat/InteractiveButtons';

interface EnhancedMessageBubbleProps {
  message: ChatMessage;
  isLatest?: boolean;
  onInteractiveClick?: (message: string) => void;
}

export const EnhancedMessageBubble: React.FC<EnhancedMessageBubbleProps> = ({ 
  message, 
  onInteractiveClick 
}) => {
  const [displayContent, setDisplayContent] = useState(message.content);
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(displayContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContentReplace = (newContent: string) => {
    setDisplayContent(newContent);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAgentIcon = (agent?: string) => {
    if (!agent) return '🤖';
    if (agent === 'MULTI_AGENT') return '🔄';
    if (agent.toLowerCase().includes('blog')) return '📝';
    if (agent.toLowerCase().includes('seo')) return '🔍';
    if (agent.toLowerCase().includes('services')) return '💼';
    return '🤖';
  };

  const getAgentColor = (agent?: string) => {
    if (!agent) return 'purple';
    if (agent === 'MULTI_AGENT') return 'indigo';
    if (agent.toLowerCase().includes('blog')) return 'blue';
    if (agent.toLowerCase().includes('seo')) return 'green';
    if (agent.toLowerCase().includes('services')) return 'orange';
    return 'purple';
  };

  return (
    <div className={`flex gap-3 group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div 
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${
          isUser 
            ? 'bg-blue-600 dark:bg-blue-500' 
            : `bg-${getAgentColor(message.agentUsed)}-600 dark:bg-${getAgentColor(message.agentUsed)}-500`
        }`}
      >
        {isUser ? <User size={16} /> : <span className="text-sm">{getAgentIcon(message.agentUsed)}</span>}
      </div>

      {/* Mensaje */}
      <div className={`flex flex-col gap-1 max-w-2xl ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Bubble */}
        <div
          className={`relative group rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm'
          }`}
        >
          {/* Contenido del mensaje - usando displayContent */}
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="mb-0 whitespace-pre-wrap break-words">{displayContent}</p>
          </div>

          {/* Botón copiar (aparece en hover) */}
          <button
            onClick={handleCopy}
            className={`absolute -top-2 ${
              isUser ? '-left-2' : '-right-2'
            } opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-700 rounded-full p-1.5 shadow-lg hover:scale-110 transform`}
            title="Copiar mensaje"
          >
            {copied ? (
              <CheckCircle size={14} className="text-green-600" />
            ) : (
              <Copy size={14} className="text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* 🆕 Botones Interactivos - Solo para mensajes del asistente */}
        {!isUser && onInteractiveClick && (
          <InteractiveButtons 
            message={message}
            onButtonClick={onInteractiveClick}
            onReplaceContent={handleContentReplace}
          />
        )}

        {/* Metadata */}
        <div className={`flex items-center gap-2 text-xs ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Timestamp */}
          <span className="text-gray-500 dark:text-gray-400">
            {formatTime(message.timestamp)}
          </span>

          {/* Agente usado */}
          {!isUser && message.agentUsed && (
            <>
              <span className="text-gray-400">•</span>
              <span
                className={`px-2 py-0.5 rounded-full text-${getAgentColor(
                  message.agentUsed
                )}-600 dark:text-${getAgentColor(
                  message.agentUsed
                )}-400 bg-${getAgentColor(
                  message.agentUsed
                )}-50 dark:bg-${getAgentColor(message.agentUsed)}-900/30 font-medium`}
              >
                {message.agentUsed}
              </span>
            </>
          )}

          {/* Coordinación multi-agente */}
          {!isUser && message.metadata?.agentsInvolved && message.metadata.agentsInvolved.length > 1 && (
            <>
              <span className="text-gray-400">•</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                🔄 {message.metadata.agentsInvolved.length} agentes
              </span>
            </>
          )}

          {/* Tiempo de respuesta */}
          {!isUser && message.metadata?.responseTime && (
            <>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">
                {(message.metadata.responseTime / 1000).toFixed(1)}s
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedMessageBubble;