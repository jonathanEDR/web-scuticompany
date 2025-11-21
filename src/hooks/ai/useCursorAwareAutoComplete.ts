/**
 * 🎯 CursorAwareAutoComplete Hook
 * Sistema de autocompletado que detecta la posición del cursor
 * y envía contexto específico como GitHub Copilot
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useContentGeneration } from './useContentGeneration';
import { useRateLimiter } from './useRateLimiter';
import { useSuggestionCache } from './useSuggestionCache';
import { useAITracking } from './useAITracking';

export interface CursorPosition {
  line: number;
  column: number;
  absolutePosition: number;
}

export interface ContextualSuggestion {
  text: string;
  confidence: number;
  position: CursorPosition;
  contextBefore: string;
  contextAfter: string;
}

export interface CursorAwareAutoCompleteOptions {
  enabled: boolean;
  debounceMs?: number;
  minLength?: number;
  contextLength?: number; // Caracteres antes y después del cursor
}

export const useCursorAwareAutoComplete = (options: CursorAwareAutoCompleteOptions) => {
  const {
    enabled = true,
    debounceMs = 1500,
    minLength = 30,
    contextLength = 150
  } = options;

  const { suggestAutoComplete, isGenerating } = useContentGeneration();
  
  // Rate limiting para evitar spam de requests
  const rateLimiter = useRateLimiter({
    maxRequests: 15, // 15 requests por minuto
    windowMs: 60000, // 1 minuto
    cooldownMs: 1500 // 1.5 segundos entre requests
  });

  // Cache para sugerencias
  const suggestionCache = useSuggestionCache({
    maxCacheSize: 30, // 30 sugerencias en cache
    cacheExpiration: 300000 // 5 minutos
  });

  // Hook de tracking AI
  const aiTracking = useAITracking();
  
  const [suggestion, setSuggestion] = useState<ContextualSuggestion | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<CursorPosition | null>(null);
  const [currentInteractionId, setCurrentInteractionId] = useState<string | null>(null);
  const debounceRef = useRef<number | null>(null);
  const editorRef = useRef<HTMLElement | null>(null);

  // Log solo en desarrollo
  const devLog = (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log(...args);
    }
  };

  // Log simple cuando hay sugerencia (solo en desarrollo)
  React.useEffect(() => {
    if (suggestion && import.meta.env.DEV) {
      devLog('✅ Sugerencia generada:', suggestion.text.slice(0, 50) + '...');
    }
  }, [suggestion]);

  // Detectar posición del cursor en el editor
  const detectCursorPosition = useCallback((): CursorPosition | null => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const container = range.startContainer;
    const offset = range.startOffset;

    // Obtener todo el texto hasta la posición del cursor
    const textBeforeCursor = getTextBeforeCursor(container, offset);
    
    // Calcular línea y columna
    const lines = textBeforeCursor.split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length;

    return {
      line,
      column,
      absolutePosition: textBeforeCursor.length
    };
  }, []);

  // Obtener texto antes del cursor
  const getTextBeforeCursor = (node: Node, offset: number): string => {
    let text = '';
    const walker = document.createTreeWalker(
      editorRef.current || document.body,
      NodeFilter.SHOW_TEXT
    );

    let currentNode;
    while ((currentNode = walker.nextNode())) {
      if (currentNode === node) {
        text += (currentNode.textContent || '').slice(0, offset);
        break;
      } else {
        text += currentNode.textContent || '';
      }
    }

    return text;
  };

  // Obtener contexto específico alrededor del cursor
  const getContextualContent = useCallback((fullContent: string, position: CursorPosition) => {
    const { absolutePosition } = position;
    
    // Contexto antes del cursor
    const contextBefore = fullContent.slice(
      Math.max(0, absolutePosition - contextLength),
      absolutePosition
    );

    // Contexto después del cursor
    const contextAfter = fullContent.slice(
      absolutePosition,
      Math.min(fullContent.length, absolutePosition + contextLength)
    );

    return { contextBefore, contextAfter };
  }, [contextLength]);

  // Manejar cambios en el contenido con detección de cursor
  const handleContentChange = useCallback(async (content: string, additionalContext?: any) => {
    // ✅ PRIORIDAD 1: No generar sugerencias si el editor tiene foco o está en uso
    const isEditorActive = document.activeElement?.closest('.ProseMirror') || 
                           document.activeElement?.closest('.rich-text-editor') ||
                           document.activeElement?.closest('.rich-text-editor .border-b'); // Toolbar
    
    if (isEditorActive) {
      // Limpiar sugerencias existentes si el editor está activo
      setSuggestion(null);
      setIsVisible(false);
      return;
    }

    // ✅ PRIORIDAD 2: No generar si el usuario está interactuando con la toolbar
    const isInteractingWithToolbar = document.activeElement?.closest('.rich-text-editor .border-b');
    if (isInteractingWithToolbar) {
      devLog('🛑 Toolbar activa, sugerencias deshabilitadas temporalmente');
      setSuggestion(null);
      setIsVisible(false);
      return;
    }

    if (!enabled || content.length < minLength) {
      setSuggestion(null);
      setIsVisible(false);
      return;
    }

    // Detectar posición actual del cursor
    const cursorPos = detectCursorPosition();
    if (!cursorPos) return;

    setCurrentPosition(cursorPos);

    // Limpiar debounce anterior
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce para evitar muchas llamadas
    debounceRef.current = window.setTimeout(async () => {
      try {
        // Obtener contexto específico
        const { contextBefore, contextAfter } = getContextualContent(content, cursorPos);
        
        // Solo continuar si hay contexto suficiente antes del cursor
        if (contextBefore.length < 20) return;

        // 1. VERIFICAR CACHE PRIMERO
        const cachedSuggestion = suggestionCache.getCachedSuggestion(content, additionalContext);
        if (cachedSuggestion) {
          const cachedContextualSuggestion: ContextualSuggestion = {
            text: cachedSuggestion,
            confidence: 0.95, // Alta confianza para cache hits
            position: cursorPos,
            contextBefore,
            contextAfter
          };

          // 🎯 TRACKING: Crear tracking para sugerencia del cache
          try {
            const interactionId = await aiTracking.trackSuggestion({
              userInput: contextBefore,
              aiResponse: cachedSuggestion,
              metadata: {
                cursorPosition: cursorPos,
                contextLength: contextBefore.length,
                suggestionLength: cachedSuggestion.length,
                confidence: 0.95,
                fromCache: true
              }
            });
            setCurrentInteractionId(interactionId);
            devLog('✅ Sugerencia del cache trackeada con ID:', interactionId);
          } catch (error) {
            console.error('❌ Error al trackear sugerencia del cache:', error);
          }

          setSuggestion(cachedContextualSuggestion);
          setIsVisible(true);
          devLog('⚡ Cache hit - Sugerencia instantánea');
          return;
        }

        // 2. VERIFICAR RATE LIMITING
        if (!rateLimiter.canMakeRequest()) {
          devLog('🚦 Request bloqueado por rate limiting');
          const status = rateLimiter.getStatus();
          devLog('📊 Rate limiter status:', status);
          return;
        }

        // 3. LIMPIAR CACHE EXPIRADO
        suggestionCache.cleanExpiredCache();

        // Crear prompt contextual específico
        const contextualPrompt = {
          textBeforeCursor: contextBefore,
          textAfterCursor: contextAfter,
          cursorPosition: cursorPos,
          additionalContext,
          requestType: 'cursor_completion'
        };

        devLog('🎯 Enviando contexto específico:', {
          position: cursorPos,
          beforeLength: contextBefore.length,
          afterLength: contextAfter.length,
          preview: contextBefore.slice(-50) + '|CURSOR|' + contextAfter.slice(0, 50)
        });

        // 4. REGISTRAR REQUEST EN RATE LIMITER
        rateLimiter.logRequest();

        // 5. LLAMAR A LA API con contexto específico
        const result = await suggestAutoComplete(
          contextBefore, // Solo el texto antes del cursor
          {
            ...additionalContext,
            cursorContext: contextualPrompt,
            completionType: 'contextual'
          }
        );

        if (result?.content) {
          // 6. CACHEAR LA NUEVA SUGERENCIA
          suggestionCache.cacheSuggestion(content, additionalContext, result.content);

          const contextualSuggestion: ContextualSuggestion = {
            text: result.content,
            confidence: 0.85, // Buena confianza para sugerencias frescas
            position: cursorPos,
            contextBefore,
            contextAfter
          };

          devLog('🔥 ANTES de setSuggestion:', {
            suggestion: contextualSuggestion,
            visible: isVisible
          });

          // 🎯 TRACKING: Crear tracking para la nueva sugerencia
          try {
            const interactionId = await aiTracking.trackSuggestion({
              userInput: contextBefore,
              aiResponse: result.content,
              metadata: {
                cursorPosition: cursorPos,
                contextLength: contextBefore.length,
                suggestionLength: result.content.length,
                confidence: 0.85
              }
            });
            setCurrentInteractionId(interactionId);
            devLog('✅ Sugerencia trackeada con ID:', interactionId);
          } catch (error) {
            console.error('❌ Error al trackear sugerencia:', error);
          }

          setSuggestion(contextualSuggestion);
          setIsVisible(true);

          devLog('✅ DESPUÉS de setSuggestion y setVisible(true):', {
            suggestion: result.content.slice(0, 100) + '...',
            position: cursorPos,
            shouldBeVisible: true
          });
        } else {
          devLog('❌ NO result.text:', result);
        }
      } catch (error) {
        console.error('Error generating contextual suggestion:', error);
        setSuggestion(null);
        setIsVisible(false);
      }
    }, debounceMs);
  }, [enabled, minLength, debounceMs, detectCursorPosition, getContextualContent, suggestAutoComplete]);

  // Limpiar texto de la sugerencia para inserción
  const cleanSuggestionText = useCallback((text: string): string => {
    return text
      // Remover etiquetas HTML
      .replace(/<[^>]*>/g, '')
      // Remover comillas al inicio y final
      .replace(/^["']|["']$/g, '')
      // Remover saltos de línea extra
      .replace(/\n+/g, ' ')
      // Remover espacios extra
      .replace(/\s+/g, ' ')
      // Trim espacios
      .trim();
  }, []);

  // Aceptar sugerencia en la posición específica
  const acceptSuggestion = useCallback(async () => {
    if (!suggestion) return null;

    // Limpiar el texto antes de insertar
    const cleanText = cleanSuggestionText(suggestion.text);
    
    // Insertar texto limpio en la posición específica del cursor
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const textNode = document.createTextNode(' ' + cleanText); // Agregar espacio antes
      range.insertNode(textNode);
      
      // Mover cursor al final del texto insertado
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    const acceptedText = cleanText;

    // 🎯 TRACKING: Marcar sugerencia como aceptada
    if (currentInteractionId) {
      try {
        await aiTracking.markAsAccepted(currentInteractionId);
        devLog('✅ Sugerencia marcada como aceptada en tracking');
      } catch (error) {
        console.error('❌ Error al trackear aceptación:', error);
      }
    }

    setSuggestion(null);
    setIsVisible(false);
    setCurrentInteractionId(null);
    
    devLog('✅ Texto limpio insertado:', acceptedText);
    return acceptedText;
  }, [suggestion, currentInteractionId, aiTracking, cleanSuggestionText]);

  // Rechazar sugerencia
  const rejectSuggestion = useCallback(async () => {
    // 🎯 TRACKING: Marcar sugerencia como rechazada
    if (currentInteractionId) {
      try {
        await aiTracking.markAsRejected(currentInteractionId);
        devLog('❌ Sugerencia marcada como rechazada en tracking');
      } catch (error) {
        console.error('❌ Error al trackear rechazo:', error);
      }
    }

    setSuggestion(null);
    setIsVisible(false);
    setCurrentInteractionId(null);
  }, [currentInteractionId, aiTracking]);

  // Registrar referencia del editor
  const registerEditor = useCallback((editorElement: HTMLElement) => {
    editorRef.current = editorElement;
  }, []);

  // Obtener estadísticas de performance
  const getPerformanceStats = useCallback(() => {
    return {
      rateLimiter: rateLimiter.getStatus(),
      cache: suggestionCache.getCacheStats(),
      currentSuggestion: suggestion ? {
        length: suggestion.text.length,
        confidence: suggestion.confidence,
        position: suggestion.position
      } : null
    };
  }, [rateLimiter, suggestionCache, suggestion]);

  // Limpiar recursos
  const cleanup = useCallback(() => {
    suggestionCache.clearCache();
    setSuggestion(null);
    setIsVisible(false);
  }, [suggestionCache]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    suggestion,
    isVisible,
    isGenerating,
    currentPosition,
    handleContentChange,
    acceptSuggestion,
    rejectSuggestion,
    registerEditor,
    getPerformanceStats,
    cleanup
  };
};

export default useCursorAwareAutoComplete;