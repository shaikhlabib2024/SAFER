import React from 'react';
import {
  Navigation,
  LifeBuoy,
  FileSpreadsheet,
  Radio,
  Sparkles,
  Satellite,
  Sun,
  Moon,
  PhoneCall,
  SlidersHorizontal,
} from 'lucide-react';
import type { PortalMode } from '../types';

interface NavbarProps {
  portalMode: PortalMode;
  setPortalMode: (mode: PortalMode) => void;
  selectedRegion: 'bangladesh' | 'nepal';
  setSelectedRegion: (region: 'bangladesh' | 'nepal') => void;
  isLiveMode: boolean;
  setIsLiveMode: (live: boolean) => void;
  isDemoMode: boolean;
  setIsDemoMode: (demo: boolean) => void;
  onOpenAuditModal: () => void;
  onOpenNasaModal: () => void;
  securedPercentage: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAccessibility: () => void;
  onOpenHotlines: () => void;
  simplifiedMode: boolean;
  onToggleSimplifiedMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  portalMode,
  setPortalMode,
  selectedRegion,
  setSelectedRegion,
  isLiveMode,
  setIsLiveMode,
  isDemoMode,
  setIsDemoMode,
  onOpenAuditModal,
  onOpenNasaModal,
  securedPercentage,
  isDarkMode,
  onToggleDarkMode,
  onOpenAccessibility,
  onOpenHotlines,
  simplifiedMode,
  onToggleSimplifiedMode,
}) => {
  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 px-3 sm:px-4 py-2 shadow-xs transition-colors">
      <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Brand & NASA Datasets Button */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 via-sky-600 to-teal-500 flex items-center justify-center p-1.5 shadow-md shadow-teal-500/25 shrink-0">
              <img
                src={`${import.meta.env.BASE_URL}favicon.svg`}
                alt="S.A.F.E.R. Logo"
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
                  S.A.F.E.R.
                </span>
                <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  v2.0
                </span>
                <button
                  onClick={onToggleSimplifiedMode}
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                    simplifiedMode
                      ? 'bg-amber-500 text-white shadow-xs animate-pulse ring-2 ring-amber-300'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                  title={simplifiedMode ? 'Exit Easy Mode (Return to full tactical map)' : 'Switch to Easy Mode for ages 10 to 80'}
                >
                  {simplifiedMode ? '🌟 Easy Mode' : '🌟 Easy Mode'}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate max-w-[210px] sm:max-w-none">
                Satellite-Assisted Flood & Evacuation Router
              </p>
            </div>
          </div>

          {/* NASA DATASETS BUTTON */}
          <button
            onClick={onOpenNasaModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-sky-50 to-teal-50 hover:from-sky-100 hover:to-teal-100 dark:from-sky-950/40 dark:to-teal-950/40 dark:hover:from-sky-900/50 dark:hover:to-teal-900/50 text-sky-900 dark:text-sky-200 border-2 border-sky-400/80 dark:border-sky-600 shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            title="Inspect authentic NASA Earth Science datasets (GPM, SMAP, SRTM, POWER)"
          >
            <Satellite className="w-4 h-4 text-sky-600 dark:text-sky-400 animate-pulse" />
            <span className="font-extrabold hidden sm:inline">NASA Datasets</span>
            <span className="font-extrabold sm:hidden">NASA</span>
          </button>
        </div>

        {/* Center: Live Real-Time Radar Badge vs Demo Scenarios */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {/* Live Real-Time Radar Badge */}
          <button
            onClick={() => {
              setIsLiveMode(true);
              setIsDemoMode(false);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              !isDemoMode && isLiveMode
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30 ring-2 ring-red-400/50 scale-[1.02]'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
            }`}
            title="Switch to Real-Time Live Map showing field GPS and active sensors"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  !isDemoMode ? 'bg-white' : 'bg-red-400'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  !isDemoMode ? 'bg-white' : 'bg-red-600'
                }`}
              ></span>
            </span>
            <Radio className="w-3.5 h-3.5" />
            <span>LIVE RESCUE MAP</span>
          </button>

          {/* DEMO SCENARIOS BUTTON */}
          <button
            onClick={() => {
              setIsDemoMode(!isDemoMode);
              if (!isDemoMode) {
                setSelectedRegion('bangladesh');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              isDemoMode
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/30 ring-2 ring-amber-300'
                : 'bg-gradient-to-r from-amber-50 via-sky-50 to-teal-50 dark:from-amber-950/40 dark:via-sky-950/40 dark:to-teal-950/40 text-slate-800 dark:text-slate-100 border-2 border-amber-300 dark:border-amber-700 hover:scale-[1.02] shadow-xs'
            }`}
            title={`Click to view interactive flood demo simulations (${
              selectedRegion === 'bangladesh' ? 'Feni 2024' : 'Nepal 2024'
            })`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {isDemoMode
                ? `DEMO: ${selectedRegion === 'bangladesh' ? 'Feni 2024' : 'Nepal 2024'}`
                : '🎯 Demo Scenarios'}
            </span>
          </button>
        </div>

        {/* Right Side: Dual-Portal Switcher, Accessibility, Hotlines & Dark Mode */}
        <div className="flex items-center gap-1.5 sm:gap-2 w-full md:w-auto justify-end flex-wrap">
          {/* DUAL-PORTAL MODE SWITCHER */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <button
              onClick={() => setPortalMode('victim')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                portalMode === 'victim'
                  ? 'bg-gradient-to-r from-teal-600 to-sky-600 text-white shadow-sm ring-2 ring-teal-400/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Victim / Citizen</span>
            </button>

            <button
              onClick={() => setPortalMode('rescuer')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                portalMode === 'rescuer'
                  ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 text-white shadow-md ring-2 ring-amber-400/70'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold'
              }`}
            >
              <LifeBuoy className="w-3.5 h-3.5 text-amber-400" />
              <span>Rescuer</span>
            </button>
          </div>

          {/* RELIEF AUDIT BUTTON (Visible in Rescuer mode) */}
          {portalMode === 'rescuer' && (
            <button
              onClick={onOpenAuditModal}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white transition-all shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/40 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              title="Generate Relief & Operation Audit SitRep"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden lg:inline">Relief Audit ({securedPercentage}%)</span>
              <span className="lg:hidden">Audit</span>
            </button>
          )}

          {/* 1-TAP EMERGENCY HOTLINES BUTTON (999 / 1090) */}
          <button
            onClick={onOpenHotlines}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-black bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/30 ring-2 ring-red-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            title="Open 1-Tap Emergency Hotline Directory (999 / 1090 / 112)"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">999 / 1090</span>
          </button>

          {/* ACCESSIBILITY & AGE 10-80 SETTINGS BUTTON */}
          <button
            onClick={onOpenAccessibility}
            className={`flex items-center gap-1 p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              simplifiedMode
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700 ring-2 ring-amber-400/50'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="Accessibility, Text Size, Voice Reader & Easy Mode for Ages 10-80"
            aria-label="Open Accessibility & Display Settings"
          >
            <SlidersHorizontal className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </button>

          {/* DIRECT 1-CLICK DARK MODE TOGGLE */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode (Night Rescue)'}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
