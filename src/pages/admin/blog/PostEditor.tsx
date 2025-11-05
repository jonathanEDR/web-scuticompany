/**
 * ✍️ PostEditor Component
 * Editor completo para crear y editar posts del blog
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, Eye, Send, ArrowLeft, Image as ImageIcon,
  Tag, Folder, Settings, Upload, Sparkles
} from 'lucide-react';
import { RichTextEditor, ContentPreview } from '../../../components/blog/editor';
import { CategoryBadge } from '../../../components/blog/common';
import { EditorAISidebar } from '../../../components/blog/editor/EditorAISidebar';
import { useCategories } from '../../../hooks/blog';
import { generateSlug } from '../../../utils/blog';
import { blogPostApi } from '../../../services/blog';
import { uploadImage } from '../../../services/imageService';
import type { CreatePostDto, UpdatePostDto } from '../../../types/blog';
import DashboardLayout from '../../../components/DashboardLayout';

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
    isPinned: false
  });

  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [showAISidebar, setShowAISidebar] = useState(false);

  // Cargar post si está editando
  useEffect(() => {
    if (isEditing && id) {
      loadPost(id);
    }
  }, [isEditing, id]);

  const loadPost = async (postId: string) => {
    try {
      console.log('📝 [PostEditor] Cargando post con ID:', postId);
      
      // ✅ FIXED: Usar endpoint admin que busca por _id en lugar de slug
      const response = await blogPostApi.admin.getPostById(postId);
      
      if (response.success && response.data) {
        const post = response.data;
        console.log('✅ [PostEditor] Post cargado:', post.title);
        
        // ✅ Convertir tags de objetos a strings para el formulario
        const tagsAsStrings = Array.isArray(post.tags)
          ? post.tags.map((tag: any) => 
              typeof tag === 'string' ? tag : tag.name || tag._id
            )
          : [];
        
        setFormData({
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          featuredImage: post.featuredImage || '',
          category: typeof post.category === 'string' ? post.category : post.category._id,
          tags: tagsAsStrings,
          isPublished: post.isPublished,
          allowComments: post.allowComments,
          isPinned: post.isPinned
        });
      }
    } catch (error) {
      console.error('❌ [PostEditor] Error al cargar post:', error);
      alert('Error al cargar el post');
    }
  };

  // Subir imagen
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar 5MB');
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten archivos de imagen');
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
      console.error('Error al subir imagen:', error);
      alert(`❌ Error al subir la imagen: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsUploading(false);
    }
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
    // Logs para depuración
    console.log('📝 Validando datos del formulario (borrador):');
    console.log('Título:', formData.title);
    console.log('Contenido length:', formData.content?.length);
    console.log('Categoría:', formData.category);
    
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

    console.log('✅ Validación pasada, guardando borrador...');
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
        isPinned: formData.isPinned
      };

      if (isEditing && id) {
        await blogPostApi.admin.updatePost(id, postData as UpdatePostDto);
        alert('✅ Borrador actualizado exitosamente');
      } else {
        const response = await blogPostApi.admin.createPost(postData);
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
    // Logs para depuración
    console.log('📝 Validando datos del formulario:');
    console.log('Título:', formData.title);
    console.log('Contenido length:', formData.content?.length);
    console.log('Contenido:', formData.content?.substring(0, 100));
    console.log('Categoría:', formData.category);
    console.log('Tags:', formData.tags);
    console.log('isPublished será:', true);
    
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

    console.log('✅ Validación pasada, enviando datos...');
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
        isPinned: formData.isPinned
      };

      console.log('📤 [handlePublish] Enviando datos al backend:', postData);

      if (isEditing && id) {
        console.log('🔄 [handlePublish] Actualizando post existente, ID:', id);
        const response = await blogPostApi.admin.updatePost(id, { ...postData, isPublished: true } as UpdatePostDto);
        console.log('✅ [handlePublish] Response de actualización:', response);
        alert('✅ Post actualizado y publicado exitosamente');
      } else {
        console.log('➕ [handlePublish] Creando nuevo post');
        const response = await blogPostApi.admin.createPost(postData);
        console.log('✅ [handlePublish] Response de creación:', response);
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
    <DashboardLayout>
      <div className="post-editor max-w-7xl mx-auto">
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAISidebar(!showAISidebar)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showAISidebar
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Asistente IA</span>
            </button>

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
            <RichTextEditor
              content={formData.content}
              onChange={(html) => handleChange('content', html)}
              minHeight="400px"
              maxHeight="800px"
            />
          )}

          {/* Excerpt */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Extracto (Resumen)
            </label>
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
            </div>
          </div>
        </div>
      </div>

      {/* AI Sidebar */}
      <EditorAISidebar
        title={formData.title}
        content={formData.content}
        excerpt={formData.excerpt}
        isOpen={showAISidebar}
        onClose={() => setShowAISidebar(false)}
      />
    </div>
    </DashboardLayout>
  );
}
