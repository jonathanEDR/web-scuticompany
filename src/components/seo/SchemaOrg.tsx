import { Helmet } from 'react-helmet-async';

/**
 * 🏢 Schema.org - Datos Estructurados para Google Rich Results
 * 
 * Estos schemas permiten que Google muestre tu sitio con:
 * - Logo en resultados
 * - Información de empresa
 * - Breadcrumbs mejorados
 * - FAQs expandibles
 * - Artículos con autor y fecha
 */

// ====================================
// SCHEMA: ORGANIZACIÓN (Global)
// ====================================
export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SCUTI Company",
    "alternateName": "Scuti",
    "url": "https://scuticompany.com",
    "logo": "https://scuticompany.com/favicon-512x512.png",
    "description": "Empresa líder en desarrollo de software, inteligencia artificial y automatización para PYMES en Perú",
    "foundingDate": "2023",
    "sameAs": [
      "https://www.linkedin.com/company/scuti-company",
      "https://www.facebook.com/SCUTIcompany/",
      "https://twitter.com/scuticompany",
      "https://www.instagram.com/scuticompany"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PE",
      "addressLocality": "Lima",
      "addressRegion": "Lima"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+51-973 397 306",
      "contactType": "customer service",
      "availableLanguage": ["Spanish", "English"]
    },
    "areaServed": {
      "@type": "Country",
      "name": "Peru"
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
    "name": "SCUTI Company",
    "url": "https://scuticompany.com",
    "description": "Desarrollo de Software e IA para PYMES en Perú",
    "publisher": {
      "@type": "Organization",
      "name": "SCUTI Company"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://scuticompany.com/blog?search={search_term_string}"
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
// SCHEMA: LOCAL BUSINESS (Empresa)
// ====================================
export const LocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "SCUTI Company",
    "image": "https://scuticompany.com/favicon-512x512.png",
    "url": "https://scuticompany.com",
    "telephone": "+51-973 397 306",
    "email": "gscutic@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PE",
      "addressLocality": "Lima",
      "addressRegion": "Lima"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -12.0464,
      "longitude": -77.0428
    },
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "47"
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
  // ✅ Construir keywords para Schema.org: focusKeyphrase primero, luego keywords
  const allKeywords = [focusKeyphrase, ...(keywords || [])].filter(Boolean);
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "image": image || "https://scuticompany.com/favicon-512x512.png",
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": "https://scuticompany.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SCUTI Company",
      "logo": {
        "@type": "ImageObject",
        "url": "https://scuticompany.com/favicon-512x512.png"
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
  url: string;
  image?: string;
  priceRange?: string;
}

export const ServiceSchema = ({
  name,
  description,
  url,
  image,
  priceRange = "$$"
}: ServiceSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "url": url,
    "image": image || "https://scuticompany.com/favicon-512x512.png",
    "provider": {
      "@type": "Organization",
      "name": "SCUTI Company",
      "url": "https://scuticompany.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Peru"
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
// SCHEMA COMBINADO PARA HOME
// ====================================
export const HomePageSchema = () => {
  return (
    <>
      <OrganizationSchema />
      <WebsiteSchema />
      <LocalBusinessSchema />
    </>
  );
};
