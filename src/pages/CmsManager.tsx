import { useState, useEffect } from 'react';
import { SignedIn } from '@clerk/clerk-react';
import DashboardLayout from '../components/DashboardLayout';
import ImageUploader from '../components/ImageUploader';
import ButtonConfig from '../components/ButtonConfig';
import ThemePreviewSwitcher from '../components/ThemePreviewSwitcher';
import { getPageBySlug, updatePage } from '../services/cmsApi';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeConfig } from '../contexts/ThemeContext';
import '../styles/gradient-borders.css';

interface ButtonTheme {
  bg: string;
  text: string;
  border?: string;
  hover: string;
  hoverText?: string;
}

interface ExtendedThemeConfig extends ThemeConfig {
  lightMode: ThemeConfig['lightMode'] & {
    buttons: {
      ctaPrimary: ButtonTheme;
      contact: ButtonTheme;
      dashboard: ButtonTheme;
    };
  };
  darkMode: ThemeConfig['darkMode'] & {
    buttons: {
      ctaPrimary: ButtonTheme;
      contact: ButtonTheme;
      dashboard: ButtonTheme;
    };
  };
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
  };
  solutions: {
    title: string;
    description: string;
    backgroundImage?: {
      light?: string;
      dark?: string;
    };
    backgroundImageAlt?: string;
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
  theme?: ExtendedThemeConfig;
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
      setThemeConfig(pageData.theme as ThemeConfig);
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
            bg: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
            text: '#FFFFFF',
            hover: 'linear-gradient(135deg, #7C3AED, #0891B2)',
            border: 'transparent',
            hoverText: '#FFFFFF'
          };
        }
        if (!data.theme.lightMode.buttons.dashboard) {
          data.theme.lightMode.buttons.dashboard = {
            bg: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
            text: '#FFFFFF',
            hover: 'linear-gradient(135deg, #0891B2, #2563EB)',
            border: 'transparent',
            hoverText: '#FFFFFF'
          };
        }
        
        // Valores por defecto para modo oscuro
        if (!data.theme.darkMode.buttons) {
          data.theme.darkMode.buttons = {};
        }
        if (!data.theme.darkMode.buttons.ctaPrimary) {
          data.theme.darkMode.buttons.ctaPrimary = {
            bg: 'linear-gradient(135deg, #A78BFA, #22D3EE)',
            text: '#111827',
            hover: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
            border: 'transparent',
            hoverText: '#FFFFFF'
          };
        }
        if (!data.theme.darkMode.buttons.dashboard) {
          data.theme.darkMode.buttons.dashboard = {
            bg: 'linear-gradient(135deg, #22D3EE, #60A5FA)',
            text: '#111827',
            hover: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
            border: 'transparent',
            hoverText: '#FFFFFF'
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
      await updatePage('home', {
        content: pageData.content,
        seo: pageData.seo,
        theme: pageData.theme,
        isPublished: pageData.isPublished
      });
      
      setMessage({ type: 'success', text: '✅ Cambios guardados correctamente' });
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error al guardar:', error);
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

  const updateButtonTheme = (mode: 'lightMode' | 'darkMode', buttonType: 'ctaPrimary' | 'contact' | 'dashboard', property: string, value: string) => {
    if (!pageData || !pageData.theme) return;

    // Asegurar que la estructura existe
    const currentTheme = { ...pageData.theme };
    if (!currentTheme[mode].buttons) {
      currentTheme[mode].buttons = {
        ctaPrimary: { bg: '', text: '', border: '', hover: '' },
        contact: { bg: '', text: '', border: '', hover: '', hoverText: '' },
        dashboard: { bg: '', text: '', border: '', hover: '' }
      };
    }

    setPageData({
      ...pageData,
      theme: {
        ...currentTheme,
        [mode]: {
          ...currentTheme[mode],
          buttons: {
            ...currentTheme[mode].buttons,
            [buttonType]: {
              ...currentTheme[mode].buttons[buttonType],
              [property]: value
            }
          }
        }
      }
    });
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              📝 Gestor de Contenido
            </h1>
            <p className="text-gray-600">
              Edita el contenido y SEO de la página principal
            </p>
          </div>

          {/* Mensaje de feedback */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('content')}
                className={`pb-4 px-2 font-medium transition-colors ${
                  activeTab === 'content'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📄 Contenido
              </button>
              <button
                onClick={() => setActiveTab('seo')}
                className={`pb-4 px-2 font-medium transition-colors ${
                  activeTab === 'seo'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🔍 SEO
              </button>
              <button
                onClick={() => setActiveTab('theme')}
                className={`pb-4 px-2 font-medium transition-colors ${
                  activeTab === 'theme'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
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
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  🚀 Hero Section
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título Principal
                    </label>
                    <input
                      type="text"
                      value={pageData.content.hero.title}
                      onChange={(e) => updateContent('hero.title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Transformamos tu empresa..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtítulo
                    </label>
                    <input
                      type="text"
                      value={pageData.content.hero.subtitle}
                      onChange={(e) => updateContent('hero.subtitle', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Innovamos para que tu empresa..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={pageData.content.hero.description}
                      onChange={(e) => updateContent('hero.description', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={3}
                      placeholder="Transformamos procesos con..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Texto del Botón
                      </label>
                      <input
                        type="text"
                        value={pageData.content.hero.ctaText}
                        onChange={(e) => updateContent('hero.ctaText', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Conoce nuestros servicios"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enlace del Botón
                      </label>
                      <input
                        type="text"
                        value={pageData.content.hero.ctaLink}
                        onChange={(e) => updateContent('hero.ctaLink', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="#servicios"
                      />
                    </div>
                  </div>

                  {/* Imágenes de Fondo del Hero por Tema */}
                  <div className="pt-4 border-t border-gray-200 space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">🖼️ Imágenes de Fondo del Hero</h4>
                    
                    {/* Imagen para Tema Claro */}
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <ImageUploader
                        label="🌞 Imagen para Tema Claro"
                        description="Imagen que se mostrará cuando el sitio esté en modo claro. Tamaño recomendado: 1920x1080px"
                        currentImage={typeof pageData.content.hero.backgroundImage === 'string' 
                          ? pageData.content.hero.backgroundImage 
                          : pageData.content.hero.backgroundImage?.light}
                        onImageUpload={(url) => updateContent('hero.backgroundImage.light', url)}
                      />
                    </div>

                    {/* Imagen para Tema Oscuro */}
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                      <ImageUploader
                        label="🌙 Imagen para Tema Oscuro"
                        description="Imagen que se mostrará cuando el sitio esté en modo oscuro. Tamaño recomendado: 1920x1080px"
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

              {/* Solutions Section */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  💼 Sección Soluciones
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      value={pageData.content.solutions.title}
                      onChange={(e) => updateContent('solutions.title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={pageData.content.solutions.description}
                      onChange={(e) => updateContent('solutions.description', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  {/* Imágenes de Fondo de Soluciones por Tema */}
                  <div className="pt-4 border-t border-gray-200 space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">🖼️ Imágenes de Fondo de Soluciones</h4>
                    
                    {/* Imagen para Tema Claro */}
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <ImageUploader
                        label="🌞 Imagen para Tema Claro"
                        description="Imagen que se mostrará en soluciones cuando el sitio esté en modo claro. Tamaño recomendado: 1920x1080px"
                        currentImage={typeof pageData.content.solutions.backgroundImage === 'string' 
                          ? pageData.content.solutions.backgroundImage 
                          : pageData.content.solutions.backgroundImage?.light}
                        onImageUpload={(url) => updateContent('solutions.backgroundImage.light', url)}
                      />
                    </div>

                    {/* Imagen para Tema Oscuro */}
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                      <ImageUploader
                        label="🌙 Imagen para Tema Oscuro"
                        description="Imagen que se mostrará en soluciones cuando el sitio esté en modo oscuro. Tamaño recomendado: 1920x1080px"
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
          ) : activeTab === 'seo' ? (
            <div className="space-y-6">
              {/* SEO Configuration */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  🔍 Configuración SEO
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title
                      <span className="text-gray-500 text-xs ml-2">
                        ({pageData.seo.metaTitle.length}/60 caracteres)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={pageData.seo.metaTitle}
                      onChange={(e) => updateSeo('metaTitle', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      maxLength={60}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                      <span className="text-gray-500 text-xs ml-2">
                        ({pageData.seo.metaDescription.length}/160 caracteres)
                      </span>
                    </label>
                    <textarea
                      value={pageData.seo.metaDescription}
                      onChange={(e) => updateSeo('metaDescription', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={3}
                      maxLength={160}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keywords (separadas por comas)
                    </label>
                    <input
                      type="text"
                      value={pageData.seo.keywords.join(', ')}
                      onChange={(e) => updateSeo('keywords', e.target.value.split(',').map(k => k.trim()))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="tecnología, software, IA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Open Graph Title
                    </label>
                    <input
                      type="text"
                      value={pageData.seo.ogTitle}
                      onChange={(e) => updateSeo('ogTitle', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Open Graph Description
                    </label>
                    <textarea
                      value={pageData.seo.ogDescription}
                      onChange={(e) => updateSeo('ogDescription', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                      🎨 Configuración de Temas
                    </h2>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Tema por Defecto
                      </label>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => updateThemeDefault('light')}
                          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                            pageData.theme.default === 'light'
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-center">
                            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <p className="font-medium">Claro</p>
                          </div>
                        </button>
                        <button
                          onClick={() => updateThemeDefault('dark')}
                          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                            pageData.theme.default === 'dark'
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-center">
                            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                            <p className="font-medium">Oscuro</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Modo Claro */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      ☀️ Modo Claro
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Color Primario
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="color"
                            value={pageData.theme.lightMode.primary}
                            onChange={(e) => updateTheme('lightMode', 'primary', e.target.value)}
                            className="w-16 h-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={pageData.theme.lightMode.primary}
                            onChange={(e) => updateTheme('lightMode', 'primary', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="#8B5CF6"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Color Secundario
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="color"
                            value={pageData.theme.lightMode.secondary}
                            onChange={(e) => updateTheme('lightMode', 'secondary', e.target.value)}
                            className="w-16 h-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={pageData.theme.lightMode.secondary}
                            onChange={(e) => updateTheme('lightMode', 'secondary', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="#06B6D4"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fondo
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="color"
                            value={pageData.theme.lightMode.background}
                            onChange={(e) => updateTheme('lightMode', 'bg', e.target.value)}
                            className="w-16 h-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={pageData.theme.lightMode.background}
                            onChange={(e) => updateTheme('lightMode', 'bg', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="#FFFFFF"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Texto Principal
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="color"
                            value={pageData.theme.lightMode.text}
                            onChange={(e) => updateTheme('lightMode', 'text', e.target.value)}
                            className="w-16 h-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={pageData.theme.lightMode.text}
                            onChange={(e) => updateTheme('lightMode', 'text', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="#1F2937"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Texto Secundario
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="color"
                            value={pageData.theme.lightMode.textSecondary}
                            onChange={(e) => updateTheme('lightMode', 'textSecondary', e.target.value)}
                            className="w-16 h-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={pageData.theme.lightMode.textSecondary}
                            onChange={(e) => updateTheme('lightMode', 'textSecondary', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="#6B7280"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fondo de Tarjetas
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="color"
                            value={pageData.theme.lightMode.cardBg}
                            onChange={(e) => updateTheme('lightMode', 'cardBg', e.target.value)}
                            className="w-16 h-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={pageData.theme.lightMode.cardBg}
                            onChange={(e) => updateTheme('lightMode', 'cardBg', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="#F9FAFB"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modo Oscuro */}
                  <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      🌙 Modo Oscuro
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Color Primario
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="color"
                            value={pageData.theme.darkMode.primary}
                            onChange={(e) => updateTheme('darkMode', 'primary', e.target.value)}
                            className="w-16 h-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={pageData.theme.darkMode.primary}
                            onChange={(e) => updateTheme('darkMode', 'primary', e.target.value)}
                            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                            placeholder="#A78BFA"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Color Secundario
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="color"
                            value={pageData.theme.darkMode.secondary}
                            onChange={(e) => updateTheme('darkMode', 'secondary', e.target.value)}
                            className="w-16 h-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={pageData.theme.darkMode.secondary}
                            onChange={(e) => updateTheme('darkMode', 'secondary', e.target.value)}
                            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                            placeholder="#22D3EE"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Fondo
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="color"
                            value={pageData.theme.darkMode.background}
                            onChange={(e) => updateTheme('darkMode', 'bg', e.target.value)}
                            className="w-16 h-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={pageData.theme.darkMode.background}
                            onChange={(e) => updateTheme('darkMode', 'bg', e.target.value)}
                            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                            placeholder="#111827"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Texto Principal
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="color"
                            value={pageData.theme.darkMode.text}
                            onChange={(e) => updateTheme('darkMode', 'text', e.target.value)}
                            className="w-16 h-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={pageData.theme.darkMode.text}
                            onChange={(e) => updateTheme('darkMode', 'text', e.target.value)}
                            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                            placeholder="#F9FAFB"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Texto Secundario
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="color"
                            value={pageData.theme.darkMode.textSecondary}
                            onChange={(e) => updateTheme('darkMode', 'textSecondary', e.target.value)}
                            className="w-16 h-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={pageData.theme.darkMode.textSecondary}
                            onChange={(e) => updateTheme('darkMode', 'textSecondary', e.target.value)}
                            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                            placeholder="#D1D5DB"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Fondo de Tarjetas
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="color"
                            value={pageData.theme.darkMode.cardBg}
                            onChange={(e) => updateTheme('darkMode', 'cardBg', e.target.value)}
                            className="w-16 h-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={pageData.theme.darkMode.cardBg}
                            onChange={(e) => updateTheme('darkMode', 'cardBg', e.target.value)}
                            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                            placeholder="#1F2937"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nueva Configuración Avanzada de Botones */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center">
                        🎨 Configuración Avanzada de Botones
                      </h3>
                      <div className="bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-lg">
                        <span className="text-sm font-medium text-purple-700">
                          ⚡ Vista Optimizada
                        </span>
                      </div>
                    </div>
                    
                    {/* Vista Previa en Tiempo Real - Optimizada */}
                    <div className="mb-8">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                        <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                          👁️ Vista Previa en Tiempo Real
                        </h4>
                        <ThemePreviewSwitcher
                          lightMode={pageData.theme?.lightMode || { buttons: {} }}
                          darkMode={pageData.theme?.darkMode || { buttons: {} }}
                        />
                      </div>
                    </div>

                    {/* Configuradores por Modo - Layout Optimizado */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Modo Claro */}
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                        <h4 className="text-lg font-semibold text-gray-700 mb-6 flex items-center">
                          ☀️ Configuración - Modo Claro
                        </h4>
                        <div className="space-y-4">
                          <ButtonConfig
                            buttonType="ctaPrimary"
                            theme={pageData.theme?.lightMode?.buttons?.ctaPrimary || { bg: '', text: '', hover: '' }}
                            mode="lightMode"
                            onUpdate={(property, value) => updateButtonTheme('lightMode', 'ctaPrimary', property, value)}
                            title="Botón Principal de Servicios"
                            icon="🚀"
                          />
                          <ButtonConfig
                            buttonType="contact"
                            theme={pageData.theme?.lightMode?.buttons?.contact || { bg: '', text: '', hover: '', border: '', hoverText: '' }}
                            mode="lightMode"
                            onUpdate={(property, value) => updateButtonTheme('lightMode', 'contact', property, value)}
                            title="Botón de Contacto"
                            icon="📞"
                          />
                          <ButtonConfig
                            buttonType="dashboard"
                            theme={pageData.theme?.lightMode?.buttons?.dashboard || { bg: '', text: '', hover: '' }}
                            mode="lightMode"
                            onUpdate={(property, value) => updateButtonTheme('lightMode', 'dashboard', property, value)}
                            title="Botón Dashboard"
                            icon="🎯"
                          />
                        </div>
                      </div>

                      {/* Modo Oscuro */}
                      <div className="bg-gradient-to-br from-slate-900 to-gray-900 rounded-xl p-6 border border-slate-700">
                        <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
                          🌙 Configuración - Modo Oscuro
                        </h4>
                        <div className="space-y-4">
                          <ButtonConfig
                            buttonType="ctaPrimary"
                            theme={pageData.theme?.darkMode?.buttons?.ctaPrimary || { bg: '', text: '', hover: '' }}
                            mode="darkMode"
                            onUpdate={(property, value) => updateButtonTheme('darkMode', 'ctaPrimary', property, value)}
                            title="Botón Principal de Servicios"
                            icon="🚀"
                          />
                          <ButtonConfig
                            buttonType="contact"
                            theme={pageData.theme?.darkMode?.buttons?.contact || { bg: '', text: '', hover: '', border: '', hoverText: '' }}
                            mode="darkMode"
                            onUpdate={(property, value) => updateButtonTheme('darkMode', 'contact', property, value)}
                            title="Botón de Contacto"
                            icon="📞"
                          />
                          <ButtonConfig
                            buttonType="dashboard"
                            theme={pageData.theme?.darkMode?.buttons?.dashboard || { bg: '', text: '', hover: '' }}
                            mode="darkMode"
                            onUpdate={(property, value) => updateButtonTheme('darkMode', 'dashboard', property, value)}
                            title="Botón Dashboard"
                            icon="🎯"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sección de Ayuda Rápida */}
                    <div className="mt-8 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-xl p-6 border border-blue-200">
                      <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        💡 Consejos de Configuración
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="bg-white/70 rounded-lg p-4 border border-blue-100">
                          <div className="font-medium text-blue-700 mb-2">🎨 Gradientes</div>
                          <p className="text-gray-600">
                            Usa gradientes para fondos y bordes. Ejemplos:<br/>
                            <code className="bg-gray-100 px-1 rounded text-xs">linear-gradient(90deg, #8B5CF6, #06B6D4)</code><br/>
                            <code className="bg-gray-100 px-1 rounded text-xs">linear-gradient(135deg, #EC4899, #F97316)</code>
                          </p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-4 border border-purple-100">
                          <div className="font-medium text-purple-700 mb-2">🌈 Contraste</div>
                          <p className="text-gray-600">
                            Asegúrate de que el contraste entre fondo y texto sea bueno para accesibilidad.
                          </p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-4 border border-pink-100">
                          <div className="font-medium text-pink-700 mb-2">📱 Responsive</div>
                          <p className="text-gray-600">
                            Los botones se adaptan automáticamente a dispositivos móviles y desktop.
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
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={loadPageData}
              className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              disabled={saving}
            >
              🔄 Recargar
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? '💾 Guardando...' : '💾 Guardar Cambios'}
            </button>
          </div>
        </div>
      </DashboardLayout>
    </SignedIn>
  );
}
