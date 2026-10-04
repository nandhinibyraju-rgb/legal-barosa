import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  FileCheck
} from 'lucide-react';
import CardBorderTrace from './CardBorderTrace';
import TrustStrip from './TrustStrip';
import { CLIENT_REVIEWS, CATEGORY_THEMES } from '../data/reviewsData';

export default function ClientSuccessStories({ onOpenConsult }) {
  const featuredReviews = [
    CLIENT_REVIEWS[0], // Shiva — OTS Settlement
    CLIENT_REVIEWS[1], // Raju — SARFAESI / DRT Assistance
    CLIENT_REVIEWS[4], // Sita — Business Restructuring
  ];

  return (
    <section 
      id="client-stories"
      className="w-full py-12 sm:py-16 px-3 sm:px-4 relative z-10 scroll-mt-20"
    >
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        className="max-w-6xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 shadow-sm p-6 sm:p-12 flex flex-col items-center justify-center text-center relative overflow-visible"
      >
        {/* 1. SECTION BADGE & HEADLINE */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B2A5B]/5 border border-[#168CFF]/20 text-[#123E8A] text-[12px] font-semibold tracking-wide uppercase mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
          <span>Real Client Reviews</span>
        </div>

        <h2 
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] leading-[1.2] font-semibold text-[#0B2A5B] text-center max-w-[760px] mx-auto tracking-tight"
        >
          Real People.{' '}
          <span 
            style={{
              fontFamily: "'Playfair Display', Georgia, serif", 
              fontStyle: 'italic', 
              fontWeight: 600
            }}
            className="text-[#123E8A] text-3xl sm:text-4xl md:text-5xl"
          >
            Real Solutions.
          </span>
        </h2>

        {/* Sub-line */}
        <p className="mt-3 text-sm sm:text-base text-neutral-600 max-w-[620px] leading-relaxed text-center mx-auto">
          Read authentic client feedback from borrowers across India who found real resolution with LegalBharosa advocates and financial strategists.
        </p>

        {/* 2. THREE FEATURED REAL CASE CARDS */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mt-10 mb-8 text-left">
          {featuredReviews.map((review, index) => {
            const theme = CATEGORY_THEMES[review.category] || CATEGORY_THEMES.OTS;
            const delays = [0, 1.2, 2.4];

            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ 
                  duration: 0.65, 
                  delay: index * 0.1,
                  ease: [0.25, 1, 0.5, 1] 
                }}
                className={`group relative rounded-2xl bg-white border border-neutral-200/80 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.05)] ${theme.hoverShadow} ${theme.hoverBorder} select-none text-left overflow-hidden`}
              >
                {/* Glowing Travelling Border Beam */}
                <CardBorderTrace delay={delays[index]} borderRadius={16} />

                {/* Top Row: Case Topic & Verified Badge */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${theme.badgeClass}`}>
                      {review.caseTopic}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified Review</span>
                    </span>
                  </div>

                  {/* Real Review Quote */}
                  <blockquote className="text-neutral-700 text-[13.5px] leading-relaxed mb-6 font-normal">
                    "{review.reviewText}"
                  </blockquote>
                </div>

                {/* Bottom Section: Client Details */}
                <div className="pt-3.5 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#0B2A5B]/10 border border-[#0B2A5B]/20 flex items-center justify-center font-bold text-[#0B2A5B] text-xs">
                      {review.clientName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-[#0B2A5B] text-[13px]">
                        {review.clientName}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-medium">
                        {review.caseTopic}
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10.5px] text-emerald-700 font-medium">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Original Review</span>
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 3. TRUST STRIP & CTA */}
        <div className="w-full flex flex-col items-center gap-4 mt-2">
          <TrustStrip className="justify-center" />
          
          <button
            type="button"
            onClick={() => onOpenConsult?.('General Legal Consultation')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0B2A5B] hover:bg-[#123E8A] text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <span>Discuss Your Case in Confidence</span>
            <ArrowRight className="w-4 h-4 text-[#F4B400]" />
          </button>
        </div>

      </motion.div>
    </section>
  );
}
