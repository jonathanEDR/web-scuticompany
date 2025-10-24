import React, { useState } from 'react';
import ManagedImageSelector from '../ManagedImageSelector';
import type { PageData, SocialLink } from '../../types/cms';

interface ContactConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
}

const ContactConfigSection: React.FC<ContactConfigSectionProps> = ({
  pageData,
  updateContent
}) => {
  const [newSocialLink, setNewSocialLink] = useState<SocialLink>({
    name: '',
    url: '',
    icon: '',
    enabled: true
  });
  const [testingIcons, setTestingIcons] = useState(false);
  const [iconTestResults, setIconTestResults] = useState<{[key: string]: 'loading' | 'success' | 'error'}>({});

  const socialLinks = pageData.content.contact?.socialLinks || [];

  // 🔥 NUEVA FUNCIÓN: Probar si los iconos se pueden cargar
  const testAllIcons = async () => {
    setTestingIcons(true);
    setIconTestResults({});
    
    const results: {[key: string]: 'loading' | 'success' | 'error'} = {};
    
    for (const link of socialLinks) {
      if (link.icon) {
        results[link.name] = 'loading';
        setIconTestResults({...results});
        
        try {
          const response = await fetch(link.icon, { method: 'HEAD' });
          results[link.name] = response.ok ? 'success' : 'error';
        } catch (error) {
          results[link.name] = 'error';
        }
        
        setIconTestResults({...results});
      }
    }
    
    setTestingIcons(false);
  };

  const addSocialLink = () => {
    if (newSocialLink.name && newSocialLink.url) {
      const updatedLinks = [...socialLinks, { ...newSocialLink }];
      updateContent('contact.socialLinks', updatedLinks);
      setNewSocialLink({ name: '', url: '', icon: '', enabled: true });
    }
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: any) => {
    const updatedLinks = socialLinks.map((link: SocialLink, i: number) => 
      i === index ? { ...link, [field]: value } : link
    );
    updateContent('contact.socialLinks', updatedLinks);
  };

  const removeSocialLink = (index: number) => {
    const updatedLinks = socialLinks.filter((_: SocialLink, i: number) => i !== index);
    updateContent('contact.socialLinks', updatedLinks);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
        📞 Configuración de Contacto
      </h2>
      
      <div className="space-y-6">
        {/* Información de Contacto Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Número de Teléfono
            </label>
            <input
              type="text"
              value={pageData.content.contact?.phone || ''}
              onChange={(e) => updateContent('contact.phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="+51 973 397 306"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={pageData.content.contact?.email || ''}
              onChange={(e) => updateContent('contact.email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="corpocomunicados@gmail.com"
            />
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            🌐 Redes Sociales
          </h4>
          
          {/* Lista de redes sociales existentes - ahora en grid compacto */}
          <div className="mb-6">
            {socialLinks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {socialLinks.map((link: SocialLink, index: number) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600 flex flex-col items-center justify-between">
                    {/* Icono compacto arriba */}
                    <div className="mb-2 flex flex-col items-center w-full">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Icono
                      </label>
                      <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-800 rounded border">
                        {link.icon ? (
                          <img 
                            src={link.icon} 
                            alt={`Icono ${link.name}`}
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <span className="text-gray-400 text-2xl">?</span>
                        )}
                      </div>
                      <ManagedImageSelector
                        currentImage={link.icon}
                        onImageSelect={(newImage: string) => updateSocialLink(index, 'icon', newImage)}
                        label="Seleccionar icono para red social"
                        hideButtonArea={!!link.icon}
                      />
                    </div>
                    {/* Info básica */}
                    <div className="w-full mt-2">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={link.name}
                        onChange={(e) => updateSocialLink(index, 'name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs"
                        placeholder="facebook, instagram, twitter..."
                      />
                    </div>
                    <div className="w-full mt-2">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                        URL
                      </label>
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs"
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    {/* 🔥 NUEVO: Mostrar URL del icono para debugging */}
                    {link.icon && (
                      <div className="w-full mt-2">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                          URL del Icono
                        </label>
                        <div className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs break-all text-gray-600 dark:text-gray-400">
                          {link.icon}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between w-full mt-2">
                      <label className="flex items-center text-xs">
                        <input
                          type="checkbox"
                          checked={link.enabled}
                          onChange={(e) => updateSocialLink(index, 'enabled', e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-200">Activo</span>
                      </label>
                      <button
                        onClick={() => removeSocialLink(index)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  No hay redes sociales configuradas
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Agrega una nueva red social para empezar
                </p>
              </div>
            )}
          </div>
          
          {/* Agregar nueva red social */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h5 className="text-md font-medium text-blue-800 dark:text-blue-200 mb-3 flex items-center">
              ➕ Agregar Nueva Red Social
            </h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={newSocialLink.name}
                  onChange={(e) => setNewSocialLink(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                  placeholder="linkedin, tiktok, youtube..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={newSocialLink.url}
                  onChange={(e) => setNewSocialLink(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                  placeholder="https://..."
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={addSocialLink}
                  disabled={!newSocialLink.name || !newSocialLink.url}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  Agregar
                </button>
              </div>
            </div>
            
            {/* Selector de icono para nueva red social */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Icono (Opcional)
              </label>
              <ManagedImageSelector
                currentImage={newSocialLink.icon}
                onImageSelect={(newImage: string) => setNewSocialLink(prev => ({ ...prev, icon: newImage }))}
                label="Seleccionar icono"
                hideButtonArea={!!newSocialLink.icon}
              />
              {newSocialLink.icon && (
                <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border">
                  <img 
                    src={newSocialLink.icon} 
                    alt="Preview del icono"
                    className="w-8 h-8 object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Información de estado */}
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <h3 className="font-semibold text-green-800 dark:text-green-200">Estado del Sistema</h3>
            </div>
            {/* 🔥 NUEVO: Botón para probar iconos */}
            <button
              onClick={testAllIcons}
              disabled={testingIcons || socialLinks.length === 0}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md text-sm transition-colors flex items-center gap-2"
            >
              {testingIcons ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  Probando...
                </>
              ) : (
                <>🧪 Probar Iconos</>
              )}
            </button>
          </div>
          <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
            <p>✅ Redes sociales configuradas: {socialLinks.length}</p>
            <p>✅ Redes sociales activas: {socialLinks.filter(link => link.enabled).length}</p>
            <p>✅ Footer actualizado automáticamente</p>
            {/* 🔥 NUEVO: Mostrar resultados de pruebas de iconos */}
            {Object.keys(iconTestResults).length > 0 && (
              <div className="mt-3 pt-3 border-t border-green-300 dark:border-green-700">
                <p className="font-semibold mb-2">Resultados de prueba de iconos:</p>
                {socialLinks.map((link) => {
                  const status = iconTestResults[link.name];
                  if (!status || !link.icon) return null;
                  return (
                    <div key={link.name} className="flex items-center gap-2 text-xs">
                      {status === 'loading' && <span>⏳</span>}
                      {status === 'success' && <span>✅</span>}
                      {status === 'error' && <span>❌</span>}
                      <span>{link.name}</span>
                      {status === 'error' && <span className="text-red-600">(Error al cargar)</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactConfigSection;