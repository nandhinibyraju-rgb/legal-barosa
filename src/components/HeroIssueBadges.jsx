import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Default SVGs for the 3 badges.
 * These are easily replaceable when the user provides custom SVGs.
 */
export const defaultBadgeIcons = {
  emi: (
    <svg
      className="w-4 h-4 text-[#0B2A5B]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a4.5 4.5 0 0 0 0-9" />
    </svg>
  ),
  harassment: (
    <svg
      className="w-4 h-4 text-[#168CFF]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  property: (
    <svg
      className="w-4 h-4 text-[#2B6CB0]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  help: (
    <svg
      className="w-4 h-4 text-[#D97706]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  shield: (
    <svg
      className="w-4 h-4 text-[#16A34A]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
};

export default function HeroIssueBadges({ customIcons = {}, className = '' }) {
  const containerRef = useRef(null);
  const badgesRef = useRef([]);

  const badges = [
    {
      id: 'emi',
      label: 'EMI Relief',
      icon: customIcons.emi || defaultBadgeIcons.emi,
      bgColor: 'bg-amber-500/10 text-amber-600',
      delay: '0s',
    },
    {
      id: 'harassment',
      label: 'Harassment Relief',
      icon: customIcons.harassment || defaultBadgeIcons.harassment,
      bgColor: 'bg-blue-500/10 text-[#168CFF]',
      delay: '0.4s',
    },
    {
      id: 'property',
      label: 'Property Dispute',
      icon: customIcons.property || defaultBadgeIcons.property,
      bgColor: 'bg-blue-500/10 text-blue-600',
      delay: '0.8s',
    },
  ];

  useEffect(() => {
    if (!containerRef.current || badgesRef.current.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        badgesRef.current,
        {
          opacity: 0,
          scale: 0.8,
          y: 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.15,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 z-20 ${className}`}
    >
      {badges.map((badge, idx) => (
        <div
          key={badge.id}
          ref={(el) => (badgesRef.current[idx] = el)}
          style={{
            animation: 'heroBadgeFloat 3.8s ease-in-out infinite alternate',
            animationDelay: badge.delay,
          }}
          className="group inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/95 backdrop-blur-md rounded-full border border-[#168CFF]/20 shadow-[0_4px_16px_rgba(11,42,91,0.08)] hover:shadow-[0_6px_22px_rgba(22,140,255,0.18)] hover:border-[#168CFF]/40 transition-all cursor-default select-none"
        >
          <span
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 ${badge.bgColor} border border-black/5 group-hover:scale-110 transition-transform`}
          >
            {badge.icon}
          </span>
          <span className="text-[12px] sm:text-[13px] font-semibold text-[#0B2A5B] tracking-tight">
            {badge.label}
          </span>
        </div>
      ))}
    </div>
  );
}
// Final submission update
