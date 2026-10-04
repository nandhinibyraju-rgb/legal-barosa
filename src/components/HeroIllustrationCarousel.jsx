import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AnimatedIllustration from './AnimatedIllustration';
import TrustStrip from './TrustStrip';
import { defaultBadgeIcons } from './HeroIssueBadges';
import { secondStressSvg } from '../assets/illustrations/secondStressSvg';
import { secondBlamingSvg } from '../assets/illustrations/secondBlamingSvg';
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
    accentClass: 'text-[#93C5FD]',
    offsetClass: 'translate-y-4 sm:translate-y-5 md:translate-y-6',
    description: 'Shield your family with certified advocate-backed defense against unlawful lender tactics.',
    svgContent: secondStressSvg,
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
    accentClass: 'text-[#FBBF24]',
    offsetClass: 'translate-y-7 sm:translate-y-9 md:translate-y-11',
    description: 'Verified High Court advocates defend your land title, stay orders, and personal reputation.',
    svgContent: secondBlamingSvg,
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
    accentClass: 'text-[#93C5FD]',
    offsetClass: 'translate-y-6 sm:translate-y-8 md:translate-y-9',
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
    accentClass: 'text-[#93C5FD]',
    offsetClass: 'translate-y-5 sm:translate-y-7 md:translate-y-8',
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
        title: 'Verified Legal Counsel',
        subtitle: 'Qualified Advocate Support',
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
    accentClass: 'text-[#FBBF24]',
    offsetClass: 'translate-y-5 sm:translate-y-7 md:translate-y-8',
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
        title: 'Structured Guidance',
        subtitle: 'Ethical Dispute Advisory',
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
  const { t, i18n } = useTranslation();
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
  const slideKey = `slide${currentSlideIndex + 1}`;
  const localizedCategory = t(`hero.slides.${slideKey}.category`, currentSlide.category);
  const localizedHeadline = t(`hero.slides.${slideKey}.headline`, currentSlide.headline);

  const headlineWords = i18n.language === 'en'
    ? currentSlide.headlineTokens
    : localizedHeadline.split(' ').map((word) => ({ text: word, isAccent: false }));

  const getLocalizedBadge = (badge, idx) => {
    const num = idx + 1;
    return {
      ...badge,
      title: t(`hero.slides.${slideKey}.badge${num}Title`, badge.title),
      subtitle: t(`hero.slides.${slideKey}.badge${num}Sub`, badge.subtitle),
    };
  };

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
            <div className="w-full flex flex-col items-center justify-center mb-3 sm:mb-4 md:mb-5 z-20">
              {/* Category Pill */}
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.02 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E2656]/90 border border-[#38BDF8]/40 text-[#BAE6FD] text-[10px] sm:text-[10.5px] font-semibold tracking-wider uppercase mb-1.5 shadow-[0_2px_12px_rgba(14,38,86,0.6)]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8] animate-pulse" />
                <span>{localizedCategory}</span>
              </motion.div>

              {/* Main Headline with word-by-word stagger */}
              <motion.h1
                variants={headingContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{
                  fontSize: 'clamp(24px, 3.5vw, 38px)',
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                }}
                className="font-heading font-bold text-white tracking-tight text-center max-w-4xl px-2 sm:px-4 break-words"
              >
                {headlineWords.map((token, idx) => (
                  <motion.span
                    key={`token-${idx}-${token.text}`}
                    variants={wordVariants}
                    className={`inline-block mr-[0.22em] last:mr-0 ${
                      token.isAccent
                        ? `${currentSlide.accentClass || 'text-[#93C5FD]'} font-normal drop-shadow-[0_0_14px_rgba(147,197,253,0.5)]`
                        : 'text-white sm:text-[#F8FAFC] font-bold'
                    }`}
                    style={
                      token.isAccent
                        ? {
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontStyle: 'italic',
                            fontWeight: 600,
                            fontSize: '1.05em',
                          }
                        : undefined
                    }
                  >
                    {token.text}
                  </motion.span>
                ))}
              </motion.h1>
            </div>

            {/* 2. LARGE ANIMATED ILLUSTRATION + CONTAINED SOFT GLOW + FLOATING BADGES */}
            <div className="relative w-full h-[220px] xs:h-[240px] sm:h-[270px] md:h-[300px] lg:h-[330px] xl:h-[345px] flex items-center justify-center overflow-visible">

              {/* Illustration Wrapper with Parallax, Soft Drop-Shadow & Clear Breathing Room */}
              <motion.div 
                style={{
                  x: illustrationX,
                  y: illustrationY,
                  rotate: illustrationRotate,
                  filter: 'drop-shadow(0 20px 40px rgba(30, 58, 138, 0.15))',
                }}
                className={`relative z-10 w-full h-full flex items-center justify-center pointer-events-none transition-transform duration-300 ${currentSlide.offsetClass || ''}`}
              >
                <AnimatedIllustration
                  svgContent={currentSlide.svgContent}
                  alt={currentSlide.alt}
                  className="w-full h-full flex items-center justify-center transform scale-95 sm:scale-100 md:scale-105 lg:scale-108 origin-bottom transition-transform"
                />
              </motion.div>

              {/* DESKTOP/TABLET: ROUND ICON CIRCLES WITH CONTINUOUS BREATHING GLOW & HOVER TOOLTIPS */}
              {currentSlide.badges.map((rawBadge, idx) => {
                const badge = getLocalizedBadge(rawBadge, idx);
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
              {currentSlide.badges.map((rawBadge, idx) => {
                const badge = getLocalizedBadge(rawBadge, idx);
                return (
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
                );
              })}
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
                  className="w-7 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_10px_rgba(56,189,248,0.7),0_0_4px_rgba(255,255,255,0.6)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-500/50 group-hover:bg-[#38BDF8]/70 transition-colors duration-200" />
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
          className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#0A2660] hover:bg-[#0D3280] text-white text-[14px] font-semibold shadow-[0_4px_20px_rgba(6,45,120,0.5)] hover:shadow-[0_6px_24px_rgba(56,189,248,0.4)] border border-[#168CFF]/40 transition-all hover:scale-105 active:scale-95 cursor-pointer min-h-[42px]"
        >
          <span>{t('hero.ctaPrimary', 'Book a Free Consultation')}</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>

        {/* Subtle trust strip directly beneath Hero CTA */}
        <TrustStrip className="mt-1" variant="dark" />
      </div>
    </div>
  );
}
