import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Music, Volume2, Disc } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "AI Synthwave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/neon1/400/400"
  },
  {
    id: 2,
    title: "Cyber Pulse",
    artist: "AI Techno",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/cyber2/400/400"
  },
  {
    id: 3,
    title: "Midnight Grid",
    artist: "AI Chillwave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/grid3/400/400"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress || 0);
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-md rounded-3xl border border-magenta-500/30 p-6 shadow-[0_0_50px_-12px_rgba(236,72,153,0.5)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex flex-col items-center gap-6">
        {/* Album Art */}
        <div className="relative group">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-48 h-48 rounded-full overflow-hidden border-4 border-magenta-500/50 shadow-[0_0_30px_rgba(236,72,153,0.4)]"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-black rounded-full border-2 border-magenta-500/50 flex items-center justify-center">
              <Disc className={`w-4 h-4 text-magenta-400 ${isPlaying ? 'animate-spin' : ''}`} />
            </div>
          </div>
        </div>

        {/* Track Info */}
        <div className="text-center">
          <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
            {currentTrack.title}
          </h3>
          <p className="text-magenta-400 font-mono text-sm tracking-widest uppercase opacity-80">
            {currentTrack.artist}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-2">
          <div className="h-1.5 w-full bg-magenta-900/30 rounded-full overflow-hidden border border-magenta-500/10">
            <motion.div 
              className="h-full bg-magenta-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]"
              style={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-magenta-500/50 font-mono uppercase tracking-widest">
            <span>0:00</span>
            <span>3:45</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8">
          <button 
            onClick={prevTrack}
            className="p-2 text-magenta-400 hover:text-magenta-300 transition-all transform hover:scale-110 active:scale-95"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-16 h-16 flex items-center justify-center bg-magenta-500 text-black rounded-full shadow-[0_0_20px_rgba(236,72,153,0.6)] hover:bg-magenta-400 transition-all transform hover:scale-105 active:scale-95"
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>

          <button 
            onClick={nextTrack}
            className="p-2 text-magenta-400 hover:text-magenta-300 transition-all transform hover:scale-110 active:scale-95"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>

        {/* Volume & Extra */}
        <div className="flex items-center gap-4 w-full px-4 mt-2">
          <Volume2 className="w-4 h-4 text-magenta-500/50" />
          <div className="h-1 flex-1 bg-magenta-900/30 rounded-full">
            <div className="h-full w-2/3 bg-magenta-500/50 rounded-full" />
          </div>
          <Music className="w-4 h-4 text-magenta-500/50" />
        </div>
      </div>
    </div>
  );
}
