import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Calendar, 
  Shield, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Camera, 
  Save, 
  X, 
  Lock, 
  Trash2, 
  LogOut, 
  ArrowLeft, 
  ExternalLink, 
  FileText, 
  Bookmark, 
  Clock, 
  ChevronRight, 
  Info, 
  AlertTriangle, 
  Loader2, 
  KeyRound,
  MessageSquare
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { auth } from '../firebase';
import { 
  signOut, 
  sendEmailVerification, 
  sendPasswordResetEmail, 
  updatePassword, 
  deleteUser, 
  updateProfile 
} from 'firebase/auth';
import { 
  updateUserProfile, 
  uploadUserProfilePhoto, 
  deleteUserProfileDoc,
  subscribeUserCases,
  subscribeUserArticles,
  subscribeUserBookmarks
} from '../services/firestoreService';
import Footer from '../components/Footer';
import ArticleEditorModal from '../components/ArticleEditorModal';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi NCR', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh'
];

const PREFERRED_LANGUAGES = [
  'English', 'Hindi (हिंदी)', 'Telugu (తెలుగు)', 'Tamil (தமிழ்)', 
  'Kannada (ಕನ್ನಡ)', 'Marathi (मराठी)', 'Bengali (বাংলা)', 
  'Gujarati (ગુજરાતી)', 'Malayalam (മലയാളം)', 'Punjabi (ਪੰਜਾਬੀ)'
];

const COMM_PREFERENCES = [
  { id: 'whatsapp_call', label: 'WhatsApp & Phone Call (Recommended)' },
  { id: 'whatsapp_only', label: 'WhatsApp Only' },
  { id: 'call_only', label: 'Phone Call Only' },
  { id: 'email_only', label: 'Email Only' }
];

