import React, { useState, useEffect, useRef } from 'react';
import { Phone, X, ChevronUp, ChevronDown, Send, MessageSquare } from 'lucide-react';

// Official SVG Brand Icons
function WhatsAppIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}

function InstagramIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function TwitterXIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function FacebookIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z"/>
    </svg>
  );
}

export default function SocialContactWidget({ onOpenConsult }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isWaHovered, setIsWaHovered] = useState(false);
  const [quickQuestion, setQuickQuestion] = useState('');
  const menuContainerRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  // Close menu when tapping outside (for mobile)
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuContainerRef.current && !menuContainerRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Desktop hover handlers for the Contact Us / Social Menu trigger
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setMenuOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setMenuOpen(false);
    }, 250);
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const handleQuickQuestionSubmit = (e) => {
    e.preventDefault();
    const q = quickQuestion.trim();
    const message = q
      ? `Hello LegalBharosa, I have a quick question: ${q}`
      : 'Hello LegalBharosa, I have a quick question regarding legal consultation.';
    const whatsappUrl = `https://wa.me/918790760524?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setQuickQuestion('');
    setMenuOpen(false);
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-[999] flex flex-col items-end gap-2 sm:gap-2.5 select-none">
      {/* ======================================================== */}
      {/* PART 2: CONTACT US TRIGGER & HOVER/TAP SOCIAL MENU */}
      {/* ======================================================== */}
      <div 
        ref={menuContainerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex flex-col items-end gap-2"
      >
        {/* Social Menu Popup with smooth slide & fade animation */}
        <div
          className={`transition-all duration-300 ease-out origin-bottom-right ${
            menuOpen
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 translate-y-3 scale-95 pointer-events-none'
          }`}
        >
          <div className="bg-[#121418]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-3.5 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(18,185,242,0.15)] flex flex-col gap-3 min-w-[260px] sm:min-w-[285px] max-w-[calc(100vw-24px)]">
            {/* Header & Micro-copy */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <p className="text-[11px] font-semibold text-white tracking-wide">
                  Reach us anytime
                </p>
                <p className="text-[10px] text-zinc-400">
                  Get in touch — we respond fast
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="text-zinc-400 hover:text-white p-1.5 rounded-md hover:bg-white/10 transition-colors sm:hidden min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label="Close social menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ASK A QUICK QUESTION (Lower-commitment WhatsApp Option) */}
            <div className="flex flex-col gap-1.5 bg-white/[0.04] p-2.5 rounded-xl border border-white/10">
              <label 
                htmlFor="quick-question-input" 
                className="text-[11px] font-semibold text-white tracking-wide flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Ask a Quick Question</span>
                </span>
                <span className="text-[9.5px] text-[#25D366] font-medium uppercase tracking-wider">
                  WhatsApp
                </span>
              </label>

              <form onSubmit={handleQuickQuestionSubmit} className="flex items-center gap-1.5">
                <input
                  id="quick-question-input"
                  type="text"
                  value={quickQuestion}
                  onChange={(e) => setQuickQuestion(e.target.value)}
                  placeholder="e.g. Can recovery calls be stopped?"
                  className="flex-1 bg-white/[0.08] hover:bg-white/[0.12] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#25D366] focus:border-[#25D366] transition-all min-h-[36px]"
                />
                <button
                  type="submit"
                  aria-label="Send question via WhatsApp"
                  className="h-[36px] px-3 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              <p className="text-[9.5px] text-zinc-400 leading-tight">
                No commitment or form needed. Direct WhatsApp chat.
              </p>
            </div>

            {/* 4 Social Icons Row */}
            <div className="flex items-center justify-between gap-2.5 pt-0.5">
              {/* 1. WhatsApp */}
              <a
                href="https://wa.me/918790760524"
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                className="w-11 h-11 rounded-xl bg-white/[0.06] hover:bg-[#25D366] text-[#25D366] hover:text-white border border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-[0_0_20px_rgba(37,211,102,0.6)] group/icon"
              >
                <WhatsAppIcon className="w-5 h-5 transition-transform duration-200 group-hover/icon:scale-110" />
              </a>

              {/* 2. Instagram */}
              <a
                href="https://www.instagram.com/reels/DZRUnoQxav2/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow on Instagram"
                className="w-11 h-11 rounded-xl bg-white/[0.06] hover:bg-gradient-to-tr hover:from-[#fdf497] hover:via-[#fd5949] hover:to-[#d6249f] text-[#E1306C] hover:text-white border border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-[0_0_20px_rgba(225,48,108,0.6)] group/icon"
              >
                <InstagramIcon className="w-5 h-5 transition-transform duration-200 group-hover/icon:scale-110" />
              </a>

              {/* 3. Twitter / X */}
              <a
                href="https://x.com/legalbharosa"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow on X / Twitter"
                className="w-11 h-11 rounded-xl bg-white/[0.06] hover:bg-white text-zinc-300 hover:text-black border border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] group/icon"
              >
                <TwitterXIcon className="w-4 h-4 transition-transform duration-200 group-hover/icon:scale-110" />
              </a>

              {/* 4. Facebook */}
              <a
                href="https://www.facebook.com/legalbharosa"
                target="_blank"
                rel="noopener noreferrer"
                title="Connect on Facebook"
                className="w-11 h-11 rounded-xl bg-white/[0.06] hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-[0_0_20px_rgba(24,119,242,0.6)] group/icon"
              >
                <FacebookIcon className="w-5 h-5 transition-transform duration-200 group-hover/icon:scale-110" />
              </a>
            </div>

            {/* Direct Consultation Booking Action */}
            {onOpenConsult && (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenConsult('Bottom-Right Contact Widget');
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#062D78] hover:bg-[#0B2A5B] border border-white/10 text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Book Free Consultation</span>
              </button>
            )}

            {/* Quick Helpline Direct Action */}
            <a
              href="tel:+918790760524"
              className="mt-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-all hover:scale-[1.02]"
            >
              <Phone className="w-3.5 h-3.5 text-[#12B9F2]" />
              <span>Call: +91 8790760524</span>
            </a>
          </div>
        </div>

        {/* "Contact Us" Trigger Pill Button */}
        <button
          type="button"
          onClick={toggleMenu}
          aria-label="Contact Us Social Menu"
          aria-expanded={menuOpen}
          className="h-[38px] px-3.5 rounded-full bg-[#121418]/90 hover:bg-[#1c1f26] border border-white/20 backdrop-blur-xl text-white text-xs font-semibold shadow-[0_6px_20px_rgba(0,0,0,0.5)] flex items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:border-white/40 active:scale-95 group/pill min-h-[38px]"
        >
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span className="tracking-wide">Contact Us</span>
          {menuOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover/pill:text-white transition-colors" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-zinc-400 group-hover/pill:text-white transition-colors" />
          )}
        </button>
      </div>

      {/* ======================================================== */}
      {/* PART 1: FLOATING WHATSAPP BUTTON */}
      {/* - Fixed position, bottom-right corner */}
      {/* - Circular green button (#25D366), white icon centered */}
      {/* - Size ~50px on mobile, ~58px on desktop, z-index 999 */}
      {/* - Soft pulsing glow animation loop */}
      {/* - On hover: scale(1.08) + "Chat with us" tooltip to the left */}
      {/* ======================================================== */}
      <div className="relative flex items-center">
        {/* Tooltip to the left of the WhatsApp button */}
        <div 
          className={`absolute right-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#121418]/95 backdrop-blur-md border border-white/15 text-white text-xs font-medium whitespace-nowrap shadow-[0_8px_25px_rgba(0,0,0,0.6)] transition-all duration-200 pointer-events-none z-10 ${
            isWaHovered 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 translate-x-1'
          }`}
        >
          <span>Chat with us</span>
          {/* Subtle triangle arrow point */}
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-[#121418] border-t border-r border-white/15 rotate-45" />
        </div>

        <a
          href="https://wa.me/918790760524"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          onMouseEnter={() => setIsWaHovered(true)}
          onMouseLeave={() => setIsWaHovered(false)}
          className="w-[50px] h-[50px] sm:w-[58px] sm:h-[58px] rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(37,211,102,0.5)] transition-all duration-300 hover:scale-[1.08] active:scale-[0.98] cursor-pointer group whatsapp-pulse-btn"
        >
          <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-sm transition-transform duration-200 group-hover:scale-110" />
        </a>
      </div>
    </div>
  );
}
