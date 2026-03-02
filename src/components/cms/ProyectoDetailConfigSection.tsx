/**
 * 📋 Configuración CMS para la página ProyectoDetail
 * Permite personalizar: Hero, Descripción, Sidebar de Resultados y CTA
 */

import { useState } from 'react';

// ─── Tipos ─────────────────────────────────────────────────────────────────────
export interface ProyectoDetailConfig {
  hero?: {
    showBreadcrumb?: boolean;
    showDecoBlobs?: boolean;
    showAccentLine?: boolean;
    gradientFrom?: { light?: string; dark?: string };
    gradientVia?: { light?: string; dark?: string };
    gradientTo?: { light?: string; dark?: string };
    titleSize?: string; // e.g. 'text-3xl md:text-4xl'
    showMetaInfo?: boolean;
    showTechStack?: boolean;
    buttons?: {
      showConsultar?: boolean;
      consultarText?: string;
      consultarLink?: string;
      demoText?: string;
      accederText?: string;
      style?: 'outline' | 'solid'; // outline = border only; solid = bg filled
      borderColor?: { light?: string; dark?: string };
    };
  };
  description?: {
    sectionTitle?: string;
    accentGradientFrom?: string;
    accentGradientTo?: string;
    showImpactHighlight?: boolean;
    impactTitle?: string;
    showFullTechGrid?: boolean;
    fullTechGridThreshold?: number; // how many techs to show full grid (default 5)
  };
  results?: {
    sectionTitle?: string;
    showFichaTecnica?: boolean;
    fichaTecnicaTitle?: string;
    showAccessLinks?: boolean;
    accessLinksTitle?: string;
    metricValueColor?: { light?: string; dark?: string };
  };
  cta?: {
    show?: boolean;
    dividerText?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    primaryButtonText?: string;
    primaryButtonLink?: string;
    primaryGradientFrom?: string;
    primaryGradientTo?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
    backgroundGradientFrom?: { light?: string; dark?: string };
    backgroundGradientTo?: { light?: string; dark?: string };
  };
}

export const DEFAULT_PROYECTO_DETAIL_CONFIG: ProyectoDetailConfig = {
  hero: {
    showBreadcrumb: true,
    showDecoBlobs: true,
    showAccentLine: true,
    gradientFrom: { light: 'rgba(250,245,255,0.8)', dark: '#111827' },
    gradientVia: { light: '#ffffff', dark: '#111827' },
    gradientTo: { light: '#f9fafb', dark: '#030712' },
    titleSize: 'text-3xl md:text-4xl',
    showMetaInfo: true,
    showTechStack: true,
    buttons: {
      showConsultar: true,
      consultarText: 'Consultar',
      consultarLink: '/contacto',
      demoText: 'Ver Demo',
      accederText: 'Acceder al Sistema',
      style: 'outline',
      borderColor: { light: '#d1d5db', dark: 'rgba(255,255,255,0.25)' },
    },
  },
  description: {
    sectionTitle: 'Sobre el proyecto',
    accentGradientFrom: '#9333ea',
    accentGradientTo: '#4f46e5',
    showImpactHighlight: true,
    impactTitle: 'Impacto del proyecto',
    showFullTechGrid: true,
    fullTechGridThreshold: 5,
  },
  results: {
    sectionTitle: 'Resultados clave',
    showFichaTecnica: true,
    fichaTecnicaTitle: 'Ficha técnica',
    showAccessLinks: true,
    accessLinksTitle: 'Acceso directo',
    metricValueColor: { light: '#9333ea', dark: '#c084fc' },
  },
  cta: {
    show: true,
    dividerText: '¿Listo para empezar?',
    title: 'Desarrollamos la solución ideal',
    titleHighlight: 'para tu negocio',
    subtitle: 'Cada proyecto que creamos está diseñado para generar resultados reales. Hablemos de tus objetivos.',
    primaryButtonText: 'Iniciar conversación',
    primaryButtonLink: '/contacto',
    primaryGradientFrom: '#9333ea',
    primaryGradientTo: '#4f46e5',
    secondaryButtonText: '← Ver más proyectos',
    secondaryButtonLink: '/proyectos',
    backgroundGradientFrom: { light: '#f9fafb', dark: '#030712' },
    backgroundGradientTo: { light: 'rgba(250,245,255,0.4)', dark: '#111827' },
  },
};

