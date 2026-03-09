/**
 * 📄 DETALLE PÚBLICO DE PROYECTO - Diseño Profesional
 * Carrusel de imágenes + layout informativo moderno
 */

import React, { useState, useEffect, useCallback } from 'react';
import * as LucideIcons from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import FloatingChatWidget from '../../components/floating-chat/FloatingChatWidget';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCmsData } from '../../hooks/cms/useCmsData';
import { proyectosApi } from '../../services/proyectosApi';
import type { ProyectoDetailConfig } from '../../components/cms/ProyectoDetailConfigSection';
import { DEFAULT_PROYECTO_DETAIL_CONFIG } from '../../components/cms/ProyectoDetailConfigSection';
import type { Proyecto } from '../../types/proyecto';
import { PROYECTO_CATEGORIAS, PROYECTO_ESTADOS } from '../../types/proyecto';

// ─── Lucide Icon Helper (same pattern as ServicioDetail) ────────────────────
const LucideIcon: React.FC<{ name: string; size?: number; className?: string; style?: React.CSSProperties }> = ({
  name, size = 18, className = '', style = {}
}) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return <LucideIcons.BarChart2 size={size} className={className} style={style} />;
  return <IconComponent size={size} className={className} style={style} />;
};

// Map emoji → Lucide icon name for metric cards
const emojiToLucide = (emoji: string): string => {
  const map: Record<string, string> = {
    '⏱': 'Timer', '⏰': 'AlarmClock', '🕐': 'Clock', '🕑': 'Clock', '⌚': 'Watch',
    '📈': 'TrendingUp', '📉': 'TrendingDown', '📊': 'BarChart2', '📋': 'ClipboardList',
    '🚀': 'Rocket', '⚡': 'Zap', '💡': 'Lightbulb', '🎯': 'Target', '🏆': 'Trophy',
    '💰': 'DollarSign', '💵': 'Banknote', '🤝': 'Handshake', '👥': 'Users', '👤': 'User',
    '✅': 'CheckCircle', '☑️': 'CheckSquare', '🔧': 'Wrench', '🛠': 'Settings2',
    '📱': 'Smartphone', '💻': 'Laptop', '🖥': 'Monitor', '🖥️': 'Monitor',
    '🌐': 'Globe', '🔒': 'Lock', '🔓': 'Unlock', '🔑': 'Key', '🛡': 'Shield',
    '⭐': 'Star', '💎': 'Gem', '🏅': 'Medal', '🎖': 'Award',
    '🎨': 'Palette', '🔍': 'Search', '📧': 'Mail', '🔔': 'Bell', '💬': 'MessageCircle',
    '📦': 'Package', '🗂': 'FolderOpen', '📁': 'Folder', '📂': 'FolderOpen',
    '🔗': 'Link', '📌': 'MapPin', '📍': 'MapPin', '🗺': 'Map',
    '🎭': 'Drama', '✨': 'Sparkles', '🌟': 'Star', '💫': 'Sparkles',
    '💼': 'Briefcase', '🏢': 'Building2', '🏗': 'Building', '🏭': 'Factory',
    '⚙': 'Settings', '⚙️': 'Settings', '🔄': 'RefreshCw', '🔃': 'RefreshCw',
    '📅': 'Calendar', '📆': 'CalendarDays', '🗓': 'CalendarCheck',
    '🎉': 'PartyPopper', '🎊': 'Stars', '🥇': 'Medal', '🥈': 'Medal', '🥉': 'Medal',
  };
  return map[emoji] || map[emoji?.trim()] || 'BarChart2';
};

// ─── Image Carousel ───────────────────────────────────────────────────────────
interface CarouselProps {
  imagenes: string[];
  nombre: string;
  icono?: string;
  isDark: boolean;
}

