import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

export const FAQ_ITEMS = [
  {
    id: 'confidentiality',
    question: 'Is my information kept confidential?',
    answer: 'Yes. Everything you share with us is completely confidential and protected under attorney-client privilege where applicable. We never share your details with third parties without your consent.',
    tag: 'Privacy & Privilege'
  },
  {
    id: 'cost',
    question: 'How much does a consultation cost?',
    answer: "Your first consultation is completely free. We'll assess your situation and explain your options before any commitment is required.",
    tag: 'Free Consultation'
  },
  {
    id: 'timeline',
    question: 'How long does it take to resolve a case?',
    answer: "It depends on the complexity of your situation. Simple harassment cases can see relief within days, while settlements or legal disputes may take a few weeks to months. We'll give you a realistic timeline during your consultation.",
    tag: 'Case Timeline'
  },
  {
    id: 'advocates',
    question: 'Are your advocates verified and qualified?',
    answer: 'Yes. All advocates on our panel are Bar Council registered and go through a verification process before joining LegalBharosa.',
    tag: 'Bar Council Panel'
  },
  {
    id: 'coverage',
    question: "Can you help if I'm outside a major city?",
    answer: 'Yes, we provide Pan-India coverage. Most consultations and case handling can be done remotely via phone, WhatsApp, or video call.',
    tag: 'Pan-India Coverage'
  },
  {
    id: 'harassment',
    question: 'What if recovery agents are calling my family or workplace?',
    answer: "This is illegal under RBI's Fair Practices Code. Let us know immediately — we can intervene directly and formally to stop this.",
    tag: 'RBI Compliance'
  },
  {
    id: 'upfront-fees',
    question: 'Do I need to pay anything upfront for loan settlement services?',
    answer: "We'll explain our fee structure clearly during your consultation — there are no hidden charges, and everything is agreed upon before we begin.",
    tag: 'Transparent Fees'
  },
  {
    id: 'getting-started',
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
  // Open the first item by default for quick glance
  const [openItems, setOpenItems] = useState({ confidentiality: true });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.title = 'Frequently Asked Questions | LegalBharosa';
  }, []);

  const toggleAccordion = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen w-full bg-[#EDEDED] p-2 sm:p-3 lg:p-3.5 font-inter text-neutral-900 selection:bg-[#168CFF]/20 selection:text-[#0B2A5B] flex flex-col gap-3 sm:gap-4 overflow-x-hidden">
      
      {/* ======================================================== */}
      {/* 1. TOP HERO CONTAINER (Navbar + Breadcrumb + Headline)   */}
      {/* ======================================================== */}
      <header className="relative w-full overflow-hidden bg-[#d9d9d9] rounded-2xl sm:rounded-3xl flex flex-col justify-between pb-8 sm:pb-12 shadow-sm border border-neutral-200/60">
        
        {/* Sky Clean Background image with smooth skeleton state */}
        <img
          src="/assets/hero-sky-clean.jpg"
          alt="Clean sky background for legal help and support"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          loading="eager"
        />

        {/* Soft overlay for contrast */}
        <div className="absolute inset-0 bg-white/20 pointer-events-none" />

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col w-full h-full">
          {/* Breadcrumb Navigation Pill */}
          <div className="max-w-5xl mx-auto w-full px-4 pt-6 sm:pt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#0B2A5B] hover:text-[#168CFF] bg-white/80 hover:bg-white px-3 py-1.5 rounded-full border border-neutral-200/80 shadow-xs transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168CFF]"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Home</span>
            </button>

            <span className="text-[11px] font-mono text-neutral-600 uppercase tracking-wider hidden sm:inline">
              Help Center / FAQ
            </span>
          </div>

          {/* Intro Section */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center px-4 pt-4 sm:pt-6 text-center select-none max-w-3xl mx-auto w-full"
          >
            {/* Category Tag Badge */}
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-xs border border-[#168CFF]/20 text-[12.5px] font-semibold text-[#0B2A5B] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
              <span>Help Center & Answers</span>
            </div>

            {/* Page Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B2A5B] tracking-tight leading-[1.15] font-inter">
              Frequently Asked Questions
            </h1>

            {/* Subheading */}
            <p className="mt-3 sm:mt-4 text-neutral-700 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
              Everything you need to know about how LegalBharosa can help.
            </p>

            {/* Quick Trust Highlights */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-medium text-[#0B2A5B]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-neutral-200/80 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#168CFF]" />
                100% Confidential
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-neutral-200/80 shadow-2xs">
                <Scale className="w-3.5 h-3.5 text-[#b45309]" />
                Bar Council Advocates
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-neutral-200/80 shadow-2xs">
                <Lock className="w-3.5 h-3.5 text-[#0646A8]" />
                RBI Compliant
              </span>
            </div>
          </motion.div>
        </div>
      </header>

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
                          {item.question}
                        </h2>
                        <span className="text-[10.5px] sm:text-[11px] font-medium text-[#0646A8] tracking-wide mt-0.5 block">
                          {item.tag}
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
                          <p>{item.answer}</p>
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
              Still have questions?
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-lg leading-relaxed">
              Connect directly with our advisory desk for an immediate, confidential evaluation of your case.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenConsult?.('FAQ Page Consultation')}
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 rounded-full bg-[#0B2A5B] hover:bg-[#123E8A] text-white text-[14px] font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer min-h-[44px] group"
              >
                <span>Book a Free Consultation</span>
                <ArrowRight className="w-4 h-4 text-[#F4B400] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/services')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#0B2A5B] text-[13.5px] font-semibold transition-colors cursor-pointer min-h-[44px]"
              >
                <span>Explore All Services</span>
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
