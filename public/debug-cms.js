// Script temporal para limpiar logs y debuggear el problema del CMS
console.clear();
console.log('🧪 [DEBUG SCRIPT] Iniciado - Limpiando consola para ver logs del CMS');

// Interceptar y filtrar logs para ver solo los importantes
const originalLog = console.log;
const originalWarn = console.warn;

console.log = function(...args) {
  const message = args.join(' ');
  
  // Solo mostrar logs relacionados con nuestro debug
  if (
    message.includes('[CARGA INICIAL]') ||
    message.includes('[ACTUALIZACIÓN]') ||
    message.includes('[CAMBIO LOCAL]') ||
    message.includes('[GUARDADO') ||
    message.includes('[ERROR') ||
    message.includes('ValueAdded') ||
    message.includes('💾') ||
    message.includes('📥') ||
    message.includes('🔄') ||
    message.includes('✏️') ||
    message.includes('⚠️') ||
    message.includes('✅') ||
    message.includes('❌')
  ) {
    originalLog.apply(console, args);
  }
};

// Filtrar warnings que no nos interesan
console.warn = function(...args) {
  const message = args.join(' ');
  
  // Solo mostrar warnings importantes
  if (
    !message.includes('React DevTools') &&
    !message.includes('Clerk has been loaded') &&
    !message.includes('development keys')
  ) {
    originalWarn.apply(console, args);
  }
};

console.log('✅ [DEBUG SCRIPT] Filtros de logs activados - Ahora solo verás logs importantes del CMS');