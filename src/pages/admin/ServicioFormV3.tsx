/**
 * 📝 FORMULARIO DE SERVICIO V3 - Con Sistema de Tabs Simplificado
 * Versión limpia con tabs funcionales para crear y editar servicios
 */

import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { serviciosApi } from '../../services/serviciosApi';
// import { servicesAgentService } from '../../services/servicesAgentService'; // ✅ Reemplazado por useServicesAgentOptimized
import { RichTextEditor } from '../../components/common/RichTextEditor';
import { MultipleImageGallery } from '../../components/common/MultipleImageGallery';
import { ImageUploader } from '../../components/common/ImageUploader';
import { useTabNavigation, type Tab } from '../../components/common/TabNavigator';
import { useNotification } from '../../hooks/useNotification';
import { type Categoria } from '../../services/categoriasApi';
import { CreateCategoriaModal } from '../../components/categorias/CreateCategoriaModal';
import * as uploadApi from '../../services/uploadApi';
import { SEOPreview } from '../../components/admin/services/SEOPreview';
// ✅ Optimización Fase 3: Lazy loading - cargar modal solo cuando se abre
const ServicesCanvasModal = lazy(() => import('../../components/admin/services/ServicesCanvasModal'));
import AIFieldButton from '../../components/ai-assistant/AIFieldButton';
import BlockEditor from '../../components/ai-assistant/BlockEditor/BlockEditor';
import { useBlocksConverter } from '../../components/ai-assistant/hooks/useBlocksConverter';
import type { Block } from '../../components/ai-assistant/BlockEditor/types';
import { Sparkles } from 'lucide-react';
import useCategoriasCacheadas from '../../hooks/useCategoriasCacheadas';
import useServicesAgentOptimized from '../../hooks/useServicesAgentOptimized';

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
  const [etiquetaInput, setEtiquetaInput] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [showCreateCategoriaModal, setShowCreateCategoriaModal] = useState(false);
  const [showServicesCanvas, setShowServicesCanvas] = useState(false);

  // Estados para Block Editors
  const [caracteristicasBlocks, setCaracteristicasBlocks] = useState<Block[]>([]);
  const [beneficiosBlocks, setBeneficiosBlocks] = useState<Block[]>([]);
  const [faqBlocks, setFaqBlocks] = useState<Block[]>([]);
  const [generatingBlocks, setGeneratingBlocks] = useState(false);

  // Hook para convertir bloques ↔ texto
  const { textToBlocks, blocksToText } = useBlocksConverter();

  // ✅ Optimización Fase 3: Categorías cacheadas
  const { 
    categorias: categoriasCache, 
    loading: loadingCategorias, 
    invalidateAfterCreate: invalidateCategorias 
  } = useCategoriasCacheadas({ autoLoad: true });

  // Sincronizar categorías del cache
  useEffect(() => {
    setCategorias(categoriasCache);
  }, [categoriasCache]);

  // ✅ Optimización Fase 3: ServicesAgent con debouncing y caché
  const agentService = useServicesAgentOptimized({
    debounceMs: 500,      // Esperar 500ms antes de ejecutar
    maxConcurrent: 1,     // Solo 1 request a la vez
    cacheResults: true    // Cachear resultados
  });

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
      slug: '',
      descripcion: '',
      descripcionCorta: '',
      categoria: '',
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
      
      // Características y Etiquetas
      caracteristicas: '',
      beneficios: '',
      incluye: '',
      noIncluye: '',
      faq: '',
      etiquetas: [],
      
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
  // ✅ OPTIMIZACIÓN FASE 3: MEMOIZACIÓN
  // ============================================
  
  // Memoizar serviceContext para evitar re-renders del modal
  const serviceContext = useMemo(() => ({
    serviceId: id,
    serviceTitle: watch('titulo') || 'Nuevo Servicio',
    currentDescription: watch('descripcion') || '',
    currentPrice: watch('precio') || 0,
    currency: watch('moneda') || 'PEN',
    category: watch('categoria') || '',
    descriptionCorta: watch('descripcionCorta'),
    caracteristicas: watch('caracteristicas'),
    beneficios: watch('beneficios'),
    etiquetas: watch('etiquetas') || []
  }), [
    id,
    watch('titulo'),
    watch('descripcion'),
    watch('precio'),
    watch('moneda'),
    watch('categoria'),
    watch('descripcionCorta'),
    watch('caracteristicas'),
    watch('beneficios'),
    watch('etiquetas')
  ]);

  // ============================================
  // FUNCIONES DE CATEGORÍAS
  // ============================================

  // Manejar éxito al crear nueva categoría
  const handleCategoriaCreated = (nuevaCategoria: Categoria) => {
    setCategorias(prev => [...prev, nuevaCategoria].sort((a, b) => a.orden - b.orden));
    setValue('categoria', nuevaCategoria._id); // Seleccionar automáticamente la nueva categoría
    setShowCreateCategoriaModal(false);
    invalidateCategorias(); // ✅ Invalidar cache después de crear
  };

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
          slug: servicio.slug || '',
          descripcion: servicio.descripcion,
          descripcionCorta: servicio.descripcionCorta,
          categoria: typeof servicio.categoria === 'object' ? (servicio.categoria as any)?._id : servicio.categoria,
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
          
          // Etiquetas
          etiquetas: servicio.etiquetas || [],
          
          // Configuraciones adicionales - ✅ Priorizar campo 'seo', fallback a metaTitle/metaDescription
          seo: {
            titulo: servicio.seo?.titulo || servicio.metaTitle || '',
            descripcion: servicio.seo?.descripcion || servicio.metaDescription || '',
            palabrasClave: servicio.seo?.palabrasClave || ''
          },
          tiempoEntrega: servicio.tiempoEntrega || '',
          garantia: servicio.garantia || '',
          soporte: servicio.soporte || 'basico',
        });

        // Convertir texto cargado a bloques
        const caracteristicasText = Array.isArray(servicio.caracteristicas) 
          ? servicio.caracteristicas.map(c => `• ${c}`).join('\n')
          : servicio.caracteristicas || '';
        const beneficiosText = Array.isArray(servicio.beneficios)
          ? servicio.beneficios.map(b => `• ${b}`).join('\n')
          : servicio.beneficios || '';
        const faqText = Array.isArray(servicio.faq) && servicio.faq.length > 0 && typeof servicio.faq[0] === 'object'
          ? servicio.faq.map((f: any) => `P: ${f.pregunta}\nR: ${f.respuesta}`).join('\n\n')
          : typeof servicio.faq === 'string' ? servicio.faq : '';

        setCaracteristicasBlocks(textToBlocks(caracteristicasText, 'list'));
        setBeneficiosBlocks(textToBlocks(beneficiosText, 'list'));
        setFaqBlocks(textToBlocks(faqText, 'faq'));
      }
    } catch (err: any) {
      console.error('Error al cargar servicio:', err);
      error('Error', 'No se pudo cargar el servicio');
    } finally {
      setLoadingData(false);
    }
  };

  // ============================================
  // FUNCIONES AUXILIARES
  // ============================================

  // Generar slug desde título
  const generateSlug = (titulo: string): string => {
    if (!titulo) return '';
    return titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
      .replace(/[^a-z0-9]+/g, '-') // Reemplazar espacios y caracteres especiales
      .replace(/^-+|-+$/g, ''); // Quitar guiones del inicio y final
  };

  // Actualizar slug automáticamente cuando cambie el título (solo en modo edición)
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'titulo' && isEditMode && value.titulo) {
        // En modo edición, sugerir actualización del slug
        const newSlug = generateSlug(value.titulo);
        // Por ahora solo lo almacenamos, luego podemos agregar UI para confirmarlo
        setValue('slug', newSlug);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, isEditMode]);

  // ============================================
  // FUNCIONES DE ETIQUETAS
  // ============================================

  // Agregar etiqueta
  const addEtiqueta = () => {
    if (etiquetaInput.trim()) {
      const currentEtiquetas = watch('etiquetas') || [];
      setValue('etiquetas', [...currentEtiquetas, etiquetaInput.trim()]);
      setEtiquetaInput('');
    }
  };

  // Eliminar etiqueta
  const removeEtiqueta = (index: number) => {
    const currentEtiquetas = watch('etiquetas') || [];
    setValue('etiquetas', currentEtiquetas.filter((_: string, i: number) => i !== index));
  };

  // Manejar Enter en input de etiquetas
  const handleEtiquetaKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEtiqueta();
    }
  };

  // ============================================
  // GENERAR BLOQUES CON IA
  // ============================================

  const handleGenerateBlocks = async (
    blockType: 'features' | 'benefits' | 'faq',
    setBlocks: React.Dispatch<React.SetStateAction<Block[]>>
  ) => {
    if (!id) {
      error('Error', 'Debes guardar el servicio primero antes de generar contenido');
      return;
    }

    try {
      setGeneratingBlocks(true);

      // Mapear tipo de bloque a contentType del backend
      const contentTypeMap = {
        features: 'features' as const,
        benefits: 'benefits' as const,
        faq: 'faq' as const
      };

      const contentType = contentTypeMap[blockType];

      // ✅ Llamar con debouncing y caché
      const response = await agentService.generateContent({
        serviceId: id,
        contentType,
        style: 'formal'
      });

      if (response.success && response.data?.content) {
        const generatedText = response.data.content;
        
        // Convertir el texto generado a bloques
        const newBlocks = textToBlocks(generatedText, blockType === 'faq' ? 'faq' : 'list');
        
        // Reemplazar bloques existentes con los nuevos
        setBlocks(newBlocks);
        
        success('Éxito', `Se generaron ${newBlocks.length} bloques con IA`);
      } else {
        error('Error', response.error || 'No se pudo generar el contenido');
      }
    } catch (err: any) {
      console.error('Error generating blocks:', err);
      error('Error', err.message || 'Error al generar bloques con IA');
    } finally {
      setGeneratingBlocks(false);
    }
  };

  // Generar contenido de texto simple con IA (autocompletado directo)
  const handleGenerateText = async (
    contentType: 'full_description' | 'short_description',
    fieldName: string,
    style: 'formal' | 'casual' | 'technical' = 'formal'
  ) => {
    if (!id) {
      error('Error', 'Debes guardar el servicio primero antes de generar contenido');
      return;
    }

    try {
      setGeneratingBlocks(true);

      // ✅ Llamar con debouncing y caché
      const response = await agentService.generateContent({
        serviceId: id,
        contentType,
        style
      });

      if (response.success && response.data?.content) {
        let generatedText = response.data.content;
        
        // Limpiar contenido: remover secciones de recomendaciones y análisis
        // Estas secciones son útiles para el agente pero no para el usuario final
        generatedText = generatedText
          .replace(/💡\s*RECOMENDACIÓN:[\s\S]*?(?=\n\n|$)/gi, '') // Remover sección de recomendación
          .replace(/🔍\s*ANÁLISIS:[\s\S]*?(?=\n\n|$)/gi, '') // Remover sección de análisis
          .replace(/📊\s*SUGERENCIA:[\s\S]*?(?=\n\n|$)/gi, '') // Remover sugerencias
          .replace(/⚠️\s*NOTA:[\s\S]*?(?=\n\n|$)/gi, '') // Remover notas
          .replace(/\n{3,}/g, '\n\n') // Limpiar múltiples saltos de línea
          .trim();
        
        // Aplicar límites de caracteres según el campo para evitar errores de validación
        const fieldLimits: Record<string, number> = {
          'descripcionRica': 3000,      // RichTextEditor permite 3000
          'contenidoAdicional': 1950    // Backend valida 2000, dejamos margen de seguridad
        };
        
        const maxLength = fieldLimits[fieldName];
        
        if (maxLength && generatedText.length > maxLength) {
          // Truncar el texto de forma inteligente (en el último punto antes del límite)
          let truncatedText = generatedText.substring(0, maxLength);
          const lastPeriod = truncatedText.lastIndexOf('.');
          
          if (lastPeriod > maxLength * 0.8) { // Si el último punto está en el último 20%
            truncatedText = truncatedText.substring(0, lastPeriod + 1);
          } else {
            // Si no hay punto cercano, truncar en el último espacio
            const lastSpace = truncatedText.lastIndexOf(' ');
            truncatedText = truncatedText.substring(0, lastSpace) + '...';
          }
          
          generatedText = truncatedText;
          console.warn(`⚠️ Contenido truncado de ${response.data.content.length} a ${generatedText.length} caracteres`);
        }
        
        setValue(fieldName, generatedText);
        
        // Mensajes personalizados según el campo
        const fieldMessages: Record<string, string> = {
          'descripcionRica': '✨ Descripción rica generada y aplicada automáticamente',
          'contenidoAdicional': '✨ Contenido adicional generado y aplicado automáticamente'
        };
        
        const message = fieldMessages[fieldName] || '✨ Contenido generado y aplicado exitosamente';
        success('Éxito', message);
      } else {
        error('Error', response.error || 'No se pudo generar el contenido');
      }
    } catch (err: any) {
      console.error('Error generating text:', err);
      error('Error', err.message || 'Error al generar contenido con IA');
    } finally {
      setGeneratingBlocks(false);
    }
  };

  // Generar contenido SEO con IA (autocompletado directo de los 3 campos)
  const handleGenerateSEO = async () => {
    if (!id) {
      error('Error', 'Debes guardar el servicio primero antes de generar SEO');
      return;
    }

    try {
      setGeneratingBlocks(true);

      // ✅ Generar título SEO con debouncing
      const titleResponse = await agentService.generateContent({
        serviceId: id,
        contentType: 'short_description',
        style: 'formal'
      });
      
      if (titleResponse.success && titleResponse.data?.content) {
        // Crear un título SEO más atractivo y optimizado
        const baseTitle = titleResponse.data.content;
        const seoTitle = baseTitle.length > 60 
          ? baseTitle.substring(0, 57) + '...' 
          : baseTitle;
        setValue('seo.titulo', seoTitle);
      }

      // ✅ Generar descripción SEO con debouncing
      const descResponse = await agentService.generateContent({
        serviceId: id,
        contentType: 'full_description',
        style: 'formal'
      });
      
      if (descResponse.success && descResponse.data?.content) {
        // Crear descripción SEO dentro del límite de 160 caracteres
        const fullDesc = descResponse.data.content;
        const seoDesc = fullDesc.length > 160 
          ? fullDesc.substring(0, 157) + '...' 
          : fullDesc;
        setValue('seo.descripcion', seoDesc);
      }

      // Generar palabras clave inteligentes basadas en el servicio
      const currentTitle = watch('titulo') || '';
      const currentDesc = watch('descripcionCorta') || '';
      const currentCategory = categorias.find(cat => cat._id === watch('categoria'))?.nombre || '';
      
      // Extraer palabras clave del título y descripción
      const titleWords = currentTitle.toLowerCase().split(' ').filter((w: string) => w.length > 3);
      const descWords = currentDesc.toLowerCase().split(' ').filter((w: string) => w.length > 4);
      
      const keywords = [
        ...titleWords.slice(0, 2),
        currentCategory.toLowerCase(),
        ...descWords.slice(0, 2),
        'servicio profesional',
        'solución empresarial'
      ].filter(Boolean).slice(0, 8).join(', ');
      
      setValue('seo.palabrasClave', keywords);

      success('Éxito', '✨ Contenido SEO optimizado y aplicado automáticamente');
    } catch (err: any) {
      console.error('Error generating SEO:', err);
      error('Error', err.message || 'Error al generar SEO con IA');
    } finally {
      setGeneratingBlocks(false);
    }
  };

  // ============================================
  // SUBMIT
  // ============================================

  const onSubmit = async (data: any) => {
    try {
      // ✅ Validación de campos SEO antes de enviar
      if (data.seo?.titulo && data.seo.titulo.length > 60) {
        error('Validación', 'El título SEO no puede exceder 60 caracteres');
        return;
      }
      if (data.seo?.descripcion && data.seo.descripcion.length > 160) {
        error('Validación', 'La descripción SEO no puede exceder 160 caracteres');
        return;
      }
      if (data.seo?.palabrasClave && data.seo.palabrasClave.length > 500) {
        error('Validación', 'Las palabras clave no pueden exceder 500 caracteres');
        return;
      }

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
      // Convertir bloques a texto antes de procesar
      const caracteristicasText = caracteristicasBlocks.length > 0 
        ? blocksToText(caracteristicasBlocks)
        : data.caracteristicas;
      const beneficiosText = beneficiosBlocks.length > 0
        ? blocksToText(beneficiosBlocks)
        : data.beneficios;
      const faqText = faqBlocks.length > 0
        ? blocksToText(faqBlocks)
        : data.faq;

      const processedData = {
        ...data,
        caracteristicas: processTextToArray(caracteristicasText),
        beneficios: processTextToArray(beneficiosText),
        incluye: processTextToArray(data.incluye),
        noIncluye: processTextToArray(data.noIncluye),
        faq: processFaqText(faqText),
        // ✅ Asegurar que el objeto seo se preserve correctamente
        seo: {
          titulo: data.seo?.titulo || '',
          descripcion: data.seo?.descripcion || '',
          palabrasClave: data.seo?.palabrasClave || ''
        }
      };

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
    <div className="max-w-5xl mx-auto py-4 lg:py-8 px-4 lg:px-6">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-4 lg:p-6">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 flex items-center gap-2">
          📋 Información Básica
          <span className="text-xs lg:text-sm font-normal text-gray-600 dark:text-gray-400">(Obligatorio)</span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Título */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                {...register('titulo', { required: 'El título es obligatorio' })}
                placeholder="Ej: Desarrollo Web Profesional"
                className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {isEditMode && id && (
                <AIFieldButton
                  key={`btn-titulo-${id}`}
                  fieldName="titulo"
                  fieldLabel="Título del Servicio"
                  fieldType="title"
                  currentValue={watch('titulo')}
                  serviceContext={{
                    serviceId: id,
                    titulo: watch('titulo'),
                    descripcionCorta: watch('descripcionCorta'),
                    categoria: watch('categoria')
                  }}
                  size="md"
                />
              )}
            </div>
            {errors.titulo && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{String(errors.titulo.message)}</p>
            )}
          </div>

          {/* Categoría y Estado */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Categoría *
              </label>
              <button
                type="button"
                onClick={() => setShowCreateCategoriaModal(true)}
                className="inline-flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                <span className="text-xs">➕</span>
                Nueva
              </button>
            </div>
            <select
              {...register('categoria', { required: 'La categoría es obligatoria' })}
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loadingCategorias}
            >
              <option value="">
                {loadingCategorias ? 'Cargando categorías...' : 'Selecciona una categoría'}
              </option>
              {categorias.map((categoria) => (
                <option key={categoria._id} value={categoria._id}>
                  {categoria.icono} {categoria.nombre}
                </option>
              ))}
            </select>
            {errors.categoria && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{String(errors.categoria.message)}</p>
            )}
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
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción Corta
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                {...register('descripcionCorta')}
                placeholder="Resumen breve del servicio (máx. 200 caracteres)"
                maxLength={200}
                className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {isEditMode && id && (
                <AIFieldButton
                  key={`btn-descripcionCorta-${id}`}
                  fieldName="descripcionCorta"
                  fieldLabel="Descripción Corta"
                  fieldType="short_text"
                  currentValue={watch('descripcionCorta')}
                  serviceContext={{
                    serviceId: id,
                    titulo: watch('titulo'),
                    descripcionCorta: watch('descripcionCorta'),
                    categoria: watch('categoria')
                  }}
                  size="md"
                />
              )}
            </div>
          </div>

          {/* Descripción completa */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-between">
              <span>Descripción Completa *</span>
              {isEditMode && id && (
                <AIFieldButton
                  key={`btn-descripcion-${id}`}
                  fieldName="descripcion"
                  fieldLabel="Descripción Completa"
                  fieldType="long_text"
                  currentValue={watch('descripcion')}
                  serviceContext={{
                    serviceId: id,
                    titulo: watch('titulo'),
                    descripcionCorta: watch('descripcionCorta'),
                    categoria: watch('categoria')
                  }}
                  size="sm"
                />
              )}
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

          {/* Etiquetas */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Etiquetas
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(Presiona Enter para agregar)</span>
            </label>
            <div className="space-y-3">
              {/* Input para agregar etiquetas */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={etiquetaInput}
                  onChange={(e) => setEtiquetaInput(e.target.value)}
                  onKeyPress={handleEtiquetaKeyPress}
                  placeholder="Ej: react, desarrollo, web..."
                  className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={addEtiqueta}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                >
                  Agregar
                </button>
              </div>
              
              {/* Lista de etiquetas */}
              {watch('etiquetas')?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watch('etiquetas').map((etiqueta: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm rounded-full border border-purple-200 dark:border-purple-700"
                    >
                      {etiqueta}
                      <button
                        type="button"
                        onClick={() => removeEtiqueta(index)}
                        className="ml-1 text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
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
    <div className="max-w-5xl mx-auto py-8 px-6">
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
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Descripción Rica
              </label>
              <button
                type="button"
                onClick={() => handleGenerateText('full_description', 'descripcionRica', 'formal')}
                disabled={generatingBlocks || !id}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg text-sm"
              >
                {generatingBlocks ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                    <span>Generando...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Generar con IA</span>
                  </>
                )}
              </button>
            </div>
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contenido Adicional
              </label>
              <button
                type="button"
                onClick={() => handleGenerateText('full_description', 'contenidoAdicional', 'technical')}
                disabled={generatingBlocks || !id}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg text-sm"
              >
                {generatingBlocks ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                    <span>Generando...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Generar con IA</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              {...register('contenidoAdicional')}
              placeholder="Información extra, proceso de trabajo, garantías, etc."
              rows={4}
              maxLength={2000}
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-gray-600 dark:text-gray-500 text-sm">
                Información adicional que aparecerá al final de la página de detalles
              </p>
              <p className={`text-sm font-medium ${
                (watch('contenidoAdicional')?.length || 0) > 1900 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {watch('contenidoAdicional')?.length || 0}/2000
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPricingTab = () => (
    <div className="max-w-5xl mx-auto py-8 px-6">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          💰 Precios y Comercial
          <span className="text-sm font-normal text-gray-600 dark:text-gray-400">(Configuración comercial)</span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
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
            <div className="flex gap-2">
              <input
                type="text"
                {...register('etiquetaPromocion')}
                placeholder="Ej: ¡OFERTA ESPECIAL!, NUEVO, POPULAR"
                maxLength={50}
                className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {isEditMode && id && (
                <AIFieldButton
                  key={`btn-etiquetaPromocion-${id}`}
                  fieldName="etiquetaPromocion"
                  fieldLabel="Etiqueta Promocional"
                  fieldType="promotional"
                  currentValue={watch('etiquetaPromocion')}
                  serviceContext={{
                    serviceId: id,
                    titulo: watch('titulo'),
                    descripcionCorta: watch('descripcionCorta'),
                    categoria: watch('categoria')
                  }}

                  size="md"
                />
              )}
            </div>
          </div>

          {/* Tiempo de Entrega */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tiempo de Entrega
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                {...register('tiempoEntrega')}
                placeholder="Ej: 7-10 días, 2 semanas, Inmediato"
                className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {isEditMode && id && (
                <AIFieldButton
                  key={`btn-tiempoEntrega-${id}`}
                  fieldName="tiempoEntrega"
                  fieldLabel="Tiempo de Entrega"
                  fieldType="short_text"
                  currentValue={watch('tiempoEntrega')}
                  serviceContext={{
                    serviceId: id,
                    titulo: watch('titulo'),
                    descripcionCorta: watch('descripcionCorta'),
                    categoria: watch('categoria')
                  }}

                  size="sm"
                />
              )}
            </div>
          </div>

          {/* Garantía */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Garantía
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                {...register('garantia')}
                placeholder="Ej: 30 días, 6 meses, 1 año"
                className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {isEditMode && id && (
                <AIFieldButton
                  key={`btn-garantia-${id}`}
                  fieldName="garantia"
                  fieldLabel="Garantía"
                  fieldType="short_text"
                  currentValue={watch('garantia')}
                  serviceContext={{
                    serviceId: id,
                    titulo: watch('titulo'),
                    descripcionCorta: watch('descripcionCorta'),
                    categoria: watch('categoria')
                  }}

                  size="sm"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVisualTab = () => (
    <div className="max-w-5xl mx-auto py-8 px-6">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          🎨 Diseño Visual
          <span className="text-sm font-normal text-purple-600 dark:text-purple-400">(Opcional)</span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Icono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icono del Servicio
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                {...register('icono')}
                placeholder="🚀"
                maxLength={4}
                className="w-16 h-16 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-center text-xl placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex-1 text-sm text-gray-600 dark:text-gray-400">
                <p>Emoji o símbolo para representar el servicio</p>
                <p className="text-xs mt-1">Ejemplos: 🚀 💻 🎨 📱 �️</p>
              </div>
            </div>
          </div>

          {/* Imagen Principal */}
          <div className="lg:col-span-2">
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
          <div className="lg:col-span-2 mt-4 p-4 bg-gray-100/50 dark:bg-gray-700/30 rounded-lg border border-gray-300 dark:border-gray-600">
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
    <div className="max-w-5xl mx-auto py-8 px-6">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          ⚡ Características y Beneficios
          <span className="text-sm font-normal text-purple-600 dark:text-purple-400">(Opcional)</span>
        </h2>
        
        <div className="space-y-8">
          {/* Características Principales - BLOCK EDITOR */}
          <div>
            <BlockEditor
              blocks={caracteristicasBlocks}
              onChange={setCaracteristicasBlocks}
              config={{
                title: '⚡ Características Principales',
                allowedTypes: ['list-item'],
                placeholder: 'Agrega características principales del servicio',
                maxBlocks: 10
              }}
              serviceContext={{
                serviceId: id,
                titulo: watch('titulo'),
                descripcionCorta: watch('descripcionCorta'),
                categoria: watch('categoria')
              }}
              onGenerateWithAI={() => handleGenerateBlocks('features', setCaracteristicasBlocks)}
              isGenerating={generatingBlocks}
            />
          </div>

          {/* Beneficios - BLOCK EDITOR */}
          <div>
            <BlockEditor
              blocks={beneficiosBlocks}
              onChange={setBeneficiosBlocks}
              config={{
                title: '💎 Beneficios Clave',
                allowedTypes: ['list-item'],
                placeholder: '¿Qué beneficios obtiene el cliente?',
                maxBlocks: 10
              }}
              serviceContext={{
                serviceId: id,
                titulo: watch('titulo'),
                descripcionCorta: watch('descripcionCorta'),
                categoria: watch('categoria')
              }}
              onGenerateWithAI={() => handleGenerateBlocks('benefits', setBeneficiosBlocks)}
              isGenerating={generatingBlocks}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Qué Incluye */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center justify-between">
                <span>✅ Qué Incluye</span>
                <AIFieldButton
                  key={`btn-incluye-${id}`}
                  fieldName="incluye"
                  fieldLabel="Qué Incluye"
                  fieldType="list"
                  currentValue={watch('incluye')}
                  serviceContext={{
                    serviceId: id,
                    titulo: watch('titulo'),
                    descripcionCorta: watch('descripcionCorta'),
                    categoria: watch('categoria')
                  }}

                  size="sm"
                />
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
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center justify-between">
                <span>❌ Qué NO Incluye</span>
                <AIFieldButton
                  key={`btn-noIncluye-${id}`}
                  fieldName="noIncluye"
                  fieldLabel="Qué NO Incluye"
                  fieldType="list"
                  currentValue={watch('noIncluye')}
                  serviceContext={{
                    serviceId: id,
                    titulo: watch('titulo'),
                    descripcionCorta: watch('descripcionCorta'),
                    categoria: watch('categoria')
                  }}

                  size="sm"
                />
              </label>
              <textarea
                {...register('noIncluye')}
                placeholder="• Servicio no incluido 1&#10;• Servicio no incluido 2"
                rows={5}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>
          </div>

          {/* FAQ - BLOCK EDITOR */}
          <div>
            <BlockEditor
              blocks={faqBlocks}
              onChange={setFaqBlocks}
              config={{
                title: '❓ Preguntas Frecuentes (FAQ)',
                allowedTypes: ['faq-item'],
                placeholder: 'Agrega preguntas frecuentes sobre el servicio',
                maxBlocks: 15
              }}
              serviceContext={{
                serviceId: id,
                titulo: watch('titulo'),
                descripcionCorta: watch('descripcionCorta'),
                categoria: watch('categoria')
              }}
              onGenerateWithAI={() => handleGenerateBlocks('faq', setFaqBlocks)}
              isGenerating={generatingBlocks}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="max-w-5xl mx-auto py-8 px-6">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          ⚙️ Configuraciones Avanzadas
          <span className="text-sm font-normal text-gray-600 dark:text-gray-400">(Estado y visibilidad)</span>
        </h2>
        
        <div className="space-y-8">
          {/* URL y Slug */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">🔗 URL del Servicio</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slug de la URL
                  <span className="text-xs text-gray-400 ml-2">
                    {isEditMode ? '(Se actualizará al cambiar el título)' : '(Se genera automáticamente)'}
                  </span>
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">
                    /servicios/
                  </span>
                  <input
                    type="text"
                    {...register('slug')}
                    placeholder={generateSlug(watch('titulo') || 'titulo-del-servicio')}
                    className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="mt-2 text-xs text-gray-400 bg-gray-800/50 rounded-lg p-3">
                  <div className="font-medium text-purple-400 mb-1">URL completa:</div>
                  <div className="font-mono text-gray-300">
                    https://scuticompany.com/servicios/{watch('slug') || generateSlug(watch('titulo') || 'titulo-del-servicio')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estado y Visibilidad */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">📊 Estado y Visibilidad</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">🔍 Optimización SEO</h3>
              <button
                type="button"
                onClick={handleGenerateSEO}
                disabled={generatingBlocks || !id}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {generatingBlocks ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span className="text-sm font-medium">Generando SEO...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-sm font-medium">Generar SEO Completo con IA</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              💡 El botón genera automáticamente: Título SEO + Descripción + Palabras Clave
            </p>

            {/* Vista Previa SEO en Tiempo Real */}
            <div className="mb-6">
              <SEOPreview
                titulo={watch('seo.titulo') || ''}
                descripcion={watch('seo.descripcion') || ''}
                url={watch('slug') ? `www.tuempresa.com/servicios/${watch('slug')}` : undefined}
              />
            </div>

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
                  className={`w-full bg-gray-700/50 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    (watch('seo.titulo')?.length || 0) > 60 
                      ? 'border-red-500 focus:ring-red-500' 
                      : (watch('seo.titulo')?.length || 0) > 50
                      ? 'border-yellow-500 focus:ring-yellow-500'
                      : 'border-gray-600 focus:ring-purple-500'
                  }`}
                />
                <p className={`text-sm mt-1 ${
                  (watch('seo.titulo')?.length || 0) > 60 ? 'text-red-400' :
                  (watch('seo.titulo')?.length || 0) > 50 ? 'text-yellow-400' :
                  'text-gray-500'
                }`}>
                  {watch('seo.titulo')?.length || 0}/60 caracteres
                  {(watch('seo.titulo')?.length || 0) > 60 && ' - Demasiado largo'}
                  {(watch('seo.titulo')?.length || 0) > 50 && (watch('seo.titulo')?.length || 0) <= 60 && ' - Casi al límite'}
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
                  className={`w-full bg-gray-700/50 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 resize-none ${
                    (watch('seo.descripcion')?.length || 0) > 160 
                      ? 'border-red-500 focus:ring-red-500' 
                      : (watch('seo.descripcion')?.length || 0) > 150
                      ? 'border-yellow-500 focus:ring-yellow-500'
                      : 'border-gray-600 focus:ring-purple-500'
                  }`}
                />
                <p className={`text-sm mt-1 ${
                  (watch('seo.descripcion')?.length || 0) > 160 ? 'text-red-400' :
                  (watch('seo.descripcion')?.length || 0) > 150 ? 'text-yellow-400' :
                  'text-gray-500'
                }`}>
                  {watch('seo.descripcion')?.length || 0}/160 caracteres
                  {(watch('seo.descripcion')?.length || 0) > 160 && ' - Demasiado largo'}
                  {(watch('seo.descripcion')?.length || 0) > 150 && (watch('seo.descripcion')?.length || 0) <= 160 && ' - Casi al límite'}
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col">
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
            
            {/* Botón AI Assistant */}
            <button
              type="button"
              onClick={() => setShowServicesCanvas(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              title="Abrir Asistente IA"
            >
              <Sparkles size={18} className="animate-pulse" />
              <span className="font-medium">AI Assistant</span>
            </button>
          </div>
        </div>

        {/* Contenido del Formulario */}
        <div className="flex-1 flex">
          <div className="flex-1 overflow-y-auto">
            {/* Navegador Flotante Móvil */}
            <div className="lg:hidden sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {tabs.find(t => t.id === activeTab)?.title}
                </h3>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {tabs.findIndex(t => t.id === activeTab) + 1}/{tabs.length}
                </span>
              </div>
              
              {/* Barra de progreso móvil */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${((tabs.findIndex(t => t.id === activeTab) + 1) / tabs.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Navegación compacta */}
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={previousTab}
                  disabled={isFirstTab}
                  className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-500 text-gray-900 dark:text-white rounded-lg transition-colors text-sm font-medium"
                >
                  ← Anterior
                </button>
                
                {/* Selector de tabs móvil */}
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {tabs.map((tab) => (
                    <option key={tab.id} value={tab.id}>
                      {tab.icon} {tab.title}
                    </option>
                  ))}
                </select>
                
                {!isLastTab ? (
                  <button
                    type="button"
                    onClick={nextTab}
                    className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-sm"
                  >
                    Siguiente →
                  </button>
                ) : (
                  <button
                    type="submit"
                    form="servicio-form"
                    disabled={isSubmitting}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg transition-all font-medium text-sm"
                  >
                    {isSubmitting ? '⏳' : '💾'}
                  </button>
                )}
              </div>
            </div>

            <form id="servicio-form" onSubmit={handleSubmit(onSubmit)} className="pb-6">
              {/* Render del tab activo */}
              {renderTabContent()}
            </form>
          </div>

          {/* Barra Lateral Derecha - Solo Desktop */}
          <div className="hidden lg:flex w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex-col">
            {/* Header de la Barra Lateral */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Configuración del Servicio
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((tabs.findIndex(t => t.id === activeTab) + 1) / tabs.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {tabs.findIndex(t => t.id === activeTab) + 1}/{tabs.length}
                </span>
              </div>
            </div>

            {/* Lista de Tabs */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full text-left p-4 rounded-xl transition-all duration-200
                    ${activeTab === tab.id 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105' 
                      : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-102'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{tab.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{tab.title}</h3>
                      {tab.isOptional && (
                        <span className={`text-xs ${activeTab === tab.id ? 'text-purple-100' : 'text-purple-600 dark:text-purple-400'}`}>
                          (Opcional)
                        </span>
                      )}
                    </div>
                    {/* Indicador de estado */}
                    <div className="flex items-center">
                      {tab.isValid ? (
                        <div className={`w-2 h-2 rounded-full ${activeTab === tab.id ? 'bg-green-300' : 'bg-green-500'}`} />
                      ) : tab.isCompleted ? (
                        <div className={`w-2 h-2 rounded-full ${activeTab === tab.id ? 'bg-yellow-300' : 'bg-yellow-500'}`} />
                      ) : (
                        <div className={`w-2 h-2 rounded-full ${activeTab === tab.id ? 'bg-gray-300' : 'bg-gray-400'}`} />
                      )}
                    </div>
                  </div>
                  <p className={`text-xs ${activeTab === tab.id ? 'text-purple-100' : 'text-gray-600 dark:text-gray-400'}`}>
                    {tab.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Footer de la Barra Lateral */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              {/* Navegación */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={previousTab}
                  disabled={isFirstTab}
                  className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-500 text-gray-900 dark:text-white rounded-lg transition-colors text-sm font-medium"
                >
                  ← Anterior
                </button>
                
                {!isLastTab ? (
                  <button
                    type="button"
                    onClick={nextTab}
                    className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-sm"
                  >
                    Siguiente →
                  </button>
                ) : null}
              </div>
              
              {/* Botón de Guardar */}
              {isLastTab && (
                <button
                  type="submit"
                  form="servicio-form"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all font-semibold shadow-lg hover:shadow-purple-500/50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
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
      </div>

      {/* Modal para crear nueva categoría */}
      <CreateCategoriaModal
        isOpen={showCreateCategoriaModal}
        onClose={() => setShowCreateCategoriaModal(false)}
        onSuccess={handleCategoriaCreated}
      />

      {/* ✅ Services Canvas Modal con Lazy Loading y Suspense */}
      {showServicesCanvas && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="text-gray-700">Cargando asistente IA...</span>
            </div>
          </div>
        }>
          <ServicesCanvasModal
            isOpen={showServicesCanvas}
            onClose={() => setShowServicesCanvas(false)}
            initialMode="chat"
            serviceContext={serviceContext}
          />
        </Suspense>
      )}
    </div>
  );
};

export default ServicioFormV3;
