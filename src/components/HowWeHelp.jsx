import React, { useRef, useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Scale, 
  FileText, 
  ChartLine, 
  Building, 
  TrendingUp, 
  ArrowRight 
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import CardBorderTrace from './CardBorderTrace';

const SERVICES = [
  {
    id: 'harassment',
    slug: 'harassment-protection',
    path: '/services/harassment-protection',
    title: 'Harassment Protection',
    description: 'Document recovery calls and messages, and get lawful escalation support under RBI Fair Practices Code.',
    icon: ShieldCheck,
    tag: 'RBI Fair Practices',
  },
  {
    id: 'settlement',
    slug: 'loan-settlement',
    path: '/services/loan-settlement',
    title: 'Loan Settlement',
    description: 'Negotiate one-time settlements across personal, credit card, and business loans with formal waivers.',
    icon: Scale,
    tag: 'One-Time Settlement',
  },
  {
    id: 'legal',
    slug: 'legal-notice-review',
    path: '/services/legal-notice-review',
    title: 'Legal Notice Review',
    description: 'Advocates review summons and notices, and prepare strong replies within statutory deadlines.',
    icon: FileText,
    tag: 'Advocate Defense',
  },
  {
    id: 'debt',
    slug: 'debt-management',
    path: '/services/debt-management',
    title: 'Debt Management',
    description: 'Structured, affordable repayment plans for multiple unsecured debts without compounding stress.',
    icon: ChartLine,
    tag: 'Restructuring',
  },
  {
    id: 'npa',
    slug: 'npa-secured-loans',
    path: '/services/npa-secured-loans',
    title: 'NPA & Secured Loans',
    description: 'Specialist defense for SARFAESI notices, auction stays, and property repossession risk.',
    icon: Building,
    tag: 'SARFAESI & DRT',
  },
  {
    id: 'credit',
    slug: 'credit-recovery',
    path: '/services/credit-recovery',
    title: 'Credit Recovery',
    description: 'Review your credit report and rebuild responsibly with official No Dues Certificates.',
    icon: TrendingUp,
    tag: 'Credit Score Repair',
  },
];

// Single Service Card with Mathematical SVG Border Tracing & Client-Side SPA Navigation
function ServiceCard({ item, index }) {
  const navigate = useNavigate();
  const Icon = item.icon;
  const delays = [0, 1.2, 2.4, 0.6, 1.8, 3.0];
  const delay = delays[index % delays.length];

  const handleCardClick = () => {
    navigate(item.path);
  };

  return (
    <div
      onClick={handleCardClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className="group relative rounded-2xl bg-white p-6 sm:p-7 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_-4px_rgba(11,42,91,0.09),0_0_16px_rgba(22,140,255,0.12)] transition-all duration-300 cursor-pointer hover:-translate-y-1 select-none overflow-visible border border-neutral-200/80"
    >
      {/* Glowing Travelling Border Beam */}
      <CardBorderTrace delay={delay} borderRadius={16} />

      {/* Card Content (Relative z-10 for sharp foreground readability) */}
      <div className="relative z-10">
        {/* Top: Icon Badge & Category Tag */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#0B2A5B]/5 border border-[#168CFF]/20 text-[#123E8A] flex items-center justify-center group-hover:bg-[#0B2A5B] group-hover:text-[#F4B400] group-hover:border-[#F4B400]/40 transition-all duration-300 shadow-xs">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
          </div>

          <span className="text-[11px] font-semibold tracking-wide font-mono px-2.5 py-0.5 rounded-full bg-[#0B2A5B]/5 text-[#123E8A] border border-[#0B2A5B]/10">
            {item.tag}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-[19px] font-bold text-[#0B2A5B] tracking-tight mb-2 group-hover:text-[#168CFF] transition-colors">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-neutral-600 text-[13.5px] sm:text-sm leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Bottom Action Link */}
      <div className="relative z-10 mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-[#123E8A] group-hover:text-[#168CFF] transition-colors">
        <span>Explore Service Details</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}

export default function HowWeHelp({ onOpenConsult }) {
  return (
    <section 
      id="services" 
      className="w-full py-12 sm:py-16 px-3 sm:px-4 relative z-10 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto">
        {/* ======================================================== */}
        {/* 1. SECTION TITLE: WHAT WE PROVIDE ONLY */}
        {/* ======================================================== */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold tracking-tight text-[#0B2A5B] font-heading uppercase">
            WHAT WE PROVIDE
          </h2>
        </div>

        {/* ======================================================== */}
        {/* 2. 6 SERVICE CARDS GRID (Clean 2-row x 3-col layout) */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {SERVICES.map((service, index) => (
            <ServiceCard
              key={service.id}
              item={service}
              index={index}
              onOpenConsult={onOpenConsult}
            />
          ))}
        </div>

        {/* ======================================================== */}
        {/* 3. COMPLIANCE DISCLAIMER */}
        {/* ======================================================== */}
        <p className="text-center text-xs text-neutral-500 max-w-xl mx-auto mt-10 leading-relaxed font-sans px-4">
          All resolutions are subject to lender approval. Legal support is provided through qualified advocates registered with the Bar Council of India.
        </p>
      </div>
    </section>
  );
}
// Final submission update
