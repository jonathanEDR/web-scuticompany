/**
 * 📝 FORMULARIO DE SERVICIO V3 - Con Sistema de Tabs Simplificado
 * Versión limpia con tabs funcionales para crear y editar servicios
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { serviciosApi } from '../../services/serviciosApi';
import { RichTextEditor } from '../../components/common/RichTextEditor';
import { MultipleImageGallery } from '../../components/common/MultipleImageGallery';
import { ImageUploader } from '../../components/common/ImageUploader';
import { TabNavigator, useTabNavigation, type Tab } from '../../components/common/TabNavigator';
import { useNotification } from '../../hooks/useNotification';
import * as uploadApi from '../../services/uploadApi';

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const ServicioFormV3: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const { success, error } = useNotification();

  // ============================================
  // ESTADOS LOCALES
  // ============================================

  const [loadingData, setLoadingData] = useState(isEditMode);
  const [uploadingImage, setUploadingImage] = useState(false);

  // ============================================
  // REACT HOOK FORM
  // ============================================

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<any>({
    defaultValues: {
      titulo: '',
      descripcion: '',
      descripcionCorta: '',
      categoria: 'desarrollo',
      tipoPrecio: 'fijo',
      precio: 0,
      moneda: 'PEN',
      estado: 'activo',
      icono: '🚀',
      destacado: false,
      activo: true,
      visibleEnWeb: true,
      // Contenido Avanzado
      descripcionRica: '',
      videoUrl: '',
      galeriaImagenes: [],
      contenidoAdicional: '',
      
      // Precios y Comercial
      descuento: 0,
      fechaPromocion: '',
      etiquetaPromocion: '',
      
      // Diseño Visual
      colorPrimario: '#8B5CF6',
      colorSecundario: '#06B6D4',
      imagen: '',
      
      // Características (como strings para textareas)
      caracteristicas: '',
      beneficios: '',
      incluye: '',
      noIncluye: '',
      faq: '',
      
      // Configuraciones adicionales
      seo: {
        titulo: '',
        descripcion: '',
        palabrasClave: ''
      },
      tiempoEntrega: '',
      garantia: '',
      soporte: 'basico',
    },
  });

  // Observar campos
  const galeriaImagenes = watch('galeriaImagenes') || [];
  const caracteristicas = watch('caracteristicas') || '';
  const beneficios = watch('beneficios') || '';
  const faq = watch('faq') || '';

  // ============================================
  // SISTEMA DE TABS COMPLETO
  // ============================================

  const tabs = useMemo<Tab[]>(() => [
    {
      id: 'basic',
      title: 'Información Básica',
      icon: '📋',
      description: 'Datos principales del servicio',
      isValid: Boolean(watch('titulo') && watch('descripcion'))
    },
    {
      id: 'pricing',
      title: 'Precios y Comercial',
      icon: '💰',
      description: 'Configuración de precios y promociones',
      isValid: Boolean(watch('precio') !== undefined)
    },
    {
      id: 'visual',
      title: 'Diseño Visual',
      icon: '🎨',
      description: 'Icono, colores y elementos visuales',
      isOptional: true,
      isCompleted: Boolean(watch('icono') || watch('colorPrimario') || watch('colorSecundario'))
    },
    {
      id: 'advanced',
      title: 'Contenido Avanzado',
      icon: '✨',
      description: 'Descripción rica, video, galería',
      isOptional: true,
      isCompleted: Boolean(watch('descripcionRica') || watch('videoUrl') || galeriaImagenes?.length || watch('contenidoAdicional'))
    },
    {
      id: 'features',
      title: 'Características',
      icon: '⚡',
      description: 'Beneficios, incluye/excluye, FAQ',
      isOptional: true,
      isCompleted: Boolean(caracteristicas?.length || beneficios?.length || faq?.length)
    },
    {
      id: 'settings',
      title: 'Configuraciones',
      icon: '⚙️',
      description: 'Estado, visibilidad y opciones avanzadas',
      isValid: true
    }
  ], [watch, galeriaImagenes]);

  const {
    activeTab,
    setActiveTab,
    nextTab,
    previousTab,
    isFirstTab,
    isLastTab
  } = useTabNavigation('basic', tabs);

  // ============================================
  // CARGAR DATOS EN MODO EDICIÓN
  // ============================================

  useEffect(() => {
    if (isEditMode && id) {
      loadServicio(id);
    }
  }, [id, isEditMode]);

  const loadServicio = async (servicioId: string) => {
    try {
      setLoadingData(true);
      const response = await serviciosApi.getById(servicioId, false);
      
      if (response.success && response.data) {
        const servicio = response.data;
        reset({
          titulo: servicio.titulo,
          descripcion: servicio.descripcion,
          descripcionCorta: servicio.descripcionCorta,
          categoria: servicio.categoria,
          tipoPrecio: servicio.tipoPrecio,
          precio: servicio.precio,
          moneda: servicio.moneda,
          estado: servicio.estado,
          icono: servicio.icono,
          destacado: servicio.destacado,
          activo: servicio.activo,
          visibleEnWeb: servicio.visibleEnWeb,
          
          // Contenido Avanzado
          descripcionRica: servicio.descripcionRica || '',
          videoUrl: servicio.videoUrl || '',
          galeriaImagenes: servicio.galeriaImagenes || [],
          contenidoAdicional: servicio.contenidoAdicional || '',
          
          // Precios y Comercial
          descuento: servicio.descuento || 0,
          fechaPromocion: servicio.fechaPromocion || '',
          etiquetaPromocion: servicio.etiquetaPromocion || '',
          
          // Diseño Visual
          colorPrimario: servicio.colorPrimario || '#8B5CF6',
          colorSecundario: servicio.colorSecundario || '#06B6D4',
          imagen: servicio.imagen || '',
          
          // Características - Convertir arrays a texto para textareas
          caracteristicas: Array.isArray(servicio.caracteristicas) 
            ? servicio.caracteristicas.map(c => `• ${c}`).join('\n')
            : servicio.caracteristicas || '',
          beneficios: Array.isArray(servicio.beneficios)
            ? servicio.beneficios.map(b => `• ${b}`).join('\n')
            : servicio.beneficios || '',
          incluye: Array.isArray(servicio.incluye)
            ? servicio.incluye.map(i => `• ${i}`).join('\n')
            : servicio.incluye || '',
          noIncluye: Array.isArray(servicio.noIncluye)
            ? servicio.noIncluye.map(n => `• ${n}`).join('\n')
            : servicio.noIncluye || '',
          faq: Array.isArray(servicio.faq) && servicio.faq.length > 0 && typeof servicio.faq[0] === 'object'
            ? servicio.faq.map((f: any) => `P: ${f.pregunta}\nR: ${f.respuesta}`).join('\n\n')
            : servicio.faq || '',
          
          // Configuraciones adicionales
          seo: servicio.seo || { titulo: '', descripcion: '', palabrasClave: '' },
          tiempoEntrega: servicio.tiempoEntrega || '',
          garantia: servicio.garantia || '',
          soporte: servicio.soporte || 'basico',
        });
      }
    } catch (err: any) {
      console.error('Error al cargar servicio:', err);
      error('Error', 'No se pudo cargar el servicio');
    } finally {
      setLoadingData(false);
    }
  };

  // ============================================
  // SUBMIT
  // ============================================

  const onSubmit = async (data: any) => {
    try {
      // Procesar campos de texto a arrays (eliminar viñetas y líneas vacías)
      const processTextToArray = (text: string | string[]): string[] => {
        if (Array.isArray(text)) return text;
        if (!text) return [];
        return text
          .split('\n')
          .map(line => line.trim().replace(/^[•\-\*]\s*/, ''))
          .filter(line => line.length > 0);
      };

      // Procesar FAQ de texto a array de objetos {pregunta, respuesta}
      const processFaqText = (text: string | any[]): Array<{pregunta: string, respuesta: string}> => {
        if (Array.isArray(text) && text.length > 0 && typeof text[0] === 'object') {
          return text; // Ya está en formato correcto
        }
        if (!text || typeof text !== 'string') return [];
        
        const faqs: Array<{pregunta: string, respuesta: string}> = [];
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        
        let currentPregunta = '';
        let currentRespuesta = '';
        
        for (const line of lines) {
          if (line.match(/^P:/i)) {
            // Si hay una pregunta previa, guardarla
            if (currentPregunta && currentRespuesta) {
              faqs.push({ pregunta: currentPregunta, respuesta: currentRespuesta });
            }
            currentPregunta = line.replace(/^P:\s*/i, '').trim();
            currentRespuesta = '';
          } else if (line.match(/^R:/i)) {
            currentRespuesta = line.replace(/^R:\s*/i, '').trim();
          } else if (currentRespuesta) {
            // Continuar respuesta en múltiples líneas
            currentRespuesta += ' ' + line;
          } else if (currentPregunta) {
            // Continuar pregunta en múltiples líneas
            currentPregunta += ' ' + line;
          }
        }
        
        // Agregar el último par P/R
        if (currentPregunta && currentRespuesta) {
          faqs.push({ pregunta: currentPregunta, respuesta: currentRespuesta });
        }
        
        return faqs;
      };

      // Preparar datos procesados
      const processedData = {
        ...data,
        caracteristicas: processTextToArray(data.caracteristicas),
        beneficios: processTextToArray(data.beneficios),
        incluye: processTextToArray(data.incluye),
        noIncluye: processTextToArray(data.noIncluye),
        faq: processFaqText(data.faq),
      };

      console.log('📤 Datos a enviar:', processedData);
      console.log('🖼️ Imagen en datos:', processedData.imagen);

      if (isEditMode && id) {
        await serviciosApi.update(id, processedData);
        success('Servicio actualizado', 'Los cambios se guardaron correctamente');
      } else {
        const response = await serviciosApi.create(processedData);
        success('Servicio creado', 'El servicio se creó correctamente');
        if (response.data?._id) {
          navigate(`/dashboard/servicios/${response.data._id}/edit`);
          return;
        }
      }
      navigate('/dashboard/servicios/management');
    } catch (err: any) {
      console.error('Error al guardar:', err);
      error('Error al guardar', String(err.message || 'No se pudo guardar el servicio'));
    }
  };

  // ============================================
  // RENDER DE TABS
  // ============================================

  const renderBasicTab = () => (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          📋 Información Básica
          <span className="text-sm font-normal text-gray-600 dark:text-gray-400">(Obligatorio)</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Título */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título *
            </label>
            <input
              type="text"
              {...register('titulo', { required: 'El título es obligatorio' })}
              placeholder="Ej: Desarrollo Web Profesional"
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.titulo && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{String(errors.titulo.message)}</p>
            )}
          </div>

          {/* Categoría y Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoría *
            </label>
            <select
              {...register('categoria')}
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="desarrollo">💻 Desarrollo</option>
              <option value="diseño">🎨 Diseño</option>
              <option value="marketing">📊 Marketing</option>
              <option value="consultoría">💼 Consultoría</option>
              <option value="mantenimiento">🔧 Mantenimiento</option>
              <option value="otro">📦 Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado
            </label>
            <select
              {...register('estado')}
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="activo">✓ Activo</option>
              <option value="desarrollo">⚙️ En desarrollo</option>
              <option value="pausado">⏸️ Pausado</option>
              <option value="descontinuado">❌ Descontinuado</option>
            </select>
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Precio (USD)
            </label>
            <input
              type="number"
              {...register('precio', { valueAsNumber: true })}
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icono
            </label>
            <input
              type="text"
              {...register('icono')}
              placeholder="🚀"
              maxLength={4}
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white text-center text-2xl placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Descripción corta */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción Corta
            </label>
            <input
              type="text"
              {...register('descripcionCorta')}
              placeholder="Resumen breve del servicio (máx. 200 caracteres)"
              maxLength={200}
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Descripción completa */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción Completa *
            </label>
            <textarea
              {...register('descripcion', { required: 'La descripción es obligatoria' })}
              rows={5}
              placeholder="Describe el servicio en detalle..."
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            {errors.descripcion && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{String(errors.descripcion.message)}</p>
            )}
          </div>

          {/* Opciones */}
          <div className="md:col-span-2 space-y-3 pt-4 border-t border-gray-300 dark:border-gray-700">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('destacado')}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-gray-900 dark:text-white">⭐ Servicio Destacado</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('activo')}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-gray-900 dark:text-white">✓ Servicio Activo</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('visibleEnWeb')}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-gray-900 dark:text-white">👁️ Visible en Web</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          ✨ Contenido Avanzado
          <span className="text-sm font-normal text-purple-600 dark:text-purple-400">(Opcional)</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Personaliza la página de detalles del servicio con contenido rico y multimedia
        </p>
        
        <div className="space-y-8">
          {/* Descripción Rica */}
          <div>
            <RichTextEditor
              label="Descripción Rica"
              value={watch('descripcionRica') || ''}
              onChange={(value) => setValue('descripcionRica', value)}
              placeholder="Descripción detallada con formato..."
              helpText="Usa markdown para dar formato: **negrita**, *cursiva*, # títulos, - listas"
              maxLength={3000}
            />
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Video Promocional
            </label>
            <input
              type="url"
              {...register('videoUrl')}
              placeholder="https://www.youtube.com/watch?v=... o https://vimeo.com/..."
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-gray-600 dark:text-gray-500 text-sm mt-1">
              URL de YouTube, Vimeo u otro servicio de video
            </p>
          </div>

          {/* Galería de Imágenes */}
          <div>
            <MultipleImageGallery
              label="Galería de Imágenes"
              images={galeriaImagenes}
              onImagesChange={(images) => setValue('galeriaImagenes', images)}
              maxImages={8}
              helpText="Imágenes adicionales para mostrar en la página de detalles"
            />
          </div>

          {/* Contenido Adicional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contenido Adicional
            </label>
            <textarea
              {...register('contenidoAdicional')}
              placeholder="Información extra, proceso de trabajo, garantías, etc."
              rows={4}
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            <p className="text-gray-600 dark:text-gray-500 text-sm mt-1">
              Información adicional que aparecerá al final de la página de detalles
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPricingTab = () => (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          💰 Precios y Comercial
          <span className="text-sm font-normal text-gray-600 dark:text-gray-400">(Configuración comercial)</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Precio Base */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Precio Base (USD) *
            </label>
            <input
              type="number"
              {...register('precio', { valueAsNumber: true, required: 'El precio es obligatorio' })}
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Tipo de Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Precio
            </label>
            <select
              {...register('tipoPrecio')}
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="fijo">🏷️ Precio Fijo</option>
              <option value="desde">📈 Desde (mínimo)</option>
              <option value="consultar">💬 Consultar</option>
              <option value="personalizado">🎯 Personalizado</option>
            </select>
          </div>

          {/* Descuento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descuento (%)
            </label>
            <input
              type="number"
              {...register('descuento', { valueAsNumber: true })}
              min="0"
              max="100"
              step="1"
              placeholder="0"
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Moneda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Moneda
            </label>
            <select
              {...register('moneda')}
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="PEN">🇵🇪 PEN (Soles)</option>
              <option value="USD">� USD (Dólares)</option>
              <option value="EUR">� EUR (Euros)</option>
              <option value="MXN">💸 MXN (Pesos Mexicanos)</option>
            </select>
          </div>

          {/* Etiqueta de Promoción */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Etiqueta Promocional
            </label>
            <input
              type="text"
              {...register('etiquetaPromocion')}
              placeholder="Ej: ¡OFERTA ESPECIAL!, NUEVO, POPULAR"
              maxLength={50}
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Tiempo de Entrega */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tiempo de Entrega
            </label>
            <input
              type="text"
              {...register('tiempoEntrega')}
              placeholder="Ej: 7-10 días, 2 semanas, Inmediato"
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Garantía */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Garantía
            </label>
            <input
              type="text"
              {...register('garantia')}
              placeholder="Ej: 30 días, 6 meses, 1 año"
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderVisualTab = () => (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          🎨 Diseño Visual
          <span className="text-sm font-normal text-purple-600 dark:text-purple-400">(Opcional)</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Icono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icono del Servicio
            </label>
            <div className="flex items-center gap-4">
              <input
                type="text"
                {...register('icono')}
                placeholder="🚀"
                maxLength={4}
                className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white text-center text-2xl placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-3xl">
                {watch('icono') || '🚀'}
              </div>
            </div>
          </div>

          {/* Imagen Principal */}
          <div className="md:col-span-2">
            <ImageUploader
              label="Imagen Principal del Servicio"
              currentImage={watch('imagen')}
              onImageChange={async (file, previewUrl) => {
                // Si es un archivo (subida desde PC)
                if (file) {
                  setUploadingImage(true);
                  try {
                    const response = await uploadApi.uploadImage(file);
                    if (response.success && response.data) {
                      setValue('imagen', response.data.url);
                      success('Imagen subida correctamente');
                    } else {
                      error('Error al subir imagen', response.error || 'Intenta nuevamente');
                    }
                  } catch (err) {
                    error('Error al subir imagen');
                  } finally {
                    setUploadingImage(false);
                  }
                } 
                // Si es una URL (selección desde galería)
                else if (previewUrl) {
                  setValue('imagen', previewUrl);
                  success('Imagen seleccionada de la galería');
                } 
                // Si es null (eliminar imagen)
                else {
                  setValue('imagen', '');
                }
              }}
              helpText="Selecciona desde la galería o pega una URL. Tamaño recomendado: 1200x630px"
              uploading={uploadingImage}
              aspectRatio="16:9"
            />
            {watch('imagen') && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">URL de la imagen:</p>
                <input
                  type="url"
                  {...register('imagen')}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}
          </div>

          {/* Color Primario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color Primario
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                {...register('colorPrimario')}
                className="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
              <input
                type="text"
                {...register('colorPrimario')}
                placeholder="#8B5CF6"
                className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Color Secundario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color Secundario
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                {...register('colorSecundario')}
                className="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
              <input
                type="text"
                {...register('colorSecundario')}
                placeholder="#06B6D4"
                className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="md:col-span-2 mt-4 p-4 bg-gray-100/50 dark:bg-gray-700/30 rounded-lg border border-gray-300 dark:border-gray-600">
            <h3 className="text-gray-900 dark:text-white font-medium mb-3">Vista Previa</h3>
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                style={{ backgroundColor: watch('colorPrimario') + '20', color: watch('colorPrimario') }}
              >
                {watch('icono') || '🚀'}
              </div>
              <div>
                <h4 className="text-gray-900 dark:text-white font-medium">{watch('titulo') || 'Título del Servicio'}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{watch('descripcionCorta') || 'Descripción corta del servicio'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeaturesTab = () => (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          ⚡ Características y Beneficios
          <span className="text-sm font-normal text-purple-600 dark:text-purple-400">(Opcional)</span>
        </h2>
        
        <div className="space-y-8">
          {/* Características Principales (Lista simple por ahora) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Características Principales
            </label>
            <textarea
              {...register('caracteristicas')}
              placeholder="• Característica 1&#10;• Característica 2&#10;• Característica 3"
              rows={4}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            <p className="text-gray-500 text-sm mt-1">
              Lista las características principales (una por línea con •)
            </p>
          </div>

          {/* Beneficios */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Beneficios Clave
            </label>
            <textarea
              {...register('beneficios')}
              placeholder="• Beneficio 1&#10;• Beneficio 2&#10;• Beneficio 3"
              rows={4}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            <p className="text-gray-500 text-sm mt-1">
              ¿Qué beneficios obtiene el cliente?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Qué Incluye */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ✅ Qué Incluye
              </label>
              <textarea
                {...register('incluye')}
                placeholder="• Servicio incluido 1&#10;• Servicio incluido 2"
                rows={5}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            {/* Qué NO Incluye */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ❌ Qué NO Incluye
              </label>
              <textarea
                {...register('noIncluye')}
                placeholder="• Servicio no incluido 1&#10;• Servicio no incluido 2"
                rows={5}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>
          </div>

          {/* FAQ Básico */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Preguntas Frecuentes (FAQ)
            </label>
            <textarea
              {...register('faq')}
              placeholder="P: ¿Pregunta frecuente 1?&#10;R: Respuesta detallada...&#10;&#10;P: ¿Pregunta frecuente 2?&#10;R: Respuesta detallada..."
              rows={6}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            <p className="text-gray-500 text-sm mt-1">
              Formato: "P: Pregunta?" seguido de "R: Respuesta"
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          ⚙️ Configuraciones Avanzadas
          <span className="text-sm font-normal text-gray-600 dark:text-gray-400">(Estado y visibilidad)</span>
        </h2>
        
        <div className="space-y-8">
          {/* Estado y Visibilidad */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">📊 Estado y Visibilidad</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estado del Servicio
                </label>
                <select
                  {...register('estado')}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="activo">✓ Activo</option>
                  <option value="desarrollo">⚙️ En desarrollo</option>
                  <option value="pausado">⏸️ Pausado</option>
                  <option value="descontinuado">❌ Descontinuado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de Soporte
                </label>
                <select
                  {...register('soporte')}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="basico">📧 Básico (Email)</option>
                  <option value="premium">💬 Premium (Chat + Email)</option>
                  <option value="dedicado">👨‍💼 Dedicado (Manager)</option>
                  <option value="24x7">🕐 24/7 (Soporte completo)</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-4 mt-6 border-t border-gray-700">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('destacado')}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-white">⭐ Servicio Destacado</span>
                <span className="text-gray-400 text-sm">(Aparece primero en listados)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('activo')}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-white">✓ Servicio Activo</span>
                <span className="text-gray-400 text-sm">(Disponible para nuevos clientes)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('visibleEnWeb')}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-white">👁️ Visible en Web</span>
                <span className="text-gray-400 text-sm">(Mostrar en sitio web público)</span>
              </label>
            </div>
          </div>

          {/* SEO */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">🔍 Optimización SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título SEO
                </label>
                <input
                  type="text"
                  {...register('seo.titulo')}
                  placeholder="Título optimizado para motores de búsqueda"
                  maxLength={60}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-gray-500 text-sm mt-1">
                  {watch('seo.titulo')?.length || 0}/60 caracteres
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción SEO
                </label>
                <textarea
                  {...register('seo.descripcion')}
                  placeholder="Descripción para motores de búsqueda"
                  maxLength={160}
                  rows={3}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
                <p className="text-gray-500 text-sm mt-1">
                  {watch('seo.descripcion')?.length || 0}/160 caracteres
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Palabras Clave
                </label>
                <input
                  type="text"
                  {...register('seo.palabrasClave')}
                  placeholder="desarrollo web, diseño, programación"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-gray-500 text-sm mt-1">
                  Separar con comas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicTab();
      case 'pricing':
        return renderPricingTab();
      case 'visual':
        return renderVisualTab();
      case 'advanced':
        return renderAdvancedTab();
      case 'features':
        return renderFeaturesTab();
      case 'settings':
        return renderSettingsTab();
      default:
        return renderBasicTab();
    }
  };

  // ============================================
  // LOADING STATE
  // ============================================

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Cargando servicio...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Global Sticky */}
      <div className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard/servicios/management')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
            >
              ← Volver
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? '✏️ Editar Servicio' : '+ Crear Servicio'}
            </h1>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNavigator
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Contenido del Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="pb-24">
        {/* Render del tab activo */}
        {renderTabContent()}

        {/* Footer Navigation Fijo */}
        <div className="sticky bottom-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                {tabs.findIndex(t => t.id === activeTab) + 1} de {tabs.length}
              </span>
              <div className="w-32 bg-gray-300 dark:bg-gray-700 rounded-full h-1">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${((tabs.findIndex(t => t.id === activeTab) + 1) / tabs.length) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={previousTab}
                disabled={isFirstTab}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-500 text-gray-900 dark:text-white rounded-lg transition-colors"
              >
                ← Anterior
              </button>
              
              {!isLastTab ? (
                <button
                  type="button"
                  onClick={nextTab}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                >
                  Siguiente →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all font-semibold shadow-lg hover:shadow-purple-500/50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      {isEditMode ? 'Actualizando...' : 'Creando...'}
                    </span>
                  ) : (
                    isEditMode ? '💾 Guardar Cambios' : '+ Crear Servicio'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ServicioFormV3;