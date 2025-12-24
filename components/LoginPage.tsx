
import React, { useState } from 'react';
import { API_BASE_URL } from '../constants';
import { Lock, Mail, ArrowLeft, X, User, Building2, ChevronRight, Check, ArrowRight, Briefcase, Globe } from 'lucide-react';
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
  
  // Registration specific error
  const [registerError, setRegisterError] = useState<string | null>(null);
  
  // Privacy Policy View State
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

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

      if (response.ok && data.token) {
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
                userType: registerType // 'individual' or 'company'
            })
        });

        const data = await response.json();

        if (response.ok && data.token) {
            localStorage.setItem('token', data.token);
            const userObj = data.user || {};
            const userId = userObj._id || userObj.id;
            if (userId) {
                localStorage.setItem('userId', userId);
                localStorage.setItem('userName', userObj.name || regName);
                localStorage.setItem('userEmail', userObj.email || regEmail);
            }
            onLoginSuccess(data.token);
        } else {
            setRegisterError(data.message || "Registration failed");
        }
    } catch (e) {
        setRegisterError("Connection error");
    } finally {
        setIsRegistering(false);
    }
  };

  const getPlaceholderName = () => {
      switch(registerType) {
          case 'company': return t('register_company_name_placeholder');
          default: return t('register_name_placeholder');
      }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-hidden bg-[#0f172a]">
      
      {/* --- Advanced Animated Background --- */}
      <style>{`
        @keyframes gradient-flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .bg-vivid-mesh {
            background: linear-gradient(-45deg, #3b82f6, #8b5cf6, #ec4899, #06b6d4);
            background-size: 300% 300%;
            animation: gradient-flow 10s ease infinite;
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.5);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.3);
        }
        .bg-lines {
            background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
            background-size: 30px 30px;
        }
      `}</style>
      
      {/* 1. Base Dark Layer */}
      <div className="absolute inset-0 bg-[#0f172a] z-0"></div>
      
      {/* 2. Vivid Moving Gradient Layer */}
      <div className="absolute inset-0 bg-vivid-mesh opacity-40 z-0"></div>
      
      {/* 3. Grid Lines Layer (Creates the "colors inside lines" effect) */}
      <div className="absolute inset-0 bg-lines z-0 pointer-events-none"></div>

      {/* 4. Glowing Orbs for Depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/30 blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/30 blur-[100px] animate-pulse delay-700"></div>

      {/* Language Toggle */}
      <div className={`absolute top-safe top-6 z-20 ${language === 'ar' ? 'left-6' : 'right-6'}`}>
        <button 
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-full transition-all border border-white/20 backdrop-blur-md"
        >
            <Globe size={16} className="text-white" />
            <span className="text-sm text-white">{language === 'ar' ? 'English' : 'العربية'}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center z-10 glass-card p-10 rounded-[2.5rem] animate-in fade-in zoom-in duration-300">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-[4px] border-blue-100"></div>
              <div className="absolute inset-0 rounded-full border-[4px] border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            </div>
            <p className="mt-6 text-gray-800 font-bold text-sm tracking-wide">{t('logging_in')}</p>
        </div>
      ) : (
        <div className="w-full max-w-sm z-10 animate-in slide-in-from-bottom-8 fade-in duration-700">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
             <div className="w-24 h-24 bg-gradient-to-tr from-white to-blue-50 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-900/50 mb-6 transform hover:scale-105 transition-transform duration-300 border-4 border-white/10 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Briefcase size={40} className="text-blue-600 drop-shadow-sm" strokeWidth={2.5} />
             </div>
             <h1 className="text-4xl font-black text-white mb-2 tracking-tight drop-shadow-md">{t('login_title')}</h1>
             <p className="text-blue-100 text-sm font-medium opacity-90">{t('login_subtitle')}</p>
          </div>

          {/* Card Container */}
          <div className="glass-card rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
              {/* Subtle top highlight */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50"></div>

              <form onSubmit={handleLogin} className="space-y-5 relative z-10">
                
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 px-1">{t('email_label')}</label>
                    <div className="relative group">
                        <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none`}>
                            <Mail size={20} className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`block w-full py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-bold text-sm ${language === 'ar' ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'}`}
                            placeholder={t('email_placeholder')}
                            dir="ltr"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 px-1">{t('password_label')}</label>
                    <div className="relative group">
                        <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none`}>
                            <Lock size={20} className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`block w-full py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-bold text-sm ${language === 'ar' ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'}`}
                            placeholder="••••••••"
                            dir="ltr"
                        />
                    </div>
                </div>

                {error && (
                  <div className="py-3 px-4 rounded-xl bg-red-50 text-red-600 text-xs font-bold text-center border border-red-100 flex items-center justify-center gap-2 animate-in slide-in-from-top-2">
                    <X size={14} />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-base shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 mt-2 relative overflow-hidden group"
                >
                  <span className="relative z-10">{t('login_button')}</span>
                  {language === 'ar' ? <ArrowLeft size={18} className="relative z-10" /> : <ArrowRight size={18} className="relative z-10" />}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </button>
              </form>

              <div className="mt-8 flex flex-col items-center gap-4 relative z-10">
                 <div className="flex items-center w-full gap-4">
                    <div className="h-px bg-gray-200 flex-1"></div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">OR</span>
                    <div className="h-px bg-gray-200 flex-1"></div>
                 </div>

                 <button 
                   onClick={() => setIsRegisterOpen(true)}
                   className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors bg-gray-50 hover:bg-blue-50 px-6 py-2.5 rounded-full border border-gray-200 hover:border-blue-200"
                 >
                   {t('create_new_account')}
                 </button>
                 
                 <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors font-medium hover:underline">{t('forgot_password')}</a>
              </div>
          </div>
        </div>
      )}

      {/* Registration Bottom Sheet - Matches new aesthetic */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            <div 
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity"
                onClick={() => { setIsRegisterOpen(false); setRegisterError(null); }}
            />
            
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] p-6 relative z-10 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
                
                <div className="flex items-center justify-between mb-8 sticky top-0 bg-white z-20 pb-2 border-b border-gray-50">
                    <h2 className="text-2xl font-black text-gray-900">
                        {registerStep === 'type' ? t('register_title') : t('register_subtitle')}
                    </h2>
                    <button onClick={() => { setIsRegisterOpen(false); setRegisterError(null); }} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                {registerStep === 'type' ? (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500 font-bold mb-4">{t('register_choose_type')}</p>
                        
                        <button 
                            onClick={() => handleRegisterTypeSelect('individual')}
                            className="w-full flex items-center gap-4 p-5 rounded-[1.5rem] border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition-all group shadow-sm"
                        >
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shadow-sm">
                                <User size={28} />
                            </div>
                            <div className={`flex-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                <h3 className="font-bold text-gray-900 text-lg">{t('register_individual_title')}</h3>
                                <p className="text-xs text-gray-500 mt-1 font-medium">{t('register_individual_desc')}</p>
                            </div>
                            <ChevronRight className={`text-gray-300 group-hover:text-blue-500 ${language === 'ar' ? 'rotate-180' : ''}`} />
                        </button>

                        <button 
                            onClick={() => handleRegisterTypeSelect('company')}
                            className="w-full flex items-center gap-4 p-5 rounded-[1.5rem] border border-gray-100 bg-gray-50 hover:bg-purple-50 hover:border-purple-200 transition-all group shadow-sm"
                        >
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform shadow-sm">
                                <Building2 size={28} />
                            </div>
                            <div className={`flex-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                <h3 className="font-bold text-gray-900 text-lg">{t('register_commercial_title')}</h3>
                                <p className="text-xs text-gray-500 mt-1 font-medium">{t('register_commercial_desc')}</p>
                            </div>
                            <ChevronRight className={`text-gray-300 group-hover:text-purple-500 ${language === 'ar' ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                ) : (
                    <div className={`space-y-5 animate-in ${language === 'ar' ? 'slide-in-from-right' : 'slide-in-from-left'} duration-300`}>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5 px-1">{getPlaceholderName()}</label>
                            <input 
                                type="text"
                                value={regName}
                                onChange={(e) => setRegName(e.target.value)}
                                className={`w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-bold text-sm ${language === 'ar' ? 'text-right' : 'text-left'}`}
                                placeholder={getPlaceholderName()}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5 px-1">{t('email_label')}</label>
                            <input 
                                type="email"
                                value={regEmail}
                                onChange={(e) => setRegEmail(e.target.value)}
                                className={`w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-bold text-sm dir-ltr ${language === 'ar' ? 'text-right' : 'text-left'}`}
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
                                    className={`w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-bold text-sm ${language === 'ar' ? 'text-right' : 'text-left'}`}
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 px-1">{t('confirm_password')}</label>
                                <input 
                                    type="password"
                                    value={regConfirmPass}
                                    onChange={(e) => setRegConfirmPass(e.target.value)}
                                    className={`w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-bold text-sm ${language === 'ar' ? 'text-right' : 'text-left'}`}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4 px-1 bg-blue-50 p-3 rounded-xl border border-blue-100">
                            <div 
                                onClick={() => {
                                    setAgreedToPolicy(!agreedToPolicy);
                                    if (!agreedToPolicy) setRegisterError(null);
                                }}
                                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 ${agreedToPolicy ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}
                            >
                                {agreedToPolicy && <Check size={16} className="text-white" strokeWidth={3} />}
                            </div>
                            <span className="text-xs font-bold text-gray-600">
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

                        <div className="pt-2">
                            <button 
                                onClick={handleRegisterSubmit}
                                disabled={isRegistering}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-base hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                {isRegistering ? t('registering') : t('register_button')}
                            </button>
                            
                            <button 
                                onClick={() => { setRegisterStep('type'); setRegisterError(null); }}
                                className="w-full py-3 text-gray-500 text-sm font-bold hover:text-gray-800 mt-2 hover:bg-gray-50 rounded-xl transition-colors"
                            >
                                {t('back')}
                            </button>
                        </div>
                    </div>
                )}

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
