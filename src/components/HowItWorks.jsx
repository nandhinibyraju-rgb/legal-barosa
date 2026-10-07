import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  FileSearch, 
  UploadCloud, 
  Compass, 
  Gavel, 
  CheckCircle, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';
import CardBorderTrace from './CardBorderTrace';

const STEPS = [
  {
    step: 'Step 01',
    title: 'Case Review',
    description: 'Share your situation confidentially. We assess your loans, notices, and overdue status.',
    icon: FileSearch,
  },
  {
    step: 'Step 02',
    title: 'Document Assessment',
    description: 'Upload relevant documents — notices, statements, and communication records — for review.',
    icon: UploadCloud,
  },
  {
    step: 'Step 03',
    title: 'Resolution Strategy',
    description: 'We classify your case and recommend the right path: settlement, restructuring, or legal action.',
    icon: Compass,
  },
  {
    step: 'Step 04',
    title: 'Negotiation / Legal Action',
    description: 'Our team engages your lender directly, or a qualified advocate takes over where legal action is needed.',
    icon: Gavel,
  },
  {
    step: 'Step 05',
    title: 'Settlement / Repayment',
    description: 'Terms are finalized and documented, subject to lender approval.',
    icon: CheckCircle,
  },
  {
    step: 'Step 06',
    title: 'Closure & Recovery',
    description: 'You receive closure documents, plus guidance on rebuilding your credit going forward.',
    icon: ShieldCheck,
  },
];

