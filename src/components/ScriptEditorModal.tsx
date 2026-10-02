import React, { useState } from 'react';
import { HOUSES_DATA } from '../data/housesData';
import { ScriptMode } from '../types';
import { X, Save, RotateCcw, Edit3 } from 'lucide-react';

interface ScriptEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  customScripts: Record<number, string>;
  onSaveScripts: (scripts: Record<number, string>) => void;
  scriptMode: ScriptMode;
}

export const ScriptEditorModal: React.FC<ScriptEditorModalProps> = ({
  isOpen,
  onClose,
  customScripts,
  onSaveScripts,
  scriptMode,
}) => {
  const [editedScripts, setEditedScripts] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    HOUSES_DATA.forEach((h) => {
      initial[h.id] =
        customScripts[h.id] ||
        (scriptMode === 'oneLineHinglish'
          ? h.defaultScripts.oneLineHinglish
          : scriptMode === 'deepHindi'
          ? h.defaultScripts.deepHindi
          : h.defaultScripts.englishMaster);
    });
    return initial;
  });

  if (!isOpen) return null;

  const handleChange = (id: number, text: string) => {
    setEditedScripts((prev) => ({
      ...prev,
      [id]: text,
    }));
  };

  const handleReset = () => {
    const initial: Record<number, string> = {};
    HOUSES_DATA.forEach((h) => {
      initial[h.id] = h.defaultScripts.oneLineHinglish;
    });
    setEditedScripts(initial);
  };

  const handleSave = () => {
    onSaveScripts(editedScripts);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-['Cinzel',serif] text-white">
                Customize Video Narration Scripts
              </h3>
              <p className="text-xs text-zinc-400">
                Tailor the exact voiceover text spoken for each house
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

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-left">
          {HOUSES_DATA.map((h) => (
            <div
              key={`edit-house-${h.id}`}
              className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-950 font-black text-xs"
                    style={{ backgroundColor: h.visualTheme.color }}
                  >
                    {h.id}
                  </div>
                  <span className="text-sm font-bold text-white font-['Cinzel',serif]">
                    {h.sanskritName}
                  </span>
                  <span className="text-xs text-amber-400">({h.hindiOneLine})</span>
                </div>
              </div>

              <textarea
                value={editedScripts[h.id] || ''}
                onChange={(e) => handleChange(h.id, e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs md:text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-amber-500 resize-none font-sans"
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-900/80 border-t border-zinc-800 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Original</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Apply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
