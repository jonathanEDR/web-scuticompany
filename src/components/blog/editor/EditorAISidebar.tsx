/**
 * 🤖 Editor AI Sidebar
 * Panel lateral con herramientas de IA para ayudar a editores
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  FileText, 
  Lightbulb,
  Eye,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { useSEOAnalysis } from '../../../hooks/blog/useSEOAnalysis';

interface EditorAISidebarProps {
  title: string;
  content: string;
  excerpt: string;
  isOpen: boolean;
  onClose: () => void;
}

export const EditorAISidebar: React.FC<EditorAISidebarProps> = ({
  title,
  content,
  excerpt,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'seo' | 'readability' | 'suggestions'>('seo');
  
  // Hook de análisis SEO - slug temporal para análisis en vivo
  const { analysis, loading, analyzeContent } = useSEOAnalysis('draft-post', {
    liveAnalysis: true
  });

  // Analizar contenido cuando cambie (con debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title && content) {
        analyzeContent(content, title, excerpt);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, content, excerpt, analyzeContent]);

  if (!isOpen) return null;

  // Calcular puntuación de legibilidad
  const calculateReadability = () => {
    const words = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).length;
    const avgWordsPerSentence = words / (sentences || 1);
    
    let score = 100;
    if (avgWordsPerSentence > 25) score -= 20;
    if (avgWordsPerSentence > 30) score -= 15;
    if (words < 300) score -= 25;
    
    return Math.max(0, Math.min(100, score));
  };

  const readabilityScore = calculateReadability();
  const wordCount = content.split(/\s+/).filter(w => w).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-lg font-bold">Asistente IA</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-1 mt-4">
          <button
            onClick={() => setActiveTab('seo')}
            className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === 'seo'
                ? 'bg-white text-purple-600'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            🎯 SEO
          </button>
          <button
            onClick={() => setActiveTab('readability')}
            className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === 'readability'
                ? 'bg-white text-purple-600'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            📖 Legibilidad
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === 'suggestions'
                ? 'bg-white text-purple-600'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            💡 Sugerencias
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="space-y-4">
            {/* Puntuación General */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Puntuación SEO
                </span>
                <span className={`text-2xl font-bold ${
                  (analysis?.overallScore || 0) >= 80 ? 'text-green-600' :
                  (analysis?.overallScore || 0) >= 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {analysis?.overallScore || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    (analysis?.overallScore || 0) >= 80 ? 'bg-green-600' :
                    (analysis?.overallScore || 0) >= 60 ? 'bg-yellow-600' :
                    'bg-red-600'
                  }`}
                  style={{ width: `${analysis?.overallScore || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Análisis de Título */}
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Título
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Longitud:</span>
                  <span className={`font-medium ${
                    title.length >= 50 && title.length <= 60 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {title.length} caracteres
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  {title.length >= 50 && title.length <= 60 ? (
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {title.length < 50 ? 'El título es muy corto. Ideal: 50-60 caracteres.' :
                     title.length > 60 ? 'El título es muy largo. Ideal: 50-60 caracteres.' :
                     '¡Perfecto! Longitud ideal para SEO.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Análisis de Descripción */}
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Descripción
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Longitud:</span>
                  <span className={`font-medium ${
                    excerpt.length >= 120 && excerpt.length <= 160 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {excerpt.length} caracteres
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  {excerpt.length >= 120 && excerpt.length <= 160 ? (
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {excerpt.length < 120 ? 'La descripción es muy corta. Ideal: 120-160 caracteres.' :
                     excerpt.length > 160 ? 'La descripción es muy larga. Ideal: 120-160 caracteres.' :
                     '¡Perfecto! Longitud ideal para SEO.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Vista previa en Google */}
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Vista Previa Google
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 space-y-1">
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <span>webscuti.com</span>
                </div>
                <h4 className="text-blue-600 text-lg line-clamp-1">
                  {title || 'Título del post...'}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {excerpt || 'Descripción del post...'}
                </p>
              </div>
            </div>

            {loading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Analizando...</p>
              </div>
            )}
          </div>
        )}

        {/* Readability Tab */}
        {activeTab === 'readability' && (
          <div className="space-y-4">
            {/* Puntuación de Legibilidad */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Legibilidad
                </span>
                <span className={`text-2xl font-bold ${
                  readabilityScore >= 80 ? 'text-green-600' :
                  readabilityScore >= 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {readabilityScore}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    readabilityScore >= 80 ? 'bg-green-600' :
                    readabilityScore >= 60 ? 'bg-yellow-600' :
                    'bg-red-600'
                  }`}
                  style={{ width: `${readabilityScore}%` }}
                ></div>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Palabras</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{wordCount}</div>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Lectura</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{readingTime}m</div>
              </div>
            </div>

            {/* Recomendaciones */}
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Recomendaciones
              </h3>
              <div className="space-y-2">
                {wordCount < 300 && (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      El contenido es muy corto. Se recomienda al menos 300 palabras.
                    </span>
                  </div>
                )}
                {wordCount >= 300 && wordCount < 600 && (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Buena longitud para un post de blog.
                    </span>
                  </div>
                )}
                {wordCount >= 600 && (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      ¡Excelente! Contenido extenso y detallado.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Suggestions Tab */}
        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                Sugerencias de Mejora
              </h3>
              <div className="space-y-3">
                {analysis?.recommendations?.slice(0, 5).map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      rec.type === 'CRITICAL' ? 'bg-red-500' :
                      rec.type === 'HIGH' ? 'bg-orange-500' :
                      rec.type === 'MEDIUM' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {rec.issue}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {rec.suggestion}
                      </p>
                    </div>
                  </div>
                )) || (
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
                    Completa el título y contenido para recibir sugerencias personalizadas
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorAISidebar;
