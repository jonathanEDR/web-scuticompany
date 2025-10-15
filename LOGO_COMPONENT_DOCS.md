# 🎨 Documentación del Componente Logo

## 📋 Descripción

Componente reutilizable y profesional para mostrar el logo de Scuti Company con soporte completo para temas (claro/oscuro), múltiples tamaños, animaciones y efectos especiales.

---

## 🚀 Uso Básico

```tsx
import Logo from '../components/Logo';

// Logo simple
<Logo />

// Logo con texto
<Logo withText />

// Logo grande
<Logo size="lg" />

// Logo con todas las funciones
<Logo size="md" withText animated compact />
```

---

## ⚙️ Props (Propiedades)

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Tamaño del logo |
| `withText` | `boolean` | `false` | Mostrar texto "Tecnología Inteligente" |
| `className` | `string` | `''` | Clases CSS adicionales |
| `animated` | `boolean` | `true` | Activar animaciones y efectos |
| `compact` | `boolean` | `false` | Reducir tamaño al hacer scroll |

---

## 📏 Tamaños Disponibles

```tsx
// Extra pequeño - 24px a 32px (h-6 sm:h-8)
<Logo size="xs" />

// Pequeño - 32px a 40px (h-8 sm:h-10)
<Logo size="sm" />

// Mediano - 40px a 48px (h-10 sm:h-12) ✅ DEFAULT
<Logo size="md" />

// Grande - 48px a 64px (h-12 sm:h-16)
<Logo size="lg" />

// Extra grande - 64px a 80px (h-16 sm:h-20)
<Logo size="xl" />
```

---

## 🎭 Características

### 1. **Cambio Automático de Tema**
El logo cambia automáticamente entre versión blanca y negra según el tema activo:

```tsx
// Tema oscuro → LOGO VECTOR VERSION BLANCA.svg
// Tema claro → LOGO VECTOR VERSION NEGRA.svg

const { theme } = useTheme();
const logoSrc = theme === 'dark' 
  ? '/LOGO VECTOR VERSION BLANCA.svg' 
  : '/LOGO VECTOR VERSION NEGRA.svg';
```

### 2. **Modo Compacto (Scroll)**
Con `compact={true}`, el logo se reduce automáticamente al hacer scroll:

```tsx
<Logo size="md" compact />
// Scroll > 50px → se convierte en size="sm"
```

### 3. **Animaciones Incluidas**
- ✨ Fade in al cargar la página
- 🌟 Efecto de brillo (glow) en hover
- 💫 Pulso sutil en hover
- 🔄 Transiciones suaves

### 4. **Responsive por Defecto**
Cada tamaño tiene dos valores: móvil y desktop
```css
h-10 sm:h-12  /* 40px móvil, 48px desktop */
```

### 5. **Texto Complementario**
El texto cambia según el dispositivo:
```tsx
<Logo withText />
// Desktop: "Tecnología Inteligente"
// Mobile: "Tech Intelligence"
```

---

## 📱 Ejemplos de Uso

### En el Header (Navegación Principal)
```tsx
import Logo from '../components/Logo';

<Link to="/" className="flex items-center transition-transform hover:scale-105">
  <Logo size="md" animated compact />
</Link>
```

**Características:**
- Tamaño mediano por defecto
- Se reduce al hacer scroll (compact)
- Animaciones activadas
- Efecto scale en hover del Link

### En el Footer
```tsx
import Logo from '../components/Logo';

<Logo size="lg" withText />
```

**Características:**
- Tamaño grande para visibilidad
- Incluye texto "Tecnología Inteligente"
- No cambia de tamaño (no compact)

### En una Landing Page
```tsx
<div className="text-center py-20">
  <Logo size="xl" className="mx-auto mb-8" />
  <h1>Bienvenido a Scuti Company</h1>
</div>
```

### En un Loading Screen
```tsx
<div className="min-h-screen flex items-center justify-center">
  <Logo size="lg" animated className="logo-continuous-glow" />
</div>
```

### En un Modal o Dialog
```tsx
<div className="modal-header">
  <Logo size="sm" />
</div>
```

### En un Email Template
```tsx
// Sin animaciones para compatibilidad
<Logo size="md" animated={false} />
```

---

## 🎨 Clases CSS Disponibles

### Del Componente
```css
.logo-animated        /* Animación de entrada */
.logo-size-transition /* Transiciones suaves */
.logo-scale-hover     /* Escala en hover */
.logo-glow           /* Efecto de resplandor */
.logo-continuous-glow /* Resplandor animado continuo */
```

### Uso de Clases Personalizadas
```tsx
<Logo 
  size="md" 
  className="logo-continuous-glow opacity-90 hover:opacity-100" 
/>
```

---

## 🌈 Personalización Avanzada

