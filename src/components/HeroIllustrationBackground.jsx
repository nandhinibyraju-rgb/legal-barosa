import React from 'react';
import { motion } from 'framer-motion';

/**
 * HeroIllustrationBackground:
 * Premium atmospheric background specifically behind the central Home hero illustration.
 * Faithfully recreating the blue-and-white atmospheric visual style from the reference image:
 * - Predominantly WHITE page background with smooth organic fade
 * - Large, soft, deep sapphire/cobalt-blue atmospheric glow concentrated behind the illustration & floating badges
 * - Smooth irregular/flowing outer transition melting seamlessly into white
 * - Elegant flowing curved lines/wave paths (cyan & electric blue)
 * - Subtle glowing GOLD accent line with a delicate diamond starburst glint
 * - Luminous cyan floor/stage glow grounding the character & cabinet
 * - Sparse, soft optical cyan bokeh light points
 * - Continuous, ultra-smooth, slow breathing and traveling animations
 * - 100% GPU-accelerated compositing for 60fps silky smooth performance
 * - Parallax depth support via glowX and glowY
 */

// 4-point Diamond Starburst Glint SVG for the gold ribbon highlight
function GoldGlint({ className = '', style = {} }) {
  return (
    <svg 
      viewBox="0 0 40 40" 
      fill="none" 
      className={className} 
      style={style}
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="7" fill="#FEF08A" opacity="0.9" />
      <circle cx="20" cy="20" r="14" fill="#F59E0B" opacity="0.4" />
      <path 
        d="M20 2 L22.5 17.5 L38 20 L22.5 22.5 L20 38 L17.5 22.5 L2 20 L17.5 17.5 Z" 
        fill="#FFFFFF" 
        opacity="0.95"
      />
      <path 
        d="M20 5 L21.8 18.2 L35 20 L21.8 21.8 L20 35 L18.2 21.8 L5 20 L18.2 18.2 Z" 
        fill="#FEF08A" 
        opacity="0.85"
      />
    </svg>
  );
}

