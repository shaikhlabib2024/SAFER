import React, { useState, useEffect } from 'react';
import {
  Satellite,
  Database,
  ExternalLink,
  X,
  RefreshCw,
  CheckCircle,
  FileCode,
  Radio,
} from 'lucide-react';
import { NASA_DATASETS_REGISTRY, fetchLiveNasaPowerData } from '../services/nasaService';

interface NasaDatasetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  region: 'bangladesh' | 'nepal';
}

export const NasaDatasetsModal: React.FC<NasaDatasetsModalProps> = ({
  isOpen,
  onClose,
  region,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [apiResult, setApiResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'datasets' | 'live-api'>('datasets');

  const executeApiQuery = async () => {
    setLoading(true);
    const result = await fetchLiveNasaPowerData(region);
    setApiResult(result);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      executeApiQuery();
    }
  }, [isOpen, region]);

  if (!isOpen) return null;

  const isBd = region === 'bangladesh';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-900 via-teal-900 to-slate-900 text-white p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-400/20 text-sky-300 text-[11px] font-bold border border-sky-400/30 flex items-center gap-1">
                <Satellite className="w-3 h-3" /> NASA Earth Science Data
              </span>
              <span className="text-xs text-slate-300">Space Apps Challenge 2026</span>
            </div>
            <h2 className="text-lg font-bold">NASA Datasets & Scientific Verification</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Verified satellite observations for {isBd ? 'Feni & Eastern Bangladesh' : 'Kathmandu Valley, Nepal'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('datasets')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === 'datasets'
                ? 'bg-white text-teal-800 border-teal-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 border-transparent'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>NASA Datasets Ingested (4)</span>
          </button>
          <button
            onClick={() => setActiveTab('live-api')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === 'live-api'
                ? 'bg-white text-teal-800 border-teal-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 border-transparent'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
            <span>Live NASA API Query Tool</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          {activeTab === 'datasets' ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                SAFER ingests four foundational NASA Earth Observation datasets to calculate flood inundation, ground elevation, and evacuation corridors:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {NASA_DATASETS_REGISTRY.map((ds) => (
                  <div
                    key={ds.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="font-bold text-slate-900 text-xs">{ds.name}</span>
                        <a
                          href={ds.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-teal-600 hover:text-teal-800"
                          title="Open NASA Portal"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <div className="space-y-1 text-[11px] text-slate-600 mb-2">
                        <div><b>Mission:</b> {ds.mission}</div>
                        <div><b>NASA Center:</b> {ds.nasaCenter}</div>
                        <div><b>Resolution:</b> {ds.resolution}</div>
                        <div><b>Instrument:</b> {ds.sensor}</div>
                      </div>

                      <div className="p-2 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 leading-relaxed">
                        <b className="text-teal-800">How SAFER Uses It:</b> {ds.howWeUseIt}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-teal-900 block">
                    Querying NASA Langley Research Center (LaRC) POWER API
                  </span>
                  <span className="text-teal-700 text-[11px]">
                    Target: {isBd ? 'Feni (23.0159°N, 91.3976°E)' : 'Kathmandu (27.7172°N, 85.3240°E)'} | Variable: Precipitation (PRECTOTCORR)
                  </span>
                </div>
                <button
                  onClick={executeApiQuery}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>{loading ? 'Querying...' : 'Re-query NASA'}</span>
                </button>
              </div>

              {/* Data Display */}
              {apiResult && apiResult.data && (
                <div className="space-y-3">
                  <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-xs">
                    <h4 className="font-bold text-slate-900 text-xs mb-2 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>NASA Satellite Measured Daily Rainfall (mm/day)</span>
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                      {Object.entries(apiResult.data.PRECTOTCORR || {}).map(([date, val]: any) => {
                        const isPeak = Number(val) > 80;
                        return (
                          <div
                            key={date}
                            className={`p-2.5 rounded-xl border ${
                              isPeak
                                ? 'bg-red-50 border-red-300 ring-2 ring-red-400/20'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <span className="text-[10px] text-slate-500 font-semibold block">
                              {date.slice(0, 4)}-{date.slice(4, 6)}-{date.slice(6, 8)}
                            </span>
                            <span className={`text-base font-bold block mt-0.5 ${isPeak ? 'text-red-700' : 'text-slate-800'}`}>
                              {val} mm
                            </span>
                            {isPeak && (
                              <span className="text-[9px] font-bold text-red-600 uppercase">
                                Flood Peak
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Raw Endpoint & JSON Snippet */}
                  <div className="p-3 bg-slate-900 text-slate-200 rounded-2xl text-[11px] font-mono overflow-x-auto space-y-1">
                    <div className="text-slate-400 flex items-center gap-1">
                      <FileCode className="w-3.5 h-3.5 text-teal-400" />
                      <span>NASA Endpoint Queried:</span>
                    </div>
                    <div className="text-teal-300 break-all">{apiResult.endpoint}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Open-access data provided by NASA Earthdata & GSFC / LaRC
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
