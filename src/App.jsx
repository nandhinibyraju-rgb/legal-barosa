import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HeroFullBleedBackground from './components/HeroFullBleedBackground';
import StatsBar from './components/StatsBar';
import DoesThisSoundLikeYou from './components/DoesThisSoundLikeYou';
import VideoSection from './components/VideoSection';
import HowItWorks from './components/HowItWorks';
import ClientStoriesPreview from './components/ClientStoriesPreview';
import OurServicesResolutionSection from './components/OurServicesResolutionSection';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ServicePage from './pages/ServicePage';
import BookConsultationPage from './pages/BookConsultationPage';
import FAQPage from './pages/FAQPage';
import ClientStoriesPage from './pages/ClientStoriesPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ContactPage from './pages/ContactPage';
import Footer from './components/Footer';
import ReviewsSlideoutWidget from './components/ReviewsSlideoutWidget';
import ConsultationModal from './components/ConsultationModal';
import SignInModal from './components/SignInModal';
import AutoConsultationPopup from './components/AutoConsultationPopup';
import FloatingContactWidget from './components/FloatingContactWidget';
import CustomCursor from './components/CustomCursor';
import Card3DTiltManager from './components/Card3DTiltManager';
import { auth } from './firebase';
import { getRedirectResult, onAuthStateChanged } from 'firebase/auth';
import { syncUserProfile, subscribeUserProfile, subscribeSetting, DEFAULT_BOOKING_SETTINGS } from './services/firestoreService';
import { MessageCircle, X } from 'lucide-react';

