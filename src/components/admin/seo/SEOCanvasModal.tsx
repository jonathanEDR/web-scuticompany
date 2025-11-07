/**
 * 🎯 SEO Canvas Modal
 * Modal principal del SEO Canvas para Admin Dashboard
 * 
 * 🔒 ACCESO RESTRINGIDO:
 * - Solo Admin Dashboard
 * - Requiere roles ADMIN o SUPER_ADMIN
 * - Verificación automática de permisos
 */

import React, { useEffect } from 'react';
import { X, MessageSquare, BarChart3, FileText, Eye, Settings } from 'lucide-react';
import { SEOCanvasProvider, useSEOCanvasContext } from '../../../contexts/SEOCanvasContext';
import { useAuth } from '../../../contexts/AuthContext';
import SEOChatInterface from './SEOChatInterface';
import SEOAnalysisPanel from './SEOAnalysisPanel';
import SEOStructurePanel from './SEOStructurePanel';
import SEOReviewPanel from './SEOReviewPanel';
import SEOResultsPanel from './SEOResultsPanel';
import SEOToolbar from './SEOToolbar';
import SEOHistoryPanel from './SEOHistoryPanel';
import SEOConfigPanel from './SEOConfigPanel';

interface SEOCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'chat' | 'analysis' | 'structure' | 'review' | 'config';
  postContext?: {
    postId?: string;
    title?: string;
    content?: string;
    description?: string;
    keywords?: string[];
  };
}

