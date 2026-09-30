import React, { useEffect, useRef, useState } from 'react';

/**
 * CustomCursor:
 * GPU-accelerated magnetic circular cursor with trailing easing and soft glow.
 * 
 * Features:
 * 1. Center dot (~8-10px) tracking instant mouse coordinates.
 * 2. Outer ring (~36px) trailing with smooth rAF lerp interpolation.
 * 3. Magnetic pull towards the center of hovered interactive elements.
 * 4. Outer ring expansion (scale 1.7x) + subtle blue/white glow on hover.
 * 5. Completely disabled on mobile and touch devices.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // 1. Detect if touch device or coarse pointer
    const isTouch = 
      typeof window !== 'undefined' && 
      (window.matchMedia('(pointer: coarse)').matches || 
       'ontouchstart' in window || 
       navigator.maxTouchPoints > 0);

    if (isTouch) {
      return; // Do not initialize on touch devices
    }

    setIsEnabled(true);
    document.body.classList.add('custom-cursor-active');

    // Positions & Lerp state (tracked without React re-renders for 60+ FPS performance)
    const mouse = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let targetX = -100;
    let targetY = -100;
    let targetScale = 1;
    let currentScale = 1;
    let isVisible = false;
    let hoveredElement = null;

    // Mouse move handler
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      isVisible = true;

      // Check if mouse is hovering over an interactive element
      const target = e.target.closest(
        'button, a, input, textarea, select, [role="button"], .hover-glow-lift, .cursor-pointer, [data-cursor-magnetic]'
      );

      if (target) {
        hoveredElement = target;
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Magnetic attraction: pull ring toward element center
        const magneticStrength = 0.32;
        targetX = mouse.x + (centerX - mouse.x) * magneticStrength;
        targetY = mouse.y + (centerY - mouse.y) * magneticStrength;
        targetScale = 1.75;
      } else {
        hoveredElement = null;
        targetX = mouse.x;
        targetY = mouse.y;
        targetScale = 1;
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
    };

    const handleMouseEnter = () => {
      isVisible = true;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });

    // Animation frame loop
    let animationFrameId;
    const renderLoop = () => {
      // Lerp ring position (smooth 0.16 delay)
      ring.x += (targetX - ring.x) * 0.18;
      ring.y += (targetY - ring.y) * 0.18;
      currentScale += (targetScale - currentScale) * 0.18;

      const dotEl = dotRef.current;
      const ringEl = ringRef.current;

      if (dotEl && ringEl) {
        const opacity = isVisible ? '1' : '0';
        dotEl.style.opacity = opacity;
        ringEl.style.opacity = opacity;

        // Instant dot positioning
        dotEl.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;

        // Smooth trailing ring with magnetic scale & glow
        ringEl.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${currentScale.toFixed(3)})`;

        if (hoveredElement) {
          ringEl.style.borderColor = 'rgba(18, 185, 242, 0.75)';
          ringEl.style.boxShadow = '0 0 20px rgba(18, 185, 242, 0.4), inset 0 0 10px rgba(7, 139, 232, 0.25)';
          ringEl.style.backgroundColor = 'rgba(18, 185, 242, 0.06)';
        } else {
          ringEl.style.borderColor = 'rgba(255, 255, 255, 0.45)';
          ringEl.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.15)';
          ringEl.style.backgroundColor = 'transparent';
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  if (!isEnabled) return null;

  return (
    <div 
      aria-hidden="true" 
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
    >
      {/* 1. Center Dot (~8px, light blue / white with soft glow) */}
      <div
        ref={dotRef}
        style={{ willChange: 'transform, opacity' }}
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(18,185,242,0.9)] pointer-events-none transition-opacity duration-200"
      />

      {/* 2. Trailing Outer Ring (~36px) with magnetic easing */}
      <div
        ref={ringRef}
        style={{ willChange: 'transform, opacity' }}
        className="fixed top-0 left-0 w-9 h-9 rounded-full border border-white/45 pointer-events-none transition-[border-color,box-shadow,background-color] duration-200 ease-out"
      />
    </div>
  );
}
