/**
 * 📧 Servicio de API para Formulario de Contacto Público
 * Solo maneja el envío de mensajes desde el formulario público (sin autenticación)
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface ContactFormData {
  nombre: string;
  celular: string;
  correo: string;
  mensaje: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  contactId?: string;
  errors?: Array<{
    campo: string;
    mensaje: string;
  }>;
}

/**
 * Enviar mensaje de contacto (público, sin autenticación)
 */
export const submitContact = async (data: ContactFormData): Promise<ContactResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      // Error de validación o del servidor
      return {
        success: false,
        message: result.message || 'Error al enviar el mensaje',
        errors: result.errors,
      };
    }

    return result;
  } catch (error) {
    console.error('Error al enviar contacto:', error);
    return {
      success: false,
      message: 'Error de conexión. Por favor, verifica tu internet e intenta nuevamente.',
    };
  }
};

export default {
  submitContact,
};
