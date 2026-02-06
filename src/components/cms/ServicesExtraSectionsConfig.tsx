import React, { useState } from 'react';
import ManagedImageSelector from '../ManagedImageSelector';

// ============================================
// TIPOS
// ============================================

interface WhyChooseItem {
  title: string;
  description: string;
  iconBgColor: string;
  icon?: string;
}

interface WhyChooseConfig {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  titleColor?: string;
  titleColorDark?: string;
  subtitleColor?: string;
  subtitleColorDark?: string;
  items?: WhyChooseItem[];
}

interface SharedBackgroundConfig {
  backgroundImage?: { light?: string; dark?: string };
  backgroundOpacity?: number;
  backgroundOverlay?: boolean;
}

interface ProcessStep {
  title: string;
  description: string;
  icon?: string;
}

interface ProcessConfig {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  titleColor?: string;
  titleColorDark?: string;
  subtitleColor?: string;
  subtitleColorDark?: string;
  steps?: ProcessStep[];
}

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqConfig {
  enabled?: boolean;
  title?: string;
  titleColor?: string;
  titleColorDark?: string;
  items?: FaqItem[];
}

interface ServicesExtraSectionsConfigProps {
  sharedBackgroundConfig: SharedBackgroundConfig;
  whyChooseConfig: WhyChooseConfig;
  processConfig: ProcessConfig;
  faqConfig: FaqConfig;
  onUpdateSharedBackground: (field: string, value: any) => void;
  onUpdateWhyChoose: (field: string, value: any) => void;
  onUpdateProcess: (field: string, value: any) => void;
  onUpdateFaq: (field: string, value: any) => void;
}

