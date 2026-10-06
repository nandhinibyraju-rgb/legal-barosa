import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  FileText, 
  MessageSquare, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  LogIn 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { submitConsultation, saveLead } from '../services/firestoreService';
import TrustStrip from './TrustStrip';
import SignInModal from './SignInModal';

// ============================================================================
// WHATSAPP CONFIGURATION
// To change the WhatsApp destination phone number, update the constant below.
// Format: Country code without '+' followed by the 10-digit mobile number.
// Example: '917386444186' (+91 7386444186)
// ============================================================================
export const WHATSAPP_PHONE_NUMBER = '917386444186';

// The 6 official consultation services
export const CONSULTATION_SERVICES = [
  'Harassment Protection',
  'Loan Settlement',
  'Legal Notice Review',
  'Debt Management',
  'NPA & Secured Loans',
  'Credit Recovery',
];

const SERVICE_I18N_KEYS = {
  'Harassment Protection': 'harassmentProtection',
  'Loan Settlement': 'loanSettlement',
  'Legal Notice Review': 'legalNoticeReview',
  'Debt Management': 'debtManagement',
  'NPA & Secured Loans': 'npaSecuredLoans',
  'Credit Recovery': 'creditRecovery',
};

/**
 * Maps a topic string or slug to one of the 6 official services
 */
export function mapTopicToService(topic = '') {
  const lower = (topic || '').toLowerCase();
  if (lower.includes('settle') || lower.includes('ots')) return 'Loan Settlement';
  if (lower.includes('notice') || lower.includes('summons')) return 'Legal Notice Review';
  if (lower.includes('npa') || lower.includes('secured')) return 'NPA & Secured Loans';
  if (lower.includes('debt') || lower.includes('manage')) return 'Debt Management';
  if (lower.includes('credit') || lower.includes('cibil')) return 'Credit Recovery';
  return 'Harassment Protection';
}

function mapServiceToCategory(service = '') {
  const lower = service.toLowerCase();
  if (lower.includes('settle')) return 'Settlement';
  if (lower.includes('notice')) return 'LegalNotice';
  if (lower.includes('npa')) return 'NPA';
  if (lower.includes('debt')) return 'DebtManagement';
  if (lower.includes('credit')) return 'CreditRecovery';
  return 'Harassment';
}

