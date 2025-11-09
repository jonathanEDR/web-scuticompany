/**
 * 📊 Services Analysis Panel
 * Panel de análisis de servicios con métricas y visualizaciones
 * Analiza: Calidad, SEO, Completeness, Genera recomendaciones
 * 
 * ⚡ Optimizaciones:
 * - React.memo() para evitar re-renders innecesarios
 * - useCallback para handlers
 */

import React, { useState, memo, useCallback } from 'react';
import { BarChart3, Target, TrendingUp, AlertCircle, CheckCircle, Loader2, Lightbulb, Play, Search, DollarSign, FileText, Image, Zap } from 'lucide-react';
import { useServicesCanvasContext } from '../../../contexts/ServicesCanvasContext';

const ServicesAnalysisPanel: React.FC = memo(() => {
  const { 
    isLoading, 
    currentAnalysis, 
    currentService,
    analyzeService, 
    error,
    clearError 
  } = useServicesCanvasContext();
  
  const [analyzing, setAnalyzing] = useState(false);

  // ============================================
  // HANDLERS (Memoizados con useCallback)
  // ============================================

  const handleAnalyze = useCallback(async () => {
    if (!currentService) return;
    
    setAnalyzing(true);
    clearError();
    await analyzeService(currentService);
    setAnalyzing(false);
  }, [currentService, analyzeService, clearError]);

  // ============================================
  // UTILIDADES
  // ============================================

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // const getScoreBgColor = (score: number) => {
  //   if (score >= 80) return 'bg-green-100';
  //   if (score >= 60) return 'bg-yellow-100';
  //   return 'bg-red-100';
  // };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
    }
  };

  // Obtener icono según el tipo de recomendación
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'seo': return <Search className="h-4 w-4" />;
      case 'pricing': return <DollarSign className="h-4 w-4" />;
      case 'contenido': return <FileText className="h-4 w-4" />;
      case 'visual': return <Image className="h-4 w-4" />;
      case 'conversión': return <Zap className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  // Obtener color según el tipo
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'seo': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pricing': return 'bg-green-100 text-green-700 border-green-200';
      case 'contenido': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'visual': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'conversión': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // ============================================
  // RENDER SCORE CIRCLE
  // ============================================

  const renderScoreCircle = (score: number, label: string, size: 'sm' | 'lg' = 'lg') => {
    // const circleSize = size === 'lg' ? 20 : 16;
    const strokeWidth = size === 'lg' ? 3 : 2;
    
    return (
      <div className="flex flex-col items-center">
        <div className={`relative ${size === 'lg' ? 'w-20 h-20' : 'w-16 h-16'}`}>
          <svg 
            className={`${size === 'lg' ? 'w-20 h-20' : 'w-16 h-16'} transform -rotate-90`} 
            viewBox="0 0 36 36"
          >
            {/* Background circle */}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'}
              strokeWidth={strokeWidth}
              strokeDasharray={`${score}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`${size === 'lg' ? 'text-lg' : 'text-sm'} font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
          </div>
        </div>
        <span className="text-xs text-gray-600 mt-2 text-center font-medium">{label}</span>
      </div>
    );
  };

  // ============================================
  // RENDER ESTADOS
  // ============================================

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start mb-4">
            <AlertCircle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 mb-1">Error en el análisis</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            className="w-full px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar análisis
          </button>
        </div>
      </div>
    );
  }

  if (!currentService || !currentService.serviceId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <div className="p-4 bg-purple-100 rounded-full mb-4">
          <BarChart3 className="h-12 w-12 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Análisis de Servicio
        </h3>
        <p className="text-center text-sm text-gray-600 max-w-md mb-6">
          Necesitas tener un servicio guardado para poder analizarlo. 
          Primero guarda el servicio y luego vuelve a abrir el asistente.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
          <p className="text-xs text-blue-800">
            💡 <strong>Tip:</strong> El análisis evaluará la calidad del contenido, 
            optimización SEO, completitud de la información y te dará recomendaciones específicas.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading || analyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Analizando servicio...
        </h3>
        <p className="text-sm text-gray-600 text-center max-w-md">
          Evaluando calidad, SEO, completitud y generando recomendaciones personalizadas
        </p>
        <div className="mt-6 w-64 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!currentAnalysis) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="max-w-md w-full text-center">
          <div className="p-4 bg-purple-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Target className="h-10 w-10 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Listo para analizar
          </h3>
          <p className="text-gray-600 mb-6">
            Analizaremos: <strong>{currentService.serviceTitle}</strong>
          </p>
          <button
            onClick={handleAnalyze}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Play className="h-5 w-5 mr-2" />
            Iniciar Análisis
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER RESULTADOS
  // ============================================

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Resultados del Análisis</h3>
          </div>
          <button
            onClick={handleAnalyze}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center"
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Re-analizar
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Score General + Scores Individuales */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-6 flex items-center">
            <Target className="h-5 w-5 text-purple-600 mr-2" />
            Puntuación General
          </h4>
          
          <div className="flex items-center justify-around">
            {renderScoreCircle(currentAnalysis.score, 'General', 'lg')}
            
            {currentAnalysis.seoScore !== undefined && (
              renderScoreCircle(currentAnalysis.seoScore, 'SEO', 'sm')
            )}
            
            {currentAnalysis.qualityScore !== undefined && (
              renderScoreCircle(currentAnalysis.qualityScore, 'Calidad', 'sm')
            )}
            
            {currentAnalysis.completenessScore !== undefined && (
              renderScoreCircle(currentAnalysis.completenessScore, 'Completitud', 'sm')
            )}
          </div>
        </div>

        {/* Fortalezas */}
        {currentAnalysis.strengths && currentAnalysis.strengths.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              Fortalezas ({currentAnalysis.strengths.length})
            </h4>
            <ul className="space-y-2">
              {currentAnalysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Áreas de Mejora */}
        {currentAnalysis.improvements && currentAnalysis.improvements.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              Áreas de Mejora ({currentAnalysis.improvements.length})
            </h4>
            <ul className="space-y-2">
              {currentAnalysis.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recomendaciones */}
        {currentAnalysis.recommendations && currentAnalysis.recommendations.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Lightbulb className="h-5 w-5 text-purple-600 mr-2" />
                Recomendaciones de Mejora
              </h4>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                {currentAnalysis.recommendations.length} sugerencias
              </span>
            </div>
            
            <div className="space-y-4">
              {currentAnalysis.recommendations.map((rec, index) => (
                <div 
                  key={index} 
                  className="group relative border-l-4 border-transparent hover:border-purple-500 bg-gray-50 rounded-r-lg p-5 hover:bg-white hover:shadow-md transition-all duration-200"
                >
                  {/* Header con Tipo y Prioridad */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg border ${getTypeColor(rec.type)}`}>
                        {getTypeIcon(rec.type)}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-900 block">{rec.type}</span>
                        <span className="text-xs text-gray-500">Recomendación #{index + 1}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(rec.priority)}`}>
                      Prioridad {getPriorityLabel(rec.priority)}
                    </span>
                  </div>

                  {/* Descripción */}
                  <p className="text-sm text-gray-700 leading-relaxed mb-4 pl-12">
                    {rec.description}
                  </p>

                  {/* Footer con Impacto */}
                  <div className="flex items-center justify-between pl-12 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center text-xs text-gray-600">
                        <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                        <span className="font-medium">Impacto:</span>
                        <span className="ml-1 text-green-700 font-semibold">{rec.impact}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <Target className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                        <span className="font-medium">Beneficio esperado</span>
                      </div>
                    </div>
                    
                    {/* Indicador de acción recomendada */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-purple-600 font-medium flex items-center">
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Implementar
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Nota informativa */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-blue-900 font-medium mb-1">
                    💡 Consejo profesional
                  </p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Implementa las recomendaciones de <span className="font-semibold">alta prioridad</span> primero para obtener los mejores resultados. 
                    Cada mejora incrementará significativamente la calidad y conversión de tu servicio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// Agregar displayName para debugging
ServicesAnalysisPanel.displayName = 'ServicesAnalysisPanel';

export default ServicesAnalysisPanel;
