import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../i18n';

export default function LanguageSelector({ isMobile = false, className = '' }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Normalize current language code (e.g. 'en-US' -> 'en')
  const currentLangCode = (i18n.language || 'en').split('-')[0];
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === currentLangCode) || SUPPORTED_LANGUAGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelectLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  // Mobile Drawer Inline Language Switcher
  if (isMobile) {
    return (
      <div className={`w-full flex flex-col gap-2 ${className}`}>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider px-1">
          <Globe className="w-3.5 h-3.5 text-[#168CFF]" />
          <span>Language / భాష / भाषा / மொழி</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isActive = currentLangCode === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang.code)}
                aria-pressed={isActive}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer min-h-[40px] ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-sky-50 text-[#0B2A5B] font-bold border border-[#168CFF]/40 shadow-xs'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200/60'
                }`}
              >
                <div className="flex flex-col text-left">
                  <span className={`text-[13px] leading-tight ${lang.fontClass}`}>{lang.nativeName}</span>
                  {lang.name !== lang.nativeName && (
                    <span className="text-[10px] text-neutral-400 font-sans">{lang.name}</span>
                  )}
                </div>
                {isActive && <Check className="w-3.5 h-3.5 text-[#168CFF] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop / Tablet Compact Navbar Dropdown Selector
  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Select language. Current language: ${currentLang.nativeName}`}
        className="group flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-50/90 hover:bg-blue-50/80 border border-slate-200/80 hover:border-[#168CFF]/40 text-[#0B2A5B] text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs hover:shadow-[0_2px_8px_rgba(22,140,255,0.12)] hover:-translate-y-[0.5px] select-none"
      >
        <Globe className="w-3.5 h-3.5 text-[#168CFF] group-hover:rotate-12 transition-transform duration-300 shrink-0" />
        
        {/* Compact label: Native name in its own script */}
        <span className={`text-[12.5px] leading-none ${currentLang.fontClass}`}>
          {currentLang.nativeName}
        </span>

        <ChevronDown 
          className={`w-3 h-3 text-neutral-400 group-hover:text-[#168CFF] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Language Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            role="menu"
            aria-orientation="vertical"
            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1.5 z-50 text-left focus:outline-none backdrop-blur-md"
          >
            <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-slate-100 mb-1">
              Select Language
            </div>

            <div className="flex flex-col gap-0.5">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isActive = currentLangCode === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    role="menuitem"
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                      isActive
                        ? 'bg-blue-50/90 text-[#0646A8] font-bold border border-[#168CFF]/30'
                        : 'text-neutral-700 hover:text-[#0B2A5B] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-[13.5px] font-medium leading-none ${lang.fontClass}`}>
                        {lang.nativeName}
                      </span>
                      {lang.name !== lang.nativeName && (
                        <span className="text-[11px] text-neutral-400 font-sans">
                          ({lang.name})
                        </span>
                      )}
                    </div>
                    {isActive && (
                      <Check className="w-3.5 h-3.5 text-[#168CFF] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
