import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  Menu, 
  X,
  User,
  LayoutDashboard
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import LanguageSelector from './LanguageSelector';
import NavbarLogo from './NavbarLogo';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About' },
  { id: 'client-stories', label: 'Client Stories' },
  { id: 'articles', label: 'Articles' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact Us' },
];

export default function Navbar({ 
  onOpenConsult, 
  onOpenSignIn, 
  user,
  userProfile,
  onNavigateToDashboard,
  onNavigateToAdmin
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: t('nav.home') },
    { id: 'services', label: t('nav.services') },
    { id: 'about', label: t('nav.about') },
    { id: 'client-stories', label: t('nav.clientStories') },
    { id: 'articles', label: t('nav.articles') },
    { id: 'how-it-works', label: t('nav.howItWorks') },
    { id: 'faq', label: t('nav.faq') },
    { id: 'contact', label: t('nav.contact') },
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  const isAdmin = userProfile?.role === 'admin';

  // Reliable scroll listener for sticky elevation and shadow
  useEffect(() => {
    let tickingWindow = false;
    const handleWindowScroll = () => {
      if (tickingWindow) return;
      tickingWindow = true;
      requestAnimationFrame(() => {
        tickingWindow = false;
        const scrolled = window.scrollY > 15;
        setIsScrolled((prev) => (prev === scrolled ? prev : scrolled));
      });
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    handleWindowScroll();
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('#user-dropdown-container')) {
        setUserDropdownOpen(false);
      }
    };
    if (userDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [userDropdownOpen]);

  // Unified Navigation Click Handler
  const handleNavClick = (sectionId, e) => {
    e?.preventDefault();
    setMenuOpen(false);

    if (sectionId === 'services') {
      navigate('/services');
      return;
    }

    if (sectionId === 'articles') {
      navigate('/articles');
      return;
    }

    if (sectionId === 'how-it-works') {
      navigate('/how-it-works');
      return;
    }

    if (sectionId === 'about') {
      navigate('/about');
      return;
    }

    if (sectionId === 'faq') {
      navigate('/faq');
      return;
    }

    if (sectionId === 'contact') {
      navigate('/contact');
      return;
    }

    if (sectionId === 'home') {
      if (location.pathname !== '/') {
        navigate('/');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (sectionId === 'client-stories') {
      if (location.pathname !== '/') {
        navigate('/client-stories');
      } else {
        document.getElementById('client-stories')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }
  };

  // Scroll spy & route tracking
  useEffect(() => {
    if (location.pathname === '/contact' || location.pathname === '/contact-us') {
      setActiveSection('contact');
      return;
    }
    if (location.pathname === '/about') {
      setActiveSection('about');
      return;
    }
    if (location.pathname === '/faq') {
      setActiveSection('faq');
      return;
    }
    if (location.pathname === '/client-stories') {
      setActiveSection('client-stories');
      return;
    }
    if (location.pathname.startsWith('/articles')) {
      setActiveSection('articles');
      return;
    }
    if (location.pathname === '/how-it-works') {
      setActiveSection('how-it-works');
      return;
    }
    if (location.pathname.startsWith('/services')) {
      setActiveSection('services');
      return;
    }
    if (location.pathname === '/book-consultation') {
      setActiveSection('');
      return;
    }
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    const sectionIds = ['home', 'client-stories'];

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const scrollPosition = window.scrollY + 180;
        for (let i = sectionIds.length - 1; i >= 0; i--) {
          const id = sectionIds[i];
          const el = document.getElementById(id);
          if (el) {
            const top = el.offsetTop;
            if (scrollPosition >= top) {
              setActiveSection((prev) => (prev === id ? prev : id));
              break;
            }
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const getItemHref = (id) => {
    if (id === 'services') return '/services';
    if (id === 'articles') return '/articles';
    if (id === 'how-it-works') return '/how-it-works';
    if (id === 'about') return '/about';
    if (id === 'faq') return '/faq';
    if (id === 'client-stories') return '/client-stories';
    if (id === 'contact') return '/contact';
    if (id === 'home') return '/';
    return `#${id}`;
  };

  return (
    <>
      {/* ======================================================== */}
      {/* 1. STANDARDIZED FIXED / STICKY HEADER */}
      {/* ======================================================== */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out bg-white border-b border-neutral-200/80 ${
          isScrolled 
            ? 'shadow-[0_4px_20px_rgba(6,45,120,0.06)]' 
            : 'shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
        }`}
      >
        <nav 
          aria-label="Main Navigation"
          className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 h-[72px] sm:h-[76px] w-full flex items-center justify-between gap-2 sm:gap-4 select-none"
        >
          {/* ======================================================== */}
          {/* LEFT: ENLARGED LOGO */}
          {/* ======================================================== */}
          <div className="flex items-center shrink-0">
            <a 
              href="#home" 
              onClick={(e) => handleNavClick('home', e)}
              className="flex items-center group cursor-pointer focus:outline-none py-1 transition-transform duration-300 ease-out hover:-translate-y-[1px]"
              aria-label="LegalBharosa Home"
            >
              <NavbarLogo />
            </a>
          </div>

          {/* ======================================================== */}
          {/* CENTER: NAV LINKS WITH SMOOTH BLUE HOVER & ACTIVE POLISH */}
          {/* ======================================================== */}
          <div className="hidden md:flex items-center gap-0.5 lg:gap-1.5 xl:gap-2 text-[13px] lg:text-[13.5px] xl:text-[14px]">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={getItemHref(item.id)}
                  onClick={(e) => handleNavClick(item.id, e)}
                  className={`group relative px-2.5 lg:px-3 xl:px-3.5 py-1.5 rounded-full font-medium cursor-pointer select-none transition-all duration-250 ease-out hover:-translate-y-[1.5px] ${
                    isActive 
                      ? 'text-[#0646A8] font-semibold' 
                      : 'text-neutral-700 hover:text-[#078BE8] hover:drop-shadow-[0_0_8px_rgba(18,185,242,0.25)]'
                  }`}
                >
                  {/* Active Indicator: Polished glass effect, subtle gradient, soft blue/cyan glow */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-50/95 via-sky-50/85 to-blue-50/95 backdrop-blur-sm rounded-full -z-10 border border-[#168CFF]/30 shadow-[0_0_14px_rgba(18,185,242,0.18),0_2px_8px_rgba(6,45,120,0.06)]"
                    />
                  )}

                  {/* Non-active subtle animated underline highlight on hover */}
                  {!isActive && (
                    <span 
                      aria-hidden="true"
                      className="absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#078BE8]/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-250 ease-out origin-center pointer-events-none"
                    />
                  )}

                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>

          {/* ======================================================== */}
          {/* RIGHT: ACTION BUTTON / USER PROFILE / LANGUAGE SELECTOR */}
          {/* ======================================================== */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Desktop Language Selector */}
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
            
            {/* Firebase / Google Auth User State with Dropdown */}
            {user ? (
              <div id="user-dropdown-container" className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="group flex items-center gap-2 pl-1.5 pr-2.5 sm:pr-3 py-1.5 rounded-full bg-blue-50/80 hover:bg-blue-100/90 border border-[#168CFF]/25 hover:border-[#168CFF]/50 transition-all duration-250 ease-out cursor-pointer shadow-xs hover:shadow-[0_0_14px_rgba(22,140,255,0.22),0_2px_8px_rgba(6,45,120,0.06)] hover:-translate-y-[1px]"
                  title="User Account Menu"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName ? `${user.displayName}'s profile picture` : 'Client profile photo'}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover border border-[#168CFF]"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#0B2A5B] text-white flex items-center justify-center text-[11px] font-bold">
                      {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-[12.5px] font-semibold text-[#0B2A5B] max-w-[85px] sm:max-w-[100px] truncate hidden sm:inline">
                    {user.displayName?.split(' ')[0] || 'Portal'}
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 text-neutral-500 transition-all duration-250 ${userDropdownOpen ? 'rotate-90' : 'group-hover:translate-x-0.5'}`} />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-neutral-200/90 p-2 z-50 text-left text-neutral-800 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                      <p className="text-xs font-semibold text-neutral-900 truncate">
                        {userProfile?.name || user.displayName || 'Client'}
                      </p>
                      <p className="text-[11px] text-neutral-500 truncate">
                        {user.email}
                      </p>
                      <div className="mt-1">
                        <span className={`inline-block text-[9.5px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          isAdmin 
                            ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {isAdmin ? 'Admin Account' : 'Client Account'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('/profile');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#0B2A5B] bg-gradient-to-r from-blue-50 to-sky-50/70 hover:from-blue-100 hover:to-sky-100 border border-[#168CFF]/20 hover:border-[#168CFF]/40 transition-all flex items-center justify-between cursor-pointer mb-1"
                    >
                      <span className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-[#168CFF]" />
                        <span>{t('nav.myProfile')}</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#168CFF]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onNavigateToDashboard) onNavigateToDashboard();
                        else navigate('/dashboard');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-neutral-700 hover:text-[#0B2A5B] hover:bg-neutral-50 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <LayoutDashboard className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{t('nav.clientDashboard')}</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                    </button>

                    {/* Hidden Admin link: Only visible if user has role: "admin" */}
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          if (onNavigateToAdmin) onNavigateToAdmin();
                          else navigate('/admin');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-amber-700 bg-amber-50/60 hover:bg-amber-100/80 transition-colors flex items-center justify-between cursor-pointer mt-0.5"
                      >
                        <span className="flex items-center gap-1.5">
                          <span>🛡️</span>
                          <span>{t('nav.adminConsole')}</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                      </button>
                    )}

                    <div className="border-t border-neutral-100 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={async () => {
                          setUserDropdownOpen(false);
                          try {
                            await signOut(auth);
                          } catch (err) {
                            console.error('Sign out error:', err);
                          }
                          navigate('/');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        {t('nav.signOut')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onOpenSignIn?.()}
                className="group relative text-[12px] sm:text-[13.5px] font-semibold text-white bg-gradient-to-r from-[#168CFF] to-[#078BE8] hover:from-[#0E7BE6] hover:to-[#0275D8] px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full border border-sky-400/40 hover:border-sky-300 transition-all duration-250 ease-out cursor-pointer whitespace-nowrap shadow-xs hover:shadow-[0_0_18px_rgba(22,140,255,0.4),0_4px_12px_rgba(6,45,120,0.16)] hover:-translate-y-[1.5px] active:scale-[0.98] min-h-[40px] sm:min-h-[44px] flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>{t('nav.signIn')}</span>
                <ChevronRight className="w-3.5 h-3.5 text-white/90 transition-transform duration-250 ease-out group-hover:translate-x-0.5" />
              </button>
            )}

            {/* Mobile Hamburger Button (md:hidden) */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 text-neutral-700 hover:text-[#0B2A5B] rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* ======================================================== */}
          {/* MOBILE RESPONSIVE DRAWER */}
          {/* ======================================================== */}
          {menuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-b border-neutral-200/90 shadow-xl px-4 py-4 flex flex-col gap-1.5 md:hidden animate-in fade-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto">
              {/* Mobile Language Selector at top of drawer */}
              <div className="pb-2.5 mb-1 border-b border-neutral-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-600">{t('common.language')}</span>
                <LanguageSelector isMobile={true} />
              </div>

              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={getItemHref(item.id)}
                    onClick={(e) => handleNavClick(item.id, e)}
                    className={`p-3 rounded-xl font-medium text-[15px] flex items-center justify-between transition-colors duration-200 ease-in-out min-h-[44px] ${
                      isActive 
                        ? 'bg-blue-50 text-[#0B2A5B] font-semibold border border-[#168CFF]/20' 
                        : 'text-neutral-700 hover:text-[#168CFF] hover:bg-neutral-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 text-[#168CFF]" />}
                  </a>
                );
              })}

              <div className="border-t border-neutral-100 pt-3 mt-1.5 flex flex-col gap-2">
                {user ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate('/profile');
                      }}
                      className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-sky-50 font-semibold text-[13px] text-[#0B2A5B] border border-[#168CFF]/30 flex items-center justify-between cursor-pointer min-h-[44px]"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <User className="w-4 h-4 text-[#168CFF] shrink-0" />
                        <span>{t('nav.myProfile')} ({userProfile?.name || user.displayName || user.email})</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-[#168CFF] shrink-0" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        if (onNavigateToDashboard) onNavigateToDashboard();
                        else navigate('/dashboard');
                      }}
                      className="p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 font-medium text-[13px] text-neutral-800 flex items-center justify-between cursor-pointer min-h-[44px]"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <LayoutDashboard className="w-4 h-4 text-neutral-500 shrink-0" />
                        <span>{t('nav.clientDashboard')}</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
                    </button>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          if (onNavigateToAdmin) onNavigateToAdmin();
                          else navigate('/admin');
                        }}
                        className="p-3 rounded-xl bg-amber-50 font-semibold text-[13px] text-amber-800 border border-amber-200 flex items-center justify-between cursor-pointer min-h-[44px]"
                      >
                        <span className="truncate">🛡️ {t('nav.adminConsole')}</span>
                        <ChevronRight className="w-4 h-4 text-amber-600" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={async () => {
                        setMenuOpen(false);
                        try {
                          await signOut(auth);
                        } catch (err) {
                          console.error('Sign out error:', err);
                        }
                        navigate('/');
                      }}
                      className="p-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 text-center transition-colors cursor-pointer"
                    >
                      {t('nav.signOut')}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenSignIn?.();
                    }}
                    className="p-3 rounded-xl bg-[#168CFF] text-white font-semibold text-[14px] text-center hover:bg-[#0673d6] cursor-pointer shadow-xs transition-colors min-h-[44px] flex items-center justify-center"
                  >
                    {t('nav.signIn')}
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Standardized Spacer to preserve exact height across all pages */}
      <div className="h-[72px] sm:h-[76px] w-full shrink-0 pointer-events-none" aria-hidden="true" />
    </>
  );
}
