import React from 'react';
import { ShieldAlert, LogOut, ArrowLeft, KeyRound } from 'lucide-react';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

export default function AdminAccessDeniedView({ 
  user, 
  userProfile, 
  onNavigateHome 
}) {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#07090E] text-white flex flex-col items-center justify-center p-6 text-center font-inter">
      <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6 shadow-2xl">
        <ShieldAlert className="w-10 h-10" />
      </div>

      <span className="text-xs font-mono uppercase tracking-widest text-rose-400 bg-rose-500/10 px-3.5 py-1 rounded-full border border-rose-500/20 mb-3">
        Unauthorized Account
      </span>

      <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-2">
        Administrator Privileges Required
      </h1>

      <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
        You are currently signed in as <span className="text-white font-medium">{user?.email || 'Authenticated User'}</span>, but this account has not been designated with an administrator role.
      </p>

      {/* Account Verification Details */}
      <div className="w-full max-w-md mx-auto bg-black/60 border border-white/10 rounded-2xl p-4 text-left font-mono text-xs text-slate-300 mb-6 space-y-2.5 shadow-2xl backdrop-blur-sm">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-white/10 flex items-center justify-between">
          <span>Security Authorization Record</span>
          <span className="text-rose-400 font-semibold">Role: {userProfile?.role || 'None'}</span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-slate-400">Authenticated UID:</span>
          <span className="text-[#00D2FF] bg-white/5 p-1 rounded text-[11px] select-all break-all">
            {user?.uid || 'N/A'}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-slate-400">Firestore Document Path:</span>
          <span className="text-amber-300 bg-white/5 p-1 rounded text-[11px] select-all break-all">
            users/{user?.uid}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-400 leading-normal flex items-start gap-2">
          <KeyRound className="w-3.5 h-3.5 text-[#F4B400] shrink-0 mt-0.5" />
          <span>
            To grant this account access, an authorized owner must set <code className="text-[#00D2FF] bg-black/50 px-1 py-0.5 rounded">role: "admin"</code> on the document above in the Firebase Firestore Console.
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleSignOut}
          className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 flex items-center gap-2 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out / Switch Account</span>
        </button>

        <button
          type="button"
          onClick={onNavigateHome}
          className="px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-300 bg-white/10 hover:bg-white/15 border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Homepage</span>
        </button>
      </div>
    </div>
  );
}
