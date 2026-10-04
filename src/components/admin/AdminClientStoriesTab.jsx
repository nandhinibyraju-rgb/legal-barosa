import React, { useState } from 'react';
import { 
  Quote, 
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
  ShieldAlert,
  Search,
  Building,
  Scale
} from 'lucide-react';
import { REVIEW_CATEGORIES } from '../../data/reviewsData';

const AVAILABLE_CATEGORIES = REVIEW_CATEGORIES.filter((c) => c !== 'All');

export default function AdminClientStoriesTab({
  stories = [],
  onCreateStory,
  onUpdateStory,
  onDeleteStory,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    clientName: '',
    city: '',
    caseTopic: '',
    category: 'OTS',
    reviewText: '',
    exposure: '',
    resolution: '',
    timeline: '',
    status: 'published',
  });

  const handleOpenCreate = () => {
    setEditingStory(null);
    setFormData({
      clientName: '',
      city: '',
      caseTopic: '',
      category: 'OTS',
      reviewText: '',
      exposure: '',
      resolution: '',
      timeline: '',
      status: 'published',
    });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (story) => {
    setEditingStory(story);
    setFormData({
      clientName: story.clientName || '',
      city: story.city || '',
      caseTopic: story.caseTopic || '',
      category: story.category || 'OTS',
      reviewText: story.reviewText || '',
      exposure: story.caseSummary?.exposure || '',
      resolution: story.caseSummary?.resolution || '',
      timeline: story.caseSummary?.timeline || '',
      status: story.status || 'published',
    });
    setError('');
    setModalOpen(true);
  };

  const handleTogglePublish = async (story) => {
    const nextStatus = story.status === 'published' ? 'draft' : 'published';
    try {
      await onUpdateStory(story.id, { status: nextStatus });
      setSuccess(`Client Story for "${story.clientName}" is now ${nextStatus}.`);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Error toggling story status:', err);
      setError(err.message || 'Failed to update story status.');
    }
  };

  const handleDelete = async (storyId) => {
    try {
      await onDeleteStory(storyId);
      setDeleteConfirmId(null);
      setSuccess('Client story deleted.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Error deleting story:', err);
      setError(err.message || 'Failed to delete client story.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clientName.trim()) {
      setError('Client name is required.');
      return;
    }
    if (!formData.caseTopic.trim()) {
      setError('Case topic is required.');
      return;
    }
    if (!formData.reviewText.trim()) {
      setError('Review / testimonial statement is required.');
      return;
    }

    setSubmitting(true);
    setError('');

    const payload = {
      clientName: formData.clientName.trim(),
      city: formData.city.trim(),
      caseTopic: formData.caseTopic.trim(),
      category: formData.category,
      reviewText: formData.reviewText.trim(),
      caseSummary: {
        exposure: formData.exposure.trim(),
        resolution: formData.resolution.trim(),
        timeline: formData.timeline.trim(),
      },
      status: formData.status,
    };

    try {
      if (editingStory) {
        await onUpdateStory(editingStory.id, payload);
        setSuccess(`Client story for "${payload.clientName}" updated successfully.`);
      } else {
        await onCreateStory(payload);
        setSuccess(`Verified client story for "${payload.clientName}" added.`);
      }
      setModalOpen(false);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Error saving story:', err);
      setError(err.message || 'Failed to save client story.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered stories
  const filteredStories = stories.filter((story) => {
    const matchesCat = selectedCategory === 'All' || story.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      story.clientName?.toLowerCase().includes(q) ||
      story.caseTopic?.toLowerCase().includes(q) ||
      story.reviewText?.toLowerCase().includes(q) ||
      story.caseSummary?.exposure?.toLowerCase().includes(q) ||
      story.caseSummary?.resolution?.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#0B1528] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Quote className="w-5 h-5 text-[#F4B400]" />
            <h2 className="text-xl font-bold font-heading text-white">
              Client Stories & Verified Case Studies
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage authentic client experiences, loan resolution timelines, and advocate intervention summaries.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#168CFF] to-[#00D2FF] hover:opacity-90 text-[#041229] font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#168CFF]/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client Story</span>
        </button>
      </div>

      {/* Trust & Compliance Warning */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-[#F4B400] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-white">LegalBharosa Real Information Policy</p>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Only add genuine, verified client testimonials and real case summaries. In accordance with ethical standards, do not invent reviews, fictional ratings, or guaranteed settlement outcomes.
          </p>
        </div>
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

      {/* Search and Category Filter */}
      <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stories by client, topic..."
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
            {AVAILABLE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-400 whitespace-nowrap">
            ({filteredStories.length} found)
          </span>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStories.length === 0 ? (
          <div className="col-span-full bg-[#0B1528] border border-white/10 rounded-2xl p-12 text-center text-xs text-slate-400">
            <Quote className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p>No client stories found matching criteria.</p>
          </div>
        ) : (
          filteredStories.map((story) => (
            <div
              key={story.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                story.status === 'draft'
                  ? 'bg-[#0B1528]/60 border-white/5 opacity-80'
                  : 'bg-[#0B1528] border-white/10 hover:border-[#168CFF]/30'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">
                        {story.clientName}
                      </h3>
                      {story.city && (
                        <span className="text-[11px] text-slate-400">
                          • {story.city}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#00D2FF] font-medium">
                      {story.caseTopic}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                      story.status === 'published'
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                        : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                    }`}
                  >
                    {story.status || 'published'}
                  </span>
                </div>

                {/* Case Summary Snapshot */}
                <div className="my-3 p-3 rounded-xl bg-black/40 border border-white/5 grid grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Exposure</span>
                    <span className="text-slate-300 font-medium truncate block">
                      {story.caseSummary?.exposure || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Resolution</span>
                    <span className="text-emerald-400 font-medium truncate block">
                      {story.caseSummary?.resolution || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Timeline</span>
                    <span className="text-slate-300 font-medium truncate block">
                      {story.caseSummary?.timeline || '—'}
                    </span>
                  </div>
                </div>

                {/* Review Quote */}
                <p className="text-xs text-slate-300 italic leading-relaxed line-clamp-3">
                  "{story.reviewText}"
                </p>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded border border-white/5">
                  Category: {story.category}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(story)}
                    title={story.status === 'published' ? 'Unpublish' : 'Publish'}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {story.status === 'published' ? (
                      <EyeOff className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(story)}
                    title="Edit story"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[#00D2FF] transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(story.id)}
                    title="Delete story"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Confirm Delete */}
              {deleteConfirmId === story.id && (
                <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
                  <span>Confirm deletion of this story?</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(story.id)}
                      className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[11px] cursor-pointer"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-slate-300 text-[11px] cursor-pointer"
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

      {/* Modal Dialog: Add / Edit Client Story */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0B1528] border border-white/15 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 my-8 relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold font-heading text-white">
                {editingStory ? 'Edit Client Story' : 'Add Real Client Story'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="e.g. Ramesh K. or Vikram S."
                    required
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#168CFF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    City / State
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Hyderabad, Telangana"
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#168CFF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Case Topic *
                  </label>
                  <input
                    type="text"
                    value={formData.caseTopic}
                    onChange={(e) => setFormData({ ...formData, caseTopic: e.target.value })}
                    placeholder="e.g. Unsecured Personal Loan Settlement"
                    required
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#168CFF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#168CFF] cursor-pointer"
                  >
                    {AVAILABLE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Case Summary Fields */}
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00D2FF] block">
                  Case Resolution Summary
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Loan Exposure
                    </label>
                    <input
                      type="text"
                      value={formData.exposure}
                      onChange={(e) => setFormData({ ...formData, exposure: e.target.value })}
                      placeholder="e.g. ₹18 Lakhs"
                      className="w-full px-3 py-1.5 bg-black/50 border border-white/15 rounded-lg text-white text-[11px] focus:outline-none focus:border-[#168CFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Resolution
                    </label>
                    <input
                      type="text"
                      value={formData.resolution}
                      onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                      placeholder="e.g. Formal OTS Waiver"
                      className="w-full px-3 py-1.5 bg-black/50 border border-white/15 rounded-lg text-white text-[11px] focus:outline-none focus:border-[#168CFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Timeline
                    </label>
                    <input
                      type="text"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      placeholder="e.g. 5 Weeks"
                      className="w-full px-3 py-1.5 bg-black/50 border border-white/15 rounded-lg text-white text-[11px] focus:outline-none focus:border-[#168CFF]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Client Statement / Testimonial *
                </label>
                <textarea
                  rows={4}
                  value={formData.reviewText}
                  onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                  placeholder="Verbatim feedback provided by the client regarding advocate support and grievance escalation..."
                  required
                  className="w-full px-3.5 py-2 bg-black/50 border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#168CFF] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Publication Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2 bg-black/50 border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#168CFF] cursor-pointer"
                >
                  <option value="published">Published (Visible on site)</option>
                  <option value="draft">Draft (Private to Admin)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#168CFF] to-[#00D2FF] hover:opacity-90 text-[#041229] font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#041229]" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>{editingStory ? 'Update Story' : 'Save Story'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
