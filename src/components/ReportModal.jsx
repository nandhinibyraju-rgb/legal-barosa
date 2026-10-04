import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Check, ShieldAlert, Loader2 } from 'lucide-react';
import { reportContent } from '../services/firestoreService';

const REPORT_REASONS = [
  'Inaccurate or misleading legal / financial advice',
  'Harassment, abusive language, or threatening tone',
  'Spam, advertising, or commercial solicitation',
  'Unauthorized disclosure of personal information / phone numbers',
  'Plagiarism or copyright infringement',
  'Other community safety concern',
];

export default function ReportModal({
  isOpen,
  onClose,
  targetType = 'article', // 'article' | 'comment'
  targetId,
  articleId,
  user,
}) {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetId) return;

    setIsSubmitting(true);
    setError('');

    try {
      await reportContent({
        targetType,
        targetId,
        articleId: articleId || targetId,
        reportedBy: user?.uid || 'anonymous_user',
        reason,
        details,
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setDetails('');
        onClose();
      }, 1800);
    } catch (err) {
      console.error('Error reporting content:', err);
      setError('Could not submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#0B2A5B] to-[#062D78] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">
                Report {targetType === 'article' ? 'Article' : 'Comment'}
              </h3>
              <p className="text-xs text-blue-200">
                Help keep the LegalBharosa community safe and accurate
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-neutral-900 mb-1">
              Thank You for Your Report
            </h4>
            <p className="text-xs text-neutral-600 max-w-xs">
              Our moderation team will review this {targetType} promptly to ensure compliance with community legal guidelines.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Reason for Reporting *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#168CFF] focus:ring-2 focus:ring-[#168CFF]/20 bg-white"
              >
                {REPORT_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Additional Details (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide any specific context or links to help our legal team evaluate this issue..."
                rows={3}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#168CFF] focus:ring-2 focus:ring-[#168CFF]/20 resize-none"
              />
            </div>

            <p className="text-[11px] text-neutral-400 leading-tight">
              Reports are reviewed confidentially by LegalBharosa administrators.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Report</span>
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
