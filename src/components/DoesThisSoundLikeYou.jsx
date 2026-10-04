import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  PhoneCall, 
  FileText, 
  Home, 
  Users, 
  TrendingDown, 
  ArrowRight, 
  X,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import TrustStrip from './TrustStrip';

const PROBLEMS = [
  {
    id: 'recovery-calls',
    problem: 'Getting harassing recovery calls?',
    tag: 'Harassment Defense',
    icon: PhoneCall,
    iconColor: 'text-[#078BE8]',
    iconBg: 'bg-blue-50 border-[#078BE8]/25',
    glowColor: 'rgba(7, 139, 232, 0.24)',
    borderGlow: 'rgba(7, 139, 232, 0.45)',
    reassurance: 'Practical Guidance',
    explanation: 'Understand your rights under the RBI Fair Practices Code. Document recovery communications, verify agent authorization, and learn lawful steps to address persistent harassment.',
    nextSteps: {
      gather: 'Dates, times, caller phone numbers, call recordings, and recovery agency names.',
      review: 'Permitted calling hours (8 AM - 7 PM) and RBI guidelines prohibiting intimidation or third-party disclosure.',
      advice: 'If recovery agents make abusive threats, visit unannounced, or contact employers and relatives.',
    },
    serviceName: 'Harassment Protection',
    serviceLink: '/services/harassment-protection',
  },
  {
    id: 'legal-notice',
    problem: 'Confused about a legal notice?',
    tag: 'Notice Evaluation',
    icon: FileText,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50 border-amber-400/30',
    glowColor: 'rgba(245, 158, 11, 0.24)',
    borderGlow: 'rgba(245, 158, 11, 0.45)',
    reassurance: 'Careful Notice Assessment',
    explanation: 'Receiving a legal notice requires timely attention. Review the statutory response deadline, verify the loan details cited, and prepare appropriate documentation before drafting a formal legal reply.',
    nextSteps: {
      gather: 'Complete notice copy, postal envelope with date stamp, and all loan account statements.',
      review: 'Demand amounts, calculation of interest/penalties, and the specific laws cited (e.g., Section 138, SARFAESI).',
      advice: 'Before the stipulated deadline expires, engage a qualified advocate to review procedural validity and draft a formal reply.',
    },
    serviceName: 'Legal Notice Review',
    serviceLink: '/services/legal-notice-review',
  },
  {
    id: 'emi-payments',
    problem: 'Struggling with EMI payments?',
    tag: 'Loan Settlement',
    isRupee: true,
    iconColor: 'text-[#0B2A5B]',
    iconBg: 'bg-blue-50/80 border-[#0B2A5B]/20',
    glowColor: 'rgba(11, 42, 91, 0.22)',
    borderGlow: 'rgba(11, 42, 91, 0.45)',
    reassurance: 'Explore Repayment Options',
    explanation: 'If facing difficulty with loan EMIs, understand possible relief options such as restructuring, tenure extension, or formal One-Time Settlement (OTS) discussions where eligible.',
    nextSteps: {
      gather: 'Current repayment breakdown, income statements, and medical or financial hardship documentation.',
      review: 'Loan agreement terms, interest calculations, and the lender’s distressed asset policies.',
      advice: 'When loans reach NPA status or lenders initiate recovery proceedings without entertaining informal discussions.',
    },
    serviceName: 'Loan Settlement',
    serviceLink: '/services/loan-settlement',
  },
  {
    id: 'property-disputes',
    problem: 'Facing property disputes?',
    tag: 'Property Defense',
    icon: Home,
    iconColor: 'text-[#0646A8]',
    iconBg: 'bg-blue-50 border-[#0646A8]/25',
    glowColor: 'rgba(6, 70, 168, 0.24)',
    borderGlow: 'rgba(6, 70, 168, 0.45)',
    reassurance: 'Property & Asset Guidance',
    explanation: 'For secured loan defaults or property disputes, understand the formal legal process under SARFAESI and civil law to protect your rights and explore resolution avenues.',
    nextSteps: {
      gather: 'Title deeds, loan sanction letters, mortgage documents, and any Section 13(2) or 13(4) notices.',
      review: 'Statutory 60-day response windows, procedural compliance by the bank, and valuation accuracy.',
      advice: 'Immediately upon receiving possession or auction notices to evaluate DRT representation and stay options.',
    },
    serviceName: 'Secured Loan & Property',
    serviceLink: '/services/npa-secured-loans',
  },
  {
    id: 'workplace-issues',
    problem: 'Workplace harassment issues?',
    tag: 'Employment & POSH',
    icon: Users,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50 border-amber-500/30',
    glowColor: 'rgba(217, 119, 6, 0.24)',
    borderGlow: 'rgba(217, 119, 6, 0.45)',
    reassurance: 'Confidential Guidance',
    explanation: 'When debt collection reaches your workplace or you face employment disputes, understand employee protections and appropriate escalation steps.',
    nextSteps: {
      gather: 'Records of any calls to HR or colleagues, email trails, and relevant company policies.',
      review: 'RBI rules strictly barring lenders from contacting employers or colleagues regarding private debts.',
      advice: 'If workplace harassment threatens your employment standing or violates statutory protections.',
    },
    serviceName: 'Advocate Legal Advisory',
    serviceLink: '/services/harassment-protection',
  },
  {
    id: 'credit-score',
    problem: 'Credit score damaged?',
    tag: 'CIBIL Rebuilding',
    icon: TrendingDown,
    iconColor: 'text-[#078BE8]',
    iconBg: 'bg-cyan-50 border-cyan-400/30',
    glowColor: 'rgba(6, 182, 212, 0.24)',
    borderGlow: 'rgba(6, 182, 212, 0.45)',
    reassurance: 'Credit Profile Guidance',
    explanation: 'Rebuilding damaged credit requires identifying reporting discrepancies and obtaining official closure documents from lenders before approaching credit bureaus.',
    nextSteps: {
      gather: 'Recent CIR reports from CIBIL, Experian, or CRIF, and loan closure or settlement payment receipts.',
      review: 'Reporting status tags such as "Written Off" or "Settled", outstanding amounts, and date discrepancies.',
      advice: 'When lenders fail to report closed loans to credit bureaus or persist in showing false delinquent records.',
    },
    serviceName: 'Credit Score Recovery',
    serviceLink: '/services/credit-recovery',
  },
];

