/**
 * 🖼️ COMPONENTE IMAGE UPLOADER
 * Componente reutilizable para subir y previsualizar imágenes
 */

import React, { useState } from 'react';
import ImageSelectorModal from '../ImageSelectorModal';

export interface ImageUploaderProps {
  /**
   * Etiqueta para el campo
   */
  label: string;
  
  /**
   * URL de la imagen actual (si existe)
   */
  currentImage?: string;
  
  /**
   * Callback cuando se selecciona/sube una imagen
   */
  onImageChange: (file: File | null, previewUrl: string | null) => void;
  
  /**
   * Texto de ayuda o descripción
   */
  helpText?: string;
  
  /**
   * Si el campo es requerido
   */
  required?: boolean;
  
  /**
   * Si está en proceso de subida
   */
  uploading?: boolean;
  
  /**
   * Mensaje de error
   */
  error?: string;
  
  /**
   * Aspecto ratio sugerido (ej: "16:9", "1:1", "4:3")
   */
  aspectRatio?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  currentImage,
  onImageChange,
  helpText,
  required = false,
  uploading = false,
  error,
  aspectRatio,
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  const handleRemove = () => {
    setPreview(null);
    onImageChange(null, null);
  };

  return (
    <div className="space-y-3">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {/* Preview Area */}
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg border-2 border-gray-600"
          />
          
          {/* Botón de eliminar */}
          {!uploading && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors shadow-lg font-medium"
              title="Eliminar imagen"
            >
              🗑️ Eliminar
            </button>
          )}

          {/* Overlay de carga */}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="animate-spin text-4xl mb-2">⏳</div>
                <p className="text-white font-semibold">Subiendo...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center bg-gray-800/50">
          <div className="text-6xl mb-3">🖼️</div>
          <p className="text-gray-400 font-medium mb-1">
            No hay imagen seleccionada
          </p>
          <p className="text-sm text-gray-500">
            Haz clic en el botón de abajo para seleccionar
          </p>
          {aspectRatio && (
            <p className="text-xs text-gray-600 mt-2">
              Aspecto recomendado: {aspectRatio}
            </p>
          )}
        </div>
      )}

      {/* Help Text */}
      {helpText && !error && (
        <p className="text-sm text-gray-400">{helpText}</p>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {/* Botón principal para abrir galería */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowMediaLibrary(true);
        }}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg text-lg"
        disabled={uploading}
      >
        �️ Seleccionar desde Galería
      </button>

      {/* Modal de selección de imágenes */}
      <ImageSelectorModal
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={(url: string) => {
          setPreview(url);
          onImageChange(null, url);
        }}
        currentImage={currentImage}
        title="Seleccionar imagen de la galería"
      />
    </div>
  );
};

export default ImageUploader;
