import React from 'react';

/**
 * CardBorderTrace
 * Subtle glowing border trace that activates ONLY on hover.
 * When idle:
 * - Opacity is 0 and animation is paused (zero colored border lines, zero looping).
 * When hovered (via parent .group):
 * - Smoothly fades in and runs the travelling beam (Dark Navy -> Bright Blue -> Gold -> Bright Blue).
 * When unhovered:
 * - Smoothly fades out and pauses, returning card to clean normal state.
 */
export default function CardBorderTrace({ 
  delay = 0, 
  strokeWidth = 1.5,
  duration = 4.5 
}) {
  return (
    <div 
      aria-hidden="true" 
      className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{
        padding: `${strokeWidth}px`,
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
      }}
    >
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350%] aspect-square [animation-play-state:paused] group-hover:[animation-play-state:running]"
        style={{
          background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 260deg, #0B2A5B 285deg, #168CFF 315deg, #F4B400 345deg, #168CFF 355deg, transparent 360deg)',
          animation: `borderTraceRotate ${duration}s linear infinite`,
          animationDelay: `-${delay}s`,
          filter: 'drop-shadow(0 0 2px rgba(22,140,255,0.7)) drop-shadow(0 0 4px rgba(244,180,0,0.5))',
        }}
      />
    </div>
  );
}
// Final submission update
