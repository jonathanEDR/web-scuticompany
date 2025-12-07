// Interfaces para el sistema CMS basadas en el modelo real de MongoDB

export interface BackgroundImage {
  light?: string;
  dark?: string;
}

export interface TextStyles {
  light?: {
    titleColor?: string;
    subtitleColor?: string;
    descriptionColor?: string;
  };
  dark?: {
    titleColor?: string;
    subtitleColor?: string;
    descriptionColor?: string;
  };
}

export interface SolutionTextStyles {
  light?: {
    titleColor?: string;
    descriptionColor?: string;
  };
  dark?: {
    titleColor?: string;
    descriptionColor?: string;
  };
}

export interface CardDesignStyles {
  background: string;
  border: string;
  borderWidth: string;
  shadow: string;
  hoverBackground: string;
  hoverBorder: string;
  hoverShadow: string;
  iconGradient: string;
  iconBackground: string;
  iconColor: string;
  titleColor: string;
  descriptionColor: string;
  linkColor: string;
  // Tamaño de tarjetas
  cardMinWidth?: string;
  cardMaxWidth?: string;
  cardMinHeight?: string;
  cardPadding?: string;
  // Alineación de tarjetas
  cardsAlignment?: 'left' | 'center' | 'right';
  // Configuración de iconos
  iconBorderEnabled?: boolean;
  iconAlignment?: 'left' | 'center' | 'right';
}

export interface CardsDesign {
  light: CardDesignStyles;
  dark: CardDesignStyles;
}

export interface ButtonStyle {
  text: string;
  background: string;
  textColor: string;
  borderColor: string;
}

export interface ThemeButtons {
  ctaPrimary: ButtonStyle;
  contact: ButtonStyle;
  dashboard: ButtonStyle;
  viewMore?: ButtonStyle;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  textSecondary: string;
  cardBg: string;
  border: string;
  buttons: ThemeButtons;
}

export interface SolutionItem {
  _id?: string;        // ObjectId opcional de MongoDB
  iconLight?: string;  // URL del icono para tema claro (PNG)
  iconDark?: string;   // URL del icono para tema oscuro (PNG)
  // Mantener para compatibilidad con datos antiguos
  icon?: string;
  iconUrl?: string;
  title: string;
  description: string;
  gradient: string;
  styles?: SolutionTextStyles; // Estilos de texto por tema
}

export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: BackgroundImage;
  backgroundImageAlt?: string;
  styles?: TextStyles;
}

export interface SolutionsContent {
  title: string;
  description: string;
  backgroundImage?: BackgroundImage;
  backgroundImageAlt?: string;
  styles?: SolutionTextStyles;
  items: SolutionItem[];
  cardsDesign?: CardsDesign;
}

export interface ValueAddedItem {
  _id?: string;
  title: string;
  description: string;
  icon?: string;
  iconLight?: string;
  iconDark?: string;
  gradient?: string;
  styles?: SolutionTextStyles; // Estilos de texto por tema (reutilizamos la interface)
}

export interface ValueAddedLogo {
  _id?: string;
  name: string;
  imageUrl: string;
  alt: string;
  link?: string;
  order?: number;
}

export interface ClientLogo {
  _id?: string;
  name: string;
  imageUrl: string;
  alt: string;
  link?: string;
  order?: number;
  background?: string; // Individual logo background (color or gradient)
}

export interface LogosBarDesignStyles {
  // Configuraciones de animación y comportamiento
  animationsEnabled?: boolean;
  rotationMode?: 'none' | 'individual';
  animationSpeed?: 'slow' | 'normal' | 'fast';
  hoverEffects?: boolean;
  hoverIntensity?: 'subtle' | 'normal' | 'intense' | 'light' | 'strong'; // Incluye valores legacy
  glowEffects?: boolean;
  autoDetectTech?: boolean;
  // Configuración de tamaño y espaciado de logos
  logoSize?: 'small' | 'medium' | 'large';
  logoSpacing?: 'compact' | 'normal' | 'wide';
  logoFormat?: 'square' | 'rectangle' | 'original';
  maxLogoWidth?: 'small' | 'medium' | 'large';
  uniformSize?: boolean;
}

