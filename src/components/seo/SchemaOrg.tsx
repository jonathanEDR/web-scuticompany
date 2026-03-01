import { Helmet } from 'react-helmet-async';
import SITE_CONFIG, { getFullUrl } from '../../config/siteConfig';

/**
 * 🏢 Schema.org - Datos Estructurados para Google Rich Results
 * 
 * Estos schemas permiten que Google muestre tu sitio con:
 * - Logo en resultados
 * - Información de empresa
 * - Breadcrumbs mejorados
 * - FAQs expandibles
 * - Artículos con autor y fecha
 * 
 * NOTA: Todos los schemas leen de SITE_CONFIG (siteConfig.ts)
 * para evitar datos hardcodeados duplicados.
 */

// ====================================
// SCHEMA: ORGANIZACIÓN (Global)
// ====================================
export const OrganizationSchema = () => {
  const org = SITE_CONFIG.organization;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": org.name,
    "alternateName": "Scuti",
    "url": SITE_CONFIG.siteUrl,
    "logo": getFullUrl(SITE_CONFIG.images.favicon),
    "description": SITE_CONFIG.siteDescription,
    "foundingDate": org.foundingDate || "2024",
    "sameAs": [
      SITE_CONFIG.social.linkedin,
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.twitter,
      SITE_CONFIG.social.instagram
    ].filter(Boolean),
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Calles Los Molles Lt-02",
      "addressCountry": SITE_CONFIG.countryCode,
      "addressLocality": SITE_CONFIG.region,
      "addressRegion": SITE_CONFIG.region
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": SITE_CONFIG.contact.phone,
      "contactType": "customer service",
      "availableLanguage": ["Spanish", "English"]
    },
    "areaServed": {
      "@type": "Country",
      "name": SITE_CONFIG.country
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// ====================================
// SCHEMA: WEBSITE (Para búsquedas)
// ====================================
export const WebsiteSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_CONFIG.siteName,
    "url": SITE_CONFIG.siteUrl,
    "description": SITE_CONFIG.siteDescription,
    "publisher": {
      "@type": "Organization",
      "name": SITE_CONFIG.siteName
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_CONFIG.siteUrl}/blog?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// ====================================
// SCHEMA: LOCAL BUSINESS (Empresa de Software)
// ====================================
export const LocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_CONFIG.siteUrl}/#organization`,
    "name": SITE_CONFIG.siteName,
    "alternateName": ["Scuti", "SCUTI Software", "SCUTI IA"],
    "image": getFullUrl(SITE_CONFIG.images.ogDefault),
    "url": SITE_CONFIG.siteUrl,
    "telephone": SITE_CONFIG.contact.phone,
    "email": SITE_CONFIG.contact.email,
    "description": "Empresa de desarrollo de software a medida, inteligencia artificial y automatización de procesos para PYMES en Perú. Especialistas en ERP, CRM y soluciones tecnológicas personalizadas.",
    "slogan": "Impulsa tu PYME con Software a Medida e Inteligencia Artificial",
    "knowsAbout": [
      "Desarrollo de Software ",
      "Inteligencia Artificial",
      "Automatización de Procesos",
      "Sistemas ERP para PYMES",
      "CRM Personalizado",
      "Transformación Digital",
      "Machine Learning",
      "Chatbots Inteligentes"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios de Desarrollo de Software",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Desarrollo de Software a Medida",
            "description": "Sistemas ERP y CRM personalizados para PYMES"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Soluciones de Inteligencia Artificial",
            "description": "Análisis predictivo, chatbots y automatización con IA"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Consultoría de Transformación Digital",
            "description": "Estrategia tecnológica para el crecimiento empresarial"
          }
        }
      ]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": SITE_CONFIG.countryCode,
      "addressLocality": SITE_CONFIG.region,
      "addressRegion": SITE_CONFIG.region
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -9.9306,
      "longitude": -76.2422
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": SITE_CONFIG.country
      },
      {
        "@type": "AdministrativeArea",
        "name": "Latinoamérica"
      }
    ],
    "priceRange": "$$",
    "currenciesAccepted": "PEN, USD",
    "paymentAccepted": "Transferencia Bancaria, PayPal, Tarjeta de Crédito",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "19:00"
      }
    ]
    // NOTA: aggregateRating removido — no usar datos ficticios.
    // Agregar solo cuando haya reseñas reales (Google Business, Trustpilot, etc.)
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// ====================================
// SCHEMA: BREADCRUMB
// ====================================
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbSchema = ({ items }: BreadcrumbSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// ====================================
// SCHEMA: ARTÍCULO DE BLOG
// ====================================
interface BlogArticleSchemaProps {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  url: string;
  keywords?: string[];  // ✅ Agregado para SEO
  focusKeyphrase?: string;  // ✅ Palabra clave principal
}

export const BlogArticleSchema = ({
  title,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  url,
  keywords,
  focusKeyphrase
}: BlogArticleSchemaProps) => {
  // ✅ Construir keywords para Schema.org: focusKeyphrase primero, luego keywords (sin duplicados)
  const allKeywords = [...new Set([focusKeyphrase, ...(keywords || [])].filter(Boolean))];
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "image": image || getFullUrl(SITE_CONFIG.images.favicon),
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": SITE_CONFIG.siteUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_CONFIG.siteName,
      "logo": {
        "@type": "ImageObject",
        "url": getFullUrl(SITE_CONFIG.images.favicon)
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    // ✅ Keywords para Google - Muy importante para SEO
    ...(allKeywords.length > 0 && { "keywords": allKeywords.join(', ') }),
    // ✅ About: Indica de qué trata el artículo (mejora Rich Results)
    ...(focusKeyphrase && {
      "about": {
        "@type": "Thing",
        "name": focusKeyphrase
      }
    })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// ====================================
// SCHEMA: SERVICIO
// ====================================
interface ServiceSchemaProps {
  name: string;
  description: string;
  image?: string;
  priceRange?: string;
}

export const ServiceSchema = ({
  name,
  description,
  image,
  priceRange = "$$"
}: ServiceSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "url": SITE_CONFIG.siteUrl,
    "image": image || getFullUrl(SITE_CONFIG.images.favicon),
    "provider": {
      "@type": "Organization",
      "name": SITE_CONFIG.siteName,
      "url": SITE_CONFIG.siteUrl
    },
    "areaServed": {
      "@type": "Country",
      "name": SITE_CONFIG.country
    },
    "priceRange": priceRange
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// ====================================
// SCHEMA: FAQ (Preguntas frecuentes)
// ====================================
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export const FAQSchema = ({ faqs }: FAQSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// ====================================
// SCHEMA: CONTACTPAGE (Sección Contacto)
// ====================================
export const ContactPageSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": `Contáctanos - ${SITE_CONFIG.siteName}`,
    "description": "Solicita una sesión de viabilidad técnica gratuita. Diseñamos software a medida para empresas en Perú.",
    "url": `${SITE_CONFIG.siteUrl}#contacto`,
    "mainEntity": {
      "@type": "Organization",
      "name": SITE_CONFIG.siteName,
      "telephone": SITE_CONFIG.contact.phone,
      "email": SITE_CONFIG.contact.email,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Calles Los Molles Lt-02",
        "addressLocality": SITE_CONFIG.region,
        "addressRegion": SITE_CONFIG.region,
        "addressCountry": SITE_CONFIG.countryCode
      }
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// ====================================
// SCHEMA: ITEMLIST (Lista de Artículos Blog en Home)
// ====================================
interface BlogArticle {
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  author?: string;
}

interface BlogsListSchemaProps {
  articles: BlogArticle[];
}

export const BlogsListSchema = ({ articles }: BlogsListSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Artículos Destacados sobre Desarrollo de Software",
    "description": "Guías y recursos técnicos sobre desarrollo de software a medida en Perú",
    "itemListElement": articles.map((article, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "BlogPosting",
        "headline": article.title,
        "url": `${SITE_CONFIG.siteUrl}/blog/${article.slug}`,
        "description": article.excerpt || article.title,
        "datePublished": article.publishedAt || new Date().toISOString(),
        "author": {
          "@type": "Person",
          "name": article.author || SITE_CONFIG.siteName
        },
        "publisher": {
          "@type": "Organization",
          "name": SITE_CONFIG.siteName,
          "logo": {
            "@type": "ImageObject",
            "url": getFullUrl(SITE_CONFIG.images.favicon)
          }
        }
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// ====================================
// SCHEMA PARA WEBPAGE (SEO)
// ====================================
export const WebPageSchema = ({ name, description, url }: { name: string; description: string; url: string }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    name,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_CONFIG.siteUrl}#website`,
      name: SITE_CONFIG.siteName,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_CONFIG.siteUrl}/#organization`,
      name: SITE_CONFIG.siteName,
    },
    inLanguage: 'es-PE',
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

// ====================================
// SCHEMA COMBINADO PARA HOME
// ====================================
export const HomePageSchema = () => {
  return (
    <>
      <OrganizationSchema />
      <WebsiteSchema />
      <LocalBusinessSchema />
      <WebPageSchema
        name={`${SITE_CONFIG.siteName} - Desarrollo de Software a Medida en Perú`}
        description={SITE_CONFIG.siteDescription}
        url={SITE_CONFIG.siteUrl}
      />
      <ContactPageSchema />
    </>
  );
};
