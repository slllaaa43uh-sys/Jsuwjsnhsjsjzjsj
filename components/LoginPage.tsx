
import React, { useState } from 'react';
import { API_BASE_URL } from '../constants';
import { Lock, Mail, ArrowLeft, X, User, Building2, ChevronRight, Check, ArrowRight, Briefcase } from 'lucide-react';
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
  
  const PRIVACY_POLICY_URL = "https://groovy-face-1cc.notion.site/eff89ba790bf40e5840c23afa01217d1";

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
        }, 1000);
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
            // Auto Login Logic
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
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-hidden bg-gray-50">
      
      {/* --- Animated Background --- */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes gradient-xy {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .bg-animated-mesh {
            background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
            background-size: 400% 400%;
            animation: gradient-xy 15s ease infinite;
            opacity: 0.1;
        }
      `}</style>
      
      {/* Background Layers */}
      <div className="absolute inset-0 bg-white z-0"></div>
      <div className="absolute inset-0 bg-animated-mesh z-0"></div>
      
      {/* Moving blobs for dynamic feel */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Language Toggle Button */}
      <div className={`absolute top-6 z-20 ${language === 'ar' ? 'left-6' : 'right-6'}`}>
        <button 
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-2 bg-white/80 hover:bg-white text-gray-700 font-bold py-2 px-4 rounded-full transition-all shadow-sm border border-gray-100 backdrop-blur-sm"
        >
            {language === 'ar' ? (
                <>
                    <span className="text-sm">English</span>
                    <ArrowLeft size={16} />
                </>
            ) : (
                <>
                    <span className="text-sm">العربية</span>
                    <ArrowRight size={16} />
                </>
            )}
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center z-10 bg-white/50 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-white">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-[4px] border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-[4px] border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            </div>
            <p className="mt-6 text-gray-800 font-bold text-sm">{t('logging_in')}</p>
        </div>
      ) : (
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700 z-10">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
             <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 mb-4 transform hover:scale-105 transition-transform duration-300">
                <Briefcase size={36} className="text-white" strokeWidth={2} />
             </div>
             <h1 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">{t('login_title')}</h1>
             <p className="text-gray-500 text-sm font-medium">{t('login_subtitle')}</p>
          </div>

          {/* Form Container */}
          <div className="bg-white/70 backdrop-blur-lg border border-white rounded-[2rem] p-6 shadow-xl shadow-blue-900/5">
              <form onSubmit={handleLogin} className="space-y-5">
                
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
                            className={`block w-full py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-sm ${language === 'ar' ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'}`}
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
                            className={`block w-full py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-sm ${language === 'ar' ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'}`}
                            placeholder="••••••••"
                            dir="ltr"
                        />
                    </div>
                </div>

                {error && (
                  <div className="py-3 px-4 rounded-xl bg-red-50 text-red-600 text-xs font-bold text-center border border-red-100 flex items-center justify-center gap-2">
                    <X size={14} />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl font-bold text-base hover:shadow-lg hover:shadow-gray-300 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 mt-4"
                >
                  <span>{t('login_button')}</span>
                  {language === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                </button>
              </form>

              <div className="mt-6 flex flex-col items-center gap-3 border-t border-gray-100 pt-6">
                 <button 
                   onClick={() => setIsRegisterOpen(true)}
                   className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100"
                 >
                   {t('create_new_account')}
                 </button>
                 
                 <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors font-medium">{t('forgot_password')}</a>
              </div>
          </div>
        </div>
      )}

      {/* Registration Bottom Sheet */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                onClick={() => { setIsRegisterOpen(false); setRegisterError(null); }}
            />
            
            {/* Sheet */}
            <div className="bg-white w-full max-w-md rounded-t-[2rem] p-6 relative z-10 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
                
                <div className="flex items-center justify-between mb-8 sticky top-0 bg-white z-20 pb-2">
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
                            className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group bg-white shadow-sm"
                        >
                            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shadow-inner">
                                <User size={28} />
                            </div>
                            <div className={`flex-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                <h3 className="font-bold text-gray-900 text-lg">{t('register_individual_title')}</h3>
                                <p className="text-xs text-gray-500 mt-1 font-medium">{t('register_individual_desc')}</p>
                            </div>
                            <ChevronRight className={`text-gray-300 ${language === 'ar' ? 'rotate-180' : ''}`} />
                        </button>

                        <button 
                            onClick={() => handleRegisterTypeSelect('company')}
                            className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 hover:border-purple-500 hover:bg-purple-50 transition-all group bg-white shadow-sm"
                        >
                            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform shadow-inner">
                                <Building2 size={28} />
                            </div>
                            <div className={`flex-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                <h3 className="font-bold text-gray-900 text-lg">{t('register_commercial_title')}</h3>
                                <p className="text-xs text-gray-500 mt-1 font-medium">{t('register_commercial_desc')}</p>
                            </div>
                            <ChevronRight className={`text-gray-300 ${language === 'ar' ? 'rotate-180' : ''}`} />
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
                                className={`w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-bold text-sm ${language === 'ar' ? 'text-right' : 'text-left'}`}
                                placeholder={getPlaceholderName()}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5 px-1">{t('email_label')}</label>
                            <input 
                                type="email"
                                value={regEmail}
                                onChange={(e) => setRegEmail(e.target.value)}
                                className={`w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-bold text-sm dir-ltr ${language === 'ar' ? 'text-right' : 'text-left'}`}
                                placeholder="example@mail.com"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5 px-1">{t('password_label')}</label>
                            <input 
                                type="password"
                                value={regPass}
                                onChange={(e) => setRegPass(e.target.value)}
                                className={`w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-bold text-sm ${language === 'ar' ? 'text-right' : 'text-left'}`}
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5 px-1">{t('confirm_password')}</label>
                            <input 
                                type="password"
                                value={regConfirmPass}
                                onChange={(e) => setRegConfirmPass(e.target.value)}
                                className={`w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-bold text-sm ${language === 'ar' ? 'text-right' : 'text-left'}`}
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex items-center gap-2 mt-4 px-1">
                            <div 
                                onClick={() => {
                                    setAgreedToPolicy(!agreedToPolicy);
                                    if (!agreedToPolicy) setRegisterError(null);
                                }}
                                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-colors ${agreedToPolicy ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}
                            >
                                {agreedToPolicy && <Check size={16} className="text-white" strokeWidth={3} />}
                            </div>
                            <span className="text-xs font-bold text-gray-600">
                                {t('i_agree_to')} 
                                <button 
                                    type="button"
                                    onClick={() => window.open(PRIVACY_POLICY_URL, '_blank')}
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
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-base hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                {isRegistering ? t('registering') : t('register_button')}
                            </button>
                            
                            <button 
                                onClick={() => { setRegisterStep('type'); setRegisterError(null); }}
                                className="w-full py-3 text-gray-500 text-sm font-bold hover:text-gray-800 mt-2"
                            >
                                {t('back')}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
      )}

    </div>
  );
};

export default LoginPage;
