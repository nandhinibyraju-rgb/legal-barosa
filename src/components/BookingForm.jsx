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
  ExternalLink 
} from 'lucide-react';
import { submitConsultation, saveLead } from '../services/firestoreService';
import TrustStrip from './TrustStrip';

// ============================================================================
// WHATSAPP CONFIGURATION
// To change the WhatsApp destination phone number, update the constant below.
// Format: Country code without '+' followed by the 10-digit mobile number.
// Example: '918790760524' (+91 8790760524)
// ============================================================================
export const WHATSAPP_PHONE_NUMBER = '918790760524';

// The 6 official consultation services
export const CONSULTATION_SERVICES = [
  'Harassment Protection',
  'Loan Settlement',
  'Legal Notice Review',
  'Debt Management',
  'NPA & Secured Loans',
  'Credit Recovery',
];

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
  const resolveInitialService = () => {
    if (defaultService && CONSULTATION_SERVICES.includes(defaultService)) {
      return defaultService;
    }
    if (defaultTopic) {
      return mapTopicToService(defaultTopic);
    }
    return 'Harassment Protection';
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // 1. Validate Full Name
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setValidationError('Please enter your full name.');
      return;
    }

    // 2. Validate Phone Number (10 digits)
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setValidationError('Please enter a valid 10-digit mobile number.');
      return;
    }

    // 3. Validate Service selection
    if (!formData.service || !CONSULTATION_SERVICES.includes(formData.service)) {
      setValidationError('Please select which service you are interested in.');
      return;
    }

    // 4. Validate Mandatory Terms & Conditions and Privacy Policy Acknowledgement
    if (!agreedToTerms) {
      setValidationError('Please acknowledge the Terms & Conditions and Privacy Policy to continue.');
      return;
    }

    // 4. Construct WhatsApp Message text & URL
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

    // 5. Determine Lead Source
    const source = isModal ? 'consultation_popup' : 'consultation_page';

    // 6. Save lead to Firestore BEFORE WhatsApp redirect
    // Requirement: Non-blocking error handling — if Firestore fails or times out,
    // catch error so the WhatsApp redirect still proceeds.
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
          userId: user?.uid || null,
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Firestore lead logging timeout')), 2500)
        )
      ]);
    } catch (dbErr) {
      console.warn('[BookingForm] Firestore lead save warning (proceeding to WhatsApp):', dbErr);
    }

    // Background sync to consultations collection for backwards compatibility with Admin Panel
    submitConsultation({
      name: trimmedName,
      phone: cleanPhone,
      email: '',
      problemCategory: mapServiceToCategory(formData.service),
      message: formData.message.trim() || `Consultation request for ${formData.service} (${source})`,
      userId: user?.uid || null,
    }).catch((consultErr) => {
      console.warn('[BookingForm] Background consultation sync warning:', consultErr);
    });

    // 7. Execute WhatsApp Redirect
    const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Fallback if browser blocked the new window due to async delay
      window.location.href = whatsappUrl;
    }

    // 8. Reset Form
    setFormData({
      name: '',
      phone: '',
      service: resolveInitialService(),
      message: '',
    });
    setAgreedToTerms(false);

    const confirmationText = 'Almost done! Please tap Send in WhatsApp to complete your request.';
    setSubmittedConfirmation(confirmationText);

    // 9. If in popup mode, trigger success callback (which closes modal & shows toast)
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
              WhatsApp Request Ready
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-emerald-950 leading-snug">
              {submittedConfirmation}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800 mt-2 leading-relaxed">
              We have pre-filled your details in WhatsApp chat with our advocates. Just hit the <strong className="text-emerald-950">Send</strong> button in WhatsApp to submit your request.
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
                <span>Re-open WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              type="button"
              onClick={() => setSubmittedConfirmation('')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline cursor-pointer py-1"
            >
              Submit another request
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
              Full Name <span className="text-[#168CFF]">*</span>
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
                placeholder="e.g. Vikram Sharma"
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
              Phone Number <span className="text-[#168CFF]">*</span>
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
                placeholder="10-digit mobile number (e.g. 9876543210)"
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
              Which service are you interested in? <span className="text-[#168CFF]">*</span>
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
                    {srv}
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
              Message / Details <span className="text-neutral-400 font-normal text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <textarea
                id="booking-message"
                name="message"
                rows={isModal ? 3 : 4}
                placeholder="Briefly describe your loan details, lender name, legal notices received, or harassment issues..."
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
                I acknowledge that I have read and agree to the{' '}
                <a
                  href="#terms"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className="text-[#0B2A5B] font-semibold underline hover:text-[#168CFF] transition-colors"
                >
                  Terms &amp; Conditions
                </a>{' '}
                and{' '}
                <a
                  href="#privacy"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className="text-[#0B2A5B] font-semibold underline hover:text-[#168CFF] transition-colors"
                >
                  Privacy Policy
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

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-2 w-full inline-flex items-center justify-center gap-2.5 bg-[#0B2A5B] hover:bg-[#123E8A] text-white rounded-xl py-3.5 px-6 text-sm font-semibold transition-all shadow-md cursor-pointer hover:shadow-lg active:scale-[0.99] group min-h-[44px]"
          >
            <span>Submit via WhatsApp</span>
            <ArrowRight className="w-4 h-4 text-[#F4B400] group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Subtle trust strip directly beneath CTA */}
          <TrustStrip className="mt-1" centered={true} />

          {/* Trust / Confidentiality Note */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 pt-1 text-center">
            <Lock className="w-3.5 h-3.5 text-[#168CFF] shrink-0" />
            <span>Advocate-Client Privilege • Free & Confidential Consultation</span>
          </div>

        </form>
      )}
    </div>
  );
}