export interface LogosBarDesign {
  light: LogosBarDesignStyles;
  dark: LogosBarDesignStyles;
}

export interface ClientLogosSectionDesignStyles {
  background: string;
  borderColor: string;
  borderWidth: string;
  borderRadius: string;
  shadow: string;
  padding: string;
  margin: string;
}

export interface ClientLogosSectionDesign {
  light: ClientLogosSectionDesignStyles;
  dark: ClientLogosSectionDesignStyles;
}

export interface ClientLogosDesignStyles {
  logoMaxWidth: string;
  logoMaxHeight: string;
  logoOpacity: string;
  logoHoverOpacity: string;
  logoFilter: string;
  logoHoverFilter: string;
  logoBackground?: string; // OBSOLETO - Ya no se usa (sin tarjetas)
  logoPadding?: string; // OBSOLETO - Ya no se usa (sin tarjetas)
  logosBorderRadius?: string; // OBSOLETO - Ya no se usa (sin tarjetas)
  logosGap: string;
  logosPerRow?: number; // OBSOLETO - Reemplazado por logosToShow* en carrusel
  logosAlignment: 'left' | 'center' | 'right';
  // Propiedades para animaciones
  floatAnimation?: boolean; // Habilitar animación flotante
  floatIntensity?: 'subtle' | 'normal' | 'strong'; // Intensidad del float
  mouseTracking?: boolean; // Seguimiento del mouse
  mouseIntensity?: 'subtle' | 'normal' | 'strong'; // Intensidad de reacción al mouse
  hoverScale?: number; // Escala en hover (ej: 1.15)
  hoverRotation?: boolean; // Rotación en hover
  // Configuración del carrusel
  carouselEnabled?: boolean; // Habilitar carrusel automático
  carouselSpeed?: number; // Velocidad en milisegundos (ej: 3000)
  logosToShowDesktop?: number; // Logos visibles en desktop (por defecto 6)
  logosToShowTablet?: number; // Logos visibles en tablet (por defecto 4)
  logosToShowMobile?: number; // Logos visibles en móvil (por defecto 3)
}

export interface ClientLogosDesign {
  light: ClientLogosDesignStyles;
  dark: ClientLogosDesignStyles;
}

export interface ClientLogosContent {
  title: string;
  description?: string;
  visible?: boolean;
  showText?: boolean; // Controla si se muestran título y descripción
  backgroundImage?: string; // Imagen única, no por tema
  backgroundImageAlt?: string;
  // Configuración directa de la sección
  sectionHeight?: string; // Altura de la sección
  sectionPaddingY?: string; // Espaciado vertical
  logosHeight?: string; // Altura específica de los logos
  styles?: SolutionTextStyles;
  logos?: ClientLogo[];
  sectionDesign?: ClientLogosSectionDesign;
  logosDesign?: ClientLogosDesign;
}

export interface LogosBarDesign {
  light: LogosBarDesignStyles;
  dark: LogosBarDesignStyles;
}

export interface ValueAddedContent {
  title: string;
  description?: string;
  backgroundImage?: BackgroundImage;
  backgroundImageAlt?: string;
  styles?: SolutionTextStyles;
  items?: ValueAddedItem[];
  logos?: ValueAddedLogo[];
  logosBarDesign?: LogosBarDesign;
  cardsDesign?: CardsDesign;
  showIcons?: boolean; // Controla si se muestran los iconos en las tarjetas
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  enabled: boolean;
}

export interface ContactContent {
  phone: string;
  email: string;
  address?: string;
  city?: string;
  country?: string;
  businessHours?: string;
  description?: string;
  socialLinks: SocialLink[];
}

