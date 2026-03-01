import React, { useState } from 'react';
import ImageSelectorModal from './ImageSelectorModal';

interface ManagedImageSelectorProps {
  currentImage?: string;
  onImageSelect: (imageUrl: string) => void;
  label?: string;
  description?: string;
  darkMode?: boolean;
  hideButtonArea?: boolean;
  /** Compact mode: smaller preview (h-16), inline horizontal layout */
  compact?: boolean;
  /** Sidebar mode: vertical card designed to sit beside inputs (right column) */
  sidebar?: boolean;
}

const ManagedImageSelector: React.FC<ManagedImageSelectorProps> = ({
  currentImage,
  onImageSelect,
  label = 'Imagen',
  description,
  darkMode = false,
  hideButtonArea = false,
  compact = false,
  sidebar = false
}) => {
  const [showModal, setShowModal] = useState(false);

  // Sidebar mode: vertical card for placing beside inputs
  if (sidebar) {
    return (
      <div className="flex flex-col items-center gap-1.5">
        {currentImage ? (
          <div className="relative group">
            <img
              src={currentImage}
              alt={label}
              className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
              <button
                onClick={() => setShowModal(true)}
                className="p-1 bg-blue-600 text-white rounded text-[10px] hover:bg-blue-700"
                title="Cambiar"
              >
                📷
              </button>
              <button
                onClick={() => onImageSelect('')}
                className="p-1 bg-red-600 text-white rounded text-[10px] hover:bg-red-700"
                title="Eliminar"
              >
                🗑️
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className={`w-20 h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all ${
              darkMode
                ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50 text-gray-400'
                : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 text-gray-500'
            }`}
          >
            <span className="text-lg">📷</span>
            <span className="text-[8px] leading-tight mt-0.5">Agregar</span>
          </button>
        )}
        {description && (
          <p className={`text-[9px] text-center leading-tight ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {description}
          </p>
        )}
        <ImageSelectorModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSelect={onImageSelect}
          currentImage={currentImage}
          title={`Seleccionar ${label}`}
        />
      </div>
    );
  }

  // Compact mode: inline layout with small thumbnail + action buttons
  if (compact) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-2">
          {/* Thumbnail or select button */}
          {currentImage ? (
            <div className="relative group flex-shrink-0">
              <img
                src={currentImage}
                alt={label}
                className="w-16 h-16 object-cover rounded border"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-1">
                <button
                  onClick={() => setShowModal(true)}
                  className="p-1 bg-blue-600 text-white rounded text-[10px] hover:bg-blue-700"
                  title="Cambiar"
                >
                  📷
                </button>
                <button
                  onClick={() => onImageSelect('')}
                  className="p-1 bg-red-600 text-white rounded text-[10px] hover:bg-red-700"
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className={`flex-shrink-0 w-16 h-16 border-2 border-dashed rounded flex flex-col items-center justify-center transition-all ${
                darkMode
                  ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50 text-gray-400'
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50 text-gray-500'
              }`}
            >
              <span className="text-lg">📁</span>
              <span className="text-[9px] leading-tight">Imagen</span>
            </button>
          )}
          {/* Label + description inline */}
          <div className="flex-1 min-w-0">
            {description && (
              <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {description}
              </p>
            )}
            {!currentImage && !hideButtonArea && (
              <button
                onClick={() => setShowModal(true)}
                className="text-xs text-blue-600 hover:text-blue-700 hover:underline mt-0.5"
              >
                Seleccionar imagen
              </button>
            )}
          </div>
        </div>

        <ImageSelectorModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSelect={onImageSelect}
          currentImage={currentImage}
          title={`Seleccionar ${label}`}
        />
      </div>
    );
  }

  // Default mode (unchanged)
  return (
    <div className="w-full">
      {/* Preview actual */}
      {currentImage && (
        <div className="mb-3">
          <div className="relative group">
            <img
              src={currentImage}
              alt={label}
              className="w-full max-w-[200px] h-32 object-cover rounded-lg border"
            />
            <div className="absolute inset-0 max-w-[200px] bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowModal(true)}
                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                >
                  📷 Cambiar
                </button>
                <button
                  onClick={() => onImageSelect('')}
                  className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botón para seleccionar/cambiar imagen */}
      {!hideButtonArea && (
        <div>
          <button
            onClick={() => setShowModal(true)}
            className={`w-full px-3 py-2 border-2 border-dashed rounded-lg transition-all ${
              darkMode
                ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50 hover:bg-gray-700 text-gray-300'
                : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 text-gray-700'
            } ${currentImage ? '' : 'min-h-[72px]'} flex flex-col items-center justify-center space-y-1`}
          >
            <div className="text-xl">
              {currentImage ? '🖼️' : '📁'}
            </div>
            <div className="text-center">
              <p className="font-medium text-sm">
                {currentImage ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
              </p>
              {description && (
                <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {description}
                </p>
              )}
            </div>
          </button>
        </div>
      )}

      {/* Modal de selección */}
      <ImageSelectorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={onImageSelect}
        currentImage={currentImage}
        title={`Seleccionar ${label}`}
      />
    </div>
  );
};

export default ManagedImageSelector;