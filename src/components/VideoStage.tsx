import React from 'react';
import { HouseData, AspectRatio, VisualMode } from '../types';
import { VedicKundliChart } from './VedicKundliChart';
import { SlideView } from './SlideView';
import { Sparkles, Compass, Shield, Award, Users, Heart, Zap, Home, ShieldAlert, Eye, Moon, TrendingUp, Coins, UserCheck } from 'lucide-react';

interface VideoStageProps {
  currentSceneType: 'intro' | 'house' | 'outro';
  currentHouse: HouseData | null;
  activeHouseId: number | null;
  aspectRatio: AspectRatio;
  visualMode: VisualMode;
  currentSubtitles: string;
  activeCharIndex: number;
  isPlaying: boolean;
  onSelectHouse: (id: number) => void;
  speakerName: string;
  stageRef?: React.RefObject<HTMLDivElement | null>;
}

const HOUSE_ICONS: Record<string, React.ReactNode> = {
  UserCheck: <UserCheck className="w-8 h-8" />,
  Coins: <Coins className="w-8 h-8" />,
  Zap: <Zap className="w-8 h-8" />,
  Home: <Home className="w-8 h-8" />,
  Heart: <Heart className="w-8 h-8" />,
  ShieldAlert: <ShieldAlert className="w-8 h-8" />,
  Users: <Users className="w-8 h-8" />,
  Eye: <Eye className="w-8 h-8" />,
  Sparkles: <Sparkles className="w-8 h-8" />,
  Award: <Award className="w-8 h-8" />,
  TrendingUp: <TrendingUp className="w-8 h-8" />,
  Moon: <Moon className="w-8 h-8" />,
};

