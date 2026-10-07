import React from 'react';
import HeroIllustrationCarousel from './HeroIllustrationCarousel';
import StatsBar from './StatsBar';

export default function Hero({ onOpenConsult }) {
  return (
    <div className="flex flex-col items-center w-full select-none max-w-6xl mx-auto overflow-visible pt-0 sm:pt-0.5">
      {/* 
        The per-slide problem statement inside HeroIllustrationCarousel 
        is now the ONLY primary headline shown in the hero for each slide.
      */}
      <div className="w-full flex flex-col items-center justify-center overflow-visible">
        <HeroIllustrationCarousel onOpenConsult={onOpenConsult} />
      </div>

      {/* 
        Trust StatsBar integrated directly into Hero with tight spacing 
        so all 3 cards fit cleanly within a single viewport height (100vh)
      */}
      <div className="w-full max-w-5xl mx-auto mt-1 sm:mt-1.5 shrink-0 px-2 sm:px-4">
        <StatsBar onOpenConsult={onOpenConsult} />
      </div>
    </div>
  );
}
// Final submission update
