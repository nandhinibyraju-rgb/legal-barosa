import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Layout, 
  Briefcase, 
  FileText, 
  Quote, 
  Phone, 
  Calendar, 
  LogOut, 
  ExternalLink, 
  ShieldCheck, 
  Loader2,
  Menu,
  X,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { 
  subscribeAllLeads,
  subscribeAllServices,
  createService,
  updateService,
  deleteService,
  subscribeAllArticlesForAdmin,
  createArticle,
  updateArticle,
  deleteArticle,
  subscribeAllClientStories,
  createClientStory,
  updateClientStory,
  deleteClientStory,
  subscribeSetting,
  saveSetting,
  updateConsultationStatus,
  DEFAULT_HOMEPAGE_SETTINGS,
  DEFAULT_CONTACT_SETTINGS,
  DEFAULT_BOOKING_SETTINGS
} from '../services/firestoreService';

// Modular Tab Views
import AdminLoginView from '../components/admin/AdminLoginView';
import AdminAccessDeniedView from '../components/admin/AdminAccessDeniedView';
import AdminOverviewTab from '../components/admin/AdminOverviewTab';
import AdminHomePageTab from '../components/admin/AdminHomePageTab';
import AdminServicesTab from '../components/admin/AdminServicesTab';
import AdminArticlesTab from '../components/admin/AdminArticlesTab';
import AdminClientStoriesTab from '../components/admin/AdminClientStoriesTab';
import AdminContactTab from '../components/admin/AdminContactTab';
import AdminBookingTab from '../components/admin/AdminBookingTab';

const SIDEBAR_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'homepage', label: 'Home Page Content', icon: Layout },
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'articles', label: 'Articles', icon: FileText },
  { id: 'stories', label: 'Client Stories', icon: Quote },
  { id: 'contact', label: 'Contact Details', icon: Phone },
  { id: 'booking', label: 'Booking Settings', icon: Calendar },
];

/**
 * ─────────────────────────────────────────────────────────────
 * React Error Boundary for Admin Portal
 * Catches any unexpected rendering runtime exceptions and displays
 * a styled diagnostic UI instead of collapsing to a blank page.
 * ─────────────────────────────────────────────────────────────
 */
