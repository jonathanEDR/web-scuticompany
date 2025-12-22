import React from 'react';
import type { CardDesignStyles } from '../../../../types/cms';
import type { ValueAddedItem } from '../types';
import { cleanHtmlToText, getCurrentIcon, getSafeStyle } from '../utils';

interface ValueCardProps {
  valueItem: ValueAddedItem;
  theme: 'light' | 'dark';
  cardStyles: CardDesignStyles;
  showIcons: boolean;
  index: number;
  isVisible: boolean;
}

// Componente interno para el icono
const CardIcon = ({ 
  iconData, 
  cardStyles, 
  title 
}: { 
  iconData: { type: 'image' | 'none'; value: string | null }; 
  cardStyles: CardDesignStyles; 
  title: string;
}) => {
  if (iconData.type !== 'image' || !iconData.value) return null;

  return (
    <div className={`mb-6 flex ${cardStyles.iconAlignment === 'center' ? 'justify-center' : cardStyles.iconAlignment === 'right' ? 'justify-end' : 'justify-start'}`}>
      <div 
        className="w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300"
        style={{
          background: cardStyles.iconBackground,
          border: cardStyles.iconBorderEnabled ? `2px solid ${cardStyles.iconColor}` : 'none'
        }}
      >
        <img 
          src={iconData.value}
          alt={`Icono ${title}`}
          className="w-10 h-10 object-contain"
          style={{
            filter: `hue-rotate(0deg) saturate(1) brightness(1)`
          }}
        />
      </div>
    </div>
  );
};

