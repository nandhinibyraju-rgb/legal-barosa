import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import AnimatedIllustration from './AnimatedIllustration';
import TrustStrip from './TrustStrip';
import { defaultBadgeIcons } from './HeroIssueBadges';
import { studentStressSvg } from '../assets/illustrations/studentStressSvg';
import { feelingLostSvg } from '../assets/illustrations/feelingLostSvg';
import { manipulationDebtSvg } from '../assets/illustrations/manipulationDebtSvg';
import { questionsSvg } from '../assets/illustrations/questionsSvg';
import { groupChatSvg } from '../assets/illustrations/groupChatSvg';

/**
 * 5 Hero Carousel Slides - Contextual Problem & Solution Storytelling:
 * Slide 1 (stressed character): 'Stressed about EMI, debt & harassment?'
 * Slide 2 (Feeling Lost / pointing hands): 'Feeling lost and blamed unfairly?'
 * Slide 3 (puppet in hands of debt): 'Feeling like a puppet in the hands of debt?'
 * Slide 4 (question mark / confused character): 'Confused about the actual solution?'
 * Slide 5 (phone / LegalBharosa illustration): 'LegalBharosa — your one and only solution'
 */
export const HERO_SLIDES = [
  {
    id: 'student-stress',
    category: 'Recovery Agent Harassment',
    headline: 'Stressed about EMI, debt & harassment?',
    headlineTokens: [
      { text: 'Stressed', isAccent: false },
      { text: 'about', isAccent: false },
      { text: 'EMI,', isAccent: true },
      { text: 'debt', isAccent: true },
      { text: '&', isAccent: true },
      { text: 'harassment?', isAccent: true },
    ],
    accentClass: 'text-[#0646A8]',
    description: 'Shield your family with certified advocate-backed defense against unlawful lender tactics.',
    svgContent: studentStressSvg,
    alt: 'Stressed person overwhelmed by debt paperwork and recovery harassment',
    badges: [
      {
        id: 'agent-shield',
        title: 'Anti-Harassment Shield',
        subtitle: 'Zero Unlawful Visits',
        icon: defaultBadgeIcons.harassment,
        posDesktop: 'top-[18%] left-1 sm:left-4 lg:left-6 xl:left-8',
      },
      {
        id: 'notice-reply',
        title: 'Legal Notice Reply',
        subtitle: 'Advocate-Drafted',
        icon: defaultBadgeIcons.help,
        posDesktop: 'top-[22%] right-1 sm:right-4 lg:right-6 xl:right-8',
      },
      {
        id: 'rbi-protection',
        title: 'RBI Guidelines Protection',
        subtitle: '100% Certified Legal Shield',
        icon: defaultBadgeIcons.shield,
        posDesktop: 'bottom-[12%] right-2 sm:right-6 lg:right-8 xl:right-10',
      },
    ],
  },
  {
    id: 'feeling-lost',
    category: 'Property & Civil Disputes',
    headline: 'Feeling lost and blamed unfairly?',
    headlineTokens: [
      { text: 'Feeling', isAccent: false },
      { text: 'lost', isAccent: false },
      { text: 'and', isAccent: false },
      { text: 'blamed', isAccent: true },
      { text: 'unfairly?', isAccent: true },
    ],
    accentClass: 'text-[#0646A8]',
    description: 'Verified High Court advocates defend your land title, stay orders, and personal reputation.',
    svgContent: feelingLostSvg,
    alt: 'Person feeling lost and unfairly blamed during property and civil legal disputes',
    badges: [
      {
        id: 'property-defense',
        title: 'Property Dispute Support',
        subtitle: 'Title & Stay Defense',
        icon: defaultBadgeIcons.property,
        posDesktop: 'top-[18%] left-1 sm:left-4 lg:left-6 xl:left-8',
      },
      {
        id: 'allegation-relief',
        title: 'False Allegation Relief',
        subtitle: 'Protection from Blame',
        icon: defaultBadgeIcons.shield,
        posDesktop: 'top-[22%] right-1 sm:right-4 lg:right-6 xl:right-8',
      },
      {
        id: 'senior-advocate',
        title: 'Civil & Land Counsel',
        subtitle: 'High Court Senior Counsel',
        icon: defaultBadgeIcons.emi,
        posDesktop: 'bottom-[12%] left-2 sm:left-6 lg:left-8 xl:left-10',
      },
    ],
  },
  {
    id: 'manipulation-debt',
    category: 'Debt & EMI Pressure',
    headline: 'Feeling like a puppet in the hands of debt?',
    headlineTokens: [
      { text: 'Feeling', isAccent: false },
      { text: 'like', isAccent: false },
      { text: 'a', isAccent: false },
      { text: 'puppet', isAccent: false },
      { text: 'in', isAccent: false },
      { text: 'the', isAccent: false },
      { text: 'hands', isAccent: true },
      { text: 'of', isAccent: true },
      { text: 'debt?', isAccent: true },
    ],
    accentClass: 'text-[#0646A8]',
    description: 'Break free from compounding interest, multiple loans, and aggressive recovery pressure.',
    svgContent: manipulationDebtSvg,
    alt: 'Person feeling trapped like a puppet in compounding debt and EMI pressure',
    badges: [
      {
        id: 'emi-relief',
        title: 'EMI Relief',
        subtitle: 'Up to 50% Reduction',
        icon: defaultBadgeIcons.emi,
        posDesktop: 'top-[18%] left-1 sm:left-4 lg:left-6 xl:left-8',
      },
      {
        id: 'stop-harassment',
        title: 'Harassment Relief',
        subtitle: 'Stop Recovery Calls',
        icon: defaultBadgeIcons.harassment,
        posDesktop: 'top-[22%] right-1 sm:right-4 lg:right-6 xl:right-8',
      },
      {
        id: 'debt-restructuring',
        title: 'Debt Restructuring',
        subtitle: 'RBI Fair Practice Defense',
        icon: defaultBadgeIcons.shield,
        posDesktop: 'bottom-[12%] left-2 sm:left-6 lg:left-8 xl:left-10',
      },
    ],
  },
  {
    id: 'questions-help',
    category: 'Legal Advisory',
    headline: 'Confused about the actual solution?',
    headlineTokens: [
      { text: 'Confused', isAccent: false },
      { text: 'about', isAccent: false },
      { text: 'the', isAccent: false },
      { text: 'actual', isAccent: true },
      { text: 'solution?', isAccent: true },
    ],
    accentClass: 'text-[#0646A8]',
    description: 'Connect directly with verified advocates for transparent, confidential legal roadmaps.',
    svgContent: questionsSvg,
    alt: 'Person surrounded by questions seeking verified legal advocate advice',
    badges: [
      {
        id: 'free-advisory',
        title: 'Legal Advisory',
        subtitle: 'Free Case Evaluation',
        icon: defaultBadgeIcons.help,
        posDesktop: 'top-[18%] left-1 sm:left-4 lg:left-6 xl:left-8',
      },
      {
        id: 'verified-counsel',
        title: '500+ Verified Advocates',
        subtitle: 'Pan-India HC Network',
        icon: defaultBadgeIcons.shield,
        posDesktop: 'top-[22%] right-1 sm:right-4 lg:right-6 xl:right-8',
      },
      {
        id: 'confidential-strategy',
        title: 'Confidential Consultation',
        subtitle: '100% Protected Advisory',
        icon: defaultBadgeIcons.harassment,
        posDesktop: 'bottom-[12%] right-2 sm:right-6 lg:right-8 xl:right-10',
      },
    ],
  },
  {
    id: 'solution-safety',
    category: 'LegalBharosa Solution',
    headline: 'LegalBharosa — your one and only solution',
    headlineTokens: [
      { text: 'LegalBharosa', isAccent: false },
      { text: '—', isAccent: false },
      { text: 'your', isAccent: false },
      { text: 'one', isAccent: true },
      { text: 'and', isAccent: true },
      { text: 'only', isAccent: true },
      { text: 'solution', isAccent: true },
    ],
    accentClass: 'text-[#0646A8]',
    description: 'Certified legal resolution backed by dedicated advocates handling your case end-to-end.',
    svgContent: groupChatSvg,
    alt: 'LegalBharosa verified advocate team providing safe and confidential legal resolution via smartphone',
    badges: [
      {
        id: 'total-safety',
        title: 'LegalBharosa Solution',
        subtitle: '100% Legal Safety & Peace',
        icon: defaultBadgeIcons.shield,
        posDesktop: 'top-[18%] left-1 sm:left-4 lg:left-6 xl:left-8',
      },
      {
        id: 'pan-india-track',
        title: 'Pan-India Coverage',
        subtitle: '15,000+ Cases Resolved',
        icon: defaultBadgeIcons.harassment,
        posDesktop: 'top-[22%] right-1 sm:right-4 lg:right-6 xl:right-8',
      },
      {
        id: 'direct-resolution',
        title: 'End-to-End Support',
        subtitle: 'Verified Advocate Backing',
        icon: defaultBadgeIcons.help,
        posDesktop: 'bottom-[12%] left-2 sm:left-6 lg:left-8 xl:left-10',
      },
    ],
  },
];

