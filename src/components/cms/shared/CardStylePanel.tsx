/**
 * 💳 CardStylePanel - Componente para configurar estilos de tarjetas de contenido
 * Usado para personalizar las tarjetas de beneficios, características, FAQ, etc.
 * 
 * REFACTORIZADO: Sin useEffect para evitar actualizaciones en cascada
 * Todos los cambios se propagan directamente via onStyleChange
 */

import React from 'react';
import { ColorInput } from './ColorInput';

interface CardStyles {
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
}

interface CardStylePanelProps {
  theme: 'light' | 'dark';
  themeLabel: string;
  themeIcon: string;
  styles: CardStyles | undefined;
  onStyleChange: (field: string, value: string) => void;
}

const BORDER_RADIUS_OPTIONS = [
  { value: '0', label: 'Sin redondeo' },
  { value: '0.25rem', label: 'Pequeño (4px)' },
  { value: '0.5rem', label: 'Medio (8px)' },
  { value: '0.75rem', label: 'Grande (12px)' },
  { value: '1rem', label: 'Extra grande (16px)' },
  { value: '1.5rem', label: 'Redondeado (24px)' },
];

const BORDER_WIDTH_OPTIONS = [
  { value: '0', label: 'Sin borde' },
  { value: '1px', label: 'Fino (1px)' },
  { value: '2px', label: 'Normal (2px)' },
  { value: '3px', label: 'Grueso (3px)' },
  { value: '4px', label: 'Extra grueso (4px)' },
];

const GRADIENT_DIRECTIONS = [
  { value: 'to right', label: '→ Derecha' },
  { value: 'to left', label: '← Izquierda' },
  { value: 'to bottom', label: '↓ Abajo' },
  { value: 'to top', label: '↑ Arriba' },
  { value: 'to bottom right', label: '↘ Diagonal Der.' },
  { value: 'to bottom left', label: '↙ Diagonal Izq.' },
  { value: 'to top right', label: '↗ Diagonal Arr. Der.' },
  { value: 'to top left', label: '↖ Diagonal Arr. Izq.' },
];

const DEFAULT_LIGHT_STYLES: CardStyles = {
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
};

const DEFAULT_DARK_STYLES: CardStyles = {
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
};

