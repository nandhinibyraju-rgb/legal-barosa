import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, X, Scale } from 'lucide-react';

/**
 * FloatingAIAssistantWidget:
 * Persistent subtle AI Assistant entry widget positioned at the BOTTOM-LEFT of the website.
 *
 * Features:
 * - Brand styling: LegalBharosa navy (#0B2A5B), bright blue (#168CFF), white.
 * - Circular avatar featuring the LegalBharosa emblem with a luminous AI Sparkles badge.
 * - Gentle message bubble: "Need AI Guidance? / Ask LegalBharosa AI →"
 * - Clicking either the avatar or the bubble routes seamlessly to the existing /ai-assistant page.
 * - Positioned at bottom-left, completely independent of the bottom-right WhatsApp / Expert buttons
 *   and right-side 'Need Help' tab.
 * - Subtle breathing / float animation with full prefers-reduced-motion support.
 * - Hidden on the AI Assistant page itself.
 */
export default function FloatingAIAssistantWidget() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isDismissed, setIsDismissed] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mq.matches);
      const handler = (e) => setPrefersReducedMotion(e.matches);
      mq.addEventListener?.('change', handler);
      return () => mq.removeEventListener?.('change', handler);
    }
  }, []);

  // Do not render on the AI Assistant page itself
  const isAIPage = location.pathname.startsWith('/ai-assistant') || location.pathname === '/ai';
  if (isAIPage) return null;

  const handleOpenAIAssistant = () => {
    navigate('/ai-assistant');
  };

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[890] flex flex-col items-start select-none">
      
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. MESSAGE BUBBLE ("Need AI Guidance? / Ask LegalBharosa AI") */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {!isDismissed && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.95 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.4 }}
            onClick={handleOpenAIAssistant}
            className="group relative mb-2.5 cursor-pointer max-w-[210px] sm:max-w-[230px] rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_6px_22px_rgba(11,42,91,0.14),0_2px_6px_rgba(0,0,0,0.06)] px-3 py-2 sm:px-3.5 sm:py-2.5 transition-all duration-200 hover:shadow-[0_8px_26px_rgba(11,42,91,0.2),0_4px_10px_rgba(22,140,255,0.15)] hover:border-[#168CFF]/50"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleOpenAIAssistant();
            }}
            aria-label="Need AI Guidance? Ask LegalBharosa AI"
          >
            {/* Top row: Icon + Title + Close Button */}
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-[12.5px] text-[#0B2A5B] leading-tight">
                <Sparkles className="w-3.5 h-3.5 text-[#168CFF] shrink-0" />
                <span>Need AI Guidance?</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDismissed(true);
                }}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                title="Dismiss message"
                aria-label="Dismiss message"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Second row: Subtitle + Action Arrow */}
            <div className="mt-0.5 flex items-center justify-between text-[10.5px] sm:text-[11px] text-slate-500 font-medium">
              <span>Ask LegalBharosa AI</span>
              <span className="text-[#168CFF] font-bold text-[11px] group-hover:translate-x-0.5 transition-transform duration-150">
                →
              </span>
            </div>

            {/* Downward speech bubble pointer pointing directly toward the circular avatar */}
            <div 
              aria-hidden="true"
              className="absolute -bottom-1 left-5 w-2.5 h-2.5 bg-white border-b border-r border-slate-200/90 rotate-45 pointer-events-none" 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. CIRCULAR LEGALBHAROSA AI AVATAR LAUNCHER BUTTON            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <motion.button
        type="button"
        id="floating-ai-assistant-btn"
        onClick={handleOpenAIAssistant}
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
        animate={
          prefersReducedMotion
            ? { opacity: 1, scale: 1 }
            : {
                opacity: 1,
                scale: 1,
                y: [0, -3.5, 0],
              }
        }
        transition={
          prefersReducedMotion
            ? { duration: 0.2 }
            : {
                opacity: { duration: 0.35, ease: 'easeOut' },
                scale: { duration: 0.35, ease: 'easeOut' },
                y: {
                  duration: 4.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }
        }
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open LegalBharosa AI Assistant"
        className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-br from-[#0B2A5B] via-[#0d2e68] to-[#071d42] text-white flex items-center justify-center cursor-pointer shadow-[0_6px_22px_rgba(11,42,91,0.32),0_2px_8px_rgba(22,140,255,0.22)] hover:shadow-[0_10px_28px_rgba(11,42,91,0.42),0_4px_14px_rgba(22,140,255,0.35)] border border-[#168CFF]/50 hover:border-[#168CFF] transition-all duration-200 outline-none focus-visible:ring-4 focus-visible:ring-[#168CFF]/40"
      >
        {/* Subtle inner top-edge light shimmer */}
        <span 
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/5 to-white/20 pointer-events-none" 
        />

        {/* LegalBharosa Emblem or Fallback Icon */}
        {!imgError ? (
          <img
            src="/assets/legalbharosa-emblem.png"
            alt="LegalBharosa Emblem"
            className="w-6 h-6 sm:w-7 sm:h-7 object-contain drop-shadow-sm pointer-events-none"
            onError={() => setImgError(true)}
          />
        ) : (
          <Scale className="w-6 h-6 sm:w-6.5 sm:h-6.5 text-white pointer-events-none" />
        )}

        {/* AI Sparkles Indicator Badge (Top-Right) */}
        <div 
          aria-hidden="true"
          className="absolute -top-1 -right-1 flex items-center justify-center w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-gradient-to-tr from-[#168CFF] to-[#00D2FF] text-white shadow-[0_0_8px_rgba(0,210,255,0.7)] border border-white/70"
        >
          <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
        </div>
      </motion.button>

    </div>
  );
}