// Minimalist 4-point Sparkle SVG
function SparkleStar({ className = '', style = {} }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className} 
      style={style}
      aria-hidden="true"
    >
      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
    </svg>
  );
}

// 6 Tasteful, subtle drifting sparkles/motes around the illustration
const FLOATING_PARTICLES = [
  { id: 'p1', top: '15%', left: '22%', size: 12, color: 'text-[#12B9F2]', isStar: true, duration: 4.8, delay: 0 },
  { id: 'p2', top: '22%', right: '20%', size: 10, color: 'text-[#F4B400]', isStar: true, duration: 5.4, delay: 0.7 },
  { id: 'p3', top: '46%', left: '17%', size: 5, color: 'bg-[#12B9F2]', isStar: false, duration: 4.2, delay: 1.3 },
  { id: 'p4', bottom: '24%', right: '21%', size: 11, color: 'text-[#F4B400]', isStar: true, duration: 5.6, delay: 0.9 },
  { id: 'p5', bottom: '18%', left: '24%', size: 5, color: 'bg-[#168CFF]', isStar: false, duration: 4.6, delay: 1.6 },
  { id: 'p6', top: '35%', right: '16%', size: 6, color: 'bg-[#12B9F2]', isStar: false, duration: 5.0, delay: 0.4 },
];

