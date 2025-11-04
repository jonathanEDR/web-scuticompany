/**
 * ✍️ CommentForm Component
 * Formulario para crear y editar comentarios
 */

import { useState, useEffect } from 'react';
import { Send, X, AlertCircle } from 'lucide-react';

interface CommentFormProps {
  postId: string;
  parentId?: string;
  initialContent?: string;
  isEditing?: boolean;
  isReply?: boolean;
  onSubmit: (content: string, postId: string, parentId?: string) => Promise<void>;
  onCancel?: () => void;
  placeholder?: string;
  className?: string;
}

export default function CommentForm({
  postId,
  parentId,
  initialContent = '',
  isEditing = false,
  isReply = false,
  onSubmit,
  onCancel,
  placeholder = 'Escribe tu comentario...',
  className = ''
}: CommentFormProps) {
  
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(initialContent.length);

  const MIN_LENGTH = 10;
  const MAX_LENGTH = 2000;

  // Actualizar contador de caracteres
  useEffect(() => {
    setCharCount(content.length);
  }, [content]);

  // Validar contenido
  const validateContent = (): boolean => {
    if (content.trim().length < MIN_LENGTH) {
      setError(`El comentario debe tener al menos ${MIN_LENGTH} caracteres`);
      return false;
    }

    if (content.length > MAX_LENGTH) {
      setError(`El comentario no puede exceder ${MAX_LENGTH} caracteres`);
      return false;
    }

    setError('');
    return true;
  };

  // Manejar envío
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateContent()) return;

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit(content.trim(), postId, parentId);
      
      // Limpiar formulario si no es edición
      if (!isEditing) {
        setContent('');
        setCharCount(0);
      }
      
      // Cerrar formulario si hay callback de cancelar
      if (onCancel) {
        onCancel();
      }
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'Error al enviar el comentario. Por favor, intenta de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar cancelar
  const handleCancel = () => {
    setContent(initialContent);
    setError('');
    if (onCancel) {
      onCancel();
    }
  };

  // Determinar si puede enviar
  const canSubmit = content.trim().length >= MIN_LENGTH && 
                    content.length <= MAX_LENGTH &&
                    !isSubmitting;

  return (
    <form onSubmit={handleSubmit} className={`comment-form ${className}`}>
      <div className={`
        bg-white rounded-lg border-2 transition-colors
        ${error ? 'border-red-300' : 'border-gray-200 focus-within:border-blue-500'}
        ${isReply ? 'shadow-sm' : 'shadow-md'}
      `}>
        {/* Header (si es respuesta o edición) */}
        {(isReply || isEditing) && (
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">
              {isEditing ? '✏️ Editando comentario' : '↩️ Respondiendo'}
            </span>
            {onCancel && (
              <button
                type="button"
                onClick={handleCancel}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Textarea */}
        <div className="p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            rows={isReply ? 3 : 4}
            maxLength={MAX_LENGTH}
            className="w-full resize-none border-0 focus:ring-0 text-gray-900 placeholder-gray-400"
            disabled={isSubmitting}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
          {/* Contador de caracteres */}
          <div className="text-sm">
            <span className={`
              font-medium
              ${charCount < MIN_LENGTH ? 'text-gray-400' :
                charCount > MAX_LENGTH * 0.9 ? 'text-orange-600' :
                'text-gray-600'}
            `}>
              {charCount}
            </span>
            <span className="text-gray-400"> / {MAX_LENGTH}</span>
            {charCount < MIN_LENGTH && (
              <span className="ml-2 text-xs text-gray-400">
                (mínimo {MIN_LENGTH})
              </span>
            )}
          </div>

          {/* Botones */}
          <div className="flex items-center gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            )}
            
            <button
              type="submit"
              disabled={!canSubmit}
              className={`
                inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
                transition-all duration-200
                ${canSubmit
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{isEditing ? 'Actualizar' : 'Comentar'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="flex items-start gap-2 px-4 py-3 bg-red-50 border-t border-red-200 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Nota de políticas (solo en formulario principal) */}
      {!isReply && !isEditing && (
        <p className="mt-2 text-xs text-gray-500">
          Al comentar, aceptas nuestras{' '}
          <a href="/politicas" className="text-blue-600 hover:underline">
            políticas de comunidad
          </a>
          . Los comentarios están sujetos a moderación.
        </p>
      )}
    </form>
  );
}
