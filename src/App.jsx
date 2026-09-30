import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsBar from './components/StatsBar';
import DoesThisSoundLikeYou from './components/DoesThisSoundLikeYou';
import HowItWorks from './components/HowItWorks';
import ClientSuccessStories from './components/ClientSuccessStories';
import ClientStoriesPreview from './components/ClientStoriesPreview';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ServicePage from './pages/ServicePage';
import BookConsultationPage from './pages/BookConsultationPage';
import FAQPage from './pages/FAQPage';
import ClientStoriesPage from './pages/ClientStoriesPage';
import Footer from './components/Footer';
import ReviewsSlideoutWidget from './components/ReviewsSlideoutWidget';
import ConsultationModal from './components/ConsultationModal';
import SignInModal from './components/SignInModal';
import CustomCursor from './components/CustomCursor';
import Card3DTiltManager from './components/Card3DTiltManager';
import { auth } from './firebase';
import { getRedirectResult, onAuthStateChanged } from 'firebase/auth';
import { syncUserProfile, subscribeUserProfile } from './services/firestoreService';
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
    <div className="min-h-screen w-full bg-[#FFFFFF] font-inter text-neutral-900 selection:bg-[#168CFF]/20 selection:text-[#0B2A5B] flex flex-col gap-6 sm:gap-10 overflow-x-hidden">
      {/* 1. ONE-SCREEN HERO SECTION (Home Section: id="home") - Pure White #FFFFFF */}
      <section 
        id="home" 
        className="relative w-full bg-[#FFFFFF] flex flex-col items-center justify-center scroll-mt-24 pt-0 sm:pt-1 pb-0 overflow-visible"
      >
        <div className="relative z-10 flex flex-col items-center w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Hero Content (Staggered Headline -> Large Illustration + Atmospheric Glow + Badges + CTA + Stats) */}
          <Hero onOpenConsult={onOpenConsult} />
        </div>
      </section>

      {/* 2. SECTION: DOES THIS SOUND LIKE YOU? (Problem Diagnostic with Flip & Jump-To-Center) */}
      <DoesThisSoundLikeYou onOpenConsult={onOpenConsult} />

      {/* 3. SECTION: CLIENT STORIES PREVIEW ('Real People, Real Results') */}
      <ClientStoriesPreview onOpenConsult={onOpenConsult} />

      {/* 4. SECTION: HOW IT WORKS */}
      <HowItWorks onOpenConsult={onOpenConsult} />

      {/* 5. FOOTER */}
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

  const autoOpenTimerRef = useRef(null);
  const hasOpenedFormRef = useRef(false);

  // 20-second automatic consultation booking form trigger on every fresh page visit
  useEffect(() => {
    autoOpenTimerRef.current = setTimeout(() => {
      const currentPath = window.location.pathname.toLowerCase();
      const isBookingPage = currentPath === '/book-consultation';
      if (!hasOpenedFormRef.current && !consultModalOpen && !isBookingPage) {
        hasOpenedFormRef.current = true;
        setConsultTopic('General Legal Consultation');
        setConsultModalOpen(true);
      }
    }, 20000);

    return () => {
      if (autoOpenTimerRef.current) {
        clearTimeout(autoOpenTimerRef.current);
      }
    };
  }, []);

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
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      console.log('[Auth] onAuthStateChanged user:', currentUser ? currentUser.email : 'null');
      setUser(currentUser);
      setAuthLoading(false);

      if (currentUser) {
        try {
          await syncUserProfile(currentUser);
        } catch (err) {
          console.warn('[Auth] Auth state profile sync:', err);
        }

        unsubscribeProfile = subscribeUserProfile(currentUser.uid, (profile) => {
          setUserProfile(profile);
        });

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
        setUserProfile(null);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, [navigate]);

  const handleOpenConsult = (topic) => {
    // If visitor manually opens the form before the 20-second timer finishes, cancel the automatic timer
    if (autoOpenTimerRef.current) {
      clearTimeout(autoOpenTimerRef.current);
      autoOpenTimerRef.current = null;
    }
    hasOpenedFormRef.current = true;
    setConsultTopic(topic || 'General Legal Consultation');
    setConsultModalOpen(true);
  };

  const handleCloseConsult = () => {
    setConsultModalOpen(false);
  };

  const handleConsultSuccess = (confirmationMsg) => {
    setConsultModalOpen(false);
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