export default function BookingForm({
  isModal = false,
  onClose,
  onSuccess,
  defaultService,
  defaultTopic,
  user = null,
}) {
  const { t } = useTranslation();

  const resolveInitialService = () => {
    if (defaultService && CONSULTATION_SERVICES.includes(defaultService)) {
      return defaultService;
    }
    if (defaultTopic) {
      return mapTopicToService(defaultTopic);
    }
    return 'Harassment Protection';
  };

  const [currentUser, setCurrentUser] = useState(() => auth?.currentUser || user || null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authNotice, setAuthNotice] = useState(null); // { type: 'warning' | 'success', message: '' }

  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    phone: user?.phoneNumber || '',
    service: resolveInitialService(),
    message: '',
  });

  const [validationError, setValidationError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submittedConfirmation, setSubmittedConfirmation] = useState('');
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState('');

  // Reactive Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setCurrentUser(firebaseUser);
      if (firebaseUser) {
        setFormData((prev) => ({
          ...prev,
          name: prev.name || firebaseUser.displayName || '',
          phone: prev.phone || (firebaseUser.phoneNumber ? firebaseUser.phoneNumber.replace(/\D/g, '').slice(-10) : ''),
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  // Restore draft from sessionStorage if visitor previously filled form or returned from auth
  useEffect(() => {
    try {
      const rawDraft = sessionStorage.getItem('lb_booking_draft');
      if (rawDraft) {
        const draft = JSON.parse(rawDraft);
        // Valid for up to 30 minutes
        if (draft && Date.now() - (draft.savedAt || 0) < 30 * 60 * 1000) {
          setFormData((prev) => ({
            name: prev.name || draft.name || '',
            phone: prev.phone || draft.phone || '',
            service: draft.service || prev.service,
            message: prev.message || draft.message || '',
          }));
          if (draft.agreedToTerms) {
            setAgreedToTerms(true);
          }
        }
      }
    } catch (err) {
      console.warn('[BookingForm] Draft restore error:', err);
    }
  }, []);

  // Sync state if user auth or topic changes
  useEffect(() => {
    const serviceVal = resolveInitialService();
    setFormData((prev) => ({
      ...prev,
      name: prev.name || user?.displayName || '',
      phone: prev.phone || user?.phoneNumber || '',
      service: prev.service || serviceVal,
    }));
  }, [user, defaultService, defaultTopic]);

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
    const current = auth.currentUser;
    if (!current) {
      setAuthNotice({
        type: 'warning',
        message: t('booking.signInRequired', 'Please sign in or create an account before submitting your consultation request.')
      });
    }
  };

  const handleAuthModalSuccess = (loggedInUser) => {
    setIsAuthModalOpen(false);
    setCurrentUser(loggedInUser);
    setAuthNotice({
      type: 'success',
      message: t('booking.signedInReady', 'Signed in as {{identifier}}. Click Submit via WhatsApp below to complete your consultation request.', {
        identifier: loggedInUser?.displayName || loggedInUser?.email || 'authenticated user'
      })
    });
    if (loggedInUser) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || loggedInUser.displayName || '',
        phone: prev.phone || (loggedInUser.phoneNumber ? loggedInUser.phoneNumber.replace(/\D/g, '').slice(-10) : ''),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // 1. Validate Full Name
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setValidationError(t('booking.validationName', 'Please enter your full name.'));
      return;
    }

    // 2. Validate Phone Number (10 digits)
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setValidationError(t('booking.validationPhone', 'Please enter a valid 10-digit mobile number.'));
      return;
    }

    // 3. Validate Service selection
    if (!formData.service || !CONSULTATION_SERVICES.includes(formData.service)) {
      setValidationError(t('booking.validationService', 'Please select which service you are interested in.'));
      return;
    }

    // 4. Validate Mandatory Terms & Conditions
    if (!agreedToTerms) {
      setValidationError(t('booking.validationTerms', 'Please acknowledge the Terms & Conditions and Privacy Policy to continue.'));
      return;
    }

    // =========================================================================
    // 5. CRITICAL SECURITY GATE: REQUIRE AUTHENTICATED USER BEFORE WHATSAPP
    // Must verify against auth.currentUser directly.
    // =========================================================================
    const verifiedUser = auth.currentUser;
    if (!verifiedUser || !verifiedUser.uid) {
      // STOP SUBMISSION IMMEDIATELY.
      // DO NOT generate WhatsApp URL.
      // DO NOT open WhatsApp.
      // DO NOT call saveLead or submitConsultation.

      // Persist draft in sessionStorage so user's typed data is 100% safe
      try {
        sessionStorage.setItem('lb_booking_draft', JSON.stringify({
          name: trimmedName,
          phone: cleanPhone,
          service: formData.service,
          message: formData.message.trim(),
          agreedToTerms: true,
          savedAt: Date.now()
        }));
      } catch {}

      setAuthNotice({
        type: 'warning',
        message: t('booking.signInRequired', 'Please sign in or create an account before submitting your consultation request.')
      });

      // Show existing LegalBharosa SignInModal
      setIsAuthModalOpen(true);
      return;
    }

    // =========================================================================
    // 6. VERIFIED AUTHENTICATED USER PROCEEDING TO WHATSAPP
    // =========================================================================
    setAuthNotice(null);

    // Construct WhatsApp Message text & URL
    const messageLines = [
      'Hello LegalBharosa, I would like to book a consultation.',
      `Name: ${trimmedName}`,
      `Phone: ${cleanPhone}`,
      `Service: ${formData.service}`,
      `Details: ${formData.message.trim()}`
    ];
    const messageText = messageLines.join('\n');
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(messageText)}`;
    setLastWhatsAppUrl(whatsappUrl);

    // Determine Lead Source
    const source = isModal ? 'consultation_popup' : 'consultation_page';

    // Save lead to Firestore with verified UID
    try {
      await Promise.race([
        saveLead({
          name: trimmedName,
          phone: cleanPhone,
          service: formData.service,
          message: formData.message.trim(),
          source,
          status: 'new',
          whatsappSent: true,
          userId: verifiedUser.uid,
          userEmail: verifiedUser.email || null,
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Firestore lead logging timeout')), 2500)
        )
      ]);
    } catch (dbErr) {
      console.warn('[BookingForm] Firestore lead save warning (proceeding to WhatsApp):', dbErr);
    }

    // Background sync to consultations collection linked to verified UID
    submitConsultation({
      name: trimmedName,
      phone: cleanPhone,
      email: verifiedUser.email || '',
      problemCategory: mapServiceToCategory(formData.service),
      message: formData.message.trim() || `Consultation request for ${formData.service} (${source})`,
      userId: verifiedUser.uid,
    }).catch((consultErr) => {
      console.warn('[BookingForm] Background consultation sync warning:', consultErr);
    });

    // Execute WhatsApp Redirect
    const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = whatsappUrl;
    }

    // Clean up temporary draft
    try {
      sessionStorage.removeItem('lb_booking_draft');
    } catch {}

    // Reset Form
    setFormData({
      name: '',
      phone: '',
      service: resolveInitialService(),
      message: '',
    });
    setAgreedToTerms(false);

    const confirmationText = t('booking.confirmationAlmostDone', 'Almost done! Please tap Send in WhatsApp to complete your request.');
    setSubmittedConfirmation(confirmationText);

    if (isModal) {
      if (onSuccess) {
        onSuccess(confirmationText);
      }
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <div className="w-full">
      {/* Non-modal Confirmation View (shown on dedicated page after submit) */}
      {!isModal && submittedConfirmation ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col items-center text-center gap-4 my-2 animate-in fade-in duration-300">
          <div className="w-14 h-14 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#128C7E] flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-8 h-8 text-[#075E54]" />
          </div>

          <div className="max-w-md">
            <span className="inline-block text-[11px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full mb-2">
              {t('booking.confirmationReady', 'WhatsApp Request Ready')}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-emerald-950 leading-snug">
              {submittedConfirmation}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800 mt-2 leading-relaxed">
              {t('booking.confirmationInstructions', 'We have pre-filled your details in WhatsApp chat with our advocates. Just hit the Send button in WhatsApp to submit your request.')}
            </p>
          </div>

          <div className="mt-2 flex flex-col sm:flex-row items-center gap-3">
            {lastWhatsAppUrl && (
              <a
                href={lastWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
              >
                <span>{t('booking.reopenWhatsApp', 'Re-open WhatsApp')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              type="button"
              onClick={() => setSubmittedConfirmation('')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline cursor-pointer py-1"
            >
              {t('booking.submitAnother', 'Submit another request')}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Validation Error Banner */}
          {validationError && (
            <div className="p-3 sm:p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{validationError}</span>
            </div>
          )}

          {/* 1. Full Name */}
          <div>
            <label 
              htmlFor="booking-name" 
              className={`block text-xs sm:text-[13px] font-semibold mb-1.5 ${isModal ? 'text-slate-800' : 'text-neutral-800'}`}
            >
              {t('booking.fullName', 'Full Name')} <span className="text-[#168CFF]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="booking-name"
                name="name"
                type="text"
                required
                placeholder={t('booking.fullNamePlaceholder', 'e.g. Vikram Sharma')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-[16px] sm:text-sm text-neutral-900 transition-all min-h-[44px] ${
                  isModal 
                    ? 'border-neutral-300 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#168CFF]/30 focus:border-[#168CFF]'
                    : 'border-neutral-300 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#168CFF]/30 focus:border-[#168CFF]'
                }`}
              />
            </div>
          </div>

          {/* 2. Phone Number */}
          <div>
            <label 
              htmlFor="booking-phone" 
              className={`block text-xs sm:text-[13px] font-semibold mb-1.5 ${isModal ? 'text-slate-800' : 'text-neutral-800'}`}
            >
              {t('booking.phone', 'Phone Number')} <span className="text-[#168CFF]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="booking-phone"
                name="phone"
                type="tel"
                required
                maxLength={10}
                placeholder={t('booking.phonePlaceholder', '10-digit mobile number (e.g. 9876543210)')}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-[16px] sm:text-sm text-neutral-900 transition-all min-h-[44px] ${
                  isModal 
                    ? 'border-neutral-300 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#168CFF]/30 focus:border-[#168CFF]'
                    : 'border-neutral-300 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#168CFF]/30 focus:border-[#168CFF]'
                }`}
              />
            </div>
          </div>

          {/* 3. Which service are you interested in? */}
          <div>
            <label 
              htmlFor="booking-service" 
              className={`block text-xs sm:text-[13px] font-semibold mb-1.5 ${isModal ? 'text-slate-800' : 'text-neutral-800'}`}
            >
              {t('booking.serviceLabel', 'Which service are you interested in?')} <span className="text-[#168CFF]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <FileText className="w-4 h-4" />
              </div>
              <select
                id="booking-service"
                name="service"
                required
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className={`w-full pl-10 pr-10 py-3 rounded-xl border text-[16px] sm:text-sm text-neutral-900 transition-all appearance-none cursor-pointer min-h-[44px] ${
                  isModal 
                    ? 'border-neutral-300 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#168CFF]/30 focus:border-[#168CFF]'
                    : 'border-neutral-300 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#168CFF]/30 focus:border-[#168CFF]'
                }`}
              >
                {CONSULTATION_SERVICES.map((srv) => (
                  <option key={srv} value={srv}>
                    {t(`services.items.${SERVICE_I18N_KEYS[srv]}.title`, srv)}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-neutral-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* 4. Message / Details (textarea, optional) */}
          <div>
            <label 
              htmlFor="booking-message" 
              className={`block text-xs sm:text-[13px] font-semibold mb-1.5 ${isModal ? 'text-slate-800' : 'text-neutral-800'}`}
            >
              {t('booking.messageLabel', 'Message / Details')} <span className="text-neutral-400 font-normal text-xs">{t('booking.optional', '(Optional)')}</span>
            </label>
            <div className="relative">
              <textarea
                id="booking-message"
                name="message"
                rows={isModal ? 3 : 4}
                placeholder={t('booking.messagePlaceholder', 'Briefly describe your loan details, lender name, legal notices received, or harassment issues...')}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={`w-full p-3.5 rounded-xl border text-[16px] sm:text-sm text-neutral-900 transition-all resize-y ${
                  isModal 
                    ? 'border-neutral-300 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#168CFF]/30 focus:border-[#168CFF]'
                    : 'border-neutral-300 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#168CFF]/30 focus:border-[#168CFF]'
                }`}
              />
            </div>
          </div>

          {/* Mandatory Terms & Conditions and Privacy Policy Acknowledgement Checkbox */}
          <div className="flex flex-col gap-1 my-1">
            <label 
              htmlFor="booking-terms-checkbox"
              className="flex items-start gap-2.5 cursor-pointer select-none text-left group"
            >
              <input
                type="checkbox"
                id="booking-terms-checkbox"
                name="termsAgreement"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (e.target.checked && validationError.includes('Terms & Conditions')) {
                    setValidationError('');
                  }
                }}
                className={`mt-0.5 w-4 h-4 rounded border text-[#0B2A5B] focus:ring-[#168CFF] focus:ring-offset-0 focus:ring-2 accent-[#0B2A5B] cursor-pointer shrink-0 transition-colors ${
                  !agreedToTerms && validationError.includes('Terms & Conditions')
                    ? 'border-red-500 ring-2 ring-red-400/40'
                    : 'border-neutral-300'
                }`}
              />
              <span className={`text-xs sm:text-[12.5px] leading-snug ${isModal ? 'text-slate-600' : 'text-neutral-600'}`}>
                {t('booking.termsAgreementPrefix', 'I acknowledge that I have read and agree to the')}{' '}
                <a
                  href="#terms"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className="text-[#0B2A5B] font-semibold underline hover:text-[#168CFF] transition-colors"
                >
                  {t('booking.termsAndConditions', 'Terms & Conditions')}
                </a>{' '}
                {t('booking.and', 'and')}{' '}
                <a
                  href="#privacy"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className="text-[#0B2A5B] font-semibold underline hover:text-[#168CFF] transition-colors"
                >
                  {t('booking.privacyPolicy', 'Privacy Policy')}
                </a>
                .
              </span>
            </label>
            {!agreedToTerms && validationError.includes('Terms & Conditions') && (
              <p className="text-[11.5px] text-red-600 font-medium pl-6.5 mt-0.5 animate-in fade-in duration-150">
                {validationError}
              </p>
            )}
          </div>

          {/* Authentication Requirement / Status Banner */}
          {authNotice && (
            <div 
              className={`p-3 sm:p-3.5 rounded-xl border text-xs sm:text-sm flex items-start justify-between gap-3 animate-in fade-in duration-200 ${
                authNotice.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {authNotice.type === 'success' ? (
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <Lock className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-[11px] uppercase tracking-wider text-slate-700">
                    {authNotice.type === 'success' ? t('booking.authSuccess', 'Account Verified') : t('booking.authRequired', 'Sign-in Required')}
                  </span>
                  <span className="leading-snug text-xs sm:text-[13px]">{authNotice.message}</span>
                </div>
              </div>
              {authNotice.type !== 'success' && (
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B2A5B] hover:bg-[#123E8A] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#F4B400]" />
                  <span>{t('auth.signInTitle', 'Sign In')}</span>
                </button>
              )}
            </div>
          )}

          {/* Verified Client Badge if already authenticated */}
          {currentUser && !authNotice && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200/60 w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('booking.verifiedUser', 'Verified Client:')} <strong>{currentUser.displayName || currentUser.email}</strong></span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-2 w-full inline-flex items-center justify-center gap-2.5 bg-[#0B2A5B] hover:bg-[#123E8A] text-white rounded-xl py-3.5 px-6 text-sm font-semibold transition-all shadow-md cursor-pointer hover:shadow-lg active:scale-[0.99] group min-h-[44px]"
          >
            <span>{t('booking.submitViaWhatsApp', 'Submit via WhatsApp')}</span>
            <ArrowRight className="w-4 h-4 text-[#F4B400] group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Subtle trust strip directly beneath CTA */}
          <TrustStrip className="mt-1" centered={true} />

          {/* Trust / Confidentiality Note */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 pt-1 text-center">
            <Lock className="w-3.5 h-3.5 text-[#168CFF] shrink-0" />
            <span>{t('booking.privilegeNotice', 'Advocate-Client Privilege • Free & Confidential Consultation')}</span>
          </div>

        </form>
      )}

      {/* Embedded Authentication Modal with elevated zIndex for popups */}
      <SignInModal
        isOpen={isAuthModalOpen}
        onClose={handleAuthModalClose}
        onSuccess={handleAuthModalSuccess}
        title={t('booking.authModalTitle', 'Sign In to Continue')}
        subtitle={t('booking.authModalSubtitle', 'Please sign in or create an account before submitting your consultation request.')}
        badgeText={t('booking.authBadge', 'ACCOUNT REQUIRED')}
        zIndex={1150}
      />
    </div>
  );
}

