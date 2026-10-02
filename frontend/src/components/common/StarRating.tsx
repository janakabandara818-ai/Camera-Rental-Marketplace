import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  count?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  count,
  showScore = true,
  size = 'sm'
}) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const filled = rating >= starIndex;
          const half = !filled && rating >= starIndex - 0.5;

          return (
            <Star
              key={starIndex}
              className={`${iconSizes[size]} ${
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : half
                  ? 'fill-amber-400/50 text-amber-400'
                  : 'text-gray-600 fill-transparent'
              }`}
            />
          );
        })}
      </div>
      {showScore && (
        <span className={`font-mono font-medium text-gray-300 tabular-nums ${textSizes[size]}`}>
          {rating.toFixed(1)}
        </span>
      )}
      {typeof count === 'number' && (
        <span className={`text-gray-500 ${textSizes[size]}`}>
          ({count})
        </span>
      )}
    </div>
  );
};
