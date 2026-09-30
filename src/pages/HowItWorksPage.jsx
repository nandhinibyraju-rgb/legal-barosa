import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PhoneCall, 
  FileSearch, 
  UserCheck, 
  Scale, 
  ShieldCheck, 
  Award, 
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Clock,
  FileCheck
} from 'lucide-react';
import Footer from '../components/Footer';
import CardBorderTrace from '../components/CardBorderTrace';
import TrustStrip from '../components/TrustStrip';

export const PROCESS_STEPS = [
  {
    step: 1,
    title: 'Reach out / Book a free consultation',
    subtitle: 'Step 1: First Contact & Assessment',
    description: 'Connect with our advisory desk via our secure online booking or phone. Tell us about your loan accounts, collection pressure, or notices received with zero upfront obligation.',
    icon: PhoneCall,
    tag: 'Initial Touchpoint',
    highlights: ['100% Confidential', 'Zero judgment', 'Same-day callback'],
    timelineLabel: 'Day 1'
  },
  {
    step: 2,
    title: 'Case/document review by our team',
    subtitle: 'Step 2: Legal Audit & Viability Analysis',
    description: 'Our legal analysts examine your loan agreements, repayment history, recovery communications, and statutory notices to identify lender violations and define settlement leverage.',
    icon: FileSearch,
    tag: 'Evidence & Audit',
    highlights: ['RBI compliance verification', 'Notice validity audit', 'Fee transparency'],
    timelineLabel: 'Days 2–3'
  },
  {
    step: 3,
    title: 'Advocate assigned to your case',
    subtitle: 'Step 3: Dedicated Panel Representation',
    description: 'A dedicated Bar Council of India-registered advocate specializing in debt recovery law, SARFAESI defense, or Section 138 is assigned directly to handle your matter.',
    icon: UserCheck,
    tag: 'Bar Council Counsel',
    highlights: ['BCI-enrolled advocate', 'Direct advocate consultations', 'Customized legal strategy'],
    timelineLabel: 'Days 3–4'
  },
  {
    step: 4,
    title: 'Legal action taken',
    subtitle: 'Step 4: Notice Response, Negotiation & Defense',
    description: 'We issue formal statutory replies to court summons or bank notices, file formal complaints against unlawful harassment under the RBI Fair Practices Code, and lead OTS negotiations.',
    icon: Scale,
    tag: 'Statutory Action',
    highlights: ['Formal legal notice replies', 'Immediate anti-harassment shield', 'Lender OTS representation'],
    timelineLabel: 'Week 1–2'
  },
  {
    step: 5,
    title: 'Ongoing support until resolution',
    subtitle: 'Step 5: Active Representation & Monitoring',
    description: 'Our team stands between you and aggressive recovery agents. We provide ongoing counsel, review bank counter-proposals, and keep you informed at every milestone.',
    icon: ShieldCheck,
    tag: 'Continuous Defense',
    highlights: ['Dedicated case manager', 'Direct bank communication handling', 'Strict client privilege'],
    timelineLabel: 'Ongoing'
  },
  {
    step: 6,
    title: 'Case closed / resolution confirmed',
    subtitle: 'Step 6: Official Waivers & Peace of Mind',
    description: 'Receive the official lender-issued One-Time Settlement (OTS) sanction letter and the final No Dues Certificate (NDC). Your financial freedom is legally secured.',
    icon: Award,
    tag: 'Resolution Confirmed',
    highlights: ['Written lender NDC letter', 'Full debt waiver confirmation', 'Credit report restoration path'],
    timelineLabel: 'Final Settlement'
  }
];

