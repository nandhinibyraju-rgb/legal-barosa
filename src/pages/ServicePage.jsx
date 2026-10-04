import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ChevronRight, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Scale, 
  AlertCircle,
  AlertTriangle,
  FileText,
  Clock,
  HelpCircle,
  Layers,
  FolderCheck,
  Compass
} from 'lucide-react';
import Footer from '../components/Footer';
import { DarkPageHeaderAtmosphere } from '../components/DarkPageHeader';
import ServiceAnimatedIllustration from '../components/ServiceAnimatedIllustration';
import ResolutionProcessDeck from '../components/ResolutionProcessDeck';
import ServiceConsultationSection from '../components/ServiceConsultationSection';
import TrustStrip from '../components/TrustStrip';
import { useTranslation } from 'react-i18next';
import { SERVICE_SPECIFIC_DATA } from '../data/serviceSpecificDetailData';
import { SERVICES_DATA } from '../data/servicesData';

const SLUG_TO_KEY = {
  'harassment-protection': 'harassmentProtection',
  'loan-settlement': 'loanSettlement',
  'legal-notice-review': 'legalNoticeReview',
  'debt-management': 'debtManagement',
  'npa-secured-loans': 'npaSecuredLoans',
  'credit-recovery': 'creditRecovery',
};

export default function ServicePage({
  serviceKey,
  user,
  userProfile,
  onOpenConsult,
  onOpenSignIn,
}) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Resolve service data from prop or URL slug
  const activeSlug = serviceKey || slug || 'harassment-protection';
  const detailData = SERVICE_SPECIFIC_DATA[activeSlug] || SERVICE_SPECIFIC_DATA['harassment-protection'];
  const legacyService = SERVICES_DATA[activeSlug] || SERVICES_DATA['harassment-protection'];
  const localeKey = SLUG_TO_KEY[activeSlug];

  const displayTitle = localeKey ? t(`services.items.${localeKey}.title`, detailData.serviceTitle) : detailData.serviceTitle;
  const displayIntro = localeKey ? t(`services.items.${localeKey}.intro`, detailData.heroIntro) : detailData.heroIntro;
  const displayHeading = localeKey ? t(`services.items.${localeKey}.heading`, detailData.heroHeading) : detailData.heroHeading;
  const displayTag = localeKey ? t(`services.items.${localeKey}.tag`, detailData.tag) : detailData.tag;

  // Scroll to top when service changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.title = `${displayTitle} | LegalBharosa`;
  }, [activeSlug, displayTitle]);

  const scrollToForm = () => {
    const el = document.getElementById('consultation-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] p-2 sm:p-3.5 lg:p-4 font-inter text-neutral-900 selection:bg-[#168CFF]/20 selection:text-[#0B2A5B] flex flex-col gap-6 sm:gap-8 overflow-x-hidden">
      
      {/* ======================================================== */}
      {/* 1. HERO / SERVICE INTRO                                  */}
      {/* ======================================================== */}
      <div className="relative w-full overflow-hidden bg-[#02091A] rounded-2xl sm:rounded-3xl flex flex-col justify-between pb-8 sm:pb-12 lg:pb-14 shadow-lg border border-white/10">
        
        {/* Deep navy gradient + subtle white star/dot particles */}
        <DarkPageHeaderAtmosphere />

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation Row */}
          <div className="w-full pt-5 sm:pt-7 pb-4 flex items-center justify-between border-b border-white/10 mb-4 sm:mb-6">
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#E0F2FE] hover:text-white bg-[#0B2456]/80 hover:bg-[#123E8A] px-3.5 py-1.5 rounded-full border border-[#168CFF]/30 shadow-xs transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-[#38BDF8]" />
              <span>{t('common.back', 'Back to All Services')}</span>
            </button>

            <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider hidden sm:inline">
              {t('nav.services', 'Services')} / <span className="text-[#38BDF8] font-bold">{displayTitle}</span>
            </span>
          </div>

          {/* Hero Content: Two-column Desktop Layout (Text on Left / Tailored Illustration on Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center w-full py-2 sm:py-4">
            
            {/* LEFT COLUMN: Service Title, Description, Badges, CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="lg:col-span-7 flex flex-col items-start text-left select-none w-full"
            >
              {/* Category Tag Badge */}
              <div className="inline-flex items-center gap-2 bg-[#0D2654]/90 rounded-full px-3.5 py-1.5 shadow-sm border border-[#168CFF]/40 text-[11.5px] sm:text-[12px] font-semibold text-[#E0F2FE] mb-3.5">
                <span className="w-2 h-2 rounded-full bg-[#F4B400] shadow-[0_0_6px_#F4B400] animate-pulse" />
                <span>{displayTag}</span>
              </div>

              {/* High-Contrast White Heading */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] xl:text-[46px] font-bold text-white tracking-tight leading-[1.18] font-heading break-words mb-3.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
                {displayHeading}
              </h1>

              {/* Plain Language Explanatory Paragraph */}
              <p className="text-[#E2E8F0] text-sm sm:text-base md:text-[16px] leading-relaxed max-w-xl mb-5 font-normal">
                {displayIntro}
              </p>

              {/* Quick Trust Row */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs font-medium text-[#E0F2FE] mb-6 sm:mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B2456]/80 border border-[#168CFF]/30 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>{t('common.confidentialGuaranteed', '100% Confidential')}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B2456]/80 border border-[#168CFF]/30 shadow-2xs">
                  <Scale className="w-3.5 h-3.5 text-[#F4B400]" />
                  <span>{t('common.barCouncilAdvocates', 'Advocate Assisted')}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B2456]/80 border border-[#168CFF]/30 shadow-2xs">
                  <Lock className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>{t('common.rbiCompliant', 'Statutory Compliance')}</span>
                </span>
              </div>

              {/* Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#062D78] to-[#0A4294] hover:from-[#08358C] hover:to-[#0C4EA8] text-white rounded-full pl-6 pr-2 py-2.5 text-[14px] font-semibold transition-all shadow-[0_4px_16px_rgba(6,45,120,0.4)] hover:shadow-[0_6px_22px_rgba(22,140,255,0.35)] border border-[#168CFF]/40 cursor-pointer hover:scale-105 active:scale-[0.98] min-h-[44px]"
                >
                  <span>{t('common.getFreeConsultation', 'Free Case Assessment')}</span>
                  <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                    <ChevronRight className="w-4 h-4 text-[#F4B400]" />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenConsult?.(detailData.ctaTopic)}
                  className="text-xs sm:text-sm font-semibold text-[#E0F2FE] hover:text-white bg-[#0B2456]/70 hover:bg-[#123E8A] px-4 py-2.5 rounded-full border border-[#168CFF]/30 transition-all cursor-pointer min-h-[44px] flex items-center justify-center shadow-xs"
                >
                  {t('booking.fastWhatsAppCallback', 'Request Instant Callback')}
                </button>
              </div>

              {/* Subtle Trust Strip */}
              <div className="mt-4 w-full">
                <TrustStrip variant="dark" centered={false} />
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Service-Specific Animated Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="lg:col-span-5 flex items-center justify-center w-full"
            >
              <ServiceAnimatedIllustration serviceSlug={activeSlug} />
            </motion.div>

          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. WHAT IS THIS PROBLEM?                                 */}
      {/* ======================================================== */}
      <section className="w-full max-w-5xl mx-auto px-2 sm:px-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-neutral-200/90 shadow-sm relative overflow-hidden">
          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B2A5B]/5 border border-[#168CFF]/20 text-xs font-mono uppercase tracking-widest text-[#123E8A] w-fit">
              <AlertCircle className="w-3.5 h-3.5 text-[#168CFF]" />
              <span>Section 01 &bull; Diagnostic Overview</span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0B2A5B] tracking-tight leading-snug">
              {detailData.problemExplanation.headline}
            </h2>

            <div className="flex flex-col gap-3 text-neutral-700 text-sm sm:text-[15px] leading-relaxed">
              {detailData.problemExplanation.paragraphs.map((p, idx) => (
                <p key={`prob-p-${idx}`}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. WHO IS THIS FOR?                                      */}
      {/* ======================================================== */}
      <section className="w-full max-w-5xl mx-auto px-2 sm:px-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-neutral-200/90 shadow-xs">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B2A5B]/5 border border-[#168CFF]/20 text-xs font-mono uppercase tracking-widest text-[#123E8A] mb-2.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Section 02 &bull; Suitability &amp; Scope</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B2A5B] tracking-tight">
              Who This Service Is For
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Clear parameters to help you identify if this pathway applies to your current situation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {detailData.whoIsThisFor.map((item, idx) => (
              <div 
                key={`who-${idx}`} 
                className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-neutral-50/80 border border-neutral-200/70 text-xs sm:text-sm text-neutral-800"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. HOW LEGALBHAROSA CAN HELP                             */}
      {/* ======================================================== */}
      <section className="w-full max-w-5xl mx-auto px-2 sm:px-4">
        <div className="bg-[#f8fafc] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-neutral-200/80 shadow-xs">
          <div className="text-center mb-7 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#168CFF]/20 text-xs font-mono uppercase tracking-widest text-[#123E8A] mb-2 shadow-2xs mx-auto">
              <ShieldCheck className="w-3.5 h-3.5 text-[#168CFF]" />
              <span>Section 03 &bull; How We Help</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0B2A5B] tracking-tight">
              How LegalBharosa Can Help
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-lg mx-auto">
              Concrete support and professional coordination tailored specifically to {detailData.serviceTitle.toLowerCase()}.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {detailData.howWeHelp.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={`help-item-${idx}`}
                  className="bg-white rounded-xl p-5 sm:p-6 border border-neutral-200/80 shadow-2xs flex flex-col justify-start hover:border-[#168CFF]/40 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#0B2A5B]/5 text-[#168CFF] flex items-center justify-center font-bold text-xs mb-3.5">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <h3 className="text-[15px] font-bold text-[#0B2A5B] mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. POSSIBLE RESOLUTION PATHS                             */}
      {/* ======================================================== */}
      <section className="w-full max-w-5xl mx-auto px-2 sm:px-4">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#168CFF]/20 text-xs font-mono uppercase tracking-widest text-[#123E8A] mb-2 shadow-2xs mx-auto">
            <Compass className="w-3.5 h-3.5 text-[#168CFF]" />
            <span>Section 04 &bull; Resolution Options</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0B2A5B] tracking-tight">
            Possible Resolution Paths
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-md mx-auto">
            Practical, service-specific pathways available based on your circumstances.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {detailData.resolutionPaths.map((path, idx) => (
            <div 
              key={`path-${idx}`}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200/90 shadow-2xs flex flex-col justify-between hover:border-[#168CFF]/40 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#0B2A5B]/10 text-[#0B2A5B] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h3 className="text-sm sm:text-[15px] font-bold text-[#0B2A5B] leading-snug">
                    {path.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed pl-8">
                  {path.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. STEP-BY-STEP RESOLUTION PROCESS                       */}
      {/* ======================================================== */}
      <section className="w-full max-w-5xl mx-auto px-2 sm:px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#168CFF]/20 text-xs font-mono uppercase tracking-widest text-[#123E8A] mb-2 shadow-2xs mx-auto">
            <Clock className="w-3.5 h-3.5 text-[#168CFF]" />
            <span>Section 05 &bull; Resolution Workflow</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0B2A5B] tracking-tight">
            Step-by-Step Resolution Process
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-md mx-auto">
            A structured, service-specific sequence designed for transparency and legal rigor.
          </p>
        </div>

        {/* Interactive Stacked Card Deck */}
        <ResolutionProcessDeck 
          steps={detailData.processSteps} 
          serviceTitle={detailData.serviceTitle} 
        />
      </section>

      {/* ======================================================== */}
      {/* 7. DOCUMENTS & INFORMATION REQUIRED                      */}
      {/* ======================================================== */}
      <section className="w-full max-w-5xl mx-auto px-2 sm:px-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-neutral-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B2A5B]/5 text-xs font-mono uppercase tracking-widest text-[#123E8A] mb-2">
                <FileText className="w-3.5 h-3.5 text-[#168CFF]" />
                <span>Section 06 &bull; Preparation Checklist</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B2A5B] tracking-tight">
                Documents &amp; Information Required
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-lg self-start sm:self-auto">
              Provide what is currently accessible
            </span>
          </div>

          {/* Clean scannable document cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {detailData.documentsRequired.map((doc, idx) => (
              <div 
                key={`doc-item-${idx}`}
                className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/70 flex flex-col justify-start hover:border-[#168CFF]/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2 text-[#0B2A5B]">
                  <FolderCheck className="w-4 h-4 text-[#168CFF] shrink-0" />
                  <span className="text-[12px] font-bold tracking-wide font-mono uppercase text-[#0B2A5B]">
                    {doc.name}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {doc.description}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom helpful note requested */}
          <div className="mt-6 pt-4 border-t border-neutral-100 flex items-start gap-2.5 text-xs text-neutral-500">
            <HelpCircle className="w-4 h-4 text-[#168CFF] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-neutral-700">Don’t have everything yet?</strong> Provide whatever is currently available. Additional information can be identified during the initial review.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. RISKS & LIMITATIONS                                   */}
      {/* ======================================================== */}
      <section className="w-full max-w-5xl mx-auto px-2 sm:px-4">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#168CFF]/20 text-xs font-mono uppercase tracking-widest text-[#123E8A] mb-2 shadow-2xs mx-auto">
            <Lock className="w-3.5 h-3.5 text-[#168CFF]" />
            <span>Section 07 &bull; Honest Guardrails</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0B2A5B] tracking-tight">
            Risks &amp; Limitations
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-md mx-auto">
            Transparent expectations and important parameters you should know upfront.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {detailData.risksAndLimitations.map((item, idx) => (
            <div 
              key={`risk-item-${idx}`}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200/80 shadow-2xs flex flex-col justify-start"
            >
              <div className="flex items-center gap-2 mb-2 text-[#0B2A5B] font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{item.title}</span>
              </div>
              <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed pl-6">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. FREE CASE ASSESSMENT CTA                              */}
      {/* ======================================================== */}
      <ServiceConsultationSection 
        service={legacyService} 
        user={user} 
        title="Not sure what to do next?"
        subtitle="Share your situation and understand the possible next steps."
      />

      {/* ======================================================== */}
      {/* 10. LEGAL DISCLAIMER / SCOPE                             */}
      {/* ======================================================== */}
      <section className="w-full max-w-5xl mx-auto px-2 sm:px-4">
        <div className="bg-neutral-100 rounded-2xl p-5 sm:p-6 border border-neutral-300/80 text-xs text-neutral-600 leading-relaxed flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-[#0B2A5B] font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#168CFF]" />
            <span>Section 10 &bull; Legal Disclaimer &amp; Scope of Service</span>
          </div>
          <p>
            The information provided on this page is for general educational and informational purposes. Financial counselling, debt documentation, and creditor communication support are distinct from formal legal representation. Where legal notice replies, litigation defense, or court appearances are required, services are provided independently by appropriately qualified and enrolled legal professionals.
          </p>
          <p className="text-[11.5px] text-neutral-500 pt-2 border-t border-neutral-200">
            Outcomes are not guaranteed and depend strictly on the individual facts of each case. Decisions regarding loan settlements, restructuring, court proceedings, and credit bureau updates remain within the sole discretion and authority of respective lenders, courts, tribunals, and regulatory bodies. All debt repayment or settlement amounts must be paid directly to the lending institution.
          </p>
        </div>
      </section>

      {/* ======================================================== */}
      {/* FOOTER                                                   */}
      {/* ======================================================== */}
      <Footer
        onOpenConsult={onOpenConsult}
        onNavigateHome={() => navigate('/')}
        onNavigateToAbout={() => navigate('/about')}
      />

    </div>
  );
}
