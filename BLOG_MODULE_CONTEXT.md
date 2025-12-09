# 📚 Análisis Completo del Módulo Blog - WebScuti Frontend

## 🎯 Problema Identificado

**El índice de contenido (TOC) se queda estático al inicio cuando el usuario baja a leer el texto.**

El índice debería:
- ✅ Mostrar qué sección está siendo leída actualmente (highlighting dinámico)
- ✅ Expandir/contraer sus hijos según la sección activa
- ✅ Seguir el progreso del usuario mientras baja
- ❌ **PROBLEMA**: Se queda fijo al inicio, sin actualizar mientras scrolleas

---

## 📐 Estructura Actual de la Página de Blog

### Ruta Principal
```
/src/pages/public/blog/BlogPost.tsx
```

### Estructura HTML de Layout

```tsx
<div className="min-h-screen">
  {/* BARRA DE PROGRESO - Funciona bien */}
  <ReadingProgress />
  
  {/* CONTENEDOR PRINCIPAL */}
  <section>
    <div className="lg:flex lg:gap-8 lg:items-start"> 
      {/* SIDEBAR (Desktop only) */}
      <aside className="hidden lg:block lg:w-72 xl:w-80">
        {/* STICKY CONTAINER - AQUÍ ESTÁ EL PROBLEMA */}
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
          {/* TABLE OF CONTENTS - TOC Sidebar */}
          <TableOfContents 
            tocItems={tocItems}
            variant="sidebar"
            showProgress={tocConfig.showProgress}
          />
          
          {/* SHARE BUTTONS */}
          <ShareButtons />
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <article>
        {/* ARTÍCULO HTML */}
        <div dangerouslySetInnerHTML={{ __html: processedContent }} />
        
        {/* TAGS, AUTOR, COMENTARIOS, POSTS RELACIONADOS, NAVEGACIÓN */}
      </article>
    </div>
  </section>
  
  {/* TOC FLOATING - Mobile only */}
  <div className="lg:hidden">
    <TableOfContents variant="floating" />
  </div>
</div>
```

---

## 🔧 Componente TableOfContents

### Ubicación
```
/src/components/blog/common/TableOfContents.tsx
```

### Props Aceptadas
```tsx
interface TableOfContentsProps {
  tocItems: TOCItem[];           // Array de headings del contenido
  className?: string;
  variant?: 'sidebar' | 'floating'; // Tipo de renderizado
  showProgress?: boolean;        // Mostrar barra de progreso
}

interface TOCItem {
  id: string;                    // ID del heading (h2, h3, etc)
  text: string;                  // Texto visible del heading
  level: number;                 // Nivel HTML (2, 3, 4)
}
```

---

## 🚀 Cómo Funciona Actualmente

### 1️⃣ Generación del TOC

**En BlogPost.tsx:**
```tsx
const { html: processedContent, tocItems } = usePostContent(
  post?.content || '', 
  tocConfig.maxDepth || 3
);
```

- El hook `usePostContent` procesa el HTML del contenido
- Extrae automáticamente los headings (h2, h3, h4...)
- Genera los IDs únicos para cada heading
- Retorna el HTML procesado + array de `tocItems`

**Hook:** `/src/hooks/blog/usePostContent.ts`

---

### 2️⃣ Detección del Heading Activo

**En TableOfContents.tsx - useEffect (líneas 73-160):**

```tsx
useEffect(() => {
  if (variant !== 'sidebar' || !tocItems.length) return;
  
  // Setup scroll listener
  const setupScrollListener = () => {
    // 1. Busca todos los elementos headings en el DOM
    const headingElements = tocItems.map(item => ({
      id: item.id,
      element: document.getElementById(item.id)
    }));
    
    // 2. En cada scroll, calcula cuál heading está visible
    const calculateActiveHeading = () => {
      const offset = window.innerHeight * 0.25; // 25% del viewport
      for (const { id, element } of headingElements) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= offset) {
          return id; // Este es el heading activo
        }
      }
    };
    
    // 3. Handler con throttle
    window.addEventListener('scroll', handleScroll, { passive: true });
  };
  
  // Delay de 200ms para asegurar que el DOM está listo
  const timeoutId = setTimeout(() => {
    setupScrollListener();
  }, 200);
  
  return () => {
    clearTimeout(timeoutId);
    window.removeEventListener('scroll', handleScroll);
  };
}, [tocItems, variant]);
```

**¿Cómo actualiza el estado?**
```tsx
const handleScroll = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const newActiveId = calculateActiveHeading();
      setActiveId(newActiveId); // ← Actualiza el heading activo
      
      const progress = (scrolled / documentHeight) * 100;
      setReadProgress(progress); // ← Actualiza progreso
      
      ticking = false;
    });
    ticking = true;
  }
};
```

