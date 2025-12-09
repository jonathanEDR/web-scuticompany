# 🏗️ ARQUITECTURA TÉCNICA - MÓDULO BLOG

## 📁 Estructura de Carpetas

```
/src
├── /pages/public/blog/
│   ├── BlogPost.tsx              ← Página principal del post (AQUÍ ESTÁ EL PROBLEMA)
│   ├── BlogPostBasic.tsx          ← Versión alternativa (básica)
│   ├── BlogPostEnhanced.tsx       ← Versión extendida (no usada actualmente)
│   ├── BlogHome.tsx               ← Home del blog (lista de posts)
│   ├── BlogCategory.tsx           ← Filtro por categoría
│   └── index.ts                   ← Exportaciones
│
├── /components/blog/
│   ├── /common/
│   │   ├── TableOfContents.tsx    ← 🔴 COMPONENTE CON BUG
│   │   ├── ReadingProgress.tsx    ← ✅ Funciona bien (referencia)
│   │   ├── PostHero.tsx
│   │   ├── PostHeader.tsx
│   │   ├── ShareButtons.tsx
│   │   ├── TagList.tsx
│   │   ├── RelatedPosts.tsx
│   │   ├── AuthorCard.tsx
│   │   ├── LikeButton.tsx
│   │   ├── FavoriteButton.tsx
│   │   ├── LazyImage.tsx
│   │   ├── PostNavigation.tsx
│   │   ├── ReadingTimeIndicator.tsx
│   │   ├── SEOHead.tsx
│   │   ├── BlogCard.tsx
│   │   ├── CategoryBadge.tsx
│   │   └── index.ts
│   ├── /comments/
│   ├── /editor/
│   ├── /admin/
│   └── ... (otras subcarpetas)
│
├── /hooks/blog/
│   ├── index.ts
│   ├── useBlogPost.ts            ← Obtiene datos del post (API)
│   ├── usePostContent.ts         ← 🔑 Genera TOC + HTML
│   ├── useBlogPosts.ts           ← Obtiene lista de posts
│   ├── useCache.ts               ← Caching de posts
│   └── ... (otros hooks)
│
├── /contexts/
│   └── ThemeContext.tsx           ← Dark/Light mode
│
├── /utils/
│   ├── blog.ts                    ← Utilidades blog (sanitizeHTML, etc)
│   └── imageUtils.ts              ← Manejo de imágenes
│
└── /config/
    └── defaultChatbotConfig.ts
```

---

## 🔄 Flujo de Datos Completo

### 1. CARGA DEL POST

```
URL: /blog/slug-del-articulo
         ↓
BlogPost.tsx mounted
         ↓
const { slug } = useParams()  → "slug-del-articulo"
         ↓
const { post, loading } = useBlogPost(slug)
         ↓
API CALL: GET /api/blog/posts/{slug}
         ↓
Backend responde con:
{
  _id: "...",
  title: "...",
  content: "<h2>...</h2><p>...</p><h3>...</h3>...",
  featuredImage: "...",
  tags: [...],
  author: {...},
  category: {...},
  publishedAt: "...",
  allowComments: true,
  ...
}
         ↓
post = { ...data }
loading = false
```

---

### 2. PROCESAMIENTO DEL CONTENIDO

```
post.content (HTML sin IDs)
         ↓
const { html, tocItems } = usePostContent(
  post.content,
  maxDepth = 3
)
         ↓
usePostContent() hace:

  a) PARSEA HTML
     <h2>Sección 1</h2>
     <h3>Subsección</h3>
     <h2>Sección 2</h2>
     
  b) EXTRAE HEADINGS
     [
       { tag: "H2", text: "Sección 1" },
       { tag: "H3", text: "Subsección" },
       { tag: "H2", text: "Sección 2" }
     ]
  
  c) GENERA IDs
     "h2-0", "h3-0", "h2-1"
  
  d) AGREGA IDs AL HTML
     <h2 id="h2-0">Sección 1</h2>
     <h3 id="h3-0">Subsección</h3>
     <h2 id="h2-1">Sección 2</h2>
  
  e) CREA TOCITERS
     [
       { id: "h2-0", text: "Sección 1", level: 2 },
       { id: "h3-0", text: "Subsección", level: 3 },
       { id: "h2-1", text: "Sección 2", level: 2 }
     ]
  
  f) RETORNA
     {
       html: "procesado con IDs",
       tocItems: [array de items]
     }
         ↓
Datos listos para renderizar
```

---

### 3. RENDERIZADO DEL LAYOUT

```
<BlogPostEnhanced>
  ↓
  <Helmet>...</Helmet>  ← SEO Meta tags
  ↓
  <ReadingProgress />   ← Barra arriba (✅ Funciona)
  ↓
  <section>
    ├─ <aside> (sticky)
    │   └─ <div sticky top-24>
    │       └─ <TableOfContents
    │           tocItems={tocItems}
    │           variant="sidebar"
    │         />
    │
    └─ <article>
        └─ <div dangerouslySetInnerHTML={{
            __html: sanitizeHTML(html)
          }} />
           ↓
           AQUÍ se renderiza:
           <h2 id="h2-0">Sección 1</h2>
           <p>párrafos...</p>
           <h3 id="h3-0">Subsección</h3>
           <p>párrafos...</p>
           <h2 id="h2-1">Sección 2</h2>
           ...
```

