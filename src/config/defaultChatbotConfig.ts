/**
 * Default Chatbot Configuration
 * Valores por defecto para la configuración del chatbot
 */

import type { ChatbotConfig } from '../types/cms';

export const defaultChatbotConfig: ChatbotConfig = {
  botName: 'Asesor de Ventas',
  statusText: 'En línea • Respuesta inmediata',
  logo: {
    light: '',
    dark: ''
  },
  logoAlt: 'Bot Logo',
  welcomeMessage: {
    title: '¡Hola! Soy tu Asesor Virtual 👋',
    description: 'Estoy aquí para ayudarte con información sobre nuestros servicios, precios y cotizaciones.'
  },
  suggestedQuestions: [
    {
      icon: '💼',
      text: '¿Qué servicios ofrecen?',
      message: '¿Qué servicios ofrecen?'
    },
    {
      icon: '💰',
      text: 'Solicitar cotización',
      message: 'Quiero solicitar una cotización para mi proyecto'
    },
    {
      icon: '📊',
      text: 'Ver precios y planes',
      message: '¿Cuáles son sus precios y planes?'
    },
    {
      icon: '📞',
      text: 'Información de contacto',
      message: '¿Cómo puedo contactarlos?'
    }
  ],
  headerStyles: {
    light: {
      background: 'linear-gradient(to right, #EFF6FF, #F5F3FF)',
      titleColor: '#111827',
      subtitleColor: '#6B7280',
      logoBackground: 'linear-gradient(to bottom right, #3B82F6, #8B5CF6)'
    },
    dark: {
      background: 'linear-gradient(to right, #1F2937, #1F2937)',
      titleColor: '#FFFFFF',
      subtitleColor: '#9CA3AF',
      logoBackground: 'linear-gradient(to bottom right, #3B82F6, #8B5CF6)'
    }
  },
  buttonStyles: {
    size: 'medium',
    position: {
      bottom: '24px',
      right: '24px'
    },
    gradient: {
      from: '#3B82F6',
      to: '#8B5CF6'
    },
    shape: 'circle',
    icon: {
      light: '',
      dark: ''
    }
  },
  behavior: {
    autoOpen: false,
    autoOpenDelay: 5000,
    showUnreadBadge: true,
    showPoweredBy: true
  },
  enabled: true
};
