
import React from 'react';
import { Briefcase, Hexagon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const SplashScreen: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-black flex flex-col items-center justify-between pb-10 pt-safe">
      
      {/* الجزء العلوي - فارغ للموازنة */}
      <div className="flex-1"></div>

      {/* المنتصف - شعار التطبيق واسمه - ثابت بدون حركة */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 dark:shadow-none mb-4 relative overflow-hidden">
           {/* لمعة خفيفة على الشعار */}
           <div className="absolute top-0 left-0 w-full h-full bg-white/10 rotate-45 transform scale-150 origin-top-left"></div>
           <Briefcase size={48} className="text-white drop-shadow-md" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t('app_name')}</h1>
      </div>

      {/* الأسفل - شعار الشركة والمطور - ثابت بدون حركة */}
      <div className="flex-1 flex flex-col justify-end items-center w-full">
        <div className="flex flex-col items-center gap-3">
          <span className="text-gray-400 text-[10px] tracking-widest font-medium uppercase">From</span>
          
          <div className="flex items-center gap-2.5">
            {/* شعار الشركة الصغير */}
            <div className="relative w-8 h-8 flex items-center justify-center">
                <Hexagon size={32} className="text-gray-300 dark:text-gray-700 absolute" strokeWidth={1} />
                <div className="w-4 h-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-sm rotate-45 shadow-sm"></div>
            </div>
            
            {/* اسم المطور */}
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200 font-sans tracking-wide">
              مهدلي
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SplashScreen;
