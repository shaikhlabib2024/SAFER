import React, { useState } from 'react';
import {
  Radio,
  Send,
  CheckCircle2,
  PanelRightClose,
  Phone,
  PhoneCall,
} from 'lucide-react';

interface VictimSosPanelProps {
  region: 'bangladesh' | 'nepal';
  onRequestRelief: (data: any) => void;
  onMinimize?: () => void;
  onOpenHotlines?: () => void;
}

export const VictimSosPanel: React.FC<VictimSosPanelProps> = ({
  region,
  onRequestRelief,
  onMinimize,
  onOpenHotlines,
}) => {
  const [peopleCount, setPeopleCount] = useState<number>(4);
  const [contactNumber, setContactNumber] = useState<string>('');
  const [needsBoat, setNeedsBoat] = useState<boolean>(true);
  const [needsFoodAndWater, setNeedsFoodAndWater] = useState<boolean>(true);
  const [hasInjured, setHasInjured] = useState<boolean>(false);
  const [hasInfantsOrElderly, setHasInfantsOrElderly] = useState<boolean>(true);
  const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
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
    <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/60 rounded-2xl p-3.5 shadow-xs flex flex-col h-full min-h-0 transition-colors">
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between pb-2 border-b border-red-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
            <Radio className="w-4 h-4 stroke-[2.2] animate-pulse" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">Broadcast Emergency SOS</h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Transmits to Rescuer Command Live Queue</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
            LIVE BEACON
          </span>
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title="Minimize SOS panel"
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Scrollable Form Content */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 panel-scroll-container space-y-3 pt-2">
        {requestSubmitted ? (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2.5">
            <CheckCircle2 className="w-9 h-9 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Distress Beacon Broadcasted!</h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Your emergency signal and live coordinates have populated into the Rescuer Command dispatch feed.
              Rescue boats and volunteer teams in your sector are alerted.
            </p>
            <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-emerald-200 dark:border-emerald-700 text-xs text-slate-700 dark:text-slate-300 text-left">
              <b>Offline SMS Backup:</b> If cellular data fails, send SMS to <b>16226</b>:
              <br />
              <code className="text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-[10px] mt-1 block">
                SAFER {region === 'bangladesh' ? 'FENI' : 'KTM'} {peopleCount}P BOAT
              </code>
            </div>
            <button
              type="button"
              onClick={() => setRequestSubmitted(false)}
              className="text-xs font-bold text-teal-700 dark:text-teal-400 underline cursor-pointer"
            >
              Broadcast another update
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {/* Stranded people count */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">
                Number of Stranded People:
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 4, 8, '10+'].map((cnt) => (
                  <button
                    type="button"
                    key={cnt}
                    onClick={() => setPeopleCount(typeof cnt === 'number' ? cnt : 12)}
                    className={`flex-1 py-1.5 rounded-lg font-black border transition-all cursor-pointer text-xs ${
                      (typeof cnt === 'number' && peopleCount === cnt) || (cnt === '10+' && peopleCount > 8)
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">
                Contact Phone (or Nearest Kin):
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder={region === 'bangladesh' ? '+880 18XX-XXXXXX' : '+977 98XXXXXXXX'}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-teal-600 text-xs font-medium"
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Urgent Needs Checkboxes */}
            <div className="space-y-1 pt-0.5">
              <span className="block font-bold text-slate-700 dark:text-slate-300 text-[11px]">Select Urgent Needs:</span>
              <div className="grid grid-cols-2 gap-1.5">
                <label className="flex items-center gap-1.5 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needsBoat}
                    onChange={(e) => setNeedsBoat(e.target.checked)}
                    className="rounded text-teal-600"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">Rescue Boat</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needsFoodAndWater}
                    onChange={(e) => setNeedsFoodAndWater(e.target.checked)}
                    className="rounded text-teal-600"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">Food & Water</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasInjured}
                    onChange={(e) => setHasInjured(e.target.checked)}
                    className="rounded text-teal-600"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">Medical Aid</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasInfantsOrElderly}
                    onChange={(e) => setHasInfantsOrElderly(e.target.checked)}
                    className="rounded text-teal-600"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">Infants/Elderly</span>
                </label>
              </div>
            </div>

            {/* EMERGENCY BROADCAST BUTTON */}
            <button
              type="submit"
              className="w-full py-3 px-3 rounded-xl font-black text-xs bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white shadow-lg shadow-red-600/40 ring-2 ring-red-400/40 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 text-white animate-pulse" />
              <span>Broadcast SOS Distress Beacon</span>
            </button>

            {/* Direct hotline tap button */}
            {onOpenHotlines && (
              <button
                type="button"
                onClick={onOpenHotlines}
                className="w-full py-2 px-3 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-red-600" />
                <span>Call Hotline (999 / 1090) Directly</span>
              </button>
            )}

            {/* Offline backup notice */}
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
              <b>Notice:</b> Beacon broadcasting connects directly to local rescue speedboats via cellular & mesh fallback.
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
