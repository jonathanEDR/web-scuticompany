// Componente para selector avanzado de gradientes
import React, { useState, useEffect, useCallback } from 'react';

interface GradientColor {
  color: string;
  position: number;
}

interface GradientSelectorProps {
  value: string;
  onChange: (gradient: string) => void;
  label: string;
  className?: string;
}

const PREDEFINED_GRADIENTS = [
  {
    name: 'Púrpura a Cian',
    value: 'linear-gradient(90deg, #8B5CF6, #06B6D4)',
    preview: 'from-purple-500 to-cyan-500'
  },
  {
    name: 'Rosa a Naranja',
    value: 'linear-gradient(90deg, #EC4899, #F97316)',
    preview: 'from-pink-500 to-orange-500'
  },
  {
    name: 'Azul a Púrpura',
    value: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
    preview: 'from-blue-500 to-purple-500'
  },
  {
    name: 'Verde a Azul',
    value: 'linear-gradient(90deg, #10B981, #3B82F6)',
    preview: 'from-emerald-500 to-blue-500'
  },
  {
    name: 'Amarillo a Rosa',
    value: 'linear-gradient(90deg, #F59E0B, #EC4899)',
    preview: 'from-amber-500 to-pink-500'
  },
  {
    name: 'Rojo a Púrpura',
    value: 'linear-gradient(90deg, #EF4444, #8B5CF6)',
    preview: 'from-red-500 to-purple-500'
  }
];

const GRADIENT_DIRECTIONS = [
  { name: 'Horizontal →', value: '90deg' },
  { name: 'Vertical ↓', value: '180deg' },
  { name: 'Diagonal ↘', value: '135deg' },
  { name: 'Diagonal ↙', value: '45deg' },
  { name: 'Radial ⚪', value: 'circle' }
];

export const GradientSelector: React.FC<GradientSelectorProps> = ({
  value,
  onChange,
  label,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'predefined' | 'custom'>('predefined');
  const [direction, setDirection] = useState('90deg');
  const [colors, setColors] = useState<GradientColor[]>([
    { color: '#8B5CF6', position: 0 },
    { color: '#06B6D4', position: 100 }
  ]);
  const [customValue, setCustomValue] = useState(value || '');

  // Parsear el gradient actual para extraer información
  useEffect(() => {
    if (value) {
      setCustomValue(value);
      
      // Intentar extraer colores y dirección del gradient
      const linearMatch = value.match(/linear-gradient\(([^,]+),\s*([^,]+),?\s*([^)]*)\)/);
      if (linearMatch) {
        const dir = linearMatch[1].trim();
        const color1 = linearMatch[2].trim();
        const color3 = linearMatch[3]?.trim();
        
        setDirection(dir);
        if (color3) {
          setColors([
            { color: color1, position: 0 },
            { color: color3, position: 100 }
          ]);
        }
      }
    }
  }, [value]);

  const generateGradient = useCallback(() => {
    const sortedColors = [...colors].sort((a, b) => a.position - b.position);
    const colorStops = sortedColors.map(c => `${c.color} ${c.position}%`).join(', ');
    
    if (direction === 'circle') {
      return `radial-gradient(${colorStops})`;
    }
    return `linear-gradient(${direction}, ${colorStops})`;
  }, [colors, direction]);

  const handlePredefinedSelect = (gradient: string) => {
    onChange(gradient);
    setCustomValue(gradient);
    setIsOpen(false);
  };

  const handleCustomGradientUpdate = () => {
    const gradient = generateGradient();
    onChange(gradient);
    setCustomValue(gradient);
  };

  const handleCustomInputChange = (value: string) => {
    setCustomValue(value);
    onChange(value);
  };

  const addColor = () => {
    if (colors.length < 5) {
      const newPosition = colors.length > 0 ? Math.max(...colors.map(c => c.position)) + 10 : 50;
      setColors([...colors, { color: '#8B5CF6', position: Math.min(newPosition, 100) }]);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const updateColor = (index: number, field: 'color' | 'position', value: string | number) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setColors(newColors);
  };

  useEffect(() => {
    if (mode === 'custom') {
      handleCustomGradientUpdate();
    }
  }, [colors, direction, mode]);

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {/* Vista previa del gradient actual */}
      <div 
        className="w-full h-12 rounded-lg border-2 border-gray-300 mb-2 cursor-pointer transition-all hover:border-purple-400"
        style={{ background: customValue || '#f3f4f6' }}
        onClick={() => setIsOpen(!isOpen)}
        title="Click para editar"
      />
      
      {/* Input de texto para edición directa */}
      <input
        type="text"
        value={customValue}
        onChange={(e) => handleCustomInputChange(e.target.value)}
        placeholder="linear-gradient(90deg, #8B5CF6, #06B6D4)"
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
      />

      {/* Panel de configuración */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4">
          {/* Selector de modo */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setMode('predefined')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                mode === 'predefined'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Predefinidos
            </button>
            <button
              onClick={() => setMode('custom')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                mode === 'custom'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Personalizado
            </button>
          </div>

          {mode === 'predefined' ? (
            /* Gradientes predefinidos */
            <div className="grid grid-cols-2 gap-2">
              {PREDEFINED_GRADIENTS.map((gradient, index) => (
                <div
                  key={index}
                  className="cursor-pointer rounded-lg p-2 border border-gray-200 hover:border-purple-400 transition-colors"
                  onClick={() => handlePredefinedSelect(gradient.value)}
                >
                  <div 
                    className="h-8 rounded mb-1"
                    style={{ background: gradient.value }}
                  />
                  <span className="text-xs text-gray-600">{gradient.name}</span>
                </div>
              ))}
            </div>
          ) : (
            /* Editor personalizado */
            <div className="space-y-4">
              {/* Dirección */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Dirección
                </label>
                <select
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                >
                  {GRADIENT_DIRECTIONS.map(dir => (
                    <option key={dir.value} value={dir.value}>
                      {dir.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Colores */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-gray-600">
                    Colores
                  </label>
                  <button
                    onClick={addColor}
                    disabled={colors.length >= 5}
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 disabled:opacity-50"
                  >
                    + Agregar
                  </button>
                </div>
                
                <div className="space-y-2">
                  {colors.map((color, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={color.color}
                        onChange={(e) => updateColor(index, 'color', e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={color.color}
                        onChange={(e) => updateColor(index, 'color', e.target.value)}
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                      />
                      <input
                        type="number"
                        value={color.position}
                        onChange={(e) => updateColor(index, 'position', parseInt(e.target.value))}
                        min="0"
                        max="100"
                        className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
                      />
                      <span className="text-xs text-gray-500">%</span>
                      {colors.length > 2 && (
                        <button
                          onClick={() => removeColor(index)}
                          className="text-red-500 hover:text-red-700 text-xs p-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Vista previa en vivo */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Vista previa
                </label>
                <div 
                  className="w-full h-12 rounded border"
                  style={{ background: generateGradient() }}
                />
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradientSelector;