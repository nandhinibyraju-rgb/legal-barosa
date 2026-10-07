import React from 'react';
import { motion } from 'framer-motion';

/**
 * ServiceAnimatedIllustration:
 * Premium 2D vector editorial animated illustrations tailored for each of the 6 LegalBharosa services.
 * Inspired by Storyset-style quality, clean lines, and modern LegalTech aesthetic:
 * 
 * 1. harassment-protection: Person dealing with phone calls/messages, with glowing legal protection shield.
 * 2. loan-settlement: Person negotiating over loan/EMI documents with OTS approved golden seal & waiver agreement.
 * 3. legal-notice-review: Person reviewing a formal legal notice/summons with verified advocate & scales of justice.
 * 4. debt-management: Person organizing multiple scattered bills/EMIs into a unified structured repayment roadmap.
 * 5. npa-secured-loans: Protected property / house silhouette with SARFAESI notice stay order & advocate shield.
 * 6. credit-recovery: Person reviewing rising credit score meter/dial (780+) and holding an official No Dues Certificate.
 */

// ============================================================================
// 1. HARASSMENT PROTECTION ILLUSTRATION
// ============================================================================
function HarassmentProtectionIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Background Soft Glow */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 m-auto w-3/4 h-3/4 rounded-full bg-[radial-gradient(circle,rgba(22,140,255,0.25)_0%,rgba(6,45,120,0.1)_60%,transparent_80%)] blur-2xl pointer-events-none" 
      />

      <motion.svg
        viewBox="0 0 520 400"
        className="w-full h-full max-w-[500px] object-contain drop-shadow-[0_12px_32px_rgba(2,8,24,0.4)]"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#168CFF" />
            <stop offset="100%" stopColor="#0B429A" />
          </linearGradient>
          <linearGradient id="goldSealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Floor Shadow */}
        <ellipse cx="260" cy="365" rx="190" ry="18" fill="#041235" opacity="0.6" />

        {/* --- DESK & CHAIR --- */}
        <path d="M 120 330 L 380 330 L 390 355 L 110 355 Z" fill="#0D2654" />
        <rect x="135" y="355" width="12" height="20" rx="3" fill="#07193B" />
        <rect x="355" y="355" width="12" height="20" rx="3" fill="#07193B" />

        {/* --- CHARACTER (BORROWER) --- */}
        {/* Torso & Shirt */}
        <path d="M 210 270 Q 250 250 290 270 L 305 340 L 195 340 Z" fill="#1E3A8A" />
        <path d="M 235 260 L 265 260 L 260 300 L 240 300 Z" fill="#BAE6FD" />
        {/* Head & Hair */}
        <circle cx="250" cy="210" r="32" fill="#F8C4A5" />
        {/* Hair */}
        <path d="M 218 205 Q 250 165 282 205 Q 275 185 245 180 Q 225 185 218 205 Z" fill="#1E293B" />
        {/* Face features (calm relief) */}
        <path d="M 240 215 Q 245 218 250 215" stroke="#78350F" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 255 215 Q 260 218 265 215" stroke="#78350F" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 245 228 Q 250 234 256 228" stroke="#78350F" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Arm holding phone */}
        <path d="M 215 280 Q 185 300 200 330" stroke="#F8C4A5" strokeWidth="16" strokeLinecap="round" fill="none" />
        {/* Smartphone on desk */}
        <rect x="185" y="315" width="30" height="46" rx="5" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
        <circle cx="200" cy="355" r="3" fill="#64748B" />

        {/* --- HARASSMENT INCOMING SIGNALS (LEFT SIDE - INTERCEPTED) --- */}
        <motion.g
          animate={{ x: [-3, 3, -3], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Call Alert Badge 1 (Blocked: 14 Calls) */}
          <g transform="translate(60, 160)">
            <rect width="130" height="44" rx="12" fill="#0B1F45" stroke="#EF4444" strokeWidth="1.5" />
            <circle cx="24" cy="22" r="12" fill="#EF4444" opacity="0.2" />
            <path d="M 19 19 L 29 25 M 29 19 L 19 25" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
            <text x="44" y="20" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">BLOCKED CALL</text>
            <text x="44" y="33" fill="#EF4444" fontSize="9" fontWeight="600" fontFamily="sans-serif">14 Unknown Attempts</text>
          </g>

          {/* Call Alert Badge 2 (Intimidation Prevented) */}
          <g transform="translate(45, 230)">
            <rect width="145" height="40" rx="10" fill="#0B1F45" stroke="#F59E0B" strokeWidth="1.2" />
            <circle cx="22" cy="20" r="10" fill="#F59E0B" opacity="0.2" />
            <text x="18" y="24" fill="#F59E0B" fontSize="12" fontWeight="bold">⚠</text>
            <text x="40" y="18" fill="#FFFFFF" fontSize="9.5" fontWeight="bold" fontFamily="sans-serif">RBI Violation Notice</text>
            <text x="40" y="30" fill="#94A3B8" fontSize="8.5" fontFamily="sans-serif">Calls Restricted 7am-7pm</text>
          </g>
        </motion.g>

        {/* --- LARGE LEGALBHAROSA DEFENSE SHIELD (CENTER-RIGHT DEFLECTING) --- */}
        <motion.g
          animate={{ scale: [1, 1.03, 1], y: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Glowing Aura */}
          <path
            d="M 360 140 Q 420 120 460 150 Q 460 250 360 310 Q 260 250 260 150 Q 300 120 360 140 Z"
            fill="url(#shieldGrad)"
            opacity="0.25"
            filter="url(#cyanGlow)"
          />
          {/* Main Shield */}
          <path
            d="M 360 140 Q 415 125 450 150 Q 450 240 360 295 Q 270 240 270 150 Q 305 125 360 140 Z"
            fill="url(#shieldGrad)"
            stroke="#BAE6FD"
            strokeWidth="3.5"
          />
          {/* Inner Shield Inset */}
          <path
            d="M 360 155 Q 405 142 432 162 Q 432 232 360 278 Q 288 232 288 162 Q 315 142 360 155 Z"
            fill="#062356"
            opacity="0.8"
          />
          {/* Gold Legal Scale on Shield */}
          <g transform="translate(360, 205) scale(0.9)">
            <line x1="0" y1="-25" x2="0" y2="25" stroke="url(#goldSealGrad)" strokeWidth="3" />
            <line x1="-28" y1="-12" x2="28" y2="-12" stroke="url(#goldSealGrad)" strokeWidth="3" />
            {/* Left Pan */}
            <line x1="-24" y1="-12" x2="-32" y2="10" stroke="url(#goldSealGrad)" strokeWidth="1.5" />
            <line x1="-24" y1="-12" x2="-16" y2="10" stroke="url(#goldSealGrad)" strokeWidth="1.5" />
            <path d="M -36 10 Q -24 20 -12 10 Z" fill="url(#goldSealGrad)" />
            {/* Right Pan */}
            <line x1="24" y1="-12" x2="16" y2="10" stroke="url(#goldSealGrad)" strokeWidth="1.5" />
            <line x1="24" y1="-12" x2="32" y2="10" stroke="url(#goldSealGrad)" strokeWidth="1.5" />
            <path d="M 12 10 Q 24 20 36 10 Z" fill="url(#goldSealGrad)" />
          </g>

          {/* Floating Protection Ribbon */}
          <g transform="translate(305, 305)">
            <rect width="110" height="26" rx="13" fill="#0B2A5B" stroke="#38BDF8" strokeWidth="1.5" />
            <text x="55" y="17" fill="#38BDF8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              ✓ RBI Protected
            </text>
          </g>
        </motion.g>

        {/* Ambient Floating Sparkles */}
        <motion.circle
          cx="440"
          cy="120"
          r="3"
          fill="#38BDF8"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.circle
          cx="160"
          cy="130"
          r="2.5"
          fill="#F59E0B"
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.7, 1.2, 0.7] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
      </motion.svg>
    </div>
  );
}

// ============================================================================
// 2. LOAN SETTLEMENT ILLUSTRATION
// ============================================================================
function LoanSettlementIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div 
        aria-hidden="true" 
        className="absolute inset-0 m-auto w-3/4 h-3/4 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.18)_0%,rgba(14,68,168,0.15)_50%,transparent_80%)] blur-2xl pointer-events-none" 
      />

      <motion.svg
        viewBox="0 0 520 400"
        className="w-full h-full max-w-[500px] object-contain drop-shadow-[0_12px_32px_rgba(2,8,24,0.4)]"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <defs>
          <linearGradient id="docGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="settleGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
        </defs>

        <ellipse cx="260" cy="365" rx="190" ry="18" fill="#041235" opacity="0.6" />

        {/* Desk */}
        <path d="M 100 325 L 420 325 L 430 355 L 90 355 Z" fill="#0E2756" />

        {/* CHARACTER (FINANCIAL NEGOTIATOR / ADVOCATE) */}
        <circle cx="190" cy="195" r="30" fill="#F8C4A5" />
        <path d="M 162 190 Q 190 150 218 190 Q 212 170 188 165 Q 170 170 162 190 Z" fill="#0F172A" />
        {/* Suit & Tie */}
        <path d="M 150 250 Q 190 235 230 250 L 245 325 L 135 325 Z" fill="#0B2A5B" />
        <polygon points="190,245 185,290 190,305 195,290" fill="#F59E0B" />
        <path d="M 140 260 Q 180 290 220 320" stroke="#F8C4A5" strokeWidth="14" strokeLinecap="round" fill="none" />

        {/* LARGE SETTLEMENT AGREEMENT (OTS DOCUMENT) */}
        <motion.g
          animate={{ rotate: [-0.5, 0.5, -0.5], y: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Main Document Paper */}
          <rect x="230" y="130" width="165" height="205" rx="8" fill="url(#docGrad)" stroke="#168CFF" strokeWidth="2.5" />
          
          {/* Document Header Bar */}
          <rect x="245" y="145" width="135" height="18" rx="4" fill="#0B2A5B" />
          <text x="312" y="158" fill="#FDE68A" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            ONE-TIME SETTLEMENT
          </text>

          {/* Agreement Lines */}
          <rect x="245" y="175" width="90" height="6" rx="3" fill="#94A3B8" />
          <rect x="245" y="188" width="125" height="5" rx="2" fill="#CBD5E1" />
          <rect x="245" y="198" width="115" height="5" rx="2" fill="#CBD5E1" />
          <rect x="245" y="208" width="130" height="5" rx="2" fill="#CBD5E1" />

          {/* Debt Reduction Highlight Pill */}
          <rect x="245" y="225" width="135" height="32" rx="6" fill="#0D3B7A" stroke="#38BDF8" strokeWidth="1" />
          <text x="255" y="240" fill="#93C5FD" fontSize="8" fontFamily="sans-serif">Waiver Granted:</text>
          <text x="255" y="252" fill="#FDE68A" fontSize="11" fontWeight="bold" fontFamily="sans-serif">UP TO 50% SAVINGS</text>

          {/* Signature Line */}
          <line x1="245" y1="285" x2="300" y2="285" stroke="#64748B" strokeWidth="1.5" />
          <path d="M 248 280 Q 260 270 275 282 T 295 280" fill="none" stroke="#168CFF" strokeWidth="2" />
          <text x="245" y="296" fill="#64748B" fontSize="8" fontFamily="sans-serif">Authorized Advocate</text>

          {/* Golden Approved Wax Seal */}
          <g transform="translate(355, 290)">
            <circle cx="0" cy="0" r="22" fill="url(#settleGold)" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="17" fill="none" stroke="#78350F" strokeWidth="1" strokeDasharray="2 2" />
            <text x="0" y="-3" fill="#78350F" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">OTS</text>
            <text x="0" y="6" fill="#78350F" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">SETTLED</text>
            <text x="0" y="13" fill="#78350F" fontSize="8" textAnchor="middle">★</text>
          </g>
        </motion.g>

        {/* FLOATING SUCCESS BADGE (TOP RIGHT) */}
        <motion.g
          transform="translate(380, 80)"
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <rect width="115" height="38" rx="10" fill="#092758" stroke="#10B981" strokeWidth="1.5" />
          <circle cx="20" cy="19" r="10" fill="#10B981" opacity="0.25" />
          <text x="16" y="23" fill="#10B981" fontSize="12" fontWeight="bold">✓</text>
          <text x="36" y="17" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="sans-serif">NO DUES CLEAR</text>
          <text x="36" y="29" fill="#34D399" fontSize="8" fontFamily="sans-serif">Formal Legal Closure</text>
        </motion.g>
      </motion.svg>
    </div>
  );
}

