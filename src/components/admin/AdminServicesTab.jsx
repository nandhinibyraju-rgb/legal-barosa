import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Scale,
  FileText,
  ChartLine,
  Building,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { ALL_SERVICES } from '../../pages/ServicesPage';

const ICON_OPTIONS = [
  { label: 'ShieldCheck (Harassment / Protection)', value: 'ShieldCheck', icon: ShieldCheck },
  { label: 'Scale (Settlement / Arbitration)', value: 'Scale', icon: Scale },
  { label: 'FileText (Legal Notice / Document)', value: 'FileText', icon: FileText },
  { label: 'ChartLine (Debt Restructuring)', value: 'ChartLine', icon: ChartLine },
  { label: 'Building (Corporate / NPA)', value: 'Building', icon: Building },
  { label: 'TrendingUp (Financial / Credit)', value: 'TrendingUp', icon: TrendingUp },
  { label: 'UserCheck (Advocate Representation)', value: 'UserCheck', icon: UserCheck },
];

export default function AdminServicesTab({
  services = [],
  onCreateService,
  onUpdateService,
  onDeleteService,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    tag: 'Legal Advisory',
    description: '',
    longDescription: '',
    iconName: 'ShieldCheck',
    status: 'published',
    order: 0,
  });

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({
      title: '',
      slug: '',
      tag: 'Legal Advisory',
      description: '',
      longDescription: '',
      iconName: 'ShieldCheck',
      status: 'published',
      order: services.length + 1,
    });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      slug: service.slug || '',
      tag: service.tag || 'Legal Advisory',
      description: service.description || '',
      longDescription: service.longDescription || '',
      iconName: service.iconName || 'ShieldCheck',
      status: service.status || 'published',
      order: service.order || 0,
    });
    setError('');
    setModalOpen(true);
  };

  const handleTogglePublish = async (service) => {
    const nextStatus = service.status === 'published' ? 'draft' : 'published';
    try {
      await onUpdateService(service.id, { status: nextStatus });
      setSuccess(`Service "${service.title}" is now ${nextStatus}.`);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Error toggling service status:', err);
      setError(err.message || 'Failed to update service status.');
    }
  };

  const handleDelete = async (serviceId) => {
    try {
      await onDeleteService(serviceId);
      setDeleteConfirmId(null);
      setSuccess('Service successfully removed.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Error deleting service:', err);
      setError(err.message || 'Failed to delete service.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Service title is required.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Service description is required.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (editingService) {
        await onUpdateService(editingService.id, formData);
        setSuccess(`Service "${formData.title}" updated successfully.`);
      } else {
        await onCreateService(formData);
        setSuccess(`New service "${formData.title}" created successfully.`);
      }
      setModalOpen(false);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Error saving service:', err);
      setError(err.message || 'Failed to save service.');
    } finally {
      setSubmitting(false);
    }
  };

  // Merge default hardcoded services as display reference if firestore is empty
  const displayServices = services.length > 0 ? services : ALL_SERVICES.map((s, idx) => ({
    ...s,
    order: idx + 1,
    status: 'published',
    isDefaultFallback: true,
  }));

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#0B1528] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#00D2FF]" />
            <h2 className="text-xl font-bold font-heading text-white">
              Legal Services Management
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Add, update, publish, or unpublish specialized legal advisory services visible across the public directory.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#168CFF] to-[#00D2FF] hover:opacity-90 text-[#041229] font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#168CFF]/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
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

      {/* Services List / Table */}
      <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <span className="text-xs font-semibold text-white uppercase tracking-wider">
            All Configured Services ({displayServices.length})
          </span>
          <span className="text-[11px] text-slate-400">
            Publish status updates public cards instantly
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayServices.map((svc) => (
            <div
              key={svc.id || svc.slug}
              className={`p-4 rounded-xl border transition-all ${
                svc.status === 'draft'
                  ? 'bg-black/30 border-white/5 opacity-70'
                  : 'bg-black/40 border-white/10 hover:border-[#168CFF]/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#168CFF]/15 border border-[#168CFF]/30 flex items-center justify-center text-[#00D2FF]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {svc.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">
                      /services/{svc.slug}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Status Badge */}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                      svc.status === 'published'
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                        : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                    }`}
                  >
                    {svc.status || 'published'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-2">
                {svc.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-[11px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                  {svc.tag || 'Legal Advisory'}
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Publish/Unpublish toggle */}
                  {!svc.isDefaultFallback && (
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(svc)}
                      title={svc.status === 'published' ? 'Unpublish (Save as draft)' : 'Publish to website'}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {svc.status === 'published' ? (
                        <EyeOff className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-emerald-400" />
                      )}
                    </button>
                  )}

                  {/* Edit button */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(svc)}
                    title="Edit service details"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[#00D2FF] transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete button with confirmation */}
                  {!svc.isDefaultFallback && (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(svc.id)}
                      title="Delete service"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* In-place Delete Confirmation */}
              {deleteConfirmId === svc.id && (
                <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
                  <span>Are you sure you want to permanently delete this service?</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(svc.id)}
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
          ))}
        </div>
      </div>

      {/* Modal Dialog: Create / Edit Service */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0B1528] border border-white/15 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 my-8 relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold font-heading text-white">
                {editingService ? 'Edit Legal Service' : 'Add New Legal Service'}
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
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Loan Settlement & Restructuring"
                  required
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#168CFF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Slug / URL Path
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. loan-settlement"
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/15 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[#168CFF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Tag / Category Badge
                  </label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="e.g. RBI Fair Practices"
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#168CFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Short Description (Card view) *
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary explaining what the service addresses..."
                  required
                  className="w-full px-3.5 py-2 bg-black/50 border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#168CFF] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Details & Regulatory Guidance (Optional)
                </label>
                <textarea
                  rows={4}
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  placeholder="Detailed breakdown of statutory provisions, advocate representation steps, and document checklist..."
                  className="w-full px-3.5 py-2 bg-black/50 border border-white/15 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#168CFF] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Representative Icon
                  </label>
                  <select
                    value={formData.iconName}
                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#168CFF] cursor-pointer"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
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
                  <span>{editingService ? 'Update Service' : 'Create Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
// Final submission update