---

### 3️⃣ Renderizado del TOC

**Variante Sidebar:**
```tsx
return (
  <div className="table-of-contents">
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5">
      {/* HEADER CON % PROGRESO */}
      <span>{Math.round(readProgress)}%</span>
      
      {/* BARRA PROGRESO */}
      <div style={{ width: `${readProgress}%` }} />
      
      {/* LISTA DE ITEMS */}
      <nav className="max-h-[60vh] overflow-y-auto">
        {renderTocList()}
      </nav>
    </div>
  </div>
);
```

**Renderizado de Items:**
```tsx
const renderTocItem = (item, isActive, isChild) => (
  <button
    className={isActive 
      ? 'text-purple-600 bg-purple-50 font-semibold' 
      : 'text-gray-600 hover:text-gray-900'}
    onClick={() => handleClick(item.id)}
  >
    {item.text}
  </button>
);
```

---

## 🐛 Análisis del Problema

### ¿Por qué se queda estático?

#### **Problema 1: Sidebar con overflow propio**
```tsx
<div className="sticky top-24 overflow-y-auto scrollbar-hide">
  <TableOfContents />
</div>
```

**Impacto:**
- El sidebar tiene su propio scroll interno (`overflow-y-auto`)
- Cuando el usuario scrollea la PÁGINA, el sidebar no se mueve
- El scroll listener detecta cambios en `window.scrollY`
- Pero si el sidebar tiene scroll propio, hay conflicto

#### **Problema 2: Scope del evento scroll**
```tsx
window.addEventListener('scroll', handleScroll, { passive: true });
```

**Impacto:**
- Solo escucha scroll del `window` (documento principal)
- No escucha scroll dentro de elementos con `overflow-y-auto`
- El sidebar puede tener su propio contexto de scroll

#### **Problema 3: Búsqueda de elementos en el DOM**
```tsx
const element = document.getElementById(item.id);
const rect = element.getBoundingClientRect();
```

**Impacto:**
- Se buscan IDs en el DOM después del delay (200ms)
- Si los headings aún no tienen IDs generados, no se encuentran
- Los elementos deben estar renderizados Y en el DOM

#### **Problema 4: Sticky positioning conflictual**
```css
sticky top-24          /* Offset 96px (24 * 4) */
```

El contenedor sticky puede tener z-index o posicionamiento que afecte:
- Cálculo de `getBoundingClientRect()`
- Intersección con viewport

---

## 📋 Flujo Actual de Datos

```
POST DATA
   ↓
usePostContent() 
   ├─ Extrae headings
   ├─ Genera IDs (h2-0, h2-1, h3-0...)
   ├─ Procesa HTML (dangerouslySetInnerHTML)
   └─ Retorna tocItems
   ↓
BlogPost.tsx 
   ├─ Renderiza contenido con heading IDs
   ├─ Pasa tocItems a TableOfContents
   ↓
TableOfContents.tsx
   ├─ setupScrollListener (200ms delay)
   ├─ Busca elementos por ID en DOM
   ├─ addEventListener('scroll')
   ├─ calculateActiveHeading()
   ├─ setActiveId() → Re-render
   ↓
UI Actualizada
   ├─ Highlighting del item activo
   ├─ Barra de progreso
   ├─ Expansión de items hijos
```

---

## 🎮 Interacciones Actuales

### 1. Click en item del TOC
```tsx
const handleClick = useCallback((id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const yOffset = -100; // Offset para que no quede bajo header
    const y = element.getBoundingClientRect().top + 
              window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
    
    if (variant === 'floating') {
      setIsOpen(false); // Cerrar menú flotante
    }
  }
}, [variant]);
```

✅ **Esto funciona bien** - El usuario puede clickear un item y scrollea suavemente

### 2. Scroll de la página
```tsx
const handleScroll = () => {
  // Detecta que heading es visible
  // Actualiza activeId
  // Actualiza readProgress
};
```

❌ **AQUÍ ESTÁ EL PROBLEMA** - No se actualiza correctamente

---

## 🛠️ Diagrama Visual del Layout

