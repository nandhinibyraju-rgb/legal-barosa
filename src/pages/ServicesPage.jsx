import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, 
  Scale, 
  FileText, 
  ChartLine, 
  Building, 
  TrendingUp, 
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  UserCheck
} from 'lucide-react';
import Footer from '../components/Footer';
import CardBorderTrace from '../components/CardBorderTrace';
import TrustStrip from '../components/TrustStrip';
import DarkPageHeader from '../components/DarkPageHeader';
import { subscribePublishedServices } from '../services/firestoreService';

export const ALL_SERVICES = [
  {
    id: 'harassment',
    serviceKey: 'harassmentProtection',
    slug: 'harassment-protection',
    path: '/services/harassment-protection',
    title: 'Harassment Protection',
    description: 'Document recovery calls and messages, and get lawful escalation support under RBI Fair Practices Code.',
    icon: ShieldCheck,
    tag: 'RBI Fair Practices',
  },
  {
    id: 'settlement',
    serviceKey: 'loanSettlement',
    slug: 'loan-settlement',
    path: '/services/loan-settlement',
    title: 'Loan Settlement',
    description: 'Negotiate one-time settlements across personal, credit card, and business loans with formal waivers.',
    icon: Scale,
    tag: 'One-Time Settlement',
  },
  {
    id: 'legal',
    serviceKey: 'legalNoticeReview',
    slug: 'legal-notice-review',
    path: '/services/legal-notice-review',
    title: 'Legal Notice Review',
    description: 'Advocates review summons and notices, and prepare strong replies within statutory deadlines.',
    icon: FileText,
    tag: 'Advocate Defense',
  },
  {
    id: 'debt',
    serviceKey: 'debtManagement',
    slug: 'debt-management',
    path: '/services/debt-management',
    title: 'Debt Management',
    description: 'Structured, affordable repayment plans for multiple unsecured debts without compounding stress.',
    icon: ChartLine,
    tag: 'Restructuring',
  },
  {
    id: 'npa',
    serviceKey: 'npaSecuredLoans',
    slug: 'npa-secured-loans',
    path: '/services/npa-secured-loans',
    title: 'NPA & Secured Loans',
    description: 'Specialist defense for SARFAESI notices, auction stays, and property repossession risk.',
    icon: Building,
    tag: 'SARFAESI & DRT',
  },
  {
    id: 'credit',
    serviceKey: 'creditRecovery',
    slug: 'credit-recovery',
    path: '/services/credit-recovery',
    title: 'Credit Recovery',
    description: 'Review your credit report and rebuild responsibly with official No Dues Certificates.',
    icon: TrendingUp,
    tag: 'Credit Score Repair',
  },
];

