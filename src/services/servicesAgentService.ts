/**
 * API Service para ServicesAgent
 * Comunica con los 10 endpoints del ServicesAgent en el backend
 * 
 * Endpoints disponibles:
 * 1. POST /api/servicios/agent/chat - Chat interactivo
 * 2. POST /api/servicios/agent/create - Crear servicio con IA
 * 3. POST /api/servicios/:id/agent/edit - Editar servicio
 * 4. POST /api/servicios/:id/agent/analyze - Analizar servicio
 * 5. POST /api/servicios/agent/analyze-portfolio - Analizar portafolio
 * 6. POST /api/servicios/agent/suggest-pricing - Sugerir pricing
 * 7. POST /api/servicios/:id/agent/analyze-pricing - Analizar pricing
 * 8. POST /api/servicios/agent/optimize-packages - Optimizar paquetes
 * 9. GET /api/servicios/agent/metrics - Métricas del agente
 * 10. GET /api/servicios/agent/status - Estado del agente
 */

import { getApiUrl } from '../utils/apiConfig';

// ============================================
// INTERFACES DE REQUEST/RESPONSE
// ============================================

export interface ServicesAgentChatRequest {
  message: string;
  context?: {
    userId?: string;
    sessionId?: string;
    previousMessages?: Array<{ role: string; content: string }>;
  };
}

export interface ServicesAgentChatResponse {
  success: boolean;
  data?: {
    message: string;
    suggestions?: string[];
    quickActions?: Array<{ action: string; label: string }>;
    relatedServices?: any[];
  };
  metadata?: {
    sessionId: string;
    intent: string;
    processingTime: number;
    contextSize: number;
  };
  error?: string;
}

export interface ServicesAgentCreateRequest {
  prompt?: string;
  serviceData?: {
    titulo?: string;
    descripcion?: string;
    categoria?: string;
    caracteristicas?: string[];
    beneficios?: string[];
    precio?: number;
    tipoPrecio?: string;
  };
  options?: {
    autoOptimize?: boolean;
    generateSEO?: boolean;
    includeSuggestions?: boolean;
  };
}

export interface ServicesAgentCreateResponse {
  success: boolean;
  data?: {
    serviceId: string;
    service: any;
    optimizations?: any;
    suggestions?: string[];
  };
  error?: string;
}

export interface ServicesAgentEditRequest {
  optimizations?: Array<'seo' | 'description' | 'conversion' | 'structure'>;
  instructions?: string;
  autoApply?: boolean;
}

export interface ServicesAgentAnalyzeRequest {
  detailed?: boolean;
  includeRecommendations?: boolean;
  analysisType?: 'quick' | 'standard' | 'thorough' | 'exhaustive';
}

export interface ServicesAgentAnalyzeResponse {
  success: boolean;
  data?: {
    scores: {
      seo: number;
      quality: number;
      completeness: number;
      conversion: number;
      overall: number;
    };
    analysis: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
    };
    recommendations: Array<{
      type: string;
      priority: 'high' | 'medium' | 'low';
      description: string;
      impact: string;
    }>;
  };
  error?: string;
}

export interface ServicesAgentPortfolioRequest {
  categoria?: string;
  limit?: number;
  includeGaps?: boolean;
}

export interface ServicesAgentPortfolioResponse {
  success: boolean;
  data?: {
    summary: {
      totalServices: number;
      averageScore: number;
      topPerformers: any[];
      needsImprovement: any[];
    };
    gaps: Array<{
      type: string;
      description: string;
      suggestion: string;
    }>;
    recommendations: string[];
  };
  error?: string;
}

export interface ServicesAgentPricingRequest {
  serviceData: {
    titulo: string;
    descripcion: string;
    categoria?: string;
    caracteristicas?: string[];
    beneficios?: string[];
  };
  marketData?: {
    competitors?: Array<{
      name: string;
      price: number;
      features: string[];
    }>;
    targetMarket?: string;
  };
  strategy?: 'competitive' | 'premium' | 'penetration' | 'value-based';
}

export interface ServicesAgentPricingResponse {
  success: boolean;
  data?: {
    suggestedPrice: number;
    priceRange: {
      min: number;
      max: number;
      optimal: number;
    };
    strategies: Array<{
      name: string;
      price: number;
      rationale: string;
      pros: string[];
      cons: string[];
    }>;
    analysis: {
      marketPosition: string;
      competitiveness: string;
      valuePerception: string;
    };
  };
  error?: string;
}

export interface ServicesAgentMetricsResponse {
  success: boolean;
  data?: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    operationsByType: Record<string, number>;
    lastUsed: string;
    uptime: string;
  };
  error?: string;
}

export interface ServicesAgentStatusResponse {
  success: boolean;
  data?: {
    enabled: boolean;
    status: 'active' | 'inactive' | 'error';
    capabilities: string[];
    version: string;
    lastHealthCheck: string;
  };
  error?: string;
}

// ============================================
// SERVICIO API
// ============================================