export default function ProfilePage({ 
  user, 
  userProfile, 
  authLoading = false,
  onOpenSignIn,
  onOpenConsult
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'activity' | 'security'

  // Edit Mode for Personal Info
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    state: '',
    preferredLanguage: 'English',
    communicationPreference: 'whatsapp_call',
    dateOfBirth: '',
  });

  // Photo upload state
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Form processing & notification states
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [feedback, setFeedback] = useState({ type: '', message: '' }); // type: 'success' | 'error'

  // User Activity Data
  const [userCases, setUserCases] = useState([]);
  const [userArticles, setUserArticles] = useState([]);
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [editingArticle, setEditingArticle] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);

  // Security States
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [verifyEmailSent, setVerifyEmailSent] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [sendingVerify, setSendingVerify] = useState(false);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Delete Account Confirmation State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // 1. Authentication Guard: Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      onOpenSignIn?.();
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, navigate, onOpenSignIn]);

  // 2. Synchronize Form Data when userProfile or user changes
  useEffect(() => {
    if (user || userProfile) {
      setFormData({
        name: userProfile?.name || user?.displayName || '',
        phone: userProfile?.phone || user?.phoneNumber || '',
        city: userProfile?.city || '',
        state: userProfile?.state || '',
        preferredLanguage: userProfile?.preferredLanguage || 'English',
        communicationPreference: userProfile?.communicationPreference || 'whatsapp_call',
        dateOfBirth: userProfile?.dateOfBirth || '',
      });
      setPhotoPreview(userProfile?.photoURL || user?.photoURL || null);
    }
  }, [user, userProfile]);

  // 3. Real-time Subscriptions for Activity (Cases, Authored Articles, Bookmarked Articles)
  useEffect(() => {
    if (!user?.uid) return;

    setLoadingActivity(true);

    const unsubCases = subscribeUserCases(user.uid, (cases) => {
      setUserCases(cases || []);
    });

    const unsubArticles = subscribeUserArticles(user.uid, (articles) => {
      setUserArticles(articles || []);
    });

    const unsubBookmarks = subscribeUserBookmarks(user.uid, (bookmarks) => {
      setBookmarkedArticles(bookmarks || []);
      setLoadingActivity(false);
    });

    return () => {
      unsubCases();
      unsubArticles();
      unsubBookmarks();
    };
  }, [user?.uid]);

  // Clear feedback after 6 seconds
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => setFeedback({ type: '', message: '' }), 6000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Phone validation helper (Indian 10-digit standard or international)
  const validatePhone = (phone) => {
    if (!phone) return true; // optional field unless entered
    const clean = phone.replace(/[\s\-()+]/g, '');
    // Indian 10-digit mobile or international (7-15 digits)
    return /^[0-9]{7,15}$/.test(clean);
  };

  // Handle Input Changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Handle Profile Photo File Selection & Upload
  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type and size
    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'Please select a valid image file (PNG, JPG, WebP).' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFeedback({ type: 'error', message: 'Profile photo must be smaller than 5MB.' });
      return;
    }

    // Instant local preview
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);

    setUploadingPhoto(true);
    setFeedback({ type: '', message: '' });

    try {
      const uploadRes = await uploadUserProfilePhoto(user.uid, file);
      if (uploadRes.success && uploadRes.url) {
        // Update Firebase Auth profile
        try {
          await updateProfile(auth.currentUser, { photoURL: uploadRes.url });
        } catch (authErr) {
          console.warn('[Profile] Auth photo update warning:', authErr);
        }

        // Update Firestore profile
        await updateUserProfile(user.uid, { photoURL: uploadRes.url });

        setPhotoPreview(uploadRes.url);
        setFeedback({ type: 'success', message: 'Profile photo updated successfully!' });
      } else {
        throw new Error(uploadRes.error || 'Failed to upload photo to storage.');
      }
    } catch (err) {
      console.error('[Profile] Photo upload error:', err);
      setFeedback({ 
        type: 'error', 
        message: 'Could not upload photo to storage. Your local preview remains active, but changes could not be saved to the cloud.' 
      });
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Save Personal Info
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      errors.phone = 'Please enter a valid phone number (10-digit mobile number).';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);

    try {
      // 1. Update Firebase Auth displayName
      if (formData.name.trim() !== user?.displayName) {
        try {
          await updateProfile(auth.currentUser, { displayName: formData.name.trim() });
        } catch (authErr) {
          console.warn('[Profile] Firebase Auth displayName sync warning:', authErr);
        }
      }

      // 2. Update Firestore user document
      await updateUserProfile(user.uid, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        preferredLanguage: formData.preferredLanguage,
        communicationPreference: formData.communicationPreference,
        dateOfBirth: formData.dateOfBirth,
      });

      setIsEditing(false);
      setFeedback({ type: 'success', message: 'Your profile has been saved successfully!' });
    } catch (err) {
      console.error('[Profile] Save error:', err);
      setFeedback({ 
        type: 'error', 
        message: err.message || 'Failed to save profile changes. Please verify connection and try again.' 
      });
    } finally {
      setSaving(false);
    }
  };

  // Cancel Editing
  const handleCancelEditing = () => {
    setIsEditing(false);
    setFormErrors({});
    setFormData({
      name: userProfile?.name || user?.displayName || '',
      phone: userProfile?.phone || user?.phoneNumber || '',
      city: userProfile?.city || '',
      state: userProfile?.state || '',
      preferredLanguage: userProfile?.preferredLanguage || 'English',
      communicationPreference: userProfile?.communicationPreference || 'whatsapp_call',
      dateOfBirth: userProfile?.dateOfBirth || '',
    });
  };

  // Email Verification Trigger
  const handleSendVerificationEmail = async () => {
    if (!user || user.emailVerified) return;
    setSendingVerify(true);
    try {
      await sendEmailVerification(auth.currentUser);
      setVerifyEmailSent(true);
      setFeedback({ type: 'success', message: `Verification link sent to ${user.email}. Please check your inbox and spam folder.` });
    } catch (err) {
      console.error('[Profile] Verification email error:', err);
      setFeedback({ type: 'error', message: err.message || 'Failed to send verification email. Please try again later.' });
    } finally {
      setSendingVerify(false);
    }
  };

  // Password Reset Trigger
  const handleSendPasswordReset = async () => {
    if (!user?.email) return;
    setSendingReset(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetEmailSent(true);
      setFeedback({ type: 'success', message: `Password reset email dispatched to ${user.email}. Please follow the link in your email.` });
    } catch (err) {
      console.error('[Profile] Reset password error:', err);
      setFeedback({ type: 'error', message: err.message || 'Failed to dispatch reset email.' });
    } finally {
      setSendingReset(false);
    }
  };

  // In-App Password Change Submission
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match. Please re-enter.');
      return;
    }

    setChangingPassword(true);
    try {
      await updatePassword(auth.currentUser, newPassword);
      setShowPasswordChangeModal(false);
      setNewPassword('');
      setConfirmPassword('');
      setFeedback({ type: 'success', message: 'Password updated successfully!' });
    } catch (err) {
      console.error('[Profile] Password update error:', err);
      if (err.code === 'auth/requires-recent-login') {
        setPasswordError('For security, password changes require a recent sign-in. Please sign out and sign back in, then retry.');
      } else {
        setPasswordError(err.message || 'Failed to update password.');
      }
    } finally {
      setChangingPassword(false);
    }
  };

  // Delete Account Execution
  const handleDeleteAccountConfirm = async () => {
    if (deleteConfirmationText.trim().toUpperCase() !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm account deletion.');
      return;
    }

    setDeletingAccount(true);
    setDeleteError('');

    try {
      const uid = user.uid;
      // 1. Delete or deactivate Firestore user profile doc
      await deleteUserProfileDoc(uid);

      // 2. Delete user in Firebase Authentication
      await deleteUser(auth.currentUser);

      setShowDeleteModal(false);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('[Profile] Delete account error:', err);
      if (err.code === 'auth/requires-recent-login') {
        setDeleteError('This sensitive action requires a fresh authentication session. Please sign out, sign in again, and retry account deletion.');
      } else {
        setDeleteError(err.message || 'Failed to delete account. Please contact legal support.');
      }
    } finally {
      setDeletingAccount(false);
    }
  };

  // Sign Out Helper
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error('[Profile] Sign out error:', err);
    }
  };

  // Helpers
  const isGoogleUser = user?.providerData?.some((p) => p.providerId === 'google.com');
  const isAdmin = userProfile?.role === 'admin';
  const creationDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : userProfile?.createdAt?.seconds
    ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Active Member';

  const userInitials = (formData.name || user?.displayName || user?.email || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Loading Screen while Auth Resolves
  if (authLoading && !user) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-10 h-10 animate-spin text-[#168CFF] mb-3" />
        <p className="text-sm font-semibold text-[#0B2A5B]">{t('common.loading', 'Loading...')}</p>
        <p className="text-xs text-neutral-500 mt-1">Verifying encrypted session credentials</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 via-white to-blue-50/30 text-neutral-900 font-inter flex flex-col justify-between selection:bg-[#168CFF]/20 selection:text-[#0B2A5B]">
      
      {/* Hidden File Input for Photo Upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handlePhotoSelect} 
        accept="image/png,image/jpeg,image/webp" 
        className="hidden" 
      />

      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 flex-1">
        
        {/* Navigation Breadcrumb / Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-[#0B2A5B] transition-colors py-1.5 px-3 rounded-xl hover:bg-neutral-100 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>{t('common.back', 'Back')}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-xs font-semibold text-[#0B2A5B] bg-blue-50 hover:bg-blue-100/80 border border-[#168CFF]/30 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>{t('nav.clientDashboard', 'Client Dashboard')}</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#168CFF]" />
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>🛡️ {t('nav.adminConsole', 'Admin Console')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Feedback Banner */}
        <AnimatePresence>
          {feedback.message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-2xl border text-sm flex items-start justify-between gap-3 shadow-sm ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                )}
                <span className="font-medium">{feedback.message}</span>
              </div>
              <button 
                type="button" 
                onClick={() => setFeedback({ type: '', message: '' })}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. HERO PROFILE CARD */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_28px_rgba(6,45,120,0.06)] p-6 sm:p-8 mb-8 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#168CFF]/8 to-[#12B9F2]/8 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Left: Avatar + Identity Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 sm:gap-6 text-center sm:text-left w-full sm:w-auto">
              
              {/* Avatar with Camera Overlay */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[#0B2A5B] via-[#168CFF] to-[#12B9F2] shadow-md">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                    {photoPreview ? (
                      <img 
                        src={photoPreview} 
                        alt={formData.name || 'User avatar'} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0B2A5B] to-[#14295f] text-white flex items-center justify-center text-2xl font-bold font-manrope">
                        {userInitials}
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit Photo Floating Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  aria-label="Upload profile picture"
                  className="absolute bottom-1 right-1 p-2 rounded-full bg-[#168CFF] hover:bg-[#078BE8] text-white shadow-lg border-2 border-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                  title="Upload profile picture"
                >
                  {uploadingPhoto ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Identity Details */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#0B2A5B]">
                    {formData.name || user?.displayName || 'Client'}
                  </h1>

                  {/* Role Badge */}
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isAdmin 
                      ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                      : 'bg-blue-100 text-[#0B2A5B] border border-blue-200'
                  }`}>
                    {isAdmin ? '🛡️ Admin Account' : '⚖️ Client Account'}
                  </span>
                </div>

                {/* Email with Verification Badge */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-neutral-600 mb-2">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Mail className="w-3.5 h-3.5 text-[#168CFF]" />
                    <span>{user?.email || 'No email attached'}</span>
                  </span>

                  {user?.emailVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{t('common.verified', 'Verified')}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                      <span>{t('common.unverified', 'Unverified')}</span>
                    </span>
                  )}
                </div>

                {/* Additional Badges: Account Creation + Phone */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Joined {creationDate}</span>
                  </span>
                  {formData.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{formData.city}{formData.state ? `, ${formData.state}` : ''}</span>
                    </span>
                  )}
                  {formData.preferredLanguage && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{formData.preferredLanguage}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Quick Action Controls */}
            <div className="flex items-center justify-center sm:justify-end gap-2.5 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2.5 rounded-full font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-[#168CFF] to-[#078BE8] hover:from-[#0E7BE6] hover:to-[#0275D8] shadow-sm hover:shadow-[0_0_16px_rgba(22,140,255,0.3)] transition-all cursor-pointer flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{t('profile.editProfile', 'Edit Profile')}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCancelEditing}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-full font-medium text-xs sm:text-sm text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>{t('common.cancel', 'Cancel')}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSignOut}
                className="p-2.5 rounded-full text-neutral-500 hover:text-red-600 hover:bg-red-50 border border-neutral-200 hover:border-red-200 transition-colors cursor-pointer"
                title={t('nav.signOut', 'Sign Out')}
                aria-label={t('nav.signOut', 'Sign Out')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. SECTION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1 select-none">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'personal'
                ? 'bg-white text-[#0B2A5B] shadow-sm border border-slate-200/80'
                : 'text-neutral-600 hover:text-[#0B2A5B] hover:bg-neutral-100/60'
            }`}
          >
            <User className={`w-4 h-4 ${activeTab === 'personal' ? 'text-[#168CFF]' : 'text-neutral-400'}`} />
            <span>{t('profile.personalInfoTab', 'Personal Information')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'activity'
                ? 'bg-white text-[#0B2A5B] shadow-sm border border-slate-200/80'
                : 'text-neutral-600 hover:text-[#0B2A5B] hover:bg-neutral-100/60'
            }`}
          >
            <FileText className={`w-4 h-4 ${activeTab === 'activity' ? 'text-[#168CFF]' : 'text-neutral-400'}`} />
            <span>{t('profile.activityTab', 'My Activity & Cases')}</span>
            {userCases.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-[#0B2A5B]">
                {userCases.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'security'
                ? 'bg-white text-[#0B2A5B] shadow-sm border border-slate-200/80'
                : 'text-neutral-600 hover:text-[#0B2A5B] hover:bg-neutral-100/60'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${activeTab === 'security' ? 'text-[#168CFF]' : 'text-neutral-400'}`} />
            <span>{t('profile.securityTab', 'Account & Security')}</span>
          </button>
        </div>

        {/* 3. TAB CONTENT */}

        {/* TAB 1: PERSONAL INFORMATION */}
        {activeTab === 'personal' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(6,45,120,0.04)] p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-[#0B2A5B]">Personal Details</h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Update your contact, location, and communication preferences for legal consultations.
                </p>
              </div>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-semibold text-[#168CFF] hover:text-[#078BE8] flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>
              )}
            </div>

            {isEditing ? (
              /* EDIT FORM */
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0B2A5B] uppercase tracking-wider mb-1.5">
                      {t('profile.fullName', 'Full Name')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          formErrors.name 
                            ? 'border-red-400 bg-red-50/30 focus:border-red-500' 
                            : 'border-slate-200 focus:border-[#168CFF] focus:ring-2 focus:ring-[#168CFF]/15'
                        }`}
                      />
                    </div>
                    {formErrors.name && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{formErrors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Email (Read-Only) */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0B2A5B] uppercase tracking-wider mb-1.5">
                      {t('profile.email', 'Email Address')} <span className="text-neutral-400 font-normal">(Managed via Auth)</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-neutral-100/70 text-neutral-500 text-sm cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0B2A5B] uppercase tracking-wider mb-1.5">
                      {t('profile.phone', 'Phone Number')}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="e.g. 9876543210"
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                          formErrors.phone 
                            ? 'border-red-400 bg-red-50/30 focus:border-red-500' 
                            : 'border-slate-200 focus:border-[#168CFF] focus:ring-2 focus:ring-[#168CFF]/15'
                        }`}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{formErrors.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0B2A5B] uppercase tracking-wider mb-1.5">
                      {t('profile.city', 'City / District')}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="e.g. Bengaluru, Hyderabad, Mumbai"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#168CFF] focus:ring-2 focus:ring-[#168CFF]/15"
                      />
                    </div>
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0B2A5B] uppercase tracking-wider mb-1.5">
                      {t('profile.state', 'State / Union Territory')}
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#168CFF] focus:ring-2 focus:ring-[#168CFF]/15 bg-white cursor-pointer"
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Language */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0B2A5B] uppercase tracking-wider mb-1.5">
                      {t('profile.preferredLanguage', 'Preferred Language for Legal Consultations')}
                    </label>
                    <select
                      value={formData.preferredLanguage}
                      onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#168CFF] focus:ring-2 focus:ring-[#168CFF]/15 bg-white cursor-pointer"
                    >
                      {PREFERRED_LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date of Birth (Optional) */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0B2A5B] uppercase tracking-wider mb-1.5">
                      {t('profile.dob', 'Date of Birth (Optional)')}
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#168CFF] focus:ring-2 focus:ring-[#168CFF]/15"
                      />
                    </div>
                  </div>

                  {/* Communication Preference */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0B2A5B] uppercase tracking-wider mb-1.5">
                      {t('profile.commChannel', 'Preferred Contact Channel')}
                    </label>
                    <select
                      value={formData.communicationPreference}
                      onChange={(e) => handleInputChange('communicationPreference', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#168CFF] focus:ring-2 focus:ring-[#168CFF]/15 bg-white cursor-pointer"
                    >
                      {COMM_PREFERENCES.map((pref) => (
                        <option key={pref.id} value={pref.id}>{pref.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Save and Cancel Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCancelEditing}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    {t('common.cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#168CFF] to-[#078BE8] hover:from-[#0E7BE6] hover:to-[#0275D8] shadow-sm hover:shadow-[0_0_16px_rgba(22,140,255,0.3)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t('common.saving', 'Saving...')}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{t('profile.saveChanges', 'Save Changes')}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* VIEW MODE */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#168CFF]" />
                    <span>{t('profile.fullName', 'Full Legal Name')}</span>
                  </div>
                  <div className="text-sm font-bold text-[#0B2A5B]">
                    {formData.name || 'Not provided'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#168CFF]" />
                    <span>{t('profile.email', 'Email Address')}</span>
                  </div>
                  <div className="text-sm font-medium text-neutral-800 break-all">
                    {user?.email || 'Not provided'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#168CFF]" />
                    <span>{t('profile.phone', 'Phone Number')}</span>
                  </div>
                  <div className="text-sm font-medium text-neutral-800">
                    {formData.phone ? formData.phone : <span className="text-neutral-400 italic">Not specified</span>}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#168CFF]" />
                    <span>{t('profile.city', 'City / District')}</span>
                  </div>
                  <div className="text-sm font-medium text-neutral-800">
                    {formData.city || formData.state ? (
                      `${formData.city || ''}${formData.city && formData.state ? ', ' : ''}${formData.state || ''}`
                    ) : (
                      <span className="text-neutral-400 italic">Location not set</span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#168CFF]" />
                    <span>{t('profile.preferredLanguage', 'Preferred Language')}</span>
                  </div>
                  <div className="text-sm font-medium text-neutral-800">
                    {formData.preferredLanguage || 'English'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#168CFF]" />
                    <span>{t('profile.commChannel', 'Preferred Contact Channel')}</span>
                  </div>
                  <div className="text-sm font-medium text-neutral-800">
                    {COMM_PREFERENCES.find((p) => p.id === formData.communicationPreference)?.label || 'WhatsApp & Phone Call'}
                  </div>
                </div>

                {formData.dateOfBirth && (
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#168CFF]" />
                      <span>{t('profile.dob', 'Date of Birth')}</span>
                    </div>
                    <div className="text-sm font-medium text-neutral-800">
                      {new Date(formData.dateOfBirth).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY ACTIVITY & CASES */}
        {activeTab === 'activity' && (
          <div className="space-y-8">
            
            {/* 1. Legal Cases Section */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(6,45,120,0.04)] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-[#0B2A5B] flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#168CFF]" />
                    <span>{t('profile.activeCases', 'Active Legal Cases')}</span>
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Real-time status of your recovery harassment, notice defense, and debt restructuring cases.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="text-xs font-semibold text-[#168CFF] hover:text-[#078BE8] flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                >
                  <span>{t('nav.clientPortal', 'Go to Client Portal')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {loadingActivity ? (
                <div className="py-8 flex flex-col items-center justify-center text-neutral-400">
                  <Loader2 className="w-6 h-6 animate-spin text-[#168CFF] mb-2" />
                  <span className="text-xs">{t('common.loading', 'Loading...')}</span>
                </div>
              ) : userCases.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userCases.map((c) => (
                    <div 
                      key={c.id}
                      onClick={() => navigate('/dashboard')}
                      className="p-5 rounded-2xl border border-slate-200/90 hover:border-[#168CFF]/50 bg-slate-50/50 hover:bg-blue-50/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-[#0B2A5B] group-hover:text-[#168CFF] transition-colors">
                          {c.caseNumber || `CASE-${c.id.slice(0, 6).toUpperCase()}`}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          (c.status || '').toLowerCase().includes('resolved')
                            ? 'bg-emerald-100 text-emerald-800'
                            : (c.status || '').toLowerCase().includes('progress')
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {c.status || 'Under Review'}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-neutral-900 mb-1">
                        {c.serviceType || 'Legal Defense Representation'}
                      </h3>
                      {c.description && (
                        <p className="text-xs text-neutral-500 line-clamp-2 mb-3">
                          {c.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-slate-200/60">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {c.createdAt?.seconds
                              ? new Date(c.createdAt.seconds * 1000).toLocaleDateString('en-IN')
                              : 'Recent'}
                          </span>
                        </span>
                        <span className="text-[#168CFF] font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                          <span>{t('common.viewDetails', 'View Case Details')}</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-blue-50/50 border border-blue-100 text-center">
                  <ShieldCheck className="w-10 h-10 text-[#168CFF] mx-auto mb-2 opacity-80" />
                  <h3 className="text-sm font-bold text-[#0B2A5B]">{t('profile.noActiveCases', 'No active legal cases linked yet.')}</h3>
                  <p className="text-xs text-neutral-600 max-w-md mx-auto mt-1 mb-4">
                    You currently do not have any open legal defense or loan settlement cases registered with our advocates.
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenConsult?.('General Legal Consultation')}
                    className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-[#168CFF] hover:bg-[#078BE8] transition-colors cursor-pointer"
                  >
                    {t('common.getFreeConsultation', 'Get Free Legal Consultation')}
                  </button>
                </div>
              )}
            </div>

            {/* 2. Bookmarked Community Articles */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(6,45,120,0.04)] p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-[#0B2A5B] flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-[#168CFF]" />
                    <span>{t('profile.savedArticles', 'Saved Articles')}</span>
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Legal rights guides and borrower advisory articles you bookmarked for reference.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/articles')}
                  className="text-xs font-semibold text-[#168CFF] hover:text-[#078BE8] flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Articles</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {bookmarkedArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookmarkedArticles.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => navigate(`/articles/${art.id}`)}
                      className="p-5 rounded-2xl border border-slate-200 hover:border-[#168CFF]/50 bg-slate-50/50 hover:bg-blue-50/30 transition-all cursor-pointer group"
                    >
                      <span className="text-[10px] font-bold text-[#168CFF] uppercase tracking-wider mb-1 block">
                        {art.category || 'Legal Knowledge'}
                      </span>
                      <h3 className="text-sm font-bold text-neutral-900 group-hover:text-[#0B2A5B] transition-colors mb-1.5 line-clamp-1">
                        {art.title}
                      </h3>
                      <p className="text-xs text-neutral-500 line-clamp-2 mb-3">
                        {art.excerpt || art.content?.slice(0, 120)}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-slate-200/60">
                        <span>{art.readingTime || '4 min read'}</span>
                        <span className="text-[#168CFF] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>Read</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-center">
                  <Bookmark className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                  <p className="text-xs text-neutral-500">
                    No articles bookmarked yet. When reading knowledge guides, tap the bookmark icon to save them here.
                  </p>
                </div>
              )}
            </div>

            {/* 3. User's Authored Articles: My Articles Management */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(6,45,120,0.04)] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-[#0B2A5B] flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#168CFF]" />
                    <span>My Articles & Contributions</span>
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Track the editorial review status, feedback, and publication state of your articles.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingArticle(null);
                    setEditorOpen(true);
                  }}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#168CFF] to-[#078BE8] hover:brightness-105 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Write New Article</span>
                </button>
              </div>

              {userArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userArticles.map((art) => {
                    const status = art.status || 'pending';
                    const isDraft = status === 'draft';
                    const isPending = status === 'pending';
                    const isApproved = status === 'approved' || status === 'published';
                    const isChangesRequested = status === 'changes_requested';
                    const isRejected = status === 'rejected';

                    return (
                      <div
                        key={art.id}
                        className="p-5 rounded-2xl border border-slate-200 hover:border-[#168CFF]/50 bg-slate-50/50 hover:bg-blue-50/30 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-bold text-[#168CFF] uppercase tracking-wider">
                              {art.category || 'Article'}
                            </span>
                            
                            {/* Clear Status Badges */}
                            {isApproved && (
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Published</span>
                              </span>
                            )}
                            {isPending && (
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>Under Review</span>
                              </span>
                            )}
                            {isChangesRequested && (
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-300 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                <span>Changes Requested</span>
                              </span>
                            )}
                            {isRejected && (
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
                                <X className="w-3 h-3" />
                                <span>Rejected</span>
                              </span>
                            )}
                            {isDraft && (
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                <span>Draft</span>
                              </span>
                            )}
                          </div>

                          <h3 className="text-sm font-bold text-neutral-900 mb-1.5 line-clamp-2">
                            {art.title}
                          </h3>

                          {art.excerpt && (
                            <p className="text-xs text-neutral-500 line-clamp-2 mb-3">
                              {art.excerpt}
                            </p>
                          )}

                          {/* Editorial Feedback Callout for Changes Requested */}
                          {isChangesRequested && (
                            <div className="my-2.5 p-3 rounded-xl bg-orange-50/90 border border-orange-200 text-orange-900 text-xs">
                              <span className="font-bold flex items-center gap-1 text-orange-950 mb-0.5">
                                <AlertCircle className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                                Admin Feedback:
                              </span>
                              <p className="text-orange-900 font-medium leading-relaxed italic pl-4">
                                "{art.adminFeedback || 'Please update your article according to editorial standards.'}"
                              </p>
                            </div>
                          )}

                          {/* Rejection Reason Callout */}
                          {isRejected && (
                            <div className="my-2.5 p-3 rounded-xl bg-red-50/90 border border-red-200 text-red-900 text-xs">
                              <span className="font-bold flex items-center gap-1 text-red-950 mb-0.5">
                                <X className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                Rejection Reason:
                              </span>
                              <p className="text-red-900 font-medium leading-relaxed italic pl-4">
                                "{art.rejectionReason || 'Content did not meet publishing guidelines.'}"
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Card Bottom Actions */}
                        <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-3 border-t border-slate-200/60 mt-2">
                          <span>
                            {isApproved ? `${art.views || 0} Views` : (art.readingTime || '3 min read')}
                          </span>

                          <div className="flex items-center gap-2">
                            {(isDraft || isChangesRequested) && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingArticle(art);
                                  setEditorOpen(true);
                                }}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white bg-[#0B2A5B] hover:bg-[#168CFF] transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>{isChangesRequested ? 'Edit & Resubmit' : 'Edit Draft'}</span>
                              </button>
                            )}

                            {isApproved && (
                              <button
                                type="button"
                                onClick={() => navigate(`/articles/${art.id}`)}
                                className="text-[#168CFF] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                              >
                                <span>View Article</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}

                            {isPending && (
                              <span className="text-amber-700 font-medium italic text-[11px]">
                                Awaiting Admin Review
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-center">
                  <FileText className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-neutral-700">No articles authored yet</h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-4">
                    Share borrower defense experiences, RBI legal rights guides, or practical loan resolution advice with the community.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingArticle(null);
                      setEditorOpen(true);
                    }}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#168CFF] hover:bg-[#078BE8] transition-colors cursor-pointer"
                  >
                    Write an Article
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ACCOUNT & SECURITY */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            
            {/* Email Verification Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(6,45,120,0.04)] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-[#0B2A5B] flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#168CFF]" />
                    <span>Email Verification</span>
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Primary contact: <strong className="text-neutral-800">{user?.email}</strong>
                  </p>
                  <div className="mt-2">
                    {user?.emailVerified ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Email Address Confirmed & Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Email Not Yet Verified</span>
                      </span>
                    )}
                  </div>
                </div>

                {!user?.emailVerified && (
                  <button
                    type="button"
                    onClick={handleSendVerificationEmail}
                    disabled={sendingVerify || verifyEmailSent}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-[#0B2A5B] bg-blue-50 hover:bg-blue-100 border border-[#168CFF]/30 transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
                  >
                    {sendingVerify ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : verifyEmailSent ? (
                      'Verification Link Sent ✓'
                    ) : (
                      'Send Verification Email'
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Password & Authentication Method Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(6,45,120,0.04)] p-6 sm:p-8">
              <h3 className="text-base font-bold text-[#0B2A5B] flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-[#168CFF]" />
                <span>Authentication Method & Password</span>
              </h3>

              {isGoogleUser ? (
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-start gap-3 mt-3">
                  <div className="p-2 rounded-xl bg-white shadow-xs">
                    <Globe className="w-5 h-5 text-[#168CFF]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0B2A5B]">Google Authentication Active</h4>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      Your account signs in seamlessly via Google Identity services. Passwords, multi-factor authentication, and account recovery are managed directly in your Google Security settings.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 mt-3">
                  <p className="text-xs text-neutral-600">
                    You are signed in with an email & password credential. You can update your password or request a reset email at any time.
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowPasswordChangeModal(true)}
                      className="px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#168CFF] hover:bg-[#078BE8] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Change Password</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSendPasswordReset}
                      disabled={sendingReset || resetEmailSent}
                      className="px-4 py-2 rounded-full text-xs font-semibold text-[#0B2A5B] bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {sendingReset ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : resetEmailSent ? (
                        'Reset Dispatched ✓'
                      ) : (
                        'Send Reset Password Email'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Session Metadata Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(6,45,120,0.04)] p-6 sm:p-8">
              <h3 className="text-base font-bold text-[#0B2A5B] flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-[#168CFF]" />
                <span>{t('profile.accountDetails', 'Account & Session Details')}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-neutral-400 block mb-0.5">Firebase User ID (UID)</span>
                  <span className="font-mono text-neutral-800 break-all select-all">{user?.uid}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-neutral-400 block mb-0.5">Account Created</span>
                  <span className="font-medium text-neutral-800">{creationDate}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-neutral-400 block mb-0.5">Last Signed In</span>
                  <span className="font-medium text-neutral-800">
                    {user?.metadata?.lastSignInTime
                      ? new Date(user.metadata.lastSignInTime).toLocaleString('en-IN')
                      : 'Current session'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-neutral-400 block mb-0.5">Assigned System Role</span>
                  <span className="font-bold text-[#0B2A5B] uppercase tracking-wider">{userProfile?.role || 'client'}</span>
                </div>
              </div>
            </div>

            {/* Danger Zone: Delete Account */}
            <div className="bg-red-50/40 rounded-3xl border border-red-200/80 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-red-900 flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-600" />
                    <span>{t('profile.dangerZone', 'Danger Zone: Delete Account')}</span>
                  </h3>
                  <p className="text-xs text-red-700 mt-1 max-w-xl">
                    Permanently delete your profile and personal details from LegalBharosa. Any ongoing active court cases or legal files will remain strictly confidential and secured according to statutory advocate preservation requirements.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteConfirmationText('');
                    setDeleteError('');
                    setShowDeleteModal(true);
                  }}
                  className="px-4 py-2.5 rounded-full text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
                >
                  {t('profile.deleteAccountBtn', 'Delete Account')}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* PASSWORD CHANGE MODAL */}
      <AnimatePresence>
        {showPasswordChangeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#0B2A5B] flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-[#168CFF]" />
                  <span>Update Password</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPasswordChangeModal(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {passwordError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0B2A5B] mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#168CFF]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B2A5B] mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#168CFF]"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowPasswordChangeModal(false)}
                    className="px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-full cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="px-5 py-2 text-xs font-semibold text-white bg-[#168CFF] hover:bg-[#078BE8] rounded-full transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {changingPassword ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Save Password</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-red-200"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-red-900 mb-2">Delete Your Account?</h3>
              <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
                This will permanently delete your authentication login and profile data from LegalBharosa.org. This action cannot be reversed.
              </p>

              <div className="p-3 rounded-xl bg-red-50 border border-red-200 mb-4">
                <label className="block text-xs font-semibold text-red-900 mb-1">
                  Type <strong>DELETE</strong> below to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-3 py-2 rounded-lg border border-red-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-mono uppercase"
                />
              </div>

              {deleteError && (
                <p className="text-xs text-red-600 mb-4 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{deleteError}</span>
                </p>
              )}

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deletingAccount}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-full cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccountConfirm}
                  disabled={deletingAccount || deleteConfirmationText.trim().toUpperCase() !== 'DELETE'}
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
                >
                  {deletingAccount ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Delete My Account</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Article Editor Modal for Creating or Resubmitting Articles */}
      <ArticleEditorModal
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        user={user}
        userProfile={userProfile}
        editingArticle={editingArticle}
        onSaved={() => setEditorOpen(false)}
      />

      {/* Standard LegalBharosa Footer */}
      <Footer 
        onOpenConsult={onOpenConsult}
        onNavigateHome={() => navigate('/')}
        onNavigateToAbout={() => navigate('/about')}
      />
    </div>
  );
}
