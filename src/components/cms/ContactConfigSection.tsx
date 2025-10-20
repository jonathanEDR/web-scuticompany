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

  const socialLinks = pageData.content.contact?.socialLinks || [];

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
          
          {/* Lista de redes sociales existentes */}
          <div className="space-y-4 mb-6">
            {socialLinks.length > 0 ? (
              socialLinks.map((link: SocialLink, index: number) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={link.name}
                        onChange={(e) => updateSocialLink(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                        placeholder="facebook, instagram, twitter..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        URL
                      </label>
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={link.enabled}
                          onChange={(e) => updateSocialLink(index, 'enabled', e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">Activo</span>
                      </label>
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        onClick={() => removeSocialLink(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  
                  {/* Selector de Icono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Icono Personalizado
                    </label>
                    <ManagedImageSelector
                      currentImage={link.icon}
                      onImageSelect={(newImage: string) => updateSocialLink(index, 'icon', newImage)}
                      label="Seleccionar icono para red social"
                    />
                    {link.icon && (
                      <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border">
                        <img 
                          src={link.icon} 
                          alt={`Icono ${link.name}`}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
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
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <h3 className="font-semibold text-green-800 dark:text-green-200">Estado del Sistema</h3>
          </div>
          <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
            <p>✅ Redes sociales configuradas: {socialLinks.length}</p>
            <p>✅ Redes sociales activas: {socialLinks.filter(link => link.enabled).length}</p>
            <p>✅ Footer actualizado automáticamente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactConfigSection;