import React, { useState } from 'react';
import ManagedImageSelector from '../ManagedImageSelector';

// Lista de fuentes disponibles
const AVAILABLE_FONTS = [
  { value: 'Montserrat', label: 'Montserrat (Recomendada)' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' },
];

interface ValueItem {
  title: string;
  description: string;
  image?: {
    light?: string;
    dark?: string;
  };
  imageAlt?: string;
}

interface ValuesContent {
  title: string;
  subtitle?: string;
  fontFamily?: string;
  items: ValueItem[];
  carouselConfig?: {
    itemsPerView?: number;
    autoplay?: boolean;
    autoplaySpeed?: number;
  };
}

interface ValuesConfigSectionProps {
  pageData: any;
  updateContent: (field: string, value: any) => void;
}

const ValuesConfigSection: React.FC<ValuesConfigSectionProps> = ({
  pageData,
  updateContent
}) => {
  const values: ValuesContent = pageData?.content?.values || { title: '', items: [] };
  const [collapsed, setCollapsed] = useState(true);
  const [expandedValue, setExpandedValue] = useState<number | null>(null);
  const [imageTheme, setImageTheme] = useState<'light' | 'dark'>('light');

  // Actualizar un valor específico
  const updateValue = (index: number, field: string, value: any) => {
    const newItems = [...(values.items || [])];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newItems[index] = {
        ...newItems[index],
        [parent]: {
          ...(newItems[index] as any)?.[parent],
          [child]: value
        }
      };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    updateContent('values.items', newItems);
  };

  // Agregar nuevo valor
  const addValue = () => {
    const newItems = [...(values.items || []), {
      title: 'Nuevo Valor',
      description: 'Descripción del valor',
      image: { light: '', dark: '' },
      imageAlt: ''
    }];
    updateContent('values.items', newItems);
  };

  // Eliminar valor
  const removeValue = (index: number) => {
    if (!values.items) return;
    const newItems = values.items.filter((_, i) => i !== index);
    updateContent('values.items', newItems);
  };

  // Mover valor hacia arriba
  const moveValueUp = (index: number) => {
    if (!values.items || index === 0) return;
    const newItems = [...values.items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    updateContent('values.items', newItems);
  };

  // Mover valor hacia abajo
  const moveValueDown = (index: number) => {
    if (!values.items || index === values.items.length - 1) return;
    const newItems = [...values.items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    updateContent('values.items', newItems);
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
      {/* Encabezado colapsable */}
      <button
        type="button"
        className="w-full flex items-center justify-between text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded transition-colors"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-expanded={!collapsed}
        aria-controls="values-section-content"
        style={{ cursor: 'pointer' }}
      >
        <span className="flex items-center gap-2">
          ⭐ Configuración de Valores
        </span>
        <span className="ml-2 text-lg">
          {collapsed ? '▼ Mostrar' : '▲ Ocultar'}
        </span>
      </button>

      {/* Contenido colapsable */}
      {!collapsed && (
        <div id="values-section-content" className="space-y-8">
          {/* 🌟 ENCABEZADO DE VALORES */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-amber-200 dark:border-gray-700/50">

        <div className="space-y-6">
          {/* Título de la sección */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título de la Sección
            </label>
            <input
              type="text"
              value={values.title || ''}
              onChange={(e) => updateContent('values.title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Ej: Nuestros Valores"
            />
          </div>

          {/* Subtítulo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subtítulo (opcional)
            </label>
            <input
              type="text"
              value={values.subtitle || ''}
              onChange={(e) => updateContent('values.subtitle', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Ej: Los principios que nos guían"
            />
          </div>

          {/* Tipografía */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🔤 Tipografía de la Sección
            </label>
            <select
              value={values.fontFamily || 'Montserrat'}
              onChange={(e) => updateContent('values.fontFamily', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              style={{ fontFamily: values.fontFamily || 'Montserrat' }}
            >
              {AVAILABLE_FONTS.map(font => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Esta tipografía se aplicará al título, subtítulo y contenido de las tarjetas de valores
            </p>
          </div>
        </div>
      </div>

      {/* ⚙️ CONFIGURACIÓN DEL CARRUSEL */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-6">
          🎠 Configuración del Carrusel
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Items por vista */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Items visibles (Desktop)
            </label>
            <select
              value={values.carouselConfig?.itemsPerView || 3}
              onChange={(e) => updateContent('values.carouselConfig.itemsPerView', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value={2}>2 items</option>
              <option value={3}>3 items</option>
              <option value={4}>4 items</option>
            </select>
          </div>

          {/* Autoplay */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reproducción automática
            </label>
            <div className="flex items-center gap-3 mt-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.carouselConfig?.autoplay || false}
                  onChange={(e) => updateContent('values.carouselConfig.autoplay', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500"></div>
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {values.carouselConfig?.autoplay ? 'Activado' : 'Desactivado'}
                </span>
              </label>
            </div>
          </div>

          {/* Velocidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Velocidad (segundos)
            </label>
            <input
              type="number"
              min={2}
              max={10}
              value={values.carouselConfig?.autoplaySpeed || 5}
              onChange={(e) => updateContent('values.carouselConfig.autoplaySpeed', parseInt(e.target.value))}
              disabled={!values.carouselConfig?.autoplay}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* 📋 LISTA DE VALORES */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            📋 Lista de Valores ({values.items?.length || 0})
          </h3>
          <button
            onClick={addValue}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar Valor
          </button>
        </div>

        <div className="space-y-4">
          {values.items?.map((item, index) => (
            <div
              key={index}
              className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                expandedValue === index
                  ? 'border-amber-500 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {/* Header del valor */}
              <div
                className={`flex items-center justify-between p-4 cursor-pointer ${
                  expandedValue === index
                    ? 'bg-amber-50 dark:bg-amber-900/20'
                    : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setExpandedValue(expandedValue === index ? null : index)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    item.image?.light || item.image?.dark 
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500' 
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}>
                    {item.image?.light || item.image?.dark ? (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                      {item.title || 'Sin título'}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">
                      {item.description || 'Sin descripción'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Botones de orden */}
                  <button
                    onClick={(e) => { e.stopPropagation(); moveValueUp(index); }}
                    disabled={index === 0}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30"
                    title="Mover arriba"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveValueDown(index); }}
                    disabled={index === values.items.length - 1}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30"
                    title="Mover abajo"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {/* Eliminar */}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeValue(index); }}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Eliminar valor"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  {/* Expandir/Colapsar */}
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                      expandedValue === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Contenido expandido */}
              {expandedValue === index && (
                <div className="p-6 bg-white dark:bg-gray-800 space-y-6">
                  {/* Título y descripción */}
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Título del valor
                      </label>
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => updateValue(index, 'title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Ej: Innovación"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={item.description || ''}
                      onChange={(e) => updateValue(index, 'description', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                      rows={3}
                      placeholder="Describe este valor..."
                    />
                  </div>

                  {/* Imagen del valor */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        🖼️ Imagen del Valor (opcional)
                      </label>
                      {/* Selector de tema */}
                      <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                        <button
                          onClick={() => setImageTheme('light')}
                          className={`px-3 py-1 text-xs font-medium transition-colors ${
                            imageTheme === 'light'
                              ? 'bg-amber-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          ☀️ Claro
                        </button>
                        <button
                          onClick={() => setImageTheme('dark')}
                          className={`px-3 py-1 text-xs font-medium transition-colors ${
                            imageTheme === 'dark'
                              ? 'bg-amber-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          🌙 Oscuro
                        </button>
                      </div>
                    </div>

                    <ManagedImageSelector
                      currentImage={imageTheme === 'light' ? item.image?.light : item.image?.dark}
                      onImageSelect={(url) => updateValue(index, `image.${imageTheme}`, url)}
                      label={`Imagen (${imageTheme === 'light' ? 'Tema Claro' : 'Tema Oscuro'})`}
                      description="Imagen que aparecerá como fondo de la tarjeta del valor"
                      darkMode={false}
                    />

                    {/* Preview de imágenes */}
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">☀️ Tema Claro</p>
                        {item.image?.light ? (
                          <img src={item.image.light} alt="Light" className="w-full h-20 object-cover rounded-lg border" />
                        ) : (
                          <div className="w-full h-20 bg-gray-100 dark:bg-gray-700 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 text-xs">
                            Sin imagen
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">🌙 Tema Oscuro</p>
                        {item.image?.dark ? (
                          <img src={item.image.dark} alt="Dark" className="w-full h-20 object-cover rounded-lg border" />
                        ) : (
                          <div className="w-full h-20 bg-gray-100 dark:bg-gray-700 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 text-xs">
                            Sin imagen
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Alt text */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Texto alternativo (SEO)
                      </label>
                      <input
                        type="text"
                        value={item.imageAlt || ''}
                        onChange={(e) => updateValue(index, 'imageAlt', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Ej: Imagen representando innovación tecnológica"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Mensaje cuando no hay valores */}
          {(!values.items || values.items.length === 0) && (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
              <span className="text-4xl mb-4 block">⭐</span>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No hay valores configurados aún
              </p>
              <button
                onClick={addValue}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar primer valor
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 📊 Vista Previa del Carrusel */}
      {values.items && values.items.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            👁️ Vista Previa del Carrusel
          </h4>
          
          <div className="overflow-hidden">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {values.title || 'Nuestros Valores'}
              </h3>
              {values.subtitle && (
                <p className="text-gray-600 dark:text-gray-400 mt-2">{values.subtitle}</p>
              )}
            </div>

            <div className={`grid gap-4 ${
              values.carouselConfig?.itemsPerView === 2 ? 'grid-cols-2' :
              values.carouselConfig?.itemsPerView === 4 ? 'grid-cols-4' :
              'grid-cols-3'
            }`}>
              {values.items.slice(0, values.carouselConfig?.itemsPerView || 3).map((item, idx) => (
                <div
                  key={idx}
                  className="relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg overflow-hidden"
                  style={{ minHeight: '180px' }}
                >
                  {/* Fondo de imagen */}
                  {item.image?.light && (
                    <div className="absolute inset-0">
                      <img
                        src={item.image.light}
                        alt={item.imageAlt || item.title}
                        className="w-full h-full object-cover opacity-30"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/40 dark:from-gray-800 dark:via-gray-800/80 dark:to-gray-800/40" />
                    </div>
                  )}
                  
                  {/* Contenido */}
                  <div className="relative z-10 h-full flex flex-col justify-end">
                    <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Indicadores */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: Math.ceil(values.items.length / (values.carouselConfig?.itemsPerView || 3)) }).map((_, idx) => (
                <div
                  key={idx}
                  className={`rounded-full transition-all ${
                    idx === 0 ? 'w-6 h-2 bg-amber-500' : 'w-2 h-2 bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      </div>
      )}
    </div>
  );
};

export default ValuesConfigSection;