// ============================================================================
// 3. LEGAL NOTICE REVIEW ILLUSTRATION
// ============================================================================
function LegalNoticeReviewIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div 
        aria-hidden="true" 
        className="absolute inset-0 m-auto w-3/4 h-3/4 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.22)_0%,rgba(10,50,140,0.12)_55%,transparent_80%)] blur-2xl pointer-events-none" 
      />

      <motion.svg
        viewBox="0 0 520 400"
        className="w-full h-full max-w-[500px] object-contain drop-shadow-[0_12px_32px_rgba(2,8,24,0.4)]"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse cx="260" cy="365" rx="190" ry="18" fill="#041235" opacity="0.6" />

        {/* Desk with Books */}
        <path d="M 110 325 L 410 325 L 420 355 L 100 355 Z" fill="#0C2450" />
        <rect x="360" y="300" width="40" height="25" rx="3" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="1" />
        <rect x="365" y="290" width="35" height="10" rx="2" fill="#D97706" />

        {/* GAVEL (SYMBOL OF LEGAL AUTHORITY) */}
        <g transform="translate(130, 310) rotate(-15)">
          <rect x="0" y="0" width="18" height="30" rx="3" fill="#92400E" stroke="#FDE68A" strokeWidth="1" />
          <rect x="-8" y="10" width="55" height="7" rx="3" fill="#D97706" />
        </g>

        {/* ADVOCATE CHARACTER EXAMINING NOTICE */}
        <circle cx="210" cy="195" r="30" fill="#F8C4A5" />
        <path d="M 185 190 Q 210 155 235 190 Q 230 170 210 165 Q 192 170 185 190 Z" fill="#1E293B" />
        {/* Advocate Robe & Collar Bands */}
        <path d="M 170 250 Q 210 235 250 250 L 265 325 L 155 325 Z" fill="#0B1D3D" />
        <path d="M 203 245 L 207 275 L 213 275 L 217 245 Z" fill="#FFFFFF" />
        <path d="M 160 260 Q 200 290 240 315" stroke="#F8C4A5" strokeWidth="14" strokeLinecap="round" fill="none" />

        {/* COURT NOTICE DOCUMENT WITH MAGNIFYING GLASS */}
        <motion.g
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Official Notice Paper */}
          <rect x="250" y="125" width="165" height="205" rx="8" fill="#F8FAFC" stroke="#DC2626" strokeWidth="2" />
          {/* Urgent Red Header */}
          <rect x="265" y="140" width="135" height="18" rx="4" fill="#DC2626" />
          <text x="332" y="153" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            LEGAL NOTICE / SUMMONS
          </text>

          {/* Section 138 / DRT Tag */}
          <rect x="265" y="168" width="70" height="14" rx="3" fill="#FEE2E2" />
          <text x="300" y="178" fill="#B91C1C" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            SEC. 138 / SARFAESI
          </text>

          {/* Legal Text Lines */}
          <rect x="265" y="190" width="125" height="4" rx="2" fill="#94A3B8" />
          <rect x="265" y="200" width="135" height="4" rx="2" fill="#CBD5E1" />
          <rect x="265" y="210" width="115" height="4" rx="2" fill="#CBD5E1" />
          <rect x="265" y="220" width="125" height="4" rx="2" fill="#CBD5E1" />

          {/* Advocate Defense Reply Box */}
          <rect x="265" y="235" width="135" height="38" rx="6" fill="#0B2A5B" stroke="#38BDF8" strokeWidth="1.2" />
          <text x="275" y="250" fill="#38BDF8" fontSize="8" fontWeight="bold" fontFamily="sans-serif">✓ STATUTORY REPLY DRAFTED</text>
          <text x="275" y="263" fill="#E2E8F0" fontSize="7.5" fontFamily="sans-serif">Verified High Court Advocates</text>

          {/* Bar Council Stamp */}
          <g transform="translate(370, 295)">
            <circle cx="0" cy="0" r="18" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="1.5" />
            <text x="0" y="-2" fill="#BAE6FD" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">LEGAL</text>
            <text x="0" y="6" fill="#BAE6FD" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">REPLIED</text>
          </g>

          {/* Magnifying Glass Inspection */}
          <g transform="translate(235, 185) rotate(-25)">
            <circle cx="0" cy="0" r="22" fill="#38BDF8" fillOpacity="0.2" stroke="#38BDF8" strokeWidth="3" />
            <line x1="16" y1="16" x2="38" y2="38" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" />
            <line x1="16" y1="16" x2="38" y2="38" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          </g>
        </motion.g>

        {/* DEADLINE SHIELD BADGE */}
        <motion.g
          transform="translate(70, 110)"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <rect width="135" height="38" rx="10" fill="#071E42" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="20" cy="19" r="10" fill="#38BDF8" opacity="0.2" />
          <text x="15" y="24" fill="#38BDF8" fontSize="13">⚖</text>
          <text x="38" y="16" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" fontFamily="sans-serif">DEADLINE SAFEGUARD</text>
          <text x="38" y="28" fill="#93C5FD" fontSize="7.5" fontFamily="sans-serif">Statutory Time Defense</text>
        </motion.g>
      </motion.svg>
    </div>
  );
}

