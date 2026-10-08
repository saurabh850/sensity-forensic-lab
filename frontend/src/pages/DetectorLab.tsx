import React from 'react';
import { Activity, Sliders, Box, Layers, PlayCircle, BarChart2 } from 'lucide-react';

export default function DetectorLab() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Detector Lab
          </h1>
          <p className="text-sm text-zinc-500 mt-1 font-mono">Configure, test, and benchmark media analysis models</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-200 mb-4 flex items-center gap-2"><Layers className="w-4 h-4 text-zinc-500"/> Active Adapters</h3>
            
            <div className="space-y-3">
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded flex items-center justify-between opacity-50">
                <div>
                  <div className="text-sm font-medium text-zinc-400">Sensity API Adapter</div>
                  <div className="text-[10px] font-mono text-zinc-500 mt-0.5">STATUS: NOT_CONFIGURED</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
              </div>
              
              <div className="p-3 bg-zinc-950 border border-emerald-500/30 rounded flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-emerald-400">Local Heuristics Engine</div>
                  <div className="text-[10px] font-mono text-zinc-500 mt-0.5">STATUS: ACTIVE</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded flex items-center justify-between opacity-50">
                <div>
                  <div className="text-sm font-medium text-zinc-400">Audio Spectral Analyzer</div>
                  <div className="text-[10px] font-mono text-zinc-500 mt-0.5">STATUS: MODULE_MISSING</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-200 mb-4 flex items-center gap-2"><Sliders className="w-4 h-4 text-zinc-500"/> Global Thresholds</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>CONFIDENCE THRESHOLD</span>
                  <span>0.85</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[85%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>ANOMALY SENSITIVITY</span>
                  <span>0.60</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[60%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 min-h-[400px] flex flex-col items-center justify-center text-center">
            <Activity className="w-16 h-16 text-zinc-800 mb-4" />
            <h2 className="text-xl font-medium text-zinc-300">Live Detector Telemetry</h2>
            <p className="text-zinc-500 text-sm mt-2 max-w-md">
              Awaiting batch-processing pipeline integration. Individual file analysis available via the Cases view.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
