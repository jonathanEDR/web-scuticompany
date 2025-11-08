/**
 * 🤖 Services Canvas Context
 * Context para compartir estado del Services Canvas entre componentes
 * 
 * Similar a SEOCanvasContext pero optimizado para:
 * - Análisis de servicios
 * - Estrategias de pricing
 * - Generación de contenido
 * - Análisis de portafolio
 */

import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import useServicesCanvas from '../hooks/useServicesCanvas';

// ============================================
// TIPOS E INTERFACES
// ============================================

export interface ServiceContext {
  serviceId?: string;
  serviceTitle: string;
  currentDescription: string;
  currentPrice: number;
  currency: string;
  category: string;
  descriptionCorta?: string;
  caracteristicas?: string;
  beneficios?: string;
  etiquetas?: string[];
}

export interface ServicesChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  mode?: 'chat' | 'analysis' | 'pricing' | 'generation' | 'portfolio';
}

export interface ServicesAnalysisResult {
  score: number;
  strengths: string[];
  improvements: string[]; // weaknesses del API
  seoScore?: number;
  qualityScore?: number;
  completenessScore?: number;
  recommendations: Array<{
    type: string;
    priority: 'high' | 'medium' | 'low';
    description: string;
    impact: string;
  }>;
}

export interface PricingStrategy {
  name: string;
  price: number;
  rationale: string;
  pros: string[];
  cons: string[];
  recommended?: boolean;
}

export interface GeneratedContent {
  type: 'full_description' | 'short_description' | 'features' | 'benefits' | 'faq';
  content: string;
  variations?: string[];
  style: 'formal' | 'casual' | 'technical';
}

export interface PortfolioAnalysis {
  totalServices: number;
  totalRevenue: number;
  categories: string[];
  gaps: Array<{
    type: string;
    description: string;
    suggestion: string;
  }>;
  bundlingOpportunities: Array<{
    services: string[];
    suggestedName: string;
    discount: number;
    projectedRevenue: number;
  }>;
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  recommendations: string[]; // Array simple de strings según API
}

interface ServicesCanvasContextType {
  // Estado
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  activeMode: 'chat' | 'analysis' | 'pricing' | 'generation' | 'portfolio';
  currentService: ServiceContext | null;
  allServices: ServiceContext[]; // 🆕 Contexto global de servicios
  currentAnalysis: ServicesAnalysisResult | null;
  currentPricingStrategies: PricingStrategy[] | null;
  generatedContent: GeneratedContent[] | null;
  portfolioAnalysis: PortfolioAnalysis | null;
  chatHistory: ServicesChatMessage[];
  sessionId: string | null;
  
  // Permisos
  canUseAdvancedFeatures: boolean;
  canAccessConfiguration: boolean;
  
  // Acciones de Canvas
  openCanvas: (mode?: 'chat' | 'analysis' | 'pricing' | 'generation' | 'portfolio', serviceContext?: ServiceContext) => Promise<void>;
  closeCanvas: () => void;
  setActiveMode: (mode: 'chat' | 'analysis' | 'pricing' | 'generation' | 'portfolio') => void;
  updateServiceContext: (newContext: Partial<ServiceContext>) => void;
  updateAllServices: (services: ServiceContext[]) => void; // 🆕 Actualizar contexto global
  
  // Acciones de Chat
  sendChatMessage: (message: string) => Promise<string | null>;
  clearChatHistory: () => void;
  
  // Acciones de Análisis
  analyzeService: (serviceData: ServiceContext) => Promise<ServicesAnalysisResult | null>;
  clearAnalysis: () => void;
  
  // Acciones de Pricing
  analyzePricing: (serviceData: ServiceContext) => Promise<PricingStrategy[] | null>;
  suggestPricing: (serviceData: ServiceContext, marketContext?: any) => Promise<PricingStrategy[] | null>;
  
  // Acciones de Generación
  generateContent: (
    type: 'full_description' | 'short_description' | 'features' | 'benefits' | 'faq',
    serviceData: ServiceContext,
    style?: 'formal' | 'casual' | 'technical'
  ) => Promise<GeneratedContent | null>;
  
  // Acciones de Portafolio
  analyzePortfolio: (services?: ServiceContext[]) => Promise<PortfolioAnalysis | null>;
  
  // Utilidades
  checkUserPermissions: () => Promise<any>;
  clearError: () => void;
}

// ============================================
// CONTEXT
// ============================================

const ServicesCanvasContext = createContext<ServicesCanvasContextType | undefined>(undefined);

interface ServicesCanvasProviderProps {
  children: ReactNode;
  initialContext?: ServiceContext;
  allServices?: ServiceContext[]; // 🆕 Pasar servicios globales
}

export const ServicesCanvasProvider: React.FC<ServicesCanvasProviderProps> = ({ 
  children, 
  initialContext,
  allServices = [] // 🆕 Servicios globales
}) => {
  const servicesCanvas = useServicesCanvas({ initialContext, allServices });

  return (
    <ServicesCanvasContext.Provider value={servicesCanvas}>
      {children}
    </ServicesCanvasContext.Provider>
  );
};

// ============================================
// HOOK
// ============================================

export const useServicesCanvasContext = () => {
  const context = useContext(ServicesCanvasContext);
  if (context === undefined) {
    throw new Error('useServicesCanvasContext must be used within a ServicesCanvasProvider');
  }
  return context;
};

export default ServicesCanvasContext;
