/**
 * 📊 SEO Results Panel
 * Panel para mostrar resultados de análisis y optimizaciones SEO
 * Solo disponible para Admin Dashboard
 */

import React from 'react';
import { BarChart3, CheckCircle, Target } from 'lucide-react';
import { useSEOCanvasContext } from '../../../contexts/SEOCanvasContext';

const SEOResultsPanel: React.FC = () => {
  const { currentAnalysis, activeMode, isLoading, chatHistory } = useSEOCanvasContext();

  // Renderizar resultados de chat si estamos en modo chat
  if (activeMode === 'chat' && !currentAnalysis) {
    if (chatHistory.length === 0 && !isLoading) {
      return (
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h3 className="font-medium text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Resultados SEO
            </h3>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No hay resultados disponibles</p>
              <p className="text-sm text-gray-400">
                Inicia una conversación para ver el resumen aquí
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Mostrar resumen del chat
    const assistantMessages = chatHistory.filter(msg => msg.role === 'assistant');
    const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];

    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h3 className="font-medium text-gray-900 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Resumen de Conversación
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Estadísticas de la conversación */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Estadísticas</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-gray-600 mb-1">Mensajes totales</div>
                <div className="text-2xl font-bold text-blue-600">{chatHistory.length}</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-gray-600 mb-1">Respuestas del asistente</div>
                <div className="text-2xl font-bold text-green-600">{assistantMessages.length}</div>
              </div>
            </div>
          </div>

          {/* Última respuesta del asistente */}
          {lastAssistantMessage && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Última Respuesta
              </h4>
              <div className="p-3 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                  {lastAssistantMessage.content}
                </p>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {new Date(lastAssistantMessage.timestamp).toLocaleTimeString()}
              </div>
            </div>
          )}

          {/* Acciones sugeridas para chat */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Consejo SEO</h4>
            <p className="text-sm text-blue-800">
              Para obtener análisis estructurados, selecciona un post desde el dashboard y usa los modos Análisis, Estructura o Revisión.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar contenido vacío
  if (!currentAnalysis && !isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h3 className="font-medium text-gray-900 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Resultados SEO
          </h3>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No hay resultados disponibles</p>
            <p className="text-sm text-gray-400">
              {activeMode === 'chat' 
                ? 'Inicia una conversación para ver análisis'
                : 'Ejecuta un análisis para ver los resultados aquí'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar loading
  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h3 className="font-medium text-gray-900 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Analizando...
          </h3>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Procesando análisis SEO...</p>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar resultados usando los tipos correctos
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h3 className="font-medium text-gray-900 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
          Resultados SEO
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Puntuación general */}
        {currentAnalysis?.seo_score !== undefined && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Puntuación SEO
            </h4>
            
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      currentAnalysis.seo_score >= 80 ? 'bg-green-500' :
                      currentAnalysis.seo_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${currentAnalysis.seo_score}%` }}
                  ></div>
                </div>
              </div>
              <span className="font-bold text-2xl text-gray-900">
                {currentAnalysis.seo_score}/100
              </span>
            </div>
          </div>
        )}

        {/* Palabras clave sugeridas */}
        {currentAnalysis?.suggested_keywords && currentAnalysis.suggested_keywords.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Palabras Clave Sugeridas</h4>
            <div className="flex flex-wrap gap-2">
              {currentAnalysis.suggested_keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recomendaciones */}
        {currentAnalysis?.recommendations && currentAnalysis.recommendations.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Recomendaciones
            </h4>
            
            <div className="space-y-2">
              {currentAnalysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 bg-blue-50 rounded">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-800">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Título y descripción optimizados */}
        {(currentAnalysis?.optimized_title || currentAnalysis?.optimized_description) && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Metadata Optimizada</h4>
            <div className="space-y-3">
              {currentAnalysis.optimized_title && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Título optimizado:</label>
                  <p className="text-sm text-gray-900 mt-1 p-2 bg-green-50 rounded">
                    {currentAnalysis.optimized_title}
                  </p>
                </div>
              )}
              
              {currentAnalysis.optimized_description && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Descripción optimizada:</label>
                  <p className="text-sm text-gray-900 mt-1 p-2 bg-green-50 rounded">
                    {currentAnalysis.optimized_description}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sugerencias de mejora */}
        {currentAnalysis?.improvement_suggestions && currentAnalysis.improvement_suggestions.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Sugerencias de Mejora</h4>
            <div className="space-y-2">
              {currentAnalysis.improvement_suggestions.map((suggestion, index) => (
                <div key={index} className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                  <p className="text-sm text-gray-800">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estructura del contenido */}
        {currentAnalysis?.content_structure && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Análisis de Estructura</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Encabezados:</span>
                <span className="ml-2 font-medium">{currentAnalysis.content_structure.headings.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Párrafos:</span>
                <span className="ml-2 font-medium">{currentAnalysis.content_structure.paragraphs}</span>
              </div>
              <div>
                <span className="text-gray-600">Palabras:</span>
                <span className="ml-2 font-medium">{currentAnalysis.content_structure.word_count}</span>
              </div>
              <div>
                <span className="text-gray-600">Legibilidad:</span>
                <span className="ml-2 font-medium">{currentAnalysis.content_structure.readability_score}/100</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOResultsPanel;