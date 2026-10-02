export interface HouseData {
  id: number;
  roman: string;
  sanskritName: string;
  hindiTitle: string;
  hindiOneLine: string;
  chartEnglishTags: string[];
  category: 'Kendra' | 'Trikona' | 'Dusthana' | 'Upachaya' | 'Maraka';
  categoryLabel: string;
  karaka: string;
  naturalZodiacSign: string;
  element: 'Agni (Fire)' | 'Prithvi (Earth)' | 'Vayu (Air)' | 'Jal (Water)';
  bodyPart: string;
  defaultScripts: {
    oneLineHinglish: string;
    deepHindi: string;
    englishMaster: string;
  };
  customScript?: string;
  durationSec: number;
  visualTheme: {
    color: string;
    glow: string;
    border: string;
    bgGradient: string;
    icon: string;
  };
}

export type ScriptMode = 'oneLineHinglish' | 'deepHindi' | 'englishMaster' | 'custom';

export type AspectRatio = '16:9' | '9:16' | '1:1';

export type VisualMode = 'split' | 'kundliFocus' | 'slideOnly' | 'cinematicReels';

export interface Scene {
  id: string;
  type: 'intro' | 'house' | 'outro';
  houseNumber?: number;
  title: string;
  subtitle: string;
  narrationText: string;
  durationSec: number;
}

export interface VoiceSettings {
  voiceURI: string;
  rate: number;
  pitch: number;
  volume: number;
  ambientVolume: number;
  isAmbientEnabled: boolean;
  autoAdvance: boolean;
  selectedLanguage: 'hi-IN' | 'en-IN' | 'en-US';
}
