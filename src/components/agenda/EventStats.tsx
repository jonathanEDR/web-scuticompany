/**
 * Widget de Estadísticas de Eventos
 * Muestra métricas clave del módulo de agenda
 */

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  CalendarDays,
  ArrowRight,
  AlertCircle,
  Plus,
  Users,
  Bell,
  Sparkles,
} from 'lucide-react';
import eventService from '../../services/eventService';
import { useDashboardHeaderGradient } from '../../hooks/cms/useDashboardHeaderGradient';

interface EventStatsData {
  total: number;
  today: number;
  thisMonth: number;
  byStatus: {
    scheduled: number;
    in_progress: number;
    completed: number;
    cancelled: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  byType: {
    meeting: number;
    appointment: number;
    reminder: number;
    event: number;
  };
}

interface EventStatsProps {
  onEventClick?: (filter: string) => void;
}

/**
 * 📊 Widget de estadísticas de eventos para el dashboard
 */
const EventStats: React.FC<EventStatsProps> = ({ onEventClick }) => {
  const [stats, setStats] = useState<EventStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Colores del tema dinámico (mismo origen que el Sidebar/CMS)
  const { colors } = useDashboardHeaderGradient();
  const themeVars = {
    '--agenda-from': colors.from,
    '--agenda-via': colors.via,
    '--agenda-to': colors.to,
  } as React.CSSProperties;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEventStats();
      
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError('No se pudieron cargar las estadísticas');
      }
    } catch (err) {
      console.error('Error fetching event stats:', err);
      setError('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6" style={themeVars}>
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-b-[color:var(--agenda-from)]"></div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="text-center text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
          <AlertCircle size={18} strokeWidth={1.5} />
          {error || 'Error al cargar estadísticas'}
        </div>
      </div>
    );
  }

  const handleClick = (filter: string) => {
    if (onEventClick) {
      onEventClick(filter);
    }
  };

  return (
    <div className="space-y-6" style={themeVars}>
      {/* Título */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar size={20} strokeWidth={1.5} className="text-[color:var(--agenda-from)]" />
          Agenda
        </h3>
        <button
          onClick={() => handleClick('all')}
          className="text-sm text-[color:var(--agenda-from)] hover:opacity-80 transition-opacity
                   inline-flex items-center gap-1"
        >
          Ver todos
          <ArrowRight size={14} strokeWidth={1.5} />
        </button>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total eventos */}
        <div
          onClick={() => handleClick('all')}
          className="rounded-lg p-4 text-white cursor-pointer transition-all transform
                   hover:scale-105 hover:brightness-110"
          style={{ background: `linear-gradient(to bottom right, var(--agenda-from), var(--agenda-to))` }}
        >
          <div className="text-3xl font-bold mb-1">{stats.total}</div>
          <div className="text-sm opacity-90">Total de Eventos</div>
        </div>

        {/* Próximos eventos */}
        <div
          onClick={() => handleClick('upcoming')}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white cursor-pointer
                   hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
        >
          <div className="text-3xl font-bold mb-1">{stats.thisMonth}</div>
          <div className="text-sm opacity-90">Este Mes</div>
        </div>

        {/* Eventos hoy */}
        <div
          onClick={() => handleClick('today')}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white cursor-pointer
                   hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
        >
          <div className="text-3xl font-bold mb-1">{stats.today}</div>
          <div className="text-sm opacity-90">Hoy</div>
        </div>

        {/* Completados esta semana */}
        <div
          onClick={() => handleClick('completed-week')}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white cursor-pointer
                   hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105"
        >
          <div className="text-3xl font-bold mb-1">{stats.byStatus.completed}</div>
          <div className="text-sm opacity-90">Completados</div>
        </div>
      </div>

      {/* Por Estado */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Por Estado
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Programado</span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {stats.byStatus.scheduled}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">En Progreso</span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {stats.byStatus.in_progress}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Completado</span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {stats.byStatus.completed}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Cancelado</span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {stats.byStatus.cancelled}
            </span>
          </div>
        </div>
      </div>

      {/* Por Prioridad */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Por Prioridad
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Urgente</span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {stats.byPriority.urgent}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Alta</span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {stats.byPriority.high}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Media</span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {stats.byPriority.medium}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Baja</span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {stats.byPriority.low}
            </span>
          </div>
        </div>
      </div>

      {/* Por Tipo */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Por Tipo
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <Users size={22} strokeWidth={1.5} className="mx-auto mb-1 text-blue-500" />
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {stats.byType.meeting}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Reuniones</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <CalendarDays size={22} strokeWidth={1.5} className="mx-auto mb-1 text-purple-500" />
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {stats.byType.appointment}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Citas</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <Bell size={22} strokeWidth={1.5} className="mx-auto mb-1 text-yellow-500" />
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {stats.byType.reminder}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Recordatorios</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <Sparkles size={22} strokeWidth={1.5} className="mx-auto mb-1 text-green-500" />
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {stats.byType.event}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Eventos</div>
          </div>
        </div>
      </div>

      {/* Botón de acción */}
      <button
        onClick={() => handleClick('create')}
        className="w-full py-3 text-white rounded-lg font-medium transition-all
                 hover:brightness-110 flex items-center justify-center gap-2"
        style={{ background: `linear-gradient(to right, var(--agenda-from), var(--agenda-to))` }}
      >
        <Plus size={18} strokeWidth={2} />
        Crear Nuevo Evento
      </button>
    </div>
  );
};

export default EventStats;
