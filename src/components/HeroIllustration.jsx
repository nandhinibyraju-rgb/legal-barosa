import React, { useState, useEffect } from 'react';

/**
 * HeroIllustration:
 * Animated crossfading hero illustration transitioning between Problem State (stress-illustration.png)
 * and Solution State (legalbharosa-relief.png).
 * 
 * Features:
 * 1. Placement: Sits in Hero section with small gap (~16-20px) directly above headline.
 * 2. Size: Enlarged to ~500-600px desktop, ~300-340px mobile, maintaining 16:9 ratio.
 * 3. 8-second continuous crossfade loop (Hold A 3s, crossfade 1.5s, Hold B 3s, crossfade 1.5s).
 * 4. Whole-image organic floating motion (translateY 0px to -10px, rotate -1deg to 1deg, 5s cycle).
 * 5. Independent icon/bubble-level floating motions & pulse glows for BOTH states:
 *    - Image A: 5 speech bubbles (EMI Pressure, Recovery Harassment, Insurance Claims, Property Disputes, Legal Complications) with red alert pulses.
 *    - Image B: 4 phone mockup rows (EMI Relief, Claim Support, Property Support, Legal Support) with badge glows.
 * 6. Background blend: Fully dissolved edges with strong radial fade mask (ellipse 55% 55% at center, black 30%, transparent 75%).
 * 7. Contained glow: Soft radial glow sized only ~1.2-1.3x the illustration, low opacity, no wash over hero or navigation.
 * 8. Zero layout shifts, GPU-accelerated opacity/transform animations only.
 */
