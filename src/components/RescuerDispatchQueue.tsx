import React from 'react';
import {
  Radio,
  LifeBuoy,
  PanelLeftClose,
  AlertCircle,
  Clock,
  Phone,
  Users,
} from 'lucide-react';
import type { ReliefRequest } from '../types';

interface RescuerDispatchQueueProps {
  reliefRequests: ReliefRequest[];
  onAcknowledgeRequest: (requestId: string, teamName: string) => void;
  activeTeamName: string;
  onMinimize?: () => void;
}

export const RescuerDispatchQueue: React.FC<RescuerDispatchQueueProps> = ({
  reliefRequests,
  onAcknowledgeRequest,
  activeTeamName,
  onMinimize,
}) => {
  const pendingCount = reliefRequests.filter((r) => r.status === 'pending').length;
  const dispatchedCount = reliefRequests.filter((r) => r.status === 'dispatched').length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs flex flex-col h-full min-h-0 transition-colors">
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
            <Radio className="w-4 h-4 animate-pulse stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">Inbound SOS Queue</h2>
              {pendingCount > 0 && (
                <span className="flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-red-600 text-white text-[11px] font-black animate-pulse shadow-xs">
                  {pendingCount}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Live civilian distress beacons</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
            {pendingCount} Pending
          </span>
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title="Minimize distress queue"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Priority Notice Pill */}
      <div className="mt-2.5 px-3 py-2 rounded-xl bg-red-50/80 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-800 dark:text-red-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
          <span className="font-semibold text-[11px]">Unattended calls require boat or medical triage</span>
        </div>
        <span className="font-bold text-[11px] text-red-700 dark:text-red-300">{dispatchedCount} Dispatched</span>
      </div>

      {/* 3. Distress Requests Scrollable List */}
      <div className="mt-2.5 flex-1 min-h-0 overflow-y-auto pr-1 panel-scroll-container space-y-2.5">
        {reliefRequests.length === 0 ? (
          <div className="p-8 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <Radio className="w-6 h-6 text-slate-400 mx-auto" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">No Active Distress Beacons</p>
            <p className="text-[11px]">Sector is currently calm. Listening for inbound radio signals...</p>
          </div>
        ) : (
          reliefRequests.map((req) => {
            const isPending = req.status === 'pending';
            return (
              <div
                key={req.id}
                className={`p-3 rounded-xl border text-xs transition-all ${
                  isPending
                    ? 'border-red-300 dark:border-red-800 bg-red-50/60 dark:bg-red-950/30 ring-2 ring-red-400/25 shadow-xs'
                    : req.status === 'dispatched'
                    ? 'border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/20'
                    : 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20'
                }`}
              >
                {/* Top Row: Locality & Time */}
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-xs leading-snug">
                      {req.localityName}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {req.timestamp}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-bold text-red-700 dark:text-red-400">
                        <Users className="w-3 h-3" />
                        {req.peopleCount} Stranded
                      </span>
                    </div>
                  </div>

                  <div>
                    {isPending ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
                        PENDING
                      </span>
                    ) : req.status === 'dispatched' ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                        DISPATCHED
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        SECURED
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact phone */}
                <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                  <Phone className="w-3 h-3 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Contact: <b>{req.contactNumber}</b></span>
                </div>

                {/* Specific Need Badges */}
                <div className="mt-2 flex flex-wrap items-center gap-1">
                  {req.needsBoat && (
                    <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">
                      🚤 Boat Needed
                    </span>
                  )}
                  {req.needsFoodAndWater && (
                    <span className="px-1.5 py-0.5 rounded-md bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 text-[10px] font-semibold">
                      📦 Food & Water
                    </span>
                  )}
                  {req.hasInjured && (
                    <span className="px-1.5 py-0.5 rounded-md bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 text-[10px] font-extrabold">
                      🚑 Medical Aid
                    </span>
                  )}
                  {req.hasInfantsOrElderly && (
                    <span className="px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-semibold">
                      👶 Infants/Elderly
                    </span>
                  )}
                </div>

                {/* DISPATCH UNIT ACTION BUTTON */}
                {isPending ? (
                  <div className="mt-2.5 pt-2 border-t border-red-200 dark:border-red-900/60">
                    <button
                      onClick={() => onAcknowledgeRequest(req.id, activeTeamName)}
                      className="w-full py-2 px-3 rounded-xl font-black text-xs bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white shadow-md shadow-red-500/30 ring-2 ring-red-400/40 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer group"
                      title="Dispatch rescue speedboats and teams immediately"
                    >
                      <LifeBuoy className="w-3.5 h-3.5 text-white group-hover:rotate-45 transition-transform" />
                      <span>Dispatch Unit ({activeTeamName.split(' ')[0]})</span>
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 pt-1.5 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                    <span>Team: <b className="text-teal-700 dark:text-teal-300">{req.assignedTeam}</b></span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">✓ En Route</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
