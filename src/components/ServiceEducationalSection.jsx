import React from 'react';
import { 
  ShieldCheck, 
  Scale, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  FolderCheck, 
  Users, 
  Info,
  Lock
} from 'lucide-react';
import { 
  SERVICE_EDUCATIONAL_DATA, 
  UNIVERSAL_CAN_AND_CANNOT 
} from '../data/serviceEducationalData';

/**
 * ServiceEducationalSection:
 * Implements the core LEGALBHAROSA SUPPORT and RESOLUTION OPTIONS sections:
 * - LegalBharosa Support: Professional Capabilities & Suitability
 * - Resolution Options: Strategic Pathways, Can/Cannot Guardrails & Document Checklist
 * 
 * Free of redundant 3-card step processes or duplicate carousels.
 */
export default function ServiceEducationalSection({ 
  serviceSlug = 'harassment-protection',
}) {
  const eduData = SERVICE_EDUCATIONAL_DATA[serviceSlug] || SERVICE_EDUCATIONAL_DATA['harassment-protection'];

  return (
    <div className="w-full flex flex-col gap-10 sm:gap-14 my-2 sm:my-4 relative z-10">

      {/* ======================================================== */}
      {/* 1. LEGALBHAROSA SUPPORT: HOW WE HELP                    */}
      {/* ======================================================== */}
      <section className="w-full max-w-6xl mx-auto px-2 sm:px-4">
        <div className="bg-[#f8fafc] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-neutral-200/80 shadow-xs">
          
          <div className="text-center mb-7 sm:mb-9">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#168CFF]/20 text-xs font-mono uppercase tracking-widest text-[#123E8A] mb-2 shadow-2xs mx-auto">
              <ShieldCheck className="w-3.5 h-3.5 text-[#168CFF]" />
              <span>Professional Capabilities</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0B2A5B] tracking-tight">
              How LegalBharosa Supports You
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl mx-auto">
              {eduData.howWeHelp.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {eduData.howWeHelp.points.map((pt, i) => (
              <div 
                key={`how-pt-${i}`}
                className="bg-white rounded-xl p-5 border border-neutral-200/80 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-[#0B2A5B]/5 text-[#168CFF] flex items-center justify-center font-bold text-xs mb-3">
                    0{i + 1}
                  </div>
                  <h3 className="text-sm font-bold text-[#0B2A5B] mb-1.5 leading-snug">
                    {pt.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {pt.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-200/60 flex items-center justify-center gap-2 text-xs text-neutral-500 text-center">
            <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>Support is provided in accordance with applicable statutory guidelines and ethical professional standards.</span>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. SUITABILITY GUIDANCE: WHO IS THIS FOR?               */}
      {/* ======================================================== */}
      <section className="w-full max-w-6xl mx-auto px-2 sm:px-4">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#168CFF]/20 text-xs font-mono uppercase tracking-widest text-[#123E8A] mb-2 shadow-2xs mx-auto">
            <Users className="w-3.5 h-3.5 text-[#168CFF]" />
            <span>Suitability Guidance</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0B2A5B] tracking-tight">
            Who Is This Service For?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-lg mx-auto">
            Transparent eligibility parameters based on actual statutory and operational scope.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          
          {/* Ideal For */}
          <div className="bg-white rounded-2xl p-6 border border-emerald-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 text-emerald-800 font-bold text-sm sm:text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Relevant Situations Include:</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-neutral-700">
                {eduData.whoIsThisFor.idealFor.map((item, idx) => (
                  <li key={`ideal-${idx}`} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* When Another Professional or Pathway is Required */}
          <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 text-amber-900 font-bold text-sm sm:text-base">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>When Another Pathway May Be Required:</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-neutral-700">
                {eduData.whoIsThisFor.notSuitableFor.map((item, idx) => (
                  <li key={`notsuit-${idx}`} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. RESOLUTION OPTIONS: POSSIBLE RESOLUTION PATHS         */}
      {/* ======================================================== */}
      <section className="w-full max-w-6xl mx-auto px-2 sm:px-4">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#168CFF]/20 text-xs font-mono uppercase tracking-widest text-[#123E8A] mb-2 shadow-2xs mx-auto">
            <Scale className="w-3.5 h-3.5 text-[#F4B400]" />
            <span>Strategic Options</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0B2A5B] tracking-tight">
            Possible Resolution Paths
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl mx-auto">
            Resolution options depend on individual case facts, documentation, and lender discretion.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {eduData.resolutionPaths.map((path, idx) => (
            <div 
              key={`res-path-${idx}`}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200/80 shadow-xs flex flex-col justify-between hover:border-[#168CFF]/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="text-base font-bold text-[#0B2A5B]">
                    {path.title}
                  </h3>
                  <span className="text-[10.5px] font-mono px-2.5 py-0.5 rounded-full bg-[#168CFF]/10 text-[#0B2A5B] font-semibold whitespace-nowrap">
                    {path.badge}
                  </span>
                </div>

                <p className="text-xs sm:text-[13px] text-neutral-700 leading-relaxed mb-4">
                  {path.description}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-start gap-2 text-xs text-neutral-600 bg-neutral-50/60 p-2.5 rounded-xl">
                <span className="font-bold text-[#0B2A5B] shrink-0">Suitability:</span>
                <span className="leading-snug">{path.suitability}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. WHAT LEGALBHAROSA CAN AND CANNOT DO                  */}
      {/* ======================================================== */}
      <section className="w-full max-w-6xl mx-auto px-2 sm:px-4">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#168CFF]/20 text-xs font-mono uppercase tracking-widest text-[#123E8A] mb-2 shadow-2xs mx-auto">
            <Lock className="w-3.5 h-3.5 text-[#168CFF]" />
            <span>Honest Transparency</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0B2A5B] tracking-tight">
            What LegalBharosa Can & Cannot Do
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-lg mx-auto">
            Clear, honest expectations to ensure informed borrower decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          
          {/* WHAT WE CAN HELP WITH */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 text-[#0B2A5B] font-bold text-sm sm:text-base">
                <CheckCircle2 className="w-5 h-5 text-[#168CFF] shrink-0" />
                <span>What We CAN Help With:</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-neutral-700">
                {UNIVERSAL_CAN_AND_CANNOT.canHelpWith.map((item, idx) => (
                  <li key={`can-${idx}`} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* WHAT WE CANNOT GUARANTEE */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 text-neutral-800 font-bold text-sm sm:text-base">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>What We CANNOT Guarantee:</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-neutral-700">
                {UNIVERSAL_CAN_AND_CANNOT.cannotGuarantee.map((item, idx) => (
                  <li key={`cannot-${idx}`} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. DOCUMENTS / INFORMATION YOU MAY NEED                 */}
      {/* ======================================================== */}
      <section className="w-full max-w-6xl mx-auto px-2 sm:px-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B2A5B]/5 text-xs font-mono uppercase tracking-widest text-[#123E8A] mb-2">
                <FileText className="w-3.5 h-3.5 text-[#168CFF]" />
                <span>Preparation Checklist</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B2A5B] tracking-tight">
                Documents & Information You May Need
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-lg self-start sm:self-auto">
              Only provide what is currently accessible
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {eduData.documentsNeeded.map((doc, idx) => (
              <div 
                key={`doc-item-${idx}`}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/60 text-xs sm:text-[13px] text-neutral-800"
              >
                <FolderCheck className="w-4 h-4 text-[#168CFF] shrink-0 mt-0.5" />
                <span className="leading-snug">{doc}</span>
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs text-neutral-500 text-center">
            Do not worry if you do not have every document immediately available. Our intake team assists in identifying records needed during initial review.
          </p>

        </div>
      </section>

    </div>
  );
}
// Final submission update
