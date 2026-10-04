import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Scale, Clock, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Official SVG WhatsApp Icon
function WhatsAppIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}

// Configured contact numbers
const WHATSAPP_NUMBER = '917386444186';
const PHONE_NUMBER = '7386444186';
const WHATSAPP_DEFAULT_MESSAGE = 'Hello LegalBharosa, I would like to get a free expert review of my case.';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`;
const CALL_URL = `tel:${PHONE_NUMBER}`;

export default function AutoConsultationPopup({ isOpen, onClose }) {
  const { t } = useTranslation();
  const cardRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleActionClick = () => {
    // Dismiss popup when user engages with call or WhatsApp
    setTimeout(() => {
      onClose?.();
    }, 150);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="compact-auto-consultation-card"
          ref={cardRef}
          initial={{ opacity: 0, x: 30, y: 20, scale: 0.94 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 30, y: 20, scale: 0.94, transition: { duration: 0.2, ease: 'easeIn' } }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 w-[calc(100vw-24px)] sm:w-[340px] max-w-[360px] z-[1001] rounded-2xl bg-white border border-slate-200/90 shadow-[0_16px_40px_rgba(6,45,120,0.22),0_4px_16px_rgba(0,0,0,0.08)] overflow-hidden font-inter select-none"
          role="dialog"
          aria-modal="false"
          aria-labelledby="auto-popup-heading"
        >
          {/* HEADER: Dark Navy #062D78 */}
          <div className="relative bg-[#062D78] px-4 py-3.5 sm:px-5 sm:py-4 text-white">
            {/* Circular Close X Button in top-right */}
            <button
              type="button"
              onClick={onClose}
              aria-label={t('common.close', 'Close')}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/25 text-white/90 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Small Badge: BEFORE YOU LEAVE */}
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 border border-white/20 text-white text-[10px] font-bold tracking-wider uppercase mb-1.5">
              <Clock className="w-2.5 h-2.5 text-blue-200" />
              <span>{t('autoPopup.badge', 'BEFORE YOU LEAVE')}</span>
            </div>

            {/* Bold Headline */}
            <h3
              id="auto-popup-heading"
              className="text-[15px] sm:text-[16px] font-bold text-white tracking-tight leading-snug pr-6"
            >
              {t('autoPopup.title', 'Get a Free Expert Review of Your Case')}
            </h3>

            {/* Short 1-2 line Supporting Text */}
            <p className="text-[11.5px] sm:text-[12px] text-blue-100/90 mt-1 leading-relaxed pr-4">
              {t('autoPopup.subtitle', 'One 15-minute call could change your resolution path. Strictly confidential.')}
            </p>
          </div>

          {/* LIGHTER CARD SECTION BELOW */}
          <div className="p-3.5 sm:p-4 bg-white">
            {/* Lighter sub-card with border */}
            <div className="rounded-xl border border-slate-200/90 bg-[#F8FAFC] p-3 text-left">
              {/* Icon + Short Label */}
              <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-[#062D78] tracking-wider uppercase mb-1">
                <Scale className="w-3 h-3 text-[#062D78] shrink-0" />
                <span>{t('autoPopup.cardBadge', 'FREE NPA CASE REVIEW')}</span>
              </div>

              {/* Short Bold Sub-Headline */}
              <h4 className="text-[13px] font-bold text-slate-900 leading-snug">
                {t('autoPopup.cardTitle', 'Unsure what to do next?')}
              </h4>

              {/* 1-2 Lines Supporting Text */}
              <p className="text-[11.5px] text-slate-600 mt-0.5 leading-relaxed">
                {t('autoPopup.cardDesc', 'Get a personalized strategy from an NPA expert based on your bank, loan and legal stage.')}
              </p>
            </div>

            {/* TWO SIDE-BY-SIDE BUTTONS */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              {/* LEFT: WhatsApp-styled green button */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleActionClick}
                className="bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] text-white font-semibold text-xs py-2.5 px-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all duration-150 hover:shadow-md cursor-pointer no-underline text-center"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 shrink-0 text-white" />
                <span className="truncate">{t('autoPopup.whatsappBtn', 'WhatsApp Expert')}</span>
              </a>

              {/* RIGHT: Dark Call Now button */}
              <a
                href={CALL_URL}
                onClick={handleActionClick}
                className="bg-[#062D78] hover:bg-[#093994] active:bg-[#052361] text-white font-semibold text-xs py-2.5 px-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all duration-150 hover:shadow-md cursor-pointer no-underline text-center"
              >
                <Phone className="w-3 h-3 fill-current shrink-0 text-white" />
                <span className="truncate">{t('autoPopup.callBtn', 'Call Now')}</span>
              </a>
            </div>

            {/* SMALL TRUST LINE AT BOTTOM */}
            <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-slate-500 font-medium mt-2.5 pt-0.5 text-center">
              <ShieldCheck className="w-3 h-3 text-[#168CFF]" />
              <span>{t('autoPopup.trustText', '100% Confidential • Professional Case Intake')}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

