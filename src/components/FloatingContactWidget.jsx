import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail } from 'lucide-react';

// Official SVG WhatsApp Icon
function WhatsAppIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}

const PHONE_NUMBER = '7386444186';
const EMAIL_ADDRESS = 'Legalbharosa.orga@gmail.com';
const WHATSAPP_URL = `https://wa.me/917386444186?text=${encodeURIComponent('Hello LegalBharosa, I need help with my case.')}`;
const CALL_URL = `tel:${PHONE_NUMBER}`;
const MAILTO_URL = `mailto:${EMAIL_ADDRESS}`;

export default function FloatingContactWidget({
  isVisible = false,
  isOpen = false,
  onToggle,
  onClose,
  isAutoPopupOpen = false
}) {
  const panelRef = useRef(null);
  const launcherRef = useRef(null);

  // Close panel on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        launcherRef.current &&
        !launcherRef.current.contains(e.target)
      ) {
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

  // If the booking popup is open, ensure contact panel is not visible
  if (isAutoPopupOpen || !isVisible) {
    return null;
  }

  return (
    <>
      {/* 1. EXPANDED CONTACT PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="floating-contact-panel"
            ref={panelRef}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95, transition: { duration: 0.2, ease: 'easeIn' } }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 w-[calc(100vw-32px)] sm:w-[320px] max-w-[340px] z-[992] rounded-2xl bg-white border border-slate-200 shadow-[0_20px_50px_rgba(6,45,120,0.18),0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden font-inter select-none"
            role="dialog"
            aria-modal="false"
            aria-labelledby="contact-panel-heading"
          >
            {/* Header: Dark Navy #062D78 */}
            <div className="relative bg-[#062D78] px-4 py-3.5 sm:px-4.5 sm:py-4 text-white">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close contact panel"
                className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/25 text-white/90 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <h3
                id="contact-panel-heading"
                className="text-sm sm:text-[15px] font-bold text-white tracking-tight leading-snug pr-7"
              >
                Need help with your case?
              </h3>
              <p className="text-[11.5px] text-blue-100/90 mt-1 leading-relaxed pr-2">
                Connect with LegalBharosa to discuss your legal or financial concerns.
              </p>
            </div>

            {/* Content & Action Buttons */}
            <div className="p-3.5 sm:p-4 bg-white space-y-3">
              {/* Primary: WhatsApp Expert */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] text-white font-semibold text-xs sm:text-[13px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer no-underline text-center"
              >
                <WhatsAppIcon className="w-4 h-4 shrink-0 text-white" />
                <span>WhatsApp Expert</span>
              </a>

              {/* Secondary: Call Now */}
              <a
                href={CALL_URL}
                className="w-full bg-[#062D78] hover:bg-[#093994] active:bg-[#052361] text-white font-semibold text-xs sm:text-[13px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer no-underline text-center"
              >
                <Phone className="w-3.5 h-3.5 fill-current shrink-0 text-white" />
                <span>Call Now</span>
              </a>

              {/* Contact Details List */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                {/* Phone */}
                <a
                  href={CALL_URL}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-[#062D78] transition-colors group"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-[#062D78] group-hover:scale-105 transition-transform">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Phone</span>
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-[#062D78] tracking-wide">{PHONE_NUMBER}</span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={MAILTO_URL}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-[#062D78] transition-colors group"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-[#062D78] group-hover:scale-105 transition-transform">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Email</span>
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-[#062D78] truncate">{EMAIL_ADDRESS}</span>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CIRCULAR WHATSAPP-STYLE LAUNCHER */}
      <motion.button
        ref={launcherRef}
        type="button"
        onClick={onToggle}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.6 }}
        transition={{ type: 'spring', damping: 18, stiffness: 260 }}
        aria-label={isOpen ? "Close contact options" : "Open WhatsApp and contact options"}
        aria-expanded={isOpen}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[990] w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da851] text-white flex items-center justify-center cursor-pointer shadow-[0_8px_24px_rgba(37,211,102,0.38),0_2px_8px_rgba(0,0,0,0.12)] hover:scale-105 active:scale-95 transition-all duration-200 outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40"
        style={{
          animation: 'subtleLauncherPulse 3.5s ease-in-out infinite'
        }}
      >
        <WhatsAppIcon className="w-7 h-7 text-white" />
      </motion.button>
    </>
  );
}
