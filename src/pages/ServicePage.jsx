import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  PhoneCall, 
  Scale 
} from 'lucide-react';
import Footer from '../components/Footer';
import CardBorderTrace from '../components/CardBorderTrace';
import ServiceConsultationSection from '../components/ServiceConsultationSection';
import TrustStrip from '../components/TrustStrip';
import { SERVICES_DATA } from '../data/servicesData';

export default function ServicePage({
  serviceKey,
  user,
  userProfile,
  onOpenConsult,
  onOpenSignIn,
}) {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Resolve service data from prop or URL slug
  const activeSlug = serviceKey || slug || 'harassment-protection';
  const service = SERVICES_DATA[activeSlug] || SERVICES_DATA['harassment-protection'];

  // Scroll to top when service changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeSlug]);

  const scrollToForm = () => {
    const el = document.getElementById('consultation-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const delays = [0, 0.6, 1.2, 1.8, 2.4];

  return (
    <div className="min-h-screen w-full bg-[#ededed] p-3 sm:p-4 font-inter text-neutral-900 selection:bg-[#168CFF]/20 selection:text-[#0B2A5B] flex flex-col gap-3 sm:gap-4 overflow-x-hidden">
      
      {/* ======================================================== */}
      {/* 1. TOP HERO CONTAINER (Navbar + Breadcrumb + Problem Intro) */}
      {/* ======================================================== */}
      <div className="relative w-full overflow-hidden bg-[#d9d9d9] rounded-2xl sm:rounded-3xl flex flex-col justify-between pb-8 sm:pb-12 lg:pb-16 shadow-sm border border-neutral-200/60">
        
        {/* Seamless sky and soft clouds background matching homepage */}
        <img
          src="/assets/hero-sky-clean.jpg"
          alt="Clean sky background representing clarity and peace of mind during legal resolution"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          loading="eager"
        />

        {/* Soft overlay */}
        <div className="absolute inset-0 bg-white/15 pointer-events-none" />

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col w-full h-full">
          {/* Breadcrumb Navigation Pill */}
          <div className="max-w-5xl mx-auto w-full px-4 pt-6 sm:pt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#0B2A5B] hover:text-[#168CFF] bg-white/80 hover:bg-white px-3 py-1.5 rounded-full border border-neutral-200/80 shadow-xs transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to All Services</span>
            </button>

            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider hidden sm:inline">
              Services / {service.title}
            </span>
          </div>

          {/* Intro Section */}
          <motion.div 
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center px-4 pt-4 sm:pt-6 text-center select-none max-w-4xl mx-auto w-full"
          >
            {/* Category Tag Badge */}
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-xs border border-[#168CFF]/20 text-[12.5px] font-semibold text-[#0B2A5B] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#168CFF] shadow-[0_0_6px_rgba(22,140,255,0.6)]" />
              <span>{service.tag}</span>
            </div>

            {/* Large Bold Heading Naming the Problem */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[52px] font-bold text-[#0B2A5B] tracking-tight leading-[1.15] max-w-3xl font-inter break-words px-2">
              {service.heading}
            </h1>

            {/* 2-3 Short Sentences Explaining in Plain Language */}
            <p className="mt-4 sm:mt-5 text-neutral-700 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
              {service.intro}
            </p>

            {/* Quick Trust Row */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-medium text-[#0B2A5B]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-neutral-200/80 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#168CFF]" />
                100% Confidential
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-neutral-200/80 shadow-2xs">
                <Scale className="w-3.5 h-3.5 text-[#F4B400]" />
                Advocate Assisted
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-neutral-200/80 shadow-2xs">
                <Lock className="w-3.5 h-3.5 text-[#168CFF]" />
                RBI Compliant
              </span>
            </div>

            {/* Primary Action Button */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(`/book-consultation?service=${service.slug}`)}
                className="inline-flex items-center gap-3 bg-[#0B2A5B] hover:bg-[#123E8A] text-white rounded-full pl-6 sm:pl-7 pr-2 py-2.5 sm:py-2.5 text-[14px] font-medium transition-all shadow-md cursor-pointer hover-glow-lift active:scale-[0.98] min-h-[44px]"
              >
                <span>Book a Free Consultation</span>
                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <ChevronRight className="w-4 h-4 text-[#F4B400]" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => onOpenConsult?.(service.ctaTopic)}
                className="text-xs sm:text-sm font-semibold text-[#0B2A5B] hover:text-[#168CFF] underline sm:no-underline sm:bg-white/60 sm:hover:bg-white sm:px-4 sm:py-2.5 sm:rounded-full sm:border sm:border-neutral-200/80 transition-all cursor-pointer min-h-[44px] flex items-center justify-center"
              >
                Request Instant Callback
              </button>
            </div>

            {/* Subtle trust strip directly beneath Service Hero CTA */}
            <div className="mt-2.5">
              <TrustStrip centered={true} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. KEY BENEFITS ROW (4-5 items horizontal / responsive grid) */}
      {/* ======================================================== */}
      <section className="w-full py-8 sm:py-12 px-2 sm:px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#168CFF]/20 text-xs font-mono uppercase tracking-widest text-[#123E8A] mb-3 shadow-2xs mx-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-[#168CFF] animate-pulse" />
              Key Benefits
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0B2A5B] tracking-tight break-words px-2">
              Why Choose LegalBharosa for {service.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-lg mx-auto">
              Statutory protections, experienced advocate oversight, and complete peace of mind.
            </p>
          </div>

          {/* 5 Items Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            {service.keyBenefits.map((item, idx) => {
              const Icon = item.icon;
              const delay = delays[idx % delays.length];

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  className="group relative rounded-2xl bg-white p-5 sm:p-6 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_-4px_rgba(11,42,91,0.08),0_0_16px_rgba(22,140,255,0.1)] transition-all duration-300 hover:-translate-y-1 select-none border border-neutral-200/80"
                >
                  {/* Glowing Travelling Border Beam */}
                  <CardBorderTrace delay={delay} borderRadius={16} />

                  <div className="relative z-10">
                    {/* Icon Badge */}
                    <div className="w-11 h-11 rounded-xl bg-[#0B2A5B]/5 border border-[#168CFF]/20 text-[#123E8A] flex items-center justify-center group-hover:bg-[#0B2A5B] group-hover:text-[#F4B400] group-hover:border-[#F4B400]/40 transition-all duration-300 mb-4 shadow-2xs">
                      <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </div>

                    {/* Short Bold Title */}
                    <h3 className="text-[15px] sm:text-base font-bold text-[#0B2A5B] tracking-tight mb-2 group-hover:text-[#168CFF] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    {/* 1-2 Line Description Max */}
                    <p className="text-neutral-600 text-xs sm:text-[13px] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Micro Indicator */}
                  <div className="relative z-10 mt-4 pt-3 border-t border-neutral-100 flex items-center gap-1.5 text-[11px] font-semibold text-[#123E8A]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#168CFF]" />
                    <span>Included</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. HOW IT WORKS (3 numbered steps, short and clear) */}
      {/* ======================================================== */}
      <section className="w-full py-8 sm:py-12 px-2 sm:px-4 relative z-10">
        <div className="max-w-6xl mx-auto bg-[#f5f2ee] rounded-2xl sm:rounded-3xl border border-neutral-300/60 shadow-sm p-6 sm:p-10 lg:p-12">
          
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#168CFF]/20 text-xs font-mono uppercase tracking-widest text-[#123E8A] mb-3 shadow-2xs mx-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-[#168CFF] animate-pulse" />
              Simple Process
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B2A5B] tracking-tight">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-md mx-auto">
              Three transparent steps to solve your {service.title.toLowerCase()} challenges.
            </p>
          </div>

          {/* 3 Numbered Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
            {service.howItWorks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.12 }}
                className="relative bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Step Number Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#0B2A5B]/10 text-[#0B2A5B] font-mono text-xs font-bold">
                      Step {item.step}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#168CFF]" />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#0B2A5B] mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400 font-mono">
                  <span>Phase {index + 1} of 3</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#168CFF]" />
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. CONSULTATION CTA SECTION (Side by Side Form + Graphic) */}
      {/* ======================================================== */}
      <ServiceConsultationSection service={service} user={user} />

      {/* ======================================================== */}
      {/* 5. FOOTER */}
      {/* ======================================================== */}
      <Footer
        onOpenConsult={onOpenConsult}
        onNavigateHome={() => navigate('/')}
        onNavigateToAbout={() => navigate('/about')}
      />

    </div>
  );
}
