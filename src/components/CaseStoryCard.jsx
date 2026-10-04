import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  IndianRupee, 
  Star, 
  CheckCircle2, 
  FileCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import CardBorderTrace from './CardBorderTrace';
import { CATEGORY_THEMES } from '../data/reviewsData';
import { useTranslation } from 'react-i18next';

export default function CaseStoryCard({ 
  review, 
  delay = 0, 
  index = 0,
  showFullTextDefault = false 
}) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(showFullTextDefault);
  const theme = CATEGORY_THEMES[review.category] || CATEGORY_THEMES.OTS;
  const cs = review.caseSummary || {
    timeline: t('clientStories.card.notDisclosed', 'Not disclosed'),
    exposure: t('clientStories.card.notDisclosed', 'Not disclosed'),
    satisfaction: t('clientStories.card.satisfied', 'Satisfied'),
    resolution: review.caseTopic,
  };

  // Allow long review paragraphs (> 230 characters) to be collapsed/expanded comfortably
  const isLongText = review.reviewText && review.reviewText.length > 230;
  const displayText = (!isExpanded && isLongText && !showFullTextDefault)
    ? `${review.reviewText.slice(0, 220)}...`
    : review.reviewText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ 
        duration: 0.6, 
        delay: (index % 3) * 0.08,
        ease: [0.25, 1, 0.5, 1] 
      }}
      className={`group relative rounded-2xl bg-white border border-neutral-200/90 p-5 sm:p-5.5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_32px_-6px_rgba(7,139,232,0.18)] hover:border-[#078BE8]/50 select-none text-left overflow-hidden`}
    >
      {/* Travelling Border Accent on hover */}
      <CardBorderTrace delay={delay} borderRadius={16} />

      <div className="flex-1 flex flex-col">
        {/* TOP: Category Tag & Verified Review Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${theme.badgeClass}`}>
            {review.caseTopic}
          </span>

          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 shrink-0">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{t('clientStories.card.verifiedReview', 'Verified Review')}</span>
          </span>
        </div>

        {/* 
          ========================================================================
          STRUCTURED CASE STORY SUMMARY (2x2 Compact Grid)
          - Timeline, Exposure, Satisfaction, Resolution
          - Strictly supported by the review; non-disclosed values clearly noted
          ========================================================================
        */}
        <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-3 my-2 shadow-2xs group-hover:border-blue-200/90 transition-colors">
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
            {/* 1. TIMELINE */}
            <div className="flex flex-col min-w-0">
              <span className="text-[9.5px] font-mono uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#078BE8] shrink-0 transition-transform duration-200 group-hover:scale-110" />
                <span>{t('clientStories.card.timeline', 'Timeline')}</span>
              </span>
              <span className={`text-[12.5px] font-bold leading-tight mt-0.5 truncate ${
                cs.timeline === 'Not disclosed' || cs.timeline === t('clientStories.card.notDisclosed', 'Not disclosed') ? 'text-slate-400 font-normal italic text-[11.5px]' : 'text-[#0B2A5B]'
              }`}>
                {cs.timeline}
              </span>
            </div>

            {/* 2. EXPOSURE */}
            <div className="flex flex-col min-w-0">
              <span className="text-[9.5px] font-mono uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1">
                <IndianRupee className="w-3 h-3 text-[#078BE8] shrink-0 transition-transform duration-200 group-hover:scale-110" />
                <span>{t('clientStories.card.exposure', 'Exposure')}</span>
              </span>
              <span className={`text-[12.5px] font-bold leading-tight mt-0.5 truncate ${
                cs.exposure === 'Not disclosed' || cs.exposure === t('clientStories.card.notDisclosed', 'Not disclosed') ? 'text-slate-400 font-normal italic text-[11.5px]' : 'text-[#0B2A5B]'
              }`}>
                {cs.exposure}
              </span>
            </div>

            {/* Divider line between rows */}
            <div className="col-span-2 border-t border-slate-200/60 my-0.5" />

            {/* 3. SATISFACTION */}
            <div className="flex flex-col min-w-0">
              <span className="text-[9.5px] font-mono uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1">
                <Star className="w-3 h-3 text-[#F4B400] fill-[#F4B400] shrink-0 transition-transform duration-200 group-hover:scale-110" />
                <span>{t('clientStories.card.satisfaction', 'Satisfaction')}</span>
              </span>
              <span className="text-[12.5px] font-bold text-[#0B2A5B] leading-tight mt-0.5 truncate">
                {cs.satisfaction}
              </span>
            </div>

            {/* 4. RESOLUTION */}
            <div className="flex flex-col min-w-0">
              <span className="text-[9.5px] font-mono uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                <span>{t('clientStories.card.resolution', 'Resolution')}</span>
              </span>
              <span 
                className="text-[12.5px] font-bold text-[#0B2A5B] leading-tight mt-0.5 truncate" 
                title={cs.resolution}
              >
                {cs.resolution}
              </span>
            </div>
          </div>
        </div>

        {/* FULL CLIENT STORY / TESTIMONIAL (100% Verbatim) */}
        <div className="mt-2.5 mb-1 flex-1">
          <p className="text-[13px] text-neutral-700 leading-relaxed font-normal">
            "{displayText}"
          </p>

          {/* Read Full Story / Show Less interaction */}
          {isLongText && !showFullTextDefault && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded((prev) => !prev);
              }}
              className="mt-1.5 inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#078BE8] hover:text-[#0646A8] transition-colors cursor-pointer select-none"
            >
              <span>{isExpanded ? t('clientStories.card.showLess', 'Show Less') : t('clientStories.card.readFullStory', 'Read Full Story')}</span>
              {isExpanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* CARD FOOTER: Client Name & Original Review Link */}
      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-[#0B2A5B]/10 border border-[#0B2A5B]/20 flex items-center justify-center font-bold text-[#0B2A5B] text-xs shrink-0">
            {review.clientName.charAt(0)}
          </div>
          <div className="min-w-0">
            <span className="font-bold text-[#0B2A5B] text-[12.5px] block truncate">
              {review.clientName}
            </span>
            <span className="text-[10px] text-neutral-500 font-medium block truncate">
              {review.caseTopic}
            </span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-[10.5px] text-emerald-700 font-medium shrink-0 ml-2">
          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t('clientStories.card.originalReview', 'Original Review')}</span>
        </span>
      </div>
    </motion.div>
  );
}
