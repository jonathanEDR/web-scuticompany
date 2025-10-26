import React from 'react';
import CollapsibleSection from '../../ui/CollapsibleSection';
import GoogleMapsHelper from '../GoogleMapsHelper';
import { parseGoogleMapsLink } from '../../../utils/googleMapsUtils';
import type { ContactFormSectionProps } from '../types/ContactFormTypes';

interface MapSectionProps extends ContactFormSectionProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Sección de configuración del mapa Google Maps
 */
const MapSection: React.FC<MapSectionProps> = ({
  contactForm,
  updateContent,
  isOpen,
  onToggle
}) => {
  return (
    <CollapsibleSection
      title="Configuración del Mapa"
      icon="🗺️"
      isOpen={isOpen}
      onToggle={onToggle}
      badge="Avanzado"
    >
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
        <div className="space-y-4">
          {/* Habilitar/Deshabilitar mapa */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Mostrar Mapa de Ubicación
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Muestra un mapa interactivo junto al formulario
              </p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={contactForm.map?.enabled || false}
                onChange={(e) => updateContent('contactForm.map.enabled', e.target.checked)}
                className="sr-only"
              />
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                contactForm.map?.enabled
                  ? 'bg-green-600' 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  contactForm.map?.enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </div>
            </label>
          </div>

          {/* Configuraciones del mapa (solo si está habilitado) */}
          {contactForm.map?.enabled && (
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              
              {/* Enlace de Google Maps */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  🔗 Enlace de Google Maps
                </label>
                <div className="space-y-2">
                  <input
                    type="url"
                    value={contactForm.map?.googleMapsUrl || ''}
                    onChange={(e) => {
                      const url = e.target.value;
                      updateContent('contactForm.map.googleMapsUrl', url);
                      
                      // Extraer coordenadas automáticamente si el enlace es válido
                      if (url) {
                        const result = parseGoogleMapsLink(url);
                        if (result.isValid && result.coordinates) {
                          updateContent('contactForm.map.latitude', result.coordinates.latitude);
                          updateContent('contactForm.map.longitude', result.coordinates.longitude);
                          if (result.coordinates.companyName) {
                            updateContent('contactForm.map.companyName', result.coordinates.companyName);
                          }
                        }
                      }
                    }}
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="https://www.google.com/maps/place/Tu+Empresa/@-12.0464,-77.0428,17z"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Pega aquí el enlace de tu negocio desde Google Maps. Las coordenadas se extraerán automáticamente.
                  </p>
                </div>
                
                {/* Helper con guía paso a paso */}
                <GoogleMapsHelper 
                  onUrlChange={(url) => {
                    updateContent('contactForm.map.googleMapsUrl', url);
                    const result = parseGoogleMapsLink(url);
                    if (result.isValid && result.coordinates) {
                      updateContent('contactForm.map.latitude', result.coordinates.latitude);
                      updateContent('contactForm.map.longitude', result.coordinates.longitude);
                      if (result.coordinates.companyName) {
                        updateContent('contactForm.map.companyName', result.coordinates.companyName);
                      }
                    }
                  }}
                />
              </div>

              {/* Vista de coordenadas extraídas (solo lectura) */}
              {(contactForm.map?.latitude && contactForm.map?.longitude) && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                  <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2 flex items-center">
                    ✅ Coordenadas Detectadas
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-700 dark:text-green-300 font-medium">Latitud:</span>
                      <span className="ml-2 text-green-900 dark:text-green-100">{contactForm.map.latitude}</span>
                    </div>
                    <div>
                      <span className="text-green-700 dark:text-green-300 font-medium">Longitud:</span>
                      <span className="ml-2 text-green-900 dark:text-green-100">{contactForm.map.longitude}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Información de la ubicación */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Nombre de la Empresa
                  </label>
                  <input
                    type="text"
                    value={contactForm.map?.companyName || ''}
                    onChange={(e) => updateContent('contactForm.map.companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Nombre de tu empresa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={contactForm.map?.address || ''}
                    onChange={(e) => updateContent('contactForm.map.address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Dirección completa"
                  />
                </div>
              </div>

              {/* Resto de configuraciones del mapa vienen de MapConfigSection */}
              
              {/* Guía paso a paso */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-sm">
                <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-3 flex items-center">
                  📋 Cómo configurar tu mapa en 3 pasos:
                </h4>
                <div className="space-y-3 text-blue-700 dark:text-blue-300">
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                    <div>
                      <p className="font-medium">Busca tu negocio en Google Maps</p>
                      <p className="text-xs">Ve a maps.google.com y busca tu empresa</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                    <div>
                      <p className="font-medium">Copia el enlace de la ubicación</p>
                      <p className="text-xs">Haz clic en "Compartir" y copia el enlace</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                    <div>
                      <p className="font-medium">Pega el enlace aquí arriba</p>
                      <p className="text-xs">Las coordenadas se configurarán automáticamente</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default MapSection;