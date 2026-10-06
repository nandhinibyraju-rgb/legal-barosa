import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * CentralLogoReveal:
 * Premium Start-to-Finish LegalBharosa Logo Reveal Animation.
 * 
 * Phases:
 * - Phase 1 (Start): Logo completely hidden with no visible remnants.
 * - Phase 2 (Progressive reveal): Smooth left-to-right uncover using an animated clipping mask.
 * - Phase 3 (Brand highlight): Refined blue-and-gold light sweep + luminous leading-edge ray.
 * - Phase 4 (Finish): Full logo visible at original size/position + gentle, static warm gold glow.
 * 
 * Features:
 * - Total duration ~2.5s with cubic-bezier(0.22, 1, 0.36, 1) cinematic easing.
 * - Triggers once when the logo enters the viewport, staying permanently revealed afterward.
 * - Preserves exact original logo asset, size, proportions, and placement.
 * - Supports both desktop and mobile variants.
 * - Full support for `prefers-reduced-motion`.
 */
export default function CentralLogoReveal({ isMobile = false }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const [hasStarted, setHasStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const handler = (e) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener?.('change', handler);
      return () => mediaQuery.removeEventListener?.('change', handler);
    }
  }, []);

  // Trigger reveal animation once upon entering viewport
  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true);
      const timer = setTimeout(() => {
        setIsCompleted(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasStarted]);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center ${
        isMobile ? 'py-2' : 'p-2'
      }`}
    >
      {/* Outer Deep Atmospheric Glow: Balanced Warm Gold + Cyan Ambient Blend */}
      <div
        className={`absolute rounded-full pointer-events-none blur-2xl transition-opacity duration-1000 ${
          isMobile
            ? 'w-[230px] h-[230px] bg-[radial-gradient(circle,rgba(7,139,232,0.18)_0%,rgba(18,185,242,0.12)_35%,rgba(244,180,0,0.14)_60%,transparent_75%)]'
            : 'w-[290px] xl:w-[330px] h-[290px] xl:h-[330px] bg-[radial-gradient(circle,rgba(7,139,232,0.18)_0%,rgba(18,185,242,0.12)_35%,rgba(244,180,0,0.14)_60%,transparent_75%)]'
        } ${hasStarted ? 'opacity-100' : 'opacity-40'}`}
        aria-hidden="true"
      />

      {/* Desktop-only Orbit Rings */}
      {!isMobile && (
        <>
          {/* Extremely Slow Subtle Animated Light Ring */}
          <div
            aria-hidden="true"
            className="absolute w-[215px] xl:w-[250px] h-[215px] xl:h-[250px] rounded-full border border-dashed border-[#12B9F2]/25 pointer-events-none animate-spin-extremely-slow"
          />

          {/* Delicate Gold Micro-Accent Halo */}
          <div
            aria-hidden="true"
            className="absolute w-[198px] xl:w-[228px] h-[198px] xl:h-[228px] rounded-full border border-[#F4B400]/25 shadow-[0_0_24px_rgba(244,180,0,0.14)] pointer-events-none"
          />
        </>
      )}

      {/* Circular Disc Container: Steady during reveal, gentle ambient float after completion */}
      <motion.div
        animate={
          isCompleted && !prefersReducedMotion
            ? { y: [-3, 3, -3] }
            : { y: 0 }
        }
        transition={
          isCompleted && !prefersReducedMotion
            ? { duration: 6, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.3 }
        }
        className={`relative z-10 rounded-full bg-white/98 backdrop-blur-xl border-2 border-white flex flex-col items-center justify-center text-center select-none ${
          isMobile
            ? 'w-[170px] h-[170px] p-4'
            : 'w-[185px] xl:w-[215px] h-[185px] xl:h-[215px] p-5'
        } ${
          hasStarted
            ? 'logo-container-glow-active'
            : 'shadow-[0_14px_36px_rgba(6,45,120,0.1)]'
        }`}
      >
        {/* LOGO WRAPPER: Exact size of the logo, position relative, containing base image + sweep overlay */}
        <div
          className={`relative inline-block overflow-hidden ${
            isMobile ? 'w-[120px]' : 'w-[130px] xl:w-[155px]'
          }`}
        >
          {/* 1. Base LegalBharosa Logo Image with progressive left-to-right reveal */}
          <img
            src="/assets/legalbharosa-logo.png"
            alt="LegalBharosa Official Logo"
            className={`w-full h-auto object-contain select-none pointer-events-none drop-shadow-[0_4px_12px_rgba(11,42,91,0.12)] ${
              prefersReducedMotion
                ? 'opacity-100'
                : hasStarted
                  ? 'logo-reveal-active'
                  : 'logo-reveal-pending'
            }`}
          />

          {/* 2. Brand Highlight Light Sweep (Blue + Gold Light Sweep across logo) */}
          {!prefersReducedMotion && hasStarted && (
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none overflow-hidden select-none"
            >
              {/* Refined Blue and Gold Traveling Luminous Beam */}
              <div
                className="absolute top-0 bottom-0 w-[55%] pointer-events-none logo-sweep-active -translate-x-1/2"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(22, 140, 255, 0.28) 25%, rgba(244, 180, 0, 0.58) 50%, rgba(255, 255, 255, 0.95) 65%, rgba(244, 180, 0, 0.58) 80%, rgba(22, 140, 255, 0.22) 92%, transparent 100%)',
                  mixBlendMode: 'color-dodge',
                  filter: 'blur(1.5px)',
                }}
              />

              {/* Precise Leading-Edge Luminous Ray traversing with the reveal boundary */}
              <div
                className="absolute top-0 bottom-0 w-[2.5px] pointer-events-none logo-edge-active -translate-x-1/2"
                style={{
                  background:
                    'linear-gradient(180deg, transparent 0%, rgba(22,140,255,0.8) 20%, rgba(244,180,0,1) 50%, rgba(255,255,255,1) 60%, rgba(244,180,0,1) 70%, rgba(22,140,255,0.8) 80%, transparent 100%)',
                  boxShadow:
                    '0 0 10px rgba(244,180,0,0.85), 0 0 18px rgba(22,140,255,0.65)',
                }}
              />
            </div>
          )}
        </div>

        {/* 3. Subtitle Badge: Resolution Hub (Fades in gently at finish) */}
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50/90 border border-[#078BE8]/25 font-semibold tracking-wider uppercase text-[#0646A8] shadow-2xs ${
            isMobile ? 'text-[8.5px] mt-1.5' : 'text-[9px] mt-2'
          } ${
            prefersReducedMotion
              ? 'opacity-100'
              : hasStarted
                ? 'logo-badge-active'
                : 'opacity-0'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#078BE8] animate-pulse" />
          Resolution Hub
        </div>
      </motion.div>
    </div>
  );
}