class ServicesAgentService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${getApiUrl()}/servicios/agent`;
  }

  /**
   * Obtener token de autenticación de Clerk
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      const session = window.Clerk?.session;
      if (session) {
        return await session.getToken();
      }
      return null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  /**
   * Realizar fetch con autenticación
   */
  private async fetchWithAuth(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = await this.getAuthToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    // Manejar rate limiting
    if (response.status === 429) {
      throw new Error('Demasiadas solicitudes. Por favor, espera unos minutos e intenta de nuevo.');
    }

    // Manejar errores de autenticación
    if (response.status === 401) {
      throw new Error('No autenticado. Por favor, inicia sesión nuevamente.');
    }

    // Manejar errores de permisos
    if (response.status === 403) {
      throw new Error('No tienes permisos para realizar esta acción.');
    }

    return response;
  }

  /**
   * 1. Obtener estado del agente
   * GET /api/servicios/agent/status
   */
  async getStatus(): Promise<ServicesAgentStatusResponse> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}/status`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting ServicesAgent status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener estado del agente',
      };
    }
  }

  /**
   * 2. Obtener métricas del agente
   * GET /api/servicios/agent/metrics
   */
  async getMetrics(): Promise<ServicesAgentMetricsResponse> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}/metrics`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting ServicesAgent metrics:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener métricas del agente',
      };
    }
  }

  /**
   * 3. Chat con el agente
   * POST /api/servicios/agent/chat
   */
  async chat(request: ServicesAgentChatRequest): Promise<ServicesAgentChatResponse> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}/chat`, {
        method: 'POST',
        body: JSON.stringify(request),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error chatting with ServicesAgent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al comunicarse con el agente',
      };
    }
  }

  /**
   * 4. Crear servicio con IA
   * POST /api/servicios/agent/create
   */
  async createService(request: ServicesAgentCreateRequest): Promise<ServicesAgentCreateResponse> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}/create`, {
        method: 'POST',
        body: JSON.stringify(request),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating service with agent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al crear servicio',
      };
    }
  }

  /**
   * 5. Editar servicio con IA
   * POST /api/servicios/:id/agent/edit
   */
  async editService(
    serviceId: string,
    request: ServicesAgentEditRequest
  ): Promise<ServicesAgentCreateResponse> {
    try {
      const response = await this.fetchWithAuth(
        `${getApiUrl()}/servicios/${serviceId}/agent/edit`,
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error editing service with agent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al editar servicio',
      };
    }
  }

  /**
   * 6. Analizar servicio individual
   * POST /api/servicios/:id/agent/analyze
   */
  async analyzeService(
    serviceId: string,
    options?: ServicesAgentAnalyzeRequest
  ): Promise<ServicesAgentAnalyzeResponse> {
    try {
      const response = await this.fetchWithAuth(
        `${getApiUrl()}/servicios/${serviceId}/agent/analyze`,
        {
          method: 'POST',
          body: JSON.stringify(options || {}),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error analyzing service:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al analizar servicio',
      };
    }
  }

  /**
   * 7. Analizar portafolio completo
   * POST /api/servicios/agent/analyze-portfolio
   */
  async analyzePortfolio(
    request?: ServicesAgentPortfolioRequest
  ): Promise<ServicesAgentPortfolioResponse> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}/analyze-portfolio`, {
        method: 'POST',
        body: JSON.stringify(request || {}),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error analyzing portfolio:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al analizar portafolio',
      };
    }
  }

  /**
   * 8. Sugerir pricing
   * POST /api/servicios/agent/suggest-pricing
   */
  async suggestPricing(
    request: ServicesAgentPricingRequest
  ): Promise<ServicesAgentPricingResponse> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}/suggest-pricing`, {
        method: 'POST',
        body: JSON.stringify(request),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error suggesting pricing:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al sugerir pricing',
      };
    }
  }

  /**
   * 9. Analizar pricing de servicio
   * POST /api/servicios/:id/agent/analyze-pricing
   */
  async analyzePricing(
    serviceId: string,
    options?: { includeCompetitive?: boolean }
  ): Promise<ServicesAgentPricingResponse> {
    try {
      const response = await this.fetchWithAuth(
        `${getApiUrl()}/servicios/${serviceId}/agent/analyze-pricing`,
        {
          method: 'POST',
          body: JSON.stringify(options || {}),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error analyzing pricing:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al analizar pricing',
      };
    }
  }

  /**
   * 10. Optimizar paquetes
   * POST /api/servicios/agent/optimize-packages
   */
  async optimizePackages(data?: any): Promise<any> {
    try {
      const response = await this.fetchWithAuth(`${this.baseUrl}/optimize-packages`, {
        method: 'POST',
        body: JSON.stringify(data || {}),
      });
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error optimizing packages:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al optimizar paquetes',
      };
    }
  }
}

// Exportar instancia singleton
export const servicesAgentService = new ServicesAgentService();
export default servicesAgentService;
