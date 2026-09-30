import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Scale, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  Search,
  Filter,
  Layers,
  FileCheck
} from 'lucide-react';
import Footer from '../components/Footer';
import TrustStrip from '../components/TrustStrip';
import CardBorderTrace from '../components/CardBorderTrace';
import { 
  CLIENT_REVIEWS, 
  REVIEW_CATEGORIES, 
  CATEGORY_THEMES 
} from '../data/reviewsData';

export default function ClientStoriesPage({
  user: _user,
  userProfile: _userProfile,
  onOpenConsult,
  onOpenSignIn: _onOpenSignIn,
}) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.title = 'Client Stories & Real Results | 40 Verified Case Studies | LegalBharosa';
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: CLIENT_REVIEWS.length };
    REVIEW_CATEGORIES.forEach((cat) => {
      if (cat !== 'All') {
        counts[cat] = CLIENT_REVIEWS.filter((r) => r.category === cat).length;
      }
    });
    return counts;
  }, []);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return CLIENT_REVIEWS.filter((review) => {
      const matchesCategory = selectedCategory === 'All' || review.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        review.clientName.toLowerCase().includes(query) ||
        review.caseTopic.toLowerCase().includes(query) ||
        review.reviewText.toLowerCase().includes(query) ||
        review.category.toLowerCase().includes(query)
      );
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen w-full bg-[#EDEDED] p-2 sm:p-3 lg:p-3.5 font-inter text-neutral-900 selection:bg-[#168CFF]/20 selection:text-[#0B2A5B] flex flex-col gap-3 sm:gap-4 overflow-x-hidden">
      
      {/* 1. TOP HERO HEADER */}
      <header className="relative w-full overflow-hidden bg-[#d9d9d9] rounded-2xl sm:rounded-3xl flex flex-col justify-between pb-8 sm:pb-12 shadow-sm border border-neutral-200/60">
        <img
          src="/assets/hero-sky-clean.jpg"
          alt="Clean sky background for client stories and success"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          loading="eager"
        />

        <div className="absolute inset-0 bg-white/20 pointer-events-none" />

        <div className="relative z-10 flex flex-col w-full h-full">
          <div className="max-w-6xl mx-auto w-full px-4 pt-6 sm:pt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#0B2A5B] hover:text-[#168CFF] bg-white/80 hover:bg-white px-3 py-1.5 rounded-full border border-neutral-200/80 shadow-xs transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168CFF]"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Home</span>
            </button>

            <span className="text-[11px] font-mono text-neutral-600 uppercase tracking-wider hidden sm:inline">
              Verified Case Studies / 40 Client Results
            </span>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center px-4 pt-4 sm:pt-6 text-center select-none max-w-4xl mx-auto w-full"
          >
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-xs border border-[#168CFF]/20 text-[12.5px] font-semibold text-[#0B2A5B] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
              <span>40 Real Client Case Studies</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B2A5B] tracking-tight leading-[1.15] font-inter">
              Real People. Real Results.
            </h1>

            <p className="mt-3 sm:mt-4 text-neutral-700 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
              Read factual case summaries documenting how borrowers and business promoters resolved debt, defended statutory rights, stayed auctions, and reached structured settlements.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-medium text-[#0B2A5B]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-neutral-200/80 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                40 Documented Outcomes
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-neutral-200/80 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#168CFF]" />
                OTS &bull; SARFAESI &bull; DRT &bull; ARC
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-neutral-200/80 shadow-2xs">
                <Scale className="w-3.5 h-3.5 text-[#b45309]" />
                Strict RBI Fair Practice Compliance
              </span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* 2. FILTER TABS & SEARCH BAR */}
      <div className="max-w-6xl mx-auto w-full px-2 sm:px-4 mt-2">
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-3 sm:p-4 shadow-xs flex flex-col gap-3">
          {/* Top row: Category Pills */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1 mr-1 shrink-0">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter:</span>
              </span>

              {REVIEW_CATEGORIES.map((category) => {
                const isActive = selectedCategory === category;
                const count = categoryCounts[category] || 0;
                const theme = CATEGORY_THEMES[category];

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#0B2A5B] text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80 hover:text-neutral-900'
                    }`}
                  >
                    <span>{category}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom row: Search input & summary count */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2 border-t border-neutral-100">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search case studies (e.g. Shiva, ₹4.2 Cr, auction, stay, OTS)..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#168CFF]/30 focus:border-[#168CFF] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="text-xs text-neutral-500 font-medium self-center">
              Showing <span className="font-bold text-[#0B2A5B]">{filteredReviews.length}</span> of {CLIENT_REVIEWS.length} case studies
            </div>
          </div>
        </div>
      </div>

      {/* 3. CASE STUDY REVIEWS GRID */}
      <main className="w-full py-4 sm:py-6 px-2 sm:px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-neutral-200/90 p-12 text-center flex flex-col items-center justify-center my-8">
              <Layers className="w-10 h-10 text-neutral-300 mb-3" />
              <h3 className="text-base font-bold text-[#0B2A5B]">No matching case studies found</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm">
                Try selecting another category or clearing your search keywords.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-full bg-[#0B2A5B] text-white text-xs font-semibold hover:bg-[#168CFF] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredReviews.map((review, index) => {
                const theme = CATEGORY_THEMES[review.category] || CATEGORY_THEMES.OTS;

                return (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ 
                      duration: 0.65, 
                      delay: (index % 3) * 0.1,
                      ease: [0.25, 1, 0.5, 1] 
                    }}
                    className={`group relative rounded-2xl bg-white border border-neutral-200/90 p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_18px_rgba(0,0,0,0.03)] ${theme.hoverShadow} ${theme.hoverBorder} select-none text-left overflow-hidden`}
                  >
                    {/* Travelling Border Accent on hover */}
                    <CardBorderTrace delay={(index % 4) * 0.8} borderRadius={16} />

                    {/* TOP: Category Tag & Verified Badge */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${theme.badgeClass}`}>
                          <span>{review.category}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Verified Review</span>
                        </span>
                      </div>

                      {/* CASE TOPIC HEADLINE */}
                      <h2 className="text-[15.5px] sm:text-[16.5px] font-bold text-[#0B2A5B] tracking-tight leading-snug group-hover:text-[#0646A8] transition-colors mb-3">
                        {review.caseTopic}
                      </h2>

                      {/* REAL CLIENT REVIEW TEXT (Verbatim from PDF) */}
                      <div className="my-3">
                        <p className="text-[13px] sm:text-[13.5px] text-neutral-700 leading-relaxed font-normal">
                          "{review.reviewText}"
                        </p>
                      </div>
                    </div>

                    {/* CARD FOOTER: Client Name & Verified Badge */}
                    <div className="mt-5 pt-3.5 border-t border-neutral-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#0B2A5B]/10 border border-[#0B2A5B]/20 flex items-center justify-center font-bold text-[#0B2A5B] text-xs">
                          {review.clientName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-[#0B2A5B] text-[13px] block">
                            {review.clientName}
                          </span>
                          <span className="text-[10.5px] text-neutral-500 font-medium block">
                            {review.caseTopic}
                          </span>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 text-[10.5px] text-emerald-700 font-medium">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Original Review</span>
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* 4. BOTTOM ACTION & CONSULTATION CTA */}
          <div className="mt-12 sm:mt-16 bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 p-6 sm:p-10 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
            <div 
              aria-hidden="true" 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-radial from-blue-50/80 via-transparent to-transparent pointer-events-none -z-10" 
            />

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0B2A5B] tracking-tight">
              Facing a similar loan or recovery situation?
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-lg leading-relaxed">
              Book a 100% confidential consultation. Our verified panel advocates evaluate your case merits and draft actionable legal options.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenConsult?.('Client Stories Page Consultation')}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-full bg-[#0B2A5B] hover:bg-[#123E8A] text-white text-[14px] font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer min-h-[44px] group"
              >
                <span>Book a Free Consultation</span>
                <ArrowRight className="w-4 h-4 text-[#F4B400] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/faq')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#0B2A5B] text-[13.5px] font-semibold transition-colors cursor-pointer min-h-[44px]"
              >
                <span>Read FAQ</span>
              </button>
            </div>

            <div className="mt-3">
              <TrustStrip centered={true} />
            </div>
          </div>

        </div>
      </main>

      {/* 5. FOOTER */}
      <Footer
        onOpenConsult={onOpenConsult}
        onNavigateHome={() => navigate('/')}
        onNavigateToAbout={() => navigate('/about')}
      />

    </div>
  );
}