// Componente interno que usa el contexto
const SEOCanvasModalContent: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'chat' | 'analysis' | 'structure' | 'review' | 'config';
  postContext?: any;
}> = ({ isOpen, onClose, initialMode = 'chat', postContext }) => {
  const { role } = useAuth();
  const {
    // Estado
    isLoading,
    error,
    activeMode,
    canUseAdvancedFeatures,
    canAccessConfiguration,
    
    // Acciones
    openCanvas,
    setActiveMode,
    clearError
  } = useSEOCanvasContext(); // Usar el contexto en lugar del hook directo

  // Efecto para manejar apertura inicial - SOLO una vez cuando se abre
  useEffect(() => {
    if (isOpen) {
      const contextToPass = postContext ? {
        postId: postContext.postId,
        postTitle: postContext.title,
        currentContent: postContext.content,
        currentMeta: {
          description: postContext.description,
          keywords: postContext.keywords
        }
      } : undefined;
      
      // Forzar modo chat si no hay post y se intenta abrir en otro modo
      const modeToOpen = !postContext && (initialMode === 'analysis' || initialMode === 'review') 
        ? 'chat' 
        : initialMode;
      
      openCanvas(modeToOpen, contextToPass);
    }
  }, [isOpen]); // Solo depender de isOpen

  // Efecto para forzar modo chat si se pierde el contexto del post
  useEffect(() => {
    if (isOpen && !postContext && (activeMode === 'analysis' || activeMode === 'review')) {
      setActiveMode('chat');
    }
  }, [postContext, activeMode, isOpen]);

  // Verificar que el usuario tiene permisos de administrador
  const hasAdminAccess = role === 'ADMIN' || role === 'SUPER_ADMIN';
  const isSuperAdmin = role === 'SUPER_ADMIN';

  // Si no está abierto, no renderizar nada
  if (!isOpen) return null;

  // Verificación simplificada - Si llegamos aquí desde BlogDashboard, ya se verificaron los permisos
  // Solo verificamos a nivel de UI como backup
  if (!hasAdminAccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-red-600">Acceso Denegado</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-gray-600 mb-4">
            El SEO Canvas solo está disponible para administradores.
          </p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Obtener el ícono del modo activo
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'chat': return MessageSquare;
      case 'analysis': return BarChart3;
      case 'structure': return FileText;
      case 'review': return Eye;
      default: return MessageSquare;
    }
  };

  const ModeIcon = getModeIcon(activeMode);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ModeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                SEO Canvas
              </h2>
              <p className="text-sm text-gray-500">
                Asistente SEO inteligente • Modo: {activeMode.charAt(0).toUpperCase() + activeMode.slice(1)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Indicador de permisos */}
            <div className="flex items-center space-x-2 text-xs">
              {canUseAdvancedFeatures && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  Admin Access
                </span>
              )}
              {canAccessConfiguration && isSuperAdmin && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                  Super Admin
                </span>
              )}
            </div>
            
            {/* Botón de configuración (solo SUPER_ADMIN) */}
            {canAccessConfiguration && isSuperAdmin && (
              <button
                onClick={() => setActiveMode('review')} // Temporal, cambiaremos por modo config
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Configuración SEO"
              >
                <Settings size={20} />
              </button>
            )}
            
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className="border-b border-gray-200 bg-white">
          {!postContext && (
            <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
              <p className="text-xs text-blue-700">
                💡 <strong>Modo Chat General:</strong> Los modos Análisis, Estructura y Revisión requieren seleccionar un post específico desde el dashboard.
              </p>
            </div>
          )}
          <div className="flex space-x-1 px-4">
            {/* Tab Chat - Siempre disponible */}
            <button
              onClick={() => setActiveMode('chat')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeMode === 'chat'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MessageSquare className="inline-block h-4 w-4 mr-2" />
              Chat
            </button>
            
            {/* Tab Análisis - Requiere post */}
            <button
              onClick={() => postContext && setActiveMode('analysis')}
              disabled={!postContext}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                !postContext
                  ? 'border-transparent text-gray-300 cursor-not-allowed opacity-50'
                  : activeMode === 'analysis'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              title={!postContext ? 'Selecciona un post para usar este modo' : ''}
            >
              <BarChart3 className="inline-block h-4 w-4 mr-2" />
              Análisis
            </button>
            
            {/* Tab Estructura - Disponible siempre (puede generar sin post) */}
            <button
              onClick={() => setActiveMode('structure')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeMode === 'structure'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="inline-block h-4 w-4 mr-2" />
              Estructura
            </button>
            
            {/* Tab Revisión - Requiere post */}
            <button
              onClick={() => postContext && setActiveMode('review')}
              disabled={!postContext}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                !postContext
                  ? 'border-transparent text-gray-300 cursor-not-allowed opacity-50'
                  : activeMode === 'review'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              title={!postContext ? 'Selecciona un post para usar este modo' : ''}
            >
              <Eye className="inline-block h-4 w-4 mr-2" />
              Revisión
            </button>

            {/* Tab Configuración - Solo SUPER_ADMIN */}
            {isSuperAdmin && (
              <button
                onClick={() => setActiveMode('config')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeMode === 'config'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                title="Configuración avanzada (Solo SUPER_ADMIN)"
              >
                <Settings className="inline-block h-4 w-4 mr-2" />
                Configuración
              </button>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <SEOToolbar />

        {/* Contenido principal */}
        <div className="flex-1 flex overflow-hidden">
          {/* Panel izquierdo - Chat/Análisis/Configuración */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            {activeMode === 'chat' && <SEOChatInterface />}
            {activeMode === 'analysis' && (
              <SEOAnalysisPanel
                content={postContext?.content || ''}
                title={postContext?.title || ''}
                description={postContext?.description}
                keywords={postContext?.keywords}
              />
            )}
            {activeMode === 'structure' && (
              <SEOStructurePanel
                topic={postContext?.title}
                keywords={postContext?.keywords}
              />
            )}
            {activeMode === 'review' && (
              <SEOReviewPanel
                content={postContext?.content || ''}
                title={postContext?.title || ''}
                description={postContext?.description}
                keywords={postContext?.keywords}
              />
            )}
            {activeMode === 'config' && <SEOConfigPanel />}
          </div>

          {/* Panel derecho - Resultados */}
          <div className="w-1/2 flex flex-col">
            <SEOResultsPanel />
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Verificando permisos...</span>
            </div>
          </div>
        )}

        {/* Error Toast */}
        {error && (
          <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-md">
            <div className="flex items-center justify-between">
              <span className="text-sm">{error}</span>
              <button
                onClick={clearError}
                className="ml-2 text-red-400 hover:text-red-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Panel de historial (flotante) */}
      <SEOHistoryPanel />
    </div>
  );
};

// Componente wrapper que provee el contexto
const SEOCanvasModal: React.FC<SEOCanvasModalProps> = (props) => {
  const initialContext = props.postContext ? {
    postId: props.postContext.postId,
    postTitle: props.postContext.title,
    currentContent: props.postContext.content,
    currentMeta: {
      description: props.postContext.description,
      keywords: props.postContext.keywords
    }
  } : undefined;

  return (
    <SEOCanvasProvider initialContext={initialContext}>
      <SEOCanvasModalContent {...props} />
    </SEOCanvasProvider>
  );
};

export default SEOCanvasModal;