import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Scale } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import BookingForm from './BookingForm';

export default function ConsultationModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  defaultTopic, 
  user = null 
}) {
  const { t } = useTranslation();

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[1050] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consultation-modal-title"
        >
        {/* Semi-transparent dark overlay behind modal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#05070D]/75 backdrop-blur-xs cursor-pointer"
        />

        {/* Modal Window Container with smooth scale & fade */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/90 p-5 sm:p-8 shadow-[0_25px_60px_rgba(11,42,91,0.2)] z-10 my-auto text-neutral-900 font-inter"
        >
          {/* Close (X) Button in top-right */}
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close', 'Close')}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 p-2 rounded-full text-neutral-400 hover:text-[#0B2A5B] hover:bg-neutral-100 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="mb-5 sm:mb-6 pr-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B2A5B]/10 border border-[#0B2A5B]/15 text-[#0B2A5B] text-xs font-semibold mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#168CFF]" />
              <span>{t('booking.badge', 'Free & Confidential Legal Intake')}</span>
            </div>

            <h2 
              id="consultation-modal-title" 
              className="text-2xl sm:text-[26px] font-heading font-bold text-[#0B2A5B] tracking-tight leading-snug"
            >
              {t('booking.modalTitle', 'Book a Free Consultation')}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
              {t('booking.modalSubtitle', 'Connect with Bar Council registered advocates for debt harassment protection, loan settlement, and legal notice review.')}
            </p>
          </div>

          {/* Shared Booking Form */}
          <BookingForm
            isModal={true}
            onClose={onClose}
            onSuccess={onSuccess}
            defaultTopic={defaultTopic}
            user={user}
          />

          {/* Trust Highlights Footer */}
          <div className="mt-4 pt-3.5 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500 font-medium">
            <span className="inline-flex items-center gap-1 text-[#0B2A5B]">
              <Scale className="w-3 h-3 text-[#F4B400]" />
              <span>{t('booking.barCouncilRegistered', 'Bar Council Registered Panel')}</span>
            </span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
              {t('booking.fastWhatsAppCallback', 'Fast WhatsApp Callback')}
            </span>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}

