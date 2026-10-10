import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ShieldCheck, 
  Scale, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Send, 
  Mic, 
  MicOff, 
  Copy, 
  Download, 
  Plus, 
  FolderOpen, 
  ChevronRight, 
  UserCheck, 
  RefreshCw, 
  FileCheck2, 
  X,
  MessageSquare,
  ListOrdered,
  FileSearch,
  Lock,
  Trash2,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { 
  callAIApi, 
  saveAIChat,
  getUserAIChats,
  getAIChatById,
  deleteAIChat,
  createAICase, 
  getUserAICases, 
  updateAICaseData, 
  saveAICaseMessage, 
  getAICaseMessages, 
  deleteAICase,
  getGuestAISession, 
  saveGuestAISession, 
  clearGuestAISession 
} from '../services/aiCaseService';

const INITIAL_CASE_PROFILE = {
  title: 'New Legal Situation Assessment',
  caseType: 'General Legal Case',
  caseSubType: '',
  stage: 'Initial Case Intake',
  urgency: 'Normal',
  summary: 'Awaiting case facts and details...',
  facts: [],
  importantDates: [],
  documents: [],
  concerns: [],
  possibleOptions: ['Initial information intake', 'Verify debt notices'],
  recommendedNextStep: 'Describe your situation or upload any received notices to begin analysis.',
  expertEscalation: false,
  actionPlan: null,
};

const INITIAL_WELCOME_MESSAGES = [
  {
    id: 'welcome_init',
    role: 'assistant',
    text: "Hello, I am LegalBharosa AI. I'm here to help you understand your legal situation, analyze bank notices or agreements, organize your facts, and prepare a clear next-step plan.\n\nTo begin, describe what happened naturally—for instance, if you received an EMI notice, face recovery calls, or need loan settlement guidance.",
    timestamp: new Date().toISOString(),
    suggestedQuestions: [
      'I received a legal notice from a bank',
      'Recovery agents are calling my family members',
      'I want to apply for a One-Time Settlement (OTS)'
    ]
  }
];

const QUICK_ACTIONS = [
  { id: 'loan', label: 'Understand My Loan Problem', prompt: 'Understand My Loan Problem' },
  { id: 'harassment', label: 'Stop Recovery Harassment', prompt: 'Stop Recovery Harassment' },
  { id: 'sarfaesi', label: 'SARFAESI & Property Notice', prompt: 'SARFAESI & Property Notice' },
  { id: 'notice', label: 'Analyze a Legal Notice', prompt: 'I received a legal notice from a bank/lender. Help me analyze what it means and what my response timeline is.' },
  { id: 'plan', label: 'Create My Action Plan', prompt: 'Create My Action Plan' },
  { id: 'expert', label: 'Prepare for an Expert', prompt: 'Prepare for an Expert' },
];

/**
 * Robust file extraction helper for images, PDFs, and text
 */
async function readFileData(file) {
  return new Promise((resolve) => {
    const dataUrlReader = new FileReader();
    dataUrlReader.onload = () => {
      const dataUrl = dataUrlReader.result;
      const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
      const isImage = file.type.startsWith('image/');

      if (isImage) {
        resolve({ dataUrl, text: '' });
      } else if (!isPdf) {
        const textReader = new FileReader();
        textReader.onload = () => resolve({ dataUrl, text: textReader.result || '' });
        textReader.onerror = () => resolve({ dataUrl, text: '' });
        textReader.readAsText(file);
      } else {
        const bufferReader = new FileReader();
        bufferReader.onload = () => {
          try {
            const buf = new Uint8Array(bufferReader.result);
            const decoder = new TextDecoder('latin1');
            const rawStr = decoder.decode(buf);
            const matches = rawStr.match(/\(([^()]{2,})\)\s*(?:Tj|TJ|')/g) || [];
            let text = '';
            if (matches.length > 0) {
              text = matches.map(m => m.replace(/^[([]\s*|[)\]\s\w]+$/g, '')).join(' ');
            } else {
              const cleanWords = rawStr.match(/[A-Za-z0-9.,:;\-/₹]{3,}/g) || [];
              text = cleanWords.slice(0, 1500).join(' ');
            }
            resolve({ dataUrl, text: text.slice(0, 20000) });
          } catch {
            resolve({ dataUrl, text: '' });
          }
        };
        bufferReader.onerror = () => resolve({ dataUrl, text: '' });
        bufferReader.readAsArrayBuffer(file);
      }
    };
    dataUrlReader.onerror = () => resolve({ dataUrl: null, text: '' });
    dataUrlReader.readAsDataURL(file);
  });
}

/**
 * Format chat dates gracefully
 */
function formatChatTime(dateInput) {
  if (!dateInput) return '';
  let date;
  if (typeof dateInput?.toDate === 'function') {
    date = dateInput.toDate();
  } else if (dateInput?.seconds) {
    date = new Date(dateInput.seconds * 1000);
  } else if (typeof dateInput === 'string' || typeof dateInput === 'number') {
    date = new Date(dateInput);
  } else {
    date = new Date();
  }

  if (isNaN(date.getTime())) return '';
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'short' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

/**
 * Generate a smart, authentic short title from conversation
 */
function generateChatTitle(userPrompt = '', profile = null) {
  if (profile?.title && profile.title !== 'New Legal Situation Assessment' && profile.title !== 'Legal Situation Intake' && profile.title !== 'Legal Case Analysis') {
    return profile.title;
  }
  const lower = (userPrompt || '').toLowerCase();
  if (lower.includes('personal loan') || lower.includes('unsecured loan')) return 'Personal Loan EMI Issue';
  if (lower.includes('home loan') || lower.includes('housing loan') || lower.includes('sarfaesi') || lower.includes('property notice')) return 'Property Notice Review';
  if (lower.includes('recovery agent') || lower.includes('harassment') || lower.includes('calling')) return 'Bank Recovery Notice';
  if (lower.includes('cheque bounce') || lower.includes('138') || lower.includes('section 138')) return 'Section 138 Cheque Notice';
  if (lower.includes('ots') || lower.includes('settlement') || lower.includes('one time settlement')) return 'One-Time Settlement (OTS)';
  if (lower.includes('cibil') || lower.includes('credit score')) return 'Credit Dispute Assessment';
  if (lower.includes('notice') || lower.includes('legal notice')) return 'Legal Notice Analysis';
  if (profile?.caseType && profile.caseType !== 'General Legal Case' && profile.caseType !== 'Legal Situation Intake') {
    return profile.caseType;
  }
  const words = (userPrompt || '').trim().split(/\s+/).slice(0, 4).join(' ');
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : 'Legal Case Analysis';
}

/**
 * Subtle text reveal animation for latest AI response
 */
function AnimatedMessageText({ text, isLatestAssistant }) {
  const [displayedText, setDisplayedText] = useState(text);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isLatestAssistant || prefersReducedMotion || !text || text.length < 15) {
      setDisplayedText(text);
      setIsRevealing(false);
      return;
    }

    const words = text.split(' ');
    if (words.length <= 6) {
      setDisplayedText(text);
      return;
    }

    setIsRevealing(true);
    let currentIdx = 0;
    const chunkSize = Math.max(3, Math.floor(words.length / 30));
    const interval = setInterval(() => {
      currentIdx += chunkSize;
      if (currentIdx >= words.length) {
        setDisplayedText(text);
        setIsRevealing(false);
        clearInterval(interval);
      } else {
        setDisplayedText(words.slice(0, currentIdx).join(' '));
      }
    }, 16);

    return () => clearInterval(interval);
  }, [text, isLatestAssistant]);

  return (
    <div className="whitespace-pre-wrap space-y-2">
      {displayedText}
      {isRevealing && (
        <span className="inline-block w-1.5 h-3.5 bg-[#168CFF] ml-1 animate-pulse align-middle" />
      )}
    </div>
  );
}