function ImageCarousel({ imagenes, nombre, icono, isDark }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const total = imagenes.length;

  const goTo = useCallback((idx: number) => {
    if (isTransitioning || idx === current) return;
    setIsTransitioning(true);
    setCurrent(idx);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, current]);

  const prev = useCallback(() => goTo((current - 1 + total) % total), [current, total, goTo]);
  const next = useCallback(() => goTo((current + 1) % total), [current, total, goTo]);

  useEffect(() => {
    if (total <= 1) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next, total]);

  if (total === 0) {
    return (
      <div className={`aspect-[16/9] rounded-2xl flex items-center justify-center text-8xl ${
        isDark
          ? 'bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-white/10'
          : 'bg-gradient-to-br from-purple-100 to-indigo-100'
      }`}>
        {icono || '🚀'}
      </div>
    );
  }

  return (
    <div className="select-none">
      {/* Main slide */}
      <div className="relative rounded-2xl overflow-hidden aspect-[16/9] shadow-2xl group bg-black/20">
        <img
          key={current}
          src={imagenes[current]}
          alt={`${nombre} — imagen ${current + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

        {/* Counter badge */}
        {total > 1 && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium tabular-nums">
            {current + 1} / {total}
          </div>
        )}

        {/* Arrow buttons */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Siguiente imagen"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails + dots row */}
      {total > 1 && (
        <div className="mt-3 flex items-center gap-3">
          {/* Thumbnails */}
          <div className="flex gap-2 flex-1 overflow-x-auto scrollbar-hide pb-0.5">
            {imagenes.map((img, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  idx === current
                    ? 'border-purple-500 shadow-lg shadow-purple-500/30 scale-105'
                    : isDark
                      ? 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'
                      : 'border-gray-200 hover:border-purple-300 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex gap-1.5 flex-shrink-0">
            {imagenes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`rounded-full transition-all duration-200 ${
                  idx === current
                    ? 'w-5 h-2 bg-purple-500'
                    : isDark
                      ? 'w-2 h-2 bg-white/20 hover:bg-white/40'
                      : 'w-2 h-2 bg-gray-300 hover:bg-purple-400'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ProyectoDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';
  const { pageData: cmsPage } = useCmsData('proyecto-detail');

  // Merge CMS config with defaults
  const rawCfg = (cmsPage?.content?.proyectoDetailConfig || {}) as ProyectoDetailConfig;
  const cfg: Required<ProyectoDetailConfig> = {
    hero: { ...DEFAULT_PROYECTO_DETAIL_CONFIG.hero, ...rawCfg.hero, buttons: { ...DEFAULT_PROYECTO_DETAIL_CONFIG.hero!.buttons, ...rawCfg.hero?.buttons } } as any,
    description: { ...DEFAULT_PROYECTO_DETAIL_CONFIG.description, ...rawCfg.description } as any,
    results: { ...DEFAULT_PROYECTO_DETAIL_CONFIG.results, ...rawCfg.results, metricValueColor: { ...DEFAULT_PROYECTO_DETAIL_CONFIG.results!.metricValueColor, ...rawCfg.results?.metricValueColor } } as any,
    cta: { ...DEFAULT_PROYECTO_DETAIL_CONFIG.cta, ...rawCfg.cta } as any,
  };

  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [loading, setLoading] = useState(true);
  const [tieneAcceso, setTieneAcceso] = useState(false);
  const [accediendo, setAccediendo] = useState(false);

  useEffect(() => {
    if (slug) cargarProyecto();
  }, [slug]);

  useEffect(() => {
    if (user && proyecto) verificarAcceso();
  }, [user, proyecto]);

  const cargarProyecto = async () => {
    try {
      setLoading(true);
      const data = await proyectosApi.getProyectoBySlug(slug!);
      setProyecto(data);
    } catch {
      navigate('/proyectos', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const verificarAcceso = async () => {
    if (!proyecto) return;
    try {
      setTieneAcceso(await proyectosApi.verificarAcceso(proyecto._id));
    } catch {
      setTieneAcceso(false);
    }
  };

  const handleAcceder = async () => {
    if (!proyecto) return;
    try {
      setAccediendo(true);
      const data = await proyectosApi.accederProyecto(proyecto._id);
      window.open(data.url, '_blank', 'noopener,noreferrer');
    } catch (error: any) {
      alert(error.message || 'No tienes acceso a este sistema');
    } finally {
      setAccediendo(false);
    }
  };

  if (loading) {
    return (
      <>
        <PublicHeader />
        <main className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto mb-4" />
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Cargando proyecto...</p>
          </div>
        </main>
        <PublicFooter />
      </>
    );
  }

  if (!proyecto) return null;

  const categoriaInfo = PROYECTO_CATEGORIAS[proyecto.categoria] || PROYECTO_CATEGORIAS.otro;
  const estadoInfo    = PROYECTO_ESTADOS[proyecto.estado]       || PROYECTO_ESTADOS.activo;
  const imagenes = [proyecto.imagenPrincipal, ...(proyecto.imagenes || [])].filter(Boolean).slice(0, 4) as string[];
  const metricas = proyecto.resultados?.metricas || [];

  const metaItems = [
    proyecto.industria     && { label: '🏭 Industria', value: proyecto.industria },
    proyecto.clienteNombre && { label: '🤝 Cliente',   value: proyecto.clienteNombre },
    proyecto.fechaInicio   && { label: '📅 Inicio',    value: new Date(proyecto.fechaInicio).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' }) },
    (proyecto.fechaFin || proyecto.fechaFinalizacion) && {
      label: '🏁 Entrega',
      value: new Date((proyecto.fechaFin || proyecto.fechaFinalizacion)!).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' }),
    },
  ].filter(Boolean) as { label: string; value: string }[];

  const seoTitle    = (proyecto.seo?.metaTitle    || proyecto.nombre) + ' | Scuti Company';
  const seoDesc     = proyecto.seo?.metaDescription || proyecto.descripcionCorta || '';
  const seoUrl      = `https://scuticompany.com/proyectos/${proyecto.slug}`;
  const seoImage    = typeof proyecto.imagenPrincipal === 'string' && proyecto.imagenPrincipal.startsWith('http')
    ? proyecto.imagenPrincipal
    : 'https://scuticompany.com/logofondonegro.jpeg';

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        {proyecto.seo?.keywords && <meta name="keywords" content={proyecto.seo.keywords.join(', ')} />}
        <link rel="canonical" href={seoUrl} />
        {/* Open Graph */}
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={seoUrl} />
        <meta property="og:title"       content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:image"       content={seoImage} />
        <meta property="og:locale"      content="es_PE" />
        <meta property="og:site_name"   content="SCUTI Company" />
        {/* Twitter */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:site"        content="@scuticompany" />
        <meta name="twitter:title"       content={seoTitle} />
        <meta name="twitter:description" content={seoDesc} />
        <meta name="twitter:image"       content={seoImage} />
      </Helmet>

      <PublicHeader />

      <main className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className={`relative pt-20 pb-0 ${
          isDark
            ? 'bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950'
            : 'bg-gradient-to-b from-purple-50/80 via-white to-gray-50'
        }`}>
          {/* Decorative blobs */}
          {cfg.hero.showDecoBlobs !== false && (
            <>
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            </>
          )}

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">

            {/* Breadcrumb */}
            {cfg.hero.showBreadcrumb !== false && (
            <nav className="flex items-center gap-2 text-sm mb-8">
              <Link to="/" className={`hover:text-purple-500 transition-colors ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Inicio</Link>
              <svg className={`w-3 h-3 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <Link to="/proyectos" className={`hover:text-purple-500 transition-colors ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Proyectos</Link>
              <svg className={`w-3 h-3 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <span className={`font-medium truncate max-w-[200px] ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{proyecto.nombre}</span>
            </nav>
            )}

            {/* Grid: Carousel | Info */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 xl:gap-14 items-start">

              {/* LEFT — Carousel */}
              <ImageCarousel
                imagenes={imagenes}
                nombre={proyecto.nombre}
                icono={proyecto.icono}
                isDark={isDark}
              />

              {/* RIGHT — Info panel */}
              <div className="flex flex-col gap-6">

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold"
                    style={{ backgroundColor: `${categoriaInfo.color}18`, color: categoriaInfo.color, border: `1px solid ${categoriaInfo.color}35` }}
                  >
                    {categoriaInfo.icon} {categoriaInfo.label}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${estadoInfo.bgColor}`}>
                    {estadoInfo.icon} {estadoInfo.label}
                  </span>
                  {proyecto.destacado && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-sm font-semibold border border-amber-200">
                      ⭐ Destacado
                    </span>
                  )}
                </div>

                {/* Title + short desc */}
                <div>
                  <h1 className={`text-3xl md:text-4xl font-extrabold leading-tight mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {proyecto.nombre}
                  </h1>
                  <p className={`text-base leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {proyecto.descripcionCorta}
                  </p>
                </div>

                {/* Meta info */}
                {cfg.hero.showMetaInfo !== false && metaItems.length > 0 && (
                  <div className={`grid grid-cols-2 gap-3 p-4 rounded-xl ${
                    isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100 shadow-sm'
                  }`}>
                    {metaItems.map((item, i) => (
                      <div key={i}>
                        <p className={`text-xs font-medium mb-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{item.label}</p>
                        <p className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tech stack */}
                {cfg.hero.showTechStack !== false && proyecto.tecnologias && proyecto.tecnologias.length > 0 && (
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Stack tecnológico
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {proyecto.tecnologias.map((tech, idx) => (
                        <span
                          key={idx}
                          className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                            isDark
                              ? 'border-white/15 text-gray-300 hover:border-white/30 hover:text-white'
                              : 'border-gray-300 text-gray-600 hover:border-purple-400 hover:text-gray-900'
                          }`}
                        >
                          {tech.nombre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 pt-1">
                  {tieneAcceso && proyecto.tieneUrl && (
                    <button
                      onClick={handleAcceder}
                      disabled={accediendo}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50"
                    >
                      {accediendo
                        ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />Conectando...</>
                        : <>🚀 Acceder al Sistema</>
                      }
                    </button>
                  )}
                  {proyecto.urlDemo && (
                    <a
                      href={proyecto.urlDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border ${
                        isDark
                          ? 'border-white/25 text-gray-300 hover:border-white/50 hover:text-white'
                          : 'border-gray-300 text-gray-600 hover:border-purple-400 hover:text-gray-900'
                      }`}
                    >
                      Ver Demo
                    </a>
                  )}
                  {cfg.hero.buttons?.showConsultar !== false && (
                    <Link
                      to={cfg.hero.buttons?.consultarLink || '/contacto'}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border ${
                        isDark
                          ? 'border-white/25 text-gray-300 hover:border-white/50 hover:text-white'
                          : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900'
                      }`}
                    >
                      {cfg.hero.buttons?.consultarText || 'Consultar'}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Accent line */}
          {cfg.hero.showAccentLine !== false && (
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
          )}
        </section>

        {/* ── CONTENT ──────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Description column */}
            <div className="lg:col-span-2 space-y-10">

              {/* Sobre el proyecto */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 rounded-full" style={{ background: `linear-gradient(to bottom, ${cfg.description.accentGradientFrom}, ${cfg.description.accentGradientTo})` }} />
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{cfg.description.sectionTitle || 'Sobre el proyecto'}</h2>
                </div>
                <div
                  className={`prose prose-base max-w-none leading-relaxed ${
                    isDark
                      ? 'prose-invert prose-p:text-gray-300 prose-headings:text-white prose-strong:text-white prose-li:text-gray-300'
                      : 'prose-p:text-gray-600 prose-headings:text-gray-900 prose-li:text-gray-600'
                  }`}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(proyecto.descripcionCompleta || `<p>${proyecto.descripcionCorta}</p>`) }}
                />
              </div>

              {/* Impacto highlight */}
              {cfg.description.showImpactHighlight !== false && proyecto.resultados?.descripcion && (
                <div className={`p-6 rounded-2xl border-l-4 border-purple-500 ${
                  isDark ? 'bg-purple-900/10 border border-purple-800/30' : 'bg-purple-50 border border-purple-100'
                }`}>
                  <p className={`font-semibold text-sm uppercase tracking-wide mb-2 ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
                    💡 {cfg.description.impactTitle || 'Impacto del proyecto'}
                  </p>
                  <p className={`text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {proyecto.resultados.descripcion}
                  </p>
                </div>
              )}

              {/* Full tech grid (if many techs) */}
              {cfg.description.showFullTechGrid !== false && proyecto.tecnologias && proyecto.tecnologias.length > (cfg.description.fullTechGridThreshold || 5) && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Tecnologías utilizadas</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {proyecto.tecnologias.map((tech, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                          isDark
                            ? 'border-white/10 text-gray-300 hover:border-white/25'
                            : 'border-gray-200 text-gray-700 hover:border-purple-300'
                        }`}
                      >
                        <div className={`w-1 h-5 rounded-full flex-shrink-0 ${isDark ? 'bg-white/20' : 'bg-gray-300'}`} />
                        <p className={`text-sm font-medium flex-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{tech.nombre}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">

              {/* Metric cards */}
              {metricas.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-1 h-6 rounded-full ${isDark ? 'bg-white/30' : 'bg-gray-400'}`} />
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{cfg.results.sectionTitle || 'Resultados clave'}</h3>
                  </div>
                  <div className="space-y-3">
                    {metricas.map((m, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border transition-all hover:scale-[1.01] ${
                          isDark
                            ? 'bg-white/5 border-white/10 hover:bg-white/8'
                            : 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-purple-100'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Theme-adaptive icon using Lucide (replaces colorful emojis) */}
                          <div
                            className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                              isDark
                                ? 'bg-white/8 border border-white/10'
                                : 'bg-purple-50 border border-purple-100'
                            }`}
                          >
                            <LucideIcon
                              name={emojiToLucide(m.icono || '')}
                              size={17}
                              style={{ color: isDark
                                ? (cfg.results.metricValueColor?.dark  || '#c084fc')
                                : (cfg.results.metricValueColor?.light || '#9333ea') }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className={`text-[11px] font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{m.nombre}</p>
                            <p className="text-xl font-extrabold leading-tight" style={{ color: isDark ? cfg.results.metricValueColor?.dark : cfg.results.metricValueColor?.light }}>{m.valor}</p>
                            {m.descripcion && (
                              <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{m.descripcion}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ficha técnica */}
              {cfg.results.showFichaTecnica !== false && (
              <div className={`rounded-2xl p-5 border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm'
              }`}>
                <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {cfg.results.fichaTecnicaTitle || 'Ficha técnica'}
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Categoría', node: <span style={{ color: categoriaInfo.color }}>{categoriaInfo.icon} {categoriaInfo.label}</span> },
                    { label: 'Estado',    node: <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${estadoInfo.bgColor}`}>{estadoInfo.icon} {estadoInfo.label}</span> },
                    proyecto.industria    && { label: 'Industria', node: <span className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{proyecto.industria}</span> },
                    proyecto.clienteNombre && { label: 'Cliente',  node: <span className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{proyecto.clienteNombre}</span> },
                    proyecto.tecnologias?.length && { label: 'Tecnologías', node: <span className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{proyecto.tecnologias.length} usadas</span> },
                    proyecto.vistas !== undefined && { label: '👀 Vistas', node: <span className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{(proyecto.vistas || 0).toLocaleString()}</span> },
                  ].filter(Boolean).map((row: any, i, arr) => (
                    <div key={i}>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{row.label}</span>
                        {row.node}
                      </div>
                      {i < arr.length - 1 && <div className={`mt-3 border-t ${isDark ? 'border-white/8' : 'border-gray-50'}`} />}
                    </div>
                  ))}
                </div>
              </div>
              )}

              {/* Quick access sidebar */}
              {cfg.results.showAccessLinks !== false && (proyecto.urlDemo || (tieneAcceso && proyecto.tieneUrl)) && (
                <div className={`rounded-2xl p-5 border space-y-2 ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm'
                }`}>
                  <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {cfg.results.accessLinksTitle || 'Acceso directo'}
                  </h3>
                  {tieneAcceso && proyecto.tieneUrl && (
                    <button
                      onClick={handleAcceder}
                      disabled={accediendo}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50"
                    >
                      🚀 Acceder al Sistema
                    </button>
                  )}
                  {proyecto.urlDemo && (
                    <a
                      href={proyecto.urlDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                        isDark ? 'border-white/15 text-white hover:bg-white/10' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      👁️ Ver Demo en vivo
                    </a>
                  )}
                </div>
              )}


            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ───────────────────────────────────────────────── */}
        {cfg.cta.show !== false && (
        <section className={`py-16 ${
          isDark
            ? 'bg-gradient-to-b from-gray-950 to-gray-900'
            : 'bg-gradient-to-b from-gray-50 to-purple-50/40'
        }`}>
          <div className="max-w-5xl mx-auto px-4 text-center">
            <div className="flex items-center gap-4 mb-10">
              <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
              <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {cfg.cta.dividerText || '¿Listo para empezar?'}
              </span>
              <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
            </div>

            <h2 className={`text-3xl md:text-4xl font-extrabold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {cfg.cta.title || 'Desarrollamos la solución ideal'}<br />
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r"
                style={{ backgroundImage: `linear-gradient(to right, ${cfg.cta.primaryGradientFrom || '#9333ea'}, ${cfg.cta.primaryGradientTo || '#4f46e5'})` }}
              >
                {cfg.cta.titleHighlight || 'para tu negocio'}
              </span>
            </h2>
            <p className={`text-lg mb-10 max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {cfg.cta.subtitle || 'Cada proyecto que creamos está diseñado para generar resultados reales. Hablemos de tus objetivos.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={cfg.cta.primaryButtonLink || '/contacto'}
                className="px-8 py-4 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-purple-500/30"
                style={{ background: `linear-gradient(to right, ${cfg.cta.primaryGradientFrom || '#9333ea'}, ${cfg.cta.primaryGradientTo || '#4f46e5'})` }}
              >
                💬 {cfg.cta.primaryButtonText || 'Iniciar conversación'}
              </Link>
              <Link
                to={cfg.cta.secondaryButtonLink || '/proyectos'}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all border ${
                  isDark
                    ? 'border-white/15 text-white hover:bg-white/10'
                    : 'border-gray-200 text-gray-700 hover:bg-white bg-white shadow-sm'
                }`}
              >
                {cfg.cta.secondaryButtonText || '← Ver más proyectos'}
              </Link>
            </div>
          </div>
        </section>
        )}

      </main>

      <PublicFooter />
      <FloatingChatWidget />
    </>
  );
}
