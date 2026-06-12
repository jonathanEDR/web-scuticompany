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
import ContactModal from '../../components/public/ContactModal';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCmsData } from '../../hooks/cms/useCmsData';
import { proyectosApi } from '../../services/proyectosApi';
import type { ProyectoDetailConfig } from '../../components/cms/ProyectoDetailConfigSection';
import { DEFAULT_PROYECTO_DETAIL_CONFIG } from '../../components/cms/ProyectoDetailConfigSection';
import type { Proyecto } from '../../types/proyecto';
import { PROYECTO_CATEGORIAS, PROYECTO_ESTADOS, PLAN_PERIODOS } from '../../types/proyecto';

// Formatear precio con símbolo de moneda
const formatPrecio = (valor: number, moneda: string = 'PEN'): string => {
  const simbolo = moneda === 'PEN' ? 'S/' : moneda === 'USD' ? '$' : moneda === 'EUR' ? '€' : moneda;
  return `${simbolo} ${valor.toLocaleString('es-PE')}`;
};

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
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  // Plan seleccionado al pulsar "Lo quiero" en un plan específico (contexto del lead)
  const [planSeleccionado, setPlanSeleccionado] = useState<string | null>(null);

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
      navigate('/sistemas', { replace: true });
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
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Cargando sistema...</p>
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

  // Datos comerciales del sistema
  const modulos = proyecto.modulos || [];
  const beneficios = proyecto.beneficios || [];
  const planes = proyecto.planes || [];
  const faqs = proyecto.faqs || [];
  const problemas = proyecto.problemasQueResuelve || [];

  const abrirCotizacion = (plan?: string) => {
    setPlanSeleccionado(plan || null);
    setIsContactModalOpen(true);
  };

  const seoTitle    = (proyecto.seo?.metaTitle    || `${proyecto.nombre}${proyecto.rubro ? ` para ${proyecto.rubro}` : ''}`) + ' | Scuti Company';
  const seoDesc     = proyecto.seo?.metaDescription || proyecto.descripcionCorta || '';
  const seoUrl      = `https://scuticompany.com/sistemas/${proyecto.slug}`;
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
              <Link to="/sistemas" className={`hover:text-purple-500 transition-colors ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Sistemas</Link>
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
                  {proyecto.rubro && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-sm font-semibold border border-emerald-200 dark:border-emerald-800/40">
                      🎯 Para {proyecto.rubro}
                    </span>
                  )}
                  {proyecto.destacado && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-sm font-semibold border border-amber-200">
                      ⭐ Más vendido
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

                {/* Problemas que resuelve */}
                {problemas.length > 0 && (
                  <ul className="space-y-2">
                    {problemas.slice(0, 4).map((problema, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <LucideIcons.CheckCircle2 size={18} className="flex-shrink-0 mt-0.5 text-emerald-500" />
                        <span className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {problema}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Precio */}
                <div className={`flex items-center justify-between p-4 rounded-xl ${
                  isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100 shadow-sm'
                }`}>
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {proyecto.precioDesde ? 'Desde' : 'Precio'}
                  </span>
                  <span className={`text-2xl font-extrabold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                    {proyecto.precioDesde
                      ? formatPrecio(proyecto.precioDesde, proyecto.monedaPrecio)
                      : 'Consultar precio'}
                  </span>
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

                {/* Módulos incluidos (resumen) o stack tecnológico como fallback */}
                {modulos.length > 0 ? (
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Módulos incluidos
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {modulos.slice(0, 6).map((mod, idx) => (
                        <span
                          key={idx}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                            isDark
                              ? 'border-purple-500/30 text-purple-300 bg-purple-500/10'
                              : 'border-purple-200 text-purple-700 bg-purple-50'
                          }`}
                        >
                          {mod.icono ? `${mod.icono} ` : ''}{mod.nombre}
                        </span>
                      ))}
                      {modulos.length > 6 && (
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
                          isDark ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          +{modulos.length - 6} más
                        </span>
                      )}
                    </div>
                  </div>
                ) : cfg.hero.showTechStack !== false && proyecto.tecnologias && proyecto.tecnologias.length > 0 ? (
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
                ) : null}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    onClick={() => abrirCotizacion()}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/30"
                  >
                    💬 {cfg.hero.buttons?.consultarText || 'Solicitar cotización'}
                  </button>
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
                      👁️ Probar demo
                    </a>
                  )}
                  {tieneAcceso && proyecto.tieneUrl && (
                    <button
                      onClick={handleAcceder}
                      disabled={accediendo}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border disabled:opacity-50 ${
                        isDark
                          ? 'border-white/25 text-gray-300 hover:border-white/50 hover:text-white'
                          : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900'
                      }`}
                    >
                      {accediendo
                        ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />Conectando...</>
                        : <>🚀 Acceder a mi sistema</>
                      }
                    </button>
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
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{cfg.description.sectionTitle || 'Sobre el sistema'}</h2>
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

              {/* Beneficios para el negocio */}
              {beneficios.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      ¿Qué gana tu negocio?
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {beneficios.map((b, idx) => (
                      <div
                        key={idx}
                        className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] ${
                          isDark
                            ? 'bg-white/5 border-white/10 hover:border-emerald-500/30'
                            : 'bg-white border-gray-100 shadow-sm hover:border-emerald-200 hover:shadow-md'
                        }`}
                      >
                        <div className="text-2xl mb-2">{b.icono || '✅'}</div>
                        <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{b.titulo}</h3>
                        {b.descripcion && (
                          <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {b.descripcion}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Módulos del sistema (detalle) */}
              {modulos.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full" />
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Módulos del sistema
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {modulos.map((mod, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
                          isDark
                            ? 'bg-white/5 border-white/10 hover:border-purple-500/30'
                            : 'bg-white border-gray-100 shadow-sm hover:border-purple-200'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                          isDark ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50 border border-purple-100'
                        }`}>
                          {mod.icono || '📦'}
                        </div>
                        <div className="min-w-0">
                          <h3 className={`font-semibold text-sm mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>{mod.nombre}</h3>
                          {mod.descripcion && (
                            <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                              {mod.descripcion}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video demostrativo */}
              {proyecto.urlVideo && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-rose-500 to-orange-500 rounded-full" />
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Míralo en acción
                    </h2>
                  </div>
                  <div className="rounded-2xl overflow-hidden aspect-video shadow-xl">
                    <iframe
                      src={proyecto.urlVideo.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                      title={`Demo de ${proyecto.nombre}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
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

        {/* ── PLANES DE PRECIO ─────────────────────────────────────────── */}
        {planes.length > 0 && (
          <section className={`py-16 ${isDark ? 'bg-gray-900/50' : 'bg-white'}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className={`text-3xl font-extrabold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Planes y precios
                </h2>
                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Elige el plan que se ajuste al tamaño de tu negocio
                </p>
              </div>

              <div className={`grid grid-cols-1 gap-6 ${
                planes.length === 1 ? 'max-w-md mx-auto' : planes.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-3'
              }`}>
                {planes.map((plan, idx) => (
                  <div
                    key={idx}
                    className={`relative flex flex-col p-7 rounded-2xl border-2 transition-all hover:-translate-y-1 ${
                      plan.destacado
                        ? 'border-purple-500 shadow-xl shadow-purple-500/20'
                        : isDark
                          ? 'border-white/10 bg-white/5'
                          : 'border-gray-200 bg-white shadow-sm'
                    } ${plan.destacado ? (isDark ? 'bg-purple-900/15' : 'bg-purple-50/60') : ''}`}
                  >
                    {plan.destacado && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-lg">
                        ⭐ Recomendado
                      </span>
                    )}

                    <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{plan.nombre}</h3>
                    {plan.descripcion && (
                      <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{plan.descripcion}</p>
                    )}

                    <div className="mb-5">
                      {plan.precio !== null && plan.precio !== undefined ? (
                        <div className="flex items-baseline gap-1">
                          <span className={`text-3xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {formatPrecio(plan.precio, plan.moneda)}
                          </span>
                          <span className={`text-sm font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {PLAN_PERIODOS[plan.periodo] || ''}
                          </span>
                        </div>
                      ) : (
                        <span className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Consultar
                        </span>
                      )}
                    </div>

                    {plan.caracteristicas?.length > 0 && (
                      <ul className="space-y-2.5 mb-7 flex-1">
                        {plan.caracteristicas.map((c, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <LucideIcons.Check size={16} className={`flex-shrink-0 mt-0.5 ${plan.destacado ? 'text-purple-500' : 'text-emerald-500'}`} />
                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{c}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <button
                      onClick={() => abrirCotizacion(plan.nombre)}
                      className={`w-full px-5 py-3 rounded-xl font-bold transition-all ${
                        plan.destacado
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 hover:from-purple-700 hover:to-indigo-700'
                          : isDark
                            ? 'border border-white/20 text-white hover:bg-white/10'
                            : 'border border-gray-300 text-gray-700 hover:border-purple-400 hover:text-purple-700'
                      }`}
                    >
                      Lo quiero
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── PREGUNTAS FRECUENTES ─────────────────────────────────────── */}
        {faqs.length > 0 && (
          <section className="py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className={`text-3xl font-extrabold text-center mb-10 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Preguntas frecuentes
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <details
                    key={idx}
                    className={`group rounded-xl border overflow-hidden ${
                      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'
                    }`}
                  >
                    <summary className={`flex items-center justify-between gap-3 px-5 py-4 cursor-pointer select-none font-semibold text-sm md:text-base ${
                      isDark ? 'text-gray-200 hover:text-white' : 'text-gray-800 hover:text-purple-700'
                    }`}>
                      {faq.pregunta}
                      <LucideIcons.ChevronDown size={18} className="flex-shrink-0 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className={`px-5 pb-5 text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {faq.respuesta}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

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
              {cfg.cta.title || '¿Quieres este sistema'}<br />
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r"
                style={{ backgroundImage: `linear-gradient(to right, ${cfg.cta.primaryGradientFrom || '#9333ea'}, ${cfg.cta.primaryGradientTo || '#4f46e5'})` }}
              >
                {cfg.cta.titleHighlight || 'funcionando en tu negocio?'}
              </span>
            </h2>
            <p className={`text-lg mb-10 max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {cfg.cta.subtitle || 'Implementación rápida, capacitación incluida y soporte directo. Déjanos tus datos y te contactamos hoy.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => abrirCotizacion()}
                className="px-8 py-4 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-purple-500/30"
                style={{ background: `linear-gradient(to right, ${cfg.cta.primaryGradientFrom || '#9333ea'}, ${cfg.cta.primaryGradientTo || '#4f46e5'})` }}
              >
                💬 {cfg.cta.primaryButtonText || 'Solicitar cotización'}
              </button>
              <Link
                to={cfg.cta.secondaryButtonLink || '/sistemas'}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all border ${
                  isDark
                    ? 'border-white/15 text-white hover:bg-white/10'
                    : 'border-gray-200 text-gray-700 hover:bg-white bg-white shadow-sm'
                }`}
              >
                {cfg.cta.secondaryButtonText || '← Ver más sistemas'}
              </Link>
            </div>
          </div>
        </section>
        )}

      </main>

      <PublicFooter />
      <FloatingChatWidget />

      {/* Modal de cotización con contexto del sistema (crea Lead en el CRM) */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => { setIsContactModalOpen(false); setPlanSeleccionado(null); }}
        servicioInfo={{
          titulo: `${proyecto.nombre}${planSeleccionado ? ` — Plan ${planSeleccionado}` : ''}`,
          descripcionCorta: proyecto.descripcionCorta,
          precio: proyecto.precioDesde
            ? `Desde ${formatPrecio(proyecto.precioDesde, proyecto.monedaPrecio)}`
            : undefined,
          categoria: proyecto.rubro || categoriaInfo.label
        }}
        data={{
          title: `Quiero el sistema: ${proyecto.nombre}`,
          subtitle: 'SOLICITA TU COTIZACIÓN',
          description: 'Déjanos tus datos y te contactamos para coordinar una demo y darte el precio según tu negocio.',
          fields: {
            mensajePlaceholder: `Hola, estoy interesado en el sistema "${proyecto.nombre}"${planSeleccionado ? ` (plan ${planSeleccionado})` : ''}${proyecto.rubro ? ` para mi negocio de ${proyecto.rubro.toLowerCase()}` : ''}. Me gustaría ver una demo y recibir una cotización.`
          },
          messages: {
            success: '¡Gracias! Hemos recibido tu solicitud. Te contactaremos hoy mismo.',
            error: 'Error al enviar la solicitud. Por favor, intenta nuevamente.'
          }
        }}
      />
    </>
  );
}
