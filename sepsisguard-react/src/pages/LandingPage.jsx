import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* TopAppBar */}
      <header className="bg-white dark:bg-slate-950 font-sans text-sm tracking-tight docked full-width top-0 border-b border-slate-200 dark:border-slate-800 flat no-shadows flex justify-between items-center w-full px-6 h-14 z-50 fixed">
        <div className="flex items-center gap-8">
          <div className="text-lg font-black tracking-tighter text-slate-900 dark:text-slate-50 uppercase">SepsisGuard AI</div>
          <nav className="hidden md:flex gap-6">
            <a className="text-slate-900 dark:text-white font-bold border-b-2 border-slate-900 dark:border-white pb-1" href="#">Technology</a>
            <a className="text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white transition-colors" href="#">Clinical Evidence</a>
            <a className="text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white transition-colors" href="#">Solutions</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline-block text-xs font-bold uppercase tracking-widest text-secondary px-3 py-1 border border-outline-variant rounded-full">Monitoring Active</span>
          <div className="flex gap-2">
            <span className="material-symbols-outlined text-on-surface-variant p-2 cursor-pointer" data-icon="notifications">notifications</span>
            <span className="material-symbols-outlined text-on-surface-variant p-2 cursor-pointer" data-icon="account_circle">account_circle</span>
            <Link to="/dashboard" className="bg-primary text-on-primary px-4 py-1.5 rounded-lg font-bold text-xs uppercase ml-2 hover:opacity-90">Enter App</Link>
          </div>
        </div>
      </header>

      <main className="pt-14">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 clinical-gradient">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-container text-on-primary-fixed rounded-full mb-6">
                <span className="material-symbols-outlined text-sm" data-icon="verified_user" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
                <span className="font-label-caps text-label-caps uppercase tracking-[0.1em]">FDA Breakthrough Designation</span>
              </div>
              <h1 className="font-headline-lg text-6xl font-black text-on-surface leading-[1.05] tracking-tighter mb-8">
                Detect Sepsis <br/><span className="text-secondary-container bg-primary px-2">Before It Becomes Fatal</span>
              </h1>
              <p className="font-body-md text-xl text-on-surface-variant max-w-lg mb-10 leading-relaxed">
                SepsisGuard AI identifies subtle physiological changes and predicts deterioration hours before traditional scoring systems.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard" className="bg-primary text-on-primary px-8 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  Launch Dashboard
                  <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
                </Link>
                <button className="bg-white border border-outline-variant text-on-surface px-8 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined" data-icon="play_circle" style={{fontVariationSettings: "'FILL' 1"}}>play_circle</span>
                  Watch Demo Video
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-secondary-container/10 blur-[100px] rounded-full"></div>
              <div className="relative bg-white p-2 rounded-2xl shadow-2xl border border-outline-variant/30">
                <img alt="SepsisGuard Interface Mockup" className="rounded-xl w-full aspect-[4/3] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHgEFvZPLguDl8zOI3SzjqGrTjmRPSxKp9bPiP9O3waHfpYAT7LSo-q6TMCpGu_l1avDRnaapFRu67BMm2QgTx3Tz1Z93XD9ZU4eVS6K_o4JQhJhJ1B6lGnaTh9bOLf7k5rSGulp4Ys6hOEP-CO-PZ3PLR6hE9k5uFoX9fpjOLoesF--h8_U_0QWdj7ANiZDuBgiiJFcbwIc8DJXY_3mlXgNqw50Vd4wJXeZKLn52YyPJjppnpeORjQKziAT3VVP9x48VyjGPmYWc"/>
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl border border-outline-variant shadow-xl">
                  <div className="font-label-caps text-label-caps text-on-surface-variant mb-2">SYSTEM STATUS</div>
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-headline-md text-primary">Monitoring Live</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real Clinical Impact Section */}
        <section className="bg-white py-32 border-y border-outline-variant/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="font-label-caps text-label-caps text-secondary tracking-[0.2em] uppercase mb-4">Evidence Based Performance</h2>
              <h3 className="font-headline-lg text-4xl text-on-surface">Real Clinical Impact</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-10 rounded-2xl bg-white/40 backdrop-blur-md border border-white/20 flex flex-col justify-between group hover:border-primary transition-all shadow-sm">
                <div>
                  <span className="material-symbols-outlined text-primary mb-6 text-4xl" data-icon="schedule">schedule</span>
                  <h4 className="font-headline-md text-on-surface-variant mb-2">Early Intervention</h4>
                </div>
                <div className="mt-12">
                  <div className="font-vital-sign text-vital-sign text-primary">+8 hours</div>
                  <p className="font-body-md text-on-surface-variant mt-4">Earlier detection of septic shock compared to standard EHR-based protocols.</p>
                </div>
              </div>
              <div className="p-10 rounded-2xl bg-primary/90 backdrop-blur-md text-white flex flex-col justify-between group shadow-xl ring-1 ring-white/10 hover:scale-[1.02] transition-transform">
                <div>
                  <span className="material-symbols-outlined text-secondary-fixed mb-6 text-4xl" data-icon="insights">insights</span>
                  <h4 className="font-headline-md text-secondary-fixed-dim mb-2">Precision Intelligence</h4>
                </div>
                <div className="mt-12">
                  <div className="font-vital-sign text-vital-sign text-secondary-fixed">94%</div>
                  <p className="font-body-md text-on-primary-container mt-4 text-white/80">Prediction confidence with near-zero false alert fatigue in pilot clinical studies.</p>
                </div>
              </div>
              <div className="p-10 rounded-2xl bg-white/40 backdrop-blur-md border border-white/20 flex flex-col justify-between group hover:border-primary transition-all shadow-sm">
                <div>
                  <span className="material-symbols-outlined text-primary mb-6 text-4xl" data-icon="trending_up">trending_up</span>
                  <h4 className="font-headline-md text-on-surface-variant mb-2">Patient Outcomes</h4>
                </div>
                <div className="mt-12">
                  <div className="font-vital-sign text-vital-sign text-primary">82%</div>
                  <p className="font-body-md text-on-surface-variant mt-4">Improvement in sepsis-related mortality outcomes across multi-site ICU integration.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Details Section */}
        <section className="py-32 bg-slate-50/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-20 items-center">
              <div className="lg:w-1/2 relative">
                <div className="absolute -inset-4 bg-primary/5 blur-2xl rounded-full"></div>
                <img alt="ICU Clinical View" className="relative rounded-3xl shadow-2xl w-full aspect-square object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiD046uKiEeAK44s-y8W7pZCqe4mN7BxF_v8ku7EOmbAMp2ndO53wkoNdaUhNCR3juxdOS3GxN1LEgSYtODen0zbJU50wHHawsYhRuruhBym-JAtaHPNfIaKx8FbU5REuIv8MUXAQyUGFicKooLMtdZGS_Hc42BKikd53Vvzavy67N1H2TvqDq-jWj8mWMQ6hwvXYJfjrbZSyc7MKU4-lGZfLYatu3NcyNXROTnE0L8zrWiChBsrlRhTPUUMCCi6uyrOWtDjXD83Q"/>
              </div>
              <div className="lg:w-1/2">
                <h2 className="font-headline-lg text-4xl text-on-surface mb-8 leading-tight">Beyond Thresholds: <br/><span className="text-primary underline decoration-sky-500 decoration-4 underline-offset-8">Deep Physiological Profiling</span></h2>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary" data-icon="biotech">biotech</span>
                    </div>
                    <div>
                      <h4 className="font-headline-md text-on-surface mb-2">Continuous Waveform Analysis</h4>
                      <p className="font-body-md text-on-surface-variant">Our AI analyzes sub-second variations in EKG, SpO2, and plethysmograph signals to detect micro-instability.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary" data-icon="hub">hub</span>
                    </div>
                    <div>
                      <h4 className="font-headline-md text-on-surface mb-2">Multimodal Data Fusion</h4>
                      <p className="font-body-md text-on-surface-variant">Integration with Lab results, EHR notes, and bedside vitals creates a holistic patient digital twin.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary" data-icon="shield_with_heart">shield_with_heart</span>
                    </div>
                    <div>
                      <h4 className="font-headline-md text-on-surface mb-2">Human-in-the-Loop Design</h4>
                      <p className="font-body-md text-on-surface-variant">Engineered by clinicians for clinicians. Alerts are explainable, actionable, and reduce cognitive burden.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <section className="bg-slate-900 py-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 blur-[120px] rounded-full"></div>
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="font-headline-lg text-5xl text-white mb-8 tracking-tighter">Ready to monitor your patient population?</h2>
            <p className="font-body-md text-lg text-slate-400 mb-12">Enter the live surveillance dashboard to see real-time AI risk scoring connected directly to the clinical database.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/dashboard" className="bg-primary text-white px-10 py-5 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined" data-icon="monitor_heart">monitor_heart</span>
                Launch Live Dashboard
              </Link>
              <Link to="/patients" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined" data-icon="patient_list">patient_list</span>
                View Patient Registry
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-outline-variant py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-lg font-black tracking-tighter text-slate-900 uppercase">SepsisGuard AI</div>
          <div className="flex gap-12 text-on-surface-variant">
            <a className="font-label-caps text-label-caps hover:text-primary" href="#">PRIVACY</a>
            <a className="font-label-caps text-label-caps hover:text-primary" href="#">TERMS</a>
            <a className="font-label-caps text-label-caps hover:text-primary" href="#">COMPLIANCE</a>
            <a className="font-label-caps text-label-caps hover:text-primary" href="#">CONTACT</a>
          </div>
          <div className="text-on-surface-variant font-body-md text-xs">
            © 2024 SepsisGuard AI. All rights reserved. Clinical use subject to local regulations.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
