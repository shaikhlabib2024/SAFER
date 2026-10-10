import React from 'react';
import {
  Navigation,
  LifeBuoy,
  FileSpreadsheet,
  Radio,
  Sparkles,
  Satellite,
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
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-3 sm:px-4 py-2.5 shadow-xs">
      <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Brand & NASA Datasets Button */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 via-sky-600 to-teal-500 flex items-center justify-center p-1.5 shadow-md shadow-teal-500/25">
              <img src="/favicon.svg" alt="S.A.F.E.R. Logo" className="w-full h-full object-contain filter drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-slate-900">S.A.F.E.R.</span>
                <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 border border-teal-200">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold truncate max-w-[210px] sm:max-w-none">
                Satellite-Assisted Flood & Evacuation Router
              </p>
            </div>
          </div>

          {/* HIGHLIGHTED NASA DATASETS BUTTON */}
          <button
            onClick={onOpenNasaModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-sky-50 to-teal-50 hover:from-sky-100 hover:to-teal-100 text-sky-900 border-2 border-sky-400/80 shadow-xs shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            title="Inspect authentic NASA Earth Science datasets (GPM, SMAP, SRTM, POWER)"
          >
            <Satellite className="w-4 h-4 text-sky-600 animate-pulse" />
            <span className="font-extrabold">NASA Datasets</span>
          </button>
        </div>

        {/* Center: Live Real-Time Operations vs Demo Scenarios Launcher */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {/* Live Real-Time Radar Badge (Active by default) */}
          <button
            onClick={() => {
              setIsLiveMode(true);
              setIsDemoMode(false);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              !isDemoMode && isLiveMode
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30 ring-2 ring-red-400/50 scale-[1.02]'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Switch to Real-Time Live Map showing field GPS and active sensors"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${!isDemoMode ? 'bg-white' : 'bg-red-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${!isDemoMode ? 'bg-white' : 'bg-red-600'}`}></span>
            </span>
            <Radio className="w-3.5 h-3.5" />
            <span>LIVE RESCUE MAP</span>
          </button>

          {/* HIGHLIGHTED DEMO SCENARIOS BUTTON */}
          <button
            onClick={() => {
              setIsDemoMode(!isDemoMode);
              if (!isDemoMode) {
                // When activating demo mode, default to Bangladesh Feni 2024
                setSelectedRegion('bangladesh');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              isDemoMode
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/30 ring-2 ring-amber-300'
                : 'bg-gradient-to-r from-amber-50 via-sky-50 to-teal-50 text-slate-800 border-2 border-amber-300 hover:border-amber-400 hover:scale-[1.02] shadow-xs'
            }`}
            title={`Click to view interactive flood demo simulations (${selectedRegion === 'bangladesh' ? 'Feni 2024' : 'Nepal 2024'})`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{isDemoMode ? `DEMO: ${selectedRegion === 'bangladesh' ? 'Feni 2024' : 'Nepal 2024'}` : '🎯 Demo Scenarios'}</span>
          </button>
        </div>

        {/* Right Side: Dual-Portal Switcher & Relief Audit SitRep */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* HIGHLIGHTED PORTAL MODE SWITCHER */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setPortalMode('victim')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                portalMode === 'victim'
                  ? 'bg-gradient-to-r from-teal-600 to-sky-600 text-white shadow-sm ring-2 ring-teal-400/40'
                  : 'text-slate-600 hover:text-slate-900 font-bold'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Victim / Citizen</span>
            </button>

            <button
              onClick={() => setPortalMode('rescuer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                portalMode === 'rescuer'
                  ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white shadow-md ring-2 ring-amber-400/70'
                  : 'text-slate-600 hover:text-slate-900 font-bold'
              }`}
            >
              <LifeBuoy className="w-3.5 h-3.5 text-amber-400" />
              <span>Rescuer Command</span>
            </button>
          </div>

          {/* HIGHLIGHTED RELIEF AUDIT BUTTON (Visible in Rescuer mode) */}
          {portalMode === 'rescuer' && (
            <button
              onClick={onOpenAuditModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white transition-all shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/40 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              title="Generate Relief & Operation Audit SitRep"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden sm:inline">Relief Audit ({securedPercentage}%)</span>
              <span className="sm:hidden">Audit</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
