/**
 * 🔄 Script para forzar refresh de la página pública desde el CMS
 * 
 * Ejecutar en consola del CMS después de guardar cambios
 */

console.log('🔄 Forzando refresh de la página pública...');

// Disparar evento personalizado
window.dispatchEvent(new CustomEvent('cmsUpdate', {
  detail: {
    timestamp: new Date().toISOString(),
    section: 'valueAdded',
    forced: true
  }
}));

console.log('✅ Evento cmsUpdate disparado');

// También forzar reload del localStorage si existe
if (window.localStorage) {
  const cacheKeys = Object.keys(localStorage).filter(key => 
    key.includes('cms') || key.includes('page') || key.includes('content')
  );
  
  cacheKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`🗑️ Cache eliminado: ${key}`);
  });
}

console.log('✅ Cache limpiado. La página pública se actualizará automáticamente.');