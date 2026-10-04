import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';

// Delicate 4-point micro-sparkle SVG
function MicroSparkle({ size = 9, className = '', style = {} }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className} 
      style={style}
      aria-hidden="true"
    >
      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
    </svg>
  );
}

// 36 Tastefully scattered star/dot particles inspired by Storyset reference
export const STAR_PARTICLES = [
  { id: 1, top: '12%', left: '7%', size: 2, opacity: 0.65, delay: 0 },
  { id: 2, top: '22%', left: '14%', size: 9, opacity: 0.85, delay: 1.2, isStar: true },
  { id: 3, top: '8%', left: '26%', size: 1.8, opacity: 0.5, delay: 0.6 },
  { id: 4, top: '34%', left: '21%', size: 2.2, opacity: 0.75, delay: 2.1 },
  { id: 5, top: '16%', left: '38%', size: 2, opacity: 0.6, delay: 1.5 },
  { id: 6, top: '14%', right: '36%', size: 2.2, opacity: 0.8, delay: 0.3 },
  { id: 7, top: '26%', right: '25%', size: 10, opacity: 0.9, delay: 1.8, isStar: true },
  { id: 8, top: '9%', right: '16%', size: 2, opacity: 0.6, delay: 2.4 },
  { id: 9, top: '36%', right: '11%', size: 2.4, opacity: 0.75, delay: 0.8 },
  { id: 10, top: '18%', right: '5%', size: 1.8, opacity: 0.55, delay: 1.6 },
  { id: 11, top: '62%', left: '9%', size: 2.2, opacity: 0.7, delay: 2.7 },
  { id: 12, top: '74%', left: '22%', size: 2, opacity: 0.5, delay: 0.9 },
  { id: 13, top: '58%', right: '20%', size: 2, opacity: 0.6, delay: 1.4 },
  { id: 14, top: '76%', right: '7%', size: 9, opacity: 0.85, delay: 2.0, isStar: true },
  { id: 15, top: '48%', left: '5%', size: 2, opacity: 0.6, delay: 0.5 },
  { id: 16, top: '54%', right: '32%', size: 1.6, opacity: 0.45, delay: 1.9 },
  { id: 17, top: '82%', left: '16%', size: 2, opacity: 0.5, delay: 2.3 },
  { id: 18, top: '42%', left: '34%', size: 1.6, opacity: 0.45, delay: 0.7 },
  { id: 19, top: '68%', right: '44%', size: 2, opacity: 0.6, delay: 1.1 },
  { id: 20, top: '86%', right: '24%', size: 2.2, opacity: 0.7, delay: 2.5 },
  { id: 21, top: '28%', left: '48%', size: 2, opacity: 0.5, delay: 1.7 },
  { id: 22, top: '19%', right: '48%', size: 8, opacity: 0.75, delay: 3.1, isStar: true },
  { id: 23, top: '80%', left: '33%', size: 1.8, opacity: 0.45, delay: 0.4 },
  { id: 24, top: '84%', right: '38%', size: 2, opacity: 0.55, delay: 2.2 },
  { id: 25, top: '5%', left: '46%', size: 2, opacity: 0.6, delay: 1.0 },
  { id: 26, top: '46%', right: '8%', size: 2, opacity: 0.65, delay: 1.3 },
  { id: 27, top: '30%', left: '3%', size: 1.8, opacity: 0.5, delay: 2.8 },
  { id: 28, top: '90%', left: '8%', size: 2, opacity: 0.5, delay: 0.2 },
  { id: 29, top: '66%', left: '43%', size: 1.6, opacity: 0.45, delay: 1.6 },
  { id: 30, top: '92%', right: '14%', size: 1.8, opacity: 0.55, delay: 2.6 },
  { id: 31, top: '4%', right: '28%', size: 2.2, opacity: 0.6, delay: 0.8 },
  { id: 32, top: '50%', left: '18%', size: 8, opacity: 0.8, delay: 1.4, isStar: true },
  { id: 33, top: '70%', right: '15%', size: 2, opacity: 0.5, delay: 2.9 },
  { id: 34, top: '15%', left: '19%', size: 1.6, opacity: 0.4, delay: 3.0 },
  { id: 35, top: '38%', right: '41%', size: 2, opacity: 0.55, delay: 0.7 },
  { id: 36, top: '88%', left: '48%', size: 2, opacity: 0.5, delay: 1.9 },
];

/**
 * DarkPageHeaderAtmosphere:
 * Renders the deep navy-to-blue gradient atmosphere with small scattered star/dot particles
 * exactly matching the user's Storyset reference image.
 */