export interface ContactFormContent {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage?: {
    light?: string;
    dark?: string;
  };
  backgroundImageAlt?: string;
  cardsDesign?: CardsDesign;
  styles?: {
    light?: {
      titleColor?: string;
      subtitleColor?: string;
      descriptionColor?: string;
      formBackground?: string;
      formBorder?: string;
      formShadow?: string;
      inputBackground?: string;
      inputBorder?: string;
      inputText?: string;
      inputPlaceholder?: string;
      inputFocusBorder?: string;
      labelColor?: string;
      buttonBackground?: string;
      buttonText?: string;
      buttonHoverBackground?: string;
      errorColor?: string;
      successColor?: string;
    };
    dark?: {
      titleColor?: string;
      subtitleColor?: string;
      descriptionColor?: string;
      formBackground?: string;
      formBorder?: string;
      formShadow?: string;
      inputBackground?: string;
      inputBorder?: string;
      inputText?: string;
      inputPlaceholder?: string;
      inputFocusBorder?: string;
      labelColor?: string;
      buttonBackground?: string;
      buttonText?: string;
      buttonHoverBackground?: string;
      errorColor?: string;
      successColor?: string;
    };
  };
  fields?: {
    nombreLabel?: string;
    nombrePlaceholder?: string;
    nombreRequired?: boolean;
    celularLabel?: string;
    celularPlaceholder?: string;
    celularRequired?: boolean;
    correoLabel?: string;
    correoPlaceholder?: string;
    correoRequired?: boolean;
    mensajeLabel?: string;
    mensajePlaceholder?: string;
    mensajeRequired?: boolean;
    mensajeRows?: number;
    termsText?: string;
    termsLink?: string;
    termsRequired?: boolean;
  };
  button?: {
    text?: string;
    loadingText?: string;
  };
  messages?: {
    success?: string;
    error?: string;
  };
  map?: {
    enabled: boolean;
    googleMapsUrl: string;
    latitude: number;
    longitude: number;
    zoom: number;
    height: string;
    width?: string;  // 🆕 NUEVO - Ancho personalizado
    aspectRatio?: 'square' | 'landscape' | 'portrait' | 'custom'; // 🆕 NUEVO - Proporción
    alignment?: 'left' | 'center' | 'right' | 'full'; // 🆕 NUEVO - Alineación
    containerSize?: 'small' | 'medium' | 'large' | 'xl'; // 🆕 NUEVO - Tamaño predefinido
    companyName: string;
    address: string;
    markerColor: string;
    pulseColor: string;
    customLogo?: string; // 🆕 NUEVO - URL del logo personalizado
    logoSize?: 'small' | 'medium' | 'large'; // 🆕 NUEVO - Tamaño del logo
    showCompanyName?: boolean; // 🆕 NUEVO - Mostrar nombre de empresa
    borderRadius?: string; // 🆕 NUEVO - Radio de borde personalizado
    shadow?: 'none' | 'small' | 'medium' | 'large'; // 🆕 NUEVO - Sombra
    markerBackground?: string; // 🆕 NUEVO - Color de fondo del marcador
    markerBorderColor?: string; // 🆕 NUEVO - Color del borde del marcador
    markerBorderWidth?: string; // 🆕 NUEVO - Grosor del borde del marcador
    markerStyle?: 'solid' | 'gradient' | 'custom'; // 🆕 NUEVO - Estilo del fondo
    pulseIntensity?: 'none' | 'low' | 'medium' | 'high' | 'extreme'; // 🆕 NUEVO - Intensidad del pulso
    pulseSpeed?: 'slow' | 'normal' | 'fast' | 'ultra'; // 🆕 NUEVO - Velocidad del pulso
    hoverEffect?: 'none' | 'glow' | 'thunder' | 'rainbow' | 'shake'; // 🆕 NUEVO - Efecto al hacer hover
    animationEnabled?: boolean; // 🆕 NUEVO - Habilitar/deshabilitar animaciones
  };
}

// ========================================
// 🆕 CHATBOT CONFIGURATION INTERFACES
// ========================================

export interface ChatbotLogo {
  light?: string;
  dark?: string;
}

