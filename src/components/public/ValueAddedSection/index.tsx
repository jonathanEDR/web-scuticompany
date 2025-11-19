import { useTheme } from '../../../contexts/ThemeContext';
import type { ValueAddedSectionProps } from './types';
import { useValueAddedData } from './hooks/useValueAddedData';
import { useAnimations } from './hooks/useAnimations';
import { useCarousel } from './hooks/useCarousel';
import { BackgroundImage } from './components/BackgroundImage';
import { SectionHeader } from './components/SectionHeader';
import { LogosSection } from './components/LogosSection';
import { ValueCard } from './components/ValueCard';
import { NavigationArrows } from './components/NavigationArrows';
import './styles/animations.css';

const ValueAddedSection = ({ data }: ValueAddedSectionProps) => {
  const { theme } = useTheme();
  const { isVisible } = useAnimations();
  const { mappedData, cardStyles, currentBackgroundImage, valueItems } = useValueAddedData(data, theme);
  
  // Hook del carrusel
  const {
    currentSlide,
    slidesToShow,
    maxSlide,
    goToNext,
    goToPrev,
    goToSlide,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    pauseAutoPlay,
    resumeAutoPlay,
    carouselRef
  } = useCarousel({
    totalItems: valueItems.length,
    autoPlayInterval: 3000, // ⚡ 3 segundos (más rápido)
    autoPlayEnabled: true
  });

  return (
    <section 
      className="relative py-32 theme-transition overflow-hidden w-full"
      style={{
        background: `linear-gradient(to bottom, color-mix(in srgb, var(--color-card-bg) 95%, var(--color-primary)), var(--color-card-bg))`,
        minHeight: '70vh'
      }}
    >
      <BackgroundImage 
        imageUrl={currentBackgroundImage} 
        alt={mappedData.backgroundImageAlt} 
      />

      {/* Burbujas flotantes en toda la sección */}
      <LogosSection logos={mappedData.logos || []} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={mappedData.title}
          subtitle={mappedData.subtitle}
          theme={theme}
          isVisible={isVisible}
        />

        {/* Contenedor del carrusel */}
        <div 
          ref={carouselRef}
          className="relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={pauseAutoPlay}
          onMouseLeave={resumeAutoPlay}
        >
          <div 
            className="flex transition-transform duration-700 ease-in-out gap-8"
            style={{
              transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)`,
            }}
          >
            {valueItems.map((valueItem, index) => {
              // Generar key única robusta - manejar MongoDB ObjectId
              let itemId: string | null = null;
              if (valueItem._id) {
                if (typeof valueItem._id === 'string') {
                  itemId = valueItem._id;
                } else if (valueItem._id && typeof valueItem._id === 'object') {
                  // Intentar múltiples formas de extraer el ID
                  const idObj = valueItem._id as any;
                  if (idObj.$oid) {
                    itemId = idObj.$oid;
                  } else if (typeof idObj.toString === 'function' && idObj.toString() !== '[object Object]') {
                    itemId = idObj.toString();
                  } else if (idObj.id) {
                    itemId = String(idObj.id);
                  }
                  // Si no se pudo extraer, itemId queda null y se usa el fallback
                } else {
                  itemId = String(valueItem._id);
                }
              } else if (valueItem.id) {
                if (typeof valueItem.id === 'string') {
                  itemId = valueItem.id;
                } else if (valueItem.id && typeof valueItem.id === 'object') {
                  const idObj = valueItem.id as any;
                  if (idObj.$oid) {
                    itemId = idObj.$oid;
                  } else if (typeof idObj.toString === 'function' && idObj.toString() !== '[object Object]') {
                    itemId = idObj.toString();
                  } else if (idObj.id) {
                    itemId = String(idObj.id);
                  }
                } else {
                  itemId = String(valueItem.id);
                }
              }
              
              // Key estable que no cambia entre renders
              const titleSlug = valueItem.title?.toLowerCase().replace(/\s+/g, '-').slice(0, 30) || 'item';
              const uniqueKey = itemId || `value-card-${titleSlug}-${index}`;
              
              return (
                <div
                  key={uniqueKey}
                  className="flex-shrink-0 carousel-card"
                  style={{
                    width: `calc(${100 / slidesToShow}% - ${(slidesToShow - 1) * 2}rem / ${slidesToShow})`
                  }}
                >
                  <ValueCard
                    valueItem={valueItem}
                    theme={theme}
                    cardStyles={cardStyles}
                    showIcons={mappedData.showIcons !== false}
                    index={index}
                    isVisible={isVisible}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicadores de slide */}
        {valueItems.length > slidesToShow && (
          <div className="flex justify-center gap-2 mt-8 mb-4">
            {Array.from({ length: maxSlide + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 slide-indicator ${
                  currentSlide === index ? 'active w-8 bg-purple-600' : 'w-2 bg-gray-400 hover:bg-purple-400'
                }`}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        <NavigationArrows 
          onPrev={goToPrev}
          onNext={goToNext}
          canGoPrev={valueItems.length > slidesToShow}
          canGoNext={valueItems.length > slidesToShow}
        />
      </div>
    </section>
  );
};

export default ValueAddedSection;
