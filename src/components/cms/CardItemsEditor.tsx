import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import type { SolutionItem } from '../../types/cms';
import ImageUploader from '../ImageUploader';
import RichTextEditor from '../RichTextEditor';

interface CardItemsEditorProps {
  items: SolutionItem[];
  onUpdate: (updatedItems: SolutionItem[]) => void;
  onSave?: () => Promise<void>; // Función de save manual
  className?: string;
}

const CardItemsEditor: React.FC<CardItemsEditorProps> = ({
  items,
  onUpdate,
  onSave,
  className = ''
}) => {
  const [localItems, setLocalItems] = useState<SolutionItem[]>(items || []);
  const [expandedCard, setExpandedCard] = useState<number | null>(0); // Primera tarjeta expandida por defecto
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Valores por defecto para nuevas tarjetas
  const createDefaultItem = (index: number): SolutionItem => {
    const defaultTitles = [
      'Soluciones Digitales',
      'Proyectos de Software', 
      'Modelos de IA'
    ];
    const defaultDescriptions = [
      'Transformamos tu negocio con estrategias digitales innovadoras y plataformas web de alto rendimiento.',
      'Desarrollamos software a medida con las últimas tecnologías para optimizar tus procesos empresariales.',
      'Implementamos inteligencia artificial personalizada para automatizar y potenciar tu empresa.'
    ];
    const defaultGradients = [
      'from-purple-500 to-purple-700',
      'from-cyan-500 to-cyan-700',
      'from-amber-500 to-amber-700'
    ];
    
    return {
      iconLight: '',
      iconDark: '',
      title: defaultTitles[index] || `Solución ${index + 1}`,
      description: defaultDescriptions[index] || `Descripción de la solución ${index + 1}`,
      gradient: defaultGradients[index] || 'from-gray-500 to-gray-700'
    };
  };

  // Inicializar con 3 tarjetas si no hay datos
  useEffect(() => {
    if (localItems.length === 0) {
      const defaultItems = Array.from({ length: 3 }, (_, i) => createDefaultItem(i));
      setLocalItems(defaultItems);
      setHasUnsavedChanges(true);
    }
  }, []);

  // Actualizar un item específico
  const updateItem = (index: number, field: keyof SolutionItem, value: string) => {
    setLocalItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  // Agregar nueva tarjeta
  const addItem = () => {
    const newItem = createDefaultItem(localItems.length);
    setLocalItems(prev => [...prev, newItem]);
    setExpandedCard(localItems.length); // Expandir la nueva tarjeta
    setHasUnsavedChanges(true);
  };

  // Eliminar tarjeta
  const removeItem = (index: number) => {
    if (localItems.length <= 1) return; // Mantener al menos 1 tarjeta
    
    setLocalItems(prev => prev.filter((_, i) => i !== index));
    
    // Ajustar tarjeta expandida
    if (expandedCard === index) {
      setExpandedCard(Math.max(0, index - 1));
    } else if (expandedCard !== null && expandedCard > index) {
      setExpandedCard(expandedCard - 1);
    }
    
    setHasUnsavedChanges(true);
  };

  // Guardar cambios
  const saveChanges = async () => {
    try {
      setIsSaving(true);
      
      // Primero actualizar el estado local
      onUpdate(localItems);
      
      // Luego hacer el save si se proporciona la función
      if (onSave) {
        await onSave();
      }
      
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle expandir/contraer tarjeta
  const toggleCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <div className={`bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            📝 Contenido de las Tarjetas
          </h2>
          {hasUnsavedChanges && (
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 text-xs font-medium rounded-full">
              ⚠️ Cambios sin guardar
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={addItem}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
          >
            ➕ Agregar Solución
          </button>
          <button
            onClick={saveChanges}
            disabled={!hasUnsavedChanges || isSaving}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
          >
            {isSaving ? '⏳ Guardando...' : '💾 Guardar'}
          </button>
        </div>
      </div>

      {/* Lista de Tarjetas */}
      <div className="space-y-4">
        {localItems.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
          >
            {/* Header de la tarjeta */}
            <div
              className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => toggleCard(index)}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {expandedCard === index ? '▼' : '▶'}
                </span>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  Tarjeta #{index + 1}: {item.title || `Sin título`}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {localItems.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(index);
                    }}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                  >
                    🗑️ Eliminar
                  </button>
                )}
              </div>
            </div>

            {/* Contenido expandible */}
            {expandedCard === index && (
              <div className="p-6 bg-white dark:bg-gray-800">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Sección de Iconos */}
                  <div className="lg:col-span-2">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      🖼️ Iconos por Tema
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Icono Tema Claro */}
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <ImageUploader
                          label="🌞 Icono Tema Claro"
                          description="Imagen PNG para el modo claro"
                          currentImage={item.iconLight}
                          onImageUpload={(url) => updateItem(index, 'iconLight', url)}
                        />
                      </div>

                      {/* Icono Tema Oscuro */}
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <ImageUploader
                          label="🌙 Icono Tema Oscuro"
                          description="Imagen PNG para el modo oscuro"
                          currentImage={item.iconDark}
                          onImageUpload={(url) => updateItem(index, 'iconDark', url)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Título */}
                  <div>
                    <RichTextEditor
                      label="✏️ Título"
                      value={item.title}
                      onChange={(html) => updateItem(index, 'title', html)}
                      placeholder="Título de la solución"
                    />
                  </div>

                  {/* Gradiente (opcional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      🎨 Gradiente (Tailwind)
                    </label>
                    <input
                      type="text"
                      value={item.gradient}
                      onChange={(e) => updateItem(index, 'gradient', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="from-purple-500 to-purple-700"
                    />
                  </div>

                  {/* Descripción */}
                  <div className="lg:col-span-2">
                    <RichTextEditor
                      label="📄 Descripción"
                      value={item.description}
                      onChange={(html) => updateItem(index, 'description', html)}
                      placeholder="Descripción detallada de la solución..."
                    />
                  </div>

                  {/* Preview */}
                  <div className="lg:col-span-2 mt-4">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">
                      👁️ Vista Previa
                    </h4>
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 border">
                      <div className="flex items-start gap-4">
                        {/* Preview de iconos */}
                        <div className="flex gap-2">
                          {item.iconLight && (
                            <div className="text-center">
                              <img 
                                src={item.iconLight} 
                                alt={`${item.title} - Light`}
                                className="w-12 h-12 object-contain rounded border bg-white p-1"
                              />
                              <span className="text-xs text-gray-600 dark:text-gray-400">🌞</span>
                            </div>
                          )}
                          {item.iconDark && (
                            <div className="text-center">
                              <img 
                                src={item.iconDark} 
                                alt={`${item.title} - Dark`}
                                className="w-12 h-12 object-contain rounded border bg-gray-800 p-1"
                              />
                              <span className="text-xs text-gray-600 dark:text-gray-400">🌙</span>
                            </div>
                          )}
                          {!item.iconLight && !item.iconDark && (
                            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-gray-500">
                              📄
                            </div>
                          )}
                        </div>
                        
                        {/* Preview de texto */}
                        <div className="flex-1">
                          <div 
                            className="font-semibold text-gray-800 dark:text-gray-200 mb-1 text-sm"
                            dangerouslySetInnerHTML={{ 
                              __html: DOMPurify.sanitize(item.title || '<em>Sin título</em>') 
                            }}
                          />
                          <div 
                            className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed"
                            dangerouslySetInnerHTML={{ 
                              __html: DOMPurify.sanitize(item.description || '<em>Sin descripción</em>') 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Resumen de tarjetas */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <span>📊 Total de soluciones: {localItems.length}</span>
          <span>
            {hasUnsavedChanges ? '⚠️ Hay cambios sin guardar' : '✅ Todos los cambios guardados'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardItemsEditor;