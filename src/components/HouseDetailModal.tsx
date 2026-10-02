import React, { useState } from 'react';
import { HouseData } from '../types';
import { Sparkles, Play, X, Shield, BookOpen, AlertCircle, Compass, Loader2 } from 'lucide-react';

interface HouseDetailModalProps {
  house: HouseData | null;
  onClose: () => void;
  onPlayHouse: (houseId: number) => void;
}

export const HouseDetailModal: React.FC<HouseDetailModalProps> = ({
  house,
  onClose,
  onPlayHouse,
}) => {
  const [deepDiveData, setDeepDiveData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (!house) return null;

  const handleFetchAiSecret = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/deep-dive-house', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          houseNumber: house.id,
          houseName: house.sanskritName,
          significations: house.chartEnglishTags.join(', '),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setDeepDiveData(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-zinc-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div
          className="p-6 border-b border-zinc-800 flex items-center justify-between"
          style={{
            background: `linear-gradient(to right, ${house.visualTheme.color}22, #09090b)`,
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-zinc-950 font-black text-2xl shadow-xl"
              style={{ backgroundColor: house.visualTheme.color }}
            >
              {house.id}
            </div>
            <div className="text-left">
              <span className="text-xs font-mono font-bold tracking-wider text-amber-400 uppercase">
                {house.categoryLabel}
              </span>
              <h3 className="text-2xl font-bold font-['Cinzel',serif] text-white">
                {house.sanskritName}
              </h3>
              <p className="text-xs text-zinc-400">{house.hindiTitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable details */}
        <div className="p-6 overflow-y-auto space-y-5 text-left flex-1">
          {/* Exact One-Liner from Image 1 */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
            <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">
              Script 1-Liner (12 Ghar — Ek Line Mein):
            </div>
            <div className="text-lg md:text-xl font-bold">"{house.hindiOneLine}"</div>
          </div>

          {/* Kundli Significations from Image 2 */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Kundli Chart Significations (Image 2 Blueprint)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {house.chartEnglishTags.map((tag, idx) => (
                <span
                  key={`modal-tag-${idx}`}
                  className="px-3 py-1 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Technical Jyotish Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-zinc-500 block">Significator (Karaka)</span>
              <span className="text-amber-400 font-bold text-sm">{house.karaka}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-zinc-500 block">Natural Sign</span>
              <span className="text-zinc-200 font-bold text-sm">{house.naturalZodiacSign}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-zinc-500 block">Vedic Element</span>
              <span className="text-zinc-200 font-bold text-sm">{house.element}</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-zinc-500 block">Body Part</span>
              <span className="text-zinc-200 font-bold text-sm truncate">{house.bodyPart}</span>
            </div>
          </div>

          {/* AI Esoteric Insights & Remedy Section */}
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  AI Astrological Secret & Practical Tip
                </span>
              </div>

              {!deepDiveData && (
                <button
                  onClick={handleFetchAiSecret}
                  disabled={loading}
                  className="px-3 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Consulting AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3" />
                      <span>Reveal Secret</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {deepDiveData && (
              <div className="space-y-3 text-xs pt-1 animate-in fade-in duration-300">
                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-purple-200">
                  <span className="font-bold text-purple-300 block mb-1">Astrological Secret:</span>
                  <p className="leading-relaxed">{deepDiveData.astrologicalSecret}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-200">
                  <span className="font-bold text-emerald-300 block mb-1">Practical Recommendation / Tip:</span>
                  <p className="leading-relaxed">{deepDiveData.practicalTip}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-900/80 border-t border-zinc-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
          >
            Close
          </button>

          <button
            onClick={() => {
              onPlayHouse(house.id);
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Play House {house.id} Video Scene</span>
          </button>
        </div>
      </div>
    </div>
  );
};
