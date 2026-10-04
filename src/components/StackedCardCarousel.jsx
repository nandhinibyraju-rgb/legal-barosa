import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

/**
 * StackedCardCarousel:
 * Premium physical card deck / stacked carousel system.
 * Designed strictly to the specifications:
 * - Only 1 main card fully visible in front with strong shadow, clear border, subtle cyan/blue glow.
 * - One partially visible card behind it (smaller, darker, lower opacity).
 * - Optional second subtle card edge behind (visible only around the edges).
 * - DIRECTIONAL STACKED DECK ANIMATION:
 *   - When NEXT is clicked:
 *     1. Current front card moves backward.
 *     2. Moves slightly toward the SIDE/BACK of the stack (↘).
 *     3. Scales down and opacity reduces.
 *     4. Next card comes forward from behind (→ pops forward) and scales up to front.
 *   - When BACK is clicked:
 *     1. Reverse animation: previous card comes forward from opposite side (↙) while current card moves backward.
 * - Clear labeled `← BACK` and `NEXT →` arrows with soft cyan/blue glow, slight lift on hover.
 * - Progress indicator (01 / 06) and interactive dots.
 * - High-contrast text hierarchy: Gold Step Label -> Bold White Title -> Bright readable Description.
 * - Smooth 500-700ms directional transition with controlled spring physics.
 */
