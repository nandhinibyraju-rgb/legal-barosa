import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  PenTool, 
  Sparkles, 
  Filter, 
  ArrowUpDown, 
  BookOpen, 
  ShieldCheck, 
  FileText, 
  X, 
  FolderPlus,
  Compass,
  TrendingUp,
  Clock,
  Heart,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import ArticleEditorModal from '../components/ArticleEditorModal';
import Footer from '../components/Footer';
import DarkPageHeader from '../components/DarkPageHeader';
import { 
  ARTICLE_CATEGORIES, 
  subscribeArticles,
  subscribeUserDrafts,
  deleteArticle
} from '../services/firestoreService';

export default function ArticlesPage({
  user,
  userProfile,
  onOpenConsult,
  onOpenSignIn,
}) {
  const navigate = useNavigate();

  // Articles state (Real data from Firestore)
  const [articles, setArticles] = useState([]);
  const [userDrafts, setUserDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'views' | 'likes' | 'relevance'
  const [activeTab, setActiveTab] = useState('community'); // 'community' | 'drafts'

  // Modals
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [authNotice, setAuthNotice] = useState(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // 1. Subscribe to published articles (Real-time Firestore)
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeArticles((fetched) => {
      setArticles(fetched);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Subscribe to user drafts if authenticated
  useEffect(() => {
    if (!user?.uid) {
      setUserDrafts([]);
      return;
    }
    const unsubDrafts = subscribeUserDrafts(user.uid, (drafts) => {
      setUserDrafts(drafts);
    });
    return () => unsubDrafts();
  }, [user?.uid]);

  // Handle open write modal
  const handleOpenWrite = () => {
    if (!user) {
      setAuthNotice('Please sign in with your LegalBharosa account to write and publish articles.');
      onOpenSignIn?.();
      return;
    }
    setEditingArticle(null);
    setEditorOpen(true);
  };

  const handleEditDraft = (draft) => {
    setEditingArticle(draft);
    setEditorOpen(true);
  };

  const handleDeleteDraft = async (draftId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this draft?')) return;
    try {
      await deleteArticle(draftId);
    } catch (err) {
      console.error('Failed to delete draft:', err);
    }
  };

  // Filter and Sort Pipeline
  const filteredArticles = useMemo(() => {
    let result = [...articles];

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter((a) => a.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((a) => {
        const inTitle = a.title?.toLowerCase().includes(q);
        const inContent = a.content?.toLowerCase().includes(q);
        const inCategory = a.category?.toLowerCase().includes(q);
        const inAuthor = a.authorName?.toLowerCase().includes(q);
        const inTags = a.tags?.some((t) => t.toLowerCase().includes(q));
        return inTitle || inContent || inCategory || inAuthor || inTags;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'views') {
        return (b.views || 0) - (a.views || 0);
      }
      if (sortBy === 'likes') {
        const countA = a.likes?.length || 0;
        const countB = b.likes?.length || 0;
        return countB - countA;
      }
      if (sortBy === 'relevance') {
        if (!searchQuery.trim()) {
          // If no search query, relevance is combination of views and likes
          const scoreA = (a.views || 0) * 0.5 + (a.likes?.length || 0) * 2;
          const scoreB = (b.views || 0) * 0.5 + (b.likes?.length || 0) * 2;
          return scoreB - scoreA;
        }
        // If search query is present, rank title matches higher
        const q = searchQuery.toLowerCase().trim();
        const scoreA = (a.title?.toLowerCase().includes(q) ? 10 : 0) + (a.category?.toLowerCase().includes(q) ? 5 : 0);
        const scoreB = (b.title?.toLowerCase().includes(q) ? 10 : 0) + (b.category?.toLowerCase().includes(q) ? 5 : 0);
        return scoreB - scoreA;
      }
      // 'latest' default
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
      return timeB - timeA;
    });

    return result;
  }, [articles, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] font-inter text-neutral-900 selection:bg-[#168CFF]/20 selection:text-[#0B2A5B] flex flex-col">
      
      {/* ======================================================== */}
      {/* 2. ARTICLES PAGE HERO (Premium Dark Header)              */}
      {/* ======================================================== */}
      <div className="w-full px-2 sm:px-3 pt-2 sm:pt-3">
        <DarkPageHeader
          breadcrumbText="Knowledge Hub / Articles"
          maxWidth="max-w-5xl"
        >
          <div className="relative z-10 max-w-4xl mx-auto px-4 pt-5 sm:pt-7 text-center flex flex-col items-center">
            
            {/* Subtle Category/Community Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A2660]/85 backdrop-blur-md border border-[#168CFF]/35 text-[#BAE6FD] text-xs font-semibold shadow-xs mb-3.5">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
              <span>LegalBharosa Knowledge Hub & Community</span>
            </div>

            {/* Page Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-bold text-white tracking-tight leading-[1.18] font-heading">
              LegalBharosa Articles
            </h1>

            {/* Subtitle */}
            <p className="mt-3.5 sm:mt-4 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-normal leading-relaxed">
              Learn, share, and understand your legal and financial options.
            </p>

            {/* Action Row: Prominent "+ Write an Article" Button */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleOpenWrite}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#168CFF] hover:bg-[#078BE8] text-white shadow-[0_4px_16px_rgba(22,140,255,0.3)] hover:shadow-[0_6px_22px_rgba(22,140,255,0.45)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <PenTool className="w-4 h-4 text-white" />
                <span>+ Write an Article</span>
              </button>

              {user && userDrafts.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'drafts' ? 'community' : 'drafts')}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold border transition-all cursor-pointer ${
                    activeTab === 'drafts'
                      ? 'bg-[#0B2A5B] text-white border-[#0B2A5B]'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>My Drafts ({userDrafts.length})</span>
                </button>
              )}
            </div>
          </div>
        </DarkPageHeader>

        {/* Auth Notice Toast */}
        {authNotice && (
          <div className="max-w-5xl mx-auto px-4 mt-3">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-3 max-w-md w-full animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{authNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setAuthNotice(null)}
                className="text-amber-700 hover:text-amber-900 text-xs font-semibold underline shrink-0 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. DISCOVERY & SEARCH BAR / CATEGORIES / FILTERS */}
      {/* ======================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        
        {/* Search Bar + Sort Dropdown Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 pb-6 border-b border-neutral-200/80">
          
          {/* Search Bar: "Search articles..." */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-9 py-2.5 rounded-full border border-neutral-300/90 text-sm placeholder-neutral-400 focus:outline-none focus:border-[#168CFF] focus:ring-2 focus:ring-[#168CFF]/15 transition-all bg-white shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-neutral-400" />
              Sort:
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-full px-3.5 py-2 pr-8 focus:outline-none focus:border-[#168CFF] cursor-pointer appearance-none shadow-2xs"
              >
                <option value="latest">Latest</option>
                <option value="views">Most Viewed</option>
                <option value="likes">Most Liked</option>
                <option value="relevance">Most Relevant</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-[10px]">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Categories Filter Pills */}
        <div className="pt-4 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {/* 'All' category pill */}
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-[#0B2A5B] text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900'
              }`}
            >
              All Categories
            </button>

            {/* Predefined 9 Categories */}
            {ARTICLE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#168CFF] text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. MAIN ARTICLES FEED / EMPTY STATE / DRAFTS */}
      {/* ======================================================== */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* Loading Spinner */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center text-neutral-400">
            <div className="w-10 h-10 border-3 border-[#168CFF] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium">Checking LegalBharosa articles feed...</p>
          </div>
        )}

        {/* Drafts View Tab (if user chose to view their drafts) */}
        {!loading && activeTab === 'drafts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0B2A5B]">Your Saved Drafts</h2>
                <p className="text-xs text-neutral-500">
                  Drafts are only visible to you until published.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('community')}
                className="text-xs font-semibold text-[#168CFF] hover:underline"
              >
                ← Back to Community Articles
              </button>
            </div>

            {userDrafts.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-neutral-300">
                <FileText className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-neutral-700">No saved drafts</p>
                <p className="text-xs text-neutral-500 mt-1">
                  When you save an article as a draft, it will be stored here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userDrafts.map((draft) => (
                  <div 
                    key={draft.id}
                    className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          Draft
                        </span>
                        <span className="text-xs text-neutral-400">
                          {draft.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#0B2A5B] text-base mb-2">
                        {draft.title || 'Untitled Draft'}
                      </h3>
                      <p className="text-xs text-neutral-500 line-clamp-3 mb-4">
                        {draft.content || 'No content yet...'}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                      <button
                        type="button"
                        onClick={(e) => handleDeleteDraft(draft.id, e)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditDraft(draft)}
                        className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#168CFF] text-white hover:bg-[#078BE8] cursor-pointer"
                      >
                        Edit / Publish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Community Feed / Empty State */}
        {!loading && activeTab === 'community' && (
          <>
            {filteredArticles.length === 0 ? (
              /* ======================================================== */
              /* 4. USER REQUESTED EMPTY STATE */
              /* ======================================================== */
              <div className="py-16 sm:py-20 px-4 flex flex-col items-center justify-center text-center max-w-xl mx-auto">
                
                {/* Visual Graphic with soft blue glow */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-blue-50 via-sky-100 to-indigo-50 border border-[#168CFF]/25 shadow-sm flex items-center justify-center">
                    <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-[#168CFF]" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#F4B400] text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>

                {/* User Requested Empty State Title */}
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2A5B] tracking-tight">
                  {searchQuery || selectedCategory !== 'All' 
                    ? 'No matching articles found' 
                    : 'No articles yet'}
                </h2>

                {/* User Requested Empty State Subtitle */}
                <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-neutral-600 max-w-md leading-relaxed">
                  {searchQuery || selectedCategory !== 'All'
                    ? 'Try adjusting your search terms or choose "All Categories" to see everything.'
                    : 'Be the first to share useful legal or financial knowledge with the LegalBharosa community.'}
                </p>

                {/* Actions Row */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  {(searchQuery || selectedCategory !== 'All') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                      }}
                      className="px-4 py-2.5 rounded-full text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  )}

                  {/* User Requested [ Write an Article ] CTA button */}
                  <button
                    type="button"
                    onClick={handleOpenWrite}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#168CFF] hover:bg-[#078BE8] text-white shadow-[0_4px_16px_rgba(22,140,255,0.3)] hover:shadow-[0_6px_22px_rgba(22,140,255,0.45)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    <PenTool className="w-4 h-4 text-white" />
                    <span>Write an Article</span>
                  </button>
                </div>

                {/* Safe & Informative Hint */}
                <div className="mt-8 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-500 max-w-md">
                  💡 Have experience with bank loan restructuring, recovery harassment defense, or legal notices? Write an article to help thousands facing similar challenges.
                </div>
              </div>
            ) : (
              /* ======================================================== */
              /* 5. WHEN REAL ARTICLES EXIST: GRID CARDS */
              /* ======================================================== */
              <div className="space-y-6">
                
                {/* Real-time Results Counter */}
                <div className="flex items-center justify-between text-xs text-neutral-500 pb-2">
                  <span>
                    Showing <strong className="text-neutral-800 font-semibold">{filteredArticles.length}</strong> {filteredArticles.length === 1 ? 'article' : 'articles'}
                    {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
                  </span>
                  {searchQuery && (
                    <span className="text-[#168CFF]">
                      Matching "{searchQuery}"
                    </span>
                  )}
                </div>

                {/* Article Feed Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                  {filteredArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      user={user}
                      onOpenSignIn={onOpenSignIn}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ======================================================== */}
        {/* 10. MODERATION & INFORMATIONAL NOTICE BANNER */}
        {/* ======================================================== */}
        <div className="mt-14 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-slate-50 border border-blue-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#0B2A5B] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-[#F4B400]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0B2A5B]">
                LegalBharosa Community Knowledge Disclaimer
              </h4>
              <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed max-w-2xl">
                Community articles are authored for informational and awareness purposes only and do not automatically constitute formal legal advice. For personalized case evaluation and official representation, consult our panel advocates.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenConsult?.('Community Legal Guidance')}
            className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#0B2A5B] text-white hover:bg-[#168CFF] transition-colors shrink-0 cursor-pointer shadow-xs whitespace-nowrap"
          >
            Speak to a Legal Expert
          </button>
        </div>

      </main>

      {/* Editor Modal for creating & editing articles */}
      <ArticleEditorModal
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        user={user}
        userProfile={userProfile}
        onOpenSignIn={onOpenSignIn}
        editingArticle={editingArticle}
        onSaved={(id) => {
          setEditorOpen(false);
          if (id) {
            navigate(`/articles/${id}`);
          }
        }}
      />

      {/* Footer */}
      <Footer
        onOpenConsult={onOpenConsult}
        onNavigateHome={() => {
          navigate('/');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToAbout={() => navigate('/about')}
      />

    </div>
  );
}
