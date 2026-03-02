import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useCmsData } from '../../hooks/cms/useCmsData';
import { useCmsUpdaters } from '../../hooks/cms/useCmsUpdaters';
import HeroConfigSection from './HeroConfigSection';
import MissionVisionConfigSection from './MissionVisionConfigSection';
import ValuesConfigSection from './ValuesConfigSection';
import SolutionsConfigSection from './SolutionsConfigSection';
import ValueAddedConfigSection from './ValueAddedConfigSection';
import ClientLogosConfigSection from './ClientLogosConfigSection';
import FeaturedBlogConfigSection from './FeaturedBlogConfigSection';
import CardItemsEditor from './CardItemsEditor';
import SeoConfigSection from './SeoConfigSection';
import ThemeConfigSection from './ThemeConfigSection';
import CardsDesignConfigSection from './CardsDesignConfigSection';
import ContactConfigSection from './ContactConfigSection';
import ContactFormEditor from './ContactFormEditor';
import ChatbotConfigSection from './ChatbotConfigSection';
import ServicesFilterConfigSection from './ServicesFilterConfigSection';
import ServicesGridConfigSection from './ServicesGridConfigSection';
import ServicesAccordionConfigSection from './ServicesAccordionConfigSection';
import BlogHeroConfigSection from './BlogHeroConfigSection';
import FeaturedPostsConfigSection from './FeaturedPostsConfigSection';
import AllNewsConfigSection from './AllNewsConfigSection';
import BlogCtaConfigSection from './BlogCtaConfigSection';
import ServicioDetailConfigSection from './ServicioDetailConfigSection';
import BlogPostDetailConfigSection from './BlogPostDetailConfigSection';
import SidebarConfigSection from './SidebarConfigSection';
import DashboardFeaturedPostsConfigSection from './DashboardFeaturedPostsConfigSection';
import ProyectoDetailConfigSection from './ProyectoDetailConfigSection';
import ServicesExtraSectionsConfig from './ServicesExtraSectionsConfig';
import ManagedImageSelector from '../ManagedImageSelector';
import { defaultChatbotConfig } from '../../config/defaultChatbotConfig';