// ============================================================================
// 4. DEBT MANAGEMENT ILLUSTRATION
// ============================================================================
function DebtManagementIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div 
        aria-hidden="true" 
        className="absolute inset-0 m-auto w-3/4 h-3/4 rounded-full bg-[radial-gradient(circle,rgba(22,140,255,0.22)_0%,rgba(16,185,129,0.12)_50%,transparent_80%)] blur-2xl pointer-events-none" 
      />

      <motion.svg
        viewBox="0 0 520 400"
        className="w-full h-full max-w-[500px] object-contain drop-shadow-[0_12px_32px_rgba(2,8,24,0.4)]"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse cx="260" cy="365" rx="190" ry="18" fill="#041235" opacity="0.6" />

        {/* Desk */}
        <path d="M 90 330 L 430 330 L 440 358 L 80 358 Z" fill="#0B2044" />

        {/* CHARACTER (BORROWER ORGANIZING FINANCES) */}
        <circle cx="260" cy="180" r="30" fill="#F8C4A5" />
        <path d="M 232 175 Q 260 140 288 175 Q 282 155 258 150 Q 240 155 232 175 Z" fill="#1E293B" />
        {/* Torso */}
        <path d="M 220 235 Q 260 220 300 235 L 315 330 L 205 330 Z" fill="#0284C7" />
        {/* Arms outstretched in organizing gesture */}
        <path d="M 215 250 Q 180 270 160 300" stroke="#F8C4A5" strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M 305 250 Q 340 270 360 300" stroke="#F8C4A5" strokeWidth="12" strokeLinecap="round" fill="none" />

        {/* SCATTERED OVERDUE BILLS (LEFT SIDE - BEFORE) */}
        <motion.g
          animate={{ x: [-3, 3, -3], rotate: [-1, 1, -1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Credit Card Bill 1 */}
          <g transform="translate(60, 200) rotate(-12)">
            <rect width="90" height="55" rx="6" fill="#1E293B" stroke="#EF4444" strokeWidth="1.5" />
            <rect x="10" y="10" width="30" height="6" rx="2" fill="#EF4444" />
            <text x="10" y="32" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">CARD DUE: ₹45K</text>
            <text x="10" y="44" fill="#F87171" fontSize="7" fontFamily="sans-serif">Overdue Interest</text>
          </g>

          {/* Personal Loan EMI Bill 2 */}
          <g transform="translate(85, 260) rotate(8)">
            <rect width="95" height="50" rx="6" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
            <rect x="10" y="10" width="35" height="5" rx="2" fill="#F59E0B" />
            <text x="10" y="28" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">LOAN EMI #3</text>
            <text x="10" y="40" fill="#FBBF24" fontSize="7" fontFamily="sans-serif">Compounding</text>
          </g>
        </motion.g>

        {/* TRANSFORMATION ARROW (CHANNELS CHAOS INTO ORDER) */}
        <g transform="translate(195, 230)">
          <path d="M 0 0 L 25 0 M 18 -6 L 25 0 L 18 6" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>

        {/* UNIFIED STRUCTURED REPAYMENT ROADMAP (RIGHT SIDE - AFTER) */}
        <motion.g
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Main Structured Portfolio Binder */}
          <rect x="330" y="140" width="145" height="185" rx="10" fill="#0B2A5B" stroke="#10B981" strokeWidth="2.5" />
          
          {/* Header Tag */}
          <rect x="345" y="155" width="115" height="20" rx="5" fill="#10B981" />
          <text x="402" y="169" fill="#064E3B" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            ✓ 1 SINGLE MONTHLY EMI
          </text>

          {/* Progress / Reduction Meter */}
          <rect x="345" y="190" width="115" height="8" rx="4" fill="#07193C" />
          <rect x="345" y="190" width="75" height="8" rx="4" fill="#38BDF8" />
          <text x="345" y="215" fill="#93C5FD" fontSize="8" fontFamily="sans-serif">Interest Capped:</text>
          <text x="345" y="228" fill="#FDE68A" fontSize="10" fontWeight="bold" fontFamily="sans-serif">40% DEBT RELIEF</text>

          {/* Orderly Schedule Checkmarks */}
          <g transform="translate(345, 245)">
            <circle cx="6" cy="6" r="6" fill="#10B981" />
            <text x="6" y="9" fill="#FFFFFF" fontSize="8" textAnchor="middle">✓</text>
            <text x="18" y="9" fill="#E2E8F0" fontSize="8" fontFamily="sans-serif">Zero Harassment</text>
          </g>
          <g transform="translate(345, 268)">
            <circle cx="6" cy="6" r="6" fill="#10B981" />
            <text x="6" y="9" fill="#FFFFFF" fontSize="8" textAnchor="middle">✓</text>
            <text x="18" y="9" fill="#E2E8F0" fontSize="8" fontFamily="sans-serif">Affordable Plan</text>
          </g>
          <g transform="translate(345, 291)">
            <circle cx="6" cy="6" r="6" fill="#10B981" />
            <text x="6" y="9" fill="#FFFFFF" fontSize="8" textAnchor="middle">✓</text>
            <text x="18" y="9" fill="#E2E8F0" fontSize="8" fontFamily="sans-serif">Formal Legal Shield</text>
          </g>
        </motion.g>

        {/* TOP STATUS BADGE */}
        <motion.g
          transform="translate(195, 80)"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 4.5, repeat: Infinity }}
        >
          <rect width="130" height="34" rx="17" fill="#05204C" stroke="#38BDF8" strokeWidth="1.5" />
          <text x="65" y="21" fill="#38BDF8" fontSize="9.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            ★ RESTRUCTURED PLAN
          </text>
        </motion.g>
      </motion.svg>
    </div>
  );
}

