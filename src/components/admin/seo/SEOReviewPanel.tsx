/**
 * 👁️ SEO Review Panel
 * Panel de revisión completa de SEO con checklist interactivo
 */

import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, AlertTriangle, Loader2, RefreshCw, Download } from 'lucide-react';
import { useSEOCanvasContext } from '../../../contexts/SEOCanvasContext';

interface SEOReviewPanelProps {
  content?: string;
  title?: string;
  description?: string;
  keywords?: string[];
}

interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  priority: 'high' | 'medium' | 'low';
}

interface ReviewResult {
  overall_score: number;
  checklist: ChecklistItem[];
  critical_issues: string[];
  warnings: string[];
  recommendations: string[];
  seo_summary: {
    title_optimization: number;
    content_quality: number;
    keywords_usage: number;
    meta_tags: number;
    readability: number;
    structure: number;
  };
}

const SEOReviewPanel: React.FC<SEOReviewPanelProps> = ({
  content,
  title,
  description,
  keywords
}) => {
  const { isLoading, error, clearError, reviewContent } = useSEOCanvasContext();
  
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [autoReview, setAutoReview] = useState(false);

  // Debug: Log del contexto recibido
  useEffect(() => {
    console.log('🔍 [SEOReviewPanel] Context received:', {
      hasContent: !!content,
      hasTitle: !!title,
      hasDescription: !!description,
      hasKeywords: !!keywords,
      contentLength: content?.length || 0,
      title: title || 'N/A'
    });
  }, [content, title, description, keywords]);

  // Auto-review cuando hay contenido (solo si está habilitado)
  useEffect(() => {
    if (autoReview && content && title && !isLoading) {
      const timer = setTimeout(() => {
        handleReview();
      }, 2000); // Debounce de 2 segundos

      return () => clearTimeout(timer);
    }
  }, [content, title, description, keywords, autoReview]);

  const handleReview = async () => {
    if (!content || !title) {
      return;
    }

    clearError();
    
    try {
      // Pasar parámetros explícitos al método reviewContent
      const result = await reviewContent(content, title, description, keywords);
      
      if (result) {
        // Si el resultado tiene una estructura de review, usarla
        const reviewData: ReviewResult = result as any;
        setReviewResult(reviewData);
      }
    } catch (error) {
      console.error('Error reviewing content:', error);
    }
  };

  const getStatusIcon = (status: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'fail':
        return 'border-red-200 bg-red-50';
    }
  };

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };

    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${colors[priority]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const categories = reviewResult?.checklist 
    ? ['all', ...Array.from(new Set(reviewResult.checklist.map(item => item.category)))]
    : ['all'];

  const filteredChecklist = reviewResult?.checklist.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  ) || [];

  const handleExportReport = () => {
    if (!reviewResult) return;

    const report = `
# Reporte de Auditoría SEO

**Fecha:** ${new Date().toLocaleDateString()}
**Puntuación General:** ${reviewResult.overall_score}/100

## Resumen de Optimización

- Título: ${reviewResult.seo_summary.title_optimization}/100
- Calidad de Contenido: ${reviewResult.seo_summary.content_quality}/100
- Uso de Keywords: ${reviewResult.seo_summary.keywords_usage}/100
- Meta Tags: ${reviewResult.seo_summary.meta_tags}/100
- Legibilidad: ${reviewResult.seo_summary.readability}/100
- Estructura: ${reviewResult.seo_summary.structure}/100

## Problemas Críticos
${reviewResult.critical_issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

## Advertencias
${reviewResult.warnings.map((warning, i) => `${i + 1}. ${warning}`).join('\n')}

## Recomendaciones
${reviewResult.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

## Checklist Detallado

${reviewResult.checklist.map(item => `
### ${item.category} - ${item.item}
- Estado: ${item.status.toUpperCase()}
- Prioridad: ${item.priority.toUpperCase()}
- ${item.message}
`).join('\n')}
    `.trim();

    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-audit-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="flex flex-col h-full p-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-2">
            <XCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">Error en la revisión</span>
          </div>
          <p className="text-sm text-red-700 mb-3">{error}</p>
          <button
            onClick={handleReview}
            className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Reintentar revisión
          </button>
        </div>
      </div>
    );
  }

  if (!content || !title) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 p-4">
        <Eye className="h-12 w-12 mb-4" />
        <h3 className="text-lg font-medium mb-2">Auditoría SEO</h3>
        <p className="text-center text-sm max-w-md">
          Proporciona contenido y título para realizar una auditoría completa de SEO con checklist detallado.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <h3 className="text-lg font-medium mb-2">Ejecutando auditoría SEO...</h3>
        <p className="text-sm text-gray-600 text-center max-w-md">
          Analizando contenido, estructura, keywords y mejores prácticas
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header con controles */}
      <div className="p-4 border-b border-gray-200 bg-white space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 flex items-center">
            <Eye className="h-5 w-5 mr-2 text-blue-600" />
            Auditoría SEO
          </h3>
          <div className="flex items-center space-x-2">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={autoReview}
                onChange={(e) => setAutoReview(e.target.checked)}
                className="mr-1"
              />
              Auto-revisar
            </label>
            <button
              onClick={handleReview}
              disabled={isLoading}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Revisar ahora
            </button>
          </div>
        </div>

        {/* Filtros de categoría */}
        {reviewResult && (
          <div className="flex items-center space-x-2 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'Todos' : category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Contenido del review */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {reviewResult ? (
          <>
            {/* Score General y Acciones */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className={`text-4xl font-bold ${getScoreColor(reviewResult.overall_score)}`}>
                      {reviewResult.overall_score}
                    </div>
                    <div className="text-xs text-gray-600">Puntuación General</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <div className="text-lg font-semibold text-red-600">
                        {reviewResult.critical_issues.length}
                      </div>
                      <div className="text-xs text-gray-600">Críticos</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-yellow-600">
                        {reviewResult.warnings.length}
                      </div>
                      <div className="text-xs text-gray-600">Advertencias</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleExportReport}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm flex items-center"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Exportar
                </button>
              </div>
            </div>

            {/* Resumen de categorías */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Resumen de Optimización</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(reviewResult.seo_summary).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700 capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-sm font-semibold ${getScoreColor(value)}`}>
                      {value}/100
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Problemas Críticos */}
            {reviewResult.critical_issues.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-3 flex items-center">
                  <XCircle className="h-5 w-5 mr-2" />
                  Problemas Críticos
                </h4>
                <ul className="space-y-2">
                  {reviewResult.critical_issues.map((issue, index) => (
                    <li key={index} className="flex items-start text-sm text-red-800">
                      <span className="font-bold mr-2">{index + 1}.</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Advertencias */}
            {reviewResult.warnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Advertencias
                </h4>
                <ul className="space-y-2">
                  {reviewResult.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start text-sm text-yellow-800">
                      <span className="font-bold mr-2">{index + 1}.</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Checklist Detallado */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Checklist SEO Detallado</h4>
              {filteredChecklist.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-lg p-4 ${getStatusColor(item.status)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start space-x-3 flex-1">
                      {getStatusIcon(item.status)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium text-gray-500 uppercase">
                            {item.category}
                          </span>
                          {getPriorityBadge(item.priority)}
                        </div>
                        <h5 className="font-medium text-gray-900">{item.item}</h5>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 ml-8">{item.message}</p>
                </div>
              ))}
            </div>

            {/* Recomendaciones */}
            {reviewResult.recommendations.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Recomendaciones
                </h4>
                <ul className="space-y-2">
                  {reviewResult.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start text-sm text-blue-800">
                      <span className="font-bold mr-2">→</span>
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <Eye className="h-8 w-8 mb-2" />
            <p className="text-sm">Haz clic en "Revisar ahora" para auditar el contenido</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOReviewPanel;