export default function StackedCardCarousel({
  cards = [],
  titlePrefix = 'STEP',
  theme = 'dark',
  className = '',
  onCardClick,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = React.useRef(null);

  const totalCards = cards.length;

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalCards);
  }, [totalCards]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
  }, [totalCards]);

  const goToCard = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) {
        return;
      }
      
      const isFocused = containerRef.current && containerRef.current.contains(document.activeElement);
      if (isHovered || isFocused) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNext();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrev();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, isHovered]);

  if (!cards || cards.length === 0) return null;

  const activeCard = cards[currentIndex];

  // Stack calculation:
  const nextIndex1 = (currentIndex + 1) % totalCards;
  const nextIndex2 = (currentIndex + 2) % totalCards;
  const card1 = cards[nextIndex1];
  const card2 = cards[nextIndex2];

  // Touch swipe support
  const handleDragEnd = (event, info) => {
    if (info.offset.x < -40 || info.velocity.x < -300) {
      handleNext();
    } else if (info.offset.x > 40 || info.velocity.x > 300) {
      handlePrev();
    }
  };

  // Custom directional deck animation variants (500-700ms smooth physical deck transition)
  const deckVariants = {
    enter: (dir) => ({
      // Next: next card comes forward from behind in the stack
      // Back: previous card comes forward from behind the opposite side
      x: dir === 1 ? -25 : 25,
      y: -11,
      scale: 0.94,
      opacity: 0.7,
      rotate: 0,
      zIndex: 30,
      filter: 'blur(0px)',
    }),
    center: {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      rotate: 0,
      zIndex: 30,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: (dir) => ({
      // Next: current front card moves ↘ toward side/back of stack, scales down, opacity fades
      // Back: current front card moves ↙ toward side/back of stack, scales down, opacity fades
      x: dir === 1 ? 80 : -80,
      y: 24,
      scale: 0.90,
      opacity: 0,
      rotate: dir === 1 ? 2.5 : -2.5,
      zIndex: 18,
      filter: 'blur(1.5px)',
      transition: {
        duration: 0.58,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <div 
      ref={containerRef}
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full flex flex-col items-center select-none focus:outline-none ${className}`}
    >
      
      {/* ======================================================== */}
      {/* 1. TOP PROGRESS INDICATOR (e.g. 01 / 06 + Dots)         */}
      {/* ======================================================== */}
      <div className="flex items-center justify-between w-full max-w-lg px-4 mb-4 sm:mb-6">
        {/* Step / Service Counter (01 / 06) */}
        <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold">
          <span className="text-[#38BDF8] text-sm sm:text-base">
            {String(currentIndex + 1).padStart(2, '0')}
          </span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-400">
            {String(totalCards).padStart(2, '0')}
          </span>
        </div>

        {/* Dynamic Dot Indicators (● ○ ○ ○ ○ ○) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {cards.map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={`dot-${idx}`}
                type="button"
                onClick={() => goToCard(idx)}
                aria-label={`Go to card ${idx + 1}`}
                className="py-1 px-0.5 focus:outline-none cursor-pointer group"
              >
                {isActive ? (
                  <motion.span
                    layoutId={`active-dot-${titlePrefix}`}
                    className="block w-5 sm:w-6 h-2 rounded-full bg-[#168CFF] shadow-[0_0_12px_rgba(22,140,255,0.9),0_0_4px_#38BDF8]"
                    transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                  />
                ) : (
                  <span className="block w-2 h-2 rounded-full bg-slate-400/40 hover:bg-slate-300 transition-colors" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN CAROUSEL STACK CONTAINER: ← BACK [ FRONT CARD ] NEXT → */}
      {/* ======================================================== */}
      <div className="relative w-full flex items-center justify-center gap-2 sm:gap-4 md:gap-6 px-1 sm:px-2">
        
        {/* ← BACK ARROW BUTTON */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Service Card"
          className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full bg-[#0B2456]/90 hover:bg-[#123E8A] border border-[#168CFF]/40 hover:border-[#38BDF8] text-[#E0F2FE] hover:text-white shadow-[0_4px_16px_rgba(0,0,0,0.3),0_0_12px_rgba(22,140,255,0.2)] hover:shadow-[0_0_22px_rgba(22,140,255,0.5)] hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-250 cursor-pointer z-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168CFF] shrink-0"
        >
          <span className="text-xs sm:text-sm font-bold text-[#38BDF8] group-hover:text-white transition-colors">←</span>
          <span className="text-xs sm:text-[13px] font-bold tracking-wider">BACK</span>
        </button>

        {/* ======================================================== */}
        {/* THE CARD STACK / DECK (CSS Grid Stacking)                */}
        {/* ======================================================== */}
        <div className="relative w-full max-w-[560px] sm:max-w-[620px] lg:max-w-[680px] grid grid-cols-1 grid-rows-1 items-center justify-center min-h-[290px] xs:min-h-[280px] sm:min-h-[270px]">
          
          {/* LAYER 2: FURTHEST BACKGROUND CARD (Deepest stacked edge - partially visible) */}
          {totalCards > 2 && (
            <div
              aria-hidden="true"
              className="col-start-1 row-start-1 w-full h-full rounded-2xl sm:rounded-3xl border border-[#168CFF]/20 bg-[#051433]/70 backdrop-blur-sm pointer-events-none select-none transition-all duration-500 ease-out"
              style={{
                transform: 'scale(0.88) translateY(-22px)',
                zIndex: 10,
                opacity: 0.35,
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}
            >
              {/* Peek label */}
              <div className="px-5 pt-2 text-[10px] font-mono text-slate-400 font-semibold tracking-wider truncate">
                {titlePrefix} {card2.step || '03'} — {card2.phase || card2.title}
              </div>
            </div>
          )}

          {/* LAYER 1: NEXT CARD IN STACK (Middle layer partially visible around edges) */}
          {totalCards > 1 && (
            <div
              aria-hidden="true"
              className="col-start-1 row-start-1 w-full h-full rounded-2xl sm:rounded-3xl border border-[#168CFF]/30 bg-[#071D4A]/90 backdrop-blur-sm pointer-events-none select-none transition-all duration-500 ease-out"
              style={{
                transform: 'scale(0.94) translateY(-11px)',
                zIndex: 20,
                opacity: 0.65,
                boxShadow: '0 12px 30px rgba(0,0,0,0.45)',
              }}
            >
              {/* Peek label */}
              <div className="px-6 pt-2 text-[11px] font-mono text-slate-300 font-semibold tracking-wider flex items-center justify-between">
                <span className="truncate">{titlePrefix} {card1.step || '02'} — {card1.phase || card1.title}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#168CFF]/60 shrink-0 ml-2" />
              </div>
            </div>
          )}

          {/* LAYER 0: ACTIVE FRONT CARD (Simultaneous directional physical deck transition) */}
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={`front-card-${currentIndex}`}
              custom={direction}
              variants={deckVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              onClick={() => onCardClick?.(activeCard)}
              className="col-start-1 row-start-1 relative w-full h-full rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 flex flex-col justify-between border border-[#168CFF]/50 transition-shadow cursor-grab active:cursor-grabbing overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #0A245C 0%, #06193E 60%, #030F28 100%)',
                boxShadow: '0 20px 50px -10px rgba(0,0,0,0.7), 0 0 28px rgba(22,140,255,0.3)',
                zIndex: 30,
              }}
            >
              {/* Top Accent Bar with Subtle Cyan Edge Glow */}
              <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent opacity-85" />

              <div>
                {/* 1. STEP / CATEGORY LABEL (High contrast gold/cyan accent) */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4B400]/15 border border-[#F4B400]/40 text-[#F4B400] text-xs font-mono font-bold tracking-wider shadow-[0_0_10px_rgba(244,180,0,0.25)]">
                    <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
                    <span>{titlePrefix} {activeCard.step}</span>
                  </div>

                  <span className="text-xs sm:text-[13px] font-mono font-bold tracking-wider text-[#38BDF8] uppercase px-2.5 py-0.5 rounded bg-[#168CFF]/15 border border-[#168CFF]/30">
                    {activeCard.phase || activeCard.tag || `STEP ${activeCard.step}`}
                  </span>
                </div>

                {/* 2. MAIN CARD TITLE (Bold high contrast white text) */}
                <h3 className="text-lg sm:text-2xl md:text-[26px] font-bold text-white tracking-tight leading-snug mb-2 sm:mb-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
                  {activeCard.phase ? (
                    <>
                      <span>{activeCard.phase}</span>
                      {activeCard.title && (
                        <span className="block text-sm sm:text-base font-semibold text-[#38BDF8] mt-1 drop-shadow-none">
                          {activeCard.title}
                        </span>
                      )}
                    </>
                  ) : (
                    activeCard.title
                  )}
                </h3>

                {/* 3. DESCRIPTION (Bright readable text) */}
                <p className="text-xs sm:text-sm md:text-[15px] font-normal sm:font-medium text-[#E0F2FE] leading-relaxed max-w-xl">
                  {activeCard.description}
                </p>
              </div>

              {/* Bottom Card Footer Status */}
              <div className="pt-3 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] sm:text-xs text-slate-300 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#168CFF] shadow-[0_0_6px_#168CFF] animate-pulse" />
                  <span>Card {currentIndex + 1} of {totalCards}</span>
                </span>
                {activeCard.path ? (
                  <span className="inline-flex items-center gap-1 text-[#38BDF8] hover:text-white font-semibold cursor-pointer transition-colors">
                    <span>View Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="text-slate-400 hidden xs:inline">
                    Swipe or use arrows to navigate
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* NEXT → ARROW BUTTON */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Service Card"
          className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full bg-[#0B2456]/90 hover:bg-[#123E8A] border border-[#168CFF]/40 hover:border-[#38BDF8] text-[#E0F2FE] hover:text-white shadow-[0_4px_16px_rgba(0,0,0,0.3),0_0_12px_rgba(22,140,255,0.2)] hover:shadow-[0_0_22px_rgba(22,140,255,0.5)] hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-250 cursor-pointer z-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168CFF] shrink-0"
        >
          <span className="text-xs sm:text-[13px] font-bold tracking-wider">NEXT</span>
          <span className="text-xs sm:text-sm font-bold text-[#38BDF8] group-hover:text-white transition-colors">→</span>
        </button>

      </div>

    </div>
  );
}
