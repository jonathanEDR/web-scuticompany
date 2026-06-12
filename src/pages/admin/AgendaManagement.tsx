/**
 * Página principal de gestión de Agenda
 * Dashboard administrativo para eventos y reuniones
 */

import React, { useState } from 'react';
import {
  Calendar,
  CalendarDays,
  CalendarClock,
  List,
  Plus,
  Search,
  Pencil,
  Trash2,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useEvents } from '../../hooks/useEvents';
import SmartDashboardLayout from '../../components/SmartDashboardLayout';
import { StatusBadge, PriorityBadge, TypeBadge } from '../../components/agenda/EventBadges';
import EventFormModal from '../../components/agenda/EventFormModal';
import EventDetailModal from '../../components/agenda/EventDetailModal';
import CalendarView from '../../components/agenda/CalendarView';
import DayView from '../../components/agenda/DayView';
import { useDashboardHeaderGradient } from '../../hooks/cms/useDashboardHeaderGradient';
import type { Event, CreateEventData, UpdateEventData } from '../../types/event';

/**
 * 📅 Página principal de gestión de Agenda
 */
const AgendaManagement: React.FC = () => {
  // Hook para gradiente dinámico del header (mismo origen que el Sidebar/CMS)
  const { headerGradient, colors } = useDashboardHeaderGradient();

  // Variables CSS con los colores del tema dinámico, consumidas por las
  // clases arbitrarias de Tailwind (text-[color:var(--agenda-from)], etc.)
  const themeVars = {
    '--agenda-from': colors.from,
    '--agenda-via': colors.via,
    '--agenda-to': colors.to,
  } as React.CSSProperties;

  const {
    events,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    changePage,
    setSelectedEvent,
    selectedEvent,
    deleteEvent,
    createEvent,
    updateEvent,
    changeEventStatus,
  } = useEvents();

  // Estados para modales y vistas
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'day'>('list');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ========================================
  // BÚSQUEDA Y FILTROS
  // ========================================
  const handleSearch = (value: string) => {
    updateFilters({ search: value });
  };

  const handleFilterChange = (key: string, value: string) => {
    updateFilters({ [key]: value });
  };

  // ========================================
  // ACCIONES DE EVENTO
  // ========================================
  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setShowCreateModal(true);
  };

  const handleCreateEventForDate = (_date: Date) => {
    // TODO: Pre-fill form with selected date
    setSelectedEvent(null);
    setShowCreateModal(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const handleSubmitCreate = async (data: CreateEventData) => {
    setIsSubmitting(true);
    try {
      const result = await createEvent(data);
      if (result.success) {
        setShowCreateModal(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async (data: UpdateEventData) => {
    if (!selectedEvent) return;
    setIsSubmitting(true);
    try {
      const result = await updateEvent(selectedEvent._id, data);
      if (result.success) {
        setShowEditModal(false);
        setSelectedEvent(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (eventId: string, status: Event['status']) => {
    await changeEventStatus(eventId, { status });
  };

  const handleDeleteEvent = async (event: Event) => {
    if (!window.confirm(`¿Estás seguro de eliminar el evento "${event.title}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }
    
    try {
      const result = await deleteEvent(event._id);
      if (result.success) {
        console.log('Evento eliminado exitosamente');
      } else {
        alert(result.error || 'Error al eliminar el evento');
      }
    } catch (error) {
      console.error('Error eliminando evento:', error);
      alert('Error inesperado al eliminar el evento');
    }
  };

  // ========================================
  // FORMATEO DE FECHAS
  // ========================================
  const formatDateTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (start: Date | string, end: Date | string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
    
    if (duration < 60) {
      return `${duration} min`;
    }
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  };

  // ========================================
  // RENDERIZADO
  // ========================================

  return (
    <SmartDashboardLayout>
      <div className="space-y-4 md:space-y-6" style={themeVars}>
        {/* Header con diseño moderno y responsive */}
        <div 
          className="rounded-xl md:rounded-2xl p-4 md:p-8 shadow-xl"
          style={{ background: headerGradient }}
        >
          {/* Mobile Layout */}
          <div className="md:hidden space-y-4">
            {/* Título compacto */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Calendar size={24} strokeWidth={1.5} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Gestión de Agenda
                </h1>
                <p className="text-xs text-white/80">
                  Organiza tus reuniones, citas y eventos
                </p>
              </div>
            </div>

            {/* Botones de vista compactos */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-lg p-1 flex-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 px-2 py-2 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                    viewMode === 'list'
                      ? 'bg-white text-[color:var(--agenda-from)] shadow-lg'
                      : 'text-white'
                  }`}
                >
                  <List size={14} strokeWidth={1.5} />
                  Lista
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`flex-1 px-2 py-2 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                    viewMode === 'calendar'
                      ? 'bg-white text-[color:var(--agenda-from)] shadow-lg'
                      : 'text-white'
                  }`}
                >
                  <CalendarDays size={14} strokeWidth={1.5} />
                  Calendario
                </button>
                <button
                  onClick={() => setViewMode('day')}
                  className={`flex-1 px-2 py-2 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                    viewMode === 'day'
                      ? 'bg-white text-[color:var(--agenda-from)] shadow-lg'
                      : 'text-white'
                  }`}
                >
                  <CalendarClock size={14} strokeWidth={1.5} />
                  Día
                </button>
              </div>

              <button
                onClick={handleCreateEvent}
                className="px-3 py-2 bg-white text-[color:var(--agenda-from)] rounded-lg font-semibold
                         hover:bg-white/90 transition-all shadow-lg flex items-center gap-1 text-xs"
              >
                <Plus size={16} strokeWidth={2} />
                <span className="hidden xs:inline">Nuevo</span>
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Calendar size={32} strokeWidth={1.5} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  Gestión de Agenda
                </h1>
                <p className="text-white/80">
                  Organiza tus reuniones, citas y eventos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Botones de vista con diseño moderno */}
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-xl p-1.5">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    viewMode === 'list'
                      ? 'bg-white text-[color:var(--agenda-from)] shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <List size={16} strokeWidth={1.5} />
                  Lista
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    viewMode === 'calendar'
                      ? 'bg-white text-[color:var(--agenda-from)] shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <CalendarDays size={16} strokeWidth={1.5} />
                  Calendario
                </button>
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    viewMode === 'day'
                      ? 'bg-white text-[color:var(--agenda-from)] shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <CalendarClock size={16} strokeWidth={1.5} />
                  Día
                </button>
              </div>

              <button
                onClick={handleCreateEvent}
                className="px-6 py-3 bg-white text-[color:var(--agenda-from)] rounded-xl font-semibold
                         hover:bg-white/90 transition-all transform hover:scale-105 shadow-lg
                         flex items-center gap-2"
              >
                <Plus size={20} strokeWidth={2} />
                Nuevo Evento
              </button>
            </div>
          </div>
        </div>

        {/* Filtros con diseño mejorado */}
        {viewMode === 'list' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Búsqueda */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} strokeWidth={1.5} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={filters.search || ''}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl
                           bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-[color:var(--agenda-via)] focus:border-transparent
                           transition-all placeholder-gray-400"
                />
              </div>

              {/* Filtro de tipo */}
              <div className="relative">
                <select
                  value={filters.type || 'all'}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl
                           bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-[color:var(--agenda-via)] focus:border-transparent
                           transition-all appearance-none cursor-pointer"
                >
                  <option value="all">Todos los tipos</option>
                  <option value="meeting">Reunión</option>
                  <option value="appointment">Cita</option>
                  <option value="reminder">Recordatorio</option>
                  <option value="event">Evento</option>
                </select>
              </div>

              {/* Filtro de estado */}
              <div className="relative">
                <select
                  value={filters.status || 'all'}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl
                           bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-[color:var(--agenda-via)] focus:border-transparent
                           transition-all appearance-none cursor-pointer"
                >
                  <option value="all">Todos los estados</option>
                  <option value="scheduled">Programado</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="completed">Completado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>

              {/* Filtro de prioridad */}
              <div className="relative">
                <select
                  value={filters.priority || 'all'}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl
                           bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-[color:var(--agenda-via)] focus:border-transparent
                           transition-all appearance-none cursor-pointer"
                >
                  <option value="all">Todas las prioridades</option>
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle size={18} strokeWidth={1.5} className="flex-shrink-0" />
              {error}
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-b-[color:var(--agenda-from)]"></div>
          </div>
        ) : viewMode === 'calendar' ? (
          /* Vista de Calendario */
          <CalendarView
            events={events}
            onEventClick={handleViewEvent}
            onCreateEvent={handleCreateEventForDate}
          />
        ) : viewMode === 'day' ? (
          /* Vista de Día */
          <DayView
            events={events}
            onEventClick={handleViewEvent}
            onCreateEvent={handleCreateEventForDate}
          />
        ) : events.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-16 text-center
                        border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                 style={{ background: headerGradient }}>
              <Calendar size={48} strokeWidth={1.5} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              No hay eventos programados
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Comienza organizando tu agenda creando tu primer evento
            </p>
            <button
              onClick={handleCreateEvent}
              className="px-8 py-4 text-white rounded-xl font-semibold transition-all
                       transform hover:scale-105 hover:brightness-110 shadow-lg
                       flex items-center gap-2 mx-auto"
              style={{ background: `linear-gradient(to right, var(--agenda-from), var(--agenda-to))` }}
            >
              <Plus size={22} strokeWidth={2} />
              Crear Primer Evento
            </button>
          </div>
        ) : (
          <>
            {/* Lista de eventos con diseño mejorado */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden 
                          border border-gray-100 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 
                                   uppercase tracking-wider">
                        Evento
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 
                                   uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 
                                   uppercase tracking-wider">
                        Fecha/Hora
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 
                                   uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 
                                   uppercase tracking-wider">
                        Prioridad
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 
                                   uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                    {events.map((event) => (
                      <tr
                        key={event._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all
                                 cursor-pointer group"
                        onClick={() => handleViewEvent(event)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div 
                              className="w-1 h-12 rounded-full mr-4 flex-shrink-0 group-hover:w-2 transition-all"
                              style={{ backgroundColor: event.color }}
                            />
                            <div>
                              <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-[color:var(--agenda-from)] transition-colors">
                                {event.title}
                              </div>
                              {event.description && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                  {event.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <TypeBadge type={event.type} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                              <CalendarDays size={16} strokeWidth={1.5} className="text-[color:var(--agenda-from)]" />
                              {formatDateTime(event.startDate)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                              <Clock size={16} strokeWidth={1.5} className="text-gray-400" />
                              Duración: {formatDuration(event.startDate, event.endDate)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={event.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <PriorityBadge priority={event.priority} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleEditEvent(event)}
                              className="p-2 text-[color:var(--agenda-from)] hover:text-white
                                       hover:bg-[color:var(--agenda-from)]
                                       rounded-lg transition-all transform hover:scale-110
                                       border border-gray-200 dark:border-gray-600
                                       hover:border-[color:var(--agenda-from)]
                                       shadow-sm hover:shadow-md"
                              title="Editar"
                            >
                              <Pencil size={16} strokeWidth={1.5} />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event)}
                              className="p-2 text-red-600 hover:text-white hover:bg-red-600
                                       rounded-lg transition-all transform hover:scale-110
                                       border border-red-200 hover:border-red-600
                                       shadow-sm hover:shadow-md"
                              title="Eliminar"
                            >
                              <Trash2 size={16} strokeWidth={1.5} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Paginación mejorada */}
            {pagination.total > 1 && (
              <div className="flex items-center justify-between px-6 py-4 
                            bg-gradient-to-r from-gray-50 to-gray-100 
                            dark:from-gray-800 dark:to-gray-900 
                            rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Mostrando <span className="font-bold text-[color:var(--agenda-from)]">{events.length}</span> de{' '}
                  <span className="font-bold text-[color:var(--agenda-from)]">{pagination.totalRecords}</span>
                  {' '}eventos
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => changePage(pagination.current - 1)}
                    disabled={pagination.current === 1}
                    className="px-5 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200
                             rounded-xl font-semibold hover:bg-[color:var(--agenda-from)]
                             hover:text-white disabled:opacity-40
                             disabled:cursor-not-allowed transition-all transform hover:scale-105
                             shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-600
                             disabled:hover:scale-100 disabled:hover:bg-white dark:disabled:hover:bg-gray-700
                             flex items-center gap-1"
                  >
                    <ChevronLeft size={16} strokeWidth={1.5} />
                    Anterior
                  </button>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-3">
                    Página <span className="text-[color:var(--agenda-from)]">{pagination.current}</span> de{' '}
                    <span className="text-[color:var(--agenda-from)]">{pagination.total}</span>
                  </span>
                  <button
                    onClick={() => changePage(pagination.current + 1)}
                    disabled={pagination.current === pagination.total}
                    className="px-5 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200
                             rounded-xl font-semibold hover:bg-[color:var(--agenda-from)]
                             hover:text-white disabled:opacity-40
                             disabled:cursor-not-allowed transition-all transform hover:scale-105
                             shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-600
                             disabled:hover:scale-100 disabled:hover:bg-white dark:disabled:hover:bg-gray-700
                             flex items-center gap-1"
                  >
                    Siguiente
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modales */}
      <EventFormModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleSubmitCreate}
        isLoading={isSubmitting}
      />
      
      <EventFormModal
        show={showEditModal}
        event={selectedEvent}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleSubmitEdit}
        isLoading={isSubmitting}
      />
      
      <EventDetailModal
        show={showDetailModal}
        event={selectedEvent}
        onClose={() => setShowDetailModal(false)}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        onStatusChange={handleStatusChange}
        isLoading={isSubmitting}
      />
    </SmartDashboardLayout>
  );
};

export default AgendaManagement;
