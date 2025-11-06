/**
 * 🎯 SuggestionRating Component
 * Componente para calificar la calidad de las sugerencias AI
 */

import React, { useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';

interface SuggestionRatingProps {
  onRating: (rating: number) => void;
  className?: string;
}

export const SuggestionRating: React.FC<SuggestionRatingProps> = ({ onRating, className = '' }) => {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    setSubmitted(true);
    onRating(rating);
    
    // Auto-ocultar después de 2 segundos
    setTimeout(() => {
      setSubmitted(false);
      setSelectedRating(0);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className={`flex items-center gap-2 text-green-600 dark:text-green-400 ${className}`}>
        <ThumbsUp className="w-4 h-4" />
        <span className="text-sm font-medium">¡Gracias por tu feedback!</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="text-xs text-gray-600 dark:text-gray-400 mr-2">Calificar:</span>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRatingClick(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
          className="p-1 hover:scale-110 transition-transform"
        >
          <Star
            className={`w-4 h-4 transition-colors ${
              star <= (hoveredRating || selectedRating)
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
};