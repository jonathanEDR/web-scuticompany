// Componente temporal para debugging de variables CSS
import { useEffect, useState } from 'react';

export const CSSVariablesDebug = () => {
  const [cssVars, setCssVars] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const updateVars = () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      
      setCssVars({
        // CTA Button
        'cta-bg': computedStyle.getPropertyValue('--color-cta-bg').trim(),
        'cta-text': computedStyle.getPropertyValue('--color-cta-text').trim(),
        'cta-hover': computedStyle.getPropertyValue('--color-cta-hover-bg').trim(),
        
        // Contact Button
        'contact-border': computedStyle.getPropertyValue('--color-contact-border').trim(),
        'contact-text': computedStyle.getPropertyValue('--color-contact-text').trim(),
        'contact-hover': computedStyle.getPropertyValue('--color-contact-hover-bg').trim(),
        
        // Dashboard Button
        'dashboard-bg': computedStyle.getPropertyValue('--color-dashboard-bg').trim(),
        'dashboard-text': computedStyle.getPropertyValue('--color-dashboard-text').trim(),
        'dashboard-hover': computedStyle.getPropertyValue('--color-dashboard-hover-bg').trim(),
      });
    };

    updateVars();
    // Actualizar cada 500ms para capturar cambios
    const interval = setInterval(updateVars, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-20 right-4 bg-black/90 text-white p-4 rounded-lg shadow-2xl z-50 max-w-md text-xs font-mono max-h-[calc(100vh-100px)] overflow-y-auto">
      <h3 className="text-sm font-bold mb-3 text-cyan-400">🔍 CSS Variables Debug</h3>
      
      <div className="space-y-3">
        <div className="border-l-2 border-purple-500 pl-2">
          <div className="text-purple-400 font-semibold">🚀 CTA Button</div>
          <div className="pl-2 space-y-1">
            <div><span className="text-gray-400">bg:</span> {cssVars['cta-bg'] || '❌ No definida'}</div>
            <div><span className="text-gray-400">text:</span> {cssVars['cta-text'] || '❌ No definida'}</div>
            <div><span className="text-gray-400">hover:</span> {cssVars['cta-hover'] || '❌ No definida'}</div>
          </div>
        </div>

        <div className="border-l-2 border-cyan-500 pl-2">
          <div className="text-cyan-400 font-semibold">📞 Contact Button</div>
          <div className="pl-2 space-y-1">
            <div><span className="text-gray-400">border:</span> {cssVars['contact-border'] || '❌ No definida'}</div>
            <div><span className="text-gray-400">text:</span> {cssVars['contact-text'] || '❌ No definida'}</div>
            <div><span className="text-gray-400">hover:</span> {cssVars['contact-hover'] || '❌ No definida'}</div>
          </div>
        </div>

        <div className="border-l-2 border-blue-500 pl-2">
          <div className="text-blue-400 font-semibold">🎯 Dashboard Button</div>
          <div className="pl-2 space-y-1">
            <div><span className="text-gray-400">bg:</span> {cssVars['dashboard-bg'] || '❌ No definida'}</div>
            <div><span className="text-gray-400">text:</span> {cssVars['dashboard-text'] || '❌ No definida'}</div>
            <div><span className="text-gray-400">hover:</span> {cssVars['dashboard-hover'] || '❌ No definida'}</div>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-400">
        💡 Actualización automática cada 500ms
      </div>
    </div>
  );
};

export default CSSVariablesDebug;
