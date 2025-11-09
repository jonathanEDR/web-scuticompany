/**
 * 📦 Category Cache Service
 * 
 * Cachea categorías en memoria para evitar queries repetidas
 * - TTL: 5 minutos
 * - Auto-invalidación por tiempo
 * - API: simple get/invalidate
 */

import type { Categoria } from './categoriasApi';

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CategoryCacheService {
  private cache = new Map<string, CacheEntry>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

  /**
   * Obtener categorías del cache o hacer query si no existe
   */
  async getCategories(
    fetchFn: () => Promise<Categoria[]>,
    cacheKey: string = 'all-categories'
  ): Promise<Categoria[]> {
    // Verificar si existe en cache y no ha expirado
    const cached = this.get<Categoria[]>(cacheKey);
    if (cached) {
      console.log(`📦 [CategoryCache] ✅ Usando categorías del cache`);
      return cached;
    }

    // Si no está en cache, hacer query
    console.log(`📦 [CategoryCache] ❌ Cache miss - haciendo query`);
    const categories = await fetchFn();
    
    // Guardar en cache
    this.set(cacheKey, categories, this.DEFAULT_TTL);
    console.log(`📦 [CategoryCache] 💾 Guardado ${categories.length} categorías en cache (TTL: 5 min)`);
    
    return categories;
  }

  /**
   * Obtener categoría específica por ID
   */
  async getCategory(
    categoryId: string,
    fetchFn: (id: string) => Promise<Categoria>,
    cacheKey?: string
  ): Promise<Categoria> {
    const key = cacheKey || `category-${categoryId}`;
    
    const cached = this.get<Categoria>(key);
    if (cached) {
      console.log(`📦 [CategoryCache] ✅ Categoría ${categoryId} en cache`);
      return cached;
    }

    console.log(`📦 [CategoryCache] ❌ Categoría ${categoryId} no en cache`);
    const category = await fetchFn(categoryId);
    
    this.set(key, category, this.DEFAULT_TTL);
    console.log(`📦 [CategoryCache] 💾 Categoría ${categoryId} guardada`);
    
    return category;
  }

  /**
   * Guardar en cache
   */
  private set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Obtener del cache con validación de TTL
   */
  private get<T = any>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Verificar si expiró
    const age = Date.now() - entry.timestamp;
    if (age > entry.ttl) {
      console.log(`📦 [CategoryCache] ⏰ Expirado: ${key}`);
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Invalidar todo el cache
   */
  invalidateAll(): void {
    console.log(`📦 [CategoryCache] 🔄 Invalidando todo el cache`);
    this.cache.clear();
  }

  /**
   * Invalidar entrada específica
   */
  invalidate(key: string): void {
    console.log(`📦 [CategoryCache] 🔄 Invalidando: ${key}`);
    this.cache.delete(key);
  }

  /**
   * Invalidar after de crear nueva categoría
   */
  invalidateAfterCreate(): void {
    this.invalidate('all-categories');
    console.log(`📦 [CategoryCache] 🔄 Invalidado lista después de crear`);
  }

  /**
   * Obtener estadísticas del cache
   */
  getStats(): {
    size: number;
    entries: string[];
    totalMemory: string;
  } {
    const entries: string[] = [];
    let totalMemory = 0;

    this.cache.forEach((entry, key) => {
      entries.push(key);
      totalMemory += JSON.stringify(entry.data).length;
    });

    return {
      size: this.cache.size,
      entries,
      totalMemory: `${(totalMemory / 1024).toFixed(2)} KB`
    };
  }

  /**
   * Debug: imprimir estado del cache
   */
  debug(): void {
    console.group('📦 [CategoryCache] Debug Info');
    const stats = this.getStats();
    console.log('Entradas:', stats.size);
    console.log('Claves:', stats.entries);
    console.log('Memoria:', stats.totalMemory);
    console.groupEnd();
  }
}

// Instancia singleton
export const categoryCache = new CategoryCacheService();

export default CategoryCacheService;
