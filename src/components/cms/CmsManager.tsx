import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCmsData } from '../../hooks/cms/useCmsData';
import { useCmsUpdaters } from '../../hooks/cms/useCmsUpdaters';
import HeroConfigSection from './HeroConfigSection';
import SolutionsConfigSection from './SolutionsConfigSection';
import ValueAddedConfigSection from './ValueAddedConfigSection';
import ClientLogosConfigSection from './ClientLogosConfigSection';
import CardItemsEditor from './CardItemsEditor';
import ValueAddedItemsEditor from './ValueAddedItemsEditor';
import SeoConfigSection from './SeoConfigSection';
import ThemeConfigSection from './ThemeConfigSection';
import CardsDesignConfigSection from './CardsDesignConfigSection';
import ContactConfigSection from './ContactConfigSection';
import ContactFormEditor from './ContactFormEditor';

const CmsManager: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determinar tab activo desde la URL
  const getInitialTab = (): 'content' | 'seo' | 'theme' | 'cards' | 'contact' => {
    const path = location.pathname;
    if (path.includes('/seo')) return 'seo';
    if (path.includes('/theme')) return 'theme';
    if (path.includes('/cards')) return 'cards';
    if (path.includes('/contact')) return 'contact';
    return 'content';
  };

  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'theme' | 'cards' | 'contact'>(getInitialTab());
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
  const handleTabChange = (tab: 'content' | 'seo' | 'theme' | 'cards' | 'contact') => {
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
  } = useCmsData();

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
  const handleUpdateTextStyle = (section: 'hero' | 'solutions' | 'valueAdded' | 'clientLogos', field: string, mode: 'light' | 'dark', color: string) => {
    updateTextStyle(section, field, mode, color);
    // 🔥 Marcar como cambios pendientes GLOBALMENTE
    if (!hasGlobalChanges) {
      setHasGlobalChanges(true);
    }
    setSaveStatus('idle');
  };

  // Update button style without auto-save (manual save only)
  const handleUpdateSimpleButtonStyle = (mode: 'lightMode' | 'darkMode', buttonType: 'ctaPrimary' | 'contact' | 'dashboard' | 'viewMore', style: any) => {
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

  const tabs = [
    { id: 'content' as const, label: 'Contenido', icon: '📝' },
    { id: 'cards' as const, label: 'Diseño de Tarjetas', icon: '🎴' },
    { id: 'contact' as const, label: 'Contacto', icon: '📞' },
    { id: 'seo' as const, label: 'SEO', icon: '🔍' },
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
            <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">
              ❌ Error al cargar
            </h2>
            <p className="text-red-600 dark:text-red-300 mb-4">{dataMessage.text}</p>
            <button
              onClick={loadPageData}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <div className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 mb-6 border border-gray-100 dark:border-gray-700/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-3">
              🎛️ Gestor de Contenido CMS
              {hasGlobalChanges && (
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 text-sm font-medium rounded-full animate-pulse">
                  🟡 Cambios sin guardar
                </span>
              )}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Administra el contenido, SEO y temas de tu página web
            </p>
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
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 ${
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
      <div className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 mb-6 border border-gray-100 dark:border-gray-700/50">
        <div className="flex flex-wrap sm:flex-nowrap overflow-x-auto border-b border-gray-200 dark:border-gray-700 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-shrink-0 flex-grow px-4 sm:px-6 py-3 sm:py-4 font-medium transition-colors duration-200 flex items-center gap-2 text-base sm:text-lg ${
                activeTab === tab.id
                  ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
              style={{ minWidth: '120px' }}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="w-full space-y-6">
        {activeTab === 'content' && (
          <>
            <HeroConfigSection
              pageData={pageData}
              updateContent={handleUpdateContent}
              updateTextStyle={handleUpdateTextStyle}
            />
            {/* Configuración General de Soluciones (sin gestión de items) */}
            <SolutionsConfigSection
              pageData={pageData}
              updateContent={handleUpdateContent}
              updateTextStyle={handleUpdateTextStyle}
            />
            {/* Editor de Tarjetas con Upload de Iconos */}
            <CardItemsEditor
              items={pageData.content.solutions.items || []}
              onUpdate={(updatedItems) => handleUpdateContent('solutions.items', updatedItems)}
              onSave={handleSave} // Función de save manual
              pageData={pageData} // Para obtener estilos actuales
              updateTextStyle={handleUpdateTextStyle} // Para manejar colores por tema
              className="mt-6"
            />
            {/* Configuración General de Valor Agregado */}
            <ValueAddedConfigSection
              pageData={pageData}
              updateContent={handleUpdateContent}
              updateTextStyle={handleUpdateTextStyle}
            />
            {/* Editor de Tarjetas de Valor Agregado */}
            <ValueAddedItemsEditor
              items={pageData.content.valueAdded?.items || []}
              onUpdate={(updatedItems) => handleUpdateContent('valueAdded.items', updatedItems)}
              onSave={handleSave} // Función de save manual
              pageData={pageData} // Para obtener estilos actuales
              updateTextStyle={handleUpdateTextStyle} // Para manejar colores por tema
              className="mt-6"
            />
            {/* Configuración de Logos de Clientes */}
            <ClientLogosConfigSection
              pageData={pageData}
              updateContent={handleUpdateContent}
              updateTextStyle={handleUpdateTextStyle}
            />
          </>
        )}
        {activeTab === 'cards' && (
          <div className="space-y-8">
            {/* 🔥 NUEVO: Configuración Unificada para Solutions y Value Added Cards */}
            <CardsDesignConfigSection
              pageData={pageData}
              updateContent={handleUpdateContent}
              setHasGlobalChanges={setHasGlobalChanges} // 🔥 PASAR LA FUNCIÓN
            />
          </div>
        )}
        {activeTab === 'contact' && (
          <div className="space-y-8">
            <ContactConfigSection
              pageData={pageData}
              updateContent={handleUpdateContent}
            />
            <ContactFormEditor
              pageData={pageData}
              updateContent={handleUpdateContent}
            />
          </div>
        )}
        {activeTab === 'seo' && (
          <SeoConfigSection
            pageData={pageData}
            updateContent={handleUpdateSeo}
          />
        )}
        {activeTab === 'theme' && (
          <ThemeConfigSection
            pageData={pageData}
            updateContent={handleUpdateContent}
            updateSimpleButtonStyle={handleUpdateSimpleButtonStyle}
          />
        )}
      </div>
    </div>
  );
};

export default CmsManager;