/**
 * DiagnosticCard: Individual Problem Card with smooth cursor-following 3D tilt,
 * matching icon color ambient glow, and dynamic sheen reflection.
 */
function DiagnosticCard({
  item,
  index,
  isExplored,
  isCurrentlyAnimating,
  onClick,
  cardRef,
}) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, x: 50, y: 50, isHovered: false });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const percentX = (x / rect.width) * 2 - 1; // -1 to 1
    const percentY = (y / rect.height) * 2 - 1; // -1 to 1
    const maxTilt = 7.5;
    setTilt({
      rx: -percentY * maxTilt,
      ry: percentX * maxTilt,
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, x: 50, y: 50, isHovered: false });
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      data-no-tilt="true"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.65,
        delay: (index % 3) * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Problem: ${item.problem}. Tap to reveal solution.`}
      style={{
        transform: tilt.isHovered
          ? `perspective(800px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) translateY(-6px)`
          : 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        boxShadow: tilt.isHovered
          ? `0 18px 40px -8px ${item.glowColor}, 0 4px 16px -2px rgba(6,45,120,0.06), 0 0 0 1.5px ${item.borderGlow}`
          : '0 4px 20px rgba(6,45,120,0.05), 0 1px 2px rgba(0,0,0,0.04)',
        transition: tilt.isHovered
          ? 'transform 0.12s ease-out, box-shadow 0.25s ease-out'
          : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`group relative p-4 sm:p-4.5 rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-200/85 cursor-pointer select-none flex flex-col justify-between min-h-[132px] sm:min-h-[142px] overflow-hidden ${
        isCurrentlyAnimating ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Dynamic Cursor-following colored radial sheen */}
      {tilt.isHovered && (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 220px at ${tilt.x}% ${tilt.y}%, ${item.glowColor}, transparent 70%)`,
            opacity: 0.75,
          }}
        />
      )}

      {/* Card Top: Icon & Tag / Explored Status */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div
          role="img"
          aria-label={`Visual icon for ${item.problem}`}
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border ${item.iconBg} ${item.iconColor} shadow-2xs group-hover:scale-105 transition-transform duration-300`}
        >
          {item.isRupee ? (
            <svg
              className="w-5 h-5 text-[#0B2A5B]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a4.5 4.5 0 0 0 0-9" />
            </svg>
          ) : (
            <item.icon className="w-5 h-5" aria-hidden="true" />
          )}
        </div>

        {isExplored ? (
          <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50/95 border border-emerald-300/70 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Explored ✓</span>
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-100/80 px-2.5 py-0.5 rounded-full border border-slate-200/60">
            {item.tag}
          </span>
        )}
      </div>

      {/* Card Middle: Problem Statement */}
      <div className="relative z-10 mt-3.5">
        <h3 className="text-[15.5px] sm:text-[16.5px] font-bold text-[#0B2A5B] tracking-tight leading-snug group-hover:text-[#0646A8] transition-colors">
          {item.problem}
        </h3>
      </div>

      {/* Card Bottom: Subtle Hint */}
      <div className="relative z-10 mt-3 flex items-center justify-end">
        <span className="text-[12px] font-semibold text-[#078BE8] inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          <span>{isExplored ? 'Review solution' : 'See resolution'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </motion.div>
  );
}

