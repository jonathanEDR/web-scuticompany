/**
 * 🎯 useContextAwareAutoComplete Hook
 * Extensión del autocompletado que detecta patrones #...# 
 * y genera sugerencias ultra-específicas
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { contextParser, type ContextPattern, type ParseResult } from '../parsers/contextParser';

// Extender tipo Window para Clerk
declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: () => Promise<string | null>;
      };
    };
  }
}

export interface ContextAwareSuggestion {
  text: string;
  isContextBased: boolean;
  pattern?: ContextPattern;
  confidence: number;
  source: 'pattern' | 'ai' | 'template';
}

export interface UseContextAwareAutoCompleteOptions {
  enabled?: boolean;
  onPatternDetected?: (pattern: ContextPattern) => void;
  onSuggestionGenerated?: (suggestion: ContextAwareSuggestion) => void;
}

export const useContextAwareAutoComplete = (options: UseContextAwareAutoCompleteOptions = {}) => {
  const { 
    enabled = true,
    onPatternDetected,
    onSuggestionGenerated 
  } = options;

  const [currentText, setCurrentText] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [activePattern, setActivePattern] = useState<ContextPattern | null>(null);
  const [patternSuggestions, setPatternSuggestions] = useState<string[]>([]);
  const [isTypingPattern, setIsTypingPattern] = useState(false);

  const parseTimeoutRef = useRef<number | null>(null);

  /**
   * Analizar texto y detectar patrones
   */
  const analyzeText = useCallback((text: string, cursor: number) => {
    if (!enabled) return;

    const result = contextParser.parse(text, cursor);
    setParseResult(result);

    if (result.hasContext) {
      const pattern = contextParser.getPatternAtCursor(text, cursor);
      
      if (pattern) {
        setActivePattern(pattern);
        onPatternDetected?.(pattern);
        
        if (import.meta.env.DEV) {
          console.log('🧠 [ContextAware] Patrón detectado:', pattern);
        }
      }
    } else {
      setActivePattern(null);
    }
  }, [enabled, onPatternDetected]);

  /**
   * Detectar si el usuario está escribiendo un patrón #...#
   */
  const detectTypingPattern = useCallback((text: string, cursor: number) => {
    // Buscar # abierto antes del cursor
    const textBeforeCursor = text.substring(0, cursor);
    const lastHashIndex = textBeforeCursor.lastIndexOf('#');
    
    if (lastHashIndex !== -1) {
      const textAfterHash = textBeforeCursor.substring(lastHashIndex + 1);
      
      // Verificar que no haya # de cierre
      if (!textAfterHash.includes('#')) {
        setIsTypingPattern(true);
        
        // Generar sugerencias basadas en lo que ha escrito
        const suggestions = contextParser.getSuggestions(textAfterHash);
        setPatternSuggestions(suggestions);
        
        return true;
      }
    }
    
    setIsTypingPattern(false);
    setPatternSuggestions([]);
    return false;
  }, []);

  /**
   * Manejar cambios en el contenido
   */
  const handleContentChange = useCallback((text: string, cursor?: number) => {
    setCurrentText(text);
    
    const cursorPos = cursor ?? text.length;
    setCursorPosition(cursorPos);

    // Detectar si está escribiendo un patrón
    const isTyping = detectTypingPattern(text, cursorPos);
    
    // Si no está escribiendo un patrón, analizar texto completo
    if (!isTyping) {
      // Debounce del análisis
      if (parseTimeoutRef.current) {
        clearTimeout(parseTimeoutRef.current);
      }

      parseTimeoutRef.current = window.setTimeout(() => {
        analyzeText(text, cursorPos);
      }, 300);
    }
  }, [analyzeText, detectTypingPattern]);

  /**
   * Insertar sugerencia de patrón
   */
  const insertPatternSuggestion = useCallback((suggestion: string, replaceFrom?: number) => {
    if (!replaceFrom) {
      // Encontrar la posición del último #
      const lastHashIndex = currentText.lastIndexOf('#', cursorPosition);
      replaceFrom = lastHashIndex;
    }

    if (replaceFrom !== -1) {
      const newText = 
        currentText.substring(0, replaceFrom) + 
        suggestion + 
        currentText.substring(cursorPosition);
      
      setCurrentText(newText);
      setCursorPosition(replaceFrom + suggestion.length);
      
      // Analizar el nuevo patrón
      setTimeout(() => {
        analyzeText(newText, replaceFrom + suggestion.length);
      }, 100);
      
      return newText;
    }
    
    return currentText;
  }, [currentText, cursorPosition, analyzeText]);

  /**
   * Generar sugerencia basada en patrón (conectado con backend)
   */
  const generateContextSuggestion = useCallback(async (pattern: ContextPattern): Promise<ContextAwareSuggestion> => {
    try {
      // Obtener token de autenticación
      const token = await window.Clerk?.session?.getToken();
      
      if (!token) {
        return createTemplateSuggestion(pattern);
      }

      // Preparar datos para el backend
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const payload = {
        patternType: pattern.type,
        selectedText: pattern.contextText,
        surroundingContext: parseResult?.surroundingText.before || '',
        modifiers: pattern.modifiers || {}
      };

      if (import.meta.env.DEV) {
        console.log('🚀 [ContextAware] Enviando patrón al backend:', { 
          type: pattern.type, 
          text: pattern.contextText.substring(0, 50) + '...' 
        });
      }

      // Llamar al backend
      const response = await axios.post(
        `${API_BASE_URL}/agents/blog/process-pattern`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 segundos
        }
      );

      if (import.meta.env.DEV) {
        console.log('✅ [ContextAware] Respuesta del backend recibida');
      }

      // Crear sugerencia desde respuesta del backend
      const aiSuggestion: ContextAwareSuggestion = {
        text: response.data.data.result,
        isContextBased: true,
        pattern,
        confidence: response.data.data.confidence || 0.85,
        source: 'ai'
      };

      onSuggestionGenerated?.(aiSuggestion);
      return aiSuggestion;

    } catch (error) {
      // Fallback a template si falla
      return createTemplateSuggestion(pattern);
    }
  }, [parseResult, onSuggestionGenerated]);

  /**
   * Crear sugerencia de template (fallback)
   */
  const createTemplateSuggestion = (pattern: ContextPattern): ContextAwareSuggestion => {
    const templateSuggestion: ContextAwareSuggestion = {
      text: `[Contenido generado basado en: ${pattern.contextText}]`,
      isContextBased: true,
      pattern,
      confidence: 0.5,
      source: 'template'
    };

    onSuggestionGenerated?.(templateSuggestion);

    if (import.meta.env.DEV) {
      console.log('📄 [ContextAware] Usando sugerencia template');
    }

    return templateSuggestion;
  };

  /**
   * Aplicar sugerencia contextual
   */
  const applyContextSuggestion = useCallback((suggestion: ContextAwareSuggestion) => {
    if (!suggestion.pattern) return currentText;

    // Reemplazar el patrón con la sugerencia
    const newText = currentText.replace(
      suggestion.pattern.fullMatch,
      suggestion.text
    );

    setCurrentText(newText);
    setActivePattern(null);
    
    return newText;
  }, [currentText]);

  /**
   * Validar patrón actual
   */
  const validateCurrentPattern = useCallback(() => {
    const validation = contextParser.isValidPattern(currentText);
    return validation;
  }, [currentText]);

  /**
   * Limpiar patrones del texto
   */
  const cleanPatterns = useCallback(() => {
    const cleanText = contextParser.removePatterns(currentText);
    setCurrentText(cleanText);
    setActivePattern(null);
    setParseResult(null);
    return cleanText;
  }, [currentText]);

  /**
   * Obtener estadísticas
   */
  const getStats = useCallback(() => {
    return {
      hasPatterns: parseResult?.hasContext || false,
      patternCount: parseResult?.patterns.length || 0,
      isTypingPattern,
      activeSuggestions: patternSuggestions.length,
      currentPattern: activePattern?.contextText || null
    };
  }, [parseResult, isTypingPattern, patternSuggestions, activePattern]);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (parseTimeoutRef.current) {
        clearTimeout(parseTimeoutRef.current);
      }
    };
  }, []);

  return {
    // Estados
    currentText,
    cursorPosition,
    parseResult,
    activePattern,
    patternSuggestions,
    isTypingPattern,
    
    // Funciones
    handleContentChange,
    insertPatternSuggestion,
    generateContextSuggestion,
    applyContextSuggestion,
    validateCurrentPattern,
    cleanPatterns,
    getStats,
    
    // Utils
    hasPatterns: parseResult?.hasContext || false,
    hasActivePattern: !!activePattern
  };
};