/**
 * ✍️ Services Generation Panel
 * Panel para generación de contenido con IA
 * Genera: Descripciones, características, beneficios, FAQs
 * Permite: Vista previa, copiar, aplicar directamente al formulario
 * 
 * ⚡ Optimizaciones:
 * - React.memo() para evitar re-renders innecesarios
 * - useCallback para handlers
 */

import React, { useState, memo } from 'react';
import { FileText, Sparkles, Copy, Check, Loader2, RefreshCw, Eye } from 'lucide-react';
import { useServicesCanvasContext } from '../../../contexts/ServicesCanvasContext';

type GenerationType = 'full_description' | 'short_description' | 'features' | 'benefits' | 'faq';
type GenerationStyle = 'formal' | 'casual' | 'technical';

const ServicesGenerationPanel: React.FC = memo(() => {
  const { 
    isLoading, 
    generatedContent,
    currentService,
    generateContent,
    error,
    clearError 
  } = useServicesCanvasContext();
  
  const [selectedType, setSelectedType] = useState<GenerationType>('full_description');
  const [selectedStyle, setSelectedStyle] = useState<GenerationStyle>('formal');
  const [generating, setGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [previewContent, setPreviewContent] = useState<string>('');

  // ============================================
  // CONFIGURACIÓN DE TIPOS
  // ============================================

  const contentTypes = [
    {
      id: 'full_description' as GenerationType,
      label: 'Descripción Completa',
      icon: '📄',
      description: 'Descripción detallada del servicio (200-400 palabras)'
    },
    {
      id: 'short_description' as GenerationType,
      label: 'Descripción Corta',
      icon: '📝',
      description: 'Resumen breve y atractivo (50-100 palabras)'
    },
    {
      id: 'features' as GenerationType,
      label: 'Características',
      icon: '⭐',
      description: 'Lista de características técnicas y funcionales'
    },
    {
      id: 'benefits' as GenerationType,
      label: 'Beneficios',
      icon: '💎',
      description: 'Beneficios y valor para el cliente'
    },
    {
      id: 'faq' as GenerationType,
      label: 'Preguntas Frecuentes',
      icon: '❓',
      description: 'FAQs comunes sobre el servicio'
    }
  ];

  const styles = [
    {
      id: 'formal' as GenerationStyle,
      label: 'Formal',
      description: 'Profesional y corporativo'
    },
    {
      id: 'casual' as GenerationStyle,
      label: 'Casual',
      description: 'Amigable y cercano'
    },
    {
      id: 'technical' as GenerationStyle,
      label: 'Técnico',
      description: 'Detallado y específico'
    }
  ];

  // ============================================
  // HANDLERS
  // ============================================

  const handleGenerate = async () => {
    if (!currentService) return;
    
    setGenerating(true);
    setPreviewContent('');
    clearError();
    
    const result = await generateContent(selectedType, currentService, selectedStyle);
    
    if (result) {
      setPreviewContent(result.content);
    }
    
    setGenerating(false);
  };

  const handleCopy = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  // ============================================
  // RENDER ESTADOS
  // ============================================

  if (!currentService) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <div className="p-4 bg-purple-100 rounded-full mb-4">
          <FileText className="h-12 w-12 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Generación de Contenido
        </h3>
        <p className="text-center text-sm text-gray-600 max-w-md mb-6">
          Necesitas proporcionar información básica del servicio para poder 
          generar contenido con IA.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
          <p className="text-xs text-blue-800">
            💡 <strong>Tip:</strong> Completa al menos el título y una descripción 
            básica del servicio para obtener mejores resultados.
          </p>
        </div>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Generando contenido...
        </h3>
        <p className="text-sm text-gray-600 text-center max-w-md">
          Creando {contentTypes.find(t => t.id === selectedType)?.label.toLowerCase()} 
          con estilo {styles.find(s => s.id === selectedStyle)?.label.toLowerCase()}
        </p>
        <div className="mt-6 w-64 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER PRINCIPAL
  // ============================================

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Generador de Contenido</h3>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Selector de Tipo de Contenido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Contenido
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedType === type.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="font-medium text-gray-900 text-sm mb-1">
                    {type.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {type.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Estilo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Estilo de Escritura
            </label>
            <div className="grid grid-cols-3 gap-3">
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    selectedStyle === style.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900 text-sm mb-1">
                    {style.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {style.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Botón Generar */}
          <div>
            <button
              onClick={handleGenerate}
              disabled={generating || isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Generar Contenido
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
              <button
                onClick={handleGenerate}
                className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Preview del Contenido Generado */}
          {previewContent && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center text-white">
                  <Eye className="h-4 w-4 mr-2" />
                  <span className="font-medium text-sm">Vista Previa</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(previewContent, -1)}
                    className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-sm rounded transition-colors flex items-center"
                  >
                    {copiedIndex === -1 ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        Copiar
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-sm rounded transition-colors flex items-center"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Regenerar
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="prose prose-sm max-w-none">
                  <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {previewContent}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Historial de Contenido Generado */}
          {generatedContent && generatedContent.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-purple-600" />
                Contenido Generado Anteriormente ({generatedContent.length})
              </h4>
              <div className="space-y-3">
                {generatedContent.slice().reverse().map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {contentTypes.find(t => t.id === item.type)?.label || item.type}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {item.style}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(item.content, index)}
                        className="text-sm text-purple-600 hover:text-purple-700 flex items-center"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            Copiar
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {item.content}
                    </p>
                    {item.variations && item.variations.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        +{item.variations.length} variaciones disponibles
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-semibold text-blue-900 mb-2 text-sm">
              💡 Tips para mejores resultados
            </h5>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Proporciona una descripción base del servicio lo más completa posible</li>
              <li>• Prueba diferentes estilos para encontrar el tono adecuado</li>
              <li>• Regenera el contenido si no estás satisfecho con el resultado</li>
              <li>• Puedes combinar diferentes secciones generadas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});

// Agregar displayName para debugging
ServicesGenerationPanel.displayName = 'ServicesGenerationPanel';

export default ServicesGenerationPanel;
