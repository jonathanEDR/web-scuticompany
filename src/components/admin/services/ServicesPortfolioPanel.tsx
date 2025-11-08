/**
 * 💼 Services Portfolio Panel
 * Panel de análisis de portafolio de servicios
 * Muestra: Métricas generales, gaps, bundling, SWOT
 * 
 * ⚡ Optimizaciones:
 * - React.memo() para evitar re-renders innecesarios
 * - useCallback para handlers
 */

import React, { useState, useEffect, memo } from 'react';
import { Briefcase, TrendingUp, Play, Loader2, AlertTriangle, Package, Target, Shield } from 'lucide-react';
import { useServicesCanvasContext } from '../../../contexts/ServicesCanvasContext';

const ServicesPortfolioPanel: React.FC = memo(() => {
  const { 
    isLoading, 
    portfolioAnalysis,
    analyzePortfolio,
    error,
    clearError,
    allServices // 🆕 Usar servicios del contexto global
  } = useServicesCanvasContext();
  
  const [analyzing, setAnalyzing] = useState(false);

  // ============================================
  // HANDLERS
  // ============================================

  const handleAnalyze = async () => {
    setAnalyzing(true);
    clearError();
    
    // 🆕 Usar servicios del contexto global (analyzePortfolio sin parámetros usa allServices automáticamente)
    await analyzePortfolio();
    setAnalyzing(false);
  };

  // Auto-cargar al montar si hay servicios disponibles
  useEffect(() => {
    if (!portfolioAnalysis && !isLoading && allServices.length > 0) {
      // 🆕 Auto-analizar si hay servicios disponibles
      handleAnalyze();
    }
  }, [allServices.length]); // 🆕 Dependencia en allServices

  // ============================================
  // RENDER ESTADOS
  // ============================================

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 mb-1">Error en análisis de portafolio</h3>
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

  if (isLoading || analyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Analizando portafolio...
        </h3>
        <p className="text-sm text-gray-600 text-center max-w-md">
          Evaluando servicios, identificando gaps y generando recomendaciones estratégicas
        </p>
        <div className="mt-6 w-64 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!portfolioAnalysis) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="max-w-md w-full text-center">
          <div className="p-4 bg-purple-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Briefcase className="h-10 w-10 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Análisis de Portafolio
          </h3>
          <p className="text-gray-600 mb-6">
            Obtén una visión completa de tu oferta de servicios, identifica oportunidades 
            y optimiza tu estrategia.
          </p>
          <button
            onClick={handleAnalyze}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Play className="h-5 w-5 mr-2" />
            Analizar Portafolio
          </button>
          
          {/* 🆕 Estado del contexto global */}
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-left">
            <p className="text-xs text-green-800">
              <strong>📊 Contexto global:</strong> {allServices.length} servicio{allServices.length !== 1 ? 's' : ''} disponible{allServices.length !== 1 ? 's' : ''} para análisis
            </p>
          </div>
          
          <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <p className="text-xs text-blue-800">
              <strong>El análisis incluye:</strong> Métricas generales, gaps en tu oferta, 
              oportunidades de bundling y análisis SWOT de tu portafolio.
            </p>
          </div>
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
            <Briefcase className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Análisis de Portafolio</h3>
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
        {/* Métricas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Servicios</span>
              <Target className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {portfolioAnalysis.totalServices}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Categorías</span>
              <Package className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {portfolioAnalysis.categories.length}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Gaps Detectados</span>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {portfolioAnalysis.gaps.length}
            </p>
          </div>
        </div>

        {/* Gaps Identificados */}
        {portfolioAnalysis.gaps && portfolioAnalysis.gaps.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              Oportunidades en tu Oferta ({portfolioAnalysis.gaps.length})
            </h4>
            <div className="space-y-3">
              {portfolioAnalysis.gaps.map((gap, index) => (
                <div 
                  key={index} 
                  className="border border-yellow-200 bg-yellow-50 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium text-yellow-900">{gap.type}</span>
                    <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs font-medium rounded-full">
                      Oportunidad
                    </span>
                  </div>
                  <p className="text-sm text-yellow-800 mb-2">{gap.description}</p>
                  <div className="bg-yellow-100 rounded p-2 mt-2">
                    <p className="text-xs text-yellow-900">
                      <strong>💡 Sugerencia:</strong> {gap.suggestion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Oportunidades de Bundling */}
        {portfolioAnalysis.bundlingOpportunities && portfolioAnalysis.bundlingOpportunities.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 text-blue-600 mr-2" />
              Oportunidades de Paquetes ({portfolioAnalysis.bundlingOpportunities.length})
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              {portfolioAnalysis.bundlingOpportunities.map((bundle, index) => (
                <div 
                  key={index} 
                  className="border border-blue-200 bg-blue-50 rounded-lg p-4"
                >
                  <h5 className="font-semibold text-blue-900 mb-2">
                    {bundle.suggestedName}
                  </h5>
                  <div className="mb-3">
                    <p className="text-xs text-blue-700 mb-1">Incluye:</p>
                    <ul className="space-y-1">
                      {bundle.services.map((service, idx) => (
                        <li key={idx} className="text-xs text-blue-800 flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-200">
                    <div>
                      <p className="text-xs text-blue-700">Descuento sugerido</p>
                      <p className="text-sm font-semibold text-blue-900">{bundle.discount}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-700">Ingresos proyectados</p>
                      <p className="text-sm font-semibold text-blue-900">
                        S/ {bundle.projectedRevenue.toFixed(0)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Análisis SWOT */}
        {portfolioAnalysis.swotAnalysis && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 text-purple-600 mr-2" />
              Análisis SWOT
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Fortalezas */}
              <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                <h5 className="font-semibold text-green-900 mb-3 text-sm">
                  💪 Fortalezas
                </h5>
                <ul className="space-y-2">
                  {portfolioAnalysis.swotAnalysis.strengths.map((item, idx) => (
                    <li key={idx} className="text-xs text-green-800 flex items-start">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Debilidades */}
              <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                <h5 className="font-semibold text-red-900 mb-3 text-sm">
                  ⚠️ Debilidades
                </h5>
                <ul className="space-y-2">
                  {portfolioAnalysis.swotAnalysis.weaknesses.map((item, idx) => (
                    <li key={idx} className="text-xs text-red-800 flex items-start">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Oportunidades */}
              <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                <h5 className="font-semibold text-blue-900 mb-3 text-sm">
                  🎯 Oportunidades
                </h5>
                <ul className="space-y-2">
                  {portfolioAnalysis.swotAnalysis.opportunities.map((item, idx) => (
                    <li key={idx} className="text-xs text-blue-800 flex items-start">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Amenazas */}
              <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-900 mb-3 text-sm">
                  🛡️ Amenazas
                </h5>
                <ul className="space-y-2">
                  {portfolioAnalysis.swotAnalysis.threats.map((item, idx) => (
                    <li key={idx} className="text-xs text-yellow-800 flex items-start">
                      <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Recomendaciones */}
        {portfolioAnalysis.recommendations && portfolioAnalysis.recommendations.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
              Recomendaciones Estratégicas ({portfolioAnalysis.recommendations.length})
            </h4>
            <div className="space-y-3">
              {portfolioAnalysis.recommendations.map((rec, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-sm text-gray-700 flex-1">{rec}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// Agregar displayName para debugging
ServicesPortfolioPanel.displayName = 'ServicesPortfolioPanel';

export default ServicesPortfolioPanel;
