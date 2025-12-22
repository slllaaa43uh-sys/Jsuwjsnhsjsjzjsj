
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Type, Palette, Check, ALargeSmall, Image as ImageIcon, Video, Loader2, Scissors, Play, Pause, ChevronLeft, ChevronRight, GripHorizontal
} from 'lucide-react';
import { API_BASE_URL } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface CreateStoryModalProps {
  onClose: () => void;
  onPost: (storyData: any) => void; 
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
const MAX_VIDEO_DURATION = 30; // seconds

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ onClose, onPost }) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'text' | 'media' | 'trim'>('text');
  
  // Text Mode State
  const [text, setText] = useState('');
  const [bgIndex, setBgIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(2);
  
  // Media Mode State
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  
  // Trim State
  const [videoDuration, setVideoDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [isPlayingTrim, setIsPlayingTrim] = useState(false);
  
  // Dragging State for Custom Trimmer
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<'left' | 'right' | 'bar' | null>(null);
  
  const trimVideoRef = useRef<HTMLVideoElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
      return () => {
          if (mediaPreview && !mediaPreview.startsWith('http')) {
              URL.revokeObjectURL(mediaPreview);
          }
      };
  }, []);

  const handleNextBackground = () => setBgIndex((prev) => (prev + 1) % GRADIENTS.length);
  const handleNextSize = () => setSizeIndex((prev) => (prev + 1) % FONT_SIZES.length);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Revoke previous preview
      if (mediaPreview && !mediaPreview.startsWith('http')) {
          URL.revokeObjectURL(mediaPreview);
      }

      const url = URL.createObjectURL(file);
      
      // Check if video and check duration
      if (file.type.startsWith('video')) {
        setIsProcessingVideo(true); 
        
        const tempVideo = document.createElement('video');
        tempVideo.preload = 'metadata';
        
        tempVideo.onloadedmetadata = () => {
          const duration = tempVideo.duration;
          
          setMediaFile(file);
          setMediaPreview(url);
          setVideoDuration(duration);
          
          // Default trim: First 30s or full video if shorter
          setTrimStart(0);
          setTrimEnd(Math.min(duration, MAX_VIDEO_DURATION));
          
          if (duration > MAX_VIDEO_DURATION) {
             setMode('trim');
          } else {
             setMode('media');
          }
          setIsProcessingVideo(false);
        };

        tempVideo.onerror = () => {
            alert(t('error_occurred') || 'Error loading video');
            setIsProcessingVideo(false);
            URL.revokeObjectURL(url);
        };

        tempVideo.src = url;
      } else {
        // Images
        setMediaFile(file);
        setMediaPreview(url);
        setMode('media');
      }
    }
  };

  const handleTrimDone = () => {
      setMode('media');
  };

  // --- NEW CUSTOM TRIMMER LOGIC ---

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent, type: 'left' | 'right' | 'bar') => {
      setIsDragging(type);
      // Pause video while dragging for better performance
      if (trimVideoRef.current && !trimVideoRef.current.paused) {
          trimVideoRef.current.pause();
          setIsPlayingTrim(false);
      }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
      if (!isDragging || !timelineRef.current || videoDuration === 0) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      
      // Calculate position percentage relative to timeline width
      let percentage = (clientX - rect.left) / rect.width;
      percentage = Math.max(0, Math.min(1, percentage));
      
      const currentTimeAtFinger = percentage * videoDuration;
      const minDuration = 1; // Minimum 1 second

      if (isDragging === 'left') {
          // Move Start Point
          let newStart = currentTimeAtFinger;
          // Constraint: Start cannot pass End (minus min duration)
          if (newStart > trimEnd - minDuration) newStart = trimEnd - minDuration;
          
          // Constraint: Duration cannot exceed MAX
          if (trimEnd - newStart > MAX_VIDEO_DURATION) {
              // Option A: Push Start, keep End (User wants strictly start) - handled by limit
              // Option B: Adjust End (User wants to expand, we can't expand beyond max, so restrict start)
              newStart = trimEnd - MAX_VIDEO_DURATION; 
          }
          
          setTrimStart(Math.max(0, newStart));
          if (trimVideoRef.current) trimVideoRef.current.currentTime = newStart;

      } else if (isDragging === 'right') {
          // Move End Point
          let newEnd = currentTimeAtFinger;
          // Constraint: End cannot go behind Start (plus min duration)
          if (newEnd < trimStart + minDuration) newEnd = trimStart + minDuration;
          
          // Constraint: Duration cannot exceed MAX
          if (newEnd - trimStart > MAX_VIDEO_DURATION) {
              newEnd = trimStart + MAX_VIDEO_DURATION;
          }
          
          setTrimEnd(Math.min(videoDuration, newEnd));
          if (trimVideoRef.current) trimVideoRef.current.currentTime = newEnd;

      } else if (isDragging === 'bar') {
          // Move Whole Bar (Pan)
          const currentDuration = trimEnd - trimStart;
          let newStart = currentTimeAtFinger - (currentDuration / 2); // Center the bar on finger
          
          // Boundaries
          if (newStart < 0) newStart = 0;
          if (newStart + currentDuration > videoDuration) newStart = videoDuration - currentDuration;
          
          setTrimStart(newStart);
          setTrimEnd(newStart + currentDuration);
          if (trimVideoRef.current) trimVideoRef.current.currentTime = newStart;
      }
  };

  const handleTouchEnd = () => {
      setIsDragging(null);
      // Optional: Auto play the loop when released
      if (trimVideoRef.current) {
          trimVideoRef.current.currentTime = trimStart;
          trimVideoRef.current.play().catch(() => {});
          setIsPlayingTrim(true);
      }
  };

  // --- END CUSTOM TRIMMER LOGIC ---

  const handleTrimTimeUpdate = () => {
      if (trimVideoRef.current) {
          // Loop logic based on custom start/end
          if (trimVideoRef.current.currentTime >= trimEnd || trimVideoRef.current.currentTime < trimStart) {
              trimVideoRef.current.currentTime = trimStart;
              // If it stalled, force play
              if (trimVideoRef.current.paused && isPlayingTrim) {
                  trimVideoRef.current.play().catch(() => {});
              }
          }
      }
  };

  const handlePreviewTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const vid = e.currentTarget;
      // Use the final selected trim range for preview loop
      if (videoDuration > MAX_VIDEO_DURATION) {
          if (vid.currentTime < trimStart || vid.currentTime >= trimEnd) {
              vid.currentTime = trimStart;
          }
      }
  };

  // --- ROBUST CLIENT SIDE TRIMMING LOGIC ---
  const performClientSideTrim = async (originalFile: File, start: number, end: number): Promise<File> => {
      return new Promise((resolve, reject) => {
          const video = document.createElement('video');
          const fileUrl = URL.createObjectURL(originalFile);
          
          video.src = fileUrl;
          video.preload = 'auto';
          video.muted = false; 
          video.volume = 0;    
          video.playsInline = true;
          video.crossOrigin = 'anonymous';
          
          // Hide video
          video.style.position = 'fixed';
          video.style.top = '-9999px';
          video.style.left = '-9999px';
          video.style.opacity = '0';
          video.style.pointerEvents = 'none';
          document.body.appendChild(video);

          const chunks: Blob[] = [];
          
          const cleanup = () => {
              if (document.body.contains(video)) {
                  document.body.removeChild(video);
              }
              URL.revokeObjectURL(fileUrl);
          };

          video.onloadedmetadata = () => {
              video.currentTime = start;
          };

          video.onseeked = () => {
              try {
                  // @ts-ignore
                  const stream = (video.captureStream || video.mozCaptureStream).call(video);
                  
                  let mimeType = 'video/webm;codecs=vp8,opus';
                  if (MediaRecorder.isTypeSupported('video/mp4')) {
                      mimeType = 'video/mp4';
                  } else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
                      mimeType = 'video/webm;codecs=h264';
                  }

                  const recorder = new MediaRecorder(stream, { mimeType });
                  
                  recorder.ondataavailable = (e) => {
                      if (e.data && e.data.size > 0) chunks.push(e.data);
                  };

                  recorder.onstop = () => {
                      const blob = new Blob(chunks, { type: mimeType });
                      let ext = 'webm';
                      if (mimeType.includes('mp4')) ext = 'mp4';
                      
                      const trimmedFile = new File([blob], `story_trimmed_${Date.now()}.${ext}`, { type: mimeType });
                      cleanup();
                      resolve(trimmedFile);
                  };

                  const durationToRecord = end - start; // CALCULATE EXACT DURATION
                  
                  recorder.start(200); 
                  video.play();

                  let progress = 0;
                  const interval = setInterval(() => {
                      progress += (100 / durationToRecord) * 0.1;
                      setProcessingProgress(Math.min(99, progress));
                  }, 100);

                  setTimeout(() => {
                      clearInterval(interval);
                      if (recorder.state === 'recording') {
                          recorder.stop();
                      }
                      video.pause();
                  }, durationToRecord * 1000 + 500); 

              } catch (e) {
                  cleanup();
                  reject(e);
              }
          };

          video.onerror = (e) => {
              cleanup();
              reject(new Error("Video loading error for processing"));
          };
      });
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('files', file);
    const token = localStorage.getItem('token');
    
    const res = await fetch(`${API_BASE_URL}/api/v1/upload/multiple`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });
    
    if (!res.ok) throw new Error("File upload failed");
    const data = await res.json();
    return data.files[0]; 
  };

  const handlePublish = async () => {
    if (mode === 'text' && !text.trim()) return;
    if ((mode === 'media' || mode === 'trim') && !mediaFile) return;

    setIsSubmitting(true);
    setProcessingProgress(0);

    try {
        const token = localStorage.getItem('token');
        let payload: any = {};

        if (mode === 'text') {
            payload = {
                text: text,
                backgroundColor: GRADIENTS[bgIndex]
            };
        } else if (mediaFile) {
            let fileToUpload = mediaFile;

            // --- CHECK IF TRIM IS NEEDED ---
            // Even if duration is small, if user entered trim mode and changed start/end, we trim
            if (mediaFile.type.startsWith('video') && (videoDuration > MAX_VIDEO_DURATION || trimEnd - trimStart < videoDuration)) {
                setIsProcessingVideo(true); 
                try {
                    // ACTUALLY TRIM using new start and end
                    fileToUpload = await performClientSideTrim(mediaFile, trimStart, trimEnd);
                } catch (trimError) {
                    console.error("Trim failed, falling back to full", trimError);
                } finally {
                    setIsProcessingVideo(false);
                }
            }

            const uploaded = await uploadFile(fileToUpload);
            payload = {
                media: {
                    url: uploaded.filePath,
                    type: uploaded.fileType 
                }
            };
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/stories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            onPost({}); 
            onClose();
        } else {
            alert(t('story_upload_fail'));
        }

    } catch (e) {
        console.error(e);
        alert(t('story_upload_error'));
    } finally {
        setIsSubmitting(false);
        setIsProcessingVideo(false);
    }
  };

  // --- PROCESSING LOADER ---
  if (isProcessingVideo) {
      return (
        <div className="fixed inset-0 z-[300] bg-black flex flex-col items-center justify-center animate-in fade-in duration-300">
            <Loader2 size={48} className="text-white animate-spin mb-4" />
            <p className="text-white font-bold text-lg mb-2">
                {mode === 'trim' ? 'جاري قص وتجهيز الفيديو...' : t('video_preparing')}
            </p>
            {mode === 'trim' && (
                <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-blue-500 transition-all duration-300 ease-out" 
                        style={{ width: `${processingProgress}%` }}
                    />
                </div>
            )}
            <p className="text-gray-400 text-xs mt-4">يرجى الانتظار، يتم معالجة الفيديو قبل الرفع</p>
        </div>
      );
  }

  // --- TRIM MODE VIEW (UPDATED UI) ---
  if (mode === 'trim') {
      return (
        <div 
            className="fixed inset-0 z-[200] bg-black flex flex-col animate-in fade-in duration-300 text-white"
            onMouseUp={handleTouchEnd}
            onTouchEnd={handleTouchEnd}
            onMouseMove={handleTouchMove}
            onTouchMove={handleTouchMove}
        >
            {/* Header */}
            <div className="flex justify-between items-center p-4 pt-safe z-10 bg-gradient-to-b from-black/50 to-transparent">
                <button onClick={() => setMode('media')} className="text-white text-sm font-bold flex items-center gap-1 opacity-80">
                    <X size={20} />
                    {t('cancel')}
                </button>
                <h3 className="font-bold text-sm">قص الفيديو</h3>
                <button 
                    onClick={handleTrimDone}
                    className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors"
                >
                    {t('done')}
                </button>
            </div>

            {/* Video Area */}
            <div className="flex-1 flex flex-col justify-end pb-8 px-4">
                
                {/* Video Player */}
                <div className="relative w-full aspect-[9/16] max-h-[60vh] bg-gray-900 rounded-2xl overflow-hidden mb-6 shadow-2xl border border-gray-800 mx-auto">
                    <video 
                        ref={trimVideoRef}
                        src={mediaPreview!} 
                        className="w-full h-full object-contain"
                        onClick={() => {
                            if (trimVideoRef.current?.paused) {
                                trimVideoRef.current.play();
                                setIsPlayingTrim(true);
                            } else {
                                trimVideoRef.current?.pause();
                                setIsPlayingTrim(false);
                            }
                        }}
                        onTimeUpdate={handleTrimTimeUpdate}
                        playsInline
                        preload="auto"
                    />
                    {!isPlayingTrim && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Play size={48} className="text-white/80 fill-white/80" />
                        </div>
                    )}
                </div>

                {/* --- ADVANCED TRIMMER UI --- */}
                <div className="bg-gray-900/80 backdrop-blur-md p-4 rounded-xl border border-white/10 select-none">
                    <div className="flex justify-between text-xs text-gray-400 mb-2 font-mono">
                        <span>{new Date(trimStart * 1000).toISOString().substr(14, 5)}</span>
                        <span className={trimEnd - trimStart > MAX_VIDEO_DURATION ? 'text-red-500' : 'text-white'}>
                            {((trimEnd - trimStart).toFixed(1))}s
                        </span>
                        <span>{new Date(trimEnd * 1000).toISOString().substr(14, 5)}</span>
                    </div>
                    
                    <div 
                        ref={timelineRef}
                        className="relative h-14 bg-gray-800 rounded-lg overflow-hidden flex items-center px-0 cursor-pointer touch-none"
                    >
                        {/* Fake timeline tick marks */}
                        <div className="absolute inset-0 flex gap-1 opacity-30 px-2">
                             {Array.from({length: 60}).map((_, i) => (
                                 <div key={i} className={`flex-1 bg-white h-full mx-px ${i % 5 === 0 ? 'h-full bg-opacity-80' : 'h-1/2 self-center'}`} />
                             ))}
                        </div>
                        
                        {/* --- THE SELECTION BOX CONTAINER --- */}
                        <div 
                            className="absolute top-0 bottom-0 border-y-4 border-yellow-500 bg-yellow-500/20 group"
                            style={{ 
                                left: `${(trimStart / videoDuration) * 100}%`, 
                                width: `${((trimEnd - trimStart) / videoDuration) * 100}%`,
                                minWidth: '20px' // Prevent collapse
                            }}
                            onMouseDown={(e) => handleTouchStart(e, 'bar')}
                            onTouchStart={(e) => handleTouchStart(e, 'bar')}
                        >
                            {/* --- LEFT HANDLE --- */}
                            <div 
                                className="absolute left-0 top-0 bottom-0 w-6 bg-yellow-500 flex items-center justify-center cursor-ew-resize z-20 -translate-x-1/2 rounded-l-md"
                                onMouseDown={(e) => { e.stopPropagation(); handleTouchStart(e, 'left'); }}
                                onTouchStart={(e) => { e.stopPropagation(); handleTouchStart(e, 'left'); }}
                            >
                                <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 bg-yellow-500 rounded-t-sm w-4 h-2 flex items-center justify-center">
                                    <ChevronLeft size={10} className="text-black stroke-[4]" />
                                </div>
                                <GripHorizontal size={14} className="text-black rotate-90" />
                            </div>

                            {/* --- RIGHT HANDLE --- */}
                            <div 
                                className="absolute right-0 top-0 bottom-0 w-6 bg-yellow-500 flex items-center justify-center cursor-ew-resize z-20 translate-x-1/2 rounded-r-md"
                                onMouseDown={(e) => { e.stopPropagation(); handleTouchStart(e, 'right'); }}
                                onTouchStart={(e) => { e.stopPropagation(); handleTouchStart(e, 'right'); }}
                            >
                                <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 bg-yellow-500 rounded-t-sm w-4 h-2 flex items-center justify-center">
                                    <ChevronRight size={10} className="text-black stroke-[4]" />
                                </div>
                                <GripHorizontal size={14} className="text-black rotate-90" />
                            </div>
                        </div>

                    </div>
                    <p className="text-center text-xs text-gray-500 mt-3 font-medium">اسحب الأطراف للقص، أو المربع للتحريك</p>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className={`fixed inset-0 z-[200] flex flex-col animate-in fade-in duration-300 ${mode === 'text' ? GRADIENTS[bgIndex] : 'bg-black'} transition-colors duration-500`}>
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-safe flex justify-between items-start z-20">
        <button onClick={onClose} className="p-2 bg-black/20 rounded-full text-white backdrop-blur-sm">
          <X size={28} />
        </button>

        {mode === 'text' && (
           <button onClick={handleNextBackground} className="mt-2 p-2 bg-white/20 rounded-full text-white backdrop-blur-md">
             <Palette size={24} />
           </button>
        )}

        {/* Send Button (Appears on last page) */}
        <button 
          onClick={handlePublish}
          disabled={isSubmitting || (mode === 'text' && !text) || (mode === 'media' && !mediaFile)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all shadow-lg backdrop-blur-sm ${
             isSubmitting ? 'bg-gray-400' : 'bg-white text-black hover:bg-gray-100'
          }`}
        >
          {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <><Check size={20} /><span>{t('post_publish')}</span></>}
        </button>
      </div>

      {/* Main Area */}
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
                mediaFile?.type.startsWith('video') ? (
                    <video 
                        src={mediaPreview} 
                        autoPlay 
                        loop 
                        playsInline 
                        className="w-full h-full object-contain" 
                        onTimeUpdate={handlePreviewTimeUpdate}
                        onLoadedMetadata={(e) => {
                            if (videoDuration > MAX_VIDEO_DURATION) {
                                e.currentTarget.currentTime = trimStart;
                            }
                        }}
                    />
                ) : (
                    <img src={mediaPreview} alt="preview" className="w-full h-full object-contain" />
                )
             ) : (
                <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-4 text-gray-400 cursor-pointer p-10 border-2 border-dashed border-gray-600 rounded-3xl">
                    <ImageIcon size={48} />
                    <span>{t('story_media_placeholder')}</span>
                </div>
             )
         )}
      </div>

      {/* Footer Tools */}
      <div className="absolute bottom-10 left-0 right-0 pb-safe flex flex-col items-center gap-6 z-20">
         
         {/* Tools based on mode */}
         {mode === 'text' && (
            <div className="flex gap-6">
                <button onClick={handleNextSize} className="flex flex-col items-center gap-1">
                   <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center"><ALargeSmall size={20} className="text-white" /></div>
                   <span className="text-white text-[10px]">{t('story_font_size')}</span>
                </button>
            </div>
         )}
         
         {/* Mode Switcher */}
         <div className="bg-black/40 backdrop-blur-md rounded-full p-1 flex">
             <button 
               onClick={() => setMode('text')}
               className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${mode === 'text' ? 'bg-white text-black' : 'text-white'}`}
             >
               {t('story_type_text')}
             </button>
             <button 
               onClick={() => fileInputRef.current?.click()}
               className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${mode === 'media' ? 'bg-white text-black' : 'text-white'}`}
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
