import React, { useState } from 'react';

/**
 * ImageWithSkeleton:
 * Smooth skeleton loader and soft opacity fade-in wrapper for HTML images.
 * Prevents jarring blank flashes while images load on slower network connections.
 */
export default function ImageWithSkeleton({
  src,
  alt = 'LegalBharosa visual asset',
  className = '',
  skeletonClassName = '',
  loading = 'lazy',
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Shimmer skeleton placeholder */}
      {!isLoaded && (
        <div 
          aria-hidden="true" 
          className={`absolute inset-0 w-full h-full animate-shimmer rounded-inherit z-0 ${skeletonClassName}`} 
        />
      )}

      {/* Actual image with soft opacity fade-in */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-400 ease-out relative z-10 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
}