---

### 4. DETECCIÓN DE SCROLL

```
Usuario scrollea página
         ↓
window.scroll event dispara
         ↓
TableOfContents.tsx useEffect
  └─ handleScroll() ejecutado
         ↓
requestAnimationFrame(() => {
  // Buscar headings en el DOM
  const headings = tocItems.map(item => 
    document.getElementById(item.id)
  );
  
  // Calcular qué heading está activo
  const offset = window.innerHeight * 0.25;
  let activeId = '';
  
  for (const heading of headings) {
    const rect = heading.getBoundingClientRect();
    if (rect.top <= offset) {
      activeId = heading.id;
    }
  }
  
  // Actualizar estado
  setActiveId(activeId);
  setReadProgress(scrolled / documentHeight * 100);
})
         ↓
React re-renderiza TableOfContents
         ↓
Los items se actualizan (colores, expansión)
```

---

## 🎯 Props y Estados del Componente TableOfContents

### Props Recibidos

```tsx
interface TableOfContentsProps {
  tocItems: TOCItem[];              // Del usePostContent()
  className?: string;               // Extra CSS
  variant?: 'sidebar' | 'floating'; // Tipo de renderizado
  showProgress?: boolean;           // Del CMS config
}

// En BlogPost.tsx:
<TableOfContents 
  tocItems={tocItems}           // ← usePostContent() output
  variant="sidebar"             // ← siempre sidebar (desktop)
  showProgress={true}           // ← tocConfig.showProgress
/>
```

### Estados Internos

```tsx
const [activeId, setActiveId] = useState<string>('');
// Actualizado por scroll listener
// Ej: 'h2-0', 'h3-1', etc.

const [isOpen, setIsOpen] = useState(variant === 'sidebar');
// true para floating, false inicialmente (se abre con click)

const [readProgress, setReadProgress] = useState(0);
// 0-100, actualizado por scroll listener
// Muestra el % de la página que se ha leído
```

---

## 🔍 Comportamiento Esperado del TOC

### En Sidebar (Desktop)

```
NORMAL STATE:
┌─────────────────────┐
│ Contenido           │ (Progress %)
├─────────────────────┤
│ ● Sección 1         │ ← Parent (H2)
│   ▶ Subsección      │ ← Child (H3) - colapsado
│ ● Sección 2         │ ← Parent (H2)
│   ▼ Subsección 1    │ ← Child (H3) - expandido
│   ▼ Subsección 2    │ ← Child (H3) - expandido
│ ● Sección 3         │ ← Parent (H2)

CUANDO SCROLLEA A "Sección 2":
┌─────────────────────┐
│ Contenido    (45%)  │
├─────────────────────┤
│ ○ Sección 1         │ ← Desactivado
│   ▶ Subsección      │ ← Colapsado
│ ● Sección 2         │ ← ACTIVO (highlight)
│   ▼ Subsección 1    │ ← EXPANDIDO
│   ▼ Subsección 2    │ ← Visible
│ ○ Sección 3         │ ← Desactivado
└─────────────────────┘
```

**Cambios esperados:**
- El "●" cambia a "○" en items inactivos
- El color cambia a gris
- El fondo se remueve
- El item activo se destaca en purple
- Los hijos se expanden/colapsan dinámicamente

---

## 📊 Hook usePostContent() - Detalle

### Ubicación
`/src/hooks/blog/usePostContent.ts`

### Qué Hace

```tsx
export function usePostContent(content: string, maxDepth: number) {
  return useMemo(() => {
    if (!content) return { html: '', tocItems: [] };
    
    // 1. Crear un parser del HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    
    // 2. Encontrar todos los headings
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    // 3. Generar TOC items
    const tocItems: TOCItem[] = [];
    const headingMap = new Map<string, number>();
    
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName[1]); // H2 -> 2
      if (level <= maxDepth) {
        const text = heading.textContent || '';
        
        // Generar ID único
        const baseId = `h${level}-${(headingMap.get(`h${level}`) || 0)}`;
        heading.id = baseId;
        headingMap.set(`h${level}`, (headingMap.get(`h${level}`) || 0) + 1);
        
        tocItems.push({
          id: baseId,
          text: text,
          level: level
        });
      }
    });
    
    // 4. Serializar el HTML procesado
    const html = new XMLSerializer().serializeToString(doc);
    
    return { html, tocItems };
  }, [content, maxDepth]);
}
```

**Entrada:** HTML crudo con headings sin IDs
**Salida:** 
- `html`: HTML procesado con IDs agregados
- `tocItems`: Array de objetos {id, text, level}

---

## 🛠️ Ciclo de Vida del Componente TableOfContents

