import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // ⚡ Optimización de CSS
    cssCodeSplit: true,
    // ⚡ Target moderno para mejor tree-shaking
    target: 'es2020',
    // ⚡ PERF: No inyectar modulepreload para chunks diferidos (editor, clerk)
    // Solo los chunks críticos se precargan automáticamente
    modulePreload: {
      resolveDependencies: (_filename: string, deps: string[]) => {
        // Filtrar chunks pesados que no son críticos para el render inicial
        return deps.filter(dep => 
          !dep.includes('editor') && 
          !dep.includes('clerk')
        );
      }
    },
    rollupOptions: {
      output: {
        // ⚡ Code splitting optimizado
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // ⚡ lucide-react PRIMERO (contiene "react" en nombre → evitar que caiga en react-core)
            if (id.includes('lucide-react')) return 'icons';
            // React core - carga crítica
            // Incluye: react, react-dom, react-router, react-helmet, @clerk/clerk-react, @tiptap/react
            // Todos deben estar juntos para evitar errores de inicialización circular
            if (id.includes('react') || id.includes('react-dom')) return 'react-core';
            // Clerk sin "react" en path (@clerk/types, @clerk/backend, etc.)
            if (id.includes('@clerk')) return 'clerk';
            // Editor TipTap - carga diferida (solo en /dashboard)
            if (id.includes('@tiptap') || id.includes('prosemirror')) return 'editor';
            // Utilidades
            if (id.includes('date-fns') || id.includes('lodash')) return 'utils';
          }
        },
        // ⚡ Nombres de archivo con hash para cache busting
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      }
    },
    chunkSizeWarningLimit: 500,
  },
  // ⚡ Optimización de dependencias
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
