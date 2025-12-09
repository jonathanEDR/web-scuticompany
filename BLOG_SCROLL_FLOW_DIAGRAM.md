# 🚀 DIAGRAMA DETALLADO DEL FLUJO DE SCROLL Y TOC

## 📊 Flujo Actual de Detección de Scroll

```
┌─────────────────────────────────────────────────────────────┐
│  USUARIO SCROLLEA LA PÁGINA                                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │ window.addEventListener│
         │    ('scroll')          │
         └────────┬───────────────┘
                  │
                  ▼
      ┌──────────────────────────┐
      │ handleScroll() ejecutado │
      │ (passive: true)          │
      └────────┬─────────────────┘
               │
               ▼
      ┌──────────────────────────────┐
      │ requestAnimationFrame()       │
      │ (throttle mechanism)         │
      └────────┬─────────────────────┘
               │
               ▼
      ┌──────────────────────────────────┐
      │ calculateActiveHeading()         │
      │                                   │
      │ for each heading:                │
      │   rect = elem.getBoundingClientRect()
      │   if (rect.top <= offset)       │
      │     currentActive = id           │
      └────────┬─────────────────────────┘
               │
               ▼
      ┌──────────────────────────────────┐
      │ setActiveId(currentActive)        │
      │ setReadProgress(progress)        │
      └────────┬─────────────────────────┘
               │
               ▼
      ┌──────────────────────────────────┐
      │ TableOfContents RE-RENDERS        │
      │                                   │
      │ - Highlight active item          │
      │ - Expand parent group            │
      │ - Update progress bar            │
      └──────────────────────────────────┘
```

---

## 🔴 PROBLEMA: Conflicto de Contextos de Scroll

```
┌───────────────────────────────────┐
│  PÁGINA PRINCIPAL (window)         │
│  ┌─────────────────────────────┐  │
│  │                             │  │
│  │  SIDEBAR (overflow-y-auto)  │  │◄─── PROBLEMA
│  │  ┌─────────────────────┐    │  │
│  │  │  Table of Contents  │    │  │
│  │  │  - Item 1           │ ◄───── Scroll interno del sidebar
│  │  │  - Item 2           │    │  │     NO es escuchado
│  │  │  - Item 3           │    │  │     por window listener
│  │  └─────────────────────┘    │  │
│  │  ┌─────────────────────┐    │  │
│  │  │  Share Buttons      │    │  │
│  │  └─────────────────────┘    │  │
│  │                             │  │
│  └─────────────────────────────┘  │
│  ┌─────────────────────────────┐  │
│  │                             │  │
│  │  MAIN ARTICLE               │◄─── Scroll principal
│  │  (flex-1)                   │     SÍ es escuchado
│  │                             │     por window listener
│  │  [contenido del artículo]   │  │
│  │                             │  │
│  └─────────────────────────────┘  │
│                                   │
└───────────────────────────────────┘
        ↓
    window.scrollY = X
    (event disparado)
```

---

## 🎯 Cálculo de "Heading Activo" - Actualizado

```
VIEWPORT ACTUAL:
┌────────────────────────────────┐
│                                │
│   [Navegación/Header]          │  Top = 0
│                                │
├────────────────────────────────┤
│    [Offset: 25% viewport]      │  Top = ~300px
│                                │  ◄─── ZONA DE DETECCIÓN
├────────────────────────────────┤
│                                │
│   h2: "Sección 1"              │  Top = 200px  ◄─ Entra en zona
│   [párrafos...]                │
│                                │  Este es ACTIVO
│   h3: "Subsección"             │  Top = 400px  ◄─ En zona
│   [párrafos...]                │
│                                │
├────────────────────────────────┤
│   h2: "Sección 2"              │  Top = 800px  ◄─ Fuera de zona
│   [párrafos...]                │
│                                │
└────────────────────────────────┘

offset = window.innerHeight * 0.25
       = ~1080px * 0.25
       = ~270px (25% del viewport)

Un heading se considera "activo" si:
rect.top <= 270px
```

---

## 🔍 DEBUGGING: Por qué NO se actualiza

