/**
 * 🎛️ CONFIGURACIÓN CMS PARA PÁGINA DE DETALLE DE SERVICIO
 * Panel de configuración para personalizar la página ServicioDetail
 * 
 * Permite configurar:
 * - Apariencia del acordeón
 * - Paneles visibles por defecto
 * - Colores y estilos
 * - Comportamiento del Hero
 */

import React, { useState } from 'react';
import ImageSelectorModal from '../ImageSelectorModal';
import { ThemeStylePanel } from './shared/ThemeStylePanel';
import { CardStylePanel } from './shared/CardStylePanel';

interface AccordionPanelConfig {
  id: string;
  label: string;
  icon: string;
  enabled: boolean;
  description: string;
}

interface AccordionStyleConfig {
  light: {
    panelBackground: string;
    panelBorder: string;
    headerBackground: string;
    headerText: string;
    headerIcon: string;
    contentBackground: string;
    contentText: string;
    accentGradientFrom: string;
    accentGradientTo: string;
  };
  dark: {
    panelBackground: string;
    panelBorder: string;
    headerBackground: string;
    headerText: string;
    headerIcon: string;
    contentBackground: string;
    contentText: string;
    accentGradientFrom: string;
    accentGradientTo: string;
  };
  typography?: {
    fontFamily: string;
    headerFontSize: string;
    headerFontWeight: string;
    contentFontSize: string;
    contentLineHeight: string;
  };
  // Configuración de tarjetas de contenido (beneficios, características, FAQ, etc.)
  contentCards?: {
    light: {
      background: string;
      borderColor: string;
      borderWidth?: string;
      textColor: string;
      borderRadius: string;
      iconBackground: string;
      iconColor: string;
      iconBackgroundType?: 'solid' | 'gradient';
      iconGradientFrom?: string;
      iconGradientTo?: string;
      iconGradientDirection?: string;
    };
    dark: {
      background: string;
      borderColor: string;
      borderWidth?: string;
      textColor: string;
      borderRadius: string;
      iconBackground: string;
      iconColor: string;
      iconBackgroundType?: 'solid' | 'gradient';
      iconGradientFrom?: string;
      iconGradientTo?: string;
      iconGradientDirection?: string;
    };
  };
}

interface BackgroundConfig {
  type: 'none' | 'color' | 'gradient' | 'image';
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
  imageUrl?: string; // Para compatibilidad
  imageLight?: string; // Imagen tema claro
  imageDark?: string;  // Imagen tema oscuro
  overlayOpacity?: number;
  overlayColor?: string;
}

interface HeroContentConfig {
  titleGradient?: {
    enabled: boolean;
    light?: { from: string; to: string; };
    dark?: { from: string; to: string; };
  };
  showCategoryTag?: boolean;
  showPrice?: boolean;
}

interface CardStyleConfig {
  light: {
    background: string;
    borderColor: string;
    textColor: string;
    labelColor: string;
  };
  dark: {
    background: string;
    borderColor: string;
    textColor: string;
    labelColor: string;
  };
}

interface ButtonConfig {
  enabled: boolean;
  text: string;
  style: 'solid' | 'outline' | 'gradient';
  light?: {
    gradient?: { from: string; to: string; };
    solidColor?: string;
    textColor?: string;
    borderColor?: string;
  };
  dark?: {
    gradient?: { from: string; to: string; };
    solidColor?: string;
    textColor?: string;
    borderColor?: string;
  };
}

interface ServicioDetailConfig {
  // Hero Section
  hero?: {
    showBreadcrumb: boolean;
    showBackButton: boolean;
    overlayOpacity: number;
    gradientColor: string;
    background?: BackgroundConfig;
    content?: HeroContentConfig;
    cards?: CardStyleConfig;
    buttons?: {
      primary?: ButtonConfig;
      secondary?: ButtonConfig;
    };
  };
  // Accordion Config
  accordion?: {
    defaultOpenPanel: string;
    expandMultiple: boolean;
    animationDuration: number;
    showPanelDescription: boolean;
    panels: AccordionPanelConfig[];
    background?: BackgroundConfig;
    styles?: AccordionStyleConfig;
  };
  // Sidebar Config
  sidebar?: {
    showRelatedServices: boolean;
    showCategoryTag: boolean;
    showPriceRange: boolean;
    showContactButton: boolean;
  };
  // Design Config
  design?: {
    panelBorderRadius: string;
    panelShadow: boolean;
    headerStyle: 'minimal' | 'card' | 'gradient';
    accentColor: string;
    contentPadding: string;
  };
  // CTA Section
  cta?: {
    background?: BackgroundConfig;
  };
}

interface Props {
  config: ServicioDetailConfig;
  onChange: (config: ServicioDetailConfig) => void;
}

const DEFAULT_PANELS: AccordionPanelConfig[] = [
  { id: 'descripcion', label: 'Descripción', icon: '📋', enabled: true, description: 'Información general del servicio' },
  { id: 'caracteristicas', label: 'Características', icon: '✨', enabled: true, description: 'Qué ofrece este servicio' },
  { id: 'beneficios', label: 'Beneficios', icon: '🎯', enabled: true, description: 'Ventajas para tu negocio' },
  { id: 'incluye', label: 'Qué Incluye', icon: '✅', enabled: true, description: 'Detalle de inclusiones' },
  { id: 'info', label: 'Información Adicional', icon: '💡', enabled: true, description: 'Detalles extras' },
  { id: 'faq', label: 'Preguntas Frecuentes', icon: '❓', enabled: true, description: 'Dudas comunes' },
  { id: 'multimedia', label: 'Multimedia', icon: '🎥', enabled: true, description: 'Videos y galería' },
];

const DEFAULT_BACKGROUND: BackgroundConfig = {
  type: 'gradient',
  gradientFrom: '#f3f4f6',
  gradientTo: '#e5e7eb',
  overlayOpacity: 0,
  overlayColor: '#000000',
};

const DEFAULT_CONFIG: ServicioDetailConfig = {
  hero: {
    showBreadcrumb: true,
    showBackButton: true,
    overlayOpacity: 50,
    gradientColor: 'from-gray-900/80',
    background: { ...DEFAULT_BACKGROUND, type: 'gradient', gradientFrom: '#f9fafb', gradientTo: '#ede9fe' },
    content: {
      titleGradient: {
        enabled: false,
        light: { from: '#8b5cf6', to: '#06b6d4' },
        dark: { from: '#a78bfa', to: '#22d3ee' },
      },
      showCategoryTag: true,
      showPrice: true,
    },
    cards: {
      light: {
        background: 'rgba(255, 255, 255, 0.8)',
        borderColor: '#d1d5db',
        textColor: '#111827',
        labelColor: '#6b7280',
      },
      dark: {
        background: 'rgba(31, 41, 55, 0.5)',
        borderColor: '#374151',
        textColor: '#ffffff',
        labelColor: '#9ca3af',
      },
    },
    buttons: {
      primary: {
        enabled: true,
        text: 'Solicitar Cotización',
        style: 'gradient',
        light: {
          gradient: { from: '#8b5cf6', to: '#06b6d4' },
          solidColor: '#8b5cf6',
          textColor: '#ffffff',
          borderColor: '#8b5cf6',
        },
        dark: {
          gradient: { from: '#a78bfa', to: '#22d3ee' },
          solidColor: '#a78bfa',
          textColor: '#111827',
          borderColor: '#a78bfa',
        },
      },
      secondary: {
        enabled: true,
        text: 'Volver',
        style: 'outline',
        light: {
          gradient: { from: '#8b5cf6', to: '#06b6d4' },
          solidColor: 'transparent',
          textColor: '#8b5cf6',
          borderColor: '#8b5cf6',
        },
        dark: {
          gradient: { from: '#a78bfa', to: '#22d3ee' },
          solidColor: 'transparent',
          textColor: '#a78bfa',
          borderColor: '#a78bfa',
        },
      },
    },
  },
  accordion: {
    defaultOpenPanel: 'descripcion',
    expandMultiple: false,
    animationDuration: 300,
    showPanelDescription: false,
    panels: DEFAULT_PANELS,
    background: { ...DEFAULT_BACKGROUND, type: 'gradient', gradientFrom: '#f9fafb', gradientTo: '#ffffff' },
    styles: {
      light: {
        panelBackground: 'rgba(255, 255, 255, 0.6)',
        panelBorder: '#e5e7eb',
        headerBackground: 'transparent',
        headerText: '#111827',
        headerIcon: '#8b5cf6',
        contentBackground: 'rgba(255, 255, 255, 0.5)',
        contentText: '#374151',
        accentGradientFrom: '#8b5cf6',
        accentGradientTo: '#06b6d4',
      },
      dark: {
        panelBackground: 'rgba(31, 41, 55, 0.4)',
        panelBorder: '#374151',
        headerBackground: 'transparent',
        headerText: '#ffffff',
        headerIcon: '#a78bfa',
        contentBackground: 'rgba(17, 24, 39, 0.3)',
        contentText: '#d1d5db',
        accentGradientFrom: '#a78bfa',
        accentGradientTo: '#22d3ee',
      },
      typography: {
        fontFamily: 'Montserrat, sans-serif',
        headerFontSize: '1.125rem',
        headerFontWeight: '600',
        contentFontSize: '1rem',
        contentLineHeight: '1.75'
      },
      contentCards: {
        light: {
          background: 'rgba(0, 0, 0, 0.05)',
          borderColor: 'transparent',
          borderWidth: '0',
          textColor: '#374151',
          borderRadius: '0.5rem',
          iconBackground: 'linear-gradient(to bottom right, #8b5cf6, #06b6d4)',
          iconColor: '#ffffff',
          iconBackgroundType: 'gradient',
          iconGradientFrom: '#8b5cf6',
          iconGradientTo: '#06b6d4',
          iconGradientDirection: 'to bottom right',
        },
        dark: {
          background: 'rgba(255, 255, 255, 0.05)',
          borderColor: 'transparent',
          borderWidth: '0',
          textColor: '#d1d5db',
          borderRadius: '0.5rem',
          iconBackground: 'linear-gradient(to bottom right, #a78bfa, #22d3ee)',
          iconColor: '#ffffff',
          iconBackgroundType: 'gradient',
          iconGradientFrom: '#a78bfa',
          iconGradientTo: '#22d3ee',
          iconGradientDirection: 'to bottom right',
        },
      },
    },
  },
  sidebar: {
    showRelatedServices: true,
    showCategoryTag: true,
    showPriceRange: true,
    showContactButton: true,
  },
  design: {
    panelBorderRadius: 'rounded-xl',
    panelShadow: true,
    headerStyle: 'minimal',
    accentColor: '#7c3aed',
    contentPadding: 'p-6',
  },
  cta: {
    background: { ...DEFAULT_BACKGROUND, type: 'gradient', gradientFrom: '#9333ea', gradientTo: '#2563eb' },
  },
};

const ServicioDetailConfigSection: React.FC<Props> = ({ config, onChange }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('accordion');

  // Merge config con defaults
  const mergedConfig: ServicioDetailConfig = {
    hero: { 
      showBreadcrumb: config.hero?.showBreadcrumb ?? DEFAULT_CONFIG.hero!.showBreadcrumb,
      showBackButton: config.hero?.showBackButton ?? DEFAULT_CONFIG.hero!.showBackButton,
      overlayOpacity: config.hero?.overlayOpacity ?? DEFAULT_CONFIG.hero!.overlayOpacity,
      gradientColor: config.hero?.gradientColor ?? DEFAULT_CONFIG.hero!.gradientColor,
      background: config.hero?.background || DEFAULT_CONFIG.hero!.background,
      content: {
        titleGradient: config.hero?.content?.titleGradient || DEFAULT_CONFIG.hero!.content!.titleGradient,
        showCategoryTag: config.hero?.content?.showCategoryTag ?? DEFAULT_CONFIG.hero!.content!.showCategoryTag,
        showPrice: config.hero?.content?.showPrice ?? DEFAULT_CONFIG.hero!.content!.showPrice,
      },
      cards: config.hero?.cards || DEFAULT_CONFIG.hero!.cards,
      buttons: {
        primary: config.hero?.buttons?.primary || DEFAULT_CONFIG.hero!.buttons!.primary,
        secondary: config.hero?.buttons?.secondary || DEFAULT_CONFIG.hero!.buttons!.secondary,
      },
    },
    accordion: { 
      defaultOpenPanel: config.accordion?.defaultOpenPanel ?? DEFAULT_CONFIG.accordion!.defaultOpenPanel,
      expandMultiple: config.accordion?.expandMultiple ?? DEFAULT_CONFIG.accordion!.expandMultiple,
      animationDuration: config.accordion?.animationDuration ?? DEFAULT_CONFIG.accordion!.animationDuration,
      showPanelDescription: config.accordion?.showPanelDescription ?? DEFAULT_CONFIG.accordion!.showPanelDescription,
      panels: config.accordion?.panels || DEFAULT_PANELS,
      background: config.accordion?.background || DEFAULT_CONFIG.accordion!.background,
      styles: {
        light: config.accordion?.styles?.light || DEFAULT_CONFIG.accordion!.styles!.light,
        dark: config.accordion?.styles?.dark || DEFAULT_CONFIG.accordion!.styles!.dark,
        typography: config.accordion?.styles?.typography || DEFAULT_CONFIG.accordion!.styles!.typography,
        contentCards: config.accordion?.styles?.contentCards || DEFAULT_CONFIG.accordion!.styles!.contentCards,
      },
    },
    sidebar: { 
      showRelatedServices: config.sidebar?.showRelatedServices ?? DEFAULT_CONFIG.sidebar!.showRelatedServices,
      showCategoryTag: config.sidebar?.showCategoryTag ?? DEFAULT_CONFIG.sidebar!.showCategoryTag,
      showPriceRange: config.sidebar?.showPriceRange ?? DEFAULT_CONFIG.sidebar!.showPriceRange,
      showContactButton: config.sidebar?.showContactButton ?? DEFAULT_CONFIG.sidebar!.showContactButton,
    },
    design: { 
      panelBorderRadius: config.design?.panelBorderRadius ?? DEFAULT_CONFIG.design!.panelBorderRadius,
      panelShadow: config.design?.panelShadow ?? DEFAULT_CONFIG.design!.panelShadow,
      headerStyle: config.design?.headerStyle ?? DEFAULT_CONFIG.design!.headerStyle,
      accentColor: config.design?.accentColor ?? DEFAULT_CONFIG.design!.accentColor,
      contentPadding: config.design?.contentPadding ?? DEFAULT_CONFIG.design!.contentPadding,
    },
    cta: {
      background: config.cta?.background || DEFAULT_CONFIG.cta!.background,
    },
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const updateHero = (field: keyof NonNullable<ServicioDetailConfig['hero']>, value: any) => {
    onChange({
      ...mergedConfig,
      hero: { ...mergedConfig.hero!, [field]: value },
    });
  };

  const updateHeroContent = (field: keyof HeroContentConfig, value: any) => {
    onChange({
      ...mergedConfig,
      hero: {
        ...mergedConfig.hero!,
        content: { ...mergedConfig.hero!.content!, [field]: value },
      },
    });
  };

  const updateHeroButton = (buttonType: 'primary' | 'secondary', field: keyof ButtonConfig, value: any) => {
    onChange({
      ...mergedConfig,
      hero: {
        ...mergedConfig.hero!,
        buttons: {
          ...mergedConfig.hero!.buttons!,
          [buttonType]: { ...mergedConfig.hero!.buttons![buttonType]!, [field]: value },
        },
      },
    });
  };

  const updateHeroButtonTheme = (
    buttonType: 'primary' | 'secondary',
    theme: 'light' | 'dark',
    field: string,
    value: any
  ) => {
    onChange({
      ...mergedConfig,
      hero: {
        ...mergedConfig.hero!,
        buttons: {
          ...mergedConfig.hero!.buttons!,
          [buttonType]: {
            ...mergedConfig.hero!.buttons![buttonType]!,
            [theme]: {
              ...mergedConfig.hero!.buttons![buttonType]![theme]!,
              [field]: value,
            },
          },
        },
      },
    });
  };

  const updateHeroCards = (theme: 'light' | 'dark', field: string, value: any) => {
    onChange({
      ...mergedConfig,
      hero: {
        ...mergedConfig.hero!,
        cards: {
          ...mergedConfig.hero!.cards!,
          [theme]: { ...mergedConfig.hero!.cards![theme], [field]: value },
        },
      },
    });
  };

  const updateAccordion = (field: keyof NonNullable<ServicioDetailConfig['accordion']>, value: any) => {
    onChange({
      ...mergedConfig,
      accordion: { ...mergedConfig.accordion!, [field]: value },
    });
  };

  const updateAccordionStyle = (theme: 'light' | 'dark', field: string, value: any) => {
    onChange({
      ...mergedConfig,
      accordion: {
        ...mergedConfig.accordion!,
        styles: {
          ...mergedConfig.accordion!.styles!,
          [theme]: {
            ...mergedConfig.accordion!.styles![theme]!,
            [field]: value,
          },
        },
      },
    });
  };

  const updateAccordionTypography = (field: string, value: any) => {
    onChange({
      ...mergedConfig,
      accordion: {
        ...mergedConfig.accordion!,
        styles: {
          ...mergedConfig.accordion!.styles!,
          typography: {
            ...mergedConfig.accordion!.styles!.typography!,
            [field]: value,
          },
        },
      },
    });
  };

  // Actualizar estilos de tarjetas de contenido (beneficios, características, FAQ, etc.)
  const updateAccordionContentCards = (theme: 'light' | 'dark', field: string, value: any) => {
    // Valores por defecto para contentCards
    const defaultContentCards = {
      light: {
        background: 'rgba(0, 0, 0, 0.05)',
        borderColor: 'transparent',
        borderWidth: '0',
        textColor: '#374151',
        borderRadius: '0.5rem',
        iconBackground: 'linear-gradient(to bottom right, #8b5cf6, #06b6d4)',
        iconColor: '#ffffff',
        iconBackgroundType: 'gradient' as const,
        iconGradientFrom: '#8b5cf6',
        iconGradientTo: '#06b6d4',
        iconGradientDirection: 'to bottom right',
      },
      dark: {
        background: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'transparent',
        borderWidth: '0',
        textColor: '#d1d5db',
        borderRadius: '0.5rem',
        iconBackground: 'linear-gradient(to bottom right, #a78bfa, #22d3ee)',
        iconColor: '#ffffff',
        iconBackgroundType: 'gradient' as const,
        iconGradientFrom: '#a78bfa',
        iconGradientTo: '#22d3ee',
        iconGradientDirection: 'to bottom right',
      },
    };

    const currentContentCards = mergedConfig.accordion?.styles?.contentCards || defaultContentCards;
    
    onChange({
      ...mergedConfig,
      accordion: {
        ...mergedConfig.accordion!,
        styles: {
          ...mergedConfig.accordion!.styles!,
          contentCards: {
            ...currentContentCards,
            [theme]: {
              ...currentContentCards[theme],
              [field]: value,
            },
          },
        },
      },
    });
  };

  const updateSidebar = (field: keyof NonNullable<ServicioDetailConfig['sidebar']>, value: any) => {
    onChange({
      ...mergedConfig,
      sidebar: { ...mergedConfig.sidebar!, [field]: value },
    });
  };

  const updateDesign = (field: keyof NonNullable<ServicioDetailConfig['design']>, value: any) => {
    onChange({
      ...mergedConfig,
      design: { ...mergedConfig.design!, [field]: value },
    });
  };

  const updateHeroBackground = (field: keyof BackgroundConfig, value: any) => {
    console.log(`🎨 [CMS] Actualizando Hero Background - ${field}:`, value);
    const updatedConfig = {
      ...mergedConfig,
      hero: {
        ...mergedConfig.hero!,
        background: { ...mergedConfig.hero!.background!, [field]: value },
      },
    };
    console.log('📦 [CMS] Hero background completo:', updatedConfig.hero.background);
    onChange(updatedConfig);
  };

  const batchUpdateHeroBackground = (updates: Partial<BackgroundConfig>) => {
    console.log('🎨 [CMS] Batch update Hero Background:', updates);
    const updatedConfig = {
      ...mergedConfig,
      hero: {
        ...mergedConfig.hero!,
        background: { ...mergedConfig.hero!.background!, ...updates },
      },
    };
    console.log('📦 [CMS] Hero background completo:', updatedConfig.hero.background);
    onChange(updatedConfig);
  };

  const updateAccordionBackground = (field: keyof BackgroundConfig, value: any) => {
    console.log(`🎨 [CMS] Actualizando Accordion Background - ${field}:`, value);
    const updatedConfig = {
      ...mergedConfig,
      accordion: {
        ...mergedConfig.accordion!,
        background: { ...mergedConfig.accordion!.background!, [field]: value },
      },
    };
    console.log('📦 [CMS] Accordion background completo:', updatedConfig.accordion.background);
    onChange(updatedConfig);
  };

  const batchUpdateAccordionBackground = (updates: Partial<BackgroundConfig>) => {
    console.log('🎨 [CMS] Batch update Accordion Background:', updates);
    const updatedConfig = {
      ...mergedConfig,
      accordion: {
        ...mergedConfig.accordion!,
        background: { ...mergedConfig.accordion!.background!, ...updates },
      },
    };
    console.log('📦 [CMS] Accordion background completo:', updatedConfig.accordion.background);
    onChange(updatedConfig);
  };

  const updateCtaBackground = (field: keyof BackgroundConfig, value: any) => {
    console.log(`🎨 [CMS] Actualizando CTA Background - ${field}:`, value);
    const updatedConfig = {
      ...mergedConfig,
      cta: {
        ...mergedConfig.cta!,
        background: { ...mergedConfig.cta!.background!, [field]: value },
      },
    };
    console.log('📦 [CMS] CTA background completo:', updatedConfig.cta.background);
    onChange(updatedConfig);
  };

  const batchUpdateCtaBackground = (updates: Partial<BackgroundConfig>) => {
    console.log('🎨 [CMS] Batch update CTA Background:', updates);
    const updatedConfig = {
      ...mergedConfig,
      cta: {
        ...mergedConfig.cta!,
        background: { ...mergedConfig.cta!.background!, ...updates },
      },
    };
    console.log('📦 [CMS] CTA background completo:', updatedConfig.cta.background);
    onChange(updatedConfig);
  };

  const togglePanelEnabled = (panelId: string) => {
    const updatedPanels = mergedConfig.accordion!.panels.map(panel =>
      panel.id === panelId ? { ...panel, enabled: !panel.enabled } : panel
    );
    updateAccordion('panels', updatedPanels);
  };

  const movePanelUp = (index: number) => {
    if (index <= 0) return;
    const panels = [...mergedConfig.accordion!.panels];
    [panels[index - 1], panels[index]] = [panels[index], panels[index - 1]];
    updateAccordion('panels', panels);
  };

  const movePanelDown = (index: number) => {
    const panels = [...mergedConfig.accordion!.panels];
    if (index >= panels.length - 1) return;
    [panels[index], panels[index + 1]] = [panels[index + 1], panels[index]];
    updateAccordion('panels', panels);
  };

  const SectionHeader: React.FC<{ 
    id: string; 
    icon: string; 
    title: string; 
    description: string 
  }> = ({ id, icon, title, description }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-lg"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="text-left">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <span className={`text-xl transition-transform duration-200 ${expandedSection === id ? 'rotate-180' : ''}`}>
        ▼
      </span>
    </button>
  );

  // Componente para configurar fondos
  const BackgroundEditor: React.FC<{ 
    background: BackgroundConfig; 
    onUpdate: (field: keyof BackgroundConfig, value: any) => void;
    onBatchUpdate?: (updates: Partial<BackgroundConfig>) => void;
    label?: string;
  }> = ({ background, onUpdate, onBatchUpdate, label = 'Fondo de sección' }) => {
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imageModalTheme, setImageModalTheme] = useState<'light' | 'dark'>('light');

    const handleImageSelect = (imageUrl: string) => {
      console.log(`🖼️ [CMS] Imagen seleccionada para tema ${imageModalTheme}:`, imageUrl);
      
      // Crear objeto con las actualizaciones necesarias
      const updates: Partial<BackgroundConfig> = {
        type: 'image' as const
      };
      
      if (imageModalTheme === 'light') {
        updates.imageLight = imageUrl;
        console.log('✅ [CMS] imageLight actualizado');
      } else {
        updates.imageDark = imageUrl;
        console.log('✅ [CMS] imageDark actualizado');
      }
      
      // Si hay onBatchUpdate, usarlo para actualizar todo de una vez
      if (onBatchUpdate) {
        console.log('📦 [CMS] Actualizando en batch:', updates);
        onBatchUpdate(updates);
      } else {
        // Fallback: actualizar campo por campo (menos eficiente)
        if (imageModalTheme === 'light') {
          onUpdate('imageLight', imageUrl);
        } else {
          onUpdate('imageDark', imageUrl);
        }
        if (background.type !== 'image') {
          onUpdate('type', 'image');
        }
      }
    };

    const handleRemoveImage = (theme: 'light' | 'dark') => {
      if (theme === 'light') {
        onUpdate('imageLight', '');
      } else {
        onUpdate('imageDark', '');
      }
      // Si ambas imágenes están vacías, cambiar tipo a 'none'
      if (!background.imageLight && !background.imageDark) {
        onUpdate('type', 'none');
      }
    };

    return (
    <>
    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
      <h5 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <span>🎨</span> {label}
      </h5>

      {/* Tipo de fondo */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tipo de fondo
        </label>
        <select
          value={background.type}
          onChange={(e) => onUpdate('type', e.target.value)}
          className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500"
        >
          <option value="none">Sin fondo</option>
          <option value="color">Color sólido</option>
          <option value="gradient">Gradiente</option>
          <option value="image">Imagen</option>
        </select>
      </div>

      {/* Color sólido */}
      {background.type === 'color' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Color de fondo
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={background.color || '#ffffff'}
              onChange={(e) => onUpdate('color', e.target.value)}
              className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
            <input
              type="text"
              value={background.color || '#ffffff'}
              onChange={(e) => onUpdate('color', e.target.value)}
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200"
              placeholder="#ffffff"
            />
          </div>
        </div>
      )}

      {/* Gradiente */}
      {background.type === 'gradient' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Color inicial
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={background.gradientFrom || '#f3f4f6'}
                onChange={(e) => onUpdate('gradientFrom', e.target.value)}
                className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={background.gradientFrom || '#f3f4f6'}
                onChange={(e) => onUpdate('gradientFrom', e.target.value)}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm"
                placeholder="#f3f4f6"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Color final
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={background.gradientTo || '#e5e7eb'}
                onChange={(e) => onUpdate('gradientTo', e.target.value)}
                className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={background.gradientTo || '#e5e7eb'}
                onChange={(e) => onUpdate('gradientTo', e.target.value)}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm"
                placeholder="#e5e7eb"
              />
            </div>
          </div>
        </div>
      )}

      {/* Imagen */}
      {background.type === 'image' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            ℹ️ Configura imágenes diferentes para tema claro y oscuro
          </p>

          {/* Imagen para tema CLARO */}
          <div className="space-y-3 p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span>☀️</span> Imagen para tema claro
              </label>
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setImageModalTheme('light'); setIsImageModalOpen(true); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-yellow-300 dark:border-yellow-600 hover:border-yellow-500 dark:hover:border-yellow-400 bg-yellow-50/50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-all"
              >
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  {background.imageLight ? '📷 Cambiar' : '🖼️ Seleccionar'}
                </span>
              </button>
              {background.imageLight && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage('light')}
                  className="px-4 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

            {background.imageLight && (
              <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                <img src={background.imageLight} alt="Fondo tema claro" className="w-full h-32 object-cover" />
                <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded truncate">
                  {background.imageLight}
                </div>
              </div>
            )}
          </div>

          {/* Imagen para tema OSCURO */}
          <div className="space-y-3 p-4 bg-gray-900/5 dark:bg-gray-700/50 rounded-lg border-2 border-gray-300 dark:border-gray-500">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span>🌙</span> Imagen para tema oscuro
              </label>
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setImageModalTheme('dark'); setIsImageModalOpen(true); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-purple-300 dark:border-purple-600 hover:border-purple-500 dark:hover:border-purple-400 bg-purple-50/50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all"
              >
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  {background.imageDark ? '📷 Cambiar' : '🖼️ Seleccionar'}
                </span>
              </button>
              {background.imageDark && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage('dark')}
                  className="px-4 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

            {background.imageDark && (
              <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                <img src={background.imageDark} alt="Fondo tema oscuro" className="w-full h-32 object-cover" />
                <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded truncate">
                  {background.imageDark}
                </div>
              </div>
            )}
          </div>

          {/* URL Manual (opcional) - Removido para simplificar */}
          <div className="hidden space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              O ingresa URL manualmente
            </label>
            <input
              type="text"
              value={''}
              onChange={(e) => onUpdate('imageUrl', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 text-sm"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
        </div>
      )}

      {/* Overlay (para imagen o gradiente) */}
      {(background.type === 'image' || background.type === 'gradient') && (
        <>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Color del overlay
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={background.overlayColor || '#000000'}
                onChange={(e) => onUpdate('overlayColor', e.target.value)}
                className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={background.overlayColor || '#000000'}
                onChange={(e) => onUpdate('overlayColor', e.target.value)}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200"
                placeholder="#000000"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Opacidad del overlay ({background.overlayOpacity || 0}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={background.overlayOpacity || 0}
              onChange={(e) => onUpdate('overlayOpacity', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Transparente (0%)</span>
              <span>Opaco (100%)</span>
            </div>
          </div>
        </>
      )}

      {/* Preview */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Vista previa
        </label>
        <div
          className="h-20 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 relative overflow-hidden"
          style={{
            backgroundColor: background.type === 'color' ? background.color : 'transparent',
            backgroundImage: 
              background.type === 'gradient' 
                ? `linear-gradient(to right, ${background.gradientFrom}, ${background.gradientTo})`
                : background.type === 'image' && background.imageUrl
                ? `url(${background.imageUrl})`
                : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {(background.type === 'image' || background.type === 'gradient') && (
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: background.overlayColor || '#000000',
                opacity: (background.overlayOpacity || 0) / 100,
              }}
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-sm font-medium drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              Contenido aquí
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Modal de selección de imágenes */}
    <ImageSelectorModal
      isOpen={isImageModalOpen}
      onClose={() => setIsImageModalOpen(false)}
      onSelect={handleImageSelect}
      currentImage={background.imageUrl}
      title={`Seleccionar imagen para ${label}`}
    />
    </>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 border border-violet-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📄</span>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Configuración de Página de Detalle de Servicio
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Personaliza la apariencia y comportamiento de la página de detalles de cada servicio
            </p>
          </div>
        </div>
      </div>

      {/* 🖼️ Hero Section Config */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <SectionHeader
          id="hero"
          icon="🖼️"
          title="Hero Section"
          description="Configuración del encabezado de la página"
        />
        {expandedSection === 'hero' && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={mergedConfig.hero?.showBreadcrumb ?? true}
                  onChange={(e) => updateHero('showBreadcrumb', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200">Mostrar Breadcrumb</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Navegación: Home &gt; Servicios &gt; ...</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={mergedConfig.hero?.showBackButton ?? true}
                  onChange={(e) => updateHero('showBackButton', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200">Botón Volver</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mostrar botón para regresar</p>
                </div>
              </label>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Opacidad del Overlay ({mergedConfig.hero?.overlayOpacity}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={mergedConfig.hero?.overlayOpacity ?? 50}
                onChange={(e) => updateHero('overlayOpacity', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Transparente</span>
                <span>Oscuro</span>
              </div>
            </div>

            {/* 📝 Contenido del Hero */}
            <div className="space-y-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-700/30 dark:to-gray-600/30 rounded-lg border border-purple-200 dark:border-purple-700">
            {/* 📝 Contenido del Hero */}
            <div className="space-y-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-700/30 dark:to-gray-600/30 rounded-lg border border-purple-200 dark:border-purple-700">
              <h5 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span>📝</span> Estilos del Contenido Hero
                <span className="text-xs text-gray-500 ml-2">(El contenido viene del servicio)</span>
              </h5>

              {/* Gradiente del título */}
              <div className="space-y-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={mergedConfig.hero?.content?.titleGradient?.enabled ?? false}
                    onChange={(e) => updateHeroContent('titleGradient', {
                      ...mergedConfig.hero?.content?.titleGradient,
                      enabled: e.target.checked
                    })}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Aplicar gradiente al título del servicio
                  </span>
                </label>

                {mergedConfig.hero?.content?.titleGradient?.enabled && (
                  <div className="space-y-4 pl-6">
                    {/* Tema Claro */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">☀️ Tema Claro</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Color Inicio
                          </label>
                          <input
                            type="color"
                            value={mergedConfig.hero?.content?.titleGradient?.light?.from ?? '#8b5cf6'}
                            onChange={(e) => updateHeroContent('titleGradient', {
                              ...mergedConfig.hero?.content?.titleGradient,
                              light: { ...mergedConfig.hero?.content?.titleGradient?.light!, from: e.target.value }
                            })}
                            className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Color Final
                          </label>
                          <input
                            type="color"
                            value={mergedConfig.hero?.content?.titleGradient?.light?.to ?? '#06b6d4'}
                            onChange={(e) => updateHeroContent('titleGradient', {
                              ...mergedConfig.hero?.content?.titleGradient,
                              light: { ...mergedConfig.hero?.content?.titleGradient?.light!, to: e.target.value }
                            })}
                            className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                        </div>
                        <div className="col-span-2 p-3 rounded bg-white border border-gray-200">
                          <p
                            className="text-2xl font-bold text-center"
                            style={{
                              backgroundImage: `linear-gradient(to right, ${mergedConfig.hero?.content?.titleGradient?.light?.from ?? '#8b5cf6'}, ${mergedConfig.hero?.content?.titleGradient?.light?.to ?? '#06b6d4'})`,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                            }}
                          >
                            Ejemplo Claro
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tema Oscuro */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">🌙 Tema Oscuro</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Color Inicio
                          </label>
                          <input
                            type="color"
                            value={mergedConfig.hero?.content?.titleGradient?.dark?.from ?? '#a78bfa'}
                            onChange={(e) => updateHeroContent('titleGradient', {
                              ...mergedConfig.hero?.content?.titleGradient,
                              dark: { ...mergedConfig.hero?.content?.titleGradient?.dark!, from: e.target.value }
                            })}
                            className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Color Final
                          </label>
                          <input
                            type="color"
                            value={mergedConfig.hero?.content?.titleGradient?.dark?.to ?? '#22d3ee'}
                            onChange={(e) => updateHeroContent('titleGradient', {
                              ...mergedConfig.hero?.content?.titleGradient,
                              dark: { ...mergedConfig.hero?.content?.titleGradient?.dark!, to: e.target.value }
                            })}
                            className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                        </div>
                        <div className="col-span-2 p-3 rounded bg-gray-900">
                          <p
                            className="text-2xl font-bold text-center"
                            style={{
                              backgroundImage: `linear-gradient(to right, ${mergedConfig.hero?.content?.titleGradient?.dark?.from ?? '#a78bfa'}, ${mergedConfig.hero?.content?.titleGradient?.dark?.to ?? '#22d3ee'})`,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                            }}
                          >
                            Ejemplo Oscuro
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Opciones de visualización */}
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={mergedConfig.hero?.content?.showCategoryTag ?? true}
                    onChange={(e) => updateHeroContent('showCategoryTag', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Mostrar categoría</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={mergedConfig.hero?.content?.showPrice ?? true}
                    onChange={(e) => updateHeroContent('showPrice', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Mostrar precio</span>
                </label>
              </div>
            </div>

            {/* 💳 Configuración de Tarjetas de Precio/Duración */}
            <div className="space-y-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700/30 dark:to-gray-600/30 rounded-lg border border-green-200 dark:border-green-700">
              <h5 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span>💳</span> Estilos de Tarjetas (Precio/Duración)
              </h5>

              {/* Tema Claro */}
              <div className="space-y-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  ☀️ Tema Claro
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Color de fondo
                    </label>
                    <input
                      type="text"
                      value={mergedConfig.hero?.cards?.light.background ?? 'rgba(255, 255, 255, 0.8)'}
                      onChange={(e) => updateHeroCards('light', 'background', e.target.value)}
                      placeholder="rgba(255, 255, 255, 0.8)"
                      className="w-full px-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Color de borde
                    </label>
                    <input
                      type="color"
                      value={mergedConfig.hero?.cards?.light.borderColor ?? '#d1d5db'}
                      onChange={(e) => updateHeroCards('light', 'borderColor', e.target.value)}
                      className="w-full h-9 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Color de texto
                    </label>
                    <input
                      type="color"
                      value={mergedConfig.hero?.cards?.light.textColor ?? '#111827'}
                      onChange={(e) => updateHeroCards('light', 'textColor', e.target.value)}
                      className="w-full h-9 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Color de etiqueta
                    </label>
                    <input
                      type="color"
                      value={mergedConfig.hero?.cards?.light.labelColor ?? '#6b7280'}
                      onChange={(e) => updateHeroCards('light', 'labelColor', e.target.value)}
                      className="w-full h-9 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                  </div>
                </div>
                {/* Vista previa tema claro */}
                <div className="pt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa:</p>
                  <div
                    className="rounded-lg px-4 py-3 border"
                    style={{
                      background: mergedConfig.hero?.cards?.light.background,
                      borderColor: mergedConfig.hero?.cards?.light.borderColor,
                    }}
                  >
                    <div className="text-xs mb-1" style={{ color: mergedConfig.hero?.cards?.light.labelColor }}>
                      Precio
                    </div>
                    <div className="text-lg font-bold" style={{ color: mergedConfig.hero?.cards?.light.textColor }}>
                      $99 USD
                    </div>
                  </div>
                </div>
              </div>

              {/* Tema Oscuro */}
              <div className="space-y-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  🌙 Tema Oscuro
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Color de fondo
                    </label>
                    <input
                      type="text"
                      value={mergedConfig.hero?.cards?.dark.background ?? 'rgba(31, 41, 55, 0.5)'}
                      onChange={(e) => updateHeroCards('dark', 'background', e.target.value)}
                      placeholder="rgba(31, 41, 55, 0.5)"
                      className="w-full px-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Color de borde
                    </label>
                    <input
                      type="color"
                      value={mergedConfig.hero?.cards?.dark.borderColor ?? '#374151'}
                      onChange={(e) => updateHeroCards('dark', 'borderColor', e.target.value)}
                      className="w-full h-9 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Color de texto
                    </label>
                    <input
                      type="color"
                      value={mergedConfig.hero?.cards?.dark.textColor ?? '#ffffff'}
                      onChange={(e) => updateHeroCards('dark', 'textColor', e.target.value)}
                      className="w-full h-9 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Color de etiqueta
                    </label>
                    <input
                      type="color"
                      value={mergedConfig.hero?.cards?.dark.labelColor ?? '#9ca3af'}
                      onChange={(e) => updateHeroCards('dark', 'labelColor', e.target.value)}
                      className="w-full h-9 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                  </div>
                </div>
                {/* Vista previa tema oscuro */}
                <div className="pt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa:</p>
                  <div
                    className="rounded-lg px-4 py-3 border"
                    style={{
                      background: mergedConfig.hero?.cards?.dark.background,
                      borderColor: mergedConfig.hero?.cards?.dark.borderColor,
                    }}
                  >
                    <div className="text-xs mb-1" style={{ color: mergedConfig.hero?.cards?.dark.labelColor }}>
                      Precio
                    </div>
                    <div className="text-lg font-bold" style={{ color: mergedConfig.hero?.cards?.dark.textColor }}>
                      $99 USD
                    </div>
                  </div>
                </div>
              </div>
            </div>

              {/* Opciones de visualización */}
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={mergedConfig.hero?.content?.showCategoryTag ?? true}
                    onChange={(e) => updateHeroContent('showCategoryTag', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Mostrar categoría</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={mergedConfig.hero?.content?.showPrice ?? true}
                    onChange={(e) => updateHeroContent('showPrice', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Mostrar precio</span>
                </label>
              </div>
            </div>

            {/* 🔘 Configuración de Botones */}
            <div className="space-y-4 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700/30 dark:to-gray-600/30 rounded-lg border border-blue-200 dark:border-blue-700">
              <h5 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span>🔘</span> Botones de Acción
              </h5>

              {/* Botón Primario */}
              <div className="space-y-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Botón Primario</span>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={mergedConfig.hero?.buttons?.primary?.enabled ?? true}
                      onChange={(e) => updateHeroButton('primary', 'enabled', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Activado</span>
                  </label>
                </div>

                {mergedConfig.hero?.buttons?.primary?.enabled && (
                  <div className="space-y-4 pl-4 border-l-2 border-purple-300 dark:border-purple-600">
                    {/* Texto y Estilo (común) */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Texto del botón
                      </label>
                      <input
                        type="text"
                        value={mergedConfig.hero?.buttons?.primary?.text ?? ''}
                        onChange={(e) => updateHeroButton('primary', 'text', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Estilo
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['solid', 'outline', 'gradient'] as const).map((style) => (
                          <button
                            key={style}
                            onClick={() => updateHeroButton('primary', 'style', style)}
                            className={`px-3 py-2 rounded text-xs font-medium transition-all ${
                              mergedConfig.hero?.buttons?.primary?.style === style
                                ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            {style === 'solid' ? 'Sólido' : style === 'outline' ? 'Borde' : 'Gradiente'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ☀️ Tema Claro */}
                    <div className="space-y-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-600">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        ☀️ Tema Claro
                      </p>

                      {mergedConfig.hero?.buttons?.primary?.style === 'gradient' && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Gradiente Inicio
                            </label>
                            <input
                              type="color"
                              value={mergedConfig.hero?.buttons?.primary?.light?.gradient?.from ?? '#8b5cf6'}
                              onChange={(e) => updateHeroButtonTheme('primary', 'light', 'gradient', {
                                ...mergedConfig.hero?.buttons?.primary?.light?.gradient,
                                from: e.target.value
                              })}
                              className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Gradiente Final
                            </label>
                            <input
                              type="color"
                              value={mergedConfig.hero?.buttons?.primary?.light?.gradient?.to ?? '#06b6d4'}
                              onChange={(e) => updateHeroButtonTheme('primary', 'light', 'gradient', {
                                ...mergedConfig.hero?.buttons?.primary?.light?.gradient,
                                to: e.target.value
                              })}
                              className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                          </div>
                        </div>
                      )}

                      {mergedConfig.hero?.buttons?.primary?.style === 'solid' && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Color de fondo
                          </label>
                          <input
                            type="color"
                            value={mergedConfig.hero?.buttons?.primary?.light?.solidColor ?? '#8b5cf6'}
                            onChange={(e) => updateHeroButtonTheme('primary', 'light', 'solidColor', e.target.value)}
                            className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Color de texto
                          </label>
                          <input
                            type="color"
                            value={mergedConfig.hero?.buttons?.primary?.light?.textColor ?? '#ffffff'}
                            onChange={(e) => updateHeroButtonTheme('primary', 'light', 'textColor', e.target.value)}
                            className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                        </div>
                        {mergedConfig.hero?.buttons?.primary?.style === 'outline' && (
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Color de borde
                            </label>
                            <input
                              type="color"
                              value={mergedConfig.hero?.buttons?.primary?.light?.borderColor ?? '#8b5cf6'}
                              onChange={(e) => updateHeroButtonTheme('primary', 'light', 'borderColor', e.target.value)}
                              className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                          </div>
                        )}
                      </div>

                      {/* Vista previa tema claro */}
                      <div className="pt-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa:</p>
                        <div className="bg-white p-4 rounded-lg">
                          <button
                            className="px-6 py-3 rounded-lg font-medium transition-all"
                            style={{
                              background: mergedConfig.hero?.buttons?.primary?.style === 'gradient'
                                ? `linear-gradient(to right, ${mergedConfig.hero?.buttons?.primary?.light?.gradient?.from}, ${mergedConfig.hero?.buttons?.primary?.light?.gradient?.to})`
                                : mergedConfig.hero?.buttons?.primary?.style === 'solid'
                                ? mergedConfig.hero?.buttons?.primary?.light?.solidColor
                                : 'transparent',
                              color: mergedConfig.hero?.buttons?.primary?.light?.textColor,
                              border: mergedConfig.hero?.buttons?.primary?.style === 'outline'
                                ? `2px solid ${mergedConfig.hero?.buttons?.primary?.light?.borderColor}`
                                : 'none',
                            }}
                          >
                            {mergedConfig.hero?.buttons?.primary?.text || 'Botón'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 🌙 Tema Oscuro */}
                    <div className="space-y-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-600">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        🌙 Tema Oscuro
                      </p>

                      {mergedConfig.hero?.buttons?.primary?.style === 'gradient' && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Gradiente Inicio
                            </label>
                            <input
                              type="color"
                              value={mergedConfig.hero?.buttons?.primary?.dark?.gradient?.from ?? '#a78bfa'}
                              onChange={(e) => updateHeroButtonTheme('primary', 'dark', 'gradient', {
                                ...mergedConfig.hero?.buttons?.primary?.dark?.gradient,
                                from: e.target.value
                              })}
                              className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Gradiente Final
                            </label>
                            <input
                              type="color"
                              value={mergedConfig.hero?.buttons?.primary?.dark?.gradient?.to ?? '#22d3ee'}
                              onChange={(e) => updateHeroButtonTheme('primary', 'dark', 'gradient', {
                                ...mergedConfig.hero?.buttons?.primary?.dark?.gradient,
                                to: e.target.value
                              })}
                              className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                          </div>
                        </div>
                      )}

                      {mergedConfig.hero?.buttons?.primary?.style === 'solid' && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Color de fondo
                          </label>
                          <input
                            type="color"
                            value={mergedConfig.hero?.buttons?.primary?.dark?.solidColor ?? '#a78bfa'}
                            onChange={(e) => updateHeroButtonTheme('primary', 'dark', 'solidColor', e.target.value)}
                            className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Color de texto
                          </label>
                          <input
                            type="color"
                            value={mergedConfig.hero?.buttons?.primary?.dark?.textColor ?? '#ffffff'}
                            onChange={(e) => updateHeroButtonTheme('primary', 'dark', 'textColor', e.target.value)}
                            className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                        </div>
                        {mergedConfig.hero?.buttons?.primary?.style === 'outline' && (
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Color de borde
                            </label>
                            <input
                              type="color"
                              value={mergedConfig.hero?.buttons?.primary?.dark?.borderColor ?? '#a78bfa'}
                              onChange={(e) => updateHeroButtonTheme('primary', 'dark', 'borderColor', e.target.value)}
                              className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                          </div>
                        )}
                      </div>

                      {/* Vista previa tema oscuro */}
                      <div className="pt-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa:</p>
                        <div className="bg-gray-900 p-4 rounded-lg">
                          <button
                            className="px-6 py-3 rounded-lg font-medium transition-all"
                            style={{
                              background: mergedConfig.hero?.buttons?.primary?.style === 'gradient'
                                ? `linear-gradient(to right, ${mergedConfig.hero?.buttons?.primary?.dark?.gradient?.from}, ${mergedConfig.hero?.buttons?.primary?.dark?.gradient?.to})`
                                : mergedConfig.hero?.buttons?.primary?.style === 'solid'
                                ? mergedConfig.hero?.buttons?.primary?.dark?.solidColor
                                : 'transparent',
                              color: mergedConfig.hero?.buttons?.primary?.dark?.textColor,
                              border: mergedConfig.hero?.buttons?.primary?.style === 'outline'
                                ? `2px solid ${mergedConfig.hero?.buttons?.primary?.dark?.borderColor}`
                                : 'none',
                            }}
                          >
                            {mergedConfig.hero?.buttons?.primary?.text || 'Botón'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Botón Secundario */}
              <div className="space-y-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Botón Secundario</span>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={mergedConfig.hero?.buttons?.secondary?.enabled ?? true}
                      onChange={(e) => updateHeroButton('secondary', 'enabled', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Activado</span>
                  </label>
                </div>

                {mergedConfig.hero?.buttons?.secondary?.enabled && (
                  <div className="space-y-4 pl-4 border-l-2 border-blue-300 dark:border-blue-600">
                    {/* Texto y Estilo (común) */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Texto del botón
                      </label>
                      <input
                        type="text"
                        value={mergedConfig.hero?.buttons?.secondary?.text ?? ''}
                        onChange={(e) => updateHeroButton('secondary', 'text', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Estilo
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['solid', 'outline', 'gradient'] as const).map((style) => (
                          <button
                            key={style}
                            onClick={() => updateHeroButton('secondary', 'style', style)}
                            className={`px-3 py-2 rounded text-xs font-medium transition-all ${
                              mergedConfig.hero?.buttons?.secondary?.style === style
                                ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            {style === 'solid' ? 'Sólido' : style === 'outline' ? 'Borde' : 'Gradiente'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ☀️ Tema Claro */}
                    <div className="space-y-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-600">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        ☀️ Tema Claro
                      </p>

                      {mergedConfig.hero?.buttons?.secondary?.style === 'gradient' && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Gradiente Inicio
                            </label>
                            <input
                              type="color"
                              value={mergedConfig.hero?.buttons?.secondary?.light?.gradient?.from ?? '#ec4899'}
                              onChange={(e) => updateHeroButtonTheme('secondary', 'light', 'gradient', {
                                ...mergedConfig.hero?.buttons?.secondary?.light?.gradient,
                                from: e.target.value
                              })}
                              className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Gradiente Final
                            </label>
                            <input
                              type="color"
                              value={mergedConfig.hero?.buttons?.secondary?.light?.gradient?.to ?? '#f59e0b'}
                              onChange={(e) => updateHeroButtonTheme('secondary', 'light', 'gradient', {
                                ...mergedConfig.hero?.buttons?.secondary?.light?.gradient,
                                to: e.target.value
                              })}
                              className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                          </div>
                        </div>
                      )}

                      {mergedConfig.hero?.buttons?.secondary?.style === 'solid' && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Color de fondo
                          </label>
                          <input
                            type="color"
                            value={mergedConfig.hero?.buttons?.secondary?.light?.solidColor ?? 'transparent'}
                            onChange={(e) => updateHeroButtonTheme('secondary', 'light', 'solidColor', e.target.value)}
                            className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Color de texto
                          </label>
                          <input
                            type="color"
                            value={mergedConfig.hero?.buttons?.secondary?.light?.textColor ?? '#8b5cf6'}
                            onChange={(e) => updateHeroButtonTheme('secondary', 'light', 'textColor', e.target.value)}
                            className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                        </div>
                        {mergedConfig.hero?.buttons?.secondary?.style === 'outline' && (
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Color de borde
                            </label>
                            <input
                              type="color"
                              value={mergedConfig.hero?.buttons?.secondary?.light?.borderColor ?? '#8b5cf6'}
                              onChange={(e) => updateHeroButtonTheme('secondary', 'light', 'borderColor', e.target.value)}
                              className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                          </div>
                        )}
                      </div>

                      {/* Vista previa tema claro */}
                      <div className="pt-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa:</p>
                        <div className="bg-white p-4 rounded-lg">
                          <button
                            className="px-6 py-3 rounded-lg font-medium transition-all"
                            style={{
                              background: mergedConfig.hero?.buttons?.secondary?.style === 'gradient'
                                ? `linear-gradient(to right, ${mergedConfig.hero?.buttons?.secondary?.light?.gradient?.from}, ${mergedConfig.hero?.buttons?.secondary?.light?.gradient?.to})`
                                : mergedConfig.hero?.buttons?.secondary?.style === 'solid'
                                ? mergedConfig.hero?.buttons?.secondary?.light?.solidColor
                                : 'transparent',
                              color: mergedConfig.hero?.buttons?.secondary?.light?.textColor,
                              border: mergedConfig.hero?.buttons?.secondary?.style === 'outline'
                                ? `2px solid ${mergedConfig.hero?.buttons?.secondary?.light?.borderColor}`
                                : 'none',
                            }}
                          >
                            {mergedConfig.hero?.buttons?.secondary?.text || 'Botón'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 🌙 Tema Oscuro */}
                    <div className="space-y-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-600">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        🌙 Tema Oscuro
                      </p>

                      {mergedConfig.hero?.buttons?.secondary?.style === 'gradient' && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Gradiente Inicio
                            </label>
                            <input
                              type="color"
                              value={mergedConfig.hero?.buttons?.secondary?.dark?.gradient?.from ?? '#f472b6'}
                              onChange={(e) => updateHeroButtonTheme('secondary', 'dark', 'gradient', {
                                ...mergedConfig.hero?.buttons?.secondary?.dark?.gradient,
                                from: e.target.value
                              })}
                              className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Gradiente Final
                            </label>
                            <input
                              type="color"
                              value={mergedConfig.hero?.buttons?.secondary?.dark?.gradient?.to ?? '#fbbf24'}
                              onChange={(e) => updateHeroButtonTheme('secondary', 'dark', 'gradient', {
                                ...mergedConfig.hero?.buttons?.secondary?.dark?.gradient,
                                to: e.target.value
                              })}
                              className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                          </div>
                        </div>
                      )}

                      {mergedConfig.hero?.buttons?.secondary?.style === 'solid' && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Color de fondo
                          </label>
                          <input
                            type="color"
                            value={mergedConfig.hero?.buttons?.secondary?.dark?.solidColor ?? 'transparent'}
                            onChange={(e) => updateHeroButtonTheme('secondary', 'dark', 'solidColor', e.target.value)}
                            className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Color de texto
                          </label>
                          <input
                            type="color"
                            value={mergedConfig.hero?.buttons?.secondary?.dark?.textColor ?? '#a78bfa'}
                            onChange={(e) => updateHeroButtonTheme('secondary', 'dark', 'textColor', e.target.value)}
                            className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                        </div>
                        {mergedConfig.hero?.buttons?.secondary?.style === 'outline' && (
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Color de borde
                            </label>
                            <input
                              type="color"
                              value={mergedConfig.hero?.buttons?.secondary?.dark?.borderColor ?? '#a78bfa'}
                              onChange={(e) => updateHeroButtonTheme('secondary', 'dark', 'borderColor', e.target.value)}
                              className="w-full h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                          </div>
                        )}
                      </div>

                      {/* Vista previa tema oscuro */}
                      <div className="pt-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa:</p>
                        <div className="bg-gray-900 p-4 rounded-lg">
                          <button
                            className="px-6 py-3 rounded-lg font-medium transition-all"
                            style={{
                              background: mergedConfig.hero?.buttons?.secondary?.style === 'gradient'
                                ? `linear-gradient(to right, ${mergedConfig.hero?.buttons?.secondary?.dark?.gradient?.from}, ${mergedConfig.hero?.buttons?.secondary?.dark?.gradient?.to})`
                                : mergedConfig.hero?.buttons?.secondary?.style === 'solid'
                                ? mergedConfig.hero?.buttons?.secondary?.dark?.solidColor
                                : 'transparent',
                              color: mergedConfig.hero?.buttons?.secondary?.dark?.textColor,
                              border: mergedConfig.hero?.buttons?.secondary?.style === 'outline'
                                ? `2px solid ${mergedConfig.hero?.buttons?.secondary?.dark?.borderColor}`
                                : 'none',
                            }}
                          >
                            {mergedConfig.hero?.buttons?.secondary?.text || 'Botón'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Configuración del fondo */}
            <BackgroundEditor
              background={mergedConfig.hero?.background || DEFAULT_BACKGROUND}
              onUpdate={updateHeroBackground}
              onBatchUpdate={batchUpdateHeroBackground}
              label="Fondo de la sección Hero"
            />
          </div>
        )}
      </div>

      {/* 🎛️ Accordion Config */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <SectionHeader
          id="accordion"
          icon="🎛️"
          title="Acordeón de Paneles"
          description="Configura el comportamiento y orden de los paneles"
        />
        {expandedSection === 'accordion' && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-6">
            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Panel abierto por defecto
                </label>
                <select
                  value={mergedConfig.accordion?.defaultOpenPanel ?? 'descripcion'}
                  onChange={(e) => updateAccordion('defaultOpenPanel', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Ninguno (todos cerrados)</option>
                  {mergedConfig.accordion?.panels
                    .filter(p => p.enabled)
                    .map(panel => (
                      <option key={panel.id} value={panel.id}>
                        {panel.icon} {panel.label}
                      </option>
                    ))}
                </select>
              </div>

              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 h-fit">
                <input
                  type="checkbox"
                  checked={mergedConfig.accordion?.expandMultiple ?? false}
                  onChange={(e) => updateAccordion('expandMultiple', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200">Expandir múltiples</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Permitir varios paneles abiertos</p>
                </div>
              </label>
            </div>

            {/* Panels List */}
            <div className="space-y-3">
              <h5 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span>📋</span> Paneles disponibles
                <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                  Arrastra para reordenar
                </span>
              </h5>
              <div className="space-y-2">
                {mergedConfig.accordion?.panels.map((panel, index) => (
                  <div
                    key={panel.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      panel.enabled
                        ? 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                        : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-60'
                    }`}
                  >
                    {/* Move buttons */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => movePanelUp(index)}
                        disabled={index === 0}
                        className={`p-1 rounded text-xs ${
                          index === 0
                            ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => movePanelDown(index)}
                        disabled={index === mergedConfig.accordion!.panels.length - 1}
                        className={`p-1 rounded text-xs ${
                          index === mergedConfig.accordion!.panels.length - 1
                            ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                            : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        ▼
                      </button>
                    </div>

                    {/* Panel info */}
                    <span className="text-xl">{panel.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-700 dark:text-gray-200">{panel.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{panel.description}</p>
                    </div>

                    {/* Toggle */}
                    <button
                      onClick={() => togglePanelEnabled(panel.id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        panel.enabled
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {panel.enabled ? '✓ Visible' : '○ Oculto'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 🎨 Configuración de Estilos de Paneles */}
            <div className="space-y-4 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700/30 dark:to-gray-600/30 rounded-lg border border-indigo-200 dark:border-indigo-700">
              <h5 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <span>🎨</span> Estilos de Paneles del Acordeón
              </h5>

              {/* Tema Claro */}
              <ThemeStylePanel
                theme="light"
                themeLabel="Tema Claro"
                themeIcon="☀️"
                styles={mergedConfig.accordion?.styles?.light || DEFAULT_CONFIG.accordion!.styles!.light}
                onStyleChange={(field, value) => updateAccordionStyle('light', field, value)}
              />

              {/* Tema Oscuro */}
              <ThemeStylePanel
                theme="dark"
                themeLabel="Tema Oscuro"
                themeIcon="🌙"
                styles={mergedConfig.accordion?.styles?.dark || DEFAULT_CONFIG.accordion!.styles!.dark}
                onStyleChange={(field, value) => updateAccordionStyle('dark', field, value)}
              />

              {/* 🔤 Configuración de Tipografía */}
              <div className="space-y-4 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700/30 dark:to-gray-600/30 rounded-lg border border-blue-200 dark:border-blue-700">
                <h5 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span>🔤</span> Tipografía del Acordeón
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Familia de Fuente */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Familia de Fuente
                    </label>
                    <select
                      value={mergedConfig.accordion?.styles?.typography?.fontFamily ?? 'Montserrat, sans-serif'}
                      onChange={(e) => updateAccordionTypography('fontFamily', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
                    >
                      <option value="Montserrat, sans-serif">Montserrat</option>
                      <option value="Inter, sans-serif">Inter</option>
                      <option value="Roboto, sans-serif">Roboto</option>
                      <option value="Open Sans, sans-serif">Open Sans</option>
                      <option value="Poppins, sans-serif">Poppins</option>
                      <option value="Lato, sans-serif">Lato</option>
                      <option value="Raleway, sans-serif">Raleway</option>
                      <option value="Nunito, sans-serif">Nunito</option>
                      <option value="system-ui, sans-serif">System UI</option>
                      <option value="Georgia, serif">Georgia (Serif)</option>
                      <option value="ui-monospace, monospace">Monospace</option>
                    </select>
                  </div>

                  {/* Peso de Fuente del Header */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Peso del Título
                    </label>
                    <select
                      value={mergedConfig.accordion?.styles?.typography?.headerFontWeight ?? '600'}
                      onChange={(e) => updateAccordionTypography('headerFontWeight', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
                    >
                      <option value="300">Light (300)</option>
                      <option value="400">Regular (400)</option>
                      <option value="500">Medium (500)</option>
                      <option value="600">Semibold (600)</option>
                      <option value="700">Bold (700)</option>
                      <option value="800">Extrabold (800)</option>
                    </select>
                  </div>

                  {/* Tamaño de Fuente del Header */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Tamaño del Título
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={mergedConfig.accordion?.styles?.typography?.headerFontSize ?? '1.125rem'}
                        onChange={(e) => updateAccordionTypography('headerFontSize', e.target.value)}
                        placeholder="1.125rem"
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
                      />
                      <select
                        value={mergedConfig.accordion?.styles?.typography?.headerFontSize ?? '1.125rem'}
                        onChange={(e) => updateAccordionTypography('headerFontSize', e.target.value)}
                        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
                      >
                        <option value="0.875rem">14px</option>
                        <option value="1rem">16px</option>
                        <option value="1.125rem">18px</option>
                        <option value="1.25rem">20px</option>
                        <option value="1.5rem">24px</option>
                      </select>
                    </div>
                  </div>

                  {/* Tamaño de Fuente del Contenido */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Tamaño del Contenido
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={mergedConfig.accordion?.styles?.typography?.contentFontSize ?? '1rem'}
                        onChange={(e) => updateAccordionTypography('contentFontSize', e.target.value)}
                        placeholder="1rem"
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
                      />
                      <select
                        value={mergedConfig.accordion?.styles?.typography?.contentFontSize ?? '1rem'}
                        onChange={(e) => updateAccordionTypography('contentFontSize', e.target.value)}
                        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
                      >
                        <option value="0.75rem">12px</option>
                        <option value="0.875rem">14px</option>
                        <option value="1rem">16px</option>
                        <option value="1.125rem">18px</option>
                      </select>
                    </div>
                  </div>

                  {/* Altura de Línea del Contenido */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Altura de Línea
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="range"
                        min="1"
                        max="2.5"
                        step="0.05"
                        value={parseFloat(mergedConfig.accordion?.styles?.typography?.contentLineHeight ?? '1.75')}
                        onChange={(e) => updateAccordionTypography('contentLineHeight', e.target.value)}
                        className="flex-1"
                      />
                      <input
                        type="text"
                        value={mergedConfig.accordion?.styles?.typography?.contentLineHeight ?? '1.75'}
                        onChange={(e) => updateAccordionTypography('contentLineHeight', e.target.value)}
                        className="w-20 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Vista previa de tipografía */}
                <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vista previa:</p>
                  <div className="bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg space-y-3">
                    <h3 
                      style={{
                        fontFamily: mergedConfig.accordion?.styles?.typography?.fontFamily,
                        fontSize: mergedConfig.accordion?.styles?.typography?.headerFontSize,
                        fontWeight: mergedConfig.accordion?.styles?.typography?.headerFontWeight,
                      }}
                      className="text-gray-900 dark:text-white"
                    >
                      Título del Panel de Ejemplo
                    </h3>
                    <p 
                      style={{
                        fontFamily: mergedConfig.accordion?.styles?.typography?.fontFamily,
                        fontSize: mergedConfig.accordion?.styles?.typography?.contentFontSize,
                        lineHeight: mergedConfig.accordion?.styles?.typography?.contentLineHeight,
                      }}
                      className="text-gray-600 dark:text-gray-300"
                    >
                      Este es un ejemplo de cómo se verá el contenido del panel con la tipografía configurada. Puedes ajustar la familia de fuente, tamaños y altura de línea para que se adapte perfectamente al diseño de tu sitio.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 💳 Estilos de Tarjetas de Contenido */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
              <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                <span>💳</span> Estilos de Tarjetas de Contenido
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Personaliza el aspecto de las tarjetas de beneficios, características, FAQ, etc.
              </p>

              {/* Tema Claro */}
              <CardStylePanel
                theme="light"
                themeLabel="Tema Claro"
                themeIcon="☀️"
                styles={mergedConfig.accordion?.styles?.contentCards?.light}
                onStyleChange={(field, value) => updateAccordionContentCards('light', field, value)}
              />

              {/* Tema Oscuro */}
              <CardStylePanel
                theme="dark"
                themeLabel="Tema Oscuro"
                themeIcon="🌙"
                styles={mergedConfig.accordion?.styles?.contentCards?.dark}
                onStyleChange={(field, value) => updateAccordionContentCards('dark', field, value)}
              />
            </div>

            {/* Configuración del fondo */}
            <BackgroundEditor
              background={mergedConfig.accordion?.background || DEFAULT_BACKGROUND}
              onUpdate={updateAccordionBackground}
              onBatchUpdate={batchUpdateAccordionBackground}
              label="Fondo de la sección de Acordeón"
            />
          </div>
        )}
      </div>

      {/* 📊 Sidebar Config */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <SectionHeader
          id="sidebar"
          icon="📊"
          title="Barra Lateral"
          description="Elementos mostrados en el sidebar del servicio"
        />
        {expandedSection === 'sidebar' && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={mergedConfig.sidebar?.showRelatedServices ?? true}
                  onChange={(e) => updateSidebar('showRelatedServices', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200">Servicios Relacionados</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mostrar otros servicios sugeridos</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={mergedConfig.sidebar?.showCategoryTag ?? true}
                  onChange={(e) => updateSidebar('showCategoryTag', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200">Etiqueta de Categoría</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Badge con la categoría del servicio</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={mergedConfig.sidebar?.showPriceRange ?? true}
                  onChange={(e) => updateSidebar('showPriceRange', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200">Rango de Precios</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mostrar indicador de precios</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={mergedConfig.sidebar?.showContactButton ?? true}
                  onChange={(e) => updateSidebar('showContactButton', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200">Botón de Contacto</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">CTA para solicitar información</p>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 🎨 Design Config */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <SectionHeader
          id="design"
          icon="🎨"
          title="Diseño Visual"
          description="Estilos y apariencia de los componentes"
        />
        {expandedSection === 'design' && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Estilo del Header
                </label>
                <select
                  value={mergedConfig.design?.headerStyle ?? 'minimal'}
                  onChange={(e) => updateDesign('headerStyle', e.target.value as any)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="minimal">Minimalista</option>
                  <option value="card">Tarjeta con sombra</option>
                  <option value="gradient">Con gradiente</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Radio de borde
                </label>
                <select
                  value={mergedConfig.design?.panelBorderRadius ?? 'rounded-xl'}
                  onChange={(e) => updateDesign('panelBorderRadius', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="rounded-none">Sin bordes</option>
                  <option value="rounded-md">Redondeado suave</option>
                  <option value="rounded-lg">Redondeado medio</option>
                  <option value="rounded-xl">Redondeado grande</option>
                  <option value="rounded-2xl">Muy redondeado</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Color de acento
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={mergedConfig.design?.accentColor ?? '#7c3aed'}
                    onChange={(e) => updateDesign('accentColor', e.target.value)}
                    className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={mergedConfig.design?.accentColor ?? '#7c3aed'}
                    onChange={(e) => updateDesign('accentColor', e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200"
                    placeholder="#7c3aed"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 h-fit">
                <input
                  type="checkbox"
                  checked={mergedConfig.design?.panelShadow ?? true}
                  onChange={(e) => updateDesign('panelShadow', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200">Sombras en paneles</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Añadir sombra a los paneles</p>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 🎯 CTA Section Config */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <SectionHeader
          id="cta"
          icon="🎯"
          title="Sección CTA (Llamado a la Acción)"
          description="Fondo de la sección final con botones de contacto"
        />
        {expandedSection === 'cta' && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-6">
            <BackgroundEditor
              background={mergedConfig.cta?.background || DEFAULT_BACKGROUND}
              onUpdate={updateCtaBackground}
              onBatchUpdate={batchUpdateCtaBackground}
              label="Fondo de la sección CTA"
            />
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-violet-800 dark:text-violet-200 mb-3">
          📄 Resumen de Configuración
        </h3>
        <p className="text-violet-700 dark:text-violet-300 mb-4">
          Esta página muestra el detalle individual de cada servicio con sistema de acordeón.
        </p>
        <ul className="text-violet-600 dark:text-violet-400 space-y-2">
          <li>✅ <strong>Hero:</strong> {mergedConfig.hero?.showBreadcrumb ? 'Con' : 'Sin'} breadcrumb, {mergedConfig.hero?.showBackButton ? 'con' : 'sin'} botón volver</li>
          <li>✅ <strong>Paneles:</strong> {mergedConfig.accordion?.panels.filter(p => p.enabled).length} de {mergedConfig.accordion?.panels.length} activos</li>
          <li>✅ <strong>Panel inicial:</strong> {mergedConfig.accordion?.defaultOpenPanel || 'Ninguno'}</li>
          <li>✅ <strong>Múltiples abiertos:</strong> {mergedConfig.accordion?.expandMultiple ? 'Sí' : 'No'}</li>
          <li>✅ <strong>Sidebar:</strong> {[
            mergedConfig.sidebar?.showRelatedServices && 'Relacionados',
            mergedConfig.sidebar?.showCategoryTag && 'Categoría',
            mergedConfig.sidebar?.showPriceRange && 'Precios',
            mergedConfig.sidebar?.showContactButton && 'Contacto',
          ].filter(Boolean).join(', ') || 'Sin elementos'}</li>
        </ul>
      </div>
    </div>
  );
};

export default ServicioDetailConfigSection;