const CmsManager: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme: currentTheme } = useTheme(); // 🆕 Obtener tema actual
  
  // 🆕 Estado para manejar qué página se está editando
  const [selectedPage, setSelectedPage] = useState<'home' | 'about' | 'services' | 'contact' | 'blog' | 'servicio-detail' | 'blog-post-detail' | 'proyectos' | 'proyecto-detail'>('home');
  
  // Determinar tab activo desde la URL
  const getInitialTab = (): 'content' | 'seo' | 'theme' | 'cards' | 'contact' | 'chatbot' | 'sidebar' => {
    const path = location.pathname;
    if (path.includes('/seo')) return 'seo';
    if (path.includes('/theme')) return 'theme';
    if (path.includes('/cards')) return 'cards';
    if (path.includes('/contact')) return 'contact';
    if (path.includes('/chatbot')) return 'chatbot';
    if (path.includes('/sidebar')) return 'sidebar';
    return 'content';
  };

  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'theme' | 'cards' | 'contact' | 'chatbot' | 'sidebar'>(getInitialTab());
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [hasGlobalChanges, setHasGlobalChanges] = useState(false); // 🔥 Estado para detectar cambios globales

  // ...existing code...

  // Sincronizar tab con URL
  useEffect(() => {
    const newTab = getInitialTab();
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [location.pathname]);

  // Actualizar URL cuando cambia el tab
  const handleTabChange = (tab: 'content' | 'seo' | 'theme' | 'cards' | 'contact' | 'chatbot' | 'sidebar') => {
    setActiveTab(tab);
    const baseUrl = '/dashboard/cms';
    if (tab === 'content') {
      navigate(baseUrl);
    } else {
      navigate(`${baseUrl}/${tab}`);
    }
  };

  const {
    pageData,
    loading: dataLoading,
    message: dataMessage,
    setPageData,
    setThemeConfig,
    loadPageData,
    handleSave
  } = useCmsData(selectedPage); // 🔥 Pasar selectedPage al hook

  // 🔥 Recargar datos cuando cambia la página seleccionada
  useEffect(() => {
    console.log('🔄 [CMS Manager] Cambiando a página:', selectedPage);
    setHasGlobalChanges(false); // Resetear cambios al cambiar de página
    setSaveStatus('idle');
    loadPageData(); // Recargar datos de la nueva página
  }, [selectedPage]);

  const {
    updateContent,
    updateTextStyle,
    updateSimpleButtonStyle,
    updateSeo
  } = useCmsUpdaters(pageData, setPageData, setThemeConfig);



  // Update content without auto-save (manual save only)
  const handleUpdateContent = (field: string, value: any) => {
    updateContent(field, value);
    // 🔥 Marcar como cambios pendientes GLOBALMENTE
    if (!hasGlobalChanges) {
      setHasGlobalChanges(true);
    }
    setSaveStatus('idle');
  };

  // Update text style without auto-save (manual save only)
  const handleUpdateTextStyle = (section: 'hero' | 'solutions' | 'valueAdded' | 'clientLogos' | 'featuredBlog', field: string, mode: 'light' | 'dark', color: string) => {
    updateTextStyle(section, field, mode, color);
    // 🔥 Marcar como cambios pendientes GLOBALMENTE
    if (!hasGlobalChanges) {
      setHasGlobalChanges(true);
    }
    setSaveStatus('idle');
  };

  // Update button style without auto-save (manual save only)
  const handleUpdateSimpleButtonStyle = (mode: 'lightMode' | 'darkMode', buttonType: 'ctaPrimary' | 'contact' | 'dashboard' | 'viewMore' | 'featuredBlogCta', style: any) => {
    updateSimpleButtonStyle(mode, buttonType, style);
    // 🔥 Marcar como cambios pendientes GLOBALMENTE
    if (!hasGlobalChanges) {
      setHasGlobalChanges(true);
    }
    setSaveStatus('idle');
  };

  // 🔥 NUEVO: Función para actualizar meta tags en tiempo real
  const updateMetaTagsPreview = (field: string, value: any) => {
    try {
      const seoField = field.startsWith('seo.') ? field.replace('seo.', '') : field;
      
      switch (seoField) {
        case 'metaTitle':
          if (value && typeof value === 'string') {
            document.title = `[CMS Preview] ${value}`;
            console.log('🔍 [SEO Preview] Título actualizado:', value);
          }
          break;
          
        case 'metaDescription':
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription && value && typeof value === 'string') {
            metaDescription.setAttribute('content', value);
            console.log('🔍 [SEO Preview] Description actualizada:', value.substring(0, 50) + '...');
          }
          break;
          
        case 'ogTitle':
          const ogTitle = document.querySelector('meta[property="og:title"]');
          if (ogTitle && value && typeof value === 'string') {
            ogTitle.setAttribute('content', value);
            console.log('🔍 [SEO Preview] OG Title actualizado:', value);
          }
          break;
          
        case 'ogDescription':
          const ogDescription = document.querySelector('meta[property="og:description"]');
          if (ogDescription && value && typeof value === 'string') {
            ogDescription.setAttribute('content', value);
            console.log('🔍 [SEO Preview] OG Description actualizada:', value.substring(0, 50) + '...');
          }
          break;
      }
    } catch (error) {
      console.warn('⚠️ [SEO Preview] Error actualizando meta tags:', error);
    }
  };

  // Update SEO without auto-save (manual save only)
  const handleUpdateSeo = (field: string, value: any) => {
    // Manejar dot notation para SEO: "seo.metaTitle" -> "metaTitle"
    const seoField = field.startsWith('seo.') ? field.replace('seo.', '') : field;
    updateSeo(seoField as any, value);
    
    // 🔥 NUEVO: Actualizar meta tags inmediatamente para preview
    updateMetaTagsPreview(field, value);
    
    // Marcar como cambios pendientes
    if (!hasGlobalChanges) {
      setHasGlobalChanges(true);
    }
    setSaveStatus('idle');
  };

  // Manual save
  const handleManualSave = async () => {
    try {
      setIsLoading(true);
      setSaveStatus('saving');
      // Guardar componentes específicos según la pestaña activa
      if (activeTab === 'cards') {
        // 🔥 NUEVO: Usar el componente unificado de cards design
        if ((window as any).__cardsDesignSave) {
          await (window as any).__cardsDesignSave();  // ← Esperar a que termine
        }
        // 🔥 FIX: Guardar también el diseño de ValueAdded cards
        if ((window as any).__valueAddedCardDesignSave) {
          await (window as any).__valueAddedCardDesignSave();  // ← Esperar a que termine
        }
        // ⚠️ NO llamar a handleSave() aquí - __cardsDesignSave ya guarda todo
      } else if (activeTab === 'content') {
        // Si estamos en la pestaña de content, guardar componentes de contenido
        // Guardar cambios del componente de Logos Bar Design si existen
        if ((window as any).__logosBarDesignSave) {
          (window as any).__logosBarDesignSave();
        }
        // Guardar cambios del componente de Client Logos Design si existen
        if ((window as any).__clientLogosDesignSave) {
          (window as any).__clientLogosDesignSave();
        }
        // Esperar un momento para que los estados se actualicen
        await new Promise(resolve => setTimeout(resolve, 100));
        // Para content tab, sí llamamos a handleSave
        await handleSave();
      } else {
        // Para otras pestañas, usar handleSave normal
        await handleSave();
      }
      // 🔥 Resetear estado de cambios globales después del guardado exitoso
      setHasGlobalChanges(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // ❌ Ocultar pestaña SEO para páginas de detalle (el SEO se genera automáticamente)
  const shouldShowSeoTab = selectedPage !== 'servicio-detail' && selectedPage !== 'blog-post-detail' && selectedPage !== 'proyecto-detail';

  const tabs = [
    { id: 'content' as const, label: 'Contenido', icon: '📝' },
    { id: 'cards' as const, label: 'Diseño de Tarjetas', icon: '🎴' },
    { id: 'contact' as const, label: 'Contacto', icon: '📞' },
    { id: 'chatbot' as const, label: 'Chatbot', icon: '🤖' },
    { id: 'sidebar' as const, label: 'Sidebar', icon: '📊' },
    ...(shouldShowSeoTab ? [{ id: 'seo' as const, label: 'SEO', icon: '🔍' }] : []),
    { id: 'theme' as const, label: 'Tema', icon: '🎨' }
  ];

  const getSaveStatusColor = () => {
    switch (saveStatus) {
      case 'saving': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'saved': return 'text-green-600 bg-green-100 border-green-200';
      case 'error': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving': return '💾 Guardando...';
      case 'saved': return '✅ Guardado';
      case 'error': return '❌ Error al guardar';
      default: return '📄 Sin cambios';
    }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-300">Cargando configuración...</span>
          </div>
        </div>
      </div>
    );
  }

  if (dataMessage && dataMessage.type === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-red-800 dark:text-red-200 mb-2">
              ❌ Error al cargar
            </h2>
            <p className="text-red-600 dark:text-red-300 mb-4">{dataMessage.text}</p>
            <button
              onClick={loadPageData}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              🔄 Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">No se encontraron datos de página</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Página seleccionada: {selectedPage}</p>
            <button
              onClick={loadPageData}
              className="mt-4 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              🔄 Recargar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <div className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-3 mb-2 border border-gray-100 dark:border-gray-700/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                🎛️ Gestor de Contenido CMS
                {hasGlobalChanges && (
                  <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 text-xs font-medium rounded-full animate-pulse">
                    🟡 Cambios sin guardar
                  </span>
                )}
              </h1>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              Administra el contenido, SEO y temas de tu página web
            </p>
            
            {/* 🆕 Indicador de página actual */}
            {pageData && (
              <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                📄 Editando: {pageData.pageName || selectedPage} ({pageData.pageSlug})
              </div>
            )}
            
            {/* 🆕 Selector de Página */}
            <div className="flex items-center gap-3 mt-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                📑 Página a editar:
              </label>
              <select
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value as any)}
                className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 font-medium hover:border-purple-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all"
              >
                <option value="home">🏠 Home (Inicio)</option>
                <option value="about">👥 About (Nosotros)</option>
                <option value="services">🚀 Services (Servicios)</option>
                <option value="servicio-detail">📄 Servicio Detalle (Página Individual)</option>
                <option value="contact">📞 Contact (Contacto)</option>
                <option value="blog">📰 Blog (Noticias)</option>
                <option value="blog-post-detail">📝 Blog Post Detalle (Artículo Individual)</option>
                <option value="proyectos">🗂️ Proyectos (Portafolio)</option>
                <option value="proyecto-detail">📋 Proyecto Detalle (Página Individual)</option>
              </select>
              
              {/* 🔄 Botón para limpiar cache y recargar */}
              <button
                onClick={() => {
                  // Limpiar cache de localStorage para esta página
                  localStorage.removeItem(`cmsCache_page-${selectedPage}`);
                  console.log(`🗑️ Cache limpiado para ${selectedPage}`);
                  // Recargar datos
                  loadPageData();
                }}
                className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center gap-1"
                title="Limpiar cache y recargar datos"
              >
                🔄 Recargar
              </button>
            </div>
          </div>
          <div className="flex flex-row flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Status Badge */}
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getSaveStatusColor()}`}>
              {hasGlobalChanges ? '📝 Cambios pendientes' : getSaveStatusText()}
            </div>
            {/* Action Button */}
            <button
              onClick={handleManualSave}
              disabled={isLoading || !hasGlobalChanges}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 ${
                hasGlobalChanges && !isLoading
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
              title={hasGlobalChanges ? 'Guardar cambios pendientes' : 'No hay cambios para guardar'}
              style={{ minWidth: '120px' }}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <span>💾</span> Guardar
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 mb-3 border border-gray-100 dark:border-gray-700/50">
        <div className="flex flex-wrap sm:flex-nowrap overflow-x-auto border-b border-gray-200 dark:border-gray-700 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-shrink-0 flex-grow px-3 sm:px-4 py-2 sm:py-2.5 font-medium transition-colors duration-200 flex items-center gap-1.5 text-sm sm:text-base ${
                activeTab === tab.id
                  ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
              style={{ minWidth: '100px' }}
            >
              <span className="text-sm">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="w-full space-y-3">
        {activeTab === 'content' && (
          <>
            {/* 🎯 Hero Section - Diferente para Blog vs otras páginas */}
            {selectedPage === 'blog' ? (
              <>
                {/* 📰 Hero específico para Blog */}
                <BlogHeroConfigSection
                  pageData={pageData}
                  updateContent={handleUpdateContent}
                />
                {/* 📰 Sección de Noticias Destacadas */}
                <FeaturedPostsConfigSection
                  config={pageData.content?.featuredPosts || {}}
                  onChange={(config) => handleUpdateContent('featuredPosts', config)}
                />
                {/* 📰 Sección de Todas las Noticias */}
                <AllNewsConfigSection
                  config={pageData.content?.allNews || {}}
                  onChange={(config) => handleUpdateContent('allNews', config)}
                />
                {/* 📢 Sección CTA (Último Llamado) */}
                <BlogCtaConfigSection
                  config={pageData.content?.blogCta || {}}
                  onChange={(config) => handleUpdateContent('blogCta', config)}
                />
              </>
            ) : selectedPage !== 'servicio-detail' && selectedPage !== 'proyectos' && selectedPage !== 'proyecto-detail' ? (
              /* 🏠 Hero genérico para otras páginas (NO para servicio-detail ni proyectos que tienen su propia configuración) */
              <HeroConfigSection
                pageData={pageData}
                updateContent={handleUpdateContent}
                updateTextStyle={handleUpdateTextStyle}
              />
            ) : null}
            
            {/* 🏠 SECCIONES ESPECÍFICAS PARA HOME */}
            {selectedPage === 'home' && (
              <>
                {/* Configuración General de Soluciones (sin gestión de items) */}
                <SolutionsConfigSection
                  pageData={pageData}
                  updateContent={handleUpdateContent}
                  updateTextStyle={handleUpdateTextStyle}
                />
                {/* Editor de Tarjetas con Upload de Iconos */}
                <CardItemsEditor
                  items={pageData.content.solutions?.items || []}
                  onUpdate={(updatedItems) => handleUpdateContent('solutions.items', updatedItems)}
                  onSave={handleSave} // Función de save manual
                  pageData={pageData} // Para obtener estilos actuales
                  updateTextStyle={handleUpdateTextStyle} // Para manejar colores por tema
                  className="mt-6"
                />
                {/* Configuración General de Valor Agregado (incluye editor de tarjetas) */}
                <ValueAddedConfigSection
                  pageData={pageData}
                  updateContent={handleUpdateContent}
                  updateTextStyle={handleUpdateTextStyle}
                  onSave={handleSave}
                />
                {/* Configuración de Logos de Clientes */}
                <ClientLogosConfigSection
                  pageData={pageData}
                  updateContent={handleUpdateContent}
                  updateTextStyle={handleUpdateTextStyle}
                />
                
                {/* Configuración de Sección de Blog Destacado */}
                <FeaturedBlogConfigSection
                  pageData={pageData}
                  updateContent={handleUpdateContent}
                  updateTextStyle={handleUpdateTextStyle}
                />
              </>
            )}

            {/* 📄 SECCIONES ESPECÍFICAS PARA ABOUT */}
            {selectedPage === 'about' && (
              <>
                {/* Configuración de Misión y Visión */}
                <MissionVisionConfigSection
                  pageData={pageData}
                  updateContent={handleUpdateContent}
                />
                
                {/* 🆕 Configuración de Valores */}
                <ValuesConfigSection
                  pageData={pageData}
                  updateContent={handleUpdateContent}
                />
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-3">
                    📝 Configuración de Página "Nosotros"
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 mb-4">
                    Configura el contenido principal de la página "Nosotros".
                  </p>
                  <ul className="text-blue-600 dark:text-blue-400 space-y-2">
                    <li>✅ <strong>Título Principal:</strong> Configura en "Hero Section" arriba</li>
                    <li>✅ <strong>Misión:</strong> Configura arriba en la sección correspondiente</li>
                    <li>✅ <strong>Visión:</strong> Configura arriba en la sección correspondiente</li>
                    <li>✅ <strong>Valores:</strong> Configura arriba con carrusel e imágenes</li>
                    <li>✅ <strong>SEO:</strong> Configura en la pestaña "SEO"</li>
                  </ul>
                </div>
              </>
            )}

            {/* 🛠️ SECCIONES ESPECÍFICAS PARA SERVICES */}
            {selectedPage === 'services' && (
              <>
                {/* Configuración de Filtros de Servicios */}
                <ServicesFilterConfigSection
                  pageData={pageData}
                  updateContent={handleUpdateContent}
                />
                
                {/* Configuración de Sección y Tarjetas de Servicios */}
                <ServicesGridConfigSection
                  pageData={pageData}
                  updateContent={handleUpdateContent}
                />
                
                {/* 🆕 Configuración de Acordeón de Servicios */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                  <ServicesAccordionConfigSection
                    config={pageData?.content?.servicesAccordion || {}}
                    onChange={(newConfig) => handleUpdateContent('servicesAccordion', newConfig)}
                  />
                </div>

                {/* 🆕 Secciones extra: ¿Por qué elegirnos?, Proceso, FAQ */}
                <ServicesExtraSectionsConfig
                  sharedBackgroundConfig={(pageData?.content as any)?.extraSectionsBackground || {}}
                  whyChooseConfig={(pageData?.content as any)?.whyChooseUs || {}}
                  processConfig={(pageData?.content as any)?.developmentProcess || {}}
                  faqConfig={(pageData?.content as any)?.faq || {}}
                  onUpdateSharedBackground={(field, value) => handleUpdateContent(`extraSectionsBackground.${field}`, value)}
                  onUpdateWhyChoose={(field, value) => handleUpdateContent(`whyChooseUs.${field}`, value)}
                  onUpdateProcess={(field, value) => handleUpdateContent(`developmentProcess.${field}`, value)}
                  onUpdateFaq={(field, value) => handleUpdateContent(`faq.${field}`, value)}
                />
                
                {/* Panel informativo */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-green-800 dark:text-green-200 mb-3">
                    🛠️ Configuración de Página "Servicios"
                  </h3>
                  <p className="text-green-700 dark:text-green-300 mb-4">
                    Esta página muestra la lista de servicios con filtros personalizables.
                  </p>
                  <ul className="text-green-600 dark:text-green-400 space-y-2">
                    <li>✅ <strong>Hero Section:</strong> Introducción a los servicios</li>
                    <li>✅ <strong>Filtros:</strong> Panel de búsqueda y categorías</li>
                    <li>✅ <strong>Sección Destacados:</strong> Título e imagen de fondo</li>
                    <li>✅ <strong>Tarjetas:</strong> Diseño visual de las tarjetas de servicio</li>
                    <li>✅ <strong>Acordeón:</strong> Lista expandible de todos los servicios</li>
                    <li>✅ <strong>¿Por qué elegirnos?:</strong> Sección de ventajas competitivas</li>
                    <li>✅ <strong>Proceso:</strong> Timeline del método de trabajo</li>
                    <li>✅ <strong>FAQ:</strong> Preguntas frecuentes con Schema.org</li>
                    <li>✅ <strong>SEO:</strong> Optimización para búsquedas de servicios</li>
                  </ul>
                </div>
              </>
            )}

            {/* 📄 SECCIONES ESPECÍFICAS PARA SERVICIO DETALLE */}
            {selectedPage === 'servicio-detail' && (
              <>
                <ServicioDetailConfigSection
                  config={pageData?.content?.servicioDetailConfig || {}}
                  onChange={(newConfig) => handleUpdateContent('servicioDetailConfig', newConfig)}
                />
              </>
            )}

            {/* 📞 SECCIONES ESPECÍFICAS PARA CONTACT */}
            {selectedPage === 'contact' && (
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-purple-800 dark:text-purple-200 mb-3">
                  📞 Configuración de Página "Contacto"
                </h3>
                <p className="text-purple-700 dark:text-purple-300 mb-4">
                  Página de contacto con formulario y información de contacto.
                </p>
                <ul className="text-purple-600 dark:text-purple-400 space-y-2">
                  <li>✅ <strong>Hero Section:</strong> Mensaje de bienvenida</li>
                  <li>✅ <strong>Formulario:</strong> Configurar en pestaña "Contacto"</li>
                  <li>✅ <strong>Información:</strong> Teléfono, email, dirección</li>
                </ul>
              </div>
            )}

            {/* 📰 SECCIONES ESPECÍFICAS PARA BLOG */}
            {selectedPage === 'blog' && (
              <>
                {/* Panel informativo */}
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-indigo-800 dark:text-indigo-200 mb-3">
                    📰 Configuración de Página "Blog"
                  </h3>
                  <p className="text-indigo-700 dark:text-indigo-300 mb-4">
                    Configura la portada y apariencia del blog de noticias.
                  </p>
                  <ul className="text-indigo-600 dark:text-indigo-400 space-y-2">
                    <li>✅ <strong>Hero Section:</strong> Título, colores y gradiente</li>
                    <li>✅ <strong>Estadísticas:</strong> Contador de artículos y lectores</li>
                    <li>✅ <strong>Búsqueda:</strong> Configuración del buscador</li>
                    <li>🔜 <strong>SEO:</strong> Optimización para buscadores (pestaña SEO)</li>
                    <li>🔜 <strong>Tarjetas:</strong> Diseño de tarjetas de posts (próximamente)</li>
                    <li>🔜 <strong>Sidebar:</strong> Categorías y trending (próximamente)</li>
                  </ul>
                </div>
              </>
            )}

            {/* 📝 SECCIONES ESPECÍFICAS PARA BLOG POST DETAIL */}
            {selectedPage === 'blog-post-detail' && (
              <>
                <BlogPostDetailConfigSection
                  config={pageData?.content?.blogPostDetailConfig || {}}
                  onChange={(newConfig) => handleUpdateContent('blogPostDetailConfig', newConfig)}
                />
              </>
            )}

            {/* 📋 SECCIONES ESPECÍFICAS PARA PROYECTO DETALLE */}
            {selectedPage === 'proyecto-detail' && (
              <>
                <ProyectoDetailConfigSection
                  config={pageData?.content?.proyectoDetailConfig || {}}
                  onChange={(newConfig) => handleUpdateContent('proyectoDetailConfig', newConfig)}
                />
              </>
            )}

            {/* 🗂️ SECCIONES ESPECÍFICAS PARA PROYECTOS */}
            {selectedPage === 'proyectos' && (
              <>
                {/* Hero reutilizable */}
                <HeroConfigSection
                  pageData={pageData}
                  updateContent={handleUpdateContent}
                  updateTextStyle={handleUpdateTextStyle}
                />

                {/* Sección CTA inferior */}
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="text-2xl">💬</span>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Sección CTA (Llamado a la acción)</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Bloque al pie del portafolio que invita al contacto</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Título del CTA</label>
                      <input
                        type="text"
                        value={pageData?.content?.solutions?.title || ''}
                        onChange={(e) => handleUpdateContent('solutions.title', e.target.value)}
                        className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                        placeholder="¿Tienes un proyecto en mente?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Descripción del CTA</label>
                      <input
                        type="text"
                        value={pageData?.content?.solutions?.description || ''}
                        onChange={(e) => handleUpdateContent('solutions.description', e.target.value)}
                        className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                        placeholder="Conversemos sobre cómo podemos ayudarte a hacerlo realidad"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Texto del botón</label>
                        <input
                          type="text"
                          value={pageData?.content?.hero?.ctaText || ''}
                          onChange={(e) => handleUpdateContent('hero.ctaText', e.target.value)}
                          className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                          placeholder="Contáctanos"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">URL del botón</label>
                        <input
                          type="text"
                          value={pageData?.content?.hero?.ctaLink || ''}
                          onChange={(e) => handleUpdateContent('hero.ctaLink', e.target.value)}
                          className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                          placeholder="/contacto"
                        />
                      </div>
                    </div>

                    {/* 🖼️ Imagen de fondo del CTA */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">🖼️ Imagen de fondo</h3>
                      <div className="flex gap-6 items-start">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">☀️ Modo claro</span>
                          <ManagedImageSelector
                            sidebar
                            label="Fondo CTA Claro"
                            currentImage={(pageData?.content as any)?.ctaSection?.backgroundImage?.light || ''}
                            onImageSelect={(url) => handleUpdateContent('ctaSection.backgroundImage.light', url)}
                          />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">🌙 Modo oscuro</span>
                          <ManagedImageSelector
                            sidebar
                            darkMode
                            label="Fondo CTA Oscuro"
                            currentImage={(pageData?.content as any)?.ctaSection?.backgroundImage?.dark || ''}
                            onImageSelect={(url) => handleUpdateContent('ctaSection.backgroundImage.dark', url)}
                          />
                        </div>
                        <div className="flex-1 pt-1">
                      <div className="mt-0">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          🎚️ Opacidad del overlay: {Math.round(((pageData?.content as any)?.ctaSection?.backgroundOpacity ?? 0.85) * 100)}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="95"
                          step="5"
                          value={Math.round(((pageData?.content as any)?.ctaSection?.backgroundOpacity ?? 0.85) * 100)}
                          onChange={(e) => handleUpdateContent('ctaSection.backgroundOpacity', parseInt(e.target.value) / 100)}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                      </div>
                        </div>
                      </div>
                    </div>

                    {/* 🎨 Colores del CTA */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-1">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">🎨 Colores</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Fondo (claro)</label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={(pageData?.content as any)?.ctaSection?.bgColor?.light?.startsWith('#') ? (pageData?.content as any)?.ctaSection?.bgColor?.light : '#faf5ff'} onChange={(e) => handleUpdateContent('ctaSection.bgColor.light', e.target.value)} className="w-8 h-8 rounded-lg border cursor-pointer" />
                            <input type="text" value={(pageData?.content as any)?.ctaSection?.bgColor?.light || ''} onChange={(e) => handleUpdateContent('ctaSection.bgColor.light', e.target.value)} className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono" placeholder="#faf5ff" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Fondo (oscuro)</label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={(pageData?.content as any)?.ctaSection?.bgColor?.dark?.startsWith('#') ? (pageData?.content as any)?.ctaSection?.bgColor?.dark : '#1f2937'} onChange={(e) => handleUpdateContent('ctaSection.bgColor.dark', e.target.value)} className="w-8 h-8 rounded-lg border cursor-pointer" />
                            <input type="text" value={(pageData?.content as any)?.ctaSection?.bgColor?.dark || ''} onChange={(e) => handleUpdateContent('ctaSection.bgColor.dark', e.target.value)} className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono" placeholder="rgba(255,255,255,0.05)" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Título (claro)</label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={(pageData?.content as any)?.ctaSection?.titleColor?.light || '#111827'} onChange={(e) => handleUpdateContent('ctaSection.titleColor.light', e.target.value)} className="w-8 h-8 rounded-lg border cursor-pointer" />
                            <input type="text" value={(pageData?.content as any)?.ctaSection?.titleColor?.light || ''} onChange={(e) => handleUpdateContent('ctaSection.titleColor.light', e.target.value)} className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Título (oscuro)</label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={(pageData?.content as any)?.ctaSection?.titleColor?.dark || '#ffffff'} onChange={(e) => handleUpdateContent('ctaSection.titleColor.dark', e.target.value)} className="w-8 h-8 rounded-lg border cursor-pointer" />
                            <input type="text" value={(pageData?.content as any)?.ctaSection?.titleColor?.dark || ''} onChange={(e) => handleUpdateContent('ctaSection.titleColor.dark', e.target.value)} className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Descripción (claro)</label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={(pageData?.content as any)?.ctaSection?.descriptionColor?.light || '#4b5563'} onChange={(e) => handleUpdateContent('ctaSection.descriptionColor.light', e.target.value)} className="w-8 h-8 rounded-lg border cursor-pointer" />
                            <input type="text" value={(pageData?.content as any)?.ctaSection?.descriptionColor?.light || ''} onChange={(e) => handleUpdateContent('ctaSection.descriptionColor.light', e.target.value)} className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Descripción (oscuro)</label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={(pageData?.content as any)?.ctaSection?.descriptionColor?.dark || '#9ca3af'} onChange={(e) => handleUpdateContent('ctaSection.descriptionColor.dark', e.target.value)} className="w-8 h-8 rounded-lg border cursor-pointer" />
                            <input type="text" value={(pageData?.content as any)?.ctaSection?.descriptionColor?.dark || ''} onChange={(e) => handleUpdateContent('ctaSection.descriptionColor.dark', e.target.value)} className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono" />
                          </div>
                        </div>
                      </div>
                      {/* Botón gradiente */}
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Botón desde</label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={(pageData?.content as any)?.ctaSection?.buttonGradientFrom || '#9333ea'} onChange={(e) => handleUpdateContent('ctaSection.buttonGradientFrom', e.target.value)} className="w-8 h-8 rounded-lg border cursor-pointer" />
                            <input type="text" value={(pageData?.content as any)?.ctaSection?.buttonGradientFrom || ''} onChange={(e) => handleUpdateContent('ctaSection.buttonGradientFrom', e.target.value)} className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Botón hasta</label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={(pageData?.content as any)?.ctaSection?.buttonGradientTo || '#4f46e5'} onChange={(e) => handleUpdateContent('ctaSection.buttonGradientTo', e.target.value)} className="w-8 h-8 rounded-lg border cursor-pointer" />
                            <input type="text" value={(pageData?.content as any)?.ctaSection?.buttonGradientTo || ''} onChange={(e) => handleUpdateContent('ctaSection.buttonGradientTo', e.target.value)} className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Texto botón</label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={(pageData?.content as any)?.ctaSection?.buttonText || '#ffffff'} onChange={(e) => handleUpdateContent('ctaSection.buttonText', e.target.value)} className="w-8 h-8 rounded-lg border cursor-pointer" />
                            <input type="text" value={(pageData?.content as any)?.ctaSection?.buttonText || ''} onChange={(e) => handleUpdateContent('ctaSection.buttonText', e.target.value)} className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🔘 Diseño de Filtros de Categoría */}
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="text-2xl">🔘</span>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filtros de categoría</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Estilo de los botones "Todos", "Web", etc.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {/* Filtro activo */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Filtro activo (seleccionado)</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Gradiente desde</label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={(pageData?.content as any)?.filterDesign?.activeBgFrom || '#9333ea'} onChange={(e) => handleUpdateContent('filterDesign.activeBgFrom', e.target.value)} className="w-8 h-8 rounded-lg border cursor-pointer" />
                            <input type="text" value={(pageData?.content as any)?.filterDesign?.activeBgFrom || ''} onChange={(e) => handleUpdateContent('filterDesign.activeBgFrom', e.target.value)} className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Gradiente hasta</label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={(pageData?.content as any)?.filterDesign?.activeBgTo || '#4f46e5'} onChange={(e) => handleUpdateContent('filterDesign.activeBgTo', e.target.value)} className="w-8 h-8 rounded-lg border cursor-pointer" />
                            <input type="text" value={(pageData?.content as any)?.filterDesign?.activeBgTo || ''} onChange={(e) => handleUpdateContent('filterDesign.activeBgTo', e.target.value)} className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Texto</label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={(pageData?.content as any)?.filterDesign?.activeText || '#ffffff'} onChange={(e) => handleUpdateContent('filterDesign.activeText', e.target.value)} className="w-8 h-8 rounded-lg border cursor-pointer" />
                            <input type="text" value={(pageData?.content as any)?.filterDesign?.activeText || ''} onChange={(e) => handleUpdateContent('filterDesign.activeText', e.target.value)} className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Sombra activa</label>
                        <input type="text" value={(pageData?.content as any)?.filterDesign?.activeShadow || ''} onChange={(e) => handleUpdateContent('filterDesign.activeShadow', e.target.value)} className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono" placeholder="0 10px 15px rgba(147,51,234,0.25)" />
                      </div>
                    </div>
                    {/* Filtro inactivo */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Filtro inactivo</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Fondo (claro / oscuro)</label>
                          <div className="flex gap-1">
                            <input type="text" value={(pageData?.content as any)?.filterDesign?.inactiveBg?.light || ''} onChange={(e) => handleUpdateContent('filterDesign.inactiveBg.light', e.target.value)} className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1.5 text-[10px] text-gray-900 dark:text-white font-mono" placeholder="#ffffff" />
                            <input type="text" value={(pageData?.content as any)?.filterDesign?.inactiveBg?.dark || ''} onChange={(e) => handleUpdateContent('filterDesign.inactiveBg.dark', e.target.value)} className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1.5 text-[10px] text-gray-900 dark:text-white font-mono" placeholder="rgba(...)" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Texto (claro / oscuro)</label>
                          <div className="flex gap-1">
                            <input type="text" value={(pageData?.content as any)?.filterDesign?.inactiveText?.light || ''} onChange={(e) => handleUpdateContent('filterDesign.inactiveText.light', e.target.value)} className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1.5 text-[10px] text-gray-900 dark:text-white font-mono" placeholder="#4b5563" />
                            <input type="text" value={(pageData?.content as any)?.filterDesign?.inactiveText?.dark || ''} onChange={(e) => handleUpdateContent('filterDesign.inactiveText.dark', e.target.value)} className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1.5 text-[10px] text-gray-900 dark:text-white font-mono" placeholder="#9ca3af" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Borde (claro / oscuro)</label>
                          <div className="flex gap-1">
                            <input type="text" value={(pageData?.content as any)?.filterDesign?.inactiveBorder?.light || ''} onChange={(e) => handleUpdateContent('filterDesign.inactiveBorder.light', e.target.value)} className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1.5 text-[10px] text-gray-900 dark:text-white font-mono" placeholder="#e5e7eb" />
                            <input type="text" value={(pageData?.content as any)?.filterDesign?.inactiveBorder?.dark || ''} onChange={(e) => handleUpdateContent('filterDesign.inactiveBorder.dark', e.target.value)} className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1.5 text-[10px] text-gray-900 dark:text-white font-mono" placeholder="rgba(...)" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Radio de borde: {(pageData?.content as any)?.filterDesign?.borderRadius || '12'}px
                        </label>
                        <input type="range" min="0" max="24" step="2" value={(pageData?.content as any)?.filterDesign?.borderRadius || '12'} onChange={(e) => handleUpdateContent('filterDesign.borderRadius', e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                      </div>
                    </div>
                    {/* Preview mini filtros */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                      <p className="text-[10px] font-medium text-gray-400 mb-2">Vista previa</p>
                      <div className="flex gap-2 justify-center">
                        <span style={{ background: `linear-gradient(to right, ${(pageData?.content as any)?.filterDesign?.activeBgFrom || '#9333ea'}, ${(pageData?.content as any)?.filterDesign?.activeBgTo || '#4f46e5'})`, color: (pageData?.content as any)?.filterDesign?.activeText || '#ffffff', borderRadius: `${(pageData?.content as any)?.filterDesign?.borderRadius || '12'}px`, boxShadow: (pageData?.content as any)?.filterDesign?.activeShadow || '0 10px 15px rgba(147,51,234,0.25)' }} className="px-3 py-1.5 text-xs font-semibold">Todos (3)</span>
                        <span style={{ background: (pageData?.content as any)?.filterDesign?.inactiveBg?.light || '#ffffff', color: (pageData?.content as any)?.filterDesign?.inactiveText?.light || '#4b5563', border: `1px solid ${(pageData?.content as any)?.filterDesign?.inactiveBorder?.light || '#e5e7eb'}`, borderRadius: `${(pageData?.content as any)?.filterDesign?.borderRadius || '12'}px` }} className="px-3 py-1.5 text-xs font-semibold">🌐 Web (2)</span>
                        <span style={{ background: (pageData?.content as any)?.filterDesign?.inactiveBg?.light || '#ffffff', color: (pageData?.content as any)?.filterDesign?.inactiveText?.light || '#4b5563', border: `1px solid ${(pageData?.content as any)?.filterDesign?.inactiveBorder?.light || '#e5e7eb'}`, borderRadius: `${(pageData?.content as any)?.filterDesign?.borderRadius || '12'}px` }} className="px-3 py-1.5 text-xs font-semibold">📱 App (1)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección Portafolio (Grid de Tarjetas) */}
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🗂️</span>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Sección Portafolio (Grid de Proyectos)</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Título e imagen de fondo del área donde se muestran las tarjetas</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Título de sección */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Título de la sección
                      </label>
                      <input
                        type="text"
                        value={pageData?.content?.portfolio?.sectionTitle || ''}
                        onChange={(e) => handleUpdateContent('portfolio.sectionTitle', e.target.value)}
                        className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                        placeholder="Nuestros Proyectos"
                      />
                    </div>

                    {/* Imágenes de fondo claro/oscuro */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        🖼️ Imagen de fondo (opcional)
                      </label>
                      <div className="flex gap-6 items-start">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">☀️ Modo Claro</span>
                          <ManagedImageSelector
                            sidebar
                            label="Fondo Claro"
                            currentImage={
                              typeof pageData?.content?.portfolio?.backgroundImage === 'string'
                                ? pageData?.content?.portfolio?.backgroundImage
                                : pageData?.content?.portfolio?.backgroundImage?.light || ''
                            }
                            onImageSelect={(url) => handleUpdateContent('portfolio.backgroundImage.light', url)}
                          />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">🌙 Modo Oscuro</span>
                          <ManagedImageSelector
                            sidebar
                            darkMode
                            label="Fondo Oscuro"
                            currentImage={
                              typeof pageData?.content?.portfolio?.backgroundImage === 'string'
                                ? pageData?.content?.portfolio?.backgroundImage
                                : pageData?.content?.portfolio?.backgroundImage?.dark || ''
                            }
                            onImageSelect={(url) => handleUpdateContent('portfolio.backgroundImage.dark', url)}
                          />
                        </div>
                        <div className="flex-1 space-y-3 pt-1">
                          {/* Opacidad del overlay */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              🎚️ Opacidad del overlay: {Math.round(((pageData?.content?.portfolio?.backgroundOpacity ?? 0) * 100))}%
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="95"
                              step="5"
                              value={Math.round(((pageData?.content?.portfolio?.backgroundOpacity ?? 0) * 100))}
                              onChange={(e) => handleUpdateContent('portfolio.backgroundOpacity', parseInt(e.target.value) / 100)}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                            />
                            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                              <span>0% (sin overlay)</span>
                              <span>95%</span>
                            </div>
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            💡 El overlay oscurece/aclara la imagen para mejorar la legibilidad del texto.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
        {activeTab === 'cards' && selectedPage === 'home' && (
          <div className="space-y-4">
            {/* 🔥 Configuración de Tarjetas de Soluciones (Solutions) */}
            <CardsDesignConfigSection
              pageData={pageData}
              updateContent={handleUpdateContent}
              setHasGlobalChanges={setHasGlobalChanges} // 🔥 PASAR LA FUNCIÓN
            />
            {/* Nota: Las tarjetas de Valor Agregado se configuran en el tab Content dentro de ValueAddedConfigSection */}
          </div>
        )}
        {activeTab === 'cards' && selectedPage === 'proyectos' && (
          <div className="space-y-4">
            {/* 🎴 Diseño de Tarjetas de Proyecto (Portafolio) */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-5">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-2xl">🎴</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Diseño de Tarjetas de Proyecto</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Configura la apariencia visual de las tarjetas del portafolio</p>
                </div>
              </div>

              {/* Selector de tema (Light / Dark) */}
              {(() => {
                const cardTheme = (pageData?.content as any)?._cardDesignTheme || 'light';
                const setCardTheme = (t: string) => handleUpdateContent('_cardDesignTheme', t);
                const cd = (pageData?.content?.portfolioCardDesign as any)?.[cardTheme] || {};
                const prefix = `portfolioCardDesign.${cardTheme}`;

                return (
                  <>
                    <div className="flex gap-2 mb-6">
                      <button
                        onClick={() => setCardTheme('light')}
                        className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          cardTheme === 'light'
                            ? 'bg-white text-gray-900 shadow-lg border-2 border-purple-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        ☀️ Modo Claro
                      </button>
                      <button
                        onClick={() => setCardTheme('dark')}
                        className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          cardTheme === 'dark'
                            ? 'bg-gray-900 text-white shadow-lg border-2 border-purple-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        🌙 Modo Oscuro
                      </button>
                    </div>

                    {/* ── Tarjeta (contenedor) ── */}
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-xs">🃏</span>
                          Contenedor de la tarjeta
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Fondo</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={cd.cardBg?.startsWith('rgba') || cd.cardBg?.startsWith('#') ? (cd.cardBg?.startsWith('#') ? cd.cardBg : '#111827') : '#ffffff'}
                                onChange={(e) => handleUpdateContent(`${prefix}.cardBg`, e.target.value)}
                                className="w-8 h-8 rounded-lg border cursor-pointer"
                              />
                              <input
                                type="text"
                                value={cd.cardBg || ''}
                                onChange={(e) => handleUpdateContent(`${prefix}.cardBg`, e.target.value)}
                                className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono"
                                placeholder="#ffffff"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Borde</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={cd.cardBorder?.startsWith('#') ? cd.cardBorder : '#e5e7eb'}
                                onChange={(e) => handleUpdateContent(`${prefix}.cardBorder`, e.target.value)}
                                className="w-8 h-8 rounded-lg border cursor-pointer"
                              />
                              <input
                                type="text"
                                value={cd.cardBorder || ''}
                                onChange={(e) => handleUpdateContent(`${prefix}.cardBorder`, e.target.value)}
                                className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono"
                                placeholder="rgba(229,231,235,0.8)"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Borde Hover</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={cd.cardHoverBorder?.startsWith('#') ? cd.cardHoverBorder : '#d8b4fe'}
                                onChange={(e) => handleUpdateContent(`${prefix}.cardHoverBorder`, e.target.value)}
                                className="w-8 h-8 rounded-lg border cursor-pointer"
                              />
                              <input
                                type="text"
                                value={cd.cardHoverBorder || ''}
                                onChange={(e) => handleUpdateContent(`${prefix}.cardHoverBorder`, e.target.value)}
                                className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono"
                                placeholder="#d8b4fe"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Radio de borde: {cd.cardRadius || '16'}px
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="32"
                              step="2"
                              value={cd.cardRadius || '16'}
                              onChange={(e) => handleUpdateContent(`${prefix}.cardRadius`, e.target.value)}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                            />
                          </div>
                        </div>
                        {/* Sombras */}
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Sombra</label>
                            <input
                              type="text"
                              value={cd.cardShadow || ''}
                              onChange={(e) => handleUpdateContent(`${prefix}.cardShadow`, e.target.value)}
                              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono"
                              placeholder="0 1px 3px rgba(0,0,0,0.06)"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Sombra Hover</label>
                            <input
                              type="text"
                              value={cd.cardHoverShadow || ''}
                              onChange={(e) => handleUpdateContent(`${prefix}.cardHoverShadow`, e.target.value)}
                              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono"
                              placeholder="0 25px 50px rgba(147,51,234,0.15)"
                            />
                          </div>
                        </div>
                        {/* Altura de imagen */}
                        <div className="mt-3">
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Altura de imagen: {cd.imageHeight || '224'}px
                          </label>
                          <input
                            type="range"
                            min="150"
                            max="350"
                            step="10"
                            value={cd.imageHeight || '224'}
                            onChange={(e) => handleUpdateContent(`${prefix}.imageHeight`, e.target.value)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                          />
                          <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                            <span>150px</span>
                            <span>350px</span>
                          </div>
                        </div>
                      </div>

                      {/* ── Textos ── */}
                      <div>
                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs">📝</span>
                          Colores de textos
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Título</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={cd.titleColor || '#111827'}
                                onChange={(e) => handleUpdateContent(`${prefix}.titleColor`, e.target.value)}
                                className="w-8 h-8 rounded-lg border cursor-pointer"
                              />
                              <input
                                type="text"
                                value={cd.titleColor || ''}
                                onChange={(e) => handleUpdateContent(`${prefix}.titleColor`, e.target.value)}
                                className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Descripción</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={cd.descriptionColor || '#4b5563'}
                                onChange={(e) => handleUpdateContent(`${prefix}.descriptionColor`, e.target.value)}
                                className="w-8 h-8 rounded-lg border cursor-pointer"
                              />
                              <input
                                type="text"
                                value={cd.descriptionColor || ''}
                                onChange={(e) => handleUpdateContent(`${prefix}.descriptionColor`, e.target.value)}
                                className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ── Tags de tecnología ── */}
                      <div>
                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-xs">🏷️</span>
                          Tags de tecnología
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Fondo</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={cd.tagBg?.startsWith('#') ? cd.tagBg : '#faf5ff'}
                                onChange={(e) => handleUpdateContent(`${prefix}.tagBg`, e.target.value)}
                                className="w-8 h-8 rounded-lg border cursor-pointer"
                              />
                              <input
                                type="text"
                                value={cd.tagBg || ''}
                                onChange={(e) => handleUpdateContent(`${prefix}.tagBg`, e.target.value)}
                                className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Texto</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={cd.tagText?.startsWith('#') ? cd.tagText : '#7e22ce'}
                                onChange={(e) => handleUpdateContent(`${prefix}.tagText`, e.target.value)}
                                className="w-8 h-8 rounded-lg border cursor-pointer"
                              />
                              <input
                                type="text"
                                value={cd.tagText || ''}
                                onChange={(e) => handleUpdateContent(`${prefix}.tagText`, e.target.value)}
                                className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Borde</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={cd.tagBorder?.startsWith('#') ? cd.tagBorder : '#f3e8ff'}
                                onChange={(e) => handleUpdateContent(`${prefix}.tagBorder`, e.target.value)}
                                className="w-8 h-8 rounded-lg border cursor-pointer"
                              />
                              <input
                                type="text"
                                value={cd.tagBorder || ''}
                                onChange={(e) => handleUpdateContent(`${prefix}.tagBorder`, e.target.value)}
                                className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ── Métricas ── */}
                      <div>
                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-xs">📊</span>
                          Métricas
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Valor</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={cd.metricsValueColor || '#9333ea'}
                                onChange={(e) => handleUpdateContent(`${prefix}.metricsValueColor`, e.target.value)}
                                className="w-8 h-8 rounded-lg border cursor-pointer"
                              />
                              <input
                                type="text"
                                value={cd.metricsValueColor || ''}
                                onChange={(e) => handleUpdateContent(`${prefix}.metricsValueColor`, e.target.value)}
                                className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Etiqueta</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={cd.metricsLabelColor || '#9ca3af'}
                                onChange={(e) => handleUpdateContent(`${prefix}.metricsLabelColor`, e.target.value)}
                                className="w-8 h-8 rounded-lg border cursor-pointer"
                              />
                              <input
                                type="text"
                                value={cd.metricsLabelColor || ''}
                                onChange={(e) => handleUpdateContent(`${prefix}.metricsLabelColor`, e.target.value)}
                                className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ── Botón "Ver Proyecto" ── */}
                      <div>
                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs">🔘</span>
                          Botón principal
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Fondo</label>
                            <input
                              type="text"
                              value={cd.buttonBg || ''}
                              onChange={(e) => handleUpdateContent(`${prefix}.buttonBg`, e.target.value)}
                              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono"
                              placeholder="linear-gradient(to right, ...)"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Texto</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={cd.buttonText || '#7e22ce'}
                                onChange={(e) => handleUpdateContent(`${prefix}.buttonText`, e.target.value)}
                                className="w-8 h-8 rounded-lg border cursor-pointer"
                              />
                              <input
                                type="text"
                                value={cd.buttonText || ''}
                                onChange={(e) => handleUpdateContent(`${prefix}.buttonText`, e.target.value)}
                                className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Borde</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={cd.buttonBorder?.startsWith('#') ? cd.buttonBorder : '#c4b5fd'}
                                onChange={(e) => handleUpdateContent(`${prefix}.buttonBorder`, e.target.value)}
                                className="w-8 h-8 rounded-lg border cursor-pointer"
                              />
                              <input
                                type="text"
                                value={cd.buttonBorder || ''}
                                onChange={(e) => handleUpdateContent(`${prefix}.buttonBorder`, e.target.value)}
                                className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ── Gradiente acentuado (botón Acceder) ── */}
                      <div>
                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-xs">🎨</span>
                          Color acento (botón Acceder / gradientes)
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Desde</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={cd.accentFrom || '#9333ea'}
                                onChange={(e) => handleUpdateContent(`${prefix}.accentFrom`, e.target.value)}
                                className="w-8 h-8 rounded-lg border cursor-pointer"
                              />
                              <input
                                type="text"
                                value={cd.accentFrom || ''}
                                onChange={(e) => handleUpdateContent(`${prefix}.accentFrom`, e.target.value)}
                                className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Hasta</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={cd.accentTo || '#4f46e5'}
                                onChange={(e) => handleUpdateContent(`${prefix}.accentTo`, e.target.value)}
                                className="w-8 h-8 rounded-lg border cursor-pointer"
                              />
                              <input
                                type="text"
                                value={cd.accentTo || ''}
                                onChange={(e) => handleUpdateContent(`${prefix}.accentTo`, e.target.value)}
                                className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white font-mono"
                              />
                            </div>
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">
                          💡 El gradiente se usa en el botón "Acceder" y efectos de hover.
                        </p>
                      </div>
                    </div>

                    {/* Preview mini */}
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">Vista previa (simplificada)</p>
                      <div
                        className="overflow-hidden transition-all"
                        style={{
                          background: cd.cardBg || '#ffffff',
                          border: `1px solid ${cd.cardBorder || '#e5e7eb'}`,
                          borderRadius: `${cd.cardRadius || 16}px`,
                          boxShadow: cd.cardShadow || '0 1px 3px rgba(0,0,0,0.06)',
                          maxWidth: '320px',
                        }}
                      >
                        <div style={{ height: `${Math.min(Number(cd.imageHeight) || 224, 120)}px`, background: `linear-gradient(135deg, ${cd.accentFrom || '#9333ea'}33, ${cd.accentTo || '#4f46e5'}33)` }} className="flex items-center justify-center">
                          <span className="text-3xl opacity-40">📸</span>
                        </div>
                        <div className="p-4">
                          <h4 style={{ color: cd.titleColor || '#111827' }} className="font-bold text-sm mb-1">Nombre del Proyecto</h4>
                          <p style={{ color: cd.descriptionColor || '#4b5563' }} className="text-xs mb-3">Descripción breve del proyecto de ejemplo...</p>
                          <div className="flex gap-1.5 mb-3">
                            {['React', 'Node.js'].map((t) => (
                              <span
                                key={t}
                                style={{ background: cd.tagBg || '#faf5ff', color: cd.tagText || '#7e22ce', borderColor: cd.tagBorder || '#f3e8ff' }}
                                className="text-[10px] px-2 py-0.5 rounded-md border font-medium"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <span
                              style={{ background: cd.buttonBg || '#faf5ff', color: cd.buttonText || '#7e22ce', borderColor: cd.buttonBorder || '#c4b5fd' }}
                              className="flex-1 text-center text-[10px] font-semibold px-2 py-1.5 rounded-lg border"
                            >
                              Ver Proyecto →
                            </span>
                            <span
                              style={{ background: `linear-gradient(to right, ${cd.accentFrom || '#9333ea'}, ${cd.accentTo || '#4f46e5'})` }}
                              className="flex-1 text-center text-[10px] font-bold px-2 py-1.5 rounded-lg text-white"
                            >
                              🚀 Acceder
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
        {activeTab === 'cards' && selectedPage !== 'home' && selectedPage !== 'proyectos' && (
          <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              🎴 Diseño de Tarjetas
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              El diseño de tarjetas solo está disponible para las páginas "Home" y "Proyectos"
            </p>
          </div>
        )}
        {activeTab === 'contact' && selectedPage === 'contact' && (
          <div className="space-y-4">
            {/* Configuración específica de la PÁGINA de Contacto */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 border border-teal-200 dark:border-gray-700/50">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📄</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    Configuración de la Página Pública de Contacto
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Esta configuración afecta a la página <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">/contacto</code>
                  </p>
                </div>
              </div>
            </div>
            <ContactConfigSection
              pageData={pageData}
              updateContent={handleUpdateContent}
              isContactPage={true}
            />
          </div>
        )}
        {activeTab === 'contact' && selectedPage !== 'contact' && (
          <div className="space-y-4">
            {/* Configuración de contacto general (para Home y otras páginas) */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 border border-blue-200 dark:border-gray-700/50">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📞</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    Información de Contacto General
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Datos de contacto mostrados en el footer y secciones de contacto de la página <strong>{selectedPage}</strong>
                  </p>
                </div>
              </div>
            </div>
            <ContactConfigSection
              pageData={pageData}
              updateContent={handleUpdateContent}
              isContactPage={false}
            />
            <ContactFormEditor
              pageData={pageData}
              updateContent={handleUpdateContent}
            />
          </div>
        )}
        {activeTab === 'seo' && shouldShowSeoTab && (
          <SeoConfigSection
            pageData={pageData}
            updateContent={handleUpdateSeo}
          />
        )}
        {activeTab === 'seo' && !shouldShowSeoTab && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                SEO Automático Activado
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Esta página genera el SEO automáticamente desde los datos individuales:
              </p>
              <ul className="text-left bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✅</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Servicio Detail:</strong> El SEO viene del servicio individual (título, descripción, etiquetas)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✅</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Blog Post Detail:</strong> El SEO viene del post individual (title, excerpt, tags, featured image)
                  </span>
                </li>
              </ul>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  💡 <strong>Tip:</strong> Para editar el SEO de un servicio o post específico, ve a la sección de Servicios o Blog en el panel administrativo.
                </p>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'theme' && selectedPage === 'home' && (
          <ThemeConfigSection
            pageData={pageData}
            updateContent={handleUpdateContent}
            updateSimpleButtonStyle={handleUpdateSimpleButtonStyle}
          />
        )}
        {activeTab === 'theme' && selectedPage !== 'home' && (
          <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              🎨 Configuración de Tema
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              La configuración avanzada de tema solo está disponible para la página "Home"
            </p>
          </div>
        )}
        {activeTab === 'chatbot' && (
          <ChatbotConfigSection
            config={pageData?.content?.chatbotConfig || defaultChatbotConfig}
            onUpdate={(field, value) => handleUpdateContent(field, value)}
            theme={currentTheme}
          />
        )}
        {activeTab === 'sidebar' && (
          <div className="space-y-4">
            {/* Configuración del Sidebar */}
            <SidebarConfigSection
              onSave={() => setSaveStatus('saved')}
              onChangePending={() => setHasGlobalChanges(true)}
            />
            
            {/* Separador */}
            <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-8">
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-2xl">📰</span>
                  Bloque de Posts Destacados
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Configura el diseño del carrusel de noticias en el Dashboard del Cliente
                </p>
              </div>
              
              {/* Configuración de Posts Destacados */}
              <DashboardFeaturedPostsConfigSection
                onSave={() => setSaveStatus('saved')}
                onChangePending={() => setHasGlobalChanges(true)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CmsManager;