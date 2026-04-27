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
    <div className="bg-slate-950 text-slate-50 min-h-screen selection:bg-sky-500/30 overflow-hidden font-sans">
      
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-sky-900/20 blur-[120px] mix-blend-screen animate-pulse duration-[10s]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-900/20 blur-[150px] mix-blend-screen animate-pulse duration-[15s] delay-700"></div>
        <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-teal-900/10 blur-[100px] mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

      {/* Navigation */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 border-b ${scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-white/10 shadow-2xl py-3' : 'bg-transparent border-transparent py-6'} px-6 lg:px-12`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.4)]">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>monitor_heart</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              SepsisGuard <span className="text-sky-400">AI</span>
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#technology" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">XAI Engine</a>
            <a href="#clinical" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Clinical Evidence</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden md:block text-sm font-bold text-slate-300 hover:text-white transition-colors">Sign In</Link>
            <Link to="/dashboard" className="group relative px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md overflow-hidden transition-all duration-300 flex items-center gap-2">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-blue-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative text-sm font-bold text-white tracking-wide z-10">Access Dashboard</span>
              <span className="material-symbols-outlined text-[18px] relative z-10 group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-20">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(56,189,248,0.15)] animate-pulse">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              Live Clinical Intelligence
            </div>
            
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.05] tracking-tighter mb-8 drop-shadow-2xl">
              Defeat Sepsis. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400">Before It Strikes.</span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 mb-12 leading-relaxed">
              Transform raw EHR data into predictive clinical foresight. SepsisGuard AI detects physiological deterioration up to 8 hours before traditional threshold alerts, saving lives with Explainable AI.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
              <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all hover:-translate-y-1 flex items-center justify-center gap-3 relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="material-symbols-outlined relative z-10">vital_signs</span>
                <span className="relative z-10">Enter Live Surveillance</span>
              </Link>
              
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-lg backdrop-blur-md transition-all hover:border-white/30 flex items-center justify-center gap-3">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                Watch Demo
              </button>
            </div>
            
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white">94%</span>
                <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Accuracy</span>
              </div>
              <div className="w-px h-10 bg-slate-700"></div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white">+8h</span>
                <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Early Warning</span>
              </div>
              <div className="w-px h-10 bg-slate-700"></div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white"><span className="material-symbols-outlined text-green-400 text-3xl">check_circle</span></span>
                <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">HIPAA Ready</span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-2xl">
            {/* Abstract 3D/Glass Mockup */}
            <div className="relative z-10 p-2 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-2xl backdrop-blur-sm transform rotate-[-2deg] hover:rotate-0 transition-transform duration-700 ease-out">
              <div className="rounded-[2rem] overflow-hidden bg-slate-900 border border-slate-800 relative">
                
                {/* Mockup Header */}
                <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center px-6 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  <div className="ml-4 text-xs font-bold text-slate-500 tracking-wider">SEPSIS_AI_NODE_01</div>
                </div>

                {/* Mockup Content */}
                <div className="p-8 pb-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-[80px] rounded-full"></div>
                  
                  <div className="flex justify-between items-end mb-8 relative z-10">
                    <div>
                      <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Critical Alert</h3>
                      <div className="text-3xl font-black text-white">Bed 104 • Pt. Wright</div>
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-red-500/30 flex items-center justify-center relative">
                      <div className="absolute inset-0 border-4 border-red-500 rounded-full border-t-transparent animate-spin"></div>
                      <span className="text-xl font-black text-red-400">82%</span>
                    </div>
                  </div>

                  {/* Faux Graph */}
                  <div className="h-32 mb-6 flex items-end gap-2 relative z-10">
                    {[30, 40, 35, 50, 45, 60, 55, 70, 65, 82].map((val, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-red-500/20 to-red-500/80 rounded-t-sm transition-all duration-1000 delay-100 animate-pulse" style={{ height: `${val}%`, animationDelay: `${i * 100}ms` }}></div>
                    ))}
                  </div>

                  {/* SHAP Insight Faux Card */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="material-symbols-outlined text-red-400 text-sm">warning</span>
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">AI Insight Driver</span>
                    </div>
                    <div className="text-white font-medium">Elevated Lactate (4.2 mmol/L) + Sustained Tachycardia</div>
                  </div>

                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -right-8 top-12 z-20 bg-slate-900/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-400">check</span>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase">System Status</div>
                  <div className="text-sm font-black text-white">Live Monitoring</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="max-w-7xl mx-auto px-6 lg:px-12 py-32 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tighter">Beyond Static Thresholds</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Traditional EHRs wait until the patient crashes. SepsisGuard AI continuously analyzes sub-clinical waveform data to forecast deterioration.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 p-10 rounded-3xl hover:bg-slate-800/50 hover:border-white/10 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center mb-8 group-hover:bg-sky-500/20 transition-colors">
                <span className="material-symbols-outlined text-sky-400 text-3xl">psychology</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Explainable AI (XAI)</h3>
              <p className="text-slate-400 leading-relaxed">No black boxes. Instantly see the exact physiological drivers (SHAP values) pushing the sepsis risk score higher, building clinician trust.</p>
            </div>

            <div className="bg-gradient-to-br from-sky-900/40 to-blue-900/20 backdrop-blur-md border border-sky-500/20 p-10 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/20 blur-[50px] rounded-full group-hover:bg-sky-500/40 transition-colors"></div>
              <div className="w-14 h-14 rounded-2xl bg-sky-500/20 flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-sky-400 text-3xl">science</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Intervention Simulator</h3>
              <p className="text-slate-300 leading-relaxed">Ask "What if?". Simulate administering fluids or vasopressors directly on the UI to see predicted changes in patient survivability before acting.</p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 p-10 rounded-3xl hover:bg-slate-800/50 hover:border-white/10 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center mb-8 group-hover:bg-sky-500/20 transition-colors">
                <span className="material-symbols-outlined text-sky-400 text-3xl">description</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">One-Click AI SBAR</h3>
              <p className="text-slate-400 leading-relaxed">Instantly generate standard Situation-Background-Assessment-Recommendation (SBAR) handover notes ready for Epic/Cerner charting.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-500">monitor_heart</span>
            <span className="text-lg font-black tracking-tighter text-white uppercase">SepsisGuard AI</span>
          </div>
          <div className="text-slate-500 text-sm font-medium">
            © 2026 NevUp Hackathon Submission.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-white transition-colors"><span className="material-symbols-outlined">code</span></a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors"><span className="material-symbols-outlined">api</span></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
