import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

/**
 * ResolutionProcessDeck:
 * Premium interactive stacked card deck for the "Step-by-Step Resolution Process" section.
 * Replaces the static 6-card grid across all LegalBharosa service detail pages.
 * 
 * Features:
 * - Physical 3-layer card deck (Front active card, Second peeking card, Third subtle edge card).
 * - Smooth physical flip/advance transition (lift forward, slide to side, subtle rotation, move behind).
 * - Continuous subtle idle floating animation (slow 4.5s loop with breathing shadow).
 * - Elegant soft cyan/blue outer glow with gold accent on the step badge.
 * - Left/Right navigation buttons with accessible labels.
 * - Dynamic progress indicators ("01 / 06" and interactive progress dots).
 * - Full keyboard navigation (ArrowLeft / ArrowRight).
 * - Mobile touch swipe support.
 * - Zero modification of existing step titles, descriptions, or order.
 */
export default function ResolutionProcessDeck({ 
  steps = [], 
  serviceTitle = 'Service' 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next (right), -1 = prev (left)
  const [isAnimating, setIsAnimating] = useState(false);

  const totalSteps = steps.length;

  // Mobile Touch Swipe Handling
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Next step handler
  const handleNext = () => {
    if (isAnimating || !totalSteps) return;
    setIsAnimating(true);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalSteps);
  };

  // Previous step handler
  const handlePrev = () => {
    if (isAnimating || !totalSteps) return;
    setIsAnimating(true);
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalSteps) % totalSteps);
  };

  // Jump to specific step
  const handleGoTo = (index) => {
    if (isAnimating || index === currentIndex || !totalSteps) return;
    setIsAnimating(true);
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!totalSteps) return;
    const handleKeyDown = (e) => {
      // Avoid intercepting when user is typing in form inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!totalSteps) return null;

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      handleNext();
    } else if (distance < -45) {
      handlePrev();
    }
  };

  // Current, Second, and Third card models from existing data
  const currentStep = steps[currentIndex];
  const secondIndex = (currentIndex + 1) % totalSteps;
  const secondStep = steps[secondIndex];
  const thirdIndex = (currentIndex + 2) % totalSteps;
  const thirdStep = steps[thirdIndex];

  // Easing curve for premium fluid physical card movement
  const deckEasing = [0.22, 1, 0.36, 1];

  return (
    <div className="w-full flex flex-col items-center select-none py-2 relative overflow-hidden">
      
      {/* ======================================================== */}
      {/* MAIN CARD STACK CONTAINER + FLANKING ARROWS             */}
      {/* ======================================================== */}
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 flex items-center justify-center gap-3 sm:gap-6 relative">
        
        {/* LEFT NAVIGATION ARROW */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous step"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-[#0B2A5B] text-[#0B2A5B] hover:text-white border border-neutral-200/90 hover:border-[#168CFF]/50 shadow-md hover:shadow-lg flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0 z-40 focus:outline-none focus:ring-2 focus:ring-[#168CFF]/40"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* STACKED CARDS STAGE */}
        <div 
          className="relative w-full max-w-[580px] min-h-[340px] sm:min-h-[320px] flex items-center justify-center"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          
          {/* ---------------------------------------------------- */}
          {/* 3RD CARD (Subtlest, deepest edge behind the stack)  */}
          {/* ---------------------------------------------------- */}
          {totalSteps > 2 && (
            <div 
              aria-hidden="true"
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[88%] sm:w-[90%] -translate-y-7 sm:-translate-y-8 z-10 pointer-events-none transition-all duration-500 ease-out"
            >
              <div className="w-full h-[280px] sm:h-[260px] rounded-2xl sm:rounded-3xl bg-slate-100/80 border border-neutral-300/60 shadow-xs flex items-start justify-between px-6 pt-2.5 opacity-40 scale-[0.88]">
                <span className="text-[10px] font-mono font-bold text-neutral-400">
                  STEP {thirdStep.step}
                </span>
                <span className="text-[9.5px] font-mono text-neutral-400 uppercase truncate max-w-[150px]">
                  {thirdStep.title}
                </span>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* 2ND CARD (Slightly smaller, offset, partially visible)*/}
          {/* ---------------------------------------------------- */}
          {totalSteps > 1 && (
            <div 
              aria-hidden="true"
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[94%] sm:w-[95%] -translate-y-3.5 sm:-translate-y-4 z-20 pointer-events-none transition-all duration-500 ease-out"
            >
              <div className="w-full h-[300px] sm:h-[285px] rounded-2xl sm:rounded-3xl bg-slate-50/90 border border-neutral-300/80 shadow-md flex items-start justify-between px-6 pt-2.5 opacity-75 scale-[0.94]">
                <span className="text-[10.5px] font-mono font-bold text-[#0B2A5B]/70">
                  STEP {secondStep.step}
                </span>
                <span className="text-[10px] font-mono text-neutral-500 font-medium uppercase truncate max-w-[180px]">
                  Next: {secondStep.title}
                </span>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* 1ST CARD (FRONT ACTIVE CARD - Full size, glow, float)*/}
          {/* ---------------------------------------------------- */}
          <AnimatePresence 
            mode="popLayout" 
            custom={direction}
            onExitComplete={() => setIsAnimating(false)}
          >
            <motion.div
              key={`front-step-${currentIndex}`}
              custom={direction}
              // Card flip / deck transition animations:
              // When advancing NEXT (direction > 0): lifts forward, slides right with slight rotate, moves behind
              // When going BACK (direction < 0): slides left with slight reverse rotate
              initial={direction > 0 ? {
                x: -30,
                y: -14,
                scale: 0.95,
                opacity: 0.8,
                rotateZ: -1
              } : {
                x: 30,
                y: -14,
                scale: 0.95,
                opacity: 0.8,
                rotateZ: 1
              }}
              animate={{
                x: 0,
                y: 0,
                scale: 1,
                opacity: 1,
                rotateZ: 0,
                transition: { 
                  duration: 0.6, 
                  ease: deckEasing 
                }
              }}
              exit={direction > 0 ? {
                x: 160,
                y: 10,
                scale: 0.92,
                rotateZ: 3.5,
                opacity: 0,
                transition: { 
                  duration: 0.55, 
                  ease: deckEasing 
                }
              } : {
                x: -160,
                y: 10,
                scale: 0.92,
                rotateZ: -3.5,
                opacity: 0,
                transition: { 
                  duration: 0.55, 
                  ease: deckEasing 
                }
              }}
              className="relative w-full z-30 flex items-center justify-center"
            >
              {/* Subtle Cyan/Blue Glowing Aura strictly contained behind active card */}
              <div 
                aria-hidden="true" 
                className="absolute -inset-1 sm:-inset-1.5 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(22,140,255,0.22)_0%,rgba(56,189,248,0.12)_50%,transparent_75%)] blur-xl pointer-events-none" 
              />

              {/* Inner wrapper handles the idle floating loop & hover lift */}
              <motion.div
                animate={{
                  y: [0, -3.5, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                whileHover={{
                  scale: 1.015,
                  y: -4,
                  transition: { duration: 0.25, ease: 'easeOut' }
                }}
                className="group relative w-full rounded-2xl sm:rounded-3xl bg-white p-6 sm:p-8 lg:p-9 border border-[#168CFF]/35 hover:border-[#168CFF]/60 shadow-[0_16px_36px_-12px_rgba(11,42,91,0.14),0_0_20px_rgba(22,140,255,0.1)] hover:shadow-[0_20px_44px_-10px_rgba(11,42,91,0.2),0_0_28px_rgba(22,140,255,0.18)] transition-all flex flex-col justify-between"
              >
                
                {/* CARD HEADER ROW */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    {/* Step Badge with Subtle Gold Accent */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B2A5B]/10 border border-[#168CFF]/30 text-xs font-mono font-bold text-[#0B2A5B]">
                      <span className="w-2 h-2 rounded-full bg-[#F4B400] shadow-[0_0_6px_#F4B400] animate-pulse" />
                      <span>STEP {currentStep.step}</span>
                    </div>

                    {/* Phase Indicator */}
                    <span className="text-xs font-mono font-semibold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
                      Phase {currentIndex + 1} of {totalSteps}
                    </span>
                  </div>

                  {/* STEP TITLE (High Contrast, Bold, Dark Blue) */}
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0B2A5B] tracking-tight mb-3 group-hover:text-[#168CFF] transition-colors leading-snug">
                    {currentStep.title}
                  </h3>

                  {/* STEP DESCRIPTION (Comfortable Reading, Highly Readable Text) */}
                  <p className="text-slate-700 text-sm sm:text-[15.5px] leading-relaxed font-normal">
                    {currentStep.description}
                  </p>
                </div>

                {/* CARD FOOTER ROW: Micro Progress Label */}
                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <div className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Resolution Stage Active</span>
                  </div>

                  <span className="text-[11px] font-mono text-neutral-400">
                    Click Next or Swipe
                  </span>
                </div>

              </motion.div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* RIGHT NAVIGATION ARROW */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next step"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-[#0B2A5B] text-[#0B2A5B] hover:text-white border border-neutral-200/90 hover:border-[#168CFF]/50 shadow-md hover:shadow-lg flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0 z-40 focus:outline-none focus:ring-2 focus:ring-[#168CFF]/40"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

      </div>

      {/* ======================================================== */}
      {/* PROGRESS INDICATOR & DOTS                                */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-5 sm:mt-6">
        
        {/* Step Numbers: e.g. 01 / 06 */}
        <span className="text-xs font-mono font-bold text-[#0B2A5B] bg-white border border-neutral-200/80 px-3 py-1 rounded-full shadow-2xs">
          {String(currentIndex + 1).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
        </span>

        {/* Dynamic Interactive Step Dots */}
        <div className="flex items-center gap-2">
          {steps.map((step, idx) => (
            <button
              key={`dot-${step.step}-${idx}`}
              type="button"
              onClick={() => handleGoTo(idx)}
              aria-label={`Jump to Step ${step.step}: ${step.title}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? 'w-7 bg-[#0B2A5B] shadow-xs'
                  : 'w-2.5 bg-neutral-300 hover:bg-neutral-400'
              }`}
            />
          ))}
        </div>

      </div>

    </div>
  );
}
// Final submission update