class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Admin Portal] Uncaught runtime rendering error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#07090E] text-white flex flex-col items-center justify-center p-6 text-center font-inter">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-5 shadow-2xl">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-rose-400 bg-rose-500/10 px-3.5 py-1 rounded-full border border-rose-500/20 mb-3">
            Admin Portal Error Intercepted
          </span>

          <h1 className="font-heading font-bold text-2xl text-white mb-2">
            Admin Dashboard Rendering Exception
          </h1>

          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed mb-4">
            An unexpected error occurred while rendering the dashboard. The application safely prevented a blank screen.
          </p>

          <div className="w-full max-w-xl mx-auto bg-black/70 border border-white/10 rounded-xl p-4 text-left font-mono text-xs text-rose-300 mb-6 overflow-x-auto max-h-48">
            <p className="font-bold text-white mb-1">
              Error: {this.state.error?.message || String(this.state.error)}
            </p>
            {this.state.errorInfo?.componentStack && (
              <pre className="text-[10px] text-slate-400 whitespace-pre-wrap mt-2">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null });
                window.location.reload();
              }}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs text-[#041229] bg-gradient-to-r from-[#168CFF] to-[#00D2FF] hover:brightness-110 flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#168CFF]/20"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reload Admin Dashboard</span>
            </button>

            {this.props.onNavigateHome && (
              <button
                type="button"
                onClick={this.props.onNavigateHome}
                className="px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-300 bg-white/10 hover:bg-white/15 border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Return to Homepage</span>
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * ─────────────────────────────────────────────────────────────
 * Inner Admin Dashboard Component
 * Contains authentication checking, direct Firestore role verification,
 * data listeners, and tab routing.
 * ─────────────────────────────────────────────────────────────
 */
function AdminDashboardInner({
  user,
  userProfile,
  authLoading = false,
  onNavigateHome,
  onNavigateToDashboard: _onNavigateToDashboard,
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Firestore Real-time Collections State with Safe Defaults
  const [leads, setLeads] = useState([]);
  const [services, setServices] = useState([]);
  const [articles, setArticles] = useState([]);
  const [stories, setStories] = useState([]);
  const [homepageSettings, setHomepageSettings] = useState(DEFAULT_HOMEPAGE_SETTINGS);
  const [contactSettings, setContactSettings] = useState(DEFAULT_CONTACT_SETTINGS);
  const [bookingSettings, setBookingSettings] = useState(DEFAULT_BOOKING_SETTINGS);
  const [dataLoading, setDataLoading] = useState(true);

  // Authorization and Profile State
  const [verifiedProfile, setVerifiedProfile] = useState(userProfile);
  const [verificationStatus, setVerificationStatus] = useState(() => {
    if (!user) return 'unauthenticated';
    if (userProfile?.role === 'admin') return 'authorized';
    if (userProfile && userProfile.role !== 'admin') return 'unauthorized';
    return 'checking';
  });
  const [verificationError, setVerificationError] = useState('');
  const [retryTrigger, setRetryTrigger] = useState(0);

  // Direct Firestore Role Verification to handle race conditions and prevent premature access denials
  useEffect(() => {
    if (!user) {
      setVerificationStatus('unauthenticated');
      setVerifiedProfile(null);
      return;
    }

    // Fast-path: Parent already provided profile with admin role
    if (userProfile?.role === 'admin') {
      setVerifiedProfile(userProfile);
      setVerificationStatus('authorized');
      return;
    }

    let isMounted = true;
    setVerificationStatus('checking');
    setVerificationError('');

    async function checkFirestoreAdminRole() {
      try {
        console.log(`[Admin] Verifying Firestore admin document: users/${user.uid}`);
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (!isMounted) return;

        if (docSnap.exists()) {
          const profileData = docSnap.data();
          console.log(`[Admin] Found Firestore profile for ${user.email}:`, { role: profileData?.role });
          const merged = { id: docSnap.id, ...profileData };
          setVerifiedProfile(merged);

          if (profileData?.role === 'admin') {
            setVerificationStatus('authorized');
          } else {
            setVerificationStatus('unauthorized');
          }
        } else {
          console.warn(`[Admin] Document users/${user.uid} does not exist in Firestore.`);
          setVerificationStatus('not_found');
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('[Admin] Error verifying role in Firestore:', err);
        setVerificationError(err.message || 'Unable to read user document from Firestore.');
        setVerificationStatus('error');
      }
    }

    checkFirestoreAdminRole();

    return () => {
      isMounted = false;
    };
  }, [user, userProfile, retryTrigger]);

  // Subscribe to Collections ONLY when explicitly authorized
  useEffect(() => {
    if (verificationStatus !== 'authorized') {
      setDataLoading(false);
      return;
    }

    setDataLoading(true);

    // Safety fallback so spinner clears even if collections are empty or initial sync is slow
    const safetyTimer = setTimeout(() => {
      setDataLoading(false);
    }, 2500);

    const unsubLeads = subscribeAllLeads((data) => setLeads(data || []));
    const unsubServices = subscribeAllServices((data) => setServices(data || []));
    const unsubArticles = subscribeAllArticlesForAdmin((data) => setArticles(data || []));
    const unsubStories = subscribeAllClientStories((data) => setStories(data || []));
    const unsubHomepage = subscribeSetting('homepage', (data) => setHomepageSettings(data || DEFAULT_HOMEPAGE_SETTINGS), DEFAULT_HOMEPAGE_SETTINGS);
    const unsubContact = subscribeSetting('contact', (data) => setContactSettings(data || DEFAULT_CONTACT_SETTINGS), DEFAULT_CONTACT_SETTINGS);
    const unsubBooking = subscribeSetting('booking', (data) => {
      setBookingSettings(data || DEFAULT_BOOKING_SETTINGS);
      setDataLoading(false);
    }, DEFAULT_BOOKING_SETTINGS);

    return () => {
      clearTimeout(safetyTimer);
      unsubLeads();
      unsubServices();
      unsubArticles();
      unsubStories();
      unsubHomepage();
      unsubContact();
      unsubBooking();
    };
  }, [verificationStatus]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      onNavigateHome();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // 1. Auth Loading State from Parent
  if (authLoading) {
    return (
      <div className="min-h-screen w-full bg-[#07090E] text-white flex flex-col items-center justify-center p-6 font-inter">
        <Loader2 className="w-8 h-8 animate-spin text-[#00D2FF] mb-3" />
        <p className="text-xs font-mono text-slate-400">Verifying administrator clearance...</p>
      </div>
    );
  }

  // 2. Unauthenticated Visitor -> Admin Login View at /admin
  if (!user) {
    return <AdminLoginView onNavigateHome={onNavigateHome} />;
  }

  // 3. Verifying Administrator Role in Firestore (Loading state)
  if (verificationStatus === 'checking') {
    return (
      <div className="min-h-screen w-full bg-[#07090E] text-white flex flex-col items-center justify-center p-6 text-center font-inter">
        <div className="w-14 h-14 rounded-2xl bg-[#168CFF]/15 border border-[#168CFF]/30 flex items-center justify-center text-[#00D2FF] mb-4 shadow-xl">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#00D2FF] mb-1">
          Firestore Security Verification
        </span>
        <h2 className="text-lg font-bold text-white mb-2">Verifying Administrator Privileges</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
          Querying <code className="text-slate-300 font-mono">users/{user?.uid}</code> for administrative role...
        </p>
      </div>
    );
  }

  // 4. Missing User Document in Firestore
  if (verificationStatus === 'not_found') {
    return (
      <div className="min-h-screen w-full bg-[#07090E] text-white flex flex-col items-center justify-center p-6 text-center font-inter">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 shadow-2xl">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20 mb-3">
          Document Not Found
        </span>
        <h1 className="font-heading font-bold text-2xl text-white mb-2">
          Admin Profile Missing in Firestore
        </h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
          You are signed in as <strong className="text-white">{user.email}</strong>, but no user document was found at <code className="text-[#00D2FF] font-mono">users/{user.uid}</code>.
        </p>
        <div className="w-full max-w-md mx-auto bg-black/60 border border-white/10 rounded-2xl p-4 text-left font-mono text-xs text-slate-300 mb-6 space-y-2">
          <p className="text-slate-400 text-[11px]">To resolve, verify the document exists in the Firebase Firestore Console:</p>
          <div className="p-2.5 bg-white/5 rounded-xl text-[11px] space-y-1">
            <div>Collection: <span className="text-amber-300">users</span></div>
            <div>Document ID: <span className="text-[#00D2FF] select-all">{user.uid}</span></div>
            <div>Field: <span className="text-emerald-400">role: "admin"</span></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setRetryTrigger((c) => c + 1)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#168CFF] text-white hover:brightness-110 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Verification</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    );
  }

  // 5. Firestore Communication or Permission Error
  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen w-full bg-[#07090E] text-white flex flex-col items-center justify-center p-6 text-center font-inter">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-5 shadow-2xl">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <span className="text-xs font-mono uppercase tracking-widest text-rose-400 bg-rose-500/10 px-3.5 py-1 rounded-full border border-rose-500/20 mb-3">
          Firestore Request Error
        </span>
        <h1 className="font-heading font-bold text-2xl text-white mb-2">
          Unable to Retrieve Admin Profile
        </h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed mb-4">
          {verificationError || 'A Firestore permission or network error prevented role verification.'}
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setRetryTrigger((c) => c + 1)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#168CFF] text-white hover:brightness-110 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    );
  }

  // 6. Authenticated but Unauthorized User -> Access Denied View
  if (verificationStatus === 'unauthorized') {
    return (
      <AdminAccessDeniedView
        user={user}
        userProfile={verifiedProfile || userProfile}
        onNavigateHome={onNavigateHome}
      />
    );
  }

  // 7. Authorized Admin Dashboard View
  const currentTabItem = SIDEBAR_ITEMS.find((item) => item.id === activeTab) || SIDEBAR_ITEMS[0];

  return (
    <div className="min-h-screen w-full bg-[#07090E] text-white flex overflow-hidden font-inter">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Left Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0B1528] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B2A5B] to-[#041229] border border-[#168CFF]/40 flex items-center justify-center text-[#00D2FF] shadow-lg shadow-[#168CFF]/10">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm font-bold font-heading text-white leading-tight">
                  LegalBharosa
                </h1>
                <span className="text-[10px] font-mono text-[#00D2FF] uppercase tracking-wider block">
                  Admin Console
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const pendingCount = (articles || []).filter((a) => a.status === 'pending').length;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#168CFF] to-[#00D2FF] text-[#041229] shadow-md shadow-[#168CFF]/20 font-bold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#041229]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'articles' && pendingCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow-sm animate-pulse">
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: User & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div className="truncate mr-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block">
                ● Administrator
              </span>
              <span className="text-xs text-white font-medium truncate block">
                {user.email}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 hover:text-rose-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-[#07090E]/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 hidden sm:inline">Portal /</span>
                <h2 className="text-sm sm:text-base font-bold text-white font-heading">
                  {currentTabItem.label}
                </h2>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="hidden sm:inline">View Live Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#00D2FF]" />
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/15 border border-white/10 text-xs text-slate-300 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Tab Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {dataLoading && activeTab === 'overview' && leads.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-[#00D2FF] mb-2" />
              <p className="text-xs">Connecting to secure Firestore collections...</p>
            </div>
          ) : null}

          {/* 1. Overview */}
          {activeTab === 'overview' && (
            <AdminOverviewTab
              leads={leads || []}
              services={services || []}
              articles={articles || []}
              stories={stories || []}
              contactSettings={contactSettings || DEFAULT_CONTACT_SETTINGS}
              bookingSettings={bookingSettings || DEFAULT_BOOKING_SETTINGS}
              onSelectTab={(tab) => setActiveTab(tab)}
              onUpdateLeadStatus={async (leadId, status) => {
                await updateConsultationStatus(leadId, status);
              }}
            />
          )}

          {/* 2. Home Page Content */}
          {activeTab === 'homepage' && (
            <AdminHomePageTab
              homepageSettings={homepageSettings || DEFAULT_HOMEPAGE_SETTINGS}
              onSaveHomepageSettings={async (data) => {
                await saveSetting('homepage', data);
              }}
            />
          )}

          {/* 3. Services */}
          {activeTab === 'services' && (
            <AdminServicesTab
              services={services || []}
              onCreateService={async (data) => {
                await createService(data);
              }}
              onUpdateService={async (id, data) => {
                await updateService(id, data);
              }}
              onDeleteService={async (id) => {
                await deleteService(id);
              }}
            />
          )}

          {/* 4. Articles */}
          {activeTab === 'articles' && (
            <AdminArticlesTab
              articles={articles || []}
              currentUser={user}
              onCreateArticle={async (data) => {
                await createArticle(data);
              }}
              onUpdateArticle={async (id, data) => {
                await updateArticle(id, data);
              }}
              onDeleteArticle={async (id) => {
                await deleteArticle(id);
              }}
            />
          )}

          {/* 5. Client Stories */}
          {activeTab === 'stories' && (
            <AdminClientStoriesTab
              stories={stories || []}
              onCreateStory={async (data) => {
                await createClientStory(data);
              }}
              onUpdateStory={async (id, data) => {
                await updateClientStory(id, data);
              }}
              onDeleteStory={async (id) => {
                await deleteClientStory(id);
              }}
            />
          )}

          {/* 6. Contact Details */}
          {activeTab === 'contact' && (
            <AdminContactTab
              contactSettings={contactSettings || DEFAULT_CONTACT_SETTINGS}
              onSaveContactSettings={async (data) => {
                await saveSetting('contact', data);
              }}
            />
          )}

          {/* 7. Booking Settings */}
          {activeTab === 'booking' && (
            <AdminBookingTab
              bookingSettings={bookingSettings || DEFAULT_BOOKING_SETTINGS}
              onSaveBookingSettings={async (data) => {
                await saveSetting('booking', data);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default function AdminPage(props) {
  return (
    <AdminErrorBoundary onNavigateHome={props.onNavigateHome}>
      <AdminDashboardInner {...props} />
    </AdminErrorBoundary>
  );
}