### Estado Actual en Browser Console:

```javascript
// ¿Existen los headings en el DOM?
document.getElementById('h2-0')  // null o HTMLElement?

// ¿Se dispara el evento scroll?
window.onscroll = () => console.log('Scroll!');  // ¿Se ve?

// ¿Qué valor tiene activeId?
// No hay forma de inspeccionar porque está en el estado de React

// ¿El sidebar está consumiendo los scroll events?
document.querySelector('.sticky')
  .addEventListener('scroll', () => console.log('Sidebar scroll'));
```

---

## 🔧 ARQUITECTURA ACTUAL DEL TOC

### Estructura de Componentes

```
BlogPost.tsx (Página Principal)
├─ ReadingProgress          ✅ Funciona (escucha window.scroll)
│
└─ Aside (Sidebar Sticky)
   └─ TableOfContents (variant="sidebar")
      ├─ useEffect (scroll listener) ❌ PROBLEMA AQUÍ
      ├─ useState (activeId)
      ├─ useState (readProgress)
      ├─ useMemo (groupedItems)
      └─ Render TOC List
         ├─ renderTocList()
         │  └─ map(groupedItems)
         │     ├─ renderTocItem (parent)
         │     └─ renderTocItem (children)

Article (Main Content)
└─ dangerouslySetInnerHTML
   └─ <h2 id="h2-0">Sección</h2>
   └─ <h3 id="h3-0">Subsección</h3>
   └─ <h2 id="h2-1">Otra Sección</h2>
```

---

## 📋 Estado del Componente TableOfContents

```tsx
// Estado interno
const [activeId, setActiveId] = useState<string>('');
// Ej: activeId = 'h2-0' cuando se está leyendo la sección 0

const [isOpen, setIsOpen] = useState(variant === 'sidebar');
// Ej: isOpen = true para floating variant

const [readProgress, setReadProgress] = useState(0);
// Ej: readProgress = 35 (35% de la página leída)

// Datos memorizados
const groupedItems = useMemo((): GroupedTOC[] => [...]);
// Agrupa H2 como padres y H3+ como hijos
// Ej: [
//   { parent: h2-0, children: [h3-0, h3-1] },
//   { parent: h2-1, children: [h3-2] }
// ]

const activeParentId = useMemo(() => {
  // Encuentra el H2 padre del heading activo actual
  // Ej: si activeId = 'h3-0', activeParentId = 'h2-0'
}, [activeId, tocItems]);
```

---

## 🎨 Renderizado - Cómo se actualiza la UI

```tsx
// Cuando activeId = 'h2-0':
<button 
  className={
    isActive ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
  }
  // ↑ En sidebar: h2-0 está activo, otros no
>
  Sección 1
</button>

// Los hijos de h2-0 se expanden:
<div className={`
  ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
`}>
  <h3>Subsección</h3>
</div>

// Cuando activeId = 'h2-1':
// Se colapsa el grupo h2-0 y se expande h2-1
```

---

## 🚨 Posibles Causas del Bug

### 1. Los IDs no se generan correctamente
```tsx
// En usePostContent(), ¿se agregan los IDs a los headings?
const processedContent = htmlWithIds; 
// Debe contener: <h2 id="h2-0">Title</h2>
```

### 2. El delay de 200ms es insuficiente
```tsx
const timeoutId = setTimeout(() => {
  setupScrollListener();
}, 200); // ¿Es suficiente para que se rendericen los headings?
```

### 3. Los headings están dentro de un contenedor con estilos especiales
```tsx
<div dangerouslySetInnerHTML={{ __html: processedContent }} />
// ¿Los headings tienen position, transform, etc. que afecte getBoundingClientRect?
```

### 4. El sticky positioning crea un nuevo stacking context
```css
.sticky {
  position: sticky;
  top: 24px;
  /* Crea un nuevo stacking context */
  /* Puede afectar los cálculos de getBoundingClientRect */
}
```

### 5. El overflow en el sidebar interfiere
```tsx
<div className="overflow-y-auto scrollbar-hide">
  <TableOfContents />
</div>
// Si el TOC se scrollea internamente, el listener window.scroll no se dispara
```

