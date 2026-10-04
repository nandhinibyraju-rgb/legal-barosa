import React, { useMemo, useState, useEffect } from 'react';

/**
 * AnimatedIllustration:
 * Modular, reusable component for rendering SVG illustrations that contain
 * built-in CSS animations, keyframe transforms, and interactive classes.
 * 
 * Features:
 * - Smooth skeleton pulse & shimmer loader placeholder during asset load
 * - Soft opacity fade-in to prevent jarring layout shifts / blank flashes
 * - Enforces accessible role="img" and descriptive alt text
 */
export default function AnimatedIllustration({
  svgContent,
  className = '',
  alt = 'LegalBharosa animated legal advisory illustration',
  animateOnView = true,
  style = {},
}) {
  const [isReady, setIsReady] = useState(false);

  // Soft fade-in on mount / svg change
  useEffect(() => {
    setIsReady(false);
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 40);
    return () => clearTimeout(timer);
  }, [svgContent]);

  // Ensure the SVG string has the 'animated' class active so keyframes trigger
  const sanitizedSvg = useMemo(() => {
    if (!svgContent) return '';
    let svg = svgContent;
    if (animateOnView && !svg.includes('class="animated') && !svg.includes('class="animable')) {
      svg = svg.replace('<svg ', '<svg class="animated" ');
    }
    // Ensure responsive viewBox preservation
    if (!svg.includes('preserveAspectRatio')) {
      svg = svg.replace('<svg ', '<svg preserveAspectRatio="xMidYMid meet" ');
    }
    // Remove any background-simple halftone dotted pattern element
    if (svg.includes('background-simple')) {
      svg = svg.replace(/<g[^>]*id=["']background-simple["'][^>]*>[\s\S]*?<\/g>/gi, '');
    }
    return svg;
  }, [svgContent, animateOnView]);

  if (!svgContent) {
    return (
      <div 
        aria-hidden="true"
        className={`w-full h-full min-h-[220px] rounded-3xl animate-shimmer opacity-60 ${className}`} 
      />
    );
  }

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none overflow-visible ${className}`}>
      {/* Skeleton Shimmer Placeholder while loading */}
      {!isReady && (
        <div 
          aria-hidden="true"
          className="absolute inset-0 m-auto w-3/4 h-3/4 max-w-[340px] max-h-[340px] rounded-3xl animate-shimmer opacity-40 pointer-events-none transition-opacity duration-300"
        />
      )}

      {/* Actual SVG container with smooth opacity fade-in */}
      <div
        className={`w-full h-full flex items-center justify-center bg-transparent border-0 shadow-none outline-none overflow-visible [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:object-contain [&>svg]:block transition-opacity duration-400 ease-out ${
          isReady ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label={alt}
        role="img"
        style={style}
        dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
      />
    </div>
  );
}
