import React, { useState } from 'react';
import {
  Compass,
  Radio,
  LifeBuoy,
  MapPin,
  CheckCircle2,
  FileSpreadsheet,
  X,
  Globe,
  Sparkles,
} from 'lucide-react';

interface DemoWalkthroughBarProps {
  selectedRegion: 'bangladesh' | 'nepal';
  onSelectRegion: (region: 'bangladesh' | 'nepal') => void;
  onExitDemo: () => void;
  portalMode: 'victim' | 'rescuer';
  onSwitchPortal?: (mode: 'victim' | 'rescuer') => void;
}

export const DemoWalkthroughBar: React.FC<DemoWalkthroughBarProps> = ({
  selectedRegion,
  onSelectRegion,
  onExitDemo,
  portalMode,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      num: 1,
      title: portalMode === 'rescuer' ? 'Dispatch Units (Left)' : 'Check Route (Left)',
      desc:
        portalMode === 'rescuer'
          ? 'Click highlighted "Dispatch Unit" on pending civilian distress beacons.'
          : 'Inspect elevation hazard warnings & calculated safe high-ground route.',
      icon: portalMode === 'rescuer' ? LifeBuoy : Compass,
    },
    {
      num: 2,
      title: 'Tactical Map (Center)',
      desc: 'Inspect the central square map: NASA GPM Rain radar, high shelters, and pulsing SOS signals.',
      icon: MapPin,
    },
    {
      num: 3,
      title: portalMode === 'rescuer' ? 'Triage Sectors (Right)' : 'Broadcast SOS (Right)',
      desc:
        portalMode === 'rescuer'
          ? 'Select critical red sectors, log food & water delivered, then click "Mark Secured (Green)".'
          : 'Pick party size & critical needs (Boat, Medical) to broadcast an emergency distress beacon.',
      icon: portalMode === 'rescuer' ? CheckCircle2 : Radio,
    },
    {
      num: 4,
      title: 'SitRep Audit (Navbar)',
      desc: 'Click "Relief Audit" at the top to export the official UN/OCHA SitRep with NASA verification.',
      icon: FileSpreadsheet,
    },
  ];

  return (
    <div className="bg-gradient-to-r from-amber-50 via-sky-50/70 to-teal-50 border border-amber-200/80 rounded-2xl p-3 shadow-sm shrink-0 mb-1">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 pb-2 border-b border-amber-200/60">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500 text-white text-xs font-black shadow-xs">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>INTERACTIVE DEMO MODE</span>
          </div>

          <span className="text-xs font-bold text-slate-800">
            Scenario:
          </span>

          {/* Regional Scenario Switcher Pills */}
          <div className="flex items-center bg-white/90 p-0.5 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => onSelectRegion('bangladesh')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                selectedRegion === 'bangladesh'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>Bangladesh (Feni 2024 Floods)</span>
            </button>
            <button
              onClick={() => onSelectRegion('nepal')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                selectedRegion === 'nepal'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>Nepal (2024 Flash Floods)</span>
            </button>
          </div>
        </div>

        {/* Exit Demo Button */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={onExitDemo}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white transition-all shadow-xs shadow-teal-600/30 cursor-pointer group"
            title="Return to real-time live map with your GPS location"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-white" />
            <span>Return to Live Real-Time Map</span>
            <X className="w-3.5 h-3.5 text-teal-200 group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Interactive Step-by-Step Walkthrough Guide */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2">
        {steps.map((st) => {
          const Icon = st.icon;
          const isCurrent = activeStep === st.num;
          return (
            <div
              key={st.num}
              onClick={() => setActiveStep(st.num)}
              className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                isCurrent
                  ? 'bg-white border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                  : 'bg-white/70 border-slate-200/80 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isCurrent ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {st.num}
                </span>
                <span className="truncate">{st.title}</span>
                <Icon className={`w-3.5 h-3.5 ml-auto ${isCurrent ? 'text-teal-600' : 'text-slate-400'}`} />
              </div>
              <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                {st.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
