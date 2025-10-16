import { useState, useEffect } from 'react';
import { SignedIn } from '@clerk/clerk-react';
import DashboardLayout from '../components/DashboardLayout';
import ImageUploader from '../components/ImageUploader';
import SimpleButtonConfig from '../components/SimpleButtonConfig';
import ThemePreviewSwitcher from '../components/ThemePreviewSwitcher';
import RichTextEditorWithTheme from '../components/RichTextEditorWithTheme';
import { getPageBySlug, updatePage } from '../services/cmsApi';
import { useTheme } from '../contexts/ThemeContext';
// import type { ThemeConfig } from '../contexts/ThemeContext'; // No longer needed with simplified approach
import '../styles/gradient-borders.css';

interface ButtonStyle {
  background: string;
  textColor: string;
  borderColor: string;
}

interface SimpleThemeConfig {
  default: 'light' | 'dark';
  lightMode: {
    buttons: {
      ctaPrimary: ButtonStyle;
      contact: ButtonStyle;
      dashboard: ButtonStyle;
    };
    [key: string]: any;
  };
  darkMode: {
    buttons: {
      ctaPrimary: ButtonStyle;
      contact: ButtonStyle;
      dashboard: ButtonStyle;
    };
    [key: string]: any;
  };
  [key: string]: any;
}

interface PageContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    backgroundImage?: {
      light?: string;
      dark?: string;
    };
    backgroundImageAlt?: string;
    styles?: {
      light: {
        titleColor?: string;
        subtitleColor?: string;
        descriptionColor?: string;
      };
      dark: {
        titleColor?: string;
        subtitleColor?: string;
        descriptionColor?: string;
      };
    };
  };
  solutions: {
    title: string;
    description: string;
    backgroundImage?: {
      light?: string;
      dark?: string;
    };
    backgroundImageAlt?: string;
    styles?: {
      light: {
        titleColor?: string;
        descriptionColor?: string;
      };
      dark: {
        titleColor?: string;
        descriptionColor?: string;
      };
    };
    items: Array<{
      icon: string;
      title: string;
      description: string;
      gradient: string;
    }>;
  };
}

interface PageSeo {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

interface PageData {
  pageSlug: string;
  pageName: string;
  content: PageContent;
  seo: PageSeo;
  theme?: SimpleThemeConfig;
  isPublished: boolean;
}

export default function CmsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'theme'>('content');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { setThemeConfig } = useTheme();

  // Cargar datos de la página Home
  useEffect(() => {
    if (!pageData) {
      loadPageData();
    }
  }, [pageData]);

  // Sincronizar el tema con el contexto cuando cambian los datos
  useEffect(() => {
    if (pageData?.theme) {
      setThemeConfig(pageData.theme as any);
    }
  }, [pageData?.theme, setThemeConfig]);

