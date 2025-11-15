/**
 * MessageBubble Component
 * Componente para renderizar un mensaje individual del chat
 * 
 * Features:
 * - Diseño diferenciado para user/assistant
 * - Soporte para Markdown
 * - Muestra agente que respondió
 * - Timestamps
 * - Animaciones suaves
 */

import React from 'react';
import { User, Copy, CheckCircle } from 'lucide-react';
import type { ChatMessage } from '../../types/scutiAI.types';

interface MessageBubbleProps {
  message: ChatMessage;
  isLatest?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLatest }) => {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    if (agent.toLowerCase().includes('services')) return 'pink';
    return 'purple';
  };

  return (
    <div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} ${
        isLatest ? 'animate-fadeIn' : ''
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-blue-600 text-white'
            : `bg-${getAgentColor(message.agentUsed)}-100 dark:bg-${getAgentColor(
                message.agentUsed
              )}-900/30`
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
          {/* Contenido del mensaje */}
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="mb-0 whitespace-pre-wrap break-words">{message.content}</p>
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

export default MessageBubble;
