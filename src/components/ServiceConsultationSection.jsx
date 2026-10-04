import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Phone, 
  Mail, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Lock 
} from 'lucide-react';
import { submitConsultation, saveLead } from '../services/firestoreService';
import ServiceGraphic from './ServiceGraphic';
import TrustStrip from './TrustStrip';

export default function ServiceConsultationSection({ 
  service, 
  user,
  title,
  subtitle
}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    phone: user?.phoneNumber || '',
    email: user?.email || '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setError('Please provide your name, phone number, and email.');
      return;
    }

    // Basic 10-digit phone check
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    // Mandatory Terms & Conditions and Privacy Policy Acknowledgement
    if (!agreedToTerms) {
      setError('Please acknowledge the Terms & Conditions and Privacy Policy to continue.');
      return;
    }

    setLoading(true);

    try {
      // Save lead to leads collection
      await saveLead({
        name: formData.name.trim(),
        phone: cleanPhone,
        service: service.title || 'Legal Consultation',
        message: `Direct Service Page Inquiry for: ${service.title} (${service.path}). Email: ${formData.email.trim()}`,
        source: 'service_page',
        status: 'new',
        whatsappSent: false,
        userId: user?.uid || null,
      });

      // Maintain backwards compatibility with consultations collection
      await submitConsultation({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        problemCategory: service.problemCategory,
        message: `Direct Service Page Inquiry for: ${service.title} (${service.path})`,
        userId: user?.uid || null,
      });

      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: user?.displayName || '',
        phone: user?.phoneNumber || '',
        email: user?.email || '',
      });
      setAgreedToTerms(false);
    } catch (err) {
      console.error('[ServiceConsultation] Error submitting consultation:', err);
      setLoading(false);
      setError('Unable to submit your inquiry at this moment. Please check your connection or try again.');
    }
  };

  return (
    <section 
      id="consultation-section" 
      className="w-full py-8 sm:py-12 relative z-10 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 shadow-sm p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Form & Call to Action */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B2A5B]/5 border border-[#168CFF]/20 text-xs font-mono uppercase tracking-widest text-[#123E8A] mb-4 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#168CFF] animate-pulse" />
              Confidential Case Evaluation
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B2A5B] tracking-tight mb-3">
              {title || 'Book a Free Consultation'}
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-6">
              {subtitle || `Connect with our legal advisors to evaluate your ${(service.title || 'legal').toLowerCase()} matter. No spam, 100% confidential under advocate-client privilege.`}
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col items-start gap-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-emerald-950">Consultation Request Received!</h3>
                  <p className="text-xs sm:text-sm text-emerald-800 mt-1 leading-relaxed">
                    Our dedicated legal consultant will review your case details and reach out via phone/email within 30 minutes during working hours.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* 1. Full Name */}
                <div>
                  <label htmlFor="service-full-name" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="service-full-name"
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-neutral-300 bg-neutral-50/50 text-neutral-900 text-[16px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#168CFF]/30 focus:border-[#168CFF] transition-all min-h-[44px]"
                    />
                  </div>
                </div>

                {/* 2. Phone Number */}
                <div>
                  <label htmlFor="service-phone" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Phone Number (10 digits) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      id="service-phone"
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-neutral-300 bg-neutral-50/50 text-neutral-900 text-[16px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#168CFF]/30 focus:border-[#168CFF] transition-all min-h-[44px]"
                    />
                  </div>
                </div>

                {/* 3. Email Address */}
                <div>
                  <label htmlFor="service-email" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="service-email"
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-neutral-300 bg-neutral-50/50 text-neutral-900 text-[16px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#168CFF]/30 focus:border-[#168CFF] transition-all min-h-[44px]"
                    />
                  </div>
                </div>

                {/* Mandatory Terms & Conditions and Privacy Policy Acknowledgement Checkbox */}
                <div className="flex flex-col gap-1 my-1">
                  <label 
                    htmlFor="service-terms-checkbox"
                    className="flex items-start gap-2.5 cursor-pointer select-none text-left group"
                  >
                    <input
                      type="checkbox"
                      id="service-terms-checkbox"
                      name="termsAgreement"
                      checked={agreedToTerms}
                      onChange={(e) => {
                        setAgreedToTerms(e.target.checked);
                        if (e.target.checked && error.includes('Terms & Conditions')) {
                          setError('');
                        }
                      }}
                      className={`mt-0.5 w-4 h-4 rounded border text-[#0B2A5B] focus:ring-[#168CFF] focus:ring-offset-0 focus:ring-2 accent-[#0B2A5B] cursor-pointer shrink-0 transition-colors ${
                        !agreedToTerms && error.includes('Terms & Conditions')
                          ? 'border-red-500 ring-2 ring-red-400/40'
                          : 'border-neutral-300'
                      }`}
                    />
                    <span className="text-xs text-neutral-600 leading-snug">
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
                  {!agreedToTerms && error.includes('Terms & Conditions') && (
                    <p className="text-[11.5px] text-red-600 font-medium pl-6.5 mt-0.5 animate-in fade-in duration-150">
                      {error}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 inline-flex items-center justify-center gap-3 bg-[#0B2A5B] hover:bg-[#123E8A] text-white rounded-xl py-3.5 px-6 text-sm font-semibold transition-all shadow-md cursor-pointer hover-glow-lift active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group min-h-[44px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#F4B400]" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Book a Free Consultation</span>
                      <ArrowRight className="w-4 h-4 text-[#F4B400] group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Subtle trust strip directly beneath CTA */}
                <TrustStrip className="mt-1" centered={false} />

                {/* Privacy disclaimer */}
                <div className="flex flex-col xs:flex-row items-center justify-between text-[11px] text-neutral-500 pt-1 gap-1">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-[#168CFF]" />
                    <span>Protected by Lawyer-Client Privilege</span>
                  </span>
                  <span>Zero Spam Guarantee</span>
                </div>

                {/* Direct Link to Dedicated Consultation Desk */}
                <div className="mt-2 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="text-neutral-500">Need full intake?</span>
                  <button
                    type="button"
                    onClick={() => navigate(`/book-consultation?service=${service.slug}`)}
                    className="font-semibold text-[#0B2A5B] hover:text-[#168CFF] inline-flex items-center gap-1 cursor-pointer transition-colors min-h-[44px] py-1"
                  >
                    <span>Full Intake Form</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F4B400]" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Tailored Service Illustration / Graphic */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <ServiceGraphic service={service} />
          </div>

        </div>
      </div>
    </section>
  );
}