---

## 🎯 Intersection Observer API - Alternativa Moderna

```tsx
// MEJOR OPCIÓN que scroll events:
const observerCallback = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setActiveId(entry.target.id);
    }
  });
};

const observer = new IntersectionObserver(
  observerCallback,
  {
    threshold: 0.25,  // 25% del elemento debe ser visible
    rootMargin: '-25% 0% -75% 0%'
  }
);

// Observar cada heading
tocItems.forEach(item => {
  const element = document.getElementById(item.id);
  if (element) observer.observe(element);
});
```

**Ventajas:**
- ✅ Más eficiente (no se ejecuta en cada scroll frame)
- ✅ Más preciso (nativo del navegador)
- ✅ No afecta el performance
- ✅ Funciona incluso si hay overflow en sidebars

---

## 📈 Flujo Esperado vs Actual

### ✅ ESPERADO:
```
Usuario lee artículo (scrollea)
         ↓
Heading entra al viewport (25% inferior)
         ↓
Listener detecta cambio
         ↓
setActiveId() se ejecuta
         ↓
TableOfContents re-renderiza
         ↓
Item correspondiente se destaca
         ↓
Grupo padre se expande (si es hijo)
         ↓
Barra de progreso se actualiza
```

### ❌ ACTUAL:
```
Usuario lee artículo (scrollea)
         ↓
Evento scroll se dispara en window
         ↓
Listener DEBERÍA ejecutarse
         ↓
❌ activeId NO se actualiza (está estático)
         ↓
TableOfContents NO re-renderiza
         ↓
Item NO se destaca
         ↓
La UI se queda estática
```

---

## 📱 Comportamiento en Mobile vs Desktop

### Desktop (lg+):
```
Sidebar sticky top-24
  └─ TableOfContents variant="sidebar"
     └─ useEffect (scroll listener) ❌ PROBLEMA

Floating TOC HIDDEN
```

### Mobile (<lg):
```
Sidebar HIDDEN
  └─ TableOfContents variant="sidebar" HIDDEN

Floating TOC visible
  └─ TableOfContents variant="floating"
     └─ useEffect (scroll listener)
        └─ Probablemente SÍ funciona porque no hay sidebar conflictivo
```

**Nota:** Deberíamos verificar si en mobile/floating SÍ funciona.

---

## 🔗 Relación con ReadingProgress

```tsx
// ReadingProgress.tsx - FUNCIONA BIEN ✅
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setProgress(Math.min(progress, 100));
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}

// TableOfContents.tsx - NO FUNCIONA ❌
// Mismo pattern pero con más lógica compleja
// Por eso es más propenso a errores
```

**Diferencia clave:**
- ReadingProgress: Solo necesita calcular 1 valor (progress %)
- TableOfContents: Necesita buscar elementos, iterar, comparar rects, etc.

---

## 🎬 Reproducción del Bug

### Pasos para ver el problema:
1. Abrir un post de blog
2. Ver que el TOC sidebar se muestra correctamente
3. Scrollear hacia abajo lentamente
4. **BUG**: El TOC NO cambia de highlighting
5. **BUG**: El TOC NO expande/colapsa los hijos
6. Pero el ReadingProgress bar (arriba) SÍ se actualiza

### Pasos para verificar el floating TOC (mobile):
1. Hacer zoom del navegador (dev tools móvil)
2. Ver si el floating TOC (botón circular) sí se actualiza
3. Si SÍ funciona en mobile = el bug es específico del sidebar

---

## 📝 Checklist de Validación

- [ ] Los headings tienen IDs en el HTML renderizado
- [ ] El evento scroll se dispara (verificar con console.log)
- [ ] `calculateActiveHeading()` retorna un ID válido
- [ ] `setActiveId()` actualiza el estado
- [ ] El componente se re-renderiza correctamente
- [ ] El CSS de :active/:hover se aplica correctamente
- [ ] El overflow del sidebar no interfiere
- [ ] El sticky positioning no rompe los cálculos