// ============================================================================
// 5. NPA & SECURED LOANS ILLUSTRATION
// ============================================================================
function NpaSecuredLoansIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div 
        aria-hidden="true" 
        className="absolute inset-0 m-auto w-3/4 h-3/4 rounded-full bg-[radial-gradient(circle,rgba(22,140,255,0.25)_0%,rgba(11,42,91,0.15)_60%,transparent_80%)] blur-2xl pointer-events-none" 
      />

      <motion.svg
        viewBox="0 0 520 400"
        className="w-full h-full max-w-[500px] object-contain drop-shadow-[0_12px_32px_rgba(2,8,24,0.4)]"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <defs>
          <linearGradient id="houseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#0B1A3D" />
          </linearGradient>
          <linearGradient id="stayShield" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>

        <ellipse cx="260" cy="365" rx="190" ry="18" fill="#041235" opacity="0.6" />

        {/* SECURED PROPERTY (CLEAN MODERN HOUSE SILHOUETTE) */}
        <g transform="translate(180, 160)">
          {/* Main House Wall */}
          <rect x="20" y="70" width="130" height="95" rx="4" fill="url(#houseGrad)" stroke="#168CFF" strokeWidth="2" />
          {/* Roof */}
          <polygon points="10,70 85,15 160,70" fill="#0A255C" stroke="#38BDF8" strokeWidth="2.5" />
          {/* Windows (Warm Glow) */}
          <rect x="40" y="90" width="30" height="30" rx="3" fill="#FDE68A" opacity="0.85" />
          <line x1="55" y1="90" x2="55" y2="120" stroke="#78350F" strokeWidth="1.5" />
          <line x1="40" y1="105" x2="70" y2="105" stroke="#78350F" strokeWidth="1.5" />
          {/* Door */}
          <rect x="95" y="110" width="28" height="55" rx="3" fill="#071B3E" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="118" cy="138" r="2.5" fill="#F59E0B" />
        </g>

        {/* PROTECTIVE ADVOCATE LEGAL DOME ENCLOSING THE HOME */}
        <motion.path
          d="M 160 330 C 160 140 370 140 370 330"
          fill="none"
          stroke="url(#stayShield)"
          strokeWidth="3.5"
          strokeDasharray="6 6"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* SARFAESI SECTION 13(2) STAY ORDER DOCUMENT (LEFT) */}
        <motion.g
          transform="translate(45, 170)"
          animate={{ y: [-4, 4, -4], rotate: [-1, 1, -1] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <rect width="130" height="145" rx="8" fill="#0C2552" stroke="#F59E0B" strokeWidth="1.8" />
          <rect x="12" y="14" width="106" height="16" rx="3" fill="#F59E0B" />
          <text x="65" y="26" fill="#78350F" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            SARFAESI STAY ORDER
          </text>
          <rect x="12" y="42" width="70" height="4" rx="2" fill="#93C5FD" />
          <rect x="12" y="52" width="100" height="4" rx="2" fill="#64748B" />
          <rect x="12" y="62" width="90" height="4" rx="2" fill="#64748B" />

          {/* DRT Interim Protection Stamp */}
          <g transform="translate(65, 105)">
            <rect x="-48" y="-12" width="96" height="24" rx="4" fill="#064E3B" stroke="#10B981" strokeWidth="1.2" />
            <text x="0" y="4" fill="#34D399" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              ✓ AUCTION STAYED
            </text>
          </g>
        </motion.g>

        {/* DEFENSE SHIELD WITH ADVOCATE LOCK (RIGHT) */}
        <motion.g
          transform="translate(365, 180)"
          animate={{ scale: [1, 1.04, 1], y: [0, -4, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M 50 10 Q 90 0 100 20 Q 100 85 50 115 Q 0 85 0 20 Q 10 0 50 10 Z"
            fill="#062356"
            stroke="#38BDF8"
            strokeWidth="3"
          />
          {/* Lock Icon */}
          <rect x="36" y="55" width="28" height="24" rx="4" fill="#F59E0B" />
          <path d="M 42 55 L 42 45 C 42 35 58 35 58 45 L 58 55" fill="none" stroke="#FDE68A" strokeWidth="3" />
          <circle cx="50" cy="65" r="3" fill="#78350F" />
        </motion.g>

        {/* TOP BADGE */}
        <motion.g
          transform="translate(180, 85)"
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <rect width="165" height="34" rx="17" fill="#0A2248" stroke="#38BDF8" strokeWidth="1.5" />
          <text x="82" y="21" fill="#BAE6FD" fontSize="9.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            🛡 PROPERTY REPOSSESSION SHIELD
          </text>
        </motion.g>
      </motion.svg>
    </div>
  );
}

// ============================================================================
// 6. CREDIT RECOVERY ILLUSTRATION
// ============================================================================
function CreditRecoveryIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div 
        aria-hidden="true" 
        className="absolute inset-0 m-auto w-3/4 h-3/4 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.22)_0%,rgba(14,68,168,0.18)_50%,transparent_80%)] blur-2xl pointer-events-none" 
      />

      <motion.svg
        viewBox="0 0 520 400"
        className="w-full h-full max-w-[500px] object-contain drop-shadow-[0_12px_32px_rgba(2,8,24,0.4)]"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse cx="260" cy="365" rx="190" ry="18" fill="#041235" opacity="0.6" />

        {/* Desk */}
        <path d="M 100 330 L 420 330 L 430 358 L 90 358 Z" fill="#0A2046" />

        {/* CHARACTER REVIEWING REPORT */}
        <circle cx="190" cy="195" r="30" fill="#F8C4A5" />
        <path d="M 165 190 Q 190 155 215 190 Q 210 170 190 165 Q 172 170 165 190 Z" fill="#1E293B" />
        <path d="M 150 250 Q 190 235 230 250 L 245 330 L 135 330 Z" fill="#0369A1" />
        {/* Arm pointing toward score dial */}
        <path d="M 210 265 Q 260 270 300 240" stroke="#F8C4A5" strokeWidth="13" strokeLinecap="round" fill="none" />

        {/* LARGE CREDIT SCORE DIAL (780+ EXCELLENT) */}
        <motion.g
          transform="translate(350, 200)"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Dial Arc Background */}
          <path
            d="M -70 0 A 70 70 0 0 1 70 0"
            fill="none"
            stroke="#1E293B"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Gradient Active Meter Arc (Red -> Yellow -> Green) */}
          <path
            d="M -70 0 A 70 70 0 0 1 50 -48"
            fill="none"
            stroke="#10B981"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Needle oscillating around 780 */}
          <motion.line
            x1="0"
            y1="0"
            x2="40"
            y2="-42"
            stroke="#FDE68A"
            strokeWidth="3.5"
            strokeLinecap="round"
            animate={{ rotate: [-2, 3, -2] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '0px 0px' }}
          />
          <circle cx="0" cy="0" r="8" fill="#F59E0B" />

          {/* Score Numerical Reading */}
          <text x="0" y="24" fill="#FFFFFF" fontSize="22" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            785
          </text>
          <text x="0" y="38" fill="#34D399" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            EXCELLENT RATING
          </text>
        </motion.g>

        {/* OFFICIAL NO DUES CERTIFICATE (NDC) */}
        <motion.g
          transform="translate(50, 180)"
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <rect width="125" height="135" rx="8" fill="#F8FAFC" stroke="#10B981" strokeWidth="2" />
          <rect x="12" y="14" width="101" height="15" rx="3" fill="#064E3B" />
          <text x="62" y="25" fill="#34D399" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            NO DUES CERTIFICATE
          </text>
          <rect x="12" y="40" width="85" height="4" rx="2" fill="#94A3B8" />
          <rect x="12" y="50" width="95" height="4" rx="2" fill="#CBD5E1" />
          <rect x="12" y="60" width="75" height="4" rx="2" fill="#CBD5E1" />

          {/* Bank Clearance Golden Stamp */}
          <g transform="translate(62, 98)">
            <circle cx="0" cy="0" r="18" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
            <text x="0" y="-3" fill="#B45309" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">CIBIL</text>
            <text x="0" y="6" fill="#B45309" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">CLEARED</text>
          </g>
        </motion.g>

        {/* TOP STATUS BADGE */}
        <motion.g
          transform="translate(180, 85)"
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <rect width="165" height="34" rx="17" fill="#072448" stroke="#10B981" strokeWidth="1.5" />
          <text x="82" y="21" fill="#34D399" fontSize="9.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            📈 CREDIT PROFILE RESTORED
          </text>
        </motion.g>
      </motion.svg>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT EXPORT
