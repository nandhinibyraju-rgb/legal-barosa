import React from 'react';
import { motion } from 'framer-motion';

/**
 * ServiceHeroBackground:
 * Premium dark LegalTech atmospheric background for individual Service Detail Pages:
 * - Deep navy blue & dark royal blue base (#020816 to #041438)
 * - Soft organic flowing shapes with gentle irregular gradients (NO photographic clouds, NO sky photos)
 * - Gentle atmospheric blue lighting & breathing ambient glow
 * - Very soft cyan highlights
 * - Very subtle gold gradient touch drifting through the upper layer
 * - Thin, elegant flowing curved bezier lines
 * - Asymmetrical, continuous flowing environment (NO symmetric corner circles)
 * - Slow, cinematic, seamless looping movement
 */
export default function ServiceHeroBackground() {
  return (
    <div 
      aria-hidden="true" 
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0"
      style={{
        background: 'linear-gradient(180deg, #020816 0%, #030E2B 30%, #04163E 65%, #02091A 100%)',
      }}
    >
      {/* ======================================================== */}
      {/* 1. LAYER 1: AMBIENT ATMOSPHERIC BLUE & CYAN LIGHTING      */}
      {/* ======================================================== */}

      {/* Deep core atmospheric blue glow (slow breathing) */}
      <motion.div
        animate={{
          opacity: [0.65, 0.85, 0.65],
          scale: [0.98, 1.03, 0.98],
          x: [-8, 8, -8],
          y: [-5, 5, -5],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute left-[45%] top-[45%] -translate-x-1/2 -translate-y-1/2 w-[850px] sm:w-[1100px] lg:w-[1300px] h-[520px] sm:h-[640px] lg:h-[720px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 68% 54% at 50% 50%, rgba(9, 60, 155, 0.5) 0%, rgba(12, 45, 120, 0.3) 40%, rgba(4, 20, 68, 0.12) 70%, transparent 85%)',
        }}
      />

      {/* Very soft cyan highlight breathing gently in upper-center-left */}
      <motion.div
        animate={{
          opacity: [0.2, 0.35, 0.2],
          scale: [0.96, 1.04, 0.96],
          x: [10, -10, 10],
          y: [6, -6, 6],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute left-[40%] top-[30%] -translate-x-1/2 -translate-y-1/2 w-[540px] sm:w-[720px] h-[340px] sm:h-[440px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 48% at 50% 50%, rgba(18, 185, 242, 0.16) 0%, rgba(22, 140, 255, 0.08) 45%, transparent 75%)',
        }}
      />

      {/* Very subtle gold gradient touch drifting through upper right quadrant */}
      <motion.div
        animate={{
          opacity: [0.035, 0.08, 0.035],
          x: [-20, 25, -20],
          y: [12, -15, 12],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute right-[20%] top-[20%] w-[480px] sm:w-[620px] h-[320px] sm:h-[420px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 65% 50% at 50% 50%, rgba(245, 175, 25, 0.08) 0%, rgba(217, 119, 6, 0.035) 45%, transparent 75%)',
        }}
      />

      {/* ======================================================== */}
      {/* 2. LAYER 2: LARGE ASYMMETRICAL ORGANIC GRADIENT FORMS    */}
      {/* ======================================================== */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Asymmetric Organic Wave Gradient (Deep Navy / Royal / Midnight) */}
          <linearGradient id="srvFlowGrad1" x1="0%" y1="15%" x2="90%" y2="85%">
            <stop offset="0%" stopColor="#0B3E8C" stopOpacity="0.75" />
            <stop offset="38%" stopColor="#082E6E" stopOpacity="0.65" />
            <stop offset="72%" stopColor="#041B45" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#020C22" stopOpacity="0.15" />
          </linearGradient>

          {/* Secondary Organic Accent Gradient with Soft Cyan Hint */}
          <linearGradient id="srvFlowGradCyan" x1="10%" y1="10%" x2="85%" y2="80%">
            <stop offset="0%" stopColor="#12B9F2" stopOpacity="0.18" />
            <stop offset="45%" stopColor="#0C4AA6" stopOpacity="0.55" />
            <stop offset="85%" stopColor="#052150" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#020E26" stopOpacity="0" />
          </linearGradient>

          {/* Right-Hand Flowing Form Gradient (Cobalt into deep Navy) */}
          <linearGradient id="srvFlowGradRight" x1="95%" y1="10%" x2="10%" y2="90%">
            <stop offset="0%" stopColor="#0A3880" stopOpacity="0.7" />
            <stop offset="42%" stopColor="#072964" stopOpacity="0.6" />
            <stop offset="78%" stopColor="#041A42" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#020B1E" stopOpacity="0.1" />
          </linearGradient>

          {/* Flowing Line Gradient Left */}
          <linearGradient id="srvFlowLine1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#12B9F2" stopOpacity="0" />
            <stop offset="25%" stopColor="#12B9F2" stopOpacity="0.35" />
            <stop offset="65%" stopColor="#168CFF" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#083880" stopOpacity="0" />
          </linearGradient>

          {/* Flowing Line Gradient Right */}
          <linearGradient id="srvFlowLine2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#168CFF" stopOpacity="0" />
            <stop offset="35%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#12B9F2" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0B3E8C" stopOpacity="0" />
          </linearGradient>

          {/* Subtle Warm Gold Accent Line */}
          <linearGradient id="srvFlowLineGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
            <stop offset="40%" stopColor="#FBBF24" stopOpacity="0.22" />
            <stop offset="75%" stopColor="#38BDF8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#073B8A" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 2A. ASYMMETRICAL LEFT ORGANIC FLOWING BODY */}
        <motion.path
          d="M -80 -40 
             L -80 720 
             C 60 700, 180 670, 260 580 
             C 340 480, 280 370, 220 310 
             C 160 250, 130 190, 190 110 
             C 240 40, 290 10, 320 -40 
             Z"
          fill="url(#srvFlowGrad1)"
          animate={{
            d: [
              "M -80 -40 L -80 720 C 60 700, 180 670, 260 580 C 340 480, 280 370, 220 310 C 160 250, 130 190, 190 110 C 240 40, 290 10, 320 -40 Z",
              "M -80 -40 L -80 720 C 75 710, 195 650, 275 560 C 355 460, 295 350, 235 300 C 175 240, 145 180, 205 100 C 255 30, 305 -5, 335 -40 Z",
              "M -80 -40 L -80 720 C 45 685, 165 675, 245 595 C 325 500, 265 385, 205 320 C 145 260, 115 205, 175 125 C 225 50, 275 20, 305 -40 Z",
              "M -80 -40 L -80 720 C 60 700, 180 670, 260 580 C 340 480, 280 370, 220 310 C 160 250, 130 190, 190 110 C 240 40, 290 10, 320 -40 Z"
            ],
            x: [-6, 6, -6],
            y: [-5, 5, -5],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Soft Organic Sub-Layer: Gentle Cyan Highlight Contour */}
        <motion.path
          d="M -60 60 
             C 30 190, 110 270, 150 380 
             C 190 490, 140 600, -60 660 
             Z"
          fill="url(#srvFlowGradCyan)"
          animate={{
            x: [4, -6, 4],
            y: [6, -5, 6],
            scale: [0.98, 1.02, 0.98],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* 2B. ASYMMETRICAL RIGHT ORGANIC FLOWING BODY */}
        <motion.path
          d="M 1520 -40 
             L 1520 800 
             C 1390 770, 1280 710, 1205 600 
             C 1130 490, 1150 370, 1225 275 
             C 1295 180, 1285 95, 1205 30 
             C 1170 5, 1135 -20, 1105 -40 
             Z"
          fill="url(#srvFlowGradRight)"
          animate={{
            d: [
              "M 1520 -40 L 1520 800 C 1390 770, 1280 710, 1205 600 C 1130 490, 1150 370, 1225 275 C 1295 180, 1285 95, 1205 30 C 1170 5, 1135 -20, 1105 -40 Z",
              "M 1520 -40 L 1520 800 C 1375 780, 1265 725, 1190 615 C 1115 505, 1135 385, 1210 290 C 1280 195, 1270 110, 1190 45 C 1155 15, 1120 -10, 1090 -40 Z",
              "M 1520 -40 L 1520 800 C 1405 755, 1295 695, 1220 585 C 1145 475, 1165 355, 1240 260 C 1310 165, 1300 80, 1220 15 C 1185 -10, 1150 -30, 1120 -40 Z",
              "M 1520 -40 L 1520 800 C 1390 770, 1280 710, 1205 600 C 1130 490, 1150 370, 1225 275 C 1295 180, 1285 95, 1205 30 C 1170 5, 1135 -20, 1105 -40 Z"
            ],
            x: [7, -7, 7],
            y: [-5, 6, -5],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* 2C. LOW ATMOSPHERIC BASIN */}
        <motion.path
          d="M 280 720 
             C 420 670, 580 690, 720 700 
             C 860 710, 1020 670, 1160 730 
             C 1080 810, 900 850, 720 840 
             C 540 830, 380 790, 280 720 
             Z"
          fill="url(#srvFlowGrad1)"
          opacity="0.35"
          animate={{
            scaleY: [0.96, 1.04, 0.96],
            y: [-3, 4, -3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* ======================================================== */}
        {/* 3. LAYER 3: THIN ELEGANT FLOWING CURVED LINES             */}
        {/* ======================================================== */}

        {/* Flowing Line 1: Sinuous left-to-center organic arc */}
        <motion.path
          d="M -30 390 
             C 90 370, 190 440, 270 380 
             C 350 320, 330 190, 440 150 
             C 510 120, 590 140, 660 180"
          fill="none"
          stroke="url(#srvFlowLine1)"
          strokeWidth="1.3"
          strokeLinecap="round"
          animate={{
            d: [
              "M -30 390 C 90 370, 190 440, 270 380 C 350 320, 330 190, 440 150 C 510 120, 590 140, 660 180",
              "M -30 380 C 105 385, 205 425, 285 395 C 365 305, 345 205, 455 140 C 525 110, 605 145, 675 170",
              "M -30 400 C 75 355, 175 455, 255 365 C 335 335, 315 175, 425 160 C 495 130, 575 135, 645 190",
              "M -30 390 C 90 370, 190 440, 270 380 C 350 320, 330 190, 440 150 C 510 120, 590 140, 660 180"
            ],
            opacity: [0.35, 0.6, 0.35],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Flowing Line 2: Soft sweeping right-side arc */}
        <motion.path
          d="M 820 200 
             C 930 160, 1030 240, 1110 300 
             C 1190 360, 1240 440, 1330 400 
             C 1390 380, 1430 330, 1480 290"
          fill="none"
          stroke="url(#srvFlowLine2)"
          strokeWidth="1.4"
          strokeLinecap="round"
          animate={{
            d: [
              "M 820 200 C 930 160, 1030 240, 1110 300 C 1190 360, 1240 440, 1330 400 C 1390 380, 1430 330, 1480 290",
              "M 810 215 C 915 175, 1015 225, 1095 315 C 1175 345, 1255 425, 1345 385 C 1405 365, 1445 345, 1495 280",
              "M 830 185 C 945 145, 1045 255, 1125 285 C 1205 375, 1225 455, 1315 415 C 1375 395, 1415 315, 1465 300",
              "M 820 200 C 930 160, 1030 240, 1110 300 C 1190 360, 1240 440, 1330 400 C 1390 380, 1430 330, 1480 290"
            ],
            opacity: [0.4, 0.65, 0.4],
          }}
          transition={{
            duration: 29,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Flowing Line 3: Very subtle gold/cyan ribbon trace across upper depth */}
        <motion.path
          d="M 380 180 
             C 520 130, 680 170, 820 140 
             C 960 110, 1080 160, 1220 120"
          fill="none"
          stroke="url(#srvFlowLineGold)"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeDasharray="4 6"
          animate={{
            opacity: [0.18, 0.4, 0.18],
            x: [-8, 8, -8],
            y: [-3, 3, -3],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </svg>

      {/* ======================================================== */}
      {/* 4. LAYER 4: VIGNETTE & DEPTH LAYER                       */}
      {/* ======================================================== */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse 92% 82% at 50% 50%, transparent 45%, rgba(2, 8, 22, 0.45) 75%, rgba(2, 8, 22, 0.88) 100%)',
        }}
      />
    </div>
  );
}
// Final submission update
