import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import agentConfigService, { type AgentConfigData } from '../../services/agentConfigService';
import servicesAgentService from '../../services/servicesAgentService';
import { getApiUrl } from '../../utils/apiConfig';
import { 
  Settings, 
  Activity, 
  Cpu, 
  Database, 
  Brain, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  BarChart3,
  CheckCircle2,
  Info,
  ChevronRight
} from 'lucide-react';
import AgentSystemTester from '../../components/admin/AgentSystemTester';
import BasicConfigPanel from '../../components/admin/agent-config/BasicConfigPanel';
import PersonalityConfigPanel from '../../components/admin/agent-config/PersonalityConfigPanel';
import ContextConfigPanel from '../../components/admin/agent-config/ContextConfigPanel';
import ResponseConfigPanel from '../../components/admin/agent-config/ResponseConfigPanel';

// Tipos para el dashboard
interface SystemHealth {
  status: string;
  timestamp?: string;
  components?: Record<string, string>;
  metrics?: {
    total_requests: number;
    cached_responses: number;
    error_rate: number;
  };
}

interface SystemMetrics {
  data?: {
    promptSystem?: {
      templates: number;
      totalUsage: number;
      avgSuccessRate: number;
    };
    memorySystem?: {
      cachedPatterns: number;
      cachedUsers: number;
      learningQueueSize: number;
    };
    openaiService?: {
      totalRequests: number;
      cachedResponses: number;
      errorRate: number;
      avgResponseTime: number;
    };
  };
}

interface AgentConfig {
  enabled: boolean;
  status: string;
  requests: number;
}

interface AgentsConfiguration {
  [key: string]: AgentConfig;
}

// ===================================================
// PANEL CENTRAL DASHBOARD ADMINISTRATIVO - IA AGENTS
// ===================================================