export const ValueCard = ({
  valueItem,
  theme,
  cardStyles,
  showIcons,
  index,
  isVisible
}: ValueCardProps) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const currentPosition = React.useRef({ x: 0, y: 0 });
  const escapeCount = React.useRef(0);
  const lastEscapeTime = React.useRef(0);
  const isBouncingInward = React.useRef(false);
  const returnTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInCooldown = React.useRef(false); // 🔒 Bloquea escapes durante el cooldown de 5 segundos

  // 🏠 Función para regresar la tarjeta a su posición original
  const returnToHome = React.useCallback(() => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    
    // Animación suave de regreso
    card.style.transition = 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.8s ease';
    card.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
    card.style.boxShadow = cardStyles.shadow ?? '0 8px 32px rgba(0, 0, 0, 0.1)';
    
    const border = card.querySelector('.card-border') as HTMLElement;
    if (border) {
      border.style.transition = 'background 0.8s ease, box-shadow 0.8s ease';
      border.style.background = cardStyles.border ?? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      border.style.boxShadow = 'none';
    }
    
    // Reset estados
    currentPosition.current = { x: 0, y: 0 };
    escapeCount.current = 0;
    isBouncingInward.current = false;
    isInCooldown.current = false;
    
    // Restaurar transición rápida después de volver
    setTimeout(() => {
      if (card) {
        card.style.transition = 'transform 0.08s ease-out, box-shadow 0.25s ease';
      }
    }, 1200);
  }, [cardStyles.shadow, cardStyles.border]);

  // ✨ Animación "Escape Inteligente" - Detecta bordes y escapa hacia adentro si es necesario
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    // 🔒 Si está en cooldown (esperando los 5 segundos), ignorar movimientos
    if (isInCooldown.current) return;
    
    const now = Date.now();
    // Cooldown mínimo entre escapes
    if (now - lastEscapeTime.current < 40) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // 📐 Dimensiones del viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 20; // Margen mínimo desde los bordes
    
    // Centro actual de la tarjeta
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;
    
    // Centro de la pantalla (hacia donde escapa si no hay espacio)
    const screenCenterX = viewportWidth / 2;
    const screenCenterY = viewportHeight / 2;
    
    // Posición del mouse
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calcular distancia del mouse al centro de la tarjeta
    const distanceX = mouseX - cardCenterX;
    const distanceY = mouseY - cardCenterY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // 🎯 Radio de "peligro" amplio
    const dangerRadius = Math.max(rect.width, rect.height) * 0.8;
    
    if (distance < dangerRadius) {
      lastEscapeTime.current = now;
      escapeCount.current++;
      
      // 🧭 Dirección de escape natural (opuesta al mouse)
      let escapeDirectionX = -distanceX / (distance || 1);
      let escapeDirectionY = -distanceY / (distance || 1);
      
      // 📍 Calcular posición futura si escapara naturalmente
      const baseEscape = 50;
      const bonusEscape = Math.min(escapeCount.current * 8, 50);
      const escapeDistance = baseEscape + bonusEscape;
      
      let projectedX = currentPosition.current.x + escapeDirectionX * escapeDistance;
      let projectedY = currentPosition.current.y + escapeDirectionY * escapeDistance;
      
      // 🔍 Calcular posición absoluta proyectada en la pantalla
      const projectedLeft = rect.left + projectedX;
      const projectedRight = projectedLeft + rect.width;
      const projectedTop = rect.top + projectedY;
      const projectedBottom = projectedTop + rect.height;
      
      // 🚧 Detectar si hay espacio para escapar hacia afuera
      const canEscapeLeft = projectedLeft > margin;
      const canEscapeRight = projectedRight < viewportWidth - margin;
      const canEscapeTop = projectedTop > margin;
      const canEscapeBottom = projectedBottom < viewportHeight - margin;
      
      let needsInwardEscape = false;
      
      // 🔄 Si no hay espacio, escapar hacia el CENTRO de la pantalla
      if (!canEscapeLeft || !canEscapeRight) {
        // Calcular dirección hacia el centro horizontal
        const towardsCenterX = screenCenterX - cardCenterX;
        escapeDirectionX = towardsCenterX > 0 ? 1 : -1;
        needsInwardEscape = true;
      }
      
      if (!canEscapeTop || !canEscapeBottom) {
        // Calcular dirección hacia el centro vertical
        const towardsCenterY = screenCenterY - cardCenterY;
        escapeDirectionY = towardsCenterY > 0 ? 1 : -1;
        needsInwardEscape = true;
      }
      
      // Recalcular posición con la nueva dirección
      let newX = currentPosition.current.x + escapeDirectionX * escapeDistance;
      let newY = currentPosition.current.y + escapeDirectionY * escapeDistance;
      
      // 📏 Límites máximos de desplazamiento (más generosos)
      const maxOffset = 150;
      
      // Aplicar límites suaves con efecto de amortiguación
      if (Math.abs(newX) > maxOffset) {
        const overshoot = Math.abs(newX) - maxOffset;
        const damping = 1 / (1 + overshoot * 0.02); // Amortiguación progresiva
        newX = (newX > 0 ? 1 : -1) * (maxOffset + overshoot * damping * 0.3);
      }
      if (Math.abs(newY) > maxOffset) {
        const overshoot = Math.abs(newY) - maxOffset;
        const damping = 1 / (1 + overshoot * 0.02);
        newY = (newY > 0 ? 1 : -1) * (maxOffset + overshoot * damping * 0.3);
      }
      
      // 🏠 Si está muy lejos del origen, aplicar fuerza de "goma elástica"
      const distanceFromOrigin = Math.sqrt(newX * newX + newY * newY);
      if (distanceFromOrigin > maxOffset * 1.2) {
        const pullBack = 0.85;
        newX *= pullBack;
        newY *= pullBack;
      }
      
      currentPosition.current = { x: newX, y: newY };
      isBouncingInward.current = needsInwardEscape;
      
      // 🔄 Rotación basada en la dirección del movimiento
      const rotationAngle = (escapeDirectionX * 15).toFixed(1);
      
      // ✨ Efectos visuales - más intensos si está escapando hacia adentro
      const baseGlow = needsInwardEscape ? 0.6 : 0.4;
      const glowIntensity = Math.min(baseGlow + escapeCount.current * 0.06, 1);
      
      // Color diferente si escapa hacia adentro (más cyan/turquesa)
      const primaryColor = needsInwardEscape 
        ? `rgba(6, 182, 212, ${glowIntensity})`  // Cyan cuando escapa hacia adentro
        : `rgba(139, 92, 246, ${glowIntensity})`; // Púrpura normal
      const secondaryColor = needsInwardEscape
        ? `rgba(139, 92, 246, ${glowIntensity * 0.5})`
        : `rgba(6, 182, 212, ${glowIntensity * 0.6})`;
      
      // Escala ligeramente mayor cuando escapa hacia adentro
      const scale = needsInwardEscape 
        ? 1.02 + escapeCount.current * 0.003
        : 1 + escapeCount.current * 0.004;
      
      // Aplicar transformación
      card.style.transform = `translate(${newX.toFixed(1)}px, ${newY.toFixed(1)}px) rotate(${rotationAngle}deg) scale(${scale.toFixed(3)})`;
      card.style.boxShadow = `0 0 ${25 + escapeCount.current * 4}px ${primaryColor}, 0 0 ${50 + escapeCount.current * 6}px ${secondaryColor}`;
      
      const border = card.querySelector('.card-border') as HTMLElement;
      if (border) {
        border.style.background = needsInwardEscape 
          ? 'linear-gradient(135deg, #06b6d4, #8b5cf6, #06b6d4)' // Gradiente especial
          : (cardStyles.hoverBorder ?? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
        border.style.boxShadow = `0 0 ${18 + escapeCount.current * 3}px ${primaryColor}`;
      }
      
      // 🔒 Si escapó hacia adentro, activar cooldown de 5 segundos
      if (needsInwardEscape && !isInCooldown.current) {
        isInCooldown.current = true;
        
        // Limpiar timeout anterior si existe
        if (returnTimeoutRef.current) {
          clearTimeout(returnTimeoutRef.current);
        }
        
        // Añadir efecto de "respiración" suave mientras espera
        card.style.transition = 'transform 2s ease-in-out, box-shadow 2s ease-in-out';
        
        // Pequeña animación de "reposo" - ligera pulsación
        const pulseAnimation = () => {
          if (!isInCooldown.current || !cardRef.current) return;
          const currentGlow = 0.5 + Math.sin(Date.now() / 800) * 0.15;
          // Efecto de respiración suave con glow pulsante
          cardRef.current.style.boxShadow = `0 0 30px rgba(6, 182, 212, ${currentGlow}), 0 0 60px rgba(139, 92, 246, ${currentGlow * 0.6})`;
        };
        
        // Iniciar pulsación cada 100ms
        const pulseInterval = setInterval(pulseAnimation, 100);
        
        // ⏱️ Timer de 10 segundos para regresar a casa
        returnTimeoutRef.current = setTimeout(() => {
          clearInterval(pulseInterval);
          returnToHome();
        }, 10000);
      }
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    
    // 🔒 Si está en cooldown (escapó hacia adentro), NO resetear - dejar que el timer lo haga
    if (isInCooldown.current) {
      return; // La tarjeta se queda en su posición escapada por 10 segundos
    }
    
    const card = cardRef.current;
    
    // 🏠 Animación de "regreso a casa" suave y elástica
    card.style.transition = 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.5s ease';
    card.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
    card.style.boxShadow = cardStyles.shadow ?? '0 8px 32px rgba(0, 0, 0, 0.1)';
    
    const border = card.querySelector('.card-border') as HTMLElement;
    if (border) {
      border.style.background = cardStyles.border ?? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      border.style.boxShadow = 'none';
    }
    
    // Reset todos los estados
    currentPosition.current = { x: 0, y: 0 };
    escapeCount.current = 0;
    isBouncingInward.current = false;
    
    // Restaurar transición rápida después de volver
    setTimeout(() => {
      if (card) {
        card.style.transition = 'transform 0.08s ease-out, box-shadow 0.25s ease';
      }
    }, 700);
  };

  // 🧹 Limpiar timeouts al desmontar el componente
  React.useEffect(() => {
    return () => {
      if (returnTimeoutRef.current) {
        clearTimeout(returnTimeoutRef.current);
      }
    };
  }, []);

  const iconData = getCurrentIcon(valueItem, theme);

  return (
    <div
      ref={cardRef}
      className={`relative rounded-2xl overflow-hidden value-card flex-shrink-0 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{
        animationDelay: `${index * 200 + 600}ms`,
        '--value-card-bg': cardStyles.background,
        background: 'transparent',
        boxShadow: cardStyles.shadow,
        width: `min(${getSafeStyle(cardStyles.cardMinWidth, '320px')}, 100%)`,
        maxWidth: getSafeStyle(cardStyles.cardMaxWidth, '100%'),
        minHeight: getSafeStyle(cardStyles.cardMinHeight, 'auto'),
        transition: 'transform 0.12s ease-out, box-shadow 0.3s ease, opacity 0.5s ease',
        zIndex: 10,
        cursor: 'default',
        willChange: 'transform'
      } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Border gradient con efecto glow */}
      <div 
        className="card-border absolute inset-0 rounded-2xl pointer-events-none transition-all duration-400"
        style={{
          background: cardStyles.border,
          borderRadius: '1rem',
          padding: cardStyles.borderWidth || '2px',
          transition: 'background 0.4s ease, box-shadow 0.4s ease'
        }}
      >
        <div 
          className="w-full h-full rounded-2xl"
          style={{
            background: cardStyles.background,
            borderRadius: `calc(1rem - ${cardStyles.borderWidth || '2px'})`
          }}
        />
      </div>
      
      {/* Contenido de la tarjeta - Sin animaciones de hover */}
      <div 
        className="relative z-10 h-full"
        style={{
          padding: getSafeStyle(cardStyles.cardPadding, '2rem')
        }}
      >
        {showIcons && iconData.type === 'image' && iconData.value && (
          <CardIcon
            iconData={iconData}
            cardStyles={cardStyles}
            title={valueItem.title}
          />
        )}

        {/* Título - Sin efecto hover */}
        <h3 
          className="text-xl font-bold mb-4 transition-colors duration-300"
          style={{ 
            color: getSafeStyle(
              valueItem.styles?.[theme]?.titleColor,
              cardStyles.titleColor ?? '#1f2937'
            ),
            textAlign: cardStyles.iconAlignment || 'left'
          }}
        >
          {cleanHtmlToText(valueItem.title)}
        </h3>

        {/* Descripción */}
        <p 
          className="text-sm leading-relaxed"
          style={{ 
            color: getSafeStyle(
              valueItem.styles?.[theme]?.descriptionColor,
              cardStyles.descriptionColor ?? '#6b7280'
            ),
            textAlign: cardStyles.iconAlignment || 'left',
            lineHeight: '1.6'
          }}
        >
          {cleanHtmlToText(valueItem.description)}
        </p>
      </div>
    </div>
  );
};
