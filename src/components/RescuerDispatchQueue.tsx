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
    <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs flex flex-col h-full min-h-0">
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
            <Radio className="w-4 h-4 animate-pulse stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-slate-900 text-xs sm:text-sm">Inbound SOS Queue</h2>
              {pendingCount > 0 && (
                <span className="flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-red-600 text-white text-[11px] font-black animate-pulse shadow-xs">
                  {pendingCount}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">Live civilian distress beacons</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
            {pendingCount} Pending
          </span>
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              title="Minimize distress queue"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Priority Notice Pill */}
      <div className="mt-2.5 px-3 py-2 rounded-xl bg-red-50/80 border border-red-200 text-xs text-red-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
          <span className="font-semibold text-[11px]">Unattended calls require boat or medical triage</span>
        </div>
        <span className="font-bold text-[11px] text-red-700">{dispatchedCount} Dispatched</span>
      </div>

      {/* 3. Distress Requests Scrollable List */}
      <div className="mt-2.5 flex-1 min-h-0 overflow-y-auto pr-1 panel-scroll-container space-y-2.5">
        {reliefRequests.length === 0 ? (
          <div className="p-8 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500 space-y-1">
            <Radio className="w-6 h-6 text-slate-400 mx-auto" />
            <p className="font-semibold text-slate-700">No Active Distress Beacons</p>
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
                    ? 'border-red-300 bg-red-50/60 ring-2 ring-red-400/25 shadow-xs'
                    : req.status === 'dispatched'
                    ? 'border-amber-200 bg-amber-50/30'
                    : 'border-emerald-200 bg-emerald-50/30'
                }`}
              >
                {/* Top Row: Locality & Time */}
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-xs leading-snug">
                      {req.localityName}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {req.timestamp}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-bold text-red-700">
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
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                        DISPATCHED
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        SECURED
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact phone */}
                <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-700 font-medium">
                  <Phone className="w-3 h-3 text-teal-600 shrink-0" />
                  <span>Contact: <b>{req.contactNumber}</b></span>
                </div>

                {/* Specific Need Badges */}
                <div className="mt-2 flex flex-wrap items-center gap-1">
                  {req.needsBoat && (
                    <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                      🚤 Boat Needed
                    </span>
                  )}
                  {req.needsFoodAndWater && (
                    <span className="px-1.5 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-semibold">
                      📦 Food & Water
                    </span>
                  )}
                  {req.hasInjured && (
                    <span className="px-1.5 py-0.5 rounded-md bg-red-100 text-red-800 text-[10px] font-extrabold">
                      🚑 Medical Aid
                    </span>
                  )}
                  {req.hasInfantsOrElderly && (
                    <span className="px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-semibold">
                      👶 Infants/Elderly
                    </span>
                  )}
                </div>

                {/* HIGH-VISIBILITY DISPATCH UNIT ACTION BUTTON */}
                {isPending ? (
                  <div className="mt-2.5 pt-2 border-t border-red-200">
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
                  <div className="mt-2 pt-1.5 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                    <span>Team: <b className="text-teal-800">{req.assignedTeam}</b></span>
                    <span className="text-emerald-700 font-bold">✓ En Route</span>
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
