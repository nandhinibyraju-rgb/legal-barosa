import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Search, 
  Clock,
  ShieldCheck,
  MessageSquare,
  AlertTriangle,
  Send,
  Tag,
  Calendar,
  User,
  ArrowRight
} from 'lucide-react';
import { 
  ARTICLE_CATEGORIES, 
  uploadAdminMedia,
  approveArticle,
  requestArticleChanges,
  rejectArticle
} from '../../services/firestoreService';

export default function AdminArticlesTab({
  articles = [],
  currentUser,
  onCreateArticle,
  onUpdateArticle,
  onDeleteArticle,
}) {
  // Navigation / Filter Tab (Defaults to 'pending' as requested)
  const [selectedStatusTab, setSelectedStatusTab] = useState('pending');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Active Targets
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [reviewArticle, setReviewArticle] = useState(null);
  const [approveConfirmArticle, setApproveConfirmArticle] = useState(null);
  const [requestChangesArticleTarget, setRequestChangesArticleTarget] = useState(null);
  const [rejectArticleTarget, setRejectArticleTarget] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Moderation form inputs
  const [changesFeedbackText, setChangesFeedbackText] = useState('');
  const [rejectionReasonText, setRejectionReasonText] = useState('');

  // Processing states
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [moderationLoading, setModerationLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State for Write / Edit Article
  const [formData, setFormData] = useState({
    title: '',
    category: ARTICLE_CATEGORIES[0] || 'Legal Rights & RBI Rules',
    excerpt: '',
    content: '',
    coverImage: '',
    tags: '',
    status: 'approved',
  });

  // Calculate Real Counts
  const pendingCount = articles.filter((a) => a.status === 'pending').length;
  const approvedCount = articles.filter((a) => a.status === 'approved' || a.status === 'published').length;
  const changesCount = articles.filter((a) => a.status === 'changes_requested').length;
  const rejectedCount = articles.filter((a) => a.status === 'rejected').length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;
  const totalCount = articles.length;

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      category: ARTICLE_CATEGORIES[0] || 'Legal Rights & RBI Rules',
      excerpt: '',
      content: '',
      coverImage: '',
      tags: '',
      status: 'approved',
    });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title || '',
      category: article.category || ARTICLE_CATEGORIES[0],
      excerpt: article.excerpt || '',
      content: article.content || '',
      coverImage: article.coverImage || '',
      tags: Array.isArray(article.tags) ? article.tags.join(', ') : (article.tags || ''),
      status: article.status || 'approved',
    });
    setError('');
    setModalOpen(true);
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');

    try {
      const res = await uploadAdminMedia(file, 'articles');
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, coverImage: res.url }));
        setSuccess('Cover image uploaded to Firebase Storage.');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(res.error || 'Failed to upload image to Firebase Storage.');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      setError('Image upload failed. You can also paste an image URL directly.');
    } finally {
      setUploadingImage(false);
    }
  };

  // 1. APPROVE ARTICLE
  const handleConfirmApprove = async () => {
    if (!approveConfirmArticle) return;
    setModerationLoading(true);
    setError('');
    try {
      await approveArticle(approveConfirmArticle.id, currentUser?.uid || 'admin');
      setSuccess(`Article "${approveConfirmArticle.title}" has been approved and is now publicly live.`);
      setApproveConfirmArticle(null);
      if (reviewArticle?.id === approveConfirmArticle.id) {
        setReviewArticle(null);
      }
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Error approving article:', err);
      setError(err.message || 'Failed to approve article.');
    } finally {
      setModerationLoading(false);
    }
  };

  // 2. REQUEST CHANGES
  const handleConfirmRequestChanges = async () => {
    if (!requestChangesArticleTarget) return;
    if (!changesFeedbackText.trim()) {
      setError('Please provide feedback explaining what changes are required before submitting.');
      return;
    }

    setModerationLoading(true);
    setError('');
    try {
      await requestArticleChanges(
        requestChangesArticleTarget.id,
        changesFeedbackText.trim(),
        currentUser?.uid || 'admin'
      );
      setSuccess(`Revision request sent to author for "${requestChangesArticleTarget.title}".`);
      setRequestChangesArticleTarget(null);
      setChangesFeedbackText('');
      if (reviewArticle?.id === requestChangesArticleTarget.id) {
        setReviewArticle(null);
      }
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Error requesting changes:', err);
      setError(err.message || 'Failed to request changes.');
    } finally {
      setModerationLoading(false);
    }
  };

  // 3. REJECT ARTICLE
  const handleConfirmReject = async () => {
    if (!rejectArticleTarget) return;
    if (!rejectionReasonText.trim()) {
      setError('Please specify a reason for rejecting this article.');
      return;
    }

    setModerationLoading(true);
    setError('');
    try {
      await rejectArticle(
        rejectArticleTarget.id,
        rejectionReasonText.trim(),
        currentUser?.uid || 'admin'
      );
      setSuccess(`Article "${rejectArticleTarget.title}" has been marked as rejected.`);
      setRejectArticleTarget(null);
      setRejectionReasonText('');
      if (reviewArticle?.id === rejectArticleTarget.id) {
        setReviewArticle(null);
      }
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Error rejecting article:', err);
      setError(err.message || 'Failed to reject article.');
    } finally {
      setModerationLoading(false);
    }
  };

  // 4. DELETE ARTICLE
  const handleDelete = async (articleId) => {
    try {
      await onDeleteArticle(articleId);
      setDeleteConfirmId(null);
      setSuccess('Article removed successfully.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Error deleting article:', err);
      setError(err.message || 'Failed to delete article.');
    }
  };

  // 5. SAVE / EDIT FORM
  const handleFormSubmit = async (statusOverride) => {
    if (!formData.title.trim()) {
      setError('Article title is required.');
      return;
    }
    if (!formData.content.trim()) {
      setError('Article content cannot be empty.');
      return;
    }

    setSubmitting(true);
    setError('');

    const status = statusOverride || formData.status;
    const tagArray = formData.tags
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      excerpt: formData.excerpt.trim(),
      content: formData.content.trim(),
      coverImage: formData.coverImage.trim() || null,
      tags: tagArray,
      status,
      authorId: currentUser?.uid || 'admin',
      authorName: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'LegalBharosa Counsel',
      authorEmail: currentUser?.email || '',
    };

    try {
      if (editingArticle) {
        await onUpdateArticle(editingArticle.id, payload);
        setSuccess(`Article "${payload.title}" updated (${status}).`);
      } else {
        await onCreateArticle(payload);
        setSuccess(`Article "${payload.title}" created (${status}).`);
      }
      setModalOpen(false);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Error saving article:', err);
      setError(err.message || 'Failed to save article.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered Articles based on Status Tab, Category, and Search Query
  const filteredArticles = articles.filter((art) => {
    // 1. Status Filter
    let matchesStatus = true;
    if (selectedStatusTab === 'pending') {
      matchesStatus = art.status === 'pending';
    } else if (selectedStatusTab === 'approved') {
      matchesStatus = art.status === 'approved' || art.status === 'published';
    } else if (selectedStatusTab === 'changes_requested') {
      matchesStatus = art.status === 'changes_requested';
    } else if (selectedStatusTab === 'rejected') {
      matchesStatus = art.status === 'rejected';
    } else if (selectedStatusTab === 'draft') {
      matchesStatus = art.status === 'draft';
    } // 'all' matches all

    // 2. Category Filter
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;

    // 3. Search Query
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
      art.title?.toLowerCase().includes(query) ||
      art.content?.toLowerCase().includes(query) ||
      art.authorName?.toLowerCase().includes(query) ||
      art.authorEmail?.toLowerCase().includes(query);

    return matchesStatus && matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#0B1528] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#00D2FF]" />
            <h2 className="text-xl font-bold font-heading text-white">
              Article Moderation & Editorial Review
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Review user contributions before public release. Approve authentic legal guidance, request clarifications, or reject unsuitable submissions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#168CFF] to-[#00D2FF] hover:opacity-90 text-[#041229] font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#168CFF]/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Write Official Article</span>
        </button>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 shadow-lg">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Status Filter Tabs (Pending, Approved, Changes Requested, Rejected, All) */}
      <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none shadow-xl">
        <button
          type="button"
          onClick={() => setSelectedStatusTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            selectedStatusTab === 'pending'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Review</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            selectedStatusTab === 'pending' ? 'bg-black/30 text-white' : 'bg-amber-500/20 text-amber-300'
          }`}>
            {pendingCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatusTab('approved')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            selectedStatusTab === 'approved'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Approved</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            selectedStatusTab === 'approved' ? 'bg-black/30 text-white' : 'bg-emerald-500/20 text-emerald-300'
          }`}>
            {approvedCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatusTab('changes_requested')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            selectedStatusTab === 'changes_requested'
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-slate-950 font-bold shadow-md shadow-orange-500/20'
              : 'text-slate-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Changes Requested</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            selectedStatusTab === 'changes_requested' ? 'bg-black/30 text-white' : 'bg-orange-500/20 text-orange-300'
          }`}>
            {changesCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatusTab('rejected')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            selectedStatusTab === 'rejected'
              ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold shadow-md shadow-rose-500/20'
              : 'text-slate-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <X className="w-3.5 h-3.5" />
          <span>Rejected</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            selectedStatusTab === 'rejected' ? 'bg-black/30 text-white' : 'bg-rose-500/20 text-rose-300'
          }`}>
            {rejectedCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatusTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            selectedStatusTab === 'all'
              ? 'bg-gradient-to-r from-[#168CFF] to-[#00D2FF] text-[#041229] font-bold shadow-md shadow-[#168CFF]/20'
              : 'text-slate-300 hover:bg-white/5 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>All Submissions</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            selectedStatusTab === 'all' ? 'bg-black/30 text-white' : 'bg-white/10 text-slate-300'
          }`}>
            {totalCount}
          </span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, author, or keyword..."
            className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#168CFF]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-[#168CFF] cursor-pointer"
          >
            <option value="All">All Categories</option>
            {ARTICLE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-400 whitespace-nowrap">
            ({filteredArticles.length} found)
          </span>
        </div>
      </div>

      {/* Article Moderation Queue List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((art) => {
            const isPending = art.status === 'pending';
            const isApproved = art.status === 'approved' || art.status === 'published';
            const isChanges = art.status === 'changes_requested';
            const isRejected = art.status === 'rejected';

            const subDate = art.submittedAt?.seconds
              ? new Date(art.submittedAt.seconds * 1000).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : art.createdAt?.seconds
              ? new Date(art.createdAt.seconds * 1000).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Recent';

            return (
              <div
                key={art.id}
                className="bg-[#0B1528] border border-white/10 hover:border-white/20 rounded-2xl p-5 shadow-xl transition-all flex flex-col md:flex-row items-start justify-between gap-5 group"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-start gap-4 flex-1">
                  {art.coverImage ? (
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-white/10 shrink-0 bg-black/40"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-slate-500 shrink-0">
                      <FileText className="w-8 h-8 opacity-60" />
                    </div>
                  )}

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#00D2FF] bg-[#168CFF]/10 px-2 py-0.5 rounded-full border border-[#168CFF]/20">
                        {art.category || 'Legal Knowledge'}
                      </span>

                      {/* Status Badges */}
                      {isPending && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>Pending Approval</span>
                        </span>
                      )}
                      {isApproved && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Approved & Public</span>
                        </span>
                      )}
                      {isChanges && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-300 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/30 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-orange-400" />
                          <span>Changes Requested</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30 flex items-center gap-1">
                          <X className="w-3 h-3 text-rose-400" />
                          <span>Rejected</span>
                        </span>
                      )}
                      {art.status === 'draft' && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-slate-500/10 px-2 py-0.5 rounded-full border border-slate-500/30">
                          Draft
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-[#00D2FF] transition-colors leading-snug">
                      {art.title}
                    </h3>

                    {art.excerpt && (
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {art.excerpt}
                      </p>
                    )}

                    {/* Metadata Footer: Author, Email, Submission Date */}
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1 text-slate-300 font-medium">
                        <User className="w-3 h-3 text-[#168CFF]" />
                        <span>{art.authorName || 'Contributor'}</span>
                        {art.authorEmail && (
                          <span className="text-slate-500">({art.authorEmail})</span>
                        )}
                      </span>

                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>Submitted: {subDate}</span>
                      </span>

                      {art.tags && art.tags.length > 0 && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Tag className="w-3 h-3 text-slate-500" />
                          <span>{Array.isArray(art.tags) ? art.tags.join(', ') : art.tags}</span>
                        </span>
                      )}
                    </div>

                    {/* Feedback/Reason Callout for Changes/Rejection */}
                    {isChanges && art.adminFeedback && (
                      <div className="mt-2 p-2.5 rounded-xl bg-orange-950/40 border border-orange-500/30 text-orange-200 text-xs">
                        <span className="font-bold text-orange-300 block mb-0.5">Feedback Provided:</span>
                        <p className="italic">{art.adminFeedback}</p>
                      </div>
                    )}
                    {isRejected && art.rejectionReason && (
                      <div className="mt-2 p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs">
                        <span className="font-bold text-rose-300 block mb-0.5">Rejection Reason:</span>
                        <p className="italic">{art.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Moderation Actions */}
                <div className="flex flex-wrap md:flex-col items-center md:items-end justify-end gap-2 shrink-0 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                  {/* Full Review Modal Trigger */}
                  <button
                    type="button"
                    onClick={() => setReviewArticle(art)}
                    className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#00D2FF]" />
                    <span>Review Full Article</span>
                  </button>

                  {/* Primary Moderation Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    {/* Approve button */}
                    {!isApproved && (
                      <button
                        type="button"
                        onClick={() => setApproveConfirmArticle(art)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm shadow-emerald-500/20"
                        title="Approve for publication"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Approve</span>
                      </button>
                    )}

                    {/* Request changes button */}
                    {!isChanges && (
                      <button
                        type="button"
                        onClick={() => {
                          setRequestChangesArticleTarget(art);
                          setChangesFeedbackText(art.adminFeedback || '');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-200 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        title="Request revisions"
                      >
                        <AlertCircle className="w-3.5 h-3.5 text-orange-400" />
                        <span>Changes</span>
                      </button>
                    )}

                    {/* Reject button */}
                    {!isRejected && (
                      <button
                        type="button"
                        onClick={() => {
                          setRejectArticleTarget(art);
                          setRejectionReasonText(art.rejectionReason || '');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        title="Reject submission"
                      >
                        <X className="w-3.5 h-3.5 text-rose-400" />
                        <span>Reject</span>
                      </button>
                    )}
                  </div>

                  {/* Secondary Edit & Delete Actions */}
                  <div className="flex items-center gap-1 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(art)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                      title="Edit details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(art.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-12 text-center shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">
              No articles found in "{selectedStatusTab.replace('_', ' ')}"
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {selectedStatusTab === 'pending'
                ? 'All pending submissions have been reviewed. Great job!'
                : 'Try adjusting your search query or selecting a different category or status tab.'}
            </p>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: FULL ARTICLE PREVIEW & MODERATION MODAL         */}
      {/* ======================================================== */}
      {reviewArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#0B1528] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0B2A5B] to-[#041229] border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono text-[#00D2FF] uppercase tracking-wider bg-[#168CFF]/20 px-2.5 py-1 rounded-full border border-[#168CFF]/30">
                  {reviewArticle.category || 'Article'}
                </span>
                <span className="text-xs text-slate-400">
                  Status: <strong className="text-white uppercase">{reviewArticle.status}</strong>
                </span>
              </div>

              <button
                type="button"
                onClick={() => setReviewArticle(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Article Content */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
              {/* Cover Image */}
              {reviewArticle.coverImage && (
                <div className="w-full h-64 rounded-2xl overflow-hidden bg-black/60 border border-white/10">
                  <img
                    src={reviewArticle.coverImage}
                    alt={reviewArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Title & Author Meta */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white leading-tight mb-3">
                  {reviewArticle.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pb-4 border-b border-white/10">
                  <span className="text-slate-200 font-semibold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#00D2FF]" />
                    <span>{reviewArticle.authorName || 'Contributor'}</span>
                    {reviewArticle.authorEmail && (
                      <span className="text-slate-400 font-normal">({reviewArticle.authorEmail})</span>
                    )}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{reviewArticle.createdAt?.seconds ? new Date(reviewArticle.createdAt.seconds * 1000).toLocaleDateString('en-IN') : 'Recent'}</span>
                  </span>
                </div>
              </div>

              {/* Excerpt */}
              {reviewArticle.excerpt && (
                <div className="p-4 rounded-xl bg-white/5 border-l-4 border-[#00D2FF] text-slate-300 text-xs italic leading-relaxed">
                  {reviewArticle.excerpt}
                </div>
              )}

              {/* Full Content */}
              <div className="prose prose-invert max-w-none text-slate-200 text-sm whitespace-pre-line leading-relaxed">
                {reviewArticle.content}
              </div>

              {/* Tags */}
              {reviewArticle.tags && reviewArticle.tags.length > 0 && (
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-slate-400 mr-2 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Tags:
                  </span>
                  {(Array.isArray(reviewArticle.tags) ? reviewArticle.tags : [reviewArticle.tags]).map((tag, i) => (
                    <span key={i} className="text-[11px] font-mono text-slate-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Sticky Bottom Actions Bar */}
            <div className="p-4 sm:p-5 bg-black/70 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setReviewArticle(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Close Preview
              </button>

              <div className="flex items-center gap-2">
                {/* Request changes */}
                <button
                  type="button"
                  onClick={() => {
                    setRequestChangesArticleTarget(reviewArticle);
                    setChangesFeedbackText(reviewArticle.adminFeedback || '');
                  }}
                  className="px-4 py-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-orange-400" />
                  <span>Request Changes</span>
                </button>

                {/* Reject */}
                <button
                  type="button"
                  onClick={() => {
                    setRejectArticleTarget(reviewArticle);
                    setRejectionReasonText(reviewArticle.rejectionReason || '');
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 text-rose-400" />
                  <span>Reject</span>
                </button>

                {/* Approve */}
                <button
                  type="button"
                  onClick={() => setApproveConfirmArticle(reviewArticle)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-105 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Approve & Publish</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: CONFIRM APPROVE DIALOG                          */}
      {/* ======================================================== */}
      {approveConfirmArticle && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#0B1528] border border-white/20 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">
                Approve this article for publication?
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                "{approveConfirmArticle.title}"
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                This will immediately change its status to <strong>Approved</strong> and make it publicly readable across the LegalBharosa knowledge base.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setApproveConfirmArticle(null)}
                disabled={moderationLoading}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApprove}
                disabled={moderationLoading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-105 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                {moderationLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm & Publish</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: REQUEST CHANGES DIALOG (with required message)  */}
      {/* ======================================================== */}
      {requestChangesArticleTarget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#0B1528] border border-orange-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Request Changes from Author
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {requestChangesArticleTarget.title}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Explain what needs to be changed: <span className="text-rose-400">*</span>
              </label>
              <textarea
                value={changesFeedbackText}
                onChange={(e) => setChangesFeedbackText(e.target.value)}
                rows={4}
                placeholder="e.g. Please add sources for the statistics cited in paragraph 3, and clarify the distinction between Section 13(2) and Section 13(4) notices..."
                className="w-full p-3.5 bg-black/50 border border-white/10 focus:border-orange-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none leading-relaxed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                The author will see this feedback in their profile and can edit & resubmit the article.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRequestChangesArticleTarget(null)}
                disabled={moderationLoading}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRequestChanges}
                disabled={moderationLoading || !changesFeedbackText.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-105 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer disabled:opacity-40"
              >
                {moderationLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Send Feedback to Author</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: REJECT ARTICLE DIALOG (with required reason)    */}
      {/* ======================================================== */}
      {rejectArticleTarget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#0B1528] border border-rose-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <X className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Reject Article Submission
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {rejectArticleTarget.title}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Reason for Rejection: <span className="text-rose-400">*</span>
              </label>
              <textarea
                value={rejectionReasonText}
                onChange={(e) => setRejectionReasonText(e.target.value)}
                rows={3}
                placeholder="e.g. This article contains unverified legal claims that violate community guidelines, or promotes non-compliant debt relief schemes..."
                className="w-full p-3.5 bg-black/50 border border-white/10 focus:border-rose-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none leading-relaxed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                This reason will be visible to the author so they understand why the submission was rejected.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectArticleTarget(null)}
                disabled={moderationLoading}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={moderationLoading || !rejectionReasonText.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:brightness-105 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-500/20 cursor-pointer disabled:opacity-40"
              >
                {moderationLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Reject Article</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: WRITE / EDIT ARTICLE MODAL                      */}
      {/* ======================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0B1528] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#00D2FF]" />
                <h3 className="text-lg font-bold text-white">
                  {editingArticle ? 'Edit Article' : 'Write Official Article'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Understanding DRT Appeals Under the SARFAESI Act"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#168CFF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#168CFF] cursor-pointer"
                  >
                    {ARTICLE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Publication Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#168CFF] cursor-pointer"
                  >
                    <option value="approved">Approved & Published</option>
                    <option value="pending">Pending Review</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Short Excerpt (Summary for article cards)
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  placeholder="Brief 1-2 sentence overview of the article..."
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#168CFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cover Image (Upload file or paste URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://... or upload below"
                    className="flex-1 px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#168CFF]"
                  />
                  <label className="px-3.5 py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-xs font-medium text-white flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                    {uploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-[#00D2FF]" />
                    )}
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Article Content * (Plain text / markdown formatted)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  placeholder="Write the comprehensive article content here..."
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#168CFF] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g. sarfaesi, drt, legal rights, banking rules"
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#168CFF]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={submitting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleFormSubmit()}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#168CFF] to-[#00D2FF] hover:opacity-90 text-[#041229] font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-[#168CFF]/20 transition-all cursor-pointer"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{editingArticle ? 'Save Changes' : 'Publish Article'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: DELETE CONFIRMATION DIALOG                      */}
      {/* ======================================================== */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#0B1528] border border-white/20 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Delete this article?</h3>
              <p className="text-xs text-slate-400 mt-1">
                This action is permanent and cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// Final submission update
