import React from 'react';
import {
  Sun,
  Moon,
  Laptop,
  Type,
  Contrast,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  Phone,
  X,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react';
import { soundBeacon, speakText, stopSpeaking } from '../services/accessibilityService';

export type TextSize = 'normal' | 'large' | 'extra-large';
export type ThemeMode = 'light' | 'dark' | 'system';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onSetTheme: (theme: ThemeMode) => void;
  textSize: TextSize;
  onSetTextSize: (size: TextSize) => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  simplifiedMode: boolean;
  onToggleSimplifiedMode: () => void;
  isBeaconActive: boolean;
  setIsBeaconActive: (active: boolean) => void;
  onOpenHotlines: () => void;
  currentAlertText?: string;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
  theme,
  onSetTheme,
  textSize,
  onSetTextSize,
  highContrast,
  onToggleHighContrast,
  simplifiedMode,
  onToggleSimplifiedMode,
  isBeaconActive,
  setIsBeaconActive,
  onOpenHotlines,
  currentAlertText,
}) => {
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  if (!isOpen) return null;

  const handleToggleBeacon = () => {
    if (isBeaconActive) {
      soundBeacon.stop((active) => setIsBeaconActive(active));
    } else {
      soundBeacon.start((active) => setIsBeaconActive(active));
    }
  };

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    const textToRead =
      currentAlertText ||
      'S.A.F.E.R. Emergency Flood Assistant. Stay on high ground. If you are stranded or water is rising, press the red SOS button or call emergency hotline 999. Do not enter moving water.';

    speakText(
      textToRead,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-settings-title"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-6 transition-colors">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-sky-700 to-indigo-800 text-white p-5 sm:p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5" /> Universal Design (Ages 10 – 80+)
              </span>
            </div>
            <h2 id="accessibility-settings-title" className="text-lg sm:text-xl font-black">
              Display & Accessibility Assistant
            </h2>
            <p className="text-xs text-teal-100 mt-1">
              Customized comfort for children, seniors, low-vision, and emergency night conditions.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
            aria-label="Close accessibility settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto panel-scroll-container">
          {/* 1. Theme Selection (Light / Dark / System) */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-500" /> Theme Mode (Day & Night Rescue)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onSetTheme('light')}
                className={`py-3 px-3 rounded-2xl border-2 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 ring-2 ring-sky-400/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-500" />
                <span>Light Mode</span>
              </button>

              <button
                type="button"
                onClick={() => onSetTheme('dark')}
                className={`py-3 px-3 rounded-2xl border-2 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 ring-2 ring-sky-400/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Moon className="w-5 h-5 text-indigo-400" />
                <span>Dark Mode</span>
              </button>

              <button
                type="button"
                onClick={() => onSetTheme('system')}
                className={`py-3 px-3 rounded-2xl border-2 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  theme === 'system'
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 ring-2 ring-sky-400/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Laptop className="w-5 h-5 text-teal-500" />
                <span>Device System</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Dark mode turns map tiles dark and protects night vision during midnight flood power outages.
            </p>
          </div>

          {/* 2. Text Sizing for Seniors and Children */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Text Size & Readability
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onSetTextSize('normal')}
                className={`py-2.5 px-3 rounded-2xl border-2 font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  textSize === 'normal'
                    ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-xs font-bold">Standard (100%)</span>
              </button>

              <button
                type="button"
                onClick={() => onSetTextSize('large')}
                className={`py-2.5 px-3 rounded-2xl border-2 font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  textSize === 'large'
                    ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-sm font-extrabold">Large (+15%)</span>
              </button>

              <button
                type="button"
                onClick={() => onSetTextSize('extra-large')}
                className={`py-2.5 px-3 rounded-2xl border-2 font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  textSize === 'extra-large'
                    ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-base font-black">Extra Large (+25%)</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Increases button and text sizes across the whole app for comfortable reading without glasses.
            </p>
          </div>

          {/* 3. High Contrast Mode Toggle */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Contrast className="w-4 h-4 text-sky-600 dark:text-sky-400" /> High Contrast Outlines
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Sharper borders and higher contrast for glare under heavy rain or sunlight.
              </p>
            </div>
            <button
              type="button"
              onClick={onToggleHighContrast}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                highContrast ? 'bg-sky-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              role="switch"
              aria-checked={highContrast}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  highContrast ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 4. Senior & Junior Simplified View Mode */}
          <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border-2 border-teal-200 dark:border-teal-800 flex items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" /> Easy / Senior & Junior Mode
              </span>
              <p className="text-[11px] text-teal-800 dark:text-teal-300 leading-snug">
                Replaces complex satellite graphs with giant, simple buttons: Safe High Ground, Call Help, and Push SOS. Perfect for 10-year-olds and 80-year-olds in panic.
              </p>
            </div>
            <button
              type="button"
              onClick={onToggleSimplifiedMode}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 shadow-xs ${
                simplifiedMode
                  ? 'bg-teal-700 text-white ring-2 ring-teal-400'
                  : 'bg-white dark:bg-slate-800 text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-700 hover:bg-teal-100'
              }`}
            >
              {simplifiedMode ? '✓ ACTIVE' : 'Enable'}
            </button>
          </div>

          {/* 5. Sound & Voice Assistance (TTS & Acoustic Rescue Whistle) */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Audio Assistance & Distress Beacon
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Voice Read Aloud */}
              <button
                type="button"
                onClick={handleReadAloud}
                className={`p-3 rounded-2xl border-2 flex items-center gap-3 text-left transition-all cursor-pointer ${
                  isSpeaking
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-400'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 shrink-0">
                  {isSpeaking ? <VolumeX className="w-5 h-5 animate-pulse" /> : <Volume2 className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    {isSpeaking ? 'Stop Reading' : '🔊 Read Instructions Aloud'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Voice speech assistant for seniors and kids who cannot read the screen.
                  </p>
                </div>
              </button>

              {/* Acoustic Whistle / Distress Beacon */}
              <button
                type="button"
                onClick={handleToggleBeacon}
                className={`p-3 rounded-2xl border-2 flex items-center gap-3 text-left transition-all cursor-pointer ${
                  isBeaconActive
                    ? 'border-red-600 bg-red-50 dark:bg-red-950/50 text-red-950 dark:text-red-200 ring-2 ring-red-400 pulse-beacon-btn'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 shrink-0">
                  <Radio className={`w-5 h-5 ${isBeaconActive ? 'animate-ping' : ''}`} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    {isBeaconActive ? '🛑 STOP Loud Whistle' : '📢 Sound Acoustic Whistle'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    High-pitch emergency whistle (2.8 kHz) to guide search boats in the dark.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* 6. Quick Emergency Hotlines Link */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-600" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                National Disaster Hotlines (999 / 1090 / 112)
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenHotlines();
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-red-600 hover:bg-red-700 text-white transition-all shadow-xs cursor-pointer"
            >
              Open Phone Directory
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Settings automatically saved</span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-xs font-black bg-slate-900 hover:bg-slate-800 text-white dark:bg-teal-600 dark:hover:bg-teal-500 transition-all cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
