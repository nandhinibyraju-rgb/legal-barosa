import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Video, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { DEFAULT_HOMEPAGE_SETTINGS } from '../../services/firestoreService';

export default function AdminHomePageTab({
  homepageSettings,
  onSaveHomepageSettings,
}) {
  const [formData, setFormData] = useState(DEFAULT_HOMEPAGE_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (homepageSettings) {
      setFormData({
        ...DEFAULT_HOMEPAGE_SETTINGS,
        ...homepageSettings,
        guidanceCards: homepageSettings.guidanceCards || DEFAULT_HOMEPAGE_SETTINGS.guidanceCards,
      });
    }
  }, [homepageSettings]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSaveSuccess(false);
    setError('');
  };

  const handleGuidanceCardChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedCards = [...(prev.guidanceCards || DEFAULT_HOMEPAGE_SETTINGS.guidanceCards)];
      updatedCards[index] = {
        ...updatedCards[index],
        [field]: value,
      };
      return {
        ...prev,
        guidanceCards: updatedCards,
      };
    });
    setSaveSuccess(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.heroHeadline?.trim()) {
      setError('Hero headline cannot be empty.');
      return;
    }

    setSaving(true);
    setError('');
    setSaveSuccess(false);

    try {
      await onSaveHomepageSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (err) {
      console.error('Error saving homepage settings:', err);
      setError(err.message || 'Failed to save changes to Firestore.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset all Home Page text to the original defaults? Unsaved changes will be replaced.')) {
      setFormData(DEFAULT_HOMEPAGE_SETTINGS);
      setSaveSuccess(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#0B1528] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-[#00D2FF]" />
            <h2 className="text-xl font-bold font-heading text-white">
              Home Page Content Editor
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Customize hero headline, subtext, CTA button labels, and the practical guidance cards. Changes update live across the website.
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
            <span>Save Home Page</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Home page content successfully saved to Firestore and published to the live website!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 shadow-lg">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Hero Section Content */}
      <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="pb-3 border-b border-white/10 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#F4B400]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            1. Hero Section (Top Screen)
          </h3>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Hero Top Badge Text
          </label>
          <input
            type="text"
            value={formData.heroBadge || ''}
            onChange={(e) => handleChange('heroBadge', e.target.value)}
            placeholder="DIRECT CASE RESOLUTION • EVIDENCE RECORDING"
            className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#168CFF]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Main Hero Headline
          </label>
          <input
            type="text"
            value={formData.heroHeadline || ''}
            onChange={(e) => handleChange('heroHeadline', e.target.value)}
            placeholder="Stop Illegal Recovery Harassment & Resolve Overdue Loans"
            className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#168CFF]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Hero Subtitle / Description
          </label>
          <textarea
            rows={3}
            value={formData.heroSubtitle || ''}
            onChange={(e) => handleChange('heroSubtitle', e.target.value)}
            placeholder="LegalBharosa connects distressed borrowers with qualified legal counsel..."
            className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#168CFF] leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Primary Action Button Label
            </label>
            <input
              type="text"
              value={formData.heroPrimaryBtnText || ''}
              onChange={(e) => handleChange('heroPrimaryBtnText', e.target.value)}
              placeholder="Consult an Advocate"
              className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#168CFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Secondary Action Button Label
            </label>
            <input
              type="text"
              value={formData.heroSecondaryBtnText || ''}
              onChange={(e) => handleChange('heroSecondaryBtnText', e.target.value)}
              placeholder="Explore Legal Services"
              className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#168CFF]"
            />
          </div>
        </div>
      </div>

      {/* 2. Video & Guidance Section Content */}
      <div className="bg-[#0B1528] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="pb-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-[#00D2FF]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              2. Video & Practical Guidance Section
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            "REAL DEFENSE. GENUINE RELIEF."
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Section Badge
          </label>
          <input
            type="text"
            value={formData.videoSectionBadge || ''}
            onChange={(e) => handleChange('videoSectionBadge', e.target.value)}
            placeholder="PRACTICAL BORROWER ADVISORY • STEP-BY-STEP GUIDANCE"
            className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#168CFF]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Section Heading
          </label>
          <input
            type="text"
            value={formData.videoSectionTitle || ''}
            onChange={(e) => handleChange('videoSectionTitle', e.target.value)}
            placeholder="REAL DEFENSE. GENUINE RELIEF."
            className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#168CFF]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Section Subtitle
          </label>
          <textarea
            rows={2}
            value={formData.videoSectionSubtitle || ''}
            onChange={(e) => handleChange('videoSectionSubtitle', e.target.value)}
            placeholder="Practical, step-by-step guidance to help you navigate loan notices..."
            className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#168CFF] leading-relaxed"
          />
        </div>

        {/* The 4 Guidance Cards */}
        <div className="pt-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#F4B400]" />
            <span>The 4 Practical Guidance Cards</span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(formData.guidanceCards || DEFAULT_HOMEPAGE_SETTINGS.guidanceCards).map((card, idx) => (
              <div 
                key={card.id || idx}
                className="bg-black/30 border border-white/10 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#00D2FF]">
                  <span>Card {idx + 1}</span>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={card.title || ''}
                    onChange={(e) => handleGuidanceCardChange(idx, 'title', e.target.value)}
                    placeholder="Card Title"
                    className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-[#168CFF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                    Card Description
                  </label>
                  <textarea
                    rows={3}
                    value={card.description || ''}
                    onChange={(e) => handleGuidanceCardChange(idx, 'description', e.target.value)}
                    placeholder="Guidance explanation..."
                    className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-[#168CFF] leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Save Action */}
      <div className="flex justify-end gap-3 pt-2">
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
          <span>Save Changes to Home Page</span>
        </button>
      </div>
    </form>
  );
}
// Final submission update
