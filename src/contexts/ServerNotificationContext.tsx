/**
 * 🔔 ServerNotificationContext
 * Contexto global para manejar notificaciones persistentes del servidor
 * (diferentes a los toast notifications locales)
 */

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import notificationService from '../services/notificationService';
import type { 
  Notification, 
  NotificationFilters,
  NotificationPriority 
} from '../services/notificationService';

// ========================================
// 🔊 SISTEMA DE SONIDO DE NOTIFICACIONES
// ========================================

/**
 * Crear y reproducir un sonido de notificación usando Web Audio API
 */
const playNotificationSound = () => {
  try {
    // Crear contexto de audio
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Crear oscilador para el tono
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Conectar: oscillator -> gain -> destination
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configurar el tono (frecuencia y tipo de onda)
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // Nota A5
    
    // Configurar el volumen con fade out
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    // Reproducir el primer tono
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
    
    // Segundo tono más alto para un sonido más agradable
    const oscillator2 = audioContext.createOscillator();
    const gainNode2 = audioContext.createGain();
    
    oscillator2.connect(gainNode2);
    gainNode2.connect(audioContext.destination);
    
    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(1320, audioContext.currentTime + 0.15); // Nota E6
    
    gainNode2.gain.setValueAtTime(0.2, audioContext.currentTime + 0.15);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    
    oscillator2.start(audioContext.currentTime + 0.15);
    oscillator2.stop(audioContext.currentTime + 0.4);
    
    // Limpiar el contexto después de que termine
    setTimeout(() => {
      audioContext.close();
    }, 500);
    
  } catch (error) {
    console.warn('[Notification Sound] Could not play notification sound:', error);
  }
};

interface ServerNotificationContextType {
  // Estado
  notifications: Notification[];
  unreadCount: number;
  urgentCount: number;
  isLoading: boolean;
  error: string | null;
  isDropdownOpen: boolean;
  soundEnabled: boolean;
  
