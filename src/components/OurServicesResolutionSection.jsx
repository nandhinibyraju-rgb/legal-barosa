import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  HeartHandshake, 
  CreditCard, 
  ShieldAlert, 
  BadgePercent, 
  Scale, 
  Building2, 
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import CentralLogoReveal from './CentralLogoReveal';

const SERVICE_KEY_MAP = {
  'credit-score-cibil': 'creditRecovery',
  'emi-debt-management': 'debtManagement',
  'harassment-protection': 'harassmentProtection',
  'loan-settlement-ots': 'loanSettlement',
  'legal-notice-support': 'legalNoticeReview',
  'npa-secured-loans': 'npaSecuredLoans',
};

const getLocalizedService = (service, t) => {
  const key = SERVICE_KEY_MAP[service.id];
  if (!key) return service;
  return {
    ...service,
    title: t(`services.items.${key}.title`, service.title),
    description: t(`services.items.${key}.shortDesc`, service.description),
  };
};

// Left Side 3 Floating Services
const LEFT_SERVICES = [
  {
    id: 'credit-score-cibil',
    title: 'Credit Score & CIBIL Correction',
    description: 'Review credit reports for disputed entries, incorrect default dates, and formal rectification steps.',
    route: '/services/credit-recovery',
    icon: TrendingUp,
    iconColor: 'text-[#078BE8]',
    iconBg: 'bg-blue-50 border-blue-200/70',
    floatAmp: 4,
    floatDuration: 5.4,
    floatDelay: 0,
    iconDuration: 3.8,
    iconDelay: 0.2,
  },
  {
    id: 'emi-debt-management',
    title: 'EMI & Debt Management',
    description: 'Review multiple EMIs and identify suitable repayment or restructuring pathways.',
    route: '/services/debt-management',
    icon: CreditCard,
    iconColor: 'text-[#0646A8]',
    iconBg: 'bg-indigo-50/80 border-indigo-200/70',
    floatAmp: 6,
    floatDuration: 6.2,
    floatDelay: 0.9,
    iconDuration: 4.4,
    iconDelay: 1.1,
  },
  {
    id: 'harassment-protection',
    title: 'Harassment Protection',
    description: 'Document recovery communications and understand available complaint and escalation pathways.',
    route: '/services/harassment-protection',
    icon: ShieldAlert,
    iconColor: 'text-[#168CFF]',
    iconBg: 'bg-sky-50 border-sky-200/70',
    floatAmp: 3,
    floatDuration: 4.8,
    floatDelay: 1.8,
    iconDuration: 3.5,
    iconDelay: 0.7,
  },
];

// Right Side 3 Floating Services
const RIGHT_SERVICES = [
  {
    id: 'loan-settlement-ots',
    title: 'Loan Settlement / OTS',
    description: 'Explore settlement options where appropriate, subject to lender approval and case-specific circumstances.',
    route: '/services/loan-settlement',
    icon: BadgePercent,
    iconColor: 'text-[#078BE8]',
    iconBg: 'bg-blue-50 border-blue-200/70',
    floatAmp: 5,
    floatDuration: 5.8,
    floatDelay: 0.4,
    iconDuration: 4.1,
    iconDelay: 0.5,
  },
  {
    id: 'legal-notice-support',
    title: 'Legal Notice Support',
    description: 'Understand notices, summons and other legal communications with appropriate professional support.',
    route: '/services/legal-notice-review',
    icon: Scale,
    iconColor: 'text-[#0B2A5B]',
    iconBg: 'bg-slate-50 border-slate-200/80',
    floatAmp: 4,
    floatDuration: 6.5,
    floatDelay: 1.3,
    iconDuration: 4.6,
    iconDelay: 1.4,
  },
  {
    id: 'npa-secured-loans',
    title: 'NPA & Secured Loans',
    description: 'Understand NPA, SARFAESI, possession, auction and related secured-loan risks.',
    route: '/services/npa-secured-loans',
    icon: Building2,
    iconColor: 'text-[#0646A8]',
    iconBg: 'bg-amber-50/70 border-amber-200/70',
    floatAmp: 6,
    floatDuration: 5.0,
    floatDelay: 2.3,
    iconDuration: 3.9,
    iconDelay: 1.9,
  },
];

