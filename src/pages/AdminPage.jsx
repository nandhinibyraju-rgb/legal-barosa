import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  Users, 
  FileText, 
  MessageSquare, 
  Search, 
  Filter, 
  ArrowLeft, 
  Clock, 
  Send, 
  Plus, 
  X, 
  Loader2,
  LogOut
} from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { 
  subscribeAllConsultations, 
  updateConsultationStatus,
  subscribeAllClients,
  subscribeAllCases,
  createCase,
  updateCaseStatus,
  addCaseTimelineEntry,
  subscribeCaseMessages,
  sendMessage,
  PROBLEM_CATEGORIES
} from '../services/firestoreService';

export default function AdminPage({ 
  user, 
  userProfile, 
  authLoading = false,
  onNavigateHome, 
  onNavigateToDashboard 
}) {
  // Navigation active tab: 'consultations' | 'clients' | 'cases'
  const [activeTab, setActiveTab] = useState('consultations');

  // Firestore Data State
  const [consultations, setConsultations] = useState([]);
  const [clients, setClients] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [consultSearch, setConsultSearch] = useState('');
  const [consultStatusFilter, setConsultStatusFilter] = useState('all');

  const [clientSearch, setClientSearch] = useState('');

  const [caseSearch, setCaseSearch] = useState('');
  const [caseStatusFilter, setCaseStatusFilter] = useState('all');
  const [caseTypeFilter, setCaseTypeFilter] = useState('all');

  // Modals
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [newCaseModalOpen, setNewCaseModalOpen] = useState(false);
  const [prefilledClient, setPrefilledClient] = useState(null);

  // Case details drawer/modal states (Timeline & Messaging)
  const [caseMessages, setCaseMessages] = useState([]);
  const [adminMsgText, setAdminMsgText] = useState('');
  const [sendingAdminMsg, setSendingAdminMsg] = useState(false);
  const [newTimelineNote, setNewTimelineNote] = useState('');
  const [newTimelineStatus, setNewTimelineStatus] = useState('In Progress');
  const [addingTimeline, setAddingTimeline] = useState(false);

  // New Case Form
  const [newCaseData, setNewCaseData] = useState({
    userId: '',
    caseType: 'Harassment',
    status: 'Under Review',
    initialNote: 'Case file opened and advocate panel designated.'
  });

  const isAdmin = userProfile?.role === 'admin';

  // 1. Subscribe to Firestore Collections in Real Time
  useEffect(() => {
    if (!isAdmin) return;

    setLoading(true);

    const unsubConsult = subscribeAllConsultations((list) => {
      setConsultations(list);
    });

    const unsubClients = subscribeAllClients((list) => {
      setClients(list);
    });

    const unsubCases = subscribeAllCases((list) => {
      setCases(list);
      setLoading(false);
    });

    return () => {
      unsubConsult();
      unsubClients();
      unsubCases();
    };
  }, [isAdmin]);

  // 2. Subscribe to messages when a case is selected in modal
  useEffect(() => {
    if (!selectedCase?.id) {
      setCaseMessages([]);
      return;
    }
    const unsub = subscribeCaseMessages(selectedCase.id, (msgs) => {
      setCaseMessages(msgs);
    });
    return () => unsub();
  }, [selectedCase?.id]);

  // Keep selectedCase fresh when cases collection updates
  useEffect(() => {
    if (selectedCase?.id) {
      const updated = cases.find((c) => c.id === selectedCase.id);
      if (updated) setSelectedCase(updated);
    }
  }, [cases]);

  // Format Helpers
  const formatDate = (val) => {
    if (!val) return '—';
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
    return '—';
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

  // Case counts per client
  const clientCaseCountMap = useMemo(() => {
    const map = {};
    cases.forEach((c) => {
      if (c.userId) {
        map[c.userId] = (map[c.userId] || 0) + 1;
      }
    });
    return map;
  }, [cases]);

  // Filtered Consultations
  const filteredConsultations = useMemo(() => {
    return consultations.filter((c) => {
      const matchesStatus = consultStatusFilter === 'all' || c.status === consultStatusFilter;
      const searchLower = consultSearch.toLowerCase();
      const matchesSearch = !consultSearch || 
        c.name?.toLowerCase().includes(searchLower) ||
        c.email?.toLowerCase().includes(searchLower) ||
        c.phone?.toLowerCase().includes(searchLower) ||
        c.problemCategory?.toLowerCase().includes(searchLower) ||
        c.message?.toLowerCase().includes(searchLower);
      return matchesStatus && matchesSearch;
    });
  }, [consultations, consultStatusFilter, consultSearch]);

  // Filtered Clients
  const filteredClients = useMemo(() => {
    return clients.filter((cl) => {
      const searchLower = clientSearch.toLowerCase();
      return !clientSearch ||
        cl.name?.toLowerCase().includes(searchLower) ||
        cl.email?.toLowerCase().includes(searchLower) ||
        cl.phone?.toLowerCase().includes(searchLower);
    });
  }, [clients, clientSearch]);

  // Filtered Cases
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesStatus = caseStatusFilter === 'all' || c.status === caseStatusFilter;
      const matchesType = caseTypeFilter === 'all' || c.caseType === caseTypeFilter;
      const searchLower = caseSearch.toLowerCase();
      const matchesSearch = !caseSearch ||
        c.id?.toLowerCase().includes(searchLower) ||
        c.caseType?.toLowerCase().includes(searchLower) ||
        c.userId?.toLowerCase().includes(searchLower);
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [cases, caseStatusFilter, caseTypeFilter, caseSearch]);

  // Consultation Status Update Handler
  const handleConsultStatusChange = async (consultId, newStatus) => {
    try {
      await updateConsultationStatus(consultId, newStatus);
    } catch (err) {
      console.error('Error updating consultation status:', err);
      alert('Failed to update status. Please check permissions.');
    }
  };

  // Case Status Update Handler
  const handleCaseStatusChange = async (caseId, newStatus) => {
    try {
      await updateCaseStatus(caseId, newStatus, `Status updated to ${newStatus} by administrator.`);
    } catch (err) {
      console.error('Error updating case status:', err);
      alert('Failed to update case status.');
    }
  };

  // Add Timeline Milestone Handler
  const handleAddTimelineEntry = async (e) => {
    e.preventDefault();
    if (!newTimelineNote.trim() || !selectedCase?.id) return;

    setAddingTimeline(true);
    try {
      await addCaseTimelineEntry(selectedCase.id, {
        note: newTimelineNote.trim(),
        status: newTimelineStatus,
      });
      setNewTimelineNote('');
    } catch (err) {
      console.error('Error adding timeline entry:', err);
      alert('Failed to add timeline entry.');
    } finally {
      setAddingTimeline(false);
    }
  };

  // Admin Send Message in Case Thread
  const handleAdminSendMessage = async (e) => {
    e.preventDefault();
    if (!adminMsgText.trim() || !selectedCase?.id || !user?.uid) return;

    setSendingAdminMsg(true);
    try {
      await sendMessage({
        caseId: selectedCase.id,
        senderId: user.uid,
        senderRole: 'admin',
        text: adminMsgText.trim(),
      });
      setAdminMsgText('');
    } catch (err) {
      console.error('Error sending admin message:', err);
      alert('Failed to dispatch message.');
    } finally {
      setSendingAdminMsg(false);
    }
  };

  // Create Case Handler
  const handleCreateCaseSubmit = async (e) => {
    e.preventDefault();
    if (!newCaseData.userId || !newCaseData.caseType) {
      alert('Please select a client and case type.');
      return;
    }

    try {
      await createCase({
        userId: newCaseData.userId,
        caseType: newCaseData.caseType,
        status: newCaseData.status,
        initialNote: newCaseData.initialNote,
      });
      setNewCaseModalOpen(false);
      setNewCaseData({
        userId: '',
        caseType: 'Harassment',
        status: 'Under Review',
        initialNote: 'Case file opened and advocate panel designated.',
      });
      setActiveTab('cases');
    } catch (err) {
      console.error('Error creating case:', err);
      alert('Failed to create case record.');
    }
  };

  const handleOpenCreateCaseForClient = (client) => {
    setPrefilledClient(client);
    setNewCaseData((prev) => ({
      ...prev,
      userId: client.uid || client.id,
    }));
    setNewCaseModalOpen(true);
  };

  const handleConvertConsultToCase = (consult) => {
    // Find matching client by email if registered
    const matchingClient = clients.find((c) => c.email?.toLowerCase() === consult.email?.toLowerCase());
    setNewCaseData({
      userId: matchingClient ? (matchingClient.uid || matchingClient.id) : (consult.userId || ''),
      caseType: consult.problemCategory || 'Harassment',
      status: 'Under Review',
      initialNote: `Case initialized from consultation request. Problem: ${consult.problemCategory}. Message: ${consult.message || 'N/A'}`
    });
    setSelectedConsultation(null);
    setNewCaseModalOpen(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen w-full bg-[#07090E] text-white flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 animate-spin text-[#12B9F2] mb-3" />
        <p className="text-sm font-manrope text-slate-300">Verifying administrator credentials...</p>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ACCESS CHECK & DIAGNOSTIC LOGGING
  // ─────────────────────────────────────────────────────────────
  console.log('[Admin Access Check]', {
    currentUserUid: user?.uid,
    currentUserEmail: user?.email,
    fetchedRole: userProfile?.role,
    userProfileDocument: userProfile,
    isAdmin,
    authLoading,
  });

  // ─────────────────────────────────────────────────────────────
  // ACCESS DENIED VIEW (If not admin)
  // ─────────────────────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="min-h-screen w-full bg-[#07090E] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6 shadow-2xl">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <span className="text-xs font-mono uppercase tracking-widest text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 mb-3">
          Restricted Access Area
        </span>
        <h1 className="font-manrope font-bold text-3xl text-white mb-2">
          Administrator Privileges Required
        </h1>
        <p className="font-sans text-sm text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
          The LegalBharosa admin console is restricted to authenticated administrator accounts.
          To access, set your user document's <code className="text-[#12B9F2] bg-white/5 px-2 py-0.5 rounded">role: "admin"</code> in the Firestore console.
        </p>

        {/* Live Diagnostics Card */}
        <div className="w-full max-w-md mx-auto bg-black/60 border border-white/15 rounded-2xl p-4 text-left font-mono text-xs text-slate-300 mb-8 space-y-2 shadow-2xl backdrop-blur-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-white/10 flex items-center justify-between">
            <span>Diagnostic Info</span>
            <span className={userProfile?.role === 'admin' ? 'text-emerald-400' : 'text-amber-400'}>
              {userProfile?.role ? `role: "${userProfile.role}"` : 'role: not found'}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-slate-400">Current Logged-in Auth UID:</span>
            <span className="text-[#12B9F2] bg-white/5 p-1 rounded text-[11px] select-all break-all">
              {user?.uid || 'Not authenticated'}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-slate-400">Current Logged-in Email:</span>
            <span className="text-slate-200 bg-white/5 p-1 rounded text-[11px] select-all">
              {user?.email || 'N/A'}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-slate-400">Queried Firestore Document Path:</span>
            <span className="text-amber-300 bg-white/5 p-1 rounded text-[11px] select-all break-all">
              {user?.uid ? `users/${user.uid}` : 'users/(none)'}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-slate-400">Fetched Role from Firestore:</span>
            <span className="font-bold text-white bg-white/5 p-1 rounded text-[11px] select-all">
              {userProfile?.role !== undefined ? JSON.stringify(userProfile.role) : 'null (no document found under this UID)'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onNavigateHome}
            className="px-5 py-2.5 rounded-xl font-manrope font-semibold text-xs text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-all cursor-pointer"
          >
            Return to Homepage
          </button>
          <button
            onClick={onNavigateToDashboard}
            className="px-5 py-2.5 rounded-xl font-manrope font-semibold text-xs text-white bg-gradient-to-r from-[#0646A8] to-[#078BE8] hover:brightness-110 transition-all cursor-pointer shadow-md"
          >
            Go to Client Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ADMIN DASHBOARD VIEW
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen w-full bg-[#07090E] text-white selection:bg-[#078BE8]/30 selection:text-white flex flex-col justify-between">
      {/* 1. TOP ADMIN HEADER */}
      <header className="sticky top-0 z-30 w-full bg-[#05070D]/95 backdrop-blur-xl border-b border-white/10 py-3 px-4 sm:px-8 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 text-xs font-manrope font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit to Site</span>
          </button>

          <div className="flex items-center gap-2 select-none">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0646A8] via-[#078BE8] to-[#12B9F2] p-[1.5px] flex items-center justify-center">
              <div className="w-full h-full bg-[#05070D] rounded-[7px] flex items-center justify-center">
                <Shield className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <span className="font-manrope font-bold text-base text-white">
              Legal<span className="text-[#078BE8]">Bharosa</span>
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400">
              ADMIN CONSOLE
            </span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onNavigateToDashboard}
            className="px-3 py-1.5 rounded-lg text-xs font-manrope font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all cursor-pointer"
          >
            Client View
          </button>
          <button
            onClick={async () => {
              await signOut(auth);
              onNavigateHome?.();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-manrope font-semibold text-rose-300 hover:bg-rose-500/10 border border-rose-500/30 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* 2. ADMIN NAVIGATION TABS */}
      <div className="w-full border-b border-white/10 bg-[#090F1C]/80 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Consultations Tab */}
            <button
              onClick={() => setActiveTab('consultations')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-manrope font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'consultations'
                  ? 'bg-gradient-to-r from-[#0646A8] to-[#078BE8] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>New Consultations</span>
              <span className="ml-1 px-2 py-0.2 rounded-full text-[10px] font-mono bg-white/20 text-white">
                {consultations.filter((c) => c.status === 'new').length} new / {consultations.length}
              </span>
            </button>

            {/* Clients Tab */}
            <button
              onClick={() => setActiveTab('clients')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-manrope font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'clients'
                  ? 'bg-gradient-to-r from-[#0646A8] to-[#078BE8] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>All Clients</span>
              <span className="ml-1 px-2 py-0.2 rounded-full text-[10px] font-mono bg-white/10 text-slate-300">
                {clients.length}
              </span>
            </button>

            {/* Cases Tab */}
            <button
              onClick={() => setActiveTab('cases')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-manrope font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'cases'
                  ? 'bg-gradient-to-r from-[#0646A8] to-[#078BE8] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>All Cases</span>
              <span className="ml-1 px-2 py-0.2 rounded-full text-[10px] font-mono bg-white/10 text-slate-300">
                {cases.length}
              </span>
            </button>
          </div>

          {/* Quick Action: Open New Case */}
          <button
            onClick={() => {
              setPrefilledClient(null);
              setNewCaseModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl font-manrope font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Open Case for Client</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN TAB CONTENT */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6">
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-[#12B9F2] mx-auto mb-3" />
            <p className="text-sm font-manrope text-slate-300">Synchronizing Firestore collections...</p>
          </div>
        ) : (
          <>
            {/* ───────────────────────────────────────────────────────────── */}
            {/* TAB 1: NEW CONSULTATIONS TABLE                                */}
            {/* ───────────────────────────────────────────────────────────── */}
            {activeTab === 'consultations' && (
              <div className="space-y-4">
                {/* Search & Status Filters */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="relative flex-1 min-w-[240px] max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search consultations by name, email, phone, message..."
                      value={consultSearch}
                      onChange={(e) => setConsultSearch(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#078BE8]"
                    />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Filter className="w-3.5 h-3.5" />
                      Status:
                    </span>
                    {['all', 'new', 'contacted', 'in-progress', 'resolved'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setConsultStatusFilter(st)}
                        className={`px-3 py-1 rounded-lg text-xs font-manrope font-semibold capitalize transition-all cursor-pointer ${
                          consultStatusFilter === st
                            ? 'bg-[#078BE8] text-white shadow-xs'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#091120] text-slate-300 font-manrope font-semibold uppercase tracking-wider text-[11px] border-b border-white/10">
                        <tr>
                          <th className="py-3.5 px-4">Client Name</th>
                          <th className="py-3.5 px-4">Category</th>
                          <th className="py-3.5 px-4">Contact</th>
                          <th className="py-3.5 px-4">Message Snippet</th>
                          <th className="py-3.5 px-4">Submitted</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredConsultations.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-slate-400">
                              No consultations match the active filter or search criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredConsultations.map((c) => (
                            <tr 
                              key={c.id} 
                              className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                              onClick={() => setSelectedConsultation(c)}
                            >
                              <td className="py-3.5 px-4 font-manrope font-bold text-white whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  {c.status === 'new' && (
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-ping" />
                                  )}
                                  <span>{c.name}</span>
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#0646A8]/30 border border-[#078BE8]/30 text-[#12B9F2] whitespace-nowrap">
                                  {c.problemCategory || 'Other'}
                                </span>
                              </td>

                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <div className="flex flex-col text-[11px]">
                                  <span className="text-slate-200">{c.phone}</span>
                                  <span className="text-slate-400">{c.email}</span>
                                </div>
                              </td>

                              <td className="py-3.5 px-4 max-w-xs">
                                <p className="truncate text-slate-300">
                                  {c.message || '—'}
                                </p>
                              </td>

                              <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                                {formatDate(c.createdAt)}
                              </td>

                              <td 
                                className="py-3.5 px-4 whitespace-nowrap"
                                onClick={(e) => e.stopPropagation()} // prevent row click
                              >
                                <select
                                  value={c.status || 'new'}
                                  onChange={(e) => handleConsultStatusChange(c.id, e.target.value)}
                                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none border cursor-pointer ${
                                    c.status === 'new'
                                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                                      : c.status === 'contacted'
                                      ? 'bg-sky-500/15 border-sky-500/40 text-sky-400'
                                      : c.status === 'in-progress'
                                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                                      : 'bg-slate-500/15 border-slate-500/40 text-slate-300'
                                  }`}
                                >
                                  <option value="new" className="bg-[#0A101C] text-white">new</option>
                                  <option value="contacted" className="bg-[#0A101C] text-white">contacted</option>
                                  <option value="in-progress" className="bg-[#0A101C] text-white">in-progress</option>
                                  <option value="resolved" className="bg-[#0A101C] text-white">resolved</option>
                                </select>
                              </td>

                              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedConsultation(c);
                                  }}
                                  className="text-xs font-semibold text-[#12B9F2] hover:underline"
                                >
                                  Details →
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ───────────────────────────────────────────────────────────── */}
            {/* TAB 2: ALL CLIENTS TABLE                                      */}
            {/* ───────────────────────────────────────────────────────────── */}
            {activeTab === 'clients' && (
              <div className="space-y-4">
                {/* Search */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search clients by name, email, phone..."
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#078BE8]"
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Total Clients: {clients.length}
                  </span>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#091120] text-slate-300 font-manrope font-semibold uppercase tracking-wider text-[11px] border-b border-white/10">
                        <tr>
                          <th className="py-3.5 px-4">Client Name</th>
                          <th className="py-3.5 px-4">Email</th>
                          <th className="py-3.5 px-4">Phone</th>
                          <th className="py-3.5 px-4">Role</th>
                          <th className="py-3.5 px-4">Signup Date</th>
                          <th className="py-3.5 px-4 text-center">Active Cases</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredClients.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-slate-400">
                              No registered clients found.
                            </td>
                          </tr>
                        ) : (
                          filteredClients.map((cl) => {
                            const caseCount = clientCaseCountMap[cl.uid || cl.id] || 0;
                            return (
                              <tr key={cl.id} className="hover:bg-white/[0.04] transition-colors">
                                <td className="py-3.5 px-4 font-manrope font-bold text-white whitespace-nowrap">
                                  {cl.name || 'Unnamed Client'}
                                </td>
                                <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                                  {cl.email || '—'}
                                </td>
                                <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                                  {cl.phone || '—'}
                                </td>
                                <td className="py-3.5 px-4 whitespace-nowrap">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                                    cl.role === 'admin' 
                                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                                      : 'bg-white/10 text-slate-300 border border-white/10'
                                  }`}>
                                    {cl.role || 'client'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                                  {formatDate(cl.createdAt)}
                                </td>
                                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                  <span className={`inline-block px-2.5 py-0.5 rounded-full font-mono text-xs font-bold ${
                                    caseCount > 0 
                                      ? 'bg-[#0646A8]/40 border border-[#078BE8]/40 text-[#12B9F2]' 
                                      : 'bg-white/5 text-slate-500'
                                  }`}>
                                    {caseCount}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                  <button
                                    onClick={() => handleOpenCreateCaseForClient(cl)}
                                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#0646A8]/30 hover:bg-[#0646A8]/60 border border-[#078BE8]/30 text-[#12B9F2] transition-colors cursor-pointer"
                                  >
                                    + Open Case
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ───────────────────────────────────────────────────────────── */}
            {/* TAB 3: ALL CASES TABLE                                        */}
            {/* ───────────────────────────────────────────────────────────── */}
            {activeTab === 'cases' && (
              <div className="space-y-4">
                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search cases by ID, type, client ID..."
                      value={caseSearch}
                      onChange={(e) => setCaseSearch(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#078BE8]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-300">
                      <span>Status:</span>
                      <select
                        value={caseStatusFilter}
                        onChange={(e) => setCaseStatusFilter(e.target.value)}
                        className="bg-[#0A101C] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#078BE8]"
                      >
                        <option value="all">All Statuses</option>
                        <option value="Under Review">Under Review</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-300">
                      <span>Type:</span>
                      <select
                        value={caseTypeFilter}
                        onChange={(e) => setCaseTypeFilter(e.target.value)}
                        className="bg-[#0A101C] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#078BE8]"
                      >
                        <option value="all">All Case Types</option>
                        {PROBLEM_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#091120] text-slate-300 font-manrope font-semibold uppercase tracking-wider text-[11px] border-b border-white/10">
                        <tr>
                          <th className="py-3.5 px-4">Case ID</th>
                          <th className="py-3.5 px-4">Client</th>
                          <th className="py-3.5 px-4">Case Type</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4">Created Date</th>
                          <th className="py-3.5 px-4">Last Activity</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredCases.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-slate-400">
                              No cases recorded yet. Click "Open Case for Client" above to create one.
                            </td>
                          </tr>
                        ) : (
                          filteredCases.map((cs) => {
                            const clientMatch = clients.find((cl) => (cl.uid || cl.id) === cs.userId);
                            return (
                              <tr 
                                key={cs.id}
                                className="hover:bg-white/[0.04] transition-colors cursor-pointer"
                                onClick={() => setSelectedCase(cs)}
                              >
                                <td className="py-3.5 px-4 font-mono text-[11px] text-[#12B9F2] whitespace-nowrap">
                                  #{cs.id.substring(0, 8)}
                                </td>

                                <td className="py-3.5 px-4 whitespace-nowrap">
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-white">
                                      {clientMatch?.name || 'Client'}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                      {clientMatch?.email || cs.userId}
                                    </span>
                                  </div>
                                </td>

                                <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-200">
                                  {cs.caseType}
                                </td>

                                <td 
                                  className="py-3.5 px-4 whitespace-nowrap"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <select
                                    value={cs.status || 'Under Review'}
                                    onChange={(e) => handleCaseStatusChange(cs.id, e.target.value)}
                                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none border cursor-pointer ${
                                      cs.status === 'Resolved'
                                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                                        : cs.status === 'In Progress'
                                        ? 'bg-sky-500/15 border-sky-500/40 text-sky-400'
                                        : 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                                    }`}
                                  >
                                    <option value="Under Review" className="bg-[#0A101C] text-white">Under Review</option>
                                    <option value="In Progress" className="bg-[#0A101C] text-white">In Progress</option>
                                    <option value="Resolved" className="bg-[#0A101C] text-white">Resolved</option>
                                  </select>
                                </td>

                                <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                                  {formatDate(cs.createdAt)}
                                </td>

                                <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                                  {formatDate(cs.updatedAt)}
                                </td>

                                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedCase(cs);
                                    }}
                                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#0646A8]/30 hover:bg-[#0646A8]/60 border border-[#078BE8]/30 text-[#12B9F2] transition-colors cursor-pointer"
                                  >
                                    Manage Case →
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 1: CONSULTATION DETAILS MODAL                           */}
      {/* ───────────────────────────────────────────────────────────── */}
      {selectedConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#0A101C] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-left">
            <button
              onClick={() => setSelectedConsultation(null)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#0646A8]/30 border border-[#078BE8]/30 text-[#12B9F2]">
                Lead Capture Record
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {formatDate(selectedConsultation.createdAt)}
              </span>
            </div>

            <h3 className="font-manrope font-bold text-xl text-white mb-4">
              {selectedConsultation.name}
            </h3>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5 text-xs mb-4">
              <div>
                <span className="text-slate-400 block mb-0.5">Phone:</span>
                <a href={`tel:${selectedConsultation.phone}`} className="text-[#12B9F2] hover:underline font-mono">
                  {selectedConsultation.phone}
                </a>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Email:</span>
                <a href={`mailto:${selectedConsultation.email}`} className="text-[#12B9F2] hover:underline font-mono truncate block">
                  {selectedConsultation.email}
                </a>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Category:</span>
                <span className="text-white font-medium">{selectedConsultation.problemCategory}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Current Status:</span>
                <span className="capitalize font-semibold text-emerald-400">{selectedConsultation.status || 'new'}</span>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-xs font-semibold text-slate-300 block mb-1">
                Dispute Summary / Client Message:
              </span>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                {selectedConsultation.message || 'No additional details provided in submission.'}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Change Status:</span>
                <select
                  value={selectedConsultation.status || 'new'}
                  onChange={(e) => {
                    handleConsultStatusChange(selectedConsultation.id, e.target.value);
                    setSelectedConsultation((prev) => ({ ...prev, status: e.target.value }));
                  }}
                  className="bg-[#0A101C] border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white"
                >
                  <option value="new">new</option>
                  <option value="contacted">contacted</option>
                  <option value="in-progress">in-progress</option>
                  <option value="resolved">resolved</option>
                </select>
              </div>

              <button
                onClick={() => handleConvertConsultToCase(selectedConsultation)}
                className="px-4 py-2 rounded-xl text-xs font-manrope font-semibold text-white bg-gradient-to-r from-[#0646A8] to-[#078BE8] hover:brightness-110 shadow-sm cursor-pointer"
              >
                Convert to Client Case File →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 2: CASE MANAGEMENT (Timeline & Messaging)               */}
      {/* ───────────────────────────────────────────────────────────── */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#0A101C] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-left my-auto">
            <button
              onClick={() => setSelectedCase(null)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Case Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pr-8">
              <div>
                <span className="text-xs font-mono text-[#12B9F2]">Case #{selectedCase.id}</span>
                <h3 className="font-manrope font-bold text-xl sm:text-2xl text-white">
                  {selectedCase.caseType}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Status:</span>
                <select
                  value={selectedCase.status || 'Under Review'}
                  onChange={(e) => handleCaseStatusChange(selectedCase.id, e.target.value)}
                  className="bg-[#0A101C] border border-white/20 rounded-lg px-2.5 py-1 text-xs text-white"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            {/* Tabs inside Case Management: Timeline vs Messages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 border-t border-white/10">
              {/* Left Column: Timeline & Add Milestone */}
              <div className="flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-manrope font-bold text-sm text-white mb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#12B9F2]" />
                    <span>Timeline & Client Notes</span>
                  </h4>

                  <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1">
                    {(!selectedCase.timeline || selectedCase.timeline.length === 0) ? (
                      <p className="text-xs text-slate-400">No timeline entries.</p>
                    ) : (
                      selectedCase.timeline.map((entry, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
                          <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                            <span className="text-[#12B9F2] font-semibold">{entry.status || 'Milestone'}</span>
                            <span className="text-slate-500">{formatDate(entry.date)}</span>
                          </div>
                          <p className="text-slate-300 leading-relaxed">{entry.note}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Add Timeline Entry Form */}
                <form onSubmit={handleAddTimelineEntry} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
                  <span className="text-xs font-semibold text-slate-200 block">Add Milestone Update</span>
                  <input
                    type="text"
                    required
                    placeholder="Milestone note visible to client..."
                    value={newTimelineNote}
                    onChange={(e) => setNewTimelineNote(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#078BE8]"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <select
                      value={newTimelineStatus}
                      onChange={(e) => setNewTimelineStatus(e.target.value)}
                      className="bg-[#0A101C] border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                    >
                      <option value="Under Review">Under Review</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>

                    <button
                      type="submit"
                      disabled={addingTimeline || !newTimelineNote.trim()}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#078BE8] hover:bg-[#129FF2] text-white disabled:opacity-40 cursor-pointer"
                    >
                      {addingTimeline ? 'Saving...' : '+ Add Milestone'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Case Messaging (Admin Replies) */}
              <div className="flex flex-col h-[380px] bg-white/[0.02] border border-white/10 rounded-2xl p-4">
                <h4 className="font-manrope font-bold text-sm text-white mb-2 flex items-center gap-1.5 pb-2 border-b border-white/10">
                  <MessageSquare className="w-4 h-4 text-[#12B9F2]" />
                  <span>Advocate Case Chat</span>
                </h4>

                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 select-text">
                  {caseMessages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center p-4 text-xs text-slate-500">
                      No messages exchanged with client in this thread yet.
                    </div>
                  ) : (
                    caseMessages.map((m) => {
                      const isAdminMsg = m.senderRole === 'admin';
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isAdminMsg ? 'items-end' : 'items-start'}`}
                        >
                          <div className="flex items-center gap-1 mb-0.5 text-[10px] font-mono text-slate-400">
                            <span>{isAdminMsg ? 'Admin / Legal Panel' : 'Client'}</span>
                            <span>•</span>
                            <span>{formatTime(m.timestamp)}</span>
                          </div>
                          <div
                            className={`p-2.5 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                              isAdminMsg
                                ? 'bg-[#0646A8] text-white rounded-br-none'
                                : 'bg-white/10 text-slate-200 rounded-bl-none'
                            }`}
                          >
                            {m.text}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <form onSubmit={handleAdminSendMessage} className="pt-2 border-t border-white/10 flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Reply to client as LegalBharosa Advocate..."
                    value={adminMsgText}
                    onChange={(e) => setAdminMsgText(e.target.value)}
                    disabled={sendingAdminMsg}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#078BE8]"
                  />
                  <button
                    type="submit"
                    disabled={sendingAdminMsg || !adminMsgText.trim()}
                    className="p-2 rounded-lg bg-[#078BE8] text-white hover:brightness-110 disabled:opacity-40 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 3: CREATE NEW CASE                                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      {newCaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0A101C] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-left">
            <button
              onClick={() => setNewCaseModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-manrope font-bold text-xl text-white mb-1">
              Open New Client Case File
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Designate a case category and register it directly under the client's account file.
            </p>

            <form onSubmit={handleCreateCaseSubmit} className="space-y-4">
              {/* Client Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Assign to Client <span className="text-[#168CFF]">*</span>
                </label>
                <select
                  required
                  value={newCaseData.userId}
                  onChange={(e) => setNewCaseData({ ...newCaseData, userId: e.target.value })}
                  className="w-full bg-[#0A101C] border border-white/15 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#078BE8]"
                >
                  <option value="">-- Select a registered client --</option>
                  {clients.map((cl) => (
                    <option key={cl.id} value={cl.uid || cl.id}>
                      {cl.name || 'Client'} ({cl.email || cl.phone || cl.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Case Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Case Type <span className="text-[#168CFF]">*</span>
                </label>
                <select
                  value={newCaseData.caseType}
                  onChange={(e) => setNewCaseData({ ...newCaseData, caseType: e.target.value })}
                  className="w-full bg-[#0A101C] border border-white/15 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#078BE8]"
                >
                  {PROBLEM_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Initial Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Initial Status
                </label>
                <select
                  value={newCaseData.status}
                  onChange={(e) => setNewCaseData({ ...newCaseData, status: e.target.value })}
                  className="w-full bg-[#0A101C] border border-white/15 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#078BE8]"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {/* Initial Note */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Initial Timeline Note
                </label>
                <textarea
                  rows={3}
                  value={newCaseData.initialNote}
                  onChange={(e) => setNewCaseData({ ...newCaseData, initialNote: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#078BE8] resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-manrope font-semibold text-xs text-white bg-gradient-to-r from-[#0646A8] via-[#078BE8] to-[#0646A8] hover:brightness-110 shadow-md cursor-pointer"
                >
                  Create & Dispatch Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
