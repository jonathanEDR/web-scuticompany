import React from 'react';
import { Sparkles, Image as ImageIcon } from 'lucide-react';
import ManagedImageSelector from '../ManagedImageSelector';

interface FeaturedBlogConfigSectionProps {
  pageData: any;
  updateContent: (path: string, value: any) => void;
  updateTextStyle: (section: 'featuredBlog', field: string, mode: 'light' | 'dark', color: string) => void;
}

const FeaturedBlogConfigSection: React.FC<FeaturedBlogConfigSectionProps> = ({
  pageData,
  updateContent,
  updateTextStyle
}) => {
  const config = pageData.content?.featuredBlog || {};

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Sección de Webinars y Blogs
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configura los posts destacados que aparecen en el home
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="space-y-6">
        {/* Textos Principales */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título de la Sección
            </label>
            <input
              type="text"
              value={config.title || 'Webinars y blogs'}
              onChange={(e) => updateContent('featuredBlog.title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Webinars y blogs"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subtítulo
            </label>
            <textarea
              value={config.subtitle || ''}
              onChange={(e) => updateContent('featuredBlog.subtitle', e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Accede a nuestros webinars y blogs..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción (Opcional)
            </label>
            <textarea
              value={config.description || ''}
              onChange={(e) => updateContent('featuredBlog.description', e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Descripción adicional..."
            />
          </div>
        </div>

        {/* Configuración del Botón */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Texto del Botón
            </label>
            <input
              type="text"
              value={config.buttonText || 'Ver todos los artículos'}
              onChange={(e) => updateContent('featuredBlog.buttonText', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Ver todos los artículos"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enlace del Botón
            </label>
            <input
              type="text"
              value={config.buttonLink || '/blog'}
              onChange={(e) => updateContent('featuredBlog.buttonLink', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="/blog"
            />
          </div>
        </div>

        {/* Cantidad de Posts */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cantidad de Posts a Mostrar
          </label>
          <input
            type="number"
            min="1"
            max="12"
            value={config.limit || 3}
            onChange={(e) => updateContent('featuredBlog.limit', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Número de posts destacados a mostrar (1-12)
          </p>
        </div>

        {/* Imágenes de Fondo */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-3">
            <ImageIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Imágenes de Fondo
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Imagen Tema Claro */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Imagen - Tema Claro
              </label>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                {config.backgroundImage?.light ? (
                  <div className="relative group">
                    <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border">
                      <img 
                        src={config.backgroundImage.light} 
                        alt="Fondo tema claro"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-center">
                        <ManagedImageSelector
                          currentImage={config.backgroundImage.light}
                          onImageSelect={(imageUrl) => updateContent('featuredBlog.backgroundImage.light', imageUrl)}
                          label=""
                          hideButtonArea={true}
                        />
                        <div className="text-white text-sm font-medium mt-2 pointer-events-none">
                          Cambiar Imagen
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => updateContent('featuredBlog.backgroundImage.light', '')}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm flex items-center justify-center opacity-0 group-hover:opacity-100"
                      title="Eliminar imagen"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl text-gray-400">🖼️</span>
                    </div>
                    <ManagedImageSelector
                      currentImage=""
                      onImageSelect={(imageUrl) => updateContent('featuredBlog.backgroundImage.light', imageUrl)}
                      label="📷 Seleccionar Imagen"
                      hideButtonArea={false}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Imagen para tema claro
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Imagen Tema Oscuro */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Imagen - Tema Oscuro
              </label>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                {config.backgroundImage?.dark ? (
                  <div className="relative group">
                    <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border">
                      <img 
                        src={config.backgroundImage.dark} 
                        alt="Fondo tema oscuro"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-center">
                        <ManagedImageSelector
                          currentImage={config.backgroundImage.dark}
                          onImageSelect={(imageUrl) => updateContent('featuredBlog.backgroundImage.dark', imageUrl)}
                          label=""
                          hideButtonArea={true}
                        />
                        <div className="text-white text-sm font-medium mt-2 pointer-events-none">
                          Cambiar Imagen
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => updateContent('featuredBlog.backgroundImage.dark', '')}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm flex items-center justify-center opacity-0 group-hover:opacity-100"
                      title="Eliminar imagen"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl text-gray-400">🌙</span>
                    </div>
                    <ManagedImageSelector
                      currentImage=""
                      onImageSelect={(imageUrl) => updateContent('featuredBlog.backgroundImage.dark', imageUrl)}
                      label="📷 Seleccionar Imagen"
                      hideButtonArea={false}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Imagen para tema oscuro
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 Recomendado: 1920x1080px para mejor calidad
          </p>
        </div>

        {/* Colores de Texto por Tema */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Colores de Texto
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tema Claro */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                🌞 Tema Claro
              </h4>
              
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Color del Título
                </label>
                <input
                  type="color"
                  value={config.styles?.light?.titleColor || '#1f2937'}
                  onChange={(e) => updateTextStyle('featuredBlog', 'titleColor', 'light', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Color del Subtítulo
                </label>
                <input
                  type="color"
                  value={config.styles?.light?.subtitleColor || '#4b5563'}
                  onChange={(e) => updateTextStyle('featuredBlog', 'subtitleColor', 'light', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Tema Oscuro */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                🌙 Tema Oscuro
              </h4>
              
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Color del Título
                </label>
                <input
                  type="color"
                  value={config.styles?.dark?.titleColor || '#ffffff'}
                  onChange={(e) => updateTextStyle('featuredBlog', 'titleColor', 'dark', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Color del Subtítulo
                </label>
                <input
                  type="color"
                  value={config.styles?.dark?.subtitleColor || '#d1d5db'}
                  onChange={(e) => updateTextStyle('featuredBlog', 'subtitleColor', 'dark', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Nota informativa */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>💡 Nota:</strong> Esta sección muestra automáticamente los posts marcados como "destacados" en el blog. 
            Para cambiar los colores de las tarjetas, ve a la pestaña <strong>"Diseño de Tarjetas"</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBlogConfigSection;