export default function HeroIllustrationBackground({ 
  glowX, 
  glowY, 
  offsetClass = '' 
}) {
  return (
    <motion.div
      aria-hidden="true"
      style={{
        x: glowX,
        y: glowY,
      }}
      className={`absolute inset-0 m-auto flex items-center justify-center pointer-events-none select-none overflow-visible z-0 ${offsetClass}`}
    >
      {/* 
        Main container spanning wide horizontally across the illustration and badges.
        Outer edges blend naturally to transparent into pure white without harsh box borders.
      */}
      <div className="relative w-[580px] xs:w-[680px] sm:w-[820px] md:w-[980px] lg:w-[1140px] xl:w-[1240px] h-[320px] xs:h-[350px] sm:h-[380px] md:h-[420px] lg:h-[450px] xl:h-[470px] flex items-center justify-center overflow-visible">
        
        {/* ========================================================================= */}
        {/* 1. LAYER 1: DEEP SAPPHIRE & COBALT BASE ATMOSPHERIC GLOW (Breathing)      */}
        {/* ========================================================================= */}
        <motion.div
          animate={{
            scale: [1, 1.025, 1],
            opacity: [0.94, 1, 0.94],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            background: `radial-gradient(
              ellipse 65% 55% at 50% 48%,
              rgba(2, 14, 44, 0.98) 0%,
              rgba(5, 24, 68, 0.94) 24%,
              rgba(8, 44, 114, 0.88) 44%,
              rgba(11, 74, 170, 0.65) 62%,
              rgba(14, 115, 228, 0.35) 76%,
              rgba(56, 189, 248, 0.12) 88%,
              rgba(255, 255, 255, 0) 100%
            )`,
            transform: 'translateZ(0)',
          }}
        />

        {/* ========================================================================= */}
        {/* 2. LAYER 2: SHIFTING ROYAL BLUE & CYAN LUMINOUS FIELD                     */}
        {/* ========================================================================= */}
        <motion.div
          animate={{
            x: [-10, 10, -10],
            y: [-6, 6, -6],
            scale: [0.97, 1.03, 0.97],
            opacity: [0.65, 0.85, 0.65],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-[86%] h-[82%] pointer-events-none"
          style={{
            background: `radial-gradient(
              ellipse 58% 48% at 50% 50%,
              rgba(7, 139, 232, 0.60) 0%,
              rgba(18, 185, 242, 0.35) 36%,
              rgba(6, 45, 120, 0.16) 66%,
              rgba(255, 255, 255, 0) 88%
            )`,
            transform: 'translateZ(0)',
          }}
        />

        {/* ========================================================================= */}
        {/* 3. LAYER 3: LUMINOUS CYAN FLOOR / STAGE GLOW (Grounding Character)        */}
        {/* ========================================================================= */}
        <motion.div
          animate={{
            opacity: [0.70, 0.92, 0.70],
            scaleX: [0.98, 1.02, 0.98],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-[16%] w-[72%] h-[75px] pointer-events-none"
          style={{
            background: `radial-gradient(
              ellipse 56% 40% at 50% 50%,
              rgba(56, 189, 248, 0.85) 0%,
              rgba(7, 139, 232, 0.55) 32%,
              rgba(14, 115, 228, 0.18) 60%,
              rgba(255, 255, 255, 0) 84%
            )`,
            transform: 'translateZ(0)',
          }}
        />

        {/* ========================================================================= */}
        {/* 4. LAYER 4: CORE CONTRAST SPOTLIGHT DIRECTLY BEHIND ILLUSTRATION          */}
        {/* ========================================================================= */}
        <div
          className="absolute w-[56%] h-[68%] top-[16%] pointer-events-none"
          style={{
            background: `radial-gradient(
              ellipse 48% 46% at 50% 46%,
              rgba(2, 10, 32, 0.96) 0%,
              rgba(4, 18, 52, 0.86) 36%,
              rgba(8, 38, 96, 0.40) 68%,
              rgba(255, 255, 255, 0) 92%
            )`,
            transform: 'translateZ(0)',
          }}
        />

        {/* ========================================================================= */}
        {/* 5. LAYER 5: SVG FLOWING CURVES, WAVE RIBBONS & GOLD ACCENTS               */}
        {/* ========================================================================= */}
        <svg
          viewBox="0 0 1200 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Cyan Wave Gradient 1: Main sweeping ribbon */}
            <linearGradient id="cyanWaveGrad1" x1="0%" y1="60%" x2="100%" y2="40%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
              <stop offset="12%" stopColor="#38BDF8" stopOpacity="0.3" />
              <stop offset="35%" stopColor="#67E8F9" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.9" />
              <stop offset="85%" stopColor="#078BE8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
            </linearGradient>

            {/* Cyan Wave Gradient 2: Secondary fluid arc */}
            <linearGradient id="cyanWaveGrad2" x1="0%" y1="80%" x2="100%" y2="30%">
              <stop offset="0%" stopColor="#078BE8" stopOpacity="0" />
              <stop offset="20%" stopColor="#38BDF8" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#BAE6FD" stopOpacity="0.8" />
              <stop offset="80%" stopColor="#38BDF8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#078BE8" stopOpacity="0" />
            </linearGradient>

            {/* Translucent silk sheen area gradient */}
            <linearGradient id="silkSheenGrad" x1="20%" y1="20%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#078BE8" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#031A4E" stopOpacity="0" />
            </linearGradient>

            {/* GOLD ACCENT GRADIENT: Elegant, rich warm gold thread */}
            <linearGradient id="goldRibbonGrad" x1="0%" y1="50%" x2="100%" y2="40%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
              <stop offset="18%" stopColor="#F59E0B" stopOpacity="0.4" />
              <stop offset="38%" stopColor="#FDE68A" stopOpacity="0.95" />
              <stop offset="52%" stopColor="#FEF08A" stopOpacity="0.98" />
              <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.8" />
              <stop offset="90%" stopColor="#D97706" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Ethereal Translucent Silk Wash */}
          <path
            d="M 40 340 C 220 260, 360 210, 520 230 C 680 250, 840 180, 1020 220 C 1140 250, 1080 320, 920 340 C 740 360, 520 380, 320 360 Z"
            fill="url(#silkSheenGrad)"
            className="opacity-70"
          />

          {/* 1. Primary Flowing Cyan Ribbon: Under-glow stroke for neon luminescence */}
          <path
            d="M -40 330 C 160 360, 260 210, 420 220 C 580 230, 680 260, 840 210 C 980 170, 1100 190, 1260 160"
            stroke="#38BDF8"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.35"
          />

          {/* 1. Primary Flowing Cyan Ribbon: Crisp glowing core */}
          <motion.path
            d="M -40 330 C 160 360, 260 210, 420 220 C 580 230, 680 260, 840 210 C 980 170, 1100 190, 1260 160"
            stroke="url(#cyanWaveGrad1)"
            strokeWidth="2.2"
            strokeLinecap="round"
            animate={{
              y: [-2, 2, -2],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* 2. Secondary Flowing Cyan Wave: Glow stroke */}
          <path
            d="M -60 380 C 180 280, 360 340, 580 300 C 780 260, 960 310, 1260 230"
            stroke="#078BE8"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.25"
          />

          {/* 2. Secondary Flowing Cyan Wave: Crisp core */}
          <motion.path
            d="M -60 380 C 180 280, 360 340, 580 300 C 780 260, 960 310, 1260 230"
            stroke="url(#cyanWaveGrad2)"
            strokeWidth="1.6"
            strokeLinecap="round"
            animate={{
              y: [2, -2, 2],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* 3. Upper Gentle Cyan Light Arc */}
          <path
            d="M -20 240 C 220 160, 440 180, 620 150 C 800 120, 1020 160, 1240 120"
            stroke="url(#cyanWaveGrad2)"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.65"
          />

          {/* 4. Fine Accent Filament */}
          <path
            d="M 120 370 C 280 320, 440 250, 640 270 C 840 290, 1000 200, 1180 170"
            stroke="#67E8F9"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.4"
          />

          {/* 5. GOLD ACCENT RIBBON: Luminous warm gold under-glow stroke */}
          <path
            d="M -40 300 C 180 240, 320 290, 480 250 C 640 210, 820 260, 1040 200 C 1140 170, 1200 180, 1260 170"
            stroke="#F59E0B"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.35"
          />

          {/* 5. GOLD ACCENT RIBBON: Crisp luminous gold core stroke */}
          <motion.path
            d="M -40 300 C 180 240, 320 290, 480 250 C 640 210, 820 260, 1040 200 C 1140 170, 1200 180, 1260 170"
            stroke="url(#goldRibbonGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
            animate={{
              y: [-1.5, 1.5, -1.5],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Secondary finer gold echo filament */}
          <path
            d="M 60 320 C 240 260, 360 300, 520 265 C 680 230, 860 275, 1080 215"
            stroke="url(#goldRibbonGrad)"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.45"
          />
        </svg>

        {/* ========================================================================= */}
        {/* 6. LAYER 6: SPARSE OPTICAL CYAN BOKEH ORBS & GLINTS                       */}
        {/* ========================================================================= */}

        {/* Orb 1: Upper-left soft cyan glow orb (behind EMI Relief badge) */}
        <motion.div
          animate={{
            x: [-5, 5, -5],
            y: [-3, 4, -3],
            scale: [0.94, 1.06, 0.94],
            opacity: [0.70, 0.92, 0.70],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute left-[18%] top-[34%] w-16 h-16 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(103,232,249,0.85) 30%, rgba(7,139,232,0.35) 65%, transparent 100%)',
            boxShadow: '0 0 24px rgba(56,189,248,0.7)',
            transform: 'translateZ(0)',
          }}
        />

        {/* Orb 2: Lower-left soft cyan orb (near Debt Restructuring badge) */}
        <motion.div
          animate={{
            x: [3, -3, 3],
            y: [-2, 3, -2],
            scale: [0.96, 1.04, 0.96],
            opacity: [0.55, 0.8, 0.55],
          }}
          transition={{
            duration: 9.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute left-[24%] bottom-[25%] w-12 h-12 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(186,230,253,0.9) 0%, rgba(56,189,248,0.7) 40%, rgba(14,115,228,0.25) 70%, transparent 100%)',
            boxShadow: '0 0 18px rgba(56,189,248,0.5)',
            transform: 'translateZ(0)',
          }}
        />

        {/* Orb 3: Right side soft bokeh orb (behind Harassment Relief badge) */}
        <motion.div
          animate={{
            x: [-4, 4, -4],
            y: [3, -3, 3],
            scale: [0.95, 1.05, 0.95],
            opacity: [0.60, 0.85, 0.60],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
          className="absolute right-[19%] top-[30%] w-18 h-18 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(56,189,248,0.75) 35%, rgba(7,139,232,0.25) 70%, transparent 100%)',
            boxShadow: '0 0 26px rgba(56,189,248,0.6)',
            transform: 'translateZ(0)',
          }}
        />

        {/* Orb 4: Right lower subtle bokeh dot */}
        <motion.div
          animate={{
            y: [-2, 2, -2],
            opacity: [0.45, 0.75, 0.45],
          }}
          transition={{
            duration: 7.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute right-[14%] bottom-[32%] w-7 h-7 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(186,230,253,0.85) 0%, rgba(56,189,248,0.5) 50%, transparent 100%)',
            transform: 'translateZ(0)',
          }}
        />

        {/* GOLD STARBURST GLINT on the Gold Ribbon (matching the reference image sparkle) */}
        <motion.div
          animate={{
            scale: [0.94, 1.14, 0.94],
            opacity: [0.75, 1, 0.75],
            rotate: [-3, 5, -3],
            x: [-2, 2, -2],
            y: [-1, 2, -1],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute left-[30%] top-[48%] pointer-events-none"
          style={{ transform: 'translateZ(0)' }}
        >
          <GoldGlint className="w-9 h-9 drop-shadow-[0_0_12px_rgba(245,158,11,0.85)]" />
        </motion.div>

        {/* Secondary gentle gold glint further right */}
        <motion.div
          animate={{
            scale: [0.88, 1.08, 0.88],
            opacity: [0.55, 0.85, 0.55],
            rotate: [4, -4, 4],
          }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.8,
          }}
          className="absolute right-[33%] top-[40%] pointer-events-none"
          style={{ transform: 'translateZ(0)' }}
        >
          <GoldGlint className="w-6 h-6 drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]" />
        </motion.div>

        {/* Delicate floating cyan light motes (Sparse atmospheric highlights) */}
        <motion.div
          animate={{
            y: [-3, 3, -3],
            x: [-2, 2, -2],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute left-[38%] top-[28%] w-2 h-2 rounded-full bg-[#BAE6FD] shadow-[0_0_8px_#38BDF8] pointer-events-none"
        />

        <motion.div
          animate={{
            y: [3, -3, 3],
            x: [2, -2, 2],
            opacity: [0.35, 0.75, 0.35],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.2,
          }}
          className="absolute right-[28%] bottom-[35%] w-2 h-2 rounded-full bg-[#BAE6FD] shadow-[0_0_8px_#38BDF8] pointer-events-none"
        />
      </div>
    </motion.div>
  );
}
