import React, { useState } from 'react';
import {
  Navigation,
  Radio,
  Phone,
  Home,
  Volume2,
  VolumeX,
  AlertTriangle,
  Send,
  CheckCircle2,
  Compass,
  PhoneCall,
  MapPin,
} from 'lucide-react';
import type { Shelter, EvacuationRoute } from '../types';
import { soundBeacon, speakText, stopSpeaking } from '../services/accessibilityService';

interface SimplifiedCrisisViewProps {
  region: 'bangladesh' | 'nepal';
  shelters: Shelter[];
  evacuationRoute: EvacuationRoute | null;
  onCalculateRoute: () => void;
  onRequestRelief: (data: any) => void;
  onOpenHotlines: () => void;
  onExitSimplifiedMode: () => void;
  isBeaconActive: boolean;
  setIsBeaconActive: (active: boolean) => void;
  mapElement: React.ReactNode;
}

export const SimplifiedCrisisView: React.FC<SimplifiedCrisisViewProps> = ({
  region,
  shelters,
  evacuationRoute,
  onCalculateRoute,
  onRequestRelief,
  onOpenHotlines,
  onExitSimplifiedMode,
  isBeaconActive,
  setIsBeaconActive,
  mapElement,
}) => {
  const [peopleCount, setPeopleCount] = useState<number>(4);
  const [contactNumber, setContactNumber] = useState<string>('');
  const [needsBoat, setNeedsBoat] = useState<boolean>(true);
  const [needsFoodAndWater, setNeedsFoodAndWater] = useState<boolean>(true);
  const [hasInjured, setHasInjured] = useState<boolean>(false);
  const [sosSubmitted, setSosSubmitted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const nearestShelter = shelters.find((s) => s.region === region);
  const isBd = region === 'bangladesh';

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    const shelterName = nearestShelter?.name || 'Nearest Flood Refuge';
    const elev = nearestShelter?.elevation || '10';
    const speech = `Emergency Guide. Stay calm. The nearest safe high-ground shelter is ${shelterName}, at an elevation of plus ${elev} meters. Do not cross rushing floodwaters. If you need a rescue boat, tap the big red SOS button. For immediate help, call 999.`;

    speakText(
      speech,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleToggleBeacon = () => {
    if (isBeaconActive) {
      soundBeacon.stop((active) => setIsBeaconActive(active));
    } else {
      soundBeacon.start((active) => setIsBeaconActive(active));
    }
  };

  const handleSendSos = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestRelief({
      peopleCount,
      contactNumber,
      needsBoat,
      needsFoodAndWater,
      hasInjured,
      hasInfantsOrElderly: true,
      timestamp: new Date().toLocaleTimeString(),
    });
    setSosSubmitted(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-5 space-y-4">
      {/* 1. Senior & Child Friendly Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 rounded-3xl p-4 sm:p-5 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <AlertTriangle className="w-7 h-7 text-white animate-bounce" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/25 text-white text-[11px] font-black uppercase tracking-wider">
              {isBd ? '⚠️ বন্যা সতর্কবার্তা — উঁচু স্থানে অবস্থান করুন' : '⚠️ बाढी चेतावनी — सुरक्षित स्थानमा जानुहोस्'}
            </span>
            <h1 className="text-xl sm:text-2xl font-black mt-1">
              Easy Emergency Guide (Ages 10 – 80+)
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 font-medium">
              Simple 1-tap buttons designed for quick action during a crisis.
            </p>
          </div>
        </div>

        {/* Audio Assistant & Exit Easy Mode */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            type="button"
            onClick={handleSpeak}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all ${
              isSpeaking
                ? 'bg-white text-rose-700 ring-4 ring-white/50'
                : 'bg-white/20 hover:bg-white/30 text-white border border-white/40'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-5 h-5 animate-pulse" /> : <Volume2 className="w-5 h-5" />}
            <span>{isSpeaking ? 'Stop Voice' : '🔊 Read Aloud'}</span>
          </button>

          <button
            type="button"
            onClick={onExitSimplifiedMode}
            className="px-4 py-2.5 rounded-2xl font-bold text-xs bg-slate-900/80 hover:bg-slate-900 text-white transition-all cursor-pointer border border-white/20"
          >
            Full Tactical Map View
          </button>
        </div>
      </div>

      {/* 2. Three Giant Action Cards for Everyone */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CARD 1: SAFE HIGH GROUND (GREEN) */}
        <div className="bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-600 rounded-3xl p-5 shadow-md flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100 dark:border-slate-800">
              <span className="flex items-center gap-2 font-black text-sm text-emerald-800 dark:text-emerald-300">
                <Home className="w-5 h-5 text-emerald-600" />
                1. Safe High Ground
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                DRY REFUGE
              </span>
            </div>

            {nearestShelter && (
              <div className="mt-3 space-y-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {nearestShelter.name}
                </h3>
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <div className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Safe Elevation: <span className="text-emerald-700 dark:text-emerald-400 font-black text-base">+{nearestShelter.elevation}m</span>
                  </div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Capacity: {nearestShelter.currentOccupancy} / {nearestShelter.capacity} people
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pt-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Multi-story concrete flood shelter</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Emergency drinking water & power</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onCalculateRoute}
              className="w-full py-3.5 px-4 rounded-2xl font-black text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/40 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
            >
              <Navigation className="w-5 h-5 stroke-[2.2]" />
              <span>Show Safe Walking Path</span>
            </button>
          </div>
        </div>

        {/* CARD 2: BIG RED SOS (URGENT RESCUE) */}
        <div className="bg-white dark:bg-slate-900 border-2 border-red-400 dark:border-red-600 rounded-3xl p-5 shadow-md flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-red-100 dark:border-slate-800">
              <span className="flex items-center gap-2 font-black text-sm text-red-800 dark:text-red-300">
                <Radio className="w-5 h-5 text-red-600 animate-pulse" />
                2. Emergency SOS Beacon
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
                PRIORITY
              </span>
            </div>

            {sosSubmitted ? (
              <div className="mt-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-black text-sm text-slate-900 dark:text-white">SOS Beacon Sent!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                  Local rescue speedboats have your GPS coordinates. Stay where you are on high ground.
                </p>
                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                  SMS Backup: SAFER FENI {peopleCount}P to 16206
                </div>
                <button
                  type="button"
                  onClick={() => setSosSubmitted(false)}
                  className="text-xs font-bold text-teal-600 dark:text-teal-400 underline cursor-pointer"
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendSos} className="mt-3 space-y-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    How many people with you?
                  </label>
                  <div className="grid grid-cols-5 gap-1">
                    {[1, 2, 4, 8, 12].map((cnt) => (
                      <button
                        type="button"
                        key={cnt}
                        onClick={() => setPeopleCount(cnt)}
                        className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                          peopleCount === cnt
                            ? 'bg-red-600 text-white border-red-600 shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {cnt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number (if available):
                  </label>
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder={isBd ? '018XXXXXXXX' : '98XXXXXXXX'}
                    className="w-full px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <label className="flex items-center gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={needsBoat}
                      onChange={(e) => setNeedsBoat(e.target.checked)}
                      className="rounded text-red-600 w-4 h-4"
                    />
                    <span>Boat</span>
                  </label>
                  <label className="flex items-center gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={needsFoodAndWater}
                      onChange={(e) => setNeedsFoodAndWater(e.target.checked)}
                      className="rounded text-red-600 w-4 h-4"
                    />
                    <span>Food/Water</span>
                  </label>
                  <label className="flex items-center gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={hasInjured}
                      onChange={(e) => setHasInjured(e.target.checked)}
                      className="rounded text-red-600 w-4 h-4"
                    />
                    <span>Medical</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 mt-2 rounded-2xl font-black text-sm bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white shadow-lg shadow-red-600/40 ring-2 ring-red-400/40 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <Send className="w-5 h-5 text-white animate-pulse" />
                  <span>TRANSMIT SOS SIGNAL</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* CARD 3: HOTLINES & LOUD RESCUE WHISTLE */}
        <div className="bg-white dark:bg-slate-900 border-2 border-sky-400 dark:border-sky-600 rounded-3xl p-5 shadow-md flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-sky-100 dark:border-slate-800">
              <span className="flex items-center gap-2 font-black text-sm text-sky-800 dark:text-sky-300">
                <Phone className="w-5 h-5 text-sky-600" />
                3. Direct Hotline & Whistle
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                TOLL-FREE
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {/* Tap to Call 999 */}
              <a
                href={isBd ? 'tel:999' : 'tel:112'}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border-2 border-red-300 dark:border-red-800 hover:border-red-500 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                    <PhoneCall className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900 dark:text-white">
                      {isBd ? 'National Emergency Helpline' : 'Nepal Police Hotline'}
                    </div>
                    <div className="text-lg font-black text-red-600 dark:text-red-400">
                      {isBd ? 'Dial 999' : 'Dial 112'}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-black px-3 py-1 rounded-xl bg-red-600 text-white">
                  CALL
                </span>
              </a>

              {/* Tap to Call 1090 Flood Alert */}
              <a
                href={isBd ? 'tel:1090' : 'tel:1155'}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border-2 border-sky-300 dark:border-sky-800 hover:border-sky-500 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900 dark:text-white">
                      Flood Early Warning Center
                    </div>
                    <div className="text-lg font-black text-sky-600 dark:text-sky-400">
                      {isBd ? 'Dial 1090' : 'Dial 1155'}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-black px-3 py-1 rounded-xl bg-sky-600 text-white">
                  CALL
                </span>
              </a>

              {/* Acoustic Whistle Button */}
              <button
                type="button"
                onClick={handleToggleBeacon}
                className={`w-full p-3 rounded-2xl border-2 flex items-center justify-between gap-2 text-left cursor-pointer transition-all ${
                  isBeaconActive
                    ? 'border-red-600 bg-red-50 dark:bg-red-950/60 text-red-950 dark:text-red-200 ring-4 ring-red-400/40'
                    : 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl text-white ${isBeaconActive ? 'bg-red-600 animate-ping' : 'bg-amber-600'}`}>
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900 dark:text-white">
                      {isBeaconActive ? '🛑 STOP Loud Whistle' : '📢 Sound Emergency Whistle'}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Plays loud alarm so boats can locate you
                    </div>
                  </div>
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${isBeaconActive ? 'bg-red-600 text-white' : 'bg-amber-200 text-amber-900'}`}>
                  {isBeaconActive ? 'ACTIVE' : 'SOUND'}
                </span>
              </button>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onOpenHotlines}
              className="w-full py-2.5 text-xs font-black text-sky-700 dark:text-sky-400 hover:underline cursor-pointer text-center block"
            >
              View All Emergency Helplines (Ambulance, Children, Relief) →
            </button>
          </div>
        </div>
      </div>

      {/* 3. Turn-by-Turn Guidance if Safe Route is Active */}
      {evacuationRoute && (
        <div className="bg-white dark:bg-slate-900 border-2 border-teal-300 dark:border-teal-700 rounded-3xl p-5 shadow-md space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300">
                <Compass className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  Turn-by-Turn Safe High-Ground Route
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Follow these steps to avoid submerged underpasses and reach safety
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-800 dark:text-teal-300">
              <span className="px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800">
                Safety: <b>{evacuationRoute.safetyScore}%</b>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800">
                Gain: <b>+{evacuationRoute.elevationGainMeters}m</b>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
            {evacuationRoute.instructions.map((inst) => (
              <div
                key={inst.step}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3"
              >
                <span className="w-7 h-7 rounded-full bg-teal-600 text-white font-black flex items-center justify-center shrink-0 text-xs">
                  {inst.step}
                </span>
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm leading-snug">
                    {inst.text}
                  </p>
                  {inst.elevationNotice && (
                    <p className="text-xs text-teal-700 dark:text-teal-400 font-bold mt-1">
                      {inst.elevationNotice}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. High-Visibility Map Component Display */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-3 shadow-md overflow-hidden transition-colors">
        <div className="pb-2.5 px-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Live Safe Ground Map Preview
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Green pins = safe dry shelters • Blue lines = high-ground routes
          </span>
        </div>
        <div className="w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden mt-2">
          {mapElement}
        </div>
      </div>
    </div>
  );
};
