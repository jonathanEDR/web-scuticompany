# Guía de Despliegue en Vercel - Web Scuti Frontend

Esta guía te ayudará a desplegar exitosamente el frontend de Web Scuti en Vercel.

## Pre-requisitos

1. **Cuenta de Vercel**: Regístrate en [vercel.com](https://vercel.com)
2. **Backend desplegado**: Asegúrate de tener tu backend desplegado y la URL de la API disponible
3. **Clerk configurado**: Necesitas tu clave pública de Clerk (VITE_CLERK_PUBLISHABLE_KEY)

## Configuración Preparada

El proyecto ya está configurado con:
- ✅ `vercel.json` con configuración optimizada
- ✅ `vite.config.ts` con optimizaciones de build
- ✅ `.env.example` con variables de entorno necesarias
- ✅ `.gitignore` actualizado para proteger credenciales

## Pasos para Desplegar

### 1. Preparar Variables de Entorno

Las siguientes variables de entorno deben configurarse en Vercel:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
VITE_API_URL=https://tu-backend-api.com/api
```

### 2. Despliegue desde la CLI de Vercel

#### Instalación de Vercel CLI
```bash
npm i -g vercel
```

#### Login en Vercel
```bash
vercel login
```

#### Desplegar (desde el directorio frontend/)
```bash
# Primera vez (configuración interactiva)
vercel

# Para producción
vercel --prod
```

### 3. Despliegue desde GitHub (Recomendado)

#### Pasos:
1. Sube tu código a un repositorio de GitHub
2. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
3. Click en **"Add New Project"**
4. Importa tu repositorio de GitHub
5. Configura el proyecto:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. Agrega las variables de entorno en la sección **Environment Variables**:
   ```
   VITE_CLERK_PUBLISHABLE_KEY = pk_test_...
   VITE_API_URL = https://tu-backend-api.com/api
   ```

7. Click en **"Deploy"**

### 4. Configuración Post-Despliegue

#### Configurar Dominio Personalizado (Opcional)
1. Ve a **Settings** > **Domains** en tu proyecto de Vercel
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones de Vercel

#### Configurar Clerk para Producción
1. Ve a tu dashboard de Clerk
2. En **Paths** > **Allowed redirect URLs**, agrega:
   - `https://tu-dominio-vercel.vercel.app/*`
   - `https://tu-dominio-personalizado.com/*` (si aplica)
3. En **API Keys**, verifica que estés usando la clave correcta (producción vs desarrollo)

#### Verificar CORS en el Backend
Asegúrate de que tu backend permita peticiones desde tu dominio de Vercel:

```javascript
// backend/server.js
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://tu-dominio-vercel.vercel.app',
    'https://tu-dominio-personalizado.com'
  ],
  credentials: true
};
```

## Optimizaciones Incluidas

### vercel.json
- **Rewrites**: Configurado para SPA (todas las rutas redirigen a index.html)
- **Headers**: Cache optimizado para assets estáticos (1 año)

### vite.config.ts
- **Code Splitting**: Separación de vendors, Clerk y editor en chunks
- **Sourcemaps**: Deshabilitados en producción para reducir tamaño
- **Chunk Size**: Límite de advertencia en 1000kb

### Build Optimization
- React Compiler habilitado (babel-plugin-react-compiler)
- Tree shaking automático
- Minificación de CSS y JS
- Optimización de imágenes

## Monitoreo y Debugging

### Ver Logs en Vercel
1. Ve a tu proyecto en Vercel Dashboard
2. Click en **"Deployments"**
3. Selecciona el deployment
4. Click en **"View Function Logs"**

### Comandos Útiles
```bash
# Ver logs en tiempo real
vercel logs

# Listar deployments
vercel ls

# Ver información del proyecto
vercel inspect
```

## Solución de Problemas Comunes

### Error: "ERESOLVE could not resolve" (React 19 con react-helmet-async)
**Síntoma:** Error al instalar dependencias que dice "ERESOLVE could not resolve: react-helmet-async@2.0.5"

**Solución:** Ya está resuelto en `package.json` con overrides. Si persiste:
```json
"overrides": {
  "react-helmet-async": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  }
}
```

**Verificación:**
```bash
npm install
npm run build
```

### Error: "Build failed"
- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build en Vercel
- Asegúrate de que `npm run build` funcione localmente
- Verifica que los overrides de React estén configurados (ver arriba)

### Error: "API requests failing"
- Verifica que `VITE_API_URL` esté configurada correctamente
- Asegúrate de que el backend permita CORS desde tu dominio de Vercel
- Verifica que el backend esté activo y respondiendo

### Error: "Clerk authentication not working"
- Verifica que `VITE_CLERK_PUBLISHABLE_KEY` esté configurada
- Asegura que las URLs de redirect estén configuradas en Clerk
- Revisa que estés usando la clave correcta (dev vs prod)

### Rutas de React Router no funcionan (404)
- Ya está configurado en `vercel.json` con rewrites
- Si persiste, verifica que `vercel.json` esté en el root del proyecto

### Imágenes no cargan
- Si usas paths relativos, asegúrate de importarlas correctamente
- Para archivos en `/public`, usa paths absolutos (`/imagen.jpg`)
- Verifica que las imágenes estén en el directorio correcto antes del build

## Rollback a Versión Anterior

Si necesitas revertir a un deployment anterior:

```bash
# Via CLI
vercel rollback [deployment-url]

# Via Dashboard
# 1. Ve a Deployments
# 2. Encuentra el deployment exitoso anterior
# 3. Click en "..." > "Promote to Production"
```

## Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [Clerk Production Checklist](https://clerk.com/docs/deployments/production-checklist)

## Checklist Final

Antes de desplegar, verifica:

- [ ] Variables de entorno configuradas en Vercel
- [ ] Backend desplegado y URL disponible
- [ ] CORS configurado en el backend
- [ ] Clerk URLs de redirect configuradas
- [ ] `npm run build` funciona localmente sin errores
- [ ] TypeScript sin errores (`tsc -b`)
- [ ] No hay claves secretas en el código (usa `.env`)

## Contacto y Soporte

Si tienes problemas durante el despliegue, puedes:
1. Revisar los logs de Vercel
2. Consultar la documentación oficial
3. Verificar la configuración de Clerk y el backend
