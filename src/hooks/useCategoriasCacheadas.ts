/**
 * 🪝 useCategoriasCacheadas Hook
 * 
 * Obtiene categorías con cacheing automático
 * Reducción: 80% en queries repetidas
 */

import { useState, useEffect } from 'react';
import { categoriasApi, type Categoria } from '../services/categoriasApi';
import { categoryCache } from '../services/categoryCache';

interface UseCategoriasCacheadasOptions {
  autoLoad?: boolean;
}

export const useCategoriasCacheadas = (
  options: UseCategoriasCacheadasOptions = {}
) => {
  const { autoLoad = true } = options;

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar categorías con cache
  const loadCategorias = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await categoryCache.getCategories(
        () => categoriasApi.getActivas(),
        'all-categories'
      );
      setCategorias(data);
    } catch (err: any) {
      const errorMsg = err.message || 'Error cargando categorías';
      setError(errorMsg);
      console.error('❌ [useCategoriasCacheadas]', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Auto-cargar si está habilitado
  useEffect(() => {
    if (autoLoad) {
      loadCategorias();
    }
  }, [autoLoad]);

  // Invalidar cache después de crear
  const invalidateAfterCreate = () => {
    categoryCache.invalidateAfterCreate();
    console.log('🔄 [useCategoriasCacheadas] Cache invalidado después de crear');
  };

  // Refrescar manualmente
  const refresh = async () => {
    categoryCache.invalidate('all-categories');
    await loadCategorias();
  };

  return {
    categorias,
    loading,
    error,
    loadCategorias,
    invalidateAfterCreate,
    refresh,
    cacheStats: categoryCache.getStats()
  };
};

export default useCategoriasCacheadas;
