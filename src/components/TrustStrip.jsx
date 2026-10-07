import React from 'react';
import { ShieldCheck, Scale, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * TrustStrip:
 * Reusable, subtle trust signal strip placed directly beneath major 'Book a Free Consultation' CTAs.
 * Features:
 * - Bar Council Verified
 * - RBI Compliant
 * - Structured Dispute Advisory
 * Accessible, responsive, and unobtrusive single line.
 */
export default function TrustStrip({ 
  className = '', 
  centered = true, 
  variant = 'light' // 'light' for white/light backgrounds, 'dark' for navy/dark cards
}) {
  const { t } = useTranslation();
  const isDark = variant === 'dark';

  return (
    <div 
      className={`inline-flex items-center flex-wrap gap-x-2.5 sm:gap-x-3 gap-y-1 text-[11px] sm:text-[12px] font-medium tracking-tight select-none pt-1 sm:pt-1.5 ${
        centered ? 'justify-center text-center mx-auto' : 'justify-start text-left'
      } ${
        isDark ? 'text-slate-300/90' : 'text-slate-600'
      } ${className}`}
      aria-label="Trust indicators"
    >
      <span className="inline-flex items-center gap-1.5 shrink-0">
        <Scale className={`w-3.5 h-3.5 ${isDark ? 'text-[#F4B400]' : 'text-[#D99B00]'} shrink-0`} aria-hidden="true" />
        <span className="font-semibold">{t('common.barCouncilVerified', 'Bar Council Verified')}</span>
      </span>

      <span className={`${isDark ? 'text-slate-500' : 'text-slate-300'} select-none`} aria-hidden="true">•</span>

      <span className="inline-flex items-center gap-1.5 shrink-0">
        <ShieldCheck className={`w-3.5 h-3.5 ${isDark ? 'text-[#168CFF]' : 'text-[#0646A8]'} shrink-0`} aria-hidden="true" />
        <span className="font-semibold">{t('common.rbiCompliant', 'RBI Compliant')}</span>
      </span>

      <span className={`${isDark ? 'text-slate-500' : 'text-slate-300'} select-none`} aria-hidden="true">•</span>

      <span className="inline-flex items-center gap-1.5 shrink-0">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
        <span className="font-semibold">{t('common.structuredAdvisory', 'Structured Dispute Advisory')}</span>
      </span>
    </div>
  );
}
// Final submission update
