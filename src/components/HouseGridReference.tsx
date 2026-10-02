import React, { useState } from 'react';
import { HOUSES_DATA } from '../data/housesData';
import { HouseData } from '../types';
import { Compass, Filter, Sparkles, Play, Info } from 'lucide-react';

interface HouseGridReferenceProps {
  activeHouseId: number | null;
  onSelectHouse: (id: number) => void;
  onInspectHouse: (house: HouseData) => void;
}

export const HouseGridReference: React.FC<HouseGridReferenceProps> = ({
  activeHouseId,
  onSelectHouse,
  onInspectHouse,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredHouses = HOUSES_DATA.filter((h) => {
    if (filterCategory === 'all') return true;
    return h.category.toLowerCase() === filterCategory.toLowerCase();
  });

  return (
    <div className="w-full bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 shadow-2xl space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-amber-400 uppercase">
            <Compass className="w-4 h-4 text-amber-500" />
            <span>Kundli Blueprint Matrix</span>
          </div>
          <h3 className="text-xl font-bold font-['Cinzel',serif] text-white mt-1">
            12 Houses Quick Navigator & Astrological Significance
          </h3>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-900 rounded-xl border border-zinc-800 text-xs">
          {[
            { id: 'all', label: 'All 12' },
            { id: 'kendra', label: 'Kendras (1,4,7,10)' },
            { id: 'trikona', label: 'Trikonas (1,5,9)' },
            { id: 'dusthana', label: 'Dusthana (6,8,12)' },
            { id: 'upachaya', label: 'Upachaya (3,6,10,11)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterCategory === cat.id
                  ? 'bg-amber-500 text-zinc-950 shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Houses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredHouses.map((house) => {
          const isActive = activeHouseId === house.id;

          return (
            <div
              key={`grid-house-${house.id}`}
              className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between group ${
                isActive
                  ? 'bg-amber-500/10 border-amber-500 shadow-xl shadow-amber-500/10 scale-[1.02]'
                  : 'bg-zinc-900/50 hover:bg-zinc-900/90 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-950 font-black text-sm shadow-md"
                      style={{ backgroundColor: house.visualTheme.color }}
                    >
                      {house.id}
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-amber-400">
                        {house.category}
                      </div>
                      <div className="text-sm font-bold text-white font-['Cinzel',serif]">
                        {house.sanskritName.split(' ')[0]}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                    {house.roman}
                  </span>
                </div>

                {/* 1-Line Script Hook (Image 1) */}
                <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-amber-200 text-xs font-medium">
                  "{house.hindiOneLine}"
                </div>

                {/* Tags from Image 2 */}
                <div className="flex flex-wrap gap-1">
                  {house.chartEnglishTags.slice(0, 3).map((t, idx) => (
                    <span
                      key={`grid-tag-${idx}`}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800/60 text-zinc-300 border border-zinc-700/40"
                    >
                      {t}
                    </span>
                  ))}
                  {house.chartEnglishTags.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded text-zinc-500">
                      +{house.chartEnglishTags.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-800/60 text-xs">
                <button
                  onClick={() => onInspectHouse(house)}
                  className="text-zinc-400 hover:text-white flex items-center gap-1 font-medium transition-colors"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Deep Dive</span>
                </button>

                <button
                  onClick={() => onSelectHouse(house.id)}
                  className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-amber-500 text-zinc-950'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isActive ? 'Active' : 'Play'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
