import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Zap, Activity, Radio, Cpu } from 'lucide-react';

export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Background Neon Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-magenta-500/10 blur-[120px] rounded-full animate-pulse delay-1000" />
      <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-lime-500/5 blur-[80px] rounded-full animate-pulse delay-500" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <Zap className="w-6 h-6 text-black fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">
              NEON <span className="text-cyan-400">BEATS</span>
            </h1>
            <p className="text-[10px] font-mono text-cyan-500/50 uppercase tracking-[0.3em] mt-1">
              SYSTEM STATUS: OPTIMIZED
            </p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-white/50">
          <a href="#" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
            <Activity className="w-3 h-3" /> GAME
          </a>
          <a href="#" className="hover:text-magenta-400 transition-colors flex items-center gap-2">
            <Radio className="w-3 h-3" /> AUDIO
          </a>
          <a href="#" className="hover:text-lime-400 transition-colors flex items-center gap-2">
            <Cpu className="w-3 h-3" /> CORE
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[calc(100vh-160px)]">
        
        {/* Left Section: Info/Stats (Visual Only) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-8">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h2 className="text-xs font-mono text-cyan-500 uppercase tracking-widest mb-4">System Metrics</h2>
            <div className="space-y-4">
              {[
                { label: 'CPU LOAD', value: '24%', color: 'bg-cyan-500' },
                { label: 'MEM USAGE', value: '42%', color: 'bg-magenta-500' },
                { label: 'SYNC RATE', value: '99.9%', color: 'bg-lime-500' }
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono opacity-50">
                    <span>{stat.label}</span>
                    <span>{stat.value}</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: stat.value }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className={`h-full ${stat.color}`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h2 className="text-xs font-mono text-magenta-500 uppercase tracking-widest mb-4">Active Session</h2>
            <div className="space-y-2 text-[11px] font-mono opacity-60">
              <p>USER: {navigator.userAgent.split(' ')[0]}</p>
              <p>LOC: 0.0.0.0</p>
              <p>TIME: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>

        {/* Center Section: Snake Game */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SnakeGame />
          </motion.div>
        </div>

        {/* Right Section: Music Player */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full"
          >
            <MusicPlayer />
          </motion.div>
        </div>
      </main>

      {/* Footer / Rail */}
      <footer className="relative z-10 p-6 border-t border-white/5 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">
          © 2026 NEON BEATS • ALL SYSTEMS NOMINAL
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse shadow-[0_0_8px_rgba(132,204,22,0.8)]" />
            <span className="text-[10px] font-mono text-lime-500/80 uppercase tracking-widest">Live Feed</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
            V.2.4.0
          </div>
        </div>
      </footer>
    </div>
  );
}
