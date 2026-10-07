import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ChevronDown, 
  ArrowLeft, 
  ArrowRight, 
  HelpCircle, 
  ShieldCheck, 
  MessageCircle, 
  Sparkles,
  Lock,
  Scale
} from 'lucide-react';
import Footer from '../components/Footer';
import TrustStrip from '../components/TrustStrip';
import CardBorderTrace from '../components/CardBorderTrace';
import DarkPageHeader from '../components/DarkPageHeader';

export const FAQ_ITEMS = [
  {
    id: 'confidentiality',
    key: 'confidentiality',
    question: 'Is my information kept confidential?',
    answer: 'Yes. Everything you share with us is completely confidential and protected under attorney-client privilege where applicable. We never share your details with third parties without your consent.',
    tag: 'Privacy & Privilege'
  },
  {
    id: 'cost',
    key: 'cost',
    question: 'How much does a consultation cost?',
    answer: "Your first consultation is completely free. We'll assess your situation and explain your options before any commitment is required.",
    tag: 'Free Consultation'
  },
  {
    id: 'timeline',
    key: 'timeline',
    question: 'How long does it take to resolve a case?',
    answer: "It depends on the complexity of your situation. Simple harassment cases can see relief within days, while settlements or legal disputes may take a few weeks to months. We'll give you a realistic timeline during your consultation.",
    tag: 'Case Timeline'
  },
  {
    id: 'advocates',
    key: 'advocates',
    question: 'Are your advocates verified and qualified?',
    answer: 'Yes. All advocates on our panel are Bar Council registered and go through a verification process before joining LegalBharosa.',
    tag: 'Bar Council Panel'
  },
  {
    id: 'coverage',
    key: 'coverage',
    question: "Can you help if I'm outside a major city?",
    answer: 'Yes, we support borrowers across India through remote consultations via phone, WhatsApp, or video call, and can advise on legal options applicable to your jurisdiction.',
    tag: 'Remote Consultation'
  },
  {
    id: 'harassment',
    key: 'harassment',
    question: 'What if recovery agents are calling my family or workplace?',
    answer: "Calling family or employers violates the RBI's Fair Practices Code. We can help you understand your legal remedies and assist in issuing formal legal notices where appropriate.",
    tag: 'RBI Compliance'
  },
  {
    id: 'upfront-fees',
    key: 'upfrontFees',
    question: 'Do I need to pay anything upfront for loan settlement services?',
    answer: "We'll explain our fee structure clearly during your consultation — there are no hidden charges, and everything is agreed upon before we begin.",
    tag: 'Transparent Fees'
  },
  {
    id: 'getting-started',
    key: 'gettingStarted',
    question: 'How do I get started?',
    answer: "Simply click 'Book a Free Consultation' anywhere on the site, share your details, and our team will reach out within 24 hours.",
    tag: 'Easy Onboarding'
  }
];

