const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Obtener todas las páginas
export const getAllPages = async () => {
  try {
    const response = await fetch(`${API_URL}/cms/pages`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error al obtener páginas');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error en getAllPages:', error);
    throw error;
  }
};

// Obtener una página por slug
export const getPageBySlug = async (slug: string) => {
  try {
    const response = await fetch(`${API_URL}/cms/pages/${slug}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error al obtener página');
    }
    
    return data.data;
  } catch (error) {
    console.error(`Error en getPageBySlug (${slug}):`, error);
    throw error;
  }
};

// Actualizar contenido de una página
export const updatePage = async (slug: string, pageData: any) => {
  try {
    const response = await fetch(`${API_URL}/cms/pages/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pageData),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Error al actualizar página');
    }
    
    return data.data;
  } catch (error) {
    console.error(`Error en updatePage (${slug}):`, error);
    throw error;
  }
};

// Inicializar página Home con datos por defecto
export const initHomePage = async () => {
  try {
    const response = await fetch(`${API_URL}/cms/pages/init-home`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!data.success) {
      // Si ya existe, obtenerla
      if (data.message?.includes('ya está inicializada')) {
        return await getPageBySlug('home');
      }
      throw new Error(data.message || 'Error al inicializar página Home');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error en initHomePage:', error);
    throw error;
  }
};

export default {
  getAllPages,
  getPageBySlug,
  updatePage,
  initHomePage
};
