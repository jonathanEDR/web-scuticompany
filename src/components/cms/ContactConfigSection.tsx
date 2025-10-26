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
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 border border-gray-100 dark:border-gray-700/50">
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
        📞 Configuración de Contacto
      </h2>
      
      <div className="space-y-4">
        {/* Información de Contacto Básica */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                📞 Número de Teléfono
              </label>
              <input
                type="text"
                value={pageData.content.contact?.phone || ''}
                onChange={(e) => updateContent('contact.phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="+51 973 397 306"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                📧 Correo Electrónico
              </label>
              <input
                type="email"
                value={pageData.content.contact?.email || ''}
                onChange={(e) => updateContent('contact.email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="gscutic@gmail.com"
              />
            </div>
          </div>

          {/* 🆕 Descripción de la empresa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              📖 Descripción de la Empresa
            </label>
            <textarea
              rows={2}
              value={pageData.content.contact?.description || ''}
              onChange={(e) => updateContent('contact.description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Empresa líder en desarrollo de software en Perú. Creamos soluciones digitales..."
            />
          </div>

          {/* 🆕 Ubicación - Layout más compacto */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                📍 Dirección
              </label>
              <input
                type="text"
                value={pageData.content.contact?.address || ''}
                onChange={(e) => updateContent('contact.address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Av. Principal 123"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                🏙️ Ciudad
              </label>
              <input
                type="text"
                value={pageData.content.contact?.city || ''}
                onChange={(e) => updateContent('contact.city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Lima"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                🌎 País
              </label>
              <input
                type="text"
                value={pageData.content.contact?.country || ''}
                onChange={(e) => updateContent('contact.country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Perú"
              />
            </div>
          </div>

          {/* 🆕 Horario de atención */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              🕒 Horario de Atención
            </label>
            <input
              type="text"
              value={pageData.content.contact?.businessHours || ''}
              onChange={(e) => updateContent('contact.businessHours', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Lunes a Viernes: 9:00 AM - 6:00 PM"
            />
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
          <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-3">
            🌐 Redes Sociales
          </h4>
          
          {/* Diseño horizontal: Redes sociales existentes + Agregar nueva */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Columna de redes sociales existentes (2/3 del espacio) */}
            <div className="lg:col-span-2">
              {socialLinks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                  {socialLinks.map((link: SocialLink, index: number) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600 flex flex-col items-center hover:shadow-md transition-shadow">
                      {/* Icono con lógica inteligente */}
                      <div className="relative group mb-2">
                        <div className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 shadow-sm">
                          {link.icon ? (
                            <img 
                              src={link.icon} 
                              alt={`Icono ${link.name}`}
                              className="w-6 h-6 object-contain"
                            />
                          ) : (
                            <span className="text-gray-400 text-lg">📷</span>
                          )}
                        </div>
                        
                        {/* Overlay para cambiar imagen SOLO si HAY imagen */}
                        {link.icon && (
                          <div className="absolute inset-0 bg-black bg-opacity-70 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="text-center">
                              <ManagedImageSelector
                                currentImage={link.icon}
                                onImageSelect={(newImage: string) => updateSocialLink(index, 'icon', newImage)}
                                label=""
                                hideButtonArea={true}
                              />
                              <div className="text-white text-xs font-medium mt-1 pointer-events-none">
                                Cambiar
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Botón de eliminar pequeño */}
                        <button
                          onClick={() => removeSocialLink(index)}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-xs flex items-center justify-center opacity-0 group-hover:opacity-100"
                          title="Eliminar red social"
                        >
                          ×
                        </button>
                      </div>
                      
                      {/* Botón cargar imagen SOLO si NO hay imagen */}
                      {!link.icon && (
                        <div className="mb-2">
                          <ManagedImageSelector
                            currentImage={link.icon}
                            onImageSelect={(newImage: string) => updateSocialLink(index, 'icon', newImage)}
                            label="📷 Cargar"
                            hideButtonArea={false}
                          />
                        </div>
                      )}
                      
                      {/* Nombre compacto */}
                      <input
                        type="text"
                        value={link.name}
                        onChange={(e) => updateSocialLink(index, 'name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm text-center font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="nombre"
                      />
                      
                      {/* URL compacta */}
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs mt-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://..."
                      />
                      
                      {/* Solo estado activo/inactivo */}
                      <div className="flex items-center justify-center w-full mt-2">
                        <label className="flex items-center text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={link.enabled}
                            onChange={(e) => updateSocialLink(index, 'enabled', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-700 dark:text-gray-200 text-sm font-medium">
                            {link.enabled ? '✅ Activo' : '❌ Inactivo'}
                          </span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No hay redes sociales configuradas
                  </p>
                </div>
              )}
            </div>
            
            {/* Columna de agregar nueva red social (1/3 del espacio) */}
            <div className="lg:col-span-1">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800 h-full">
                <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                  ➕ Agregar Nueva
                </h5>
                
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newSocialLink.name}
                    onChange={(e) => setNewSocialLink(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                    placeholder="Nombre (ej: linkedin)"
                  />
                  
                  <input
                    type="url"
                    value={newSocialLink.url}
                    onChange={(e) => setNewSocialLink(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                    placeholder="https://..."
                  />
                  
                  {/* Selector de icono inteligente */}
                  <div className="flex items-center justify-center mb-2">
                    <div className="relative group">
                      <div className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 shadow-sm">
                        {newSocialLink.icon ? (
                          <img 
                            src={newSocialLink.icon} 
                            alt="Preview del icono"
                            className="w-6 h-6 object-contain"
                          />
                        ) : (
                          <span className="text-gray-400 text-lg">📷</span>
                        )}
                      </div>
                      
                      {/* Hover overlay solo si HAY imagen */}
                      {newSocialLink.icon && (
                        <div className="absolute inset-0 bg-black bg-opacity-70 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="text-center">
                            <ManagedImageSelector
                              currentImage={newSocialLink.icon}
                              onImageSelect={(newImage: string) => setNewSocialLink(prev => ({ ...prev, icon: newImage }))}
                              label=""
                              hideButtonArea={true}
                            />
                            <div className="text-white text-xs font-medium pointer-events-none">
                              Cambiar
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Botón eliminar solo si hay imagen */}
                      {newSocialLink.icon && (
                        <button
                          onClick={() => setNewSocialLink(prev => ({ ...prev, icon: '' }))}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-xs flex items-center justify-center opacity-0 group-hover:opacity-100"
                          title="Quitar icono"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Botón selector solo si NO hay imagen */}
                  {!newSocialLink.icon && (
                    <div className="mb-2">
                      <ManagedImageSelector
                        currentImage={newSocialLink.icon}
                        onImageSelect={(newImage: string) => setNewSocialLink(prev => ({ ...prev, icon: newImage }))}
                        label="📷 Seleccionar Icono"
                        hideButtonArea={false}
                      />
                    </div>
                  )}
                  
                  <button
                    onClick={addSocialLink}
                    disabled={!newSocialLink.name || !newSocialLink.url}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    ➕ Agregar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default ContactConfigSection;