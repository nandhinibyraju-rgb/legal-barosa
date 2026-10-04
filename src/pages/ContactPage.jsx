import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  Scale, 
  MessageCircle, 
  ArrowRight 
} from 'lucide-react';
import DarkPageHeader from '../components/DarkPageHeader';
import Footer from '../components/Footer';
import BookingForm from '../components/BookingForm';
import CardBorderTrace from '../components/CardBorderTrace';
import { subscribeSetting, DEFAULT_CONTACT_SETTINGS } from '../services/firestoreService';

// Official SVG WhatsApp Icon
function WhatsAppIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}

const DEFAULT_PHONE = '7386444186';
const DEFAULT_EMAIL = 'Legalbharosa.orga@gmail.com';
const DEFAULT_MAPS = 'https://maps.app.goo.gl/AUEVoh3Y6EPQoV5n6?g_st=ac';

export default function ContactPage({
  user,
  userProfile: _userProfile,
  onOpenConsult,
  onOpenSignIn: _onOpenSignIn
}) {
  const navigate = useNavigate();
  const [contactSettings, setContactSettings] = useState(DEFAULT_CONTACT_SETTINGS);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const unsub = subscribeSetting('contact', (data) => {
      setContactSettings(data);
    }, DEFAULT_CONTACT_SETTINGS);
    return () => unsub();
  }, []);

  const phone = contactSettings?.phone || DEFAULT_PHONE;
  const email = contactSettings?.email || DEFAULT_EMAIL;
  const mapsUrl = contactSettings?.mapsUrl || DEFAULT_MAPS;
  const whatsappUrl = `https://wa.me/${contactSettings?.whatsappNumber || '917386444186'}?text=${encodeURIComponent(contactSettings?.whatsappMessage || 'Hello LegalBharosa, I would like to consult regarding my case.')}`;

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] font-inter text-neutral-900 selection:bg-[#168CFF]/20 selection:text-[#0B2A5B] flex flex-col overflow-x-hidden">
      {/* 1. HERO HEADER */}
      <DarkPageHeader
        breadcrumbText="Support / Contact Us"
        maxWidth="max-w-4xl"
      >
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center px-4 pt-5 sm:pt-7 text-center select-none max-w-3xl mx-auto w-full"
        >
          <div className="inline-flex items-center gap-2 bg-[#0A2660]/85 backdrop-blur-md rounded-full px-4 py-1.5 shadow-xs border border-[#168CFF]/35 text-[12px] sm:text-[12.5px] font-semibold text-[#BAE6FD] mb-3.5">
            <span className="w-2 h-2 rounded-full bg-[#25D366] shadow-[0_0_6px_rgba(37,211,102,0.6)]" />
            <span>Direct Advocate & Corporate Support Desk</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.12] font-heading">
            Contact LegalBharosa
          </h1>

          <p className="mt-3.5 sm:mt-4 text-slate-200 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed font-normal">
            Have questions regarding recovery agent harassment, loan settlement, or legal notices? Connect directly with our team.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-medium text-slate-200">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
              100% Confidential
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-2xs">
              <Scale className="w-3.5 h-3.5 text-[#FBBF24]" />
              Bar Council Advocates
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
              Quick Response
            </span>
          </div>
        </motion.div>
      </DarkPageHeader>

      {/* 2. CONTACT DETAILS CARDS GRID */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Phone */}
          <div className="relative rounded-2xl bg-white p-5 sm:p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md transition-all flex flex-col justify-between group">
            <CardBorderTrace delay={0} borderRadius={16} />
            <div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#062D78] border border-blue-100 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                Phone Support
              </span>
              <h3 className="text-base font-bold text-[#0B2A5B] mb-1">
                Direct Call Desk
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Speak directly with our legal coordination desk during working hours.
              </p>
            </div>
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-[#062D78] text-[#062D78] hover:text-white font-semibold text-xs transition-colors border border-slate-200/70"
            >
              <span className="font-mono tracking-wide">{phone}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Email */}
          <div className="relative rounded-2xl bg-white p-5 sm:p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md transition-all flex flex-col justify-between group">
            <CardBorderTrace delay={1.2} borderRadius={16} />
            <div>
              <div className="w-11 h-11 rounded-xl bg-sky-50 text-[#0284C7] border border-sky-100 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                Official Email
              </span>
              <h3 className="text-base font-bold text-[#0B2A5B] mb-1">
                Document Submission
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Email notices, recovery correspondence, and detailed case inquiries.
              </p>
            </div>
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-[#0284C7] text-[#0284C7] hover:text-white font-semibold text-xs transition-colors border border-slate-200/70"
            >
              <span className="truncate">{email}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>

          {/* Card 3: WhatsApp */}
          <div className="relative rounded-2xl bg-white p-5 sm:p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md transition-all flex flex-col justify-between group">
            <CardBorderTrace delay={2.4} borderRadius={16} />
            <div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#25D366] border border-emerald-100 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
                <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                Instant Chat
              </span>
              <h3 className="text-base font-bold text-[#0B2A5B] mb-1">
                WhatsApp Desk
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Fast advocate evaluation and instant guidance directly on WhatsApp.
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-[#25D366] text-emerald-800 hover:text-white font-semibold text-xs transition-colors border border-emerald-200/80"
            >
              <span>Chat on WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 4: Clearly Labelled Company Location */}
          <div className="relative rounded-2xl bg-white p-5 sm:p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md transition-all flex flex-col justify-between group">
            <CardBorderTrace delay={0.6} borderRadius={16} />
            <div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-[#D97706] border border-amber-100 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                Physical Office
              </span>
              <h3 className="text-base font-bold text-[#0B2A5B] mb-1">
                Company Location
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Consultation and representative desk based in Hyderabad, India.
              </p>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-[#D97706] text-amber-900 hover:text-white font-semibold text-xs transition-colors border border-amber-200/80"
            >
              <span>View on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* 3. MAIN SECTION: COMPANY LOCATION MAP & INTAKE FORM */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: COMPANY LOCATION & MAP SECTION (Span 6) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-[#D97706]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#0B2A5B]">
                      Company Location
                    </h2>
                    <p className="text-xs text-slate-500">
                      LegalBharosa Office & Consultation Headquarters
                    </p>
                  </div>
                </div>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#062D78] hover:bg-[#062D78] hover:text-white text-xs font-semibold transition-colors"
                >
                  <span>View on Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Embedded Google Map */}
              <div className="w-full h-72 sm:h-80 rounded-xl overflow-hidden border border-slate-200/90 relative shadow-inner">
                <iframe
                  title="LegalBharosa Company Location"
                  src="https://maps.google.com/maps?q=VV+Vintage+Boulevard,+Raj+Bhavan+Rd,+Somajiguda,+Hyderabad,+Telangana+500082&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              {/* Location details card */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                  <span>
                    Hyderabad, Telangana, India
                  </span>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#062D78] hover:underline font-semibold"
                >
                  <span>Open in Google Maps App</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Support Information Box */}
            <div className="bg-[#062D78] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-md">
              <div className="flex items-center gap-2.5 mb-3">
                <ShieldCheck className="w-5 h-5 text-[#38BDF8]" />
                <h3 className="font-bold text-base">
                  Borrower Protection & Privacy Guarantee
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed mb-4">
                All inquiries submitted to LegalBharosa are strictly confidential under advocate-client privilege. We do not disclose borrower information to lenders, recovery agents, or employers.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-blue-200">
                <span className="flex items-center gap-1">
                  ✓ Bar Council Registered Advocates
                </span>
                <span className="flex items-center gap-1">
                  ✓ RBI Fair Practices Enforcement
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: INTAKE & CASE EVALUATION FORM (Span 6) */}
          <div className="lg:col-span-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 relative overflow-visible">
            <CardBorderTrace delay={0.8} borderRadius={24} />
            <div className="relative z-10">
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#062D78] text-xs font-semibold mb-2">
                  <MessageCircle className="w-3.5 h-3.5 text-[#168CFF]" />
                  <span>Direct Case Review</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0B2A5B] tracking-tight">
                  Send Your Inquiry
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Provide your details below to receive a personalized legal strategy from an NPA and debt recovery advocate.
                </p>
              </div>

              {/* Booking / Inquiry Form */}
              <BookingForm
                isModal={false}
                defaultService="General Legal Consultation"
                user={user}
              />
            </div>
          </div>

        </div>
      </section>

      {/* 4. FOOTER */}
      <Footer
        onOpenConsult={onOpenConsult}
        onNavigateHome={() => navigate('/')}
        onNavigateToAbout={() => navigate('/about')}
      />
    </div>
  );
}
