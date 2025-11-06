/**
 * 🎨 EnhancedEditorAISidebar Component
 * Sidebar mejorado con tabs: Análisis | Chat | Generación
 * Reemplaza el EditorAISidebar original
 */

import React, { useState } from 'react';
import { X, Brain, MessageSquare, Sparkles, Zap } from 'lucide-react';
import { AIAnalysisPanel } from '../AIAnalysisPanel';
import { ChatWithBlogAgent } from './ChatWithBlogAgent';
import { type ChatContext } from '../../../hooks/ai/useAIChat';
import { useContentGeneration } from '../../../hooks/ai/useContentGeneration';

interface EnhancedEditorAISidebarProps {
  postId?: string;
  title: string;
  content: string;
  excerpt: string;
  category?: string;
  isOpen: boolean;
  onClose: () => void;
  onTagsGenerated?: (tags: string[]) => void;
  onSEOSuggestions?: (suggestions: any) => void;
  onContentInsert?: (content: string) => void;
}

type TabType = 'analysis' | 'chat' | 'generation';

export const EnhancedEditorAISidebar: React.FC<EnhancedEditorAISidebarProps> = ({
  postId,
  title,
  content,
  excerpt: _excerpt, // No usado actualmente, pero mantenido para compatibilidad
  category,
  isOpen,
  onClose,
  onTagsGenerated,
  onSEOSuggestions,
  onContentInsert
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const {
    generateFullPost,
    generateSection,
    isGenerating,
    generatedContent,
    clearGenerated
  } = useContentGeneration();

  const [generationForm, setGenerationForm] = useState({
    type: 'full' as 'full' | 'section',
    sectionTitle: '',
    wordCount: 800,
    style: 'professional' as 'professional' | 'casual' | 'technical'
  });

  if (!isOpen) return null;

  const chatContext: ChatContext = {
    title,
    content,
    category,
    tags: []
  };

  const handleGenerateContent = async () => {
    if (generationForm.type === 'full') {
      const result = await generateFullPost(title, category || '', {
        wordCount: generationForm.wordCount,
        style: generationForm.style
      });
      
      if (result && onContentInsert) {
        onContentInsert(result.content);
      }
    } else if (generationForm.type === 'section' && generationForm.sectionTitle) {
      const result = await generateSection(
        generationForm.sectionTitle,
        content,
        generationForm.wordCount
      );
      
      if (result && onContentInsert) {
        onContentInsert(result.content);
      }
    }
  };

  const tabs = [
    { id: 'analysis' as TabType, label: 'Análisis', icon: Brain, color: 'blue' },
    { id: 'chat' as TabType, label: 'Chat IA', icon: MessageSquare, color: 'purple' },
    { id: 'generation' as TabType, label: 'Generar', icon: Sparkles, color: 'green' }
  ];

  return (
    <div className="fixed right-0 top-0 h-screen w-[500px] bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header with Tabs */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Asistente IA
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-white text-gray-900 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="h-full overflow-y-auto p-4">
            <AIAnalysisPanel
              postId={postId}
              content={content}
              title={title}
              category={category}
              onTagsGenerated={onTagsGenerated}
              onSEOSuggestions={onSEOSuggestions}
              autoAnalyze={false}
            />
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="h-full">
            <ChatWithBlogAgent
              context={chatContext}
              onApplyContent={onContentInsert}
            />
          </div>
        )}

        {/* Generation Tab */}
        {activeTab === 'generation' && (
          <div className="h-full overflow-y-auto p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Generar Contenido
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Usa el poder de la IA para crear contenido completo o secciones específicas
                </p>
              </div>

              {/* Generation Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Generación
                </label>
                <select
                  value={generationForm.type}
                  onChange={(e) => setGenerationForm({ ...generationForm, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="full">Post Completo</option>
                  <option value="section">Sección Específica</option>
                </select>
              </div>

              {/* Section Title (only if type is section) */}
              {generationForm.type === 'section' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título de la Sección
                  </label>
                  <input
                    type="text"
                    value={generationForm.sectionTitle}
                    onChange={(e) => setGenerationForm({ ...generationForm, sectionTitle: e.target.value })}
                    placeholder="Ej: Beneficios de usar IA"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              )}

              {/* Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estilo de Escritura
                </label>
                <select
                  value={generationForm.style}
                  onChange={(e) => setGenerationForm({ ...generationForm, style: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="professional">Profesional</option>
                  <option value="casual">Casual</option>
                  <option value="technical">Técnico</option>
                </select>
              </div>

              {/* Word Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Longitud aproximada (palabras)
                </label>
                <input
                  type="number"
                  value={generationForm.wordCount}
                  onChange={(e) => setGenerationForm({ ...generationForm, wordCount: parseInt(e.target.value) })}
                  min={100}
                  max={3000}
                  step={50}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Entre 100 y 3000 palabras
                </p>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateContent}
                disabled={isGenerating || (generationForm.type === 'section' && !generationForm.sectionTitle)}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generar Contenido
                  </>
                )}
              </button>

              {/* Generated Content Preview */}
              {generatedContent && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-green-900 dark:text-green-100">
                      ✅ Contenido Generado
                    </h4>
                    <button
                      onClick={clearGenerated}
                      className="text-sm text-green-700 dark:text-green-300 hover:underline"
                    >
                      Limpiar
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    El contenido ha sido insertado en el editor. Puedes editarlo según necesites.
                  </p>
                </div>
              )}

              {/* Info Box */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  💡 Consejo
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  El contenido generado es un punto de partida. Siempre revisa y personaliza el texto para que se ajuste a tu voz y audiencia.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedEditorAISidebar;