### Cambiar el Efecto de Sombra
```tsx
<Logo 
  size="lg"
  className="custom-shadow"
  style={{
    filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.5))'
  }}
/>
```

### Logo con Rotación
```tsx
<div className="animate-spin-slow">
  <Logo size="md" animated={false} />
</div>

// En tu CSS:
.animate-spin-slow {
  animation: spin 8s linear infinite;
}
```

### Logo con Degradado de Fondo
```tsx
<div className="p-4 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full">
  <Logo size="sm" />
</div>
```

---

## 🔧 Integración con Sistema de Temas

El componente se integra perfectamente con `ThemeContext`:

```tsx
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div>
      <Logo size="md" />
      <button onClick={toggleTheme}>
        Cambiar a {theme === 'dark' ? 'Claro' : 'Oscuro'}
      </button>
    </div>
  );
};
```

---

## ⚡ Performance

### Optimizaciones Implementadas

1. **Preload en index.html**
```html
<link rel="preload" href="/LOGO VECTOR VERSION BLANCA.svg" as="image" type="image/svg+xml" />
<link rel="preload" href="/LOGO VECTOR VERSION NEGRA.svg" as="image" type="image/svg+xml" />
```

2. **Lazy Loading Opcional**
```tsx
import { lazy, Suspense } from 'react';

const Logo = lazy(() => import('../components/Logo'));

<Suspense fallback={<div className="h-12 w-32 bg-gray-200 animate-pulse" />}>
  <Logo size="md" />
</Suspense>
```

3. **Loading Eager**
```tsx
// El componente usa loading="eager" por defecto
<img loading="eager" ... />
```

---

## 🎯 Casos de Uso Comunes

### 1. Header Fijo con Scroll
```tsx
<header className="fixed top-0">
  <Logo size="md" animated compact />
  {/* compact hace que se reduzca al scrollear */}
</header>
```

### 2. Footer Informativo
```tsx
<footer>
  <Logo size="lg" withText />
  {/* Tamaño grande con texto descriptivo */}
</footer>
```

### 3. Splash Screen
```tsx
<div className="splash-screen">
  <Logo size="xl" className="logo-continuous-glow" />
  <p>Cargando...</p>
</div>
```

### 4. Página 404
```tsx
<div className="error-page">
  <Logo size="lg" animated={false} className="opacity-30" />
  <h1>Página no encontrada</h1>
</div>
```

### 5. Dashboard Sidebar
```tsx
<aside className="sidebar">
  <Logo size="sm" />
  {/* Versión compacta para sidebar */}
</aside>
```

---

## 🐛 Troubleshooting

### El logo no se ve
```bash
# Verificar que los archivos existan
ls frontend/public/*.svg

# Deben aparecer:
# - LOGO VECTOR VERSION BLANCA.svg
# - LOGO VECTOR VERSION NEGRA.svg
```

### El logo no cambia con el tema
```tsx
// Asegurarse de que ThemeProvider envuelve la app
import { ThemeProvider } from './contexts/ThemeContext';

<ThemeProvider>
  <App />
</ThemeProvider>
```

### Tamaño incorrecto
```tsx
// Usar las clases predefinidas, no width/height custom
<Logo size="md" /> // ✅ Correcto
<Logo style={{ width: '100px' }} /> // ❌ No recomendado
```

### Animaciones no funcionan
```tsx
// Verificar que animated esté en true
<Logo animated={true} />

// Importar el CSS de tema
import '../styles/theme.css';
```

---

## 🔄 Actualizaciones Futuras

### Roadmap
- [ ] Soporte para logos en diferentes idiomas
- [ ] Versión en PNG para fallback
- [ ] Logo animado (formato Lottie)
- [ ] Modo de alto contraste
- [ ] Variantes de color personalizables

---

## 📚 Referencias

- **Archivo del componente:** `frontend/src/components/Logo.tsx`
- **Estilos CSS:** `frontend/src/styles/theme.css`
- **Logos SVG:** `frontend/public/LOGO VECTOR VERSION *.svg`
- **Context de tema:** `frontend/src/contexts/ThemeContext.tsx`

---

## ✅ Checklist de Implementación

```
✅ Crear componente Logo.tsx
✅ Importar en PublicHeader.tsx
✅ Importar en PublicFooter.tsx
✅ Agregar preload en index.html
✅ Configurar favicon
✅ Agregar animaciones CSS
✅ Probar en diferentes tamaños de pantalla
✅ Verificar cambio de tema
✅ Optimizar performance
✅ Documentar uso
```

---

**Última actualización:** Octubre 2025  
**Versión:** 1.0  
**Autor:** Scuti Company Development Team

---

¿Necesitas más ejemplos o tienes alguna pregunta? Consulta el código fuente o contacta al equipo de desarrollo. 🚀
