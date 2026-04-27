import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen selection:bg-sky-500/30 overflow-hidden font-sans">
      
      {/* Dynamic Background Effects (Light Mode) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-sky-200/40 blur-[120px] mix-blend-multiply animate-pulse duration-[10s]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-100/50 blur-[150px] mix-blend-multiply animate-pulse duration-[15s] delay-700"></div>
        <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-teal-100/40 blur-[100px] mix-blend-multiply"></div>
      </div>

      {/* Navigation */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 border-b ${scrolled ? 'bg-white/80 backdrop-blur-xl border-slate-200 shadow-sm py-3' : 'bg-transparent border-transparent py-6'} px-6 lg:px-12`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center shadow-[0_4px_10px_rgba(2,132,199,0.3)]">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>monitor_heart</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">
              SepsisGuard <span className="text-sky-600">AI</span>
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-bold text-slate-600 hover:text-sky-600 transition-colors">Features</a>
            <a href="#technology" className="text-sm font-bold text-slate-600 hover:text-sky-600 transition-colors">XAI Engine</a>
            <a href="#clinical" className="text-sm font-bold text-slate-600 hover:text-sky-600 transition-colors">Clinical Evidence</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden md:block text-sm font-bold text-slate-600 hover:text-sky-600 transition-colors">Sign In</Link>
            <Link to="/dashboard" className="group relative px-6 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 shadow-sm overflow-hidden transition-all duration-300 flex items-center gap-2">
              <span className="relative text-sm font-bold text-slate-800 tracking-wide z-10">Access Dashboard</span>
              <span className="material-symbols-outlined text-[18px] text-sky-600 relative z-10 group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-20">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-xs font-bold tracking-widest uppercase mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
              Live Clinical Intelligence
            </div>
            
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black text-slate-900 leading-[1.05] tracking-tighter mb-8 drop-shadow-sm">
              Defeat Sepsis. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600">Before It Strikes.</span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 mb-12 leading-relaxed font-medium">
              Transform raw EHR data into predictive clinical foresight. SepsisGuard AI detects physiological deterioration up to 8 hours before traditional threshold alerts, saving lives with Explainable AI.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
              <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 text-white font-bold text-lg shadow-[0_10px_25px_rgba(2,132,199,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(2,132,199,0.4)] flex items-center justify-center gap-3 relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="material-symbols-outlined relative z-10">vital_signs</span>
                <span className="relative z-10">Enter Live Surveillance</span>
              </Link>
              
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-lg shadow-sm transition-all hover:border-slate-300 flex items-center justify-center gap-3">
                <span className="material-symbols-outlined text-sky-600" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                Watch Demo
              </button>
            </div>
            
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-800">94%</span>
                <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Accuracy</span>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-800">+8h</span>
                <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Early Warning</span>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-800"><span className="material-symbols-outlined text-green-500 text-3xl">check_circle</span></span>
                <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">HIPAA Ready</span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-2xl">
            {/* Abstract 3D/Glass Mockup (Light Theme) */}
            <div className="relative z-10 p-2 rounded-[2.5rem] bg-white/60 border border-white shadow-2xl backdrop-blur-md transform rotate-[-2deg] hover:rotate-0 transition-transform duration-700 ease-out">
              <div className="rounded-[2rem] overflow-hidden bg-white border border-slate-100 shadow-inner relative">
                
                {/* Mockup Header */}
                <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center px-6 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <div className="ml-4 text-xs font-bold text-slate-400 tracking-wider">SEPSIS_AI_NODE_01</div>
                </div>

                {/* Mockup Content */}
                <div className="p-8 pb-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 blur-[80px] rounded-full"></div>
                  
                  <div className="flex justify-between items-end mb-8 relative z-10">
                    <div>
                      <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Critical Alert</h3>
                      <div className="text-3xl font-black text-slate-900">Bed 104 • Pt. Wright</div>
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-red-100 flex items-center justify-center relative bg-white shadow-sm">
                      <div className="absolute inset-0 border-4 border-red-500 rounded-full border-t-transparent animate-spin"></div>
                      <span className="text-xl font-black text-red-600">82%</span>
                    </div>
                  </div>

                  {/* Faux Graph */}
                  <div className="h-32 mb-6 flex items-end gap-2 relative z-10">
                    {[30, 40, 35, 50, 45, 60, 55, 70, 65, 82].map((val, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-red-100 to-red-400 rounded-t-sm transition-all duration-1000 delay-100 animate-pulse" style={{ height: `${val}%`, animationDelay: `${i * 100}ms` }}></div>
                    ))}
                  </div>

                  {/* SHAP Insight Faux Card */}
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 shadow-sm relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="material-symbols-outlined text-red-500 text-sm">warning</span>
                      <span className="text-xs font-bold text-red-700 uppercase tracking-wider">AI Insight Driver</span>
                    </div>
                    <div className="text-red-900 font-medium">Elevated Lactate (4.2 mmol/L) + Sustained Tachycardia</div>
                  </div>

                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -right-8 top-12 z-20 bg-white/90 backdrop-blur-xl border border-slate-100 p-4 rounded-2xl shadow-xl animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-500">check</span>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase">System Status</div>
                  <div className="text-sm font-black text-slate-900">Live Monitoring</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="max-w-7xl mx-auto px-6 lg:px-12 py-32 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tighter">Beyond Static Thresholds</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">Traditional EHRs wait until the patient crashes. SepsisGuard AI continuously analyzes sub-clinical waveform data to forecast deterioration.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 shadow-sm p-10 rounded-3xl hover:shadow-lg hover:border-sky-200 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center mb-8 group-hover:bg-sky-100 transition-colors">
                <span className="material-symbols-outlined text-sky-600 text-3xl">psychology</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Explainable AI (XAI)</h3>
              <p className="text-slate-600 leading-relaxed font-medium">No black boxes. Instantly see the exact physiological drivers (SHAP values) pushing the sepsis risk score higher, building clinician trust.</p>
            </div>

            <div className="bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100 shadow-sm p-10 rounded-3xl relative overflow-hidden group hover:shadow-lg hover:border-sky-200 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-200/50 blur-[50px] rounded-full group-hover:bg-sky-300/40 transition-colors"></div>
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 relative z-10">
                <span className="material-symbols-outlined text-sky-600 text-3xl">science</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 relative z-10">Intervention Simulator</h3>
              <p className="text-slate-700 leading-relaxed font-medium relative z-10">Ask "What if?". Simulate administering fluids or vasopressors directly on the UI to see predicted changes in patient survivability before acting.</p>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm p-10 rounded-3xl hover:shadow-lg hover:border-sky-200 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center mb-8 group-hover:bg-sky-100 transition-colors">
                <span className="material-symbols-outlined text-sky-600 text-3xl">description</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">One-Click AI SBAR</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Instantly generate standard Situation-Background-Assessment-Recommendation (SBAR) handover notes ready for Epic/Cerner charting.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-600">monitor_heart</span>
            <span className="text-lg font-black tracking-tighter text-slate-900 uppercase">SepsisGuard AI</span>
          </div>
          <div className="text-slate-500 text-sm font-medium">
            © 2026 Arpit Khandelwal.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-sky-600 transition-colors"><span className="material-symbols-outlined">code</span></a>
            <a href="#" className="text-slate-400 hover:text-sky-600 transition-colors"><span className="material-symbols-outlined">api</span></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
