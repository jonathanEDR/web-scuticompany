/**
 * 🤖 useServicesCanvas Hook
 * Hook para gestionar el estado y funcionalidad del Services Canvas
 * 
 * 🔒 RESTRICCIONES DE ACCESO:
 * - Solo disponible en Admin Dashboard
 * - Requiere roles ADMIN o SUPER_ADMIN
 * - Verificación automática de permisos al abrir
 */

import { useState, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import servicesAgentService from '../services/servicesAgentService';
import type {
  ServiceContext,
  ServicesChatMessage,
  ServicesAnalysisResult,
  PricingStrategy,
  GeneratedContent,
  PortfolioAnalysis
} from '../contexts/ServicesCanvasContext';
import type { Servicio } from '../types/servicios';

// ============================================
// UTILITIES
// ============================================

/**
 * Convierte un Servicio del API al formato ServiceContext para Services Canvas
 */
export const servicioToServiceContext = (servicio: Servicio): ServiceContext => ({
  serviceId: servicio._id,
  serviceTitle: servicio.titulo,
  currentDescription: servicio.descripcion || '',
  currentPrice: servicio.precio || 0,
  currency: 'USD', // Valor por defecto
  category: servicio.categoria || 'Sin categoría',
  descriptionCorta: servicio.descripcionCorta,
  caracteristicas: Array.isArray(servicio.caracteristicas) ? servicio.caracteristicas.join('\n') : servicio.caracteristicas,
  beneficios: Array.isArray(servicio.beneficios) ? servicio.beneficios?.join('\n') : servicio.beneficios,
  etiquetas: servicio.etiquetas
});

// ============================================
// TIPOS E INTERFACES
// ============================================

interface ServicesCanvasState {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  activeMode: 'chat' | 'analysis' | 'pricing' | 'generation' | 'portfolio';
  currentService: ServiceContext | null;
  allServices: ServiceContext[]; // 🆕 Servicios globales
  currentAnalysis: ServicesAnalysisResult | null;
  currentPricingStrategies: PricingStrategy[] | null;
  generatedContent: GeneratedContent[] | null;
  portfolioAnalysis: PortfolioAnalysis | null;
  chatHistory: ServicesChatMessage[];
  sessionId: string | null;
  canUseAdvancedFeatures: boolean;
  canAccessConfiguration: boolean;
}

interface UseServicesCanvasOptions {
  initialContext?: ServiceContext;
  allServices?: ServiceContext[]; // 🆕 Servicios globales
  autoSave?: boolean;
}

// ============================================
// HOOK PRINCIPAL
// ============================================

const useServicesCanvas = (options: UseServicesCanvasOptions = {}) => {
  const { role } = useAuth();
  const { initialContext, allServices = [] } = options;

  const [state, setState] = useState<ServicesCanvasState>({
    isOpen: false,
    isLoading: false,
    error: null,
    activeMode: 'chat',
    currentService: initialContext || null,
    allServices: allServices, // 🆕 Inicializar servicios globales
    currentAnalysis: null,
    currentPricingStrategies: null,
    generatedContent: null,
    portfolioAnalysis: null,
    chatHistory: [],
    sessionId: null,
    canUseAdvancedFeatures: false,
    canAccessConfiguration: false
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // ============================================
  // UTILIDADES
  // ============================================

  const generateSessionId = useCallback(() => {
    return `services_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const checkUserPermissions = useCallback(async () => {
    const hasAdminAccess = role === 'ADMIN' || role === 'SUPER_ADMIN';
    const isSuperAdmin = role === 'SUPER_ADMIN';
    
    setState(prev => ({
      ...prev,
      canAccessConfiguration: isSuperAdmin,
      canUseAdvancedFeatures: hasAdminAccess
    }));

    return { canAccessConfig: isSuperAdmin, canUseAdvanced: hasAdminAccess };
  }, [role]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // ============================================
  // GESTIÓN DE CANVAS
  // ============================================

  const openCanvas = useCallback(async (
    mode: ServicesCanvasState['activeMode'] = 'chat',
    serviceContext?: ServiceContext
  ) => {
    setState(prev => ({
      ...prev,
      isOpen: true,
      activeMode: mode,
      currentService: serviceContext || prev.currentService,
      sessionId: prev.sessionId || generateSessionId(),
      error: null,
      isLoading: false
    }));

    // Verificar permisos
    const hasAdminAccess = role === 'ADMIN' || role === 'SUPER_ADMIN';
    const isSuperAdmin = role === 'SUPER_ADMIN';

    setState(prev => ({
      ...prev,
      canAccessConfiguration: isSuperAdmin,
      canUseAdvancedFeatures: hasAdminAccess
    }));
  }, [generateSessionId, role]);

  const closeCanvas = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setState(prev => ({
      ...prev,
      isOpen: false,
      isLoading: false,
      error: null
    }));
  }, []);

  const setActiveMode = useCallback((mode: ServicesCanvasState['activeMode']) => {
    setState(prev => ({
      ...prev,
      activeMode: mode,
      error: null
    }));
  }, []);

  const updateServiceContext = useCallback((newContext: Partial<ServiceContext>) => {
    setState(prev => ({
      ...prev,
      currentService: prev.currentService ? { ...prev.currentService, ...newContext } : null
    }));
  }, []);

  // ============================================
  // CHAT
  // ============================================

  const sendChatMessage = useCallback(async (message: string): Promise<string | null> => {
    if (!message.trim()) return null;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const userMessage: ServicesChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: message,
      timestamp: new Date(),
      mode: state.activeMode
    };

    setState(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, userMessage]
    }));

    try {
      const response = await servicesAgentService.chat({
        message,
        context: {
          previousMessages: state.chatHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          sessionId: state.sessionId || undefined
        }
      });

      const assistantMessage: ServicesChatMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: response.data?.message || 'Lo siento, no pude procesar tu solicitud.',
        timestamp: new Date(),
        mode: state.activeMode
      };

      setState(prev => ({
        ...prev,
        chatHistory: [...prev.chatHistory, assistantMessage],
        isLoading: false
      }));

      return response.data?.message || null;
    } catch (error: any) {
      console.error('Error in sendChatMessage:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error al enviar mensaje'
      }));
      return null;
    }
  }, [state.activeMode, state.chatHistory, state.currentService]);

  const clearChatHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      chatHistory: [],
      sessionId: generateSessionId()
    }));
  }, [generateSessionId]);

  // ============================================
  // ANÁLISIS DE SERVICIO
  // ============================================

  const analyzeService = useCallback(async (
    serviceData: ServiceContext
  ): Promise<ServicesAnalysisResult | null> => {
    if (!serviceData.serviceId) {
      setState(prev => ({ ...prev, error: 'ID de servicio requerido para análisis' }));
      return null;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await servicesAgentService.analyzeService(serviceData.serviceId, {
        detailed: true,
        includeRecommendations: true
      });

      const data = response.data;
      const analysisResult: ServicesAnalysisResult = {
        score: data?.scores?.overall || 0,
        strengths: data?.analysis?.strengths || [],
        improvements: data?.analysis?.weaknesses || [],
        seoScore: data?.scores?.seo,
        qualityScore: data?.scores?.quality,
        completenessScore: data?.scores?.completeness,
        recommendations: data?.recommendations || []
      };

      setState(prev => ({
        ...prev,
        currentAnalysis: analysisResult,
        isLoading: false
      }));

      return analysisResult;
    } catch (error: any) {
      console.error('Error in analyzeService:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error al analizar servicio'
      }));
      return null;
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setState(prev => ({ ...prev, currentAnalysis: null }));
  }, []);

  // ============================================
  // PRICING
  // ============================================

  const analyzePricing = useCallback(async (
    serviceData: ServiceContext
  ): Promise<PricingStrategy[] | null> => {
    if (!serviceData.serviceId) {
      setState(prev => ({ ...prev, error: 'ID de servicio requerido para análisis de pricing' }));
      return null;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await servicesAgentService.analyzePricing(serviceData.serviceId);

      const strategies: PricingStrategy[] = response.data?.strategies?.map(s => ({
        name: s.name,
        price: s.price,
        rationale: s.rationale,
        pros: s.pros || [],
        cons: s.cons || [],
        recommended: false
      })) || [];

      setState(prev => ({
        ...prev,
        currentPricingStrategies: strategies,
        isLoading: false
      }));

      return strategies;
    } catch (error: any) {
      console.error('Error in analyzePricing:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error al analizar pricing'
      }));
      return null;
    }
  }, []);

  const suggestPricing = useCallback(async (
    serviceData: ServiceContext,
    marketContext?: any
  ): Promise<PricingStrategy[] | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await servicesAgentService.suggestPricing({
        serviceData: {
          titulo: serviceData.serviceTitle,
          descripcion: serviceData.currentDescription || '',
          categoria: serviceData.category
        },
        ...marketContext
      });

      const strategies: PricingStrategy[] = response.data?.strategies?.map(s => ({
        name: s.name,
        price: s.price,
        rationale: s.rationale,
        pros: s.pros || [],
        cons: s.cons || [],
        recommended: false
      })) || [];

      setState(prev => ({
        ...prev,
        currentPricingStrategies: strategies,
        isLoading: false
      }));

      return strategies;
    } catch (error: any) {
      console.error('Error in suggestPricing:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error al sugerir pricing'
      }));
      return null;
    }
  }, []);

  // ============================================
  // GENERACIÓN DE CONTENIDO
  // ============================================

  const generateContent = useCallback(async (
    type: 'full_description' | 'short_description' | 'features' | 'benefits' | 'faq',
    serviceData: ServiceContext,
    style: 'formal' | 'casual' | 'technical' = 'formal'
  ): Promise<GeneratedContent | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await servicesAgentService.createService({
        prompt: `Generar ${type} para servicio: ${serviceData.serviceTitle}`,
        serviceData: {
          titulo: serviceData.serviceTitle,
          descripcion: serviceData.currentDescription,
          categoria: serviceData.category
        },
        options: {
          autoOptimize: true,
          generateSEO: true,
          includeSuggestions: true
        }
      });

      const content: GeneratedContent = {
        type,
        content: response.data?.service?.descripcion || '',
        variations: response.data?.suggestions,
        style
      };

      setState(prev => ({
        ...prev,
        generatedContent: [...(prev.generatedContent || []), content],
        isLoading: false
      }));

      return content;
    } catch (error: any) {
      console.error('Error in generateContent:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error al generar contenido'
      }));
      return null;
    }
  }, []);

  // ============================================
  // ANÁLISIS DE PORTAFOLIO
  // ============================================

  const analyzePortfolio = useCallback(async (
    services?: ServiceContext[] // 🆕 Opcional - usa allServices si no se proporciona
  ): Promise<PortfolioAnalysis | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Usar servicios proporcionados o todos los servicios disponibles
      const servicesToAnalyze = services || state.allServices;
      
      if (!servicesToAnalyze.length) {
        throw new Error('No hay servicios disponibles para analizar');
      }

      const response = await servicesAgentService.analyzePortfolio({
        categoria: undefined,
        limit: servicesToAnalyze.length,
        includeGaps: true
      });

      const data = response.data;
      const analysis: PortfolioAnalysis = {
        totalServices: data?.summary?.totalServices || servicesToAnalyze.length,
        totalRevenue: 0, // No disponible en API actual
        categories: [], // No disponible en API actual
        gaps: data?.gaps || [],
        bundlingOpportunities: [],
        swotAnalysis: {
          strengths: [],
          weaknesses: [],
          opportunities: [],
          threats: []
        },
        recommendations: data?.recommendations || []
      };

      setState(prev => ({
        ...prev,
        portfolioAnalysis: analysis,
        isLoading: false
      }));

      return analysis;
    } catch (error: any) {
      console.error('Error in analyzePortfolio:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error al analizar portafolio'
      }));
      return null;
    }
  }, []);

  // ============================================
  // RETORNO DEL HOOK
  // ============================================

  // ============================================
  // ACTUALIZAR CONTEXTO GLOBAL
  // ============================================

  const updateAllServices = useCallback((services: ServiceContext[]) => {
    setState(prev => ({
      ...prev,
      allServices: services
    }));
  }, []);

  // ============================================
  // RETURN
  // ============================================

  return {
    // Estado
    isOpen: state.isOpen,
    isLoading: state.isLoading,
    error: state.error,
    activeMode: state.activeMode,
    currentService: state.currentService,
    allServices: state.allServices, // 🆕 Exponer servicios globales
    currentAnalysis: state.currentAnalysis,
    currentPricingStrategies: state.currentPricingStrategies,
    generatedContent: state.generatedContent,
    portfolioAnalysis: state.portfolioAnalysis,
    chatHistory: state.chatHistory,
    sessionId: state.sessionId,
    canUseAdvancedFeatures: state.canUseAdvancedFeatures,
    canAccessConfiguration: state.canAccessConfiguration,

    // Acciones de Canvas
    openCanvas,
    closeCanvas,
    setActiveMode,
    updateServiceContext,
    updateAllServices, // 🆕 Nueva acción

    // Acciones de Chat
    sendChatMessage,
    clearChatHistory,

    // Acciones de Análisis
    analyzeService,
    clearAnalysis,

    // Acciones de Pricing
    analyzePricing,
    suggestPricing,

    // Acciones de Generación
    generateContent,

    // Acciones de Portafolio
    analyzePortfolio,

    // Utilidades
    checkUserPermissions,
    clearError
  };
};

export default useServicesCanvas;
