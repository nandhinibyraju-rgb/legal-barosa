import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, 
  Scale, 
  Building2, 
  Lock, 
  UserCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  Award,
  Calendar,
  Gavel,
  Users
} from 'lucide-react';
import Footer from '../components/Footer';
import CardBorderTrace from '../components/CardBorderTrace';
import { DarkPageHeaderAtmosphere } from '../components/DarkPageHeader';

export default function AboutPage({
  user,
  userProfile,
  onOpenConsult,
  onOpenSignIn,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const timelineScrollRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.title = `${t('about.title', 'About Us')} | LegalBharosa`;
  }, [t]);

  // Horizontal Timeline Scroll Controls
  const scrollTimeline = (direction) => {
    if (timelineScrollRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      timelineScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // 4 Core Pillars from existing content
  const pillars = [
    {
      icon: Scale,
      title: 'Qualified Advocates',
      desc: 'All legal defense is handled directly by Bar Council of India-registered advocates specializing in debt recovery law, SARFAESI defense, and NI Act Section 138.',
      badge: 'BCI Registered',
    },
    {
      icon: ShieldCheck,
      title: 'RBI Fair Practices Code',
      desc: 'We enforce the Reserve Bank of India’s Fair Practice Code against abusive recovery agent harassment, unlawful contact hours, and workplace intimidation.',
      badge: 'Statutory Shield',
    },
    {
      icon: Building2,
      title: 'Structured Settlements',
      desc: 'Negotiate transparent, lender-approved One-Time Settlements (OTS) with formal written waivers and official No Dues Certificates (NDC).',
      badge: 'Formal Waivers',
    },
    {
      icon: Lock,
      title: 'Dignity & Confidentiality',
      desc: 'Your financial hardships, loan documents, and personal data remain protected with strict privilege, zero judgment, and complete discretion.',
      badge: '100% Confidential',
    },
  ];

  // Panel Advocates Details from existing content
  const teamMembers = [
    {
      id: 1,
      name: 'Adv. S. Sharma',
      role: 'Senior Advocate — Debt Recovery Law',
      credential: 'Bar Council Registered, 14+ years experience',
      specialty: 'RBI Fair Practices & Loan Harassment Shield',
      initials: 'SS',
    },
    {
      id: 2,
      name: 'Adv. R. Kulkarni',
      role: 'Senior Advocate — Banking & SARFAESI Law',
      credential: 'Bar Council Registered, 12+ years experience',
      specialty: 'NPA Restructuring & DRT Proceedings',
      initials: 'RK',
    },
    {
      id: 3,
      name: 'Adv. P. Mehta',
      role: 'Advocate & Commercial Litigation Lead',
      credential: 'Bar Council Registered, 10+ years experience',
      specialty: 'Cheque Bounce & Section 138 Defense',
      initials: 'PM',
    },
    {
      id: 4,
      name: 'Adv. V. Narayanan',
      role: 'Lead Financial Restructuring Counsel',
      credential: 'Bar Council Registered, 15+ years experience',
      specialty: 'One-Time Settlement (OTS) Negotiations',
      initials: 'VN',
    },
  ];

  // Company Journey Milestones
  const companyMilestones = [
    {
      year: '2021',
      title: 'Foundation & Legal Aid Cell',
      tag: 'Inception',
      desc: 'LegalBharosa established with a core panel of Bar Council of India-registered advocates to offer ethical defense for borrowers trapped in abusive debt recovery cycles.',
    },
    {
      year: '2022',
      title: 'RBI Fair Practice Enforcement',
      tag: 'Statutory Protocols',
      desc: 'Formalized rapid legal escalation frameworks under RBI guidelines to challenge illegal collection calls, intimidation, and unauthorized workplace visits.',
    },
    {
      year: '2023',
      title: 'Qualified Advocate Network',
      tag: 'National Reach',
      desc: 'Expanded verified panel coverage across major legal jurisdictions, establishing structured One-Time Settlement (OTS) negotiation desks with banks and NBFCs.',
    },
    {
      year: '2024',
      title: 'SARFAESI & DRT Specialization',
      tag: 'Asset Defense',
      desc: 'Launched specialized defense teams for property auction stays, Section 13(2) notice responses, and Debt Recovery Tribunal (DRT) filings for residential and MSME borrowers.',
    },
    {
      year: '2025',
      title: 'Borrower Rights & Resolution Milestone',
      tag: 'Dedicated Impact',
      desc: 'Strengthened borrower dispute advisory frameworks with structured legal guidance and official lender settlement documentation.',
    },
    {
      year: '2026',
      title: 'Digital Client Transparency Portal',
      tag: 'Client Empowerment',
      desc: 'Rolled out secure online case progress tracking, automated notice vault storage, and real-time advocate communication for every client across India.',
    },
  ];

  return (
    <div className="w-full bg-[#F8FAFC] p-2 sm:p-3 lg:p-3.5 font-inter text-neutral-900 selection:bg-[#168CFF]/20 selection:text-[#0B2A5B] flex flex-col gap-4 sm:gap-6 overflow-x-hidden">
      
      {/* ======================================================== */}
      {/* 1. HERO SECTION: TEXT LEFT, PROFESSIONAL ILLUSTRATION RIGHT */}
      {/* ======================================================== */}
      <section className="relative w-full rounded-2xl sm:rounded-3xl bg-[#02091A] border border-white/10 shadow-[0_12px_36px_rgba(2,9,26,0.28)] p-6 sm:p-10 lg:p-12 overflow-hidden">
        
        {/* Deep navy gradient + subtle white star/dot particles */}
        <DarkPageHeaderAtmosphere />

        {/* Breadcrumb Navigation Pill */}
        <div className="relative z-10 max-w-6xl mx-auto w-full mb-6 sm:mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/15 px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-md shadow-xs transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-[#38BDF8]" />
            <span>{t('common.back', 'Back to Home')}</span>
          </button>

          <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider hidden sm:inline">
            {t('nav.about', 'About LegalBharosa')}
          </span>
        </div>

        {/* 2-Column Hero: Left Mission Text, Right Illustration */}
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: Heading, 3-4 sentences description, CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-7 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A2660]/85 backdrop-blur-md border border-[#168CFF]/35 shadow-2xs text-xs font-semibold text-[#BAE6FD] mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
              <span>{t('about.badge', 'Dedicated Legal & Financial Counseling')}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.18] mb-5 font-heading break-words">
              {t('about.title', 'Our Mission: Ethical Defense & Legal Relief for Indian Borrowers')}
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-3 font-normal">
              {t('about.subtitle', 'LegalBharosa was founded to give individuals and small business owners facing EMI stress, recovery harassment, and legal notices a single, trustworthy place to turn to. We combine qualified advocate legal defense with structured financial restructuring — so no one has to navigate debt or legal intimidation alone.')}
            </p>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-6 font-normal">
              {t('about.missionDesc', 'Borrowers often face unfair stigma, coercive calls outside permissible hours, and confusing court summons. We believe that temporary financial difficulty is a challenge to be solved legally and strategically — never an excuse for intimidation or humiliation.')}
            </p>

            {/* Trust Badges Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6 text-xs font-semibold text-slate-200">
              <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 flex items-center gap-2 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span>{t('common.barCouncilVerified', 'BCI Enrolled Panel')}</span>
              </div>
              <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 flex items-center gap-2 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span>{t('common.rbiCompliant', 'RBI Compliance')}</span>
              </div>
              <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 flex items-center gap-2 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span>{t('common.confidentialGuaranteed', '100% Client Privilege')}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenConsult ? onOpenConsult('About Hero') : navigate('/book-consultation')}
                className="inline-flex items-center gap-2.5 bg-[#0B2A5B] hover:bg-[#123E8A] text-white rounded-full px-6 py-2.5 text-[14px] font-medium transition-all shadow-md cursor-pointer hover-glow-lift active:scale-[0.98] min-h-[44px] border border-[#168CFF]/40"
              >
                <span>{t('common.getFreeConsultation', 'Book a Free Consultation')}</span>
                <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <ChevronRight className="w-3.5 h-3.5 text-[#F4B400]" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('company-journey');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="text-xs sm:text-sm font-semibold text-white hover:text-white px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 transition-all cursor-pointer shadow-2xs min-h-[44px] flex items-center justify-center backdrop-blur-md"
              >
                Explore Company Journey ↓
              </button>
            </div>
          </motion.div>

          {/* RIGHT: Professional Team & Advocate Illustration Graphic */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5 flex items-center justify-center relative select-none"
          >
            <div className="relative w-full max-w-[420px] aspect-square rounded-3xl bg-gradient-to-tr from-white via-blue-50/80 to-white p-4 sm:p-6 border border-[#168CFF]/20 shadow-[0_10px_35px_rgba(11,42,91,0.08)] flex flex-col items-center justify-between">
              
              {/* Top Banner Tag */}
              <div className="w-full flex items-center justify-between border-b border-neutral-200/70 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0B2A5B] flex items-center justify-center text-[#F4B400]">
                    <Scale className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-[#0B2A5B]">LegalBharosa Panel</span>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#168CFF] border border-[#168CFF]/20">
                  Pan-India Advocacy
                </span>
              </div>

              {/* Center Vector Graphics Composition */}
              <div className="my-auto py-4 flex flex-col items-center justify-center relative w-full">
                {/* Center Shield Graphic */}
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#0B2A5B] via-[#0D3875] to-[#168CFF] flex items-center justify-center text-white shadow-xl border-2 border-white mb-3 relative group">
                  <ShieldCheck className="w-12 h-12 text-[#F4B400] animate-pulse" />
                  
                  {/* Surrounding Floating Chip Badges */}
                  <div className="absolute -top-3 right-0 sm:-right-4 px-2.5 py-1 rounded-full bg-white text-[#0B2A5B] font-bold text-[10px] shadow-md border border-neutral-200/90 whitespace-nowrap">
                    BCI Registered ⚖️
                  </div>
                  <div className="absolute -bottom-3 left-0 sm:-left-4 px-2.5 py-1 rounded-full bg-white text-[#168CFF] font-bold text-[10px] shadow-md border border-neutral-200/90 whitespace-nowrap">
                    RBI Fair Practices 🛡️
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#0B2A5B] text-center mt-2">
                  Advocate-Led Resolution Team
                </h3>
                <p className="text-xs text-neutral-500 text-center max-w-xs mt-1">
                  Empanelled advocates and legal advisors dedicated to protecting borrower dignity.
                </p>
              </div>

              {/* Bottom Metrics Pill Strip */}
              <div className="w-full grid grid-cols-2 gap-2 pt-3 border-t border-neutral-200/70 text-center">
                <div className="p-2 rounded-xl bg-white border border-neutral-200/80 shadow-2xs">
                  <span className="block text-sm font-bold text-[#0B2A5B]">Clear Guidance</span>
                  <span className="text-[10px] text-neutral-500">Legal Advisory</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-neutral-200/80 shadow-2xs">
                  <span className="block text-sm font-bold text-[#0B2A5B]">100% Confidential</span>
                  <span className="text-[10px] text-neutral-500">Privileged Enquiries</span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. 'COMPANY JOURNEY' HORIZONTAL SCROLLABLE TIMELINE */}
      {/* ======================================================== */}
      <section 
        id="company-journey"
        className="relative w-full rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/90 shadow-sm p-6 sm:p-10 lg:p-12 scroll-mt-24"
      >
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header with Left/Right Navigation Controls */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-[#168CFF]/20 text-xs font-mono uppercase tracking-widest text-[#123E8A] mb-2 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-[#168CFF]" />
                Milestones & Evolution
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2A5B] tracking-tight">
                Our Company Journey
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl">
                A timeline of growth from an advocate-led legal aid initiative into India's premier borrower rights protection organization.
              </p>
            </div>

            {/* Left / Right Arrow Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => scrollTimeline('left')}
                aria-label="Scroll Timeline Left"
                className="w-10 h-10 rounded-full border border-neutral-200 bg-white hover:bg-blue-50 hover:border-[#168CFF]/40 text-[#0B2A5B] hover:text-[#168CFF] flex items-center justify-center shadow-2xs transition-all cursor-pointer active:scale-95 min-h-[44px] min-w-[44px]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollTimeline('right')}
                aria-label="Scroll Timeline Right"
                className="w-10 h-10 rounded-full border border-neutral-200 bg-white hover:bg-blue-50 hover:border-[#168CFF]/40 text-[#0B2A5B] hover:text-[#168CFF] flex items-center justify-center shadow-2xs transition-all cursor-pointer active:scale-95 min-h-[44px] min-w-[44px]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Swipe Hint Badge (Only on small screens) */}
          <div className="sm:hidden mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0646A8] text-[11px] font-semibold border border-[#168CFF]/25">
              <span>Swipe timeline sideways to view milestones</span>
              <ArrowRight className="w-3 h-3 text-[#168CFF]" />
            </span>
          </div>

          {/* Horizontal Scrollable Timeline Container with touch swipe & card peek */}
          <div 
            ref={timelineScrollRef}
            className="overflow-x-auto pb-4 pt-2 scroll-smooth select-none touch-pan-x"
            style={{ 
              scrollbarWidth: 'thin',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <div className="inline-flex relative pb-2 min-w-full">
              
              {/* Horizontal Connecting Track Line */}
              <div 
                aria-hidden="true"
                className="absolute top-[26px] left-6 right-6 h-[3px] bg-neutral-200 -z-0"
              />
              <div 
                aria-hidden="true"
                className="absolute top-[26px] left-6 w-5/6 h-[3px] bg-gradient-to-r from-[#0B2A5B] via-[#168CFF] to-[#F4B400] -z-0"
              />

              {/* Milestone Markers & Cards Flex Row (w-[260px] provides natural ~60px peek on 375px mobile screens) */}
              <div className="flex gap-4 sm:gap-6 relative z-10">
                {companyMilestones.map((m, idx) => (
                  <div key={idx} className="w-[260px] sm:w-[280px] shrink-0 flex flex-col items-start text-left">
                    
                    {/* Circular Marker on the Horizontal Track */}
                    <div className="mb-4 flex items-center gap-2">
                      <div className="w-13 h-13 rounded-full bg-[#0B2A5B] text-white border-4 border-white shadow-md flex items-center justify-center font-bold text-xs font-mono shrink-0 group-hover:bg-[#168CFF] transition-colors">
                        <span className="text-white text-[13px]">{m.year}</span>
                      </div>
                    </div>

                    {/* Milestone Card Below */}
                    <div className="w-full p-4 sm:p-5 rounded-2xl bg-neutral-50/90 border border-neutral-200/90 shadow-xs hover:shadow-md hover:bg-white hover:border-[#168CFF]/30 transition-all flex flex-col justify-between h-[210px]">
                      <div>
                        <span className="inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#168CFF] border border-[#168CFF]/20 mb-2">
                          {m.tag}
                        </span>

                        <h3 className="text-sm font-bold text-[#0B2A5B] leading-snug mb-2">
                          {m.title}
                        </h3>

                        <p className="text-xs text-neutral-600 leading-relaxed">
                          {m.desc}
                        </p>
                      </div>

                      <div className="text-[10px] font-mono font-semibold text-neutral-400 pt-2 border-t border-neutral-200/60 flex items-center justify-between">
                        <span>Milestone 0{idx + 1}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Timeline Navigation Footnote */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-neutral-500 pt-2 border-t border-neutral-100">
            <span>Scroll horizontally or use arrow buttons to explore our track record</span>
            <span className="font-semibold text-[#0B2A5B]">2021 — 2026</span>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. CORE FOUNDATIONAL PILLARS SECTION */}
      {/* ======================================================== */}
      <section 
        id="about-pillars"
        className="w-full py-6 sm:py-8 px-2 sm:px-4 relative z-10 scroll-mt-24"
      >
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#168CFF]/20 text-xs font-mono uppercase tracking-widest text-[#123E8A] mb-3 shadow-2xs mx-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-[#168CFF] animate-pulse" />
              {t('about.pillarsTitle', 'Our Foundational Pillars')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2A5B] tracking-tight">
              {t('about.visionTitle', 'Ethical Defense & Borrower Protection')}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-lg mx-auto">
              {t('about.visionDesc', 'How we protect your legal rights, peace of mind, and financial future.')}
            </p>
          </div>

          {/* 4 Pillars Grid with Glowing Border Trace */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              const delays = [0, 1.4, 2.8, 0.7];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ 
                    duration: 0.65, 
                    delay: index * 0.1,
                    ease: [0.25, 1, 0.5, 1] 
                  }}
                  onClick={() => navigate('/book-consultation')}
                  className="group relative rounded-2xl bg-white p-6 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_-4px_rgba(11,42,91,0.09),0_0_16px_rgba(22,140,255,0.12)] transition-all duration-300 cursor-pointer hover:-translate-y-1 select-none overflow-visible border border-neutral-200/80"
                >
                  <CardBorderTrace delay={delays[index]} borderRadius={16} />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-[#0B2A5B]/5 border border-[#168CFF]/20 text-[#123E8A] flex items-center justify-center group-hover:bg-[#0B2A5B] group-hover:text-[#F4B400] transition-colors shadow-xs">
                        <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                      </div>
                      <span className="text-[10.5px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#123E8A] border border-[#168CFF]/20">
                        {pillar.badge}
                      </span>
                    </div>

                    <h3 className="text-[17px] font-bold text-[#0B2A5B] mb-2 tracking-tight group-hover:text-[#168CFF] transition-colors">
                      {pillar.title}
                    </h3>

                    <p className="text-neutral-600 text-xs sm:text-[13px] leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="relative z-10 mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-[#123E8A] group-hover:text-[#168CFF] transition-colors">
                    <span>Explore Protection</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Credentials / Operating Entity Trust Strip */}
          <div className="group mt-8 relative rounded-2xl bg-white p-5 sm:p-7 border border-neutral-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_-4px_rgba(11,42,91,0.09),0_0_16px_rgba(22,140,255,0.12)] transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-visible">
            <CardBorderTrace delay={1.8} borderRadius={16} />
            
            <div className="relative z-10 flex items-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-[#168CFF]/25 flex items-center justify-center text-[#168CFF] shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[14px] sm:text-[15px] font-bold text-[#0B2A5B]">
                  Bar Council Registered Advocates & Legal Specialists
                </div>
                <div className="text-xs text-neutral-500">
                  Operating under Indian legal standards with qualified legal advocate representation.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/book-consultation')}
              className="relative z-10 inline-flex items-center gap-2 bg-[#0B2A5B] hover:bg-[#123E8A] text-white text-xs sm:text-[13px] font-medium px-4 py-2 rounded-full transition-colors shrink-0 cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <span>Consult an Advocate</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F4B400]" />
            </button>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. RECOGNIZED STANDARDS & ACCREDITATIONS */}
      {/* ======================================================== */}
      <section className="w-full py-6 sm:py-8 px-2 sm:px-4 relative z-10">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.05)] p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/80 border border-[#168CFF]/20 text-xs font-mono uppercase tracking-widest text-[#123E8A] mb-4 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#168CFF]" />
                Institutional Standards
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2A5B] tracking-tight mb-4">
                Operating in Full Alignment with Indian Law
              </h2>

              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
                We believe legal assistance must be accountable, transparent, and grounded in statute. Every notice reply, settlement negotiation, and DRT petition follows formal Bar Council of India professional standards and statutory Reserve Bank of India notifications.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-[#0B2A5B]">
                <div className="p-3 bg-neutral-50/80 rounded-xl border border-neutral-200/80 flex items-center gap-2.5 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Advocate Registry: BCI Enrolled</span>
                </div>
                <div className="p-3 bg-neutral-50/80 rounded-xl border border-neutral-200/80 flex items-center gap-2.5 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Recovery Shield: RBI Fair Practices</span>
                </div>
                <div className="p-3 bg-neutral-50/80 rounded-xl border border-neutral-200/80 flex items-center gap-2.5 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Settlements: Formal Written NDC</span>
                </div>
                <div className="p-3 bg-neutral-50/80 rounded-xl border border-neutral-200/80 flex items-center gap-2.5 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Confidentiality: 100% Client Privilege</span>
                </div>
              </div>
            </div>

            {/* Right Graphic Box */}
            <div className="lg:col-span-5 bg-gradient-to-b from-blue-50/60 to-white rounded-2xl p-6 sm:p-8 border border-[#168CFF]/25 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#0B2A5B] text-[#F4B400] flex items-center justify-center mb-4 shadow-xs">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0B2A5B] mb-2">
                  Recognized Accreditations & Compliance
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  Operating in strict alignment with Bar Council of India standards and Reserve Bank of India Fair Practice regulations.
                </p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-neutral-200/70 text-xs text-neutral-700">
                <div className="flex items-center justify-between">
                  <span>Advocate Registry:</span>
                  <span className="font-mono font-semibold text-[#123E8A] bg-white px-2 py-0.5 rounded border border-neutral-200">BCI Enrolled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Recovery Compliance:</span>
                  <span className="font-mono font-semibold text-[#123E8A] bg-white px-2 py-0.5 rounded border border-neutral-200">RBI Fair Practices</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Settlement Formalities:</span>
                  <span className="font-mono font-semibold text-[#123E8A] bg-white px-2 py-0.5 rounded border border-neutral-200">Written NDC/Waiver</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. PANEL ADVOCATES & SENIOR COUNSEL */}
      {/* ======================================================== */}
      <section className="w-full py-6 sm:py-8 px-2 sm:px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#168CFF]/20 text-xs font-mono uppercase tracking-widest text-[#123E8A] mb-3 shadow-2xs mx-auto">
              <Users className="w-3.5 h-3.5 text-[#168CFF]" />
              Qualified Panel
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2A5B] tracking-tight">
              Our Panel Advocates & Restructuring Counsel
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-lg mx-auto">
              Every client matter is reviewed and managed directly by qualified advocates with dedicated debt recovery domain expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow select-none"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-[#168CFF]/25 text-[#123E8A] flex items-center justify-center font-bold font-mono text-base mb-4 shadow-2xs">
                    {member.initials}
                  </div>

                  <h3 className="text-base font-bold text-[#0B2A5B] mb-1">
                    {member.name}
                  </h3>

                  <p className="text-xs font-medium text-[#168CFF] mb-2">
                    {member.role}
                  </p>

                  <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                    {member.credential}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100">
                  <span className="inline-block text-[10.5px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#0B2A5B]/5 text-[#0B2A5B]">
                    {member.specialty}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. CLOSING CONSULTATION CTA SECTION */}
      {/* ======================================================== */}
      <section className="w-full py-6 sm:py-8 px-2 sm:px-4 relative z-10">
        <div className="max-w-6xl mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-50 via-white to-blue-50 p-8 sm:p-12 text-center border border-[#168CFF]/25 shadow-sm relative overflow-hidden">
          <div 
            aria-hidden="true" 
            className="absolute -top-24 -right-24 w-72 h-72 bg-[#168CFF]/15 rounded-full blur-3xl pointer-events-none" 
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-3.5 py-1 shadow-2xs border border-[#168CFF]/20 text-xs font-semibold text-[#0B2A5B] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
              <span>Qualified Advocate Network</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0B2A5B] mb-3">
              Need Confidential Legal Assistance?
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-neutral-600 mb-6 leading-relaxed">
              Connect with our advocate panel to review your loan summons, harassment complaints, or one-time settlement options.
            </p>

            <button
              type="button"
              onClick={() => onOpenConsult ? onOpenConsult('About Bottom') : navigate('/book-consultation')}
              className="inline-flex items-center gap-3 bg-[#0B2A5B] hover:bg-[#123E8A] text-white rounded-full px-7 py-3 text-sm font-semibold transition-all shadow-md cursor-pointer hover-glow-lift active:scale-[0.98]"
            >
              <span>{t('common.getFreeConsultation', 'Book a Free Consultation')}</span>
              <ArrowRight className="w-4 h-4 text-[#F4B400]" />
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. FOOTER */}
      {/* ======================================================== */}
      <Footer
        onOpenConsult={onOpenConsult}
        onNavigateHome={() => navigate('/')}
        onNavigateToAbout={() => navigate('/about')}
      />

    </div>
  );
}
