import { useState } from 'react';
import { MessageCircle, Filter } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useComments } from '../../../hooks/blog';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import type { CommentFormData } from '../../../types/blog';

// Estilos configurables desde CMS
export interface CommentsStyles {
  sectionBackground?: { light?: string; dark?: string };
  sectionBorder?: { light?: string; dark?: string };
  titleColor?: { light?: string; dark?: string };
  iconColor?: { light?: string; dark?: string };
  countColor?: { light?: string; dark?: string };
  selectorBackground?: { light?: string; dark?: string };
  selectorBorder?: { light?: string; dark?: string };
  selectorText?: { light?: string; dark?: string };
  selectorIconColor?: { light?: string; dark?: string };
  cardBackground?: { light?: string; dark?: string };
  cardBorder?: { light?: string; dark?: string };
  authorColor?: { light?: string; dark?: string };
  textColor?: { light?: string; dark?: string };
  dateColor?: { light?: string; dark?: string };
  formBackground?: { light?: string; dark?: string };
  formBorder?: { light?: string; dark?: string };
  textareaBackground?: { light?: string; dark?: string };
  textareaText?: { light?: string; dark?: string };
  footerBackground?: { light?: string; dark?: string };
  buttonBackground?: { light?: string; dark?: string };
  buttonBorder?: { light?: string; dark?: string };
  buttonText?: { light?: string; dark?: string };
}

interface CommentsListProps {
  postSlug: string;
  className?: string;
  title?: string;
  fontFamily?: string;
  styles?: CommentsStyles;
  theme?: 'light' | 'dark';
  avatarShape?: 'circle' | 'square';
}

type SortOption = 'newest' | 'oldest' | 'top';

