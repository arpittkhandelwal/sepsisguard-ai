import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = (e) => {
    e.preventDefault();
    // For demo purposes, we'll just allow login
    localStorage.setItem('isAuthenticated', 'true');
    navigate(from, { replace: true });
  };

  const useDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    // Auto login for demo
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      navigate(from, { replace: true });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-body-md">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Branding & Info */}
        <div className="md:w-1/2 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 50 Q 25 40, 50 50 T 100 50" fill="none" stroke="white" strokeWidth="0.5" />
              <path d="M0 60 Q 25 50, 50 60 T 100 60" fill="none" stroke="white" strokeWidth="0.5" />
              <path d="M0 70 Q 25 60, 50 70 T 100 70" fill="none" stroke="white" strokeWidth="0.5" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white" data-icon="psychology">psychology</span>
              </div>
              <h1 className="text-xl font-bold uppercase tracking-[0.2em]">SepsisGuard AI</h1>
            </div>
            
            <h2 className="text-4xl font-bold leading-tight mb-6">Predicting critical outcomes before they happen.</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Experience the future of Clinical Decision Support. High-fidelity monitoring, AI-driven risk stratification, and seamless clinical workflows.
            </p>
          </div>
          
          <div className="relative z-10 mt-12">
            <div className="flex -space-x-3 mb-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-400 font-medium">Trusted by 500+ clinicians across 12 medical centers.</p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h3>
            <p className="text-slate-500 text-sm">Please enter your credentials to access the provider portal.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-2">Institutional Email</label>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dr.name@hospital.org"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-2">Password</label>
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                <span className="text-xs text-slate-600">Remember me</span>
              </label>
              <button type="button" className="text-xs font-bold text-slate-900 hover:underline">Forgot Password?</button>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-all hover:shadow-xl active:scale-[0.98] uppercase tracking-widest text-xs"
            >
              Sign In to Portal
            </button>
          </form>

          {/* Demo Access Column */}
          <div className="mt-12 pt-8 border-t border-slate-100">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-4">Demo Access (One-Click)</p>
            <div className="space-y-3">
              <button 
                onClick={() => useDemo('dr.khandelwal@hospital.org', '123')}
                className="w-full p-4 bg-sky-50 border border-sky-100 rounded-xl flex items-center justify-between group hover:bg-sky-100 transition-all"
              >
                <div className="text-left">
                  <p className="text-xs font-bold text-sky-900">Dr. Arpit Khandelwal</p>
                  <p className="text-[10px] text-sky-700">Lead Intensivist • Password: 123</p>
                </div>
                <span className="material-symbols-outlined text-sky-400 group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
              </button>
            </div>

            <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary" data-icon="lightbulb">lightbulb</span>
                Quick Start Guide
              </h4>
              <ul className="space-y-3">
                {[
                  { icon: 'monitoring', text: 'Real-time Sepsis Risk Tracking' },
                  { icon: 'science', text: 'What-If Simulation Engine' },
                  { icon: 'description', text: 'Automated SBAR Generation' }
                ].map((step, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400 text-sm" data-icon={step.icon}>{step.icon}</span>
                    <span className="text-[11px] text-slate-600 font-medium">{step.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
