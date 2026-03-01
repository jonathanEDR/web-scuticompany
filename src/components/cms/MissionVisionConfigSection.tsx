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
  const missionVisionBackground = pageData?.content?.missionVisionBackground || {};
  const history = pageData?.content?.history || {}; // 🆕 Sección Historia
  
  // Estado para controlar si la sección está colapsada
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 border border-gray-100 dark:border-gray-700/50">
      {/* Encabezado colapsable */}
      <button
        type="button"
        className="w-full flex items-center justify-between text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded transition-colors"
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
        <div id="mission-vision-section-content" className="space-y-4">
      
      {/* 🌄 FONDO DE SECCIÓN MISIÓN Y VISIÓN */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 border border-blue-200 dark:border-gray-700/50">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-3">
          🌄 Imagen de Fondo
        </h3>

        <div className="flex gap-4">
          {/* Controles (lado izquierdo) */}
          <div className="flex-1 space-y-3">
            {/* Opacidad */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Opacidad: {Math.round((missionVisionBackground.backgroundOpacity ?? 1) * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round((missionVisionBackground.backgroundOpacity ?? 1) * 100)}
                onChange={(e) => updateContent('missionVisionBackground.backgroundOpacity', parseInt(e.target.value) / 100)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Overlay toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                id="mv-background-overlay"
                checked={missionVisionBackground.backgroundOverlay === true}
                onChange={(e) => updateContent('missionVisionBackground.backgroundOverlay', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-700 dark:text-gray-300">Overlay oscuro</span>
            </label>
          </div>

          {/* Imágenes (lado derecho) */}
          <div className="flex-shrink-0 flex gap-3">
            <div>
              <label className="block text-[9px] font-medium text-gray-500 dark:text-gray-400 mb-1 text-center">☀️ Claro</label>
              <ManagedImageSelector
                sidebar
                label="Fondo Claro"
                currentImage={
                  typeof missionVisionBackground.backgroundImage === 'string' 
                    ? missionVisionBackground.backgroundImage 
                    : (missionVisionBackground.backgroundImage?.light || '')
                }
                onImageSelect={(url: string) => {
                  const currentBgImage = typeof missionVisionBackground.backgroundImage === 'string'
                    ? { light: missionVisionBackground.backgroundImage, dark: missionVisionBackground.backgroundImage }
                    : (missionVisionBackground.backgroundImage || {});
                  updateContent('missionVisionBackground.backgroundImage', { ...currentBgImage, light: url });
                }}
              />
            </div>
            <div>
              <label className="block text-[9px] font-medium text-gray-500 dark:text-gray-400 mb-1 text-center">🌙 Oscuro</label>
              <ManagedImageSelector
                sidebar
                darkMode
                label="Fondo Oscuro"
                currentImage={
                  typeof missionVisionBackground.backgroundImage === 'string' 
                    ? missionVisionBackground.backgroundImage 
                    : (missionVisionBackground.backgroundImage?.dark || '')
                }
                onImageSelect={(url: string) => {
                  const currentBgImage = typeof missionVisionBackground.backgroundImage === 'string'
                    ? { light: missionVisionBackground.backgroundImage, dark: missionVisionBackground.backgroundImage }
                    : (missionVisionBackground.backgroundImage || {});
                  updateContent('missionVisionBackground.backgroundImage', { ...currentBgImage, dark: url });
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ⚙️ CONFIGURACIÓN GENERAL DE TIPOGRAFÍA */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 border border-indigo-200 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
            ⚙️ Configuración de Tipografía
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tipografía Misión */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              🎯 Tipografía Misión
            </label>
            <select
              value={mission.fontFamily || 'Montserrat'}
              onChange={(e) => updateContent('mission.fontFamily', e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              🔮 Tipografía Visión
            </label>
            <select
              value={vision.fontFamily || 'Montserrat'}
              onChange={(e) => updateContent('vision.fontFamily', e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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

      {/* 📖 SECCIÓN HISTORIA */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-800 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 border border-emerald-200 dark:border-gray-700/50">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-3">
          📖 Nuestra Historia
        </h3>

        <div className="flex gap-4">
          {/* Inputs (lado izquierdo) */}
          <div className="flex-1 space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
              <input
                type="text"
                value={history.title || ''}
                onChange={(e) => updateContent('history.title', e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                placeholder="Ej: ¿Cómo nació SCUTI Company?"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Contenido</label>
              <textarea
                value={history.description || ''}
                onChange={(e) => updateContent('history.description', e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none text-sm"
                rows={3}
                placeholder="SCUTI Company nació de una visión clara..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">🔤 Tipografía</label>
              <select
                value={history.fontFamily || 'Montserrat'}
                onChange={(e) => updateContent('history.fontFamily', e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                style={{ fontFamily: history.fontFamily || 'Montserrat' }}
              >
                {AVAILABLE_FONTS.map(font => (
                  <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Imágenes (lado derecho) */}
          <div className="flex-shrink-0 flex flex-col gap-2">
            <div>
              <label className="block text-[9px] font-medium text-gray-500 dark:text-gray-400 mb-1 text-center">☀️ Claro</label>
              <ManagedImageSelector
                sidebar
                currentImage={
                  typeof history.image === 'string' 
                    ? history.image 
                    : (history.image?.light || '')
                }
                onImageSelect={(url: string) => {
                  const currentImage = typeof history.image === 'string'
                    ? { light: history.image, dark: history.image }
                    : (history.image || {});
                  updateContent('history.image', { ...currentImage, light: url });
                }}
                label="Imagen Historia (Claro)"
              />
            </div>
            <div>
              <label className="block text-[9px] font-medium text-gray-500 dark:text-gray-400 mb-1 text-center">🌙 Oscuro</label>
              <ManagedImageSelector
                sidebar
                darkMode
                currentImage={
                  typeof history.image === 'string' 
                    ? history.image 
                    : (history.image?.dark || '')
                }
                onImageSelect={(url: string) => {
                  const currentImage = typeof history.image === 'string'
                    ? { light: history.image, dark: history.image }
                    : (history.image || {});
                  updateContent('history.image', { ...currentImage, dark: url });
                }}
                label="Imagen Historia (Oscuro)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 SECCIÓN MISIÓN */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 border border-gray-100 dark:border-gray-700/50">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-3">
          🎯 Nuestra Misión
        </h3>

        <div className="flex gap-4">
          {/* Inputs (lado izquierdo) */}
          <div className="flex-1 space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
              <input
                type="text"
                value={mission.title || ''}
                onChange={(e) => updateContent('mission.title', e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                placeholder="Título de la misión..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
              <textarea
                value={mission.description || ''}
                onChange={(e) => updateContent('mission.description', e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none text-sm"
                rows={3}
                placeholder="Describe la misión de la empresa..."
              />
            </div>
          </div>

          {/* Imagen (lado derecho, al costado del input) */}
          <div className="flex-shrink-0">
            <label className="block text-[9px] font-medium text-gray-500 dark:text-gray-400 mb-1 text-center">Imagen</label>
            <ManagedImageSelector
              sidebar
              currentImage={
                typeof mission.image === 'string' 
                  ? mission.image 
                  : (mission.image?.dark || mission.image?.light || '')
              }
              onImageSelect={(url: string) => updateContent('mission.image', url)}
              label="Imagen Misión"
              description="Ambos temas"
            />
          </div>
        </div>
      </div>

      {/* 🔮 SECCIÓN VISIÓN */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 border border-gray-100 dark:border-gray-700/50">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-3">
          🔮 Nuestra Visión
        </h3>

        <div className="flex gap-4">
          {/* Inputs (lado izquierdo) */}
          <div className="flex-1 space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
              <input
                type="text"
                value={vision.title || ''}
                onChange={(e) => updateContent('vision.title', e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                placeholder="Título de la visión..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
              <textarea
                value={vision.description || ''}
                onChange={(e) => updateContent('vision.description', e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none text-sm"
                rows={3}
                placeholder="Describe la visión de la empresa..."
              />
            </div>
          </div>

          {/* Imagen (lado derecho, al costado del input) */}
          <div className="flex-shrink-0">
            <label className="block text-[9px] font-medium text-gray-500 dark:text-gray-400 mb-1 text-center">Imagen</label>
            <ManagedImageSelector
              sidebar
              currentImage={
                typeof vision.image === 'string' 
                  ? vision.image 
                  : (vision.image?.dark || vision.image?.light || '')
              }
              onImageSelect={(url: string) => updateContent('vision.image', url)}
              label="Imagen Visión"
              description="Ambos temas"
            />
          </div>
        </div>
      </div>

      {/* 📊 Vista Previa - Colapsable */}
      <details className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
        <summary className="px-4 py-2 cursor-pointer text-xs font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 select-none">
          👁️ Vista Previa del Diseño (clic para expandir)
        </summary>
        
        <div className="px-4 pb-4 space-y-3">
          {/* Preview Historia */}
          {history.title && (
            <div className="border-l-3 border-emerald-500 pl-3" style={{ fontFamily: history.fontFamily || 'Montserrat' }}>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                📖 {history.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                {history.description}
              </p>
            </div>
          )}

          {/* Preview Misión */}
          {mission.title && (
            <div className="flex items-center gap-3">
              <div className="flex-1" style={{ fontFamily: mission.fontFamily || 'Montserrat' }}>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">🎯 {mission.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-0.5">{mission.description}</p>
              </div>
              <div className="w-16 h-16 flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 rounded-lg overflow-hidden flex items-center justify-center">
                {(typeof mission.image === 'string' ? mission.image : mission.image?.light) ? (
                  <img src={typeof mission.image === 'string' ? mission.image : mission.image?.light} alt="Misión" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl opacity-50">🎯</span>
                )}
              </div>
            </div>
          )}

          {/* Preview Visión */}
          {vision.title && (
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 flex-shrink-0 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg overflow-hidden flex items-center justify-center">
                {(typeof vision.image === 'string' ? vision.image : vision.image?.light) ? (
                  <img src={typeof vision.image === 'string' ? vision.image : vision.image?.light} alt="Visión" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl opacity-50">🔮</span>
                )}
              </div>
              <div className="flex-1" style={{ fontFamily: vision.fontFamily || 'Montserrat' }}>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">🔮 {vision.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-0.5">{vision.description}</p>
              </div>
            </div>
          )}
        </div>
      </details>
      </div>
      )}
    </div>
  );
};

export default MissionVisionConfigSection;