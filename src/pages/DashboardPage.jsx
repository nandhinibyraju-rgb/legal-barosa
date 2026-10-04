import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Mail, 
  LogOut, 
  FileText, 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  Lock,
  Send,
  Loader2,
  Calendar,
  MessageSquare,
  AlertTriangle,
  FolderOpen,
  ChevronRight,
  Shield
} from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import Footer from '../components/Footer';
import { 
  subscribeUserCases, 
  subscribeCaseMessages, 
  sendMessage 
} from '../services/firestoreService';
import { useTranslation } from 'react-i18next';

export default function DashboardPage({ 
  user, 
  userProfile,
  authLoading = false,
  onNavigateHome, 
  onNavigateToAbout,
  onNavigateToAdmin,
  onOpenConsult,
  onOpenSignIn 
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  // Messages state for selected case
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMsgText, setNewMsgText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [msgError, setMsgError] = useState('');

  // 1. Protected Route: If not authenticated, redirect to /login / prompt sign in
  useEffect(() => {
    if (!authLoading && !user) {
      // In non-authenticated state, trigger sign-in prompt and return to home
      onOpenSignIn?.();
      onNavigateHome?.();
    }
  }, [user, authLoading, onNavigateHome, onOpenSignIn]);

  // 2. Fetch/Subscribe to user's cases in real time
  useEffect(() => {
    if (!user?.uid) return;

    setLoadingCases(true);
    const unsubscribe = subscribeUserCases(user.uid, (userCases) => {
      setCases(userCases);
      setLoadingCases(false);
      // Auto-select first case if none selected
      setSelectedCaseId((prev) => {
        if (prev && userCases.some((c) => c.id === prev)) {
          return prev;
        }
        return userCases.length > 0 ? userCases[0].id : null;
      });
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // 3. Fetch/Subscribe to messages for selected case
  useEffect(() => {
    if (!selectedCaseId) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    const unsubscribe = subscribeCaseMessages(selectedCaseId, (msgs) => {
      setMessages(msgs);
      setLoadingMessages(false);
    });

    return () => unsubscribe();
  }, [selectedCaseId]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onNavigateHome?.();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMsgText.trim() || !selectedCaseId || !user?.uid) return;

    setSendingMsg(true);
    setMsgError('');
    try {
      await sendMessage({
        caseId: selectedCaseId,
        senderId: user.uid,
        senderRole: 'client',
        text: newMsgText.trim(),
      });
      setNewMsgText('');
    } catch (err) {
      console.error('Error sending message:', err);
      setMsgError('Failed to send message. Please verify network access.');
    } finally {
      setSendingMsg(false);
    }
  };

  const selectedCase = cases.find((c) => c.id === selectedCaseId);
  const displayName = userProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'LegalBharosa Client';
  const email = userProfile?.email || user?.email || 'Registered User';
  const photoURL = user?.photoURL;
  const isGoogleAuth = user?.providerData?.some((p) => p.providerId === 'google.com');
  const isAdmin = userProfile?.role === 'admin';

  // Format timestamp helper
  const formatDate = (val) => {
    if (!val) return 'Recently';
    if (typeof val === 'string') {
      try {
        return new Date(val).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      } catch {
        return val;
      }
    }
    if (val.seconds) {
      return new Date(val.seconds * 1000).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
    return 'Recently';
  };

  const formatTime = (val) => {
    if (!val) return '';
    const dateObj = val.seconds ? new Date(val.seconds * 1000) : new Date(val);
    try {
      return dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('resolved')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Resolved</span>
        </span>
      );
    }
    if (s.includes('progress')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/15 border border-sky-500/40 text-sky-400">
          <Clock className="w-3.5 h-3.5 animate-spin" />
          <span>In Progress</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/40 text-amber-400">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>Under Review</span>
      </span>
    );
  };

  if (authLoading && !user) {
    return (
      <div className="min-h-screen w-full bg-[#07090E] text-white flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 animate-spin text-[#12B9F2] mb-3" />
        <p className="text-sm font-manrope text-slate-300">Verifying secure legal session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#07090E] text-white selection:bg-[#078BE8]/30 selection:text-white flex flex-col justify-between relative overflow-x-hidden">
      {/* ======================================================== */}
      {/* 1. TOP AUTHENTICATED HEADER */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-30 w-full bg-[#05070D]/95 backdrop-blur-xl border-b border-white/10 py-3 px-4 sm:px-8 lg:px-12 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
        {/* Left: Back / Brand */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 text-xs font-manrope font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:border-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t('nav.home', 'Home')}</span>
          </button>

          <div 
            onClick={onNavigateHome}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0646A8] via-[#078BE8] to-[#12B9F2] p-[1.5px] flex items-center justify-center">
              <div className="w-full h-full bg-[#05070D] rounded-[7px] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[#12B9F2]" />
              </div>
            </div>
            <span className="font-manrope font-bold text-base text-white">
              Legal<span className="text-[#078BE8]">Bharosa</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0646A8]/40 border border-[#078BE8]/40 text-[#12B9F2]">
              {t('nav.clientPortal', 'CLIENT PORTAL')}
            </span>
          </div>
        </div>

        {/* Right: Actions, Admin link (if applicable), User Profile & Sign Out */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin link badge if user is admin */}
          {isAdmin && (
            <button
              type="button"
              onClick={onNavigateToAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-manrope font-bold text-amber-300 bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/25 transition-all cursor-pointer shadow-sm"
              title="Open Admin Management Panel"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('nav.adminConsole', 'Admin Panel')}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-[#12B9F2]/50 transition-all cursor-pointer group"
            title="View & Edit My Profile"
          >
            {photoURL ? (
              <img
                src={photoURL}
                alt={displayName}
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full object-cover border border-[#12B9F2]/50"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#0646A8] flex items-center justify-center text-xs font-bold text-white">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-manrope font-medium text-xs text-slate-200 max-w-[130px] truncate group-hover:text-white transition-colors">
              {displayName}
            </span>
            <span className="text-[10px] text-[#12B9F2] font-semibold bg-[#12B9F2]/10 px-1.5 py-0.5 rounded-md">
              {t('nav.myProfile', 'Profile')}
            </span>
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-manrope font-semibold text-slate-300 hover:text-rose-300 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('nav.signOut', 'Sign Out')}</span>
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. MAIN DASHBOARD CONTENT */}
      {/* ======================================================== */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* TOP WELCOME BAR */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#091122] via-[#0E1A33] to-[#091122] border border-white/10 shadow-[0_15px_50px_rgba(0,0,0,0.5)] mb-8 relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(18,185,242,0.12)_0%,transparent_70%)] blur-2xl pointer-events-none"
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-5">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#0646A8] via-[#078BE8] to-[#12B9F2] p-[2.5px] shadow-[0_0_25px_rgba(18,185,242,0.3)] shrink-0">
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-[14px] object-cover bg-[#05070D]"
                  />
                ) : (
                  <div className="w-full h-full rounded-[14px] bg-[#05070D] flex items-center justify-center text-2xl font-bold text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#12B9F2] bg-[#0646A8]/30 px-2.5 py-0.5 rounded-full border border-[#078BE8]/30">
                    Client Portal
                  </span>
                  {isAdmin && (
                    <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/40 font-bold">
                      Admin Access
                    </span>
                  )}
                </div>
                <h1 className="font-manrope font-bold text-2xl sm:text-3xl text-white">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-400">{displayName}</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-2 justify-center md:justify-start">
                  <Mail className="w-3.5 h-3.5 text-[#12B9F2]" />
                  <span>{email}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-mono text-xs">256-Bit SSL Encrypted</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenConsult?.('Client Portal Consultation')}
              className="px-5 py-2.5 rounded-xl font-manrope font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-[#0646A8] via-[#078BE8] to-[#0646A8] hover:brightness-110 shadow-[0_4px_20px_rgba(7,139,232,0.4)] transition-all cursor-pointer flex items-center gap-2 shrink-0"
            >
              <span>Book New Consultation</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* LOADING STATE */}
        {loadingCases ? (
          <div className="py-24 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-[#12B9F2] mx-auto mb-4" />
            <p className="text-sm font-manrope text-slate-300">Loading your case files from Firestore...</p>
          </div>
        ) : cases.length === 0 ? (
          /* ======================================================== */
          /* EMPTY STATE (As explicitly requested by prompt)          */
          /* ======================================================== */
          <div className="rounded-3xl p-8 sm:p-14 bg-white/[0.02] border border-white/10 text-center max-w-2xl mx-auto shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-[#0646A8]/30 border border-[#078BE8]/30 flex items-center justify-center mx-auto mb-5 text-[#12B9F2]">
              <FolderOpen className="w-8 h-8" />
            </div>

            <h3 className="font-manrope font-bold text-xl sm:text-2xl text-white mb-2">
              No active cases yet — book a consultation to get started
            </h3>
            <p className="font-sans text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto mb-6">
              Your registered cases, summons defenses, OTS settlement tracks, and advocate communication threads will be securely cataloged here once initiated.
            </p>

            <button
              type="button"
              onClick={() => onOpenConsult?.('First Case Intake')}
              className="py-3 px-6 rounded-xl font-manrope font-semibold text-sm text-white bg-gradient-to-r from-[#0646A8] to-[#078BE8] hover:brightness-110 shadow-lg shadow-[#078BE8]/25 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Book a Free Consultation</span>
            </button>

            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-xs font-semibold text-[#12B9F2]">1. Submit Dispute</span>
                <p className="text-[11px] text-slate-400 mt-1">Provide notice details or recovery agent harassment report.</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-xs font-semibold text-[#12B9F2]">2. Advocate Review</span>
                <p className="text-[11px] text-slate-400 mt-1">Our High Court legal panel verifies the case merits.</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-xs font-semibold text-[#12B9F2]">3. Active Case Portal</span>
                <p className="text-[11px] text-slate-400 mt-1">Track notices and chat directly with your legal advisor.</p>
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* ACTIVE CASES & CASE DETAILS + MESSAGING THREAD           */
          /* ======================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 4 Cols: Cases List Selector */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between px-1 mb-2">
                <h3 className="font-manrope font-bold text-sm text-slate-300 uppercase tracking-wider">
                  Your Case Files ({cases.length})
                </h3>
              </div>

              {cases.map((c) => {
                const isSelected = c.id === selectedCaseId;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-[#0E1B33] border-[#078BE8] shadow-[0_4px_25px_rgba(7,139,232,0.25)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-mono text-[#12B9F2] uppercase tracking-wider">
                        Case #{c.id.substring(0, 8)}
                      </span>
                      {getStatusBadge(c.status)}
                    </div>

                    <h4 className="font-manrope font-bold text-sm text-white line-clamp-1">
                      {c.caseType || 'Legal Representation Matter'}
                    </h4>

                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{formatDate(c.createdAt)}</span>
                      </span>
                      <span className="text-[#12B9F2] font-medium">View Details →</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right 8 Cols: Selected Case Detail & Message Thread */}
            {selectedCase && (
              <div className="lg:col-span-8 space-y-6">
                {/* Case Header Card */}
                <div className="rounded-2xl p-6 bg-white/[0.03] border border-white/10">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div>
                      <span className="text-xs font-mono text-[#12B9F2]">
                        Case ID: {selectedCase.id}
                      </span>
                      <h2 className="font-manrope font-bold text-xl sm:text-2xl text-white mt-0.5">
                        {selectedCase.caseType}
                      </h2>
                    </div>
                    {getStatusBadge(selectedCase.status)}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 border-t border-white/10">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#12B9F2]" />
                      <span>Filed: {formatDate(selectedCase.createdAt)}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-sky-400" />
                      <span>Last Activity: {formatDate(selectedCase.updatedAt)}</span>
                    </span>
                  </div>
                </div>

                {/* Case Timeline */}
                <div className="rounded-2xl p-6 bg-white/[0.03] border border-white/10">
                  <h3 className="font-manrope font-bold text-base text-white mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#12B9F2]" />
                    <span>Case Timeline & Legal Milestones</span>
                  </h3>

                  {(!selectedCase.timeline || selectedCase.timeline.length === 0) ? (
                    <p className="text-xs text-slate-400 py-3">No timeline entries recorded yet.</p>
                  ) : (
                    <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
                      {selectedCase.timeline.map((item, idx) => (
                        <div key={idx} className="relative group">
                          {/* Dot indicator */}
                          <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#0646A8] border-2 border-[#12B9F2] flex items-center justify-center shadow-sm" />
                          <div className="bg-white/[0.03] p-3.5 rounded-xl border border-white/5">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                              <span className="font-manrope font-semibold text-xs text-white">
                                {item.status || 'Milestone Update'}
                              </span>
                              <span className="text-[11px] font-mono text-slate-400">
                                {formatDate(item.date)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {item.note}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Case Message Thread */}
                <div className="rounded-2xl p-6 bg-white/[0.03] border border-white/10 flex flex-col h-[480px]">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#12B9F2]" />
                      <h3 className="font-manrope font-bold text-base text-white">
                        Advocate Direct Messaging Thread
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      Case #{selectedCase.id.substring(0, 8)}
                    </span>
                  </div>

                  {/* Messages Scroll Area */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2 select-text">
                    {loadingMessages ? (
                      <div className="h-full flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-[#12B9F2]" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                        <MessageSquare className="w-8 h-8 text-slate-600 mb-2" />
                        <p className="text-xs">No messages in this case thread yet.</p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Have a question or update? Send a message directly to your assigned advocate below.
                        </p>
                      </div>
                    ) : (
                      messages.map((m) => {
                        const isMe = m.senderId === user.uid || m.senderRole === 'client';
                        const isAdminSender = m.senderRole === 'admin';

                        return (
                          <div
                            key={m.id}
                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                          >
                            <div className="flex items-center gap-1.5 mb-1 px-1">
                              {isAdminSender ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                                  <Shield className="w-2.5 h-2.5" />
                                  <span>LegalBharosa Counsel</span>
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 font-mono">
                                  You (Client)
                                </span>
                              )}
                              <span className="text-[10px] text-slate-500 font-mono">
                                {formatTime(m.timestamp)}
                              </span>
                            </div>

                            <div
                              className={`max-w-md p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                                isMe
                                  ? 'bg-gradient-to-r from-[#0646A8] to-[#078BE8] text-white rounded-br-none shadow-md'
                                  : 'bg-white/[0.08] border border-white/10 text-slate-100 rounded-bl-none shadow-sm'
                              }`}
                            >
                              {m.text}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Message Input Box */}
                  <form onSubmit={handleSendMessage} className="pt-3 border-t border-white/10 mt-2">
                    {msgError && (
                      <div className="mb-2 text-[11px] text-rose-400">
                        {msgError}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Type a message to your assigned advocate..."
                        value={newMsgText}
                        onChange={(e) => setNewMsgText(e.target.value)}
                        disabled={sendingMsg}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#078BE8] transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={sendingMsg || !newMsgText.trim()}
                        className="p-2.5 rounded-xl bg-gradient-to-r from-[#0646A8] to-[#078BE8] text-white hover:brightness-110 disabled:opacity-40 transition-all cursor-pointer shrink-0"
                        title="Send Message"
                      >
                        {sendingMsg ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <Footer 
        onOpenConsult={onOpenConsult}
        onNavigateHome={onNavigateHome}
        onNavigateToAbout={onNavigateToAbout}
      />
    </div>
  );
}
