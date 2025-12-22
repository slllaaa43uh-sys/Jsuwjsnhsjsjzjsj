
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Tag, MessageCircle, Download, ToggleLeft, ToggleRight, Camera, Eye, Globe, Lock, Repeat, Check, Store, Briefcase } from 'lucide-react';
import { TextOverlay } from './EditVideoView';
import { useLanguage } from '../contexts/LanguageContext';

interface PublishVideoViewProps {
  videoSrc: string;
  onBack: () => void;
  onPublish: (details: {
    title: string;
    description: string;
    category: string;
    allowComments: boolean;
    allowDownload: boolean;
    allowDuet: boolean;
    privacy: 'public' | 'friends' | 'private';
    coverFile: File | null;
  }) => void;
  isSubmitting: boolean;
  overlayTexts: TextOverlay[];
}

const PublishVideoView: React.FC<PublishVideoViewProps> = ({ videoSrc, onBack, onPublish, isSubmitting, overlayTexts }) => {
  const { t, language } = useLanguage();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Category State: Only 'haraj' or 'jobs'
  const [selectedMainCategory, setSelectedMainCategory] = useState<'haraj' | 'jobs'>('haraj');

  const [allowComments, setAllowComments] = useState(true);
  const [allowDownload, setAllowDownload] = useState(true);
  const [allowDuet, setAllowDuet] = useState(true);
  
  // Privacy State: Only 'public' or 'private'
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // --- RADICAL FIX FOR PREVIEW BLACK SCREEN ---
  useEffect(() => {
    const video = videoRef.current;
    if (video && videoSrc && !coverPreview) {
        video.load();
        const ensureFrame = () => {
            video.currentTime = 0.1; 
        };
        if (video.readyState >= 2) {
            ensureFrame();
        } else {
            video.addEventListener('loadeddata', ensureFrame);
        }
        return () => {
            video.removeEventListener('loadeddata', ensureFrame);
        };
    }
  }, [videoSrc, coverPreview]);

  const handlePublishClick = () => {
    if (!title) {
      alert(language === 'ar' ? 'الرجاء كتابة عنوان للفيديو.' : 'Please write a video title.');
      return;
    }
    
    // Pass the translated string as the category key
    const finalCategory = selectedMainCategory === 'haraj' ? t('nav_haraj') : t('nav_jobs');

    onPublish({ 
      title, 
      description, 
      category: finalCategory, 
      allowComments, 
      allowDownload, 
      allowDuet, 
      privacy, 
      coverFile 
    });
  };
  
  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-white text-gray-800 flex flex-col animate-in slide-in-from-left duration-300">
      
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between sticky top-0 bg-white z-10 border-b border-gray-100 pt-safe">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
          <ArrowLeft className={language === 'en' ? 'rotate-180' : ''} size={22} />
        </button>
        <h2 className="text-lg font-bold">{t('publish_video')}</h2>
        <button 
            onClick={handlePublishClick}
            disabled={!title || isSubmitting}
            className={`text-sm font-bold px-4 py-1.5 rounded-full transition-colors ${
                title && !isSubmitting 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                : 'bg-gray-100 text-gray-400'
            }`}
        >
            {isSubmitting ? t('publishing') : t('post_publish')}
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        
        {/* Top Section: Video Preview & Text Inputs */}
        <div className="p-5 flex flex-row gap-4 border-b border-gray-100 bg-white">
          {/* Video Preview Section */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-24 h-36 rounded-lg overflow-hidden bg-gray-900 border border-gray-200 shadow-sm relative group">
              {coverPreview ? (
                <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
              ) : (
                <div className="relative w-full h-full">
                    <video 
                        key={videoSrc}
                        ref={videoRef} 
                        src={videoSrc} 
                        muted 
                        playsInline 
                        preload="auto"
                        className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {overlayTexts.map(text => (
                            <div
                                key={text.id}
                                className="absolute whitespace-nowrap font-bold"
                                style={{
                                    left: `${(text.x / window.innerWidth) * 100}%`,
                                    top: `${(text.y / window.innerHeight) * 100}%`,
                                    transform: `translate(-50%, -50%) scale(${text.scale * 0.3})`,
                                    color: text.color,
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                                    fontSize: '2rem'
                                }}
                            >
                                {text.content}
                            </div>
                        ))}
                    </div>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={coverInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleCoverChange}
            />
            <button 
              onClick={() => coverInputRef.current?.click()}
              className="flex items-center gap-1 text-[10px] text-blue-600 font-bold mt-2 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors whitespace-nowrap"
            >
               <Camera size={12} />
               <span>{t('select_cover')}</span>
            </button>
          </div>

          {/* Text Inputs Section */}
          <div className="flex-1 flex flex-col">
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('video_title_placeholder')}
              className="w-full bg-white p-2 text-sm font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none resize-none transition mb-2 dir-auto"
              rows={2}
            />
            <div className="w-full h-px bg-gray-100 mb-2"></div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('video_desc_placeholder')}
              className="w-full flex-1 bg-white p-2 text-xs font-medium text-gray-600 placeholder:text-gray-400 focus:outline-none resize-none transition dir-auto"
              rows={4}
            />
          </div>
        </div>

        <div className="p-4 space-y-6">
          
          {/* 1. Category Selection (Direct & Vertical) */}
          <div>
             <div className="flex items-center gap-2 mb-3">
                <Tag size={18} className="text-gray-500" />
                <span className="text-sm font-bold text-gray-800">{t('post_category')}</span>
             </div>
             
             <div className="flex flex-col gap-2">
                {/* Haraj Button */}
                <button
                    onClick={() => setSelectedMainCategory('haraj')}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        selectedMainCategory === 'haraj'
                        ? 'bg-orange-50 border-orange-200 text-orange-700'
                        : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${selectedMainCategory === 'haraj' ? 'bg-orange-200' : 'bg-gray-100'}`}>
                            <Store size={18} />
                        </div>
                        <span className="text-sm font-bold">{t('nav_haraj')}</span>
                    </div>
                    {selectedMainCategory === 'haraj' && <Check size={18} className="text-orange-600" />}
                </button>

                {/* Jobs Button */}
                <button
                    onClick={() => setSelectedMainCategory('jobs')}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        selectedMainCategory === 'jobs'
                        ? 'bg-purple-50 border-purple-200 text-purple-700'
                        : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${selectedMainCategory === 'jobs' ? 'bg-purple-200' : 'bg-gray-100'}`}>
                            <Briefcase size={18} />
                        </div>
                        <span className="text-sm font-bold">{t('nav_jobs')}</span>
                    </div>
                    {selectedMainCategory === 'jobs' && <Check size={18} className="text-purple-600" />}
                </button>
             </div>
          </div>

          <div className="h-px bg-gray-100 w-full"></div>

          {/* 2. Privacy Selection (Direct & Vertical) */}
          <div>
             <div className="flex items-center gap-2 mb-3">
                <Eye size={18} className="text-gray-500" />
                <span className="text-sm font-bold text-gray-800">{t('who_can_watch')}</span>
             </div>

             <div className="flex flex-col gap-2">
                {/* Public */}
                <button
                    onClick={() => setPrivacy('public')}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        privacy === 'public'
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <Globe size={18} />
                        <div className="text-start">
                            <span className="text-sm font-bold block">{t('privacy_public')}</span>
                        </div>
                    </div>
                    {privacy === 'public' && <Check size={18} className="text-blue-600" />}
                </button>

                {/* Private (Only Me) */}
                <button
                    onClick={() => setPrivacy('private')}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        privacy === 'private'
                        ? 'bg-gray-100 border-gray-300 text-gray-800'
                        : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <Lock size={18} />
                        <div className="text-start">
                            <span className="text-sm font-bold block">{t('privacy_private')}</span>
                        </div>
                    </div>
                    {privacy === 'private' && <Check size={18} className="text-gray-800" />}
                </button>
             </div>
          </div>

          <div className="h-px bg-gray-100 w-full"></div>

          {/* 3. Settings Toggles (Enabled) */}
          <div className="space-y-1">
              {/* Comments */}
              <div className="flex justify-between items-center p-3 pl-1 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                      <MessageCircle size={20} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">{t('allow_comments')}</span>
                  </div>
                  <button onClick={() => setAllowComments(!allowComments)} className="transition-transform active:scale-90">
                      {allowComments ? <ToggleRight size={36} className="text-green-600" /> : <ToggleLeft size={36} className="text-gray-300" />}
                  </button>
              </div>

              {/* Downloads */}
              <div className="flex justify-between items-center p-3 pl-1 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                      <Download size={20} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">{t('allow_downloads')}</span>
                  </div>
                  <button onClick={() => setAllowDownload(!allowDownload)} className="transition-transform active:scale-90">
                      {allowDownload ? <ToggleRight size={36} className="text-green-600" /> : <ToggleLeft size={36} className="text-gray-300" />}
                  </button>
              </div>

              {/* Repost (Duet) */}
              <div className="flex justify-between items-center p-3 pl-1 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                      <Repeat size={20} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">{t('allow_duet')}</span>
                  </div>
                  <button onClick={() => setAllowDuet(!allowDuet)} className="transition-transform active:scale-90">
                      {allowDuet ? <ToggleRight size={36} className="text-green-600" /> : <ToggleLeft size={36} className="text-gray-300" />}
                  </button>
              </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default PublishVideoView;