export interface WelcomeMessage {
  title: string;
  description: string;
}

export interface SuggestedQuestion {
  _id?: string;
  icon: string;
  text: string;
  message: string;
}

export interface HeaderStyles {
  background: string;
  titleColor: string;
  subtitleColor: string;
  logoBackground: string;
}

export interface ChatbotHeaderStyles {
  light: HeaderStyles;
  dark: HeaderStyles;
}

export interface ButtonPosition {
  bottom: string;
  right: string;
}

export interface ButtonGradient {
  from: string;
  to: string;
}

export interface ButtonStyles {
  size: 'small' | 'medium' | 'large';
  position: ButtonPosition;
  gradient: ButtonGradient;
  shape: 'circle' | 'rounded' | 'square';
  icon: ChatbotLogo; // Icono personalizado por tema
}

export interface ChatbotBehavior {
  autoOpen: boolean;
  autoOpenDelay: number;
  showUnreadBadge: boolean;
  showPoweredBy: boolean;
}

export interface ChatbotConfig {
  botName: string;
  statusText: string;
  logo: ChatbotLogo;
  logoAlt: string;
  welcomeMessage: WelcomeMessage;
  suggestedQuestions: SuggestedQuestion[];
  headerStyles: ChatbotHeaderStyles;
  buttonStyles: ButtonStyles;
  behavior: ChatbotBehavior;
  enabled?: boolean;
}

// ========================================
// END CHATBOT CONFIGURATION INTERFACES
// ========================================

export interface PageSection {
  type: 'text' | 'image' | 'grid' | 'cta';
  title?: string;
  content?: any;
  order?: number;
}

// ============================================
// 🆕 TIPOS PARA PÁGINA DE SERVICIOS
// ============================================

export interface ServicesFilterConfig {
  searchTitle?: string;
  searchDescription?: string;
  searchPlaceholder?: string;
  categoriesTitle?: string;
  showAllCategoriesText?: string;
  sortTitle?: string;
  resultsText?: string;
  styles?: {
    panelWidth?: string;
    shadow?: string;
    borderWidth?: string;
    sectionGap?: string;
    titleFontFamily?: string;
    contentFontFamily?: string;
    titleFontWeight?: string;
    contentFontWeight?: string;
    sectionTitleColor?: string;
    sectionTitleColorDark?: string;
    [key: string]: any;
  };
}

export interface ServicesGridConfig {
  featuredSection?: {
    title?: string;
    icon?: string;
    backgroundImage?: BackgroundImage;
    backgroundOpacity?: number;
  };
  allServicesSection?: {
    title?: string;
    icon?: string;
  };
  cardDesign?: {
    borderRadius?: string;
    imageHeight?: string;
    imageObjectFit?: 'cover' | 'contain' | 'fill';
    titleColor?: string;
    titleColorDark?: string;
    titleHoverColor?: string;
    priceColor?: string;
    titleFontFamily?: string;
    titleFontWeight?: string;
    descriptionFontFamily?: string;
    descriptionFontWeight?: string;
    transparentCards?: boolean;
    featuredBadge?: {
      text?: string;
      gradient?: string;
      icon?: string;
      iconColor?: string;
      color1?: string;
      color2?: string;
    };
    buttonText?: string;
    buttonIcon?: string;
    buttonIconPosition?: 'left' | 'right' | 'none';
    buttonGradient?: string;
    buttonBorderRadius?: string;
    contentConfig?: {
      showImage?: boolean;
      imageHeight?: string;
      showFeaturedBadge?: boolean;
      showCategory?: boolean;
      titleMaxLines?: number;
      showDescription?: boolean;
      descriptionMaxLines?: number;
      showFeatures?: boolean;
      maxFeatures?: number;
      showPrice?: boolean;
      showTags?: boolean;
      maxTags?: number;
      showButton?: boolean;
      minCardHeight?: string;
    };
  };
}