export default function HowItWorksPage({
  user,
  userProfile,
  onOpenConsult,
  onOpenSignIn,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#ededed] p-2 sm:p-3 lg:p-3.5 font-inter text-neutral-900 selection:bg-[#168CFF]/20 selection:text-[#0B2A5B] flex flex-col gap-3 sm:gap-4 overflow-x-hidden">
      
      {/* ======================================================== */}
      {/* 1. TOP HERO CONTAINER (Navbar + Breadcrumb + Headline) */}
      {/* ======================================================== */}
      <div className="relative w-full overflow-hidden bg-[#d9d9d9] rounded-2xl sm:rounded-3xl flex flex-col justify-between pb-8 sm:pb-12 shadow-sm border border-neutral-200/60">
        
        {/* Seamless sky and soft clouds background */}
        <img
          src="/assets/hero-sky-clean.jpg"
          alt="Clean sky background"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          loading="eager"
        />

        {/* Soft overlay */}
        <div className="absolute inset-0 bg-white/10 pointer-events-none" />

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col w-full h-full">
          {/* Breadcrumb Navigation Pill */}
          <div className="max-w-6xl mx-auto w-full px-4 pt-6 sm:pt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#0B2A5B] hover:text-[#168CFF] bg-white/80 hover:bg-white px-3 py-1.5 rounded-full border border-neutral-200/80 shadow-xs transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Home</span>
            </button>

            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider hidden sm:inline">
              LegalBharosa / Client Journey Roadmap
            </span>
          </div>

          {/* Headline & Subtitle */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center px-4 pt-4 sm:pt-6 text-center select-none max-w-4xl mx-auto w-full"
          >
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-xs border border-[#168CFF]/20 text-[12.5px] font-semibold text-[#0B2A5B] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
              <span>Transparent 6-Stage Resolution Process</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[50px] font-bold text-[#0B2A5B] tracking-tight leading-[1.15] max-w-3xl font-inter uppercase break-words px-2">
              HOW LEGALBHAROSA WORKS
            </h1>

            <p className="mt-4 sm:mt-5 text-neutral-700 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
              From your initial consultation to statutory notice replies and official No Dues Certificates — a structured, advocate-backed client journey.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/book-consultation')}
                className="inline-flex items-center gap-3 bg-[#0B2A5B] hover:bg-[#123E8A] text-white rounded-full pl-6 sm:pl-7 pr-2 py-2 sm:py-2.5 text-[14px] font-medium transition-all shadow-md cursor-pointer hover-glow-lift active:scale-[0.98] min-h-[44px]"
              >
                <span>Book a Free Consultation</span>
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <ChevronRight className="w-4 h-4 text-[#F4B400]" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/services')}
                className="text-xs font-semibold text-[#0B2A5B] hover:text-[#168CFF] px-4 py-2.5 rounded-full bg-white/70 hover:bg-white border border-neutral-200/80 transition-all cursor-pointer min-h-[44px] flex items-center justify-center"
              >
                View All Services →
              </button>
            </div>

            {/* Repeat trust strip near hero CTA */}
            <div className="mt-3">
              <TrustStrip centered={true} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. VERTICAL TREE / TIMELINE ROADMAP */}
      {/* ======================================================== */}
      <section className="w-full py-8 sm:py-12 px-2 sm:px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#168CFF]/20 text-xs font-mono uppercase tracking-widest text-[#123E8A] mb-3 shadow-2xs mx-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-[#168CFF] animate-pulse" />
              The Step-by-Step Flowchart
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-[#0B2A5B] tracking-tight break-words px-2">
              Your Journey to Legal & Financial Relief
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-lg mx-auto">
              Every step is handled with complete transparency, advocate privilege, and strict adherence to RBI consumer protection norms.
            </p>
          </div>

          {/* Timeline Tree Container */}
          <div className="relative">
            
            {/* Center Connecting Vertical Line (Desktop: Center; Mobile: Left aligned) */}
            <div 
              aria-hidden="true" 
              className="absolute left-5 sm:left-8 md:left-1/2 top-4 bottom-8 w-1 -translate-x-1/2 bg-gradient-to-b from-[#168CFF] via-[#0B2A5B]/40 to-[#168CFF] rounded-full shadow-[0_0_10px_rgba(22,140,255,0.3)]" 
            />

            {/* Steps Flow */}
            <div className="space-y-8 sm:space-y-12">
              {PROCESS_STEPS.map((item, index) => {
                const Icon = item.icon;
                const isEven = index % 2 === 1; // Alternating layout for desktop

                return (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="relative flex flex-col md:flex-row items-start md:items-center"
                  >
                    {/* Left Side Content (Desktop: Even steps on left) */}
                    <div className={`w-full md:w-1/2 pl-12 sm:pl-16 md:pl-0 ${isEven ? 'md:order-2 md:pl-12' : 'md:order-1 md:pr-12 md:text-right'}`}>
                      <div className="group relative rounded-2xl bg-white p-4 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_-4px_rgba(11,42,91,0.09),0_0_16px_rgba(22,140,255,0.12)] transition-all duration-300 border border-neutral-200/80 text-left overflow-visible">
                        <CardBorderTrace delay={index * 0.6} borderRadius={16} />

                        <div className="relative z-10">
                          {/* Step Badge & Timing */}
                          <div className={`flex items-center justify-between gap-2 mb-3 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#123E8A] border border-[#168CFF]/25 font-mono text-[11px] font-bold">
                              <span>Step 0{item.step}</span>
                              <span className="w-1 h-1 rounded-full bg-[#168CFF]" />
                              <span>{item.tag}</span>
                            </span>

                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-500 font-medium bg-neutral-100/80 px-2 py-0.5 rounded-full">
                              <Clock className="w-3 h-3 text-[#168CFF]" />
                              <span>{item.timelineLabel}</span>
                            </span>
                          </div>

                          {/* Step Title */}
                          <h3 className="text-lg sm:text-xl font-bold text-[#0B2A5B] tracking-tight mb-2 group-hover:text-[#168CFF] transition-colors">
                            {item.title}
                          </h3>

                          {/* Description */}
                          <p className="text-xs sm:text-[13.5px] text-neutral-600 leading-relaxed mb-4">
                            {item.description}
                          </p>

                          {/* Key Highlights Row */}
                          <div className="pt-3 border-t border-neutral-100 flex flex-wrap gap-1.5 sm:gap-2">
                            {item.highlights.map((highlight, hIdx) => (
                              <span 
                                key={hIdx} 
                                className="inline-flex items-center gap-1 text-[10.5px] sm:text-[11px] font-medium text-[#0B2A5B] bg-neutral-50 px-2 sm:px-2.5 py-1 rounded-lg border border-neutral-200/70"
                              >
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>{highlight}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Central Node Badge on Vertical Line */}
                    <div className="absolute left-5 sm:left-8 md:left-1/2 top-5 md:top-auto -translate-x-1/2 z-20 flex items-center justify-center">
                      <div className="w-8.5 h-8.5 sm:w-11 sm:h-11 rounded-full bg-[#0B2A5B] border-3 sm:border-4 border-white shadow-[0_0_15px_rgba(22,140,255,0.4)] flex items-center justify-center text-white transition-transform hover:scale-110">
                        <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#F4B400]" />
                      </div>
                    </div>

                    {/* Right Side Spacer / Alternate Content for Balance */}
                    <div className={`hidden md:block w-1/2 ${isEven ? 'order-1 pr-12 text-right' : 'order-2 pl-12'}`}>
                      <div className="p-4 rounded-xl border border-dashed border-neutral-300/80 bg-white/40">
                        <span className="text-xs font-mono font-semibold text-[#123E8A] uppercase tracking-wider block mb-1">
                          Phase 0{item.step} of 06
                        </span>
                        <p className="text-xs text-neutral-500">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </div>

          </div>

          {/* End Milestone Marker */}
          <div className="mt-12 text-center relative z-20">
            <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-emerald-500/30 shadow-sm text-xs font-semibold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Full Dispute Resolution & Official No Dues Issued</span>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. TRUST & STATUTORY ACCREDITATION STRIP */}
      {/* ======================================================== */}
      <section className="w-full py-4 sm:py-6 px-2 sm:px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="group relative rounded-2xl bg-white p-5 sm:p-7 border border-neutral-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_-4px_rgba(11,42,91,0.09),0_0_16px_rgba(22,140,255,0.12)] transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-visible">
            <CardBorderTrace delay={1.2} borderRadius={16} />
            
            <div className="relative z-10 flex items-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-[#168CFF]/25 flex items-center justify-center text-[#168CFF] shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[14px] sm:text-[15px] font-bold text-[#0B2A5B]">
                  Statutory Protection & RBI Fair Practices Compliance
                </div>
                <div className="text-xs text-neutral-500">
                  Every step is backed by Bar Council enrolled advocates defending your legal rights and dignity.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/book-consultation')}
              className="relative z-10 inline-flex items-center gap-2 bg-[#0B2A5B] hover:bg-[#123E8A] text-white text-xs sm:text-[13px] font-medium px-5 py-2.5 rounded-full transition-colors shrink-0 cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F4B400]" />
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. CLOSING LIGHT SKY CTA SECTION */}
      {/* ======================================================== */}
      <section className="w-full py-8 sm:py-12 px-2 sm:px-4 relative z-10">
        <div className="max-w-5xl mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-50 via-white to-blue-50 p-8 sm:p-12 text-center border border-[#168CFF]/25 shadow-sm relative overflow-hidden">
          <div 
            aria-hidden="true" 
            className="absolute -top-24 -right-24 w-72 h-72 bg-[#168CFF]/15 rounded-full blur-3xl pointer-events-none" 
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-3.5 py-1 shadow-2xs border border-[#168CFF]/20 text-xs font-semibold text-[#0B2A5B] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
              <span>Free, Confidential Initial Review</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0B2A5B] mb-3">
              Ready to Take the First Step?
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-neutral-600 mb-6 leading-relaxed">
              Book a consultation now. Our advocates will review your documents and establish immediate protection against recovery pressure.
            </p>

            <button
              type="button"
              onClick={() => navigate('/book-consultation')}
              className="inline-flex items-center gap-3 bg-[#0B2A5B] hover:bg-[#123E8A] text-white rounded-full px-7 py-3 text-sm font-semibold transition-all shadow-md cursor-pointer hover-glow-lift active:scale-[0.98] min-h-[44px]"
            >
              <span>Book a Free Consultation</span>
              <ArrowRight className="w-4 h-4 text-[#F4B400]" />
            </button>

            {/* Repeat trust strip near bottom CTA */}
            <div className="mt-3">
              <TrustStrip centered={true} />
            </div>
          </div>
        </div>
      </section>

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
