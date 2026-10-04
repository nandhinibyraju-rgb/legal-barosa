import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';
import CaseStoryCard from './CaseStoryCard';
import { CLIENT_REVIEWS } from '../data/reviewsData';

// Select 3 standout verified client reviews representing primary resolution areas
export const FEATURED_CASE_STUDIES = [
  CLIENT_REVIEWS[0], // Shiva — OTS Settlement
  CLIENT_REVIEWS[1], // Raju — SARFAESI / DRT Assistance
  CLIENT_REVIEWS[4], // Sita — Business Restructuring
];

export default function ClientStoriesPreview({ onOpenConsult: _onOpenConsult }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const delays = [0, 1.2, 2.4];

  return (
    <section 
      id="client-stories"
      aria-label="Real People Real Results Section"
      className="w-full py-8 sm:py-10 px-3 sm:px-4 relative z-10 scroll-mt-24"
    >
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        className="max-w-6xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-sm p-5 sm:p-7 lg:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
      >
        
        {/* Ambient background glow */}
        <div 
          aria-hidden="true" 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-blue-50/50 via-transparent to-transparent pointer-events-none -z-10" 
        />

        {/* 1. Section Badge & Headline */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B2A5B]/5 border border-[#168CFF]/20 text-[#0646A8] text-[11.5px] sm:text-xs font-semibold tracking-wide uppercase mb-3.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
          <span>{t('clientStories.badge', 'Real Client Stories')}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] leading-[1.2] font-semibold text-[#0B2A5B] tracking-tight">
          {t('clientStories.title', 'Real People, Real Results')}
        </h2>

        <p className="mt-2.5 text-sm sm:text-base text-neutral-600 max-w-xl leading-relaxed mx-auto">
          {t('clientStories.subtitle', 'Read unfiltered feedback from borrowers and business owners across India who resolved their loan and legal challenges with LegalBharosa.')}
        </p>

        {/* 2. Three Featured Real Case Story Cards with Staggered Scroll Animation */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mt-6 sm:mt-7 mb-6 text-left">
          {FEATURED_CASE_STUDIES.map((review, index) => {
            const delay = delays[index % delays.length];

            return (
              <CaseStoryCard
                key={review.id}
                review={review}
                delay={delay}
                index={index}
                showFullTextDefault={false}
              />
            );
          })}
        </div>

        {/* 3. Explore Client Stories Button (Without Review Count Claim) */}
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
            <span>{t('clientStories.viewAllStories', 'Explore Client Stories')}</span>
            <ArrowRight className="w-4 h-4 text-[#F4B400] group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="mt-3 text-[11px] text-neutral-500 max-w-md">
            {t('clientStories.confidentialNotice', 'Individual outcomes vary depending on lender guidelines, documentation, and case-specific facts.')}
          </p>
        </motion.div>

      </motion.div>
    </section>
  );
}