export default function HowItWorks({ onOpenConsult }) {
  const { t } = useTranslation();
  const timelineRef = useRef(null);
  const fillLineRef = useRef(null);
  const beadRef = useRef(null);
  const [visibleSteps, setVisibleSteps] = useState({});
  const rowRefs = useRef([]);

  // 1. PROGRESSIVE LINE FILL EFFECT (Scroll-driven direct DOM transform - ZERO React re-renders on scroll)
  useEffect(() => {
    let animationFrameId;

    const handleScroll = () => {
      if (!timelineRef.current || !fillLineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const startOffset = windowHeight * 0.75;
      const totalDist = rect.height;
      const scrolled = startOffset - rect.top;
      const progress = Math.min(Math.max(scrolled / totalDist, 0), 1);
      
      fillLineRef.current.style.transform = `scaleY(${progress})`;
      if (beadRef.current) {
        beadRef.current.style.top = `${progress * 100}%`;
      }
    };

    const onScrollThrottled = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScrollThrottled, { passive: true });
    window.addEventListener('resize', onScrollThrottled, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScrollThrottled);
      window.removeEventListener('resize', onScrollThrottled);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 2. CARD POP-UP ON VISIT
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.stepIndex);
            setVisibleSteps((prev) => ({
              ...prev,
              [index]: true,
            }));
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    rowRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="how-it-works"
      className="w-full py-8 sm:py-10 px-3 sm:px-4 relative z-10"
    >
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        className="max-w-6xl mx-auto bg-[#f5f2ee] rounded-2xl sm:rounded-3xl border border-neutral-300/60 shadow-sm p-4 sm:p-7 md:p-8 flex flex-col items-center justify-center text-center"
      >
        {/* ======================================================== */}
        {/* ======================================================== */}
        {/* 1. SECTION HEADLINE */}
        {/* ======================================================== */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#168CFF]/20 text-xs font-mono uppercase tracking-widest text-[#123E8A] mb-3 sm:mb-4 shadow-xs mx-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-[#168CFF] animate-pulse" />
          <span>{t('howItWorks.badge', 'How It Works')}</span>
        </div>

        <h2 
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] leading-[1.2] font-semibold text-[#0B2A5B] text-center max-w-[720px] mx-auto mb-6 sm:mb-8 tracking-tight"
        >
          {t('howItWorks.title', 'How LegalBharosa Works')}
        </h2>

        {/* ======================================================== */}
        {/* 2. VERTICAL TIMELINE / TREE CONTAINER */}
        {/* ======================================================== */}
        <div 
          ref={timelineRef}
          className="relative w-full max-w-4xl mx-auto py-2"
        >
          {/* BASE UNFILLED LINE */}
          <div 
            aria-hidden="true"
            className="absolute top-6 bottom-6 left-5 sm:left-8 md:left-1/2 -translate-x-1/2 w-[2px] bg-neutral-300 pointer-events-none"
          />

          {/* PROGRESSIVE FILL LINE (Bright Blue #168CFF) */}
          <div 
            ref={fillLineRef}
            aria-hidden="true"
            style={{
              transform: 'scaleY(0)',
              transformOrigin: 'top',
            }}
            className="absolute top-6 bottom-6 left-5 sm:left-8 md:left-1/2 -translate-x-1/2 w-[2px] bg-[#168CFF] pointer-events-none transition-transform duration-75 ease-out shadow-[0_0_8px_rgba(22,140,255,0.7)]"
          >
            {/* Gold Tip Bead */}
            <div 
              ref={beadRef}
              style={{
                top: '0%',
              }}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#F4B400] shadow-[0_0_10px_rgba(244,180,0,0.9)]"
            />
          </div>

          {/* 6 STEP NODES */}
          <div className="space-y-4 sm:space-y-5 relative z-10">
            {STEPS.map((step, index) => {
              const isEven = index % 2 === 1;
              const isVisible = !!visibleSteps[index];
              const Icon = step.icon;
              const stepNum = index + 1;
              const stepKey = `step${stepNum}`;
              const localizedTitle = t(`howItWorks.steps.${stepKey}.title`, step.title);
              const localizedDesc = t(`howItWorks.steps.${stepKey}.desc`, step.description);
              const localizedStep = t(`howItWorks.steps.${stepKey}.step`, step.step);

              return (
                <div 
                  key={index}
                  ref={(el) => (rowRefs.current[index] = el)}
                  data-step-index={index}
                  className="relative flex items-center md:justify-between w-full"
                >
                  {/* DESKTOP LEFT COLUMN (Card for Odd Steps 01, 03, 05) */}
                  <div className="hidden md:flex md:w-[calc(50%-36px)] justify-end">
                    {!isEven ? (
                      <div
                        onClick={() => onOpenConsult && onOpenConsult(`${localizedStep}: ${localizedTitle}`)}
                        className={`group relative w-full max-w-[380px] p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_-4px_rgba(11,42,91,0.09),0_0_16px_rgba(22,140,255,0.12)] cursor-pointer transition-all duration-300 text-right hover:-translate-y-0.5 overflow-visible select-none ${
                          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                      >
                        <CardBorderTrace delay={(index * 0.8) % 6} borderRadius={16} />
                        <div className="relative z-10 flex items-center justify-end gap-2 mb-1.5">
                          <Icon className="w-4 h-4 text-neutral-400 group-hover:text-[#168CFF] transition-colors" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#168CFF]" />
                          <span className="text-xs font-mono text-[#123E8A] uppercase tracking-wider font-semibold">
                            {localizedStep}
                          </span>
                        </div>
                        <h3 className="relative z-10 text-[#0B2A5B] font-semibold text-base sm:text-lg tracking-tight mb-1 group-hover:text-[#168CFF] transition-colors">
                          {localizedTitle}
                        </h3>
                        <p className="relative z-10 text-neutral-600 text-xs sm:text-sm leading-relaxed">
                          {localizedDesc}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  {/* CENTER NODE CIRCLE */}
                  <div className="absolute left-5 sm:left-8 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                    <div 
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                        isVisible
                          ? 'bg-[#0B2A5B] border-[#F4B400] text-[#F4B400] shadow-sm scale-105'
                          : 'bg-white border-neutral-300 text-neutral-400'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>

                  {/* RIGHT COLUMN (Card for Even Steps 02, 04, 06 on desktop, all steps on mobile) */}
                  <div className="w-full pl-12 sm:pl-16 md:pl-0 md:w-[calc(50%-36px)] flex justify-start">
                    {(isEven || typeof window !== 'undefined') && (
                      <div
                        onClick={() => onOpenConsult && onOpenConsult(`${localizedStep}: ${localizedTitle}`)}
                        className={`group relative w-full max-w-[380px] p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_-4px_rgba(11,42,91,0.09),0_0_16px_rgba(22,140,255,0.12)] cursor-pointer transition-all duration-300 text-left hover:-translate-y-0.5 overflow-visible select-none ${
                          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        } ${!isEven ? 'md:hidden' : ''}`}
                      >
                        <CardBorderTrace delay={(index * 0.8) % 6} borderRadius={16} />
                        <div className="relative z-10 flex items-center justify-start gap-2 mb-1.5">
                          <span className="text-xs font-mono text-[#123E8A] uppercase tracking-wider font-semibold">
                            {localizedStep}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#168CFF]" />
                          <Icon className="w-4 h-4 text-neutral-400 group-hover:text-[#168CFF] transition-colors" />
                        </div>
                        <h3 className="relative z-10 text-[#0B2A5B] font-semibold text-base sm:text-lg tracking-tight mb-1 group-hover:text-[#168CFF] transition-colors">
                          {localizedTitle}
                        </h3>
                        <p className="relative z-10 text-neutral-600 text-xs sm:text-sm leading-relaxed">
                          {localizedDesc}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM STEP CTA */}
        <div className="mt-6 sm:mt-8 flex flex-col items-center">
          <button
            type="button"
            onClick={() => onOpenConsult?.('How It Works Step 1 Action')}
            className="inline-flex items-center gap-2 bg-[#0B2A5B] hover:bg-[#123E8A] text-white rounded-full px-6 py-2.5 sm:py-3 text-sm font-semibold shadow-sm transition-all cursor-pointer min-h-[44px]"
          >
            <span>{t('howItWorks.ctaButton', 'Start Step 01 Review')}</span>
            <ArrowRight className="w-4 h-4 text-[#F4B400]" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
// Final submission update
