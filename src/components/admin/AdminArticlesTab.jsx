import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Search, 
  Heart
} from 'lucide-react';
import { 
  ARTICLE_CATEGORIES, 
  uploadAdminMedia 
} from '../../services/firestoreService';

export default function AdminArticlesTab({
  articles = [],
  currentUser,
  onCreateArticle,
  onUpdateArticle,
  onDeleteArticle,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: ARTICLE_CATEGORIES[0] || 'Legal Rights & RBI Rules',
    excerpt: '',
    content: '',
    coverImage: '',
    tags: '',
    status: 'published',
  });

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      category: ARTICLE_CATEGORIES[0] || 'Legal Rights & RBI Rules',
      excerpt: '',
      content: '',
      coverImage: '',
      tags: '',
      status: 'published',
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
      status: article.status || 'published',
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

  const handleTogglePublish = async (article) => {
    const nextStatus = article.status === 'published' ? 'draft' : 'published';
    try {
      await onUpdateArticle(article.id, { status: nextStatus });
      setSuccess(`Article "${article.title}" is now ${nextStatus}.`);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Error toggling article status:', err);
      setError(err.message || 'Failed to update article status.');
    }
  };

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

  // Filtered Articles
  const filteredArticles = articles.filter((art) => {
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
      art.title?.toLowerCase().includes(query) ||
      art.content?.toLowerCase().includes(query) ||
      art.authorName?.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#0B1528] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold font-heading text-white">
              Articles & Knowledge Base
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Publish educational articles, legal guidance, and borrower defense strategies for the public knowledge center.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#168CFF] to-[#00D2FF] hover:opacity-90 text-[#041229] font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#168CFF]/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
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

      {/* Filter & Search Bar */}
      <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title..."
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

      {/* Articles Grid / List */}
      <div className="space-y-3">
        {filteredArticles.length === 0 ? (
          <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-12 text-center text-xs text-slate-400">
            <FileText className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p>No articles found matching the current filters.</p>
          </div>
        ) : (
          filteredArticles.map((article) => (
            <div
              key={article.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                article.status === 'draft'
                  ? 'bg-[#0B1528]/60 border-white/5 opacity-80'
                  : 'bg-[#0B1528] border-white/10 hover:border-[#168CFF]/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                  )}

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#00D2FF]">
                        {article.category || 'General'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                          article.status === 'published'
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                            : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                        }`}
                      >
                        {article.status || 'published'}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                      {article.excerpt || article.content?.slice(0, 120)}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400 font-mono">
                      <span>Author: {article.authorName || 'Counsel'}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {article.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-400" />
                        {Array.isArray(article.likes) ? article.likes.length : 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(article)}
                    title={article.status === 'published' ? 'Unpublish (Revert to Draft)' : 'Publish Article'}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {article.status === 'published' ? (
                      <EyeOff className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(article)}
                    title="Edit article"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[#00D2FF] transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(article.id)}
                    title="Delete article"
                    className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Confirm Delete */}
              {deleteConfirmId === article.id && (
                <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
                  <span>Are you sure you want to permanently delete this article?</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(article.id)}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[11px] cursor-pointer"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 text-[11px] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Write / Edit Article Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0B1528] border border-white/15 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 my-8 relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold font-heading text-white">
                {editingArticle ? 'Edit Article' : 'Compose New Article'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Understanding Section 138 NI Act Cheque Bounce Notice Rights"
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white text-sm font-semibold focus:outline-none focus:border-[#168CFF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#168CFF] cursor-pointer"
                  >
                    {ARTICLE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="rbi, harassment, legal notice, emi"
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#168CFF]"
                  />
                </div>
              </div>

              {/* Cover Image Upload & Direct URL */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Cover Image (Firebase Storage Upload or Direct URL)
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      placeholder="https://... or upload below"
                      className="w-full px-3.5 py-2 bg-black/50 border border-white/15 rounded-xl text-white font-mono text-[11px] focus:outline-none focus:border-[#168CFF]"
                    />
                  </div>

                  <label className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0">
                    {uploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{uploadingImage ? 'Uploading...' : 'Upload File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                {formData.coverImage && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={formData.coverImage}
                      alt="Preview"
                      className="w-16 h-10 object-cover rounded-lg border border-white/10"
                    />
                    <span className="text-[11px] text-slate-400 truncate max-w-xs">
                      {formData.coverImage}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, coverImage: '' })}
                      className="text-rose-400 hover:text-rose-300 text-[11px] underline ml-auto cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Short Excerpt / Summary
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Key takeaway or introductory summary shown in article previews..."
                  className="w-full px-3.5 py-2 bg-black/50 border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#168CFF] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Article Body / Content *
                </label>
                <textarea
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write the full educational article. Paragraphs separated by line breaks..."
                  required
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#168CFF] leading-relaxed font-sans"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleFormSubmit('draft')}
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-amber-300 font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Save as Draft
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFormSubmit('published')}
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#168CFF] to-[#00D2FF] hover:opacity-90 text-[#041229] font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#041229]" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>Publish Article</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