export default function OurServicesResolutionSection({ onOpenConsult }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCardClick = (route) => {
    navigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section 
      id="our-services-resolution"
      aria-label="Our Services - Paths to Resolution"
      className="relative w-full py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F8FAFC] via-[#F1F6FD]/60 to-[#F8FAFC] overflow-hidden select-none"
    >
      {/* 
        ========================================================================
        1. ATMOSPHERIC BACKGROUND LIGHTING & SUBTLE AMBIENT ELEMENTS
        - Soft cyan glow behind center
        - Very subtle gold accent
        - Extremely subtle floating light elements
        ========================================================================
      */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
        {/* Central Soft Cyan / Blue Ambient Glow */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.65, 0.85, 0.65],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[750px] lg:w-[900px] h-[450px] sm:h-[550px] rounded-full bg-[radial-gradient(circle,rgba(18,185,242,0.12)_0%,rgba(7,139,232,0.06)_40%,rgba(11,42,91,0.02)_65%,transparent_75%)] blur-3xl"
        />

        {/* Delicate Warm Gold Accent Flare near Center Logo */}
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-[380px] sm:w-[480px] h-[280px] sm:h-[350px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.08)_0%,rgba(217,119,6,0.03)_50%,transparent_70%)] blur-2xl"
        />

        {/* 4 Subtle Floating Ambient Light Particles */}
        <motion.div
          animate={{ y: [-15, 15, -15], x: [-10, 10, -10], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[25%] left-[12%] w-2 h-2 rounded-full bg-[#12B9F2]/40 blur-[1px]"
        />
        <motion.div
          animate={{ y: [18, -18, 18], x: [12, -12, 12], opacity: [0.25, 0.6, 0.25] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[28%] left-[22%] w-2.5 h-2.5 rounded-full bg-[#078BE8]/35 blur-[1px]"
        />
        <motion.div
          animate={{ y: [-20, 20, -20], x: [14, -14, 14], opacity: [0.35, 0.75, 0.35] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute top-[28%] right-[15%] w-2 h-2 rounded-full bg-[#12B9F2]/40 blur-[1px]"
        />
        <motion.div
          animate={{ y: [15, -15, 15], x: [-10, 10, -10], opacity: [0.25, 0.65, 0.25] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-[24%] right-[20%] w-2.5 h-2.5 rounded-full bg-[#F59E0B]/30 blur-[1px]"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        
        {/* 
          ========================================================================
          2. TOP HEADER SECTION (Pill + Heading + Subtitle)
          ========================================================================
        */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-10 px-2"
        >
          {/* Small Pill: "OUR SERVICES" */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50/90 border border-[#078BE8]/25 text-[#0646A8] text-xs font-semibold tracking-widest uppercase mb-3.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#078BE8] animate-pulse" />
            <span>{t('services.badge', 'OUR SERVICES')}</span>
          </div>

          {/* Large Heading: "One Place. Multiple Paths to Resolution." */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-heading font-bold text-[#0B2A5B] tracking-tight leading-[1.18]">
            {t('services.title', 'One Place. Multiple Paths to Resolution.')}
          </h2>

          {/* Subtitle */}
          <p className="mt-3.5 sm:mt-4 text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            {t('services.subtitle', 'Practical financial guidance, legal support and resolution pathways — all in one place.')}
          </p>
        </motion.div>

        {/* 
          ========================================================================
          3. MAIN INTERACTIVE RESOLUTION STAGE: 3 LEFT + CENTER LOGO + 3 RIGHT
          ========================================================================
        */}
        <div className="relative w-full max-w-6xl mx-auto">

          {/* 
            ----------------------------------------------------------------------
            SVG CONNECTING CURVED LINES (Desktop/Tablet Large screens)
            Connects each card's inner anchor point to the central LegalBharosa logo
            with subtle flowing light pulses travelling along the paths
            ----------------------------------------------------------------------
          */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block overflow-visible z-0" 
            viewBox="0 0 1152 460" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              {/* Soft connecting path gradient: Blue to Cyan */}
              <linearGradient id="curveGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#078BE8" stopOpacity="0.12" />
                <stop offset="60%" stopColor="#12B9F2" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#078BE8" stopOpacity="0.45" />
              </linearGradient>
              <linearGradient id="curveGradRight" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#078BE8" stopOpacity="0.12" />
                <stop offset="60%" stopColor="#12B9F2" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#078BE8" stopOpacity="0.45" />
              </linearGradient>

              {/* Glowing light pulse travelling along lines */}
              <linearGradient id="pulseGlowLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#12B9F2" stopOpacity="0" />
                <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="pulseGlowRight" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#12B9F2" stopOpacity="0" />
                <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* LEFT 3 CURVES TOWARDS CENTER (Center at x: 576, y: 230) */}
            {/* Left Top Card -> Center */}
            <path 
              d="M 385 68 C 435 68 455 160 485 195" 
              stroke="url(#curveGradLeft)" 
              strokeWidth="1.75" 
              strokeDasharray="4 4"
            />
            {/* Left Middle Card -> Center */}
            <path 
              d="M 390 230 C 425 230 445 230 480 230" 
              stroke="url(#curveGradLeft)" 
              strokeWidth="2" 
              strokeDasharray="4 4"
            />
            {/* Left Bottom Card -> Center */}
            <path 
              d="M 385 392 C 435 392 455 300 485 265" 
              stroke="url(#curveGradLeft)" 
              strokeWidth="1.75" 
              strokeDasharray="4 4"
            />

            {/* RIGHT 3 CURVES TOWARDS CENTER */}
            {/* Right Top Card -> Center */}
            <path 
              d="M 767 68 C 717 68 697 160 667 195" 
              stroke="url(#curveGradRight)" 
              strokeWidth="1.75" 
              strokeDasharray="4 4"
            />
            {/* Right Middle Card -> Center */}
            <path 
              d="M 762 230 C 727 230 707 230 672 230" 
              stroke="url(#curveGradRight)" 
              strokeWidth="2" 
              strokeDasharray="4 4"
            />
            {/* Right Bottom Card -> Center */}
            <path 
              d="M 767 392 C 717 392 697 300 667 265" 
              stroke="url(#curveGradRight)" 
              strokeWidth="1.75" 
              strokeDasharray="4 4"
            />

            {/* ANIMATED INFORMATION FLOW PULSES (Gentle glowing dashes travelling towards center) */}
            <path 
              d="M 385 68 C 435 68 455 160 485 195" 
              stroke="url(#pulseGlowLeft)" 
              strokeWidth="2.5" 
              strokeDasharray="18 190"
              className="animate-pulse-flow-left"
            />
            <path 
              d="M 390 230 C 425 230 445 230 480 230" 
              stroke="url(#pulseGlowLeft)" 
              strokeWidth="2.5" 
              strokeDasharray="16 160"
              className="animate-pulse-flow-left"
              style={{ animationDelay: '0.8s' }}
            />
            <path 
              d="M 385 392 C 435 392 455 300 485 265" 
              stroke="url(#pulseGlowLeft)" 
              strokeWidth="2.5" 
              strokeDasharray="18 190"
              className="animate-pulse-flow-left"
              style={{ animationDelay: '1.6s' }}
            />
            <path 
              d="M 767 68 C 717 68 697 160 667 195" 
              stroke="url(#pulseGlowRight)" 
              strokeWidth="2.5" 
              strokeDasharray="18 190"
              className="animate-pulse-flow-right"
              style={{ animationDelay: '0.4s' }}
            />
            <path 
              d="M 762 230 C 727 230 707 230 672 230" 
              stroke="url(#pulseGlowRight)" 
              strokeWidth="2.5" 
              strokeDasharray="16 160"
              className="animate-pulse-flow-right"
              style={{ animationDelay: '1.2s' }}
            />
            <path 
              d="M 767 392 C 717 392 697 300 667 265" 
              stroke="url(#pulseGlowRight)" 
              strokeWidth="2.5" 
              strokeDasharray="18 190"
              className="animate-pulse-flow-right"
              style={{ animationDelay: '2.0s' }}
            />
          </svg>

          {/* 
            ----------------------------------------------------------------------
            DESKTOP LAYOUT (Grid 3 cols: Left 3 Services | Center Logo | Right 3 Services)
            ----------------------------------------------------------------------
          */}
          <div className="relative z-10 hidden lg:grid grid-cols-[1fr_auto_1fr] items-center gap-4 xl:gap-6">
            
            {/* LEFT 3 FLOATING SERVICE ITEMS */}
            <div className="flex flex-col gap-3.5 xl:gap-4 w-full max-w-[390px] xl:max-w-[420px] justify-self-end">
              {LEFT_SERVICES.map((rawService, index) => {
                const service = getLocalizedService(rawService, t);
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: -32 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.65,
                      delay: 0.2 + index * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {/* Natural Slow Floating Motion */}
                    <motion.div
                      animate={{
                        y: [-service.floatAmp, service.floatAmp, -service.floatAmp],
                      }}
                      transition={{
                        duration: service.floatDuration,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: service.floatDelay,
                      }}
                      whileHover={{
                        y: -5,
                        scale: 1.018,
                        transition: { duration: 0.32, ease: 'easeOut' },
                      }}
                      onClick={() => handleCardClick(service.route)}
                      className="group relative cursor-pointer rounded-[28px] bg-white/95 backdrop-blur-md p-3.5 xl:p-4 border border-blue-100/90 hover:border-[#078BE8]/50 shadow-[0_8px_24px_rgba(11,42,91,0.06),0_2px_8px_rgba(7,139,232,0.04)] hover:shadow-[0_16px_36px_rgba(7,139,232,0.18)] transition-all duration-350 ease-out flex items-center justify-between gap-3 xl:gap-3.5 select-none"
                    >
                      {/* Left Circular Icon Container with Micro-Float */}
                      <motion.div
                        animate={{
                          y: [-1.5, 1.5, -1.5],
                          boxShadow: [
                            '0 0 10px rgba(7,139,232,0.12)',
                            '0 0 18px rgba(18,185,242,0.28)',
                            '0 0 10px rgba(7,139,232,0.12)',
                          ],
                        }}
                        transition={{
                          duration: service.iconDuration,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: service.iconDelay,
                        }}
                        className={`w-11 h-11 xl:w-13 xl:h-13 rounded-full ${service.iconBg} border flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:brightness-110 transition-all duration-300 shadow-2xs`}
                      >
                        <Icon className={`w-5 h-5 xl:w-5.5 xl:h-5.5 ${service.iconColor}`} />
                      </motion.div>

                      {/* Service Title & Description */}
                      <div className="flex-1 min-w-0 pr-1">
                        <h3 className="text-[15px] xl:text-base font-bold text-[#0B2A5B] tracking-tight group-hover:text-[#078BE8] transition-colors duration-300 leading-snug">
                          {service.title}
                        </h3>
                        <p className="text-[11.5px] xl:text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* Opposite Side Action Indicator Arrow */}
                      <div className="w-6.5 h-6.5 xl:w-7 xl:h-7 rounded-full bg-blue-50/80 border border-blue-100 flex items-center justify-center text-[#168CFF] group-hover:bg-[#168CFF] group-hover:text-white group-hover:translate-x-1 transition-all duration-300 shrink-0 shadow-2xs">
                        <ArrowRight className="w-3 h-3 xl:w-3.5 xl:h-3.5" />
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {/* 
              ------------------------------------------------------------------
              CENTERPIECE: PREMIUM START-TO-FINISH LOGO REVEAL ANIMATION
              Progressive reveal from left to right, light sweep, gold finish glow
              ------------------------------------------------------------------
            */}
            <CentralLogoReveal isMobile={false} />

            {/* RIGHT 3 FLOATING SERVICE ITEMS */}
            <div className="flex flex-col gap-3.5 xl:gap-4 w-full max-w-[390px] xl:max-w-[420px] justify-self-start">
              {RIGHT_SERVICES.map((rawService, index) => {
                const service = getLocalizedService(rawService, t);
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: 32 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.65,
                      delay: 0.2 + index * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {/* Natural Slow Floating Motion */}
                    <motion.div
                      animate={{
                        y: [-service.floatAmp, service.floatAmp, -service.floatAmp],
                      }}
                      transition={{
                        duration: service.floatDuration,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: service.floatDelay,
                      }}
                      whileHover={{
                        y: -5,
                        scale: 1.018,
                        transition: { duration: 0.32, ease: 'easeOut' },
                      }}
                      onClick={() => handleCardClick(service.route)}
                      className="group relative cursor-pointer rounded-[28px] bg-white/95 backdrop-blur-md p-3.5 xl:p-4 border border-blue-100/90 hover:border-[#078BE8]/50 shadow-[0_8px_24px_rgba(11,42,91,0.06),0_2px_8px_rgba(7,139,232,0.04)] hover:shadow-[0_16px_36px_rgba(7,139,232,0.18)] transition-all duration-350 ease-out flex items-center justify-between gap-3 xl:gap-3.5 select-none"
                    >
                      {/* Opposite Side Action Indicator Arrow (inward) */}
                      <div className="w-6.5 h-6.5 xl:w-7 xl:h-7 rounded-full bg-blue-50/80 border border-blue-100 flex items-center justify-center text-[#168CFF] group-hover:bg-[#168CFF] group-hover:text-white group-hover:-translate-x-1 transition-all duration-300 shrink-0 shadow-2xs">
                        <ArrowLeft className="w-3 h-3 xl:w-3.5 xl:h-3.5" />
                      </div>

                      {/* Service Title & Description */}
                      <div className="flex-1 min-w-0 px-1 text-right">
                        <h3 className="text-[15px] xl:text-base font-bold text-[#0B2A5B] tracking-tight group-hover:text-[#078BE8] transition-colors duration-300 leading-snug">
                          {service.title}
                        </h3>
                        <p className="text-[11.5px] xl:text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* Right Circular Icon Container with Micro-Float */}
                      <motion.div
                        animate={{
                          y: [-1.5, 1.5, -1.5],
                          boxShadow: [
                            '0 0 10px rgba(7,139,232,0.12)',
                            '0 0 18px rgba(18,185,242,0.28)',
                            '0 0 10px rgba(7,139,232,0.12)',
                          ],
                        }}
                        transition={{
                          duration: service.iconDuration,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: service.iconDelay,
                        }}
                        className={`w-11 h-11 xl:w-13 xl:h-13 rounded-full ${service.iconBg} border flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:brightness-110 transition-all duration-300 shadow-2xs`}
                      >
                        <Icon className={`w-5 h-5 xl:w-5.5 xl:h-5.5 ${service.iconColor}`} />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

          </div>

          {/* 
            ----------------------------------------------------------------------
            MOBILE & TABLET RESPONSIVE LAYOUT (< lg screens)
            Central logo on top, followed by 6 floating cards stacked vertically
            ----------------------------------------------------------------------
          */}
          <div className="flex lg:hidden flex-col items-center gap-5 sm:gap-6 w-full max-w-xl mx-auto">
            
            {/* Centerpiece Logo with Progressive Reveal Animation */}
            <CentralLogoReveal isMobile={true} />

            {/* 6 Stacked Floating Cards */}
            <div className="flex flex-col gap-3 sm:gap-3.5 w-full">
              {[...LEFT_SERVICES, ...RIGHT_SERVICES].map((rawService, index) => {
                const service = getLocalizedService(rawService, t);
                const Icon = service.icon;
                return (
                  <motion.div
                    key={`mobile-${service.id}`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.08,
                      ease: 'easeOut',
                    }}
                    animate={{
                      y: [-service.floatAmp, service.floatAmp, -service.floatAmp],
                    }}
                    style={{
                      transition: `y ${service.floatDuration}s ease-in-out infinite`,
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCardClick(service.route)}
                    className="group cursor-pointer rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md p-3.5 sm:p-4 border border-blue-100 shadow-[0_4px_16px_rgba(11,42,91,0.05)] active:shadow-[0_8px_20px_rgba(7,139,232,0.15)] flex items-center justify-between gap-3"
                  >
                    <div className={`w-10 h-10 rounded-full ${service.iconBg} border flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4.5 h-4.5 ${service.iconColor}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-[15px] font-bold text-[#0B2A5B] leading-tight">
                        {service.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 leading-snug line-clamp-2">
                        {service.description}
                      </p>
                    </div>

                    <div className="w-6.5 h-6.5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#168CFF] shrink-0">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
// Final submission update
