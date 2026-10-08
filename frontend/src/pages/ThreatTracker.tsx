import React from 'react';
import { AlertTriangle, Database, Shield, Globe, ExternalLink } from 'lucide-react';

export default function ThreatTracker() {
  const threats = [
    { id: 'GEN-092', name: 'Midjourney v6', type: 'Image Generator', firstObserved: '2023-12-21', artifact: 'Hyper-realistic skin textures, minor background structural inconsistencies', detectorBehavior: 'High confidence detection, SynthID not present', status: 'Tracked' },
    { id: 'GEN-104', name: 'HeyGen API', type: 'Video/Avatar', firstObserved: '2023-08-14', artifact: 'Lip-sync temporal smoothing, missing micro-expressions', detectorBehavior: 'Variable confidence, requires frame-by-frame analysis', status: 'Tracked' },
    { id: 'GEN-115', name: 'ElevenLabs v2', type: 'Audio Synthesis', firstObserved: '2023-10-05', artifact: 'High frequency rolloff above 16kHz, unnaturally clean noise floor', detectorBehavior: 'Very high confidence via spectral analysis', status: 'Tracked' },
    { id: 'TTP-042', name: 'Re-encoding Obfuscation', type: 'Evasion Technique', firstObserved: '2022-04-11', artifact: 'Multiple compression generation loss, mismatched container/codec metadata', detectorBehavior: 'Lowers confidence of pixel-level detectors by 15-20%', status: 'Active Warning' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            Threat Intelligence
          </h1>
          <p className="text-sm text-zinc-500 mt-1 font-mono">Track known AI generators, evasion TTPs, and forensic signatures</p>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs text-zinc-500">
          <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> 412 ENTRIES</span>
          <span className="flex items-center gap-1.5 text-emerald-500"><Globe className="w-3.5 h-3.5" /> SYNCED: JUST NOW</span>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs font-mono text-zinc-500 uppercase bg-zinc-950 border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4 font-medium">ID / Generator</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Known Forensic Artifacts</th>
              <th className="px-6 py-4 font-medium">Detection Efficacy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {threats.map((t) => (
              <tr key={t.id} className="hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-zinc-500">{t.id}</span>
                    {t.status === 'Active Warning' && <AlertTriangle className="w-3 h-3 text-red-500" />}
                  </div>
                  <div className="font-semibold text-zinc-200">{t.name}</div>
                </td>
                <td className="px-6 py-4 text-zinc-400 font-medium">{t.type}</td>
                <td className="px-6 py-4 text-zinc-300 text-xs">
                  {t.artifact}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                    <Shield className="w-3.5 h-3.5 text-zinc-400" />
                    {t.detectorBehavior}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex items-center justify-between">
        <div>
          <h4 className="text-zinc-200 font-medium text-sm">Sensity Threat Feed Integration</h4>
          <p className="text-xs text-zinc-500 mt-1">Connect to Sensity's real-time threat intelligence API for updated signatures.</p>
        </div>
        <button className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono rounded transition-colors flex items-center gap-2">
          CONFIGURE <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
