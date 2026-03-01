import React, { useState, useRef, useEffect } from 'react';
import type { PageData, CardDesignStyles, StrictCardDesignStyles } from '../../types/cms';
import ColorWithOpacity from './ColorWithOpacity';
import GradientPicker from './GradientPicker';
import ShadowControl from './ShadowControl';

interface GenericCardsDesignConfigProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
  section: 'solutions' | 'valueAdded';
  title: string;
  icon: string;
}

const GenericCardsDesignConfig: React.FC<GenericCardsDesignConfigProps> = ({
  pageData,
  updateContent,
  section,
  title,
  icon
}) => {
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // Valores por defecto para solutions
  const defaultSolutionsLightStyles: CardDesignStyles = {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    borderWidth: '1px',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    hoverBackground: 'rgba(255, 255, 255, 0.15)',
    hoverBorder: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    hoverShadow: '0 20px 40px rgba(139, 92, 246, 0.2)',
    iconGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    iconBackground: 'rgba(255, 255, 255, 0.9)',
    iconColor: '#1f2937',
    titleColor: '#1f2937',
    descriptionColor: '#4b5563',
    linkColor: '#a78bfa',
    cardMinWidth: '280px',
    cardMaxWidth: '100%',
    cardMinHeight: 'auto',
    cardPadding: '2rem',
    cardsAlignment: 'left',
    iconBorderEnabled: true,
    iconAlignment: 'left'
  };

  const defaultSolutionsDarkStyles: CardDesignStyles = {
    background: 'rgba(0, 0, 0, 0.3)',
    border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    borderWidth: '2px',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    hoverBackground: 'rgba(0, 0, 0, 0.4)',
    hoverBorder: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    hoverShadow: '0 20px 40px rgba(139, 92, 246, 0.3)',
    iconGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    iconBackground: 'rgba(17, 24, 39, 0.8)',
    iconColor: '#ffffff',
    titleColor: '#ffffff',
    descriptionColor: '#d1d5db',
    linkColor: '#a78bfa',
    cardMinWidth: '280px',
    cardMaxWidth: '100%',
    cardMinHeight: 'auto',
    cardPadding: '2rem',
    cardsAlignment: 'left',
    iconBorderEnabled: true,
    iconAlignment: 'left'
  };

  // Valores por defecto para valueAdded
  const defaultValueAddedLightStyles: CardDesignStyles = {
    background: 'rgba(255, 255, 255, 0.9)',
    border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    borderWidth: '2px',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    hoverBackground: 'rgba(255, 255, 255, 0.95)',
    hoverBorder: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    hoverShadow: '0 20px 40px rgba(139, 92, 246, 0.2)',
    iconGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    iconBackground: 'rgba(255, 255, 255, 0.9)',
    iconColor: '#7528ee',
    titleColor: '#FFFFFF',
    descriptionColor: '#E5E7EB',
    linkColor: '#22d3ee',
    cardMinWidth: '280px',
    cardMaxWidth: '350px',
    cardMinHeight: '200px',
    cardPadding: '2rem',
    cardsAlignment: 'center',
    iconBorderEnabled: false,
    iconAlignment: 'center'
  };

  const defaultValueAddedDarkStyles: CardDesignStyles = {
    background: 'rgba(255, 255, 255, 0.9)',
    border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    borderWidth: '2px',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    hoverBackground: 'rgba(255, 255, 255, 0.95)',
    hoverBorder: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    hoverShadow: '0 20px 40px rgba(139, 92, 246, 0.3)',
    iconGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    iconBackground: 'rgba(17, 24, 39, 0.8)',
    iconColor: '#ffffff',
    titleColor: '#FFFFFF',
    descriptionColor: '#E5E7EB',
    linkColor: '#a78bfa',
    cardMinWidth: '280px',
    cardMaxWidth: '350px',
    cardMinHeight: '200px',
    cardPadding: '2rem',
    cardsAlignment: 'center',
    iconBorderEnabled: false,
    iconAlignment: 'center'
  };

  // Seleccionar los defaults según la sección
  const defaultLightStyles = section === 'solutions' ? defaultSolutionsLightStyles : defaultValueAddedLightStyles;
  const defaultDarkStyles = section === 'solutions' ? defaultSolutionsDarkStyles : defaultValueAddedDarkStyles;

  // Estados locales para preview
  const [localLightStyles, setLocalLightStyles] = useState<CardDesignStyles>(() => ({
    ...defaultLightStyles,
    ...(pageData.content[section]?.cardsDesign?.light || {}),
    // Asegurar campos específicos
    cardsAlignment: pageData.content[section]?.cardsDesign?.light?.cardsAlignment || defaultLightStyles.cardsAlignment,
    iconAlignment: pageData.content[section]?.cardsDesign?.light?.iconAlignment || defaultLightStyles.iconAlignment
  }));

  const [localDarkStyles, setLocalDarkStyles] = useState<CardDesignStyles>(() => ({
    ...defaultDarkStyles,
    ...(pageData.content[section]?.cardsDesign?.dark || {}),
    // Asegurar campos específicos
    cardsAlignment: pageData.content[section]?.cardsDesign?.dark?.cardsAlignment || defaultDarkStyles.cardsAlignment,
    iconAlignment: pageData.content[section]?.cardsDesign?.dark?.iconAlignment || defaultDarkStyles.iconAlignment
  }));

  // Actualizar estado local cuando cambie pageData
  useEffect(() => {
    if (pageData.content[section]?.cardsDesign) {
      setLocalLightStyles({
        ...defaultLightStyles,
        ...(pageData.content[section].cardsDesign.light || {}),
        // Asegurar campos específicos
        cardsAlignment: pageData.content[section].cardsDesign.light?.cardsAlignment || defaultLightStyles.cardsAlignment,
        iconAlignment: pageData.content[section].cardsDesign.light?.iconAlignment || defaultLightStyles.iconAlignment
      });
      setLocalDarkStyles({
        ...defaultDarkStyles,
        ...(pageData.content[section].cardsDesign.dark || {}),
        // Asegurar campos específicos
        cardsAlignment: pageData.content[section].cardsDesign.dark?.cardsAlignment || defaultDarkStyles.cardsAlignment,
        iconAlignment: pageData.content[section].cardsDesign.dark?.iconAlignment || defaultDarkStyles.iconAlignment
      });
    }
  }, [pageData._id, section]); // Solo cuando cambia el ID del documento o la sección

  // Obtener estilos actuales del estado local según el tema activo
  const currentStyles = activeTheme === 'light' ? localLightStyles : localDarkStyles;
  
  // Asegurar tipos correctos para evitar errores de undefined
  const safeCurrentStyles = currentStyles as StrictCardDesignStyles;

  const updateCardStyle = (field: keyof CardDesignStyles, value: string | boolean) => {
    // Actualizar estado local inmediatamente (para vista previa)
    if (activeTheme === 'light') {
      setLocalLightStyles(prev => ({ ...prev, [field]: value }));
    } else {
      setLocalDarkStyles(prev => ({ ...prev, [field]: value }));
    }

    // Marcar como cambios pendientes
    setHasUnsavedChanges(true);
  };

  // Función para guardar los cambios al padre (llamada por el botón Guardar)
  const saveChanges = () => {
    updateContent(`${section}.cardsDesign.light`, localLightStyles);
    updateContent(`${section}.cardsDesign.dark`, localDarkStyles);
    setHasUnsavedChanges(false);
  };

  // Exponer saveChanges para que CmsManager pueda llamarlo
  useEffect(() => {
    if (hasUnsavedChanges) {
      (window as any)[`__${section}CardDesignSave`] = saveChanges;
    }
    return () => {
      delete (window as any)[`__${section}CardDesignSave`];
    };
  }, [hasUnsavedChanges, localLightStyles, localDarkStyles, section]);

  const resetToDefaults = () => {
    const defaults = activeTheme === 'light' ? defaultLightStyles : defaultDarkStyles;
    
    // Actualizar estado local
    if (activeTheme === 'light') {
      setLocalLightStyles(defaults);
    } else {
      setLocalDarkStyles(defaults);
    }
    
    setHasUnsavedChanges(true);
  };

  // Función para aplicar los valores transparentes a AMBOS temas
  const applyTransparentDefaults = () => {
    setLocalLightStyles(defaultLightStyles);
    setLocalDarkStyles(defaultDarkStyles);
    
    updateContent(`${section}.cardsDesign.light`, defaultLightStyles);
    updateContent(`${section}.cardsDesign.dark`, defaultDarkStyles);
    
    setHasUnsavedChanges(false);
  };

  // Cleanup del timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 border border-gray-100 dark:border-gray-700/50 mb-3">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center">
            {icon} {title}
          </h3>
          {hasUnsavedChanges && (
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 text-xs font-medium rounded-full">
              ⚠️ Cambios sin guardar
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={applyTransparentDefaults}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors duration-200"
            title="Aplicar diseño transparente a ambos temas y guardar"
          >
            ✨ Aplicar Transparencia
          </button>
          <button
            onClick={resetToDefaults}
            className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-xs font-medium transition-colors duration-200"
            title={`Restaurar valores por defecto para tema ${activeTheme}`}
          >
            🔄 Restaurar por defecto
          </button>
        </div>
      </div>

      {/* Theme Tabs */}
      <div className="flex mb-3">
        <button
          onClick={() => setActiveTheme('light')}
          className={`flex-1 py-2 px-4 rounded-l-lg font-medium transition-all duration-200 ${
            activeTheme === 'light'
              ? 'bg-yellow-500 text-white shadow-md'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          ☀️ Tema Claro
        </button>
        <button
          onClick={() => setActiveTheme('dark')}
          className={`flex-1 py-2 px-4 rounded-r-lg font-medium transition-all duration-200 ${
            activeTheme === 'dark'
              ? 'bg-gray-800 text-white shadow-md'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          🌙 Tema Oscuro
        </button>
      </div>

      {/* Preview Card */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          👀 Vista Previa en Tiempo Real
        </h4>
        <div 
          className="relative rounded-2xl overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1 max-w-xs mx-auto"
          style={{
            background: safeCurrentStyles.background,
            boxShadow: safeCurrentStyles.shadow,
            padding: safeCurrentStyles.cardPadding,
            minWidth: safeCurrentStyles.cardMinWidth,
            minHeight: safeCurrentStyles.cardMinHeight
          }}
        >
          {/* Border gradient */}
          <div 
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: safeCurrentStyles.border,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              padding: safeCurrentStyles.borderWidth
            }}
          />
          
          {/* Icon preview */}
          {safeCurrentStyles.iconBorderEnabled && (
            <div className={`mb-4 flex ${safeCurrentStyles.iconAlignment === 'center' ? 'justify-center' : safeCurrentStyles.iconAlignment === 'right' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                style={{
                  background: safeCurrentStyles.iconBackground,
                  border: `2px solid ${safeCurrentStyles.iconColor}`
                }}
              >
                💡
              </div>
            </div>
          )}

          {/* Title */}
          <h3 
            className="text-lg font-bold mb-2"
            style={{ 
              color: safeCurrentStyles.titleColor,
              textAlign: safeCurrentStyles.iconAlignment || 'left'
            }}
          >
            Título de Ejemplo
          </h3>

          {/* Description */}
          <p 
            className="text-sm"
            style={{ 
              color: safeCurrentStyles.descriptionColor,
              textAlign: safeCurrentStyles.iconAlignment || 'left'
            }}
          >
            Esta es una descripción de ejemplo para mostrar cómo se verá el diseño de la tarjeta.
          </p>
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Background */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              🎨 Fondo de Tarjeta
            </label>
            <ColorWithOpacity
              label="Fondo de Tarjeta"
              value={safeCurrentStyles.background}
              onChange={(value) => updateCardStyle('background', value)}
            />
          </div>

          {/* Border */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              🔳 Borde
            </label>
            <GradientPicker
              label="Borde"
              value={safeCurrentStyles.border}
              onChange={(value) => updateCardStyle('border', value)}
            />
          </div>

          {/* Border Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              📏 Grosor del Borde
            </label>
            <select
              value={safeCurrentStyles.borderWidth}
              onChange={(e) => updateCardStyle('borderWidth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="0px">Sin borde</option>
              <option value="1px">1px</option>
              <option value="2px">2px</option>
              <option value="3px">3px</option>
              <option value="4px">4px</option>
            </select>
          </div>

          {/* Shadow */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              🌫️ Sombra
            </label>
            <ShadowControl
              label="Sombra"
              value={safeCurrentStyles.shadow}
              onChange={(value) => updateCardStyle('shadow', value)}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Title Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              📝 Color del Título
            </label>
            <ColorWithOpacity
              label="Color del Título"
              value={safeCurrentStyles.titleColor}
              onChange={(value) => updateCardStyle('titleColor', value)}
            />
          </div>

          {/* Description Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              📄 Color de Descripción
            </label>
            <ColorWithOpacity
              label="Color de Descripción"
              value={safeCurrentStyles.descriptionColor || 'rgba(107, 114, 128, 1)'}
              onChange={(value) => updateCardStyle('descriptionColor', value)}
            />
          </div>

          {/* Cards Alignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              🔀 Alineación de Tarjetas
            </label>
            <select
              value={safeCurrentStyles.cardsAlignment}
              onChange={(e) => updateCardStyle('cardsAlignment', e.target.value as 'left' | 'center' | 'right')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="left">🔗 Izquierda</option>
              <option value="center">🎯 Centrado</option>
              <option value="right">🔗 Derecha</option>
            </select>
          </div>

          {/* Icon Alignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              🎯 Alineación de Contenido
            </label>
            <select
              value={safeCurrentStyles.iconAlignment}
              onChange={(e) => updateCardStyle('iconAlignment', e.target.value as 'left' | 'center' | 'right')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="left">🔗 Izquierda</option>
              <option value="center">🎯 Centrado</option>
              <option value="right">🔗 Derecha</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Options Toggle */}
      <div className="mt-6">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {showAdvanced ? '🔼' : '🔽'} Opciones Avanzadas
        </button>
      </div>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Card Dimensions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                📐 Ancho Mínimo
              </label>
              <input
                type="text"
                value={safeCurrentStyles.cardMinWidth}
                onChange={(e) => updateCardStyle('cardMinWidth', e.target.value)}
                placeholder="280px"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                📐 Ancho Máximo
              </label>
              <input
                type="text"
                value={safeCurrentStyles.cardMaxWidth}
                onChange={(e) => updateCardStyle('cardMaxWidth', e.target.value)}
                placeholder="100%"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                📏 Padding
              </label>
              <input
                type="text"
                value={safeCurrentStyles.cardPadding}
                onChange={(e) => updateCardStyle('cardPadding', e.target.value)}
                placeholder="2rem"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Icon Border Toggle */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={safeCurrentStyles.iconBorderEnabled}
                  onChange={(e) => updateCardStyle('iconBorderEnabled', e.target.checked)}
                  className="mr-2 w-4 h-4 text-purple-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500 focus:ring-1"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  🔘 Mostrar borde en iconos
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      {hasUnsavedChanges && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={saveChanges}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            💾 Guardar Cambios
          </button>
        </div>
      )}
    </div>
  );
};

export default GenericCardsDesignConfig;