import React, { useState, useEffect, useCallback } from 'react';
import type { PageData, ClientLogosSectionDesignStyles, ClientLogosDesignStyles } from '../../types/cms';
import ColorWithOpacity from './ColorWithOpacity';
import GradientPicker from './GradientPicker';
import ShadowControl from './ShadowControl';

interface ClientLogosDesignSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
}

const ClientLogosDesignSection: React.FC<ClientLogosDesignSectionProps> = ({
  pageData,
  updateContent
}) => {
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<'section' | 'logos'>('section');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 🎨 Valores por defecto para el diseño de la sección
  const defaultSectionLightStyles: ClientLogosSectionDesignStyles = {
    background: 'transparent', // Sin fondo por defecto, solo el configurado en CMS
    borderColor: 'transparent',
    borderWidth: '0px',
    borderRadius: '0px',
    shadow: 'none',
    padding: '3rem',
    margin: '2rem 0'
  };

  const defaultSectionDarkStyles: ClientLogosSectionDesignStyles = {
    background: 'transparent', // Sin fondo por defecto, solo el configurado en CMS
    borderColor: 'transparent',
    borderWidth: '0px',
    borderRadius: '0px',
    shadow: 'none',
    padding: '3rem',
    margin: '2rem 0'
  };

  // 🎨 Valores por defecto para el diseño de los logos
  const defaultLogosLightStyles: ClientLogosDesignStyles = {
    logoMaxWidth: '120px',
    logoMaxHeight: '80px',
    logoOpacity: '0.7',
    logoHoverOpacity: '1',
    logoFilter: 'grayscale(0%)',
    logoHoverFilter: 'grayscale(0%)',
    logoBackground: 'transparent',
    logoPadding: '1rem',
    logosBorderRadius: '0.5rem',
    logosGap: '2rem',
    logosPerRow: 4,
    logosAlignment: 'center'
  };

  const defaultLogosDarkStyles: ClientLogosDesignStyles = {
    logoMaxWidth: '120px',
    logoMaxHeight: '80px',
    logoOpacity: '0.8',
    logoHoverOpacity: '1',
    logoFilter: 'brightness(0) invert(1)',
    logoHoverFilter: 'brightness(0) invert(1)',
    logoBackground: 'transparent',
    logoPadding: '1rem',
    logosBorderRadius: '0.5rem',
    logosGap: '2rem',
    logosPerRow: 4,
    logosAlignment: 'center'
  };

  // Estado local temporal para los estilos que se están editando
  const [localSectionLightStyles, setLocalSectionLightStyles] = useState<ClientLogosSectionDesignStyles>(() => ({
    ...defaultSectionLightStyles,
    ...(pageData.content.clientLogos?.sectionDesign?.light || {})
  }));
  
  const [localSectionDarkStyles, setLocalSectionDarkStyles] = useState<ClientLogosSectionDesignStyles>(() => ({
    ...defaultSectionDarkStyles,
    ...(pageData.content.clientLogos?.sectionDesign?.dark || {})
  }));

  const [localLogosLightStyles, setLocalLogosLightStyles] = useState<ClientLogosDesignStyles>(() => ({
    ...defaultLogosLightStyles,
    ...(pageData.content.clientLogos?.logosDesign?.light || {})
  }));
  
  const [localLogosDarkStyles, setLocalLogosDarkStyles] = useState<ClientLogosDesignStyles>(() => ({
    ...defaultLogosDarkStyles,
    ...(pageData.content.clientLogos?.logosDesign?.dark || {})
  }));

  // Sincronizar estados locales cuando pageData cambie
  useEffect(() => {
    const newSectionLightStyles = {
      ...defaultSectionLightStyles,
      ...(pageData.content.clientLogos?.sectionDesign?.light || {})
    };
    
    const newSectionDarkStyles = {
      ...defaultSectionDarkStyles,
      ...(pageData.content.clientLogos?.sectionDesign?.dark || {})
    };

    const newLogosLightStyles = {
      ...defaultLogosLightStyles,
      ...(pageData.content.clientLogos?.logosDesign?.light || {})
    };
    
    const newLogosDarkStyles = {
      ...defaultLogosDarkStyles,
      ...(pageData.content.clientLogos?.logosDesign?.dark || {})
    };
    
    setLocalSectionLightStyles(newSectionLightStyles);
    setLocalSectionDarkStyles(newSectionDarkStyles);
    setLocalLogosLightStyles(newLogosLightStyles);
    setLocalLogosDarkStyles(newLogosDarkStyles);
  }, [pageData.content.clientLogos?.sectionDesign, pageData.content.clientLogos?.logosDesign]);

  // Obtener estilos actuales del estado local según el tema y tab activos
  const currentSectionStyles = activeTheme === 'light' ? localSectionLightStyles : localSectionDarkStyles;
  const currentLogosStyles = activeTheme === 'light' ? localLogosLightStyles : localLogosDarkStyles;

  const updateSectionStyle = (field: keyof ClientLogosSectionDesignStyles, value: string) => {
    // Actualizar estado local inmediatamente (para vista previa)
    if (activeTheme === 'light') {
      setLocalSectionLightStyles(prev => ({ ...prev, [field]: value }));
    } else {
      setLocalSectionDarkStyles(prev => ({ ...prev, [field]: value }));
    }

    // También actualizar pageData inmediatamente para sincronización completa
    const currentPath = `clientLogos.sectionDesign.${activeTheme}.${field}`;
    updateContent(currentPath, value);

    setHasUnsavedChanges(true);
  };

  const updateLogosStyle = (field: keyof ClientLogosDesignStyles, value: string | number) => {
    // Actualizar estado local inmediatamente (para vista previa)
    if (activeTheme === 'light') {
      setLocalLogosLightStyles(prev => ({ ...prev, [field]: value }));
    } else {
      setLocalLogosDarkStyles(prev => ({ ...prev, [field]: value }));
    }

    // También actualizar pageData inmediatamente para sincronización completa
    const currentPath = `clientLogos.logosDesign.${activeTheme}.${field}`;
    updateContent(currentPath, value);

    setHasUnsavedChanges(true);
  };

  // Función para guardar los cambios al padre
  const saveChanges = useCallback(() => {
    // Guardar valores COMPLETOS - AMBOS TEMAS SIEMPRE
    const completeSectionDesign = {
      light: { ...localSectionLightStyles },
      dark: { ...localSectionDarkStyles }
    };

    const completeLogosDesign = {
      light: { ...localLogosLightStyles },
      dark: { ...localLogosDarkStyles }
    };
    
    // Actualizar la configuración completa de una vez
    updateContent('clientLogos.sectionDesign', completeSectionDesign);
    updateContent('clientLogos.logosDesign', completeLogosDesign);
    
    setHasUnsavedChanges(false);
  }, [localSectionLightStyles, localSectionDarkStyles, localLogosLightStyles, localLogosDarkStyles, updateContent]);

  // Exponer saveChanges para que CmsManager pueda llamarlo
  useEffect(() => {
    (window as any).__clientLogosDesignSave = saveChanges;
    
    return () => {
      delete (window as any).__clientLogosDesignSave;
    };
  }, [saveChanges]);

  const resetToDefaults = () => {
    if (activeTab === 'section') {
      const defaults = activeTheme === 'light' ? defaultSectionLightStyles : defaultSectionDarkStyles;
      
      // Actualizar estado local
      if (activeTheme === 'light') {
        setLocalSectionLightStyles(defaults);
        updateContent('clientLogos.sectionDesign.light', defaults);
      } else {
        setLocalSectionDarkStyles(defaults);
        updateContent('clientLogos.sectionDesign.dark', defaults);
      }
    } else {
      const defaults = activeTheme === 'light' ? defaultLogosLightStyles : defaultLogosDarkStyles;
      
      // Actualizar estado local
      if (activeTheme === 'light') {
        setLocalLogosLightStyles(defaults);
        updateContent('clientLogos.logosDesign.light', defaults);
      } else {
        setLocalLogosDarkStyles(defaults);
        updateContent('clientLogos.logosDesign.dark', defaults);
      }
    }
    
    setHasUnsavedChanges(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">🏢</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Diseño de Logos de Clientes
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Personaliza el diseño de la sección de logos de clientes
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={resetToDefaults}
            className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
            title="Restaurar valores por defecto del tema y sección actual"
          >
            🔄 Restaurar
          </button>
          
          {hasUnsavedChanges && (
            <div className="px-4 py-2 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-lg text-sm font-medium border border-orange-200 dark:border-orange-700 flex items-center gap-2">
              <span>⚠️</span>
              Tienes cambios sin guardar. Usa el botón "Guardar" de arriba.
            </div>
          )}
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tema:</span>
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
          <button
            onClick={() => setActiveTheme('light')}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTheme === 'light'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            ☀️ Claro
          </button>
          <button
            onClick={() => setActiveTheme('dark')}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTheme === 'dark'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            🌙 Oscuro
          </button>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Configurar:</span>
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
          <button
            onClick={() => setActiveTab('section')}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'section'
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            📦 Sección
          </button>
          <button
            onClick={() => setActiveTab('logos')}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'logos'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            🖼️ Logos
          </button>
        </div>
      </div>

      {/* Vista Previa */}
      <div className="mb-8">
        <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          👁️ Vista Previa - Tema {activeTheme === 'light' ? 'Claro' : 'Oscuro'}
        </h4>
        
        <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl relative overflow-hidden">
          {/* Simulación del fondo de la página */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-cyan-900/20"></div>
          
          {/* Preview de la sección completa */}
          <div className="relative">
            <div 
              style={{
                background: currentSectionStyles.background,
                border: `${currentSectionStyles.borderWidth} solid ${currentSectionStyles.borderColor}`,
                borderRadius: currentSectionStyles.borderRadius,
                boxShadow: currentSectionStyles.shadow,
                padding: currentSectionStyles.padding,
                margin: currentSectionStyles.margin
              }}
            >
              {/* Título y descripción de ejemplo */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Nuestros clientes
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Empresas que confían en nosotros
                </p>
              </div>

              {/* Grid de logos */}
              <div 
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${currentLogosStyles.logosPerRow}, 1fr)`,
                  gap: currentLogosStyles.logosGap,
                  justifyItems: currentLogosStyles.logosAlignment
                }}
              >
                {/* Logos reales o placeholders */}
                {pageData.content.clientLogos?.logos && pageData.content.clientLogos.logos.length > 0 ? (
                  pageData.content.clientLogos.logos.map((logo, index) => (
                    <div
                      key={`preview-logo-${index}-${logo.name || 'logo'}`}
                      style={{
                        maxWidth: currentLogosStyles.logoMaxWidth,
                        maxHeight: currentLogosStyles.logoMaxHeight,
                        opacity: currentLogosStyles.logoOpacity,
                        background: logo.background && logo.background !== 'transparent' ? logo.background : currentLogosStyles.logoBackground,
                        padding: currentLogosStyles.logoPadding,
                        borderRadius: currentLogosStyles.logosBorderRadius,
                        filter: currentLogosStyles.logoFilter
                      }}
                      className="transition-all duration-300 hover:opacity-100 cursor-pointer flex items-center justify-center"
                    >
                      {logo.imageUrl ? (
                        <img 
                          src={logo.imageUrl} 
                          alt={logo.alt || 'Cliente logo'} 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-16 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center text-white font-bold text-sm">
                          Logo
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  // Mostrar placeholders cuando no hay logos
                  [1, 2, 3, 4].map((i) => (
                    <div
                      key={`placeholder-${i}`}
                      style={{
                        maxWidth: currentLogosStyles.logoMaxWidth,
                        maxHeight: currentLogosStyles.logoMaxHeight,
                        opacity: currentLogosStyles.logoOpacity,
                        background: currentLogosStyles.logoBackground,
                        padding: currentLogosStyles.logoPadding,
                        borderRadius: currentLogosStyles.logosBorderRadius,
                        filter: currentLogosStyles.logoFilter
                      }}
                      className="transition-all duration-300 hover:opacity-100 cursor-pointer"
                    >
                      <div className="w-16 h-12 bg-gradient-to-r from-gray-400 to-gray-500 rounded flex items-center justify-center text-white font-bold text-sm">
                        Logo {i}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controles de configuración */}
      {activeTab === 'section' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna izquierda - Sección */}
          <div className="space-y-6">
            {/* Fondo */}
            <div>
              <GradientPicker
                key={`section-background-${activeTheme}`}
                label="Fondo de la Sección"
                value={currentSectionStyles.background}
                onChange={(value) => updateSectionStyle('background', value)}
              />
            </div>

            {/* Color del borde */}
            <div>
              <ColorWithOpacity
                label="Color del Borde"
                value={currentSectionStyles.borderColor}
                onChange={(value) => updateSectionStyle('borderColor', value)}
              />
            </div>

            {/* Grosor del borde */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Grosor del Borde
              </label>
              <select
                value={currentSectionStyles.borderWidth}
                onChange={(e) => updateSectionStyle('borderWidth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="0px">Sin borde</option>
                <option value="1px">1px</option>
                <option value="2px">2px</option>
                <option value="3px">3px</option>
              </select>
            </div>
          </div>

          {/* Columna derecha - Sección */}
          <div className="space-y-6">
            {/* Border radius */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Redondez de las Esquinas
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.25"
                  value={parseFloat(currentSectionStyles.borderRadius.replace('rem', ''))}
                  onChange={(e) => updateSectionStyle('borderRadius', `${e.target.value}rem`)}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {currentSectionStyles.borderRadius} ({Math.round(parseFloat(currentSectionStyles.borderRadius.replace('rem', '')) * 16)}px)
                </div>
              </div>
            </div>

            {/* Sombra */}
            <div>
              <ShadowControl
                label="Sombra"
                value={currentSectionStyles.shadow}
                onChange={(value) => updateSectionStyle('shadow', value)}
              />
            </div>

            {/* Padding */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Espaciado Interno
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="0.5"
                  value={parseFloat(currentSectionStyles.padding.replace('rem', ''))}
                  onChange={(e) => updateSectionStyle('padding', `${e.target.value}rem`)}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {currentSectionStyles.padding} ({Math.round(parseFloat(currentSectionStyles.padding.replace('rem', '')) * 16)}px)
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna izquierda - Logos */}
          <div className="space-y-6">
            {/* Tamaño máximo de logos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Ancho Máximo de Logos
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="80"
                  max="200"
                  step="10"
                  value={parseInt(currentLogosStyles.logoMaxWidth.replace('px', ''))}
                  onChange={(e) => updateLogosStyle('logoMaxWidth', `${e.target.value}px`)}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {currentLogosStyles.logoMaxWidth}
                </div>
              </div>
            </div>

            {/* Alto máximo de logos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Alto Máximo de Logos
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="40"
                  max="120"
                  step="10"
                  value={parseInt(currentLogosStyles.logoMaxHeight.replace('px', ''))}
                  onChange={(e) => updateLogosStyle('logoMaxHeight', `${e.target.value}px`)}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {currentLogosStyles.logoMaxHeight}
                </div>
              </div>
            </div>

            {/* Opacidad normal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Opacidad Normal
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0.3"
                  max="1"
                  step="0.1"
                  value={parseFloat(currentLogosStyles.logoOpacity)}
                  onChange={(e) => updateLogosStyle('logoOpacity', e.target.value)}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.round(parseFloat(currentLogosStyles.logoOpacity) * 100)}%
                </div>
              </div>
            </div>

            {/* Logos por fila */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Logos por Fila (Desktop)
              </label>
              <select
                value={currentLogosStyles.logosPerRow}
                onChange={(e) => updateLogosStyle('logosPerRow', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value={2}>2 logos</option>
                <option value={3}>3 logos</option>
                <option value={4}>4 logos</option>
                <option value={5}>5 logos</option>
                <option value={6}>6 logos</option>
              </select>
            </div>
          </div>

          {/* Columna derecha - Logos */}
          <div className="space-y-6">
            {/* Separación entre logos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Separación entre Logos
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0.5"
                  max="4"
                  step="0.5"
                  value={parseFloat(currentLogosStyles.logosGap.replace('rem', ''))}
                  onChange={(e) => updateLogosStyle('logosGap', `${e.target.value}rem`)}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {currentLogosStyles.logosGap} ({Math.round(parseFloat(currentLogosStyles.logosGap.replace('rem', '')) * 16)}px)
                </div>
              </div>
            </div>

            {/* Alineación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Alineación de Logos
              </label>
              <select
                value={currentLogosStyles.logosAlignment}
                onChange={(e) => updateLogosStyle('logosAlignment', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
              </select>
            </div>

            {/* Filtro de imagen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Filtro de Imagen
              </label>
              <select
                value={currentLogosStyles.logoFilter}
                onChange={(e) => updateLogosStyle('logoFilter', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="grayscale(0%)">Color normal</option>
                <option value="grayscale(100%)">Escala de grises</option>
                <option value="brightness(0) invert(1)">Blanco (para tema oscuro)</option>
                <option value="sepia(100%)">Sepia</option>
              </select>
            </div>

            {/* Padding de logos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Espaciado Interno de Logos
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.25"
                  value={parseFloat(currentLogosStyles.logoPadding.replace('rem', ''))}
                  onChange={(e) => updateLogosStyle('logoPadding', `${e.target.value}rem`)}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {currentLogosStyles.logoPadding} ({Math.round(parseFloat(currentLogosStyles.logoPadding.replace('rem', '')) * 16)}px)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientLogosDesignSection;