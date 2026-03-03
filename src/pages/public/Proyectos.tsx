/**
 * 🌟 PORTAFOLIO PÚBLICO DE PROYECTOS
 * Galería visual de proyectos que muestra el trabajo de la empresa
 * - Visitantes: ven portafolio público
 * - Clientes logueados: ven botón de acceso en proyectos asignados
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import FloatingChatWidget from '../../components/floating-chat/FloatingChatWidget';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { proyectosApi } from '../../services/proyectosApi';
import { getPageBySlug } from '../../services/cmsApi';
import type { Proyecto, ProyectoCategoria } from '../../types/proyecto';
import { PROYECTO_CATEGORIAS, PROYECTO_ESTADOS } from '../../types/proyecto';

// Helper: extraer texto plano de HTML (para SEO / fallbacks)
const stripHtml = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// ============================================
// COMPONENTE TARJETA DE PROYECTO
// ============================================

interface PortfolioCardDesignTheme {
  cardBg?: string;
  cardBorder?: string;
  cardHoverBorder?: string;
  cardRadius?: string;
  cardShadow?: string;
  cardHoverShadow?: string;
  imageHeight?: string;
  titleColor?: string;
  descriptionColor?: string;
  tagBg?: string;
  tagText?: string;
  tagBorder?: string;
  metricsValueColor?: string;
  metricsLabelColor?: string;
  buttonBg?: string;
  buttonText?: string;
  buttonBorder?: string;
  accentFrom?: string;
  accentTo?: string;
}

interface ProyectoCardProps {
  proyecto: Proyecto;
  tieneAcceso: boolean;
  onAcceder: (id: string) => void;
  theme: string;
  cardDesign?: PortfolioCardDesignTheme;
}

const ProyectoCard = ({ proyecto, tieneAcceso, onAcceder, theme, cardDesign }: ProyectoCardProps) => {
  const isDark = theme === 'dark';
  const estadoInfo = PROYECTO_ESTADOS[proyecto.estado] || PROYECTO_ESTADOS.activo;
  const categoriaInfo = PROYECTO_CATEGORIAS[proyecto.categoria] || PROYECTO_CATEGORIAS.otro;

  // Shortcut para estilos CMS
  const cd = cardDesign || {} as PortfolioCardDesignTheme;
  const [isHovered, setIsHovered] = useState(false);

  // Métricas destacadas (hasta 2)
  const metricasDestacadas = (proyecto.resultados?.metricas || []).slice(0, 2);

  return (
    <div
      className="group relative overflow-hidden transition-all duration-500 hover:-translate-y-2"
      style={{
        background: cd.cardBg || (isDark ? 'rgba(17,24,39,0.8)' : '#ffffff'),
        border: `1px solid ${isHovered ? (cd.cardHoverBorder || (isDark ? 'rgba(168,85,247,0.4)' : '#d8b4fe')) : (cd.cardBorder || (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(229,231,235,0.8)'))}`,
        borderRadius: `${cd.cardRadius || '16'}px`,
        boxShadow: isHovered ? (cd.cardHoverShadow || (isDark ? '0 25px 50px rgba(0,0,0,0.5)' : '0 25px 50px rgba(147,51,234,0.15)')) : (cd.cardShadow || (isDark ? '0 4px 6px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.06)')),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen con overlay profesional */}
      <div className="relative overflow-hidden" style={{ height: `${cd.imageHeight || '224'}px` }}>
        {proyecto.imagenPrincipal ? (
          <>
            <img
              src={proyecto.imagenPrincipal}
              alt={proyecto.nombre}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            {/* Gradient overlay siempre visible */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: isDark
                ? `linear-gradient(135deg, ${cd.accentFrom || '#9333ea'}30, ${cd.accentTo || '#4f46e5'}20, ${cd.cardBg || 'rgba(17,24,39,0.8)'})`
                : `linear-gradient(135deg, ${cd.accentFrom || '#9333ea'}18, ${cd.accentTo || '#4f46e5'}10, #ffffff)`
            }}
          >
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center ${
                isDark ? 'bg-white/10 backdrop-blur-sm' : 'bg-purple-100'
              }`}>
                <span className="text-3xl">{categoriaInfo.icon}</span>
              </div>
              <p className={`text-sm font-medium ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>Sin imagen</p>
            </div>
          </div>
        )}

        {/* Badges superiores */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="flex gap-2">
            {proyecto.destacado && (
              <span className="px-2.5 py-1 bg-amber-400/95 backdrop-blur-md text-gray-900 rounded-lg text-xs font-bold shadow-lg">
                ⭐ Destacado
              </span>
            )}
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md shadow-lg ${
              proyecto.estado === 'activo'
                ? 'bg-emerald-500/90 text-white'
                : proyecto.estado === 'en_desarrollo'
                  ? 'bg-blue-500/90 text-white'
                  : proyecto.estado === 'completado'
                    ? 'bg-purple-500/90 text-white'
                    : 'bg-gray-500/90 text-white'
            }`}>
              {estadoInfo.icon} {estadoInfo.label}
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-md shadow-lg bg-black/40 text-white border border-white/10">
            {categoriaInfo.icon} {categoriaInfo.label}
          </span>
        </div>

        {/* Título overlay sobre imagen (cuando hay imagen) */}
        {proyecto.imagenPrincipal && (
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-xl font-bold text-white mb-0.5 line-clamp-1 drop-shadow-lg">
              {proyecto.nombre}
            </h3>
            {proyecto.industria && (
              <span className="text-xs text-white/70 font-medium">
                {proyecto.industria}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5">
        {/* Título (solo si no hay imagen) */}
        {!proyecto.imagenPrincipal && (
          <div className="mb-3">
            <h3
              className="text-lg font-bold mb-0.5 transition-colors"
              style={{ color: isHovered ? (cd.accentFrom || (isDark ? '#c084fc' : '#9333ea')) : (cd.titleColor || (isDark ? '#ffffff' : '#111827')) }}
            >
              {proyecto.nombre}
            </h3>
            {proyecto.industria && (
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {proyecto.industria}
              </span>
            )}
          </div>
        )}

        {/* Descripción */}
        <p
          className="text-sm mb-4 line-clamp-2 leading-relaxed"
          style={{ color: cd.descriptionColor || (isDark ? '#9ca3af' : '#4b5563') }}
        >
          {proyecto.descripcionCorta}
        </p>

        {/* Tecnologías - estilo profesional */}
        {proyecto.tecnologias && proyecto.tecnologias.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {proyecto.tecnologias.slice(0, 5).map((tech, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-lg font-medium transition-colors"
                style={{
                  background: cd.tagBg || (isDark ? 'rgba(147,51,234,0.1)' : '#faf5ff'),
                  color: cd.tagText || (isDark ? '#d8b4fe' : '#7e22ce'),
                  border: `1px solid ${cd.tagBorder || (isDark ? 'rgba(147,51,234,0.2)' : '#f3e8ff')}`,
                }}
              >
                {tech.icono ? `${tech.icono} ` : ''}{tech.nombre}
              </span>
            ))}
            {proyecto.tecnologias.length > 5 && (
              <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                isDark ? 'text-gray-500 bg-white/5' : 'text-gray-400 bg-gray-50'
              }`}>
                +{proyecto.tecnologias.length - 5} más
              </span>
            )}
          </div>
        )}

        {/* Métricas destacadas */}
        {metricasDestacadas.length > 0 && (
          <div className={`flex gap-3 mb-4 p-3 rounded-xl ${
            isDark ? 'bg-white/5 border border-white/5' : 'bg-gray-50 border border-gray-100'
          }`}>
            {metricasDestacadas.map((m, idx) => (
              <div key={idx} className="flex-1 text-center">
                <div
                  className="text-lg font-bold"
                  style={{ color: cd.metricsValueColor || (isDark ? '#c084fc' : '#9333ea') }}
                >
                  {m.valor}
                </div>
                <div
                  className="text-[10px] font-medium uppercase tracking-wider"
                  style={{ color: cd.metricsLabelColor || (isDark ? '#6b7280' : '#9ca3af') }}
                >
                  {m.nombre}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Separador */}
        <div className={`border-t mb-4 ${
          isDark ? 'border-white/5' : 'border-gray-100'
        }`} />

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/proyectos/${proyecto.slug}`}
            className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group-hover:shadow-md"
            style={{
              background: cd.buttonBg || (isDark ? 'linear-gradient(to right, rgba(147,51,234,0.2), rgba(79,70,229,0.2))' : 'linear-gradient(to right, #faf5ff, #eef2ff)'),
              color: cd.buttonText || (isDark ? '#d8b4fe' : '#7e22ce'),
              border: `1px solid ${cd.buttonBorder || (isDark ? 'rgba(147,51,234,0.2)' : 'rgba(196,181,253,0.5)')}`,
            }}
          >
            Ver Proyecto →
          </Link>

          {tieneAcceso && proyecto.tieneUrl && (
            <button
              onClick={(e) => { e.preventDefault(); onAcceder(proyecto._id); }}
              className="flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-bold transition-all duration-300 shadow-lg"
              style={{
                background: `linear-gradient(to right, ${cd.accentFrom || '#9333ea'}, ${cd.accentTo || '#4f46e5'})`,
              }}
            >
              🚀 Acceder
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function Proyectos() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';

  // State
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [misProyectoIds, setMisProyectoIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState<string>('all');
  const [categoriasDisponibles, setCategoriasDisponibles] = useState<{ value: string; label: string; count: number }[]>([]);
  // 🆕 CMS data
  const [cmsData, setCmsData] = useState<any>(null);

  // ========================================
  // CARGA DE DATOS
  // ========================================

  useEffect(() => {
    cargarDatos();
  }, [categoriaActiva]);

  useEffect(() => {
    if (user) {
      cargarMisProyectos();
    }
  }, [user]);

  // 🆕 Cargar datos del CMS (sin caché la primera vez para evitar datos obsoletos)
  const loadCmsData = () => {
    getPageBySlug('proyectos', false)
      .then((data) => {
        console.log('📄 [Proyectos] CMS data cargada:', data);
        setCmsData(data);
      })
      .catch((err) => {
        console.warn('⚠️ [Proyectos] CMS no disponible, usando fallbacks:', err?.message);
        setCmsData(null);
      });
  };

  useEffect(() => {
    loadCmsData();
  }, []);

  // 🔄 Escuchar evento cmsUpdate para refrescar datos cuando el admin guarda cambios
  useEffect(() => {
    const handleCmsUpdate = (e: CustomEvent) => {
      const slug = e.detail?.slug;
      if (!slug || slug === 'proyectos') {
        console.log('🔄 [Proyectos] CMS actualizado, recargando datos...');
        loadCmsData();
      }
    };
    window.addEventListener('cmsUpdate', handleCmsUpdate as EventListener);
    return () => window.removeEventListener('cmsUpdate', handleCmsUpdate as EventListener);
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 50 };
      if (categoriaActiva !== 'all') params.categoria = categoriaActiva;

      const [portfolioRes, categoriasRes] = await Promise.all([
        proyectosApi.getPortfolio(params),
        proyectosApi.getCategorias()
      ]);

      setProyectos(portfolioRes.data);
      setCategoriasDisponibles(categoriasRes);
    } catch (error) {
      console.error('Error cargando proyectos:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarMisProyectos = async () => {
    try {
      const res = await proyectosApi.getMisProyectos();
      setMisProyectoIds(res.data.map((p: Proyecto) => p._id));
    } catch {
      // No logueado o sin proyectos asignados
    }
  };

  const handleAcceder = async (id: string) => {
    try {
      const data = await proyectosApi.accederProyecto(id);
      window.open(data.url, '_blank', 'noopener,noreferrer');
    } catch (error: any) {
      alert(error.message || 'Error al acceder al sistema');
    }
  };

  // ========================================
  // RENDER
  // ========================================

  const totalProyectos = proyectos.length;

  // 🆕 Textos desde CMS con fallbacks
  // Hero: title, subtitle, description vienen como HTML (rich text editor)
  const cmsHero = cmsData?.content?.hero;
  const cmsSolutions = cmsData?.content?.solutions;

  // Rich text HTML para renderizar con dangerouslySetInnerHTML
  const heroTitleHtml = cmsHero?.title || '<p>Proyectos que <span style="background: linear-gradient(to right, #9333ea, #4f46e5); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">transforman negocios</span></p>';
  const heroBadgeHtml = cmsHero?.subtitle || 'Nuestro Portafolio';
  const heroDescriptionHtml = cmsHero?.description || '<p>Soluciones tecnológicas a medida que impulsan el crecimiento de nuestros clientes</p>';

  // Texto plano para badge (strip HTML ya que es un span pequeño)
  const heroBadgeText = stripHtml(heroBadgeHtml);

  // Imagen de fondo desde CMS (soporta objeto {light, dark} o string)
  const heroBgRaw = cmsHero?.backgroundImage;
  const heroBgImage = heroBgRaw
    ? (typeof heroBgRaw === 'string'
        ? heroBgRaw
        : (isDark ? (heroBgRaw.dark || heroBgRaw.light || '') : (heroBgRaw.light || heroBgRaw.dark || '')))
    : '';
  const heroBgOpacity = typeof cmsHero?.backgroundOpacity === 'number' ? cmsHero.backgroundOpacity : 0.8;

  // CTA: estos campos son inputs de texto plano (no rich text)
  const ctaTitle = cmsSolutions?.title || '¿Tienes un proyecto en mente?';
  const ctaDescription = cmsSolutions?.description || 'Conversemos sobre cómo podemos ayudarte a hacerlo realidad';
  const ctaButtonText = cmsHero?.ctaText || 'Contáctanos';
  const ctaButtonLink = cmsHero?.ctaLink || '/contacto';

  // Portfolio grid section desde CMS
  const cmsPortfolio = cmsData?.content?.portfolio;
  const portfolioSectionTitle = cmsPortfolio?.sectionTitle || '';
  const portfolioBgRaw = cmsPortfolio?.backgroundImage;
  const portfolioBgImage = portfolioBgRaw
    ? (typeof portfolioBgRaw === 'string'
        ? portfolioBgRaw
        : (isDark ? (portfolioBgRaw.dark || portfolioBgRaw.light || '') : (portfolioBgRaw.light || portfolioBgRaw.dark || '')))
    : '';
  const portfolioBgOpacity = typeof cmsPortfolio?.backgroundOpacity === 'number' ? cmsPortfolio.backgroundOpacity : 0;

  // 🎴 Diseño de tarjetas desde CMS (resuelve light/dark)
  const portfolioCardDesignRaw = cmsData?.content?.portfolioCardDesign;
  const activeCardDesign: PortfolioCardDesignTheme = isDark
    ? (portfolioCardDesignRaw?.dark || {})
    : (portfolioCardDesignRaw?.light || {});

  // 💬 CTA Section desde CMS
  const cmsCtaSection = cmsData?.content?.ctaSection;
  const ctaBgRaw = cmsCtaSection?.backgroundImage;
  const ctaBgImage = ctaBgRaw
    ? (typeof ctaBgRaw === 'string'
        ? ctaBgRaw
        : (isDark ? (ctaBgRaw.dark || ctaBgRaw.light || '') : (ctaBgRaw.light || ctaBgRaw.dark || '')))
    : '';
  const ctaBgOpacity = typeof cmsCtaSection?.backgroundOpacity === 'number' ? cmsCtaSection.backgroundOpacity : 0.85;
  const ctaBgColor = isDark
    ? (cmsCtaSection?.bgColor?.dark || 'rgba(255,255,255,0.05)')
    : (cmsCtaSection?.bgColor?.light || '#faf5ff');
  const ctaTitleColor = isDark
    ? (cmsCtaSection?.titleColor?.dark || '#ffffff')
    : (cmsCtaSection?.titleColor?.light || '#111827');
  const ctaDescColor = isDark
    ? (cmsCtaSection?.descriptionColor?.dark || '#9ca3af')
    : (cmsCtaSection?.descriptionColor?.light || '#4b5563');
  const ctaBtnFrom = cmsCtaSection?.buttonGradientFrom || '#9333ea';
  const ctaBtnTo = cmsCtaSection?.buttonGradientTo || '#4f46e5';
  const ctaBtnText = cmsCtaSection?.buttonText || '#ffffff';

  // 🔘 Filter design desde CMS
  const fd = cmsData?.content?.filterDesign;
  const filterActiveBgFrom = fd?.activeBgFrom || '#9333ea';
  const filterActiveBgTo = fd?.activeBgTo || '#4f46e5';
  const filterActiveText = fd?.activeText || '#ffffff';
  const filterActiveShadow = fd?.activeShadow || '0 10px 15px rgba(147,51,234,0.25)';
  const filterInactiveBg = isDark ? (fd?.inactiveBg?.dark || 'rgba(255,255,255,0.05)') : (fd?.inactiveBg?.light || '#ffffff');
  const filterInactiveText = isDark ? (fd?.inactiveText?.dark || '#9ca3af') : (fd?.inactiveText?.light || '#4b5563');
  const filterInactiveBorder = isDark ? (fd?.inactiveBorder?.dark || 'rgba(255,255,255,0.1)') : (fd?.inactiveBorder?.light || '#e5e7eb');
  const filterRadius = fd?.borderRadius || '12';

  // SEO: strip HTML para meta tags
  const cmsMetaTitle = cmsData?.seo?.metaTitle || stripHtml(heroTitleHtml) || 'Portafolio de Proyectos | Scuti Company';
  const cmsMetaDescription = cmsData?.seo?.metaDescription || stripHtml(heroDescriptionHtml) || 'Conoce los proyectos y sistemas que hemos desarrollado. Soluciones tecnológicas a medida para empresas.';

  const proyectosUrl   = 'https://scuticompany.com/proyectos';
  const proyectosImage = 'https://scuticompany.com/logofondonegro.jpeg';

  return (
    <>
      <Helmet>
        <title>{cmsMetaTitle}</title>
        <meta name="description" content={cmsMetaDescription} />
        <link rel="canonical" href={proyectosUrl} />
        {/* Open Graph */}
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={proyectosUrl} />
        <meta property="og:title"       content={cmsMetaTitle} />
        <meta property="og:description" content={cmsMetaDescription} />
        <meta property="og:image"       content={proyectosImage} />
        <meta property="og:locale"      content="es_PE" />
        <meta property="og:site_name"   content="SCUTI Company" />
        {/* Twitter */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:site"        content="@scuticompany" />
        <meta name="twitter:title"       content={cmsMetaTitle} />
        <meta name="twitter:description" content={cmsMetaDescription} />
        <meta name="twitter:image"       content={proyectosImage} />
      </Helmet>

      <PublicHeader />

      <main className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
        {/* Hero Section */}
        <section className={`relative overflow-hidden pt-24 pb-16 ${
          !heroBgImage
            ? isDark
              ? 'bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950'
              : 'bg-gradient-to-br from-purple-50 via-white to-indigo-50'
            : ''
        }`}>
          {/* Imagen de fondo del CMS */}
          {heroBgImage && (
            <>
              <img
                src={heroBgImage}
                alt="Hero background"
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
              {/* Overlay para legibilidad */}
              <div
                className="absolute inset-0 z-0"
                style={{ backgroundColor: isDark ? `rgba(3,7,18,${heroBgOpacity})` : `rgba(255,255,255,${heroBgOpacity})` }}
              />
            </>
          )}

          {/* Background decorations (solo si no hay imagen) */}
          {!heroBgImage && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl ${
                isDark ? 'bg-purple-600/10' : 'bg-purple-200/40'
              }`} />
              <div className={`absolute -bottom-20 -left-20 w-60 h-60 rounded-full blur-3xl ${
                isDark ? 'bg-indigo-600/10' : 'bg-indigo-200/30'
              }`} />
            </div>
          )}

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 ${
              isDark ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-purple-100 text-purple-700'
            }`}>
              🚀 {heroBadgeText}
            </span>

            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              } [&_strong]:bg-gradient-to-r [&_strong]:from-purple-600 [&_strong]:to-indigo-600 [&_strong]:bg-clip-text [&_strong]:text-transparent [&_p]:m-0`}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(heroTitleHtml) }}
            />

            <div
              className={`text-lg md:text-xl max-w-2xl mx-auto mb-8 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              } [&_p]:m-0`}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(heroDescriptionHtml) }}
            />

            {/* Stats */}
            <div className="flex justify-center gap-8 md:gap-12">
              <div className="text-center">
                <div className={`text-3xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                  {totalProyectos}+
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  Proyectos
                </div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  {categoriasDisponibles.length}
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  Categorías
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filtros y Grid */}
        <section className="relative">
          {/* Imagen de fondo del portafolio (opcional) */}
          {portfolioBgImage && (
            <>
              <img
                src={portfolioBgImage}
                alt="Portfolio background"
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
              {portfolioBgOpacity > 0 && (
                <div
                  className="absolute inset-0 z-0"
                  style={{ backgroundColor: isDark ? `rgba(3,7,18,${portfolioBgOpacity})` : `rgba(255,255,255,${portfolioBgOpacity})` }}
                />
              )}
            </>
          )}

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Título de sección (opcional, desde CMS) */}
            {portfolioSectionTitle && (
              <h2 className={`text-2xl md:text-3xl font-bold text-center mb-8 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {portfolioSectionTitle}
              </h2>
            )}

            {/* Filtros de categoría */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              <button
                onClick={() => setCategoriaActiva('all')}
                className="px-4 py-2 text-sm font-semibold transition-all duration-300"
                style={categoriaActiva === 'all'
                  ? { background: `linear-gradient(to right, ${filterActiveBgFrom}, ${filterActiveBgTo})`, color: filterActiveText, boxShadow: filterActiveShadow, borderRadius: `${filterRadius}px` }
                  : { background: filterInactiveBg, color: filterInactiveText, border: `1px solid ${filterInactiveBorder}`, borderRadius: `${filterRadius}px` }
                }
              >
                Todos ({totalProyectos})
              </button>
              {categoriasDisponibles.map((cat) => {
                const info = PROYECTO_CATEGORIAS[cat.value as ProyectoCategoria];
                return (
                  <button
                    key={cat.value}
                    onClick={() => setCategoriaActiva(cat.value)}
                    className="px-4 py-2 text-sm font-semibold transition-all duration-300"
                    style={categoriaActiva === cat.value
                      ? { background: `linear-gradient(to right, ${filterActiveBgFrom}, ${filterActiveBgTo})`, color: filterActiveText, boxShadow: filterActiveShadow, borderRadius: `${filterRadius}px` }
                      : { background: filterInactiveBg, color: filterInactiveText, border: `1px solid ${filterInactiveBorder}`, borderRadius: `${filterRadius}px` }
                    }
                  >
                    {info?.icon || '📁'} {cat.label} ({cat.count})
                  </button>
                );
              })}
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto mb-4" />
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Cargando proyectos...</p>
                </div>
              </div>
            )}

            {/* Grid de proyectos */}
            {!loading && proyectos.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {proyectos.map((proyecto) => (
                  <ProyectoCard
                    key={proyecto._id}
                    proyecto={proyecto}
                    tieneAcceso={misProyectoIds.includes(proyecto._id)}
                    onAcceder={handleAcceder}
                    theme={theme}
                    cardDesign={activeCardDesign}
                  />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && proyectos.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📁</div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  No hay proyectos en esta categoría
                </h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Prueba seleccionando otra categoría o vuelve pronto
                </p>
                <button
                  onClick={() => setCategoriaActiva('all')}
                  className="mt-4 px-6 py-2.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
                >
                  Ver todos
                </button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-16 overflow-hidden" style={{ backgroundColor: ctaBgColor }}>
          {/* Imagen de fondo CTA (opcional) */}
          {ctaBgImage && (
            <>
              <img
                src={ctaBgImage}
                alt="CTA background"
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
              {ctaBgOpacity > 0 && (
                <div
                  className="absolute inset-0 z-0"
                  style={{ backgroundColor: isDark ? `rgba(3,7,18,${ctaBgOpacity})` : `rgba(255,255,255,${ctaBgOpacity})` }}
                />
              )}
            </>
          )}
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4" style={{ color: ctaTitleColor }}>
              {ctaTitle}
            </h2>
            <p className="text-lg mb-8" style={{ color: ctaDescColor }}>
              {ctaDescription}
            </p>
            <Link
              to={ctaButtonLink}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
              style={{
                background: `linear-gradient(to right, ${ctaBtnFrom}, ${ctaBtnTo})`,
                color: ctaBtnText,
              }}
            >
              💬 {ctaButtonText}
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
      <FloatingChatWidget />
    </>
  );
}
