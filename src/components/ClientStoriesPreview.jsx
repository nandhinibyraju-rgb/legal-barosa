import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  FileCheck
} from 'lucide-react';
import CardBorderTrace from './CardBorderTrace';
import { CLIENT_REVIEWS, CATEGORY_THEMES } from '../data/reviewsData';

// Select 3 standout verified client reviews representing primary resolution areas
export const FEATURED_CASE_STUDIES = [
  CLIENT_REVIEWS[0], // Shiva — OTS Settlement
  CLIENT_REVIEWS[1], // Raju — SARFAESI / DRT Assistance
  CLIENT_REVIEWS[4], // Sita — Business Restructuring
];

export default function ClientStoriesPreview({ onOpenConsult: _onOpenConsult }) {
  const navigate = useNavigate();
  const delays = [0, 1.2, 2.4];

  return (
    <section 
      id="client-stories"
      aria-label="Real People Real Results Section"
      className="w-full py-10 sm:py-14 px-3 sm:px-4 relative z-10 scroll-mt-24"
    >
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        className="max-w-6xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-sm p-6 sm:p-10 lg:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden"
      >
        
        {/* Ambient background glow */}
        <div 
          aria-hidden="true" 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-blue-50/50 via-transparent to-transparent pointer-events-none -z-10" 
        />

        {/* 1. Section Badge & Headline */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B2A5B]/5 border border-[#168CFF]/20 text-[#0646A8] text-[11.5px] sm:text-xs font-semibold tracking-wide uppercase mb-3.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
          <span>Real Client Reviews</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] leading-[1.2] font-semibold text-[#0B2A5B] tracking-tight">
          Real People,{' '}
          <span 
            style={{
              fontFamily: "'Instrument Serif', serif", 
              fontStyle: 'italic', 
              fontWeight: 400
            }}
            className="text-[#0646A8] text-3xl sm:text-4xl md:text-5xl"
          >
            Real Results
          </span>
        </h2>

        <p className="mt-2.5 text-sm sm:text-base text-neutral-600 max-w-xl leading-relaxed mx-auto">
          Read unfiltered feedback from borrowers and business owners across India who resolved their loan and legal challenges with LegalBharosa.
        </p>

        {/* 2. Three Featured Real Review Cards with Staggered Scroll Animation */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mt-8 sm:mt-10 mb-8 text-left">
          {FEATURED_CASE_STUDIES.map((review, index) => {
            const delay = delays[index % delays.length];
            const theme = CATEGORY_THEMES[review.category] || CATEGORY_THEMES.OTS;

            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ 
                  duration: 0.65, 
                  delay: index * 0.1, // Stagger entrance 100ms between cards
                  ease: [0.25, 1, 0.5, 1] 
                }}
                className={`group relative rounded-2xl bg-white border border-neutral-200/90 p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.04)] ${theme.hoverShadow} ${theme.hoverBorder} select-none overflow-hidden`}
              >
                {/* Glowing Travelling Border Beam */}
                <CardBorderTrace delay={delay} borderRadius={16} />

                <div>
                  {/* Category Tag & Verified Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${theme.badgeClass}`}>
                      {review.caseTopic}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified Review</span>
                    </span>
                  </div>

                  {/* Real Client Review Quote (Exact client words from PDF) */}
                  <div className="my-3">
                    <p className="text-[13px] sm:text-[13.5px] text-neutral-700 leading-relaxed font-normal">
                      "{review.reviewText}"
                    </p>
                  </div>
                </div>

                {/* Card Footer: Client Name & Link */}
                <div className="mt-5 pt-3.5 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#0B2A5B]/10 border border-[#0B2A5B]/20 flex items-center justify-center font-bold text-[#0B2A5B] text-xs">
                      {review.clientName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0B2A5B]">
                        {review.clientName}
                      </div>
                      <div className="text-[10.5px] text-neutral-500 font-medium">
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

        {/* 3. See All Client Stories Button */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.25, 1, 0.5, 1] }}
          className="flex flex-col items-center justify-center text-center mt-2"
        >
          <button
            type="button"
            onClick={() => navigate('/client-stories')}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#0B2A5B] hover:bg-[#123E8A] text-white text-[14px] font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer min-h-[44px] group"
          >
            <span>Explore All 40 Verified Client Reviews</span>
            <ArrowRight className="w-4 h-4 text-[#F4B400] group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="mt-3 text-[11px] text-neutral-500 max-w-md">
            Individual outcomes vary depending on lender guidelines, documentation, and case-specific facts.
          </p>
        </motion.div>

      </motion.div>
    </section>
  );
}
