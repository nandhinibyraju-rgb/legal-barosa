import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MessageSquare, 
  Eye, 
  Share2, 
  Clock, 
  Calendar, 
  ArrowLeft, 
  Bookmark, 
  User, 
  Check, 
  ShieldCheck, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  Flag, 
  Send, 
  Sparkles,
  ChevronRight,
  BookOpen,
  MessageCircle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import ArticleEditorModal from '../components/ArticleEditorModal';
import ReportModal from '../components/ReportModal';
import { DarkPageHeaderAtmosphere } from '../components/DarkPageHeader';
import { 
  getArticle, 
  incrementArticleViews, 
  toggleArticleLike, 
  toggleArticleBookmark,
  subscribeArticleComments,
  addArticleComment,
  deleteArticleComment,
  deleteArticle,
  getUserArticlesCount,
  subscribeArticles
} from '../services/firestoreService';
import { useTranslation } from 'react-i18next';

export default function ArticleDetailPage({
  user,
  userProfile,
  onOpenConsult,
  onOpenSignIn,
}) {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  // Core Article State
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Author details
  const [authorArticlesCount, setAuthorArticlesCount] = useState(0);

  // Engagement state
  const [likes, setLikes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [views, setViews] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [copied, setCopied] = useState(false);

  // Comments state
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Related Articles
  const [relatedArticles, setRelatedArticles] = useState([]);

  // Modals
  const [editorOpen, setEditorOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState({ type: 'article', id: '' });

  const isAdmin = userProfile?.role === 'admin';
  const isAuthor = user?.uid && article?.authorId === user.uid;
  const canModify = isAuthor || isAdmin;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  // 1. Fetch Article on Mount
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    const fetchCurrentArticle = async () => {
      try {
        const data = await getArticle(id);
        if (!isMounted) return;

        if (!data) {
          setError('Article not found or has been removed.');
          setLoading(false);
          return;
        }

        setArticle(data);
        setLikes(data.likes || []);
        setBookmarks(data.bookmarks || []);
        setViews((data.views || 0) + 1);

        // Track view
        incrementArticleViews(id);

        // Fetch Author Articles Count
        if (data.authorId) {
          getUserArticlesCount(data.authorId).then((cnt) => {
            if (isMounted) setAuthorArticlesCount(cnt);
          });
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        if (isMounted) setError('Could not load article. Please check your connection.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCurrentArticle();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // 2. Subscribe to Comments
  useEffect(() => {
    if (!id) return;
    const unsub = subscribeArticleComments(id, (commentList) => {
      setComments(commentList);
    });
    return () => unsub();
  }, [id]);

  // 3. Fetch Related Articles
  useEffect(() => {
    if (!article) return;
    const unsub = subscribeArticles((allArticles) => {
      const related = allArticles
        .filter((a) => a.id !== id && (a.category === article.category || !article.category))
        .slice(0, 3);
      setRelatedArticles(related);
    });
    return () => unsub();
  }, [id, article?.category]);

  // Date Formatter
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recent';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds ? timestamp.seconds * 1000 : timestamp);
      return new Intl.DateTimeFormat('en-IN', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    } catch {
      return 'Recent';
    }
  };

  // Like Toggle
  const handleLike = async () => {
    if (!user) {
      onOpenSignIn?.();
      return;
    }
    if (isLiking) return;

    setIsLiking(true);
    const hasLiked = likes.includes(user.uid);
    const updatedLikes = hasLiked ? likes.filter((uid) => uid !== user.uid) : [...likes, user.uid];
    setLikes(updatedLikes);

    try {
      await toggleArticleLike(id, user.uid);
    } catch (err) {
      console.error('Like toggle failed:', err);
      setLikes(likes);
    } finally {
      setIsLiking(false);
    }
  };

  // Bookmark Toggle
  const handleBookmark = async () => {
    if (!user) {
      onOpenSignIn?.();
      return;
    }
    if (isBookmarking) return;

    setIsBookmarking(true);
    const hasBookmarked = bookmarks.includes(user.uid);
    const updatedBookmarks = hasBookmarked ? bookmarks.filter((uid) => uid !== user.uid) : [...bookmarks, user.uid];
    setBookmarks(updatedBookmarks);

    try {
      await toggleArticleBookmark(id, user.uid);
    } catch (err) {
      console.error('Bookmark toggle failed:', err);
      setBookmarks(bookmarks);
    } finally {
      setIsBookmarking(false);
    }
  };

  // Share Article
  const handleShare = async () => {
    const articleUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt || article.title,
          url: articleUrl,
        });
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Share error:', err);
        }
      }
    }

    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Copy link error:', err);
    }
  };

  // WhatsApp Share
  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`*${article.title}*\n\nRead this legal insight on LegalBharosa:\n${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Add Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      onOpenSignIn?.();
      return;
    }
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      const authorName = user.displayName || userProfile?.name || (user.email ? user.email.split('@')[0] : 'Community Member');
      const authorPhoto = user.photoURL || userProfile?.photoURL || null;

      await addArticleComment({
        articleId: id,
        authorId: user.uid,
        authorName,
        authorPhoto,
        content: commentText.trim(),
      });

      setCommentText('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await deleteArticleComment(commentId, id);
    } catch (err) {
      console.error('Delete comment error:', err);
    }
  };

  // Delete Article
  const handleDeleteArticle = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this article? This cannot be undone.')) return;
    try {
      await deleteArticle(id);
      navigate('/articles');
    } catch (err) {
      console.error('Delete article error:', err);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-3 border-[#168CFF] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-neutral-500">{t('articleDetail.loadingArticle', 'Loading article...')}</p>
      </div>
    );
  }

  // Error / Not Found State
  if (error || !article) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 mb-2">{t('articleDetail.articleNotFound', 'Article Not Found')}</h2>
        <p className="text-sm text-neutral-600 max-w-sm mb-6">
          {error || t('articleDetail.articleNotFoundDesc', 'This article may have been removed or the link is incorrect.')}
        </p>
        <button
          type="button"
          onClick={() => navigate('/articles')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#168CFF] text-white hover:bg-[#078BE8] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('articleDetail.returnToArticles', 'Return to Articles Feed')}</span>
        </button>
      </div>
    );
  }

  const hasLiked = user?.uid ? likes.includes(user.uid) : false;
  const hasBookmarked = user?.uid ? bookmarks.includes(user.uid) : false;

  const authorInitials = (article.authorName || 'LB')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] font-inter text-neutral-900 selection:bg-[#168CFF]/20 selection:text-[#0B2A5B] flex flex-col">
      
      {/* Top Dark Header with Navy Gradient, Stars Atmosphere & Article Title */}
      <section className="relative w-full pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#1E4E8C]/30 overflow-hidden">
        <DarkPageHeaderAtmosphere />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between gap-3 text-xs text-blue-200/80 mb-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 truncate">
              <Link to="/" className="hover:text-white transition-colors">{t('nav.home', 'Home')}</Link>
              <ChevronRight className="w-3.5 h-3.5 text-blue-300/40 shrink-0" />
              <Link to="/articles" className="hover:text-white transition-colors">{t('nav.articles', 'Articles')}</Link>
              <ChevronRight className="w-3.5 h-3.5 text-blue-300/40 shrink-0" />
              <span className="text-white font-medium truncate max-w-[200px] sm:max-w-xs">
                {article.category}
              </span>
            </nav>

            <button
              type="button"
              onClick={() => navigate('/articles')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300 hover:text-white transition-colors shrink-0 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('articleDetail.backToArticles', 'Back to Articles')}</span>
            </button>
          </div>

          {/* Category & Reading Time */}
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-md border border-white/20 shadow-xs">
              {article.category}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-blue-200 bg-white/10 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-full">
              <Clock className="w-3 h-3 text-[#58A6FF]" />
              <span>{article.readingTime || 3} {t('articles.readTime', 'min read')}</span>
            </span>
            <span className="text-xs text-blue-200/70">
              {t('articles.publishedOn', 'Published on')} {formatDate(article.createdAt)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-heading font-bold text-white leading-[1.2] tracking-tight">
            {article.title}
          </h1>
        </div>
      </section>

      {/* Main Article Container */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        
        {/* Author Card & Engagement Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Author info (Real authenticated user data) */}
          <div className="flex items-center gap-3">
            {article.authorPhoto ? (
              <img
                src={article.authorPhoto}
                alt={article.authorName}
                className="w-11 h-11 rounded-full object-cover border border-neutral-300 shadow-2xs"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#0B2A5B] text-white text-sm font-bold flex items-center justify-center shadow-2xs">
                {authorInitials}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-neutral-900 leading-tight">
                  {article.authorName || 'LegalBharosa Contributor'}
                </h3>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  Contributor
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {authorArticlesCount > 0 ? (
                  <span>{authorArticlesCount} {authorArticlesCount === 1 ? 'published article' : 'published articles'}</span>
                ) : (
                  <span>Community Member</span>
                )}
              </p>
            </div>
          </div>

          {/* Interactive Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 self-end sm:self-center">
            
            {/* Like Button */}
            <button
              type="button"
              onClick={handleLike}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                hasLiked
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-neutral-300 text-neutral-700 hover:border-neutral-400'
              }`}
              title={hasLiked ? 'Unlike article' : 'Like article'}
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current text-rose-600 scale-110' : ''}`} />
              <span>{likes.length}</span>
            </button>

            {/* Bookmark Button */}
            <button
              type="button"
              onClick={handleBookmark}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                hasBookmarked
                  ? 'bg-amber-50 border-amber-200 text-[#F4B400]'
                  : 'bg-white border-neutral-300 text-neutral-600 hover:border-neutral-400'
              }`}
              title={hasBookmarked ? 'Bookmarked' : 'Save bookmark'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${hasBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Share Menu / Copy Link */}
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 text-xs font-semibold cursor-pointer transition-colors"
              title="Share article"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-neutral-500" />}
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>

            {/* WhatsApp Share */}
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="p-2 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
              title="Share on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </button>

            {/* Moderation / Owner Actions */}
            {canModify ? (
              <div className="flex items-center gap-1 ml-1 pl-1 border-l border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditorOpen(true)}
                  className="p-2 rounded-full hover:bg-blue-50 text-neutral-500 hover:text-[#168CFF] transition-colors cursor-pointer"
                  title="Edit your article"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleDeleteArticle}
                  className="p-2 rounded-full hover:bg-rose-50 text-neutral-500 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Delete article"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setReportTarget({ type: 'article', id: article.id });
                  setReportModalOpen(true);
                }}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                title="Report article"
              >
                <Flag className="w-3.5 h-3.5" />
              </button>
            )}

          </div>
        </div>

        {/* Cover Image if provided */}
        {article.coverImage && (
          <div className="w-full max-h-[460px] rounded-2xl overflow-hidden mb-8 border border-neutral-200/80 bg-slate-100 shadow-sm">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover max-h-[460px]"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Full Article Content */}
        <article className="prose prose-neutral max-w-none text-neutral-800 text-base sm:text-lg leading-relaxed sm:leading-loose mb-10 font-normal">
          {article.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="mb-4.5 text-neutral-800">
              {paragraph}
            </p>
          ))}
        </article>

        {/* Article Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4 pb-8 border-t border-neutral-200">
            <span className="text-xs font-semibold text-neutral-500">Tags:</span>
            {article.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-100 text-neutral-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Informational Disclaimer Box & Panel Advocate CTA */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0B2A5B] to-[#062D78] text-white shadow-xl mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#168CFF]/15 blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-[#12B9F2] mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F4B400]" />
                <span>Verified Legal Consultation</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold leading-tight">
                Need Specific Legal Support for Your Case?
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 mt-2 leading-relaxed">
                Community articles are educational. If you are dealing with loan harassment, legal notices, or debt restructuring, schedule a confidential discussion with a verified LegalBharosa panel advocate.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenConsult?.(`Discussion related to: ${article.title}`)}
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-[#168CFF] hover:bg-[#078BE8] text-white transition-all shadow-md shrink-0 cursor-pointer whitespace-nowrap hover:scale-102"
            >
              Book Free Consultation
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 7. COMMENTS SECTION */}
        {/* ======================================================== */}
        <section className="pt-6 pb-12 border-t border-neutral-200">
          
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#168CFF]" />
              <h3 className="text-lg sm:text-xl font-bold text-[#0B2A5B]">
                Community Discussion ({comments.length})
              </h3>
            </div>
          </div>

          {/* Add Comment Box */}
          <form onSubmit={handleAddComment} className="mb-8">
            <div className="p-4 rounded-2xl border border-neutral-300 focus-within:border-[#168CFF] focus-within:ring-2 focus-within:ring-[#168CFF]/15 transition-all bg-white shadow-2xs">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={user ? "Add a helpful comment or ask a question regarding this article..." : "Please sign in to share a comment or question..."}
                rows={3}
                className="w-full text-sm placeholder-neutral-400 focus:outline-none resize-none font-inter"
                disabled={!user}
              />
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 mt-2">
                <span className="text-[11px] text-neutral-400">
                  {user ? `Posting as ${user.displayName || user.email?.split('@')[0]}` : 'Sign-in required'}
                </span>
                
                {user ? (
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !commentText.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#168CFF] text-white hover:bg-[#078BE8] transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Comment</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenSignIn}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0B2A5B] text-white hover:bg-[#168CFF] transition-colors cursor-pointer shadow-2xs"
                  >
                    Sign In to Comment
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Comments List */}
          {comments.length === 0 ? (
            <div className="p-8 text-center bg-slate-50/70 rounded-2xl border border-neutral-200 text-neutral-500">
              <MessageSquare className="w-8 h-8 text-neutral-400 mx-auto mb-2 opacity-60" />
              <p className="text-sm font-semibold text-neutral-700">No comments yet</p>
              <p className="text-xs text-neutral-500 mt-1">
                Be the first to share your thoughts, question, or experience.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => {
                const isCommentAuthor = user?.uid && comment.authorId === user.uid;
                const canDeleteComment = isCommentAuthor || isAdmin;
                return (
                  <div
                    key={comment.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex items-start gap-3.5"
                  >
                    {comment.authorPhoto ? (
                      <img
                        src={comment.authorPhoto}
                        alt={comment.authorName}
                        className="w-8 h-8 rounded-full object-cover shrink-0 border"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#0B2A5B] text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {(comment.authorName || 'U')[0]?.toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-800">
                            {comment.authorName}
                          </span>
                          <span className="text-[11px] text-neutral-400">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {canDeleteComment && (
                            <button
                              type="button"
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-neutral-400 hover:text-rose-600 p-1 rounded transition-colors"
                              title="Delete comment"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setReportTarget({ type: 'comment', id: comment.id });
                              setReportModalOpen(true);
                            }}
                            className="text-neutral-400 hover:text-neutral-700 p-1 rounded transition-colors"
                            title="Report comment"
                          >
                            <Flag className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </section>

        {/* ======================================================== */}
        {/* RELATED ARTICLES SECTION */}
        {/* ======================================================== */}
        {relatedArticles.length > 0 && (
          <section className="pt-10 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#0B2A5B]">
                  Related Community Articles
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  More discussions in {article.category}
                </p>
              </div>
              <Link
                to="/articles"
                className="text-xs font-semibold text-[#168CFF] hover:underline"
              >
                View all articles →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <ArticleCard
                  key={rel.id}
                  article={rel}
                  user={user}
                  onOpenSignIn={onOpenSignIn}
                />
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Article Editor Modal for Author Editing */}
      <ArticleEditorModal
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        user={user}
        userProfile={userProfile}
        onOpenSignIn={onOpenSignIn}
        editingArticle={article}
        onSaved={async () => {
          setEditorOpen(false);
          const fresh = await getArticle(id);
          if (fresh) setArticle(fresh);
        }}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        targetType={reportTarget.type}
        targetId={reportTarget.id}
        articleId={id}
        user={user}
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