  // Acciones
  setIsDropdownOpen: (open: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  fetchNotifications: (filters?: NotificationFilters) => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  archiveNotification: (notificationId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  playSound: () => void; // Para reproducir manualmente
  
  // Helpers
  getNotificationIcon: (tipo: string) => string;
  getPriorityColor: (prioridad: NotificationPriority) => string;
  getPriorityBgColor: (prioridad: NotificationPriority) => string;
  formatRelativeTime: (dateString: string) => string;
}

const ServerNotificationContext = createContext<ServerNotificationContextType | undefined>(undefined);

interface ServerNotificationProviderProps {
  children: ReactNode;
  pollInterval?: number; // Intervalo de polling en ms (default: 30000)
}

export function ServerNotificationProvider({ 
  children, 
  pollInterval = 30000 
}: ServerNotificationProviderProps) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const isAuthenticated = !!user && !isAuthLoading;
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [urgentCount, setUrgentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true); // Control de sonido
  
  // Ref para trackear el conteo anterior y evitar sonido en carga inicial
  const previousUnreadCountRef = useRef<number | null>(null);
  const isInitialLoadRef = useRef(true);

  /**
   * Obtener conteo de no leídas
   * Reproduce sonido si hay nuevas notificaciones
   */
  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await notificationService.getUnreadCount();
      if (response.success) {
        const newCount = response.data.count;
        
        // Solo reproducir sonido si:
        // 1. No es la carga inicial
        // 2. El sonido está habilitado
        // 3. Hay más notificaciones que antes (es una nueva notificación)
        if (
          !isInitialLoadRef.current && 
          soundEnabled && 
          previousUnreadCountRef.current !== null &&
          newCount > previousUnreadCountRef.current
        ) {
          console.log('[ServerNotificationContext] 🔔 Nueva notificación detectada, reproduciendo sonido');
          playNotificationSound();
        }
        
        // Actualizar refs para la próxima comparación
        previousUnreadCountRef.current = newCount;
        isInitialLoadRef.current = false;
        
        setUnreadCount(newCount);
        setUrgentCount(response.data.porPrioridad?.urgente || 0);
      }
    } catch (err) {
      // Silenciar errores de polling para no molestar al usuario
      console.warn('[ServerNotificationContext] Error refreshing unread count:', err);
    }
  }, [isAuthenticated, soundEnabled]);

  /**
   * Obtener notificaciones
   */
  const fetchNotifications = useCallback(async (filters: NotificationFilters = {}) => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await notificationService.getNotifications({
        ...filters,
        limit: filters.limit || 20
      });
      
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (err) {
      console.error('[ServerNotificationContext] Error fetching notifications:', err);
      setError('Error al cargar las notificaciones');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Marcar como leída
   */
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Actualizar estado local
      setNotifications(prev => 
        prev.map(n => 
          n._id === notificationId 
            ? { ...n, leido: true, leidoEn: new Date().toISOString() } 
            : n
        )
      );
      
      // Actualizar contador
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('[ServerNotificationContext] Error marking as read:', err);
      throw err;
    }
  }, []);

  /**
   * Marcar todas como leídas
   */
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      
      // Actualizar estado local
      setNotifications(prev => 
        prev.map(n => ({ ...n, leido: true, leidoEn: new Date().toISOString() }))
      );
      
      setUnreadCount(0);
      setUrgentCount(0);
    } catch (err) {
      console.error('[ServerNotificationContext] Error marking all as read:', err);
      throw err;
    }
  }, []);

  /**
   * Archivar notificación
   */
  const archiveNotification = useCallback(async (notificationId: string) => {
    try {
      await notificationService.archiveNotification(notificationId);
      
      // Remover de la lista actual
      const notification = notifications.find(n => n._id === notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      
      // Si no estaba leída, actualizar contador
      if (notification && !notification.leido) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('[ServerNotificationContext] Error archiving notification:', err);
      throw err;
    }
  }, [notifications]);

  /**
   * Eliminar notificación
   */
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      
      // Remover de la lista
      const notification = notifications.find(n => n._id === notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      
      // Si no estaba leída, actualizar contador
      if (notification && !notification.leido) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('[ServerNotificationContext] Error deleting notification:', err);
      throw err;
    }
  }, [notifications]);

  // Helpers del servicio
  const getNotificationIcon = useCallback((tipo: string) => {
    return notificationService.getNotificationIcon(tipo as any);
  }, []);

  const getPriorityColor = useCallback((prioridad: NotificationPriority) => {
    return notificationService.getPriorityColor(prioridad);
  }, []);

  const getPriorityBgColor = useCallback((prioridad: NotificationPriority) => {
    return notificationService.getPriorityBgColor(prioridad);
  }, []);

  const formatRelativeTime = useCallback((dateString: string) => {
    return notificationService.formatRelativeTime(dateString);
  }, []);

  // Cargar notificaciones iniciales cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshUnreadCount();
      fetchNotifications({ limit: 10 });
    } else {
      // Limpiar estado si no está autenticado
      setNotifications([]);
      setUnreadCount(0);
      setUrgentCount(0);
    }
  }, [isAuthenticated, user, refreshUnreadCount, fetchNotifications]);

  // Polling para actualizar conteo de no leídas
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const interval = setInterval(() => {
      refreshUnreadCount();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [isAuthenticated, user, pollInterval, refreshUnreadCount]);

  // Recargar notificaciones cuando se abre el dropdown
  useEffect(() => {
    if (isDropdownOpen && isAuthenticated) {
      fetchNotifications({ limit: 10 });
    }
  }, [isDropdownOpen, isAuthenticated, fetchNotifications]);

  // Toggle para activar/desactivar sonido
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  // Función para reproducir sonido manualmente
  const playSound = useCallback(() => {
    if (soundEnabled) {
      playNotificationSound();
    }
  }, [soundEnabled]);

  const value: ServerNotificationContextType = {
    notifications,
    unreadCount,
    urgentCount,
    isLoading,
    error,
    isDropdownOpen,
    soundEnabled,
    setIsDropdownOpen,
    setSoundEnabled,
    toggleSound,
    fetchNotifications,
    refreshUnreadCount,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    playSound,
    getNotificationIcon,
    getPriorityColor,
    getPriorityBgColor,
    formatRelativeTime
  };

  return (
    <ServerNotificationContext.Provider value={value}>
      {children}
    </ServerNotificationContext.Provider>
  );
}

export function useServerNotifications() {
  const context = useContext(ServerNotificationContext);
  if (context === undefined) {
    throw new Error('useServerNotifications must be used within a ServerNotificationProvider');
  }
  return context;
}

export default ServerNotificationContext;