export const CardStylePanel: React.FC<CardStylePanelProps> = ({
  theme,
  themeLabel,
  themeIcon,
  styles,
  onStyleChange,
}) => {
  const defaults = theme === 'light' ? DEFAULT_LIGHT_STYLES : DEFAULT_DARK_STYLES;
  
  // Merge styles con defaults - valores actuales
  const currentStyles: CardStyles = {
    background: styles?.background ?? defaults.background,
    borderColor: styles?.borderColor ?? defaults.borderColor,
    borderWidth: styles?.borderWidth ?? defaults.borderWidth,
    textColor: styles?.textColor ?? defaults.textColor,
    borderRadius: styles?.borderRadius ?? defaults.borderRadius,
    iconBackground: styles?.iconBackground ?? defaults.iconBackground,
    iconColor: styles?.iconColor ?? defaults.iconColor,
    iconBackgroundType: styles?.iconBackgroundType ?? defaults.iconBackgroundType,
    iconGradientFrom: styles?.iconGradientFrom ?? defaults.iconGradientFrom,
    iconGradientTo: styles?.iconGradientTo ?? defaults.iconGradientTo,
    iconGradientDirection: styles?.iconGradientDirection ?? defaults.iconGradientDirection,
  };

  // Determinar el tipo de fondo del ícono
  const iconBgType = currentStyles.iconBackgroundType || 'gradient';
  
  // Valores del gradiente
  const gradientFrom = currentStyles.iconGradientFrom || defaults.iconGradientFrom!;
  const gradientTo = currentStyles.iconGradientTo || defaults.iconGradientTo!;
  const gradientDirection = currentStyles.iconGradientDirection || defaults.iconGradientDirection!;
  
  // Color sólido (usar iconBackground si no es gradiente, o el color inicial del gradiente como fallback)
  const solidColor = iconBgType === 'solid' && currentStyles.iconBackground && !currentStyles.iconBackground.includes('gradient')
    ? currentStyles.iconBackground 
    : gradientFrom;

  // Manejar cambio de tipo de fondo
  const handleIconBgTypeChange = (type: 'solid' | 'gradient') => {
    onStyleChange('iconBackgroundType', type);
    if (type === 'solid') {
      // Usar el color inicial del gradiente como color sólido
      onStyleChange('iconBackground', gradientFrom);
    } else {
      // Reconstruir gradiente y asegurar que todos los campos existen
      onStyleChange('iconGradientFrom', gradientFrom);
      onStyleChange('iconGradientTo', gradientTo);
      onStyleChange('iconGradientDirection', gradientDirection);
      const newGradient = `linear-gradient(${gradientDirection}, ${gradientFrom}, ${gradientTo})`;
      onStyleChange('iconBackground', newGradient);
    }
  };

  // Manejar cambio de color sólido
  const handleSolidColorChange = (color: string) => {
    onStyleChange('iconBackground', color);
  };

  // Manejar cambio de gradiente
  const handleGradientChange = (field: 'from' | 'to' | 'direction', value: string) => {
    const newFrom = field === 'from' ? value : gradientFrom;
    const newTo = field === 'to' ? value : gradientTo;
    const newDirection = field === 'direction' ? value : gradientDirection;
    
    // Actualizar el campo específico
    if (field === 'from') onStyleChange('iconGradientFrom', value);
    if (field === 'to') onStyleChange('iconGradientTo', value);
    if (field === 'direction') onStyleChange('iconGradientDirection', value);
    
    // Reconstruir y actualizar el gradiente completo
    const newGradient = `linear-gradient(${newDirection}, ${newFrom}, ${newTo})`;
    onStyleChange('iconBackground', newGradient);
  };

  // Obtener el fondo del ícono para preview
  const getIconBackgroundPreview = () => {
    if (iconBgType === 'gradient') {
      return `linear-gradient(${gradientDirection}, ${gradientFrom}, ${gradientTo})`;
    }
    return solidColor;
  };

  return (
    <div className={`mb-6 p-4 rounded-lg border ${
      theme === 'light' 
        ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600' 
        : 'bg-gray-800/50 dark:bg-gray-900/50 border-gray-600 dark:border-gray-700'
    }`}>
      <h5 className={`font-medium mb-4 flex items-center gap-2 ${
        theme === 'light' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-300'
      }`}>
        <span>{themeIcon}</span> {themeLabel}
      </h5>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fondo de Tarjeta */}
        <ColorInput
          label="Fondo de Tarjeta"
          value={currentStyles.background}
          onChange={(value) => onStyleChange('background', value)}
          allowTransparent
          defaultNonTransparentValue={defaults.background}
        />

        {/* Color del Texto */}
        <ColorInput
          label="Color del Texto"
          value={currentStyles.textColor}
          onChange={(value) => onStyleChange('textColor', value)}
        />

        {/* Color de Borde */}
        <ColorInput
          label="Color de Borde"
          value={currentStyles.borderColor}
          onChange={(value) => onStyleChange('borderColor', value)}
          allowTransparent
          defaultNonTransparentValue={theme === 'light' ? '#e5e7eb' : '#374151'}
        />

        {/* Ancho de Borde */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ancho de Borde
          </label>
          <select
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={currentStyles.borderWidth || '0'}
            onChange={(e) => onStyleChange('borderWidth', e.target.value)}
          >
            {BORDER_WIDTH_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Border Radius */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Radio de Borde
          </label>
          <select
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={currentStyles.borderRadius}
            onChange={(e) => onStyleChange('borderRadius', e.target.value)}
          >
            {BORDER_RADIUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Color del Ícono (texto) */}
        <ColorInput
          label="Color del Ícono"
          value={currentStyles.iconColor}
          onChange={(value) => onStyleChange('iconColor', value)}
        />
      </div>

      {/* ============ SECCIÓN: FONDO DEL ÍCONO ============ */}
      <div className="mt-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600">
        <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          🎨 Fondo del Ícono
        </h6>

        {/* Selector de tipo */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => handleIconBgTypeChange('solid')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              iconBgType === 'solid'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            🎨 Color Sólido
          </button>
          <button
            type="button"
            onClick={() => handleIconBgTypeChange('gradient')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              iconBgType === 'gradient'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            🌈 Gradiente
          </button>
        </div>

        {/* Controles según el tipo */}
        {iconBgType === 'solid' ? (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color de Fondo
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={solidColor}
                  onChange={(e) => handleSolidColorChange(e.target.value)}
                  placeholder="#8b5cf6 o rgba(139,92,246,1)"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <input
                  type="color"
                  value={solidColor.startsWith('#') ? solidColor : '#8b5cf6'}
                  onChange={(e) => handleSolidColorChange(e.target.value)}
                  className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Dirección del gradiente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dirección del Gradiente
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                value={gradientDirection}
                onChange={(e) => handleGradientChange('direction', e.target.value)}
              >
                {GRADIENT_DIRECTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Colores del gradiente */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color Inicial
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={gradientFrom}
                    onChange={(e) => handleGradientChange('from', e.target.value)}
                    placeholder="#8b5cf6"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                  />
                  <input
                    type="color"
                    value={gradientFrom.startsWith('#') ? gradientFrom : '#8b5cf6'}
                    onChange={(e) => handleGradientChange('from', e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color Final
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={gradientTo}
                    onChange={(e) => handleGradientChange('to', e.target.value)}
                    placeholder="#06b6d4"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                  />
                  <input
                    type="color"
                    value={gradientTo.startsWith('#') ? gradientTo : '#06b6d4'}
                    onChange={(e) => handleGradientChange('to', e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Vista previa del gradiente */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">Vista previa:</span>
              <div 
                className="flex-1 h-8 rounded-lg"
                style={{ background: `linear-gradient(${gradientDirection}, ${gradientFrom}, ${gradientTo})` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Vista Previa de Tarjeta Completa */}
      <div className="mt-4 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
        <span className="text-xs text-gray-500 dark:text-gray-400 block mb-2">
          👁️ Vista Previa de Tarjeta
        </span>
        <div
          className="flex items-start gap-4 transition-all duration-300"
          style={{
            background: currentStyles.background,
            borderColor: currentStyles.borderColor,
            borderWidth: currentStyles.borderWidth || '0',
            borderStyle: 'solid',
            borderRadius: currentStyles.borderRadius,
            padding: '1rem',
          }}
        >
          <div
            className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg"
            style={{
              background: getIconBackgroundPreview(),
              color: currentStyles.iconColor,
            }}
          >
            ★
          </div>
          <p
            className="font-medium flex-1"
            style={{ color: currentStyles.textColor }}
          >
            Ejemplo de tarjeta de beneficio con el estilo configurado
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardStylePanel;
