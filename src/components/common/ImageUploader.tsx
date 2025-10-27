/**
 * 🖼️ COMPONENTE IMAGE UPLOADER
 * Componente reutilizable para subir y previsualizar imágenes
 */

import React, { useState, useRef } from 'react';

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
  
  /**
   * Tamaño máximo en MB
   */
  maxSizeMB?: number;
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
  maxSizeMB = 5,
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setPreview(null);
      onImageChange(null, null);
      return;
    }

    // Validar tamaño
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      alert(`La imagen es muy pesada. Máximo ${maxSizeMB}MB`);
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten archivos de imagen');
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result as string;
      setPreview(previewUrl);
      onImageChange(file, previewUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {/* Upload Area */}
      <div
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 cursor-pointer
          transition-all duration-200
          ${dragActive 
            ? 'border-purple-500 bg-purple-500/10' 
            : preview 
              ? 'border-gray-600 bg-gray-800/30'
              : 'border-gray-600 bg-gray-800/50 hover:border-purple-500 hover:bg-gray-800/70'
          }
          ${error ? 'border-red-500' : ''}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          disabled={uploading}
          className="hidden"
        />

        {preview ? (
          // Preview de imagen
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg object-contain"
            />
            
            {/* Botón de eliminar */}
            {!uploading && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors shadow-lg"
                title="Eliminar imagen"
              >
                🗑️
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
          // Estado vacío
          <div className="text-center">
            <div className="text-5xl mb-3">🖼️</div>
            <p className="text-gray-300 font-medium mb-1">
              {dragActive ? 'Suelta la imagen aquí' : 'Haz clic o arrastra una imagen'}
            </p>
            <p className="text-sm text-gray-400">
              PNG, JPG, WebP hasta {maxSizeMB}MB
            </p>
            {aspectRatio && (
              <p className="text-xs text-gray-500 mt-1">
                Aspecto recomendado: {aspectRatio}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Help Text */}
      {helpText && !error && (
        <p className="text-sm text-gray-400">{helpText}</p>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default ImageUploader;
