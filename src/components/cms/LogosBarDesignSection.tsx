import React, { useState, useEffect, useCallback } from 'react';
import type { PageData, LogosBarDesignStyles } from '../../types/cms';
import ColorWithOpacity from './ColorWithOpacity';
import GradientPicker from './GradientPicker';
import ShadowControl from './ShadowControl';

interface LogosBarDesignSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
}

const LogosBarDesignSection: React.FC<LogosBarDesignSectionProps> = ({
  pageData,
  updateContent
}) => {
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 🎨 Valores por defecto para la barra de logos
  const defaultLightStyles: LogosBarDesignStyles = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
    borderColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: '1px',
    borderRadius: '1rem',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.05)',
    backdropBlur: true,
    disperseEffect: false,
    // 🆕 Configuraciones de animación por defecto
    animationsEnabled: true,
    rotationMode: 'individual',
    animationSpeed: 'normal',
    hoverEffects: true,
    hoverIntensity: 'normal',
    particleEffects: true,
    glowEffects: true,
    autoDetectTech: true,
    logoSize: 'medium',
    logoSpacing: 'normal',
    // 🔳 Configuración de formato
    logoFormat: 'rectangle',
    maxLogoWidth: 'medium',
    uniformSize: false
  };

  const defaultDarkStyles: LogosBarDesignStyles = {
    background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(31, 41, 55, 0.8) 100%)',
    borderColor: 'rgba(139, 92, 246, 0.25)',
    borderWidth: '1px',
    borderRadius: '1rem',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(255, 255, 255, 0.05)',
    backdropBlur: true,
    disperseEffect: false,
    // 🆕 Configuraciones de animación por defecto
    animationsEnabled: true,
    rotationMode: 'individual',
    animationSpeed: 'normal',
    hoverEffects: true,
    hoverIntensity: 'normal',
    particleEffects: true,
    glowEffects: true,
    autoDetectTech: true,
    logoSize: 'medium',
    logoSpacing: 'normal',
    // 🔳 Configuración de formato
    logoFormat: 'rectangle',
    maxLogoWidth: 'medium',
    uniformSize: false
  };

  // Estado local temporal para los estilos que se están editando
  const [localLightStyles, setLocalLightStyles] = useState<LogosBarDesignStyles>(() => ({
    ...defaultLightStyles,
    ...(pageData.content.valueAdded?.logosBarDesign?.light || {})
  }));
  
  const [localDarkStyles, setLocalDarkStyles] = useState<LogosBarDesignStyles>(() => ({
    ...defaultDarkStyles,
    ...(pageData.content.valueAdded?.logosBarDesign?.dark || {})
  }));

  // Sincronizar estados locales cuando pageData cambie (ej. al cargar desde BD)
  useEffect(() => {
    const newLightStyles = {
      ...defaultLightStyles,
      ...(pageData.content.valueAdded?.logosBarDesign?.light || {})
    };
    
    const newDarkStyles = {
      ...defaultDarkStyles,
      ...(pageData.content.valueAdded?.logosBarDesign?.dark || {})
    };
    
    setLocalLightStyles(newLightStyles);
    setLocalDarkStyles(newDarkStyles);
  }, [pageData.content.valueAdded?.logosBarDesign]);

  // Obtener estilos actuales del estado local según el tema activo
  const currentStyles = activeTheme === 'light' ? localLightStyles : localDarkStyles;
  
  // 🐛 LOG CMS: Ver estilos actuales del selector
  console.log('🎨 DEBUG CMS - Estilos actuales del selector:', {
    activeTheme,
    currentStyles: {
      rotationMode: currentStyles.rotationMode,
      animationsEnabled: currentStyles.animationsEnabled,
      animationSpeed: currentStyles.animationSpeed,
      logoFormat: currentStyles.logoFormat
    }
  });

  const updateBarStyle = (field: keyof LogosBarDesignStyles, value: string | boolean) => {
    // 🐛 LOG CMS: Ver qué se está cambiando
    console.log('🔧 DEBUG CMS - Cambiando configuración:', {
      field,
      value,
      activeTheme,
      path: `valueAdded.logosBarDesign.${activeTheme}.${field}`
    });

    // Actualizar estado local inmediatamente (para vista previa)
    if (activeTheme === 'light') {
      setLocalLightStyles(prev => {
        const newStyles = { ...prev, [field]: value };
        console.log('💡 DEBUG CMS - Nuevos estilos Light:', newStyles);
        return newStyles;
      });
    } else {
      setLocalDarkStyles(prev => {
        const newStyles = { ...prev, [field]: value };
        console.log('🌙 DEBUG CMS - Nuevos estilos Dark:', newStyles);
        return newStyles;
      });
    }

    // También actualizar pageData inmediatamente para sincronización completa
    const currentPath = `valueAdded.logosBarDesign.${activeTheme}.${field}`;
    updateContent(currentPath, value);

    // Marcar como cambios pendientes
    setHasUnsavedChanges(true);
  };

  // Función para guardar los cambios al padre (llamada por el botón Guardar global)
  const saveChanges = useCallback(() => {
    // Guardar valores COMPLETOS - AMBOS TEMAS SIEMPRE
    // Esto asegura que toda la configuración se persista correctamente
    const completeLogosBarDesign = {
      light: { ...localLightStyles },
      dark: { ...localDarkStyles }
    };
    
    // 🐛 LOG GUARDAR: Ver qué se está guardando
    console.log('💾 DEBUG GUARDAR - Configuración completa a guardar:', {
      completeLogosBarDesign,
      lightRotationMode: completeLogosBarDesign.light.rotationMode,
      darkRotationMode: completeLogosBarDesign.dark.rotationMode
    });
    
    // Actualizar la configuración completa de una vez
    updateContent('valueAdded.logosBarDesign', completeLogosBarDesign);
    
    setHasUnsavedChanges(false);
  }, [localLightStyles, localDarkStyles, updateContent]);

  // Exponer saveChanges para que CmsManager pueda llamarlo
  useEffect(() => {
    (window as any).__logosBarDesignSave = saveChanges;
    
    return () => {
      delete (window as any).__logosBarDesignSave;
    };
  }, [saveChanges]);

  const resetToDefaults = () => {
    const defaults = activeTheme === 'light' ? defaultLightStyles : defaultDarkStyles;
    
    // Actualizar estado local
    if (activeTheme === 'light') {
      setLocalLightStyles(defaults);
      // También actualizar pageData inmediatamente
      updateContent('valueAdded.logosBarDesign.light', defaults);
    } else {
      setLocalDarkStyles(defaults);
      // También actualizar pageData inmediatamente
      updateContent('valueAdded.logosBarDesign.dark', defaults);
    }
    
    // Marcar como cambios pendientes
    setHasUnsavedChanges(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">🎨</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Diseño de la Barra de Logos
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Personaliza el estilo de la barra que contiene los logos
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={resetToDefaults}
            className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
            title="Restaurar valores por defecto del tema actual"
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

      {/* Vista Previa */}
      <div className="mb-8">
        <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          👁️ Vista Previa - Tema {activeTheme === 'light' ? 'Claro' : 'Oscuro'}
        </h4>
        
        <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl relative overflow-hidden">
          {/* Simulación del fondo de la sección */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-cyan-900/20"></div>
          
          {/* Preview de la barra */}
          <div className="relative">
            <div 
              className={`relative ${currentStyles.backdropBlur ? 'backdrop-blur-sm' : ''}`}
              style={{
                background: currentStyles.background,
                border: `${currentStyles.borderWidth} solid ${currentStyles.borderColor}`,
                borderRadius: currentStyles.borderRadius,
                boxShadow: currentStyles.shadow,
                padding: '1.5rem 3rem',
                // Efectos de dispersión con máscara de degradado en las puntas
                ...(currentStyles.disperseEffect && {
                  maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                })
              }}
            >
              <div className="flex justify-center items-center gap-8">
                {/* Logos de ejemplo */}
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                  SQL
                </div>
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                  JS
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                  PY
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controles de configuración */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna izquierda */}
        <div className="space-y-6">
          {/* Fondo */}
          <div>
            <GradientPicker
              key={`background-${activeTheme}`}
              label="Fondo de la Barra"
              value={currentStyles.background}
              onChange={(value) => updateBarStyle('background', value)}
            />
          </div>

          {/* Color del borde */}
          <div>
            <ColorWithOpacity
              label="Color del Borde"
              value={currentStyles.borderColor}
              onChange={(value) => updateBarStyle('borderColor', value)}
            />
          </div>

          {/* Grosor del borde */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Grosor del Borde
            </label>
            <select
              value={currentStyles.borderWidth}
              onChange={(e) => updateBarStyle('borderWidth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="0px">Sin borde</option>
              <option value="1px">1px</option>
              <option value="2px">2px</option>
              <option value="3px">3px</option>
            </select>
          </div>
        </div>

        {/* Columna derecha */}
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
                value={parseFloat(currentStyles.borderRadius.replace('rem', ''))}
                onChange={(e) => updateBarStyle('borderRadius', `${e.target.value}rem`)}
                className="w-full"
              />
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {currentStyles.borderRadius} ({Math.round(parseFloat(currentStyles.borderRadius.replace('rem', '')) * 16)}px)
              </div>
            </div>
          </div>

          {/* Sombra */}
          <div>
            <ShadowControl
              label="Sombra"
              value={currentStyles.shadow}
              onChange={(value) => updateBarStyle('shadow', value)}
            />
          </div>

          {/* Opciones adicionales */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Efecto Backdrop Blur
              </label>
              <button
                onClick={() => updateBarStyle('backdropBlur', !currentStyles.backdropBlur)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  currentStyles.backdropBlur ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    currentStyles.backdropBlur ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Efecto de Dispersión en Puntas
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                  Desvanece gradualmente los bordes izquierdo y derecho
                </span>
              </label>
              <button
                onClick={() => updateBarStyle('disperseEffect', !currentStyles.disperseEffect)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  currentStyles.disperseEffect ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    currentStyles.disperseEffect ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* 🎬 Configuración de Animaciones */}
            <div className="space-y-6 border-t border-gray-200 dark:border-gray-600 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                🎬 Configuración de Animaciones
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Activar/Desactivar Animaciones */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Activar Animaciones
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Habilita todos los efectos de animación
                    </p>
                  </div>
                  <button
                    onClick={() => updateBarStyle('animationsEnabled', !currentStyles.animationsEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      currentStyles.animationsEnabled ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        currentStyles.animationsEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Modo de Rotación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Modo de Rotación
                  </label>
                  <select
                    value={currentStyles.rotationMode || 'individual'}
                    onChange={(e) => updateBarStyle('rotationMode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                    disabled={!currentStyles.animationsEnabled}
                  >
                    <option value="none">
                      Sin animaciones{(currentStyles.rotationMode || 'individual') === 'none' ? ' (actual)' : ''}
                    </option>
                    <option value="individual">
                      Efectos elegantes individuales{(currentStyles.rotationMode || 'individual') === 'individual' ? ' (actual)' : ''}
                    </option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {currentStyles.rotationMode === 'individual' && '✨ Efectos suaves adaptados por categoría: rebote, pulso, flotación, brillo'}
                    {currentStyles.rotationMode === 'none' && '🚫 Sin efectos de animación'}
                  </p>
                </div>

                {/* Velocidad de Animación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Velocidad de Animación
                  </label>
                  <select
                    value={currentStyles.animationSpeed || 'normal'}
                    onChange={(e) => updateBarStyle('animationSpeed', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                    disabled={!currentStyles.animationsEnabled}
                  >
                    <option value="slow">Lenta (20-30s)</option>
                    <option value="normal">Normal (12-18s)</option>
                    <option value="fast">Rápida (6-10s)</option>
                  </select>
                </div>

                {/* Intensidad de Hover */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Intensidad de Hover
                  </label>
                  <select
                    value={currentStyles.hoverIntensity || 'normal'}
                    onChange={(e) => updateBarStyle('hoverIntensity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                    disabled={!currentStyles.hoverEffects}
                  >
                    <option value="subtle">Sutil (1.1x)</option>
                    <option value="normal">Normal (1.3x)</option>
                    <option value="intense">Intensa (1.5x)</option>
                  </select>
                </div>

                {/* Tamaño de Logos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tamaño de Logos
                  </label>
                  <select
                    value={currentStyles.logoSize || 'medium'}
                    onChange={(e) => updateBarStyle('logoSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                  >
                    <option value="small">Pequeño (h-10)</option>
                    <option value="medium">Mediano (h-16)</option>
                    <option value="large">Grande (h-20)</option>
                  </select>
                </div>

                {/* Espaciado de Logos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Espaciado entre Logos
                  </label>
                  <select
                    value={currentStyles.logoSpacing || 'normal'}
                    onChange={(e) => updateBarStyle('logoSpacing', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                  >
                    <option value="compact">Compacto (gap-4)</option>
                    <option value="normal">Normal (gap-8)</option>
                    <option value="wide">Amplio (gap-12)</option>
                  </select>
                </div>

                {/* 🔳 Formato de Logos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Formato de Logos
                  </label>
                  <select
                    value={currentStyles.logoFormat || 'rectangle'}
                    onChange={(e) => updateBarStyle('logoFormat', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                  >
                    <option value="rectangle">📏 Rectangular (mantiene proporciones)</option>
                    <option value="square">⬜ Cuadrado (altura fija)</option>
                    <option value="original">🖼️ Original (sin restricciones)</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {currentStyles.logoFormat === 'rectangle' && '📏 Los logos mantienen su aspect ratio original'}
                    {currentStyles.logoFormat === 'square' && '⬜ Todos los logos tienen la misma altura (puede distorsionar)'}
                    {currentStyles.logoFormat === 'original' && '🖼️ Sin restricciones de tamaño'}
                  </p>
                </div>

                {/* Ancho máximo (solo para modo rectangle y original) */}
                {(currentStyles.logoFormat === 'rectangle' || currentStyles.logoFormat === 'original') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ancho Máximo
                    </label>
                    <select
                      value={currentStyles.maxLogoWidth || 'medium'}
                      onChange={(e) => updateBarStyle('maxLogoWidth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                    >
                      <option value="small">Pequeño (80px)</option>
                      <option value="medium">Mediano (120px)</option>
                      <option value="large">Grande (160px)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Efectos Adicionales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Efectos Hover
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Escala y rotación
                    </p>
                  </div>
                  <button
                    onClick={() => updateBarStyle('hoverEffects', !currentStyles.hoverEffects)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      currentStyles.hoverEffects ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        currentStyles.hoverEffects ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Partículas
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Puntos flotantes
                    </p>
                  </div>
                  <button
                    onClick={() => updateBarStyle('particleEffects', !currentStyles.particleEffects)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      currentStyles.particleEffects ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                    disabled={!currentStyles.hoverEffects}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        currentStyles.particleEffects ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Glow Effects
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Brillo y sombras
                    </p>
                  </div>
                  <button
                    onClick={() => updateBarStyle('glowEffects', !currentStyles.glowEffects)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      currentStyles.glowEffects ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                    disabled={!currentStyles.hoverEffects}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        currentStyles.glowEffects ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Auto-Detección
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Categorías smart
                    </p>
                  </div>
                  <button
                    onClick={() => updateBarStyle('autoDetectTech', !currentStyles.autoDetectTech)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      currentStyles.autoDetectTech ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        currentStyles.autoDetectTech ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogosBarDesignSection;