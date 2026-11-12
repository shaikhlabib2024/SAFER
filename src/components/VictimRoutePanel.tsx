import React, { useState } from 'react';
import {
  Navigation,
  ShieldAlert,
  Home,
  PanelLeftClose,
  Volume2,
  VolumeX,
  Compass,
} from 'lucide-react';
import type { Shelter, EvacuationRoute } from '../types';
import { speakText, stopSpeaking } from '../services/accessibilityService';

interface VictimRoutePanelProps {
  region: 'bangladesh' | 'nepal';
  shelters: Shelter[];
  evacuationRoute: EvacuationRoute | null;
  onCalculateRoute: () => void;
  onMinimize?: () => void;
}

export const VictimRoutePanel: React.FC<VictimRoutePanelProps> = ({
  region,
  shelters,
  evacuationRoute,
  onCalculateRoute,
  onMinimize,
}) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const nearestShelter = shelters.find((s) => s.region === region);

  const handleSpeakRoute = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    let speechText = '';
    if (evacuationRoute) {
      const steps = evacuationRoute.instructions.map((i) => `Step ${i.step}: ${i.text}`).join('. ');
      speechText = `Evacuation Route to ${nearestShelter?.name || 'High Ground Shelter'}. Estimated time: ${evacuationRoute.estimatedTimeMin} minutes. Elevation gain: plus ${evacuationRoute.elevationGainMeters} meters. ${steps}`;
    } else {
      speechText = `Warning: High water levels in this sector. Nearest safe dry shelter is ${nearestShelter?.name || 'Verified Refuge'}, elevation plus ${nearestShelter?.elevation} meters. Tap the blue button to display your safe walking route.`;
    }

    speakText(
      speechText,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs flex flex-col h-full min-h-0 transition-colors">
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
            <Navigation className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">Safe Route & Refuge</h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">High-ground guidance away from floodwaters</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Read aloud button for seniors / kids */}
          <button
            onClick={handleSpeakRoute}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-400/50'
                : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Read route instructions aloud"
            aria-label="Read directions aloud"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {onMinimize && (
            <button
              onClick={onMinimize}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title="Minimize route panel"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 panel-scroll-container space-y-3 pt-2">
        {/* Real-time Threat & Elevation Awareness Banner */}
        <div className="bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950/40 dark:to-amber-950/30 border border-red-200 dark:border-red-900/60 rounded-2xl p-3 shadow-xs">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-300 shrink-0 mt-0.5">
              <ShieldAlert className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-red-900 dark:text-red-200">
                  {region === 'bangladesh' ? 'Feni Muhuri River Flood Surge Active' : 'Kathmandu Valley Flash Flood Warning'}
                </span>
                <span className="text-[9px] uppercase font-black bg-red-600 text-white px-1.5 py-0.2 rounded-full">
                  Danger Zone
                </span>
              </div>
              <p className="text-[11px] text-red-700 dark:text-red-300 mt-1 leading-snug">
                Ground elevation: low ({region === 'bangladesh' ? '+4.2m' : '1,285m'}). Water levels cresting.
                Avoid submerged underpasses; follow high-ground ridge routes.
              </p>
            </div>
          </div>
        </div>

        {/* Nearest High-Ground Shelter Card */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-2xs space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold text-xs">
              <Home className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Nearest Dry Shelter</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-2 py-0.2 rounded-full">
              Dry & Operating
            </span>
          </div>

          {nearestShelter && (
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-xs">{nearestShelter.name}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Safe Elevation: <b className="text-teal-700 dark:text-teal-400">+{nearestShelter.elevation}m</b> | Verified High Ground
              </p>
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                <span>Occupancy: <b>{nearestShelter.currentOccupancy} / {nearestShelter.capacity} beds</b></span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {nearestShelter.facilities.map((fac, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 px-1.5 py-0.2 rounded font-medium"
                  >
                    ✓ {fac}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SHOW SAFE ROUTE BUTTON */}
        <button
          onClick={onCalculateRoute}
          className="w-full py-2.5 px-3 rounded-xl font-black text-xs bg-gradient-to-r from-teal-600 via-sky-600 to-teal-700 hover:from-teal-700 hover:to-sky-700 text-white shadow-md shadow-teal-600/30 ring-2 ring-teal-400/40 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Navigation className="w-4 h-4 stroke-[2.2]" />
          <span>Show Safe High-Ground Route on Map</span>
        </button>

        {/* Turn-by-turn guidance card if route is active */}
        {evacuationRoute && (
          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-200 bg-teal-50/70 dark:bg-teal-950/40 p-2 rounded-xl border border-teal-200 dark:border-teal-800">
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-teal-600" />
                Safety: <b className="text-emerald-700 dark:text-emerald-400">{evacuationRoute.safetyScore}%</b>
              </span>
              <span>Gain: <b className="text-teal-700 dark:text-teal-400">+{evacuationRoute.elevationGainMeters}m</b></span>
              <span>Est: <b>{evacuationRoute.estimatedTimeMin} mins</b></span>
            </div>

            <div className="space-y-1.5">
              {evacuationRoute.instructions.map((inst) => (
                <div
                  key={inst.step}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs flex items-start gap-2"
                >
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-black flex items-center justify-center shrink-0 text-[10px]">
                    {inst.step}
                  </span>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-[11px] leading-snug">{inst.text}</p>
                    {inst.elevationNotice && (
                      <p className="text-[10px] text-teal-700 dark:text-teal-400 font-semibold mt-0.5">{inst.elevationNotice}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
