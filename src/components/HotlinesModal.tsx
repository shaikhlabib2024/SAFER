import React from 'react';
import { Phone, X, AlertTriangle, Shield, HeartPulse, UserCheck, PhoneCall } from 'lucide-react';
import { REGIONAL_HOTLINES } from '../services/accessibilityService';

interface HotlinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  region: 'bangladesh' | 'nepal';
}

export const HotlinesModal: React.FC<HotlinesModalProps> = ({
  isOpen,
  onClose,
  region,
}) => {
  if (!isOpen) return null;

  const hotlines = REGIONAL_HOTLINES[region];
  const isBd = region === 'bangladesh';

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hotlines-title"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden my-6 transition-colors">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-5 sm:p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
                <Phone className="w-3 h-3 animate-pulse" /> 1-Tap Emergency Hotlines
              </span>
              <span className="text-xs text-red-100 font-semibold">Toll-Free • 24/7</span>
            </div>
            <h2 id="hotlines-title" className="text-lg sm:text-xl font-black">
              {isBd ? 'জরুরি হেল্পলাইনসমূহ — বাংলাদেশ' : 'आपतकालीन हटलाइनहरू — नेपाल'}
            </h2>
            <p className="text-xs text-red-100 mt-1">
              Tap any number below to dial immediately. Direct lines to flood rescue, police, and medical boats.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
            aria-label="Close hotline directory"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hotlines Grid */}
        <div className="p-4 sm:p-6 space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Suitable for all ages: simple one-touch dialing works even with shaky hands or weak signal.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hotlines.map((hotline) => {
              let Icon = Phone;
              let badgeColor = 'bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-300';
              if (hotline.iconType === 'flood') {
                Icon = AlertTriangle;
                badgeColor = 'bg-sky-100 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300';
              } else if (hotline.iconType === 'ambulance') {
                Icon = HeartPulse;
                badgeColor = 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300';
              } else if (hotline.iconType === 'child') {
                Icon = UserCheck;
                badgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300';
              } else if (hotline.iconType === 'police') {
                Icon = Shield;
                badgeColor = 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300';
              }

              return (
                <a
                  key={hotline.number}
                  href={`tel:${hotline.number}`}
                  className="flex flex-col justify-between p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/30 transition-all group shadow-xs cursor-pointer focus:outline-red-500"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl ${badgeColor} shrink-0 mt-0.5 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {hotline.name}
                        </span>
                      </div>
                      {(hotline.banglaName || hotline.nepaliName) && (
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                          {hotline.banglaName || hotline.nepaliName}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {hotline.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-base font-black text-red-600 dark:text-red-400 tracking-tight flex items-center gap-1">
                      <PhoneCall className="w-4 h-4 animate-bounce" /> {hotline.displayNumber}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      Tap to Call
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Senior & Child Crisis Advice */}
          <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <h4 className="font-bold flex items-center gap-1.5 text-xs text-amber-950 dark:text-amber-100">
              <Shield className="w-4 h-4 text-amber-600" />
              For Children & Seniors (10 to 80+):
            </h4>
            <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
              • If alone, stay calm and dial <b>{isBd ? '999' : '112'}</b> immediately. State your name, village, and whether you are on a roof or dry floor.
              <br />
              • Keep your phone dry inside a sealed plastic bag. Do not step into flowing water.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-700 dark:hover:bg-slate-600 transition-all cursor-pointer"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