export const VideoStage: React.FC<VideoStageProps> = ({
  currentSceneType,
  currentHouse,
  activeHouseId,
  aspectRatio,
  visualMode,
  currentSubtitles,
  activeCharIndex,
  isPlaying,
  onSelectHouse,
  speakerName,
  stageRef,
}) => {
  // Aspect ratio wrapper styling
  const aspectClass = {
    '16:9': 'aspect-[16/9] max-w-6xl',
    '9:16': 'aspect-[9/16] max-w-md mx-auto',
    '1:1': 'aspect-square max-w-2xl mx-auto',
  }[aspectRatio];

  return (
    <div
      ref={stageRef}
      className={`relative w-full ${aspectClass} bg-neutral-950 text-white rounded-3xl overflow-hidden shadow-2xl border border-amber-500/20 flex flex-col justify-between transition-all duration-500 select-none group`}
    >
      {/* Dynamic Cosmic Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep space radial glow */}
        <div
          className="absolute inset-0 opacity-40 transition-colors duration-1000"
          style={{
            background: currentHouse
              ? `radial-gradient(ellipse at 70% 40%, ${currentHouse.visualTheme.color}33 0%, #050508 70%)`
              : 'radial-gradient(ellipse at 50% 50%, #d9770622 0%, #050508 80%)',
          }}
        />

        {/* Ambient star speckles */}
        <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/80" />
      </div>

      {/* Top Video Header Overlay */}
      <div className="relative z-20 px-6 py-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-mono font-bold tracking-wider text-amber-300 uppercase">
              {currentSceneType === 'intro'
                ? 'Prologue'
                : currentSceneType === 'outro'
                ? 'Master Epilogue'
                : `Bhava ${currentHouse?.id} / 12`}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 font-medium">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Vedic Janam Kundali</span>
          </div>
        </div>

        {/* Live Audio Pulse Bars */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 h-4 px-2 py-0.5 rounded bg-zinc-900/80 border border-zinc-800">
            <span
              className={`w-1 bg-amber-400 rounded-full transition-all duration-150 ${
                isPlaying ? 'h-3 animate-pulse' : 'h-1'
              }`}
            />
            <span
              className={`w-1 bg-amber-400 rounded-full transition-all duration-200 ${
                isPlaying ? 'h-4 animate-bounce' : 'h-1.5'
              }`}
            />
            <span
              className={`w-1 bg-amber-400 rounded-full transition-all duration-100 ${
                isPlaying ? 'h-2.5 animate-pulse' : 'h-1'
              }`}
            />
            <span
              className={`w-1 bg-amber-400 rounded-full transition-all duration-300 ${
                isPlaying ? 'h-3.5 animate-bounce' : 'h-1.5'
              }`}
            />
          </div>

          <div className="text-xs font-mono text-zinc-400 bg-zinc-900/60 px-2 py-0.5 rounded border border-zinc-800/80">
            {aspectRatio} • 4K ULTRA
          </div>
        </div>
      </div>

      {/* Main Content Stage */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden">
        {/* SCENE TYPE: INTRO */}
        {currentSceneType === 'intro' && (
          <div className="text-center max-w-3xl space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-xl shadow-amber-500/10">
              <Sparkles className="w-10 h-10 animate-spin [animation-duration:8s]" />
            </div>
            <div>
              <div className="text-sm font-mono tracking-widest text-amber-400 uppercase font-semibold">
                Vedic Astrology Comprehensive Masterclass
              </div>
              <h1 className="text-4xl md:text-6xl font-black font-['Cinzel',serif] tracking-tight mt-2 bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                12 Ghar — Ek Line Mein
              </h1>
              <p className="text-base md:text-xl text-zinc-300 font-light mt-3 max-w-xl mx-auto">
                Decode your entire Janam Kundali with the core significations of every single house in 1 concise line.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
                12 Bhavas
              </span>
              <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
                4 Kendras
              </span>
              <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
                Lakshmi & Dharma Trikonas
              </span>
              <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
                Synchronized Audio
              </span>
            </div>
          </div>
        )}

        {/* SCENE TYPE: OUTRO */}
        {currentSceneType === 'outro' && (
          <div className="text-center max-w-3xl space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 p-0.5 shadow-2xl shadow-amber-500/20">
              <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center text-amber-400">
                <Compass className="w-10 h-10 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="text-sm font-mono tracking-widest text-amber-400 uppercase font-semibold">
                Summary Complete
              </div>
              <h2 className="text-3xl md:text-5xl font-black font-['Cinzel',serif] tracking-tight mt-2 text-white">
                Sampurna 12 Ghar Chakra
              </h2>
              <p className="text-base md:text-lg text-zinc-300 font-light mt-2 max-w-lg mx-auto">
                Now you hold the golden compass to read any Vedic horoscope chart!
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onSelectHouse(1)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-sm shadow-lg shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all"
              >
                Replay From House 1
              </button>
            </div>
          </div>
        )}

        {/* SCENE TYPE: ACTIVE HOUSE (1 to 12) */}
        {currentSceneType === 'house' && currentHouse && (
          <div className="w-full h-full flex items-center justify-center">
            {/* MODE: SLIDE ONLY */}
            {visualMode === 'slideOnly' && (
              <div className="w-full h-full max-w-4xl max-h-[85%]">
                <SlideView
                  activeHouseId={currentHouse.id}
                  onSelectHouse={onSelectHouse}
                  isPlaying={isPlaying}
                  speakerName={speakerName}
                />
              </div>
            )}

            {/* MODE: KUNDLI FOCUS */}
            {visualMode === 'kundliFocus' && (
              <div className="w-full h-full flex flex-col md:flex-row items-center justify-around gap-6">
                <div className="flex-1 max-w-md">
                  <VedicKundliChart
                    activeHouseId={currentHouse.id}
                    onSelectHouse={onSelectHouse}
                    size="responsive"
                    showLabels={true}
                  />
                </div>
                <div className="flex-1 max-w-md space-y-4 text-left p-6 rounded-2xl bg-zinc-900/60 backdrop-blur-md border border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                      style={{ backgroundColor: currentHouse.visualTheme.color }}
                    >
                      {HOUSE_ICONS[currentHouse.visualTheme.icon] || <Sparkles className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold tracking-wider text-amber-400 uppercase">
                        House {currentHouse.id} • {currentHouse.categoryLabel}
                      </div>
                      <h3 className="text-2xl font-bold font-['Cinzel',serif] text-white">
                        {currentHouse.sanskritName}
                      </h3>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-lg font-semibold">
                    "{currentHouse.hindiOneLine}"
                  </div>

                  {/* Chart Signification Pills from Image 2 */}
                  <div>
                    <div className="text-xs text-zinc-400 font-medium mb-1.5 uppercase tracking-wider">
                      Vedic Significations (Kundli Blueprint)
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentHouse.chartEnglishTags.map((tag, idx) => (
                        <span
                          key={`tag-${idx}`}
                          className="px-2.5 py-1 text-xs rounded-lg bg-zinc-800/90 text-zinc-200 border border-zinc-700/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-zinc-800">
                    <div>
                      <span className="text-zinc-500">Ruling Karaka:</span>
                      <div className="text-zinc-200 font-medium">{currentHouse.karaka}</div>
                    </div>
                    <div>
                      <span className="text-zinc-500">Element & Sign:</span>
                      <div className="text-zinc-200 font-medium">{currentHouse.element}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODE: SPLIT MASTER (Default cinematic TV layout) */}
            {visualMode === 'split' && (
              <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left Side: Cinematic House Spotlight Card */}
                <div className="lg:col-span-6 flex flex-col justify-center space-y-4 text-left p-6 md:p-8 rounded-2xl bg-zinc-950/70 backdrop-blur-xl border border-amber-500/20 shadow-2xl relative overflow-hidden">
                  <div
                    className="absolute -right-16 -top-16 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
                    style={{ backgroundColor: currentHouse.visualTheme.color }}
                  />

                  {/* Header info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-zinc-950 font-black shadow-lg"
                        style={{ backgroundColor: currentHouse.visualTheme.color }}
                      >
                        <span className="text-xl">{currentHouse.id}</span>
                      </div>
                      <div>
                        <div className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                          {currentHouse.hindiTitle}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold font-['Cinzel',serif] text-white">
                          {currentHouse.sanskritName}
                        </h2>
                      </div>
                    </div>

                    <div className="px-3 py-1 rounded-full bg-zinc-900 text-xs font-medium text-zinc-300 border border-zinc-800">
                      {currentHouse.category}
                    </div>
                  </div>

                  {/* Core 1-line script quote (from Image 1) */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border-l-4 border-amber-500 text-amber-100 text-lg md:text-xl font-bold leading-snug">
                    "{currentHouse.hindiOneLine}"
                  </div>

                  {/* Comprehensive Tags from Image 2 */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      Vedic Kundli Significations:
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                      {currentHouse.chartEnglishTags.map((tag, i) => (
                        <span
                          key={`split-tag-${i}`}
                          className="px-2.5 py-0.5 text-xs rounded-md bg-zinc-900/90 text-zinc-300 border border-zinc-800 hover:border-amber-500/40 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metaphysical specs */}
                  <div className="grid grid-cols-3 gap-2 text-xs pt-3 border-t border-zinc-800/80">
                    <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                      <div className="text-zinc-500 text-[10px] uppercase font-bold">Graha Karaka</div>
                      <div className="text-amber-300 font-semibold truncate">{currentHouse.karaka.split(' ')[0]}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                      <div className="text-zinc-500 text-[10px] uppercase font-bold">Element</div>
                      <div className="text-zinc-200 font-semibold truncate">{currentHouse.element.split(' ')[0]}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                      <div className="text-zinc-500 text-[10px] uppercase font-bold">Body Part</div>
                      <div className="text-zinc-200 font-semibold truncate">{currentHouse.bodyPart.split(',')[0]}</div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Interactive Animated Kundli SVG */}
                <div className="lg:col-span-6 flex flex-col items-center justify-center p-2">
                  <VedicKundliChart
                    activeHouseId={currentHouse.id}
                    onSelectHouse={onSelectHouse}
                    size="responsive"
                    showLabels={true}
                  />
                  <div className="text-[11px] text-zinc-500 text-center mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>House {currentHouse.id} pulsating in Vedic North Indian Chart</span>
                  </div>
                </div>
              </div>
            )}

            {/* MODE: CINEMATIC REELS (9:16 optimized mobile vertical layout) */}
            {visualMode === 'cinematicReels' && (
              <div className="w-full h-full flex flex-col justify-between items-center py-6 px-4 text-center">
                {/* Top Badge */}
                <div className="space-y-1">
                  <div className="inline-block px-3 py-1 rounded-full bg-amber-500 text-black font-extrabold text-xs tracking-wider uppercase">
                    House {currentHouse.id} of 12
                  </div>
                  <h3 className="text-2xl font-black font-['Cinzel',serif] text-white">
                    {currentHouse.sanskritName}
                  </h3>
                </div>

                {/* Center Animated Kundli Mini */}
                <div className="w-56 h-56 my-2">
                  <VedicKundliChart
                    activeHouseId={currentHouse.id}
                    onSelectHouse={onSelectHouse}
                    size="responsive"
                    showLabels={false}
                  />
                </div>

                {/* Big Punchy Quote */}
                <div className="w-full space-y-3">
                  <div className="p-4 rounded-2xl bg-zinc-900/80 border border-amber-500/40 text-amber-300 text-xl font-black shadow-xl">
                    "{currentHouse.hindiOneLine}"
                  </div>

                  <div className="flex flex-wrap justify-center gap-1.5">
                    {currentHouse.chartEnglishTags.slice(0, 4).map((t, idx) => (
                      <span
                        key={`reels-tag-${idx}`}
                        className="px-2.5 py-0.5 text-xs rounded-full bg-zinc-800 text-zinc-300 font-semibold"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Subtitle / Synchronized Karaoke Bar */}
      <div className="relative z-20 px-6 py-4 bg-gradient-to-t from-black/95 via-black/85 to-transparent border-t border-zinc-800/80">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          {/* Speaker Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-zinc-200">{speakerName}</span>
          </div>

          {/* Karaoke Subtitles */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm md:text-base font-medium leading-relaxed tracking-wide text-zinc-200 font-sans">
              {currentSubtitles ? (
                <span>
                  <span className="text-amber-400 font-bold bg-amber-500/10 px-1 py-0.5 rounded">
                    {currentSubtitles.slice(0, Math.max(0, activeCharIndex))}
                  </span>
                  <span className="text-white font-semibold">
                    {currentSubtitles.slice(Math.max(0, activeCharIndex))}
                  </span>
                </span>
              ) : (
                <span className="text-zinc-500 italic">Press Play to begin synchronized Vedic voiceover</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
