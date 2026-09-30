import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  Menu, 
  X
} from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About' },
  { id: 'client-stories', label: 'Client Stories' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'faq', label: 'FAQ' },
];

export default function Navbar({ 
  onOpenConsult, 
  onOpenSignIn, 
  user,
  userProfile,
  onNavigateToDashboard,
  onNavigateToAdmin
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  const isAdmin = userProfile?.role === 'admin';

  // Reliable scroll listener for sticky elevation and shadow
  useEffect(() => {
    const handleWindowScroll = () => {
      setIsScrolled(window.scrollY > 15);
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

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const getItemHref = (id) => {
    if (id === 'services') return '/services';
    if (id === 'how-it-works') return '/how-it-works';
    if (id === 'about') return '/about';
    if (id === 'faq') return '/faq';
    if (id === 'client-stories') return '/client-stories';
    if (id === 'home') return '/';
    return `#${id}`;
  };

  return (
    <>
      {/* ======================================================== */}
      {/* 1. STANDARDIZED FIXED / STICKY HEADER */}
      {/* ======================================================== */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_20px_-2px_rgba(0,0,0,0.08),0_2px_6px_-1px_rgba(0,0,0,0.04)] border-b border-neutral-200/80' 
            : 'bg-white/95 backdrop-blur-sm border-b border-neutral-200/60 shadow-xs'
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
              className="flex items-center group cursor-pointer focus:outline-none py-1"
              aria-label="LegalBharosa Home"
            >
              <img 
                src="/assets/legalbharosa-horizontal.png" 
                alt="LegalBharosa — Trust. Support. Solutions." 
                className="h-7.5 sm:h-11 md:h-12 max-w-[125px] sm:max-w-none w-auto object-contain shrink-0 transition-transform group-hover:scale-105" 
              />
            </a>
          </div>

          {/* ======================================================== */}
          {/* CENTER: NAV LINKS WITH 0.2s SMOOTH BLUE HOVER TRANSITION */}
          {/* ======================================================== */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2 xl:gap-3 text-[14.5px]">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={getItemHref(item.id)}
                  onClick={(e) => handleNavClick(item.id, e)}
                  className={`relative px-3.5 py-1.5 rounded-full font-medium cursor-pointer select-none transition-colors duration-200 ease-in-out ${
                    isActive 
                      ? 'text-[#0B2A5B] font-semibold bg-blue-50/90 border border-[#168CFF]/25 shadow-2xs' 
                      : 'text-neutral-700 hover:text-[#168CFF]'
                  }`}
                >
                  {/* Active Indicator Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                      className="absolute inset-0 bg-blue-50/90 rounded-full -z-10 border border-[#168CFF]/25 shadow-2xs"
                    />
                  )}
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>

          {/* ======================================================== */}
          {/* RIGHT: ACTION BUTTON / USER PROFILE */}
          {/* ======================================================== */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Firebase / Google Auth User State with Dropdown */}
            {user ? (
              <div id="user-dropdown-container" className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 sm:pr-3 py-1.5 rounded-full bg-blue-50/80 hover:bg-blue-100 border border-[#168CFF]/25 transition-all cursor-pointer shadow-xs"
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
                  <ChevronRight className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${userDropdownOpen ? 'rotate-90' : ''}`} />
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
                        if (onNavigateToDashboard) onNavigateToDashboard();
                        else navigate('/dashboard');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-neutral-700 hover:text-[#0B2A5B] hover:bg-neutral-50 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>Client Dashboard</span>
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
                          <span>Admin Console</span>
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
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#168CFF] hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onOpenSignIn?.()}
                className="text-[12px] sm:text-[13.5px] font-semibold text-white bg-[#168CFF] hover:bg-[#0673d6] px-3 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all cursor-pointer whitespace-nowrap shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] min-h-[40px] sm:min-h-[44px] flex items-center justify-center shrink-0"
              >
                Sign In
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
            <div className="absolute top-full left-0 right-0 bg-white border-b border-neutral-200/90 shadow-xl px-4 py-4 flex flex-col gap-1.5 md:hidden animate-in fade-in slide-in-from-top-2 duration-150">
              {NAV_ITEMS.map((item) => {
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
                        if (onNavigateToDashboard) onNavigateToDashboard();
                        else navigate('/dashboard');
                      }}
                      className="p-3 rounded-xl bg-blue-50 font-semibold text-[13px] text-[#0B2A5B] flex items-center justify-between cursor-pointer min-h-[44px]"
                    >
                      <span className="truncate">Client Portal ({user.displayName || user.email})</span>
                      <ChevronRight className="w-4 h-4 text-[#168CFF]" />
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
                        <span className="truncate">🛡️ Admin Console</span>
                        <ChevronRight className="w-4 h-4 text-amber-600" />
                      </button>
                    )}
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
                    Sign In to Client Portal
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
