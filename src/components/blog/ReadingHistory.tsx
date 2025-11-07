/**
 * 📖 ReadingHistory Component
 * Historial de lectura del usuario
 */

import { useState } from 'react';
import { useReadingHistory } from '../../hooks/useReadingHistory';
import { Clock, Calendar, User, TrendingUp, Book } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';
import { Link } from 'react-router-dom';
import LazyImage from '../blog/common/LazyImage';

type PeriodFilter = 'today' | 'week' | 'month' | 'all';

export default function ReadingHistory() {
  const [page, setPage] = useState(1);
  const [period, setPeriod] = useState<PeriodFilter>('all');
  
  const { history, pagination, loading, error } = useReadingHistory({
    page,
    limit: 10,
    period
  });

  if (loading && page === 1) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
        <p className="text-red-800 font-medium">Error al cargar historial</p>
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
            <span className="text-sm font-medium text-gray-700">Período:</span>
            <div className="flex gap-2">
              {([
                { value: 'today', label: 'Hoy' },
                { value: 'week', label: 'Esta semana' },
                { value: 'month', label: 'Este mes' },
                { value: 'all', label: 'Todo' }
              ] as { value: PeriodFilter; label: string }[]).map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    setPeriod(filter.value);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    period === filter.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          
          {pagination && (
            <span className="text-sm text-gray-600">
              {pagination.total} artículo{pagination.total !== 1 ? 's' : ''} leído{pagination.total !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      {history.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Book className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {pagination?.total || 0}
                </p>
                <p className="text-sm text-gray-600">Artículos leídos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {history.reduce((acc, item) => acc + item.readCount, 0)}
                </p>
                <p className="text-sm text-gray-600">Lecturas totales</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(history.reduce((acc, item) => acc + (item.post.readingTime || 0), 0))} min
                </p>
                <p className="text-sm text-gray-600">Tiempo de lectura</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History List */}
      {history.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No hay artículos en tu historial</p>
          <p className="text-gray-500 text-sm mt-1">
            {period === 'all' 
              ? 'Empieza a leer artículos del blog'
              : `No has leído artículos ${period === 'today' ? 'hoy' : period === 'week' ? 'esta semana' : 'este mes'}`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <article 
              key={`${item.post._id}-${index}`}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex gap-6">
                {/* Featured Image */}
                {item.post.featuredImage && (
                  <Link 
                    to={`/blog/${item.post.slug}`}
                    className="flex-shrink-0 relative overflow-hidden rounded-lg"
                  >
                    <LazyImage
                      src={getImageUrl(item.post.featuredImage)}
                      alt={item.post.title}
                      className="w-32 h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                      width={128}
                      height={96}
                    />
                  </Link>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Category & Reading Count */}
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="inline-block text-xs font-medium px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: `${item.post.category.color}20`,
                        color: item.post.category.color
                      }}
                    >
                      {item.post.category.name}
                    </span>
                    {item.readCount > 1 && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        <TrendingUp className="w-3 h-3" />
                        Leído {item.readCount} {item.readCount === 1 ? 'vez' : 'veces'}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <Link to={`/blog/${item.post.slug}`}>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                      {item.post.title}
                    </h3>
                  </Link>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{item.post.author?.name || 'Anónimo'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Leído el {new Date(item.lastReadAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{item.post.readingTime} min de lectura</span>
                    </div>
                  </div>

                  {/* Progress Bar (if progress is tracked) */}
                  {item.progress !== undefined && item.progress > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progreso de lectura</span>
                        <span>{Math.round(item.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
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
