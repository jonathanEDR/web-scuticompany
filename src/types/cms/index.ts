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
  background: string;
  borderColor: string;
  borderWidth: string;
  borderRadius: string;
  shadow: string;
  backdropBlur: boolean;
  disperseEffect: boolean;
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
  logoBackground: string;
  logoPadding: string;
  logosBorderRadius: string;
  logosGap: string;
  logosPerRow: number;
  logosAlignment: 'left' | 'center' | 'right';
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

export interface PageSection {
  type: 'text' | 'image' | 'grid' | 'cta';
  title?: string;
  content?: any;
  order?: number;
}

export interface PageContent {
  hero: HeroContent;
  solutions: SolutionsContent;
  valueAdded?: ValueAddedContent;
  clientLogos?: ClientLogosContent;
  contact?: ContactContent;
  sections?: PageSection[];
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