export default function ServicesPage({
  user,
  userProfile,
  onOpenConsult,
  onOpenSignIn,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [servicesList, setServicesList] = useState(ALL_SERVICES);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.title = `${t('nav.services', 'Services')} | LegalBharosa`;
    const unsub = subscribePublishedServices((live) => {
      if (live && live.length > 0) {
        setServicesList(live);
      } else {
        setServicesList(ALL_SERVICES);
      }
    });
    return () => unsub();
  }, [t]);

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] p-2 sm:p-3 lg:p-3.5 font-inter text-neutral-900 selection:bg-[#168CFF]/20 selection:text-[#0B2A5B] flex flex-col gap-3 sm:gap-4 overflow-x-hidden">
      
      {/* ======================================================== */}
      {/* 1. TOP HERO CONTAINER (Navbar + Breadcrumb + Headline) */}
      {/* ======================================================== */}
      <DarkPageHeader
        breadcrumbText={`${t('nav.home', 'Home')} / ${t('nav.services', 'Services')}`}
        maxWidth="max-w-5xl"
      >
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center px-4 pt-5 sm:pt-7 text-center select-none max-w-4xl mx-auto w-full"
        >
          <div className="inline-flex items-center gap-2 bg-[#0A2660]/85 backdrop-blur-md rounded-full px-4 py-1.5 shadow-xs border border-[#168CFF]/35 text-[12px] sm:text-[12.5px] font-semibold text-[#BAE6FD] mb-3.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
            <span>{t('services.badge', 'Comprehensive Borrower Protection & Legal Defense')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-white tracking-tight leading-[1.18] max-w-3xl font-heading uppercase break-words px-2">
            {t('services.title', 'OUR LEGAL & FINANCIAL SERVICES')}
          </h1>

          <p className="mt-3.5 sm:mt-4 text-slate-200 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-normal">
            {t('services.subtitle', 'Explore specialized legal defense, structured loan settlements, and harassment relief delivered by Bar Council-registered advocates.')}
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenConsult ? onOpenConsult('Services Page Hero') : navigate('/book-consultation')}
              className="inline-flex items-center gap-3 bg-[#0B2A5B] hover:bg-[#123E8A] text-white rounded-full pl-6 sm:pl-7 pr-2 py-2.5 sm:py-2.5 text-[14px] font-medium transition-all shadow-md cursor-pointer hover-glow-lift active:scale-[0.98] min-h-[44px] border border-[#168CFF]/40"
            >
              <span>{t('common.getFreeConsultation', 'Book a Free Consultation')}</span>
              <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <ChevronRight className="w-4 h-4 text-[#F4B400]" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/how-it-works')}
              className="text-xs sm:text-sm font-semibold text-white hover:text-white px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 transition-all cursor-pointer min-h-[44px] flex items-center justify-center backdrop-blur-md"
            >
              {t('nav.howItWorks', 'See How It Works')} →
            </button>
          </div>

          {/* Repeat trust strip near hero CTA */}
          <div className="mt-4">
            <TrustStrip variant="dark" centered={true} />
          </div>
        </motion.div>
      </DarkPageHeader>

      {/* ======================================================== */}
      {/* 2. THE 6 SERVICE CARDS GRID */}
      {/* ======================================================== */}
      <section className="w-full py-8 sm:py-12 px-2 sm:px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#168CFF]/20 text-xs font-mono uppercase tracking-widest text-[#123E8A] mb-3 shadow-2xs mx-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-[#168CFF] animate-pulse" />
              Tailored Legal Support
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2A5B] tracking-tight">
              Select Your Area of Need
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-lg mx-auto">
              Click any service card below to view detailed statutory protections, defense strategies, and dispute resolution workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {servicesList.map((item, index) => {
              const Icon = typeof item.icon === 'function' 
                ? item.icon 
                : item.iconName === 'Scale' ? Scale
                : item.iconName === 'FileText' ? FileText
                : item.iconName === 'ChartLine' ? ChartLine
                : item.iconName === 'Building' ? Building
                : item.iconName === 'TrendingUp' ? TrendingUp
                : item.iconName === 'UserCheck' ? UserCheck
                : ShieldCheck;
              const delays = [0, 1.2, 2.4, 0.6, 1.8, 3.0];
              const delay = delays[index % delays.length];

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  onClick={() => navigate(item.path)}
                  role="link"
                  tabIndex={0}
                  className="group relative rounded-2xl bg-white p-6 sm:p-7 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_-4px_rgba(11,42,91,0.09),0_0_16px_rgba(22,140,255,0.12)] transition-all duration-300 cursor-pointer hover:-translate-y-1 select-none overflow-visible border border-neutral-200/80"
                >
                  {/* Glowing Travelling Border Beam */}
                  <CardBorderTrace delay={delay} borderRadius={16} />

                  <div className="relative z-10">
                    {/* Top: Icon Badge & Category Tag */}
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#0B2A5B]/5 border border-[#168CFF]/20 text-[#123E8A] flex items-center justify-center group-hover:bg-[#0B2A5B] group-hover:text-[#F4B400] group-hover:border-[#F4B400]/40 transition-all duration-300 shadow-xs">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
                      </div>

                      <span className="text-[11px] font-semibold tracking-wide font-mono px-2.5 py-0.5 rounded-full bg-[#0B2A5B]/5 text-[#123E8A] border border-[#0B2A5B]/10">
                        {item.serviceKey ? t(`services.items.${item.serviceKey}.tag`, item.tag) : item.tag}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-[19px] font-bold text-[#0B2A5B] tracking-tight mb-2 group-hover:text-[#168CFF] transition-colors">
                      {item.serviceKey ? t(`services.items.${item.serviceKey}.title`, item.title) : item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-neutral-600 text-[13.5px] sm:text-sm leading-relaxed">
                      {item.serviceKey ? t(`services.items.${item.serviceKey}.shortDesc`, item.description) : item.description}
                    </p>
                  </div>

                  {/* Bottom: Action Link */}
                  <div className="relative z-10 mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-[#123E8A] group-hover:text-[#168CFF] transition-colors">
                    <span>{t('common.viewDetails', 'View Service Details')}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Credentials / Operating Entity Trust Strip */}
          <div className="group mt-10 relative rounded-2xl bg-white p-5 sm:p-7 border border-neutral-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_-4px_rgba(11,42,91,0.09),0_0_16px_rgba(22,140,255,0.12)] transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-visible">
            <CardBorderTrace delay={1.8} borderRadius={16} />
            
            <div className="relative z-10 flex items-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-[#168CFF]/25 flex items-center justify-center text-[#168CFF] shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[14px] sm:text-[15px] font-bold text-[#0B2A5B]">
                  {t('common.barCouncilAdvocates', 'Legal & Financial Advisory Panel')}
                </div>
                <div className="text-xs text-neutral-500">
                  {t('common.confidentialGuaranteed', 'Every service is delivered under strict advocate-client confidentiality and RBI statutory adherence.')}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenConsult ? onOpenConsult('Services Strip') : navigate('/book-consultation')}
              className="relative z-10 inline-flex items-center gap-2 bg-[#0B2A5B] hover:bg-[#123E8A] text-white text-xs sm:text-[13px] font-medium px-4 py-2 rounded-full transition-colors shrink-0 cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <span>{t('common.consultNow', 'Consult an Advocate')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F4B400]" />
            </button>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. LIGHT CLOSING CTA SECTION */}
      {/* ======================================================== */}
      <section className="w-full py-6 sm:py-10 px-2 sm:px-4 relative z-10">
        <div className="max-w-6xl mx-auto rounded-2xl sm:rounded-3xl bg-white border border-[#168CFF]/20 p-8 sm:p-12 text-center shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2A5B] tracking-tight mb-3">
              Unsure Which Legal Service Fits Your Case?
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-neutral-600 mb-6 leading-relaxed">
              Book a free confidential consultation. Our team will review your situation and direct you to the exact advocate or restructuring support needed.
            </p>

            <button
              type="button"
              onClick={() => onOpenConsult ? onOpenConsult('Services Bottom CTA') : navigate('/book-consultation')}
              className="inline-flex items-center gap-3 bg-[#0B2A5B] hover:bg-[#123E8A] text-white rounded-full px-7 py-3 text-sm font-semibold transition-all shadow-md cursor-pointer hover-glow-lift active:scale-[0.98] min-h-[44px]"
            >
              <span>Book a Free Consultation</span>
              <ArrowRight className="w-4 h-4 text-[#F4B400]" />
            </button>

            {/* Repeat trust strip near bottom CTA */}
            <div className="mt-3">
              <TrustStrip centered={true} />
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. FOOTER */}
      {/* ======================================================== */}
      <Footer
        onOpenConsult={onOpenConsult}
        onNavigateHome={() => navigate('/')}
        onNavigateToAbout={() => navigate('/about')}
      />

    </div>
  );
}