export interface ServicesAccordionConfig {
  enabled?: boolean;
  sectionTitle?: string;
  sectionSubtitle?: string;
  titleColor?: string;
  titleColorDark?: string;
  subtitleColor?: string;
  subtitleColorDark?: string;
  numberColor?: string;
  numberColorDark?: string;
  serviceTitleColor?: string;
  serviceTitleColorDark?: string;
  descriptionColor?: string;
  descriptionColorDark?: string;
  titleFontFamily?: string;
  contentFontFamily?: string;
  titleFontWeight?: string;
  borderColor?: string;
  borderColorDark?: string;
  iconColor?: string;
  iconColorDark?: string;
  buttonText?: string;
  buttonGradient?: string;
  buttonTextColor?: string;
  buttonBorderRadius?: string;
  featureIconColor?: string;
  featureIconColorDark?: string;
  maxFeatures?: number;
  backgroundImage?: BackgroundImage;
  backgroundOpacity?: number;
}

// 🆕 CONFIGURACIÓN DEL BLOG HERO
export interface BlogHeroStyleConfig {
  titleColor?: string;
  titleHighlightColor?: string;
  titleHighlightUseGradient?: boolean;
  titleHighlightGradientFrom?: string;
  titleHighlightGradientTo?: string;
  titleHighlightGradientDirection?: string;
  subtitleColor?: string;
  statsValueColor?: string;
  statsLabelColor?: string;
}

// 🆕 Configuración para sección de Noticias Destacadas
export interface FeaturedPostsConfig {
  sectionTitle?: string;
  showIcon?: boolean;
  fontFamily?: string;  // Tipografía (Montserrat por defecto)
  // Estilos para tarjeta Hero (grande)
  heroCard?: {
    overlayOpacity?: number;      // 0-1
    overlayColor?: string;        // Color del overlay
    contentBgColor?: string;      // Color de fondo del contenido (barra negra)
    borderTopColor?: string;      // Color del borde superior de la franja
    titleColor?: string;
    excerptColor?: string;
    dateColor?: string;
    categoryBgColor?: string;
    categoryTextColor?: string;
    tagBgColor?: string;
    tagTextColor?: string;
    tagBorderColor?: string;
    buttonBgColor?: string;
    buttonTextColor?: string;
    buttonBorderColor?: string;
  };
  // Estilos para tarjetas pequeñas
  smallCard?: {
    bgColor?: string;
    borderColor?: string;
    hoverBorderColor?: string;
    titleColor?: string;
    excerptColor?: string;
    dateColor?: string;
    categoryBgColor?: string;
    categoryTextColor?: string;
  };
  // Layout
  layout?: 'hero-right' | 'hero-left' | 'grid';
  maxFeaturedPosts?: number;
}

// Estilos del input de búsqueda
export interface SearchInputStyles {
  backgroundColor?: string;
  textColor?: string;
  placeholderColor?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  iconColor?: string;
  // Gradiente para el borde
  useGradientBorder?: boolean;
  gradientBorderFrom?: string;
  gradientBorderTo?: string;
  gradientBorderDirection?: string;
}

// Estilos del botón de búsqueda
export interface SearchButtonStyles {
  backgroundColor?: string;
  textColor?: string;
  hoverBackgroundColor?: string;
  borderRadius?: string;
}

// Configuración completa de búsqueda
export interface BlogSearchConfig {
  placeholder?: string;
  buttonText?: string;
  inputStyles?: {
    light?: SearchInputStyles;
    dark?: SearchInputStyles;
  };
  buttonStyles?: {
    light?: SearchButtonStyles;
    dark?: SearchButtonStyles;
  };
}

// Estilos de título y resaltado
export interface TitleStyleConfig {
  italic?: boolean;
  hasBackground?: boolean;
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
}

