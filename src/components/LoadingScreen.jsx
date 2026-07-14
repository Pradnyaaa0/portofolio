import { useState, useEffect } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const logs = [
    'Menghubungkan ke core.pradnyaputra.dev...',
    'Memuat konfigurasi antarmuka premium...',
    'Menginisialisasi sistem partikel Canvas...',
    'Menyusun modul keahlian & teknologi...',
    'Menghubungkan database proyek...',
    'Sinkronisasi visual & efek kursor...',
    'Hampir selesai...',
    'Sistem aktif. Selamat datang!'
  ];

  useEffect(() => {
    // Progress counter
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Random increment for realistic loading feel
        const increment = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, []);

  // Update terminal logs as progress increases
  useEffect(() => {
    const expectedLogIndex = Math.min(
      Math.floor((progress / 100) * logs.length),
      logs.length - 1
    );
    if (expectedLogIndex > logIndex) {
      setLogIndex(expectedLogIndex);
    }
  }, [progress, logIndex, logs.length]);

  // Complete loading and trigger exit animation
  useEffect(() => {
    if (progress === 100) {
      const delayTimeout = setTimeout(() => {
        setIsFading(true);
        const completionTimeout = setTimeout(() => {
          onComplete();
        }, 800); // Duration of fade-out transition
        return () => clearTimeout(completionTimeout);
      }, 500); // Hold at 100% for brief impact

      return () => clearTimeout(delayTimeout);
    }
  }, [progress, onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-neutral-950 flex flex-col items-center justify-center z-[99999] px-6 transition-all duration-800 cubic-bezier(0.16, 1, 0.3, 1) ${
        isFading ? 'opacity-0 translate-y-[-20px] pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
    >
      {/* Premium glowing background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Glow effect border beam */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
        
        {/* Header styling */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="text-xs text-neutral-500 font-mono ml-2">pradnya@system:~</span>
        </div>

        {/* Counter */}
        <div className="flex justify-between items-baseline mb-3">
          <h2 className="text-xl font-bold tracking-tight text-white font-mono">
            {progress === 100 ? 'SISTEM SIAP' : 'MEMUAT SISTEM'}
          </h2>
          <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-mono">
            {progress}%
          </div>
        </div>

        {/* Progress bar container */}
        <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Terminal logs console */}
        <div className="h-24 font-mono text-xs text-neutral-400 space-y-1.5 overflow-hidden flex flex-col justify-end">
          {logs.slice(Math.max(0, logIndex - 3), logIndex + 1).map((log, index) => {
            const isLatest = index === Math.min(logIndex, 3) || (logIndex < 3 && index === logIndex);
            return (
              <div
                key={index}
                className={`flex items-start space-x-1.5 transition-all duration-300 ${
                  isLatest ? 'text-indigo-300 opacity-100' : 'opacity-40'
                }`}
              >
                <span className="text-indigo-500 select-none">&gt;</span>
                <span className="break-all">{log}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Futuristic status detail */}
      <div className="mt-8 text-neutral-600 text-xs font-mono tracking-widest uppercase">
        PORTFOLIO v1.0.0 // PRADNYA PUTRA
      </div>
    </div>
  );
}
