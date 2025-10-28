/**
 * 🖼️ API CLIENT - UPLOADS
 * Cliente para gestión de uploads de imágenes
 */

import axios from 'axios';
import { getApiUrl } from '../utils/apiConfig';

// Declaración de tipo para Clerk en window
declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: () => Promise<string | null>;
      };
    };
  }
}

const API_BASE_URL = getApiUrl(); // Cambiado para usar getApiUrl() que incluye /api

/**
 * Obtener token de autenticación de Clerk
 */
const getAuthToken = async (): Promise<string | null> => {
  try {
    if (window.Clerk?.session) {
      const token = await window.Clerk.session.getToken();
      return token;
    }
  } catch (error) {
    console.error('Error obteniendo token de Clerk:', error);
  }
  return null;
};

/**
 * Subir una imagen al servidor
 */
export const uploadImage = async (file: File): Promise<{
  success: boolean;
  data?: {
    _id: string;
    url: string;
    cloudinaryId: string;
    filename: string;
    size: number;
    format: string;
    width: number;
    height: number;
  };
  error?: string;
}> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    // Obtener token de autenticación
    const token = await getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'multipart/form-data',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const { data } = await axios.post(`${API_BASE_URL}/upload/image`, formData, {
      headers,
    });

    return data;
  } catch (error: any) {
    console.error('Error al subir imagen:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Error al subir la imagen',
    };
  }
};

/**
 * Eliminar una imagen del servidor
 */
export const deleteImage = async (imageId: string): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // Obtener token de autenticación
    const token = await getAuthToken();
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const { data } = await axios.delete(`${API_BASE_URL}/upload/images/${imageId}`, {
      headers,
    });
    return data;
  } catch (error: any) {
    console.error('Error al eliminar imagen:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Error al eliminar la imagen',
    };
  }
};

/**
 * Obtener lista de imágenes
 */
export const getImages = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{
  success: boolean;
  data?: any[];
  pagination?: any;
  error?: string;
}> => {
  try {
    // Obtener token de autenticación
    const token = await getAuthToken();
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const { data } = await axios.get(`${API_BASE_URL}/upload/images`, { 
      params,
      headers,
    });
    return data;
  } catch (error: any) {
    console.error('Error al obtener imágenes:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Error al obtener imágenes',
    };
  }
};

export const uploadApi = {
  uploadImage,
  deleteImage,
  getImages,
};

export default uploadApi;