export function DarkPageHeaderAtmosphere({ className = '' }) {
  return (
    <div 
      aria-hidden="true" 
      className={`absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0 ${className}`}
      style={{
        background: 'linear-gradient(180deg, #02091A 0%, #041438 35%, #072B72 70%, #0A3C94 100%)',
      }}
    >
      {/* Central Blue Ambient Radial Glow */}
      <div 
        className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[800px] sm:w-[1100px] h-[350px] sm:h-[450px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 90%, rgba(18, 140, 242, 0.28) 0%, rgba(7, 60, 160, 0.2) 45%, transparent 75%)',
        }}
      />

      {/* Subtle Cyan Atmosphere Pulse */}
      <div 
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(14, 165, 233, 0.12) 0%, transparent 70%)',
        }}
      />

      {/* Scattered White Star / Dot Particles */}
      {STAR_PARTICLES.map((p) => {
        const style = {
          top: p.top,
          left: p.left,
          right: p.right,
          animationDelay: `${p.delay}s`,
        };

        if (p.isStar) {
          return (
            <div
              key={`star-${p.id}`}
              style={style}
              className="absolute pointer-events-none select-none text-white animate-star-twinkle drop-shadow-[0_0_4px_rgba(255,255,255,0.85)]"
            >
              <MicroSparkle size={p.size} />
            </div>
          );
        }

        return (
          <div
            key={`dot-${p.id}`}
            style={{
              ...style,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
            }}
            className="absolute rounded-full bg-white animate-star-twinkle drop-shadow-[0_0_3px_rgba(255,255,255,0.8)]"
          />
        );
      })}
    </div>
  );
}

/**
 * DarkPageHeader:
 * Reusable premium dark page entry header across all interior pages.
 * Features:
 * - Deep navy gradient with scattered star/dot particles
 * - White Playfair Display heading
 * - High-contrast text, breadcrumb, and category pills
 * - Optional custom layout via children
 */
export default function DarkPageHeader({
  badgeText,
  badgeIcon = Sparkles,
  title,
  titleHighlight,
  subtitle,
  breadcrumbText,
  backTo = '/',
  backLabel = 'Back to Home',
  onBack,
  maxWidth = 'max-w-5xl',
  className = '',
  children,
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(backTo);
    }
  };

  const BadgeIconComponent = badgeIcon;

  return (
    <header className={`relative w-full overflow-hidden bg-[#02091A] rounded-2xl sm:rounded-3xl flex flex-col justify-between pb-8 sm:pb-12 shadow-[0_12px_36px_rgba(2,9,26,0.28)] border border-white/10 ${className}`}>
      {/* Premium Dark Gradient + Star/Dot Particles Atmosphere */}
      <DarkPageHeaderAtmosphere />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col w-full h-full">
        {/* Breadcrumb Navigation Row */}
        <div className={`${maxWidth} mx-auto w-full px-4 pt-6 sm:pt-8 flex items-center justify-between`}>
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/15 px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-md shadow-xs transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168CFF]"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-[#38BDF8]" />
            <span>{backLabel}</span>
          </button>

          {breadcrumbText && (
            <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider hidden sm:inline">
              {breadcrumbText}
            </span>
          )}
        </div>

        {/* Standard Centered Hero Header or Custom Children */}
        {children ? (
          children
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`flex flex-col items-center px-4 pt-5 sm:pt-7 text-center select-none ${maxWidth} mx-auto w-full`}
          >
            {/* Category Pill Tag */}
            {badgeText && (
              <div className="inline-flex items-center gap-2 bg-[#0A2660]/85 backdrop-blur-md rounded-full px-4 py-1.5 shadow-xs border border-[#168CFF]/35 text-[12px] sm:text-[12.5px] font-semibold text-[#BAE6FD] mb-3.5">
                {BadgeIconComponent && <BadgeIconComponent className="w-3.5 h-3.5 text-[#F4B400]" />}
                <span>{badgeText}</span>
              </div>
            )}

            {/* Page Heading */}
            {title && (
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-bold text-white tracking-tight leading-[1.18] font-heading break-words px-2 max-w-3xl">
                {title}
                {titleHighlight && (
                  <span className="italic text-[#38BDF8] ml-2">
                    {titleHighlight}
                  </span>
                )}
              </h1>
            )}

            {/* Subheading Description */}
            {subtitle && (
              <p className="mt-3.5 sm:mt-4 text-slate-200 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-normal">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </header>
  );
}