// ============================================
// COLORES DISPONIBLES PARA ICONOS
// ============================================
const ICON_COLORS = [
  { value: 'purple', label: '💜 Púrpura' },
  { value: 'blue', label: '💙 Azul' },
  { value: 'green', label: '💚 Verde' },
  { value: 'cyan', label: '🩵 Cyan' },
  { value: 'amber', label: '💛 Ámbar' },
  { value: 'rose', label: '🩷 Rosa' },
];

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
const ServicesExtraSectionsConfig: React.FC<ServicesExtraSectionsConfigProps> = ({
  sharedBackgroundConfig,
  whyChooseConfig,
  processConfig,
  faqConfig,
  onUpdateSharedBackground,
  onUpdateWhyChoose,
  onUpdateProcess,
  onUpdateFaq,
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    sharedBackground: false, // Abierto por defecto
    whyChoose: true,
    process: true,
    faq: true,
  });

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-6">
      {/* ============================================ */}
      {/* 🖼️ FONDO COMPARTIDO PARA LAS 3 SECCIONES */}
      {/* ============================================ */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-lg border-2 border-blue-200 dark:border-blue-800 p-4">
        <button
          type="button"
          className="w-full flex items-center justify-between text-lg font-bold text-blue-800 dark:text-blue-100 focus:outline-none"
          onClick={() => toggleSection('sharedBackground')}
        >
          <span className="flex items-center gap-2">
            🖼️ Imagen de Fondo Compartida
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              Para las 3 secciones
            </span>
          </span>
          <span className="text-sm">{collapsedSections.sharedBackground ? '▼' : '▲'}</span>
        </button>

        {!collapsedSections.sharedBackground && (
          <div className="mt-4 space-y-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg p-3">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 <strong>Importante:</strong> Esta imagen de fondo se aplicará a las 3 secciones (¿Por qué elegirnos?, Proceso y FAQ) como un único bloque visual continuo.
              </p>
            </div>

            {/* Imagen de fondo */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">🖼️ Imagen de Fondo</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">☀️ Tema Claro</label>
                  <ManagedImageSelector
                    label="Imagen fondo (Claro)"
                    description="1920x1200px (más alto para cubrir 3 secciones)"
                    currentImage={sharedBackgroundConfig.backgroundImage?.light || ''}
                    onImageSelect={(url: string) => onUpdateSharedBackground('backgroundImage.light', url)}
                    hideButtonArea={!!sharedBackgroundConfig.backgroundImage?.light}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">🌙 Tema Oscuro</label>
                  <ManagedImageSelector
                    label="Imagen fondo (Oscuro)"
                    description="1920x1200px (más alto para cubrir 3 secciones)"
                    currentImage={sharedBackgroundConfig.backgroundImage?.dark || ''}
                    onImageSelect={(url: string) => onUpdateSharedBackground('backgroundImage.dark', url)}
                    darkMode={true}
                    hideButtonArea={!!sharedBackgroundConfig.backgroundImage?.dark}
                  />
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Opacidad: {Math.round((sharedBackgroundConfig.backgroundOpacity ?? 1) * 100)}%
                  </label>
                  <input type="range" min="0" max="100" value={(sharedBackgroundConfig.backgroundOpacity ?? 1) * 100} onChange={(e) => onUpdateSharedBackground('backgroundOpacity', parseInt(e.target.value) / 100)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={sharedBackgroundConfig.backgroundOverlay || false} onChange={(e) => onUpdateSharedBackground('backgroundOverlay', e.target.checked)} className="w-4 h-4 rounded" />
                  <label className="text-xs text-gray-600 dark:text-gray-400">Aplicar overlay oscuro sobre la imagen</label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* 🏆 SECCIÓN: ¿POR QUÉ ELEGIRNOS? */}
      {/* ============================================ */}
      <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 border border-gray-100 dark:border-gray-700/50">
        <button
          type="button"
          className="w-full flex items-center justify-between text-lg font-bold text-gray-800 dark:text-gray-100 focus:outline-none"
          onClick={() => toggleSection('whyChoose')}
        >
          <span className="flex items-center gap-2">
            🏆 ¿Por qué elegirnos?
            <span className={`text-xs px-2 py-0.5 rounded-full ${whyChooseConfig.enabled !== false ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
              {whyChooseConfig.enabled !== false ? '✅ Activa' : '❌ Inactiva'}
            </span>
          </span>
          <span className="text-sm">{collapsedSections.whyChoose ? '▼' : '▲'}</span>
        </button>

        {!collapsedSections.whyChoose && (
          <div className="mt-4 space-y-4">
            {/* Toggle habilitado */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={whyChooseConfig.enabled !== false}
                onChange={(e) => onUpdateWhyChoose('enabled', e.target.checked)}
                className="w-5 h-5 rounded text-purple-600"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mostrar sección en la página de servicios
              </label>
            </div>

            {/* Título y Subtítulo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                <input
                  type="text"
                  value={whyChooseConfig.title || ''}
                  onChange={(e) => onUpdateWhyChoose('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="¿Por qué elegir Scuti Company?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtítulo</label>
                <input
                  type="text"
                  value={whyChooseConfig.subtitle || ''}
                  onChange={(e) => onUpdateWhyChoose('subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Razones para confiar en nosotros"
                />
              </div>
            </div>

            {/* Colores del título */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">☀️ Color Título</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={whyChooseConfig.titleColor || '#111827'} onChange={(e) => onUpdateWhyChoose('titleColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                  <input type="text" value={whyChooseConfig.titleColor || '#111827'} onChange={(e) => onUpdateWhyChoose('titleColor', e.target.value)} className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">🌙 Color Título</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={whyChooseConfig.titleColorDark || '#ffffff'} onChange={(e) => onUpdateWhyChoose('titleColorDark', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                  <input type="text" value={whyChooseConfig.titleColorDark || '#ffffff'} onChange={(e) => onUpdateWhyChoose('titleColorDark', e.target.value)} className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">☀️ Color Subtítulo</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={whyChooseConfig.subtitleColor || '#6b7280'} onChange={(e) => onUpdateWhyChoose('subtitleColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                  <input type="text" value={whyChooseConfig.subtitleColor || '#6b7280'} onChange={(e) => onUpdateWhyChoose('subtitleColor', e.target.value)} className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">🌙 Color Subtítulo</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={whyChooseConfig.subtitleColorDark || '#9ca3af'} onChange={(e) => onUpdateWhyChoose('subtitleColorDark', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                  <input type="text" value={whyChooseConfig.subtitleColorDark || '#9ca3af'} onChange={(e) => onUpdateWhyChoose('subtitleColorDark', e.target.value)} className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                </div>
              </div>
            </div>

            {/* Items / Tarjetas */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">📋 Elementos ({(whyChooseConfig.items || []).length})</h4>
              <div className="space-y-3">
                {(whyChooseConfig.items || []).map((item, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">#{index + 1}</span>
                      <button
                        onClick={() => {
                          const items = [...(whyChooseConfig.items || [])];
                          items.splice(index, 1);
                          onUpdateWhyChoose('items', items);
                        }}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const items = [...(whyChooseConfig.items || [])];
                          items[index] = { ...items[index], title: e.target.value };
                          onUpdateWhyChoose('items', items);
                        }}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                        placeholder="Título"
                      />
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          const items = [...(whyChooseConfig.items || [])];
                          items[index] = { ...items[index], description: e.target.value };
                          onUpdateWhyChoose('items', items);
                        }}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                        placeholder="Descripción"
                      />
                      <select
                        value={item.iconBgColor || 'purple'}
                        onChange={(e) => {
                          const items = [...(whyChooseConfig.items || [])];
                          items[index] = { ...items[index], iconBgColor: e.target.value };
                          onUpdateWhyChoose('items', items);
                        }}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                      >
                        {ICON_COLORS.map(c => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  const items = [...(whyChooseConfig.items || [])];
                  items.push({ title: '', description: '', iconBgColor: 'purple' });
                  onUpdateWhyChoose('items', items);
                }}
                className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                ➕ Agregar elemento
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* 🏗️ SECCIÓN: PROCESO DE DESARROLLO */}
      {/* ============================================ */}
      <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 border border-gray-100 dark:border-gray-700/50">
        <button
          type="button"
          className="w-full flex items-center justify-between text-lg font-bold text-gray-800 dark:text-gray-100 focus:outline-none"
          onClick={() => toggleSection('process')}
        >
          <span className="flex items-center gap-2">
            🏗️ Proceso de Desarrollo
            <span className={`text-xs px-2 py-0.5 rounded-full ${processConfig.enabled !== false ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
              {processConfig.enabled !== false ? '✅ Activa' : '❌ Inactiva'}
            </span>
          </span>
          <span className="text-sm">{collapsedSections.process ? '▼' : '▲'}</span>
        </button>

        {!collapsedSections.process && (
          <div className="mt-4 space-y-4">
            {/* Toggle habilitado */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={processConfig.enabled !== false}
                onChange={(e) => onUpdateProcess('enabled', e.target.checked)}
                className="w-5 h-5 rounded text-blue-600"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mostrar sección de proceso en la página de servicios
              </label>
            </div>

            {/* Título y Subtítulo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                <input
                  type="text"
                  value={processConfig.title || ''}
                  onChange={(e) => onUpdateProcess('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="De la Idea al Sistema: Nuestro Método de Trabajo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtítulo</label>
                <input
                  type="text"
                  value={processConfig.subtitle || ''}
                  onChange={(e) => onUpdateProcess('subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Un proceso ágil y transparente..."
                />
              </div>
            </div>

            {/* Colores */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">☀️ Color Título</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={processConfig.titleColor || '#111827'} onChange={(e) => onUpdateProcess('titleColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                  <input type="text" value={processConfig.titleColor || '#111827'} onChange={(e) => onUpdateProcess('titleColor', e.target.value)} className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">🌙 Color Título</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={processConfig.titleColorDark || '#ffffff'} onChange={(e) => onUpdateProcess('titleColorDark', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                  <input type="text" value={processConfig.titleColorDark || '#ffffff'} onChange={(e) => onUpdateProcess('titleColorDark', e.target.value)} className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">☀️ Color Subtítulo</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={processConfig.subtitleColor || '#6b7280'} onChange={(e) => onUpdateProcess('subtitleColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                  <input type="text" value={processConfig.subtitleColor || '#6b7280'} onChange={(e) => onUpdateProcess('subtitleColor', e.target.value)} className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">🌙 Color Subtítulo</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={processConfig.subtitleColorDark || '#9ca3af'} onChange={(e) => onUpdateProcess('subtitleColorDark', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                  <input type="text" value={processConfig.subtitleColorDark || '#9ca3af'} onChange={(e) => onUpdateProcess('subtitleColorDark', e.target.value)} className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                </div>
              </div>
            </div>

            {/* Pasos del proceso */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">🔢 Fases del Proceso ({(processConfig.steps || []).length})</h4>
              <div className="space-y-3">
                {(processConfig.steps || []).map((step, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Fase {index + 1}</span>
                      <button
                        onClick={() => {
                          const steps = [...(processConfig.steps || [])];
                          steps.splice(index, 1);
                          onUpdateProcess('steps', steps);
                        }}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => {
                          const steps = [...(processConfig.steps || [])];
                          steps[index] = { ...steps[index], title: e.target.value };
                          onUpdateProcess('steps', steps);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                        placeholder="Nombre de la fase"
                      />
                      <textarea
                        value={step.description}
                        onChange={(e) => {
                          const steps = [...(processConfig.steps || [])];
                          steps[index] = { ...steps[index], description: e.target.value };
                          onUpdateProcess('steps', steps);
                        }}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                        placeholder="Descripción de la fase"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  const steps = [...(processConfig.steps || [])];
                  steps.push({ title: '', description: '' });
                  onUpdateProcess('steps', steps);
                }}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                ➕ Agregar fase
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* ❓ SECCIÓN: FAQ */}
      {/* ============================================ */}
      <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 border border-gray-100 dark:border-gray-700/50">
        <button
          type="button"
          className="w-full flex items-center justify-between text-lg font-bold text-gray-800 dark:text-gray-100 focus:outline-none"
          onClick={() => toggleSection('faq')}
        >
          <span className="flex items-center gap-2">
            ❓ Preguntas Frecuentes (FAQ)
            <span className={`text-xs px-2 py-0.5 rounded-full ${faqConfig.enabled !== false ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
              {faqConfig.enabled !== false ? '✅ Activa' : '❌ Inactiva'}
            </span>
          </span>
          <span className="text-sm">{collapsedSections.faq ? '▼' : '▲'}</span>
        </button>

        {!collapsedSections.faq && (
          <div className="mt-4 space-y-4">
            {/* Toggle habilitado */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={faqConfig.enabled !== false}
                onChange={(e) => onUpdateFaq('enabled', e.target.checked)}
                className="w-5 h-5 rounded text-amber-600"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mostrar FAQ en la página de servicios
              </label>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <p className="text-xs text-amber-700 dark:text-amber-300">
                💡 <strong>SEO Tip:</strong> Las FAQ generan Schema.org FAQPage automáticamente, lo que mejora tu posicionamiento en Google y puede mostrar tus preguntas directamente en los resultados de búsqueda.
              </p>
            </div>

            {/* Título */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título de la sección</label>
                <input
                  type="text"
                  value={faqConfig.title || ''}
                  onChange={(e) => onUpdateFaq('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Consultas Frecuentes sobre Software a Medida"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">☀️ Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={faqConfig.titleColor || '#111827'} onChange={(e) => onUpdateFaq('titleColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                    <input type="text" value={faqConfig.titleColor || '#111827'} onChange={(e) => onUpdateFaq('titleColor', e.target.value)} className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">🌙 Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={faqConfig.titleColorDark || '#ffffff'} onChange={(e) => onUpdateFaq('titleColorDark', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                    <input type="text" value={faqConfig.titleColorDark || '#ffffff'} onChange={(e) => onUpdateFaq('titleColorDark', e.target.value)} className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                  </div>
                </div>
              </div>
            </div>

            {/* Preguntas */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">📋 Preguntas ({(faqConfig.items || []).length})</h4>
              <div className="space-y-3">
                {(faqConfig.items || []).map((item, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Pregunta {index + 1}</span>
                      <button
                        onClick={() => {
                          const items = [...(faqConfig.items || [])];
                          items.splice(index, 1);
                          onUpdateFaq('items', items);
                        }}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) => {
                          const items = [...(faqConfig.items || [])];
                          items[index] = { ...items[index], question: e.target.value };
                          onUpdateFaq('items', items);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-medium"
                        placeholder="¿Cuál es la pregunta?"
                      />
                      <textarea
                        value={item.answer}
                        onChange={(e) => {
                          const items = [...(faqConfig.items || [])];
                          items[index] = { ...items[index], answer: e.target.value };
                          onUpdateFaq('items', items);
                        }}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                        placeholder="Respuesta detallada..."
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  const items = [...(faqConfig.items || [])];
                  items.push({ question: '', answer: '' });
                  onUpdateFaq('items', items);
                }}
                className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
              >
                ➕ Agregar pregunta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesExtraSectionsConfig;