export default function CommentsList({
  postSlug,
  className = '',
  title = 'Comentarios',
  fontFamily = 'Montserrat, sans-serif',
  styles,
  theme = 'light',
  avatarShape = 'circle'
}: CommentsListProps) {
  
  // Calcular estilos dinámicos desde CMS
  const currentStyles = {
    sectionBackground: theme === 'dark' ? styles?.sectionBackground?.dark : styles?.sectionBackground?.light,
    sectionBorder: theme === 'dark' ? styles?.sectionBorder?.dark : styles?.sectionBorder?.light,
    titleColor: theme === 'dark' ? styles?.titleColor?.dark : styles?.titleColor?.light,
    iconColor: theme === 'dark' ? styles?.iconColor?.dark : styles?.iconColor?.light,
    countColor: theme === 'dark' ? styles?.countColor?.dark : styles?.countColor?.light,
    selectorBackground: theme === 'dark' ? styles?.selectorBackground?.dark : styles?.selectorBackground?.light,
    selectorBorder: theme === 'dark' ? styles?.selectorBorder?.dark : styles?.selectorBorder?.light,
    selectorText: theme === 'dark' ? styles?.selectorText?.dark : styles?.selectorText?.light,
    selectorIconColor: theme === 'dark' ? styles?.selectorIconColor?.dark : styles?.selectorIconColor?.light,
    cardBackground: theme === 'dark' ? styles?.cardBackground?.dark : styles?.cardBackground?.light,
    cardBorder: theme === 'dark' ? styles?.cardBorder?.dark : styles?.cardBorder?.light,
    authorColor: theme === 'dark' ? styles?.authorColor?.dark : styles?.authorColor?.light,
    textColor: theme === 'dark' ? styles?.textColor?.dark : styles?.textColor?.light,
    dateColor: theme === 'dark' ? styles?.dateColor?.dark : styles?.dateColor?.light,
    formBackground: theme === 'dark' ? styles?.formBackground?.dark : styles?.formBackground?.light,
    formBorder: theme === 'dark' ? styles?.formBorder?.dark : styles?.formBorder?.light,
    textareaBackground: theme === 'dark' ? styles?.textareaBackground?.dark : styles?.textareaBackground?.light,
    textareaText: theme === 'dark' ? styles?.textareaText?.dark : styles?.textareaText?.light,
    footerBackground: theme === 'dark' ? styles?.footerBackground?.dark : styles?.footerBackground?.light,
    buttonBackground: theme === 'dark' ? styles?.buttonBackground?.dark : styles?.buttonBackground?.light,
    buttonBorder: theme === 'dark' ? styles?.buttonBorder?.dark : styles?.buttonBorder?.light,
    buttonText: theme === 'dark' ? styles?.buttonText?.dark : styles?.buttonText?.light,
  };

  // Obtener usuario autenticado del contexto
  const { user } = useAuth();
  const isSignedIn = !!user;
  const userId = user?._id;
  
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

  const handleAddComment = async (data: CommentFormData) => {
    try {
      await addComment(data);
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

  // Asegurarse de que comments es un array
  const commentsArray = Array.isArray(comments) ? comments : [];
  
  const sortedComments = [...commentsArray].sort((a, b) => {
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

  // Estilos del contenedor de la sección
  const sectionStyle = {
    backgroundColor: currentStyles.sectionBackground || undefined,
    borderColor: currentStyles.sectionBorder || undefined,
    borderWidth: currentStyles.sectionBorder ? '1px' : undefined,
    borderStyle: currentStyles.sectionBorder ? 'solid' : undefined,
  };

  return (
    <div 
      className={`comments-section ${className} ${!currentStyles.sectionBackground ? '' : ''}`}
      style={{
        ...sectionStyle,
        fontFamily: fontFamily
      } as React.CSSProperties}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2" style={{
          color: currentStyles.titleColor || undefined
        }}>
          <MessageCircle className="w-6 h-6" style={{
            color: currentStyles.iconColor || undefined
          }} />
          <span>{title}</span>
          <span style={{
            color: currentStyles.countColor || undefined
          }}>({pagination?.total || 0})</span>
        </h2>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" style={{
            color: currentStyles.selectorIconColor || undefined
          }} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className={`text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!currentStyles.selectorBackground ? 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white' : ''}`}
            style={{
              backgroundColor: currentStyles.selectorBackground || undefined,
              borderColor: currentStyles.selectorBorder || undefined,
              borderWidth: currentStyles.selectorBorder ? '1px' : undefined,
              borderStyle: currentStyles.selectorBorder ? 'solid' : undefined,
              color: currentStyles.selectorText || undefined
            }}
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="top">Más votados</option>
          </select>
        </div>
      </div>

      {isSignedIn && userId && (
        <div className="mb-8">
          <CommentForm
            postId={postSlug}
            onSubmit={handleAddComment}
            placeholder="Comparte tu opinión sobre este artículo..."
            styles={{
              formBackground: currentStyles.formBackground,
              formBorder: currentStyles.formBorder,
              textareaBackground: currentStyles.textareaBackground,
              textareaText: currentStyles.textareaText,
              footerBackground: currentStyles.footerBackground,
              buttonBackground: currentStyles.buttonBackground,
              buttonBorder: currentStyles.buttonBorder,
              buttonText: currentStyles.buttonText,
            }}
          />
        </div>
      )}

      {!isSignedIn && (
        <div className="mb-8">
          <CommentForm
            postId={postSlug}
            onSubmit={handleAddComment}
            placeholder="Comparte tu opinión sobre este artículo..."
            styles={{
              formBackground: currentStyles.formBackground,
              formBorder: currentStyles.formBorder,
              textareaBackground: currentStyles.textareaBackground,
              textareaText: currentStyles.textareaText,
              footerBackground: currentStyles.footerBackground,
              buttonBackground: currentStyles.buttonBackground,
              buttonBorder: currentStyles.buttonBorder,
              buttonText: currentStyles.buttonText,
            }}
          />
        </div>
      )}

      {loading && comments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando comentarios...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 mb-6">
          <p className="font-semibold">Error al cargar comentarios</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm"
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && topLevelComments.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Aún no hay comentarios
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {isSignedIn 
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
              currentUserId={userId || undefined}
              isAdmin={false}
              onReply={() => setReplyingTo(comment._id)}
              onEdit={() => alert('Funcionalidad de edición próximamente')}
              onDelete={() => alert('Funcionalidad de eliminación próximamente')}
              onVote={handleVote}
              onReport={handleReport}
              avatarShape={avatarShape}
              styles={{
                cardBackground: currentStyles.cardBackground,
                cardBorder: currentStyles.cardBorder,
                authorColor: currentStyles.authorColor,
                textColor: currentStyles.textColor,
                dateColor: currentStyles.dateColor,
              }}
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
                  styles={{
                    formBackground: currentStyles.formBackground,
                    formBorder: currentStyles.formBorder,
                    textareaBackground: currentStyles.textareaBackground,
                    textareaText: currentStyles.textareaText,
                    footerBackground: currentStyles.footerBackground,
                    buttonBackground: currentStyles.buttonBackground,
                    buttonBorder: currentStyles.buttonBorder,
                    buttonText: currentStyles.buttonText,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
