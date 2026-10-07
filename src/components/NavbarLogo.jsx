import React, { useState, useEffect, useId } from 'react';

/**
 * NavbarLogo:
 * Continuous Inch-by-Inch Path Drawing Animation with 5-Second Loop
 * for the LegalBharosa Navbar Brand Mark.
 *
 * Performance-Optimized Architecture:
 * - Pure Declarative SVG & Hardware-Accelerated CSS Keyframe Animation
 * - Zero JavaScript requestAnimationFrame loops or frame-by-frame DOM mutations
 * - Zero expensive SVG blur filter re-computations on mobile/desktop
 * - Smooth 5-Second Cycle:
 *   1. 0.0s - 2.8s: Progressive inch-by-inch stroke reveal of the mark (root tip to gold hand)
 *      with luminous cyan tracer following the leading edge natively.
 *   2. 2.2s - 2.9s: Smooth directional text reveal of "LegalBharosa.org"
 *   3. 2.9s - 4.75s: Complete logo displayed stably with full clarity
 *   4. 4.75s - 5.0s: Smooth fade reset seamlessly transitioning to the next cycle
 * - Robust mobile sizing: Uses explicit SVG dimensions & responsive CSS ensuring
 *   crisp rendering at 320px, 375px, 390px, 430px, tablet, and desktop without collapsing.
 * - Full support for prefers-reduced-motion (shows static brand mark).
 */
export default function NavbarLogo() {
  const uniqueId = useId().replace(/:/g, '_');
  const maskId = `lb-nav-mask-${uniqueId}`;
  const strokePathId = `lb-stroke-path-${uniqueId}`;

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setPrefersReducedMotion(true);
      }
      const handler = (e) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener?.('change', handler);
      return () => mediaQuery.removeEventListener?.('change', handler);
    }
  }, []);

  // If user prefers reduced motion, render complete static image asset
  if (prefersReducedMotion) {
    return (
      <img
        src="/assets/legalbharosa-horizontal.png"
        alt="LegalBharosa — Trust. Support. Solutions."
        width="700"
        height="180"
        className="h-[32px] xs:h-[36px] sm:h-11 md:h-12 w-auto max-w-[135px] xs:max-w-[155px] sm:max-w-none object-contain shrink-0 transition-all duration-300 ease-out group-hover:brightness-[1.04]"
      />
    );
  }

  // Unified single continuous path covering the full emblem:
  // Root tip (14, 162) -> Left Spine -> Crown -> Pillar -> Scales & Pans -> Upper Lobe -> Waist -> Lower Lobe -> Base -> Gold Hand -> Tip (188, 121)
  const unifiedPathD = `
    M 14 162
    L 14 38
    C 14 16, 32 6, 80 5
    L 80 118
    L 80 50
    L 42 50
    L 48 50
    L 48 95
    C 40 95, 40 106, 48 106
    C 56 106, 56 95, 48 95
    L 42 50
    L 118 50
    L 112 50
    L 112 95
    C 104 95, 104 106, 112 106
    C 120 106, 120 95, 112 95
    L 118 50
    L 80 50
    L 80 5
    C 125 5, 172 16, 172 45
    C 172 65, 145 74, 110 74
    C 148 74, 188 88, 188 116
    C 188 142, 150 174, 105 175
    C 65 176, 35 168, 35 160
    C 65 152, 130 148, 188 121
  `;

  return (
    <svg
      viewBox="0 0 700 180"
      width="700"
      height="180"
      style={{ aspectRatio: '700/180' }}
      className="lb-nav-svg-anim h-[32px] xs:h-[36px] sm:h-11 md:h-12 w-auto max-w-[135px] xs:max-w-[155px] sm:max-w-none object-contain shrink-0 transition-all duration-300 ease-out group-hover:brightness-[1.04] overflow-visible"
      aria-label="LegalBharosa — Trust. Support. Solutions."
      role="img"
    >
      <defs>
        {/* Dynamic Architectural Path Drawing Mask */}
        <mask id={maskId}>
          <rect width="700" height="180" fill="black" />

          {/* Continuous stroke path revealing the B emblem inch-by-inch */}
          <path
            id={strokePathId}
            d={unifiedPathD}
            pathLength="1000"
            fill="none"
            stroke="white"
            strokeWidth="32"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lb-nav-stroke-anim"
          />

          {/* Directional wipe mask for 'LegalBharosa.org' text */}
          <rect
            x="195"
            y="0"
            width="505"
            height="180"
            fill="white"
            className="lb-nav-text-anim"
          />
        </mask>
      </defs>

      {/* Target Logo Asset Under Dynamic Mask */}
      <image
        href="/assets/legalbharosa-horizontal.png"
        width="700"
        height="180"
        mask={`url(#${maskId})`}
      />

      {/* Luminous Leading-Edge Pen / Tracer following the path natively with 0 JS overhead */}
      <circle
        r="5.5"
        fill="#12B9F2"
        className="lb-nav-tracer-anim"
        style={{
          filter: 'drop-shadow(0 0 5px rgba(18, 185, 242, 0.9))',
        }}
      >
        <animateMotion
          dur="5s"
          repeatCount="indefinite"
          keyTimes="0; 0.56; 1"
          keyPoints="0; 1; 1"
          calcMode="linear"
        >
          <mpath href={`#${strokePathId}`} />
        </animateMotion>
      </circle>
    </svg>
  );
}
// Final submission update
