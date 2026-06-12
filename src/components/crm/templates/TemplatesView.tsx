/**
 * 📋 TEMPLATES VIEW - Vista de gestión de plantillas de mensajes
 * Autocontenida: carga, creación, edición, favoritos y eliminación de plantillas.
 */

import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, Star, Pencil, Trash2, Loader2 } from 'lucide-react';
import { TemplateEditor } from './TemplateEditor';
import { templateService } from '../../../services/messageService';
import { MESSAGE_TYPE_LABELS } from '../../../types/message.types';
import type { MessageTemplate } from '../../../types/message.types';

const getTemplateTypeBadge = (tipo: string) => {
  const colors: Record<string, string> = {
    nota_interna: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    mensaje_cliente: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    respuesta_cliente: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[tipo] || 'bg-gray-100 text-gray-700'}`}>
      {MESSAGE_TYPE_LABELS[tipo as keyof typeof MESSAGE_TYPE_LABELS] || tipo}
    </span>
  );
};

export const TemplatesView: React.FC = () => {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | undefined>();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const response = await templateService.getTemplates();
      if (response.success && response.data) {
        setTemplates(response.data.plantillas || []);
      }
    } catch (error) {
      console.error('Error cargando plantillas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTemplate = async (data: Partial<MessageTemplate>) => {
    try {
      let response;
      if (selectedTemplate) {
        response = await templateService.updateTemplate(selectedTemplate._id, data);
      } else {
        response = await templateService.createTemplate(data as any);
      }

      if (response.success) {
        setShowEditor(false);
        setSelectedTemplate(undefined);
        await loadTemplates();
      } else {
        alert(response.message || 'Error al guardar plantilla');
      }
    } catch (error) {
      console.error('Error guardando plantilla:', error);
      alert('Error al guardar la plantilla');
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta plantilla?')) {
      return;
    }

    try {
      const response = await templateService.deleteTemplate(templateId);
      if (response.success) {
        await loadTemplates();
      }
    } catch (error) {
      console.error('Error eliminando plantilla:', error);
    }
  };

  const handleToggleFavorite = async (templateId: string) => {
    try {
      const response = await templateService.toggleFavorite(templateId);
      if (response.success) {
        setFavorites(prev =>
          prev.includes(templateId)
            ? prev.filter(id => id !== templateId)
            : [...prev, templateId]
        );
        await loadTemplates();
      }
    } catch (error) {
      console.error('Error toggle favorito:', error);
    }
  };

  const openCreateEditor = () => {
    setSelectedTemplate(undefined);
    setShowEditor(true);
  };

  return (
    <div className="space-y-6">
      {/* Header con botón crear */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Plantillas de Mensajes
        </h2>
        <button
          onClick={openCreateEditor}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1.5"
        >
          <Plus size={14} strokeWidth={2} />Nueva Plantilla
        </button>
      </div>

      {/* Grid de Plantillas */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 size={36} strokeWidth={1.5} className="animate-spin mb-2 text-gray-400 dark:text-gray-500 mx-auto" />
            <p className="text-gray-600 dark:text-gray-400">Cargando plantillas...</p>
          </div>
        </div>
      ) : templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template._id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {template.titulo}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {template.descripcion}
                  </p>
                </div>
                <button
                  onClick={() => handleToggleFavorite(template._id)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    size={18}
                    strokeWidth={1.5}
                    className={favorites.includes(template._id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400 dark:text-gray-500'}
                  />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {getTemplateTypeBadge(template.tipo)}
                {template.categoria && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded text-xs">
                    {template.categoria}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Usado {template.vecesUsada} veces
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedTemplate(template);
                      setShowEditor(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 p-1"
                    title="Editar"
                  >
                    <Pencil size={15} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template._id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 p-1"
                    title="Eliminar"
                  >
                    <Trash2 size={15} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <ClipboardList size={48} strokeWidth={1.5} className="mx-auto mb-2 text-gray-400 dark:text-gray-500" />
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hay plantillas
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Crea tu primera plantilla para agilizar la comunicación
          </p>
          <button
            onClick={openCreateEditor}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1.5 mx-auto"
          >
            <Plus size={14} strokeWidth={2} />Crear Primera Plantilla
          </button>
        </div>
      )}

      {/* Modal: Template Editor */}
      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <TemplateEditor
              template={selectedTemplate}
              onSave={handleSaveTemplate}
              onCancel={() => {
                setShowEditor(false);
                setSelectedTemplate(undefined);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesView;
