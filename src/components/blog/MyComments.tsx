/**
 * 💬 MyComments Component
 * Lista y gestión de comentarios del usuario
 */

import { useState } from 'react';
import { useUserComments } from '../../hooks/useUserComments';
import { MessageSquare, Trash2, Eye, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

type StatusFilter = 'all' | 'approved' | 'pending' | 'rejected';

export default function MyComments() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  
  const { comments, pagination, loading, error, deleteComment, refetch } = useUserComments({
    page,
    limit: 10,
    status: statusFilter === 'all' ? undefined : statusFilter
  });

  const handleDelete = async (commentId: string) => {
    if (window.confirm('¿Estás seguro de eliminar este comentario?')) {
      try {
        await deleteComment(commentId);
        refetch();
      } catch (err) {
        alert('Error al eliminar comentario');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { icon: CheckCircle, text: 'Aprobado', class: 'bg-green-100 text-green-800' },
      pending: { icon: Clock, text: 'Pendiente', class: 'bg-yellow-100 text-yellow-800' },
      rejected: { icon: XCircle, text: 'Rechazado', class: 'bg-red-100 text-red-800' },
      spam: { icon: AlertCircle, text: 'Spam', class: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.class}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.text}
      </span>
    );
  };

  if (loading && page === 1) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="flex gap-4">
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 font-medium">Error al cargar comentarios</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
            <div className="flex gap-2">
              {(['all', 'approved', 'pending', 'rejected'] as StatusFilter[]).map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'Todos' : 
                   status === 'approved' ? 'Aprobados' :
                   status === 'pending' ? 'Pendientes' : 'Rechazados'}
                </button>
              ))}
            </div>
          </div>
          
          {pagination && (
            <span className="text-sm text-gray-600">
              {pagination.total} comentario{pagination.total !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No tienes comentarios</p>
          <p className="text-gray-500 text-sm mt-1">
            {statusFilter === 'all' 
              ? 'Empieza a participar en el blog'
              : `No hay comentarios ${statusFilter === 'approved' ? 'aprobados' : statusFilter === 'pending' ? 'pendientes' : 'rechazados'}`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div 
              key={comment._id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <Link
                    to={`/blog/${comment.post.slug}`}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {comment.post.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-2">
                    <span 
                      className="text-xs font-medium px-2 py-1 rounded"
                      style={{
                        backgroundColor: `${comment.post.category.color}20`,
                        color: comment.post.category.color
                      }}
                    >
                      {comment.post.category.name}
                    </span>
                    {getStatusBadge(comment.status)}
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Link
                    to={`/blog/${comment.post.slug}#comment-${comment._id}`}
                    className="p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    title="Ver comentario"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    title="Eliminar comentario"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">{comment.content}</p>
              </div>

              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 font-medium mb-2">
                    {comment.replies.length} respuesta{comment.replies.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Anterior
          </button>
          <span className="px-4 py-2 text-gray-700">
            Página {page} de {pagination.pages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
