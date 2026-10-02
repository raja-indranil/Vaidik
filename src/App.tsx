import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HOUSES_DATA, INTRO_SCENE, OUTRO_SCENE } from './data/housesData';
import { HouseData, ScriptMode, AspectRatio, VisualMode, VoiceSettings } from './types';
import { VideoStage } from './components/VideoStage';
import { TimelineController } from './components/TimelineController';
import { HouseGridReference } from './components/HouseGridReference';
import { AiScriptModal } from './components/AiScriptModal';
import { HouseDetailModal } from './components/HouseDetailModal';
import { ScriptEditorModal } from './components/ScriptEditorModal';
import { audioEngine } from './utils/audioEngine';
import { speechEngine } from './utils/speechEngine';
import { recordSceneSequence, downloadBlob } from './utils/videoExporter';
import confetti from 'canvas-confetti';
import {
  Compass,
  Sparkles,
  Edit3,
  Tv,
  Film,
  Info,
  Volume2,
  Share2,
  BookOpen,
} from 'lucide-react';

export default function App() {
  // Scene index: 0 = Intro, 1..12 = Houses 1..12, 13 = Outro
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeCharIndex, setActiveCharIndex] = useState<number>(0);

  // Studio Display Options
  const [scriptMode, setScriptMode] = useState<ScriptMode>('oneLineHinglish');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [visualMode, setVisualMode] = useState<VisualMode>('split');

  // Voice & Audio Configuration
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    voiceURI: '',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    ambientVolume: 0.2,
    isAmbientEnabled: true,
    autoAdvance: true,
    selectedLanguage: 'hi-IN',
  });

  // Custom AI Narrations map
  const [customScripts, setCustomScripts] = useState<Record<number, string>>({});

  // Modals
  const [isAiScriptModalOpen, setIsAiScriptModalOpen] = useState(false);
  const [isScriptEditorOpen, setIsScriptEditorOpen] = useState(false);
  const [selectedHouseForDetail, setSelectedHouseForDetail] = useState<HouseData | null>(null);

  // Video Export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const stageRef = useRef<HTMLDivElement>(null);

  // Determine current scene details
  const totalScenes = 14;
  let currentSceneType: 'intro' | 'house' | 'outro' = 'house';
  let currentHouse: HouseData | null = null;
  let currentNarrationText = '';

  if (currentSceneIndex === 0) {
    currentSceneType = 'intro';
    currentNarrationText = INTRO_SCENE.narrationText;
  } else if (currentSceneIndex === 13) {
    currentSceneType = 'outro';
    currentNarrationText = OUTRO_SCENE.narrationText;
  } else {
    currentSceneType = 'house';
    currentHouse = HOUSES_DATA[currentSceneIndex - 1] || HOUSES_DATA[0];

    if (customScripts[currentHouse.id]) {
      currentNarrationText = customScripts[currentHouse.id];
    } else if (scriptMode === 'oneLineHinglish') {
      currentNarrationText = currentHouse.defaultScripts.oneLineHinglish;
    } else if (scriptMode === 'deepHindi') {
      currentNarrationText = currentHouse.defaultScripts.deepHindi;
    } else {
      currentNarrationText = currentHouse.defaultScripts.englishMaster;
    }
  }

  // Handle Ambience Sound
  useEffect(() => {
    if (voiceSettings.isAmbientEnabled) {
      audioEngine.startCosmicAmbience(voiceSettings.ambientVolume);
    } else {
      audioEngine.stopCosmicAmbience();
    }
    return () => {
      audioEngine.stopCosmicAmbience();
    };
  }, [voiceSettings.isAmbientEnabled]);

  useEffect(() => {
    audioEngine.setAmbienceVolume(voiceSettings.ambientVolume);
  }, [voiceSettings.ambientVolume]);

  // Synchronized Narration Playback Handler
  const playCurrentSceneNarration = useCallback(
    (targetSceneIndex?: number) => {
      const sceneIdx = targetSceneIndex !== undefined ? targetSceneIndex : currentSceneIndex;
      let text = '';
      if (sceneIdx === 0) {
        text = INTRO_SCENE.narrationText;
      } else if (sceneIdx === 13) {
        text = OUTRO_SCENE.narrationText;
      } else {
        const house = HOUSES_DATA[sceneIdx - 1];
        if (customScripts[house.id]) {
          text = customScripts[house.id];
        } else if (scriptMode === 'oneLineHinglish') {
          text = house.defaultScripts.oneLineHinglish;
        } else if (scriptMode === 'deepHindi') {
          text = house.defaultScripts.deepHindi;
        } else {
          text = house.defaultScripts.englishMaster;
        }
      }

      setActiveCharIndex(0);

      speechEngine.speak(
        text,
        {
          rate: voiceSettings.rate,
          pitch: voiceSettings.pitch,
          volume: voiceSettings.volume,
          lang: scriptMode === 'englishMaster' ? 'en-US' : 'hi-IN',
        },
        {
          onStart: () => {
            setIsPlaying(true);
          },
          onBoundary: (charIndex) => {
            setActiveCharIndex(charIndex);
          },
          onEnd: () => {
            setActiveCharIndex(text.length);

            // Auto advance
            if (voiceSettings.autoAdvance) {
              if (sceneIdx < 13) {
                setTimeout(() => {
                  audioEngine.playTempleChime();
                  setCurrentSceneIndex((prev) => {
                    const next = prev + 1;
                    playCurrentSceneNarration(next);
                    return next;
                  });
                }, 800);
              } else {
                setIsPlaying(false);
                confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
              }
            } else {
              setIsPlaying(false);
            }
          },
          onError: () => {
            setIsPlaying(false);
          },
        }
      );
    },
    [currentSceneIndex, customScripts, scriptMode, voiceSettings]
  );

  // Toggle Play / Pause
  const handleTogglePlay = () => {
    if (isPlaying) {
      speechEngine.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playCurrentSceneNarration(currentSceneIndex);
    }
  };

  // Jump to specific scene
  const handleSelectSceneIndex = (index: number) => {
    speechEngine.stop();
    setCurrentSceneIndex(index);
    audioEngine.playTempleChime();
    if (isPlaying) {
      setTimeout(() => {
        playCurrentSceneNarration(index);
      }, 100);
    } else {
      setActiveCharIndex(0);
    }
  };

  // Jump by House ID (1 to 12)
  const handleSelectHouse = (houseId: number) => {
    handleSelectSceneIndex(houseId);
  };

  const handleRestart = () => {
    speechEngine.stop();
    setCurrentSceneIndex(0);
    setActiveCharIndex(0);
    if (isPlaying) {
      playCurrentSceneNarration(0);
    }
  };

  const handleNextScene = () => {
    if (currentSceneIndex < totalScenes - 1) {
      handleSelectSceneIndex(currentSceneIndex + 1);
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIndex > 0) {
      handleSelectSceneIndex(currentSceneIndex - 1);
    }
  };

  // Video Export WebM
  const handleExportVideo = async () => {
    if (!stageRef.current) return;
    setIsExporting(true);
    setExportProgress(0);

    const totalEstimatedMs = 12000; // Simulated export sequence duration
    const blob = await recordSceneSequence(stageRef.current, totalEstimatedMs, (prog) => {
      setExportProgress(prog);
    });

    if (blob) {
      downloadBlob(blob, `12-Ghar-Kundali-Video-${scriptMode}.webm`);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
    }

    setIsExporting(false);
    setExportProgress(0);
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Studio Navbar */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-zinc-950 font-black shadow-lg shadow-amber-500/20">
            <Compass className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-black font-['Cinzel',serif] tracking-wider text-white">
                Jyotish 12 Ghar
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase border border-amber-500/30">
                Video Studio
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              AI-Driven Animation & Synchronized Voiceover Engine • North Indian Kundali
            </p>
          </div>
        </div>

        {/* Quick studio action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsScriptEditorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Edit Scripts</span>
          </button>

          <button
            onClick={() => setIsAiScriptModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Script Writer</span>
          </button>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* Video Canvas Stage */}
        <section aria-label="Video Player Stage" className="flex justify-center">
          <VideoStage
            stageRef={stageRef}
            currentSceneType={currentSceneType}
            currentHouse={currentHouse}
            activeHouseId={currentHouse?.id ?? null}
            aspectRatio={aspectRatio}
            visualMode={visualMode}
            currentSubtitles={currentNarrationText}
            activeCharIndex={activeCharIndex}
            isPlaying={isPlaying}
            onSelectHouse={handleSelectHouse}
            speakerName="Sanskar Aggarwal"
          />
        </section>

        {/* Timeline & Director Control Bar */}
        <section aria-label="Timeline Controls">
          <TimelineController
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onRestart={handleRestart}
            currentSceneIndex={currentSceneIndex}
            totalScenes={totalScenes}
            onSelectSceneIndex={handleSelectSceneIndex}
            onNextScene={handleNextScene}
            onPrevScene={handlePrevScene}
            scriptMode={scriptMode}
            onChangeScriptMode={(mode) => {
              setScriptMode(mode);
              if (isPlaying) {
                setTimeout(() => playCurrentSceneNarration(currentSceneIndex), 50);
              }
            }}
            aspectRatio={aspectRatio}
            onChangeAspectRatio={setAspectRatio}
            visualMode={visualMode}
            onChangeVisualMode={setVisualMode}
            voiceSettings={voiceSettings}
            onUpdateVoiceSettings={(updated) => setVoiceSettings((prev) => ({ ...prev, ...updated }))}
            onOpenAiGenerator={() => setIsAiScriptModalOpen(true)}
            onExportVideo={handleExportVideo}
            isExporting={isExporting}
            exportProgress={exportProgress}
          />
        </section>

        {/* 12 Houses Comprehensive Matrix / Quick Navigator */}
        <section aria-label="House Matrix">
          <HouseGridReference
            activeHouseId={currentHouse?.id ?? null}
            onSelectHouse={handleSelectHouse}
            onInspectHouse={(h) => setSelectedHouseForDetail(h)}
          />
        </section>
      </main>

      {/* Studio Modals */}
      <AiScriptModal
        isOpen={isAiScriptModalOpen}
        onClose={() => setIsAiScriptModalOpen(false)}
        onApplyCustomScript={(scriptsMap) => {
          setCustomScripts(scriptsMap);
          setScriptMode('custom');
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 } });
        }}
      />

      <ScriptEditorModal
        isOpen={isScriptEditorOpen}
        onClose={() => setIsScriptEditorOpen(false)}
        customScripts={customScripts}
        scriptMode={scriptMode}
        onSaveScripts={(newScripts) => {
          setCustomScripts(newScripts);
          setScriptMode('custom');
        }}
      />

      <HouseDetailModal
        house={selectedHouseForDetail}
        onClose={() => setSelectedHouseForDetail(null)}
        onPlayHouse={(houseId) => handleSelectHouse(houseId)}
      />

      {/* Studio Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Vedic Kundali 12 Houses Animation & Synchronized Voiceover Studio</span>
          </div>
          <div>Original Script Reference: "12 Ghar — Ek Line Mein" & North Indian Janam Kundali</div>
        </div>
      </footer>
    </div>
  );
}
