import React, { useState } from 'react';
import ManagedImageSelector from '../ManagedImageSelector';

// Lista de fuentes disponibles
const AVAILABLE_FONTS = [
  { value: 'Montserrat', label: 'Montserrat (Recomendada)' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' },
];

interface MissionVisionConfigSectionProps {
  pageData: any;
  updateContent: (field: string, value: any) => void;
}

const MissionVisionConfigSection: React.FC<MissionVisionConfigSectionProps> = ({
  pageData,
  updateContent
}) => {
  const mission = pageData?.content?.mission || {};
  const vision = pageData?.content?.vision || {};
  
  // Estado para controlar si la sección está colapsada
  const [collapsed, setCollapsed] = useState(true);
  // Estado para controlar qué tema de imagen se está editando
  const [missionImageTheme, setMissionImageTheme] = useState<'light' | 'dark'>('light');
  const [visionImageTheme, setVisionImageTheme] = useState<'light' | 'dark'>('light');

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
      {/* Encabezado colapsable */}
      <button
        type="button"
        className="w-full flex items-center justify-between text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded transition-colors"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-expanded={!collapsed}
        aria-controls="mission-vision-section-content"
        style={{ cursor: 'pointer' }}
      >
        <span className="flex items-center gap-2">
          🎯 Misión y Visión
        </span>
        <span className="ml-2 text-lg">
          {collapsed ? '▼ Mostrar' : '▲ Ocultar'}
        </span>
      </button>

      {/* Contenido colapsable */}
      {!collapsed && (
        <div id="mission-vision-section-content" className="space-y-8">
      {/* ⚙️ CONFIGURACIÓN GENERAL DE TIPOGRAFÍA */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-indigo-200 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
            ⚙️ Configuración de Tipografía
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tipografía Misión */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🎯 Tipografía Misión
            </label>
            <select
              value={mission.fontFamily || 'Montserrat'}
              onChange={(e) => updateContent('mission.fontFamily', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              style={{ fontFamily: mission.fontFamily || 'Montserrat' }}
            >
              {AVAILABLE_FONTS.map(font => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tipografía Visión */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🔮 Tipografía Visión
            </label>
            <select
              value={vision.fontFamily || 'Montserrat'}
              onChange={(e) => updateContent('vision.fontFamily', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              style={{ fontFamily: vision.fontFamily || 'Montserrat' }}
            >
              {AVAILABLE_FONTS.map(font => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 🎯 SECCIÓN MISIÓN */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
            🎯 Nuestra Misión
          </h3>
        </div>

        <div className="space-y-6">
          {/* Título de la Misión */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título
            </label>
            <input
              type="text"
              value={mission.title || ''}
              onChange={(e) => updateContent('mission.title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Título de la misión..."
            />
          </div>

          {/* Descripción de la Misión */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              value={mission.description || ''}
              onChange={(e) => updateContent('mission.description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
              rows={4}
              placeholder="Describe la misión de la empresa..."
            />
          </div>

          {/* 🖼️ Imagen de la Misión */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                🖼️ Imagen de la Misión
              </label>
              {/* Selector de tema para la imagen */}
              <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                <button
                  onClick={() => setMissionImageTheme('light')}
                  className={`px-3 py-1 text-xs font-medium transition-colors ${
                    missionImageTheme === 'light'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  ☀️ Claro
                </button>
                <button
                  onClick={() => setMissionImageTheme('dark')}
                  className={`px-3 py-1 text-xs font-medium transition-colors ${
                    missionImageTheme === 'dark'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  🌙 Oscuro
                </button>
              </div>
            </div>

            <ManagedImageSelector
              currentImage={missionImageTheme === 'light' ? mission.image?.light : mission.image?.dark}
              onImageSelect={(url) => updateContent(`mission.image.${missionImageTheme}`, url)}
              label={`Imagen Misión (${missionImageTheme === 'light' ? 'Tema Claro' : 'Tema Oscuro'})`}
              description="Imagen que aparecerá junto al texto de la misión"
              darkMode={false}
            />

            {/* Preview de ambas imágenes */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">☀️ Tema Claro</p>
                {mission.image?.light ? (
                  <img src={mission.image.light} alt="Misión Light" className="w-full h-24 object-cover rounded-lg border" />
                ) : (
                  <div className="w-full h-24 bg-gray-100 dark:bg-gray-700 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 text-xs">
                    Sin imagen
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">🌙 Tema Oscuro</p>
                {mission.image?.dark ? (
                  <img src={mission.image.dark} alt="Misión Dark" className="w-full h-24 object-cover rounded-lg border" />
                ) : (
                  <div className="w-full h-24 bg-gray-100 dark:bg-gray-700 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 text-xs">
                    Sin imagen
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔮 SECCIÓN VISIÓN */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
            🔮 Nuestra Visión
          </h3>
        </div>

        <div className="space-y-6">
          {/* Título de la Visión */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título
            </label>
            <input
              type="text"
              value={vision.title || ''}
              onChange={(e) => updateContent('vision.title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Título de la visión..."
            />
          </div>

          {/* Descripción de la Visión */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              value={vision.description || ''}
              onChange={(e) => updateContent('vision.description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
              rows={4}
              placeholder="Describe la visión de la empresa..."
            />
          </div>

          {/* 🖼️ Imagen de la Visión */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                🖼️ Imagen de la Visión
              </label>
              {/* Selector de tema para la imagen */}
              <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                <button
                  onClick={() => setVisionImageTheme('light')}
                  className={`px-3 py-1 text-xs font-medium transition-colors ${
                    visionImageTheme === 'light'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  ☀️ Claro
                </button>
                <button
                  onClick={() => setVisionImageTheme('dark')}
                  className={`px-3 py-1 text-xs font-medium transition-colors ${
                    visionImageTheme === 'dark'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  🌙 Oscuro
                </button>
              </div>
            </div>

            <ManagedImageSelector
              currentImage={visionImageTheme === 'light' ? vision.image?.light : vision.image?.dark}
              onImageSelect={(url) => updateContent(`vision.image.${visionImageTheme}`, url)}
              label={`Imagen Visión (${visionImageTheme === 'light' ? 'Tema Claro' : 'Tema Oscuro'})`}
              description="Imagen que aparecerá junto al texto de la visión"
              darkMode={false}
            />

            {/* Preview de ambas imágenes */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">☀️ Tema Claro</p>
                {vision.image?.light ? (
                  <img src={vision.image.light} alt="Visión Light" className="w-full h-24 object-cover rounded-lg border" />
                ) : (
                  <div className="w-full h-24 bg-gray-100 dark:bg-gray-700 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 text-xs">
                    Sin imagen
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">🌙 Tema Oscuro</p>
                {vision.image?.dark ? (
                  <img src={vision.image.dark} alt="Visión Dark" className="w-full h-24 object-cover rounded-lg border" />
                ) : (
                  <div className="w-full h-24 bg-gray-100 dark:bg-gray-700 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 text-xs">
                    Sin imagen
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 Vista Previa */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          👁️ Vista Previa del Diseño
        </h4>
        
        <div className="space-y-8">
          {/* Preview Misión - Zigzag */}
          {mission.title && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div style={{ fontFamily: mission.fontFamily || 'Montserrat' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-white text-lg">⚡</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {mission.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {mission.description}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900/30 dark:to-cyan-900/30 rounded-xl aspect-[4/3] flex items-center justify-center overflow-hidden">
                {mission.image?.light ? (
                  <img src={mission.image.light} alt="Misión" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl opacity-50">🎯</span>
                )}
              </div>
            </div>
          )}

          {/* Preview Visión - Zigzag inverso */}
          {vision.title && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="bg-gradient-to-br from-cyan-100 to-purple-100 dark:from-cyan-900/30 dark:to-purple-900/30 rounded-xl aspect-[4/3] flex items-center justify-center overflow-hidden md:order-1">
                {vision.image?.light ? (
                  <img src={vision.image.light} alt="Visión" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl opacity-50">🔮</span>
                )}
              </div>
              <div className="md:order-2" style={{ fontFamily: vision.fontFamily || 'Montserrat' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-lg">👁️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {vision.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {vision.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
      )}
    </div>
  );
};

export default MissionVisionConfigSection;