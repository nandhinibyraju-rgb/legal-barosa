import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  Briefcase, 
  Quote, 
  Calendar, 
  Phone, 
  ExternalLink, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';

export default function AdminOverviewTab({
  leads = [],
  services = [],
  articles = [],
  stories = [],
  contactSettings = {},
  bookingSettings = {},
  onSelectTab,
  onUpdateLeadStatus,
}) {
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  // Statistics
  const newLeadsCount = leads.filter((l) => !l.status || l.status === 'new').length;
  const publishedServicesCount = services.filter((s) => s.status === 'published').length;
  const publishedArticlesCount = articles.filter((a) => a.status === 'published').length;
  const draftArticlesCount = articles.filter((a) => a.status === 'draft').length;
  const publishedStoriesCount = stories.filter((s) => s.status === 'published').length;

  const formatDate = (val) => {
    if (!val) return '—';
    if (val.seconds) {
      return new Date(val.seconds * 1000).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    if (typeof val === 'string') {
      try {
        return new Date(val).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      } catch {
        return val;
      }
    }
    return '—';
  };

  const handleStatusChange = async (leadId, newStatus) => {
    setStatusUpdatingId(leadId);
    try {
      await onUpdateLeadStatus(leadId, newStatus);
    } catch (err) {
      console.error('Error updating lead status:', err);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-[#0B2A5B]/50 via-[#0B1528] to-[#041229] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#00D2FF]">
            Control Center
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-white mt-1">
            System & Website Overview
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Monitor real-time visitor enquiries, published content, and dynamic legal service modules.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#00D2FF]" />
          </a>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Leads */}
        <div 
          onClick={() => onSelectTab('overview')}
          className="bg-[#0B1528] border border-white/10 rounded-2xl p-5 hover:border-[#168CFF]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-medium">Inquiries & Leads</span>
            <div className="w-9 h-9 rounded-xl bg-[#168CFF]/15 border border-[#168CFF]/30 flex items-center justify-center text-[#00D2FF]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">{leads.length}</span>
            {newLeadsCount > 0 && (
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {newLeadsCount} new
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Captured from consultation forms</p>
        </div>

        {/* Metric 2: Services */}
        <div 
          onClick={() => onSelectTab('services')}
          className="bg-[#0B1528] border border-white/10 rounded-2xl p-5 hover:border-[#168CFF]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-medium">Legal Services</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">{publishedServicesCount}</span>
            <span className="text-[11px] text-slate-400">published</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1 group-hover:text-[#00D2FF] transition-colors">
            <span>Manage services directory</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* Metric 3: Articles */}
        <div 
          onClick={() => onSelectTab('articles')}
          className="bg-[#0B1528] border border-white/10 rounded-2xl p-5 hover:border-[#168CFF]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-medium">Articles & Knowledge</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">{publishedArticlesCount}</span>
            {draftArticlesCount > 0 && (
              <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                {draftArticlesCount} drafts
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1 group-hover:text-[#00D2FF] transition-colors">
            <span>Manage publication drafts</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* Metric 4: Real Client Stories */}
        <div 
          onClick={() => onSelectTab('stories')}
          className="bg-[#0B1528] border border-white/10 rounded-2xl p-5 hover:border-[#168CFF]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-medium">Real Client Stories</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-[#F4B400]">
              <Quote className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">{publishedStoriesCount || '40+'}</span>
            <span className="text-[11px] text-slate-400">active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1 group-hover:text-[#00D2FF] transition-colors">
            <span>Verified case studies</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* 3. Quick System Status & Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Contact Status Card */}
        <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#00D2FF]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Active Contact Channels
              </h3>
            </div>
            <button
              onClick={() => onSelectTab('contact')}
              className="text-[11px] text-[#00D2FF] hover:underline cursor-pointer"
            >
              Edit
            </button>
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Phone:</span>
              <span className="font-mono">{contactSettings?.phone || '7386444186'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Email:</span>
              <span className="font-mono truncate max-w-[180px]">{contactSettings?.email || 'Legalbharosa.orga@gmail.com'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">WhatsApp:</span>
              <span className="font-mono text-emerald-400">{contactSettings?.whatsappNumber || '917386444186'}</span>
            </div>
          </div>
        </div>

        {/* Booking Auto-Popup Status Card */}
        <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#F4B400]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Booking Popup Engine
              </h3>
            </div>
            <button
              onClick={() => onSelectTab('booking')}
              className="text-[11px] text-[#00D2FF] hover:underline cursor-pointer"
            >
              Configure
            </button>
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Auto Popup:</span>
              <span className={bookingSettings?.autoPopupEnabled !== false ? 'text-emerald-400 font-semibold' : 'text-rose-400'}>
                {bookingSettings?.autoPopupEnabled !== false ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Trigger Delay:</span>
              <span className="font-mono">{bookingSettings?.autoPopupDelaySeconds || 10} seconds</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Lead Destination:</span>
              <span className="font-medium text-slate-200">Firestore & WhatsApp</span>
            </div>
          </div>
        </div>

        {/* Content Shortcuts */}
        <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Fast Actions
              </h3>
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onSelectTab('homepage')}
                className="w-full text-left px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Edit Home Page Headings & Guidance</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('services')}
                className="w-full text-left px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Add / Publish New Legal Service</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('articles')}
                className="w-full text-left px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Compose New Knowledge Article</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Inquiries & Leads Table */}
      <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold font-heading text-white">
              Recent Consultation Inquiries
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live consultation requests submitted through website popups and contact pages.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Total Captured: <strong className="text-white">{leads.length}</strong>
          </span>
        </div>

        {leads.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <Users className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p>No consultation leads recorded yet in Firestore.</p>
            <p className="text-slate-500 mt-1">New submissions from booking forms will appear here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-medium">
                  <th className="pb-3 pr-4">Client Name</th>
                  <th className="pb-3 pr-4">Phone / WhatsApp</th>
                  <th className="pb-3 pr-4">Requested Service</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.slice(0, 10).map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 pr-4 font-semibold text-white">
                      {lead.name || 'Anonymous'}
                    </td>
                    <td className="py-3 pr-4 font-mono text-slate-300">
                      <a 
                        href={`tel:${lead.phone}`}
                        className="hover:text-[#00D2FF] transition-colors"
                      >
                        {lead.phone || '—'}
                      </a>
                    </td>
                    <td className="py-3 pr-4 text-slate-300">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px]">
                        {lead.service || lead.problemCategory || 'General Consultation'}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-400 text-[11px]">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="py-3 pr-4">
                      <select
                        value={lead.status || 'new'}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        disabled={statusUpdatingId === lead.id}
                        className={`text-[11px] font-semibold px-2 py-1 rounded-md border bg-black/40 cursor-pointer focus:outline-none ${
                          lead.status === 'resolved' || lead.status === 'completed'
                            ? 'text-emerald-400 border-emerald-500/30'
                            : lead.status === 'contacted' || lead.status === 'in_progress'
                            ? 'text-[#00D2FF] border-[#168CFF]/30'
                            : 'text-amber-400 border-amber-500/30'
                        }`}
                      >
                        <option value="new">New Inquiry</option>
                        <option value="contacted">Contacted</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="py-3">
                      {lead.phone && (
                        <a
                          href={`https://wa.me/91${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${lead.name || ''}, this is LegalBharosa regarding your consultation request for ${lead.service || 'legal advisory'}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          WhatsApp
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
// Final submission update
