import React, { useState } from 'react';
import {
  Users,
  Package,
  Droplets,
  CheckCircle2,
  Clock,
  MapPin,
  FileSpreadsheet,
  PanelRightClose,
} from 'lucide-react';
import type { Locality, LocalityStatus } from '../types';

interface RescuerSectorControlProps {
  localities: Locality[];
  selectedLocality: Locality | null;
  onSelectLocality: (locality: Locality) => void;
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
  teamName: string;
  setTeamName: (name: string) => void;
  onOpenAuditModal: () => void;
  onMinimize?: () => void;
}

export const RescuerSectorControl: React.FC<RescuerSectorControlProps> = ({
  localities,
  selectedLocality,
  onSelectLocality,
  onUpdateLocalityStatus,
  teamName,
  setTeamName,
  onOpenAuditModal,
  onMinimize,
}) => {
  const [sectorFilter, setSectorFilter] = useState<'all' | 'critical' | 'in-progress' | 'secured'>('all');
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

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs flex flex-col h-full min-h-0">
      {/* 1. Header Toolbar with SitRep & Minimize */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 shrink-0">
        <div>
          <h2 className="font-extrabold text-slate-900 text-xs sm:text-sm">Sector Triage & Mission</h2>
          <p className="text-[11px] text-slate-500">Coordinate relief & turn sectors green</p>
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
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              title="Minimize sector control"
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Operations KPI Bar (Compact 4-column) */}
      <div className="grid grid-cols-4 gap-1.5 pt-2 shrink-0">
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2 text-center shadow-2xs">
          <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] font-semibold mb-0.5">
            <Users className="w-3 h-3 text-teal-600" />
            <span className="truncate">Rescued</span>
          </div>
          <div className="text-sm sm:text-base font-extrabold text-slate-900">{totalRescued}</div>
          <div className="text-[9px] text-teal-700 font-medium">In Shelter</div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2 text-center shadow-2xs">
          <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] font-semibold mb-0.5">
            <Package className="w-3 h-3 text-sky-600" />
            <span className="truncate">Food</span>
          </div>
          <div className="text-sm sm:text-base font-extrabold text-slate-900">{totalFoodDelivered}</div>
          <div className="text-[9px] text-sky-700 font-medium">Delivered</div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2 text-center shadow-2xs">
          <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] font-semibold mb-0.5">
            <Droplets className="w-3 h-3 text-blue-600" />
            <span className="truncate">Water</span>
          </div>
          <div className="text-sm sm:text-base font-extrabold text-slate-900">{totalWaterDelivered}</div>
          <div className="text-[9px] text-blue-700 font-medium">Kits</div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2 text-center shadow-2xs">
          <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] font-semibold mb-0.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span className="truncate">Secured</span>
          </div>
          <div className="text-sm sm:text-base font-extrabold text-emerald-600">{securedPercentage}%</div>
          <div className="text-[9px] text-emerald-700 font-medium">{securedCount}/{totalLocalities}</div>
        </div>
      </div>

      {/* 3. Filter Chips */}
      <div className="pt-2.5 pb-1.5 flex items-center justify-between gap-1 text-[11px] shrink-0 border-b border-slate-100">
        <span className="font-bold text-slate-700 text-xs">Sectors:</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSectorFilter('all')}
            className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
              sectorFilter === 'all' ? 'bg-slate-900 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({localities.length})
          </button>
          <button
            onClick={() => setSectorFilter('critical')}
            className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
              sectorFilter === 'critical' ? 'bg-red-600 text-white shadow-2xs' : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            Red ({criticalCount})
          </button>
          <button
            onClick={() => setSectorFilter('in-progress')}
            className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
              sectorFilter === 'in-progress' ? 'bg-amber-500 text-white shadow-2xs' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Yellow ({inProgressCount})
          </button>
          <button
            onClick={() => setSectorFilter('secured')}
            className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
              sectorFilter === 'secured' ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Green ({securedCount})
          </button>
        </div>
      </div>

      {/* 4. Scrollable Container with Sector List & Mission Control Form */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 panel-scroll-container space-y-3 pt-2">
        {/* Sector Cards */}
        <div className="space-y-1.5">
          {filteredLocalities.map((loc) => {
            const isSelected = selectedLocality?.id === loc.id;
            let statusBadge = (
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 border border-red-200">
                Critical (Red)
              </span>
            );
            if (loc.status === 'in-progress') {
              statusBadge = (
                <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                  Active (Yellow)
                </span>
              );
            } else if (loc.status === 'secured') {
              statusBadge = (
                <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                  Secured (Green)
                </span>
              );
            }

            return (
              <div
                key={loc.id}
                onClick={() => onSelectLocality(loc)}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500/20 shadow-xs'
                    : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-xs leading-snug">{loc.name}</h3>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Water Depth: <b className="text-slate-800">{loc.waterLevelDepthMeters}m</b> | Elev: +{loc.elevation}m
                    </div>
                  </div>
                  <div>{statusBadge}</div>
                </div>

                <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-600 pt-1 border-t border-slate-200/60">
                  <span>Trapped: <b className="text-red-700">{loc.trappedCount}</b> | Rescued: <b className="text-emerald-700">{loc.rescuedCount}</b></span>
                  <span className="text-teal-700 font-bold flex items-center gap-0.5">
                    {isSelected ? 'Selected ✓' : 'Select →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 5. Active Sector Mission Control Form */}
        {selectedLocality ? (
          <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-3 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-teal-700">Mission Control</span>
                <h3 className="font-extrabold text-slate-900 text-xs">{selectedLocality.name}</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500">Status:</span>
                <div className="font-black text-xs uppercase text-slate-800">{selectedLocality.status}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-0.5 text-[11px]">Responding Unit:</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-0.5 text-[11px]">People Rescued Trip:</label>
                <input
                  type="number"
                  min="0"
                  value={peopleRescuedInput}
                  onChange={(e) => setPeopleRescuedInput(Number(e.target.value))}
                  className="w-full px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-0.5 text-[11px]">Food Rations:</label>
                <input
                  type="number"
                  min="0"
                  value={foodPacksInput}
                  onChange={(e) => setFoodPacksInput(Number(e.target.value))}
                  className="w-full px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-0.5 text-[11px]">Water Kits:</label>
                <input
                  type="number"
                  min="0"
                  value={waterKitsInput}
                  onChange={(e) => setWaterKitsInput(Number(e.target.value))}
                  className="w-full px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-medium"
                />
              </div>
            </div>

            <div className="text-xs space-y-1.5">
              <div>
                <label className="block text-slate-600 font-semibold mb-0.5 text-[11px]">Log Note:</label>
                <input
                  type="text"
                  value={operationNote}
                  onChange={(e) => setOperationNote(e.target.value)}
                  className="w-full px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-medium"
                />
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer pt-0.5">
                <input
                  type="checkbox"
                  checked={medicalProvided}
                  onChange={(e) => setMedicalProvided(e.target.checked)}
                  className="rounded text-teal-600"
                />
                <span className="text-slate-700 font-semibold text-[11px]">Medical First Aid Administered</span>
              </label>
            </div>

            {/* HIGHLIGHTED STATUS ACTION BUTTONS */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => handleApplyUpdate('in-progress')}
                className="flex-1 py-2 px-2.5 rounded-xl font-black text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="Mark sector as in-progress (Yellow)"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Mark Yellow (Active)</span>
              </button>
              <button
                onClick={() => handleApplyUpdate('secured')}
                className="flex-1 py-2 px-2.5 rounded-xl font-black text-xs bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/35 ring-2 ring-emerald-400/40 flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                title="Mark sector as fully evacuated and secured (Green)"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Green (Secured)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-5 text-center text-xs text-slate-500 space-y-1.5">
            <MapPin className="w-6 h-6 text-slate-400 mx-auto" />
            <p className="font-bold text-slate-700">Select a Sector Above</p>
            <p className="text-[11px]">Click any locality card or map marker to log dispatched units, food & water supplies.</p>
          </div>
        )}
      </div>
    </div>
  );
};
