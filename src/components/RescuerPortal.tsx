import React, { useState } from 'react';
import {
  Users,
  Package,
  Droplets,
  CheckCircle2,
  Clock,
  MapPin,
  FileSpreadsheet,
  PanelLeftClose,
  Radio,
  LifeBuoy,
} from 'lucide-react';
import type { Locality, LocalityStatus, ReliefRequest } from '../types';

interface RescuerPortalProps {
  localities: Locality[];
  reliefRequests: ReliefRequest[];
  selectedLocality: Locality | null;
  onSelectLocality: (loc: Locality) => void;
  onUpdateLocalityStatus: (
    localityId: string,
    newStatus: LocalityStatus,
    rescuedCountDelta: number,
    foodDelta: number,
    waterDelta: number,
    medical: boolean,
    teamName: string,
    actionNote: string
  ) => void;
  onAcknowledgeRequest: (requestId: string, teamName: string) => void;
  onOpenAuditModal: () => void;
  onMinimize?: () => void;
}

export const RescuerPortal: React.FC<RescuerPortalProps> = ({
  localities,
  reliefRequests,
  selectedLocality,
  onSelectLocality,
  onUpdateLocalityStatus,
  onAcknowledgeRequest,
  onOpenAuditModal,
  onMinimize,
}) => {
  // Navigation Tabs for Rescuer workflow
  const [activeTab, setActiveTab] = useState<'dispatch' | 'sectors' | 'mission'>('dispatch');
  const [sectorFilter, setSectorFilter] = useState<'all' | 'critical' | 'in-progress' | 'secured'>('all');

  // Rescuer input fields for the active locality
  const [teamName, setTeamName] = useState<string>('Red Crescent Response Alpha');
  const [peopleRescuedInput, setPeopleRescuedInput] = useState<number>(15);
  const [foodPacksInput, setFoodPacksInput] = useState<number>(50);
  const [waterKitsInput, setWaterKitsInput] = useState<number>(100);
  const [medicalProvided, setMedicalProvided] = useState<boolean>(true);
  const [operationNote, setOperationNote] = useState<string>('Evacuated families to high school shelter via speedboat.');

  // Summary Metrics
  const totalLocalities = localities.length;
  const criticalCount = localities.filter((l) => l.status === 'critical').length;
  const inProgressCount = localities.filter((l) => l.status === 'in-progress').length;
  const securedCount = localities.filter((l) => l.status === 'secured').length;

  const totalRescued = localities.reduce((acc, curr) => acc + curr.rescuedCount, 0);
  const totalFoodDelivered = localities.reduce((acc, curr) => acc + curr.reliefPacksDelivered, 0);
  const totalWaterDelivered = localities.reduce((acc, curr) => acc + curr.waterKitsDelivered, 0);

  const securedPercentage = totalLocalities > 0 ? Math.round((securedCount / totalLocalities) * 100) : 0;
  const pendingRequestsCount = reliefRequests.filter((r) => r.status === 'pending').length;

  const filteredLocalities = localities.filter((loc) => {
    if (sectorFilter === 'all') return true;
    return loc.status === sectorFilter;
  });

  const handleApplyUpdate = (newStatus: LocalityStatus) => {
    if (!selectedLocality) return;
    onUpdateLocalityStatus(
      selectedLocality.id,
      newStatus,
      Number(peopleRescuedInput),
      Number(foodPacksInput),
      Number(waterKitsInput),
      medicalProvided,
      teamName,
      operationNote
    );
  };

  const handleSectorSelectAndSwitch = (loc: Locality) => {
    onSelectLocality(loc);
    setActiveTab('mission');
  };

  return (
    <div className="flex flex-col gap-2.5 pb-2">
      {/* 1. Header Toolbar with SitRep & Minimize */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <Radio className="w-4 h-4 text-teal-600 animate-pulse" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-xs sm:text-sm">Rescuer Command Hub</h2>
            <p className="text-[11px] text-slate-500">Fast Triage & Dispatch Operations</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenAuditModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs cursor-pointer"
            title="Download Official Audit SitRep"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">SitRep</span>
          </button>
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
              title="Minimize panel for full-screen map"
            >
              <PanelLeftClose className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Minimize</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Operations KPI Bar (Compact) */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-xs">
          <div className="flex items-center gap-1 text-slate-500 text-[10px] font-semibold mb-0.5">
            <Users className="w-3 h-3 text-teal-600" />
            <span className="truncate">Rescued</span>
          </div>
          <div className="text-base font-extrabold text-slate-900">{totalRescued}</div>
          <div className="text-[9px] text-teal-700 font-medium">Safe in Shelter</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-xs">
          <div className="flex items-center gap-1 text-slate-500 text-[10px] font-semibold mb-0.5">
            <Package className="w-3 h-3 text-sky-600" />
            <span className="truncate">Food Packs</span>
          </div>
          <div className="text-base font-extrabold text-slate-900">{totalFoodDelivered}</div>
          <div className="text-[9px] text-sky-700 font-medium">Delivered</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-xs">
          <div className="flex items-center gap-1 text-slate-500 text-[10px] font-semibold mb-0.5">
            <Droplets className="w-3 h-3 text-blue-600" />
            <span className="truncate">Water Kits</span>
          </div>
          <div className="text-base font-extrabold text-slate-900">{totalWaterDelivered}</div>
          <div className="text-[9px] text-blue-700 font-medium">Purification</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-xs">
          <div className="flex items-center gap-1 text-slate-500 text-[10px] font-semibold mb-0.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span className="truncate">Secured</span>
          </div>
          <div className="text-base font-extrabold text-emerald-600">{securedPercentage}%</div>
          <div className="text-[9px] text-emerald-700 font-medium">{securedCount}/{totalLocalities} Green</div>
        </div>
      </div>

      {/* 3. Streamlined Navigation Tabs */}
      <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1 text-xs font-bold text-slate-600">
        <button
          onClick={() => setActiveTab('dispatch')}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'dispatch'
              ? 'bg-white text-red-700 shadow-xs border border-slate-200 font-extrabold'
              : 'hover:text-slate-900'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-red-600" />
          <span>SOS Beacons</span>
          {pendingRequestsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-extrabold">
              {pendingRequestsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sectors')}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'sectors'
              ? 'bg-white text-teal-800 shadow-xs border border-slate-200 font-extrabold'
              : 'hover:text-slate-900'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-teal-600" />
          <span>Sectors</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
            {localities.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('mission')}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'mission'
              ? 'bg-white text-teal-800 shadow-xs border border-slate-200 font-extrabold'
              : 'hover:text-slate-900'
          }`}
        >
          <LifeBuoy className="w-3.5 h-3.5 text-amber-600" />
          <span>Update Status</span>
          {selectedLocality && (
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
          )}
        </button>
      </div>

      {/* 4. Tab 1: Civilian SOS Distress Beacons Feed */}
      {activeTab === 'dispatch' && (
        <div className="bg-white border border-red-200 rounded-2xl p-3.5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <span>Civilian SOS Distress Beacons</span>
                {pendingRequestsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-extrabold border border-red-200">
                    {pendingRequestsCount} Unattended
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-500">Real-time distress broadcasts received from victims</p>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {reliefRequests.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
                No active civilian distress calls in this sector.
              </div>
            ) : (
              reliefRequests.map((req) => (
                <div
                  key={req.id}
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    req.status === 'pending'
                      ? 'border-red-200 bg-red-50/50 ring-1 ring-red-400/20'
                      : req.status === 'dispatched'
                      ? 'border-amber-200 bg-amber-50/40'
                      : 'border-emerald-200 bg-emerald-50/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span>{req.localityName}</span>
                        <span className="text-[10px] font-semibold text-slate-500">({req.timestamp})</span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5 flex flex-wrap items-center gap-2">
                        <span>Contact: <b>{req.contactNumber}</b></span>
                        <span>•</span>
                        <span>Party: <b className="text-red-700">{req.peopleCount} Stranded</b></span>
                      </div>
                    </div>
                    <div>
                      {req.status === 'pending' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
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

                  {/* Needs tags */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {req.needsBoat && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-semibold">
                        🚤 Boat Needed
                      </span>
                    )}
                    {req.needsFoodAndWater && (
                      <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-semibold">
                        📦 Food & Water
                      </span>
                    )}
                    {req.hasInjured && (
                      <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 text-[10px] font-semibold">
                        🚑 Medical Aid
                      </span>
                    )}
                    {req.hasInfantsOrElderly && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-semibold">
                        👶 Infants/Elderly
                      </span>
                    )}
                  </div>

                  {/* Dispatch Action */}
                  {req.status === 'pending' ? (
                    <div className="mt-2.5 pt-2 border-t border-red-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-medium">Ready for dispatch</span>
                      <button
                        onClick={() => onAcknowledgeRequest(req.id, teamName)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <LifeBuoy className="w-3.5 h-3.5 text-white" />
                        <span>Dispatch Unit</span>
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 pt-1.5 border-t border-slate-200/60 text-[11px] text-slate-600 flex items-center justify-between">
                      <span>Assigned: <b className="text-teal-800">{req.assignedTeam}</b></span>
                      <span className="text-emerald-700 font-bold">✓ En Route</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. Tab 2: Locality Triage Sector List */}
      {activeTab === 'sectors' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800">Filter Locality Status:</span>
            <div className="flex items-center gap-1 text-[11px]">
              <button
                onClick={() => setSectorFilter('all')}
                className={`px-2 py-0.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  sectorFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({localities.length})
              </button>
              <button
                onClick={() => setSectorFilter('critical')}
                className={`px-2 py-0.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  sectorFilter === 'critical' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                Red ({criticalCount})
              </button>
              <button
                onClick={() => setSectorFilter('in-progress')}
                className={`px-2 py-0.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  sectorFilter === 'in-progress' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                Yellow ({inProgressCount})
              </button>
              <button
                onClick={() => setSectorFilter('secured')}
                className={`px-2 py-0.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  sectorFilter === 'secured' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Green ({securedCount})
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {filteredLocalities.map((loc) => {
              const isSelected = selectedLocality?.id === loc.id;
              let statusBadge = (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                  Critical (Red)
                </span>
              );
              if (loc.status === 'in-progress') {
                statusBadge = (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                    Active (Yellow)
                  </span>
                );
              } else if (loc.status === 'secured') {
                statusBadge = (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                    Secured (Green)
                  </span>
                );
              }

              return (
                <div
                  key={loc.id}
                  onClick={() => handleSectorSelectAndSwitch(loc)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-500/20'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-slate-800 text-xs sm:text-sm">{loc.name}</span>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Water Depth: <b className="text-slate-700">{loc.waterLevelDepthMeters}m</b> | Elev: +{loc.elevation}m
                      </div>
                    </div>
                    <div>{statusBadge}</div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600 pt-1.5 border-t border-slate-200/60">
                    <span>Trapped: <b className="text-red-700">{loc.trappedCount}</b> | Rescued: <b className="text-emerald-700">{loc.rescuedCount}</b></span>
                    <span className="text-teal-700 font-semibold">Click to Manage →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Tab 3: Rescuer Action & Status Transition Module */}
      {activeTab === 'mission' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          {selectedLocality ? (
            <>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">Active Locality</span>
                  <h4 className="font-bold text-slate-900 text-sm">{selectedLocality.name}</h4>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Current Status:</span>
                  <div className="font-bold text-xs uppercase text-slate-800">{selectedLocality.status}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Responding Unit:</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">People Rescued Trip:</label>
                  <input
                    type="number"
                    min="0"
                    value={peopleRescuedInput}
                    onChange={(e) => setPeopleRescuedInput(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Food Rations:</label>
                  <input
                    type="number"
                    min="0"
                    value={foodPacksInput}
                    onChange={(e) => setFoodPacksInput(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Water Kits:</label>
                  <input
                    type="number"
                    min="0"
                    value={waterKitsInput}
                    onChange={(e) => setWaterKitsInput(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="text-xs space-y-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Mission Log Note:</label>
                  <input
                    type="text"
                    value={operationNote}
                    onChange={(e) => setOperationNote(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-medium"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={medicalProvided}
                    onChange={(e) => setMedicalProvided(e.target.checked)}
                    className="rounded text-teal-600"
                  />
                  <span className="text-slate-700 font-semibold">Medical First Aid & Triage Administered</span>
                </label>
              </div>

              {/* Action Buttons: Red -> Yellow -> Green */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleApplyUpdate('in-progress')}
                  className="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-600 text-white transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Mark In-Progress (Yellow)</span>
                </button>
                <button
                  onClick={() => handleApplyUpdate('secured')}
                  className="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Secured (Green)</span>
                </button>
              </div>
            </>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500 space-y-3">
              <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
              <div>
                <p className="font-bold text-slate-700 text-sm">No Sector Selected</p>
                <p className="mt-1">Click a red marker on the map or select a sector from the "Sectors" tab to manage triage and relief.</p>
              </div>
              <button
                onClick={() => setActiveTab('sectors')}
                className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all cursor-pointer"
              >
                View Sectors List
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
