/**
 * Vista de Calendario para Eventos
 * Calendario mensual interactivo con eventos
 */

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock } from 'lucide-react';
import { StatusBadge, PriorityBadge, TypeBadge } from './EventBadges';
import { useDashboardHeaderGradient } from '../../hooks/cms/useDashboardHeaderGradient';
import type { Event } from '../../types/event';

interface CalendarViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onDateClick?: (date: Date) => void;
  onCreateEvent?: (date: Date) => void;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
}

/**
 * 📅 Vista de calendario mensual con eventos
 */
const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onEventClick,
  onDateClick,
  onCreateEvent
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Colores del tema dinámico (mismo origen que el Sidebar/CMS)
  const { colors } = useDashboardHeaderGradient();
  const themeVars = {
    '--agenda-from': colors.from,
    '--agenda-via': colors.via,
    '--agenda-to': colors.to,
  } as React.CSSProperties;

  // ========================================
  // UTILIDADES DE FECHA
  // ========================================
  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isToday = (date: Date): boolean => {
    return isSameDay(date, new Date());
  };

  const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  // ========================================
  // FILTRADO DE EVENTOS
  // ========================================
  const getEventsForDate = (date: Date): Event[] => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      return isSameDay(eventStart, date);
    });
  };

  // ========================================
  // GENERACIÓN DE DÍAS DEL CALENDARIO
  // ========================================
  const calendarDays = useMemo((): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    
    const days: CalendarDay[] = [];

    // Días del mes anterior
    const prevMonthDays = getDaysInMonth(new Date(year, month - 1));
    for (let i = firstDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthDays - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isToday(date),
        events: getEventsForDate(date)
      });
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isToday(date),
        events: getEventsForDate(date)
      });
    }

    // Días del mes siguiente para completar la semana
    const remainingDays = 42 - days.length; // 6 semanas × 7 días = 42
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isToday(date),
        events: getEventsForDate(date)
      });
    }

    return days;
  }, [currentDate, events]);

  // ========================================
  // EVENTOS DEL DÍA SELECCIONADO
  // ========================================
  const getDayEvents = useMemo(() => {
    if (!selectedDay) return [];
    return getEventsForDate(selectedDay).sort((a, b) => {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
  }, [selectedDay, events]);

  // ========================================
  // NAVEGACIÓN
  // ========================================
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(new Date());
  };

  // ========================================
  // HANDLERS
  // ========================================
  const handleDayClick = (day: CalendarDay) => {
    setSelectedDay(day.date);
    if (onDateClick) {
      onDateClick(day.date);
    }
  };

  const handleCreateEventForDay = (date: Date) => {
    if (onCreateEvent) {
      onCreateEvent(date);
    }
  };

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6" style={themeVars}>
      {/* Header de navegación */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors
                     text-gray-600 dark:text-gray-300"
            title="Mes anterior"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
            {formatMonthYear(currentDate)}
          </h2>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors
                     text-gray-600 dark:text-gray-300"
            title="Mes siguiente"
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
        <button
          onClick={goToToday}
          className="px-4 py-2 text-white rounded-lg font-medium transition-all hover:brightness-110"
          style={{ background: `linear-gradient(to right, var(--agenda-from), var(--agenda-to))` }}
        >
          Hoy
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            {/* Encabezados de días */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                <div
                  key={day}
                  className="bg-gray-50 dark:bg-gray-800 py-3 text-center text-sm font-semibold
                           text-gray-700 dark:text-gray-300"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Días del calendario */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  onClick={() => handleDayClick(day)}
                  className={`
                    min-h-24 bg-white dark:bg-gray-800 p-2 cursor-pointer
                    hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors
                    ${!day.isCurrentMonth ? 'opacity-40' : ''}
                    ${day.isToday ? 'ring-2 ring-[color:var(--agenda-from)] ring-inset' : ''}
                  `}
                  style={
                    selectedDay && isSameDay(day.date, selectedDay)
                      ? { backgroundColor: 'color-mix(in srgb, var(--agenda-from) 12%, transparent)' }
                      : undefined
                  }
                >
                  {/* Número del día */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`
                        text-sm font-medium
                        ${day.isToday
                          ? 'w-6 h-6 flex items-center justify-center rounded-full text-white'
                          : day.isCurrentMonth
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400 dark:text-gray-600'
                        }
                      `}
                      style={day.isToday ? { backgroundColor: 'var(--agenda-from)' } : undefined}
                    >
                      {day.date.getDate()}
                    </span>
                    {day.events.length > 0 && (
                      <span className="text-xs font-semibold text-[color:var(--agenda-from)]">
                        {day.events.length}
                      </span>
                    )}
                  </div>

                  {/* Eventos del día (máximo 3 visibles) */}
                  <div className="space-y-1">
                    {day.events.slice(0, 3).map((event) => (
                      <div
                        key={event._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        className="text-xs p-1 rounded truncate cursor-pointer
                                 hover:shadow-md transition-shadow"
                        style={{ 
                          backgroundColor: `${event.color}20`,
                          borderLeft: `3px solid ${event.color}`
                        }}
                        title={event.title}
                      >
                        <span className="font-medium text-gray-900 dark:text-white">
                          {event.title}
                        </span>
                      </div>
                    ))}
                    {day.events.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        +{day.events.length - 3} más
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel lateral - Eventos del día seleccionado */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sticky top-4">
            {selectedDay ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedDay.toLocaleDateString('es-ES', { 
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </h3>
                  <button
                    onClick={() => handleCreateEventForDay(selectedDay)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg
                             text-[color:var(--agenda-from)] transition-colors"
                    title="Crear evento"
                  >
                    <Plus size={18} strokeWidth={1.5} />
                  </button>
                </div>

                {getDayEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar size={40} strokeWidth={1.5} className="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                      No hay eventos este día
                    </p>
                    <button
                      onClick={() => handleCreateEventForDay(selectedDay)}
                      className="px-4 py-2 text-white rounded-lg text-sm font-medium
                               transition-all hover:brightness-110"
                      style={{ background: `linear-gradient(to right, var(--agenda-from), var(--agenda-to))` }}
                    >
                      Crear Evento
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {getDayEvents.map(event => (
                      <div
                        key={event._id}
                        onClick={() => onEventClick(event)}
                        className="p-3 border-l-4 bg-gray-50 dark:bg-gray-900 rounded-r-lg
                                 cursor-pointer hover:shadow-md transition-shadow"
                        style={{ borderLeftColor: event.color }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {event.title}
                          </h4>
                          <TypeBadge type={event.type} />
                        </div>
                        
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1.5">
                          <Clock size={14} strokeWidth={1.5} />
                          {formatTime(event.startDate)} - {formatTime(event.endDate)}
                        </div>

                        {event.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2">
                          <StatusBadge status={event.status} />
                          <PriorityBadge priority={event.priority} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Calendar size={40} strokeWidth={1.5} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-500 dark:text-gray-400">
                  Selecciona un día para ver sus eventos
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Leyenda */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                 style={{ backgroundColor: 'var(--agenda-from)' }}>
              15
            </div>
            <span className="text-gray-600 dark:text-gray-400">Hoy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border-2 border-[color:var(--agenda-from)]"></div>
            <span className="text-gray-600 dark:text-gray-400">Día actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded"
                 style={{ backgroundColor: 'color-mix(in srgb, var(--agenda-from) 12%, transparent)' }}></div>
            <span className="text-gray-600 dark:text-gray-400">Día seleccionado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
