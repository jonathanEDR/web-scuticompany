# 🗺️ Mapeo Correcto de Imágenes

## 📋 Estructura de Archivos en `/public/`

```
/public/
├── 1.webp          ← Hero Section (tema OSCURO)
├── 2.webp          ← Solutions Section (tema OSCURO)
├── 9.webp          ← Hero Section (tema CLARO)
├── 10.webp         ← Solutions Section (tema CLARO)
├── ICONOS/
│   ├── ICONO 1 FONDO BLANCO.png
│   ├── ICONO 1 FONDO NEGRO.png
│   ├── ICONO 2 FONDO BLANCO.png
│   ├── ICONO 2 FONDO NEGRO.png
│   ├── ICONO 3 FONDO BLANCO.png
│   └── ICONO 3 FONDO NEGRO.png
└── logos/
    ├── logo-black.svg
    └── logo-white.svg
```

---

## 🎨 Mapeo de Imágenes por Sección

### 🏠 Hero Section (Primera sección - Detrás del título principal)

| Tema | Archivo | Ruta |
|------|---------|------|
| **Oscuro/Negro** | `1.webp` | `/1.webp` |
| **Claro/Blanco** | `9.webp` | `/9.webp` |

**Configuración en código:**
```typescript
backgroundImage: {
  dark: '/1.webp',    // Tema oscuro
  light: '/9.webp'    // Tema claro
}
```

---

### 🔧 Solutions Section (Segunda sección)

| Tema | Archivo | Ruta |
|------|---------|------|
| **Oscuro/Negro** | `2.webp` | `/2.webp` |
| **Claro/Blanco** | `10.webp` | `/10.webp` |

**Configuración en código:**
```typescript
backgroundImage: {
  dark: '/2.webp',     // Tema oscuro
  light: '/10.webp'    // Tema claro
}
```

---

## ✅ Archivos Actualizados

### 1. `/src/utils/defaultConfig.ts`
```typescript
export const getHeroBackgroundImages = (): DefaultImageConfig => ({
  light: '/9.webp',    // Imagen 9 para tema claro
  dark: '/1.webp'      // Imagen 1 para tema oscuro
});

export const getSolutionsBackgroundImages = (): DefaultImageConfig => ({
  light: '/10.webp',   // Imagen 10 para tema claro
  dark: '/2.webp'      // Imagen 2 para tema oscuro
});
```

### 2. `/src/utils/imageMapper.ts`
```typescript
export const IMAGE_MAPPINGS: ImageMapping[] = [
  {
    id: 1,
    light: '/9.webp',    // Tema claro
    dark: '/1.webp',     // Tema oscuro
    section: 'hero',
    description: 'Hero Section (1=oscuro, 9=claro)'
  },
  {
    id: 2,
    light: '/10.webp',   // Tema claro
    dark: '/2.webp',     // Tema oscuro
    section: 'solutions',
    description: 'Solutions Section (2=oscuro, 10=claro)'
  }
];
```

### 3. `/src/pages/public/Home.tsx`
```typescript
const DEFAULT_PAGE_DATA: PageData = {
  content: {
    hero: {
      backgroundImage: {
        light: '/9.webp',   // Tema claro
        dark: '/1.webp'     // Tema oscuro
      }
    },
    solutions: {
      backgroundImage: {
        light: '/10.webp',  // Tema claro
        dark: '/2.webp'     // Tema oscuro
      }
    }
  }
};
```

---

## 🎯 Lógica de Selección

### Cómo funciona en `HeroSection.tsx`:

```typescript
const getCurrentBackgroundImage = () => {
  const backgroundImageData = heroData.backgroundImage;
  
  // Si el tema actual es 'light', usa light (9.webp)
  if (currentTheme === 'light') {
    return backgroundImageData.light;  // '/9.webp'
  } 
  // Si el tema actual es 'dark', usa dark (1.webp)
  else {
    return backgroundImageData.dark;   // '/1.webp'
  }
};
```

---

## 📊 Tabla Resumen

| Sección | Tema Oscuro | Tema Claro |
|---------|-------------|------------|
| **Hero Section** | `1.webp` | `9.webp` |
| **Solutions Section** | `2.webp` | `10.webp` |

---

## 🚀 Para Probar

1. **Tema Oscuro activo:**
   - Hero debe mostrar: `1.webp`
   - Solutions debe mostrar: `2.webp`

2. **Tema Claro activo:**
   - Hero debe mostrar: `9.webp`
   - Solutions debe mostrar: `10.webp`

3. **Cambiar entre temas:**
   - Click en el botón de tema (sol/luna)
   - Las imágenes deben cambiar automáticamente

---

## 🔍 Verificación en DevTools

Abrir consola del navegador y buscar:
```
🖼️ HeroSection Debug: {
  backgroundImageData: {light: '/9.webp', dark: '/1.webp'},
  currentTheme: 'dark',
  heroData: 'Transformamos tu empresa...'
}
🎨 Imagen seleccionada: {theme: 'dark', image: '/1.webp'}
```

---

**Última actualización:** 18 de Octubre, 2025  
**Estado:** ✅ Mapeo corregido - 1 y 9 para Hero, 2 y 10 para Solutions