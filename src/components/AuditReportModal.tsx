import React from 'react';
import {
  Download,
  Printer,
  X,
  Calendar,
  Building,
} from 'lucide-react';
import type { Locality, AuditLogEntry } from '../types';

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  localities: Locality[];
  auditLogs: AuditLogEntry[];
  region: 'bangladesh' | 'nepal';
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({
  isOpen,
  onClose,
  localities,
  auditLogs,
  region,
}) => {
  const [reportDate] = React.useState(() => new Date().toLocaleDateString());

  if (!isOpen) return null;

  // Compute metrics
  const totalVisited = localities.filter((l) => l.status !== 'critical').length;
  const totalSecured = localities.filter((l) => l.status === 'secured').length;
  const totalRescued = localities.reduce((acc, curr) => acc + curr.rescuedCount, 0);
  const totalFood = localities.reduce((acc, curr) => acc + curr.reliefPacksDelivered, 0);
  const totalWater = localities.reduce((acc, curr) => acc + curr.waterKitsDelivered, 0);

  const regionTitle =
    region === 'bangladesh'
      ? 'Feni & Eastern Districts Flood Emergency Operation'
      : 'Kathmandu Valley Flash Flood & Landslide Response';

  const downloadCSV = () => {
    const headers = 'Locality Name,Status,Ground Elev(m),Water Depth(m),People Rescued,Food Packs,Water Kits,Assigned Team\n';
    const rows = localities
      .map(
        (l) =>
          `"${l.name}","${l.status}","${l.elevation}","${l.waterLevelDepthMeters}","${l.rescuedCount}","${l.reliefPacksDelivered}","${l.waterKitsDelivered}","${l.assignedTeam || 'Unassigned'}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SAFER_Disaster_Audit_Report_${region}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="audit-report-title"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-8 transition-colors">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 text-white p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold border border-teal-500/30">
                Official Disaster Audit SitRep
              </span>
              <span className="text-xs text-slate-400">NASA Space Apps S.A.F.E.R.</span>
            </div>
            <h2 id="audit-report-title" className="text-lg font-bold">{regionTitle}</h2>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {reportDate}
              </span>
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5" /> Joint Rescue Coordination & Relief Audit
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label="Close Audit Report"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto panel-scroll-container">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">Places Visited</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 block">
                {totalVisited} / {localities.length}
              </span>
              <span className="text-[10px] text-teal-700 dark:text-teal-400 font-bold">
                {totalSecured} Secured (Green)
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">Total Rescued</span>
              <span className="text-xl font-bold text-teal-700 dark:text-teal-400 mt-1 block">{totalRescued}</span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Safely Evacuated</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">Food Rations</span>
              <span className="text-xl font-bold text-sky-700 dark:text-sky-400 mt-1 block">{totalFood}</span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Relief Packs</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">Water Supplies</span>
              <span className="text-xl font-bold text-blue-700 dark:text-blue-400 mt-1 block">{totalWater}</span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Purification Kits</span>
            </div>
          </div>

          {/* Detailed Locality Audit Table */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-2">Locality-by-Locality Operation Audit Table</h3>
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                  <tr>
                    <th className="p-2.5 border-b border-slate-200 dark:border-slate-700">Sector / Locality</th>
                    <th className="p-2.5 border-b border-slate-200 dark:border-slate-700">Current Status</th>
                    <th className="p-2.5 border-b border-slate-200 dark:border-slate-700">Rescued</th>
                    <th className="p-2.5 border-b border-slate-200 dark:border-slate-700">Relief Delivered</th>
                    <th className="p-2.5 border-b border-slate-200 dark:border-slate-700">Responding Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                  {localities.map((loc) => {
                    let statusLabel = (
                      <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 font-bold text-[10px]">
                        Critical (Red)
                      </span>
                    );
                    if (loc.status === 'in-progress') {
                      statusLabel = (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
                          In-Progress (Yellow)
                        </span>
                      );
                    } else if (loc.status === 'secured') {
                      statusLabel = (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                          Secured (Green)
                        </span>
                      );
                    }

                    return (
                      <tr key={loc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-2.5 font-bold text-slate-900 dark:text-white">{loc.name}</td>
                        <td className="p-2.5">{statusLabel}</td>
                        <td className="p-2.5">{loc.rescuedCount} civilians</td>
                        <td className="p-2.5">
                          {loc.reliefPacksDelivered} Food / {loc.waterKitsDelivered} Water
                        </td>
                        <td className="p-2.5 text-slate-500 dark:text-slate-400">{loc.assignedTeam || 'Pending Dispatch'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Operations Log Activity */}
          {auditLogs && auditLogs.length > 0 && (
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-2">Recent Timestamped Field Interventions</h3>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 panel-scroll-container">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{log.localityName}</span>: {log.actionTaken}
                      <span className="text-slate-500 dark:text-slate-400 block text-[10px]">{log.teamName} ({log.timestamp})</span>
                    </div>
                    <span className="font-bold text-teal-700 dark:text-teal-400">+{log.peopleRescued} rescued</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit Timestamp & Integrity Note */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            <b>Audit Integrity Verification:</b> All timestamps, GPS markers, and relief distributions are logged 
            using the SAFER operations ledger. Suitable for submission to the Ministry of Disaster Management & Relief, 
            NGO coalitions, and international funding audits.
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print SitRep</span>
            </button>
            <button
              onClick={downloadCSV}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs shadow-teal-600/20 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV Audit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
