import { useState } from 'react';
import { MessageCircle, Filter } from 'lucide-react';
import { useComments } from '../../../hooks/blog';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import type { CommentFormData } from '../../../types/blog';

interface CommentsListProps {
  postSlug: string;
  currentUserId?: string;
  isAdmin?: boolean;
  className?: string;
}

type SortOption = 'newest' | 'oldest' | 'top';

export default function CommentsList({
  postSlug,
  currentUserId,
  isAdmin = false,
  className = ''
}: CommentsListProps) {
  
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const {
    comments,
    loading,
    error,
    pagination,
    addComment,
    voteComment,
    reportComment,
    refetch
  } = useComments(postSlug, { 
    sort: sortBy === 'top' ? 'votes' : 'createdAt',
    order: sortBy === 'oldest' ? 'asc' : 'desc'
  });

  const handleAddComment = async (content: string, _postIdParam: string, parentId?: string) => {
    try {
      const commentData: CommentFormData = {
        content,
        parentComment: parentId
      };
      await addComment(commentData);
      setReplyingTo(null);
    } catch (err) {
      throw err;
    }
  };

  const handleVote = async (commentId: string, voteType: 'like' | 'dislike') => {
    try {
      await voteComment(commentId, voteType);
    } catch (err) {
      console.error('Error al votar:', err);
      throw err;
    }
  };

  const handleReport = async (commentId: string) => {
    const description = prompt('¿Por qué reportas este comentario?');
    if (!description) return;

    try {
      await reportComment(commentId, 'inappropriate', description);
      alert('Comentario reportado. Será revisado por un moderador.');
    } catch (err) {
      alert('Error al reportar el comentario');
      console.error(err);
    }
  };

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'top':
        return b.votes.score - a.votes.score;
      default:
        return 0;
    }
  });

  const topLevelComments = sortedComments.filter(c => !c.parentComment);

  return (
    <div className={`comments-section ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-blue-600" />
          <span>Comentarios</span>
          <span className="text-gray-400">({pagination?.total || 0})</span>
        </h2>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="top">Más votados</option>
          </select>
        </div>
      </div>

      {currentUserId && (
        <div className="mb-8">
          <CommentForm
            postId={postSlug}
            onSubmit={handleAddComment}
            placeholder="Comparte tu opinión sobre este artículo..."
          />
        </div>
      )}

      {!currentUserId && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-blue-800">
            <a href="/login" className="font-semibold hover:underline">
              Inicia sesión
            </a>
            {' '}para dejar un comentario
          </p>
        </div>
      )}

      {loading && comments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600">Cargando comentarios...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
          <p className="font-semibold">Error al cargar comentarios</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && topLevelComments.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aún no hay comentarios
          </h3>
          <p className="text-gray-600">
            {currentUserId 
              ? '¡Sé el primero en comentar!' 
              : 'Inicia sesión para ser el primero en comentar'}
          </p>
        </div>
      )}

      <div className="space-y-0">
        {topLevelComments.map((comment) => (
          <div key={comment._id}>
            <CommentItem
              comment={comment}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onReply={() => setReplyingTo(comment._id)}
              onEdit={() => alert('Funcionalidad de edición próximamente')}
              onDelete={() => alert('Funcionalidad de eliminación próximamente')}
              onVote={handleVote}
              onReport={handleReport}
            />

            {replyingTo === comment._id && (
              <div className="ml-8 mt-3 mb-4">
                <CommentForm
                  postId={postSlug}
                  parentId={comment._id}
                  isReply
                  onSubmit={handleAddComment}
                  onCancel={() => setReplyingTo(null)}
                  placeholder="Escribe tu respuesta..."
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
