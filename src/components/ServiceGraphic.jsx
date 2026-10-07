import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  Scale, 
  FileText, 
  Award, 
  TrendingUp, 
  Building2, 
  Clock, 
  Sparkles,
  PhoneCall,
  Gavel,
  Landmark,
  BadgeCheck
} from 'lucide-react';

export default function ServiceGraphic({ service }) {
  const { graphicType, graphicBadges, title, tag } = service;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, [service.slug || service.title]);

  return (
    <div className="relative w-full max-w-lg mx-auto min-h-[440px] sm:min-h-0 sm:aspect-[4/3] lg:aspect-square flex items-center justify-center p-2 sm:p-6 select-none">
      {/* Ambient background glow matching site theme */}
      <div 
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-tr from-[#0646A8]/10 via-[#168CFF]/15 to-[#F4B400]/10 rounded-3xl blur-2xl -z-10" 
      />

      {/* Main Glassmorphic Card Container */}
      <div className={`relative w-full h-full bg-gradient-to-b from-[#0B2A5B] to-[#06152D] rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[#168CFF]/30 shadow-2xl flex flex-col justify-between overflow-hidden text-white transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-85'}`}>
        {!isLoaded && (
          <div aria-hidden="true" className="absolute inset-0 bg-[#0B2A5B]/60 animate-shimmer-dark z-20 pointer-events-none" />
        )}
        
        {/* Subtle Background Circuit / Grid Watermark */}
        <div 
          aria-hidden="true" 
          className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" 
        />

        {/* Top Header Row of Graphic Card */}
        <div className="relative z-10 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#168CFF]/20 border border-[#168CFF]/40 flex items-center justify-center text-[#168CFF]">
              <ShieldCheck className="w-4 h-4 text-[#F4B400]" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">LegalBharosa Shield</p>
              <p className="text-xs font-bold text-white tracking-wide">{tag}</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10.5px] font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active Protection
          </span>
        </div>

        {/* Center Visual Element (Customized per service) */}
        <div className="relative z-10 py-4 flex flex-col items-center justify-center text-center">
          {graphicType === 'shield' && (
            <div className="relative flex flex-col items-center">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#168CFF] to-[#0646A8] p-[2px] shadow-[0_0_30px_rgba(22,140,255,0.4)] mb-3">
                <div className="w-full h-full bg-[#0B2A5B] rounded-[14px] flex items-center justify-center">
                  <ShieldAlert className="w-10 h-10 sm:w-12 sm:h-12 text-[#F4B400] animate-pulse" />
                </div>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white">Cease & Desist Shield</h4>
              <p className="text-xs text-slate-300 max-w-xs mt-1">Zero unauthorized calls or third-party intimidation permitted</p>
            </div>
          )}

          {graphicType === 'settlement' && (
            <div className="relative flex flex-col items-center">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#F4B400] to-[#E99A00] p-[2px] shadow-[0_0_30px_rgba(244,180,0,0.35)] mb-3">
                <div className="w-full h-full bg-[#0B2A5B] rounded-[14px] flex items-center justify-center">
                  <Award className="w-10 h-10 sm:w-12 sm:h-12 text-[#F4B400]" />
                </div>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white">Official No Dues Certificate</h4>
              <p className="text-xs text-slate-300 max-w-xs mt-1">Legally binding written waiver with no future claims</p>
            </div>
          )}

          {graphicType === 'legal' && (
            <div className="relative flex flex-col items-center">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#168CFF] to-[#60a5fa] p-[2px] shadow-[0_0_30px_rgba(22,140,255,0.4)] mb-3">
                <div className="w-full h-full bg-[#0B2A5B] rounded-[14px] flex items-center justify-center">
                  <Gavel className="w-10 h-10 sm:w-12 sm:h-12 text-[#F4B400]" />
                </div>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white">High Court Advocate Defense</h4>
              <p className="text-xs text-slate-300 max-w-xs mt-1">Strict adherence to statutory reply notice windows</p>
            </div>
          )}

          {graphicType === 'debt' && (
            <div className="relative flex flex-col items-center">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#12B9F2] to-[#078BE8] p-[2px] shadow-[0_0_30px_rgba(18,185,242,0.4)] mb-3">
                <div className="w-full h-full bg-[#0B2A5B] rounded-[14px] flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-[#F4B400]" />
                </div>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white">1 Consolidated Monthly Plan</h4>
              <p className="text-xs text-slate-300 max-w-xs mt-1">Tailored to your actual cashflow with zero compounding stress</p>
            </div>
          )}

          {graphicType === 'npa' && (
            <div className="relative flex flex-col items-center">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#168CFF] via-[#078BE8] to-[#F4B400] p-[2px] shadow-[0_0_30px_rgba(22,140,255,0.35)] mb-3">
                <div className="w-full h-full bg-[#0B2A5B] rounded-[14px] flex items-center justify-center">
                  <Landmark className="w-10 h-10 sm:w-12 sm:h-12 text-[#F4B400]" />
                </div>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white">SARFAESI & DRT Representation</h4>
              <p className="text-xs text-slate-300 max-w-xs mt-1">Defending commercial & residential assets against unlawful auction</p>
            </div>
          )}

          {graphicType === 'credit' && (
            <div className="relative flex flex-col items-center">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#10b981] to-[#12B9F2] p-[2px] shadow-[0_0_30px_rgba(16,185,129,0.35)] mb-3">
                <div className="w-full h-full bg-[#0B2A5B] rounded-[14px] flex items-center justify-center">
                  <BadgeCheck className="w-10 h-10 sm:w-12 sm:h-12 text-[#F4B400]" />
                </div>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white">CIBIL Bureau Cleanse</h4>
              <p className="text-xs text-slate-300 max-w-xs mt-1">Rectifying erroneous write-offs and rebuilding score to 750+</p>
            </div>
          )}
        </div>

        {/* Bottom Badges Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-white/10">
          {graphicBadges?.map((b, idx) => (
            <div 
              key={idx} 
              className="p-2 sm:p-2.5 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-between gap-1.5 text-left"
            >
              <div className="flex items-center gap-1.5 overflow-hidden">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F4B400] shrink-0" />
                <span className="text-[11px] font-medium text-slate-200 truncate">{b.label}</span>
              </div>
              <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-[#168CFF]/20 text-[#168CFF] font-semibold shrink-0">
                {b.status}
              </span>
            </div>
          ))}
        </div>

        {/* Security Stamp footer */}
        <div className="relative z-10 mt-3 pt-2 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-[#168CFF]" />
            <span>100% Client-Advocate Privilege</span>
          </div>
          <span className="font-mono text-[10px] text-amber-300/80">Bar Council Registered</span>
        </div>
      </div>
    </div>
  );
}
// Final submission update