// Homepage Component with Hero, How It Works, Stories, and Footer (Services moved to dedicated /services page; Reviews removed)
function HomePage({ 
  user, 
  userProfile, 
  onOpenConsult, 
  onOpenSignIn, 
  openLoginOnMount = false 
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (openLoginOnMount) {
      if (user) {
        navigate('/dashboard');
      } else {
        onOpenSignIn();
      }
    }
  }, [openLoginOnMount, user, navigate, onOpenSignIn]);

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] font-inter text-neutral-900 selection:bg-[#168CFF]/20 selection:text-[#0B2A5B] flex flex-col overflow-x-hidden">
      {/* 1. ONE-SCREEN HERO SECTION (Home Section: id="home") - Full-Bleed Dark Navy Background */}
      <section 
        id="home" 
        className="relative w-full flex flex-col items-center justify-center scroll-mt-24 pt-4 sm:pt-6 pb-6 sm:pb-8 overflow-hidden select-none"
        style={{
          background: 'linear-gradient(135deg, #0a1535 0%, #0f1f4a 25%, #14295f 50%, #0f1f4a 75%, #0a1535 100%)',
        }}
      >
        {/* Full-bleed background system: Base Gradient, Aurora Waves, Central Glow, Light Streaks, Particle Stars */}
        <HeroFullBleedBackground />

        <div className="relative z-10 flex flex-col items-center w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Hero Content (Staggered Headline -> Large Illustration + Contained Glow + Badges + CTA + Stats) */}
          <Hero onOpenConsult={onOpenConsult} />
        </div>
      </section>

      {/* 2. SECTION: REAL DEFENSE. GENUINE RELIEF. (Custom Video Player & Guided Overview) */}
      <VideoSection onOpenConsult={onOpenConsult} />

      {/* 3. SECTION: DOES THIS SOUND LIKE YOU? (Problem Diagnostic with Flip & Jump-To-Center) */}
      <DoesThisSoundLikeYou onOpenConsult={onOpenConsult} />

      {/* 4. SECTION: CLIENT STORIES PREVIEW ('Real People, Real Results') */}
      <ClientStoriesPreview onOpenConsult={onOpenConsult} />

      {/* 5. NEW SECTION: OUR SERVICES — One Place. Multiple Paths to Resolution. */}
      <OurServicesResolutionSection onOpenConsult={onOpenConsult} />

      {/* 6. SECTION: HOW IT WORKS */}
      <HowItWorks onOpenConsult={onOpenConsult} />

      {/* 7. FOOTER */}
      <Footer
        onOpenConsult={onOpenConsult}
        onNavigateHome={() => {
          navigate('/');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToAbout={() => navigate('/about')}
      />
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [consultTopic, setConsultTopic] = useState('General Legal Consultation');
  const [whatsappToast, setWhatsappToast] = useState(null);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Automatic 10-second booking popup & Floating Contact Widget state
  const [autoPopupOpen, setAutoPopupOpen] = useState(false);
  const [contactLauncherVisible, setContactLauncherVisible] = useState(() => {
    try {
      return sessionStorage.getItem('lb_auto_popup_dismissed') === 'true';
    } catch {
      return false;
    }
  });
  const [contactPanelOpen, setContactPanelOpen] = useState(false);

  const autoPopupTimerRef = useRef(null);
  const isPopupDismissedRef = useRef(false);
  const consultModalOpenRef = useRef(consultModalOpen);
  const signInModalOpenRef = useRef(signInModalOpen);
  const contactPanelOpenRef = useRef(contactPanelOpen);

  useEffect(() => {
    consultModalOpenRef.current = consultModalOpen;
  }, [consultModalOpen]);

  useEffect(() => {
    signInModalOpenRef.current = signInModalOpen;
  }, [signInModalOpen]);

  useEffect(() => {
    contactPanelOpenRef.current = contactPanelOpen;
  }, [contactPanelOpen]);

  // Dynamic Booking Settings from Firestore
  const [bookingSettings, setBookingSettings] = useState(DEFAULT_BOOKING_SETTINGS);

  useEffect(() => {
    const unsub = subscribeSetting('booking', (data) => {
      setBookingSettings(data);
    }, DEFAULT_BOOKING_SETTINGS);
    return () => unsub();
  }, []);

  // Automatic consultation booking popup trigger on website open
  useEffect(() => {
    // If disabled by administrator, do not trigger popup
    if (bookingSettings?.autoPopupEnabled === false) return;

    // If visitor previously dismissed or completed popup in this session, reveal launcher and do not run timer
    let alreadyDismissed = false;
    try {
      alreadyDismissed = sessionStorage.getItem('lb_auto_popup_dismissed') === 'true';
    } catch {}

    if (alreadyDismissed) {
      isPopupDismissedRef.current = true;
      setContactLauncherVisible(true);
      return;
    }

    const delayMs = Math.max(2000, (Number(bookingSettings?.autoPopupDelaySeconds) || 10) * 1000);

    autoPopupTimerRef.current = setTimeout(() => {
      const currentPath = window.location.pathname.toLowerCase();
      const isBookingPage = currentPath === '/book-consultation';
      const isPortal = currentPath.startsWith('/dashboard') || currentPath.startsWith('/admin');

      // Do not interrupt an already-open modal, active form submission, expanded contact panel, or special pages
      if (
        !isPopupDismissedRef.current && 
        !consultModalOpenRef.current && 
        !signInModalOpenRef.current && 
        !contactPanelOpenRef.current &&
        !isBookingPage && 
        !isPortal
      ) {
        setConsultTopic('General Legal Consultation');
        setConsultModalOpen(true);
        isPopupDismissedRef.current = true;
        try {
          sessionStorage.setItem('lb_auto_popup_dismissed', 'true');
        } catch {}
      } else if (consultModalOpenRef.current || signInModalOpenRef.current) {
        // If modal already open, mark handled
        isPopupDismissedRef.current = true;
        try {
          sessionStorage.setItem('lb_auto_popup_dismissed', 'true');
        } catch {}
        setContactLauncherVisible(true);
      }
    }, delayMs);

    return () => {
      if (autoPopupTimerRef.current) {
        clearTimeout(autoPopupTimerRef.current);
      }
    };
  }, [bookingSettings?.autoPopupEnabled, bookingSettings?.autoPopupDelaySeconds]);

  // Auto-dismiss WhatsApp confirmation toast after 8 seconds
  useEffect(() => {
    if (whatsappToast) {
      const toastTimer = setTimeout(() => {
        setWhatsappToast(null);
      }, 8000);
      return () => clearTimeout(toastTimer);
    }
  }, [whatsappToast]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Firebase Auth Redirect processing & Persistent Auth State listener
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result && result.user) {
          console.log('[Auth] Firebase Google redirect authentication successful:', result.user.email);
          setUser(result.user);
          try {
            await syncUserProfile(result.user);
          } catch (syncErr) {
            console.warn('[Auth] Google redirect profile sync error:', syncErr);
          }
          sessionStorage.removeItem('pendingAuthRedirect');
          setSignInModalOpen(false);
          navigate('/dashboard');
        }
      })
      .catch((error) => {
        console.error('[Auth] Google Redirect Result Error:', error);
        sessionStorage.removeItem('pendingAuthRedirect');
        setAuthError(`${error.message || 'Authentication redirect error. Please try signing in again.'} [${error.code || 'unknown'}]`);
      });

    let unsubscribeProfile = null;
    let profileSafetyTimer = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      console.log('[Auth] onAuthStateChanged user:', currentUser ? currentUser.email : 'null');
      setUser(currentUser);

      if (currentUser) {
        // Await profile lookup from Firestore to prevent race conditions on protected /admin routes
        let initialProfileResolved = false;

        profileSafetyTimer = setTimeout(() => {
          if (!initialProfileResolved) {
            initialProfileResolved = true;
            setAuthLoading(false);
          }
        }, 1800);

        unsubscribeProfile = subscribeUserProfile(currentUser.uid, (profile) => {
          setUserProfile(profile);
          if (!initialProfileResolved) {
            initialProfileResolved = true;
            if (profileSafetyTimer) clearTimeout(profileSafetyTimer);
            setAuthLoading(false);
          }
        });

        try {
          await syncUserProfile(currentUser);
        } catch (err) {
          console.warn('[Auth] Auth state profile sync:', err);
        }

        const pendingRedirect = sessionStorage.getItem('pendingAuthRedirect');
        const currentPath = window.location.pathname.toLowerCase();

        if (pendingRedirect === 'dashboard' || currentPath === '/login') {
          sessionStorage.removeItem('pendingAuthRedirect');
          setSignInModalOpen(false);
          navigate('/dashboard');
        }
      } else {
        if (unsubscribeProfile) {
          unsubscribeProfile();
          unsubscribeProfile = null;
        }
        if (profileSafetyTimer) {
          clearTimeout(profileSafetyTimer);
          profileSafetyTimer = null;
        }
        setUserProfile(null);
        setAuthLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, [navigate]);

  const handleDismissAutoPopup = () => {
    setAutoPopupOpen(false);
    isPopupDismissedRef.current = true;
    try {
      sessionStorage.setItem('lb_auto_popup_dismissed', 'true');
    } catch {}
    setContactLauncherVisible(true);
  };

  const handleToggleContactPanel = () => {
    if (autoPopupOpen) return;
    setContactPanelOpen((prev) => !prev);
  };

  const handleOpenConsult = (topic) => {
    // If visitor manually opens the form, cancel auto timer & close auto popup/panel
    if (autoPopupTimerRef.current) {
      clearTimeout(autoPopupTimerRef.current);
      autoPopupTimerRef.current = null;
    }
    setAutoPopupOpen(false);
    setContactPanelOpen(false);
    isPopupDismissedRef.current = true;
    try {
      sessionStorage.setItem('lb_auto_popup_dismissed', 'true');
    } catch {}
    setContactLauncherVisible(true);
    setConsultTopic(topic || 'General Legal Consultation');
    setConsultModalOpen(true);
  };

  const handleCloseConsult = () => {
    setConsultModalOpen(false);
    isPopupDismissedRef.current = true;
    try {
      sessionStorage.setItem('lb_auto_popup_dismissed', 'true');
    } catch {}
    setContactLauncherVisible(true);
  };

  const handleConsultSuccess = (confirmationMsg) => {
    setConsultModalOpen(false);
    isPopupDismissedRef.current = true;
    try {
      sessionStorage.setItem('lb_auto_popup_dismissed', 'true');
    } catch {}
    setContactLauncherVisible(true);
    setWhatsappToast(confirmationMsg || 'Almost done! Please tap Send in WhatsApp to complete your request.');
  };

  const isPortalRoute = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  return (
    <div className="relative w-full min-h-screen">
      {/* Global Interactive Enhancements */}
      <CustomCursor />
      <Card3DTiltManager />

      {/* Shared Standardized Sticky Navbar across all pages */}
      {!isPortalRoute && (
        <Navbar
          user={user}
          userProfile={userProfile}
          onNavigateToDashboard={() => navigate('/dashboard')}
          onNavigateToAdmin={() => navigate('/admin')}
          onOpenConsult={handleOpenConsult}
          onOpenSignIn={() => setSignInModalOpen(true)}
          onNavigateHome={() => {
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateToAbout={() => navigate('/about')}
        />
      )}

      {/* Floating 'Reviews' Tab & Slideout Drawer on all pages */}
      <ReviewsSlideoutWidget onOpenConsult={handleOpenConsult} />

      {/* Graceful Authentication Error Banner */}
      {authError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
          <div className="p-3.5 rounded-xl bg-red-950/90 border border-red-500/40 text-red-200 text-xs flex items-center justify-between shadow-2xl backdrop-blur-md">
            <span>{authError}</span>
            <button 
              onClick={() => setAuthError(null)}
              className="text-red-400 hover:text-white font-bold text-sm ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Client-Side Application Routes */}
      <Routes>
        {/* 1. Landing Page */}
        <Route 
          path="/" 
          element={
            <HomePage
              user={user}
              userProfile={userProfile}
              onOpenConsult={handleOpenConsult}
              onOpenSignIn={() => setSignInModalOpen(true)}
            />
          } 
        />

        {/* 2. Login Redirect Route */}
        <Route 
          path="/login" 
          element={
            <HomePage
              user={user}
              userProfile={userProfile}
              onOpenConsult={handleOpenConsult}
              onOpenSignIn={() => setSignInModalOpen(true)}
              openLoginOnMount={true}
            />
          } 
        />

        {/* 3. Dedicated Services Hub Page */}
        <Route 
          path="/services" 
          element={
            <ServicesPage
              user={user}
              userProfile={userProfile}
              onOpenConsult={handleOpenConsult}
              onOpenSignIn={() => setSignInModalOpen(true)}
            />
          } 
        />

        {/* 4. Dedicated How LegalBharosa Works Page */}
        <Route 
          path="/how-it-works" 
          element={
            <HowItWorksPage
              user={user}
              userProfile={userProfile}
              onOpenConsult={handleOpenConsult}
              onOpenSignIn={() => setSignInModalOpen(true)}
            />
          } 
        />

        {/* 5. About Page */}
        <Route 
          path="/about" 
          element={
            <AboutPage
              user={user}
              userProfile={userProfile}
              onNavigateToDashboard={() => navigate('/dashboard')}
              onNavigateHome={() => navigate('/')}
              onNavigateToAbout={() => navigate('/about')}
              onNavigateToAdmin={() => navigate('/admin')}
              onOpenConsult={handleOpenConsult}
              onOpenSignIn={() => setSignInModalOpen(true)}
            />
          } 
        />
        <Route path="/about-us" element={<Navigate to="/about" replace />} />

        {/* FAQ Page */}
        <Route 
          path="/faq" 
          element={
            <FAQPage
              user={user}
              userProfile={userProfile}
              onOpenConsult={handleOpenConsult}
              onOpenSignIn={() => setSignInModalOpen(true)}
            />
          } 
        />

        {/* Dedicated Client Stories Page */}
        <Route 
          path="/client-stories" 
          element={
            <ClientStoriesPage
              user={user}
              userProfile={userProfile}
              onOpenConsult={handleOpenConsult}
              onOpenSignIn={() => setSignInModalOpen(true)}
            />
          } 
        />
        <Route path="/stories" element={<Navigate to="/client-stories" replace />} />
        
        {/* Community & Knowledge Articles Routes */}
        <Route 
          path="/articles" 
          element={
            <ArticlesPage
              user={user}
              userProfile={userProfile}
              onOpenConsult={handleOpenConsult}
              onOpenSignIn={() => setSignInModalOpen(true)}
            />
          } 
        />
        <Route 
          path="/articles/:id" 
          element={
            <ArticleDetailPage
              user={user}
              userProfile={userProfile}
              onOpenConsult={handleOpenConsult}
              onOpenSignIn={() => setSignInModalOpen(true)}
            />
          } 
        />

        {/* 6. Client Dashboard (Authenticated) */}
        <Route 
          path="/dashboard" 
          element={
            <DashboardPage
              user={user}
              userProfile={userProfile}
              authLoading={authLoading}
              onNavigateHome={() => navigate('/')}
              onNavigateToAbout={() => navigate('/about')}
              onNavigateToAdmin={() => navigate('/admin')}
              onOpenConsult={handleOpenConsult}
              onOpenSignIn={() => setSignInModalOpen(true)}
            />
          } 
        />

        {/* 6. Admin Panel (Protected) */}
        <Route 
          path="/admin" 
          element={
            <AdminPage
              user={user}
              userProfile={userProfile}
              authLoading={authLoading}
              onNavigateHome={() => navigate('/')}
              onNavigateToDashboard={() => navigate('/dashboard')}
            />
          } 
        />

        {/* 7. Dedicated Service Pages (Exact Routes specified by user) */}
        <Route 
          path="/services/harassment-protection" 
          element={
            <ServicePage
              serviceKey="harassment-protection"
              user={user}
              userProfile={userProfile}
              onOpenConsult={handleOpenConsult}
              onOpenSignIn={() => setSignInModalOpen(true)}
            />
          } 
        />
        <Route 
          path="/services/loan-settlement" 
          element={
            <ServicePage
              serviceKey="loan-settlement"
              user={user}
              userProfile={userProfile}
              onOpenConsult={handleOpenConsult}
              onOpenSignIn={() => setSignInModalOpen(true)}
            />
          } 
        />
        <Route 
          path="/services/legal-notice-review" 
          element={
            <ServicePage
              serviceKey="legal-notice-review"
              user={user}
              userProfile={userProfile}
              onOpenConsult={handleOpenConsult}
              onOpenSignIn={() => setSignInModalOpen(true)}
            />
          } 
        />
        <Route 
          path="/services/debt-management" 
          element={
            <ServicePage
              serviceKey="debt-management"
              user={user}
              userProfile={userProfile}
              onOpenConsult={handleOpenConsult}
              onOpenSignIn={() => setSignInModalOpen(true)}
            />
          } 
        />
        <Route 
          path="/services/npa-secured-loans" 
          element={
            <ServicePage
              serviceKey="npa-secured-loans"
              user={user}
              userProfile={userProfile}
              onOpenConsult={handleOpenConsult}
              onOpenSignIn={() => setSignInModalOpen(true)}
            />
          } 
        />
        <Route 
          path="/services/credit-recovery" 
          element={
            <ServicePage
              serviceKey="credit-recovery"
              user={user}
              userProfile={userProfile}
              onOpenConsult={handleOpenConsult}
              onOpenSignIn={() => setSignInModalOpen(true)}
            />
          } 
        />

        {/* Fallback Dynamic Service Route */}
        <Route 
          path="/services/:slug" 
          element={
            <ServicePage
              user={user}
              userProfile={userProfile}
              onOpenConsult={handleOpenConsult}
              onOpenSignIn={() => setSignInModalOpen(true)}
            />
          } 
        />

        {/* 8. Dedicated Book Consultation Page */}
        <Route 
          path="/book-consultation" 
          element={
            <BookConsultationPage
              user={user}
              userProfile={userProfile}
              onOpenConsult={handleOpenConsult}
              onOpenSignIn={() => setSignInModalOpen(true)}
            />
          } 
        />

        {/* 9. Dedicated Contact Page */}
        <Route 
          path="/contact" 
          element={
            <ContactPage
              user={user}
              userProfile={userProfile}
              onOpenConsult={handleOpenConsult}
              onOpenSignIn={() => setSignInModalOpen(true)}
            />
          } 
        />
        <Route path="/contact-us" element={<Navigate to="/contact" replace />} />

        {/* Catch-all redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* WhatsApp Feedback Confirmation Toast */}
      {whatsappToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0B2A5B] border border-[#168CFF]/50 text-white shadow-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
              </div>
              <p className="text-xs sm:text-sm font-medium leading-snug">
                {whatsappToast}
              </p>
            </div>
            <button 
              onClick={() => setWhatsappToast(null)}
              className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Dismiss message"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 10-Second Automatic Case Review Booking Popup */}
      <AutoConsultationPopup
        isOpen={autoPopupOpen}
        onClose={handleDismissAutoPopup}
      />

      {/* Floating WhatsApp Contact Launcher & Polished Contact Panel */}
      <FloatingContactWidget
        isVisible={contactLauncherVisible && !isPortalRoute}
        isOpen={contactPanelOpen}
        onToggle={handleToggleContactPanel}
        onClose={() => setContactPanelOpen(false)}
        isAutoPopupOpen={autoPopupOpen}
      />

      {/* Global Interactive Consultation & Sign In Modals */}
      <ConsultationModal
        isOpen={consultModalOpen}
        onClose={handleCloseConsult}
        onSuccess={handleConsultSuccess}
        defaultTopic={consultTopic}
        user={user}
      />
      <SignInModal
        isOpen={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
        onSuccess={() => {
          setSignInModalOpen(false);
          navigate('/dashboard');
        }}
      />
    </div>
  );
}
