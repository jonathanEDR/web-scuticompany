# 📦 Estrategia de Caché - Web SCUTI

## 🎯 Filosofía

**Separar contenido estático de contenido dinámico** para optimizar performance sin sacrificar actualización de datos.

---

## ⏱️ Duraciones de Caché Configuradas

### 🌐 Páginas Públicas (Contenido Estático)
**Característica:** Raramente cambian, alto tráfico de visitantes

| Tipo | Duración | Razón |
|------|----------|-------|
| **Home, About, Contact** | 8 horas | Contenido institucional que cambia semanalmente |
| **Footer** | 8 horas | Datos de contacto estables |
| **Servicios** | 4 horas | Catálogo de servicios semi-estático |
| **Blog Posts** | 2 horas | Contenido publicado que no cambia frecuentemente |

### 📊 Contenido Semi-Dinámico
**Característica:** Actualiza ocasionalmente

| Tipo | Duración | Razón |
|------|----------|-------|
| **Listados de Blog** | 1 hora | Nuevos posts aparecen ocasionalmente |
| **Búsqueda** | 30 minutos | Resultados cambian al agregar contenido |
| **Categorías** | 6 horas | Estructura raramente cambia |
| **Estadísticas** | 2 horas | Métricas actualizadas periódicamente |

### 🔐 Módulo Administrativo (Contenido Dinámico)
**Característica:** Cambia frecuentemente, bajo tráfico

| Tipo | Duración | Razón |
|------|----------|-------|
| **Datos Admin** | 2 minutos | Operaciones CRUD constantes |
| **Comentarios** | 5 minutos | Interacción en tiempo casi real |
| **Real-time Data** | 0 (sin cache) | Datos críticos actualizados |

---

## 🏗️ Arquitectura de Caché

```
┌─────────────────────────────────────────────────┐
│  Usuario solicita página                       │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
      ┌──────────────────────┐
      │ 1️⃣ localStorage      │
      │ (persiste recargas)   │
      └──────────┬────────────┘
                 │
         ┌───────┴───────┐
         │   ¿Válido?    │
         └───┬───────┬───┘
         Sí  │       │ No
             ▼       ▼
        ✅ Return  ┌──────────────────────┐
                   │ 2️⃣ RequestCache      │
                   │ (memoria rápida)     │
                   └──────────┬───────────┘
                              │
                      ┌───────┴───────┐
                      │   ¿Válido?    │
                      └───┬───────┬───┘
                      Sí  │       │ No
                          ▼       ▼
                     ✅ Return  ┌──────────────────────┐
                                │ 3️⃣ API Request       │
                                │ (backend)            │
                                └──────────┬───────────┘
                                           │
                                           ▼
                              ┌────────────────────────┐
                              │ Guardar en ambos cache │
                              │ + localStorage         │
                              └────────────────────────┘
                                           │
                                           ▼
                                      ✅ Return
```

---

## 📍 Ubicación de Configuraciones

### 1. **cmsApi.ts** - Páginas públicas principales
```typescript
const CACHE_DURATIONS = {
  PUBLIC_PAGES: 8 * 60 * 60 * 1000,      // 8 horas
  PUBLIC_FOOTER: 8 * 60 * 60 * 1000,     // 8 horas
  ADMIN_DATA: 2 * 60 * 1000,             // 2 minutos
};
```

### 2. **blogCache.ts** - Blog público
```typescript
const CACHE_TTL = {
  POST_DETAIL: 2 * 60 * 60 * 1000,       // 2 horas
  POST_LIST: 1 * 60 * 60 * 1000,         // 1 hora
  CATEGORIES: 6 * 60 * 60 * 1000,        // 6 horas
  COMMENTS: 5 * 60 * 1000,               // 5 minutos
};
```

### 3. **serviciosCache.ts** - Servicios públicos
```typescript
const CACHE_TTL = {
  SERVICE_DETAIL: 4 * 60 * 60 * 1000,    // 4 horas
  SERVICE_LIST: 4 * 60 * 60 * 1000,      // 4 horas
  CATEGORIES: 8 * 60 * 60 * 1000,        // 8 horas
};
```

### 4. **PublicFooter.tsx** - Footer global
```typescript
const CACHE_DURATION = 8 * 60 * 60 * 1000; // 8 horas
```

---

## 🔄 Invalidación de Caché

### Automática
- **Expiración por TTL**: Cache se invalida automáticamente al cumplir el tiempo
- **React.StrictMode**: localStorage persiste entre remontajes ✅

### Manual (desde Admin)
```javascript
// Limpiar cache específico
window.dispatchEvent(new Event('clearCache'));

// O desde consola del navegador
localStorage.clear(); // Limpia todo
localStorage.removeItem('cmsCache_page-home'); // Limpia página específica
```

### Mediante CMS
Cuando se actualiza contenido desde el panel admin, el backend puede:
```javascript
// En el controlador después de UPDATE
io.emit('cms:updated', { page: 'home' });
```

---

## 📈 Beneficios Esperados

### ✅ Performance
- **Reducción 90%+ en requests** para usuarios recurrentes
- **Carga instantánea** de páginas públicas
- **Menor consumo de ancho de banda**

### ✅ Experiencia de Usuario
- **Sin delays** en navegación
- **Funciona offline** (datos en localStorage)
- **Consistente** entre recargas de página

### ✅ Infraestructura
- **Menor carga en servidor** backend
- **Menos queries a MongoDB**
- **Escalabilidad** para mayor tráfico

---

## 🔧 Ajustes Futuros

Si necesitas cambiar duraciones:

1. **Contenido cambia más frecuente** → Reducir TTL
2. **Contenido más estático** → Aumentar TTL
3. **Problemas de memoria** → Reducir TTL o implementar LRU

### Límites recomendados:
- **localStorage**: Máximo ~5MB por dominio
- **Páginas públicas**: No exceder 24 horas (1 día)
- **Datos admin**: Mínimo 1 minuto

---

## 📝 Notas Técnicas

### localStorage vs sessionStorage
- ✅ **localStorage**: Persiste entre sesiones (seleccionado)
- ❌ **sessionStorage**: Se borra al cerrar pestaña

### React.StrictMode
- En desarrollo causa double-render (mount/unmount)
- localStorage NO se afecta ✅
- RequestCache (Map) SÍ se borra ❌ (por eso localStorage es primario)

### Compatibilidad
- localStorage: IE 8+, todos los navegadores modernos
- Fallback a RequestCache si localStorage no disponible

---

## 🚀 Estado Actual

✅ **Implementado y funcionando**
- Home: 8 horas
- Footer: 8 horas  
- Blog: 1-2 horas
- Servicios: 4-6 horas

🔍 **Monitoreando**
- Tamaño de localStorage
- Hit rate de cache
- Feedback de usuarios sobre actualización de contenido
