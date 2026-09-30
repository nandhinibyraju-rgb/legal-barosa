import React from 'react';
import { ShieldCheck, Star, Scale } from 'lucide-react';
import CardBorderTrace from './CardBorderTrace';

export default function StatsBar({ onOpenConsult }) {
  const stats = [
    {
      id: 'cases',
      icon: ShieldCheck,
      iconColor: 'text-[#168CFF]',
      iconBg: 'bg-blue-50/80 border border-[#168CFF]/20',
      title: '15,000+ Cases',
      subtitle: 'Successfully Handled',
      action: () => onOpenConsult?.('15,000+ Cases'),
    },
    {
      id: 'reviews',
      icon: Star,
      iconColor: 'text-[#F4B400] fill-[#F4B400]',
      iconBg: 'bg-amber-50/80 border border-[#F4B400]/25',
      title: '4.9 / 5.0 Rating',
      subtitle: 'Verified Client Trust',
      action: () => {
        const el = document.getElementById('client-stories');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          onOpenConsult?.('Client Satisfaction');
        }
      },
    },
    {
      id: 'network',
      icon: Scale,
      iconColor: 'text-[#123E8A]',
      iconBg: 'bg-blue-50/80 border border-[#123E8A]/20',
      title: 'Pan-India Coverage',
      subtitle: '500+ Verified Advocates',
      action: () => onOpenConsult?.('Advocates Network'),
    },
  ];

  return (
    <div 
      aria-label="Key Trust Statistics"
      className="relative z-10 w-full py-0"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 sm:gap-2.5">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const delays = [0, 1.5, 3.0];
            return (
              <div
                key={stat.id}
                onClick={stat.action}
                className="group relative rounded-xl sm:rounded-2xl py-1 px-3 sm:py-1.5 sm:px-3.5 bg-white border border-neutral-200/80 flex items-center gap-2.5 sm:gap-3 text-left shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_18px_-4px_rgba(11,42,91,0.09),0_0_12px_rgba(22,140,255,0.12)] transition-all duration-300 cursor-pointer hover:-translate-y-0.5 overflow-visible select-none min-h-[42px]"
              >
                {/* Glowing Travelling Border Beam */}
                <CardBorderTrace delay={delays[index]} borderRadius={14} />

                <div className={`relative z-10 w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-lg ${stat.iconBg} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${stat.iconColor}`} />
                </div>
                <div className="relative z-10 flex flex-col">
                  <div className="font-semibold text-[#0B2A5B] text-[12px] sm:text-[13px] tracking-tight group-hover:text-[#168CFF] transition-colors leading-tight">
                    {stat.title}
                  </div>
                  <div className="text-[10px] sm:text-[10.5px] text-neutral-500 font-normal leading-tight mt-0.5">
                    {stat.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
