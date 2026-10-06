import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * HeroFullBleedBackground:
 * Exact implementation of the full-bleed hero section background specification:
 * 
 * 1. Base full-bleed gradient: linear-gradient(135deg, #0a1535 0%, #0f1f4a 25%, #14295f 50%, #0f1f4a 75%, #0a1535 100%)
 * 2. Wave/ribbon shapes: 3 soft, translucent curved wave/ribbon shapes flowing diagonally across the ENTIRE section (bottom-left to upper-right, opacity 0.15-0.25, #3b82f6 & #1e40af)
 * 3. Central glow layer: radial-gradient(ellipse 50% 60% at 50% 46%, rgba(59, 130, 246, 0.5) 0%, rgba(37, 99, 235, 0.3) 35%, rgba(29, 78, 216, 0.1) 60%, transparent 80%)
 * 4. Diagonal light streak lines: 3 warm gold streaks (#fbbf24/#f59e0b) + 3 light blue streaks (#60a5fa) spanning edge to edge
 * 5. Scattered particle dots: 22 glowing dots (2px to 6px, #ffffff & #93c5fd) with subtle twinkle animation (opacity 0.4 to 1, 3-6s duration, randomized delay)
 * 6. Precise layering order: Base -> Waves -> Central Glow -> Streaks -> Particles
 */

const HERO_PARTICLES = [
  // Left quadrant (including near floating badges)
  { id: 'p1', top: '9%', left: '5%', size: 3, color: '#ffffff', duration: 4.2, delay: 0.3 },
  { id: 'p2', top: '19%', left: '14%', size: 4, color: '#93c5fd', duration: 5.1, delay: 1.2 },
  { id: 'p3', top: '33%', left: '7%', size: 2.5, color: '#ffffff', duration: 3.8, delay: 2.4 },
  { id: 'p4', top: '47%', left: '16%', size: 5, color: '#93c5fd', duration: 4.6, delay: 0.8 },
  { id: 'p5', top: '63%', left: '6%', size: 3, color: '#ffffff', duration: 5.4, delay: 1.7 },
  { id: 'p6', top: '77%', left: '13%', size: 4, color: '#93c5fd', duration: 3.9, delay: 2.9 },
  { id: 'p7', top: '89%', left: '21%', size: 2.5, color: '#ffffff', duration: 4.8, delay: 0.5 },
  // Mid-left & Upper Center
  { id: 'p8', top: '13%', left: '31%', size: 3.5, color: '#93c5fd', duration: 5.8, delay: 2.1 },
  { id: 'p9', top: '25%', left: '24%', size: 4, color: '#ffffff', duration: 4.0, delay: 1.4 },
  { id: 'p10', top: '75%', left: '33%', size: 3, color: '#93c5fd', duration: 4.5, delay: 3.0 },
  { id: 'p11', top: '87%', left: '43%', size: 4.5, color: '#ffffff', duration: 5.2, delay: 0.9 },
  // Center
  { id: 'p12', top: '35%', left: '51%', size: 3, color: '#ffffff', duration: 3.7, delay: 1.9 },
  { id: 'p13', top: '65%', left: '49%', size: 3.5, color: '#93c5fd', duration: 4.9, delay: 0.2 },
  // Mid-right & Upper Right
  { id: 'p14', top: '11%', right: '33%', size: 3, color: '#ffffff', duration: 4.3, delay: 1.8 },
  { id: 'p15', top: '23%', right: '23%', size: 5, color: '#93c5fd', duration: 3.6, delay: 2.6 },
  { id: 'p16', top: '67%', right: '29%', size: 3.5, color: '#ffffff', duration: 5.0, delay: 0.4 },
  { id: 'p17', top: '81%', right: '39%', size: 4, color: '#93c5fd', duration: 4.4, delay: 1.5 },
  // Far right quadrant (including near floating badges)
  { id: 'p18', top: '11%', right: '13%', size: 3, color: '#ffffff', duration: 5.6, delay: 2.8 },
  { id: 'p19', top: '27%', right: '6%', size: 5, color: '#93c5fd', duration: 3.9, delay: 0.7 },
  { id: 'p20', top: '43%', right: '15%', size: 2.5, color: '#ffffff', duration: 4.7, delay: 2.2 },
  { id: 'p21', top: '59%', right: '8%', size: 4, color: '#93c5fd', duration: 5.3, delay: 1.1 },
  { id: 'p22', top: '75%', right: '17%', size: 3, color: '#ffffff', duration: 4.1, delay: 2.5 },
  { id: 'p23', top: '89%', right: '9%', size: 4.5, color: '#93c5fd', duration: 4.8, delay: 1.3 },
];

export default function HeroFullBleedBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(max-width: 767px)').matches);
    }
  }, []);

  return (
    <div 
      aria-hidden="true" 
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden"
    >
      {/* ========================================================================= */}
      {/* 1. BASE FULL-BLEED GRADIENT (Foundation Layer, z-0)                       */}
      {/* ========================================================================= */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(135deg, #0a1535 0%, #0f1f4a 25%, #14295f 50%, #0f1f4a 75%, #0a1535 100%)',
        }}
      />

      {/* ========================================================================= */}
      {/* 2. DIAGONAL FLOWING WAVE / RIBBON SHAPES (Mid-ground Layer, z-[1])        */}
      {/* ========================================================================= */}
      <svg
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="auroraWave1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e40af" stopOpacity="0.25" />
            <stop offset="45%" stopColor="#3b82f6" stopOpacity="0.22" />
            <stop offset="80%" stopColor="#2563eb" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.12" />
          </linearGradient>

          <linearGradient id="auroraWave2" x1="0%" y1="90%" x2="100%" y2="10%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#1d4ed8" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.15" />
          </linearGradient>

          <linearGradient id="auroraWave3" x1="0%" y1="100%" x2="100%" y2="20%">
            <stop offset="0%" stopColor="#1e40af" stopOpacity="0.20" />
            <stop offset="55%" stopColor="#3b82f6" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.16" />
          </linearGradient>
        </defs>

        {/* Aurora Wave 1: Primary diagonal ribbon flowing bottom-left to upper-right */}
        <motion.path
          d="M -100 850 C 300 700, 600 480, 1050 280 C 1280 190, 1450 110, 1600 40 L 1600 190 C 1400 270, 1200 360, 980 460 C 600 640, 250 840, -100 960 Z"
          fill="url(#auroraWave1)"
          animate={isMobile ? undefined : {
            y: [-6, 6, -6],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ filter: isMobile ? 'blur(8px)' : 'blur(16px)' }}
        />

        {/* Aurora Wave 2: Secondary soft ribbon */}
        <motion.path
          d="M -100 680 C 260 560, 560 390, 940 210 C 1180 100, 1380 40, 1600 -10 L 1600 90 C 1350 160, 1150 260, 880 350 C 500 530, 160 720, -100 810 Z"
          fill="url(#auroraWave2)"
          animate={isMobile ? undefined : {
            y: [5, -5, 5],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ filter: isMobile ? 'blur(10px)' : 'blur(20px)' }}
        />

        {/* Aurora Wave 3: Third translucent ribbon */}
        <motion.path
          d="M -100 990 C 380 830, 780 590, 1180 390 C 1380 290, 1520 220, 1600 170 L 1600 290 C 1440 360, 1220 470, 960 590 C 580 780, 200 980, -100 1100 Z"
          fill="url(#auroraWave3)"
          animate={isMobile ? undefined : {
            y: [-4, 5, -4],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ filter: isMobile ? 'blur(9px)' : 'blur(18px)' }}
        />
      </svg>

      {/* ========================================================================= */}
      {/* 3. CENTRAL GLOW LAYER (Behind Illustration, z-[2])                        */}
      {/* ========================================================================= */}
      <motion.div
        animate={isMobile ? undefined : {
          opacity: [0.88, 1, 0.88],
          scale: [0.98, 1.02, 0.98],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 w-full h-full z-[2]"
        style={{
          background: 'radial-gradient(ellipse 50% 60% at 50% 45%, rgba(59, 130, 246, 0.5) 0%, rgba(37, 99, 235, 0.3) 35%, rgba(29, 78, 216, 0.1) 60%, transparent 80%)',
        }}
      />

      {/* ========================================================================= */}
      {/* 4. DIAGONAL LIGHT STREAK LINES (Accent Layer, z-[3])                      */}
      {/* ========================================================================= */}
      <svg
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full z-[3]"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Gold streak linear gradients with soft edge falloffs */}
          <linearGradient id="goldStreak1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
            <stop offset="15%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="45%" stopColor="#fbbf24" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#fde68a" stopOpacity="0.9" />
            <stop offset="90%" stopColor="#f59e0b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="goldStreak2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0" />
            <stop offset="25%" stopColor="#fbbf24" stopOpacity="0.5" />
            <stop offset="55%" stopColor="#fde68a" stopOpacity="0.9" />
            <stop offset="85%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </linearGradient>

          {/* Light blue streak linear gradients */}
          <linearGradient id="blueStreak1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
            <stop offset="18%" stopColor="#60a5fa" stopOpacity="0.4" />
            <stop offset="48%" stopColor="#93c5fd" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="92%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="blueStreak2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0" />
            <stop offset="22%" stopColor="#60a5fa" stopOpacity="0.5" />
            <stop offset="52%" stopColor="#bfdbfe" stopOpacity="0.9" />
            <stop offset="82%" stopColor="#60a5fa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* --- GOLD STREAKS (2-3 streaks in #fbbf24 / #f59e0b, 1-2px, flowing lower-left to upper-right) --- */}
        {/* Gold Streak 1: Main luminous golden streak */}
        <motion.path
          d="M -50 740 C 350 560, 750 380, 1150 220 C 1350 140, 1500 80, 1600 40"
          stroke="url(#goldStreak1)"
          strokeWidth="1.8"
          strokeLinecap="round"
          animate={{
            y: [-3, 3, -3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            filter: 'blur(0.8px) drop-shadow(0 0 6px rgba(251, 191, 36, 0.85))',
          }}
        />

        {/* Gold Streak 2: Upper delicate gold streak */}
        <motion.path
          d="M -50 620 C 300 460, 680 310, 1080 180 C 1300 110, 1480 60, 1600 20"
          stroke="url(#goldStreak2)"
          strokeWidth="1.2"
          strokeLinecap="round"
          animate={{
            y: [3, -3, 3],
          }}
          transition={{
            duration: 17,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            filter: 'blur(0.8px) drop-shadow(0 0 5px rgba(245, 158, 11, 0.75))',
          }}
        />

        {/* Gold Streak 3: Lower subtle gold streak */}
        <motion.path
          d="M -50 860 C 400 680, 850 490, 1250 320 C 1420 250, 1520 200, 1600 160"
          stroke="url(#goldStreak1)"
          strokeWidth="1.0"
          strokeLinecap="round"
          animate={{
            y: [-2, 2, -2],
          }}
          transition={{
            duration: 19,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            filter: 'blur(0.8px) drop-shadow(0 0 4px rgba(251, 191, 36, 0.65))',
          }}
        />

        {/* --- LIGHT BLUE STREAKS (2-3 streaks in #60a5fa, 1-2px, flowing in similar or crossing directions) --- */}
        {/* Blue Streak 1: Main light blue streak */}
        <motion.path
          d="M -50 680 C 320 510, 720 340, 1120 190 C 1320 120, 1480 60, 1600 10"
          stroke="url(#blueStreak1)"
          strokeWidth="1.8"
          strokeLinecap="round"
          animate={{
            y: [2, -3, 2],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            filter: 'blur(0.8px) drop-shadow(0 0 7px rgba(96, 165, 250, 0.85))',
          }}
        />

        {/* Blue Streak 2: Lower light blue streak */}
        <motion.path
          d="M -50 800 C 380 610, 800 430, 1200 260 C 1380 180, 1500 130, 1600 80"
          stroke="url(#blueStreak2)"
          strokeWidth="1.4"
          strokeLinecap="round"
          animate={{
            y: [-3, 2, -3],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            filter: 'blur(0.8px) drop-shadow(0 0 6px rgba(96, 165, 250, 0.75))',
          }}
        />

        {/* Blue Streak 3: Gently crossing upper light blue streak */}
        <motion.path
          d="M -50 540 C 340 400, 760 270, 1180 150 C 1360 100, 1500 60, 1600 20"
          stroke="url(#blueStreak1)"
          strokeWidth="1.0"
          strokeLinecap="round"
          animate={{
            y: [2, -2, 2],
          }}
          transition={{
            duration: 21,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            filter: 'blur(0.8px) drop-shadow(0 0 5px rgba(96, 165, 250, 0.65))',
          }}
        />
      </svg>

      {/* ========================================================================= */}
      {/* 5. SCATTERED PARTICLE DOTS (Full-section distribution, z-[4])             */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 w-full h-full z-[4]">
        {HERO_PARTICLES.map((dot, idx) => {
          if (isMobile && idx >= 8) return null;
          return (
            <motion.div
              key={dot.id}
              animate={{
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: dot.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: dot.delay,
              }}
              style={{
                position: 'absolute',
                top: dot.top,
                bottom: dot.bottom,
                left: dot.left,
                right: dot.right,
                width: `${dot.size}px`,
                height: `${dot.size}px`,
                borderRadius: '9999px',
                backgroundColor: dot.color,
                boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
                pointerEvents: 'none',
                transform: 'translateZ(0)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
