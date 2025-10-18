import { useState, useEffect, useCallback } from 'react';
import * as imageService from '../../services/imageService';
import type { ImageData, ListImagesOptions, PaginationInfo } from '../../services/imageService';

interface UseImageLibraryReturn {
  images: ImageData[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
  selectedImages: Set<string>;
  filters: ListImagesOptions;
  viewMode: 'grid' | 'list';
  
  // Actions
  fetchImages: () => Promise<void>;
  refreshImages: () => Promise<void>;
  setFilters: (filters: Partial<ListImagesOptions>) => void;
  setPage: (page: number) => void;
  toggleImageSelection: (imageId: string) => void;
  selectAllImages: () => void;
  clearSelection: () => void;
  toggleViewMode: () => void;
  deleteSelectedImages: (force?: boolean) => Promise<void>;
}

const DEFAULT_FILTERS: ListImagesOptions = {
  page: 1,
  limit: 20,
  sortBy: '-uploadedAt'
};

export const useImageLibrary = (initialFilters: Partial<ListImagesOptions> = {}): UseImageLibraryReturn => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [filters, setFiltersState] = useState<ListImagesOptions>({
    ...DEFAULT_FILTERS,
    ...initialFilters
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  /**
   * Fetch images from API
   */
  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await imageService.listImages(filters);
      
      setImages(response.images);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar imágenes';
      setError(errorMessage);
      console.error('Error fetching images:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Refresh images
   */
  const refreshImages = useCallback(async () => {
    await fetchImages();
  }, [fetchImages]);

  /**
   * Update filters
   */
  const setFilters = useCallback((newFilters: Partial<ListImagesOptions>) => {
    setFiltersState(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page ?? 1 // Reset to page 1 when filters change
    }));
    setSelectedImages(new Set()); // Clear selection when filters change
  }, []);

  /**
   * Set page
   */
  const setPage = useCallback((page: number) => {
    setFiltersState(prev => ({ ...prev, page }));
  }, []);

  /**
   * Toggle image selection
   */
  const toggleImageSelection = useCallback((imageId: string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  }, []);

  /**
   * Select all images on current page
   */
  const selectAllImages = useCallback(() => {
    setSelectedImages(new Set(images.map(img => img._id)));
  }, [images]);

  /**
   * Clear selection
   */
  const clearSelection = useCallback(() => {
    setSelectedImages(new Set());
  }, []);

  /**
   * Toggle view mode
   */
  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  }, []);

  /**
   * Delete selected images
   */
  const deleteSelectedImages = useCallback(async (force: boolean = false) => {
    if (selectedImages.size === 0) return;

    try {
      setLoading(true);
      setError(null);

      // Delete images in parallel
      const deletePromises = Array.from(selectedImages).map(id =>
        imageService.deleteImage(id, force)
      );

      await Promise.all(deletePromises);

      // Clear selection and refresh
      setSelectedImages(new Set());
      await fetchImages();

      return;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar imágenes';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedImages, fetchImages]);

  /**
   * Fetch images when filters change
   */
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return {
    images,
    loading,
    error,
    pagination,
    selectedImages,
    filters,
    viewMode,
    
    fetchImages,
    refreshImages,
    setFilters,
    setPage,
    toggleImageSelection,
    selectAllImages,
    clearSelection,
    toggleViewMode,
    deleteSelectedImages
  };
};

export default useImageLibrary;
