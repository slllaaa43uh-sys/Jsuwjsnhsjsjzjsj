
import React, { useState, useRef, useEffect } from 'react';
import { API_BASE_URL } from '../constants';
import { Lock, Mail, ArrowLeft, X, User, Building2, ChevronRight, Check, ArrowRight, Briefcase, Globe, Loader2, Send, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginPageProps {
  onLoginSuccess: (token: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { t, language, setLanguage } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot Password State
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Registration State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerStep, setRegisterStep] = useState<'type' | 'form'>('type');
  const [registerType, setRegisterType] = useState<'individual' | 'company'>('individual');
  
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Verification State
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [userIdForVerification, setUserIdForVerification] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  // Registration specific error
  const [registerError, setRegisterError] = useState<string | null>(null);
  
  // Privacy Policy View State
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  // Refs for OTP inputs
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Function to handle OTP input changes
  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requireVerification) {
            setUserIdForVerification(data.userId);
            setIsVerificationOpen(true);
            setIsLoading(false);
            return;
        }

        setTimeout(() => {
            localStorage.setItem('token', data.token);
            const userObj = data.user || {};
            const userId = userObj._id || userObj.id || data.userId || data.id;
            
            if (userId) {
              localStorage.setItem('userId', userId);
              localStorage.setItem('userName', userObj.name || 'مستخدم');
              localStorage.setItem('userEmail', userObj.email || '');
              localStorage.setItem('userAvatar', userObj.avatar || '');
              localStorage.setItem('username', userObj.username || '');
            }
            onLoginSuccess(data.token);
        }, 800);
      } else {
        setError(data.message || 'Login failed. Please check credentials.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Connection error.');
      setIsLoading(false);
    }
  };

  const handleRegisterTypeSelect = (type: 'individual' | 'company') => {
    setRegisterType(type);
    setRegisterStep('form');
  };

  const handleRegisterSubmit = async () => {
    setRegisterError(null);

    if (!regName || !regEmail || !regPass || !regConfirmPass) {
        setRegisterError("يرجى ملء جميع الحقول");
        return;
    }
    if (regPass !== regConfirmPass) {
        setRegisterError("كلمات المرور غير متطابقة");
        return;
    }
    if (!agreedToPolicy) {
        setRegisterError(t('privacy_error_msg'));
        return;
    }

    setIsRegistering(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: regName,
                email: regEmail,
                password: regPass,
                userType: registerType
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Success: Move to verification step without logging in yet
            setUserIdForVerification(data.userId);
            setIsRegistering(false);
            setIsRegisterOpen(false); // Close register modal
            setIsVerificationOpen(true); // Open verification modal
        } else {
            setRegisterError(data.message || "Registration failed");
            setIsRegistering(false);
        }
    } catch (e) {
        setRegisterError("Connection error");
        setIsRegistering(false);
    }
  };

  const handleVerifyEmail = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
        alert("يرجى إدخال الرمز المكون من 6 أرقام");
        return;
    }

    if (!userIdForVerification) return;

    setIsVerifying(true);
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userIdForVerification, code })
        });

        const data = await response.json();

        if (response.ok) {
            // Success: Log in
            localStorage.setItem('token', data.token);
            const userObj = data.user || {};
            const userId = userObj._id || userObj.id;
            
            if (userId) {
                localStorage.setItem('userId', userId);
                localStorage.setItem('userName', userObj.name || regName);
                localStorage.setItem('userEmail', userObj.email || regEmail);
                if (userObj.avatar) localStorage.setItem('userAvatar', userObj.avatar);
                if (userObj.username) localStorage.setItem('username', userObj.username);
            }
            onLoginSuccess(data.token);
        } else {
            alert(data.message || t('verify_error'));
        }
    } catch (e) {
        alert(t('error_occurred'));
    } finally {
        setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!userIdForVerification) return;
    
    setIsResending(true);
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/resend-verification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userIdForVerification })
        });

        if (response.ok) {
            alert(t('resend_code_sent'));
        } else {
            const data = await response.json();
            alert(data.message || "Failed to resend code");
        }
    } catch (e) {
        alert(t('error_occurred'));
    } finally {
        setIsResending(false);
    }
  };

  const handleResetPassword = async () => {
    if (!forgotEmail.trim()) {
        setResetMessage({ type: 'error', text: 'الرجاء إدخال البريد الإلكتروني' });
        return;
    }
    
    setIsResetting(true);
    setResetMessage(null);

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/forgotpassword`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: forgotEmail })
        });

        if (response.ok) {
            setResetMessage({ type: 'success', text: t('reset_link_sent') });
            setTimeout(() => {
                setIsForgotPasswordOpen(false);
                setResetMessage(null);
                setForgotEmail('');
            }, 3000);
        } else {
            const data = await response.json();
            setResetMessage({ type: 'error', text: data.message || t('reset_link_fail') });
        }
    } catch (error) {
        setResetMessage({ type: 'error', text: t('error_occurred') });
    } finally {
        setIsResetting(false);
    }
  };

  const getPlaceholderName = () => {
      switch(registerType) {
          case 'company': return t('register_company_name_placeholder');
          default: return t('register_name_placeholder');
      }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      
      {/* --- Top Curved Header --- */}
      <div className="relative h-[25vh] w-full bg-gradient-to-tr from-blue-600 to-purple-600 rounded-b-[40px] shadow-lg flex flex-col items-center justify-center flex-shrink-0">
          
          {/* Language Toggle */}
          <div className={`absolute top-safe top-4 z-20 ${language === 'ar' ? 'left-4' : 'right-4'}`}>
            <button 
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white py-1.5 px-3 rounded-full transition-colors backdrop-blur-sm"
            >
                <Globe size={14} className="text-white" />
                <span className="text-xs font-bold text-white">{language === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </div>

          {/* App Name in Header */}
          <h1 className="text-3xl font-black text-white mb-6 tracking-tight drop-shadow-md">
             {t('app_name')}
          </h1>

          {/* Overlapping Logo - Raised slightly */}
          <div className="absolute -bottom-8 shadow-xl rounded-2xl bg-white p-2">
             <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Briefcase size={36} className="text-white" strokeWidth={2.5} />
             </div>
          </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col px-8 pt-14 pb-safe overflow-y-auto">
          
          <div className="text-center mb-6">
             <h1 className="text-2xl font-black text-gray-900 mb-1">{t('login_title')}</h1>
             <p className="text-gray-500 text-sm font-medium">{t('login_subtitle')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3 w-full max-w-sm mx-auto">
            
            {/* Email Input */}
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 px-1">{t('email_label')}</label>
                <div className="relative group">
                    <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none`}>
                        <Mail size={18} className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`block w-full py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-sm ${language === 'ar' ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'}`}
                        placeholder={t('email_placeholder')}
                        dir="ltr"
                    />
                </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 px-1">{t('password_label')}</label>
                <div className="relative group">
                    <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none`}>
                        <Lock size={18} className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`block w-full py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-sm ${language === 'ar' ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'}`}
                        placeholder="••••••••"
                        dir="ltr"
                    />
                </div>
            </div>

            {error && (
              <div className="py-2 px-4 rounded-xl bg-red-50 text-red-600 text-xs font-bold text-center border border-red-100 flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-200">
                <X size={14} />
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
              ) : (
                  <>
                    <span>{t('login_button')}</span>
                    {language === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                  </>
              )}
            </button>
          </form>

          {/* Links Section */}
          <div className="mt-4 flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
             <button 
                type="button"
                onClick={() => setIsForgotPasswordOpen(true)} 
                className="text-xs text-gray-500 hover:text-blue-600 transition-colors font-bold"
             >
                {t('forgot_password')}
             </button>

             <div className="flex items-center w-full gap-4">
                <div className="h-px bg-gray-100 flex-1"></div>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">OR</span>
                <div className="h-px bg-gray-100 flex-1"></div>
             </div>

             <button 
               onClick={() => setIsRegisterOpen(true)}
               className="w-full py-3 border-2 border-gray-100 hover:border-blue-100 bg-white text-gray-700 hover:text-blue-600 rounded-xl font-bold text-sm transition-all"
             >
               {t('create_new_account')}
             </button>
          </div>
          
      </div>

      {/* --- Modals (Kept standard styles but cleaned up) --- */}

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => { setIsForgotPasswordOpen(false); setResetMessage(null); }}
            />
            
            <div className="bg-white w-full max-w-md rounded-t-3xl relative z-10 animate-in slide-in-from-bottom duration-300 pb-safe shadow-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-gray-900">{t('forgot_password_title')}</h3>
                    <button onClick={() => { setIsForgotPasswordOpen(false); setResetMessage(null); }} className="bg-gray-50 p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="space-y-4">
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                        {t('forgot_password_desc')}
                    </p>

                    <div className="relative group">
                        <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none`}>
                            <Mail size={20} className="text-gray-400" />
                        </div>
                        <input
                            type="email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            className={`block w-full py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-sm ${language === 'ar' ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'}`}
                            placeholder={t('email_placeholder')}
                            dir="ltr"
                        />
                    </div>

                    {resetMessage && (
                        <div className={`py-3 px-4 rounded-xl text-xs font-bold text-center border flex items-center justify-center gap-2 animate-in zoom-in ${
                            resetMessage.type === 'success' 
                            ? 'bg-green-50 text-green-600 border-green-100' 
                            : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                            {resetMessage.type === 'success' ? <Check size={16} /> : <X size={16} />}
                            {resetMessage.text}
                        </div>
                    )}

                    <button
                        onClick={handleResetPassword}
                        disabled={isResetting}
                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isResetting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className={language === 'ar' ? 'rotate-180' : ''} />}
                        <span>{isResetting ? t('sending') : t('send')}</span>
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Registration Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => { setIsRegisterOpen(false); setRegisterError(null); }}
            />
            
            <div className="bg-white w-full max-w-md rounded-t-[2rem] p-6 relative z-10 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
                
                <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-20 pb-2 border-b border-gray-50">
                    <h2 className="text-xl font-black text-gray-900">
                        {registerStep === 'type' ? t('register_title') : t('register_subtitle')}
                    </h2>
                    <button onClick={() => { setIsRegisterOpen(false); setRegisterError(null); }} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {registerStep === 'type' ? (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500 font-bold mb-4">{t('register_choose_type')}</p>
                        
                        <button 
                            onClick={() => handleRegisterTypeSelect('individual')}
                            className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition-all group"
                        >
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shadow-sm">
                                <User size={24} />
                            </div>
                            <div className={`flex-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                <h3 className="font-bold text-gray-900 text-base">{t('register_individual_title')}</h3>
                                <p className="text-xs text-gray-500 mt-1 font-medium">{t('register_individual_desc')}</p>
                            </div>
                            <ChevronRight className={`text-gray-300 group-hover:text-blue-500 ${language === 'ar' ? 'rotate-180' : ''}`} />
                        </button>

                        <button 
                            onClick={() => handleRegisterTypeSelect('company')}
                            className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-purple-50 hover:border-purple-200 transition-all group"
                        >
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform shadow-sm">
                                <Building2 size={24} />
                            </div>
                            <div className={`flex-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                <h3 className="font-bold text-gray-900 text-base">{t('register_commercial_title')}</h3>
                                <p className="text-xs text-gray-500 mt-1 font-medium">{t('register_commercial_desc')}</p>
                            </div>
                            <ChevronRight className={`text-gray-300 group-hover:text-purple-500 ${language === 'ar' ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                ) : (
                    <div className={`space-y-4 animate-in ${language === 'ar' ? 'slide-in-from-right' : 'slide-in-from-left'} duration-300`}>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5 px-1">{getPlaceholderName()}</label>
                            <input 
                                type="text"
                                value={regName}
                                onChange={(e) => setRegName(e.target.value)}
                                className={`w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-bold text-sm ${language === 'ar' ? 'text-right' : 'text-left'}`}
                                placeholder={getPlaceholderName()}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5 px-1">{t('email_label')}</label>
                            <input 
                                type="email"
                                value={regEmail}
                                onChange={(e) => setRegEmail(e.target.value)}
                                className={`w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-bold text-sm dir-ltr ${language === 'ar' ? 'text-right' : 'text-left'}`}
                                placeholder="example@mail.com"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 px-1">{t('password_label')}</label>
                                <input 
                                    type="password"
                                    value={regPass}
                                    onChange={(e) => setRegPass(e.target.value)}
                                    className={`w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-bold text-sm ${language === 'ar' ? 'text-right' : 'text-left'}`}
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 px-1">{t('confirm_password')}</label>
                                <input 
                                    type="password"
                                    value={regConfirmPass}
                                    onChange={(e) => setRegConfirmPass(e.target.value)}
                                    className={`w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-bold text-sm ${language === 'ar' ? 'text-right' : 'text-left'}`}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4 px-2 py-3 bg-blue-50 rounded-xl border border-blue-100">
                            <div 
                                onClick={() => {
                                    setAgreedToPolicy(!agreedToPolicy);
                                    if (!agreedToPolicy) setRegisterError(null);
                                }}
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 ${agreedToPolicy ? 'bg-blue-600 border-blue-600' : 'border-gray-400 bg-white'}`}
                            >
                                {agreedToPolicy && <Check size={14} className="text-white" strokeWidth={3} />}
                            </div>
                            <span className="text-xs font-bold text-gray-700">
                                {t('i_agree_to')} 
                                <button 
                                    type="button"
                                    onClick={() => setShowPrivacyPolicy(true)}
                                    className="text-blue-600 underline mx-1 font-bold hover:text-blue-700"
                                >
                                    {t('privacy_policy_link')}
                                </button>
                            </span>
                        </div>

                        {registerError && (
                            <div className="py-3 px-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold text-center border border-red-100 animate-in fade-in slide-in-from-top-1">
                                {registerError}
                            </div>
                        )}

                        <div className="pt-2 space-y-3">
                            <button 
                                onClick={handleRegisterSubmit}
                                disabled={isRegistering}
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-200 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isRegistering && <Loader2 size={18} className="animate-spin" />}
                                {isRegistering ? t('registering') : t('register_button')}
                            </button>
                            
                            <button 
                                onClick={() => { setRegisterStep('type'); setRegisterError(null); }}
                                className="w-full py-3 text-gray-500 text-sm font-bold hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors"
                            >
                                {t('back')}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
      )}

      {/* Verification Code Bottom Sheet */}
      {isVerificationOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => { if(!isVerifying) setIsVerificationOpen(false); }}
            />
            
            <div className="bg-white w-full max-w-md rounded-t-3xl relative z-10 animate-in slide-in-from-bottom duration-300 pb-safe shadow-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-gray-900">{t('verify_title')}</h3>
                    <button onClick={() => { if(!isVerifying) setIsVerificationOpen(false); }} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                <div className="space-y-6 text-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-green-50/50">
                        <ShieldCheck size={40} className="text-green-600" />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 font-bold mb-1">
                            {t('verify_sent_desc')}
                        </p>
                        <p className="text-base text-gray-900 font-black dir-ltr">
                            {email || regEmail}
                        </p>
                    </div>

                    {/* 6-Digit OTP Inputs */}
                    <div className="flex justify-center gap-2 dir-ltr">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <input
                                key={index}
                                ref={(el) => (otpRefs.current[index] = el)}
                                type="tel"
                                maxLength={1}
                                value={verificationCode[index]}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                className="w-12 h-14 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-gray-300 bg-gray-50 focus:bg-white"
                                placeholder={t('verify_code_placeholder')}
                            />
                        ))}
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleVerifyEmail}
                            disabled={isVerifying}
                            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-base shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isVerifying ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
                            <span>{isVerifying ? t('verifying') : t('verify_submit')}</span>
                        </button>
                        
                        <button 
                            className="text-xs text-gray-400 font-bold hover:text-gray-600 transition-colors flex items-center justify-center gap-2 w-full py-2"
                            onClick={handleResendCode}
                            disabled={isResending}
                        >
                            {isResending && <Loader2 size={12} className="animate-spin" />}
                            {t('resend_code')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Internal Privacy Policy View - Full Screen Overlay */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-3 sticky top-0 bg-white z-10 pt-safe">
                <button 
                    onClick={() => setShowPrivacyPolicy(false)} 
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className={`text-gray-800 ${language === 'ar' ? '' : 'rotate-180'}`} />
                </button>
                <h2 className="text-lg font-bold text-gray-900">{t('privacy_policy_link')}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-5 pb-safe">
                <h3 className="text-xl font-black text-gray-900 mb-4">{t('privacy_title')}</h3>
                <p className="text-gray-600 text-sm leading-loose whitespace-pre-wrap">
                    {t('privacy_desc')}
                </p>
            </div>
        </div>
      )}

    </div>
  );
};

export default LoginPage;