const AIAgentsDashboard = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  
  // Estados principales
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [agentsConfig, setAgentsConfig] = useState<AgentsConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeConfigTab, setActiveConfigTab] = useState('basic'); // Sub-tabs de configuración

  // Estados de configuración
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);
  
  // Configuración detallada de BlogAgent (se cargará del backend)
  const [agentConfig, setAgentConfig] = useState<AgentConfigData | null>(null);

  // Estados para ServicesAgent metrics
  const [servicesAgentStatus, setServicesAgentStatus] = useState<any>(null);
  const [servicesAgentMetrics, setServicesAgentMetrics] = useState<any>(null);

  // Cargar configuración del agente al montar
  useEffect(() => {
    loadAgentConfig();
  }, []);

  const loadAgentConfig = async () => {
    try {
      console.log('🔄 Loading agent configuration...');
      const response = await agentConfigService.getConfig('blog');
      
      console.log('📡 API Response:', response);
      
      if (response.success && response.data) {
        console.log('✅ Agent config loaded successfully:', response.data);
        console.log('🎭 Personality archetype:', response.data.personality?.archetype);
        console.log('🌡️ Temperature:', response.data.config?.temperature);
        setAgentConfig(response.data);
      } else {
        console.error('❌ Failed to load config:', response);
        console.warn('⚠️ No agent config found, will use defaults');
        // Crear configuración por defecto para el frontend
        const defaultConfig: AgentConfigData = {
          agentName: 'blog',
          enabled: true,
          config: {
            timeout: 30,
            maxTokens: 2000,
            temperature: 0.7,
            maxTagsPerPost: 10,
            minContentLength: 300,
            seoScoreThreshold: 70,
            autoOptimization: true,
            // Configuración de sugerencias automáticas
            autoSuggestions: true,
            suggestionDebounceMs: 800,
            suggestionMinLength: 10,
            suggestionContextLength: 200,
          },
          personality: {
            archetype: 'expert',
            traits: [
              { trait: 'analytical', intensity: 8 },
              { trait: 'professional', intensity: 7 },
              { trait: 'creative', intensity: 6 }
            ],
            communicationStyle: {
              tone: 'professional',
              verbosity: 'moderate',
              formality: 7,
              enthusiasm: 6,
              technicality: 7
            }
          },
          contextConfig: {
            projectInfo: {
              name: 'Web Scuti',
              type: 'tech_blog',
              domain: 'technology',
              language: 'es-ES',
              tone: 'professional_friendly'
            },
            userExpertise: 'intermediate'
          },
          responseConfig: {
            defaultLanguage: 'es-ES',
            supportedLanguages: ['es-ES', 'en-US'],
            includeExamples: true,
            includeSteps: true,
            includeMetrics: true,
            includeRecommendations: true,
            responseFormat: 'structured'
          },
          promptConfig: {
            useCustomPrompts: false,
            customSystemPrompt: '',
            promptVariables: {},
            contextWindow: 10
          }
        };
        setAgentConfig(defaultConfig);
      }
    } catch (error) {
      console.error('❌ Error loading agent config:', error);
    }
  };

  // Función para obtener datos del sistema
  const fetchSystemData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Obtener health status
      const healthResponse = await fetch(`${getApiUrl()}/agents/health`, { headers });
      const healthData = await healthResponse.json();
      setSystemHealth(healthData);

      // Obtener métricas del sistema
      const metricsResponse = await fetch(`${getApiUrl()}/agents/testing/system-metrics`, { headers });
      const metricsData = await metricsResponse.json();
      setSystemMetrics(metricsData);

      // Obtener estado y métricas del ServicesAgent
      try {
        const servicesStatusResponse = await servicesAgentService.getStatus();
        setServicesAgentStatus(servicesStatusResponse);

        const servicesMetricsResponse = await servicesAgentService.getMetrics();
        setServicesAgentMetrics(servicesMetricsResponse);
      } catch (servicesErr) {
        console.warn('⚠️ ServicesAgent not available:', servicesErr);
        // No es un error crítico, solo significa que el agente no está disponible aún
      }

      // Obtener configuración de agentes
      setAgentsConfig({
        BlogAgent: { enabled: true, status: 'active', requests: 1234 },
        SEOAgent: { enabled: true, status: 'active', requests: 0 },
        AnalyticsAgent: { enabled: false, status: 'inactive', requests: 0 },
        ServicesAgent: { 
          enabled: servicesAgentStatus?.data?.enabled || false, 
          status: servicesAgentStatus?.data?.status || 'unknown', 
          requests: servicesAgentMetrics?.data?.totalRequests || 0 
        }
      });

    } catch (err) {
      console.error('Error fetching system data:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Función de refresh manual
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSystemData();
    setIsRefreshing(false);
  };

  // Cargar datos al montar
  useEffect(() => {
    fetchSystemData();
    
    // Auto-refresh cada 30 segundos
    const interval = setInterval(fetchSystemData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Función para obtener color de estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'unhealthy':
      case 'error':
      case 'inactive':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Función para obtener icono de estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
      case 'active':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'degraded':
        return <AlertTriangle size={16} className="text-yellow-600" />;
      case 'unhealthy':
      case 'error':
      case 'inactive':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Activity size={16} className="text-gray-600" />;
    }
  };

  // Handlers para configuración de agentes
  const handleToggleAgent = async (agentId: string) => {
    if (agentId === 'blog' && agentConfig) {
      const newEnabled = !agentConfig.enabled;
      setAgentConfig(prev => prev ? { ...prev, enabled: newEnabled } : null);
      
      // Guardar automáticamente
      try {
        await agentConfigService.updateConfig('blog', {
          enabled: newEnabled
        });
      } catch (error) {
        console.error('Error toggling agent:', error);
        // Revertir en caso de error
        setAgentConfig(prev => prev ? { ...prev, enabled: !newEnabled } : null);
      }
    }
  };

  // Handler genérico para cambios de configuración en cualquier sección
  const handleConfigChange = (section: string, key: string, value: any) => {
    if (!agentConfig) return;
    
    setAgentConfig(prev => {
      if (!prev) return null;
      
      // Actualizar la sección correspondiente
      return {
        ...prev,
        [section]: typeof value === 'object' && value !== null
          ? value  // Si el value ya es el objeto completo de la sección
          : {
              ...(prev[section as keyof AgentConfigData] as any),
              [key]: value
            }
      };
    });
  };

  const handleSaveConfig = async () => {
    if (!agentConfig) return;
    
    setIsSaving(true);
    setConfigSaved(false);
    setConfigError(null);
    
    try {
      const response = await agentConfigService.updateConfig('blog', {
        enabled: agentConfig.enabled,
        config: agentConfig.config,
        personality: agentConfig.personality,
        contextConfig: agentConfig.contextConfig,
        responseConfig: agentConfig.responseConfig,
        promptConfig: agentConfig.promptConfig
      });
      
      if (response.success) {
        setConfigSaved(true);
        setTimeout(() => setConfigSaved(false), 3000);
        
        // Actualizar con la respuesta del servidor
        if (response.data) {
          setAgentConfig(response.data);
        }
      } else {
        setConfigError(response.error || 'Error al guardar configuración');
        setTimeout(() => setConfigError(null), 5000);
      }
    } catch (error) {
      console.error('Error guardando configuración:', error);
      setConfigError('Error al guardar configuración');
      setTimeout(() => setConfigError(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetConfig = async () => {
    if (!window.confirm('¿Estás seguro de que quieres restaurar la configuración a valores por defecto?')) {
      return;
    }
    
    setIsSaving(true);
    setConfigError(null);
    
    try {
      const response = await agentConfigService.resetConfig('blog');
      
      if (response.success && response.data) {
        setAgentConfig(response.data);
        setConfigSaved(true);
        setTimeout(() => setConfigSaved(false), 3000);
      } else {
        setConfigError(response.error || 'Error al resetear configuración');
        setTimeout(() => setConfigError(null), 5000);
      }
    } catch (error) {
      console.error('Error reseteando configuración:', error);
      setConfigError('Error al resetear configuración');
      setTimeout(() => setConfigError(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && !systemHealth) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando dashboard de IA...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Brain className="text-purple-600" />
            Panel Central IA
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Configuración y monitoreo del sistema de agentes inteligentes
          </p>
        </div>
      
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
      >
        <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
        {isRefreshing ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-600 dark:text-red-400" size={20} />
            <span className="font-medium text-red-900 dark:text-red-100">Error del Sistema</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Resumen General', icon: BarChart3 },
            { id: 'agents', label: 'Configurar Agentes', icon: Settings },
            { id: 'health', label: 'Estado del Sistema', icon: Activity },
            { id: 'metrics', label: 'Métricas Avanzadas', icon: Cpu },
            { id: 'testing', label: 'Testing del Sistema', icon: RefreshCw }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Estado General */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="text-blue-600 dark:text-blue-400" />
                Estado General del Sistema
              </h2>
              
              {systemHealth && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado Global</span>
                      {getStatusIcon(systemHealth.status)}
                    </div>
                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(systemHealth.status)}`}>
                      {systemHealth.status || 'unknown'}
                    </div>
                  </div>
                  
                  {systemHealth.components && Object.entries(systemHealth.components).map(([component, status]) => (
                    <div key={component} className="p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {component.replace('_', ' ')}
                        </span>
                        {getStatusIcon(status)}
                      </div>
                      <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        {status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Métricas Rápidas */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 className="text-green-600 dark:text-green-400" />
                Métricas Rápidas
              </h3>
              
              {systemHealth?.metrics && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Requests</span>
                      <span className="font-medium">{systemHealth.metrics.total_requests || 0}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cached Responses</span>
                      <span className="font-medium">{systemHealth.metrics.cached_responses || 0}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Error Rate</span>
                      <span className={`font-medium ${
                        (systemHealth.metrics.error_rate || 0) > 0.05 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {((systemHealth.metrics.error_rate || 0) * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Agentes Activos */}
            {agentsConfig && (
              <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Brain className="text-purple-600 dark:text-purple-400" />
                  Estado de Agentes
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(agentsConfig).map(([agentName, config]) => (
                    <div key={agentName} className="p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 dark:text-white">{agentName}</h4>
                        {getStatusIcon(config.status)}
                      </div>
                      
                      <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mb-2 ${getStatusColor(config.status)}`}>
                        {config.enabled ? 'Habilitado' : 'Deshabilitado'}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Requests: {config.requests}
                      </p>

                      {/* Botón de configuración */}
                      {agentName === 'BlogAgent' && (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => navigate('/dashboard/agents/blog/config')}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                          >
                            <Settings size={16} />
                            Configurar Agente
                            <ChevronRight size={16} />
                          </button>
                          <button
                            onClick={() => navigate('/dashboard/agents/blog/training')}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
                          >
                            <Brain size={16} />
                            Entrenar Agente
                          </button>
                        </div>
                      )}
                      
                      {/* Botones para SEOAgent */}
                      {agentName === 'SEOAgent' && (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => navigate('/dashboard/agents/seo/training')}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg transition-colors text-sm font-medium"
                          >
                            <Brain size={16} />
                            Entrenar Agente
                          </button>
                        </div>
                      )}
                      
                      {/* Botones para ServicesAgent */}
                      {agentName === 'ServicesAgent' && (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => navigate('/dashboard/agents/services/config')}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                          >
                            <Settings size={16} />
                            Configurar Agente
                            <ChevronRight size={16} />
                          </button>
                          <button
                            onClick={() => navigate('/dashboard/agents/services/training')}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors text-sm font-medium"
                          >
                            <Brain size={16} />
                            Entrenar Agente
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Agents Configuration Tab */}
        {activeTab === 'agents' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="text-blue-600 dark:text-blue-400" />
                Configuración de Agentes
              </h2>
              
              <div className="flex items-center gap-3">
                {configError && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                    <XCircle size={18} />
                    <span className="text-sm font-medium">{configError}</span>
                  </div>
                )}
                
                {configSaved && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                    <CheckCircle2 size={18} />
                    <span className="text-sm font-medium">Configuración guardada</span>
                  </div>
                )}
              </div>
            </div>

            {!agentConfig ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando configuración...</span>
              </div>
            ) : (
              <>
                {/* Blog Agent Header */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <Brain className="text-purple-600 dark:text-purple-400" />
                          Blog Agent
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Agente especializado en optimización de contenido de blog
                        </p>
                      </div>
                      
                      {/* Enable/Disable Toggle */}
                      <button
                        onClick={() => handleToggleAgent('blog')}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                          agentConfig.enabled ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                            agentConfig.enabled ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sub-tabs Navigation */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveConfigTab('basic')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeConfigTab === 'basic'
                          ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      Configuración Básica
                    </button>
                    <button
                      onClick={() => setActiveConfigTab('personality')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeConfigTab === 'personality'
                          ? 'border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      Personalidad
                    </button>
                    <button
                      onClick={() => setActiveConfigTab('context')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeConfigTab === 'context'
                          ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      Contexto
                    </button>
                    <button
                      onClick={() => setActiveConfigTab('response')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeConfigTab === 'response'
                          ? 'border-emerald-600 text-emerald-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Respuestas
                    </button>
                  </nav>
                </div>

                {/* Sub-tab Content */}
                <div className="mt-6">
                  {activeConfigTab === 'basic' && (
                    <BasicConfigPanel
                      config={agentConfig}
                      onConfigChange={handleConfigChange}
                      onSave={handleSaveConfig}
                      onReset={handleResetConfig}
                      isSaving={isSaving}
                    />
                  )}

                  {activeConfigTab === 'personality' && (
                    <PersonalityConfigPanel
                      config={agentConfig}
                      onConfigChange={handleConfigChange}
                      onSave={handleSaveConfig}
                      onReset={handleResetConfig}
                      isSaving={isSaving}
                    />
                  )}

                  {activeConfigTab === 'context' && (
                    <ContextConfigPanel
                      config={agentConfig}
                      onConfigChange={handleConfigChange}
                      onSave={handleSaveConfig}
                      onReset={handleResetConfig}
                      isSaving={isSaving}
                    />
                  )}

                  {activeConfigTab === 'response' && (
                    <ResponseConfigPanel
                      config={agentConfig}
                      onConfigChange={handleConfigChange}
                      onSave={handleSaveConfig}
                      onReset={handleResetConfig}
                      isSaving={isSaving}
                    />
                  )}
                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex gap-3">
                    <Info className="text-blue-600 flex-shrink-0" size={20} />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Sistema de Configuración Avanzado</p>
                      <p>
                        Este sistema te permite configurar todos los aspectos del agente: desde parámetros 
                        básicos de OpenAI hasta personalidad, contexto y formato de respuestas. Los cambios 
                        se guardan en la base de datos y persistirán entre sesiones.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Health Tab */}
        {activeTab === 'health' && systemHealth && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="text-green-600 dark:text-green-400" />
                Estado de Componentes
              </h2>
              
              <div className="space-y-4">
                {systemHealth.components && Object.entries(systemHealth.components).map(([component, status]) => (
                  <div key={component} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(status)}
                      <span className="font-medium text-gray-900 dark:text-white capitalize">{component.replace('_', ' ')}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                      {status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Database className="text-blue-600 dark:text-blue-400" />
                Información del Sistema
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Timestamp:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {systemHealth.timestamp ? new Date(systemHealth.timestamp).toLocaleString() : 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Estado Global:</span>
                  <span className={`font-medium ${
                    systemHealth.status === 'healthy' ? 'text-green-600' : 
                    systemHealth.status === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {systemHealth.status}
                  </span>
                </div>
                
                {systemHealth.metrics && (
                  <>
                    <hr className="my-3" />
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Requests:</span>
                      <span className="font-medium">{systemHealth.metrics.total_requests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cached Responses:</span>
                      <span className="font-medium">{systemHealth.metrics.cached_responses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Error Rate:</span>
                      <span className="font-medium">{(systemHealth.metrics.error_rate * 100).toFixed(2)}%</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Cpu className="text-purple-600 dark:text-purple-400" />
              Métricas Avanzadas del Sistema
            </h2>
            
            {systemMetrics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Prompt System */}
                {systemMetrics.data?.promptSystem && (
                  <div className="p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <h3 className="font-bold mb-3 text-blue-600 dark:text-blue-400">Sistema de Prompts</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Templates:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{systemMetrics.data.promptSystem.templates}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total Usage:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{systemMetrics.data.promptSystem.totalUsage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Success Rate:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {(systemMetrics.data.promptSystem.avgSuccessRate * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Memory System */}
                {systemMetrics.data?.memorySystem && (
                  <div className="p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <h3 className="font-bold mb-3 text-green-600 dark:text-green-400">Sistema de Memoria</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Cached Patterns:</span>
                        <span className="font-medium">{systemMetrics.data.memorySystem.cachedPatterns}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cached Users:</span>
                        <span className="font-medium">{systemMetrics.data.memorySystem.cachedUsers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Learning Queue:</span>
                        <span className="font-medium">{systemMetrics.data.memorySystem.learningQueueSize}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* OpenAI Service */}
                {systemMetrics.data?.openaiService && (
                  <div className="p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <h3 className="font-bold mb-3 text-purple-600 dark:text-purple-400">Servicio OpenAI</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total Requests:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{systemMetrics.data.openaiService.totalRequests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Cached:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{systemMetrics.data.openaiService.cachedResponses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Error Rate:</span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          {(systemMetrics.data.openaiService.errorRate * 100).toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Avg Response:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{systemMetrics.data.openaiService.avgResponseTime}ms</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Cpu size={48} className="mx-auto mb-4 text-gray-400" />
                <p>No hay métricas avanzadas disponibles</p>
                <p className="text-sm mt-2">Las métricas se mostrarán cuando el sistema esté en funcionamiento.</p>
              </div>
            )}
          </div>
        )}

        {/* Testing Tab */}
        {activeTab === 'testing' && (
          <AgentSystemTester />
        )}
      </div>
    </div>
  );
};

export default AIAgentsDashboard;