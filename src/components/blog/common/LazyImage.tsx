/**
 * 🖼️ LazyImage Component
 * Carga diferida de imágenes con placeholder
 */

import { useState, useRef, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function LazyImage({
  src,
  alt,
  className = '',
  placeholderClassName = '',
  fallbackSrc = '/images/blog-placeholder.jpg',
  onLoad,
  onError
}: LazyImageProps) {
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isInView) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Comenzar a cargar 50px antes
      }
    );

    if (placeholderRef.current) {
      observer.observe(placeholderRef.current);
    }

    return () => observer.disconnect();
  }, [isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div 
      ref={placeholderRef}
      className={`lazy-image-container relative overflow-hidden ${className}`}
    >
      {/* Placeholder mientras carga */}
      {!isLoaded && (
        <div className={`
          lazy-image-placeholder
          flex items-center justify-center bg-gray-100 dark:bg-gray-800 
          animate-pulse transition-opacity duration-300
          ${placeholderClassName}
          ${isLoaded ? 'opacity-0' : 'opacity-100'}
        `}>
          <ImageIcon className="text-gray-400 dark:text-gray-600" size={48} />
        </div>
      )}

      {/* Imagen real */}
      {isInView && (
        <img
          ref={imgRef}
          src={hasError ? fallbackSrc : src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
          className={`
            transition-opacity duration-500 ease-in-out
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
            ${!isLoaded ? 'absolute inset-0' : ''}
            ${className}
          `}
        />
      )}
    </div>
  );
}