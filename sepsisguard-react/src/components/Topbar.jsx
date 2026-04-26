import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Topbar = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <header className="flex justify-between items-center w-full px-6 h-14 z-50 bg-white border-b border-slate-200 fixed top-0 left-0">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-lg font-black tracking-tighter text-slate-900 uppercase">SepsisGuard AI</Link>
        <nav className="hidden md:flex gap-6">
          <Link to="/dashboard" className={`font-sans text-sm tracking-tight ${path === '/dashboard' ? 'text-slate-900 font-bold border-b-2 border-slate-900 pb-1' : 'text-slate-500 font-medium hover:text-slate-900 transition-colors'}`}>Dashboard</Link>
          <Link to="/patients" className={`font-sans text-sm tracking-tight ${path === '/patients' || path.startsWith('/patient/') ? 'text-slate-900 font-bold border-b-2 border-slate-900 pb-1' : 'text-slate-500 font-medium hover:text-slate-900 transition-colors'}`}>Patients</Link>
          <Link to="/alerts" className={`font-sans text-sm tracking-tight ${path === '/alerts' ? 'text-slate-900 font-bold border-b-2 border-slate-900 pb-1' : 'text-slate-500 font-medium hover:text-slate-900 transition-colors'}`}>Alerts</Link>
          <Link to="/analytics" className={`font-sans text-sm tracking-tight ${path === '/analytics' ? 'text-slate-900 font-bold border-b-2 border-slate-900 pb-1' : 'text-slate-500 font-medium hover:text-slate-900 transition-colors'}`}>Analytics</Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-emerald-700 font-label-caps text-label-caps uppercase">Monitoring Active</span>
        </div>
        <div className="flex gap-3 text-slate-500">
          <span className="material-symbols-outlined cursor-pointer hover:text-slate-900" style={{fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"}}>notifications</span>
          <span className="material-symbols-outlined cursor-pointer hover:text-slate-900" style={{fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"}}>account_circle</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
