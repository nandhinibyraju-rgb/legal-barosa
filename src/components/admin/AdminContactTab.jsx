import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  MessageCircle,
  Clock
} from 'lucide-react';
import { DEFAULT_CONTACT_SETTINGS } from '../../services/firestoreService';

export default function AdminContactTab({
  contactSettings,
  onSaveContactSettings,
}) {
  const [formData, setFormData] = useState(DEFAULT_CONTACT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (contactSettings) {
      setFormData({
        ...DEFAULT_CONTACT_SETTINGS,
        ...contactSettings,
      });
    }
  }, [contactSettings]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSaveSuccess(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone?.trim()) {
      setError('Phone number cannot be empty.');
      return;
    }
    if (!formData.email?.trim()) {
      setError('Email address cannot be empty.');
      return;
    }

    setSaving(true);
    setError('');
    setSaveSuccess(false);

    try {
      await onSaveContactSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (err) {
      console.error('Error saving contact settings:', err);
      setError(err.message || 'Failed to save contact settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset all contact details to default values?')) {
      setFormData(DEFAULT_CONTACT_SETTINGS);
      setSaveSuccess(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#0B1528] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#00D2FF]" />
            <h2 className="text-xl font-bold font-heading text-white">
              Contact & Communication Channels
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Update official telephone numbers, email address, WhatsApp gateway, and Google Maps location.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#168CFF] to-[#00D2FF] hover:opacity-90 text-[#041229] font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#168CFF]/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#041229]" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Contact Info</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Contact details successfully updated in Firestore and published across the website!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 shadow-lg">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Fields */}
      <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span>Direct Phone Number *</span>
            </label>
            <input
              type="text"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="7386444186"
              required
              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white font-mono focus:outline-none focus:border-[#168CFF]"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">Used for click-to-call links.</span>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-purple-400" />
              <span>Official Support Email *</span>
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Legalbharosa.orga@gmail.com"
              required
              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#168CFF]"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">Primary email for legal enquiries.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Number (With country code)</span>
            </label>
            <input
              type="text"
              value={formData.whatsappNumber || ''}
              onChange={(e) => handleChange('whatsappNumber', e.target.value)}
              placeholder="917386444186"
              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white font-mono focus:outline-none focus:border-[#168CFF]"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">e.g. 917386444186 (no spaces or plus sign)</span>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Advisory Desk Operating Hours</span>
            </label>
            <input
              type="text"
              value={formData.hours || ''}
              onChange={(e) => handleChange('hours', e.target.value)}
              placeholder="Mon - Sat: 9:30 AM - 7:00 PM IST"
              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#168CFF]"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1.5">
            Default WhatsApp Pre-filled Message
          </label>
          <input
            type="text"
            value={formData.whatsappMessage || ''}
            onChange={(e) => handleChange('whatsappMessage', e.target.value)}
            placeholder="Hello LegalBharosa, I would like to consult regarding my case."
            className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#168CFF]"
          />
          <span className="text-[11px] text-slate-500 mt-1 block">Pre-filled when visitors click any WhatsApp consultation button.</span>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>Google Maps Location URL</span>
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={formData.mapsUrl || ''}
              onChange={(e) => handleChange('mapsUrl', e.target.value)}
              placeholder="https://maps.app.goo.gl/..."
              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white font-mono text-[11px] focus:outline-none focus:border-[#168CFF]"
            />
            {formData.mapsUrl && (
              <a
                href={formData.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-white/10 hover:bg-white/15 rounded-xl text-slate-300 hover:text-white flex items-center shrink-0 transition-colors"
                title="Test Google Maps Link"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1.5">
            Physical Office / Registered Address
          </label>
          <textarea
            rows={2}
            value={formData.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="VV Vintage Boulevard, Raj Bhavan Rd, Somajiguda, Hyderabad..."
            className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#168CFF] leading-relaxed"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#168CFF] to-[#00D2FF] hover:opacity-90 text-[#041229] font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#168CFF]/20 transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#041229]" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Save Contact Details</span>
        </button>
      </div>
    </form>
  );
}
// Final submission update
