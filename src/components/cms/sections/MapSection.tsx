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

              {/* Configuración de Diseño del Mapa */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-3">
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  🎨 Diseño y Tamaño
                </h4>

                {/* Tamaño del contenedor */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Tamaño
                    </label>
                    <select
                      value={contactForm.map?.containerSize || 'medium'}
                      onChange={(e) => updateContent('contactForm.map.containerSize', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs"
                    >
                      <option value="small">Pequeño</option>
                      <option value="medium">Mediano</option>
                      <option value="large">Grande</option>
                      <option value="xl">Extra Grande</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Proporción
                    </label>
                    <select
                      value={contactForm.map?.aspectRatio || 'landscape'}
                      onChange={(e) => updateContent('contactForm.map.aspectRatio', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs"
                    >
                      <option value="square">Cuadrado</option>
                      <option value="landscape">Paisaje</option>
                      <option value="portrait">Retrato</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>

                {/* Altura personalizada si es custom */}
                {contactForm.map?.aspectRatio === 'custom' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Altura Custom
                    </label>
                    <input
                      type="text"
                      value={contactForm.map?.height || '400px'}
                      onChange={(e) => updateContent('contactForm.map.height', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs"
                      placeholder="400px, 50vh, 300px"
                    />
                  </div>
                )}

                {/* Alineación */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Alineación
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { value: 'left', label: 'Izq', icon: '⬅️' },
                      { value: 'center', label: 'Centro', icon: '↔️' },
                      { value: 'right', label: 'Der', icon: '➡️' },
                      { value: 'full', label: 'Full', icon: '↕️' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateContent('contactForm.map.alignment', option.value)}
                        className={`px-2 py-1.5 text-xs font-medium rounded border transition-colors ${
                          (contactForm.map?.alignment || 'center') === option.value
                            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        <div className="text-sm">{option.icon}</div>
                        <div className="text-xs">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Efectos visuales */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Bordes
                    </label>
                    <select
                      value={contactForm.map?.borderRadius || '8px'}
                      onChange={(e) => updateContent('contactForm.map.borderRadius', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs"
                    >
                      <option value="0">Sin borde</option>
                      <option value="4px">Pequeño</option>
                      <option value="8px">Mediano</option>
                      <option value="12px">Grande</option>
                      <option value="16px">XL</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Sombra
                    </label>
                    <select
                      value={contactForm.map?.shadow || 'medium'}
                      onChange={(e) => updateContent('contactForm.map.shadow', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs"
                    >
                      <option value="none">Sin sombra</option>
                      <option value="small">Pequeña</option>
                      <option value="medium">Mediana</option>
                      <option value="large">Grande</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Configuración del Marcador */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-3">
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  📍 Marcador y Logo
                </h4>

                {/* Colores del marcador */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Color Marcador
                    </label>
                    <input
                      type="color"
                      value={contactForm.map?.markerColor || '#ef4444'}
                      onChange={(e) => updateContent('contactForm.map.markerColor', e.target.value)}
                      className="w-full h-8 rounded border border-gray-300 dark:border-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Color Pulso
                    </label>
                    <input
                      type="color"
                      value={contactForm.map?.pulseColor || '#ef4444'}
                      onChange={(e) => updateContent('contactForm.map.pulseColor', e.target.value)}
                      className="w-full h-8 rounded border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>

                {/* Logo personalizado */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Logo Personalizado
                  </label>
                  <input
                    type="url"
                    value={contactForm.map?.customLogo || ''}
                    onChange={(e) => updateContent('contactForm.map.customLogo', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs"
                    placeholder="https://ejemplo.com/logo.png"
                  />
                </div>

                {/* Opciones del logo */}
                <div className="grid grid-cols-3 gap-2 items-end">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Tamaño Logo
                    </label>
                    <select
                      value={contactForm.map?.logoSize || 'medium'}
                      onChange={(e) => updateContent('contactForm.map.logoSize', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs"
                    >
                      <option value="small">S</option>
                      <option value="medium">M</option>
                      <option value="large">L</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-200">
                      <input
                        type="checkbox"
                        checked={contactForm.map?.showCompanyName !== false}
                        onChange={(e) => updateContent('contactForm.map.showCompanyName', e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                      Mostrar nombre empresa
                    </label>
                  </div>
                </div>

                {/* Configuración avanzada del marcador */}
                <div className="bg-white dark:bg-gray-800 rounded p-2 border border-gray-200 dark:border-gray-700 space-y-2">
                  <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Avanzado
                  </h5>

                  {/* Grid compacto para todas las opciones */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Estilo del marcador */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Estilo
                      </label>
                      <select
                        value={contactForm.map?.markerStyle || 'solid'}
                        onChange={(e) => updateContent('contactForm.map.markerStyle', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs"
                      >
                        <option value="solid">Sólido</option>
                        <option value="gradient">Degradado</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>

                    {/* Grosor del borde */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Grosor
                      </label>
                      <select
                        value={contactForm.map?.markerBorderWidth || '2px'}
                        onChange={(e) => updateContent('contactForm.map.markerBorderWidth', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs"
                      >
                        <option value="1px">1px</option>
                        <option value="2px">2px</option>
                        <option value="3px">3px</option>
                        <option value="4px">4px</option>
                      </select>
                    </div>

                    {/* Color de Fondo */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Fondo
                      </label>
                      <input
                        type="color"
                        value={contactForm.map?.markerBackground || '#ffffff'}
                        onChange={(e) => updateContent('contactForm.map.markerBackground', e.target.value)}
                        className="w-full h-6 rounded border border-gray-300 dark:border-gray-600"
                      />
                    </div>

                    {/* Color de Borde */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Borde
                      </label>
                      <input
                        type="color"
                        value={contactForm.map?.markerBorderColor || '#000000'}
                        onChange={(e) => updateContent('contactForm.map.markerBorderColor', e.target.value)}
                        className="w-full h-6 rounded border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Configuración de Efectos y Animaciones */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                    ✨ Efectos y Animaciones
                  </h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={contactForm.map?.animationEnabled !== false}
                      onChange={(e) => updateContent('contactForm.map.animationEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className={`relative w-9 h-5 rounded-full peer transition-colors ${
                      contactForm.map?.animationEnabled !== false
                        ? 'bg-green-500 dark:bg-green-600'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        contactForm.map?.animationEnabled !== false ? 'translate-x-5' : 'translate-x-1'
                      }`} />
                    </div>
                  </label>
                </div>

                {/* Efectos del pulso */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Intensidad Pulso
                    </label>
                    <select
                      value={contactForm.map?.pulseIntensity || 'medium'}
                      onChange={(e) => updateContent('contactForm.map.pulseIntensity', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs"
                      disabled={contactForm.map?.animationEnabled === false}
                    >
                      <option value="none">Sin pulso</option>
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                      <option value="extreme">Extrema</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Velocidad Pulso
                    </label>
                    <select
                      value={contactForm.map?.pulseSpeed || 'normal'}
                      onChange={(e) => updateContent('contactForm.map.pulseSpeed', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs"
                      disabled={contactForm.map?.animationEnabled === false || contactForm.map?.pulseIntensity === 'none'}
                    >
                      <option value="slow">Lenta</option>
                      <option value="normal">Normal</option>
                      <option value="fast">Rápida</option>
                      <option value="ultra">Ultra</option>
                    </select>
                  </div>
                </div>

                {/* Efectos hover */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Efecto Hover
                  </label>
                  <div className="grid grid-cols-5 gap-1">
                    {[
                      { value: 'none', label: 'Sin', icon: '🚫' },
                      { value: 'glow', label: 'Glow', icon: '✨' },
                      { value: 'thunder', label: 'Rayo', icon: '⚡' },
                      { value: 'rainbow', label: 'Rainbow', icon: '🌈' },
                      { value: 'shake', label: 'Shake', icon: '📳' }
                    ].map((effect) => (
                      <button
                        key={effect.value}
                        onClick={() => updateContent('contactForm.map.hoverEffect', effect.value)}
                        disabled={contactForm.map?.animationEnabled === false}
                        className={`p-1.5 text-xs font-medium rounded border transition-all duration-200 ${
                          (contactForm.map?.hoverEffect || 'glow') === effect.value
                            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                            : contactForm.map?.animationEnabled === false
                              ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                              : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        <div className="text-sm">{effect.icon}</div>
                        <div className="text-xs">{effect.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vista previa de efectos */}
                {contactForm.map?.animationEnabled !== false && (
                  <div className="bg-white dark:bg-gray-800 rounded p-2 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                        Preview
                      </h5>
                      <div className="text-xs text-green-600 dark:text-green-400">Activo</div>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className="bg-gray-50 dark:bg-gray-700 p-1.5 rounded">
                        <div className="font-medium text-gray-700 dark:text-gray-300">Pulso</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">
                          {contactForm.map?.pulseIntensity || 'medium'}/{contactForm.map?.pulseSpeed || 'normal'}
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-1.5 rounded">
                        <div className="font-medium text-gray-700 dark:text-gray-300">Hover</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">
                          {contactForm.map?.hoverEffect || 'glow'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
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