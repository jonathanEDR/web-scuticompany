import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCmsData } from '../../hooks/cms/useCmsData';
import { useCmsUpdaters } from '../../hooks/cms/useCmsUpdaters';
import HeroConfigSection from './HeroConfigSection';
import SolutionsConfigSection from './SolutionsConfigSection';
import CardItemsEditor from './CardItemsEditor';
import SeoConfigSection from './SeoConfigSection';
import ThemeConfigSection from './ThemeConfigSection';
import CardsDesignConfigSection from './CardsDesignConfigSection';

const CmsManager: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determinar tab activo desde la URL
  const getInitialTab = (): 'content' | 'seo' | 'theme' | 'cards' => {
    const path = location.pathname;
    if (path.includes('/seo')) return 'seo';
    if (path.includes('/theme')) return 'theme';
    if (path.includes('/cards')) return 'cards';
    return 'content';
  };

  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'theme' | 'cards'>(getInitialTab());
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Sincronizar tab con URL
  useEffect(() => {
    const newTab = getInitialTab();
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [location.pathname]);

  // Actualizar URL cuando cambia el tab
  const handleTabChange = (tab: 'content' | 'seo' | 'theme' | 'cards') => {
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
    updateSimpleButtonStyle
  } = useCmsUpdaters(pageData, setPageData, setThemeConfig);



  // Update content without auto-save (manual save only)
  const handleUpdateContent = (field: string, value: any) => {
    updateContent(field, value);
    // Marcar como cambios pendientes sin guardar automáticamente
    setSaveStatus('idle');
  };

  // Update text style without auto-save (manual save only)
  const handleUpdateTextStyle = (section: 'hero' | 'solutions', field: string, mode: 'light' | 'dark', color: string) => {
    updateTextStyle(section, field, mode, color);
    // Marcar como cambios pendientes
    setSaveStatus('idle');
  };

  // Update button style without auto-save (manual save only)
  const handleUpdateSimpleButtonStyle = (mode: 'lightMode' | 'darkMode', buttonType: 'ctaPrimary' | 'contact' | 'dashboard', style: any) => {
    updateSimpleButtonStyle(mode, buttonType, style);
    // Marcar como cambios pendientes
    setSaveStatus('idle');
  };

  // Manual save
  const handleManualSave = async () => {
    try {
      setIsLoading(true);
      setSaveStatus('saving');
      
      // Si estamos en la pestaña de cards y hay cambios pendientes, guardar primero
      if (activeTab === 'cards' && (window as any).__cardDesignSave) {
        (window as any).__cardDesignSave();
      }
      
      await handleSave();
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'content' as const, label: 'Contenido', icon: '📝' },
    { id: 'cards' as const, label: 'Diseño de Tarjetas', icon: '🎴' },
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 mb-6 border border-gray-100 dark:border-gray-700/50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                🎛️ Gestor de Contenido CMS
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Administra el contenido, SEO y temas de tu página web
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Status Badge */}
              <div className={`px-3 py-2 rounded-lg border text-sm font-medium ${getSaveStatusColor()}`}>
                {getSaveStatusText()}
              </div>
              
              {/* Action Button */}
              <button
                onClick={handleManualSave}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
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
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 mb-6 border border-gray-100 dark:border-gray-700/50">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-6 py-4 font-medium transition-colors duration-200 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
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
                className="mt-6"
              />
            </>
          )}

          {activeTab === 'cards' && (
            <CardsDesignConfigSection
              pageData={pageData}
              updateContent={handleUpdateContent}
            />
          )}

          {activeTab === 'seo' && (
            <SeoConfigSection
              pageData={pageData}
              updateContent={handleUpdateContent}
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
    </div>
  );
};

export default CmsManager;