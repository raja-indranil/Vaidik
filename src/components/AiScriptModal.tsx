import React, { useState } from 'react';
import { HOUSES_DATA } from '../data/housesData';
import { Sparkles, Loader2, Check, RefreshCw, BookOpen, Wand2, X } from 'lucide-react';

interface AiScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCustomScript: (customScriptsMap: Record<number, string>) => void;
}

export const AiScriptModal: React.FC<AiScriptModalProps> = ({
  isOpen,
  onClose,
  onApplyCustomScript,
}) => {
  const [style, setStyle] = useState('Viral Hinglish Reel (Catchy & Crisp)');
  const [language, setLanguage] = useState('Hinglish');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          style,
          language,
          targetAudience: 'Vedic Astrology learners and video viewers',
        }),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || 'Failed to generate script');
      }

      setGeneratedData(json.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with AI service');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!generatedData || !generatedData.houses) return;
    const map: Record<number, string> = {};
    generatedData.houses.forEach((h: any) => {
      map[h.houseNumber] = h.narration;
    });
    onApplyCustomScript(map);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-['Cinzel',serif] text-white">
                AI Script Studio & Narrator
              </h3>
              <p className="text-xs text-zinc-400">
                Generate synchronized custom voiceover scripts powered by Gemini AI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
          {/* Options grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Narrative Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Viral Hinglish Reel (Catchy & Crisp)">
                  Viral Hinglish Reel (Catchy & Fast)
                </option>
                <option value="Deep Vedic Jyotish (Spiritual Wisdom & Shlokas)">
                  Deep Vedic Jyotish (Spiritual & Traditional)
                </option>
                <option value="Modern Youth Explainer (Super Simple & Relatable)">
                  Modern Explainer (Simple & Relatable)
                </option>
                <option value="Academic Astrologer Lecture (Technical & In-Depth)">
                  Academic Astrologer Lecture (In-Depth)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Language Formulation
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Hinglish">Hinglish (Conversational Hindi + English)</option>
                <option value="Hindi">Shuddh Hindi (Pure Hindi)</option>
                <option value="English">English (Global Astrological)</option>
              </select>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:brightness-110 text-white font-bold text-sm shadow-xl shadow-purple-600/25 flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Script...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate AI Script</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs">
              {error}
            </div>
          )}

          {/* Generated Result Preview */}
          {generatedData && (
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  AI Generated Script Preview
                </span>
                <span className="text-xs text-zinc-400">{generatedData.houses?.length || 0} Houses Ready</span>
              </div>

              {generatedData.intro && (
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs">
                  <span className="text-amber-400 font-bold uppercase mr-2">Intro Hook:</span>
                  <span className="text-zinc-200 italic">"{generatedData.intro}"</span>
                </div>
              )}

              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {generatedData.houses?.map((h: any) => (
                  <div
                    key={`gen-house-${h.houseNumber}`}
                    className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-md bg-amber-500 text-black font-black flex items-center justify-center shrink-0 text-xs">
                      {h.houseNumber}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-white mb-0.5">
                        {h.sanskritName || `House ${h.houseNumber}`}
                        {h.oneLiner && <span className="text-zinc-400 font-normal"> — {h.oneLiner}</span>}
                      </div>
                      <div className="text-zinc-300">{h.narration}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-zinc-900/80 border-t border-zinc-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
          >
            Cancel
          </button>

          {generatedData && (
            <button
              onClick={handleApply}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Apply Script to Video Player</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
