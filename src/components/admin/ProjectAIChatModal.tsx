/**
 * 🤖 ProjectAIChatModal
 * Modal de chat conversacional para crear proyectos con IA
 * 
 * Flujo: El usuario interactúa con el agente que guía paso a paso
 * la creación de un proyecto profesional con descripciones generadas por IA,
 * SEO optimizado, tecnologías estructuradas, etc.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import projectSessionApi from '../../services/projectSessionApi';
import type {
  ProjectSessionMessage,
  ProjectSessionAction,
  ProjectSessionQuestion,
  SendMessageResponse,
  ProjectSessionData,
} from '../../services/projectSessionApi';

interface ProjectAIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: (project: { id: string; nombre: string; slug: string }) => void;
}

const ProjectAIChatModal: React.FC<ProjectAIChatModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated,
}) => {
  // State
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ProjectSessionMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [stage, setStage] = useState('initialized');
  const [progress, setProgress] = useState(0);
  const [actions, setActions] = useState<ProjectSessionAction[]>([]);
  const [questions, setQuestions] = useState<ProjectSessionQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [createdProject, setCreatedProject] = useState<Record<string, unknown> | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when not loading
  useEffect(() => {
    if (!isLoading && !isGenerating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, isGenerating]);

  // Start session when modal opens
  useEffect(() => {
    if (isOpen && !sessionId) {
      startSession();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // ========================================
  // SESSION MANAGEMENT
  // ========================================

  const startSession = async () => {
    try {
      setIsInitializing(true);
      setError(null);
      const result = await projectSessionApi.startSession('dashboard');
      
      setSessionId(result.sessionId);
      setStage(result.context.stage);
      setProgress(result.context.progress);
      setMessages([{
        role: 'agent',
        message: result.message,
        timestamp: new Date().toISOString(),
      }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsInitializing(false);
    }
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText || !sessionId || isLoading) return;
    
    setInputValue('');
    setError(null);
    setActions([]);
    setQuestions([]);
    
    // Add user message optimistically
    const userMsg: ProjectSessionMessage = {
      role: 'user',
      message: messageText,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    
    try {
      setIsLoading(true);
      const result: SendMessageResponse = await projectSessionApi.sendMessage(sessionId, messageText);
      
      if (!result.success && result.error) {
        setError(result.error);
        return;
      }
      
      // Update state
      if (result.stage) setStage(result.stage);
      if (result.progress !== undefined) setProgress(result.progress);
      if (result.actions) setActions(result.actions);
      if (result.questions) setQuestions(result.questions);
      
      // Add agent response
      if (result.message) {
        setMessages(prev => [...prev, {
          role: 'agent',
          message: result.message,
          timestamp: new Date().toISOString(),
        }]);
      }
      
      // Handle generation trigger
      if (result.shouldGenerate || result.status === 'generating') {
        setIsGenerating(true);
        await pollForCompletion();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar mensaje');
    } finally {
      setIsLoading(false);
    }
  };

  const pollForCompletion = async () => {
    if (!sessionId) return;
    
    try {
      const finalSession = await projectSessionApi.pollSessionUntilComplete(
        sessionId,
        (session: ProjectSessionData) => {
          setProgress(session.progress);
          setStage(session.stage);
        },
        30,
        2000
      );
      
      if (finalSession.status === 'completed' && finalSession.createdProject) {
        setCreatedProject(finalSession.createdProject);
        setMessages(prev => [...prev, {
          role: 'agent',
          message: `✅ ¡Proyecto **"${finalSession.createdProject?.nombre || 'Nuevo proyecto'}"** creado exitosamente!\n\nPuedes verlo en tu panel de proyectos o editarlo con el formulario completo.`,
          timestamp: new Date().toISOString(),
        }]);
        
        if (onProjectCreated && finalSession.createdProject) {
          onProjectCreated({
            id: String(finalSession.createdProject._id),
            nombre: String(finalSession.createdProject.nombre),
            slug: String(finalSession.createdProject.slug),
          });
        }
      } else if (finalSession.generation?.status === 'completed' && finalSession.generation?.projectData) {
        setCreatedProject(finalSession.generation.projectData);
        const projectName = (finalSession.generation.projectData as Record<string, unknown>)?.nombre || 'Nuevo proyecto';
        setMessages(prev => [...prev, {
          role: 'agent',
          message: `✅ ¡Proyecto **"${projectName}"** creado exitosamente!\n\nPuedes verlo en tu panel de proyectos o editarlo con el formulario completo.`,
          timestamp: new Date().toISOString(),
        }]);
        
        if (onProjectCreated && finalSession.generation.projectData) {
          const pd = finalSession.generation.projectData as Record<string, unknown>;
          onProjectCreated({
            id: String(pd.id || pd._id),
            nombre: String(pd.nombre),
            slug: String(pd.slug || ''),
          });
        }
      } else if (finalSession.generation?.status === 'failed') {
        setError(finalSession.generation.error?.message || 'Error en la generación');
        setMessages(prev => [...prev, {
          role: 'agent',
          message: '❌ Hubo un error al crear el proyecto. Puedes intentar de nuevo.',
          timestamp: new Date().toISOString(),
        }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error durante la generación');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCancel = async () => {
    if (sessionId) {
      try {
        await projectSessionApi.cancelSession(sessionId);
      } catch {
        // Ignore cancel errors
      }
    }
    resetAndClose();
  };

  const resetAndClose = () => {
    setSessionId(null);
    setMessages([]);
    setInputValue('');
    setStage('initialized');
    setProgress(0);
    setActions([]);
    setQuestions([]);
    setError(null);
    setIsGenerating(false);
    setCreatedProject(null);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleActionClick = (action: ProjectSessionAction) => {
    if (action.id === 'confirm_generate') sendMessage('sí');
    else if (action.id === 'modify') sendMessage('modificar');
    else if (action.id === 'cancel') sendMessage('cancelar');
    else sendMessage(action.label);
  };

  const handleOptionClick = (option: { value: string; label: string }) => {
    sendMessage(option.value);
  };

  // ========================================
  // STAGE LABELS
  // ========================================

  const stageLabels: Record<string, string> = {
    initialized: 'Inicio',
    basic_info: 'Información básica',
    description: 'Descripciones',
    categorization: 'Categorización',
    technologies: 'Tecnologías',
    results: 'Resultados',
    seo_generation: 'SEO',
    review_and_confirm: 'Revisión',
    generating: 'Creando...',
    generation_completed: 'Completado',
    completed: 'Finalizado',
  };

  // ========================================
  // RENDER HELPERS
  // ========================================

  const renderMessage = (msg: ProjectSessionMessage, idx: number) => {
    const isAgent = msg.role === 'agent';
    
    return (
      <div
        key={idx}
        className={`flex ${isAgent ? 'justify-start' : 'justify-end'} mb-4`}
      >
        <div
          className={`max-w-[85%] rounded-2xl px-4 py-3 ${
            isAgent
              ? 'bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
          }`}
        >
          {isAgent && (
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-lg">🤖</span>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                Asistente de Proyectos
              </span>
            </div>
          )}
          <div
            className="text-sm whitespace-pre-wrap leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: formatMessage(msg.message),
            }}
          />
        </div>
      </div>
    );
  };

  const formatMessage = (text: string): string => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-purple-400 pl-3 my-1 text-gray-600 dark:text-gray-400">$1</blockquote>')
      .replace(/\n/g, '<br/>');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl h-[85vh] mx-4 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <h2 className="font-bold text-lg">Crear Proyecto con IA</h2>
              <p className="text-white/70 text-xs">
                {stageLabels[stage] || stage} • {progress}%
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            title="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-200 dark:bg-gray-800">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isInitializing && (
            <div className="flex justify-center py-8">
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Iniciando sesión...</span>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => renderMessage(msg, idx))}

          {/* Loading indicator */}
          {(isLoading || isGenerating) && (
            <div className="flex justify-start mb-4">
              <div className="bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {isGenerating ? 'Creando proyecto...' : 'Pensando...'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mx-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-red-700 dark:text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick options (questions) */}
        {questions.length > 0 && questions[0].options && (
          <div className="px-4 py-2 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800/50">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {questions[0].question}
            </p>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {questions[0].options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleOptionClick(opt)}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-300 dark:hover:border-purple-500/50 transition-colors disabled:opacity-50"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        {actions.length > 0 && !isLoading && !isGenerating && (
          <div className="px-4 py-2 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800/50">
            <div className="flex flex-wrap gap-2">
              {actions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    action.type === 'primary'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                      : action.type === 'danger'
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-900/30'
                      : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/15 hover:bg-gray-200 dark:hover:bg-white/15'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Created project success */}
        {createdProject && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-white/10 bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <span className="text-lg">✅</span>
                <span className="text-sm font-medium">Proyecto creado exitosamente</span>
              </div>
              <button
                onClick={resetAndClose}
                className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Input area */}
        {!createdProject && !isGenerating && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800/50">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isLoading
                    ? 'Esperando respuesta...'
                    : stage === 'review_and_confirm'
                    ? 'Escribe "sí" para crear, "modificar" o "cancelar"'
                    : 'Escribe tu respuesta...'
                }
                disabled={isLoading || isInitializing}
                rows={1}
                className="flex-1 resize-none rounded-xl border border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-white/5 px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 disabled:opacity-50 max-h-24"
                style={{ minHeight: '40px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 96) + 'px';
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!inputValue.trim() || isLoading || isInitializing}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white disabled:opacity-40 hover:from-purple-700 hover:to-indigo-700 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectAIChatModal;
