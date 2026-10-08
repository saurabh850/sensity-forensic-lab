import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Hash, Shield, FileSearch, Eye, FileJson, History, Activity, AlertTriangle, AlertCircle, PlayCircle, BarChart3, Image as ImageIcon, Video, Music } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function EvidenceDetail() {
  const { id } = useParams();
  const [evidence, setEvidence] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    fetchEvidence();
  }, [id]);

  const fetchEvidence = async () => {
    try {
      // In a real app we'd need an endpoint for single evidence
      // For now we'll fetch cases and find the evidence, or add an endpoint in backend
      // Let's assume we added GET /evidence/{id} in backend
      const res = await axios.get(`${API_URL}/cases/`);
      let found: any = null;
      for (const c of res.data) {
        const ev = c.evidences.find((e: any) => e.id === id);
        if (ev) {
          found = ev;
          break;
        }
      }
      setEvidence(found);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      await axios.post(`${API_URL}/evidence/${id}/analyze`);
      await fetchEvidence();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) return <div className="font-mono text-zinc-500">LOADING_EVIDENCE...</div>;
  if (!evidence) return <div>Evidence not found</div>;

  const getAnalysis = (moduleName: string) => {
    return evidence.analysis_results?.find((a: any) => a.module === moduleName);
  };

  const localHeuristics = getAnalysis('local_heuristics');
  const sensityApi = getAnalysis('detector_sensity');
  const metadataResult = getAnalysis('metadata');

  let localData = null;
  if (localHeuristics) {
    try { localData = JSON.parse(localHeuristics.data); } catch (e) {}
  }

  let sensityData = null;
  if (sensityApi) {
    try { sensityData = JSON.parse(sensityApi.data); } catch (e) {}
  }

  let metaData = null;
  if (metadataResult) {
    try {
      metaData = JSON.parse(metadataResult.data);
    } catch (e) {}
  }

  const isVideo = evidence.mime_type.includes('video');
  const isImage = evidence.mime_type.includes('image');
  const isAudio = evidence.mime_type.includes('audio');

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <Link to={`/case/${evidence.case_id}`} className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Case
        </Link>
        {!localHeuristics && (
          <button 
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-medium rounded flex items-center gap-2 transition-colors text-sm"
          >
            {isAnalyzing ? <Activity className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
            {isAnalyzing ? "RUNNING_PIPELINE..." : "Run Full Examination"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column: Media Preview & File Info */}
        <div className="col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="aspect-video bg-black flex items-center justify-center border-b border-zinc-800 relative group">
              {isVideo ? (
                <Video className="w-12 h-12 text-zinc-700" />
              ) : isImage ? (
                <ImageIcon className="w-12 h-12 text-zinc-700" />
              ) : (
                <Music className="w-12 h-12 text-zinc-700" />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <span className="font-mono text-xs text-zinc-300">PREVIEW_UNAVAILABLE_IN_SECURE_ENCLAVE</span>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h3 className="font-medium text-zinc-200 truncate" title={evidence.original_filename}>
                  {evidence.original_filename}
                </h3>
                <p className="text-xs font-mono text-zinc-500 mt-1">{evidence.mime_type} • {(evidence.file_size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs font-mono">
                  <div className="text-zinc-500 mb-1">SHA-256</div>
                  <div className="bg-zinc-950 p-2 rounded border border-zinc-800 text-zinc-400 break-all select-all">
                    {evidence.sha256}
                  </div>
                </div>
                <div className="text-xs font-mono">
                  <div className="text-zinc-500 mb-1">MD5</div>
                  <div className="bg-zinc-950 p-2 rounded border border-zinc-800 text-zinc-500 break-all select-all">
                    {evidence.md5}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Provenance Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-zinc-200 mb-4">
              <Shield className="w-4 h-4 text-emerald-500" />
              Provenance
            </h3>
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                <span className="text-zinc-500">C2PA Metadata</span>
                <span className={`font-semibold ${metaData?.c2pa_status?.includes('DETECTED') ? 'text-amber-500' : 'text-zinc-300'}`}>
                  {metaData?.c2pa_status || 'NOT_FOUND'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                <span className="text-zinc-500">SynthID</span>
                <span className="text-zinc-300">NOT_DETECTED</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-zinc-500">Software Sig</span>
                <span className="text-zinc-300">{metaData?.codec || metaData?.format || 'UNKNOWN'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Analysis Tabs */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-1 border-b border-zinc-800">
            <button onClick={() => setActiveTab('overview')} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-primary text-zinc-100 bg-zinc-900/50' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}>Overview</button>
            <button onClick={() => setActiveTab('metadata')} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === 'metadata' ? 'border-primary text-zinc-100 bg-zinc-900/50' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}>Metadata / Forensics</button>
            <button onClick={() => setActiveTab('detector')} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === 'detector' ? 'border-primary text-zinc-100 bg-zinc-900/50' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}>Detector Lab</button>
            <button onClick={() => setActiveTab('coc')} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === 'coc' ? 'border-primary text-zinc-100 bg-zinc-900/50' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}>Chain of Custody</button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg min-h-[500px]">
            {activeTab === 'overview' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-200 mb-2">Examiner Notes</h3>
                  <div className="bg-zinc-950 p-4 rounded border border-zinc-800 text-sm text-zinc-300 whitespace-pre-wrap">
                    {evidence.notes || 'No preliminary notes provided.'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-zinc-800 rounded-lg bg-zinc-950/50">
                    <h4 className="text-xs font-mono text-zinc-500 mb-1">SOURCE</h4>
                    <p className="text-sm font-medium text-zinc-200">{evidence.source}</p>
                  </div>
                  <div className="p-4 border border-zinc-800 rounded-lg bg-zinc-950/50">
                    <h4 className="text-xs font-mono text-zinc-500 mb-1">ACQUISITION</h4>
                    <p className="text-sm font-medium text-zinc-200">{evidence.acquisition_method}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'metadata' && (
              <div className="p-0">
                {!metaData ? (
                  <div className="p-12 text-center text-zinc-500 font-mono text-sm">
                    Run full examination to extract metadata.
                  </div>
                ) : (
                  <div className="p-6 space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-zinc-200">
                      <FileSearch className="w-5 h-5 text-primary" />
                      Extracted Properties
                    </h3>
                    <div className="bg-zinc-950 border border-zinc-800 rounded p-4 font-mono text-xs overflow-auto max-h-[400px]">
                      <pre className="text-zinc-300">{JSON.stringify(metaData, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'detector' && (
              <div className="p-6">
                {!localData ? (
                  <div className="text-center py-12 text-zinc-500 font-mono text-sm border border-dashed border-zinc-800 rounded-lg">
                    Run full examination to generate results.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* SENSITY API CONFIG BLOCK */}
                    <div className="bg-zinc-950 border border-zinc-800 rounded p-4 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-zinc-300">SENSITY AI</div>
                        <div className="text-xs text-zinc-500 mt-1">External Detection Model</div>
                      </div>
                      <div className="text-right">
                        {!sensityData || sensityData.status === 'NOT_CONFIGURED' ? (
                          <span className="text-xs font-mono px-2 py-1 bg-zinc-800 text-zinc-400 rounded">STATUS: NOT CONFIGURED</span>
                        ) : (
                          <span className="text-xs font-mono px-2 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded">STATUS: ACTIVE</span>
                        )}
                      </div>
                    </div>
                    {(!sensityData || sensityData.status === 'NOT_CONFIGURED') && (
                       <p className="text-xs text-zinc-500 px-4">Valid SENSITY_API_KEY environment variable required for external analysis. Local heuristic analysis remains fully operational below.</p>
                    )}

                    {/* LOCAL HEURISTICS BLOCK */}
                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-emerald-500" /> LOCAL FORENSIC ANALYSIS
                        </div>
                        <span className="text-xs font-mono px-2 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded">STATUS: ACTIVE</span>
                      </div>
                      
                      <div className="space-y-4">
                        {localData.signals?.map((sig: any, idx: number) => (
                          <div key={idx} className="p-4 bg-zinc-950 border border-zinc-800 rounded">
                            <div className="flex items-center justify-between mb-3 border-b border-zinc-800/50 pb-2">
                              <span className="font-semibold text-zinc-200">{sig.signal}</span>
                              {sig.present ? (
                                <span className="flex items-center gap-1.5 text-xs font-mono text-amber-500 bg-amber-500/10 px-2 py-1 rounded">
                                  <AlertTriangle className="w-3 h-3" /> OBSERVED
                                </span>
                              ) : (
                                <span className="text-xs font-mono text-zinc-600">NOT_OBSERVED</span>
                              )}
                            </div>
                            
                            {sig.details && (
                              <div className="space-y-2 text-xs">
                                <div className="grid grid-cols-4 gap-2">
                                  <span className="text-zinc-500 font-mono">METHOD:</span>
                                  <span className="col-span-3 text-zinc-300">{sig.details.method}</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                  <span className="text-zinc-500 font-mono">FINDING:</span>
                                  <span className="col-span-3 text-zinc-200 font-medium">{sig.details.finding}</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                  <span className="text-zinc-500 font-mono">INTERPRETATION:</span>
                                  <span className="col-span-3 text-zinc-400">{sig.details.interpretation}</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                  <span className="text-zinc-500 font-mono">CONFIDENCE:</span>
                                  <span className="col-span-3 text-amber-500/80">{sig.details.confidence_type}</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2 mt-2 pt-2 border-t border-zinc-800/50">
                                  <span className="text-red-400/80 font-mono">LIMITATION:</span>
                                  <span className="col-span-3 text-red-400/80 italic">{sig.details.limitation}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-8 p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                      <h4 className="text-sm font-semibold text-amber-500 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Forensic Validity Limitations
                      </h4>
                      <ul className="text-xs text-amber-500/80 space-y-1 list-disc list-inside">
                        <li>All local heuristic indicators represent computationally measured observations, not absolute truth.</li>
                        <li>Automated findings must be corroborated by human examiner review.</li>
                        <li>Heuristic thresholds are configured for triage and do not represent scientifically validated ground truth.</li>
                        <li>C2PA structural markers do not guarantee cryptographic integrity without full manifest validation.</li>
                      </ul>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-zinc-800">
                      <h4 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-primary" />
                        Detector Failure Analysis
                      </h4>
                      <p className="text-xs text-zinc-500 mb-4">Record ground truth vs model prediction for accuracy tracking.</p>
                      
                      <div className="bg-zinc-950 p-4 border border-zinc-800 rounded space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-zinc-500 mb-1">GROUND TRUTH</label>
                            <select className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm text-zinc-200 outline-none focus:border-primary">
                              <option>Select...</option>
                              <option>Authentic</option>
                              <option>AI-Generated</option>
                              <option>Manipulated / Edited</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-zinc-500 mb-1">FAILURE TYPE</label>
                            <select className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm text-zinc-200 outline-none focus:border-primary">
                              <option>N/A (Correct)</option>
                              <option>False Positive</option>
                              <option>False Negative</option>
                            </select>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded transition-colors w-full">
                          Log Failure Report
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}

            {activeTab === 'coc' && (
              <div className="p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-zinc-200 mb-6">
                  <History className="w-5 h-5 text-primary" />
                  Audit Trail & Chain of Custody
                </h3>
                
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
                  {evidence.audit_logs?.sort((a:any,b:any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((log: any, idx: number) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-zinc-900 bg-primary/20 text-primary group-[.is-active]:bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] p-4 rounded border border-zinc-800 bg-zinc-950/50 shadow">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-zinc-200 text-sm">{log.action}</span>
                          <span className="font-mono text-xs text-zinc-500">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mb-2">{log.description}</p>
                        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-zinc-800/50 text-[10px] font-mono text-zinc-500">
                          <span>ACTOR: {log.actor}</span>
                          <span className="truncate max-w-[150px]" title={log.evidence_hash}>HASH: {log.evidence_hash.substring(0,8)}...</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
