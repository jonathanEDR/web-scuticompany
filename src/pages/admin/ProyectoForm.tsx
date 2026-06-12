/**
 * 📝 FORMULARIO DE PROYECTO (Crear / Editar)
 * Usado tanto para /dashboard/proyectos/nuevo como /dashboard/proyectos/:id/editar
 * 
 * ✅ Integrado con Media Library para gestión de imágenes
 * ✅ Theme-aware: adapta light/dark usando los patrones del proyecto
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SmartDashboardLayout from '../../components/SmartDashboardLayout';
import ImageSelectorModal from '../../components/ImageSelectorModal';
import { useDashboardHeaderGradient } from '../../hooks/cms/useDashboardHeaderGradient';
import { proyectosApi } from '../../services/proyectosApi';
import type { CreateProyectoRequest, Proyecto, PlanPeriodo } from '../../types/proyecto';
import { PROYECTO_CATEGORIAS, PROYECTO_ESTADOS, PLAN_PERIODOS } from '../../types/proyecto';

const ProyectoForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);
  const { headerGradient } = useDashboardHeaderGradient();

  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  // Image selector modal state
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageTarget, setImageTarget] = useState<'principal' | 'galeria'>('principal');

  // Form state
  const [form, setForm] = useState<CreateProyectoRequest>({
    nombre: '',
    descripcionCorta: '',
    descripcionCompleta: '',
    imagenPrincipal: '',
    imagenes: [],
    icono: '🚀',
    tieneUrl: false,
    urlSistema: '',
    urlDemo: '',
    tecnologias: [],
    categoria: 'web',
    estado: 'activo',
    visibleEnPortfolio: true,
    destacado: false,
    industria: '',
    clienteNombre: '',
    fechaInicio: '',
    fechaFin: '',
    orden: 0,
    // Comercial (sistema en venta)
    rubro: '',
    problemasQueResuelve: [],
    beneficios: [],
    modulos: [],
    planes: [],
    precioDesde: null,
    monedaPrecio: 'PEN',
    urlVideo: '',
    faqs: [],
    resultados: {
      metricas: [],
      descripcion: '',
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
    },
  });

  // Campos temporales para agregar tecnologías y keywords
  const [nuevaTech, setNuevaTech] = useState({ nombre: '', icono: '' });
  const [nuevaKeyword, setNuevaKeyword] = useState('');
  const [nuevaMetrica, setNuevaMetrica] = useState({ nombre: '', valor: '', descripcion: '' });

  // Campos temporales comerciales
  const [nuevoProblema, setNuevoProblema] = useState('');
  const [nuevoModulo, setNuevoModulo] = useState({ nombre: '', descripcion: '', icono: '' });
  const [nuevoBeneficio, setNuevoBeneficio] = useState({ titulo: '', descripcion: '', icono: '' });
  const [nuevoPlan, setNuevoPlan] = useState({
    nombre: '',
    precio: '' as string,
    periodo: 'mensual' as PlanPeriodo,
    descripcion: '',
    caracteristicas: '',
    destacado: false
  });
  const [nuevaFaq, setNuevaFaq] = useState({ pregunta: '', respuesta: '' });

  // ========================================
  // CARGA EN MODO EDICIÓN
  // ========================================

  useEffect(() => {
    if (esEdicion && id) cargarProyecto();
  }, [id]);

  const cargarProyecto = async () => {
    try {
      setLoading(true);
      const proyecto: Proyecto = await proyectosApi.getProyectoAdmin(id!);
      setForm({
        nombre: proyecto.nombre || '',
        descripcionCorta: proyecto.descripcionCorta || '',
        descripcionCompleta: proyecto.descripcionCompleta || '',
        imagenPrincipal: proyecto.imagenPrincipal || '',
        imagenes: proyecto.imagenes || [],
        icono: proyecto.icono || '🚀',
        tieneUrl: proyecto.tieneUrl || false,
        urlSistema: proyecto.urlSistema || '',
        urlDemo: proyecto.urlDemo || '',
        tecnologias: proyecto.tecnologias || [],
        categoria: proyecto.categoria || 'web',
        estado: proyecto.estado || 'activo',
        visibleEnPortfolio: proyecto.visibleEnPortfolio ?? true,
        destacado: proyecto.destacado || false,
        industria: proyecto.industria || '',
        clienteNombre: proyecto.clienteNombre || '',
        fechaInicio: proyecto.fechaInicio ? proyecto.fechaInicio.split('T')[0] : '',
        fechaFin: proyecto.fechaFin ? proyecto.fechaFin.split('T')[0] : '',
        orden: proyecto.orden || 0,
        rubro: proyecto.rubro || '',
        problemasQueResuelve: proyecto.problemasQueResuelve || [],
        beneficios: proyecto.beneficios || [],
        modulos: proyecto.modulos || [],
        planes: proyecto.planes || [],
        precioDesde: proyecto.precioDesde ?? null,
        monedaPrecio: proyecto.monedaPrecio || 'PEN',
        urlVideo: proyecto.urlVideo || '',
        faqs: proyecto.faqs || [],
        resultados: proyecto.resultados || { metricas: [], descripcion: '' },
        seo: proyecto.seo || { metaTitle: '', metaDescription: '', keywords: [] },
      });
    } catch (err: any) {
      setError(err.message || 'Error cargando proyecto');
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // HANDLERS
  // ========================================

  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateSEO = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, seo: { ...prev.seo!, [field]: value } }));
  };

  const agregarTech = () => {
    if (!nuevaTech.nombre.trim()) return;
    setForm((prev) => ({
      ...prev,
      tecnologias: [...(prev.tecnologias || []), { nombre: nuevaTech.nombre, icono: nuevaTech.icono }],
    }));
    setNuevaTech({ nombre: '', icono: '' });
  };

  const eliminarTech = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      tecnologias: (prev.tecnologias || []).filter((_, i) => i !== idx),
    }));
  };

  const agregarKeyword = () => {
    if (!nuevaKeyword.trim()) return;
    setForm((prev) => ({
      ...prev,
      seo: { ...prev.seo!, keywords: [...(prev.seo?.keywords || []), nuevaKeyword.trim()] },
    }));
    setNuevaKeyword('');
  };

  const eliminarKeyword = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      seo: { ...prev.seo!, keywords: (prev.seo?.keywords || []).filter((_, i) => i !== idx) },
    }));
  };

  const agregarMetrica = () => {
    if (!nuevaMetrica.nombre.trim() || !nuevaMetrica.valor.trim()) return;
    setForm((prev) => ({
      ...prev,
      resultados: {
        ...prev.resultados!,
        metricas: [...(prev.resultados?.metricas || []), { ...nuevaMetrica }],
      },
    }));
    setNuevaMetrica({ nombre: '', valor: '', descripcion: '' });
  };

  const eliminarMetrica = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      resultados: {
        ...prev.resultados!,
        metricas: (prev.resultados?.metricas || []).filter((_, i) => i !== idx),
      },
    }));
  };

  // ========================================
  // HANDLERS COMERCIALES (sistema en venta)
  // ========================================

  const agregarProblema = () => {
    if (!nuevoProblema.trim()) return;
    setForm((prev) => ({ ...prev, problemasQueResuelve: [...(prev.problemasQueResuelve || []), nuevoProblema.trim()] }));
    setNuevoProblema('');
  };

  const eliminarProblema = (idx: number) => {
    setForm((prev) => ({ ...prev, problemasQueResuelve: (prev.problemasQueResuelve || []).filter((_, i) => i !== idx) }));
  };

  const agregarModulo = () => {
    if (!nuevoModulo.nombre.trim()) return;
    setForm((prev) => ({ ...prev, modulos: [...(prev.modulos || []), { ...nuevoModulo, nombre: nuevoModulo.nombre.trim() }] }));
    setNuevoModulo({ nombre: '', descripcion: '', icono: '' });
  };

  const eliminarModulo = (idx: number) => {
    setForm((prev) => ({ ...prev, modulos: (prev.modulos || []).filter((_, i) => i !== idx) }));
  };

  const agregarBeneficio = () => {
    if (!nuevoBeneficio.titulo.trim()) return;
    setForm((prev) => ({ ...prev, beneficios: [...(prev.beneficios || []), { ...nuevoBeneficio, titulo: nuevoBeneficio.titulo.trim() }] }));
    setNuevoBeneficio({ titulo: '', descripcion: '', icono: '' });
  };

  const eliminarBeneficio = (idx: number) => {
    setForm((prev) => ({ ...prev, beneficios: (prev.beneficios || []).filter((_, i) => i !== idx) }));
  };

  const agregarPlan = () => {
    if (!nuevoPlan.nombre.trim()) return;
    const plan = {
      nombre: nuevoPlan.nombre.trim(),
      precio: nuevoPlan.precio.trim() === '' ? null : parseFloat(nuevoPlan.precio),
      moneda: form.monedaPrecio || 'PEN',
      periodo: nuevoPlan.periodo,
      descripcion: nuevoPlan.descripcion.trim(),
      // Una característica por línea
      caracteristicas: nuevoPlan.caracteristicas.split('\n').map(c => c.trim()).filter(Boolean),
      destacado: nuevoPlan.destacado
    };
    setForm((prev) => ({ ...prev, planes: [...(prev.planes || []), plan] }));
    setNuevoPlan({ nombre: '', precio: '', periodo: 'mensual', descripcion: '', caracteristicas: '', destacado: false });
  };

  const eliminarPlan = (idx: number) => {
    setForm((prev) => ({ ...prev, planes: (prev.planes || []).filter((_, i) => i !== idx) }));
  };

  const agregarFaq = () => {
    if (!nuevaFaq.pregunta.trim() || !nuevaFaq.respuesta.trim()) return;
    setForm((prev) => ({ ...prev, faqs: [...(prev.faqs || []), { pregunta: nuevaFaq.pregunta.trim(), respuesta: nuevaFaq.respuesta.trim() }] }));
    setNuevaFaq({ pregunta: '', respuesta: '' });
  };

  const eliminarFaq = (idx: number) => {
    setForm((prev) => ({ ...prev, faqs: (prev.faqs || []).filter((_, i) => i !== idx) }));
  };

  // ========================================
  // IMAGE SELECTOR HANDLERS (Media Library)
  // ========================================

  const openImageSelector = (target: 'principal' | 'galeria') => {
    setImageTarget(target);
    setShowImageModal(true);
  };

  const handleImageSelect = (imageUrl: string) => {
    if (imageTarget === 'principal') {
      updateField('imagenPrincipal', imageUrl);
    } else {
      setForm((prev) => ({ ...prev, imagenes: [...(prev.imagenes || []), imageUrl] }));
    }
    setShowImageModal(false);
  };

  const eliminarImagenPrincipal = () => {
    updateField('imagenPrincipal', '');
  };

  const eliminarImagen = (idx: number) => {
    setForm((prev) => ({ ...prev, imagenes: (prev.imagenes || []).filter((_: string, i: number) => i !== idx) }));
  };

  // ========================================
  // GUARDAR
  // ========================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.descripcionCorta.trim()) {
      setError('Nombre y descripción corta son obligatorios');
      return;
    }

    try {
      setGuardando(true);
      setError('');

      if (esEdicion) {
        await proyectosApi.actualizarProyecto(id!, form);
      } else {
        await proyectosApi.crearProyecto(form);
      }

      navigate('/dashboard/proyectos');
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  // ========================================
  // RENDER HELPERS — Clases consistentes con el sistema de diseño
  // ========================================

  const inputClass = "w-full bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";
  const sectionClass = "bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-4 lg:p-6";
  const sectionTitleClass = "text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 flex items-center gap-2";
  const helperTextClass = "text-xs text-gray-500 dark:text-gray-400 mt-1";

  if (loading) {
    return (
      <SmartDashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent" />
          <span className="ml-4 text-gray-600 dark:text-gray-400">Cargando proyecto...</span>
        </div>
      </SmartDashboardLayout>
    );
  }

  return (
    <SmartDashboardLayout>
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto py-4 lg:py-6 px-4 lg:px-6 space-y-6">
        
        {/* ============================== */}
        {/* HEADER CON GRADIENTE */}
        {/* ============================== */}
        <div className="rounded-2xl p-6 lg:p-8 text-white shadow-xl" style={{ background: headerGradient }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <button
                type="button"
                onClick={() => navigate('/dashboard/proyectos')}
                className="text-white/70 hover:text-white text-sm transition-colors mb-2 inline-flex items-center gap-1"
              >
                ← Volver a proyectos
              </button>
              <h1 className="text-2xl lg:text-3xl font-bold">
                {esEdicion ? '✏️ Editar Proyecto' : '➕ Nuevo Proyecto'}
              </h1>
              <p className="text-white/80 mt-1">
                {esEdicion ? 'Modifica los datos del proyecto' : 'Completa la información del proyecto'}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard/proyectos')}
                className="px-5 py-2.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold backdrop-blur-sm transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="px-5 py-2.5 rounded-lg bg-white text-purple-700 font-bold hover:bg-white/90 shadow-lg transition-all disabled:opacity-50"
              >
                {guardando ? '⏳ Guardando...' : esEdicion ? '💾 Guardar Cambios' : '🚀 Crear Proyecto'}
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
            <span>❌</span> {error}
          </div>
        )}

        {/* ============================== */}
        {/* INFORMACIÓN BÁSICA */}
        {/* ============================== */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>
            📋 Información Básica
            <span className="text-xs lg:text-sm font-normal text-gray-600 dark:text-gray-400">(Obligatorio)</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div className="lg:col-span-2">
              <label className={labelClass}>Nombre del Proyecto *</label>
              <input type="text" value={form.nombre} onChange={(e) => updateField('nombre', e.target.value)} className={inputClass} placeholder="Ej: Sistema de Gestión Empresarial" required />
            </div>
            <div className="lg:col-span-2">
              <label className={labelClass}>Descripción Corta *</label>
              <input type="text" value={form.descripcionCorta} onChange={(e) => updateField('descripcionCorta', e.target.value)} className={inputClass} placeholder="Breve descripción para las tarjetas" maxLength={300} required />
              <p className={helperTextClass}>{form.descripcionCorta.length}/300 caracteres</p>
            </div>
            <div className="lg:col-span-2">
              <label className={labelClass}>Descripción Completa</label>
              <textarea value={form.descripcionCompleta} onChange={(e) => updateField('descripcionCompleta', e.target.value)} className={`${inputClass} min-h-[120px]`} placeholder="Descripción detallada del proyecto (soporta HTML)" rows={5} />
            </div>
            <div>
              <label className={labelClass}>Categoría</label>
              <select value={form.categoria} onChange={(e) => updateField('categoria', e.target.value)} className={inputClass}>
                {Object.entries(PROYECTO_CATEGORIAS).map(([key, val]) => (
                  <option key={key} value={key}>{val.icon} {val.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Estado</label>
              <select value={form.estado} onChange={(e) => updateField('estado', e.target.value)} className={inputClass}>
                {Object.entries(PROYECTO_ESTADOS).map(([key, val]) => (
                  <option key={key} value={key}>{val.icon} {val.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Orden</label>
              <input type="number" value={form.orden} onChange={(e) => updateField('orden', parseInt(e.target.value) || 0)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Industria</label>
              <input type="text" value={form.industria} onChange={(e) => updateField('industria', e.target.value)} className={inputClass} placeholder="Ej: Fintech, E-commerce, Salud" />
            </div>
            <div>
              <label className={labelClass}>Cliente</label>
              <input type="text" value={form.clienteNombre} onChange={(e) => updateField('clienteNombre', e.target.value)} className={inputClass} placeholder="Nombre del cliente (público)" />
            </div>
            <div>
              <label className={labelClass}>Fecha Inicio</label>
              <input type="date" value={form.fechaInicio} onChange={(e) => updateField('fechaInicio', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Fecha Fin</label>
              <input type="date" value={form.fechaFin} onChange={(e) => updateField('fechaFin', e.target.value)} className={inputClass} />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-6 mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={form.visibleEnPortfolio} onChange={(e) => updateField('visibleEnPortfolio', e.target.checked)} className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">👁️ Visible en Portafolio</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={form.destacado} onChange={(e) => updateField('destacado', e.target.checked)} className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">⭐ Destacado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={form.tieneUrl} onChange={(e) => updateField('tieneUrl', e.target.checked)} className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">🔗 Tiene URL de sistema</span>
            </label>
          </div>
        </div>

        {/* ============================== */}
        {/* URLS */}
        {/* ============================== */}
        {form.tieneUrl && (
          <div className={sectionClass}>
            <h2 className={sectionTitleClass}>🔗 URLs del Sistema</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label className={labelClass}>URL del Sistema (privada)</label>
                <input type="url" value={form.urlSistema} onChange={(e) => updateField('urlSistema', e.target.value)} className={inputClass} placeholder="https://sistema.ejemplo.com" />
                <p className={helperTextClass}>🔒 Solo visible para clientes asignados</p>
              </div>
              <div>
                <label className={labelClass}>URL Demo (pública)</label>
                <input type="url" value={form.urlDemo} onChange={(e) => updateField('urlDemo', e.target.value)} className={inputClass} placeholder="https://demo.ejemplo.com" />
              </div>
            </div>
          </div>
        )}

        {/* ============================== */}
        {/* IMÁGENES (Media Library) */}
        {/* ============================== */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>🖼️ Imágenes</h2>
          
          {/* Imagen Principal */}
          <div className="mb-6">
            <label className={labelClass}>Imagen Principal</label>
            {form.imagenPrincipal ? (
              <div className="relative group w-full max-w-md">
                <img
                  src={form.imagenPrincipal}
                  alt="Imagen principal"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => openImageSelector('principal')}
                    className="px-3 py-1.5 bg-white/90 text-gray-800 rounded-lg text-sm font-semibold hover:bg-white transition"
                  >
                    🔄 Cambiar
                  </button>
                  <button
                    type="button"
                    onClick={eliminarImagenPrincipal}
                    className="px-3 py-1.5 bg-red-500/90 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition"
                  >
                    🗑️ Quitar
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openImageSelector('principal')}
                className="w-full max-w-md h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center gap-3 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                  <span className="text-2xl">📷</span>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    Seleccionar desde Media Library
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Sube o elige una imagen existente</p>
                </div>
              </button>
            )}
          </div>

          {/* Imágenes adicionales (galería) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className={labelClass}>Imágenes adicionales</label>
              <button
                type="button"
                onClick={() => openImageSelector('galeria')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 dark:from-purple-900/30 dark:to-blue-900/30 dark:hover:from-purple-800/50 dark:hover:to-blue-800/50 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-700/50 rounded-lg text-sm font-medium transition-all"
              >
                ➕ Agregar imagen
              </button>
            </div>

            {(form.imagenes || []).length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {form.imagenes!.map((img: string, idx: number) => (
                  <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                    <img src={img} alt={`Imagen ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => eliminarImagen(idx)}
                        className="p-2 bg-red-500/90 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition"
                      >
                        🗑️ Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                No hay imágenes adicionales. Usa el botón para agregar desde la Media Library.
              </p>
            )}
          </div>
        </div>

        {/* ============================== */}
        {/* TECNOLOGÍAS */}
        {/* ============================== */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>🛠️ Tecnologías</h2>

          {/* Formulario agregar tech */}
          <div className={`rounded-xl p-4 mb-4 border ${
            'bg-gray-50 dark:bg-gray-700/20 border-gray-200 dark:border-gray-600/40'
          }`}>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Nueva tecnología
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-3 mb-3">
              <div>
                <label className={labelClass}>Nombre *</label>
                <input
                  type="text"
                  value={nuevaTech.nombre}
                  onChange={(e) => setNuevaTech((p) => ({ ...p, nombre: e.target.value }))}
                  className={inputClass}
                  placeholder="Ej: React, Node.js, PostgreSQL"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), agregarTech())}
                />
              </div>
              <div>
                <label className={labelClass}>Emoji (opcional)</label>
                <input
                  type="text"
                  value={nuevaTech.icono}
                  onChange={(e) => setNuevaTech((p) => ({ ...p, icono: e.target.value }))}
                  className={inputClass}
                  placeholder="⚛️"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={agregarTech}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm"
            >
              + Agregar tecnología
            </button>
          </div>

          {/* Lista de techs agregadas */}
          {(form.tecnologias || []).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {(form.tecnologias || []).map((tech, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium border border-purple-200 dark:border-purple-700">
                  {tech.icono && <span>{tech.icono}</span>}
                  {tech.nombre}
                  <button
                    type="button"
                    onClick={() => eliminarTech(idx)}
                    className="ml-0.5 w-4 h-4 rounded-full flex items-center justify-center text-purple-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
              <span className="text-2xl opacity-40">🛠️</span>
              <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                Aún no hay tecnologías. Completa el formulario arriba y haz clic en "Agregar".
              </p>
            </div>
          )}
        </div>

        {/* ============================== */}
        {/* INFORMACIÓN COMERCIAL */}
        {/* ============================== */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>
            🛒 Información Comercial
            <span className="text-xs lg:text-sm font-normal text-gray-600 dark:text-gray-400">(Para vender el sistema)</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label className={labelClass}>Rubro objetivo</label>
              <input type="text" value={form.rubro || ''} onChange={(e) => updateField('rubro', e.target.value)} className={inputClass} placeholder="Ej: Restaurantes, Retail, Farmacias" />
              <p className={helperTextClass}>El tipo de negocio al que va dirigido el sistema</p>
            </div>
            <div>
              <label className={labelClass}>Video demostrativo (YouTube)</label>
              <input type="url" value={form.urlVideo || ''} onChange={(e) => updateField('urlVideo', e.target.value)} className={inputClass} placeholder="https://www.youtube.com/watch?v=..." />
            </div>
            <div>
              <label className={labelClass}>Precio desde</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.precioDesde ?? ''}
                onChange={(e) => updateField('precioDesde', e.target.value === '' ? null : parseFloat(e.target.value))}
                className={inputClass}
                placeholder="Vacío = 'Consultar precio'"
              />
              <p className={helperTextClass}>Se muestra como "Desde S/ X" en el catálogo</p>
            </div>
            <div>
              <label className={labelClass}>Moneda</label>
              <select value={form.monedaPrecio || 'PEN'} onChange={(e) => updateField('monedaPrecio', e.target.value)} className={inputClass}>
                <option value="PEN">S/ Soles (PEN)</option>
                <option value="USD">$ Dólares (USD)</option>
                <option value="EUR">€ Euros (EUR)</option>
              </select>
            </div>
          </div>

          {/* Problemas que resuelve */}
          <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <label className={labelClass}>Problemas que resuelve</label>
            <p className={`${helperTextClass} mb-3`}>Se muestran como checklist en el hero. Ej: "Pierdes ventas por no controlar tu inventario"</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={nuevoProblema}
                onChange={(e) => setNuevoProblema(e.target.value)}
                className={`${inputClass} flex-1`}
                placeholder="Describe un problema del negocio que el sistema soluciona"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), agregarProblema())}
              />
              <button type="button" onClick={agregarProblema} className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all">+</button>
            </div>
            {(form.problemasQueResuelve || []).length > 0 && (
              <ul className="space-y-2 mt-3">
                {(form.problemasQueResuelve || []).map((p, idx) => (
                  <li key={idx} className="flex items-center justify-between p-2.5 bg-white dark:bg-gray-700/30 rounded-lg border border-gray-200/50 dark:border-gray-600/50 text-sm text-gray-700 dark:text-gray-300">
                    <span>✅ {p}</span>
                    <button type="button" onClick={() => eliminarProblema(idx)} className="text-gray-400 hover:text-red-500 transition px-2">×</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ============================== */}
        {/* MÓDULOS DEL SISTEMA */}
        {/* ============================== */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>📦 Módulos del Sistema</h2>
          <p className={`${helperTextClass} mb-4`}>Las funcionalidades que incluye el sistema (lo que el comprador recibe). Ej: "Control de inventario", "Reportes de ventas"</p>

          <div className="rounded-xl p-4 mb-4 border bg-gray-50 dark:bg-gray-700/20 border-gray-200 dark:border-gray-600/40">
            <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-3 mb-3">
              <div>
                <label className={labelClass}>Emoji</label>
                <input type="text" value={nuevoModulo.icono} onChange={(e) => setNuevoModulo((p) => ({ ...p, icono: e.target.value }))} className={inputClass} placeholder="📦" />
              </div>
              <div>
                <label className={labelClass}>Nombre del módulo *</label>
                <input type="text" value={nuevoModulo.nombre} onChange={(e) => setNuevoModulo((p) => ({ ...p, nombre: e.target.value }))} className={inputClass} placeholder="Ej: Control de inventario" />
              </div>
            </div>
            <div className="mb-3">
              <label className={labelClass}>Descripción breve <span className="text-gray-400 font-normal">(opcional)</span></label>
              <input type="text" value={nuevoModulo.descripcion} onChange={(e) => setNuevoModulo((p) => ({ ...p, descripcion: e.target.value }))} className={inputClass} placeholder="Ej: Stock en tiempo real con alertas de productos por agotarse" />
            </div>
            <button type="button" onClick={agregarModulo} className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm">
              + Agregar módulo
            </button>
          </div>

          {(form.modulos || []).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(form.modulos || []).map((mod, idx) => (
                <div key={idx} className="flex items-start justify-between p-3 bg-white dark:bg-gray-700/30 rounded-lg border border-gray-200/50 dark:border-gray-600/50 group">
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="text-lg flex-shrink-0">{mod.icono || '📦'}</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{mod.nombre}</p>
                      {mod.descripcion && <p className="text-xs text-gray-500 dark:text-gray-400">{mod.descripcion}</p>}
                    </div>
                  </div>
                  <button type="button" onClick={() => eliminarModulo(idx)} className="flex-shrink-0 ml-2 text-gray-400 hover:text-red-500 transition px-1">×</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">Aún no hay módulos agregados.</p>
          )}
        </div>

        {/* ============================== */}
        {/* BENEFICIOS */}
        {/* ============================== */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>🎯 Beneficios para el Negocio</h2>
          <p className={`${helperTextClass} mb-4`}>Orientados al comprador, no técnicos. Ej: "Atiende más mesas con el mismo personal"</p>

          <div className="rounded-xl p-4 mb-4 border bg-gray-50 dark:bg-gray-700/20 border-gray-200 dark:border-gray-600/40">
            <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-3 mb-3">
              <div>
                <label className={labelClass}>Emoji</label>
                <input type="text" value={nuevoBeneficio.icono} onChange={(e) => setNuevoBeneficio((p) => ({ ...p, icono: e.target.value }))} className={inputClass} placeholder="🚀" />
              </div>
              <div>
                <label className={labelClass}>Título del beneficio *</label>
                <input type="text" value={nuevoBeneficio.titulo} onChange={(e) => setNuevoBeneficio((p) => ({ ...p, titulo: e.target.value }))} className={inputClass} placeholder="Ej: Ahorra horas de trabajo manual" />
              </div>
            </div>
            <div className="mb-3">
              <label className={labelClass}>Descripción <span className="text-gray-400 font-normal">(opcional)</span></label>
              <input type="text" value={nuevoBeneficio.descripcion} onChange={(e) => setNuevoBeneficio((p) => ({ ...p, descripcion: e.target.value }))} className={inputClass} placeholder="Explica brevemente cómo el sistema genera este beneficio" />
            </div>
            <button type="button" onClick={agregarBeneficio} className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm">
              + Agregar beneficio
            </button>
          </div>

          {(form.beneficios || []).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(form.beneficios || []).map((b, idx) => (
                <div key={idx} className="flex items-start justify-between p-3 bg-white dark:bg-gray-700/30 rounded-lg border border-gray-200/50 dark:border-gray-600/50 group">
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="text-lg flex-shrink-0">{b.icono || '✅'}</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{b.titulo}</p>
                      {b.descripcion && <p className="text-xs text-gray-500 dark:text-gray-400">{b.descripcion}</p>}
                    </div>
                  </div>
                  <button type="button" onClick={() => eliminarBeneficio(idx)} className="flex-shrink-0 ml-2 text-gray-400 hover:text-red-500 transition px-1">×</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">Aún no hay beneficios agregados.</p>
          )}
        </div>

        {/* ============================== */}
        {/* PLANES DE PRECIO */}
        {/* ============================== */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>💰 Planes de Precio</h2>
          <p className={`${helperTextClass} mb-4`}>Si no agregas planes, la página mostrará "Consultar precio". Marca uno como "Recomendado" para destacarlo.</p>

          <div className="rounded-xl p-4 mb-4 border bg-gray-50 dark:bg-gray-700/20 border-gray-200 dark:border-gray-600/40">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className={labelClass}>Nombre del plan *</label>
                <input type="text" value={nuevoPlan.nombre} onChange={(e) => setNuevoPlan((p) => ({ ...p, nombre: e.target.value }))} className={inputClass} placeholder="Ej: Básico, Pro, Premium" />
              </div>
              <div>
                <label className={labelClass}>Precio</label>
                <input type="number" min="0" step="0.01" value={nuevoPlan.precio} onChange={(e) => setNuevoPlan((p) => ({ ...p, precio: e.target.value }))} className={inputClass} placeholder="Vacío = Consultar" />
              </div>
              <div>
                <label className={labelClass}>Periodo</label>
                <select value={nuevoPlan.periodo} onChange={(e) => setNuevoPlan((p) => ({ ...p, periodo: e.target.value as PlanPeriodo }))} className={inputClass}>
                  <option value="unico">Pago único</option>
                  <option value="mensual">Mensual</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className={labelClass}>Descripción corta <span className="text-gray-400 font-normal">(opcional)</span></label>
              <input type="text" value={nuevoPlan.descripcion} onChange={(e) => setNuevoPlan((p) => ({ ...p, descripcion: e.target.value }))} className={inputClass} placeholder="Ej: Para negocios que recién empiezan" />
            </div>
            <div className="mb-3">
              <label className={labelClass}>Características (una por línea)</label>
              <textarea
                value={nuevoPlan.caracteristicas}
                onChange={(e) => setNuevoPlan((p) => ({ ...p, caracteristicas: e.target.value }))}
                className={`${inputClass} min-h-[100px]`}
                placeholder={'Hasta 2 usuarios\nControl de inventario\nReportes básicos\nSoporte por WhatsApp'}
                rows={4}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={nuevoPlan.destacado} onChange={(e) => setNuevoPlan((p) => ({ ...p, destacado: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-2 focus:ring-purple-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">⭐ Plan recomendado</span>
              </label>
              <button type="button" onClick={agregarPlan} className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm">
                + Agregar plan
              </button>
            </div>
          </div>

          {(form.planes || []).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(form.planes || []).map((plan, idx) => (
                <div key={idx} className={`relative p-4 rounded-xl border-2 ${plan.destacado ? 'border-purple-500' : 'border-gray-200/50 dark:border-gray-600/50'} bg-white dark:bg-gray-700/30`}>
                  {plan.destacado && <span className="absolute -top-2.5 left-3 px-2 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded-full">⭐ RECOMENDADO</span>}
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-bold text-gray-900 dark:text-white">{plan.nombre}</p>
                    <button type="button" onClick={() => eliminarPlan(idx)} className="text-gray-400 hover:text-red-500 transition px-1">×</button>
                  </div>
                  <p className="text-lg font-extrabold text-purple-600 dark:text-purple-400 mb-1">
                    {plan.precio !== null && plan.precio !== undefined
                      ? `${(form.monedaPrecio || 'PEN') === 'PEN' ? 'S/' : form.monedaPrecio === 'USD' ? '$' : '€'} ${plan.precio} ${PLAN_PERIODOS[plan.periodo] || ''}`
                      : 'Consultar'}
                  </p>
                  {plan.descripcion && <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{plan.descripcion}</p>}
                  <p className="text-xs text-gray-400 dark:text-gray-500">{plan.caracteristicas?.length || 0} características</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">Aún no hay planes. La página mostrará "Consultar precio".</p>
          )}
        </div>

        {/* ============================== */}
        {/* PREGUNTAS FRECUENTES */}
        {/* ============================== */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>❓ Preguntas Frecuentes</h2>
          <p className={`${helperTextClass} mb-4`}>Responde las objeciones típicas de compra: implementación, soporte, capacitación, requisitos, etc.</p>

          <div className="rounded-xl p-4 mb-4 border bg-gray-50 dark:bg-gray-700/20 border-gray-200 dark:border-gray-600/40">
            <div className="mb-3">
              <label className={labelClass}>Pregunta *</label>
              <input type="text" value={nuevaFaq.pregunta} onChange={(e) => setNuevaFaq((p) => ({ ...p, pregunta: e.target.value }))} className={inputClass} placeholder="Ej: ¿Cuánto demora la implementación?" />
            </div>
            <div className="mb-3">
              <label className={labelClass}>Respuesta *</label>
              <textarea value={nuevaFaq.respuesta} onChange={(e) => setNuevaFaq((p) => ({ ...p, respuesta: e.target.value }))} className={`${inputClass} min-h-[80px]`} placeholder="Respuesta clara y directa" rows={3} />
            </div>
            <button type="button" onClick={agregarFaq} className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm">
              + Agregar pregunta
            </button>
          </div>

          {(form.faqs || []).length > 0 ? (
            <div className="space-y-2">
              {(form.faqs || []).map((faq, idx) => (
                <div key={idx} className="flex items-start justify-between p-3 bg-white dark:bg-gray-700/30 rounded-lg border border-gray-200/50 dark:border-gray-600/50">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{faq.pregunta}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{faq.respuesta}</p>
                  </div>
                  <button type="button" onClick={() => eliminarFaq(idx)} className="flex-shrink-0 ml-3 text-gray-400 hover:text-red-500 transition px-1">×</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">Aún no hay preguntas frecuentes.</p>
          )}
        </div>

        {/* ============================== */}
        {/* RESULTADOS / MÉTRICAS */}
        {/* ============================== */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>📊 Resultados</h2>

          <div className="mb-6">
            <label className={labelClass}>Descripción de resultados</label>
            <textarea
              value={form.resultados?.descripcion || ''}
              onChange={(e) => setForm((p) => ({ ...p, resultados: { ...p.resultados!, descripcion: e.target.value } }))}
              className={`${inputClass} min-h-[80px]`}
              placeholder="Describe brevemente los resultados obtenidos con el proyecto"
              rows={3}
            />
          </div>

          {/* Formulario agregar métrica */}
          <div className={`rounded-xl p-4 mb-4 border ${'bg-gray-50 dark:bg-gray-700/20 border-gray-200 dark:border-gray-600/40'}`}>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Nueva métrica
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-3 mb-3">
              <div>
                <label className={labelClass}>Nombre de la métrica *</label>
                <input
                  type="text"
                  value={nuevaMetrica.nombre}
                  onChange={(e) => setNuevaMetrica((p) => ({ ...p, nombre: e.target.value }))}
                  className={inputClass}
                  placeholder="Ej: Uptime, Reducción de costos, Usuarios"
                />
              </div>
              <div>
                <label className={labelClass}>Valor *</label>
                <input
                  type="text"
                  value={nuevaMetrica.valor}
                  onChange={(e) => setNuevaMetrica((p) => ({ ...p, valor: e.target.value }))}
                  className={inputClass}
                  placeholder="Ej: 99.9%"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className={labelClass}>Descripción adicional <span className="text-gray-400 dark:text-gray-500 font-normal">(opcional)</span></label>
              <input
                type="text"
                value={nuevaMetrica.descripcion}
                onChange={(e) => setNuevaMetrica((p) => ({ ...p, descripcion: e.target.value }))}
                className={inputClass}
                placeholder="Ej: Medido en los primeros 6 meses de operación"
              />
            </div>
            <button
              type="button"
              onClick={agregarMetrica}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm"
            >
              + Agregar métrica
            </button>
          </div>

          {/* Lista de métricas */}
          {(form.resultados?.metricas || []).length > 0 ? (
            <div className="space-y-2">
              {form.resultados!.metricas!.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700/30 rounded-lg border border-gray-200/50 dark:border-gray-600/50 group">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400 text-center leading-tight px-1 truncate">{m.valor}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{m.nombre}</p>
                      {m.descripcion && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{m.descripcion}</p>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => eliminarMetrica(idx)}
                    className="flex-shrink-0 ml-3 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
              <span className="text-2xl opacity-40">📊</span>
              <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                Aún no hay métricas. Completa el formulario arriba para agregar resultados cuantificables.
              </p>
            </div>
          )}
        </div>

        {/* ============================== */}
        {/* SEO */}
        {/* ============================== */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>🔍 SEO</h2>
          <div className="grid grid-cols-1 gap-4 lg:gap-6">
            <div>
              <label className={labelClass}>Meta Title</label>
              <input type="text" value={form.seo?.metaTitle || ''} onChange={(e) => updateSEO('metaTitle', e.target.value)} className={inputClass} placeholder="Título para motores de búsqueda" maxLength={70} />
              <p className={helperTextClass}>{(form.seo?.metaTitle || '').length}/70 caracteres</p>
            </div>
            <div>
              <label className={labelClass}>Meta Description</label>
              <textarea value={form.seo?.metaDescription || ''} onChange={(e) => updateSEO('metaDescription', e.target.value)} className={inputClass} placeholder="Descripción para motores de búsqueda" maxLength={160} rows={2} />
              <p className={helperTextClass}>{(form.seo?.metaDescription || '').length}/160 caracteres</p>
            </div>
            <div>
              <label className={labelClass}>Keywords</label>
              <div className="flex gap-2">
                <input type="text" value={nuevaKeyword} onChange={(e) => setNuevaKeyword(e.target.value)} className={`${inputClass} flex-1`} placeholder="Agregar keyword" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), agregarKeyword())} />
                <button type="button" onClick={agregarKeyword} className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all">+</button>
              </div>
              {(form.seo?.keywords || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {(form.seo?.keywords || []).map((kw: string, idx: number) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-gray-700/50 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                      {kw}
                      <button type="button" onClick={() => eliminarKeyword(idx)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================== */}
        {/* FOOTER ACCIONES */}
        {/* ============================== */}
        <div className="flex justify-end gap-3 pt-4 pb-8">
          <button type="button" onClick={() => navigate('/dashboard/proyectos')} className="px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold transition-colors">
            Cancelar
          </button>
          <button type="submit" disabled={guardando} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-600 text-white rounded-lg font-bold shadow-lg transition-all disabled:opacity-50">
            {guardando ? '⏳ Guardando...' : esEdicion ? '💾 Guardar Cambios' : '🚀 Crear Proyecto'}
          </button>
        </div>
      </form>

      {/* ============================== */}
      {/* MODAL DE SELECCIÓN DE IMÁGENES */}
      {/* ============================== */}
      <ImageSelectorModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onSelect={handleImageSelect}
        currentImage={imageTarget === 'principal' ? (form.imagenPrincipal || undefined) : undefined}
        title={imageTarget === 'principal' ? 'Seleccionar imagen principal' : 'Agregar imagen a la galería'}
      />
    </SmartDashboardLayout>
  );
};

export default ProyectoForm;
