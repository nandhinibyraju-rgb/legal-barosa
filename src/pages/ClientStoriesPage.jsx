import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ShieldCheck, 
  Scale, 
  CheckCircle2, 
  Sparkles,
  Search,
  Filter,
  Layers
} from 'lucide-react';
import Footer from '../components/Footer';
import TrustStrip from '../components/TrustStrip';
import DarkPageHeader from '../components/DarkPageHeader';
import CaseStoryCard from '../components/CaseStoryCard';
import { 
  CLIENT_REVIEWS, 
  REVIEW_CATEGORIES 
} from '../data/reviewsData';
import { subscribePublishedClientStories } from '../services/firestoreService';
import { useTranslation } from 'react-i18next';

export default function ClientStoriesPage({
  user: _user,
  userProfile: _userProfile,
  onOpenConsult,
  onOpenSignIn: _onOpenSignIn,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveStories, setLiveStories] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.title = 'Client Stories & Real Results | Verified Case Studies | LegalBharosa';
    const unsub = subscribePublishedClientStories((list) => {
      setLiveStories(list || []);
    });
    return () => unsub();
  }, []);

  // Combined reviews (live Firestore published stories + base verified reviews)
  const allReviews = useMemo(() => {
    if (liveStories.length > 0) {
      const mappedLive = liveStories.map((s) => ({
        id: s.id,
        clientName: s.clientName,
        city: s.city || '',
        caseTopic: s.caseTopic,
        category: s.category || 'OTS',
        reviewText: s.reviewText,
        caseSummary: s.caseSummary || { exposure: '', resolution: '', timeline: '' },
      }));
      return [...mappedLive, ...CLIENT_REVIEWS];
    }
    return CLIENT_REVIEWS;
  }, [liveStories]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return allReviews.filter((review) => {
      const matchesCategory = selectedCategory === 'All' || review.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      const cs = review.caseSummary;
      return (
        review.clientName.toLowerCase().includes(query) ||
        review.caseTopic.toLowerCase().includes(query) ||
        review.reviewText.toLowerCase().includes(query) ||
        review.category.toLowerCase().includes(query) ||
        (cs?.exposure && cs.exposure.toLowerCase().includes(query)) ||
        (cs?.resolution && cs.resolution.toLowerCase().includes(query)) ||
        (cs?.timeline && cs.timeline.toLowerCase().includes(query))
      );
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] p-2 sm:p-3 lg:p-3.5 font-inter text-neutral-900 selection:bg-[#168CFF]/20 selection:text-[#0B2A5B] flex flex-col gap-3 sm:gap-4 overflow-x-hidden">
      
      {/* 1. TOP HERO HEADER */}
      <DarkPageHeader
        breadcrumbText={t('clientStories.breadcrumb', 'Verified Case Studies')}
        maxWidth="max-w-5xl"
      >
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center px-4 pt-5 sm:pt-7 text-center select-none max-w-4xl mx-auto w-full"
        >
          <div className="inline-flex items-center gap-2 bg-[#0A2660]/85 backdrop-blur-md rounded-full px-4 py-1.5 shadow-xs border border-[#168CFF]/35 text-[12px] sm:text-[12.5px] font-semibold text-[#BAE6FD] mb-3.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
            <span>{t('clientStories.heroBadge', 'Real Client Case Studies')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-bold text-white tracking-tight leading-[1.18] font-heading">
            {t('clientStories.heroTitle', 'Real People. Real Results.')}
          </h1>

          <p className="mt-3.5 sm:mt-4 text-slate-200 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-normal">
            {t('clientStories.heroSubtitle', 'Read factual case summaries documenting how borrowers and business promoters resolved debt, defended statutory rights, stayed auctions, and reached structured settlements.')}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-medium text-slate-200">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {t('clientStories.outcomesBadge', 'Documented Outcomes')}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
              {t('clientStories.lawsBadge', 'OTS • SARFAESI • DRT • ARC')}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-2xs">
              <Scale className="w-3.5 h-3.5 text-[#FBBF24]" />
              {t('clientStories.rbiBadge', 'Strict RBI Fair Practice Compliance')}
            </span>
          </div>
        </motion.div>
      </DarkPageHeader>

      {/* 2. FILTER TABS & SEARCH BAR */}
      <div className="max-w-6xl mx-auto w-full px-2 sm:px-4 mt-2">
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-3 sm:p-4 shadow-xs flex flex-col gap-3">
          {/* Top row: Category Pills */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1 mr-1 shrink-0">
                <Filter className="w-3.5 h-3.5" />
                <span>{t('clientStories.filterLabel', 'Filter:')}</span>
              </span>

              {REVIEW_CATEGORIES.map((category) => {
                const isActive = selectedCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#0B2A5B] text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80 hover:text-neutral-900'
                    }`}
                  >
                    <span>{category === 'All' ? t('clientStories.all', 'All') : category}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom row: Search input & summary */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2 border-t border-neutral-100">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('clientStories.searchPlaceholder', 'Search case stories (e.g. Shiva, ₹4.2 Cr, auction, stay, OTS)...')}
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
              {selectedCategory !== 'All' || searchQuery.trim() ? (
                <>{t('clientStories.showingMatching', { count: filteredReviews.length, defaultValue: `Showing ${filteredReviews.length} matching stories` })}</>
              ) : (
                <span className="text-neutral-500">{t('clientStories.verifiedStoriesHeading', 'Verified Client Case Stories')}</span>
              )}
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
              <h3 className="text-base font-bold text-[#0B2A5B]">{t('clientStories.noStoriesTitle', 'No matching case studies found')}</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm">
                {t('clientStories.noStoriesSubtitle', 'Try selecting another category or clearing your search keywords.')}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-full bg-[#0B2A5B] text-white text-xs font-semibold hover:bg-[#168CFF] transition-colors"
              >
                {t('clientStories.resetFilters', 'Reset Filters')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredReviews.map((review, index) => (
                <CaseStoryCard
                  key={review.id}
                  review={review}
                  delay={(index % 4) * 0.8}
                  index={index}
                  showFullTextDefault={false}
                />
              ))}
            </div>
          )}

          {/* 4. BOTTOM ACTION & CONSULTATION CTA */}
          <div className="mt-12 sm:mt-16 bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 p-6 sm:p-10 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
            <div 
              aria-hidden="true" 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-radial from-blue-50/80 via-transparent to-transparent pointer-events-none -z-10" 
            />

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0B2A5B] tracking-tight">
              {t('clientStories.ctaTitle', 'Facing a similar loan or recovery situation?')}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-lg leading-relaxed">
              {t('clientStories.ctaSubtitle', 'Book a 100% confidential consultation. Our verified panel advocates evaluate your case merits and draft actionable legal options.')}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenConsult?.('Client Stories Page Consultation')}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-full bg-[#0B2A5B] hover:bg-[#123E8A] text-white text-[14px] font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer min-h-[44px] group"
              >
                <span>{t('clientStories.ctaButton', 'Book a Free Consultation')}</span>
                <ArrowRight className="w-4 h-4 text-[#F4B400] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/faq')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#0B2A5B] text-[13.5px] font-semibold transition-colors cursor-pointer min-h-[44px]"
              >
                <span>{t('clientStories.readFaq', 'Read FAQ')}</span>
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
// Final submission update
