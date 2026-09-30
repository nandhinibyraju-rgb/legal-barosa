import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HelpCircle, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Phone,
  Send,
  MessageSquare,
  Clock,
  ExternalLink,
  Scale
} from 'lucide-react';
import { CLIENT_REVIEWS, CATEGORY_THEMES } from '../data/reviewsData';

// Official SVG Brand Icons
function WhatsAppIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function TwitterXIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function FacebookIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z"/>
    </svg>
  );
}

export default function ReviewsSlideoutWidget({ onOpenConsult }) {
  const [isOpen, setIsOpen] = useState(false);
  const [quickQuestion, setQuickQuestion] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Top highlight case studies for drawer preview
  const drawerHighlightReviews = [
    CLIENT_REVIEWS[0], // Shiva - OTS ₹4.2 Cr
    CLIENT_REVIEWS[1], // Raju - SARFAESI
  ];

  const handleQuickQuestionSubmit = (e) => {
    e.preventDefault();
    const q = quickQuestion.trim();
    const message = q
      ? `Hello LegalBharosa, I have a quick question: ${q}`
      : 'Hello LegalBharosa, I need legal guidance regarding my loan/case.';
    const whatsappUrl = `https://wa.me/918790760524?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setQuickQuestion('');
    setIsOpen(false);
  };

  const handleNavigateToReviews = () => {
    setIsOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById('client-stories');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    navigate('/client-stories');
  };

  return (
    <>
      {/* ======================================================== */}
      {/* 1. CONSOLIDATED FLOATING VERTICAL 'NEED HELP' TAB */}
      {/* ======================================================== */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Need Help & Contact Support"
        className="fixed right-0 top-[38%] sm:top-1/2 -translate-y-1/2 z-40 bg-[#0B2A5B] hover:bg-[#168CFF] text-white py-3 px-1.5 sm:py-4 sm:px-2 rounded-l-xl shadow-2xl border-l border-y border-white/20 transition-all duration-200 flex flex-col items-center gap-2 cursor-pointer group hover:-translate-x-1 min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168CFF]"
        style={{ writingMode: 'vertical-rl' }}
      >
        <div className="flex items-center gap-1.5 rotate-180">
          <HelpCircle className="w-3.5 h-3.5 text-[#F4B400] shrink-0" />
          <span className="font-mono text-[10.5px] sm:text-[11px] font-bold tracking-widest uppercase">
            NEED HELP
          </span>
        </div>
      </button>

      {/* ======================================================== */}
      {/* 2. BACKDROP OVERLAY & CONSOLIDATED SLIDEOUT DRAWER */}
      {/* ======================================================== */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200" 
          />

          {/* Drawer Panel */}
          <aside 
            aria-label="Need Help and Support Desk"
            className="relative w-full sm:w-[450px] max-w-[100vw] h-full bg-white z-50 shadow-2xl flex flex-col border-l border-neutral-200 animate-in slide-in-from-right duration-300 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-200/80 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8.5 h-8.5 rounded-xl bg-blue-50 border border-[#168CFF]/20 flex items-center justify-center text-[#168CFF] shadow-2xs">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0B2A5B]">Need Legal Help?</h3>
                  <p className="text-[11px] text-neutral-500 font-medium">Direct Advocate Contact & Case Studies</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Support Panel"
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition-colors cursor-pointer shrink-0 min-w-[32px] min-h-[32px]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              
              {/* SECTION A: DIRECT CONTACT OPTIONS */}
              <div className="space-y-2.5">
                <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-neutral-400 block px-1">
                  Instant Communication
                </span>

                {/* WhatsApp Button */}
                <a
                  href="https://wa.me/918790760524?text=Hello%20LegalBharosa%2C%20I%20need%20urgent%20legal%20guidance%20with%20my%20loan%2Fcase."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-between shadow-md hover:shadow-lg transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <WhatsAppIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-[13px] font-bold leading-tight">Chat on WhatsApp</div>
                      <div className="text-[11px] text-white/90 font-medium leading-tight mt-0.5">
                        Instant advocate response & case assessment
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </a>

                {/* Direct Phone Call Button */}
                <a
                  href="tel:+918790760524"
                  className="w-full p-3.5 rounded-2xl bg-blue-50/80 hover:bg-blue-100/80 border border-[#168CFF]/25 text-[#0B2A5B] flex items-center justify-between shadow-2xs hover:shadow-xs transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#168CFF]/20 flex items-center justify-center text-[#168CFF] shrink-0 shadow-2xs">
                      <Phone className="w-4.5 h-4.5" />
                    </div>
                    <div className="text-left">
                      <div className="text-[13px] font-bold leading-tight flex items-center gap-2">
                        <span>Call Us: +91 8790760524</span>
                      </div>
                      <div className="text-[11px] text-neutral-500 font-medium leading-tight mt-0.5">
                        Available Mon – Sat, 10:00 AM – 7:00 PM IST
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#168CFF] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </a>
              </div>

              {/* SECTION B: ASK A QUICK QUESTION (Merged from SocialContactWidget) */}
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                <form onSubmit={handleQuickQuestionSubmit} className="flex flex-col gap-2">
                  <label htmlFor="drawer-quick-q" className="text-xs font-bold text-[#0B2A5B] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#168CFF]" />
                    <span>Ask a Quick Question</span>
                  </label>
                  <div className="relative">
                    <input
                      id="drawer-quick-q"
                      type="text"
                      value={quickQuestion}
                      onChange={(e) => setQuickQuestion(e.target.value)}
                      placeholder="Type your legal or loan query here..."
                      className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#168CFF]/30 focus:border-[#168CFF]"
                    />
                    <button
                      type="submit"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white transition-colors cursor-pointer"
                      aria-label="Send query to WhatsApp"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[10px] text-neutral-400">
                    Replies directly to your WhatsApp with advocate guidance.
                  </span>
                </form>
              </div>

              {/* SECTION C: SOCIAL MEDIA LINKS (Merged from SocialContactWidget) */}
              <div>
                <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-neutral-400 block px-1 mb-2">
                  Follow & Connect With Us
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <a
                    href="https://wa.me/918790760524"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-neutral-50 hover:bg-emerald-50 border border-neutral-200/80 hover:border-emerald-200 text-neutral-700 hover:text-emerald-700 flex flex-col items-center gap-1 text-[10.5px] font-medium transition-colors"
                  >
                    <WhatsAppIcon className="w-4.5 h-4.5 text-[#25D366]" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href="https://instagram.com/legalbharosa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-neutral-50 hover:bg-pink-50 border border-neutral-200/80 hover:border-pink-200 text-neutral-700 hover:text-pink-700 flex flex-col items-center gap-1 text-[10.5px] font-medium transition-colors"
                  >
                    <InstagramIcon className="w-4.5 h-4.5 text-pink-600" />
                    <span>Instagram</span>
                  </a>

                  <a
                    href="https://x.com/legalbharosa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 hover:border-neutral-300 text-neutral-700 hover:text-black flex flex-col items-center gap-1 text-[10.5px] font-medium transition-colors"
                  >
                    <TwitterXIcon className="w-4.5 h-4.5 text-neutral-800" />
                    <span>X (Twitter)</span>
                  </a>

                  <a
                    href="https://facebook.com/legalbharosa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-neutral-50 hover:bg-blue-50 border border-neutral-200/80 hover:border-blue-200 text-neutral-700 hover:text-blue-700 flex flex-col items-center gap-1 text-[10.5px] font-medium transition-colors"
                  >
                    <FacebookIcon className="w-4.5 h-4.5 text-blue-600" />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>

              {/* SECTION D: SEE ALL CLIENT REVIEWS & VERIFIED OUTCOMES */}
              <div className="pt-2 border-t border-neutral-200/80 space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                    Real Client Results
                  </span>
                  <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
                    40 Case Studies
                  </span>
                </div>

                {/* Primary Button linking to All Reviews */}
                <button
                  type="button"
                  onClick={handleNavigateToReviews}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#0B2A5B] to-[#123E8A] hover:from-[#168CFF] hover:to-[#0B2A5B] text-white text-xs sm:text-sm font-semibold flex items-center justify-between shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#F4B400]" />
                    <span>See All Client Reviews &amp; Case Studies</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#F4B400] group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Two Quick Case Study Highlights */}
                <div className="space-y-2">
                  {drawerHighlightReviews.map((rev) => {
                    const theme = CATEGORY_THEMES[rev.category];
                    return (
                      <div
                        key={rev.id}
                        onClick={handleNavigateToReviews}
                        className="p-3 rounded-xl bg-neutral-50/90 hover:bg-neutral-100/90 border border-neutral-200/70 text-left transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between gap-1.5 mb-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${theme.badgeClass}`}>
                            {rev.caseTopic}
                          </span>
                          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full">
                            {rev.clientName}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-600 line-clamp-3 leading-relaxed italic">
                          "{rev.reviewText}"
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Footer Consultation Action */}
            <div className="p-4 border-t border-neutral-200 bg-white shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenConsult?.('Need Help Drawer Consultation');
                }}
                className="w-full py-2.5 px-4 rounded-full bg-[#0B2A5B] hover:bg-[#123E8A] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer hover:shadow-md active:scale-[0.98]"
              >
                <span>Book a Free Confidential Consultation</span>
                <ArrowRight className="w-4 h-4 text-[#F4B400]" />
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
