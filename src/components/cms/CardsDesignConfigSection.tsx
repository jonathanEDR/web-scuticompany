import React, { useState, useEffect, useMemo } from 'react';
import type { PageData, CardDesignStyles } from '../../types/cms';
import ColorWithOpacity from './ColorWithOpacity';
import GradientPicker from './GradientPicker';
import ShadowControl from './ShadowControl';
import { updatePage } from '../../services/cmsApi';

interface CardsDesignConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
  setHasGlobalChanges: (value: boolean) => void; // 🔥 NUEVA PROP
}

const CardsDesignConfigSection: React.FC<CardsDesignConfigSectionProps> = ({
  pageData,
  setHasGlobalChanges // 🔥 RECIBIR LA FUNCIÓN
}) => {
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');
  const [activeSection, setActiveSection] = useState<'solutions' | 'valueAdded'>('solutions'); // 🔥 NUEVO: Selector de sección
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Valores por defecto para Solutions (mantener originales)
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

  // 🔥 NUEVO: Valores por defecto para Value Added
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
    titleColor: '#1F2937',
    descriptionColor: '#4B5563',
    linkColor: '#06B6D4',
    cardMinWidth: '280px',
    cardMaxWidth: '350px',
    cardMinHeight: '200px',
    cardPadding: '2rem',
    cardsAlignment: 'center',
    iconBorderEnabled: false,
    iconAlignment: 'center'
  };

  const defaultValueAddedDarkStyles: CardDesignStyles = {
    background: 'rgba(17, 24, 39, 0.9)',
    border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    borderWidth: '2px',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    hoverBackground: 'rgba(31, 41, 55, 0.95)',
    hoverBorder: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    hoverShadow: '0 20px 40px rgba(139, 92, 246, 0.3)',
    iconGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    iconBackground: 'rgba(17, 24, 39, 0.8)',
    iconColor: '#ffffff',
    titleColor: '#FFFFFF',
    descriptionColor: '#D1D5DB',
    linkColor: '#a78bfa',
    cardMinWidth: '280px',
    cardMaxWidth: '350px',
    cardMinHeight: '200px',
    cardPadding: '2rem',
    cardsAlignment: 'center',
    iconBorderEnabled: false,
    iconAlignment: 'center'
  };

  // 🔥 NUEVO: Data loader unificado para ambas secciones
  const initialData = useMemo(() => {
    let cardData;
    if (activeSection === 'solutions') {
      cardData = pageData.content.solutions.cardsDesign;
    } else {
      cardData = pageData.content.valueAdded?.cardsDesign;
    }
    return cardData;
  }, [pageData.content, activeSection]);

  // 🔥 NUEVO: Determinar defaults según la sección activa
  const currentDefaults = useMemo(() => {
    if (activeSection === 'solutions') {
      return { light: defaultSolutionsLightStyles, dark: defaultSolutionsDarkStyles };
    } else {
      return { light: defaultValueAddedLightStyles, dark: defaultValueAddedDarkStyles };
    }
  }, [activeSection]);

  // 🔥 NUEVO: Estados unificados SIN defaults automáticos
  const [lightStyles, setLightStyles] = useState<CardDesignStyles>(() => {
    // Solo cargar datos reales de BD, NO defaults
    return initialData?.light || {} as CardDesignStyles;
  });
  
  const [darkStyles, setDarkStyles] = useState<CardDesignStyles>(() => {
    // Solo cargar datos reales de BD, NO defaults  
    return initialData?.dark || {} as CardDesignStyles;
  });

  // 🔄 ACTUALIZAR: Solo cargar datos reales de BD, NO defaults automáticos
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    // No actualizar si acabamos de guardar (evitar sobreescritura)
    if (justSaved) {
      return; // No resetear justSaved aquí
    }
    // Solo cargar datos reales de BD
    const data = initialData?.light;
    if (data) {
      setLightStyles(data);
    }
  }, [initialData, activeSection, justSaved]);

  useEffect(() => {
    // No actualizar si acabamos de guardar (evitar sobreescritura)
    if (justSaved) {
      return;
    }
    // Solo cargar datos reales de BD
    const data = initialData?.dark;
    if (data) {
      setDarkStyles(data);
    }
  }, [initialData, activeSection, justSaved]);

  const currentStyles = activeTheme === 'light' ? lightStyles : darkStyles;

  const updateCardStyle = (field: keyof CardDesignStyles, value: string | boolean) => {
    if (activeTheme === 'light') {
      setLightStyles(prev => ({ ...prev, [field]: value }));
    } else {
      setDarkStyles(prev => ({ ...prev, [field]: value }));
    }
    // 🔥 CONECTAR CON EL SISTEMA GLOBAL
    setHasUnsavedChanges(true);
    setHasGlobalChanges(true); // ← ESTA ES LA CONEXIÓN CLAVE
  };

  // 🔥 NUEVO: Guardado directo usando updatePage (con autenticación automática)
  const saveChanges = async () => {
    try {
      // 🔧 SOLUCIÓN: Construir objeto completo con los datos actuales del estado
      const updatedContent = {
        ...pageData.content,
        [activeSection]: {
          ...pageData.content[activeSection],
          cardsDesign: {
            light: { ...lightStyles },  // ← Usar estado actual
            dark: { ...darkStyles }     // ← Usar estado actual
          }
        }
      };
      // 🔧 SOLUCIÓN: Usar updatePage que maneja autenticación automáticamente
      await updatePage('home', {
        content: updatedContent,
        seo: pageData.seo,
        theme: pageData.theme,
        isPublished: pageData.isPublished
      });
      // Marcar que acabamos de guardar para evitar recargas automáticas
      setJustSaved(true);
      setHasUnsavedChanges(false);
      setHasGlobalChanges(false); // ← LIMPIAR ESTADO GLOBAL
      // 🔧 NUEVO: Resetear flag después de un tiempo para permitir futuras recargas
      setTimeout(() => {
        setJustSaved(false);
      }, 2000); // 2 segundos de gracia
    } catch (error) {
      // No cambiar estados si falló el guardado
    }
  };

  // 🔥 NUEVO: Exponer función para el botón global de guardar
  useEffect(() => {
    (window as any).__cardsDesignSave = saveChanges;
    return () => {
      delete (window as any).__cardsDesignSave;
    };
  }, [lightStyles, darkStyles, activeSection, justSaved]);

  const resetToDefaults = () => {
    if (activeTheme === 'light') {
      setLightStyles(currentDefaults.light);
    } else {
      setDarkStyles(currentDefaults.dark);
    }
    setHasUnsavedChanges(true);
    setHasGlobalChanges(true);
  };

  const applyTransparentDefaults = () => {
    setLightStyles(currentDefaults.light);
    setDarkStyles(currentDefaults.dark);
    setHasUnsavedChanges(true);
    setHasGlobalChanges(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4 md:gap-0">
        {/* Left: Title, Section Selector, Status */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3 w-full md:w-auto">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
              🎨 Diseño de Tarjetas
            </h2>
            {/* 🔥 NUEVO: Selector de sección */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActiveSection('solutions')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeSection === 'solutions'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Solutions
              </button>
              <button
                onClick={() => setActiveSection('valueAdded')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeSection === 'valueAdded'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Value Added
              </button>
            </div>
          </div>
          {hasUnsavedChanges && (
            <span className="mt-2 md:mt-0 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 text-xs font-medium rounded-full self-start md:self-auto">
              ⚠️ Cambios sin guardar
            </span>
          )}
        </div>
        {/* Right: Action Buttons */}
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={applyTransparentDefaults}
            className="flex-1 md:flex-none px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
            title="Aplicar diseño transparente a ambos temas y guardar"
          >
            ✨ Aplicar Transparencia
          </button>
          <button
            onClick={resetToDefaults}
            className="flex-1 md:flex-none px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
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
      <div className="mb-8 px-2 sm:px-4 md:px-8 py-4 sm:py-6 flex justify-center">
        <div
          key={`preview-${activeTheme}-${currentStyles.cardMinWidth}-${currentStyles.cardPadding}-${currentStyles.cardsAlignment}`}
          className="group relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden"
          style={{
            background: currentStyles.background,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: currentStyles.shadow,
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
           <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          👁️ Vista Previa en Tiempo Real
        </h3>
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

    {/* Fondo y Borde - Responsive grid: 1 columna en móvil, 2 en md+ */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">

          {/* Fondo de Tarjeta */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-1">
            <ColorWithOpacity
              label="Fondo de Tarjeta"
              value={currentStyles.background}
              onChange={(value) => updateCardStyle('background', value)}
            />
          </div>

          {/* Borde de Tarjeta */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-1">
            <div className="w-full min-w-0">
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

            {/* Color del Icono */}
            <div>
  
            {/* Colores de Texto - Grid de 2 columnas */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-1">
              <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
                ✏️ Colores de Texto
              </h4>
              <div className="grid grid-cols-1 gap-4">

                {/* Color del Título */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color del Título
                  </label>
                  <div className="flex gap-2 w-full min-w-0">
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
                      className="flex-1 min-w-0 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>


                {/* Color de la Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color de la Descripción
                  </label>
                  <div className="flex gap-2 w-full min-w-0">
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
                      className="flex-1 min-w-0 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>


                {/* Color del "Conocer más" */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color del "Conocer más"
                  </label>
                  <div className="flex gap-2 w-full min-w-0">
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
                      className="flex-1 min-w-0 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>
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
            {/* Tamaño de Tarjetas - MEJORADO */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
                📏 Tamaño de Tarjetas
              </h4>
              
              {/* Presets Rápidos */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  🎯 Tamaños Predefinidos
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      updateCardStyle('cardMinWidth', '250px');
                      updateCardStyle('cardPadding', '1.5rem');
                    }}
                    className="px-3 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    📱 Pequeño
                  </button>
                  <button
                    onClick={() => {
                      updateCardStyle('cardMinWidth', '320px');
                      updateCardStyle('cardPadding', '2rem');
                    }}
                    className="px-3 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    💻 Mediano
                  </button>
                  <button
                    onClick={() => {
                      updateCardStyle('cardMinWidth', '400px');
                      updateCardStyle('cardPadding', '2.5rem');
                    }}
                    className="px-3 py-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    🖥️ Grande
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Ancho de Tarjetas - Slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    📐 Ancho Mínimo: <span className="font-mono text-blue-600 dark:text-blue-400">{currentStyles.cardMinWidth || '280px'}</span>
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="200"
                      max="500"
                      step="10"
                      value={parseInt(currentStyles.cardMinWidth?.replace('px', '') || '280')}
                      onChange={(e) => updateCardStyle('cardMinWidth', `${e.target.value}px`)}
                      className="w-full h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg appearance-none cursor-pointer hover:from-purple-600 hover:to-cyan-600 transition-all duration-200"
                      style={{
                        background: 'linear-gradient(to right, #8B5CF6, #06B6D4)',
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>200px (Muy pequeño)</span>
                      <span>350px (Ideal)</span>
                      <span>500px (Muy grande)</span>
                    </div>
                  </div>
                </div>

                {/* Alto de Tarjetas - Toggle + Slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    📏 Alto Mínimo
                  </label>
                  <div className="space-y-3">
                    {/* Toggle Auto/Manual */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateCardStyle('cardMinHeight', 'auto')}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          currentStyles.cardMinHeight === 'auto'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                        }`}
                      >
                        🔧 Automático
                      </button>
                      <button
                        onClick={() => updateCardStyle('cardMinHeight', '300px')}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          currentStyles.cardMinHeight !== 'auto'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                        }`}
                      >
                        📏 Manual: <span className="font-mono">{currentStyles.cardMinHeight !== 'auto' ? currentStyles.cardMinHeight : '300px'}</span>
                      </button>
                    </div>
                    
                    {/* Slider para altura manual */}
                    {currentStyles.cardMinHeight !== 'auto' && (
                      <div className="ml-4">
                        <input
                          type="range"
                          min="250"
                          max="600"
                          step="25"
                          value={parseInt(currentStyles.cardMinHeight?.replace('px', '') || '300')}
                          onChange={(e) => updateCardStyle('cardMinHeight', `${e.target.value}px`)}
                          className="w-full h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg appearance-none cursor-pointer hover:from-blue-600 hover:to-green-600 transition-all duration-200"
                          style={{
                            background: 'linear-gradient(to right, #3B82F6, #10B981)',
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>250px</span>
                          <span>425px</span>
                          <span>600px</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Espaciado Interno - Slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    📦 Espaciado Interno: <span className="font-mono text-purple-600 dark:text-purple-400">{currentStyles.cardPadding || '2rem'}</span>
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="1"
                      max="4"
                      step="0.25"
                      value={parseFloat(currentStyles.cardPadding?.replace('rem', '') || '2')}
                      onChange={(e) => updateCardStyle('cardPadding', `${e.target.value}rem`)}
                      className="w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg appearance-none cursor-pointer hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                      style={{
                        background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>1rem (Compacto)</span>
                      <span>2.5rem (Cómodo)</span>
                      <span>4rem (Espacioso)</span>
                    </div>
                  </div>
                </div>

                {/* Ancho Máximo - Simple select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ↔️ Ancho Máximo
                  </label>
                  <select
                    value={currentStyles.cardMaxWidth || '100%'}
                    onChange={(e) => updateCardStyle('cardMaxWidth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="100%">📱 Responsive (100%)</option>
                    <option value="400px">💻 Fijo Pequeño (400px)</option>
                    <option value="500px">🖥️ Fijo Mediano (500px)</option>
                    <option value="600px">📺 Fijo Grande (600px)</option>
                  </select>
                </div>

                {/* Alineación de Tarjetas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    🎯 Alineación de Tarjetas
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => updateCardStyle('cardsAlignment', 'left')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentStyles.cardsAlignment === 'left'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 ring-2 ring-blue-500'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                      }`}
                    >
                      ⬅️ Izquierda
                    </button>
                    <button
                      onClick={() => updateCardStyle('cardsAlignment', 'center')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentStyles.cardsAlignment === 'center'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 ring-2 ring-green-500'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                      }`}
                    >
                      ⬆️ Centro
                    </button>
                    <button
                      onClick={() => updateCardStyle('cardsAlignment', 'right')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentStyles.cardsAlignment === 'right'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 ring-2 ring-purple-500'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                      }`}
                    >
                      ➡️ Derecha
                    </button>
                  </div>
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
