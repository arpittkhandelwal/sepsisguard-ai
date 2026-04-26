import React, { useState } from 'react';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [stats, setStats] = useState({ criticalCount: 0, alerts: [] });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [patients, alerts] = await Promise.all([
          import('../services/api').then(m => m.api.getPatients()),
          import('../services/api').then(m => m.api.getAlerts())
        ]);
        const criticalCount = patients.filter(p => p.status === 'Critical').length;
        setStats({ criticalCount, alerts: alerts.slice(0, 3) });
      } catch (err) {
        console.error("Assistant data fetch error:", err);
      }
    };
    if (isAssistantOpen) fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [isAssistantOpen]);

  return (
    <div className="bg-surface text-on-surface min-h-screen relative overflow-x-hidden">
      <Topbar />
      <Sidebar />
      <main className="md:ml-64 mt-14 p-6 overflow-y-auto min-h-[calc(100vh-3.5rem)]">
        {children}
      </main>

      {/* Global AI Assistant Drawer */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out border-l border-outline-variant ${isAssistantOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-lg bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-400" data-icon="psychology">psychology</span>
            <h3 className="font-bold text-sm uppercase tracking-widest">SepsisGuard AI</h3>
          </div>
          <button onClick={() => setIsAssistantOpen(false)} className="hover:text-sky-400">
            <span className="material-symbols-outlined" data-icon="close">close</span>
          </button>
        </div>
        <div className="p-lg space-y-md overflow-y-auto h-[calc(100%-60px)]">
          <div className="p-md bg-sky-50 rounded-lg border border-sky-100">
            <p className="text-[11px] font-bold text-sky-800 uppercase mb-1">System Status</p>
            <p className="text-[12px] text-sky-900 leading-relaxed">
              All models are operational. {stats.criticalCount} patients currently in "Critical" state across the facility.
            </p>
          </div>
          
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-lg">Hospital-Wide Alerts</h4>
          {stats.alerts.map((item, i) => (
            <div key={i} className="p-sm border border-outline-variant rounded hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-1">
                <p className="text-[11px] font-bold text-slate-800">{item.patientName}</p>
                <span className="text-[9px] text-slate-400">{item.time}</span>
              </div>
              <p className="text-[10px] text-slate-500 group-hover:text-slate-700 transition-colors">{item.description || item.title}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-[9px] font-bold text-primary uppercase tracking-tighter bg-slate-100 px-1 rounded">{item.bed}</p>
                {item.severity === 'Critical' && <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>}
              </div>
            </div>
          ))}
          
          <div className="mt-xl pt-lg border-t border-outline-variant">
            <button className="w-full py-3 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[16px]">sensors</span>
              Broadcast Alert
            </button>
          </div>
        </div>
      </div>

      {/* FAB Button */}
      <button 
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-50 group"
      >
        <span className="material-symbols-outlined group-hover:rotate-12 transition-transform" data-icon="psychology">psychology</span>
        <div className="absolute bottom-full right-0 mb-4 px-3 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
          Global AI Assistant
        </div>
      </button>

      {/* Overlay for Drawer */}
      {isAssistantOpen && (
        <div 
          onClick={() => setIsAssistantOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-[55] animate-in fade-in duration-300"
        />
      )}
    </div>
  );
};

export default Layout;
