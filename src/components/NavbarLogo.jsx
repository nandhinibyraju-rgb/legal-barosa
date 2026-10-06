import React, { useRef, useState, useEffect, useId } from 'react';

/**
 * NavbarLogo:
 * Continuous Inch-by-Inch Path Drawing Animation with 5-Second Loop
 * for the LegalBharosa Navbar Brand Mark.
 *
 * Sequence (5-Second Full Cycle):
 * 1. 0.0s - 2.8s:
 *    - Starts from bottom-left root tip (14, 162).
 *    - Travels inch-by-inch up the vertical spine, arches over the crown,
 *      flows down into the central pillar & scales of justice, curves around the upper lobe,
 *      tucks into the waist, sweeps the lower lobe, arches the base, and sweeps along
 *      the golden hand to the opposite golden tip (188, 121).
 *    - A luminous pen / leading light tracer follows the leading edge (cyan transitioning to gold).
 * 2. 2.2s - 2.9s:
 *    - "LegalBharosa.org" text reveals smoothly from left to right as the mark completes.
 * 3. 2.9s - 4.75s:
 *    - Complete pristine logo displayed stably for ~1.85s.
 * 4. 4.75s - 5.0s:
 *    - Smooth 250ms fade reset back to initial state, seamlessly starting the next cycle from tip (14, 162).
 *
 * Constraints & Guarantees:
 * - Respects prefers-reduced-motion (shows complete static logo immediately).
 * - Exact dimensions, classes, and hover effects matching the original brand mark.
 * - Hardware accelerated requestAnimationFrame with direct DOM manipulation.
 */
export default function NavbarLogo() {
  const uniqueId = useId().replace(/:/g, '_');
  const maskId = `lb-nav-mask-${uniqueId}`;
  const glowFilterId = `lb-glow-filter-${uniqueId}`;

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const svgRef = useRef(null);
  const strokeRef = useRef(null);
  const textMaskRef = useRef(null);
  const lightTipRef = useRef(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setPrefersReducedMotion(true);
      }
      const handler = (e) => {
        setPrefersReducedMotion(e.matches);
      };
      mediaQuery.addEventListener?.('change', handler);
      return () => mediaQuery.removeEventListener?.('change', handler);
    }
  }, []);

  // Continuous 5-Second Loop Animation
  useEffect(() => {
    if (prefersReducedMotion) return;

    const svg = svgRef.current;
    const stroke = strokeRef.current;
    const textMask = textMaskRef.current;
    const lightTip = lightTipRef.current;

    if (!svg || !stroke || !textMask || !lightTip) return;

    const totalLen = stroke.getTotalLength();
    stroke.style.strokeDasharray = `${totalLen}`;
    stroke.style.strokeDashoffset = `${totalLen}`;

    const CYCLE_MS = 5000;
    const DRAW_MS = 2800;
    const TEXT_START_MS = 2200;
    const TEXT_END_MS = 2900;
    const FADE_START_MS = 4750;

    let animFrameId = null;
    let startTime = null;

    const loopFrame = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) % CYCLE_MS;

      // 1. Drawing B Stroke inch-by-inch
      if (elapsed <= DRAW_MS) {
        const bProgress = elapsed / DRAW_MS;
        stroke.style.strokeDashoffset = `${totalLen * (1 - bProgress)}`;

        // Position luminous light trace along the leading tip
        const pt = stroke.getPointAtLength(totalLen * bProgress);
        lightTip.setAttribute('cx', String(pt.x));
        lightTip.setAttribute('cy', String(pt.y));
        lightTip.style.opacity = '1';

        // Transition light color from bright cyan to warm gold as it enters the gold hand section
        if (bProgress > 0.72) {
          lightTip.setAttribute('fill', '#F4B400');
        } else {
          lightTip.setAttribute('fill', '#12B9F2');
        }
      } else {
        stroke.style.strokeDashoffset = '0';
        lightTip.style.opacity = '0';
      }

      // 2. Smooth directional wipe for 'LegalBharosa.org' text
      if (elapsed < TEXT_START_MS) {
        textMask.setAttribute('width', '0');
      } else if (elapsed <= TEXT_END_MS) {
        const tProgress = (elapsed - TEXT_START_MS) / (TEXT_END_MS - TEXT_START_MS);
        textMask.setAttribute('width', String(505 * tProgress));
      } else {
        textMask.setAttribute('width', '505');
      }

      // 3. Smooth Reset Phase (last 250ms of the 5s cycle)
      if (elapsed >= FADE_START_MS) {
        const fadeProgress = (elapsed - FADE_START_MS) / (CYCLE_MS - FADE_START_MS);
        svg.style.opacity = String(1 - fadeProgress);
      } else {
        svg.style.opacity = '1';
      }

      animFrameId = requestAnimationFrame(loopFrame);
    };

    animFrameId = requestAnimationFrame(loopFrame);

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [prefersReducedMotion]);

  // If user prefers reduced motion, render complete static image asset
  if (prefersReducedMotion) {
    return (
      <img
        src="/assets/legalbharosa-horizontal.png"
        alt="LegalBharosa — Trust. Support. Solutions."
        className="h-7.5 sm:h-11 md:h-12 max-w-[125px] sm:max-w-none w-auto object-contain shrink-0 transition-all duration-300 ease-out group-hover:brightness-[1.04] group-hover:drop-shadow-[0_2px_10px_rgba(18,185,242,0.22)]"
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
      ref={svgRef}
      viewBox="0 0 700 180"
      className="h-7.5 sm:h-11 md:h-12 max-w-[125px] sm:max-w-none w-auto object-contain shrink-0 transition-all duration-300 ease-out group-hover:brightness-[1.04] group-hover:drop-shadow-[0_2px_10px_rgba(18,185,242,0.22)] overflow-visible"
      aria-label="LegalBharosa — Trust. Support. Solutions."
      role="img"
    >
      <defs>
        {/* Soft glow filter for the luminous pen tracer */}
        <filter id={glowFilterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Dynamic Architectural Path Drawing Mask */}
        <mask id={maskId}>
          <rect width="700" height="180" fill="black" />

          {/* Unified continuous stroke path revealing the mark inch-by-inch */}
          <path
            ref={strokeRef}
            d={unifiedPathD}
            fill="none"
            stroke="white"
            strokeWidth="32"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Directional wipe mask for 'LegalBharosa.org' text */}
          <rect
            ref={textMaskRef}
            x="195"
            y="0"
            width="0"
            height="180"
            fill="white"
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

      {/* Luminous Leading-Edge Pen / Tracer following the path */}
      <circle
        ref={lightTipRef}
        r="5.5"
        fill="#12B9F2"
        filter={`url(#${glowFilterId})`}
        style={{ opacity: 0 }}
      />
    </svg>
  );
}
