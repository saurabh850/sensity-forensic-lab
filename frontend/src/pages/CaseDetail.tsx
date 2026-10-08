import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, FileBox, Upload, FileText, Image as ImageIcon, Video, Music, Activity, ShieldAlert } from 'lucide-react';

const API_URL = 'http://localhost:8000';

export default function CaseDetail() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState<any>(null);
  const [evidences, setEvidences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCaseData();
  }, [id]);

  const fetchCaseData = async () => {
    try {
      const res = await axios.get(`${API_URL}/cases/${id}`);
      setCaseData(res.data);
      setEvidences(res.data.evidences || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleIngestEvidence = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !id) return;
    const file = e.target.files[0];
    
    const formData = new FormData();
    formData.append('case_id', id);
    formData.append('source', 'Manual Upload');
    formData.append('acquisition_method', 'Local File Ingestion');
    formData.append('examiner', 'Current User');
    formData.append('notes', 'Ingested via frontend UI');
    formData.append('file', file);
    
    try {
      await axios.post(`${API_URL}/evidence/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchCaseData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="font-mono text-zinc-500">LOADING_CASE_DATA...</div>;
  if (!caseData) return <div>Case not found</div>;

  const getIcon = (mime: string) => {
    if (mime.includes('image')) return <ImageIcon className="w-5 h-5 text-blue-400" />;
    if (mime.includes('video')) return <Video className="w-5 h-5 text-purple-400" />;
    if (mime.includes('audio')) return <Music className="w-5 h-5 text-emerald-400" />;
    return <FileText className="w-5 h-5 text-zinc-400" />;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Cases
      </Link>
      
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-zinc-100">{caseData.title}</h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                {caseData.classification}
              </span>
            </div>
            <p className="text-zinc-400 mt-2">{caseData.description}</p>
          </div>
          <div className="text-right text-xs font-mono text-zinc-500 space-y-1">
            <p><span className="text-zinc-400">ID:</span> {caseData.id}</p>
            <p><span className="text-zinc-400">EXAMINER:</span> {caseData.examiner}</p>
            <p><span className="text-zinc-400">ORG:</span> {caseData.organization}</p>
            <p><span className="text-zinc-400">OPENED:</span> {new Date(caseData.created_at).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mt-8">
        <h2 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
          <FileBox className="w-5 h-5 text-primary" />
          Evidence Inventory
        </h2>
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleIngestEvidence} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded font-medium flex items-center gap-2 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Ingest Evidence
          </button>
        </div>
      </div>

      {evidences.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 font-mono text-sm border border-dashed border-zinc-800 rounded-lg">
          NO_EVIDENCE_INGESTED
        </div>
      ) : (
        <div className="overflow-x-auto border border-zinc-800 rounded-lg bg-zinc-900/30">
          <table className="w-full text-sm text-left">
            <thead className="text-xs font-mono text-zinc-500 uppercase bg-zinc-900 border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3 font-medium">Filename</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">SHA-256</th>
                <th className="px-4 py-3 font-medium">Analysis</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {evidences.map((ev: any) => {
                const hasAnalysis = ev.analysis_results && ev.analysis_results.length > 0;
                
                return (
                  <tr key={ev.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {getIcon(ev.mime_type)}
                        <span className="font-medium text-zinc-300 truncate max-w-[200px]" title={ev.original_filename}>
                          {ev.original_filename}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-400">{ev.mime_type}</td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                      <span className="truncate inline-block max-w-[150px]" title={ev.sha256}>
                        {ev.sha256}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {hasAnalysis ? (
                        <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-500">
                          <Activity className="w-3.5 h-3.5" /> Analyzed
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500">
                          <ShieldAlert className="w-3.5 h-3.5" /> Pending
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link 
                        to={`/evidence/${ev.id}`}
                        className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        Examine &rarr;
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