```
Mount
  ↓
useEffect(() => {
  if (variant !== 'sidebar') return; // ← Solo para sidebar
  
  // 1. Setup (buscar elementos en DOM)
  const headingElements = tocItems.map(item => ({
    id: item.id,
    element: document.getElementById(item.id)
    // ← Aquí puede fallar si el ID no existe en el DOM
  }));
  
  // 2. Crear listener de scroll
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // 3. Cleanup
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, [tocItems, variant])

Render
  ↓
  Mostrar TOC sidebar con items

Scroll (Usuario scrollea)
  ↓
  handleScroll() disparado
  ↓
  setActiveId() ejecutado
  ↓
  Re-render (actualizar highlighting)

Unmount
  ↓
  Cleanup: removeEventListener
```

---

## 🎨 Agrupación de Items - useMemo

```tsx
const groupedItems = useMemo((): GroupedTOC[] => {
  // Agrupa H2 como padres y H3+ como hijos
  // Entrada: 
  [
    { id: 'h2-0', level: 2, text: 'Sección 1' },
    { id: 'h3-0', level: 3, text: 'Subsección A' },
    { id: 'h3-1', level: 3, text: 'Subsección B' },
    { id: 'h2-1', level: 2, text: 'Sección 2' },
  ]
  
  // Salida:
  [
    {
      parent: { id: 'h2-0', ... },
      children: [
        { id: 'h3-0', ... },
        { id: 'h3-1', ... }
      ]
    },
    {
      parent: { id: 'h2-1', ... },
      children: []
    }
  ]
}, [tocItems]);
```

---

## 🎬 Renderizado Final - Ejemplo Real

```tsx
// Si tocItems = [h2-0, h3-0, h3-1, h2-1]
// y activeId = 'h2-0'
// y readProgress = 15

return (
  <div className="table-of-contents">
    <div className="bg-white">
      {/* Header */}
      <span>15%</span>
      
      {/* Progress bar */}
      <div style={{ width: '15%' }} />
      
      {/* Lista */}
      <nav>
        {/* Grupo 1: h2-0 (ACTIVO) */}
        <button
          className="
            w-full text-left
            text-purple-600 bg-purple-50 font-semibold
            ← PORQUE isActive = true
          "
        >
          Sección 1
        </button>
        
        {/* Hijos expandidos porque activeParentId = 'h2-0' */}
        <div className="max-h-[500px] opacity-100">
          <button className="text-purple-600">
            ● Subsección A
          </button>
          <button className="text-gray-600">
            ● Subsección B
          </button>
        </div>
        
        {/* Grupo 2: h2-1 (INACTIVO) */}
        <button
          className="
            w-full text-left
            text-gray-600 hover:text-gray-900
            ← PORQUE isActive = false
          "
        >
          Sección 2
        </button>
        
        {/* Hijos colapsados porque activeParentId ≠ 'h2-1' */}
        <div className="max-h-0 opacity-0">
          ...
        </div>
      </nav>
    </div>
  </div>
);
```

---

## 📱 Configuración del CMS

Recuperada en BlogPost.tsx:
```tsx
const { pageData: cmsConfig } = useCmsData('blog-post-detail');

// Estructura esperada:
cmsConfig = {
  content: {
    blogPostDetailConfig: {
      tableOfContents: {
        enabled: true,
        position: 'right', // 'left' | 'right' | 'none'
        maxDepth: 3,       // 2 | 3 | 4
        sticky: true,
        showProgress: true,
        collapsible: true,
        defaultExpanded: true
      },
      hero: {...},
      content: {...},
      author: {...},
      relatedPosts: {...},
      shareButtons: {...},
      comments: {...},
      navigation: {...}
    }
  }
}
```

**Admin Panel:** `/src/components/cms/BlogPostDetailConfigSection.tsx`

---

## 🔗 Dependencias Externas

```json
{
  "react": "18.x",
  "react-router-dom": "6.x",
  "react-helmet-async": "^1.3.0",
  "lucide-react": "^0.263.1"
}
```

**Sin librerías especiales para TOC** (vanilla React)

---

## 🌐 Variables CSS Importantes

```css
/* En /src/index.css */

.table-of-contents {
  /* Estilos generales del TOC */
}

.sticky {
  position: sticky;
  top: 96px; /* 6rem = 24 * 4 = 96px */
}

.overflow-y-auto {
  overflow-y: auto;
  max-height: calc(100vh - 8rem);
  /* max-height = 100vh - 128px */
}

/* Scrollbar personalizado del TOC */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Para la barra de progreso */
.from-purple-500.to-blue-500 {
  background: linear-gradient(to right, #a855f7, #3b82f6);
}
```

---

## 💡 Puntos Clave de la Arquitectura

1. **usePostContent** genera IDs automáticamente
2. **TableOfContents** busca esos IDs en el DOM
3. **Scroll listener** detecta qué heading está visible
4. **State update** provoca re-render
5. **CSS classes** aplican estilos basados en estado

---

## 🎯 Resumen de Responsabilidades

| Componente | Responsabilidad |
|------------|-----------------|
| BlogPost.tsx | Orquestación, layout, SEO |
| usePostContent | Procesar HTML, generar TOC |
| TableOfContents | Renderizar TOC, detectar scroll |
| ReadingProgress | Mostrar barra de progreso global |
| useCmsData | Obtener configuración |
| sanitizeHTML | Sanitizar HTML por seguridad |