```
┌─────────────────────────────────────────────────────┐
│               BLOG POST PAGE                         │
├─────────────────────────────────────────────────────┤
│  [🔄 ReadingProgress Bar - FIJO TOP]               │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────┬──────────────────────────┐   │
│  │                  │                          │   │
│  │  SIDEBAR STICKY  │    MAIN ARTICLE          │   │
│  │  (overflow-y)    │    (flex-1)              │   │
│  │  ┌────────────┐  │  ┌────────────────────┐  │   │
│  │  │ TOC        │  │  │ h1: Título         │  │   │
│  │  │ - Item 1   │  │  ├────────────────────┤  │   │
│  │  │ - Item 2   │  │  │ párrafos...        │  │   │
│  │  │ - Item 3   │  │  │                    │  │   │
│  │  │            │  │  │ h2: Sección 1      │  │   │
│  │  │ SHARE BTN  │  │  │ párrafos...        │  │   │
│  │  └────────────┘  │  │                    │  │   │
│  │                  │  │ h3: Subsección     │  │   │
│  └──────────────────┼──┤ párrafos...        │  │   │
│                     │  │                    │  │   │
│  [cuando usuario    │  │ h2: Sección 2      │  │   │
│   scrollea AQUÍ]    │  │ párrafos...        │  │   │
│                     │  │                    │  │   │
│                     │  │ h3: Subsección     │  │   │
│                     │  │ párrafos...        │  │   │
│                     │  │                    │  │   │
│                     │  └────────────────────┘  │   │
│                     │                          │   │
│                     │  Tags, Autor, Comments  │   │
│  ┌──────────────────┴──────────────────────────┐  │
│  │  FOOTER                                      │  │
│  └──────────────────────────────────────────────┘  │
```

---

## 📱 Responsive Behavior

### Desktop (lg+)
- Sidebar VISIBLE + STICKY
- TOC variant = "sidebar"
- Floating TOC HIDDEN

### Tablet/Mobile (< lg)
- Sidebar HIDDEN
- TOC variant = "floating" (botón circular flotante)
- Floating TOC VISIBLE

---

## 🔍 Debugging Actual

El componente tiene algunos logs internos pero no están visibles. Para debuggear:

```tsx
// Agregar en setupScrollListener():
console.log('Headings encontrados:', headingElements);
console.log('Active heading:', newActiveId);
console.log('Read progress:', progress);
```

---

## 🎯 Configuración del CMS

En `BlogPost.tsx`:
```tsx
const { pageData: cmsConfig } = useCmsData('blog-post-detail');
const tocConfig = blogPostConfig.tableOfContents || {};
```

**Configuración disponible:**
```ts
tocConfig = {
  enabled: boolean;           // Habilitar/deshabilitar TOC
  position: 'left' | 'right'; // Posición del sidebar
  maxDepth: 2 | 3 | 4;       // Profundidad de headings a mostrar
  sticky: boolean;            // Sticky positioning
  showProgress: boolean;      // Mostrar barra de progreso
  collapsible: boolean;       // Items colapsables
  defaultExpanded: boolean;   // Expandido por defecto
}
```

---

## ✅ Lo que Funciona Bien

1. ✅ **ReadingProgress bar** - Barra superior de progreso funciona perfectamente
2. ✅ **Generación del TOC** - Los headings se extraen correctamente
3. ✅ **Click navigation** - Hacer click en un item scrollea a esa sección
4. ✅ **Floating TOC (mobile)** - El menú flotante funciona
5. ✅ **Dark/Light theme** - Los temas se aplican bien
6. ✅ **Responsive layout** - Desktop/mobile layout es correcto

---

## ❌ Lo que NO Funciona

1. ❌ **Active highlighting en sidebar** - El TOC no resalta la sección leída
2. ❌ **Dynamic expansion** - Los items no se expanden según la sección activa
3. ❌ **Progress tracking en TOC** - El índice no muestra cuál sección estás leyendo
4. ❌ **Scroll detection** - El listener de scroll no actualiza el estado correctamente

---

## 🔗 Dependencias y Hooks Relacionados

```
BlogPost.tsx
  └─ useBlogPost()              // Obtiene datos del post
  └─ usePostContent()           // Genera TOC + HTML
  └─ useCmsData()               // Config del CMS
  └─ useTheme()                 // Theme dark/light
  
TableOfContents.tsx
  └─ useState() x3              // activeId, isOpen, readProgress
  └─ useEffect()                // Scroll listener
  └─ useMemo()                  // Grouping de items
  └─ useCallback()              // handleClick
```

---

## 📝 Resumen de la Solución Necesaria

**El problema es que el scroll listener no está detectando correctamente cuando un heading entra al viewport.**

La solución requiere:
1. ✅ Verificar que los heading IDs estén siendo generados correctamente
2. ✅ Asegurar que el scroll listener está activo y funciona
3. ✅ Implementar Intersection Observer API (más eficiente que scroll eventos)
4. ✅ Hacer que el TOC siga dinámicamente la lectura del usuario
5. ✅ Mantener el sidebar sticky pero permitir que el TOC sea responsive

---

## 🎬 Próximos Pasos

Necesitamos:
1. Validar que los IDs se generan en el HTML renderizado
2. Inspeccionar el listener de scroll en tiempo real
3. Implementar una solución con Intersection Observer
4. Hacer pruebas en scroll rápido y lento
5. Validar que funcione en mobile y desktop
