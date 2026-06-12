import React, { useState } from 'react';
import {
  FileText, MessageCircle, CornerUpLeft, AlertTriangle, Clock,
  Lock, User, ClipboardList, Check, CheckCheck,
  Trash2, ChevronUp, ChevronDown
} from 'lucide-react';
import type { LeadMessage } from '../../../types/message.types';
import {
  MESSAGE_TYPE_LABELS,
  MESSAGE_TYPE_COLORS,
  MESSAGE_PRIORITY_COLORS,
} from '../../../types/message.types';
import { formatRelativeTime } from '../../../services/messageService';

interface MessageCardProps {
  message: LeadMessage;
  onReply?: (messageId: string) => void;
  onMarkAsRead?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  canReply?: boolean;
  canDelete?: boolean;
  canViewPrivate?: boolean;
  isExpanded?: boolean;
  showLead?: boolean;
}

export const MessageCard: React.FC<MessageCardProps> = ({
  message,
  onReply,
  onMarkAsRead,
  onDelete,
  canReply = true,
  canDelete = false,
  canViewPrivate = false,
  isExpanded: initialExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [isDeleting, setIsDeleting] = useState(false);

  if (message.esPrivado && !canViewPrivate) return null;

  const getTipoColor = () => {
    const color = MESSAGE_TYPE_COLORS[message.tipo] || 'gray';
    return {
      bg: `bg-${color}-50 dark:bg-${color}-900/20`,
      border: `border-${color}-200 dark:border-${color}-800`,
      text: `text-${color}-700 dark:text-${color}-300`,
      badge: `bg-${color}-100 dark:bg-${color}-900 text-${color}-700 dark:text-${color}-300`,
    };
  };

  const getPrioridadColor = () => {
    const color = MESSAGE_PRIORITY_COLORS[message.prioridad] || 'gray';
    return { badge: `bg-${color}-100 dark:bg-${color}-900 text-${color}-700 dark:text-${color}-300` };
  };

  const getTipoIcon = (): React.ReactNode => {
    switch (message.tipo) {
      case 'nota_interna': return <FileText size={12} strokeWidth={1.5} />;
      case 'mensaje_cliente': return <MessageCircle size={12} strokeWidth={1.5} />;
      case 'respuesta_cliente': return <CornerUpLeft size={12} strokeWidth={1.5} />;
      default: return <MessageCircle size={12} strokeWidth={1.5} />;
    }
  };

  const getEstadoIcon = (): React.ReactNode => {
    if (message.leido) return <CheckCheck size={14} strokeWidth={2} />;
    if (message.estado === 'enviado') return <Check size={14} strokeWidth={2} />;
    if (message.estado === 'fallido') return <AlertTriangle size={14} strokeWidth={1.5} />;
    return <Clock size={14} strokeWidth={1.5} />;
  };

  const colors = getTipoColor();
  const prioridadColors = getPrioridadColor();

  const handleMarkAsRead = () => {
    if (!message.leido && onMarkAsRead) onMarkAsRead(message._id);
  };

  const handleReply = () => {
    if (onReply) onReply(message._id);
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de eliminar este mensaje?')) {
      setIsDeleting(true);
      try {
        if (onDelete) await onDelete(message._id);
      } catch (error) {
        console.error('Error eliminando mensaje:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && !message.leido) handleMarkAsRead();
  };

  const shouldTruncate = message.contenido.length > 200;
  const displayContent =
    !isExpanded && shouldTruncate
      ? message.contenido.substring(0, 200) + '...'
      : message.contenido;

  return (
    <div
      className={`
        border rounded-lg p-4 transition-all
        ${colors.bg} ${colors.border}
        ${!message.leido ? 'ring-2 ring-yellow-400 dark:ring-yellow-600' : ''}
        ${isDeleting ? 'opacity-50 pointer-events-none' : ''}
        hover:shadow-md
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Avatar */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {message.autor.nombre.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                {message.autor.nombre}
              </h4>

              {/* Badge Tipo */}
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}>
                {getTipoIcon()}
                {MESSAGE_TYPE_LABELS[message.tipo]}
              </span>

              {/* Badge Privado */}
              {message.esPrivado && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
                  <Lock size={10} strokeWidth={1.5} />
                  Privado
                </span>
              )}

              {/* Badge Prioridad */}
              {message.prioridad !== 'normal' && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${prioridadColors.badge}`}>
                  {message.prioridad.toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
              <span>{message.autor.email}</span>
              <span>•</span>
              <span className="text-xs">{message.autor.rol}</span>
            </div>
          </div>
        </div>

        {/* Timestamp y Estado */}
        <div className="flex-shrink-0 flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Clock size={11} strokeWidth={1.5} />
            {formatRelativeTime(message.createdAt)}
          </div>
          <div className={message.leido ? 'text-green-500' : 'text-gray-400'}>
            {getEstadoIcon()}
          </div>
        </div>
      </div>

      {/* Asunto */}
      {message.asunto && (
        <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
          <ClipboardList size={13} strokeWidth={1.5} />
          {message.asunto}
        </div>
      )}

      {/* Destinatario */}
      {message.destinatario && message.destinatario.nombre && (
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <User size={14} strokeWidth={1.5} />
          <span>Para: {message.destinatario.nombre}</span>
        </div>
      )}

      {/* Contenido */}
      <div className="mb-3">
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
          {displayContent}
        </p>

        {shouldTruncate && (
          <button
            onClick={toggleExpand}
            className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            {isExpanded ? (
              <><ChevronUp size={14} strokeWidth={1.5} />Ver menos</>
            ) : (
              <><ChevronDown size={14} strokeWidth={1.5} />Ver más</>
            )}
          </button>
        )}
      </div>

      {/* Responde a */}
      {message.respondidoA && typeof message.respondidoA === 'object' && (
        <div className="mb-3 p-2 bg-gray-100 dark:bg-gray-800 rounded border-l-4 border-blue-500">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">En respuesta a:</div>
          <div className="text-sm text-gray-700 dark:text-gray-300 truncate">
            {message.respondidoA.contenido}
          </div>
        </div>
      )}

      {/* Etiquetas */}
      {message.etiquetas && message.etiquetas.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {message.etiquetas.map((etiqueta, index) => (
            <span
              key={index}
              className="inline-block px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
            >
              #{etiqueta}
            </span>
          ))}
        </div>
      )}

      {/* Acciones */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {canReply && !message.esPrivado && (
            <button
              onClick={handleReply}
              className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded transition-colors"
            >
              <CornerUpLeft size={14} strokeWidth={1.5} />
              Responder
            </button>
          )}

          {!message.leido && onMarkAsRead && (
            <button
              onClick={handleMarkAsRead}
              className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 px-3 py-1.5 rounded transition-colors"
            >
              <Check size={14} strokeWidth={2} />
              Marcar leído
            </button>
          )}
        </div>

        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
          >
            <Trash2 size={14} strokeWidth={1.5} />
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageCard;
