/**
 * 🏷️ GESTIÓN DE CATEGORÍAS MODAL
 * Modal completo para crear, editar y eliminar categorías
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Tag, X, Plus } from 'lucide-react';
import { categoriasApi, type Categoria } from '../../services/categoriasApi';
import { CategoryIcon } from './CategoryIcon';

interface GestionCategoriasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryChange?: () => void;
}

// Nombres de iconos Lucide (renderizados con <CategoryIcon />).
// Las categorías antiguas con emoji se siguen mostrando tal cual hasta que se editen.
const ICONOS_DISPONIBLES = [
  'Code', 'Palette', 'TrendingUp', 'Handshake', 'Wrench', 'Package',
  'Settings', 'Rocket', 'Lightbulb', 'Smartphone', 'Globe', 'BarChart3',
  'Target', 'DollarSign', 'FileText', 'Search', 'Star', 'Flame',
  'Gem', 'Sparkles', 'Brain', 'GraduationCap', 'Database', 'Shield',
];

const COLORES_DISPONIBLES = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', 
  '#EF4444', '#6366F1', '#06B6D4', '#84CC16', '#F97316'
];

function GestionCategoriasModal({ 
  isOpen, 
  onClose, 
  onCategoryChange 
}: GestionCategoriasModalProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Categoria | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      nombre: '',
      descripcion: '',
      icono: 'Package',
      color: '#3B82F6'
    }
  });

  const watchedIcon = watch('icono');
  const watchedColor = watch('color');

  // Cargar categorías
  const loadCategorias = async () => {
    try {
      setLoading(true);
      const response = await categoriasApi.getAll();
      setCategorias(response.data);
    } catch (error) {
      // Error al cargar categorías
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCategorias();
    }
  }, [isOpen]);

  // Crear nueva categoría
  const handleCreate = () => {
    setEditingCategory(null);
    reset({
      nombre: '',
      descripcion: '',
      icono: 'Package',
      color: '#3B82F6'
    });
    setShowForm(true);
  };

  // Editar categoría
  const handleEdit = (categoria: Categoria) => {
    setEditingCategory(categoria);
    reset({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || '',
      icono: categoria.icono,
      color: categoria.color
    });
    setShowForm(true);
  };

  // Guardar categoría (crear o editar)
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      
      if (editingCategory) {
        // Editar
        await categoriasApi.update(editingCategory._id, data);
      } else {
        // Crear
        await categoriasApi.create(data);
      }

      await loadCategorias();
      onCategoryChange?.();
      setShowForm(false);
      setEditingCategory(null);
    } catch (error) {
      alert('Error al guardar la categoría');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar categoría
  const handleDelete = async (categoria: Categoria) => {
    if (categoria.totalServicios > 0) {
      alert(`No se puede eliminar la categoría "${categoria.nombre}" porque tiene ${categoria.totalServicios} servicios asociados.`);
      return;
    }

    if (confirm(`¿Estás seguro de eliminar la categoría "${categoria.nombre}"?`)) {
      try {
        setLoading(true);
        await categoriasApi.delete(categoria._id);
        await loadCategorias();
        onCategoryChange?.();
      } catch (error) {
        alert('Error al eliminar la categoría');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Tag size={20} strokeWidth={1.5} className="text-[color:var(--srv-from,#9333ea)]" />
            Gestión de Categorías
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          
          {/* Botón crear nueva */}
          {!showForm && (
            <div className="mb-6">
              <button
                onClick={handleCreate}
                className="text-white px-4 py-2 rounded-lg hover:brightness-110 transition-all flex items-center gap-2"
                style={{ background: `linear-gradient(to right, var(--srv-from, #9333ea), var(--srv-to, #7e22ce))` }}
              >
                <Plus size={16} strokeWidth={2} />
                Nueva Categoría
              </button>
            </div>
          )}

          {/* Formulario */}
          {showForm && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">
                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      {...register('nombre', { required: 'El nombre es obligatorio' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[color:var(--srv-via,#a855f7)] focus:border-[color:var(--srv-via,#a855f7)]"
                      placeholder="Ej: Desarrollo Web"
                    />
                    {errors.nombre && (
                      <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
                    )}
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      {...register('descripcion')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[color:var(--srv-via,#a855f7)] focus:border-[color:var(--srv-via,#a855f7)]"
                      placeholder="Descripción de la categoría"
                      rows={2}
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Icono */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      Icono:
                      <CategoryIcon icon={watchedIcon} size={20} color={watchedColor} />
                    </label>
                    <div className="grid grid-cols-8 gap-2">
                      {ICONOS_DISPONIBLES.map((icono) => (
                        <button
                          key={icono}
                          type="button"
                          onClick={() => setValue('icono', icono)}
                          className={`p-2 border rounded-md hover:bg-gray-50 flex items-center justify-center ${
                            watchedIcon === icono
                              ? 'border-[color:var(--srv-from,#a855f7)]'
                              : 'border-gray-300'
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
                            size={18}
                            className={watchedIcon === icono ? 'text-[color:var(--srv-from,#9333ea)]' : 'text-gray-600'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color:
                      <span 
                        className="inline-block w-6 h-6 ml-2 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: watchedColor }}
                      ></span>
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {COLORES_DISPONIBLES.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setValue('color', color)}
                          className={`w-10 h-10 rounded-md border-2 ${
                            watchedColor === color ? 'border-gray-600' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                </div>

                {/* Vista previa */}
                <div className="bg-white p-3 rounded-md border">
                  <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: watchedColor }}
                  >
                    <CategoryIcon icon={watchedIcon} size={14} />
                    {watch('nombre') || 'Nombre de la categoría'}
                  </span>
                </div>

                {/* Botones */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="text-white px-4 py-2 rounded-md hover:brightness-110 transition-all disabled:opacity-50"
                    style={{ background: `linear-gradient(to right, var(--srv-from, #9333ea), var(--srv-to, #7e22ce))` }}
                  >
                    {loading ? 'Guardando...' : editingCategory ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de categorías */}
          <div>
            <h3 className="text-lg font-medium mb-4">Categorías Existentes</h3>
            
            {loading ? (
              <p className="text-gray-500">Cargando categorías...</p>
            ) : categorias.length === 0 ? (
              <p className="text-gray-500">No hay categorías creadas</p>
            ) : (
              <div className="grid gap-3">
                {categorias.map((categoria) => (
                  <div
                    key={categoria._id}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: categoria.color }}
                      >
                        <CategoryIcon icon={categoria.icono} size={14} />
                        {categoria.nombre}
                      </span>
                      <div className="text-sm text-gray-600">
                        <p>{categoria.descripcion}</p>
                        <p className="text-xs">
                          {categoria.totalServicios} servicio{categoria.totalServicios !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(categoria)}
                        className="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm border border-blue-200 rounded hover:bg-blue-50"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(categoria)}
                        disabled={categoria.totalServicios > 0}
                        className={`px-3 py-1 text-sm border rounded ${
                          categoria.totalServicios > 0
                            ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'text-red-600 border-red-200 hover:bg-red-50 hover:text-red-800'
                        }`}
                        title={categoria.totalServicios > 0 ? 'No se puede eliminar: tiene servicios asociados' : 'Eliminar categoría'}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export { GestionCategoriasModal };
export default GestionCategoriasModal;