export default function FAQPage({
  user,
  userProfile: _userProfile,
  onOpenConsult,
  onOpenSignIn: _onOpenSignIn,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // Open the first item by default for quick glance
  const [openItems, setOpenItems] = useState({ confidentiality: true });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.title = `${t('faq.title', 'Frequently Asked Questions')} | LegalBharosa`;
  }, [t]);

  const toggleAccordion = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] p-2 sm:p-3 lg:p-3.5 font-inter text-neutral-900 selection:bg-[#168CFF]/20 selection:text-[#0B2A5B] flex flex-col gap-3 sm:gap-4 overflow-x-hidden">
      
      {/* ======================================================== */}
      {/* 1. TOP HERO CONTAINER (Navbar + Breadcrumb + Headline)   */}
      {/* ======================================================== */}
      <DarkPageHeader
        breadcrumbText={`${t('nav.home', 'Home')} / ${t('nav.faq', 'FAQ')}`}
        maxWidth="max-w-4xl"
      >
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center px-4 pt-5 sm:pt-7 text-center select-none max-w-4xl mx-auto w-full"
        >
          {/* Category Tag Badge */}
          <div className="inline-flex items-center gap-2 bg-[#0A2660]/85 backdrop-blur-md rounded-full px-4 py-1.5 shadow-xs border border-[#168CFF]/35 text-[12px] sm:text-[12.5px] font-semibold text-[#BAE6FD] mb-3.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
            <span>{t('faq.badge', 'Help Center & Answers')}</span>
          </div>

          {/* Page Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-bold text-white tracking-tight leading-[1.18] font-heading break-words px-2 max-w-3xl">
            {t('faq.title', 'Frequently Asked Questions')}
          </h1>

          {/* Subheading */}
          <p className="mt-3.5 sm:mt-4 text-slate-200 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-normal">
            {t('faq.subtitle', 'Everything you need to know about how LegalBharosa can help.')}
          </p>

          {/* Quick Trust Highlights */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-medium text-slate-200">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
              {t('common.confidentialGuaranteed', '100% Confidential')}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-2xs">
              <Scale className="w-3.5 h-3.5 text-[#FBBF24]" />
              {t('common.barCouncilAdvocates', 'Bar Council Advocates')}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-[#38BDF8]" />
              {t('common.rbiCompliant', 'RBI Compliant')}
            </span>
          </div>
        </motion.div>
      </DarkPageHeader>

      {/* ======================================================== */}
      {/* 2. MAIN ACCORDION SECTION (Responsive, Touch-Friendly)   */}
      {/* ======================================================== */}
      <main className="w-full py-6 sm:py-10 px-2 sm:px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex flex-col gap-3.5 sm:gap-4">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = !!openItems[item.id];
              const delays = [0, 0.8, 1.6, 2.4];
              const delay = delays[index % delays.length];

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`relative rounded-2xl bg-white border transition-all duration-300 overflow-hidden shadow-xs ${
                    isOpen 
                      ? 'border-[#168CFF]/50 shadow-[0_6px_24px_rgba(11,42,91,0.06)]' 
                      : 'border-neutral-200/90 hover:border-neutral-300'
                  }`}
                >
                  {/* Subtle Border beam effect when open */}
                  {isOpen && <CardBorderTrace delay={delay} borderRadius={16} />}

                  {/* Accordion Header / Trigger Button */}
                  <button
                    type="button"
                    onClick={() => toggleAccordion(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.id}`}
                    id={`faq-question-${item.id}`}
                    className="w-full min-h-[56px] px-5 sm:px-7 py-4.5 sm:py-5 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors hover:bg-neutral-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168CFF]"
                  >
                    <div className="flex items-center gap-3.5 sm:gap-4">
                      {/* Numeric or Icon Pill */}
                      <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0B2A5B]/5 border border-[#168CFF]/20 text-[#0B2A5B] font-semibold text-xs sm:text-[13px] flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>

                      <div>
                        <h2 className="text-[15px] sm:text-[17px] font-bold text-[#0B2A5B] tracking-tight leading-snug">
                          {t(`faq.questions.${item.key}.q`, item.question)}
                        </h2>
                        <span className="text-[10.5px] sm:text-[11px] font-medium text-[#0646A8] tracking-wide mt-0.5 block">
                          {t(`faq.questions.${item.key}.tag`, item.tag)}
                        </span>
                      </div>
                    </div>

                    {/* Rotating Chevron Icon (~0.3s transition) */}
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ease-out ${
                        isOpen 
                          ? 'rotate-180 bg-[#168CFF] text-white shadow-xs' 
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                      aria-hidden="true"
                    >
                      <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                    </div>
                  </button>

                  {/* Accordion Expandable Content with smooth height transition (~0.3s) */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${item.id}`}
                        role="region"
                        aria-labelledby={`faq-question-${item.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-7 pb-5 sm:pb-6 pt-1 text-sm sm:text-[15px] text-neutral-600 leading-relaxed border-t border-neutral-100/90 mt-1">
                          <p>{t(`faq.questions.${item.key}.a`, item.answer)}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* ======================================================== */}
          {/* 3. STILL HAVE QUESTIONS CTA BOX                          */}
          {/* ======================================================== */}
          <div className="mt-10 sm:mt-14 bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 p-6 sm:p-10 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-[#168CFF]/30 flex items-center justify-center text-[#168CFF] mb-4 shadow-2xs">
              <HelpCircle className="w-6 h-6 text-[#0646A8]" />
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0B2A5B] tracking-tight">
              {t('faq.stillHaveQuestions', 'Still have questions?')}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-lg leading-relaxed">
              {t('faq.subtitle', 'Connect directly with our advisory desk for an immediate, confidential evaluation of your case.')}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenConsult?.('FAQ Page Consultation')}
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 rounded-full bg-[#0B2A5B] hover:bg-[#123E8A] text-white text-[14px] font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer min-h-[44px] group"
              >
                <span>{t('common.getFreeConsultation', 'Book a Free Consultation')}</span>
                <ArrowRight className="w-4 h-4 text-[#F4B400] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/services')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#0B2A5B] text-[13.5px] font-semibold transition-colors cursor-pointer min-h-[44px]"
              >
                <span>{t('common.exploreServices', 'Explore All Services')}</span>
              </button>
            </div>

            {/* Repeat trust signals directly beneath CTA */}
            <div className="mt-3">
              <TrustStrip centered={true} />
            </div>
          </div>

        </div>
      </main>

      {/* ======================================================== */}
      {/* 4. FOOTER                                                */}
      {/* ======================================================== */}
      <Footer
        onOpenConsult={onOpenConsult}
        onNavigateHome={() => navigate('/')}
        onNavigateToAbout={() => navigate('/about')}
      />

    </div>
  );
}
// Final submission update