// Framer Motion variants for word-by-word staggered entrance
const headingContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.03,
    },
  },
  exit: {
    opacity: 0,
    y: -5,
    transition: { duration: 0.18, ease: 'easeIn' },
  },
};

const wordVariants = {
  hidden: {
    opacity: 0,
    y: 12,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.38,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function HeroIllustrationCarousel({ className = '', onOpenConsult }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Automatically advance every 3.5 seconds (loops continuously)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [currentSlideIndex]);

  // Mouse parallax motion values (normalized from -1 to 1)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Organic physics springs for natural response
  const springX = useSpring(mouseX, { stiffness: 90, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 90, damping: 20 });

  // 3D parallax offsets for different layers
  const illustrationX = useTransform(springX, [-1, 1], [-8, 8]);
  const illustrationY = useTransform(springY, [-1, 1], [-6, 6]);
  const illustrationRotate = useTransform(springX, [-1, 1], [-1, 1]);

  // Glow counter-shift (receding depth layer)
  const glowX = useTransform(springX, [-1, 1], [8, -8]);
  const glowY = useTransform(springY, [-1, 1], [6, -6]);

  // Badge parallax transforms (floating at independent depth planes)
  const badge0X = useTransform(springX, [-1, 1], [-10, 10]);
  const badge0Y = useTransform(springY, [-1, 1], [-8, 8]);

  const badge1X = useTransform(springX, [-1, 1], [12, -12]);
  const badge1Y = useTransform(springY, [-1, 1], [-6, 6]);

  const badge2X = useTransform(springX, [-1, 1], [-8, 8]);
  const badge2Y = useTransform(springY, [-1, 1], [10, -10]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x * 2); // -1 to 1
    mouseY.set(y * 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full flex flex-col items-center justify-center select-none overflow-visible ${className}`}
    >
      {/* 
        ========================================================================
        HERO CONTENT VIEWPORT:
        - Headline with clear breathing space (NO overlap with illustration)
        - Illustration with thick, strong deep-blue atmospheric glow EXACTLY behind it
        - Floating badges repositioned cleanly with zero overlap
        ========================================================================
      */}
      <div className="relative w-full max-w-5xl xl:max-w-6xl mx-auto flex flex-col items-center justify-center overflow-visible px-2 sm:px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="relative w-full flex flex-col items-center justify-center overflow-visible"
          >
            {/* 1. PRIMARY HERO HEADLINE (CLEAR BREATHING SPACE TO AVOID ANY OVERLAP) */}
            <div className="w-full flex flex-col items-center justify-center mb-5 sm:mb-7 z-20">
              {/* Category Pill */}
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.02 }}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50/90 border border-[#078BE8]/25 text-[#0646A8] text-[10px] sm:text-[10.5px] font-semibold tracking-wider uppercase mb-1 shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#078BE8] shadow-[0_0_6px_#078BE8] animate-pulse" />
                <span>{currentSlide.category}</span>
              </motion.div>

              {/* Main Headline with word-by-word stagger */}
              <motion.h1
                variants={headingContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{
                  fontSize: 'clamp(22px, 3.4vw, 36px)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.025em',
                }}
                className="font-inter font-bold text-[#0B2A5B] tracking-tight text-center max-w-4xl px-2 sm:px-4 break-words"
              >
                {currentSlide.headlineTokens.map((token, idx) => (
                  <motion.span
                    key={`token-${idx}-${token.text}`}
                    variants={wordVariants}
                    className={`inline-block mr-[0.22em] last:mr-0 ${
                      token.isAccent
                        ? `${currentSlide.accentClass || 'text-[#0646A8]'} font-normal`
                        : 'text-[#0B2A5B] font-bold'
                    }`}
                    style={
                      token.isAccent
                        ? {
                            fontFamily: "'Instrument Serif', Georgia, serif",
                            fontStyle: 'italic',
                            fontWeight: 400,
                            fontSize: '1.08em',
                          }
                        : undefined
                    }
                  >
                    {token.text}
                  </motion.span>
                ))}
              </motion.h1>
            </div>

            {/* 2. LARGE ANIMATED ILLUSTRATION + CENTRED DEEP-BLUE GLOW + FLOATING BADGES */}
            <div className="relative w-full h-[230px] xs:h-[250px] sm:h-[290px] md:h-[330px] lg:h-[360px] xl:h-[380px] flex items-center justify-center overflow-visible">
              
              {/* Soft radial glow container positioned behind hero illustration (at least 150% of illustration width and height) */}
              <motion.div 
                aria-hidden="true" 
                style={{
                  x: glowX,
                  y: glowY,
                }}
                className="absolute inset-0 m-auto w-[550px] xs:w-[650px] sm:w-[750px] md:w-[850px] lg:w-[950px] xl:w-[1050px] h-[380px] xs:h-[420px] sm:h-[480px] md:h-[540px] lg:h-[580px] xl:h-[620px] pointer-events-none z-0 select-none overflow-visible flex items-center justify-center"
              >
                <div 
                  style={{
                    background: `radial-gradient(
  ellipse 60% 55% at center,
  rgba(30, 58, 138, 0.55) 0%,
  rgba(30, 58, 138, 0.35) 25%,
  rgba(30, 58, 138, 0.15) 50%,
  rgba(30, 58, 138, 0.05) 70%,
  transparent 85%
)`,
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0,
                    pointerEvents: 'none',
                  }}
                />
              </motion.div>

              {/* Illustration Wrapper with Parallax & Exact Current Scale */}
              <motion.div 
                style={{
                  x: illustrationX,
                  y: illustrationY,
                  rotate: illustrationRotate,
                }}
                className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none"
              >
                <AnimatedIllustration
                  svgContent={currentSlide.svgContent}
                  alt={currentSlide.alt}
                  className="w-full h-full flex items-center justify-center transform scale-105 sm:scale-115 md:scale-120 lg:scale-125 origin-center transition-transform"
                />
              </motion.div>

              {/* DESKTOP/TABLET: ROUND ICON CIRCLES WITH CONTINUOUS BREATHING GLOW & HOVER TOOLTIPS */}
              {currentSlide.badges.map((badge, idx) => {
                const badgeX = idx === 0 ? badge0X : idx === 1 ? badge1X : badge2X;
                const badgeY = idx === 0 ? badge0Y : idx === 1 ? badge1Y : badge2Y;

                return (
                  <motion.div
                    key={`${currentSlide.id}-${badge.id}`}
                    initial={{ opacity: 0, scale: 0.9, y: idx % 2 === 0 ? -10 : 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.08 * idx,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      x: badgeX,
                      y: badgeY,
                    }}
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.94 }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onOpenConsult?.(badge.title);
                      }
                    }}
                    aria-label={`Inquire about ${badge.title}: ${badge.subtitle}`}
                    onClick={() => onOpenConsult?.(badge.title)}
                    className={`hidden md:flex flex-col items-center gap-1 z-20 absolute ${badge.posDesktop} cursor-pointer group select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168CFF] rounded-2xl p-1`}
                  >
                    {/* Clean circular bubble with Continuous Breathing Highlight Ring */}
                    <div className="relative">
                      {/* Soft Breathing Highlight Ring (Continuous glow pulse) */}
                      <motion.span
                        aria-hidden="true"
                        className="absolute -inset-1 rounded-full pointer-events-none"
                        animate={{
                          boxShadow: [
                            '0 0 0 1px rgba(18, 185, 242, 0.25), 0 0 8px rgba(18, 185, 242, 0.2)',
                            '0 0 0 2.5px rgba(18, 185, 242, 0.65), 0 0 16px rgba(18, 185, 242, 0.45)',
                            '0 0 0 1px rgba(18, 185, 242, 0.25), 0 0 8px rgba(18, 185, 242, 0.2)',
                          ],
                          scale: [1, 1.06, 1],
                        }}
                        transition={{
                          duration: 3.0 + idx * 0.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />

                      <div className="w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur-md border border-[#12B9F2]/50 shadow-[0_4px_16px_rgba(6,45,120,0.12),0_0_12px_rgba(18,185,242,0.25)] flex items-center justify-center shrink-0 text-[#078BE8] [&>svg]:w-4.5 [&>svg]:h-4.5 transition-all duration-300 group-hover:border-[#078BE8] group-hover:shadow-[0_0_24px_rgba(7,139,232,0.65),0_8px_24px_rgba(6,45,120,0.25)]">
                        {badge.icon}
                      </div>
                    </div>

                    {/* Separate small pill / tooltip label positioned just below the circle */}
                    <div className="px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_2px_10px_rgba(6,45,120,0.08)] flex flex-col items-center text-center transition-all duration-300 group-hover:border-[#12B9F2]/70 group-hover:shadow-[0_4px_16px_rgba(18,185,242,0.22)] max-w-[150px]">
                      <span className="text-[11px] font-bold text-[#0B2A5B] tracking-tight leading-tight whitespace-nowrap">
                        {badge.title}
                      </span>
                      {badge.subtitle && (
                        <span className="text-[9.5px] text-[#0646A8] font-medium leading-tight whitespace-nowrap">
                          {badge.subtitle}
                        </span>
                      )}
                      {/* Micro-interaction prompt revealed on hover */}
                      <span className="text-[8.5px] font-bold text-[#078BE8] max-h-0 opacity-0 group-hover:max-h-4 group-hover:opacity-100 overflow-hidden transition-all duration-200 leading-tight">
                        Tap for advice →
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* MOBILE: Contextual Badges neatly positioned below the character (>= 44px tap targets) */}
            <div className="flex md:hidden flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 px-2 z-20">
              {currentSlide.badges.map((badge) => (
                <motion.button
                  key={`mob-${currentSlide.id}-${badge.id}`}
                  type="button"
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => onOpenConsult?.(badge.title)}
                  className="flex flex-col items-center gap-1 cursor-pointer group min-h-[44px] justify-center p-1 bg-transparent border-0 focus:outline-none"
                  aria-label={`Inquire about ${badge.title}`}
                >
                  <div className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md border border-[#12B9F2]/40 shadow-[0_3px_10px_rgba(6,45,120,0.12)] flex items-center justify-center text-[#078BE8] [&>svg]:w-4 [&>svg]:h-4 group-hover:scale-105 transition-transform">
                    {badge.icon}
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-white/95 border border-slate-200/90 shadow-2xs text-center max-w-[125px]">
                    <span className="text-[9.5px] font-semibold text-[#0B2A5B] whitespace-nowrap block leading-tight truncate">
                      {badge.title}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. MINIMALIST 5-STEP STORY INDICATOR DOTS WITH SMOOTH ACTIVE EXPANDING PILL */}
      <div className="flex items-center justify-center gap-2 mt-1 sm:mt-1.5 z-20">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentSlideIndex(idx)}
              aria-label={`Switch to slide ${idx + 1}: ${slide.category}`}
              className="py-1 px-1 min-h-[22px] min-w-[22px] flex items-center justify-center cursor-pointer focus:outline-none relative group"
            >
              {isActive ? (
                <motion.span
                  layoutId="heroCarouselActiveDot"
                  className="w-7 h-2 rounded-full bg-[#062D78] shadow-[0_0_10px_rgba(6,45,120,0.5),0_0_4px_rgba(22,140,255,0.4)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-[#078BE8]/60 transition-colors duration-200" />
              )}
            </button>
          );
        })}
      </div>

      {/* 4. PRIMARY HERO CALL-TO-ACTION (Book a Free Consultation) */}
      <div className="mt-1.5 sm:mt-2 z-20 px-4 flex flex-col items-center">
        <button
          type="button"
          onClick={() => onOpenConsult?.('Hero Consultation')}
          className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#062D78] hover:bg-[#0646A8] text-white text-[13.5px] font-semibold shadow-[0_4px_16px_rgba(6,45,120,0.18)] hover:shadow-[0_6px_22px_rgba(6,45,120,0.28)] transition-all hover:scale-105 active:scale-95 cursor-pointer min-h-[40px]"
        >
          <span>Book a Free Consultation</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>

        {/* Subtle trust strip directly beneath Hero CTA */}
        <TrustStrip className="mt-0.5" />
      </div>
    </div>
  );
}
