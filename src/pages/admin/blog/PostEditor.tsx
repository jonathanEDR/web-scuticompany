/**
 * ✍️ PostEditor Component
 * Editor completo para crear y editar posts del blog
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, Eye, Send, ArrowLeft, Image as ImageIcon,
  Tag, Folder, Settings, Upload, Sparkles, X
} from 'lucide-react';
import { RichTextEditor, ContentPreview, EnhancedEditorAISidebar, QuickSuggestionToggle } from '../../../components/blog/editor';
import { CategoryBadge } from '../../../components/blog/common';
import { SuggestionRating } from '../../../components/ai/SuggestionRating';
import { SelectionContextMenu } from '../../../components/blog/components/SelectionContextMenu';
import { ContextPatternHelper } from '../../../components/blog/components/ContextPatternHelper';
import AIPreviewModal from '../../../components/blog/editor/AIPreviewModal';
import { selectionAIService, type AIActionRequest } from '../../../components/blog/services/selectionAIService';
import { useContextAwareAutoComplete } from '../../../components/blog/hooks/useContextAwareAutoComplete';

import { useCursorAwareAutoComplete } from '../../../hooks/ai/useCursorAwareAutoComplete';
import { useAITracking } from '../../../hooks/ai/useAITracking';
import { useCategories } from '../../../hooks/blog';
import { useAutoSuggestionSettings } from '../../../hooks/useAgentSettings';
import { useQuickSuggestionControl } from '../../../hooks/useQuickSuggestionControl';
import { generateSlug } from '../../../utils/blog';
import { blogPostApi } from '../../../services/blog';
import { uploadImage } from '../../../services/imageService';
import type { CreatePostDto, UpdatePostDto } from '../../../types/blog';

interface PostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  allowComments: boolean;
  isPinned: boolean;
  showInHeaderMenu: boolean;
}

export default function PostEditor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { categories } = useCategories();

  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    category: '',
    tags: [],
    isPublished: false,
    allowComments: true,
    isPinned: false,
    showInHeaderMenu: false
  });

  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [showAISidebar, setShowAISidebar] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  
  // Estado para el modal de preview de IA
  const [previewState, setPreviewState] = useState<{
    isOpen: boolean;
    originalText: string;
    expandedText: string;
    actionLabel: string;
  }>({
    isOpen: false,
    originalText: '',
    expandedText: '', 
    actionLabel: ''
  });

  // Hook para obtener configuraciones de sugerencias automáticas
  const { settings: suggestionSettings } = useAutoSuggestionSettings('blog');
  
  // Hook para control directo de sugerencias
  const { effectiveEnabled, isOverridden } = useQuickSuggestionControl();

  // Hook de autocompletado contextual (como Copilot) - ✅ Controlado por toggle
  const {
    suggestion,
    isVisible: showAutoComplete,
    currentPosition,
    handleContentChange,
    acceptSuggestion,
    rejectSuggestion
  } = useCursorAwareAutoComplete({
    enabled: effectiveEnabled, // ✅ Controlado por el botón de toggle
    debounceMs: suggestionSettings.debounceMs,
    minLength: suggestionSettings.minLength,
    contextLength: suggestionSettings.contextLength
  });

  // Hook de tracking para persistencia
  const {
    createSession,
    addRating
  } = useAITracking();

  // Hook de context-aware para patrones #...# - ✅ Controlado por toggle
  const {
    patternSuggestions,
    isTypingPattern,
    activePattern,
    handleContentChange: handlePatternContentChange,
    insertPatternSuggestion
  } = useContextAwareAutoComplete({
    enabled: effectiveEnabled // ✅ Controlado por el botón de toggle
  });

  // Crear sesión de tracking al montar el componente
  React.useEffect(() => {
    try {
      createSession(id || 'new-post', {
        postTitle: formData.title,
        postCategory: formData.category
      });
    } catch (error) {
      // Silenciar errores de tracking para no interrumpir la funcionalidad
      console.warn('⚠️ [PostEditor] Error creando sesión de tracking:', error);
    }
  }, [createSession, id, formData.title, formData.category]);

  // ✅ NUEVO: Limpiar sugerencias cuando el usuario hace click en la toolbar
  React.useEffect(() => {
    const handleToolbarClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Si el click es en la toolbar, rechazar sugerencias activas
      if (target.closest('.rich-text-editor .border-b') && suggestion) {
        rejectSuggestion();
      }
    };

    document.addEventListener('click', handleToolbarClick);
    return () => document.removeEventListener('click', handleToolbarClick);
  }, [suggestion, rejectSuggestion]);

  // Cargar post si está editando
  useEffect(() => {
    if (isEditing && id) {
      loadPost(id);
    }
  }, [isEditing, id]);

  // Manejar teclas Tab/Esc para sugerencias - SOLO cuando el editor NO tiene foco
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ✅ Solo procesar si hay sugerencia Y el foco NO está en el editor
      const isEditorFocused = document.activeElement?.closest('.ProseMirror') || 
                              document.activeElement?.closest('.rich-text-editor');
      
      if (showAutoComplete && suggestion && !isEditorFocused) {
        if (e.key === 'Tab') {
          e.preventDefault();
          acceptSuggestion();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          rejectSuggestion();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showAutoComplete, suggestion, acceptSuggestion, rejectSuggestion, formData.content]);

  const loadPost = async (postId: string) => {
    try {
      const response = await blogPostApi.admin.getPostById(postId);
      
      if (response.success && response.data) {
        const post = response.data;
        
        // Convertir tags de objetos a strings para el formulario
        const tagsAsStrings = Array.isArray(post.tags)
          ? post.tags.map((tag: any) => 
              typeof tag === 'string' ? tag : tag.name || tag._id
            )
          : [];
        
        setFormData({
          title: post.title || '',
          slug: post.slug || '',
          content: post.content || '',
          excerpt: post.excerpt || '',
          featuredImage: post.featuredImage || '',
          category: typeof post.category === 'string' ? post.category : (post.category?._id || ''),
          tags: tagsAsStrings,
          isPublished: post.isPublished || false,
          allowComments: post.allowComments !== undefined ? post.allowComments : true,
          isPinned: post.isPinned || false,
          showInHeaderMenu: post.showInHeaderMenu || false
        });
      }
    } catch (error) {
      console.error('❌ [PostEditor] Error al cargar post:', error);
      alert('Error al cargar el post');
    }
  };

  // Subir imagen - MEJORADO
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      const errorMsg = `La imagen es demasiado grande (${(file.size / 1024 / 1024).toFixed(2)}MB). Máximo permitido: 5MB`;
      alert(errorMsg);
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      const errorMsg = `Tipo de archivo no válido: ${file.type}. Solo se permiten imágenes.`;
      alert(errorMsg);
      return;
    }

    setIsUploading(true);
    
    try {
      const imageData = await uploadImage({
        file,
        category: 'blog',
        title: formData.title || 'Imagen de post',
        alt: formData.title || 'Imagen destacada'
      });

      handleChange('featuredImage', imageData.url);
      alert('✅ Imagen subida exitosamente');
      
    } catch (error: any) {
      console.error('❌ [PostEditor] Error detallado al subir imagen:', {
        error: error.message,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        formTitle: formData.title,
        timestamp: new Date().toISOString()
      });
      
      // Mostrar error más específico al usuario
      let userMessage = '❌ Error al subir la imagen';
      
      if (error.message.includes('permisos')) {
        userMessage = '❌ No tienes permisos para subir imágenes. Verifica tu sesión.';
      } else if (error.message.includes('demasiado grande')) {
        userMessage = '❌ El archivo es demasiado grande. Máximo 5MB.';
      } else if (error.message.includes('tipo') || error.message.includes('formato')) {
        userMessage = '❌ Formato de imagen no válido. Usa JPG, PNG, GIF o WEBP.';
      } else if (error.message.includes('conexión') || error.message.includes('red')) {
        userMessage = '❌ Error de conexión. Verifica tu internet e intenta de nuevo.';
      } else if (error.message.includes('servidor')) {
        userMessage = '❌ Error del servidor. Intenta más tarde.';
      } else {
        userMessage = `❌ ${error.message}`;
      }
      
      alert(userMessage);
      
    } finally {
      setIsUploading(false);
      // Limpiar el input para permitir resubir el mismo archivo
      e.target.value = '';
    }
  };

  // Función para manejar el rating de sugerencias
  const handleSuggestionRating = async (rating: number) => {
    try {
      await addRating('current', rating);
    } catch (error) {
      console.error('❌ Error al enviar rating:', error);
    }
  };

  // Función para manejar acciones del menú contextual
  const handleSelectionAction = async (action: any, selectedText: string) => {
    if (!selectedText.trim()) return;

    setIsProcessingAI(true);
    
    try {
      const request: AIActionRequest = {
        action: action.id,
        selectedText,
        context: {
          wordCount: selectedText.split(/\s+/).length,
          isCode: /```/.test(selectedText) || /`.*`/.test(selectedText)
        }
      };

      const response = await selectionAIService.processAIAction(request);
      
      if (response.success) {
        setPreviewState({
          isOpen: true,
          originalText: selectedText,
          expandedText: response.result,
          actionLabel: action.label
        });
      } else {
        console.error('❌ Error procesando acción:', response.result);
        alert(`❌ Error: ${response.result}`);
      }
    } catch (error) {
      console.error('❌ Error en acción de selección:', error);
      alert('❌ Error procesando la acción. Intenta de nuevo.');
    } finally {
      setIsProcessingAI(false);
    }
  };

  // Funciones para manejar el modal de preview
  const handleAcceptPreview = async () => {
    try {
      // Copiar al portapapeles
      await navigator.clipboard.writeText(previewState.expandedText);
      
      // Cerrar modal
      setPreviewState({ ...previewState, isOpen: false });
      
      // Mostrar notificación de éxito
      const notification = document.createElement('div');
      notification.style.cssText = 'position:fixed;top:20px;right:20px;background:#22c55e;color:white;padding:12px 20px;border-radius:8px;z-index:9999;font-family:system-ui;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
      notification.textContent = '📋 Contenido copiado al portapapeles - Pega con Ctrl+V';
      document.body.appendChild(notification);
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 4000);
    } catch (error) {
      console.error('❌ Error copiando al portapapeles:', error);
      alert('❌ Error copiando al portapapeles. Selecciona y copia manualmente el texto del modal.');
    }
  };

  const handleCancelPreview = () => {
    setPreviewState({ ...previewState, isOpen: false });
  };

  // Función para manejar acciones de IA en el extracto
  const handleExcerptAIAction = async (actionType: 'expand' | 'improve') => {
    if (!formData.excerpt.trim()) {
      alert('⚠️ Escribe primero algo en el extracto');
      return;
    }
    
    try {
      setIsProcessingAI(true);
      
      const request: AIActionRequest = {
        action: actionType === 'expand' ? 'expand' : 'rewrite',
        selectedText: formData.excerpt,
        context: {
          wordCount: formData.excerpt.split(/\s+/).length,
          isCode: false,
          surroundingText: `Título: ${formData.title}\nCategoría: ${formData.category}\nInstrucción: ${
            actionType === 'expand' 
              ? 'Expandir este extracto manteniendo la esencia pero añadiendo más detalles atractivos' 
              : 'Mejorar este extracto haciéndolo más atractivo y profesional'
          }`
        }
      };

      const response = await selectionAIService.processAIAction(request);

      if (response.success && response.result) {
        setPreviewState({
          isOpen: true,
          originalText: formData.excerpt,
          expandedText: response.result,
          actionLabel: actionType === 'expand' ? 'Expandir Extracto' : 'Mejorar Extracto'
        });
      } else {
        console.error('❌ Error procesando acción:', response.result);
        alert(`❌ Error: ${response.result}`);
      }
    } catch (error) {
      console.error('❌ Error en acción de IA del extracto:', error);
      alert('❌ Error procesando la acción. Intenta de nuevo.');
    } finally {
      setIsProcessingAI(false);
    }
  };

  // Función para insertar sugerencia de patrón
  const handlePatternSuggestionInsert = (suggestion: string) => {
    const newContent = insertPatternSuggestion(suggestion);
    handleChange('content', newContent);
  };


  // Auto-generar slug desde el título
  useEffect(() => {
    if (!isEditing && formData.title) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.title)
      }));
    }
  }, [formData.title, isEditing]);

  // Manejar cambios en el formulario
  const handleChange = (field: keyof PostFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Si el campo es 'content', notificar al sistema de patrones
    if (field === 'content' && typeof value === 'string') {
      handlePatternContentChange(value);
      handleContentChange(value); // También notificar al autocompletado normal
    }
  };

  // Agregar tag
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  // Eliminar tag
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Guardar como borrador
  const handleSaveDraft = async () => {    
    const textContent = formData.content.replace(/<[^>]*>/g, '').trim();
    
    if (!formData.title || !formData.title.trim()) {
      alert('⚠️ Por favor ingresa un título para el post');
      return;
    }
    
    if (!textContent || textContent.length === 0) {
      alert('⚠️ Por favor escribe contenido en el editor');
      return;
    }
    
    if (!formData.category) {
      alert('⚠️ Por favor selecciona una categoría');
      return;
    }

    setIsSaving(true);
    try {
      // Generar excerpt automáticamente si está vacío
      const excerpt = formData.excerpt || formData.content.replace(/<[^>]*>/g, '').substring(0, 300);
      
      const postData: CreatePostDto = {
        title: formData.title,
        content: formData.content,
        excerpt: excerpt,
        category: formData.category,
        tags: formData.tags,
        featuredImage: formData.featuredImage,
        isPublished: false,
        allowComments: formData.allowComments,
        isPinned: formData.isPinned,
        showInHeaderMenu: formData.showInHeaderMenu
      };

      if (isEditing && id) {
        await blogPostApi.admin.updatePost(id, postData as UpdatePostDto);
        alert('✅ Borrador actualizado exitosamente');
      } else {
        console.log('➕ [handleSaveDraft] Creando nuevo borrador');
        const response = await blogPostApi.admin.createPost(postData);
        console.log('✅ [handleSaveDraft] Response del backend:', response);
        console.log('📊 [handleSaveDraft] Post creado:', response.data);
        if (response.success && response.data) {
          alert('✅ Borrador guardado exitosamente');
          navigate(`/dashboard/blog/posts/${response.data._id}/edit`);
        }
      }
    } catch (error: any) {
      console.error('Error al guardar:', error);
      alert(`❌ Error al guardar el borrador: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Publicar post
  const handlePublish = async () => {
    // Validar que el contenido no esté vacío (sin contar etiquetas HTML)
    const textContent = formData.content.replace(/<[^>]*>/g, '').trim();
    
    if (!formData.title || !formData.title.trim()) {
      alert('⚠️ Por favor ingresa un título para el post');
      return;
    }
    
    if (!textContent || textContent.length === 0) {
      alert('⚠️ Por favor escribe contenido en el editor');
      return;
    }
    
    if (!formData.category) {
      alert('⚠️ Por favor selecciona una categoría');
      return;
    }

    setIsSaving(true);
    try {
      // Generar excerpt automáticamente si está vacío
      const excerpt = formData.excerpt || formData.content.replace(/<[^>]*>/g, '').substring(0, 300);
      
      const postData: CreatePostDto = {
        title: formData.title,
        content: formData.content,
        excerpt: excerpt,
        category: formData.category,
        tags: formData.tags,
        featuredImage: formData.featuredImage,
        isPublished: true,
        allowComments: formData.allowComments,
        isPinned: formData.isPinned,
        showInHeaderMenu: formData.showInHeaderMenu
      };

      if (isEditing && id) {
        await blogPostApi.admin.updatePost(id, { ...postData, isPublished: true } as UpdatePostDto);
        alert('✅ Post actualizado y publicado exitosamente');
      } else {
        const response = await blogPostApi.admin.createPost(postData);
        if (response.success) {
          alert('✅ Post publicado exitosamente');
        }
      }
      
      navigate('/dashboard/blog');
    } catch (error: any) {
      console.error('❌ [handlePublish] Error al publicar:', error);
      alert(`❌ Error al publicar el post: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="post-editor w-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm mb-6">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard/blog')}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEditing ? 'Editar Post' : 'Nuevo Post'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formData.isPublished ? 'Publicado' : 'Borrador'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>{showPreview ? 'Editor' : 'Vista Previa'}</span>
            </button>

            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Borrador</span>
            </button>

            <button
              onClick={handlePublish}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors font-medium disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isEditing ? 'Actualizar' : 'Publicar'}</span>
            </button>

            {/* ✅ Control de Sugerencias Automáticas - Controla TODOS los sistemas de IA */}
            <QuickSuggestionToggle
              size="md"
              showLabel={true}
            />

            {/* Botón Asistente IA */}
            <button
              onClick={() => setShowAISidebar(!showAISidebar)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                showAISidebar
                  ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg'
                  : 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 border border-purple-300 dark:border-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>🤖 Asistente IA</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 pb-8">
        {/* Editor Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Título */}
          <div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Título del post..."
              className="w-full text-4xl font-bold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-0 focus:ring-0 p-0"
            />
          </div>

          {/* Slug */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>URL:</span>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder="url-del-post"
              className="flex-1 px-2 py-1 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
            />
          </div>

          {/* Editor / Preview */}
          {showPreview ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {formData.title || 'Título del Post'}
              </h2>
              <ContentPreview content={formData.content} />
            </div>
          ) : (
            <div className="space-y-4 relative">
              {/* RichTextEditor SIN sugerencias integradas - mantener el editor limpio */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <RichTextEditor
                  content={formData.content}
                  onChange={(html) => {
                    try {
                      handleChange('content', html);
                      
                      // Solo activar autocompletado si está habilitado
                      if (effectiveEnabled) {
                        handleContentChange(html, {
                          title: formData.title,
                          category: formData.category,
                          postId: id || 'new'
                        });
                      }
                    } catch (error) {
                      console.error('Error en onChange del editor:', error);
                    }
                  }}
                  minHeight="400px"
                  maxHeight="800px"
                />
              </div>

              {/* ✅ Panel de sugerencias - Solo visible cuando effectiveEnabled está activo */}
              {suggestion && effectiveEnabled && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-300 dark:border-purple-700 rounded-lg p-4 ai-suggestion-active relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      rejectSuggestion();
                    }}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title="Cerrar sugerencias"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-between mb-3 pr-8">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-pulse" />
                      <span className="font-medium text-purple-900 dark:text-purple-100">
                        🎯 Sugerencia AI disponible
                      </span>
                      {currentPosition && (
                        <span className="text-xs bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                          Línea {currentPosition.line}, Col {currentPosition.column}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-3 p-3 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-purple-500">
                    <div className="text-sm text-gray-700 dark:text-gray-300 italic">
                      "{suggestion.text.slice(0, 150)}{suggestion.text.length > 150 ? '...' : ''}"
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {suggestion.text.length} caracteres • Confianza: {Math.round((suggestion.confidence || 0.8) * 100)}%
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          acceptSuggestion();
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all transform hover:scale-105"
                      >
                        ✅ Aceptar <kbd className="px-2 py-1 text-xs bg-green-700 rounded">Tab</kbd>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          rejectSuggestion();
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all transform hover:scale-105"
                      >
                        ❌ Rechazar <kbd className="px-2 py-1 text-xs bg-red-600 rounded">Esc</kbd>
                      </button>
                    </div>
                    
                    <SuggestionRating 
                      onRating={handleSuggestionRating}
                      className="ml-4"
                    />
                  </div>
                </div>
              )}

              {/* Sección de contenido continúa aquí... */}
            </div>
          )}

          {/* Excerpt con IA - Enfoque Simplificado */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 relative">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                Extracto (Resumen)
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExcerptAIAction('expand')}
                  disabled={!formData.excerpt.trim() || isProcessingAI}
                  className="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md hover:bg-purple-200 dark:hover:bg-purple-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Expandir extracto con IA"
                >
                  🚀 Expandir
                </button>
                <button
                  onClick={() => handleExcerptAIAction('improve')}
                  disabled={!formData.excerpt.trim() || isProcessingAI}
                  className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Mejorar extracto con IA"
                >
                  ✨ Mejorar
                </button>
              </div>
            </div>
            <textarea
              value={formData.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              placeholder="Escribe un breve resumen del post..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 resize-none"
              maxLength={300}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {formData.excerpt.length}/300 caracteres
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Imagen Destacada */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Imagen Destacada</h3>
            </div>

            {formData.featuredImage ? (
              <div className="relative">
                <img
                  src={formData.featuredImage}
                  alt="Featured"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleChange('featuredImage', '')}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Eliminar
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Subiendo imagen...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                      <p className="text-sm text-gray-900 dark:text-white font-medium mb-1">
                        Haz clic para subir
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, WEBP (max. 5MB)
                      </p>
                    </>
                  )}
                </label>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">o ingresa URL</span>
                  </div>
                </div>
                
                <input
                  type="url"
                  value={formData.featuredImage || ''}
                  onChange={(e) => handleChange('featuredImage', e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
            )}
          </div>

          {/* Categoría */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Folder className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Categoría</h3>
            </div>

            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
            >
              <option value="">Seleccionar categoría...</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            {formData.category && (
              <div className="mt-3">
                {categories
                  .filter(c => c._id === formData.category)
                  .map(category => (
                    <CategoryBadge key={category._id} category={category} clickable={false} />
                  ))
                }
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Tags</h3>
            </div>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Agregar tag..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors text-sm font-medium"
              >
                Agregar
              </button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => {
                  // ✅ Manejar tags como string o como objeto
                  const tagText = typeof tag === 'string' 
                    ? tag 
                    : (tag as any).name || (tag as any)._id || String(tag);
                  
                  return (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      <span>{tagText}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Configuración */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Configuración</h3>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowComments}
                  onChange={(e) => handleChange('allowComments', e.target.checked)}
                  className="w-4 h-4 text-blue-600 dark:text-blue-400 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Permitir comentarios</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPinned}
                  onChange={(e) => handleChange('isPinned', e.target.checked)}
                  className="w-4 h-4 text-blue-600 dark:text-blue-400 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Fijar post (destacado)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showInHeaderMenu}
                  onChange={(e) => handleChange('showInHeaderMenu', e.target.checked)}
                  className="w-4 h-4 text-purple-600 dark:text-purple-400 rounded focus:ring-purple-500 dark:focus:ring-purple-400"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Mostrar en Header de Home (Soluciones)
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Enhanced AI Sidebar - Controlado por botón Asistente IA */}
      <EnhancedEditorAISidebar
        title={formData.title}
        content={formData.content}
        excerpt={formData.excerpt}
        category={formData.category}
        isOpen={showAISidebar}
        onClose={() => setShowAISidebar(false)}
        onTagsGenerated={(tags) => {
          setFormData(prev => ({
            ...prev,
            tags: [...new Set([...prev.tags, ...tags])]
          }));
        }}
        onContentInsert={(content) => {
          setFormData(prev => ({
            ...prev,
            content: prev.content + '\n\n' + content
          }));
        }}
      />

      {/* Debug info simplificado - solo en desarrollo */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 left-4 bg-black/85 text-white px-3 py-2 rounded-lg text-xs z-50 font-mono">
          <div className="flex items-center gap-2">
            <span>AI:</span>
            <span className={effectiveEnabled ? 'text-green-400' : 'text-red-400'}>
              {effectiveEnabled ? '🟢 ON' : '🔴 OFF'}
            </span>
            {isOverridden && <span className="text-orange-400">⚠️</span>}
            <span className="text-gray-400">|</span>
            <span>Sugg: {suggestion ? '📝' : '∅'}</span>
            <span className="text-gray-400">|</span>
            <span>{formData.content.length}ch</span>
          </div>
        </div>
      )}

      {/* ✅ Menú contextual de selección - Solo cuando effectiveEnabled está activo */}
      {effectiveEnabled && (
        <SelectionContextMenu
          onActionSelect={handleSelectionAction}
          onClose={() => {
            const selection = window.getSelection();
            if (selection) {
              selection.removeAllRanges();
            }
          }}
        />
      )}

      {/* ✅ Helper de patrones #...# - Solo cuando effectiveEnabled está activo */}
      {effectiveEnabled && (isTypingPattern || activePattern) && (
        <ContextPatternHelper
          isTypingPattern={isTypingPattern}
          suggestions={patternSuggestions}
          activePattern={activePattern}
          onSuggestionClick={handlePatternSuggestionInsert}
          className="max-w-md"
        />
      )}

      {/* Indicador de procesamiento AI */}
      {isProcessingAI && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl flex items-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300">Procesando con IA...</span>
          </div>
        </div>
      )}

      {/* Modal de Preview de IA */}
      <AIPreviewModal
        isOpen={previewState.isOpen}
        originalText={previewState.originalText}
        expandedText={previewState.expandedText}
        actionLabel={previewState.actionLabel}
        onAccept={handleAcceptPreview}
        onCancel={handleCancelPreview}
      />
    </div>
  );
}
