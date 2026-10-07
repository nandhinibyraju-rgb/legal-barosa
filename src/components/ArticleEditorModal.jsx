import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  PenTool, 
  Image, 
  Tag, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Loader2, 
  Eye, 
  Lock, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';
import { 
  ARTICLE_CATEGORIES, 
  createArticle, 
  updateArticle 
} from '../services/firestoreService';

export default function ArticleEditorModal({
  isOpen,
  onClose,
  user,
  userProfile,
  onOpenSignIn,
  editingArticle = null,
  onSaved,
}) {
  // Top-level state declarations (Strictly unconditional hook calls)
  const defaultCategory = (ARTICLE_CATEGORIES && ARTICLE_CATEGORIES[0]) || 'Legal Rights & RBI Rules';
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [submittedForReview, setSubmittedForReview] = useState(false);
  const [savedArticleId, setSavedArticleId] = useState(null);

  // Initialize form when editingArticle or isOpen changes
  useEffect(() => {
    if (editingArticle) {
      setTitle(editingArticle.title || '');
      setCategory(editingArticle.category || defaultCategory);
      setCoverImage(editingArticle.coverImage || '');
      setContent(editingArticle.content || '');
      setExcerpt(editingArticle.excerpt || '');
      setTagsInput(editingArticle.tags && Array.isArray(editingArticle.tags) ? editingArticle.tags.join(', ') : '');
    } else {
      setTitle('');
      setCategory(defaultCategory);
      setCoverImage('');
      setContent('');
      setExcerpt('');
      setTagsInput('');
    }
    setError('');
    setPreviewMode(false);
    setSubmittedForReview(false);
    setSavedArticleId(null);
  }, [editingArticle, isOpen, defaultCategory]);

  // Modal close helper
  const handleModalClose = () => {
    setSubmittedForReview(false);
    setError('');
    onClose?.();
  };

  // If not open, return null only AFTER all hooks are called
  if (!isOpen) return null;

  // Real user information from authentication
  const authorName = user?.displayName || userProfile?.name || (user?.email ? user.email.split('@')[0] : 'Contributor');
  const authorEmail = user?.email || '';
  const authorPhoto = user?.photoURL || userProfile?.photoURL || '';
  const isAdmin = userProfile?.role === 'admin';

  const handleSave = async (targetType = 'submit') => {
    if (!user) {
      setError('Please sign in to write and submit an article.');
      return;
    }

    if (!(title || '').trim()) {
      setError('Please provide a descriptive article title.');
      return;
    }

    if (!(content || '').trim()) {
      setError('Please write your article content before saving.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const parsedTags = (tagsInput || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    // Determine target status
    let targetStatus = 'pending';
    if (targetType === 'draft') {
      targetStatus = 'draft';
    } else if (isAdmin) {
      targetStatus = 'approved';
    } else {
      // Normal user submitting or resubmitting
      targetStatus = 'pending';
    }

    try {
      let resultId = editingArticle?.id;
      if (editingArticle?.id) {
        await updateArticle(editingArticle.id, {
          title: (title || '').trim(),
          category: category || defaultCategory,
          content: (content || '').trim(),
          excerpt: (excerpt || '').trim() || undefined,
          coverImage: (coverImage || '').trim() || null,
          tags: parsedTags,
          status: targetStatus,
        });
      } else {
        const created = await createArticle({
          title: (title || '').trim(),
          category: category || defaultCategory,
          content: (content || '').trim(),
          excerpt: (excerpt || '').trim(),
          coverImage: (coverImage || '').trim(),
          tags: parsedTags,
          authorId: user.uid,
          authorName,
          authorEmail,
          authorPhoto,
          status: targetStatus,
        });
        resultId = created?.id;
      }

      setSavedArticleId(resultId);

      if (targetStatus === 'pending') {
        // Display review confirmation screen
        setSubmittedForReview(true);
      } else {
        onSaved?.(resultId, targetStatus);
        handleModalClose();
      }
    } catch (err) {
      console.error('Failed to save article:', err);
      setError(err?.message || 'Failed to save article. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.22 }}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#0B2A5B] via-[#062D78] to-[#078BE8] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#12B9F2] shadow-xs">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold leading-tight">
                {editingArticle ? 'Edit Article' : 'Write a Community Article'}
              </h2>
              <p className="text-xs text-blue-100 mt-0.5">
                Share practical legal, financial, or dispute resolution insights with the LegalBharosa community
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleModalClose}
            className="p-1.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedForReview ? (
          /* Confirmation Screen when submitted for review */
          <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center my-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center text-emerald-600 shadow-md">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#0B2A5B]">
              Your article has been submitted for review.
            </h3>
            <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
              Our team will review it before publishing.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  const id = savedArticleId;
                  handleModalClose();
                  onSaved?.(id, 'pending');
                }}
                className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#168CFF] to-[#078BE8] hover:brightness-105 shadow-md shadow-[#168CFF]/20 transition-all cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Content Body */}
            <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-5">
              {/* Editorial Feedback banner if changes requested */}
              {editingArticle?.status === 'changes_requested' && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Editorial Feedback & Changes Requested</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed pl-6">
                    <strong>Admin Feedback:</strong> {editingArticle.adminFeedback || 'Please revise your article according to editorial standards.'}
                  </p>
                  <p className="text-[11px] text-amber-700/80 pl-6 italic">
                    Saving and submitting will return this article to "Under Review".
                  </p>
                </div>
              )}

              {/* Rejection notice if rejected */}
              {editingArticle?.status === 'rejected' && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-red-900">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Article Rejected</span>
                  </div>
                  <p className="text-xs text-red-800 leading-relaxed pl-6">
                    <strong>Rejection Reason:</strong> {editingArticle.rejectionReason || 'This article did not meet our community standards.'}
                  </p>
                </div>
              )}

              {/* Unauthenticated Wall */}
              {!user && (
                <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold">Authentication Required to Publish</h4>
                      <p className="text-xs text-amber-800 mt-0.5">
                        To maintain trusted legal community standards, articles must be linked to a genuine user account.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleModalClose();
                      onOpenSignIn?.();
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0B2A5B] text-white hover:bg-[#168CFF] transition-colors shrink-0 cursor-pointer shadow-xs"
                  >
                    Sign In / Register
                  </button>
                </div>
              )}

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Author Badge */}
              {user && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div className="flex items-center gap-2.5">
                    {authorPhoto ? (
                      <img src={authorPhoto} alt={authorName} className="w-7 h-7 rounded-full object-cover border" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#0B2A5B] text-white font-bold flex items-center justify-center text-xs">
                        {(authorName || 'U')[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <span className="text-neutral-500">Posting as: </span>
                      <span className="font-semibold text-neutral-800">{authorName}</span>
                      {authorEmail && <span className="text-neutral-400 ml-1.5">({authorEmail})</span>}
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Verified Contributor
                  </span>
                </div>
              )}

              {/* Tab switch between Write and Live Preview */}
              <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    !previewMode
                      ? 'bg-blue-50 text-[#168CFF]'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Write Mode
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    previewMode
                      ? 'bg-blue-50 text-[#168CFF]'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              </div>

              {!previewMode ? (
                <div className="space-y-4">
                  {/* Title Field */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. How to Respond When Recovery Agents Visit Your Residence Unannounced"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-medium focus:outline-none focus:border-[#168CFF] focus:ring-2 focus:ring-[#168CFF]/20"
                      maxLength={160}
                    />
                    <div className="flex justify-between items-center mt-1 text-[11px] text-neutral-400">
                      <span>Be descriptive and clear</span>
                      <span>{(title || '').length}/160</span>
                    </div>
                  </div>

                  {/* Category & Tags Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Category Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-none focus:border-[#168CFF] focus:ring-2 focus:ring-[#168CFF]/20 bg-white"
                      >
                        {(ARTICLE_CATEGORIES || []).map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        placeholder="e.g. rbi-guidelines, loans, harassment"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-none focus:border-[#168CFF] focus:ring-2 focus:ring-[#168CFF]/20"
                      />
                    </div>
                  </div>

                  {/* Optional Cover Image URL */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Cover Image URL (Optional)
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="url"
                          value={coverImage}
                          onChange={(e) => setCoverImage(e.target.value)}
                          placeholder="https://images.unsplash.com/... or custom URL"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-none focus:border-[#168CFF] focus:ring-2 focus:ring-[#168CFF]/20"
                        />
                      </div>
                      {coverImage && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden border shrink-0 bg-slate-100">
                          <img
                            src={coverImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Optional. If omitted, an elegant LegalBharosa gradient header will be used.
                    </p>
                  </div>

                  {/* Content Field */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Article Content *
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your article here. You can separate paragraphs with blank lines, include legal references, case steps, or practical tips..."
                      rows={10}
                      className="w-full p-4 rounded-xl border border-neutral-300 text-sm leading-relaxed focus:outline-none focus:border-[#168CFF] focus:ring-2 focus:ring-[#168CFF]/20 font-inter resize-y"
                    />
                    <div className="flex justify-between items-center mt-1 text-[11px] text-neutral-400">
                      <span>Paragraph breaks are automatically preserved</span>
                      <span>{(content || '').split(/\s+/).filter(Boolean).length} words</span>
                    </div>
                  </div>

                  {/* Short Excerpt */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Custom Excerpt / Summary (Optional)
                    </label>
                    <textarea
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="A brief 1-2 sentence preview for the card feed. If left empty, it will be automatically generated from your content."
                      rows={2}
                      className="w-full p-3 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-none focus:border-[#168CFF] focus:ring-2 focus:ring-[#168CFF]/20 resize-none"
                      maxLength={250}
                    />
                  </div>
                </div>
              ) : (
                /* Live Preview View */
                <div className="space-y-4 border rounded-2xl p-5 bg-slate-50/50">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0B2A5B] text-white">
                    {category}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#0B2A5B] leading-snug">
                    {title || 'Untitled Article'}
                  </h1>
                  {coverImage && (
                    <div className="w-full h-52 rounded-xl overflow-hidden bg-neutral-200">
                      <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="prose prose-sm max-w-none text-neutral-700 whitespace-pre-line leading-relaxed">
                    {content || 'Your article text will appear here...'}
                  </div>
                </div>
              )}

              {/* Legal Disclaimer Notice */}
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/60 text-[11px] text-blue-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#168CFF] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Community Guidelines:</strong> Content published here is for community education and awareness. Authors are responsible for accuracy. Articles do not constitute formal legal representation.
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 sm:p-5 bg-neutral-50 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={handleModalClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-600 hover:bg-neutral-200/70 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2.5">
                {/* Save as Draft */}
                <button
                  type="button"
                  disabled={isSubmitting || !user}
                  onClick={() => handleSave('draft')}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#0B2A5B] bg-white border border-neutral-300 hover:bg-neutral-100 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Save as Draft
                </button>

                {/* Submit / Publish Article */}
                <button
                  type="button"
                  disabled={isSubmitting || !user}
                  onClick={() => handleSave('submit')}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#168CFF] hover:bg-[#078BE8] text-white transition-all shadow-sm hover:shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {isAdmin
                          ? (editingArticle ? 'Save Changes' : 'Publish Article')
                          : (editingArticle?.status === 'changes_requested'
                              ? 'Submit Revision for Review'
                              : (editingArticle ? 'Submit for Review' : 'Submit Article'))}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
// Final submission update
