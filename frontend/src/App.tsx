import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, Database, Activity, AlertTriangle, FileText, Search, LayoutDashboard } from 'lucide-react';
import CasesView from './pages/CasesView';
import CaseDetail from './pages/CaseDetail';
import EvidenceDetail from './pages/EvidenceDetail';
import DetectorLab from './pages/DetectorLab';
import ThreatTracker from './pages/ThreatTracker';

const Sidebar = () => {
  const location = useLocation();
  const navItems = [
    { name: 'Cases', path: '/', icon: LayoutDashboard },
    { name: 'Detector Lab', path: '/detectors', icon: Activity },
    { name: 'Threat Tracker', path: '/threats', icon: AlertTriangle },
    { name: 'Reports', path: '/reports', icon: FileText },
  ];

  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen">
      <div className="p-4 flex items-center gap-3 border-b border-zinc-800">
        <Shield className="text-primary w-6 h-6" />
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-wider uppercase text-zinc-100">FORensic</span>
          <span className="text-xs text-zinc-500 font-mono tracking-widest">Evidence Lab</span>
        </div>
      </div>
      <div className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive 
                  ? 'bg-zinc-800 text-zinc-100 font-medium' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-zinc-800 text-xs font-mono text-zinc-600 flex items-center justify-between">
        <span>SENSITY.AI // v2.4.1</span>
        <div className="w-2 h-2 rounded-full bg-emerald-500/50 relative">
           <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
        </div>
      </div>
    </div>
  );
};

const Topbar = () => (
  <header className="h-14 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-6">
    <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1.5 w-96 focus-within:border-primary/50 transition-colors">
      <Search className="w-4 h-4 text-zinc-500 mr-2" />
      <input 
        type="text" 
        placeholder="Search cases, hashes, or evidence..." 
        className="bg-transparent border-none outline-none text-sm w-full text-zinc-300 placeholder:text-zinc-600"
      />
    </div>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
        <Database className="w-3 h-3 text-primary" />
        <span>LOCAL_SECURE_ENCLAVE</span>
      </div>
      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 text-sm font-medium">
        DA
      </div>
    </div>
  </header>
);

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/20">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 overflow-auto bg-[#09090b] text-zinc-300 p-6">
            <Routes>
              <Route path="/" element={<CasesView />} />
              <Route path="/case/:id" element={<CaseDetail />} />
              <Route path="/evidence/:id" element={<EvidenceDetail />} />
              <Route path="/detectors" element={<DetectorLab />} />
              <Route path="/threats" element={<ThreatTracker />} />
              <Route path="*" element={<div className="text-zinc-500 font-mono text-sm">Module not loaded or access denied.</div>} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
