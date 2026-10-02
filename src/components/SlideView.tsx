import React from 'react';
import { HOUSES_DATA } from '../data/housesData';

interface SlideViewProps {
  activeHouseId: number | null;
  onSelectHouse: (id: number) => void;
  isPlaying: boolean;
  speakerName?: string;
}

export const SlideView: React.FC<SlideViewProps> = ({
  activeHouseId,
  onSelectHouse,
  isPlaying,
  speakerName = 'Sanskar Aggarwal',
}) => {
  const leftCol = HOUSES_DATA.slice(0, 6);
  const rightCol = HOUSES_DATA.slice(6, 12);

  return (
    <div className="relative w-full h-full bg-[#fdfbf7] dark:bg-[#0c0d12] text-zinc-900 dark:text-zinc-100 p-6 md:p-10 flex flex-col justify-between rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 transition-colors duration-500 overflow-hidden select-none">
      {/* Background Subtle Sanskrit / Yantra Texture */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Header bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-bold tracking-widest rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase font-mono">
              Vedic Astrology Master Script
            </span>
            <span className="text-xs text-zinc-400">Janam Kundli Framework</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-2 font-['Cinzel',serif] bg-gradient-to-r from-amber-600 via-amber-700 to-zinc-900 dark:from-amber-200 dark:via-amber-400 dark:to-white bg-clip-text text-transparent">
            12 Ghar — Ek Line Mein
          </h1>
        </div>

        {/* Video Speaker Avatar / Webcam PiP (matching the original slide thumbnail) */}
        <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900/90 p-2 rounded-xl border border-zinc-200 dark:border-zinc-700/80 shadow-md">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-inner">
            <span className="font-serif">सं</span>
            {isPlaying && (
              <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-zinc-900 animate-pulse" />
            )}
          </div>
          <div className="hidden sm:block text-left pr-2">
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{speakerName}</div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {isPlaying ? 'AI Voice Active' : 'Speaker Standby'}
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3.5 my-auto py-6">
        {/* Left Column (Houses 1-6) */}
        <div className="space-y-3">
          {leftCol.map((house) => {
            const isActive = activeHouseId === house.id;
            return (
              <div
                key={`left-house-${house.id}`}
                onClick={() => onSelectHouse(house.id)}
                className={`group flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all duration-300 ${
                  isActive
                    ? 'bg-amber-500/15 dark:bg-amber-400/10 border-2 border-amber-500 shadow-lg shadow-amber-500/10 scale-[1.02]'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-900/60 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isActive
                        ? 'bg-amber-500 text-zinc-950 font-black shadow-md shadow-amber-500/30'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:text-amber-500'
                    }`}
                  >
                    {house.id}
                  </div>
                  <div>
                    <div
                      className={`text-base md:text-lg font-medium transition-colors ${
                        isActive
                          ? 'text-amber-600 dark:text-amber-300 font-bold'
                          : 'text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      {house.hindiOneLine}
                    </div>
                    <div className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-2 mt-0.5">
                      <span className="font-semibold">{house.sanskritName.split(' ')[0]}</span>
                      <span>•</span>
                      <span>{house.karaka.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>

                {isActive && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold animate-pulse">
                    <span>Now Playing</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column (Houses 7-12) */}
        <div className="space-y-3">
          {rightCol.map((house) => {
            const isActive = activeHouseId === house.id;
            return (
              <div
                key={`right-house-${house.id}`}
                onClick={() => onSelectHouse(house.id)}
                className={`group flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all duration-300 ${
                  isActive
                    ? 'bg-amber-500/15 dark:bg-amber-400/10 border-2 border-amber-500 shadow-lg shadow-amber-500/10 scale-[1.02]'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-900/60 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isActive
                        ? 'bg-amber-500 text-zinc-950 font-black shadow-md shadow-amber-500/30'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:text-amber-500'
                    }`}
                  >
                    {house.id}
                  </div>
                  <div>
                    <div
                      className={`text-base md:text-lg font-medium transition-colors ${
                        isActive
                          ? 'text-amber-600 dark:text-amber-300 font-bold'
                          : 'text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      {house.hindiOneLine}
                    </div>
                    <div className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-2 mt-0.5">
                      <span className="font-semibold">{house.sanskritName.split(' ')[0]}</span>
                      <span>•</span>
                      <span>{house.karaka.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>

                {isActive && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold animate-pulse">
                    <span>Now Playing</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer bar */}
      <div className="relative z-10 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Vedic Janam Kundli 12 Houses Foundation System</span>
        </div>
        <div>Click any house number to jump & hear AI synchronized voiceover</div>
      </div>
    </div>
  );
};
