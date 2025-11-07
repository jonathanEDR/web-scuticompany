/**
 * 💬 CommentItem Component
 * Item individual de comentario con votación y respuestas
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Reply, Flag, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { getImageUrl } from '../../../utils/imageUtils';
import LazyImage from '../common/LazyImage';
import type { BlogComment } from '../../../types/blog';

interface CommentItemProps {
  comment: BlogComment;
  level?: number;
  maxLevel?: number;
  currentUserId?: string;
  isAdmin?: boolean;
  onReply?: (commentId: string) => void;
  onEdit?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  onVote?: (commentId: string, voteType: 'like' | 'dislike') => Promise<void>;
  onReport?: (commentId: string) => void;
  className?: string;
}

export default function CommentItem({
  comment,
  level = 0,
  maxLevel = 3,
  currentUserId,
  isAdmin = false,
  onReply,
  onEdit,
  onDelete,
  onVote,
  onReport,
  className = ''
}: CommentItemProps) {
  
  const [showMenu, setShowMenu] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [localVotes, setLocalVotes] = useState(comment.votes);

  // Determinar si el usuario puede editar/eliminar
  const isAuthor = currentUserId && comment.author.userId === currentUserId;
  const canModerate = isAdmin;
  const canReply = level < maxLevel;

  // Formatear fecha
  const commentDate = new Date(comment.createdAt);
  const formattedDate = commentDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Nombre del autor
  // Si author.userId está poblado, puede ser un objeto con firstName/lastName/username
  const isPopulatedUser = comment.author.userId && typeof comment.author.userId !== 'string';
  const authorName = isPopulatedUser && (comment.author.userId as any).firstName
    ? `${(comment.author.userId as any).firstName} ${(comment.author.userId as any).lastName || ''}`.trim()
    : comment.author.name || 'Usuario invitado';

  // Manejar votación
  const handleVote = async (voteType: 'like' | 'dislike') => {
    if (!onVote || isVoting) return;

    setIsVoting(true);
    try {
      await onVote(comment._id, voteType);
      
      // Actualizar votos localmente
      setLocalVotes(prev => ({
        ...prev,
        likes: voteType === 'like' ? prev.likes + 1 : prev.likes,
        dislikes: voteType === 'dislike' ? prev.dislikes + 1 : prev.dislikes,
        score: voteType === 'like' ? prev.score + 1 : prev.score - 1
      }));
    } catch (error) {
      console.error('Error al votar:', error);
    } finally {
      setIsVoting(false);
    }
  };

  // Estilos según el estado
  const statusColors: Record<string, string> = {
    approved: 'bg-white',
    pending: 'bg-yellow-50 border-yellow-200',
    rejected: 'bg-red-50 border-red-200',
    spam: 'bg-gray-100 border-gray-300',
    hidden: 'bg-gray-100 border-gray-300'
  };

  const containerClass = `
    comment-item
    ${statusColors[comment.status] || statusColors.approved}
    border rounded-lg p-4
    ${level > 0 ? 'ml-8 mt-3' : 'mt-4'}
    ${className}
  `;

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {(() => {
            const profileUsername = isPopulatedUser ? (comment.author.userId as any).username : undefined;
            const profileImg = isPopulatedUser ? (comment.author.userId as any).profileImage : (comment.author.avatar || undefined);
            const profileUrl = profileUsername ? `/perfil/${profileUsername}` : (comment.author.website || null);

            const avatarNode = profileImg ? (
              <LazyImage 
                src={getImageUrl(profileImg)} 
                alt={authorName} 
                className="w-10 h-10 rounded-full object-cover"
                width={40}
                height={40}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{authorName.charAt(0).toUpperCase()}</span>
              </div>
            );

            if (profileUrl) {
              // Si es ruta interna (username), usar Link; si es website, abrir en nueva pestaña
              if (profileUsername) {
                return (
                  <Link to={profileUrl} aria-label={`Ver perfil de ${authorName}`} className="block">
                    {avatarNode}
                  </Link>
                );
              }
              return (
                <a href={profileUrl} target="_blank" rel="noopener noreferrer" aria-label={`Ver sitio de ${authorName}`}>{avatarNode}</a>
              );
            }

            return avatarNode;
          })()}

          <div>
            {/* Nombre del autor - si existe username, enlazar al perfil público */}
            {isPopulatedUser && (comment.author.userId as any).username ? (
              <Link to={`/perfil/${(comment.author.userId as any).username}`} className="font-semibold text-gray-900 hover:underline">
                {authorName}
              </Link>
            ) : (
              <p className="font-semibold text-gray-900">{authorName}</p>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{formattedDate}</span>
              {comment.editedAt && (
                <>
                  <span>•</span>
                  <span className="italic">Editado</span>
                </>
              )}
              {comment.status === 'pending' && (
                <>
                  <span>•</span>
                  <span className="text-yellow-600 font-medium">Pendiente de aprobación</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Menú de acciones */}
        {(isAuthor || canModerate) && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-20 min-w-[150px]">
                  {isAuthor && onEdit && (
                    <button
                      onClick={() => {
                        onEdit(comment._id);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                  )}

                  {(isAuthor || canModerate) && onDelete && (
                    <button
                      onClick={() => {
                        onDelete(comment._id);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Eliminar</span>
                    </button>
                  )}

                  {!isAuthor && onReport && (
                    <button
                      onClick={() => {
                        onReport(comment._id);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-orange-600 hover:bg-orange-50 transition-colors"
                    >
                      <Flag className="w-4 h-4" />
                      <span>Reportar</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Contenido del comentario */}
      <div className="prose prose-sm max-w-none mb-3">
        <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
      </div>

      {/* Footer con acciones */}
      <div className="flex items-center gap-4">
        {/* Votación */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVote('like')}
            disabled={isVoting}
            className="inline-flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="font-medium">{localVotes.likes}</span>
          </button>

          <button
            onClick={() => handleVote('dislike')}
            disabled={isVoting}
            className="inline-flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
          >
            <ThumbsDown className="w-4 h-4" />
            <span className="font-medium">{localVotes.dislikes}</span>
          </button>

          {/* Score */}
          <span className={`text-sm font-semibold ${
            localVotes.score > 0 ? 'text-green-600' :
            localVotes.score < 0 ? 'text-red-600' :
            'text-gray-500'
          }`}>
            {localVotes.score > 0 && '+'}{localVotes.score}
          </span>
        </div>

        {/* Responder */}
        {canReply && onReply && (
          <button
            onClick={() => onReply(comment._id)}
            className="inline-flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Reply className="w-4 h-4" />
            <span>Responder</span>
          </button>
        )}

        {/* Reportes (admin) */}
        {isAdmin && comment.isReported && (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full font-medium">
            <Flag className="w-3 h-3" />
            {comment.reports?.length || 0} reportes
          </span>
        )}
      </div>

      {/* Respuestas anidadas */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              level={level + 1}
              maxLevel={maxLevel}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onVote={onVote}
              onReport={onReport}
            />
          ))}
        </div>
      )}
    </div>
  );
}
