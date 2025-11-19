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
        className="w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
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
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    element.style.background = 'transparent';
    element.style.boxShadow = cardStyles.hoverShadow;
    element.style.transform = 'translateY(-8px) scale(1.02)';
    
    const border = element.querySelector('.card-border') as HTMLElement;
    if (border) border.style.background = cardStyles.hoverBorder;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    element.style.background = 'transparent';
    element.style.boxShadow = cardStyles.shadow;
    element.style.transform = 'translateY(0) scale(1)';
    
    const border = element.querySelector('.card-border') as HTMLElement;
    if (border) border.style.background = cardStyles.border;
  };

  const iconData = getCurrentIcon(valueItem, theme);

  return (
    <div
      className={`group relative rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-2 overflow-hidden value-card flex-shrink-0 transition-all duration-1000 ${
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
        transition: 'all 0.3s ease',
        zIndex: 10
      } as React.CSSProperties}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Border gradient */}
      <div 
        className="card-border absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300"
        style={{
          background: cardStyles.border,
          borderRadius: '1rem',
          padding: cardStyles.borderWidth || '2px'
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
      
      {/* Contenido de la tarjeta */}
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

        {/* Título */}
        <h3 
          className="text-xl font-bold mb-4 group-hover:scale-105 transition-all duration-300"
          style={{ 
            color: getSafeStyle(
              valueItem.styles?.[theme]?.titleColor,
              cardStyles.titleColor
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
              cardStyles.descriptionColor
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
