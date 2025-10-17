import React, { useState, useRef, useEffect } from 'react';
import type { PageData, CardDesignStyles } from '../../types/cms';
import ColorWithOpacity from './ColorWithOpacity';
import GradientPicker from './GradientPicker';
import ShadowControl from './ShadowControl';

interface CardsDesignConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
}

const CardsDesignConfigSection: React.FC<CardsDesignConfigSectionProps> = ({
  pageData,
  updateContent
}) => {
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // Valores por defecto
  const defaultLightStyles: CardDesignStyles = {
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
    iconBorderEnabled: true,
    iconAlignment: 'left'
  };

  const defaultDarkStyles: CardDesignStyles = {
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
    iconBorderEnabled: true,
    iconAlignment: 'left'
  };

  // Estado local temporal para los estilos que se están editando
  const [localLightStyles, setLocalLightStyles] = useState<CardDesignStyles>(() => ({
    ...defaultLightStyles,
    ...(pageData.content.solutions.cardsDesign?.light || {}),
    // Asegurar que iconAlignment siempre tenga un valor
    iconAlignment: pageData.content.solutions.cardsDesign?.light?.iconAlignment || 'left'
  }));
  const [localDarkStyles, setLocalDarkStyles] = useState<CardDesignStyles>(() => ({
    ...defaultDarkStyles,
    ...(pageData.content.solutions.cardsDesign?.dark || {}),
    // Asegurar que iconAlignment siempre tenga un valor
    iconAlignment: pageData.content.solutions.cardsDesign?.dark?.iconAlignment || 'left'
  }));

  // Sincronizar estado local cuando cambia pageData desde la DB (solo una vez al montar o cuando cambia significativamente)
  useEffect(() => {
    if (pageData.content.solutions.cardsDesign) {
      setLocalLightStyles({
        ...defaultLightStyles,
        ...(pageData.content.solutions.cardsDesign.light || {}),
        // Asegurar que iconAlignment siempre tenga un valor
        iconAlignment: pageData.content.solutions.cardsDesign.light?.iconAlignment || 'left'
      });
      setLocalDarkStyles({
        ...defaultDarkStyles,
        ...(pageData.content.solutions.cardsDesign.dark || {}),
        // Asegurar que iconAlignment siempre tenga un valor
        iconAlignment: pageData.content.solutions.cardsDesign.dark?.iconAlignment || 'left'
      });
    }
  }, [pageData._id]); // Solo cuando cambia el ID del documento

  // Obtener estilos actuales del estado local según el tema activo
  const currentStyles = activeTheme === 'light' ? localLightStyles : localDarkStyles;

  const updateCardStyle = (field: keyof CardDesignStyles, value: string | boolean) => {
    // Actualizar estado local inmediatamente (para vista previa)
    if (activeTheme === 'light') {
      setLocalLightStyles(prev => ({ ...prev, [field]: value }));
    } else {
      setLocalDarkStyles(prev => ({ ...prev, [field]: value }));
    }

    // Marcar como cambios pendientes
    setHasUnsavedChanges(true);
    
    // NO actualizamos el padre automáticamente
    // Los cambios solo se guardan cuando el usuario hace click en "Guardar"
  };

  // Función para guardar los cambios al padre (llamada por el botón Guardar)
  const saveChanges = () => {
    console.log(`🔍 CardsDesignConfigSection - Guardando cambios:`, {
      localLightStyles: localLightStyles.iconAlignment,
      localDarkStyles: localDarkStyles.iconAlignment,
      fullLightStyles: localLightStyles,
      fullDarkStyles: localDarkStyles
    });
    
    // Guardar ambos temas
    updateContent('solutions.cardsDesign.light', localLightStyles);
    updateContent('solutions.cardsDesign.dark', localDarkStyles);
    setHasUnsavedChanges(false);
  };

  // Exponer saveChanges para que CmsManager pueda llamarlo
  useEffect(() => {
    // Guardar referencia en el componente padre si hay cambios pendientes
    if (hasUnsavedChanges) {
      // Esta función será llamada cuando se presione "Guardar" en CmsManager
      (window as any).__cardDesignSave = saveChanges;
    }
    return () => {
      delete (window as any).__cardDesignSave;
    };
  }, [hasUnsavedChanges, localLightStyles, localDarkStyles]);

  const resetToDefaults = () => {
    const defaults = activeTheme === 'light' ? defaultLightStyles : defaultDarkStyles;
    
    // Actualizar estado local
    if (activeTheme === 'light') {
      setLocalLightStyles(defaults);
    } else {
      setLocalDarkStyles(defaults);
    }
    
    // Marcar como cambios pendientes para que se guarde al hacer click en Guardar
    setHasUnsavedChanges(true);
  };

  // Función para aplicar los valores transparentes a AMBOS temas
  const applyTransparentDefaults = () => {
    // Aplicar valores transparentes a ambos temas
    setLocalLightStyles(defaultLightStyles);
    setLocalDarkStyles(defaultDarkStyles);
    
    // Guardar inmediatamente
    updateContent('solutions.cardsDesign.light', defaultLightStyles);
    updateContent('solutions.cardsDesign.dark', defaultDarkStyles);
    
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
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            🎨 Diseño de Tarjetas
          </h2>
          {hasUnsavedChanges && (
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 text-xs font-medium rounded-full">
              ⚠️ Cambios sin guardar
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={applyTransparentDefaults}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
            title="Aplicar diseño transparente a ambos temas y guardar"
          >
            ✨ Aplicar Transparencia
          </button>
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
          >
            🔄 Restaurar por defecto
          </button>
        </div>
      </div>

      {/* Theme Selector */}
      <div className="mb-6">
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTheme('light')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTheme === 'light'
                ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            🌞 Tema Claro
          </button>
          <button
            onClick={() => setActiveTheme('dark')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTheme === 'dark'
                ? 'bg-gray-800 text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            🌙 Tema Oscuro
          </button>
        </div>
      </div>

      {/* Preview Card */}
      <div className="mb-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          👁️ Vista Previa en Tiempo Real
        </h3>
        <div
          key={`preview-${activeTheme}-${JSON.stringify(currentStyles)}`}
          className="group relative rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden"
          style={{
            background: currentStyles.background,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: currentStyles.shadow,
            minWidth: currentStyles.cardMinWidth || '280px',
            maxWidth: currentStyles.cardMaxWidth || '100%',
            minHeight: currentStyles.cardMinHeight || 'auto',
            padding: currentStyles.cardPadding || '2rem'
          }}
          onMouseEnter={(e) => {
            const card = e.currentTarget;
            card.style.background = currentStyles.hoverBackground;
            card.style.boxShadow = currentStyles.hoverShadow;
            const borderEl = card.querySelector('.card-border') as HTMLElement;
            if (borderEl) {
              borderEl.style.background = currentStyles.hoverBorder;
            }
          }}
          onMouseLeave={(e) => {
            const card = e.currentTarget;
            card.style.background = currentStyles.background;
            card.style.boxShadow = currentStyles.shadow;
            const borderEl = card.querySelector('.card-border') as HTMLElement;
            if (borderEl) {
              borderEl.style.background = currentStyles.border;
            }
          }}
        >
          {/* Borde con soporte para degradados */}
          <div 
            className="card-border absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300"
            style={{
              background: currentStyles.border,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              padding: currentStyles.borderWidth
            }}
          />
          {/* Icon Preview */}
          {currentStyles.iconBorderEnabled !== false ? (
            <div
              className="relative mb-6 w-16 h-16 rounded-xl p-0.5"
              style={{ background: currentStyles.iconGradient }}
            >
              <div
                className="w-full h-full rounded-xl flex items-center justify-center text-3xl"
                style={{
                  background: currentStyles.iconBackground,
                  color: currentStyles.iconColor
                }}
              >
                💡
              </div>
            </div>
          ) : (
            <div className="relative mb-6 w-16 h-16 flex items-center justify-center text-3xl"
                 style={{ color: currentStyles.iconColor }}>
              💡
            </div>
          )}

          {/* Content Preview */}
          <h4
            className="text-2xl font-bold mb-4"
            style={{ color: currentStyles.titleColor }}
          >
            Título de Ejemplo
          </h4>
          <p
            className="leading-relaxed mb-4"
            style={{ color: currentStyles.descriptionColor }}
          >
            Esta es una descripción de ejemplo para mostrar cómo se verá el diseño de la tarjeta.
          </p>

          {/* Link Preview */}
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span
              className="text-sm font-medium mr-2"
              style={{ color: currentStyles.linkColor }}
            >
              Conocer más
            </span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: currentStyles.linkColor }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Simple Mode Configuration */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          🎨 Configuración Simple
        </h3>

        {/* Fondo y Borde - Grid de 2 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Fondo de Tarjeta */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <ColorWithOpacity
              label="Fondo de Tarjeta"
              value={currentStyles.background}
              onChange={(value) => updateCardStyle('background', value)}
            />
          </div>

          {/* Borde de Tarjeta */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <GradientPicker
              label="Borde de Tarjeta"
              value={currentStyles.border}
              onChange={(value) => updateCardStyle('border', value)}
            />
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Grosor del Borde
              </label>
              <select
                value={currentStyles.borderWidth}
                onChange={(e) => updateCardStyle('borderWidth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="0px">Sin borde</option>
                <option value="1px">Fino (1px)</option>
                <option value="2px">Medio (2px)</option>
                <option value="3px">Grueso (3px)</option>
                <option value="4px">Muy grueso (4px)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Colores de Texto - Grid de 2 columnas */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
            ✏️ Colores de Texto
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Color del Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color del Título
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={currentStyles.titleColor}
                  onChange={(e) => updateCardStyle('titleColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={currentStyles.titleColor}
                  onChange={(e) => updateCardStyle('titleColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Color de la Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color de la Descripción
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={currentStyles.descriptionColor}
                  onChange={(e) => updateCardStyle('descriptionColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={currentStyles.descriptionColor}
                  onChange={(e) => updateCardStyle('descriptionColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Color del "Conocer más" */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color del "Conocer más"
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={currentStyles.linkColor}
                  onChange={(e) => updateCardStyle('linkColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={currentStyles.linkColor}
                  onChange={(e) => updateCardStyle('linkColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Estilos del Icono - Grid de 2 columnas */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
            🎯 Estilos del Icono
          </h4>

          {/* Toggle para Mostrar/Ocultar Borde */}
          <div className="mb-4 flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                🖼️ Mostrar Borde del Icono
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                (contenedor con gradiente)
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={currentStyles.iconBorderEnabled === true}
                onChange={(e) => updateCardStyle('iconBorderEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Alineación del Icono */}
          <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              📍 Alineación del Icono
            </label>
            <div className="flex gap-2">
              {[
                { value: 'left', label: '⬅️ Izquierda', icon: '⬅️' },
                { value: 'center', label: '⚡ Centro', icon: '⚡' },
                { value: 'right', label: '➡️ Derecha', icon: '➡️' }
              ].map(({ value, icon }) => (
                <button
                  key={value}
                  onClick={() => updateCardStyle('iconAlignment', value)}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                    (currentStyles.iconAlignment || 'left') === value
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="text-xs">{icon}</span>
                  <div className="text-xs font-medium mt-1">{value.charAt(0).toUpperCase() + value.slice(1)}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Gradiente del Borde */}
            <div>
              <GradientPicker
                label="Gradiente del Borde del Icono"
                value={currentStyles.iconGradient}
                onChange={(value) => updateCardStyle('iconGradient', value)}
              />
            </div>

            {/* Color del Icono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color del Icono
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={currentStyles.iconColor}
                  onChange={(e) => updateCardStyle('iconColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={currentStyles.iconColor}
                  onChange={(e) => updateCardStyle('iconColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Fondo del Contenedor - Ancho completo */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fondo del Contenedor del Icono
              </label>
              <input
                type="text"
                value={currentStyles.iconBackground}
                onChange={(e) => updateCardStyle('iconBackground', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="rgba(255, 255, 255, 0.9)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Mode Toggle */}
      <div className="mt-8">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors duration-200 flex items-center justify-between"
        >
          <span>⚙️ Opciones Avanzadas</span>
          <span className="text-xl">{showAdvanced ? '▼' : '▶'}</span>
        </button>
      </div>

      {/* Advanced Mode Configuration */}
      {showAdvanced && (
        <div className="mt-6 space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            ⚙️ Configuración Avanzada
          </h3>

          {/* Grid de 2 columnas para Tamaño y Sombras */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tamaño de Tarjetas */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
                📏 Tamaño de Tarjetas
              </h4>
              <div className="space-y-4">
                {/* Ancho Mínimo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ancho Mínimo
                  </label>
                  <input
                    type="text"
                    value={currentStyles.cardMinWidth || '280px'}
                    onChange={(e) => updateCardStyle('cardMinWidth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="280px"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Ej: 280px, 300px, 20rem
                  </p>
                </div>

                {/* Ancho Máximo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ancho Máximo
                  </label>
                  <input
                    type="text"
                    value={currentStyles.cardMaxWidth || '100%'}
                    onChange={(e) => updateCardStyle('cardMaxWidth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="100%"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Ej: 100%, 400px, 30rem
                  </p>
                </div>

                {/* Alto Mínimo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Alto Mínimo
                  </label>
                  <input
                    type="text"
                    value={currentStyles.cardMinHeight || 'auto'}
                    onChange={(e) => updateCardStyle('cardMinHeight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="auto"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Ej: auto, 400px, 30rem
                  </p>
                </div>

                {/* Padding */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Espaciado Interno
                  </label>
                  <input
                    type="text"
                    value={currentStyles.cardPadding || '2rem'}
                    onChange={(e) => updateCardStyle('cardPadding', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="2rem"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Ej: 1rem, 2rem, 32px
                  </p>
                </div>
              </div>
            </div>

            {/* Sombras */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
                🌑 Sombras
              </h4>
              <ShadowControl
                label="Sombra Normal"
                value={currentStyles.shadow}
                onChange={(value) => updateCardStyle('shadow', value)}
              />
            </div>
          </div>

          {/* Efectos Hover - Ancho completo con grid interno */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
              🖱️ Efectos Hover
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fondo y Borde Hover */}
              <div className="space-y-6">
                <ColorWithOpacity
                  label="Fondo (Hover)"
                  value={currentStyles.hoverBackground}
                  onChange={(value) => updateCardStyle('hoverBackground', value)}
                />

                <GradientPicker
                  label="Borde (Hover)"
                  value={currentStyles.hoverBorder}
                  onChange={(value) => updateCardStyle('hoverBorder', value)}
                />
              </div>

              {/* Sombra Hover */}
              <div>
                <ShadowControl
                  label="Sombra (Hover)"
                  value={currentStyles.hoverShadow}
                  onChange={(value) => updateCardStyle('hoverShadow', value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
          💡 Consejos de Uso
        </h4>
        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
          <li><strong>Vista Previa en Tiempo Real:</strong> Los cambios se reflejan instantáneamente en la tarjeta de arriba</li>
          <li><strong>Guardado Manual:</strong> Los cambios NO se guardan automáticamente, debes hacer click en el botón "💾 Guardar"</li>
          <li><strong>Degradados en Bordes:</strong> Ahora los degradados funcionan correctamente en los bordes de las tarjetas</li>
          <li><strong>Prueba el Hover:</strong> Pasa el mouse sobre la vista previa para ver los efectos hover</li>
          <li><strong>Restaurar por Defecto:</strong> Usa el botón de restaurar para volver a los valores originales (recuerda guardar después)</li>
        </ul>
      </div>
    </div>
  );
};

export default CardsDesignConfigSection;
