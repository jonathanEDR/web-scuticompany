import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import imageCompression from 'browser-image-compression';

interface ImageUploaderProps {
  currentImage?: string;
  onImageUpload: (imageUrl: string) => void;
  label: string;
  description?: string;
  darkMode?: boolean;
}

const ImageUploader = ({ currentImage, onImageUpload, label, description, darkMode = false }: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getToken } = useAuth();

  // Obtener URL del API desde variables de entorno
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Actualizar preview cuando cambie currentImage
  useEffect(() => {
    setPreview(currentImage || null);
  }, [currentImage]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Tipo de archivo no permitido. Solo se permiten: JPG, PNG, GIF, WEBP');
      return;
    }

    setError(null);
    setCompressionInfo(null);

    // Comprimir imagen antes de subir (si es mayor a 1MB)
    let fileToUpload = file;
    if (file.size > 1024 * 1024) { // > 1MB
      try {
        setCompressing(true);
        const originalSize = (file.size / 1024 / 1024).toFixed(2);

        const options = {
          maxSizeMB: 1, // Máximo 1MB
          maxWidthOrHeight: 1920, // Máximo 1920px
          useWebWorker: true, // Usar Web Worker para no bloquear UI
          fileType: file.type as any,
        };

        fileToUpload = await imageCompression(file, options);
        const compressedSize = (fileToUpload.size / 1024 / 1024).toFixed(2);
        const saved = ((1 - fileToUpload.size / file.size) * 100).toFixed(0);

        setCompressionInfo(`✅ Comprimida: ${originalSize}MB → ${compressedSize}MB (${saved}% reducido)`);
        console.log('Imagen comprimida:', { originalSize, compressedSize, saved });
      } catch (error) {
        console.error('Error al comprimir imagen:', error);
        setError('Error al comprimir la imagen. Intentando subir sin comprimir...');
      } finally {
        setCompressing(false);
      }
    }

    // Validar tamaño final (max 5MB después de comprimir)
    if (fileToUpload.size > 5 * 1024 * 1024) {
      setError('El archivo es demasiado grande. Máximo 5MB');
      return;
    }

    // Mostrar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(fileToUpload);

    // Subir archivo
    await uploadFile(fileToUpload);
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      setError(null);

      // Obtener token de autenticación
      const token = await getToken();
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Construir URL completa - remover /api para archivos estáticos
        const baseUrl = API_URL.replace('/api', '');
        const imageUrl = `${baseUrl}${data.data.url}`;
        onImageUpload(imageUrl);
        setPreview(imageUrl);
      } else {
        throw new Error(data.message || 'Error al subir la imagen');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Error al subir la imagen');
      setPreview(currentImage || null);
      setCompressionInfo(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        {label}
      </label>
      {description && (
        <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{description}</p>
      )}

      {/* Preview de la imagen */}
      {preview && (
        <div className="relative group">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-3">
            <button
              onClick={handleButtonClick}
              className="px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={uploading}
            >
              📷 Cambiar
            </button>
            <button
              onClick={handleRemoveImage}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              disabled={uploading}
            >
              🗑️ Eliminar
            </button>
          </div>
        </div>
      )}

      {/* Zona de subida */}
      {!preview && (
        <div 
          onClick={handleButtonClick}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all"
        >
          <div className="space-y-2">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              stroke="currentColor" 
              fill="none" 
              viewBox="0 0 48 48"
            >
              <path 
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                strokeWidth={2} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-purple-600">Haz clic para subir</span>
              {' '}o arrastra y suelta
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF, WEBP hasta 5MB
            </p>
          </div>
        </div>
      )}

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {/* Estado de compresión */}
      {compressing && (
        <div className="flex items-center justify-center space-x-2 text-blue-600">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm font-medium">Comprimiendo imagen...</span>
        </div>
      )}

      {/* Estado de carga */}
      {uploading && (
        <div className="flex items-center justify-center space-x-2 text-purple-600">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm font-medium">Subiendo imagen...</span>
        </div>
      )}

      {/* Info de compresión */}
      {compressionInfo && !uploading && !compressing && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {compressionInfo}
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
