import React from 'react';
import { HOUSES_DATA } from '../data/housesData';
import { ScriptMode, AspectRatio, VisualMode, VoiceSettings } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
  Download,
  Settings,
  Tv,
  Smartphone,
  Square,
  Layout,
  Music,
} from 'lucide-react';

interface TimelineControllerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onRestart: () => void;
  currentSceneIndex: number;
  totalScenes: number;
  onSelectSceneIndex: (index: number) => void;
  onNextScene: () => void;
  onPrevScene: () => void;
  scriptMode: ScriptMode;
  onChangeScriptMode: (mode: ScriptMode) => void;
  aspectRatio: AspectRatio;
  onChangeAspectRatio: (ratio: AspectRatio) => void;
  visualMode: VisualMode;
  onChangeVisualMode: (mode: VisualMode) => void;
  voiceSettings: VoiceSettings;
  onUpdateVoiceSettings: (settings: Partial<VoiceSettings>) => void;
  onOpenAiGenerator: () => void;
  onExportVideo: () => void;
  isExporting: boolean;
  exportProgress: number;
}

export const TimelineController: React.FC<TimelineControllerProps> = ({
  isPlaying,
  onTogglePlay,
  onRestart,
  currentSceneIndex,
  totalScenes,
  onSelectSceneIndex,
  onNextScene,
  onPrevScene,
  scriptMode,
  onChangeScriptMode,
  aspectRatio,
  onChangeAspectRatio,
  visualMode,
  onChangeVisualMode,
  voiceSettings,
  onUpdateVoiceSettings,
  onOpenAiGenerator,
  onExportVideo,
  isExporting,
  exportProgress,
}) => {
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);

  return (
    <div className="w-full bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-4 md:p-6 shadow-2xl space-y-5">
      {/* Timeline Scrubber */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-zinc-200 font-bold">
              Scene {currentSceneIndex + 1} of {totalScenes}:
            </span>
            <span className="text-amber-400 font-sans">
              {currentSceneIndex === 0
                ? 'Intro Title Card'
                : currentSceneIndex === 13
                ? 'Final Kundli Summary'
                : `House ${currentSceneIndex} (${HOUSES_DATA[currentSceneIndex - 1]?.sanskritName.split(' ')[0]})`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px]">
              {Math.round(((currentSceneIndex + 1) / totalScenes) * 100)}% Complete
            </span>
          </div>
        </div>

        {/* 14 Scene Segment Buttons */}
        <div className="grid grid-cols-14 gap-1 sm:gap-1.5 h-3">
          {Array.from({ length: totalScenes }).map((_, idx) => {
            const isCurrent = idx === currentSceneIndex;
            const isPast = idx < currentSceneIndex;

            return (
              <button
                key={`timeline-seg-${idx}`}
                onClick={() => onSelectSceneIndex(idx)}
                title={
                  idx === 0
                    ? 'Prologue Intro'
                    : idx === 13
                    ? 'Summary Outro'
                    : `House ${idx}: ${HOUSES_DATA[idx - 1]?.hindiOneLine}`
                }
                className={`h-full rounded-sm transition-all duration-200 relative group ${
                  isCurrent
                    ? 'bg-amber-400 shadow-md shadow-amber-400/50 scale-y-125 z-10'
                    : isPast
                    ? 'bg-amber-600/70 hover:bg-amber-500'
                    : 'bg-zinc-800 hover:bg-zinc-700'
                }`}
              >
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block px-2 py-0.5 rounded bg-zinc-900 text-[10px] text-zinc-200 border border-zinc-700 whitespace-nowrap shadow-lg z-30 pointer-events-none">
                  {idx === 0 ? 'Intro' : idx === 13 ? 'Outro' : `H${idx}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Transport & Director Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        {/* Playback Transport Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRestart}
            title="Restart Video from Beginning"
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onPrevScene}
            disabled={currentSceneIndex === 0}
            title="Previous House"
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2.5 shadow-lg transition-all active:scale-95 ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/25 ring-2 ring-amber-400/50'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-black shadow-amber-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play Script</span>
              </>
            )}
          </button>

          <button
            onClick={onNextScene}
            disabled={currentSceneIndex === totalScenes - 1}
            title="Next House"
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Script Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800">
          <span className="text-[11px] font-bold text-zinc-400 px-2 uppercase font-mono">Script:</span>
          {(
            [
              { id: 'oneLineHinglish', label: '1-Line Hinglish' },
              { id: 'deepHindi', label: 'Deep Hindi' },
              { id: 'englishMaster', label: 'English Master' },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => onChangeScriptMode(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                scriptMode === m.id
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Visual Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800">
          <span className="text-[11px] font-bold text-zinc-400 px-2 uppercase font-mono">Layout:</span>
          {(
            [
              { id: 'split', label: 'Split TV', icon: <Layout className="w-3.5 h-3.5" /> },
              { id: 'kundliFocus', label: 'Kundli', icon: <Tv className="w-3.5 h-3.5" /> },
              { id: 'slideOnly', label: 'Original Slide', icon: <Tv className="w-3.5 h-3.5" /> },
              { id: 'cinematicReels', label: 'Reels', icon: <Smartphone className="w-3.5 h-3.5" /> },
            ] as const
          ).map((v) => (
            <button
              key={v.id}
              onClick={() => onChangeVisualMode(v.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                visualMode === v.id
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              {v.icon}
              <span className="hidden sm:inline">{v.label}</span>
            </button>
          ))}
        </div>

        {/* Aspect Ratio Buttons */}
        <div className="flex items-center gap-1 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800">
          {(
            [
              { ratio: '16:9', label: '16:9', icon: <Tv className="w-3 h-3" /> },
              { ratio: '9:16', label: '9:16', icon: <Smartphone className="w-3 h-3" /> },
              { ratio: '1:1', label: '1:1', icon: <Square className="w-3 h-3" /> },
            ] as const
          ).map((item) => (
            <button
              key={item.ratio}
              onClick={() => onChangeAspectRatio(item.ratio)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all ${
                aspectRatio === item.ratio
                  ? 'bg-zinc-200 text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Action Tools: AI Generator, Ambient Audio, Settings, Video Export */}
        <div className="flex items-center gap-2">
          {/* AI Script Generator Trigger */}
          <button
            onClick={onOpenAiGenerator}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Script Studio</span>
          </button>

          {/* Ambient Music Toggle */}
          <button
            onClick={() => onUpdateVoiceSettings({ isAmbientEnabled: !voiceSettings.isAmbientEnabled })}
            title={voiceSettings.isAmbientEnabled ? 'Mute Vedic Drone Ambience' : 'Play Vedic Drone Ambience'}
            className={`p-2 rounded-xl border transition-colors ${
              voiceSettings.isAmbientEnabled
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-zinc-900 text-zinc-500 border-zinc-800'
            }`}
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Audio & Voice Settings Modal Trigger */}
          <button
            onClick={() => setShowSettingsModal(!showSettingsModal)}
            title="Audio & Voiceover Settings"
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Export Video Button */}
          <button
            onClick={onExportVideo}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? `Exporting (${exportProgress}%)` : 'Export WebM'}</span>
          </button>
        </div>
      </div>

      {/* Voice & Ambience Settings Popover */}
      {showSettingsModal && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-left space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-400" />
              <span>Voiceover & Sound Customizer</span>
            </h4>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Speed Rate Slider */}
            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Narration Speed</span>
                <span className="text-amber-400 font-mono">{voiceSettings.rate}x</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.5"
                step="0.05"
                value={voiceSettings.rate}
                onChange={(e) => onUpdateVoiceSettings({ rate: parseFloat(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Ambient Volume */}
            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Vedic Drone Volume</span>
                <span className="text-amber-400 font-mono">
                  {Math.round(voiceSettings.ambientVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={voiceSettings.ambientVolume}
                onChange={(e) => onUpdateVoiceSettings({ ambientVolume: parseFloat(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Auto Advance toggle */}
            <div className="flex items-center justify-between bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
              <span className="text-zinc-300">Auto-Advance Scenes:</span>
              <input
                type="checkbox"
                checked={voiceSettings.autoAdvance}
                onChange={(e) => onUpdateVoiceSettings({ autoAdvance: e.target.checked })}
                className="accent-amber-500 w-4 h-4 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
