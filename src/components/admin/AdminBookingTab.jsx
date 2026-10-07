import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { DEFAULT_BOOKING_SETTINGS } from '../../services/firestoreService';

export default function AdminBookingTab({
  bookingSettings,
  onSaveBookingSettings,
}) {
  const [formData, setFormData] = useState(DEFAULT_BOOKING_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bookingSettings) {
      setFormData({
        ...DEFAULT_BOOKING_SETTINGS,
        ...bookingSettings,
      });
    }
  }, [bookingSettings]);

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
    if (Number(formData.autoPopupDelaySeconds) < 2) {
      setError('Auto-popup delay must be at least 2 seconds.');
      return;
    }

    setSaving(true);
    setError('');
    setSaveSuccess(false);

    try {
      await onSaveBookingSettings({
        ...formData,
        autoPopupDelaySeconds: Number(formData.autoPopupDelaySeconds) || 10,
        autoPopupEnabled: Boolean(formData.autoPopupEnabled),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (err) {
      console.error('Error saving booking settings:', err);
      setError(err.message || 'Failed to save booking settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset all booking settings to default values?')) {
      setFormData(DEFAULT_BOOKING_SETTINGS);
      setSaveSuccess(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#0B1528] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#F4B400]" />
            <h2 className="text-xl font-bold font-heading text-white">
              Booking & Consultation Popup Settings
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure automatic popup timing, trigger conditions, modal headline, and statutory consent text without modifying design styles.
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
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Booking settings successfully updated in Firestore!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 shadow-lg">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl text-xs">
        {/* Toggle Switch */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/10">
          <div>
            <span className="text-sm font-bold text-white block">
              Automatic Booking Popup Trigger
            </span>
            <span className="text-slate-400 text-[11px] block mt-0.5">
              When enabled, visitors browsing the site automatically receive a consultation dialog.
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleChange('autoPopupEnabled', !formData.autoPopupEnabled)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer select-none bg-white/5"
          >
            {formData.autoPopupEnabled !== false ? (
              <>
                <span className="text-emerald-400 font-bold text-xs">Enabled</span>
                <ToggleRight className="w-6 h-6 text-emerald-400" />
              </>
            ) : (
              <>
                <span className="text-slate-400 font-bold text-xs">Disabled</span>
                <ToggleLeft className="w-6 h-6 text-slate-500" />
              </>
            )}
          </button>
        </div>

        {/* Trigger Delay */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#00D2FF]" />
            <span>Auto-Popup Trigger Delay (Seconds)</span>
          </label>
          <div className="max-w-xs">
            <input
              type="number"
              min="2"
              max="120"
              value={formData.autoPopupDelaySeconds || 10}
              onChange={(e) => handleChange('autoPopupDelaySeconds', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white font-mono focus:outline-none focus:border-[#168CFF]"
            />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Default is 10 seconds. The modal will gently appear after the visitor browses for this duration.
          </span>
        </div>

        {/* Modal Heading & Subtitle */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1.5">
            Modal Title / Header
          </label>
          <input
            type="text"
            value={formData.popupTitle || ''}
            onChange={(e) => handleChange('popupTitle', e.target.value)}
            placeholder="Get Immediate Advocate Consultation"
            className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-sm font-semibold focus:outline-none focus:border-[#168CFF]"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1.5">
            Modal Subtitle / Purpose Description
          </label>
          <textarea
            rows={2}
            value={formData.popupSubtitle || ''}
            onChange={(e) => handleChange('popupSubtitle', e.target.value)}
            placeholder="Speak directly with experienced legal advisors regarding recovery harassment..."
            className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#168CFF] leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1.5">
            Submit Button CTA Text
          </label>
          <input
            type="text"
            value={formData.submitButtonText || ''}
            onChange={(e) => handleChange('submitButtonText', e.target.value)}
            placeholder="Request Legal Consultation"
            className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#168CFF]"
          />
        </div>

        {/* Legal Consent Text */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00D2FF]" />
            <span>Statutory Privacy & Legal Advisory Consent Agreement Text</span>
          </label>
          <textarea
            rows={3}
            value={formData.consentText || ''}
            onChange={(e) => handleChange('consentText', e.target.value)}
            placeholder="I consent to receive legal advisory communication, case assessment updates..."
            className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white focus:outline-none focus:border-[#168CFF] leading-relaxed"
          />
          <span className="text-[11px] text-slate-500 mt-1 block">
            Displayed beside the mandatory consent checkbox on the booking form.
          </span>
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
          <span>Save Booking Settings</span>
        </button>
      </div>
    </form>
  );
}
// Final submission update
