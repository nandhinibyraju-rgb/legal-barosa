import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MessageSquare, 
  Eye, 
  Share2, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Bookmark, 
  User, 
  Check, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { toggleArticleLike, toggleArticleBookmark } from '../services/firestoreService';

export default function ArticleCard({ 
  article, 
  user, 
  onOpenSignIn, 
  onRequireAuth 
}) {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(article.likes || []);
  const [bookmarks, setBookmarks] = useState(article.bookmarks || []);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasLiked = user?.uid ? likes.includes(user.uid) : false;
  const hasBookmarked = user?.uid ? bookmarks.includes(user.uid) : false;

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recent';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds ? timestamp.seconds * 1000 : timestamp);
      return new Intl.DateTimeFormat('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    } catch {
      return 'Recent';
    }
  };

  // Handle Like
  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) {
      onRequireAuth?.('sign in to like this article') || onOpenSignIn?.();
      return;
    }
    if (isLiking) return;

    setIsLiking(true);
    // Optimistic update
    const previousLikes = [...likes];
    const willLike = !hasLiked;
    setLikes(willLike ? [...likes, user.uid] : likes.filter((id) => id !== user.uid));

    try {
      await toggleArticleLike(article.id, user.uid);
    } catch (err) {
      console.error('Failed to toggle like:', err);
      setLikes(previousLikes);
    } finally {
      setIsLiking(false);
    }
  };

  // Handle Bookmark
  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (!user) {
      onRequireAuth?.('sign in to bookmark articles') || onOpenSignIn?.();
      return;
    }
    if (isBookmarking) return;

    setIsBookmarking(true);
    const previousBookmarks = [...bookmarks];
    const willBookmark = !hasBookmarked;
    setBookmarks(willBookmark ? [...bookmarks, user.uid] : bookmarks.filter((id) => id !== user.uid));

    try {
      await toggleArticleBookmark(article.id, user.uid);
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
      setBookmarks(previousBookmarks);
    } finally {
      setIsBookmarking(false);
    }
  };

  // Handle Share
  const handleShare = async (e) => {
    e.stopPropagation();
    const articleUrl = `${window.location.origin}/articles/${article.id}`;
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
          console.warn('Navigator share error:', err);
        }
      }
    }

    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Could not copy link:', err);
    }
  };

  const authorInitials = (article.authorName || 'LB')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <motion.article 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={() => navigate(`/articles/${article.id}`)}
      className="group relative flex flex-col bg-white rounded-2xl border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(11,42,91,0.08)] hover:border-[#168CFF]/40 transition-all duration-300 overflow-hidden cursor-pointer h-full"
    >
      {/* Top Banner / Cover Image */}
      {article.coverImage ? (
        <div className="relative w-full h-48 overflow-hidden bg-slate-100">
          <img 
            src={article.coverImage} 
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
            loading="lazy"
            onError={(e) => {
              // Graceful fallback to branded gradient
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
          
          {/* Category Chip over image */}
          <div className="absolute top-3.5 left-3.5">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0B2A5B]/90 text-white backdrop-blur-md border border-white/20 shadow-xs">
              {article.category}
            </span>
          </div>

          {/* Reading Time Badge */}
          <div className="absolute top-3.5 right-3.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-md">
              <Clock className="w-3 h-3 text-[#12B9F2]" />
              <span>{article.readingTime || 3} min read</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-24 bg-gradient-to-r from-[#0B2A5B] via-[#078BE8] to-[#12B9F2] p-4 flex items-center justify-between overflow-hidden">
          {/* Subtle Decorative Pattern */}
          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between w-full">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-[#0B2A5B] shadow-xs">
              {article.category}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#0B2A5B]/50 text-white backdrop-blur-sm border border-white/10">
              <Clock className="w-3 h-3 text-[#12B9F2]" />
              <span>{article.readingTime || 3} min read</span>
            </span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        
        {/* Author & Date Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {article.authorPhoto ? (
              <img 
                src={article.authorPhoto} 
                alt={article.authorName}
                className="w-7 h-7 rounded-full object-cover border border-neutral-200 shrink-0" 
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#0B2A5B] text-white text-xs font-bold flex items-center justify-center shrink-0">
                {authorInitials}
              </div>
            )}
            <div className="truncate">
              <p className="text-xs font-semibold text-neutral-800 truncate leading-tight">
                {article.authorName || 'Community Member'}
              </p>
              <p className="text-[11px] text-neutral-400 leading-tight">
                {formatDate(article.createdAt)}
              </p>
            </div>
          </div>

          {/* Quick Bookmark Button */}
          <button
            type="button"
            onClick={handleBookmark}
            title={hasBookmarked ? 'Bookmarked' : 'Save bookmark'}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              hasBookmarked 
                ? 'text-[#F4B400] bg-amber-50' 
                : 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${hasBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-[#0B2A5B] group-hover:text-[#168CFF] transition-colors line-clamp-2 leading-snug mb-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-xs sm:text-sm text-neutral-600 line-clamp-3 leading-relaxed mb-4 flex-1">
          {article.excerpt || article.content}
        </p>

        {/* Tags if any */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {article.tags.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx}
                className="text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-neutral-100 mb-3.5" />

        {/* Card Footer: Metrics & Interactive Actions */}
        <div className="flex items-center justify-between text-xs text-neutral-500 pt-0.5">
          <div className="flex items-center gap-3">
            {/* Views Metric */}
            <span className="inline-flex items-center gap-1 hover:text-neutral-700" title="Views">
              <Eye className="w-3.5 h-3.5 text-neutral-400" />
              <span>{article.views || 0}</span>
            </span>

            {/* Likes Button */}
            <button
              type="button"
              onClick={handleLike}
              className={`inline-flex items-center gap-1 transition-all cursor-pointer ${
                hasLiked 
                  ? 'text-rose-600 font-semibold' 
                  : 'hover:text-rose-500'
              }`}
              title={hasLiked ? 'Unlike' : 'Like'}
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current text-rose-600 scale-110' : ''}`} />
              <span>{likes.length}</span>
            </button>

            {/* Comments Count */}
            <span className="inline-flex items-center gap-1 hover:text-neutral-700" title="Comments">
              <MessageSquare className="w-3.5 h-3.5 text-neutral-400" />
              <span>{article.commentsCount || 0}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              className="p-1 text-neutral-400 hover:text-[#168CFF] rounded hover:bg-blue-50 transition-colors cursor-pointer"
              title="Share Article"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            {/* Read Article CTA */}
            <span className="inline-flex items-center gap-1 font-semibold text-[#168CFF] group-hover:translate-x-0.5 transition-transform text-xs">
              <span>Read</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

      </div>
    </motion.article>
  );
}
// Final submission update
