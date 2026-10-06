import React from 'react';
import { motion } from 'framer-motion';
import { Headphones } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * FloatingExpertButton:
 * Persistent "Talk to an Expert" floating button positioned above the WhatsApp widget.
 * Features:
 * - Brand styling: Deep blue (#0B2A5B), bright blue (#168CFF), white, subtle gold (#F4B400) accent.
 * - Headset icon with gold live indicator dot.
 * - Gentle entrance animation and restrained hover effect (no flashing/bouncing).
 * - Opens existing ConsultationModal / BookingForm without duplicate systems.
 * - Stacking order z-[940] to avoid overlapping modals or header.
 */
export default function FloatingExpertButton({ onOpenConsult, isVisible = true }) {
  const { t } = useTranslation();

  if (!isVisible) return null;

  return (
    <motion.button
      type="button"
      id="floating-talk-to-expert-btn"
      onClick={() => onOpenConsult?.('Talk to an Expert Floating Button')}
      initial={{ opacity: 0, y: 14, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 14, scale: 0.94 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      aria-label="Talk to an Expert - Book Consultation"
      className="fixed bottom-[76px] right-4 sm:bottom-[90px] sm:right-6 z-[940] group cursor-pointer flex items-center gap-2 sm:gap-2.5 px-3.5 py-2.5 sm:px-4.5 sm:py-3 rounded-full bg-[#0B2A5B] hover:bg-[#0d3470] active:bg-[#082046] text-white border border-[#168CFF]/45 hover:border-[#F4B400]/70 shadow-[0_8px_24px_rgba(11,42,91,0.28),0_2px_8px_rgba(22,140,255,0.2)] hover:shadow-[0_12px_28px_rgba(11,42,91,0.36),0_4px_16px_rgba(244,180,0,0.22)] transition-all duration-200 select-none outline-none focus-visible:ring-4 focus-visible:ring-[#168CFF]/40"
    >
      {/* Subtle gold top-edge highlight bar */}
      <span 
        aria-hidden="true" 
        className="absolute -top-[1px] right-4 left-4 h-[1.5px] bg-gradient-to-r from-transparent via-[#F4B400] to-transparent opacity-90 rounded-full pointer-events-none" 
      />

      {/* Headset Icon Container with subtle gold live dot */}
      <div className="relative w-6.5 h-6.5 sm:w-7.5 sm:h-7.5 rounded-full bg-gradient-to-br from-[#168CFF] to-[#0646A8] flex items-center justify-center shrink-0 shadow-xs border border-white/20">
        <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0 group-hover:scale-105 transition-transform duration-200" />
        {/* Subtle gold indicator dot */}
        <span 
          aria-hidden="true" 
          className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#F4B400] border border-[#0B2A5B] shadow-[0_0_6px_rgba(244,180,0,0.8)]" 
        />
      </div>

      {/* Typography: Clear and high contrast */}
      <span className="text-xs sm:text-[13.5px] font-semibold text-white tracking-tight whitespace-nowrap leading-none pr-0.5">
        {t('common.talkToExpert', 'Talk to an Expert')}
      </span>
    </motion.button>
  );
}
