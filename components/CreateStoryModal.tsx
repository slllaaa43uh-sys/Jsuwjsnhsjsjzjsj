import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Palette, Check, ALargeSmall, Image as ImageIcon, Loader2, 
  ArrowLeft, Send, Play, Volume2, VolumeX,
  Crop, Smile, Type, Edit3, PlusCircle, AlertCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CreateStoryModalProps {
  onClose: () => void;
  onPost: (storyPayload: any) => void; 
}

const GRADIENTS = [
  'bg-gradient-to-br from-purple-600 to-blue-500',
  'bg-gradient-to-tr from-yellow-400 via-orange-500 to-red-500',
  'bg-gradient-to-bl from-cyan-400 to-blue-600',
  'bg-gradient-to-br from-pink-500 to-rose-500',
  'bg-gradient-to-t from-emerald-400 to-cyan-500',
  'bg-gradient-to-r from-violet-600 to-indigo-600',
  'bg-gradient-to-br from-slate-900 to-slate-700',
];

const FONT_SIZES = ['text-2xl', 'text-3xl', 'text-4xl', 'text-5xl'];

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ onClose, onPost }) => {
  const { t, language } = useLanguage();
  const [mode, setMode] = useState<'text' | 'media'>('text');
  
  // Text Mode State
  const [text, setText] = useState('');
  const [bgIndex, setBgIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(2);
  
  // Media Mode State
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  
  // Video Editor State
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [thumbnails, setThumbnails] = useState<string[]>([]); 
  const [isVideoError, setIsVideoError] = useState(false);
  
  // Trimming State
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0); 
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Dragging State
  const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Cleanup object URLs
  useEffect(() => {
      return () => {
          if (mediaPreview && !mediaPreview.startsWith('http')) {
              URL.revokeObjectURL(mediaPreview);
          }
      };
  }, []);

  const handleNextBackground = () => setBgIndex((prev) => (prev + 1) % GRADIENTS.length);
  const handleNextSize = () => setSizeIndex((prev) => (prev + 1) % FONT_SIZES.length);

  // --- BACKGROUND THUMBNAIL GENERATOR ---
  // Runs ONLY after main video is loaded and duration is known
  useEffect(() => {
    if (mode === 'media' && mediaFile?.type.startsWith('video') && duration > 0 && thumbnails.length === 0) {
        
        const generate = async () => {
            try {
                const video = document.createElement('video');
                video.src = URL.createObjectURL(mediaFile);
                video.muted = true;
                video.playsInline = true;
                video.crossOrigin = "anonymous";
                
                await new Promise<void>((resolve) => {
                    video.onloadedmetadata = () => resolve();
                    video.onerror = () => resolve(); // Don't crash, just resolve
                });

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const w = 80;
                const h = 80;
                canvas.width = w;
                canvas.height = h;

                const thumbs: string[] = [];
                const steps = 5;

                for (let i = 0; i < steps; i++) {
                    const time = Math.min((duration / steps) * i, duration - 0.1);
                    video.currentTime = time;
                    await new Promise<void>(r => {
                        const handler = () => {
                            if (ctx) {
                                ctx.drawImage(video, 0, 0, w, h);
                                try { thumbs.push(canvas.toDataURL('image/jpeg', 0.3)); } catch(e){}
                            }
                            r();
                        };
                        video.addEventListener('seeked', handler, { once: true });
                    });
                }
                setThumbnails(thumbs);
                URL.revokeObjectURL(video.src);
            } catch (e) {
                // Silent fail is okay for thumbnails
            }
        };
        generate();
    }
  }, [mode, mediaFile, duration]); // Run when duration is set by main player

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      
      // 1. IMMEDIATE SWITCH - NO PROCESSING
      setMediaFile(file);
      setMediaPreview(url);
      
      // Reset Video State
      setIsVideoReady(false);
      setIsVideoError(false);
      setDuration(0);
      setTrimStart(0);
      setTrimEnd(0);
      setThumbnails([]);
      setIsPlaying(true); // Auto-play by default

      setMode('media');
    }
  };

  const handlePublishClick = () => {
    if (mode === 'text' && !text.trim()) return;
    if (mode === 'media' && !mediaFile) return;

    const payload: any = { type: mode };

    if (mode === 'text') {
        payload.text = text;
        payload.backgroundColor = GRADIENTS[bgIndex];
    } else {
        payload.file = mediaFile;
        payload.text = caption;
        
        if (duration > 0 && trimEnd > 0) {
            payload.trimData = { start: trimStart, end: trimEnd };
        }
    }

    onPost(payload);
    onClose(); 
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === Infinity) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatSize = (seconds: number) => {
    if (!mediaFile || duration === 0) return "0 MB";
    const estimatedBytes = (mediaFile.size / duration) * seconds;
    const mb = estimatedBytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const togglePlay = () => {
      if (videoRef.current) {
          if (isPlaying) {
              videoRef.current.pause();
              setIsPlaying(false);
          } else {
              if (videoRef.current.currentTime >= trimEnd) {
                  videoRef.current.currentTime = trimStart;
              }
              videoRef.current.play();
              setIsPlaying(true);
          }
      }
  };

  const handleTimeUpdate = () => {
      if (videoRef.current && !isDragging) {
          const curr = videoRef.current.currentTime;
          if (duration > 0 && curr >= trimEnd) {
              videoRef.current.currentTime = trimStart;
              if (isPlaying) videoRef.current.play();
          }
      }
  };

  // This is the SINGLE source of truth for video metadata now
  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      const vid = e.currentTarget;
      const d = vid.duration;
      if (d && d !== Infinity && !isNaN(d)) {
          setDuration(d);
          setTrimEnd(d);
          setTrimStart(0);
          setIsVideoReady(true);
      }
  };

  const handleVideoError = () => {
      setIsVideoError(true);
  };

  // --- TOUCH / DRAG LOGIC ---
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent, type: 'start' | 'end') => {
      e.stopPropagation();
      setIsDragging(type);
      if (videoRef.current) videoRef.current.pause();
      setIsPlaying(false);
  };

  const handleTouchMove = (e: any) => {
      if (!isDragging || !timelineRef.current || duration === 0) return;
      
      const rect = timelineRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const offsetX = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = offsetX / rect.width;
      const newTime = percentage * duration;

      if (isDragging === 'start') {
          const maxStart = trimEnd - 1; 
          const validStart = Math.min(newTime, maxStart);
          setTrimStart(validStart);
          if (videoRef.current) videoRef.current.currentTime = validStart;
      } else if (isDragging === 'end') {
          const minEnd = trimStart + 1;
          const validEnd = Math.max(newTime, minEnd);
          setTrimEnd(validEnd);
          if (videoRef.current) videoRef.current.currentTime = validEnd;
      }
  };

  const handleTouchEnd = () => {
      if (isDragging) {
          setIsDragging(null);
      }
  };

  useEffect(() => {
      if (isDragging) {
          window.addEventListener('mousemove', handleTouchMove);
          window.addEventListener('mouseup', handleTouchEnd);
          window.addEventListener('touchmove', handleTouchMove);
          window.addEventListener('touchend', handleTouchEnd);
      }
      return () => {
          window.removeEventListener('mousemove', handleTouchMove);
          window.removeEventListener('mouseup', handleTouchEnd);
          window.removeEventListener('touchmove', handleTouchMove);
          window.removeEventListener('touchend', handleTouchEnd);
      };
  }, [isDragging, trimStart, trimEnd, duration]);


  // --- VIDEO EDITOR VIEW ---
  if (mode === 'media' && mediaFile?.type.startsWith('video')) {
      const startPercent = duration > 0 ? (trimStart / duration) * 100 : 0;
      const endPercent = duration > 0 ? (trimEnd / duration) * 100 : 100;
      const widthPercent = endPercent - startPercent;
      const currentDuration = trimEnd > 0 ? (trimEnd - trimStart) : 0;

      return (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-in fade-in duration-300">
            
            {/* 1. Header & Tools */}
            <div className="absolute top-0 left-0 right-0 z-50 p-4 pt-safe flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent pb-16">
                <button 
                    onClick={() => { setMode('text'); setMediaFile(null); setMediaPreview(null); }} 
                    className="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
                >
                    <X size={28} strokeWidth={2.5} />
                </button>

                <div className="flex gap-6 items-center">
                    <button onClick={() => alert(t('feature_coming_soon'))} className="p-1 text-white hover:text-gray-300 transition-colors"><Crop size={24} strokeWidth={2.5} /></button>
                    <button onClick={() => alert(t('feature_coming_soon'))} className="p-1 text-white hover:text-gray-300 transition-colors"><Smile size={24} strokeWidth={2.5} /></button>
                    <button onClick={() => alert(t('feature_coming_soon'))} className="p-1 text-white hover:text-gray-300 transition-colors"><Type size={24} strokeWidth={2.5} /></button>
                    <button onClick={() => alert(t('feature_coming_soon'))} className="p-1 text-white hover:text-gray-300 transition-colors"><Edit3 size={24} strokeWidth={2.5} /></button>
                </div>
            </div>

            {/* 2. Trimmer Section (Overlay on Top) - Only show if metadata loaded */}
            {duration > 0 && !isVideoError && (
                <div className="absolute top-20 left-0 right-0 z-50 px-6 flex flex-col items-center gap-2">
                    
                    {/* Filmstrip */}
                    <div className="relative w-full h-12 select-none rounded-md overflow-hidden bg-gray-800/50" ref={timelineRef}>
                        
                        {/* Thumbnails Layer */}
                        <div className="absolute inset-0 flex">
                            {thumbnails.length > 0 ? (
                                thumbnails.map((src, i) => (
                                    <img key={i} src={src} alt="" className="flex-1 h-full object-cover min-w-0" />
                                ))
                            ) : (
                                <div className="w-full h-full bg-white/10 animate-pulse"></div>
                            )}
                        </div>

                        {/* Dimmed Areas */}
                        <div className="absolute top-0 bottom-0 left-0 bg-black/60 z-20 pointer-events-none" style={{ width: `${startPercent}%` }} />
                        <div className="absolute top-0 bottom-0 right-0 bg-black/60 z-20 pointer-events-none" style={{ width: `${100 - endPercent}%` }} />

                        {/* Selection Frame */}
                        <div className="absolute top-0 bottom-0 border-y-2 border-white z-30 pointer-events-none" style={{ left: `${startPercent}%`, width: `${widthPercent}%` }} />

                        {/* Handles */}
                        <div 
                            className="absolute top-0 bottom-0 w-4 bg-white rounded-l-md z-40 cursor-ew-resize flex items-center justify-center shadow-md touch-none"
                            style={{ left: `calc(${startPercent}% - 0px)` }} 
                            onMouseDown={(e) => handleTouchStart(e, 'start')}
                            onTouchStart={(e) => handleTouchStart(e, 'start')}
                        >
                            <div className="w-1 h-1 bg-black/40 rounded-full"></div>
                        </div>

                        <div 
                            className="absolute top-0 bottom-0 w-4 bg-white rounded-r-md z-40 cursor-ew-resize flex items-center justify-center shadow-md touch-none"
                            style={{ left: `calc(${endPercent}% - 16px)` }}
                            onMouseDown={(e) => handleTouchStart(e, 'end')}
                            onTouchStart={(e) => handleTouchStart(e, 'end')}
                        >
                            <div className="w-1 h-1 bg-black/40 rounded-full"></div>
                        </div>
                    </div>

                    <div className="bg-[#1f2937]/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2">
                        <span className="text-white text-[11px] font-medium">
                            {formatTime(currentDuration)} • {formatSize(currentDuration)}
                        </span>
                    </div>
                </div>
            )}

            {/* 3. MAIN VIDEO AREA */}
            <div className="absolute inset-0 z-0 flex items-center justify-center bg-black" onClick={() => !isVideoError && togglePlay()}>
                {isVideoError ? (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                        <AlertCircle size={48} className="text-red-500 mb-2" />
                        <p className="text-sm font-bold">عذراً، تنسيق الفيديو غير مدعوم</p>
                        <button onClick={() => { setMode('text'); setMediaFile(null); }} className="text-white text-xs underline mt-2">حاول بفيديو آخر</button>
                    </div>
                ) : (
                    <>
                        <video 
                            key={mediaPreview} // Force re-render if file changes
                            ref={videoRef}
                            src={mediaPreview!} 
                            className="w-full h-full object-cover"
                            playsInline
                            autoPlay
                            muted={isMuted} // Keep muted initially to guarantee autoplay
                            preload="auto"
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onEnded={() => setIsPlaying(false)}
                            onError={handleVideoError}
                        />
                        
                        {!isPlaying && isVideoReady && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 pointer-events-none">
                                <div className="w-20 h-20 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                                    <Play size={40} className="text-white fill-white ml-2" />
                                </div>
                            </div>
                        )}
                        
                        {!isVideoReady && (
                             <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                                <Loader2 size={40} className="text-white animate-spin" />
                             </div>
                        )}
                    </>
                )}
            </div>

            {/* 4. BOTTOM CONTROLS */}
            {!isVideoError && (
                <>
                    <div className="absolute bottom-16 left-6 z-50">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} 
                            className="p-3 bg-black/40 rounded-full text-white backdrop-blur-md border border-white/10 hover:bg-black/60 transition-colors"
                        >
                            {isMuted ? <VolumeX size={24} className="text-red-400" /> : <Volume2 size={24} />}
                        </button>
                    </div>

                    <div className="absolute bottom-16 right-6 z-50">
                        <button 
                            onClick={handlePublishClick}
                            className="w-14 h-14 bg-[#00a884] rounded-full flex items-center justify-center shadow-lg text-white hover:bg-[#008f6f] transition-all active:scale-95"
                        >
                            <Send size={24} className={language === 'ar' ? 'mr-1' : 'ml-1'} style={{ transform: language === 'ar' ? 'scaleX(-1)' : 'none' }} fill="currentColor" />
                        </button>
                    </div>
                </>
            )}
        </div>
      );
  }

  // --- DEFAULT TEXT/IMAGE VIEW (Unchanged) ---
  return (
    <div className={`fixed inset-0 z-[200] flex flex-col animate-in fade-in duration-300 ${mode === 'text' ? GRADIENTS[bgIndex] : 'bg-black'} transition-colors duration-500`}>
      <div className="absolute top-0 left-0 right-0 p-4 pt-safe flex justify-between items-start z-20">
        <button onClick={onClose} className="p-2 bg-black/20 rounded-full text-white backdrop-blur-sm hover:bg-black/30 transition-colors">
          <X size={28} />
        </button>
        {mode === 'text' && (
           <button onClick={handleNextBackground} className="mt-2 p-2 bg-white/20 rounded-full text-white backdrop-blur-md hover:bg-white/30 transition-colors">
             <Palette size={24} />
           </button>
        )}
        <button 
          onClick={handlePublishClick}
          disabled={(mode === 'text' && !text) || (mode === 'media' && !mediaFile)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all shadow-lg backdrop-blur-sm bg-white text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Check size={20} />
          <span>{t('post_publish')}</span>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
         {mode === 'text' ? (
             <textarea
               value={text}
               onChange={(e) => setText(e.target.value)}
               placeholder={t('story_text_placeholder')}
               className={`w-full max-w-lg bg-transparent border-none outline-none text-center font-bold placeholder:text-white/50 resize-none overflow-hidden leading-relaxed text-white ${FONT_SIZES[sizeIndex]} drop-shadow-md`}
               rows={5}
             />
         ) : (
             mediaPreview ? (
                <img src={mediaPreview} alt="preview" className="w-full h-full object-contain" />
             ) : (
                <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-4 text-gray-400 cursor-pointer p-10 border-2 border-dashed border-gray-600 rounded-3xl hover:border-gray-400 hover:text-gray-300 transition-colors">
                    <ImageIcon size={48} />
                    <span>{t('story_media_placeholder')}</span>
                </div>
             )
         )}
      </div>

      <div className="absolute bottom-10 left-0 right-0 pb-safe flex flex-col items-center gap-6 z-20">
         {mode === 'text' && (
            <div className="flex gap-6">
                <button onClick={handleNextSize} className="flex flex-col items-center gap-1">
                   <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center backdrop-blur-md"><ALargeSmall size={20} className="text-white" /></div>
                   <span className="text-white text-[10px] shadow-sm">{t('story_font_size')}</span>
                </button>
            </div>
         )}
         <div className="bg-black/40 backdrop-blur-md rounded-full p-1 flex">
             <button 
               onClick={() => setMode('text')}
               className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${mode === 'text' ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}
             >
               {t('story_type_text')}
             </button>
             <button 
               onClick={() => fileInputRef.current?.click()}
               className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${mode === 'media' ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}
             >
               {t('story_type_media')}
             </button>
         </div>
         <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
      </div>
    </div>
  );
};

export default CreateStoryModal;