  const loadPageData = async () => {
    try {
      setLoading(true);
      const data = await getPageBySlug('home');
      
      // Asegurar que los botones tengan valores por defecto si no existen
      if (data.theme) {
        // Valores por defecto para modo claro
        if (!data.theme.lightMode.buttons) {
          data.theme.lightMode.buttons = {};
        }
        if (!data.theme.lightMode.buttons.ctaPrimary) {
          data.theme.lightMode.buttons.ctaPrimary = {
            background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
            textColor: '#FFFFFF',
            borderColor: 'transparent'
          };
        }
        if (!data.theme.lightMode.buttons.contact) {
          data.theme.lightMode.buttons.contact = {
            background: 'transparent',
            textColor: '#8B5CF6',
            borderColor: 'linear-gradient(90deg, #8B5CF6, #06B6D4)'
          };
        }
        if (!data.theme.lightMode.buttons.dashboard) {
          data.theme.lightMode.buttons.dashboard = {
            background: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
            textColor: '#FFFFFF',
            borderColor: 'transparent'
          };
        }
        
        // Valores por defecto para modo oscuro
        if (!data.theme.darkMode.buttons) {
          data.theme.darkMode.buttons = {};
        }
        if (!data.theme.darkMode.buttons.ctaPrimary) {
          data.theme.darkMode.buttons.ctaPrimary = {
            background: 'linear-gradient(135deg, #A78BFA, #22D3EE)',
            textColor: '#111827',
            borderColor: 'transparent'
          };
        }
        if (!data.theme.darkMode.buttons.contact) {
          data.theme.darkMode.buttons.contact = {
            background: 'transparent',
            textColor: '#A78BFA',
            borderColor: 'linear-gradient(90deg, #A78BFA, #22D3EE)'
          };
        }
        if (!data.theme.darkMode.buttons.dashboard) {
          data.theme.darkMode.buttons.dashboard = {
            background: 'linear-gradient(135deg, #22D3EE, #60A5FA)',
            textColor: '#111827',
            borderColor: 'transparent'
          };
        }
      }
      
      setPageData(data);
    } catch (error) {
      console.error('Error al cargar página:', error);
      setMessage({ type: 'error', text: 'Error al cargar la página' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!pageData) return;
    
    try {
      setSaving(true);
      
      console.log('💾 Guardando datos...', {
        content: pageData.content,
        seo: pageData.seo,
        theme: pageData.theme,
        isPublished: pageData.isPublished
      });
      
      await updatePage('home', {
        content: pageData.content,
        seo: pageData.seo,
        theme: pageData.theme,
        isPublished: pageData.isPublished
      });
      
      console.log('✅ Datos guardados exitosamente');
      
      setMessage({ type: 'success', text: '✅ Cambios guardados correctamente' });
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      setMessage({ type: 'error', text: '❌ Error al guardar cambios' });
    } finally {
      setSaving(false);
    }
  };

  const updateContent = (field: string, value: any) => {
    if (!pageData) return;

    const keys = field.split('.');
    const newData = { ...pageData };
    let current: any = newData.content;

    for (let i = 0; i < keys.length - 1; i++) {
      // Si no existe el objeto, crearlo
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      // Si es un string (formato anterior) y necesitamos convertir a objeto
      if (typeof current[keys[i]] === 'string' && keys[i] === 'backgroundImage') {
        current[keys[i]] = { dark: current[keys[i]] }; // Mover string existente a dark
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setPageData(newData);
  };

  const updateTextStyle = (section: 'hero' | 'solutions', field: string, mode: 'light' | 'dark', color: string) => {
    if (!pageData) return;

    setPageData({
      ...pageData,
      content: {
        ...pageData.content,
        [section]: {
          ...pageData.content[section],
          styles: {
            ...pageData.content[section].styles,
            [mode]: {
              ...pageData.content[section].styles?.[mode],
              [field]: color
            }
          }
        }
      }
    });
  };

  const updateSeo = (field: keyof PageSeo, value: any) => {
    if (!pageData) return;
    
    setPageData({
      ...pageData,
      seo: {
        ...pageData.seo,
        [field]: value
      }
    });
  };

  const updateTheme = (mode: 'lightMode' | 'darkMode', field: string, value: string) => {
    if (!pageData || !pageData.theme) return;
    
    setPageData({
      ...pageData,
      theme: {
        ...pageData.theme,
        [mode]: {
          ...pageData.theme[mode],
          [field]: value
        }
      }
    });
  };

  const updateThemeDefault = (value: 'light' | 'dark') => {
    if (!pageData || !pageData.theme) return;
    
    setPageData({
      ...pageData,
      theme: {
        ...pageData.theme,
        default: value
      }
    });
  };

  const updateSimpleButtonStyle = (mode: 'lightMode' | 'darkMode', buttonType: 'ctaPrimary' | 'contact' | 'dashboard', style: ButtonStyle) => {
    if (!pageData || !pageData.theme) return;

    // Asegurar que la estructura existe
    const currentTheme = { ...pageData.theme };
    if (!currentTheme[mode].buttons) {
      currentTheme[mode].buttons = {
        ctaPrimary: { background: 'transparent', textColor: '#8B5CF6', borderColor: 'transparent' },
        contact: { background: 'transparent', textColor: '#8B5CF6', borderColor: '#8B5CF6' },
        dashboard: { background: '#8B5CF6', textColor: '#FFFFFF', borderColor: 'transparent' }
      };
    }

    const newPageData = {
      ...pageData,
      theme: {
        ...currentTheme,
        [mode]: {
          ...currentTheme[mode],
          buttons: {
            ...currentTheme[mode].buttons,
            [buttonType]: style
          }
        }
      }
    };
    
    setPageData(newPageData);
  };

  if (loading) {
    return (
      <SignedIn>
        <DashboardLayout>
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </DashboardLayout>
      </SignedIn>
    );
  }

  if (!pageData) {
    return (
      <SignedIn>
        <DashboardLayout>
          <div className="p-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              ❌ No se pudo cargar la página
            </div>
          </div>
        </DashboardLayout>
      </SignedIn>
    );
  }

  return (
    <SignedIn>
      <DashboardLayout>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              📝 Gestor de Contenido
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Edita el contenido y SEO de la página principal
            </p>
          </div>

          {/* Mensaje de feedback */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/50 text-green-800 dark:text-green-300'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/50 text-red-800 dark:text-red-300'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('content')}
                className={`pb-4 px-2 font-medium transition-colors ${
                  activeTab === 'content'
                    ? 'border-b-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                📄 Contenido
              </button>
              <button
                onClick={() => setActiveTab('seo')}
                className={`pb-4 px-2 font-medium transition-colors ${
                  activeTab === 'seo'
                    ? 'border-b-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                🔍 SEO
              </button>
              <button
                onClick={() => setActiveTab('theme')}
                className={`pb-4 px-2 font-medium transition-colors ${
                  activeTab === 'theme'
                    ? 'border-b-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                🎨 Temas
              </button>
            </div>
          </div>

          {/* Contenido según tab activa */}
          {activeTab === 'content' ? (
            <div className="space-y-8">
              {/* Hero Section */}
              <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
                  🚀 Hero Section
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <RichTextEditorWithTheme
                      label="Título Principal"
                      value={pageData.content.hero.title}
                      onChange={(html) => updateContent('hero.title', html)}
                      placeholder="Transformamos tu empresa..."
                      themeColors={{
                        light: pageData.content.hero.styles?.light?.titleColor || '',
                        dark: pageData.content.hero.styles?.dark?.titleColor || ''
                      }}
                      onThemeColorChange={(mode, color) => updateTextStyle('hero', 'titleColor', mode, color)}
                    />
                  </div>

                  <div>
                    <RichTextEditorWithTheme
                      label="Subtítulo"
                      value={pageData.content.hero.subtitle}
                      onChange={(html) => updateContent('hero.subtitle', html)}
                      placeholder="Innovamos para que tu empresa..."
                      themeColors={{
                        light: pageData.content.hero.styles?.light?.subtitleColor || '',
                        dark: pageData.content.hero.styles?.dark?.subtitleColor || ''
                      }}
                      onThemeColorChange={(mode, color) => updateTextStyle('hero', 'subtitleColor', mode, color)}
                    />
                  </div>

                  <div>
                    <RichTextEditorWithTheme
                      label="Descripción"
                      value={pageData.content.hero.description}
                      onChange={(html) => updateContent('hero.description', html)}
                      placeholder="Transformamos procesos con..."
                      themeColors={{
                        light: pageData.content.hero.styles?.light?.descriptionColor || '',
                        dark: pageData.content.hero.styles?.dark?.descriptionColor || ''
                      }}
                      onThemeColorChange={(mode, color) => updateTextStyle('hero', 'descriptionColor', mode, color)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Texto del Botón
                      </label>
                      <input
                        type="text"
                        value={pageData.content.hero.ctaText}
                        onChange={(e) => updateContent('hero.ctaText', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Conoce nuestros servicios"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Enlace del Botón
                      </label>
                      <input
                        type="text"
                        value={pageData.content.hero.ctaLink}
                        onChange={(e) => updateContent('hero.ctaLink', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="#servicios"
                      />
                    </div>
                  </div>

                  {/* Imágenes de Fondo del Hero por Tema */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">🖼️ Imágenes de Fondo del Hero</h4>
                    
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {/* Imagen para Tema Claro */}
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                        <div className="flex items-center mb-3">
                          <div className="bg-white rounded-full p-2 mr-3 shadow-sm">
                            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-gray-800">🌞 Tema Claro</h5>
                            <p className="text-xs text-gray-600">Apariencia diurna</p>
                          </div>
                        </div>
                        <ImageUploader
                          label=""
                          description="Tamaño recomendado: 1920x1080px"
                          currentImage={typeof pageData.content.hero.backgroundImage === 'string' 
                            ? pageData.content.hero.backgroundImage 
                            : pageData.content.hero.backgroundImage?.light}
                          onImageUpload={(url) => updateContent('hero.backgroundImage.light', url)}
                        />
                      </div>

                      {/* Imagen para Tema Oscuro */}
                      <div className="bg-gradient-to-br from-slate-900 to-gray-900 p-4 rounded-lg border border-gray-700">
                        <div className="flex items-center mb-3">
                          <div className="bg-gray-800 rounded-full p-2 mr-3 shadow-sm">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-white">🌙 Tema Oscuro</h5>
                            <p className="text-xs text-gray-400">Apariencia nocturna</p>
                          </div>
                        </div>
                        <ImageUploader
                          label=""
                          description="Tamaño recomendado: 1920x1080px"
                          currentImage={typeof pageData.content.hero.backgroundImage === 'string' 
                            ? pageData.content.hero.backgroundImage 
                            : pageData.content.hero.backgroundImage?.dark}
                          onImageUpload={(url) => updateContent('hero.backgroundImage.dark', url)}
                          darkMode={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Solutions Section */}
              <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
                  💼 Sección Soluciones
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <RichTextEditorWithTheme
                      label="Título"
                      value={pageData.content.solutions.title}
                      onChange={(html) => updateContent('solutions.title', html)}
                      placeholder="Soluciones"
                      themeColors={{
                        light: pageData.content.solutions.styles?.light?.titleColor || '',
                        dark: pageData.content.solutions.styles?.dark?.titleColor || ''
                      }}
                      onThemeColorChange={(mode, color) => updateTextStyle('solutions', 'titleColor', mode, color)}
                    />
                  </div>

                  <div>
                    <RichTextEditorWithTheme
                      label="Descripción"
                      value={pageData.content.solutions.description}
                      onChange={(html) => updateContent('solutions.description', html)}
                      placeholder="Descripción de las soluciones..."
                      themeColors={{
                        light: pageData.content.solutions.styles?.light?.descriptionColor || '',
                        dark: pageData.content.solutions.styles?.dark?.descriptionColor || ''
                      }}
                      onThemeColorChange={(mode, color) => updateTextStyle('solutions', 'descriptionColor', mode, color)}
                    />
                  </div>

                  {/* Imágenes de Fondo de Soluciones por Tema */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">🖼️ Imágenes de Fondo de Soluciones</h4>
                    
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {/* Imagen para Tema Claro */}
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                        <div className="flex items-center mb-3">
                          <div className="bg-white rounded-full p-2 mr-3 shadow-sm">
                            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-gray-800">🌞 Tema Claro</h5>
                            <p className="text-xs text-gray-600">Imagen para modo claro</p>
                          </div>
                        </div>
                        <ImageUploader
                          label=""
                          description="Tamaño recomendado: 1920x1080px"
                          currentImage={typeof pageData.content.solutions.backgroundImage === 'string' 
                            ? pageData.content.solutions.backgroundImage 
                            : pageData.content.solutions.backgroundImage?.light}
                          onImageUpload={(url) => updateContent('solutions.backgroundImage.light', url)}
                        />
                      </div>

                      {/* Imagen para Tema Oscuro */}
                      <div className="bg-gradient-to-br from-slate-900 to-gray-900 p-4 rounded-lg border border-gray-700">
                        <div className="flex items-center mb-3">
                          <div className="bg-gray-800 rounded-full p-2 mr-3 shadow-sm">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-white">🌙 Tema Oscuro</h5>
                            <p className="text-xs text-gray-400">Imagen para modo oscuro</p>
                          </div>
                        </div>
                        <ImageUploader
                          label=""
                          description="Tamaño recomendado: 1920x1080px"
                          currentImage={typeof pageData.content.solutions.backgroundImage === 'string' 
                            ? pageData.content.solutions.backgroundImage 
                            : pageData.content.solutions.backgroundImage?.dark}
                          onImageUpload={(url) => updateContent('solutions.backgroundImage.dark', url)}
                          darkMode={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'seo' ? (
            <div className="space-y-6">
              {/* SEO Configuration */}
              <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
                  🔍 Configuración SEO
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meta Title
                      <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">
                        ({pageData.seo.metaTitle.length}/60 caracteres)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={pageData.seo.metaTitle}
                      onChange={(e) => updateSeo('metaTitle', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-colors"
                      maxLength={60}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meta Description
                      <span className="text-gray-500 text-xs ml-2">
                        ({pageData.seo.metaDescription.length}/160 caracteres)
                      </span>
                    </label>
                    <textarea
                      value={pageData.seo.metaDescription}
                      onChange={(e) => updateSeo('metaDescription', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      rows={3}
                      maxLength={160}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Keywords (separadas por comas)
                    </label>
                    <input
                      type="text"
                      value={pageData.seo.keywords.join(', ')}
                      onChange={(e) => updateSeo('keywords', e.target.value.split(',').map(k => k.trim()))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="tecnología, software, IA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Open Graph Title
                    </label>
                    <input
                      type="text"
                      value={pageData.seo.ogTitle}
                      onChange={(e) => updateSeo('ogTitle', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Open Graph Description
                    </label>
                    <textarea
                      value={pageData.seo.ogDescription}
                      onChange={(e) => updateSeo('ogDescription', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Theme Configuration
            <div className="space-y-6">
              {pageData.theme && (
                <>
                  {/* Tema por Defecto */}
                  <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
                      🎨 Configuración de Temas
                    </h2>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                        Tema por Defecto
                      </label>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => updateThemeDefault('light')}
                          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                            pageData.theme.default === 'light'
                              ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700/50'
                          }`}
                        >
                          <div className="text-center">
                            <svg className="w-8 h-8 mx-auto mb-2 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <p className="font-medium text-gray-700 dark:text-gray-200">Claro</p>
                          </div>
                        </button>
                        <button
                          onClick={() => updateThemeDefault('dark')}
                          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                            pageData.theme.default === 'dark'
                              ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700/50'
                          }`}
                        >
                          <div className="text-center">
                            <svg className="w-8 h-8 mx-auto mb-2 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                            <p className="font-medium text-gray-700 dark:text-gray-200">Oscuro</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Configuración de Colores - Layout Compacto */}
                  <div className="bg-white dark:bg-gray-800/80 rounded-xl shadow-lg dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700/50 overflow-hidden">
                    <div className="p-6 pb-4">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center">
                        🎨 Configuración de Colores por Tema
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Configura los colores para ambos temas de forma simultánea
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-0">
                      {/* Modo Claro */}
                      <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-r border-gray-200">
                        <div className="flex items-center mb-6">
                          <div className="bg-white rounded-full p-2 mr-3 shadow-sm">
                            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-800">Modo Claro</h4>
                            <p className="text-sm text-gray-600">Apariencia diurna</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              Color Primario
                            </label>
                            <div className="flex space-x-2">
                              <input
                                type="color"
                                value={pageData.theme.lightMode.primary}
                                onChange={(e) => updateTheme('lightMode', 'primary', e.target.value)}
                                className="w-10 h-8 rounded-md cursor-pointer border-2 border-white shadow-sm"
                              />
                              <input
                                type="text"
                                value={pageData.theme.lightMode.primary}
                                onChange={(e) => updateTheme('lightMode', 'primary', e.target.value)}
                                className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                placeholder="#8B5CF6"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              Color Secundario
                            </label>
                            <div className="flex space-x-2">
                              <input
                                type="color"
                                value={pageData.theme.lightMode.secondary}
                                onChange={(e) => updateTheme('lightMode', 'secondary', e.target.value)}
                                className="w-10 h-8 rounded-md cursor-pointer border-2 border-white shadow-sm"
                              />
                              <input
                                type="text"
                                value={pageData.theme.lightMode.secondary}
                                onChange={(e) => updateTheme('lightMode', 'secondary', e.target.value)}
                                className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                placeholder="#06B6D4"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                              Fondo Principal
                            </label>
                            <div className="flex space-x-2">
                              <input
                                type="color"
                                value={pageData.theme.lightMode.background}
                                onChange={(e) => updateTheme('lightMode', 'bg', e.target.value)}
                                className="w-10 h-8 rounded-md cursor-pointer border-2 border-white shadow-sm"
                              />
                              <input
                                type="text"
                                value={pageData.theme.lightMode.background}
                                onChange={(e) => updateTheme('lightMode', 'bg', e.target.value)}
                                className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                placeholder="#FFFFFF"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                              Texto Principal
                            </label>
                            <div className="flex space-x-2">
                              <input
                                type="color"
                                value={pageData.theme.lightMode.text}
                                onChange={(e) => updateTheme('lightMode', 'text', e.target.value)}
                                className="w-10 h-8 rounded-md cursor-pointer border-2 border-white shadow-sm"
                              />
                              <input
                                type="text"
                                value={pageData.theme.lightMode.text}
                                onChange={(e) => updateTheme('lightMode', 'text', e.target.value)}
                                className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                placeholder="#1F2937"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                              Texto Secundario
                            </label>
                            <div className="flex space-x-2">
                              <input
                                type="color"
                                value={pageData.theme.lightMode.textSecondary}
                                onChange={(e) => updateTheme('lightMode', 'textSecondary', e.target.value)}
                                className="w-10 h-8 rounded-md cursor-pointer border-2 border-white shadow-sm"
                              />
                              <input
                                type="text"
                                value={pageData.theme.lightMode.textSecondary}
                                onChange={(e) => updateTheme('lightMode', 'textSecondary', e.target.value)}
                                className="flex-1 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                placeholder="#6B7280"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              Fondo de Tarjetas
                            </label>
                            <div className="flex space-x-2">
                              <input
                                type="color"
                                value={pageData.theme.lightMode.cardBg}
                                onChange={(e) => updateTheme('lightMode', 'cardBg', e.target.value)}
                                className="w-10 h-8 rounded-md cursor-pointer border-2 border-white shadow-sm"
                              />
                              <input
                                type="text"
                                value={pageData.theme.lightMode.cardBg}
                                onChange={(e) => updateTheme('lightMode', 'cardBg', e.target.value)}
                                className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                                placeholder="#F9FAFB"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Modo Oscuro */}
                      <div className="p-6 bg-gradient-to-br from-slate-900 to-gray-900">
                        <div className="flex items-center mb-6">
                          <div className="bg-gray-800 rounded-full p-2 mr-3 shadow-sm">
                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-white">Modo Oscuro</h4>
                            <p className="text-sm text-gray-400">Apariencia nocturna</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">
                              Color Primario
                            </label>
                            <div className="flex space-x-2">
                              <input
                                type="color"
                                value={pageData.theme.darkMode.primary}
                                onChange={(e) => updateTheme('darkMode', 'primary', e.target.value)}
                                className="w-10 h-8 rounded-md cursor-pointer border-2 border-gray-700 shadow-sm"
                              />
                              <input
                                type="text"
                                value={pageData.theme.darkMode.primary}
                                onChange={(e) => updateTheme('darkMode', 'primary', e.target.value)}
                                className="flex-1 px-2 py-1.5 bg-gray-800 border border-gray-600 rounded-md text-white text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                                placeholder="#A78BFA"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">
                              Color Secundario
                            </label>
                            <div className="flex space-x-2">
                              <input
                                type="color"
                                value={pageData.theme.darkMode.secondary}
                                onChange={(e) => updateTheme('darkMode', 'secondary', e.target.value)}
                                className="w-10 h-8 rounded-md cursor-pointer border-2 border-gray-700 shadow-sm"
                              />
                              <input
                                type="text"
                                value={pageData.theme.darkMode.secondary}
                                onChange={(e) => updateTheme('darkMode', 'secondary', e.target.value)}
                                className="flex-1 px-2 py-1.5 bg-gray-800 border border-gray-600 rounded-md text-white text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                                placeholder="#22D3EE"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">
                              Fondo Principal
                            </label>
                            <div className="flex space-x-2">
                              <input
                                type="color"
                                value={pageData.theme.darkMode.background}
                                onChange={(e) => updateTheme('darkMode', 'bg', e.target.value)}
                                className="w-10 h-8 rounded-md cursor-pointer border-2 border-gray-700 shadow-sm"
                              />
                              <input
                                type="text"
                                value={pageData.theme.darkMode.background}
                                onChange={(e) => updateTheme('darkMode', 'bg', e.target.value)}
                                className="flex-1 px-2 py-1.5 bg-gray-800 border border-gray-600 rounded-md text-white text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                                placeholder="#111827"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">
                              Texto Principal
                            </label>
                            <div className="flex space-x-2">
                              <input
                                type="color"
                                value={pageData.theme.darkMode.text}
                                onChange={(e) => updateTheme('darkMode', 'text', e.target.value)}
                                className="w-10 h-8 rounded-md cursor-pointer border-2 border-gray-700 shadow-sm"
                              />
                              <input
                                type="text"
                                value={pageData.theme.darkMode.text}
                                onChange={(e) => updateTheme('darkMode', 'text', e.target.value)}
                                className="flex-1 px-2 py-1.5 bg-gray-800 border border-gray-600 rounded-md text-white text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                                placeholder="#F9FAFB"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">
                              Texto Secundario
                            </label>
                            <div className="flex space-x-2">
                              <input
                                type="color"
                                value={pageData.theme.darkMode.textSecondary}
                                onChange={(e) => updateTheme('darkMode', 'textSecondary', e.target.value)}
                                className="w-10 h-8 rounded-md cursor-pointer border-2 border-gray-700 shadow-sm"
                              />
                              <input
                                type="text"
                                value={pageData.theme.darkMode.textSecondary}
                                onChange={(e) => updateTheme('darkMode', 'textSecondary', e.target.value)}
                                className="flex-1 px-2 py-1.5 bg-gray-800 border border-gray-600 rounded-md text-white text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                                placeholder="#D1D5DB"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1.5">
                              Fondo de Tarjetas
                            </label>
                            <div className="flex space-x-2">
                              <input
                                type="color"
                                value={pageData.theme.darkMode.cardBg}
                                onChange={(e) => updateTheme('darkMode', 'cardBg', e.target.value)}
                                className="w-10 h-8 rounded-md cursor-pointer border-2 border-gray-700 shadow-sm"
                              />
                              <input
                                type="text"
                                value={pageData.theme.darkMode.cardBg}
                                onChange={(e) => updateTheme('darkMode', 'cardBg', e.target.value)}
                                className="flex-1 px-2 py-1.5 bg-gray-800 border border-gray-600 rounded-md text-white text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                                placeholder="#1F2937"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Barra de ayuda en la parte inferior */}
                    <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>💡 Tip: Los cambios se aplican en tiempo real</span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>✨ Modo Claro</span>
                          <span>•</span>
                          <span>🌙 Modo Oscuro</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nueva Configuración Avanzada de Botones */}
                  <div className="bg-white dark:bg-gray-800/80 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                        🎨 Configuración Avanzada de Botones
                      </h3>
                      <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 px-4 py-2 rounded-lg">
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                          ⚡ Vista Optimizada
                        </span>
                      </div>
                    </div>
                    
                    {/* Vista Previa en Tiempo Real - Optimizada */}
                    <div className="mb-8">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700/50">
                        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                          👁️ Vista Previa en Tiempo Real
                        </h4>
                        
                        {/* Indicador de Estado de Configuración */}
                        <div className="mb-4 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-blue-200 dark:border-blue-700/50">
                          <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">Estado de la configuración:</div>
                          <div className="flex items-center space-x-4 text-xs">
                            <span className={`flex items-center ${
                              pageData.theme?.lightMode?.buttons?.contact ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {pageData.theme?.lightMode?.buttons?.contact ? '✅' : '❌'} Contacto Claro
                            </span>
                            <span className={`flex items-center ${
                              pageData.theme?.darkMode?.buttons?.contact ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {pageData.theme?.darkMode?.buttons?.contact ? '✅' : '❌'} Contacto Oscuro
                            </span>
                            <span className={`flex items-center ${
                              pageData.theme?.lightMode?.buttons?.ctaPrimary ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {pageData.theme?.lightMode?.buttons?.ctaPrimary ? '✅' : '❌'} CTA Principal
                            </span>
                          </div>
                        </div>
                        
                        <ThemePreviewSwitcher
                          lightMode={{
                            buttons: {
                              ctaPrimary: pageData.theme?.lightMode?.buttons?.ctaPrimary ? {
                                bg: pageData.theme.lightMode.buttons.ctaPrimary.background || 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                                text: pageData.theme.lightMode.buttons.ctaPrimary.textColor || '#FFFFFF',
                                hover: pageData.theme.lightMode.buttons.ctaPrimary.background || 'linear-gradient(135deg, #8B5CF6, #06B6D4)'
                              } : undefined,
                              contact: pageData.theme?.lightMode?.buttons?.contact ? {
                                bg: pageData.theme.lightMode.buttons.contact.background || 'transparent',
                                text: pageData.theme.lightMode.buttons.contact.textColor || '#8B5CF6',
                                border: pageData.theme.lightMode.buttons.contact.borderColor || '#8B5CF6',
                                hover: pageData.theme.lightMode.buttons.contact.background || 'transparent'
                              } : undefined,
                              dashboard: pageData.theme?.lightMode?.buttons?.dashboard ? {
                                bg: pageData.theme.lightMode.buttons.dashboard.background || 'linear-gradient(135deg, #06B6D4, #3B82F6)',
                                text: pageData.theme.lightMode.buttons.dashboard.textColor || '#FFFFFF',
                                hover: pageData.theme.lightMode.buttons.dashboard.background || 'linear-gradient(135deg, #06B6D4, #3B82F6)'
                              } : undefined
                            }
                          }}
                          darkMode={{
                            buttons: {
                              ctaPrimary: pageData.theme?.darkMode?.buttons?.ctaPrimary ? {
                                bg: pageData.theme.darkMode.buttons.ctaPrimary.background || 'linear-gradient(135deg, #A78BFA, #22D3EE)',
                                text: pageData.theme.darkMode.buttons.ctaPrimary.textColor || '#111827',
                                hover: pageData.theme.darkMode.buttons.ctaPrimary.background || 'linear-gradient(135deg, #A78BFA, #22D3EE)'
                              } : undefined,
                              contact: pageData.theme?.darkMode?.buttons?.contact ? {
                                bg: pageData.theme.darkMode.buttons.contact.background || 'transparent',
                                text: pageData.theme.darkMode.buttons.contact.textColor || '#A78BFA',
                                border: pageData.theme.darkMode.buttons.contact.borderColor || '#A78BFA',
                                hover: pageData.theme.darkMode.buttons.contact.background || 'transparent'
                              } : undefined,
                              dashboard: pageData.theme?.darkMode?.buttons?.dashboard ? {
                                bg: pageData.theme.darkMode.buttons.dashboard.background || 'linear-gradient(135deg, #22D3EE, #60A5FA)',
                                text: pageData.theme.darkMode.buttons.dashboard.textColor || '#111827',
                                hover: pageData.theme.darkMode.buttons.dashboard.background || 'linear-gradient(135deg, #22D3EE, #60A5FA)'
                              } : undefined
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Configuración Simplificada de Botones */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Modo Claro */}
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-700/50">
                        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6 flex items-center">
                          ☀️ Configuración - Modo Claro
                        </h4>
                        <div className="space-y-4">
                          <SimpleButtonConfig
                            title="Botón Principal de Servicios"
                            icon="🚀"
                            value={pageData.theme?.lightMode?.buttons?.ctaPrimary || { 
                              background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)', 
                              textColor: '#FFFFFF', 
                              borderColor: 'transparent' 
                            }}
                            onChange={(style) => updateSimpleButtonStyle('lightMode', 'ctaPrimary', style)}
                          />
                          <SimpleButtonConfig
                            title="Botón de Contacto"
                            icon="📞"
                            value={pageData.theme?.lightMode?.buttons?.contact || { 
                              background: 'transparent', 
                              textColor: '#8B5CF6', 
                              borderColor: 'linear-gradient(90deg, #8B5CF6, #06B6D4)' 
                            }}
                            onChange={(style) => updateSimpleButtonStyle('lightMode', 'contact', style)}
                          />
                          <SimpleButtonConfig
                            title="Botón Dashboard"
                            icon="🎯"
                            value={pageData.theme?.lightMode?.buttons?.dashboard || { 
                              background: 'linear-gradient(135deg, #06B6D4, #3B82F6)', 
                              textColor: '#FFFFFF', 
                              borderColor: 'transparent' 
                            }}
                            onChange={(style) => updateSimpleButtonStyle('lightMode', 'dashboard', style)}
                          />
                        </div>
                      </div>

                      {/* Modo Oscuro */}
                      <div className="bg-gradient-to-br from-slate-900 to-gray-900 rounded-xl p-6 border border-slate-700">
                        <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
                          🌙 Configuración - Modo Oscuro
                        </h4>
                        <div className="space-y-4">
                          <SimpleButtonConfig
                            title="Botón Principal de Servicios"
                            icon="🚀"
                            value={pageData.theme?.darkMode?.buttons?.ctaPrimary || { 
                              background: 'linear-gradient(135deg, #A78BFA, #22D3EE)', 
                              textColor: '#111827', 
                              borderColor: 'transparent' 
                            }}
                            onChange={(style) => updateSimpleButtonStyle('darkMode', 'ctaPrimary', style)}
                          />
                          <SimpleButtonConfig
                            title="Botón de Contacto"
                            icon="📞"
                            value={pageData.theme?.darkMode?.buttons?.contact || { 
                              background: 'transparent', 
                              textColor: '#A78BFA', 
                              borderColor: 'linear-gradient(90deg, #A78BFA, #22D3EE)' 
                            }}
                            onChange={(style) => updateSimpleButtonStyle('darkMode', 'contact', style)}
                          />
                          <SimpleButtonConfig
                            title="Botón Dashboard"
                            icon="🎯"
                            value={pageData.theme?.darkMode?.buttons?.dashboard || { 
                              background: 'linear-gradient(135deg, #22D3EE, #60A5FA)', 
                              textColor: '#111827', 
                              borderColor: 'transparent' 
                            }}
                            onChange={(style) => updateSimpleButtonStyle('darkMode', 'dashboard', style)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sección de Ayuda Rápida SIMPLIFICADA */}
                    <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700/50">
                      <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                        ✨ Nueva Configuración Simplificada
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-4 border border-green-100 dark:border-green-700/50">
                          <div className="font-medium text-green-700 dark:text-green-400 mb-2">⚡ Solo 3 Opciones</div>
                          <p className="text-gray-600 dark:text-gray-300">
                            Configura cada botón con solo <strong>Fondo</strong>, <strong>Texto</strong> y <strong>Borde</strong>. ¡Súper fácil!
                          </p>
                        </div>
                        <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-4 border border-blue-100 dark:border-blue-700/50">
                          <div className="font-medium text-blue-700 dark:text-blue-400 mb-2">⚡ Estilos Rápidos</div>
                          <p className="text-gray-600 dark:text-gray-300">
                            Usa los <strong>presets incluidos</strong> para aplicar estilos profesionales en 1 clic.
                          </p>
                        </div>
                        <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-4 border border-purple-100 dark:border-purple-700/50">
                          <div className="font-medium text-purple-700 dark:text-purple-400 mb-2">👁️ Vista Previa</div>
                          <p className="text-gray-600 dark:text-gray-300">
                            Ve los cambios <strong>en tiempo real</strong> mientras configuras cada botón.
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </>
              )}
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={loadPageData}
              className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium transition-colors"
              disabled={saving}
            >
              🔄 Recargar
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 dark:from-purple-500 dark:to-cyan-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? '💾 Guardando...' : '💾 Guardar Cambios'}
            </button>
          </div>
        </div>
      </DashboardLayout>
    </SignedIn>
  );
}