/**
 * ConfettiBurst: Subtle celebratory micro-confetti particles that burst outward
 * when all 6 diagnostic solutions are unlocked.
 */
function ConfettiBurst() {
  const particles = Array.from({ length: 28 }).map((_, i) => {
    const angle = (i / 28) * 360;
    const distance = 90 + Math.random() * 140;
    const rad = (angle * Math.PI) / 180;
    const targetX = Math.cos(rad) * distance;
    const targetY = Math.sin(rad) * distance;
    const colors = ['#078BE8', '#F59E0B', '#10B981', '#062D78', '#12B9F2', '#8B5CF6'];
    const color = colors[i % colors.length];
    const size = 5 + (i % 4) * 2.2;
    const shape = i % 2 === 0 ? 'circle' : 'rect';

    return { id: i, targetX, targetY, color, size, shape, rotate: Math.random() * 360 };
  });

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-30" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0.4, rotate: 0 }}
          animate={{
            opacity: [1, 1, 0],
            x: p.targetX,
            y: p.targetY,
            scale: [0.4, 1.25, 0.7],
            rotate: p.rotate + 360,
          }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute"
          style={{
            width: p.size,
            height: p.shape === 'rect' ? p.size * 1.6 : p.size,
            borderRadius: p.shape === 'circle' ? '9999px' : '2px',
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}

export default function DoesThisSoundLikeYou({ onOpenConsult }) {
  const navigate = useNavigate();
  const cardRefs = useRef([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [animatingIndex, setAnimatingIndex] = useState(null);

  // Session-persisted gamified exploration tracking
  const [exploredCards, setExploredCards] = useState(() => {
    try {
      const saved = sessionStorage.getItem('lb_explored_cards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Track celebratory animation state
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Lock scroll while focused card is active in center & handle Escape key
  useEffect(() => {
    if (selectedCard) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedCard]);

  const handleCardClick = (index) => {
    const el = cardRefs.current[index];
    if (!el) return;

    const problem = PROBLEMS[index];
    const problemId = problem.id;

    // Increment gamified solution progress
    setExploredCards((prev) => {
      if (prev.includes(problemId)) return prev;
      const updated = [...prev, problemId];
      try {
        sessionStorage.setItem('lb_explored_cards', JSON.stringify(updated));
      } catch (err) {
        console.warn('Session storage error:', err);
      }

      // Check if all 6 solutions are explored for celebratory burst
      if (updated.length === 6 && !hasCelebrated) {
        setHasCelebrated(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2400);
      }

      return updated;
    });

    const rect = el.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;
    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;

    const startX = cardCenterX - screenCenterX;
    const startY = cardCenterY - screenCenterY;

    setAnimatingIndex(index);
    setSelectedCard({
      index,
      data: problem,
      initialRect: {
        width: rect.width,
        height: rect.height,
      },
      startX,
      startY,
    });
  };

  // Explicit close handlers ONLY: (X) button, backdrop click, or Escape key
  const handleClose = () => {
    setSelectedCard(null);
  };

  const handleNavigateToService = (link) => {
    handleClose();
    setTimeout(() => {
      navigate(link);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 250);
  };

  const handleConsultClick = (topic) => {
    handleClose();
    onOpenConsult?.(topic);
  };

  const isAllExplored = exploredCards.length === 6;

  return (
    <section 
      id="sound-like-you"
      aria-label="Does This Sound Like You Section"
      className="relative w-full py-8 sm:py-10 px-4 sm:px-6 lg:px-8 overflow-visible z-10"
    >
      {/* 
        ========================================================================
        SUBTLE ANIMATED BACKGROUND PATTERN & GRADIENT MESH
        - Smooth floating ambient gradient orbs with soft blur
        - Subtle SVG dot grid matrix pattern masked at edges
        - Very subtle and completely non-distracting from cards
        ========================================================================
      */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden select-none" aria-hidden="true">
        {/* Soft Ambient Radial Mesh Blobs */}
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[12%] left-[4%] w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(7,139,232,0.06)_0%,rgba(6,70,168,0.02)_50%,transparent_70%)] blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -35, 25, 0],
            y: [0, 30, -20, 0],
            scale: [1, 0.95, 1.08, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-[16%] right-[6%] w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.05)_0%,rgba(7,139,232,0.025)_50%,transparent_70%)] blur-3xl"
        />

        {/* Subtle SVG Dot Matrix Pattern */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-[0.38] [mask-image:radial-gradient(ellipse_at_center,white_35%,transparent_75%)]" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="sound-like-you-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.1" fill="#078BE8" fillOpacity="0.32" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sound-like-you-grid)" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Confetti Particle Burst Triggered when all 6 explored */}
        {showConfetti && <ConfettiBurst />}

        {/* ======================================================== */}
        {/* 1. SECTION HEADING WITH GAMIFIED EXPLORATION COUNTER */}
        {/* ======================================================== */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="text-center max-w-3xl mx-auto mb-5 sm:mb-6 px-2"
        >
          {/* Top Pill Diagnostic Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50/90 border border-[#078BE8]/25 text-xs font-semibold uppercase tracking-wider text-[#0646A8] mb-3 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#078BE8] animate-pulse" />
            Quick Issue Diagnostic
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] leading-[1.2] font-bold text-[#0B2A5B] tracking-tight">
            Does This Sound Like{' '}
            <span 
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontWeight: 600 }} 
              className="text-[#0646A8]"
            >
              You?
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed mt-2 max-w-xl mx-auto">
            Tap on any situation below to see immediate legal defense and relief options.
          </p>

          {/* Gamified Progress / Counter Element: 'X out of 6 solutions explored' */}
          <div className="flex items-center justify-center gap-2 mt-3.5">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-200/90 shadow-[0_2px_10px_rgba(6,45,120,0.06)] backdrop-blur-md">
              {/* 6 mini solution dots */}
              <div className="flex items-center gap-1.5" aria-hidden="true">
                {PROBLEMS.map((p) => {
                  const done = exploredCards.includes(p.id);
                  return (
                    <motion.span
                      key={p.id}
                      initial={false}
                      animate={{
                        scale: done ? [1, 1.35, 1] : 1,
                        backgroundColor: done ? '#078BE8' : '#CBD5E1',
                      }}
                      transition={{ duration: 0.35 }}
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        done ? 'bg-[#078BE8] shadow-[0_0_6px_rgba(7,139,232,0.6)]' : 'bg-slate-300'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Counter Label */}
              <span className="text-xs font-semibold text-[#0B2A5B] tracking-tight">
                <strong className="text-[#078BE8] font-bold">{exploredCards.length}</strong> of 6 solutions explored
              </span>

              {isAllExplored && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300/80 animate-pulse">
                  All Explored! ✨
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* ======================================================== */}
        {/* 2. GRID OF 6 ENHANCED PROBLEM CARDS (3D Tilt + Glow) */}
        {/* ======================================================== */}
        <div 
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 transition-all duration-300 ${
            selectedCard ? 'opacity-40 filter blur-[1px]' : 'opacity-100'
          }`}
        >
          {PROBLEMS.map((item, idx) => {
            const isCurrentlyAnimating = animatingIndex === idx;
            const isExplored = exploredCards.includes(item.id);

            return (
              <DiagnosticCard
                key={item.id}
                item={item}
                index={idx}
                isExplored={isExplored}
                isCurrentlyAnimating={isCurrentlyAnimating}
                onClick={() => handleCardClick(idx)}
                cardRef={(el) => (cardRefs.current[idx] = el)}
              />
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* 3. SECTION BOTTOM FOOTER CALL-TO-ACTION / CELEBRATION */}
        {/* ======================================================== */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.25, 1, 0.5, 1] }}
          className="mt-5 sm:mt-6 text-center flex flex-col items-center justify-center gap-4 px-4"
        >
          {/* Celebratory Congratulatory Box when all 6 explored */}
          {isAllExplored ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/95 via-sky-50/90 to-emerald-50/95 border border-[#12B9F2]/50 shadow-[0_12px_32px_rgba(6,45,120,0.12),0_0_24px_rgba(18,185,242,0.18)] text-center max-w-2xl w-full flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="text-left flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/80 border border-emerald-300 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
                    <span>Great job exploring!</span>
                  </div>
                  <p className="text-[14px] sm:text-[15px] font-semibold text-[#0B2A5B] leading-snug">
                    You've explored all your options — ready to talk to an expert?
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenConsult?.('Full Diagnostic Review')}
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#062D78] hover:bg-[#0646A8] text-white text-[13.5px] font-semibold shadow-[0_4px_16px_rgba(6,45,120,0.22)] hover:shadow-[0_6px_22px_rgba(6,45,120,0.32)] transition-all hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-[#12B9F2]/25 animate-pulse"
              >
                <span>Book Free Consultation</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
              <p className="text-[14.5px] sm:text-[15.5px] text-slate-700 font-medium tracking-tight">
                Whatever you're facing, explore structured guidance to find your next step.
              </p>
              <button
                type="button"
                onClick={() => onOpenConsult?.('General Legal Consultation')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#062D78] hover:bg-[#0646A8] text-white text-[13.5px] font-semibold shadow-[0_4px_16px_rgba(6,45,120,0.18)] hover:shadow-[0_6px_22px_rgba(6,45,120,0.28)] transition-all hover:scale-105 cursor-pointer active:scale-95 min-h-[44px]"
              >
                <span>Book a Free Consultation</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          )}

          {/* Repeat trust signals near CTA */}
          <TrustStrip className="mt-1" centered={true} />
        </motion.div>
      </div>

      {/* ======================================================== */}
      {/* 4. INTERACTIVE FLIP + JUMP-TO-CENTER LIGHTBOX OVERLAY */}
      {/* ======================================================== */}
      <AnimatePresence onExitComplete={() => setAnimatingIndex(null)}>
        {selectedCard && (
          <div 
            className="modal-card fixed inset-0 z-50 flex items-center justify-center p-4 overflow-visible"
            role="dialog"
            aria-modal="true"
            data-no-tilt="true"
            aria-label={`Solution for ${selectedCard.data.problem}`}
            style={{ perspective: 1200 }}
          >
            {/* Backdrop: Dims and blurs the background. ONLY click here closes the modal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={handleClose}
              className="absolute inset-0 bg-[#0B2A5B]/35 backdrop-blur-xs cursor-pointer"
            />

            {/* Glowing radial light effect behind the flipped card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ 
                opacity: [0, 1, 0.85], 
                scale: [0.7, 1.15, 1],
              }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ 
                duration: 0.65, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] max-w-[92vw] max-h-[92vw] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(18, 185, 242, 0.38) 0%, rgba(245, 158, 11, 0.22) 36%, rgba(6, 70, 168, 0.06) 55%, transparent 70%)',
                animation: 'heroCyanGlowPulse 4s ease-in-out infinite alternate',
              }}
            />

            {/* 3D Flying Card (Jumps from grid slot to screen center while rotating 180deg) */}
            <motion.div
              data-no-tilt="true"
              onClick={(e) => e.stopPropagation()}
              initial={{
                x: selectedCard.startX,
                y: selectedCard.startY,
                width: selectedCard.initialRect.width,
                height: selectedCard.initialRect.height,
                rotateY: 0,
              }}
              animate={{
                x: 0,
                y: 0,
                width: typeof window !== 'undefined' ? Math.min(480, window.innerWidth - 32) : 480,
                height: typeof window !== 'undefined' && window.innerWidth < 640 ? 440 : 400,
                rotateY: 180,
              }}
              exit={{
                x: selectedCard.startX,
                y: selectedCard.startY,
                width: selectedCard.initialRect.width,
                height: selectedCard.initialRect.height,
                rotateY: 0,
              }}
              transition={{
                duration: 0.48,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                transformStyle: 'preserve-3d',
              }}
              className="modal-card relative z-10 select-none max-w-[calc(100vw-32px)] max-h-[85vh]"
            >
              {/* FRONT FACE (Shows the problem card while initiating movement) */}
              <div
                data-no-tilt="true"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
                className="modal-card absolute inset-0 w-full h-full rounded-2xl bg-white p-5 sm:p-6 border border-neutral-200/90 shadow-xl flex flex-col justify-between overflow-hidden pointer-events-none"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${selectedCard.data.iconBg} ${selectedCard.data.iconColor}`}>
                    {selectedCard.data.isRupee ? (
                      <svg className="w-5 h-5 text-[#0B2A5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a4.5 4.5 0 0 0 0-9" />
                      </svg>
                    ) : (
                      <selectedCard.data.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {selectedCard.data.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#0B2A5B] tracking-tight leading-snug">
                    {selectedCard.data.problem}
                  </h3>
                </div>
                <div className="flex justify-end">
                  <span className="text-[12px] font-semibold text-[#078BE8]">Opening...</span>
                </div>
              </div>

              {/* BACK FACE (Flipped 180deg: Reassuring message with celebratory pop + staggered text & buttons) */}
              <div
                data-no-tilt="true"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
                className="modal-card absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl bg-white/98 backdrop-blur-xl p-5 sm:p-7 border border-[#12B9F2]/50 shadow-[0_22px_60px_rgba(6,45,120,0.24),0_0_35px_rgba(18,185,242,0.25)] flex flex-col justify-between select-text overflow-y-auto"
              >
                {/* Header: Celebratory Reassurance badge + Close Button */}
                <div className="flex items-center justify-between gap-3">
                  <div className="relative inline-flex items-center">
                    {/* Subtle celebratory ripple ring radiating from the badge */}
                    <div 
                      className="absolute -inset-1 rounded-full bg-emerald-400/25 animate-ping pointer-events-none" 
                      style={{ animationDuration: '1.2s', animationIterationCount: 2 }} 
                    />

                    {/* Badge container with soft glow */}
                    <div className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-500/35 text-emerald-700 text-xs font-bold tracking-wide uppercase shadow-[0_0_12px_rgba(16,185,129,0.22)]">
                      {/* Animated checkmark icon with pop-bounce + draw-in effect */}
                      <motion.svg
                        className="w-4 h-4 text-emerald-600 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: [0, 1.35, 1], rotate: 0 }}
                        transition={{ delay: 0.36, duration: 0.45, ease: [0.175, 0.885, 0.32, 1.275] }}
                      >
                        <motion.path
                          d="M20 6L9 17L4 12"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ delay: 0.40, duration: 0.35, ease: 'easeOut' }}
                        />
                      </motion.svg>
                      <span>{selectedCard.data.reassurance}</span>

                      {/* Tiny gentle celebratory sparkle */}
                      <motion.span
                        initial={{ opacity: 0, scale: 0, y: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [0, 1.3, 0.8], y: -6 }}
                        transition={{ delay: 0.44, duration: 0.65 }}
                        className="text-amber-400 text-xs pointer-events-none absolute -top-2.5 -right-1"
                      >
                        ✦
                      </motion.span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Close solution dialog"
                    className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer shrink-0 min-w-[36px] min-h-[36px]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Middle: Problem Context + Solution Explanation + Structured Next Steps */}
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42, duration: 0.4, ease: 'easeOut' }}
                  className="my-auto py-1 space-y-2 overflow-y-auto pr-1"
                >
                  <span className="text-[11.5px] font-bold uppercase tracking-wider text-[#0646A8] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{selectedCard.data.problem}</span>
                  </span>
                  
                  <p className="text-[13px] sm:text-[13.5px] text-slate-700 font-normal leading-relaxed">
                    {selectedCard.data.explanation}
                  </p>

                  {/* Practical Guidance Next Steps Box */}
                  <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-2.5 sm:p-3 text-left space-y-1.5 text-[11px] sm:text-[11.5px]">
                    <div className="font-semibold text-[#0B2A5B] text-xs">
                      Practical Next Steps:
                    </div>
                    <div className="text-slate-600 space-y-1">
                      <p><span className="font-medium text-slate-800">• Information to gather:</span> {selectedCard.data.nextSteps?.gather}</p>
                      <p><span className="font-medium text-slate-800">• What to review:</span> {selectedCard.data.nextSteps?.review}</p>
                      <p><span className="font-medium text-slate-800">• When to seek advice:</span> {selectedCard.data.nextSteps?.advice}</p>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 italic">
                    Educational guidance only. Does not constitute formal legal counsel or guaranteed outcomes.
                  </p>
                </motion.div>

                {/* Footer: Action Buttons (Responsive stack on mobile with >=44px tap targets) */}
                <motion.div 
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-2.5 pt-3 border-t border-slate-100"
                >
                  <button
                    type="button"
                    onClick={() => handleNavigateToService(selectedCard.data.serviceLink)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl bg-[#062D78] hover:bg-[#0646A8] text-white text-[12.5px] sm:text-[13px] font-semibold shadow-md transition-all hover:scale-[1.02] cursor-pointer active:scale-95 min-h-[44px] sm:min-h-0"
                  >
                    <span>Explore {selectedCard.data.serviceName}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleConsultClick(selectedCard.data.problem)}
                    className="inline-flex items-center justify-center gap-1 px-3 py-2.5 sm:py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#078BE8] text-[12px] font-semibold border border-[#078BE8]/30 transition-colors cursor-pointer active:scale-95 min-h-[44px] sm:min-h-0"
                  >
                    <span>Talk to Advocate</span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
