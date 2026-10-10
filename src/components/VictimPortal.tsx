import React, { useState } from 'react';
import {
  Navigation,
  ShieldAlert,
  Home,
  CheckCircle2,
  Send,
  Radio,
  PanelLeftClose,
} from 'lucide-react';
import type { Shelter, EvacuationRoute } from '../types';

interface VictimPortalProps {
  region: 'bangladesh' | 'nepal';
  shelters: Shelter[];
  evacuationRoute: EvacuationRoute | null;
  onCalculateRoute: () => void;
  onRequestRelief: (data: any) => void;
  onMinimize?: () => void;
}

export const VictimPortal: React.FC<VictimPortalProps> = ({
  region,
  shelters,
  evacuationRoute,
  onCalculateRoute,
  onRequestRelief,
  onMinimize,
}) => {
  // Active Tab for Civilian / Victim Workflow: Safe Navigation vs Emergency SOS
  const [activeTab, setActiveTab] = useState<'route' | 'sos'>('route');

  // Form state for relief request
  const [peopleCount, setPeopleCount] = useState<number>(4);
  const [contactNumber, setContactNumber] = useState<string>('');
  const [needsBoat, setNeedsBoat] = useState<boolean>(true);
  const [needsFoodAndWater, setNeedsFoodAndWater] = useState<boolean>(true);
  const [hasInjured, setHasInjured] = useState<boolean>(false);
  const [hasInfantsOrElderly, setHasInfantsOrElderly] = useState<boolean>(true);
  const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);

  const nearestShelter = shelters.find((s) => s.region === region);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestRelief({
      peopleCount,
      contactNumber,
      needsBoat,
      needsFoodAndWater,
      hasInjured,
      hasInfantsOrElderly,
      timestamp: new Date().toLocaleTimeString(),
    });
    setRequestSubmitted(true);
  };

  return (
    <div className="flex flex-col gap-2.5 pb-2">
      {/* Top Header with Minimize Option */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse"></span>
          <div>
            <span className="font-bold text-xs text-slate-900 block">Citizen Survival & Evacuation</span>
            <span className="text-[10px] text-slate-500">Live elevation & high-ground guidance</span>
          </div>
        </div>
        {onMinimize && (
          <button
            onClick={onMinimize}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
            title="Minimize panel for full-screen map"
          >
            <PanelLeftClose className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Minimize</span>
          </button>
        )}
      </div>

      {/* Mode Switcher Tabs: Fast Navigation */}
      <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1 text-xs font-bold text-slate-600">
        <button
          onClick={() => setActiveTab('route')}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'route'
              ? 'bg-white text-teal-800 shadow-xs border border-slate-200 font-extrabold'
              : 'hover:text-slate-900'
          }`}
        >
          <Navigation className="w-3.5 h-3.5 text-teal-600" />
          <span>High-Ground Route</span>
        </button>

        <button
          onClick={() => setActiveTab('sos')}
          className={`flex-1 py-1.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'sos'
              ? 'bg-white text-red-700 shadow-xs border border-slate-200 font-extrabold'
              : 'hover:text-slate-900'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" />
          <span>Broadcast SOS Beacon</span>
        </button>
      </div>

      {/* Real-time Threat & Elevation Awareness Banner */}
      <div className="bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 rounded-2xl p-3 shadow-xs">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-red-100 text-red-600 shrink-0 mt-0.5">
            <ShieldAlert className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-red-900">
                {region === 'bangladesh' ? 'Feni Muhuri River Flood Surge Active' : 'Kathmandu Valley Flash Flood Warning'}
              </span>
              <span className="text-[9px] uppercase font-bold bg-red-600 text-white px-1.5 py-0.2 rounded-full">
                Danger Zone
              </span>
            </div>
            <p className="text-[11px] text-red-700 mt-0.5 leading-snug">
              Ground elevation: low ({region === 'bangladesh' ? '+4.2m' : '1,285m'}). Water levels are cresting. 
              Avoid flooded underpasses; follow high-ground ridge routes.
            </p>
          </div>
        </div>
      </div>

      {/* Content Area 1: High-Ground Evacuation Route Tab */}
      {activeTab === 'route' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
                <Home className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Nearest High-Ground Shelter</h3>
                <p className="text-[10px] text-slate-500">Elevated refuge above peak flood line</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              Dry & Operating
            </span>
          </div>

          {nearestShelter && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{nearestShelter.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Safe Elevation: <b className="text-teal-700">+{nearestShelter.elevation}m</b> | Verified High Ground
                  </p>
                </div>
                <span className="text-[10px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                  {nearestShelter.currentOccupancy} / {nearestShelter.capacity} beds
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {nearestShelter.facilities.map((fac, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-white text-slate-600 border border-slate-200 px-1.5 py-0.2 rounded"
                  >
                    ✓ {fac}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={onCalculateRoute}
            className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-gradient-to-r from-teal-600 to-sky-600 text-white hover:from-teal-700 hover:to-sky-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 cursor-pointer"
          >
            <Navigation className="w-4 h-4 stroke-[2.2]" />
            <span>Show Safe High-Ground Route on Map</span>
          </button>

          {/* Turn-by-turn guidance card if route is active */}
          {evacuationRoute && (
            <div className="mt-2 pt-3 border-t border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 bg-teal-50/60 p-2 rounded-xl border border-teal-200/60">
                <span>Safety Rating: <b className="text-emerald-700">{evacuationRoute.safetyScore}%</b></span>
                <span>Elev Gain: <b className="text-teal-700">+{evacuationRoute.elevationGainMeters}m</b></span>
                <span>Est: <b className="text-slate-800">{evacuationRoute.estimatedTimeMin} mins</b></span>
              </div>

              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                {evacuationRoute.instructions.map((inst) => (
                  <div
                    key={inst.step}
                    className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-2"
                  >
                    <span className="w-4 h-4 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {inst.step}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-800 text-[11px]">{inst.text}</p>
                      {inst.elevationNotice && (
                        <p className="text-[10px] text-teal-700 font-medium mt-0.5">{inst.elevationNotice}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Area 2: Emergency Distress & Need Request Form */}
      {activeTab === 'sos' && (
        <div className="bg-white border border-red-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-red-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
                <Radio className="w-4 h-4 stroke-[2.2] animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Broadcast Emergency SOS</h3>
                <p className="text-[10px] text-slate-500">Transmits directly to Rescuer Dispatch</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
              LIVE BEACON
            </span>
          </div>

          {requestSubmitted ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Distress Beacon Broadcasted!</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Your emergency signal has been transmitted to the Rescuer Command live queue. Rescuers and boat units are alerted.
              </p>
              <div className="p-2 bg-white rounded-lg border border-emerald-200 text-xs text-slate-700 text-left">
                <b>Offline SMS Backup:</b> If cellular data fails, SMS <b>16206</b>:
                <br />
                <code className="text-slate-900 font-bold bg-slate-100 px-1 py-0.5 rounded text-[10px]">
                  SAFER {region === 'bangladesh' ? 'FENI' : 'KTM'} {peopleCount}P BOAT
                </code>
              </div>
              <button
                type="button"
                onClick={() => setRequestSubmitted(false)}
                className="mt-2 text-xs font-bold text-teal-700 underline cursor-pointer"
              >
                Send another update
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitRequest} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Number of Stranded People:
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 4, 8, '10+'].map((cnt) => (
                    <button
                      type="button"
                      key={cnt}
                      onClick={() => setPeopleCount(typeof cnt === 'number' ? cnt : 12)}
                      className={`flex-1 py-1.5 rounded-lg font-bold border transition-all cursor-pointer text-xs ${
                        (typeof cnt === 'number' && peopleCount === cnt) || (cnt === '10+' && peopleCount > 8)
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Contact Phone Number:
                </label>
                <input
                  type="tel"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder={region === 'bangladesh' ? '+880 18XX-XXXXXX' : '+977 98XXXXXXXX'}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-teal-600 text-xs font-medium"
                />
              </div>

              {/* Critical Needs Checkboxes */}
              <div className="space-y-1.5 pt-0.5">
                <span className="block font-semibold text-slate-700">Urgent Needs:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <label className="flex items-center gap-1.5 p-2 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={needsBoat}
                      onChange={(e) => setNeedsBoat(e.target.checked)}
                      className="rounded text-teal-600"
                    />
                    <span className="font-medium text-slate-800 text-[11px]">Rescue Boat</span>
                  </label>
                  <label className="flex items-center gap-1.5 p-2 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={needsFoodAndWater}
                      onChange={(e) => setNeedsFoodAndWater(e.target.checked)}
                      className="rounded text-teal-600"
                    />
                    <span className="font-medium text-slate-800 text-[11px]">Food & Water</span>
                  </label>
                  <label className="flex items-center gap-1.5 p-2 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasInjured}
                      onChange={(e) => setHasInjured(e.target.checked)}
                      className="rounded text-teal-600"
                    />
                    <span className="font-medium text-slate-800 text-[11px]">Medical Aid</span>
                  </label>
                  <label className="flex items-center gap-1.5 p-2 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasInfantsOrElderly}
                      onChange={(e) => setHasInfantsOrElderly(e.target.checked)}
                      className="rounded text-teal-600"
                    />
                    <span className="font-medium text-slate-800 text-[11px]">Infants/Elderly</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-700 text-white transition-all flex items-center justify-center gap-2 shadow-md shadow-red-600/20 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast SOS Distress Beacon</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
