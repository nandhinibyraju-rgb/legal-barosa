import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  Scale, 
  MessageCircle 
} from 'lucide-react';
import Footer from '../components/Footer';
import CardBorderTrace from '../components/CardBorderTrace';
import TrustStrip from '../components/TrustStrip';
import BookingForm, { CONSULTATION_SERVICES, mapTopicToService } from '../components/BookingForm';

export default function BookConsultationPage({
  user,
  userProfile: _userProfile,
  onOpenConsult,
  onOpenSignIn: _onOpenSignIn,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Determine initial service from query string (e.g. ?service=loan-settlement)
  const getInitialService = () => {
    const params = new URLSearchParams(location.search);
    const serviceParam = (params.get('service') || '').toLowerCase();
    
    if (serviceParam.includes('harass')) return 'Harassment Protection';
    if (serviceParam.includes('settle')) return 'Loan Settlement';
    if (serviceParam.includes('notice')) return 'Legal Notice Review';
    if (serviceParam.includes('debt')) return 'Debt Management';
    if (serviceParam.includes('npa') || serviceParam.includes('secured')) return 'NPA & Secured Loans';
    if (serviceParam.includes('credit')) return 'Credit Recovery';
    return mapTopicToService(serviceParam);
  };

  return (
    <div className="min-h-screen w-full bg-[#ededed] p-3 sm:p-4 font-inter text-neutral-900 selection:bg-[#168CFF]/20 selection:text-[#0B2A5B] flex flex-col gap-3 sm:gap-4 overflow-x-hidden">
      
      {/* ======================================================== */}
      {/* 1. TOP HERO CONTAINER (Navbar + Breadcrumb + Headline) */}
      {/* ======================================================== */}
      <div className="relative w-full overflow-hidden bg-[#d9d9d9] rounded-2xl sm:rounded-3xl flex flex-col justify-between pb-8 sm:pb-12 shadow-sm border border-neutral-200/60">
        
        {/* Seamless sky and clouds background */}
        <img
          src="/assets/hero-sky-clean.jpg"
          alt="Clear sky background"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          loading="eager"
        />

        {/* Soft overlay */}
        <div className="absolute inset-0 bg-white/15 pointer-events-none" />

        {/* Foreground Content Wrapper */}
        <div className="relative z-10 flex flex-col w-full h-full">
          {/* Breadcrumb Pill */}
          <div className="max-w-5xl mx-auto w-full px-4 pt-6 sm:pt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#0B2A5B] hover:text-[#168CFF] bg-white/80 hover:bg-white px-3 py-1.5 rounded-full border border-neutral-200/80 shadow-xs transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Home</span>
            </button>

            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider hidden sm:inline">
              Consultation / Free Evaluation
            </span>
          </div>

          {/* Headline & Subtitle */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center px-4 pt-4 sm:pt-6 text-center select-none max-w-3xl mx-auto w-full"
          >
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-xs border border-[#168CFF]/20 text-[12.5px] font-semibold text-[#0B2A5B] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#168CFF] shadow-[0_0_6px_rgba(22,140,255,0.6)]" />
              <span>Direct Legal Consultation Desk</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B2A5B] tracking-tight leading-[1.12] font-inter">
              Book a Free Consultation
            </h1>

            <p className="mt-3 sm:mt-4 text-neutral-700 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
              Share your situation confidentially. Our advocate and financial counselling team will review your case and reach out within 24 hours.
            </p>

            {/* Quick Trust Highlights */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-medium text-[#0B2A5B]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-neutral-200/80 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#168CFF]" />
                100% Confidential
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-neutral-200/80 shadow-2xs">
                <Scale className="w-3.5 h-3.5 text-[#F4B400]" />
                Bar Council Advocates
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-neutral-200/80 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-[#168CFF]" />
                24-Hour Callback
              </span>
            </div>

            {/* Repeat trust strip near hero CTA */}
            <div className="mt-3.5">
              <TrustStrip centered={true} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN CONSULTATION FORM & TRUST SIDEBAR SECTION */}
      {/* ======================================================== */}
      <section className="w-full py-6 sm:py-10 px-2 sm:px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT / MAIN COLUMN: THE BOOKING FORM (Span 7) */}
            <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 shadow-sm p-6 sm:p-10 relative overflow-visible">
              <CardBorderTrace delay={0.6} borderRadius={24} />

              <div className="relative z-10">
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0B2A5B] tracking-tight">
                    Case Intake Form
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                    All communications are strictly protected under advocate-client privilege.
                  </p>
                </div>

                {/* Shared Booking Form Component */}
                <BookingForm
                  isModal={false}
                  defaultService={getInitialService()}
                  user={user}
                />
              </div>
            </div>

            {/* RIGHT COLUMN: TRUST INFORMATION & WHAT TO EXPECT (Span 5) */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              
              {/* Card 1: What to Expect Next */}
              <div className="bg-[#f5f2ee] rounded-2xl sm:rounded-3xl border border-neutral-300/60 p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#0B2A5B] text-[#F4B400] flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-[#0B2A5B] text-base">
                    What Happens Next?
                  </h3>
                </div>

                <div className="space-y-4 text-xs sm:text-[13px] text-neutral-700">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#0B2A5B]/10 text-[#0B2A5B] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <p className="font-semibold text-[#0B2A5B]">Instant WhatsApp Handshake</p>
                      <p className="text-neutral-600 mt-0.5">Submit sends your pre-formatted details directly to our advocate intake desk via WhatsApp.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#0B2A5B]/10 text-[#0B2A5B] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <p className="font-semibold text-[#0B2A5B]">Confidential Legal Review</p>
                      <p className="text-neutral-600 mt-0.5">A designated panel advocate evaluates your situation against RBI guidelines and statutory rights.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#0B2A5B]/10 text-[#0B2A5B] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <p className="font-semibold text-[#0B2A5B]">Actionable Defense Plan</p>
                      <p className="text-neutral-600 mt-0.5">We provide immediate anti-harassment measures, formal dispute notices, or settlement roadmap.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Legal Guarantee Card */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2.5 mb-3">
                  <ShieldCheck className="w-5 h-5 text-[#168CFF]" />
                  <h4 className="font-bold text-[#0B2A5B] text-sm">
                    Borrower Rights Protection
                  </h4>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  You are legally protected under RBI's Fair Practices Code and statutory provisions. Lenders and recovery agents cannot harass, defame, or intimidate you.
                </p>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                  <span className="flex items-center gap-1.5 text-neutral-700 font-medium">
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>WhatsApp: +91 87907 60524</span>
                  </span>
                  <span className="text-[#168CFF] font-semibold">Verified</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. FOOTER */}
      {/* ======================================================== */}
      <Footer
        onOpenConsult={onOpenConsult}
        onNavigateHome={() => navigate('/')}
        onNavigateToAbout={() => navigate('/about')}
      />

    </div>
  );
}
