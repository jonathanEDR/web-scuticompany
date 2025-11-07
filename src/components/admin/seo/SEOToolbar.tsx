/**
 * 🛠️ SEO Toolbar
 * Barra de herramientas con modos y acciones rápidas del SEO Canvas
 * Solo disponible para Admin Dashboard
 */

import React, { useState } from 'react';
import { MessageSquare, BarChart3, FileText, Eye, Download, Trash2, Save, Zap } from 'lucide-react';
import { useSEOCanvasContext } from '../../../contexts/SEOCanvasContext';

const SEOToolbar: React.FC = () => {
  const { 
    activeMode, 
    setActiveMode, 
    quickActions, 
    canUseAdvancedFeatures,
    currentAnalysis,
    chatHistory,
    clearChatHistory,
    clearAnalysis,
    context
  } = useSEOCanvasContext();

  const [exportLoading, setExportLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Función para exportar resultados
  const handleExport = () => {
    setExportLoading(true);
    
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        mode: activeMode,
        context: context,
        analysis: currentAnalysis,
        chatHistory: chatHistory,
        postTitle: context?.postTitle || 'Sin título'
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `seo-analysis-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Notificación de éxito (puedes mejorar esto con un toast)
      console.log('✅ Análisis exportado correctamente');
    } catch (error) {
      console.error('❌ Error al exportar:', error);
    } finally {
      setExportLoading(false);
    }
  };

  // Función para guardar en localStorage
  const handleSave = () => {
    setSaveLoading(true);
    
    try {
      const saveData = {
        timestamp: new Date().toISOString(),
        mode: activeMode,
        context: context,
        analysis: currentAnalysis,
        chatHistory: chatHistory
      };

      const savedAnalyses = JSON.parse(localStorage.getItem('seo_analyses') || '[]');
      savedAnalyses.unshift(saveData);
      
      // Mantener solo los últimos 10 análisis
      if (savedAnalyses.length > 10) {
        savedAnalyses.pop();
      }
      
      localStorage.setItem('seo_analyses', JSON.stringify(savedAnalyses));
      console.log('✅ Análisis guardado en historial local');
    } catch (error) {
      console.error('❌ Error al guardar:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  // Función para limpiar todo
  const handleClearAll = () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar todo el contenido? Esta acción no se puede deshacer.')) {
      clearChatHistory();
      clearAnalysis();
      console.log('✅ Todo limpiado correctamente');
    }
  };

  const modes = [
    {
      key: 'chat',
      label: 'Chat',
      icon: MessageSquare,
      description: 'Conversación con SEO Agent'
    },
    {
      key: 'analysis',
      label: 'Análisis',
      icon: BarChart3,
      description: 'Análisis detallado de SEO'
    },
    {
      key: 'structure',
      label: 'Estructura',
      icon: FileText,
      description: 'Generar estructura de contenido'
    },
    {
      key: 'review',
      label: 'Revisión',
      icon: Eye,
      description: 'Revisión completa de SEO'
    }
  ];

  return (
    <div className="p-4 border-b border-gray-200 bg-gray-50">
      {/* Modos de trabajo */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.key;
            
            return (
              <button
                key={mode.key}
                onClick={() => setActiveMode(mode.key as any)}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }
                `}
                title={mode.description}
              >
                <Icon size={16} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Estado de permisos */}
        <div className="text-xs text-gray-500">
          {canUseAdvancedFeatures ? 'Funciones avanzadas habilitadas' : 'Acceso básico'}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-600 font-medium">Acciones:</span>
          
          {/* Botón Exportar */}
          <button
            onClick={handleExport}
            disabled={!currentAnalysis && chatHistory.length === 0}
            className={`
              flex items-center space-x-1 px-3 py-1.5 text-xs rounded-md transition-colors
              ${(currentAnalysis || chatHistory.length > 0)
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
            title="Exportar resultados a JSON"
          >
            <Download size={14} />
            <span>{exportLoading ? 'Exportando...' : 'Exportar'}</span>
          </button>
          
          {/* Botón Guardar */}
          <button
            onClick={handleSave}
            disabled={!currentAnalysis && chatHistory.length === 0}
            className={`
              flex items-center space-x-1 px-3 py-1.5 text-xs rounded-md transition-colors
              ${(currentAnalysis || chatHistory.length > 0)
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
            title="Guardar en historial local"
          >
            <Save size={14} />
            <span>{saveLoading ? 'Guardando...' : 'Guardar'}</span>
          </button>
          
          {/* Botón Limpiar */}
          <button
            onClick={handleClearAll}
            disabled={!currentAnalysis && chatHistory.length === 0}
            className={`
              flex items-center space-x-1 px-3 py-1.5 text-xs rounded-md transition-colors
              ${(currentAnalysis || chatHistory.length > 0)
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
            title="Limpiar todo"
          >
            <Trash2 size={14} />
            <span>Limpiar</span>
          </button>
          
          {/* Botón Análisis Rápido */}
          {canUseAdvancedFeatures && context?.currentContent && (
            <button
              onClick={quickActions.analyzeCurrentContent}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
              title="Análisis rápido del contenido actual"
            >
              <Zap size={14} />
              <span>Análisis Rápido</span>
            </button>
          )}
        </div>

        {/* Indicador de elementos guardados */}
        <div className="text-xs text-gray-500">
          {(() => {
            const saved = localStorage.getItem('seo_analyses');
            const count = saved ? JSON.parse(saved).length : 0;
            return count > 0 ? `${count} análisis guardados` : 'Sin análisis guardados';
          })()}
        </div>
      </div>
    </div>
  );
};

export default SEOToolbar;