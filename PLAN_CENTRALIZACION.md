# 🔧 PLAN DE CENTRALIZACIÓN - MÓDULO SERVICIOS

## 📊 Estado Actual

### ✅ Completado

| Archivo | Cambios Realizados |
|---------|-------------------|
| [siteConfig.ts](src/config/siteConfig.ts) | **NUEVO** - Configuración centralizada del sitio |
| [useSiteConfig.ts](src/hooks/useSiteConfig.ts) | **NUEVO** - Hook para acceder a la configuración |
| [ServicioDetail.tsx](src/pages/public/ServicioDetail.tsx) | Actualizado para usar `useSiteConfig()` |
| [ServicesPublicV2.tsx](src/pages/public/ServicesPublicV2.tsx) | Actualizado para usar `useSiteConfig()` |

### 📋 Valores Centralizados

```typescript
// Ahora accesibles desde cualquier componente:
const { config, getFullUrl, getImageUrl, formatPrice } = useSiteConfig();

config.siteName          // "SCUTI Company"
config.siteUrl           // "https://scuticompany.com"
config.locale            // "es_PE"
config.country           // "Peru"
config.defaultCurrency   // "PEN"
config.seo.titleSuffix   // " - SCUTI Company"
config.images.ogServices // "/logofondonegro.jpeg"
```

---

## 🔴 Pendiente de Centralizar

### Prioridad ALTA (Crítico para consistencia)

| Archivo | Línea(s) | Valor Hardcodeado | Solución |
|---------|----------|-------------------|----------|
| `ServicioPublicCard.tsx` | ~150 | Símbolo de moneda `S/.` | Usar `formatPrice()` |
| `prerender-services.js` | 44-45 | `siteUrl`, `siteName` | Importar de config backend |
| `useCmsData.ts` | 67-100 | SEO fallback hardcodeado | Importar de `siteConfig.ts` |
| `defaultConfig.ts` | múltiples | Textos de fallback | Consolidar con `siteConfig.ts` |

### Prioridad MEDIA (Mejora de mantenibilidad)

| Archivo | Valor Hardcodeado | Solución |
|---------|-------------------|----------|
| `servicioController.js` | Moneda default `"PEN"` | Variable de entorno |
| `generate-sitemap.js` | URL del sitio | Variable de entorno |
| `PublicHeader.tsx` | Logo URLs | Usar `config.images.logo` |
| `PublicFooter.tsx` | Información de contacto | Usar `config.contact` |

---

## 🛠️ Cómo Usar la Nueva Configuración

### En Componentes React

```tsx
import { useSiteConfig } from '../../hooks/useSiteConfig';

const MiComponente = () => {
  const { config, getFullUrl, formatPrice, getSeoTitle } = useSiteConfig();
  
  return (
    <div>
      {/* Nombre del sitio */}
      <h1>{config.siteName}</h1>
      
      {/* URL completa */}
      <a href={getFullUrl('/servicios/mi-servicio')}>Ver servicio</a>
      
      {/* Precio formateado */}
      <span>{formatPrice(150, 'PEN')}</span> {/* "S/. 150.00" */}
      
      {/* Título SEO */}
      <title>{getSeoTitle('Mi Página')}</title> {/* "Mi Página - SCUTI Company" */}
    </div>
  );
};
```

### Para Schema.org

```tsx
const { getServiceSchema, getBreadcrumbSchema } = useSiteConfig();

// Schema de servicio
<script type="application/ld+json">
  {JSON.stringify(getServiceSchema({
    name: 'Desarrollo Web',
    description: 'Creamos sitios web modernos',
    url: '/servicios/desarrollo-web',
    price: 500,
    currency: 'PEN',
  }))}
</script>

// Breadcrumbs
<script type="application/ld+json">
  {JSON.stringify(getBreadcrumbSchema([
    { name: 'Inicio', url: '/' },
    { name: 'Servicios', url: '/servicios' },
  ]))}
</script>
```

---

## 📝 Próximos Pasos Recomendados

### Fase 1: Completar Frontend (1-2 horas)
1. [ ] Actualizar `ServicioPublicCard.tsx` para usar `formatPrice()`
2. [ ] Actualizar `PublicHeader.tsx` y `PublicFooter.tsx`
3. [ ] Consolidar `defaultConfig.ts` con `siteConfig.ts`

### Fase 2: Backend (1 hora)
1. [ ] Crear `backend/config/siteConfig.js` equivalente
2. [ ] Actualizar `prerender-services.js`
3. [ ] Actualizar `generate-sitemap.js`

### Fase 3: Variables de Entorno (30 min)
1. [ ] Agregar `VITE_SITE_URL` a `.env`
2. [ ] Agregar `VITE_SITE_NAME` a `.env`
3. [ ] Documentar en README

---

## ✅ Beneficios Obtenidos

1. **Fuente única de verdad**: Todos los valores del sitio en un solo lugar
2. **Fácil mantenimiento**: Cambiar nombre/URL afecta todo el sitio
3. **Menos errores**: No más typos en URLs o nombres
4. **Mejor SEO**: Schema.org generado consistentemente
5. **Internacionalización ready**: Fácil agregar múltiples idiomas/monedas

---

## 📁 Estructura de Archivos Creados

```
frontend/src/
├── config/
│   └── siteConfig.ts       # ✅ Configuración centralizada
├── hooks/
│   └── useSiteConfig.ts    # ✅ Hook de acceso
└── pages/public/
    ├── ServicesPublicV2.tsx # ✅ Actualizado
    └── ServicioDetail.tsx   # ✅ Actualizado
```