// ─── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  config: ProyectoDetailConfig;
  onChange: (config: ProyectoDetailConfig) => void;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function deepMerge(target: any, source: any): any {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else if (source[key] !== undefined) {
      result[key] = source[key];
    }
  }
  return result;
}

// ─── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({
  id: _id, icon, title, description, expanded, onToggle,
}: {
  id: string; icon: string; title: string; description: string; expanded: boolean; onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between p-5 rounded-xl transition-all ${
        expanded
          ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'
          : 'bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300 dark:hover:border-purple-700'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="text-left">
          <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <svg
        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function ProyectoDetailConfigSection({ config, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const toggle = (s: string) => setExpanded(expanded === s ? null : s);

  // Merged config with defaults
  const c = deepMerge(DEFAULT_PROYECTO_DETAIL_CONFIG, config);

  // Update helpers
  const update = (path: string, value: any) => {
    const parts = path.split('.');
    const result = { ...c };
    let current: any = result;
    for (let i = 0; i < parts.length - 1; i++) {
      current[parts[i]] = { ...current[parts[i]] };
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    onChange(result);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-5 mb-2">
        <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 mb-2">
          📋 Configuración de Página "Proyecto Detalle"
        </h3>
        <p className="text-emerald-700 dark:text-emerald-300 text-sm mb-3">
          Personaliza la apariencia de la página individual de cada proyecto del portafolio.
        </p>
        <ul className="text-emerald-600 dark:text-emerald-400 text-sm space-y-1">
          <li>✅ <strong>Hero:</strong> Carrusel, breadcrumb, badges, tech stack, botones</li>
          <li>✅ <strong>Descripción:</strong> Título, highlight de impacto, grid de tecnologías</li>
          <li>✅ <strong>Resultados:</strong> Métricas, ficha técnica, acceso directo</li>
          <li>✅ <strong>CTA:</strong> Llamada a la acción final con gradientes y textos</li>
        </ul>
      </div>

      {/* ═════ HERO ═════ */}
      <SectionHeader
        id="hero" icon="🎯" title="Hero Section"
        description="Carrusel, breadcrumb, badges, meta info, stack y botones de acción"
        expanded={expanded === 'hero'} onToggle={() => toggle('hero')}
      />
      {expanded === 'hero' && (
        <div className="p-5 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 space-y-5">
          {/* Toggles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { key: 'hero.showBreadcrumb', label: 'Mostrar Breadcrumb' },
              { key: 'hero.showDecoBlobs', label: 'Efectos decorativos' },
              { key: 'hero.showAccentLine', label: 'Línea de acento' },
              { key: 'hero.showMetaInfo', label: 'Info meta (industria, etc.)' },
              { key: 'hero.showTechStack', label: 'Stack tecnológico' },
            ].map(({ key, label }) => {
              const val = key.split('.').reduce((o: any, k) => o?.[k], c);
              return (
                <label key={key} className="flex items-center gap-2 cursor-pointer bg-gray-50 dark:bg-gray-700/30 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600">
                  <input
                    type="checkbox"
                    checked={!!val}
                    onChange={(e) => update(key, e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                </label>
              );
            })}
          </div>

          {/* Buttons config */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">⚡ Botones de acción</h4>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 cursor-pointer bg-gray-50 dark:bg-gray-700/30 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600">
                <input
                  type="checkbox"
                  checked={!!c.hero?.buttons?.showConsultar}
                  onChange={(e) => update('hero.buttons.showConsultar', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mostrar "Consultar"</span>
              </label>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Estilo de botones</label>
                <select
                  value={c.hero?.buttons?.style || 'outline'}
                  onChange={(e) => update('hero.buttons.style', e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200"
                >
                  <option value="outline">Outline (solo borde)</option>
                  <option value="solid">Solid (relleno)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Texto "Consultar"</label>
                <input
                  type="text"
                  value={c.hero?.buttons?.consultarText || ''}
                  onChange={(e) => update('hero.buttons.consultarText', e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Texto "Ver Demo"</label>
                <input
                  type="text"
                  value={c.hero?.buttons?.demoText || ''}
                  onChange={(e) => update('hero.buttons.demoText', e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Texto "Acceder"</label>
                <input
                  type="text"
                  value={c.hero?.buttons?.accederText || ''}
                  onChange={(e) => update('hero.buttons.accederText', e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Enlace del botón consultar</label>
                <input
                  type="text"
                  value={c.hero?.buttons?.consultarLink || '/contacto'}
                  onChange={(e) => update('hero.buttons.consultarLink', e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Color borde (Light)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={c.hero?.buttons?.borderColor?.light || '#d1d5db'}
                    onChange={(e) => update('hero.buttons.borderColor.light', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border"
                  />
                  <input
                    type="text"
                    value={c.hero?.buttons?.borderColor?.light || '#d1d5db'}
                    onChange={(e) => update('hero.buttons.borderColor.light', e.target.value)}
                    className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs font-mono text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═════ DESCRIPCIÓN ═════ */}
      <SectionHeader
        id="description" icon="📝" title="Sección de Descripción"
        description="Título, contenido del proyecto, highlight de impacto, grid de tecnologías"
        expanded={expanded === 'description'} onToggle={() => toggle('description')}
      />
      {expanded === 'description' && (
        <div className="p-5 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Título de la sección</label>
              <input
                type="text"
                value={c.description?.sectionTitle || ''}
                onChange={(e) => update('description.sectionTitle', e.target.value)}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200"
                placeholder="Sobre el proyecto"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Título highlight impacto</label>
              <input
                type="text"
                value={c.description?.impactTitle || ''}
                onChange={(e) => update('description.impactTitle', e.target.value)}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200"
                placeholder="Impacto del proyecto"
              />
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Color acento (desde)</label>
              <div className="flex items-center gap-2">
                <input type="color" value={c.description?.accentGradientFrom || '#9333ea'} onChange={(e) => update('description.accentGradientFrom', e.target.value)} className="w-8 h-8 rounded cursor-pointer border" />
                <input type="text" value={c.description?.accentGradientFrom || '#9333ea'} onChange={(e) => update('description.accentGradientFrom', e.target.value)} className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs font-mono text-gray-800 dark:text-gray-200" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Color acento (hasta)</label>
              <div className="flex items-center gap-2">
                <input type="color" value={c.description?.accentGradientTo || '#4f46e5'} onChange={(e) => update('description.accentGradientTo', e.target.value)} className="w-8 h-8 rounded cursor-pointer border" />
                <input type="text" value={c.description?.accentGradientTo || '#4f46e5'} onChange={(e) => update('description.accentGradientTo', e.target.value)} className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs font-mono text-gray-800 dark:text-gray-200" />
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 cursor-pointer bg-gray-50 dark:bg-gray-700/30 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600">
              <input type="checkbox" checked={!!c.description?.showImpactHighlight} onChange={(e) => update('description.showImpactHighlight', e.target.checked)} className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mostrar highlight de impacto</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer bg-gray-50 dark:bg-gray-700/30 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600">
              <input type="checkbox" checked={!!c.description?.showFullTechGrid} onChange={(e) => update('description.showFullTechGrid', e.target.checked)} className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mostrar grid completo de techs</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Umbral para grid completo: {c.description?.fullTechGridThreshold || 5} tecnologías
            </label>
            <input
              type="range" min="2" max="10" step="1"
              value={c.description?.fullTechGridThreshold || 5}
              onChange={(e) => update('description.fullTechGridThreshold', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
              <span>2</span><span>10</span>
            </div>
          </div>
        </div>
      )}

      {/* ═════ RESULTADOS / SIDEBAR ═════ */}
      <SectionHeader
        id="results" icon="📊" title="Sidebar de Resultados"
        description="Métricas, ficha técnica, enlaces de acceso directo"
        expanded={expanded === 'results'} onToggle={() => toggle('results')}
      />
      {expanded === 'results' && (
        <div className="p-5 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Título resultados</label>
              <input type="text" value={c.results?.sectionTitle || ''} onChange={(e) => update('results.sectionTitle', e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Título ficha técnica</label>
              <input type="text" value={c.results?.fichaTecnicaTitle || ''} onChange={(e) => update('results.fichaTecnicaTitle', e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Título acceso directo</label>
              <input type="text" value={c.results?.accessLinksTitle || ''} onChange={(e) => update('results.accessLinksTitle', e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 cursor-pointer bg-gray-50 dark:bg-gray-700/30 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600">
              <input type="checkbox" checked={!!c.results?.showFichaTecnica} onChange={(e) => update('results.showFichaTecnica', e.target.checked)} className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mostrar ficha técnica</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer bg-gray-50 dark:bg-gray-700/30 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600">
              <input type="checkbox" checked={!!c.results?.showAccessLinks} onChange={(e) => update('results.showAccessLinks', e.target.checked)} className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mostrar enlaces de acceso</span>
            </label>
          </div>

          {/* Metric value color */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Color valor métrica (Light)</label>
              <div className="flex items-center gap-2">
                <input type="color" value={c.results?.metricValueColor?.light || '#9333ea'} onChange={(e) => update('results.metricValueColor.light', e.target.value)} className="w-8 h-8 rounded cursor-pointer border" />
                <input type="text" value={c.results?.metricValueColor?.light || '#9333ea'} onChange={(e) => update('results.metricValueColor.light', e.target.value)} className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs font-mono text-gray-800 dark:text-gray-200" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Color valor métrica (Dark)</label>
              <div className="flex items-center gap-2">
                <input type="color" value={c.results?.metricValueColor?.dark || '#c084fc'} onChange={(e) => update('results.metricValueColor.dark', e.target.value)} className="w-8 h-8 rounded cursor-pointer border" />
                <input type="text" value={c.results?.metricValueColor?.dark || '#c084fc'} onChange={(e) => update('results.metricValueColor.dark', e.target.value)} className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs font-mono text-gray-800 dark:text-gray-200" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═════ CTA ═════ */}
      <SectionHeader
        id="cta" icon="🚀" title="Llamada a la Acción (CTA)"
        description="Sección inferior con título, subtexto, botones y gradientes"
        expanded={expanded === 'cta'} onToggle={() => toggle('cta')}
      />
      {expanded === 'cta' && (
        <div className="p-5 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 space-y-4">
          <label className="flex items-center gap-2 cursor-pointer bg-gray-50 dark:bg-gray-700/30 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600">
            <input type="checkbox" checked={c.cta?.show !== false} onChange={(e) => update('cta.show', e.target.checked)} className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mostrar sección CTA</span>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Texto divisor</label>
              <input type="text" value={c.cta?.dividerText || ''} onChange={(e) => update('cta.dividerText', e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Título highlight (gradiente)</label>
              <input type="text" value={c.cta?.titleHighlight || ''} onChange={(e) => update('cta.titleHighlight', e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Título principal</label>
            <input type="text" value={c.cta?.title || ''} onChange={(e) => update('cta.title', e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Subtítulo</label>
            <textarea value={c.cta?.subtitle || ''} onChange={(e) => update('cta.subtitle', e.target.value)} rows={2} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200 resize-none" />
          </div>

          {/* Buttons */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Botón principal</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Texto</label>
                <input type="text" value={c.cta?.primaryButtonText || ''} onChange={(e) => update('cta.primaryButtonText', e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Gradiente desde</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={c.cta?.primaryGradientFrom || '#9333ea'} onChange={(e) => update('cta.primaryGradientFrom', e.target.value)} className="w-8 h-8 rounded cursor-pointer border" />
                  <input type="text" value={c.cta?.primaryGradientFrom || '#9333ea'} onChange={(e) => update('cta.primaryGradientFrom', e.target.value)} className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs font-mono text-gray-800 dark:text-gray-200" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Gradiente hasta</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={c.cta?.primaryGradientTo || '#4f46e5'} onChange={(e) => update('cta.primaryGradientTo', e.target.value)} className="w-8 h-8 rounded cursor-pointer border" />
                  <input type="text" value={c.cta?.primaryGradientTo || '#4f46e5'} onChange={(e) => update('cta.primaryGradientTo', e.target.value)} className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-xs font-mono text-gray-800 dark:text-gray-200" />
                </div>
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Enlace</label>
              <input type="text" value={c.cta?.primaryButtonLink || '/contacto'} onChange={(e) => update('cta.primaryButtonLink', e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200 font-mono" />
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Botón secundario</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Texto</label>
                <input type="text" value={c.cta?.secondaryButtonText || ''} onChange={(e) => update('cta.secondaryButtonText', e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Enlace</label>
                <input type="text" value={c.cta?.secondaryButtonLink || '/proyectos'} onChange={(e) => update('cta.secondaryButtonLink', e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200 font-mono" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
