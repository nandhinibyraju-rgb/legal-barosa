import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  signInWithRedirect
} from 'firebase/auth';
import { syncUserProfile } from '../services/firestoreService';

export default function SignInModal({ isOpen, onClose, onSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  if (!isOpen) return null;

  // 1. Google Authentication via signInWithPopup (Fast & seamless, with redirect fallback)
  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    console.log('[Auth] Initiating Google Sign-In with popup...');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('[Auth] Google Sign-In popup successful:', result.user?.email);

      if (result?.user) {
        try {
          await syncUserProfile(result.user);
        } catch (syncErr) {
          console.warn('[Auth] Profile sync warning:', syncErr);
        }

        setLoggedIn(true);
        setTimeout(() => {
          setLoggedIn(false);
          onClose();
          onSuccess?.(result.user);
        }, 700);
      }
    } catch (err) {
      console.error('[Auth] Google Sign-In Error:', err.code, err.message, err);

      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled: The Google popup window was closed before completing authentication.');
      } else if (err.code === 'auth/popup-blocked') {
        console.warn('[Auth] Popup blocked by browser, attempting redirect fallback...');
        try {
          sessionStorage.setItem('pendingAuthRedirect', 'dashboard');
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectErr) {
          console.error('[Auth] Redirect fallback error:', redirectErr);
          setError(`Popup was blocked by your browser and redirect fallback failed: ${redirectErr.message || redirectErr.code}`);
        }
      } else if (err.code === 'auth/unauthorized-domain') {
        setError(`Domain not authorized: "${window.location.hostname}" must be added to Authorized Domains in Firebase Console (Authentication > Settings > Authorized domains). [${err.code}]`);
      } else if (err.code === 'auth/operation-not-allowed') {
        setError(`Google provider is not enabled in Firebase Console. Please enable Google under Authentication > Sign-in method. [${err.code}]`);
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('Another sign-in window is already active.');
      } else if (err.code === 'auth/network-request-failed') {
        setError(`Network error: Unable to contact Firebase authentication servers. Please verify your connection. [${err.code}]`);
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError(`An account already exists with this email using a different sign-in method. Please sign in with email/password instead. [${err.code}]`);
      } else {
        setError(`${err.message || 'Google authentication failed.'} [${err.code || 'unknown'}]`);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      if (userCredential?.user) {
        // Sync user profile to Firestore users collection
        try {
          await syncUserProfile(userCredential.user);
        } catch (syncErr) {
          console.warn('[Auth] Profile sync warning:', syncErr);
        }

        setLoggedIn(true);
        setTimeout(() => {
          setLoggedIn(false);
          onClose();
          onSuccess?.(userCredential.user);
        }, 700);
      }
    } catch (err) {
      console.error('[Auth] Email Auth Error:', err.code, err.message, err);
      let msg = err.message || 'Authentication failed. Please try again.';
      if (
        err.code === 'auth/invalid-credential' || 
        err.code === 'auth/wrong-password' || 
        err.code === 'auth/user-not-found'
      ) {
        msg = 'Invalid email or password. Please verify your credentials.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/network-request-failed') {
        msg = 'Network connection error. Please verify your internet connection.';
      } else {
        msg = `${msg} [${err.code || 'auth-error'}]`;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address above to receive a password reset link.');
      return;
    }
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 5000);
    } catch (err) {
      setError(err.message || 'Could not send reset email. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#05070D]/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md rounded-2xl bg-[#0A101C] border border-white/15 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)] z-10"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {loggedIn ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-manrope font-bold text-xl text-white">
                {isSignUp ? 'Account Created!' : 'Welcome back!'}
              </h3>
              <p className="font-inter text-xs text-slate-400 mt-1">
                {isSignUp 
                  ? 'Connecting your new case file to LegalBharosa...' 
                  : 'Accessing your LegalBharosa client portal...'}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-[#0646A8]/40 border border-[#078BE8]/30 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-[#12B9F2]" />
                </div>
                <span className="font-manrope text-xs font-semibold text-[#12B9F2] uppercase tracking-wider">
                  SECURE CLIENT PORTAL
                </span>
              </div>

              <h2 className="font-heading font-bold text-2xl text-white tracking-tight">
                {isSignUp ? 'Create Client Account' : 'Sign In'}
              </h2>
              <p className="font-inter text-xs text-slate-400 mt-1 mb-5">
                {isSignUp 
                  ? 'Register to track dispute files, notices, and advisor responses.' 
                  : 'Access your active cases, advisor notes, and legal filings.'}
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="break-words leading-relaxed">{error}</span>
                </div>
              )}

              {resetSent && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Password reset link sent to your email address.</span>
                </div>
              )}

              {/* 1. CONTINUE WITH GOOGLE BUTTON (SEAMLESS POPUP WITH REDIRECT FALLBACK) */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 text-white font-manrope font-semibold text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm hover-glow-lift disabled:opacity-50"
              >
                {googleLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#12B9F2]" />
                    <span>Connecting to Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* SEPARATOR */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#0A101C] px-3 text-[11px] font-mono uppercase tracking-wider text-slate-400 absolute">
                  or with email
                </span>
              </div>

              {/* 2. EMAIL / PASSWORD FORM */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-manrope font-medium text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="client@legalbharosa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#078BE8] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-manrope font-medium text-slate-300">
                      Password
                    </label>
                    {!isSignUp && (
                      <button 
                        type="button" 
                        onClick={handleForgotPassword}
                        className="text-[11px] text-[#12B9F2] hover:underline cursor-pointer"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#078BE8] transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || googleLoading}
                    className="w-full py-3 px-4 rounded-xl font-manrope font-semibold text-[14px] text-white bg-gradient-to-r from-[#0646A8] via-[#078BE8] to-[#0646A8] hover:brightness-110 shadow-[0_4px_20px_rgba(7,139,232,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Connecting to Firebase...</span>
                      </>
                    ) : (
                      <>
                        <span>{isSignUp ? 'Create Case Account' : 'Sign In to Portal'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center pt-2 flex flex-col gap-1.5">
                  <span className="text-xs text-slate-400">
                    {isSignUp ? 'Already registered?' : "Don't have a case file yet?"}{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError('');
                      }}
                      className="text-[#12B9F2] hover:underline font-medium cursor-pointer"
                    >
                      {isSignUp ? 'Sign In instead' : 'Create an Account'}
                    </button>
                  </span>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
