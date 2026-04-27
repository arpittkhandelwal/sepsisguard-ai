import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/login';
  };

  return (
    <aside className="flex flex-col w-64 fixed left-0 top-14 h-[calc(100vh-3.5rem)] z-40 bg-white border-r border-slate-200 hidden md:flex">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-slate-900 flex items-center justify-center text-white font-bold">A</div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-900">ICU Unit Alpha</h2>
            <p className="text-[10px] text-slate-400">System Status: Nominal</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 py-4 flex flex-col">
        <Link to="/dashboard" className={`flex items-center gap-3 py-3 px-6 font-label-caps text-label-caps uppercase tracking-widest transition-all ${path === '/dashboard' ? 'bg-slate-50 text-slate-900 border-r-4 border-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}>
          <span className="material-symbols-outlined">dashboard</span>
          Dashboard
        </Link>
        <Link to="/patients" className={`flex items-center gap-3 py-3 px-6 font-label-caps text-label-caps uppercase tracking-widest transition-all ${path === '/patients' || path.startsWith('/patient/') ? 'bg-slate-50 text-slate-900 border-r-4 border-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}>
          <span className="material-symbols-outlined">group</span>
          Patients
        </Link>
        <Link to="/alerts" className={`flex items-center gap-3 py-3 px-6 font-label-caps text-label-caps uppercase tracking-widest transition-all ${path === '/alerts' ? 'bg-slate-50 text-slate-900 border-r-4 border-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}>
          <span className="material-symbols-outlined">emergency</span>
          Alerts
        </Link>
        <Link to="/analytics" className={`flex items-center gap-3 py-3 px-6 font-label-caps text-label-caps uppercase tracking-widest transition-all ${path === '/analytics' ? 'bg-slate-50 text-slate-900 border-r-4 border-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}>
          <span className="material-symbols-outlined">monitoring</span>
          Analytics
        </Link>
        <Link to="/settings" className={`flex items-center gap-3 py-3 px-6 font-label-caps text-label-caps uppercase tracking-widest transition-all ${path === '/settings' ? 'bg-slate-50 text-slate-900 border-r-4 border-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}>
          <span className="material-symbols-outlined">settings</span>
          Settings
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-3 py-3 px-6 font-label-caps text-label-caps uppercase tracking-widest transition-all text-slate-500 hover:bg-slate-50 mt-auto border-t border-slate-50">
          <span className="material-symbols-outlined">logout</span>
          Sign Out
        </button>
      </nav>
      <div className="p-6 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
            <img alt="User Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4Fgd217jaqFl_JrAJkJfsh8nnAT9wpbWOQ0nGUBCVfUOziMvOjKNQc6pqDjkzdlYlJeuAgkce0IiG5_0cuzMyl5cGnUMeLWbHsReRDxh0BH7BkCrmDgzGtKZClYMamZ7ETSSLyoz-yJ_c0_Uo_sozJQBLDNntVD8S6b6rW8MNKJFXPYhKG4eYUNYhUyEWJtmsaX5L46EFPojtNOK-MGV9n3rpkV5Tbr1kH-KtpUsdfHZrFQF4n79xlfGF-hQhqdQkLTbomFF6ZyM"/>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Dr. Aris Thorne</div>
            <div className="text-[10px] text-slate-500">Chief Intensivist</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