export interface BlogHeroConfig {
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  fontFamily?: string;
  // Estilos de resaltado del título
  titleStyle?: TitleStyleConfig;
  highlightStyle?: TitleStyleConfig;
  // Imagen de fondo (tiene prioridad sobre el gradiente)
  backgroundImage?: string;
  backgroundOverlay?: number; // Oscurecer imagen (0-1)
  // Gradiente de fondo (se usa si no hay imagen)
  gradientFrom?: string;
  gradientTo?: string;
  showStats?: boolean;
  stats?: {
    articlesLabel?: string;
    readersCount?: string;
    readersLabel?: string;
  };
  search?: BlogSearchConfig;
  styles?: {
    light?: BlogHeroStyleConfig;
    dark?: BlogHeroStyleConfig;
  };
}

// 🆕 Configuración para sección Todas las Noticias
export interface AllNewsConfig {
  sectionTitle?: string;
  showIcon?: boolean;
  postsPerPage?: number;
  fontFamily?: string;
  layoutType?: 'masonry' | 'grid' | 'list';
  // Colores de fondo por tema
  sectionBgColorLight?: string;
  sectionBgColorDark?: string;
  // Colores de título por tema
  sectionTitleColorLight?: string;
  sectionTitleColorDark?: string;
  sectionIconColorLight?: string;
  sectionIconColorDark?: string;
  sectionIconBgLight?: string;
  sectionIconBgDark?: string;
  // Imagen de fondo
  sectionBgImageLight?: string;
  sectionBgImageDark?: string;
  sectionBgOverlayLight?: number;
  sectionBgOverlayDark?: number;
  // Tarjeta con imagen
  imageCard?: {
    overlayColor?: string;
    overlayOpacity?: number;
    titleColor?: string;
    categoryBgColor?: string;
    categoryTextColor?: string;
    authorNameColor?: string;
    authorDateColor?: string;
    borderRadius?: string;
  };
  // Tarjeta solo texto
  textCard?: {
    bgColor?: string;
    titleColor?: string;
    excerptColor?: string;
    tagBgColor?: string;
    tagTextColor?: string;
    buttonText?: string;
    buttonBgColor?: string;
    buttonTextColor?: string;
    buttonBorderColor?: string;
    borderRadius?: string;
  };
  // Sidebar
  sidebar?: {
    fontFamily?: string;
    bgColor?: string;
    bgColorLight?: string;
    bgColorDark?: string;
    borderWidth?: number;
    borderColorLight?: string;
    borderColorDark?: string;
    borderRadius?: string;
    padding?: string;
    categoriesTitleColor?: string;
    categoriesTitleColorDark?: string;
    categoryItemColor?: string;
    categoryItemColorDark?: string;
    categoryHoverColor?: string;
    tagsTitleColor?: string;
    tagsTitleColorDark?: string;
    tagBgColor?: string;
    tagBgColorDark?: string;
    tagTextColor?: string;
    tagTextColorDark?: string;
    tagActiveBgColor?: string;
    tagActiveTextColor?: string;
  };
}

export interface PageContent {
  hero: HeroContent;
  solutions?: SolutionsContent;
  valueAdded?: ValueAddedContent;
  clientLogos?: ClientLogosContent;
  contact?: ContactContent;
  contactForm?: ContactFormContent;
  chatbotConfig?: ChatbotConfig;
  // 🆕 CONTENIDO PARA PÁGINA DE SERVICIOS
  servicesFilter?: ServicesFilterConfig;
  servicesGrid?: ServicesGridConfig;
  servicesAccordion?: ServicesAccordionConfig;
  sections?: PageSection[];
  // 🆕 CONTENIDO PARA PÁGINA DE BLOG
  blogHero?: BlogHeroConfig;
  featuredPosts?: FeaturedPostsConfig;
  allNews?: AllNewsConfig;
}

export interface PageSeo {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
}

export interface PageTheme {
  default: 'light' | 'dark';
  lightMode: ThemeColors;
  darkMode: ThemeColors;
}

export interface PageData {
  _id?: string;
  pageSlug: string;
  pageName: string;
  content: PageContent;
  seo: PageSeo;
  theme: PageTheme;
  isPublished: boolean;
  lastUpdated: string;
  updatedBy: string;
}

export interface MessageState {
  type: 'success' | 'error' | 'info';
  text: string;
}