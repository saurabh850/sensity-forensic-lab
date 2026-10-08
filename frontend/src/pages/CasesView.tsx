import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Folder, Plus, Server, Clock, ChevronRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function CasesView() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const res = await axios.get(`${API_URL}/cases/`);
      setCases(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  const handleNewCase = async () => {
    try {
      await axios.post(`${API_URL}/cases/`, {
        title: "New Investigation",
        examiner: "Current User",
        organization: "Forensic Team",
        description: "Pending details",
        classification: "UNCLASSIFIED",
        notes: ""
      });
      fetchCases();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <Folder className="w-6 h-6 text-primary" />
            Active Cases
          </h1>
          <p className="text-sm text-zinc-500 mt-1 font-mono">Manage forensic investigations and evidence sets</p>
        </div>
        <div className="flex items-center gap-3">

          <button 
            onClick={handleNewCase}
            className="px-3 py-1.5 text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Case
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center font-mono text-zinc-600 animate-pulse">
          INITIALIZING...
        </div>
      ) : cases.length === 0 ? (
        <div className="border border-dashed border-zinc-800 rounded-lg p-12 text-center flex flex-col items-center">
          <Folder className="w-12 h-12 text-zinc-700 mb-4" />
          <h3 className="text-lg font-medium text-zinc-300">No cases found</h3>
          <p className="text-zinc-500 text-sm mt-1 mb-6">Initialize the demo data or create a new case to begin.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {cases.map((c) => (
            <Link 
              key={c.id} 
              to={`/case/${c.id}`}
              className="block group bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg p-4 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-zinc-200 group-hover:text-primary transition-colors">{c.title}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      {c.classification}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 mt-1 line-clamp-1">{c.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
              </div>
              <div className="flex items-center gap-6 mt-4 text-xs font-mono text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <span className="text-zinc-400">ID:</span> {c.id.split('-')[0]}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-zinc-400">EXAMINER:</span> {c.examiner}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {new Date(c.created_at).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
