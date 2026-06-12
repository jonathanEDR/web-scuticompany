/**
 * 📁 MODAL PARA CREAR NUEVA CATEGORÍA
 * Modal para agregar nuevas categorías de servicios
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { categoriasApi, type CreateCategoriaData } from '../../services/categoriasApi';
import { useNotification } from '../../hooks/useNotification';
import { Modal } from '../common/Modal';
import { CategoryIcon } from '../servicios/CategoryIcon';

interface CreateCategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (categoria: any) => void;
}

interface FormData extends CreateCategoriaData {
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  orden: number;
}

// Iconos predefinidos para seleccionar
// Nombres de iconos Lucide (renderizados con <CategoryIcon />).
// Las categorías antiguas con emoji se siguen mostrando tal cual hasta que se editen.
const ICONOS_PREDEFINIDOS = [
  'Code', 'Palette', 'TrendingUp', 'Brain', 'Wrench', 'Zap', 'Smartphone', 'Globe',
  'Rocket', 'Lightbulb', 'Target', 'BarChart3', 'Lock', 'Cloud', 'FileText', 'Music',
  'Camera', 'Hammer', 'CreditCard', 'Phone', 'Package', 'Trophy', 'Folder', 'Sparkles'
];

// Colores predefinidos
const COLORES_PREDEFINIDOS = [
  '#3B82F6', // Azul
  '#8B5CF6', // Púrpura  
  '#10B981', // Verde
  '#F59E0B', // Amarillo
  '#EF4444', // Rojo
  '#F97316', // Naranja
  '#06B6D4', // Cyan
  '#84CC16', // Lima
  '#EC4899', // Rosa
  '#6366F1', // Índigo
  '#14B8A6', // Teal
  '#F43F5E'  // Rose
];

export const CreateCategoriaModal: React.FC<CreateCategoriaModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { success, error } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<FormData>({
    defaultValues: {
      nombre: '',
      descripcion: '',
      icono: 'Folder',
      color: '#3B82F6',
      orden: 0
    }
  });

  const watchedIcon = watch('icono');
  const watchedColor = watch('color');

  // Cerrar modal
  const handleClose = () => {
    reset();
    onClose();
  };

  // Enviar formulario
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await categoriasApi.create({
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        icono: data.icono,
        color: data.color,
        orden: data.orden || 0
      });

      success('Categoría creada exitosamente');
      onSuccess?.(response.data);
      handleClose();
    } catch (err: any) {
      console.error('Error al crear categoría:', err);
      error('Error al crear categoría', err.message || 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Crear Nueva Categoría"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre de la Categoría *
            </label>
            <input
              type="text"
              {...register('nombre', { 
                required: 'El nombre es obligatorio',
                maxLength: { value: 50, message: 'Máximo 50 caracteres' }
              })}
              placeholder="Ej: Desarrollo Móvil"
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[color:var(--srv-via,#a855f7)]"
            />
            {errors.nombre && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.nombre.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              {...register('descripcion', {
                maxLength: { value: 200, message: 'Máximo 200 caracteres' }
              })}
              rows={3}
              placeholder="Breve descripción de la categoría..."
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[color:var(--srv-via,#a855f7)] resize-none"
            />
            {errors.descripcion && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.descripcion.message}</p>
            )}
          </div>
        </div>

        {/* Diseño Visual */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Diseño Visual</h3>
          
          {/* Icono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icono
            </label>
            <div className="space-y-3">
              {/* Iconos predefinidos */}
              <div className="grid grid-cols-8 gap-2">
                {ICONOS_PREDEFINIDOS.map((icono) => (
                  <button
                    key={icono}
                    type="button"
                    onClick={() => setValue('icono', icono)}
                    className={`w-12 h-12 rounded-lg border-2 transition-colors flex items-center justify-center ${
                      watchedIcon === icono
                        ? 'border-[color:var(--srv-from,#a855f7)]'
                        : 'border-gray-300 dark:border-gray-600 hover:border-[color:var(--srv-from,#a855f7)]'
                    }`}
                    style={
                      watchedIcon === icono
                        ? { backgroundColor: 'color-mix(in srgb, var(--srv-from, #9333ea) 10%, transparent)' }
                        : undefined
                    }
                    title={icono}
                  >
                    <CategoryIcon
                      icon={icono}
                      size={20}
                      className={
                        watchedIcon === icono
                          ? 'text-[color:var(--srv-from,#9333ea)]'
                          : 'text-gray-600 dark:text-gray-300'
                      }
                    />
                  </button>
                ))}
              </div>

              {/* Vista previa del icono seleccionado */}
              <div className="flex items-center gap-3">
                <span className="bg-gray-100 dark:bg-gray-700 rounded-lg w-12 h-12 flex items-center justify-center">
                  <CategoryIcon icon={watchedIcon} size={22} color={watchedColor} />
                </span>
                <input
                  type="text"
                  {...register('icono')}
                  placeholder="O ingresa un nombre de icono Lucide (ej: Rocket)"
                  className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[color:var(--srv-via,#a855f7)]"
                />
              </div>
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color de la Categoría
            </label>
            <div className="space-y-3">
              {/* Colores predefinidos */}
              <div className="flex flex-wrap gap-2">
                {COLORES_PREDEFINIDOS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setValue('color', color)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      watchedColor === color
                        ? 'border-gray-800 dark:border-gray-200 scale-110'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              
              {/* Selector de color personalizado */}
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  {...register('color')}
                  className="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
                <input
                  type="text"
                  {...register('color')}
                  placeholder="#3B82F6"
                  className="flex-1 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[color:var(--srv-via,#a855f7)]"
                />
              </div>
            </div>
          </div>

          {/* Orden */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Orden de Visualización
            </label>
            <input
              type="number"
              {...register('orden', { valueAsNumber: true })}
              min="0"
              step="1"
              placeholder="0"
              className="w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[color:var(--srv-via,#a855f7)]"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Las categorías se ordenarán por este número (menor número = primera posición)
            </p>
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Vista Previa:</h4>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg font-semibold"
              style={{ backgroundColor: watchedColor }}
            >
              <CategoryIcon icon={watchedIcon} size={20} />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {watch('nombre') || 'Nombre de la categoría'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {watch('descripcion') || 'Descripción de la categoría'}
              </div>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-white rounded-lg hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[color:var(--srv-via,#a855f7)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{ background: `linear-gradient(to right, var(--srv-from, #9333ea), var(--srv-to, #7e22ce))` }}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <CategoryIcon icon="FolderPlus" size={16} />
                Crear Categoría
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};