export default function AIAssistantPage({
  user = null,
  userProfile = null,
  onOpenConsult,
  onOpenSignIn,
}) {
  const { t, i18n } = useTranslation();
  const currentLanguage = ['en', 'hi', 'te'].includes(i18n.language) ? i18n.language : 'en';

  // Active view tab on mobile: 'chat' | 'chats' | 'profile' | 'plan'
  const [mobileTab, setMobileTab] = useState('chat');

  // Case State
  const [activeCaseId, setActiveCaseId] = useState(null);
  const [savedCases, setSavedCases] = useState([]);
  const [isLoadingCases, setIsLoadingCases] = useState(false);

  // Active Case Profile Structure
  const [caseProfile, setCaseProfile] = useState(() => ({ ...INITIAL_CASE_PROFILE }));

  // Conversation Messages State
  const [messages, setMessages] = useState(() => [...INITIAL_WELCOME_MESSAGES]);

  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [analyzedDocs, setAnalyzedDocs] = useState([]);
  const [failedPrompt, setFailedPrompt] = useState(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsAppText, setWhatsAppText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported] = useState(() => typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));

  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const lastLoadedUidRef = useRef(null);

  // Auto-scroll conversation internally within chat container (prevents window jumping)
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  // Speech Recognition Setup (Web Speech API)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'te' ? 'te-IN' : 'en-IN';

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [currentLanguage]);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'te' ? 'te-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
      }
    }
  };

  // =========================================================================
  // AUTHENTICATION GATE & DRAFT PRESERVATION
  // =========================================================================
  const requireAuth = (draftToPreserve = '') => {
    if (!user) {
      const text = (draftToPreserve || inputMessage || '').trim();
      if (text) {
        try {
          sessionStorage.setItem('lb_ai_pending_draft', text);
        } catch {}
      }
      if (onOpenSignIn) {
        onOpenSignIn();
      }
      return false;
    }
    return true;
  };

  // Restore pending draft after successful login
  useEffect(() => {
    if (user) {
      try {
        const savedDraft = sessionStorage.getItem('lb_ai_pending_draft');
        if (savedDraft) {
          setInputMessage(savedDraft);
          sessionStorage.removeItem('lb_ai_pending_draft');
        }
      } catch {}
    }
  }, [user]);

  // Load Saved Chats for Authenticated User (Strict Account Isolation)
  useEffect(() => {
    async function loadUserData() {
      const currentUid = user?.uid || null;

      // If user identity changed (e.g. login, logout, switch account), immediately purge previous user's client state
      if (lastLoadedUidRef.current !== currentUid) {
        lastLoadedUidRef.current = currentUid;
        setActiveCaseId(null);
        setCaseProfile({ ...INITIAL_CASE_PROFILE });
        setMessages([...INITIAL_WELCOME_MESSAGES]);
        setAnalyzedDocs([]);
        setSavedCases([]);
      }

      if (currentUid) {
        setIsLoadingCases(true);
        try {
          const userChats = await getUserAIChats(currentUid);
          setSavedCases(userChats);

          // If chats exist and none is active, pick the most recent one
          if (userChats.length > 0 && !activeCaseId) {
            const first = userChats[0];
            const firstId = first.chatId || first.id;
            setActiveCaseId(firstId);
            const context = first.caseContext || first.caseProfile || first;
            setCaseProfile(context);
            if (Array.isArray(first.messages) && first.messages.length > 0) {
              setMessages(first.messages);
            } else {
              const history = await getAICaseMessages(currentUid, firstId);
              if (history.length > 0) {
                setMessages(history);
              }
            }
            if (Array.isArray(context.documents) && context.documents.length > 0) {
              setAnalyzedDocs(context.documents.map((d, i) =>
                typeof d === 'string' ? { id: 'doc_' + i, fileName: d } : d
              ));
            }
          }
        } catch (err) {
          console.warn('[AI Assistant] Could not load user chats:', err);
        } finally {
          setIsLoadingCases(false);
        }
      } else {
        // Logout must immediately clear private chat data from client state
        setSavedCases([]);
        setActiveCaseId(null);
        setCaseProfile({ ...INITIAL_CASE_PROFILE });
        setMessages([...INITIAL_WELCOME_MESSAGES]);
        setAnalyzedDocs([]);
        setIsLoadingCases(false);
      }
    }

    loadUserData();
  }, [user]);

  // Start New Chat / Case (Completely separate conversation)
  const handleStartNewCase = () => {
    if (!requireAuth()) return;

    setActiveCaseId(null);
    setCaseProfile({ ...INITIAL_CASE_PROFILE });
    setMessages([
      {
        id: 'welcome_' + Date.now(),
        role: 'assistant',
        text: "Started a new case analysis. Please describe what has happened, or select a quick option below.",
        timestamp: new Date().toISOString(),
        suggestedQuestions: [
          'I received a legal notice from a bank',
          'Recovery agents are calling my family members',
          'I want to apply for a One-Time Settlement (OTS)'
        ]
      }
    ]);
    setAnalyzedDocs([]);
    setFailedPrompt(null);
    if (mobileTab === 'chats') setMobileTab('chat');
  };

  // Switch to an existing saved case
  const handleSelectCase = async (c) => {
    if (!user?.uid) return;
    const selectedId = c.chatId || c.id;
    if (selectedId === activeCaseId) {
      if (mobileTab === 'chats') setMobileTab('chat');
      return;
    }
    setActiveCaseId(selectedId);
    const context = c.caseContext || c.caseProfile || c;
    setCaseProfile(context);
    setIsProcessing(true);
    setFailedPrompt(null);
    if (mobileTab === 'chats') setMobileTab('chat');

    try {
      if (Array.isArray(c.messages) && c.messages.length > 0) {
        setMessages(c.messages);
      } else {
        const history = await getAICaseMessages(user.uid, selectedId);
        if (history.length > 0) {
          setMessages(history);
        } else {
          setMessages([
            {
              id: 'resume_' + Date.now(),
              role: 'assistant',
              text: `Resumed case: ${c.title || c.caseType || 'Legal Case'}. How would you like to continue?`,
              timestamp: new Date().toISOString(),
              suggestedQuestions: [
                'Create My Action Plan',
                'Prepare for an Expert',
                'What are my legal options?'
              ]
            }
          ]);
        }
      }

      if (Array.isArray(context.documents) && context.documents.length > 0) {
        setAnalyzedDocs(context.documents.map((d, i) =>
          typeof d === 'string' ? { id: 'doc_' + i, fileName: d } : d
        ));
      } else {
        setAnalyzedDocs([]);
      }
    } catch (e) {
      console.warn('Could not load case history:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete a saved case
  const handleDeleteCase = async (caseId, e) => {
    e.stopPropagation();
    if (!user?.uid || !caseId) return;
    try {
      await deleteAIChat(user.uid, caseId);
      setSavedCases((prev) => prev.filter((c) => c.id !== caseId && c.chatId !== caseId));
      if (activeCaseId === caseId) {
        handleStartNewCase();
      }
    } catch (err) {
      console.warn('Could not delete case:', err);
    }
  };

  // Trigger Action Plan generation directly from Case Profile
  // Trigger Action Plan generation directly from Case Profile
  const handleCreateActionPlan = async () => {
    if (!requireAuth()) return;
    setIsProcessing(true);
    try {
      const response = await callAIApi({
        action: 'generate_plan',
        caseProfile,
        language: currentLanguage
      });
      const assistantMsg = {
        id: 'ast_' + Date.now(),
        role: 'assistant',
        text: response.message || response.reply || 'Your 5-Step Action Plan has been prepared.',
        timestamp: new Date().toISOString(),
        suggestedQuestions: response.suggestedQuestions || response.suggestedActions || [
          'Prepare for an Expert',
          'What documents do I need for my lawyer?'
        ],
        actionPlan: response.actionPlan || null,
      };
      const allMessages = [...messages, assistantMsg];
      setMessages(allMessages);

      if (response.caseProfile || response.actionPlan) {
        const updated = {
          ...caseProfile,
          ...(response.caseProfile || {}),
          actionPlan: response.actionPlan || caseProfile.actionPlan,
        };
        setCaseProfile(updated);
        if (user?.uid) {
          const chatIdToUse = activeCaseId || ('chat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7));
          if (!activeCaseId) {
            setActiveCaseId(chatIdToUse);
          }
          saveAIChat({
            userId: user.uid,
            chatId: chatIdToUse,
            title: updated.title || 'Legal Action Plan',
            messages: allMessages,
            caseContext: updated,
            caseProfile: updated,
          }).then((saved) => {
            setSavedCases((prev) => [saved, ...prev.filter(c => c.id !== chatIdToUse && c.chatId !== chatIdToUse)]);
          }).catch((err) => {
            console.warn('[AI Assistant] Save action plan chat failed:', err);
          });
        }
      }
    } catch (err) {
      console.error('[Action Plan Error]:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Trigger Advocate-Ready Case Brief generation directly from Case Profile
  const handlePrepareForExpert = async () => {
    if (!requireAuth()) return;
    setIsProcessing(true);
    try {
      const response = await callAIApi({
        action: 'export_summary',
        caseProfile,
        language: currentLanguage
      });
      const assistantMsg = {
        id: 'ast_' + Date.now(),
        role: 'assistant',
        text: response.message || response.reply || 'Your advocate-ready case brief has been prepared.',
        timestamp: new Date().toISOString(),
        suggestedQuestions: [
          'Book Advocate Consultation',
          'Download Case Brief (.txt)',
          'Review Action Plan'
        ],
        expertSummary: response.expertSummary || null
      };
      const allMessages = [...messages, assistantMsg];
      setMessages(allMessages);

      if (response.caseProfile || response.expertSummary) {
        const updated = {
          ...caseProfile,
          ...(response.caseProfile || {}),
        };
        setCaseProfile(updated);
        if (user?.uid) {
          const chatIdToUse = activeCaseId || ('chat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7));
          if (!activeCaseId) {
            setActiveCaseId(chatIdToUse);
          }
          saveAIChat({
            userId: user.uid,
            chatId: chatIdToUse,
            title: updated.title || 'Advocate Case Brief',
            messages: allMessages,
            caseContext: updated,
            caseProfile: updated,
          }).then((saved) => {
            setSavedCases((prev) => [saved, ...prev.filter(c => c.id !== chatIdToUse && c.chatId !== chatIdToUse)]);
          }).catch((err) => {
            console.warn('[AI Assistant] Save expert brief chat failed:', err);
          });
        }
      }
    } catch (err) {
      console.error('[Expert Brief Error]:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Quick Action Dispatcher
  const handleTriggerQuickAction = (action) => {
    if (!requireAuth(action.prompt)) return;
    if (action.id === 'plan') {
      handleCreateActionPlan();
    } else if (action.id === 'expert') {
      handlePrepareForExpert();
    } else {
      handleSendMessage(action.prompt);
    }
  };

  // Send message to AI Agent
  const handleSendMessage = async (textToSend = null) => {
    const prompt = (textToSend || inputMessage).trim();
    if (!prompt || isProcessing) return;

    // Authentication Gate: Require login before sending query or creating private case
    if (!requireAuth(prompt)) {
      return;
    }

    setInputMessage('');
    setFailedPrompt(null);

    const userMsg = {
      id: 'usr_' + Date.now(),
      role: 'user',
      text: prompt,
      timestamp: new Date().toISOString(),
    };

    // Remove any trailing error bubble before appending new query
    const baseMessages = messages.filter((m) => !m.isError);
    const updatedMessages = [...baseMessages, userMsg];
    setMessages(updatedMessages);
    setIsProcessing(true);

    try {
      const autoTitle = generateChatTitle(prompt, caseProfile);

      // Compact sliding window: take only the last 10 clean conversational turns
      const recentHistory = updatedMessages
        .filter((m) => !m.isError && m.text && m.text.trim())
        .map((m) => ({ role: m.role, text: m.text }))
        .slice(-10);

      // Call serverless /api/ai
      const response = await callAIApi({
        action: 'chat',
        messages: recentHistory,
        caseProfile,
        language: currentLanguage,
      });

      // Check if backend returned error
      if (response.isError) {
        setFailedPrompt(prompt);
        setInputMessage(prompt); // Preserve user message so it's not lost
        setMessages((prev) => [
          ...prev,
          {
            id: 'err_' + Date.now(),
            role: 'assistant',
            text: response.message || response.reply || "Something went wrong while processing your request. Please check your connection and retry.",
            timestamp: new Date().toISOString(),
            isError: true,
            canRetry: true,
            failedPrompt: prompt
          }
        ]);
        return;
      }

      const newProfile = response.caseProfile || response.caseUpdate;
      const finalTitle = response.caseProfile?.title || newProfile?.title || (caseProfile.title !== 'New Legal Situation Assessment' ? caseProfile.title : autoTitle);

      const assistantMsg = {
        id: 'ast_' + Date.now(),
        role: 'assistant',
        text: response.message || response.reply || response.text || 'I have analyzed your situation.',
        timestamp: new Date().toISOString(),
        suggestedQuestions: response.suggestedQuestions || response.suggestedActions || [],
        actionPlan: response.actionPlan || null,
        highRisk: response.highRisk || (newProfile && (newProfile.urgency === 'High' || newProfile.urgency === 'Urgent' || newProfile.urgency === 'Critical')),
      };

      const finalMessages = [...updatedMessages, assistantMsg];
      setMessages(finalMessages);

      // Update Case Profile with newly extracted intelligence
      const mergedProfile = {
        ...caseProfile,
        ...(newProfile || {}),
        title: finalTitle,
        actionPlan: response.actionPlan || newProfile?.actionPlan || caseProfile.actionPlan,
      };
      setCaseProfile(mergedProfile);

      // Save to Firestore under authenticated user's UID (users/{uid}/aiChats/{chatId})
      if (user?.uid) {
        const chatIdToUse = activeCaseId || ('chat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7));
        const isFirstExchange = !activeCaseId;

        try {
          const savedChat = await saveAIChat({
            userId: user.uid,
            chatId: chatIdToUse,
            title: finalTitle,
            messages: finalMessages,
            caseContext: mergedProfile,
            caseProfile: mergedProfile,
          });

          if (isFirstExchange) {
            setActiveCaseId(chatIdToUse);
          }

          // Update Recent Chats immediately (most recent on top)
          setSavedCases((prev) => {
            const filtered = prev.filter((c) => c.id !== chatIdToUse && c.chatId !== chatIdToUse);
            return [savedChat, ...filtered];
          });
        } catch (saveErr) {
          console.warn('[AI Assistant] Firestore chat save error:', saveErr);
        }
      }
    } catch (err) {
      console.error('[AI Assistant Error]:', err);
      setFailedPrompt(prompt);
      setInputMessage(prompt); // Preserve user message so it's not lost
      setMessages((prev) => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          role: 'assistant',
          text: "Something went wrong while processing your request.",
          timestamp: new Date().toISOString(),
          isError: true,
          canRetry: true,
          failedPrompt: prompt
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Document Upload & Analysis Handler (Multimodal & Textual)
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Authentication Gate: require login before analyzing or saving document
    if (!requireAuth()) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploadingDoc(true);

    try {
      const { dataUrl, text } = await readFileData(file);
      const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');

      const docPayload = {
        fileName: file.name,
        fileType: file.type || (isPdf ? 'application/pdf' : 'image/jpeg'),
        fileSize: file.size,
        dataUrl: dataUrl || null,
        text: text || '',
      };

      const docUploadMsg = {
        id: 'doc_' + Date.now(),
        role: 'user',
        text: `Uploaded Document: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        documentName: file.name,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, docUploadMsg]);

      // Call AI serverless endpoint to analyze document
      const analysis = await callAIApi({
        action: 'analyze_document',
        document: docPayload,
        caseProfile,
        language: currentLanguage,
      });

      const docResult = {
        id: 'doc_res_' + Date.now(),
        fileName: file.name,
        ...analysis.documentAnalysis,
        analyzedAt: new Date().toLocaleTimeString(),
      };

      setAnalyzedDocs((prev) => [docResult, ...prev]);

      const analysisAssistantMsg = {
        id: 'ast_doc_' + Date.now(),
        role: 'assistant',
        text: analysis.message || analysis.reply || `I have completed analyzing **${file.name}**. Here are the extracted details:`,
        documentCard: docResult,
        timestamp: new Date().toISOString(),
        suggestedQuestions: analysis.suggestedQuestions || [
          'What did you find in this document?',
          'Create My Action Plan',
          'Prepare for an Expert',
        ]
      };

      const allMessages = [...messages, docUploadMsg, analysisAssistantMsg];
      setMessages(allMessages);

      // Merge extracted facts and dates into live profile
      const updatedProfile = {
        ...caseProfile,
        ...(analysis.caseProfile || {}),
        documents: Array.from(new Set([...(caseProfile.documents || []), file.name])),
      };
      setCaseProfile(updatedProfile);

      if (user?.uid) {
        const chatIdToUse = activeCaseId || ('chat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7));
        const isFirstExchange = !activeCaseId;

        try {
          const savedChat = await saveAIChat({
            userId: user.uid,
            chatId: chatIdToUse,
            title: updatedProfile.title || (`Analysis: ${file.name}`),
            messages: allMessages,
            caseContext: updatedProfile,
            caseProfile: updatedProfile,
          });

          if (isFirstExchange) {
            setActiveCaseId(chatIdToUse);
          }

          setSavedCases((prev) => {
            const filtered = prev.filter((c) => c.id !== chatIdToUse && c.chatId !== chatIdToUse);
            return [savedChat, ...filtered];
          });
        } catch (saveErr) {
          console.warn('[AI Assistant] Error saving document chat:', saveErr);
        }
      }
    } catch (err) {
      console.error('[Document Analysis Error]:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'err_doc_' + Date.now(),
          role: 'assistant',
          text: "Something went wrong while analyzing this document. Please verify the file is not corrupted and try again.",
          timestamp: new Date().toISOString(),
          isError: true,
          canRetry: true
        }
      ]);
    } finally {
      setIsUploadingDoc(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Generate Expert Case Brief Summary
  const generateAdvocateBrief = () => {
    return `LEGALBHAROSA CASE BRIEF FOR ADVOCATE REVIEW
--------------------------------------------------
Case Type: ${caseProfile.caseType || 'General Legal Case'}
Subtype / Category: ${caseProfile.caseSubType || 'Dispute Assessment'}
Current Stage: ${caseProfile.stage || 'Pre-Litigation Intake'}
Urgency Level: ${caseProfile.urgency || 'Normal'}

CASE SUMMARY:
${caseProfile.summary || 'Summary pending user fact submission.'}

KEY FACTS ESTABLISHED:
${caseProfile.facts?.length > 0 ? caseProfile.facts.map((f, i) => `${i + 1}. ${typeof f === 'object' && f !== null ? (f.text || f.fact || JSON.stringify(f)) : f}`).join('\n') : '- No primary facts logged.'}

IMPORTANT DATES & DEADLINES:
${caseProfile.importantDates?.length > 0 ? caseProfile.importantDates.map((d, i) => `${i + 1}. ${typeof d === 'object' && d !== null ? `${d.label ? d.label + ': ' : ''}${d.date || ''}` : d}`).join('\n') : '- None recorded.'}

DOCUMENTS ATTACHED:
${caseProfile.documents?.length > 0 ? caseProfile.documents.map((d, i) => `${i + 1}. ${typeof d === 'object' && d !== null ? (d.name || d.title || JSON.stringify(d)) : d}`).join('\n') : '- Awaiting document submission.'}

PRIMARY BORROWER CONCERNS:
${caseProfile.concerns?.length > 0 ? caseProfile.concerns.map((c, i) => `${i + 1}. ${c}`).join('\n') : '- Harassment protection and statutory resolution.'}

RECOMMENDED NEXT LEGAL STEP:
${caseProfile.recommendedNextStep || 'Review by Bar Council registered advocate.'}
--------------------------------------------------
Generated by LegalBharosa AI Case Intelligence
"Understand your situation. Know your next step."`;
  };

  // Connect Case to Existing LegalBharosa Consultation Booking System
  const handleConnectToExpert = () => {
    const brief = generateAdvocateBrief();
    const serviceTopic = `${caseProfile.caseType || 'Legal Case'} - AI Case Intelligence Brief`;
    
    // Copy brief to clipboard for user convenience
    if (navigator.clipboard) {
      navigator.clipboard.writeText(brief).catch(() => {});
    }

    // Call existing handleOpenConsult from App.jsx, which opens the existing ConsultationModal
    if (onOpenConsult) {
      onOpenConsult(serviceTopic);
    }
  };

  // Copy Brief to Clipboard
  const handleCopyBrief = () => {
    const brief = generateAdvocateBrief();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(brief).then(() => {
        setCopiedSummary(true);
        setTimeout(() => setCopiedSummary(false), 3000);
      });
    }
  };

  // Download Brief as .txt file
  const handleDownloadBrief = () => {
    const brief = generateAdvocateBrief();
    const blob = new Blob([brief], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LegalBharosa_Case_Brief_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // WhatsApp Message Review & Dispatch
  const handleOpenWhatsAppReview = () => {
    const brief = generateAdvocateBrief();
    setWhatsAppText(brief);
    setShowWhatsAppModal(true);
  };

  const handleConfirmSendWhatsApp = () => {
    setShowWhatsAppModal(false);
    const url = `https://wa.me/917386444186?text=${encodeURIComponent(whatsAppText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col pt-16 pb-12 font-inter">

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. COMPACT HERO / HEADER SECTION */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-[#0a1535] via-[#0f1f4a] to-[#0a1535] text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Title & Tagline */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#168CFF]/20 text-[#00D2FF] border border-[#168CFF]/30">
                  <Sparkles className="w-3 h-3 text-[#00D2FF]" />
                  <span>Interactive Case Intelligence</span>
                </span>
                <span className="text-xs text-slate-400">| Powered by Gemini</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                LegalBharosa AI Assistant
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Understand your loan notices, check statutory protections, and build an advocate-ready case brief.
              </p>
            </div>

            {/* Top Quick Actions */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleConnectToExpert}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Prepare for an Advocate</span>
              </button>

              {!user && (
                <button
                  type="button"
                  onClick={onOpenSignIn}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4B400] hover:bg-[#E0A200] text-[#071938] text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign In to Save</span>
                </button>
              )}
            </div>

          </div>

          {/* Legal Advisory Disclaimer Bar */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00D2FF] shrink-0" />
              <span>
                LegalBharosa AI provides general information and case organization support under Indian law (RBI guidelines, SARFAESI 2002, NI Act). It does not replace advice from an enrolled advocate.
              </span>
            </div>
            <span className="hidden sm:inline-block text-[10px] text-slate-400">
              End-to-End Encrypted Intake
            </span>
          </div>

        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. MOBILE VIEW SWITCHER (Tabs: Chat | Recent | Case Profile | Plan) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 w-full mt-3">
        <div className="flex rounded-xl bg-slate-200/80 p-1 border border-slate-300">
          <button
            type="button"
            onClick={() => setMobileTab('chat')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mobileTab === 'chat'
                ? 'bg-white text-[#0B2A5B] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chat
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('chats')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mobileTab === 'chats'
                ? 'bg-white text-[#0B2A5B] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Recent Chats
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('profile')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mobileTab === 'profile'
                ? 'bg-white text-[#0B2A5B] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Profile
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('plan')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mobileTab === 'plan'
                ? 'bg-white text-[#0B2A5B] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Plan
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. MAIN WORKSPACE CONTAINER (3 COLUMNS ON DESKTOP) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4 flex-1 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">

          {/* ========================================================= */}
          {/* COLUMN 1: LEFT SIDEBAR (Recent Chats, Documents & Tools) */}
          {/* ========================================================= */}
          <aside className={`space-y-4 ${
            mobileTab === 'chats' ? 'block col-span-12' : 'hidden lg:block lg:col-span-3'
          }`}>
            
            {/* + NEW CHAT BUTTON */}
            <button
              type="button"
              onClick={handleStartNewCase}
              className="w-full py-2.5 px-3 rounded-xl bg-[#0B2A5B] hover:bg-[#168CFF] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Chat</span>
            </button>

            {/* RECENT CHATS SECTION */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#168CFF]" />
                  <span>Recent Chats</span>
                </h3>
                {user && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-[#0B2A5B]">
                    {savedCases.length}
                  </span>
                )}
              </div>

              {!user ? (
                <div className="text-center py-4 px-2 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                  <Lock className="w-5 h-5 text-slate-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">Sign in to view your recent chats</p>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Your chats and case files are saved securely under your account.
                  </p>
                  <button
                    type="button"
                    onClick={onOpenSignIn}
                    className="w-full py-2 px-3 rounded-lg bg-[#0B2A5B] hover:bg-[#168CFF] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Sign In / Register
                  </button>
                </div>
              ) : isLoadingCases ? (
                <div className="py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#168CFF]" />
                  <span>Loading recent chats...</span>
                </div>
              ) : savedCases.length === 0 ? (
                <div className="text-center py-5 px-3 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <MessageSquare className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
                  <p className="text-xs text-slate-500 font-medium">No recent chats yet.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Start a conversation to save your case.</p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {savedCases.map((c) => {
                    const isActive = activeCaseId === c.id;
                    return (
                      <div
                        key={c.id}
                        onClick={() => handleSelectCase(c)}
                        className={`group relative w-full text-left p-2.5 rounded-xl text-xs transition-all flex flex-col gap-1 cursor-pointer border ${
                          isActive
                            ? 'bg-[#0B2A5B] text-white border-[#0B2A5B] shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-semibold truncate flex-1 pr-1">
                            {c.title || c.caseType || 'Legal Case'}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCase(c.id, e)}
                            title="Delete Chat"
                            className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500 hover:text-white transition-all cursor-pointer ${
                              isActive ? 'text-white/80' : 'text-slate-400'
                            }`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <div className={`flex items-center justify-between text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                          <span className="truncate max-w-[120px] font-medium">
                            {c.caseType || 'General'}
                          </span>
                          <span>{formatChatTime(c.updatedAt || c.createdAt)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions Navigator */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                <span>Case Intake Modules</span>
                <Sparkles className="w-3.5 h-3.5 text-[#168CFF]" />
              </h3>

              <div className="space-y-1.5">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => handleTriggerQuickAction(action)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:text-[#0B2A5B] hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span className="truncate pr-2">{action.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#168CFF] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Uploaded Documents List */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Documents Analyzed
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                  {analyzedDocs.length}
                </span>
              </div>

              {analyzedDocs.length === 0 ? (
                <div className="text-center py-5 px-3 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <FileText className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
                  <p className="text-xs text-slate-500 font-medium">No documents uploaded</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Upload bank notices or agreements</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {analyzedDocs.map((doc, idx) => (
                    <div 
                      key={doc.id || idx}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-2"
                    >
                      <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-800 truncate">{doc.fileName}</p>
                        <p className="text-[10px] text-slate-500">{doc.documentType || 'Notice Analysis'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  if (!requireAuth()) return;
                  fileInputRef.current?.click();
                }}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-[#0B2A5B]/5 hover:bg-[#0B2A5B]/10 text-[#0B2A5B] text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#0B2A5B]/15 transition-all cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5 text-[#168CFF]" />
                <span>Upload New Document</span>
              </button>
            </div>

          </aside>


          {/* ========================================================= */}
          {/* COLUMN 2: CENTER CHAT & INTELLIGENCE STREAM */}
          {/* ========================================================= */}
          <main className={`lg:col-span-6 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs min-h-[640px] max-h-[820px] overflow-hidden ${
            mobileTab !== 'chat' ? 'hidden lg:flex' : 'flex'
          }`}>
            
            {/* Conversation Header */}
            <div className="p-3.5 sm:p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#0B2A5B] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-[#00D2FF]" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {caseProfile.title || caseProfile.caseType || 'Case Intelligence Intake'}
                  </h2>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Legal Engine
                    </span>
                    <span>•</span>
                    <span className="capitalize">{caseProfile.stage}</span>
                  </div>
                </div>
              </div>

              {/* Urgency Badge */}
              {(caseProfile.urgency === 'High' || caseProfile.urgency === 'Urgent' || caseProfile.urgency === 'Critical') && (
                <div className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold flex items-center gap-1 shrink-0 animate-pulse">
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  <span>High Priority</span>
                </div>
              )}
            </div>

            {/* High-Risk Calm Escalation Alert */}
            {(caseProfile.urgency === 'High' || caseProfile.urgency === 'Urgent' || caseProfile.urgency === 'Critical') && (
              <div className="mx-4 mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">
                  <strong className="font-semibold">Statutory Time-Sensitive Matter:</strong>{' '}
                  This situation involves court notices, cheque bounce (Sec 138), or SARFAESI recovery. 
                  Strict limitation periods apply in Indian courts. We recommend having an advocate prepare an official response.
                </div>
                <button
                  type="button"
                  onClick={handleConnectToExpert}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-[11px] shrink-0 cursor-pointer"
                >
                  Book Advocate
                </button>
              </div>
            )}

            {/* Messages Stream Container */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((msg, index) => {
                  const isLatest = index === messages.length - 1;
                  const isLatestAssistant = isLatest && msg.role === 'assistant';

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className={`flex flex-col ${
                        msg.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-[#0B2A5B] text-white rounded-tr-xs shadow-xs'
                            : 'bg-slate-100/90 text-slate-800 rounded-tl-xs border border-slate-200/80 shadow-xs'
                        }`}
                      >
                        {/* Header line for Assistant */}
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-slate-200 text-[11px] font-semibold text-[#0B2A5B]">
                            <Scale className="w-3.5 h-3.5 text-[#168CFF]" />
                            <span>LegalBharosa Case Intelligence</span>
                          </div>
                        )}

                        {/* Text Content */}
                        {msg.role === 'assistant' ? (
                          <AnimatedMessageText 
                            text={msg.text} 
                            isLatestAssistant={isLatestAssistant} 
                          />
                        ) : (
                          <div className="whitespace-pre-wrap space-y-2">
                            {msg.text}
                          </div>
                        )}

                        {/* Render Analyzed Document Card inside message bubble if present */}
                        {msg.documentCard && (
                          <div className="mt-3.5 p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs text-xs space-y-2.5 text-slate-800">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <span className="font-bold text-[#0B2A5B] flex items-center gap-1.5">
                                <FileSearch className="w-4 h-4 text-[#168CFF]" />
                                Document Breakdown
                              </span>
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                                {msg.documentCard.documentType || 'Notice'}
                              </span>
                            </div>

                            {msg.documentCard.amountMentioned && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500">Amount Demanded:</span>
                                <span className="font-bold text-slate-900">{msg.documentCard.amountMentioned}</span>
                              </div>
                            )}

                            {msg.documentCard.importantDate && (
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500">Notice / Due Date:</span>
                                <span className="font-semibold text-rose-600">{msg.documentCard.importantDate}</span>
                              </div>
                            )}

                            {msg.documentCard.demands && (
                              <div>
                                <span className="text-[11px] font-semibold text-slate-600 block mb-0.5">Demands:</span>
                                <p className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded-lg">
                                  {msg.documentCard.demands}
                                </p>
                              </div>
                            )}

                            {msg.documentCard.keyClauses && (
                              <div>
                                <span className="text-[11px] font-semibold text-slate-600 block mb-0.5">What to pay attention to:</span>
                                <p className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded-lg">
                                  {msg.documentCard.keyClauses}
                                </p>
                              </div>
                            )}

                            {msg.documentCard.questionsForAdvocate && (
                              <div>
                                <span className="text-[11px] font-semibold text-[#0B2A5B] block mb-0.5">Questions for Advocate:</span>
                                <p className="text-[11px] text-slate-700 bg-blue-50/60 p-2 rounded-lg border border-blue-100">
                                  {msg.documentCard.questionsForAdvocate}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Retry button for error states */}
                        {msg.isError && (
                          <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleSendMessage(msg.failedPrompt || failedPrompt)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B2A5B] hover:bg-[#168CFF] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Try Again</span>
                            </button>
                          </div>
                        )}

                        {/* Timestamp */}
                        <div className={`mt-2 text-[10px] text-right ${msg.role === 'user' ? 'text-slate-300' : 'text-slate-400'}`}>
                          {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </div>

                      {/* Dynamic Suggested Next Question Chips */}
                      {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                          {msg.suggestedQuestions.map((q, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                const lower = q.toLowerCase();
                                if (lower.includes('upload')) {
                                  if (!requireAuth()) return;
                                  fileInputRef.current?.click();
                                } else if (lower.includes('action plan')) {
                                  handleCreateActionPlan();
                                } else if (lower.includes('expert') || lower.includes('advocate') || lower.includes('brief') || lower.includes('consultation')) {
                                  handlePrepareForExpert();
                                } else {
                                  handleSendMessage(q);
                                }
                              }}
                              className="px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-[#0B2A5B] border border-blue-200/80 text-[11px] font-medium transition-colors shadow-xs text-left cursor-pointer"
                            >
                              {q} →
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Processing / Typing Indicator */}
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 p-3 bg-slate-100/90 rounded-2xl rounded-tl-xs border border-slate-200/80 max-w-[240px] shadow-xs"
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#168CFF] animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 rounded-full bg-[#168CFF] animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 rounded-full bg-[#168CFF] animate-bounce" />
                  </div>
                  <span className="text-xs text-slate-600 font-medium">Analyzing case intelligence...</span>
                </motion.div>
              )}

              {/* Document upload in progress */}
              {isUploadingDoc && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3.5 bg-blue-50/90 border border-blue-200/80 rounded-2xl max-w-sm space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-[#0B2A5B]">
                    <span className="flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4 text-[#168CFF] animate-pulse" />
                      <span>Extracting Document Clauses...</span>
                    </span>
                    <span className="text-[10px] text-blue-600 font-bold">Scanning</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#168CFF] h-1.5 rounded-full w-2/3 animate-[pulse_1.2s_ease-in-out_infinite]" />
                  </div>
                  <p className="text-[10.5px] text-slate-500">Checking notice dates, amounts, and statutory references...</p>
                </motion.div>
              )}
            </div>

            {/* Conversation Input & Document Uploader Bar */}
            <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
              
              {/* Quick attachment input (hidden) */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
                id="doc-file-upload"
              />

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                {/* Upload Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (!requireAuth()) return;
                    fileInputRef.current?.click();
                  }}
                  title="Upload Legal Notice or Loan Agreement (PDF / JPG / PNG)"
                  className="p-2.5 text-slate-500 hover:text-[#0B2A5B] hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors shrink-0 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                </button>

                {/* Speech to text (if supported) */}
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    title={isListening ? "Stop voice input" : "Speak your legal query"}
                    className={`p-2.5 rounded-xl border transition-colors shrink-0 cursor-pointer ${
                      isListening
                        ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse'
                        : 'text-slate-500 hover:text-[#0B2A5B] hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}

                {/* Text Input */}
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Describe your situation, notice details, or ask a question..."
                  disabled={isProcessing}
                  className="flex-1 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-[#168CFF] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden transition-all"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isProcessing}
                  className="p-2.5 bg-[#0B2A5B] hover:bg-[#071938] disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
                  aria-label="Send query"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>Supports PDF, JPG, PNG legal notices & loan agreements</span>
                <span className="hidden sm:inline">100% Confidential</span>
              </div>
            </div>

          </main>


          {/* ========================================================= */}
          {/* COLUMN 3: RIGHT PANEL (Live Structured Case Profile & Plan) */}
          {/* ========================================================= */}
          <aside className={`lg:col-span-3 space-y-4 ${
            mobileTab === 'chat' || mobileTab === 'chats' ? 'hidden lg:block' : 'block'
          }`}>

            {/* LIVE CASE PROFILE CARD */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#168CFF]" />
                  <span>Case Intelligence</span>
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  caseProfile.urgency === 'High' || caseProfile.urgency === 'Urgent' || caseProfile.urgency === 'Critical'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-blue-50 text-blue-700'
                }`}>
                  {caseProfile.urgency} Urgency
                </span>
              </div>

              {/* Classification Badges */}
              <div className="space-y-1.5">
                <div className="text-[11px] text-slate-500 font-medium">Issue Classification:</div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="font-bold text-xs text-[#0B2A5B]">{caseProfile.caseType}</div>
                  {caseProfile.caseSubType && (
                    <div className="text-[11px] text-slate-600 mt-0.5">{caseProfile.caseSubType}</div>
                  )}
                </div>
              </div>

              {/* Current Stage */}
              <div className="space-y-1">
                <div className="text-[11px] text-slate-500 font-medium">Current Stage:</div>
                <div className="text-xs font-semibold text-slate-800 bg-blue-50/50 px-2.5 py-1.5 rounded-lg border border-blue-100">
                  {caseProfile.stage}
                </div>
              </div>

              {/* Key Facts Extracted with Evidence Source Tagging */}
              <div className="space-y-1.5">
                <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between">
                  <span>Key Facts Established:</span>
                  <span className="text-[10px] text-slate-400 font-bold">{caseProfile.facts?.length || 0}</span>
                </div>
                {caseProfile.facts?.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">No key facts confirmed yet.</p>
                ) : (
                  <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {caseProfile.facts.map((fact, idx) => {
                      const factText = typeof fact === 'object' && fact !== null ? (fact.text || fact.fact || JSON.stringify(fact)) : String(fact);
                      const source = typeof fact === 'object' && fact !== null ? (fact.source || 'USER') : 'USER';
                      
                      let badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200/80';
                      if (source === 'DOCUMENT') badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
                      else if (source === 'AUTHORIZED_SOURCE') badgeStyle = 'bg-purple-50 text-purple-700 border-purple-200/80';
                      else if (source === 'INFERENCE') badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200/80';

                      return (
                        <li key={idx} className="text-[11px] text-slate-700 p-2 rounded-lg bg-slate-50 border border-slate-200/70 flex flex-col gap-1 leading-snug">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 font-semibold text-slate-800">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>Fact #{idx + 1}</span>
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${badgeStyle}`}>
                              {source}
                            </span>
                          </div>
                          <span className="text-[10.5px] text-slate-600 pl-4">{factText}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Important Dates / Deadlines */}
              {caseProfile.importantDates?.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] text-slate-500 font-medium">Key Deadlines:</div>
                  <div className="space-y-1">
                    {caseProfile.importantDates.map((d, idx) => {
                      const displayDate = typeof d === 'object' && d !== null
                        ? `${d.label ? d.label + ': ' : ''}${d.date || ''}`
                        : String(d);
                      return (
                        <div key={idx} className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-1 rounded border border-rose-200/60 flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-rose-600 shrink-0" />
                          <span>{displayDate}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Approved Statutory Legal Sources */}
              {caseProfile.sources?.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                    <Scale className="w-3 h-3 text-[#168CFF]" />
                    <span>Statutory Legal Basis:</span>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {caseProfile.sources.map((src, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-purple-50/60 border border-purple-200/70 text-[11px] text-purple-950 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#0B2A5B] truncate pr-1">{src.title}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 shrink-0">
                            {src.authorityLevel || 'Statute'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-600 leading-snug">{src.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Next Step */}
              <div className="p-3.5 bg-gradient-to-br from-[#0B2A5B]/5 to-[#168CFF]/10 rounded-xl border border-[#168CFF]/20 space-y-1">
                <div className="text-[11px] font-bold text-[#0B2A5B] uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#168CFF]" />
                  <span>Recommended Next Step</span>
                </div>
                <p className="text-xs text-slate-800 font-medium leading-relaxed">
                  {caseProfile.recommendedNextStep || 'Describe your situation or upload documents to receive tailored legal next steps.'}
                </p>
              </div>

            </div>

            {/* 5-STEP ACTION PLAN CARD */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
                <span>Your Next-Step Plan</span>
                <ListOrdered className="w-4 h-4 text-[#168CFF]" />
              </h3>

              <div className="space-y-2 text-xs">
                {/* 01 Understand */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="font-bold text-[#0B2A5B] flex items-center gap-1.5 mb-1">
                    <span className="w-4 h-4 rounded-full bg-[#0B2A5B] text-white text-[10px] flex items-center justify-center font-bold">1</span>
                    <span>Understand</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {caseProfile.actionPlan?.step1_understand || "Identify lender demands and legal grounds under RBI/SARFAESI."}
                  </p>
                </div>

                {/* 02 Prepare */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="font-bold text-[#0B2A5B] flex items-center gap-1.5 mb-1">
                    <span className="w-4 h-4 rounded-full bg-[#0B2A5B] text-white text-[10px] flex items-center justify-center font-bold">2</span>
                    <span>Prepare</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {caseProfile.actionPlan?.step2_prepare || "Gather loan sanction letter, repayment statement, and notice copy."}
                  </p>
                </div>

                {/* 03 Consider */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="font-bold text-[#0B2A5B] flex items-center gap-1.5 mb-1">
                    <span className="w-4 h-4 rounded-full bg-[#0B2A5B] text-white text-[10px] flex items-center justify-center font-bold">3</span>
                    <span>Consider</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {caseProfile.actionPlan?.step3_consider || "Review compromise settlement (OTS), restructuring, or formal legal reply."}
                  </p>
                </div>

                {/* 04 Next Action */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="font-bold text-[#0B2A5B] flex items-center gap-1.5 mb-1">
                    <span className="w-4 h-4 rounded-full bg-[#0B2A5B] text-white text-[10px] flex items-center justify-center font-bold">4</span>
                    <span>Next Action</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {caseProfile.actionPlan?.step4_next_action || caseProfile.actionPlan?.step4_action || "Issue formal written representation or file complaint with RBI Ombudsman."}
                  </p>
                </div>

                {/* 05 Professional Review */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="font-bold text-[#0B2A5B] flex items-center gap-1.5 mb-1">
                    <span className="w-4 h-4 rounded-full bg-[#0B2A5B] text-white text-[10px] flex items-center justify-center font-bold">5</span>
                    <span>Professional Review</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {caseProfile.actionPlan?.step5_professional_review || caseProfile.actionPlan?.step5_review || "Connect with LegalBharosa panel advocate for tailored defense."}
                  </p>
                </div>
              </div>
            </div>

            {/* EXPERT HANDOFF ACTION CARD */}
            <div className="bg-gradient-to-br from-[#0B2A5B] to-[#071938] rounded-2xl p-4 text-white shadow-lg space-y-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#F4B400]" />
                <h3 className="font-bold text-sm tracking-tight">Prepare for an Expert</h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Seamlessly transfer this organized case brief and documents directly to a Bar Council registered advocate.
              </p>

              <button
                type="button"
                onClick={handleConnectToExpert}
                className="w-full py-2.5 px-3 rounded-xl bg-[#F4B400] hover:bg-[#E0A200] text-[#071938] font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Book Advocate Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyBrief}
                  className="py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3 text-[#00D2FF]" />
                  <span>{copiedSummary ? 'Copied!' : 'Copy Brief'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadBrief}
                  className="py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Download className="w-3 h-3 text-[#00D2FF]" />
                  <span>Download .txt</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleOpenWhatsAppReview}
                className="w-full py-1.5 px-2 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#25D366]/30"
              >
                <span>Review & Send on WhatsApp</span>
              </button>
            </div>

          </aside>

        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. WHATSAPP BRIEF REVIEW MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-[#0B2A5B] flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#25D366]" />
                <span>Review Case Summary Before Sending</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowWhatsAppModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Review and edit the structured brief generated by AI before sending it to our Legal Support Desk on WhatsApp:
            </p>

            <textarea
              value={whatsAppText}
              onChange={(e) => setWhatsAppText(e.target.value)}
              rows={8}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#168CFF] font-mono leading-relaxed"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowWhatsAppModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSendWhatsApp}
                className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>Continue to WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
// Final submission update
