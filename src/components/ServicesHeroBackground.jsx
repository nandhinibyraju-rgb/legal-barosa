import React from 'react';
import { motion } from 'framer-motion';

/**
 * ServicesHeroBackground:
 * Premium animated dark-blue + subtle gold atmospheric gradient background.
 * Specifically crafted for the Services page hero:
 * - Deep navy/dark-blue base (#02091A - #051433)
 * - Smooth layered royal and cobalt blue organic gradients
 * - Subtle cyan/royal-blue glow in upper and center areas
 * - Very subtle gold gradient lighting blended into the blue (#F59E0B / #FBBF24 at low opacity)
 * - Gold does NOT dominate; acts as a soft, warm atmospheric accent
 * - Elegant organic flowing blobs with slow drift and morph
 * - Soft floating circular forms / orbs
 * - A few extremely subtle flowing curved lines
 * - Continuous, seamless, gentle wind/flowing motion
 * - Strictly isolated to the Services hero container.
 */
export default function ServicesHeroBackground() {
  return (
    <div 
      aria-hidden="true" 
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0"
      style={{
        background: 'linear-gradient(180deg, #02091A 0%, #041434 45%, #051A40 75%, #030C22 100%)',
      }}
    >
      {/* ======================================================== */}
      {/* 1. AMBIENT ATMOSPHERIC LIGHTING & SUBTLE GOLD GLOW      */}
      {/* ======================================================== */}

      {/* Central Blue Ambient Radial Glow */}
      <motion.div
        animate={{
          opacity: [0.65, 0.85, 0.65],
          scale: [0.98, 1.04, 0.98],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] lg:w-[1100px] h-[450px] sm:h-[550px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(14, 68, 168, 0.5) 0%, rgba(10, 48, 128, 0.3) 40%, rgba(3, 20, 60, 0.1) 70%, transparent 85%)',
        }}
      />

      {/* Very Subtle Gold Gradient Lighting (Soft atmospheric accent - does NOT dominate) */}
      <motion.div
        animate={{
          opacity: [0.14, 0.24, 0.14],
          x: [-20, 20, -20],
          y: [-10, 15, -10],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute left-[38%] top-[25%] -translate-x-1/2 -translate-y-1/2 w-[520px] sm:w-[700px] h-[320px] sm:h-[420px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(245, 158, 11, 0.22) 0%, rgba(217, 119, 6, 0.12) 35%, rgba(180, 83, 9, 0.04) 65%, transparent 80%)',
          filter: 'blur(35px)',
        }}
      />

      {/* Secondary Cyan/Royal-Blue Highlight */}
      <motion.div
        animate={{
          opacity: [0.25, 0.45, 0.25],
          x: [15, -15, 15],
          y: [10, -10, 10],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute right-[25%] top-[55%] -translate-y-1/2 w-[480px] sm:w-[620px] h-[280px] sm:h-[360px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(18, 185, 242, 0.2) 0%, rgba(22, 140, 255, 0.1) 40%, transparent 75%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Edge Vignette */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse 95% 85% at 50% 50%, transparent 50%, rgba(2, 8, 24, 0.5) 85%, rgba(1, 4, 16, 0.8) 100%)',
        }}
      />

      {/* ======================================================== */}
      {/* 2. LAYER 2: ORGANIC FLOWING SVG SHAPES & WAVES           */}
      {/* ======================================================== */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Left Wave Gradient with subtle gold blend */}
          <linearGradient id="srvBlobLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B429A" stopOpacity="0.75" />
            <stop offset="45%" stopColor="#08337C" stopOpacity="0.65" />
            <stop offset="85%" stopColor="#041E4E" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#020C22" stopOpacity="0.2" />
          </linearGradient>

          {/* Right Wave Gradient */}
          <linearGradient id="srvBlobRight" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B429A" stopOpacity="0.7" />
            <stop offset="40%" stopColor="#093682" stopOpacity="0.6" />
            <stop offset="80%" stopColor="#05245C" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#020E26" stopOpacity="0.2" />
          </linearGradient>

          {/* Soft Gold Flow Accent Gradient */}
          <linearGradient id="srvGoldGlow" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
            <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </linearGradient>

          {/* Curved Flow Line Gradient */}
          <linearGradient id="srvLineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#12B9F2" stopOpacity="0" />
            <stop offset="35%" stopColor="#38BDF8" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0B429A" stopOpacity="0" />
          </linearGradient>

          {/* Curved Flow Line Gradient 2 */}
          <linearGradient id="srvLineGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#168CFF" stopOpacity="0" />
            <stop offset="45%" stopColor="#12B9F2" stopOpacity="0.4" />
            <stop offset="80%" stopColor="#FBBF24" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#062C6A" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Left Organic Fluid Shape */}
        <motion.path
          d="M -100 -40
             L -100 520
             C 30 500, 130 460, 190 390
             C 250 320, 220 240, 170 180
             C 120 120, 160 50, 240 -40
             Z"
          fill="url(#srvBlobLeft)"
          animate={{
            d: [
              "M -100 -40 L -100 520 C 30 500, 130 460, 190 390 C 250 320, 220 240, 170 180 C 120 120, 160 50, 240 -40 Z",
              "M -100 -40 L -100 520 C 45 510, 150 445, 205 375 C 260 305, 235 225, 185 170 C 135 110, 175 40, 255 -40 Z",
              "M -100 -40 L -100 520 C 20 485, 115 470, 175 405 C 235 335, 205 255, 155 190 C 105 130, 145 60, 225 -40 Z",
              "M -100 -40 L -100 520 C 30 500, 130 460, 190 390 C 250 320, 220 240, 170 180 C 120 120, 160 50, 240 -40 Z"
            ],
            x: [-6, 8, -6],
            y: [-4, 6, -4],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Right Organic Fluid Shape */}
        <motion.path
          d="M 1540 -40
             L 1540 560
             C 1420 530, 1310 470, 1240 390
             C 1170 310, 1190 220, 1260 150
             C 1330 80, 1300 10, 1220 -40
             Z"
          fill="url(#srvBlobRight)"
          animate={{
            d: [
              "M 1540 -40 L 1540 560 C 1420 530, 1310 470, 1240 390 C 1170 310, 1190 220, 1260 150 C 1330 80, 1300 10, 1220 -40 Z",
              "M 1540 -40 L 1540 560 C 1405 540, 1295 480, 1225 400 C 1155 320, 1175 230, 1245 160 C 1315 90, 1285 20, 1205 -40 Z",
              "M 1540 -40 L 1540 560 C 1435 515, 1325 455, 1255 375 C 1185 295, 1205 210, 1275 140 C 1345 70, 1315 -5, 1235 -40 Z",
              "M 1540 -40 L 1540 560 C 1420 530, 1310 470, 1240 390 C 1170 310, 1190 220, 1260 150 C 1330 80, 1300 10, 1220 -40 Z"
            ],
            x: [8, -8, 8],
            y: [-6, 6, -6],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Thin Elegant Curved Flowing Line 1 */}
        <motion.path
          d="M -20 280
             C 120 240, 260 330, 380 270
             C 500 210, 580 140, 720 180
             C 860 220, 960 300, 1120 250
             C 1240 210, 1360 140, 1460 170"
          fill="none"
          stroke="url(#srvLineGrad1)"
          strokeWidth="1.4"
          strokeLinecap="round"
          animate={{
            d: [
              "M -20 280 C 120 240, 260 330, 380 270 C 500 210, 580 140, 720 180 C 860 220, 960 300, 1120 250 C 1240 210, 1360 140, 1460 170",
              "M -20 290 C 135 255, 275 315, 395 285 C 515 225, 595 130, 735 190 C 875 235, 975 285, 1135 265 C 1255 225, 1375 130, 1460 180",
              "M -20 270 C 105 225, 245 345, 365 255 C 485 195, 565 150, 705 170 C 845 205, 945 315, 1105 235 C 1225 195, 1345 150, 1460 160",
              "M -20 280 C 120 240, 260 330, 380 270 C 500 210, 580 140, 720 180 C 860 220, 960 300, 1120 250 C 1240 210, 1360 140, 1460 170"
            ],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Thin Flowing Curved Line 2 (with subtle gold tint) */}
        <motion.path
          d="M 60 420
             C 240 380, 420 460, 600 410
             C 780 360, 940 280, 1140 340
             C 1280 380, 1380 360, 1480 310"
          fill="none"
          stroke="url(#srvLineGrad2)"
          strokeWidth="1.2"
          strokeDasharray="4 6"
          animate={{
            opacity: [0.25, 0.5, 0.25],
            x: [6, -6, 6],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </svg>

      {/* ======================================================== */}
      {/* 3. LAYER 3: SOFT FLOATING CIRCULAR FORMS / ORBS          */}
      {/* ======================================================== */}

      {/* Orb 1: Upper Left */}
      <motion.div
        animate={{
          y: [-10, 10, -10],
          x: [-5, 6, -5],
          scale: [0.98, 1.03, 0.98],
        }}
        transition={{
          duration: 17,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute left-[3%] top-[14%] w-[110px] sm:w-[140px] h-[110px] sm:h-[140px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 35% 35%, rgba(56, 189, 248, 0.35) 0%, rgba(22, 140, 255, 0.25) 30%, rgba(10, 50, 140, 0.15) 60%, transparent 80%)',
          boxShadow: 'inset -6px -6px 20px rgba(1, 4, 16, 0.5), 0 0 25px rgba(22, 140, 255, 0.12)',
        }}
      />

      {/* Orb 2: Upper Right (Large soft sphere with subtle gold edge reflection) */}
      <motion.div
        animate={{
          y: [10, -12, 10],
          x: [6, -6, 6],
          scale: [1, 1.04, 1],
        }}
        transition={{
          duration: 21,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute right-[2%] top-[10%] w-[130px] sm:w-[170px] h-[130px] sm:h-[170px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 38% 38%, rgba(245, 158, 11, 0.22) 0%, rgba(22, 140, 255, 0.28) 35%, rgba(8, 45, 125, 0.18) 65%, transparent 85%)',
          boxShadow: 'inset -8px -8px 24px rgba(2, 6, 18, 0.6), 0 0 30px rgba(245, 158, 11, 0.1)',
        }}
      />

      {/* Orb 3: Lower Left Accent */}
      <motion.div
        animate={{
          y: [8, -8, 8],
          x: [4, -4, 4],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute left-[6%] bottom-[12%] w-[60px] sm:w-[80px] h-[60px] sm:h-[80px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 40% 40%, rgba(22, 140, 255, 0.35) 0%, rgba(10, 42, 120, 0.18) 60%, transparent 80%)',
        }}
      />

      {/* Orb 4: Lower Right Accent */}
      <motion.div
        animate={{
          y: [-8, 9, -8],
          x: [-5, 5, -5],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute right-[5%] bottom-[16%] w-[90px] sm:w-[120px] h-[90px] sm:h-[120px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 40% 40%, rgba(56, 189, 248, 0.3) 0%, rgba(14, 55, 145, 0.2) 50%, transparent 80%)',
          boxShadow: 'inset -6px -6px 18px rgba(1, 4, 14, 0.5)',
        }}
      />

    </div>
  );
}
// Final submission update
