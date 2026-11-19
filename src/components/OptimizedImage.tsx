import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  aspectRatio?: number;
  priority?: boolean;
  fallbackText?: string;
  fit?: 'contain' | 'cover';
  width?: number | string;
  height?: number | string;
}

/**
 * Safely encode image URLs handling spaces and special characters
 * without double-encoding existing %20 sequences.
 */
export const safeEncodeUrl = (url: string): string => {
  if (!url) return '';
  try {
    return encodeURI(decodeURI(url));
  } catch {
    return encodeURI(url);
  }
};

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  fallbackSrc,
  alt,
  className = '',
  imageClassName = '',
  aspectRatio,
  priority = false,
  fallbackText = 'DESIGNS SHOPEE',
  fit = 'contain',
  width,
  height
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Synchronize state when src prop changes
  useEffect(() => {
    setCurrentSrc(src);
    setTriedFallback(false);
    setHasError(false);

    // Immediate check if this image is already cached & complete in browser memory
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [src]);

  // Synchronous callback ref to catch instant cache-hits on mount before onLoad fires
  const setImgRef = useCallback((node: HTMLImageElement | null) => {
    imgRef.current = node;
    if (node && node.complete && node.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    if (fallbackSrc && !triedFallback && currentSrc !== fallbackSrc) {
      setTriedFallback(true);
      setCurrentSrc(fallbackSrc);
      setIsLoaded(false);
    } else {
      setHasError(true);
      setIsLoaded(true); // stop skeleton
    }
  };

  const encodedSrc = safeEncodeUrl(currentSrc);

  return (
    <div 
      className={`relative overflow-hidden flex items-center justify-center ${className}`}
      style={aspectRatio ? { aspectRatio: `${aspectRatio}` } : undefined}
    >
      {/* Skeleton Shimmer: visible while loading; unmounts immediately once loaded */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 skeleton-shimmer z-0 pointer-events-none transition-opacity duration-300" 
          aria-hidden="true"
        />
      )}

      {/* Graceful Branded Fallback if genuine image failure */}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-[#F5EEDC]/40 border border-[#E8DEC8] rounded-2xl z-10 select-none">
          <div className="w-10 h-10 rounded-xl bg-[#F5EEDC] text-brand-green flex items-center justify-center mb-1.5 border border-[#E8DEC8]">
            <Sparkles className="w-5 h-5 text-[#C6A15B]" />
          </div>
          <span className="text-[11px] font-bold text-[#262626] line-clamp-1">{fallbackText}</span>
          <span className="text-[10px] text-[#262626]/60">DESIGNS SHOPEE</span>
        </div>
      ) : (
        <img
          ref={setImgRef}
          src={encodedSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full relative z-10 ${
            fit === 'contain' ? 'object-contain' : 'object-cover'
          } transition-all duration-200 ${imageClassName} ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-95 scale-[0.99]'
          }`}
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