// ============================================================================
export default function ServiceAnimatedIllustration({ 
  serviceSlug = 'harassment-protection',
  className = ''
}) {
  const renderIllustration = () => {
    switch (serviceSlug) {
      case 'harassment-protection':
      case 'harassment':
        return <HarassmentProtectionIllustration />;
      case 'loan-settlement':
      case 'settlement':
        return <LoanSettlementIllustration />;
      case 'legal-notice-review':
      case 'legal':
        return <LegalNoticeReviewIllustration />;
      case 'debt-management':
      case 'debt':
        return <DebtManagementIllustration />;
      case 'npa-secured-loans':
      case 'npa':
        return <NpaSecuredLoansIllustration />;
      case 'credit-recovery':
      case 'credit':
        return <CreditRecoveryIllustration />;
      default:
        return <HarassmentProtectionIllustration />;
    }
  };

  return (
    <div className={`relative w-full aspect-[4/3] max-w-[480px] sm:max-w-[520px] lg:max-w-[560px] mx-auto select-none flex items-center justify-center ${className}`}>
      {/* Organic dark-blue gradient glow strictly contained behind the illustration */}
      <div 
        aria-hidden="true" 
        className="absolute inset-[5%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(22,140,255,0.22)_0%,rgba(6,45,120,0.12)_55%,transparent_75%)] blur-2xl pointer-events-none -z-10" 
      />
      {renderIllustration()}
    </div>
  );
}
// Final submission update
