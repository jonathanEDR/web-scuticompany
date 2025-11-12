# 📋 Patrones de Implementación Consistentes

Guía completa para implementar nuevas secciones públicas con SEO, cache y manejo de errores consistente.

## 🎯 Objetivo

Establecer patrones standarizados para todas las páginas públicas para:
- ✅ Evitar errores de TypeScript
- ✅ Mantener SEO consistente
- ✅ Implementar cache eficiente
- ✅ Silenciar errores innecesarios en producción
- ✅ Proporcionar fallbacks cuando fallan las APIs

---

## 📝 Patrón Base para Páginas Públicas

### 1. Estructura de Componente

```tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import { useSeo } from '../../hooks/useSeo';

export const MyPage: React.FC = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🎯 SEO dinámico con fallbacks
  const { SeoHelmet } = useSeo({
    pageName: 'my-page-slug', // Debe coincidir con el slug en CMS
    fallbackTitle: 'Mi Página - SCUTI Company',
    fallbackDescription: 'Descripción alternativa si CMS no tiene datos'
  });

  // Cargar datos necesarios
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Cargar datos desde API
        setData(/* datos */);
      } catch (err) {
        // Solo loguear en desarrollo
        if (import.meta.env.DEV) {
          console.error('Error cargando datos:', err);
        }
        setError('Error cargando contenido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <PublicHeader />
        {/* Skeleton o loading estado */}
        <PublicFooter />
      </div>
    );
  }

  // Estado de error
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <PublicHeader />
        <div className="pt-20 pb-20">
          <div className="max-w-7xl mx-auto px-4">
            <h1>Error cargando contenido</h1>
            <p>{error || 'Contenido no disponible'}</p>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  // Contenido principal
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 🎯 SEO Helmet SOLO aquí, una sola vez */}
      <SeoHelmet />
      
      <PublicHeader />
      
      {/* Contenido */}
      <main className="py-20">
        {/* ... contenido ... */}
      </main>
      
      <PublicFooter />
    </div>
  );
};

export default MyPage;
```

---

## 🎨 Reglas Clave

### ✅ HACER

1. **SeoHelmet Una Sola Vez**
   - Colocar `<SeoHelmet />` al inicio del componente principal de retorno
   - NUNCA repetirlo en estados de loading/error
   - Solo se necesita una vez

2. **Silenciar Errores en Producción**
   ```tsx
   if (import.meta.env.DEV) {
     console.error('Detalles del error...');
   }
   ```

3. **Usar Fallbacks del useSeo**
   - El hook useSeo maneja automáticamente:
     - CMS pages → Intenta cargar desde API
     - Dashboard pages → Usa solo fallbacks
     - Si falla → Usa fallbacks sin errores visibles

4. **Nombres Consistentes**
   - pageName debe coincidir exactamente con el slug CMS
   - Ejemplos: `'home'`, `'about'`, `'services'`, `'contact'`

5. **Manejo de Variables No Utilizadas**
   - Remover variables destructuradas que no se usan
   - TypeScript evitará compilación si hay variables sin usar

### ❌ NO HACER

1. ❌ Múltiples `<SeoHelmet />` en el mismo componente
2. ❌ Loguear errores en consola en producción
3. ❌ Dejar variables sin usar (generará error TS6133)
4. ❌ Usar `console.log` excesivamente en hooks de ciclo de vida
5. ❌ Olvidar el try-catch en llamadas a API

---

## 🔄 Hook useSeo - Comportamiento Automático

### Para Páginas CMS (home, about, services, contact):
```
1. Intenta cargar datos desde API (/cms/pages/:slug)
2. Si falla → Usa datos en caché expirados (RequestCache)
3. Si falla → Usa datos en localStorage expirado
4. Si falla → Usa fallbacks sin mostrar error
```

### Para Páginas Dashboard (dashboard, cms, profile, etc):
```
1. Usa solo fallbacks (sin hacer API call)
2. Registra listeners para actualizaciones CMS
3. Sin errores de API
```

---

## 📦 Importes Estándar

```tsx
// Componentes comunes
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// Componentes del proyecto
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import ContactModal from '../../components/public/ContactModal';

// Hooks
import { useSeo } from '../../hooks/useSeo';
import { useServicioDetail } from '../../hooks/useServiciosCache';

// Tipos
import type { Servicio } from '../../types/servicios';
```

---

## 🎯 Implementación Paso a Paso

### Paso 1: Crear Componente Base
```tsx
export const MySection: React.FC = () => {
  const { SeoHelmet } = useSeo({
    pageName: 'my-section',
    fallbackTitle: 'Mi Sección',
    fallbackDescription: 'Descripción'
  });

  return (
    <>
      <SeoHelmet />
      {/* contenido */}
    </>
  );
};
```

### Paso 2: Agregar Manejo de Estados
```tsx
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// Retornar diferentes JSX según estado
if (loading) return <LoadingUI />;
if (error) return <ErrorUI />;
return <ContentUI />;
```

### Paso 3: Implementar Cache (Opcional)
```tsx
// Usar hooks de cache disponibles:
// - useServiciosCache para servicios
// - useCategoriasCacheadas para categorías
// - Etc.
```

### Paso 4: Versión de Producción
- Variables de entorno están configuradas en `.env.production`
- Logs se silencian automáticamente
- Cache funciona sin API calls fallidas

---

## 🐛 Checklist de Errores Comunes

- [ ] ¿Hay múltiples `<SeoHelmet />`?
- [ ] ¿Hay variables sin usar? (TS6133)
- [ ] ¿Faltan try-catch en APIs?
- [ ] ¿Se loguean errores en producción?
- [ ] ¿El pageName coincide con el slug CMS?
- [ ] ¿Se importan todos los tipos necesarios?
- [ ] ¿El componente está registrado en las rutas?

---

## 📚 Ejemplo Real: ServicioDetail

Ver: `src/pages/public/ServicioDetail.tsx`

Implementa correctamente:
- ✅ useSeo con fallbacks
- ✅ Manejo de estados (loading/error/success)
- ✅ SeoHelmet una sola vez
- ✅ Silenciamiento de logs
- ✅ Sin variables sin usar

---

## 🔗 Referencias

- [Documentación useSeo](../../hooks/useSeo.tsx)
- [Servicios CMS API](../../services/cmsApi.ts)
- [Hooks de Cache](../../hooks/)
- [Variables de Entorno](./.env.example)

---

## 📝 Nota Importante

Este documento debe consultarse antes de implementar cualquier nueva sección pública.
Si encuentras un patrón diferente en algún componente, actualízalo para que sea consistente.
