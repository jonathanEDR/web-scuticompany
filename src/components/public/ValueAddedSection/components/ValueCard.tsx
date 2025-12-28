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

  // ✨ Animación sutil de hover - Elevación suave
  const handleMouseEnter = () => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const border = card.querySelector('.card-border') as HTMLElement;

    // Elevación sutil con sombra suave
    card.style.transform = 'translateY(-8px)';
    card.style.boxShadow = cardStyles.hoverShadow || '0 20px 40px rgba(139, 92, 246, 0.15)';

    if (border) {
      border.style.background = cardStyles.hoverBorder || 'linear-gradient(135deg, #8B5CF6, #06B6D4)';
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const border = card.querySelector('.card-border') as HTMLElement;

    // Regresar a posición original
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = cardStyles.shadow || '0 8px 16px rgba(0, 0, 0, 0.1)';

    if (border) {
      border.style.background = cardStyles.border || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

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
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, opacity 0.5s ease',
        zIndex: 10,
        cursor: 'pointer',
        willChange: 'transform'
      } as React.CSSProperties}
      onMouseEnter={handleMouseEnter}
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
