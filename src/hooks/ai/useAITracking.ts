/**
 * 📊 AI Tracking Hook
 * Hook para trackear interacciones con IA en el frontend
 */

import { useCallback, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';

interface TrackingSession {
  sessionId: string;
  userId: string;
  startTime: Date;
}

export const useAITracking = () => {
  const { getToken, userId } = useAuth();
  const sessionRef = useRef<TrackingSession | null>(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Crear sesión de tracking
  const createSession = useCallback(async (postId?: string, metadata = {}) => {
    try {
      const token = await getToken();
      
      const response = await fetch(`${API_URL}/ai/session/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          postId,
          metadata
        })
      });

      if (response.ok) {
        const data = await response.json();
        sessionRef.current = {
          sessionId: data.data.sessionId,
          userId: data.data.userId,
          startTime: new Date()
        };
        
        console.log('📊 Sesión de tracking creada:', data.data.sessionId);
        return data.data.sessionId;
      }
    } catch (error) {
      console.error('Error creando sesión de tracking:', error);
    }
    
    return null;
  }, [getToken, API_URL]);

  // Trackear nueva sugerencia (alias para compatibilidad)
  const trackSuggestion = useCallback(async (_data: {
    userInput: string;
    aiResponse: string;
    metadata?: any;
  }) => {
    // En este caso, no necesitamos crear un tracking específico
    // porque el backend ya lo hace en BlogAgent.js
    // Solo retornamos un ID temporal para la sesión actual
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    console.log('🎯 Tracking temporal creado:', tempId);
    return tempId;
  }, []);

  // Marcar sugerencia como aceptada
  const markAsAccepted = useCallback(async (trackingId: string, modifiedText?: string) => {
    try {
      const token = await getToken();
      
      const response = await fetch(`${API_URL}/ai/track/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          trackingId,
          modifiedText
        })
      });

      if (response.ok) {
        console.log('✅ Sugerencia marcada como aceptada:', trackingId);
        return true;
      }
    } catch (error) {
      console.error('Error marcando como aceptada:', error);
    }
    
    return false;
  }, [getToken, API_URL]);

  // Marcar sugerencia como rechazada
  const markAsRejected = useCallback(async (trackingId: string) => {
    try {
      const token = await getToken();
      
      const response = await fetch(`${API_URL}/ai/track/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          trackingId
        })
      });

      if (response.ok) {
        console.log('❌ Sugerencia marcada como rechazada:', trackingId);
        return true;
      }
    } catch (error) {
      console.error('Error marcando como rechazada:', error);
    }
    
    return false;
  }, [getToken, API_URL]);

  // Agregar rating
  const addRating = useCallback(async (trackingId: string, rating: number, feedback?: string) => {
    try {
      const token = await getToken();
      
      const response = await fetch(`${API_URL}/ai/track/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          trackingId,
          rating,
          feedback
        })
      });

      if (response.ok) {
        console.log(`⭐ Rating agregado: ${trackingId} - ${rating}/5`);
        return true;
      }
    } catch (error) {
      console.error('Error agregando rating:', error);
    }
    
    return false;
  }, [getToken, API_URL]);

  // Obtener estadísticas del usuario
  const getUserStats = useCallback(async (days = 30) => {
    try {
      const token = await getToken();
      
      const response = await fetch(`${API_URL}/ai/stats/user?days=${days}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
    }
    
    return null;
  }, [getToken, API_URL]);

  // Obtener sesión actual
  const getCurrentSession = useCallback(() => {
    return sessionRef.current;
  }, []);

  return {
    createSession,
    trackSuggestion,
    markAsAccepted,
    markAsRejected,
    addRating,
    getUserStats,
    getCurrentSession,
    sessionId: sessionRef.current?.sessionId || null,
    userId
  };
};