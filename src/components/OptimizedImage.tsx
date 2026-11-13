import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  aspectRatio?: number;
  priority?: boolean;
  sizes?: string;
  fallbackText?: string;
  fit?: 'contain' | 'cover';
  width?: number | string;
  height?: number | string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  fallbackSrc,
  alt,
  className = '',
  imageClassName = '',
  aspectRatio,
  priority = false,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
  fallbackText = 'DESIGNS SHOPEE',
  fit = 'contain',
  width,
  height
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);

  // If primary src fails (e.g. WebP), try fallbackSrc (e.g. original JPEG)
  const handleError = () => {
    if (fallbackSrc && !triedFallback && currentSrc !== fallbackSrc) {
      setTriedFallback(true);
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  return (
    <div 
      className={`relative overflow-hidden flex items-center justify-center ${className}`}
      style={aspectRatio ? { aspectRatio: `${aspectRatio}` } : undefined}
    >
      {/* Skeleton Shimmer Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 skeleton-shimmer z-0 pointer-events-none" />
      )}

      {/* Graceful Branded Fallback if image fails (never a broken-image icon) */}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-gray-50 border border-gray-150 rounded-2xl z-10 select-none">
          <div className="w-10 h-10 rounded-xl bg-orange-100/60 text-brand-orange flex items-center justify-center mb-1.5">
            <Sparkles className="w-5 h-5 text-brand-orange" />
          </div>
          <span className="text-[11px] font-bold text-brand-dark line-clamp-1">{fallbackText}</span>
          <span className="text-[10px] text-gray-400">Showroom Item</span>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          sizes={sizes}
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          className={`w-full h-full ${
            fit === 'contain' ? 'object-contain' : 'object-cover'
          } transition-all duration-300 ${imageClassName} ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-98'
          }`}
          style={{ maxWidth: '94%', maxHeight: '94%' }}
        />
      )}
    </div>
  );
};
