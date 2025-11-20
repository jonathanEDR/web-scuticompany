/**
 * InteractiveButtons Component
 * Botones interactivos que REEMPLAZAN las listas de texto del chatbot
 * Para unificar el flujo y evitar información duplicada
 */

import React from 'react';
import type { ChatMessage } from '../../types/scutiAI.types';

interface InteractiveButton {
  text: string;
  message: string;
  icon: string;
  category?: string;
}

interface InteractiveButtonsProps {
  message: ChatMessage;
  onButtonClick: (message: string) => void;
  onReplaceContent?: (newContent: string) => void;
}

export const InteractiveButtons: React.FC<InteractiveButtonsProps> = ({
  message,
  onButtonClick,
  onReplaceContent
}) => {
  // Detectar y unificar categorías de servicios
  const detectAndUnifyServiceCategories = (content: string): { buttons: InteractiveButton[], shouldReplace: boolean, cleanContent: string } => {
    const buttons: InteractiveButton[] = [];
    let shouldReplace = false;
    let cleanContent = content;

    // Categorías principales de servicios - mensajes optimizados para detección
    const categoryMatches = [
      { text: 'Desarrollo', icon: '🌐', regex: /desarrollo/i, message: 'desarrollo' },
      { text: 'Diseño', icon: '🎨', regex: /diseño/i, message: 'diseño' },
      { text: 'Marketing', icon: '📈', regex: /marketing/i, message: 'marketing' },
      { text: 'Consultoría', icon: '💼', regex: /consultoría|consultoria/i, message: 'consultoria' },
      { text: 'Mantenimiento', icon: '🔧', regex: /mantenimiento/i, message: 'mantenimiento' },
      { text: 'Otro', icon: '💎', regex: /otro/i, message: 'otro' },
      { text: 'Finanzas', icon: '💰', regex: /finanzas/i, message: 'finanzas' }
    ];

    // Detectar si es una respuesta de listado de servicios
    const isServiceListing = content.toLowerCase().includes('ofrecemos servicios en las siguientes categorías') ||
                           content.toLowerCase().includes('servicios en las siguientes categorías') ||
                           (content.toLowerCase().includes('categorías') && content.toLowerCase().includes('servicios'));

    if (isServiceListing) {
      shouldReplace = true;
      
      // Generar contenido limpio sin la lista
      cleanContent = content.split(/ofrecemos servicios en las siguientes categorías|servicios en las siguientes categorías/i)[0].trim() + 
                    '\n\nSelecciona la categoría que te interesa:';
      
      // Agregar botones para todas las categorías encontradas
      categoryMatches.forEach(category => {
        if (category.regex.test(content)) {
          buttons.push({
            text: category.text,
            icon: category.icon,
            message: category.message,
            category: category.text.toLowerCase()
          });
        }
      });
    }

    return { buttons, shouldReplace, cleanContent };
  };

  // Detectar servicios específicos listados (nivel 2/3) - Hacer servicios clickeables
  const detectSpecificServicesList = (content: string): { buttons: InteractiveButton[], shouldReplace: boolean, cleanContent: string } => {
    const buttons: InteractiveButton[] = [];
    let shouldReplace = false;
    let cleanContent = content;

    // Detectar si es una lista de servicios con números (1. Servicio, 2. Servicio, etc.)
    const serviceListPattern = /(\d+\.\s+)([^0-9\n]+)(?:\n|$)/g;
    const matches = [...content.matchAll(serviceListPattern)];

    // Si encontramos servicios listados - VALIDAR que sean nombres de servicios, no explicaciones
    if (matches.length >= 2) { // Al menos 2 servicios para considerarlo una lista
      
      // Verificar si son nombres cortos (servicios) o explicaciones largas (beneficios)
      const isServiceList = matches.every(match => {
        const text = match[2].trim();
        // Nombres de servicios son cortos (< 50 chars) y no contienen verbos explicativos
        const isShort = text.length < 50;
        const hasExplanatoryWords = /facilita|automatiza|mejora|optimiza|permite|ayuda|proporciona|incluye/i.test(text);
        const hasLongPhrases = text.includes('través de') || text.includes('para') || text.includes('con el fin de');
        
        return isShort && !hasExplanatoryWords && !hasLongPhrases;
      });

      if (isServiceList) {
        shouldReplace = true;
        
        // Extraer servicios y crear botones
        matches.forEach((match) => {
          const serviceName = match[2].trim();
          // Limpiar el nombre del servicio (quitar precio, duración, etc.)
          const cleanServiceName = serviceName.split('-')[0].trim();
          
          if (cleanServiceName && cleanServiceName.length > 3) {
            buttons.push({
              text: cleanServiceName,
              icon: '🔍',
              message: cleanServiceName.toLowerCase(), // Mensaje simple y directo
              category: 'servicio'
            });
          }
        });

        // Generar contenido limpio manteniendo el texto introductorio
        const introText = content.split(/\d+\./)[0].trim();
        cleanContent = introText + '\n\nSelecciona el servicio que te interesa:';
      }
    }

    return { buttons, shouldReplace, cleanContent };
  };

  // Detectar detalles de servicio específico (nivel 3/4) - Beneficios y acciones
  const detectServiceDetails = (content: string): { buttons: InteractiveButton[], shouldReplace: boolean, cleanContent: string } => {
    const buttons: InteractiveButton[] = [];
    let shouldReplace = false;
    let cleanContent = content;

    // Detectar si es una respuesta de detalles de servicio (contiene información específica de UN servicio)
    const isServiceDetail = (
      // Indicadores de que es respuesta de detalles de servicio
      content.toLowerCase().includes('precio') ||
      content.toLowerCase().includes('duración') ||
      content.toLowerCase().includes('características') ||
      content.toLowerCase().includes('beneficios') ||
      content.toLowerCase().includes('incluye') ||
      // Y que termina con pregunta sobre conocer más
      (content.toLowerCase().includes('¿') && (
        content.toLowerCase().includes('te gustaría') ||
        content.toLowerCase().includes('quieres saber') ||
        content.toLowerCase().includes('necesitas') ||
        content.toLowerCase().includes('más información')
      ))
    );

    // Detectar si es una respuesta de BENEFICIOS EMPRESARIALES (nivel 4)
    const isBusinessBenefitsResponse = (
      content.toLowerCase().includes('ayuda') ||
      content.toLowerCase().includes('mejora') ||
      content.toLowerCase().includes('beneficio') ||
      content.toLowerCase().includes('facilita') ||
      content.toLowerCase().includes('automatiza') ||
      content.toLowerCase().includes('optimiza')
    ) && (
      content.toLowerCase().includes('empresa') ||
      content.toLowerCase().includes('negocio') ||
      content.toLowerCase().includes('proceso') ||
      content.toLowerCase().includes('operativa')
    );

    if (isServiceDetail && !isBusinessBenefitsResponse) {
      shouldReplace = true;
      
      // Mantener el contenido original pero agregar texto de opciones
      cleanContent = content.replace(/¿[^?]*\?[^¿]*$/i, '').trim() + 
                    '\n\n¿Qué te gustaría conocer específicamente?';

      // Opciones de beneficios empresariales (nivel 4)
      buttons.push(
        {
          text: '💰 Retorno de Inversión',
          icon: '💰',
          message: 'que beneficios y retorno de inversion genera este servicio',
          category: 'beneficio-roi'
        },
        {
          text: '⚡ Optimización de Procesos',
          icon: '⚡',
          message: 'como ayuda este servicio a mejorar procesos en mi empresa',
          category: 'beneficio-procesos'
        },
        {
          text: '🎯 Ventaja Competitiva',
          icon: '🎯',
          message: 'que ventajas competitivas aporta este servicio a mi negocio',
          category: 'beneficio-ventaja'
        },
        {
          text: '📅 Agendar Reunión',
          icon: '📅',
          message: 'quiero agendar una reunion para solicitar cotizacion',
          category: 'agendar'
        }
      );
    } else if (isBusinessBenefitsResponse) {
      // Si es respuesta de beneficios empresariales, solo mostrar botón de agendar
      shouldReplace = true;
      cleanContent = content.trim() + '\n\n¿Te gustaría agendar una reunión para discutir este servicio?';
      
      buttons.push({
        text: '📅 Agendar Reunión',
        icon: '📅',
        message: 'quiero agendar una reunion para solicitar cotizacion',
        category: 'agendar-final'
      });
    }

    return { buttons, shouldReplace, cleanContent };
  };

  // Detectar servicios específicos (nivel 2)
  const detectSpecificServices = (content: string): { buttons: InteractiveButton[], shouldReplace: boolean, cleanContent: string } => {
    const buttons: InteractiveButton[] = [];
    let shouldReplace = false;
    let cleanContent = content;

    // Si el mensaje contiene listas de servicios específicos
    const hasServiceList = content.includes('•') || content.includes('-') || content.includes('◦');
    const isServiceDetail = content.toLowerCase().includes('desarrollo') && 
                           (content.toLowerCase().includes('ofrecemos') || content.toLowerCase().includes('servicios'));

    if (hasServiceList && isServiceDetail) {
      shouldReplace = true;
      
      // Limpiar contenido antes de la lista
      const parts = content.split(/(?=\s*[•\-◦])/);
      cleanContent = parts[0].trim() + '\n\nSelecciona el tipo de servicio específico:';

      // Botones de acciones comunes para servicios específicos
      buttons.push(
        {
          text: 'Ver todos los servicios',
          icon: '📋',
          message: 'Muéstrame todos los servicios disponibles en esta categoría con precios'
        },
        {
          text: 'Solicitar cotización',
          icon: '💰',
          message: 'Quiero solicitar una cotización personalizada para mi proyecto'
        },
        {
          text: 'Agendar consulta',
          icon: '📅',
          message: 'Me gustaría agendar una consulta para discutir mi proyecto'
        },
        {
          text: 'Ver casos de éxito',
          icon: '🏆',
          message: 'Muéstrame ejemplos de proyectos similares que han realizado'
        }
      );
    }

    return { buttons, shouldReplace, cleanContent };
  };

  // Detectar acciones generales
  const detectGeneralActions = (content: string): InteractiveButton[] => {
    const buttons: InteractiveButton[] = [];

    // Solo agregar si no es un listado (para evitar duplicados)
    const isListing = content.includes('•') || content.includes('-') || content.toLowerCase().includes('categorías');
    
    if (!isListing) {
      // Detectar menciones de cotización
      if (content.toLowerCase().includes('cotización') || content.toLowerCase().includes('presupuesto')) {
        buttons.push({
          text: 'Solicitar presupuesto',
          icon: '💰',
          message: 'Quiero solicitar un presupuesto detallado para mi proyecto'
        });
      }

      // Detectar menciones de contacto
      if (content.toLowerCase().includes('contactar') || content.toLowerCase().includes('contacto')) {
        buttons.push({
          text: 'Información de contacto',
          icon: '📞',
          message: '¿Cuál es la mejor forma de contactarlos?'
        });
      }
    }

    return buttons;
  };

  // Solo mostrar botones para mensajes del asistente
  if (message.role !== 'assistant') {
    return null;
  }

  // Detectar qué tipo de respuesta es y generar botones apropiados
  const serviceCategories = detectAndUnifyServiceCategories(message.content);
  const specificServicesList = detectSpecificServicesList(message.content);
  const serviceDetails = detectServiceDetails(message.content);
  const specificServices = detectSpecificServices(message.content);
  const generalActions = detectGeneralActions(message.content);

  let finalButtons: InteractiveButton[] = [];
  let shouldReplaceContent = false;
  let newContent = message.content;

  if (serviceCategories.shouldReplace) {
    finalButtons = serviceCategories.buttons;
    shouldReplaceContent = true;
    newContent = serviceCategories.cleanContent;
  } else if (specificServicesList.shouldReplace) {
    finalButtons = specificServicesList.buttons;
    shouldReplaceContent = true;
    newContent = specificServicesList.cleanContent;
  } else if (serviceDetails.shouldReplace) {
    finalButtons = serviceDetails.buttons;
    shouldReplaceContent = true;
    newContent = serviceDetails.cleanContent;
  } else if (specificServices.shouldReplace) {
    finalButtons = specificServices.buttons;
    shouldReplaceContent = true;
    newContent = specificServices.cleanContent;
  } else {
    finalButtons = generalActions;
  }

  // No mostrar si no hay botones
  if (finalButtons.length === 0) {
    return null;
  }

  // Reemplazar contenido del mensaje si es necesario
  React.useEffect(() => {
    if (shouldReplaceContent && onReplaceContent) {
      onReplaceContent(newContent);
    }
  }, [shouldReplaceContent, newContent, onReplaceContent]);

  return (
    <div className="mt-3">
      <div className={`grid gap-2 ${
        finalButtons.length === 1 ? 'grid-cols-1' :
        finalButtons.length === 4 ? 'grid-cols-1 sm:grid-cols-2' : 
        finalButtons.length <= 2 ? 'grid-cols-1' : 
        'grid-cols-1 sm:grid-cols-2'
      }`}>
        {finalButtons.map((button, index) => (
          <button
            key={index}
            onClick={() => onButtonClick(button.message)}
            className="flex items-center gap-2 px-3 py-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 border border-blue-200 dark:border-blue-800 text-left touch-manipulation min-h-[44px]"
          >
            <span className="text-lg">{button.icon}</span>
            <span className="flex-1">{button.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default InteractiveButtons;