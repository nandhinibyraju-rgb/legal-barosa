import React from 'react';
import { 
  ShieldCheck, 
  Scale, 
  Building2, 
  Lock, 
  UserCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import CardBorderTrace from './CardBorderTrace';

export default function AboutSection({ onOpenConsult, onNavigateToAbout }) {
  const pillars = [
    {
      icon: Scale,
      title: 'Qualified Advocates',
      desc: 'All legal defense is handled directly by Bar Council of India-registered advocates specializing in debt recovery law, SARFAESI defense, and NI Act Section 138.',
      badge: 'BCI Registered',
    },
    {
      icon: ShieldCheck,
      title: 'RBI Fair Practices Code',
      desc: 'We enforce the Reserve Bank of India’s Fair Practice Code against abusive recovery agent harassment, unlawful contact hours, and workplace intimidation.',
      badge: 'Statutory Shield',
    },
    {
      icon: Building2,
      title: 'Structured Settlements',
      desc: 'Negotiate transparent, lender-approved One-Time Settlements (OTS) with formal written waivers and official No Dues Certificates (NDC).',
      badge: 'Formal Waivers',
    },
    {
      icon: Lock,
      title: 'Dignity & Confidentiality',
      desc: 'Your financial hardships, loan documents, and personal data remain protected with strict privilege, zero judgment, and complete discretion.',
      badge: '100% Confidential',
    },
  ];

  return (
    <section 
      id="about" 
      className="w-full py-12 sm:py-16 px-3 sm:px-4 relative z-10 scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B2A5B]/5 border border-[#168CFF]/20 text-[#123E8A] text-[12px] font-semibold tracking-wide uppercase mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
            <span>Dedicated Legal & Financial Counseling</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold tracking-tight text-[#0B2A5B] font-heading uppercase">
            ABOUT LEGALBHAROSA
          </h2>

          <p className="mt-3 text-neutral-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Who We Are & What Drives Us — Built on transparency, qualified advocate expertise, and real accountability for every Indian borrower.
          </p>
        </div>

        {/* 4 Pillars Grid with Glowing Border Trace */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            const delays = [0, 1.4, 2.8, 0.7];
            return (
              <div
                key={index}
                onClick={() => onOpenConsult?.(`About: ${pillar.title}`)}
                className="group relative rounded-2xl bg-white p-6 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_-4px_rgba(11,42,91,0.09),0_0_16px_rgba(22,140,255,0.12)] transition-all duration-300 cursor-pointer hover:-translate-y-1 select-none overflow-visible border border-neutral-200/80"
              >
                {/* Glowing Travelling Border Beam */}
                <CardBorderTrace delay={delays[index]} borderRadius={16} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[#0B2A5B]/5 border border-[#168CFF]/20 text-[#123E8A] flex items-center justify-center group-hover:bg-[#0B2A5B] group-hover:text-[#F4B400] transition-colors shadow-xs">
                      <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </div>
                    <span className="text-[10.5px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#123E8A] border border-[#168CFF]/20">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-[17px] font-bold text-[#0B2A5B] mb-2 tracking-tight group-hover:text-[#168CFF] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-neutral-600 text-xs sm:text-[13px] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="relative z-10 mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-[#123E8A] group-hover:text-[#168CFF] transition-colors">
                  <span>Explore Standard</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Credentials / Operating Entity Trust Strip */}
        <div className="group mt-8 relative rounded-2xl bg-white p-5 sm:p-7 border border-neutral-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_-4px_rgba(11,42,91,0.09),0_0_16px_rgba(22,140,255,0.12)] transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-visible">
          <CardBorderTrace delay={1.8} borderRadius={16} />
          
          <div className="relative z-10 flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-[#168CFF]/25 flex items-center justify-center text-[#168CFF] shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[14px] sm:text-[15px] font-bold text-[#0B2A5B]">
                Bar Council Registered Advocates & Legal Specialists
              </div>
              <div className="text-xs text-neutral-500">
                Operating under Indian legal standards with qualified legal advocate representation.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToAbout ? onNavigateToAbout() : onOpenConsult?.('About Detailed View')}
            className="relative z-10 inline-flex items-center gap-2 bg-[#0B2A5B] hover:bg-[#123E8A] text-white text-xs sm:text-[13px] font-medium px-4 py-2 rounded-full transition-colors shrink-0 cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <span>Read Full About LegalBharosa</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F4B400]" />
          </button>
        </div>
      </div>
    </section>
  );
}