export default function HeroIllustration({ className = '' }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const urls = [
      '/stress-illustration.png',
      '/legalbharosa-relief.png',
      '/bubble-1-emi.png',
      '/bubble-2-recovery.png',
      '/bubble-3-insurance.png',
      '/bubble-4-property.png',
      '/bubble-5-legal.png',
      '/row-1-emi.png',
      '/row-2-claim.png',
      '/row-3-property.png',
      '/row-4-legal.png',
    ];
    let loadedCount = 0;
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedCount++;
        if (loadedCount >= 2) {
          setIsReady(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount >= 2) {
          setIsReady(true);
        }
      };
    });
  }, []);

  return (
    <div
      className={`relative mx-auto flex items-center justify-center w-[200px] sm:w-[260px] md:w-[300px] lg:w-[330px] xl:w-[350px] max-w-full aspect-video select-none ${className}`}
      aria-label="Illustration showing transition from legal stress to LegalBharosa relief"
    >
      {/* ======================================================== */}
      {/* 1. POSITION ABSOLUTE CONTAINED GLOW (Zero layout impact, subtle vibrant blue) */}
      {/* ======================================================== */}
      <div
        aria-hidden="true"
        className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_center,rgba(18,185,242,0.10)_0%,rgba(7,139,232,0.03)_50%,transparent_75%)] blur-[25px] sm:blur-[35px] pointer-events-none z-0"
      />

      {/* ======================================================== */}
      {/* 2. FLOATING & CROSSFADING CONTAINER */}
      {/* ======================================================== */}
      <div
        className={`relative z-[1] w-full h-full animate-illustration-float transition-opacity duration-700 ease-out ${
          isReady ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* ======================================================== */}
        {/* IMAGE A: Problem State (Stress, loan pressure, notices) */}
        {/* ======================================================== */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none mask-dissolved-edges animate-crossfade-a">
          {/* Base Character and Papers */}
          <img
            src="/stress-illustration.png"
            alt="EMI stress, loan pressure, recovery harassment and legal complications"
            loading="eager"
            decoding="async"
            className="w-full h-full object-contain pointer-events-none select-none"
          />

          {/* ======================================================== */}
          {/* ICON-LEVEL ANIMATED SPEECH BUBBLES (Image A) */}
          {/* ======================================================== */}
          {/* Bubble 1: EMI / Loan Pressure */}
          <div
            style={{
              left: '9.28%',
              top: '6.08%',
              width: '15.62%',
              height: '20.83%',
            }}
            className="absolute pointer-events-none animate-bubble-1"
          >
            <img
              src="/bubble-1-emi.png"
              alt="EMI / Loan Pressure"
              className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
            />
            {/* Red Alert Notification Dot Pulse */}
            <div className="absolute right-[5%] top-[2%] w-[20%] h-[24%] rounded-full animate-red-dot-glow pointer-events-none" />
          </div>

          {/* Bubble 2: Recovery Agent Harassment */}
          <div
            style={{
              left: '29.30%',
              top: '6.08%',
              width: '19.04%',
              height: '14.76%',
            }}
            className="absolute pointer-events-none animate-bubble-2"
          >
            <img
              src="/bubble-2-recovery.png"
              alt="Recovery Agent Harassment"
              className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
            />
            {/* Red Alert Notification Dot Pulse */}
            <div className="absolute right-[4%] top-[4%] w-[18%] h-[36%] rounded-full animate-red-dot-glow pointer-events-none" />
          </div>

          {/* Bubble 3: Insurance Claim Issues */}
          <div
            style={{
              left: '45.90%',
              top: '17.36%',
              width: '17.09%',
              height: '15.62%',
            }}
            className="absolute pointer-events-none animate-bubble-3"
          >
            <img
              src="/bubble-3-insurance.png"
              alt="Insurance Claim Issues"
              className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
            />
            {/* Red Alert Notification Dot Pulse */}
            <div className="absolute right-[4%] top-[4%] w-[18%] h-[36%] rounded-full animate-red-dot-glow pointer-events-none" />
          </div>

          {/* Bubble 4: Property / RERA Disputes */}
          <div
            style={{
              left: '7.32%',
              top: '28.65%',
              width: '17.58%',
              height: '16.49%',
            }}
            className="absolute pointer-events-none animate-bubble-4"
          >
            <img
              src="/bubble-4-property.png"
              alt="Property / RERA Disputes"
              className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
            />
            {/* Red Alert Notification Dot Pulse */}
            <div className="absolute right-[4%] top-[4%] w-[18%] h-[36%] rounded-full animate-red-dot-glow pointer-events-none" />
          </div>

          {/* Bubble 5: Legal Complications */}
          <div
            style={{
              left: '47.36%',
              top: '33.85%',
              width: '17.09%',
              height: '15.62%',
            }}
            className="absolute pointer-events-none animate-bubble-5"
          >
            <img
              src="/bubble-5-legal.png"
              alt="Legal Complications"
              className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
            />
            {/* Red Alert Notification Dot Pulse */}
            <div className="absolute right-[4%] top-[4%] w-[18%] h-[36%] rounded-full animate-red-dot-glow pointer-events-none" />
          </div>
        </div>

        {/* ======================================================== */}
        {/* IMAGE B: Solution State (LegalBharosa relief + phone) */}
        {/* ======================================================== */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none mask-dissolved-edges animate-crossfade-b">
          {/* Base relief illustration */}
          <img
            src="/legalbharosa-relief.png"
            alt="LegalBharosa relief - comprehensive legal support, dispute resolution and peace of mind"
            loading="eager"
            decoding="async"
            className="w-full h-full object-contain pointer-events-none select-none"
          />

          {/* ======================================================== */}
          {/* ICON-LEVEL ANIMATED ROWS ON PHONE MOCKUP (Image B) */}
          {/* ======================================================== */}
          {/* Row 1: EMI Relief */}
          <div
            style={{
              top: '36.26%',
              left: '61.56%',
              width: '27.02%',
              height: '10.13%',
            }}
            className="absolute pointer-events-none animate-row-1"
          >
            <img
              src="/row-1-emi.png"
              alt="EMI Relief"
              className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_3px_6px_rgba(0,0,0,0.25)]"
            />
            {/* Circular badge soft pulse glow */}
            <div className="absolute left-[3%] top-[12%] w-[20%] h-[76%] rounded-full animate-badge-glow pointer-events-none" />
          </div>

          {/* Row 2: Claim Support */}
          <div
            style={{
              top: '48.00%',
              left: '61.56%',
              width: '27.02%',
              height: '10.13%',
            }}
            className="absolute pointer-events-none animate-row-2"
          >
            <img
              src="/row-2-claim.png"
              alt="Claim Support"
              className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_3px_6px_rgba(0,0,0,0.25)]"
            />
            {/* Circular badge soft pulse glow */}
            <div className="absolute left-[3%] top-[12%] w-[20%] h-[76%] rounded-full animate-badge-glow pointer-events-none" />
          </div>

          {/* Row 3: Property Support */}
          <div
            style={{
              top: '60.00%',
              left: '61.56%',
              width: '27.02%',
              height: '10.13%',
            }}
            className="absolute pointer-events-none animate-row-3"
          >
            <img
              src="/row-3-property.png"
              alt="Property Support"
              className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_3px_6px_rgba(0,0,0,0.25)]"
            />
            {/* Circular badge soft pulse glow */}
            <div className="absolute left-[3%] top-[12%] w-[20%] h-[76%] rounded-full animate-badge-glow pointer-events-none" />
          </div>

          {/* Row 4: Legal Support */}
          <div
            style={{
              top: '72.00%',
              left: '61.56%',
              width: '27.02%',
              height: '10.13%',
            }}
            className="absolute pointer-events-none animate-row-4"
          >
            <img
              src="/row-4-legal.png"
              alt="Legal Support"
              className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_3px_6px_rgba(0,0,0,0.25)]"
            />
            {/* Circular badge soft pulse glow */}
            <div className="absolute left-[3%] top-[12%] w-[20%] h-[76%] rounded-full animate-badge-glow pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
// Final submission update
