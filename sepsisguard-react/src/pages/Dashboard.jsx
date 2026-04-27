import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [patient, setPatient] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // Check if user has seen the guide
    const hasSeenGuide = localStorage.getItem('hasSeenGuide');
    if (!hasSeenGuide) {
      setShowGuide(true);
    }

    const fetchCriticalPatient = async () => {
      const data = await api.getPatients();
      if (data && data.length > 0) {
        const critical = [...data].sort((a, b) => b.riskScore - a.riskScore)[0];
        setPatient(critical);
      }
    };

    fetchCriticalPatient();
    const interval = setInterval(fetchCriticalPatient, 2000);
    return () => clearInterval(interval);
  }, []);

  const closeGuide = () => {
    localStorage.setItem('hasSeenGuide', 'true');
    setShowGuide(false);
  };

  if (!patient) return null;

  return (
    <Layout>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <span className="text-label-caps font-label-caps uppercase text-slate-500 tracking-[0.2em]">Patient Case ID: {(patient.id || '').replace('PT-', '')}-A</span>
          <h2 className="text-headline-lg font-headline-lg text-slate-900 mt-1">{patient.name}, {patient.age}{patient.gender}</h2>
        </div>
        <div className="text-right">
          <p className="text-label-caps font-label-caps text-slate-500 uppercase">Admission Time</p>
          <p className="text-data-mono font-data-mono text-slate-900">{patient.admissionDate || 'N/A'}</p>
        </div>
      </div>

      <section className="bg-white border border-slate-200 rounded p-6 mb-8 relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-label-caps font-label-caps text-slate-500 uppercase tracking-widest">Patient Risk Timeline</h3>
          <div className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded">AI detected risk 8 hours earlier</div>
        </div>
        <div className="relative h-24 mt-12 mb-8">
          <div className="absolute inset-0 flex justify-between px-2">
            <div className="h-full border-l border-slate-100 flex flex-col justify-end"><span className="text-[10px] text-slate-400 translate-y-6">-12h</span></div>
            <div className="h-full border-l border-slate-100 flex flex-col justify-end"><span className="text-[10px] text-slate-400 translate-y-6">-8h</span></div>
            <div className="h-full border-l border-slate-100 flex flex-col justify-end"><span className="text-[10px] text-slate-400 translate-y-6">-4h</span></div>
            <div className="h-full border-l border-slate-100 flex flex-col justify-end border-slate-300"><span className="text-[10px] text-slate-900 font-bold translate-y-6">NOW</span></div>
            <div className="h-full border-l border-slate-100 flex flex-col justify-end"><span className="text-[10px] text-slate-400 translate-y-6">+4h</span></div>
            <div className="h-full border-l border-slate-100 flex flex-col justify-end"><span className="text-[10px] text-slate-400 translate-y-6">+6h</span></div>
          </div>
          <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
            <path d="M 0 50 Q 25 50, 150 45 T 300 35 T 450 60 T 600 20 T 750 15" fill="none" stroke="#E2E8F0" strokeWidth="2"></path>
            <path d="M 0 50 Q 25 50, 150 45 T 300 35 T 450 60 T 600 20" fill="none" stroke="#0F172A" strokeWidth="2"></path>
          </svg>
          <div className="absolute left-[20%] top-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-3 h-3 bg-slate-900 rounded-full border-2 border-white ring-2 ring-slate-100"></div>
            <div className="absolute bottom-6 bg-slate-900 text-white text-[10px] px-2 py-1 whitespace-nowrap rounded">Model Prediction Point</div>
          </div>
          <div className="absolute left-[66%] top-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-3 h-3 bg-error rounded-full border-2 border-white ring-2 ring-error-container"></div>
            <div className="absolute bottom-6 bg-error text-white text-[10px] px-2 py-1 whitespace-nowrap rounded">Clinical Diagnosis Point</div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded p-8 flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-label-caps font-label-caps text-slate-500 uppercase tracking-widest mb-6">Live Sepsis Risk Score</span>
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle cx="96" cy="96" fill="none" r="88" stroke="#F1F5F9" strokeWidth="12"></circle>
              <circle cx="96" cy="96" fill="none" r="88" stroke={(patient.riskScore || 0) > 75 ? "#ba1a1a" : "#0F172A"} strokeDasharray="552.92" strokeDashoffset={(552.92 - (552.92 * (patient.riskScore || 0) / 100)).toFixed(2)} strokeLinecap="round" strokeWidth="12"></circle>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-vital-sign font-vital-sign text-slate-900">{patient.riskScore || 0}%</span>
              <span className={`text-label-caps font-label-caps ${(patient.riskScore || 0) > 75 ? 'text-error' : 'text-primary'} uppercase`}>{patient.status || 'STABLE'}</span>
            </div>
          </div>
          <div className="mt-8 text-body-md font-body-md text-slate-500 max-w-[200px]">
            Risk score {patient.riskTrend === 'up' ? 'increased' : 'decreased'} in the last 45 minutes.
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          {patient.riskScore > 75 && (
            <div className="bg-white border-2 border-error p-6 rounded relative overflow-hidden flex items-start gap-6 critical-pulse">
              <div className="flex-shrink-0 w-12 h-12 bg-error rounded flex items-center justify-center text-white">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>
              </div>
              <div className="flex-grow">
                  <div>
                    <h4 className="text-headline-md font-headline-md text-slate-900">Critical Alert: Septic Shock Imminent</h4>
                    <p className="text-label-caps font-label-caps text-error uppercase mt-0.5">Severity: Critical • {new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                  <Link to={`/patient/${patient.id}`} className="bg-slate-900 text-white px-4 py-2 text-label-caps font-label-caps uppercase rounded hover:bg-slate-800 transition-colors">
                    Review Interventions
                  </Link>
                </div>
                <p className="text-body-md font-body-md text-slate-600">Patient meets SIRS criteria with evidence of hypoperfusion. Recommended immediate IV fluid resuscitation and empiric antibiotic therapy.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-slate-100 rounded p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-label-caps font-label-caps text-slate-500 uppercase">HR</span>
                <span className="material-symbols-outlined text-slate-300 text-sm">favorite</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-headline-lg font-headline-lg font-bold ${patient.vitals.hr > 100 ? 'text-error' : 'text-slate-900'}`}>{patient.vitals.hr}</span>
                <span className="text-xs text-slate-400">bpm</span>
              </div>
              <div className="mt-2 h-1 bg-slate-50 overflow-hidden">
                <div className={`h-full ${patient.vitals.hr > 100 ? 'bg-error' : 'bg-slate-900'} w-3/4`}></div>
              </div>
            </div>
            
            <div className="bg-white border border-slate-100 rounded p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-label-caps font-label-caps text-slate-500 uppercase">BP</span>
                <span className="material-symbols-outlined text-slate-300 text-sm">blood_pressure</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-headline-lg font-headline-lg font-bold ${patient.vitals.bpSystolic < 90 ? 'text-error' : 'text-slate-900'}`}>{patient.vitals.bpSystolic}/{patient.vitals.bpDiastolic}</span>
                <span className="text-xs text-slate-400">mmHg</span>
              </div>
              <div className="mt-2 h-1 bg-slate-50 overflow-hidden">
                <div className={`h-full ${patient.vitals.bpSystolic < 90 ? 'bg-error' : 'bg-slate-900'} w-1/4`}></div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-label-caps font-label-caps text-slate-500 uppercase">Temp</span>
                <span className="material-symbols-outlined text-slate-300 text-sm">thermostat</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-headline-lg font-headline-lg font-bold ${patient.vitals.temp > 100.4 ? 'text-error' : 'text-slate-900'}`}>{patient.vitals.temp}</span>
                <span className="text-xs text-slate-400">°F</span>
              </div>
              <div className="mt-2 h-1 bg-slate-50 overflow-hidden">
                <div className={`h-full ${patient.vitals.temp > 100.4 ? 'bg-error' : 'bg-slate-900'} w-5/6`}></div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-label-caps font-label-caps text-slate-500 uppercase">SpO2</span>
                <span className="material-symbols-outlined text-slate-300 text-sm">air</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-headline-lg font-headline-lg font-bold text-slate-900">{patient.vitals.spo2}</span>
                <span className="text-xs text-slate-400">%</span>
              </div>
              <div className="mt-2 h-1 bg-slate-50 overflow-hidden">
                <div className="h-full bg-slate-400 w-2/3"></div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded p-6">
            <h4 className="text-label-caps font-label-caps text-slate-500 uppercase tracking-widest mb-4">AI Insight: Top 3 Reasons for Risk</h4>
            <div className="space-y-4">
              {patient.shap && patient.shap.insights && patient.shap.insights.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full ${insight.severity === 'error' ? 'bg-error-container text-error' : 'bg-slate-50 text-slate-900'} flex items-center justify-center font-bold text-xs flex-shrink-0`}>{idx + 1}</div>
                  <div>
                    <p className={`text-body-md font-bold ${insight.severity === 'error' ? 'text-error' : 'text-slate-900'}`}>{insight.title}</p>
                    <p className="text-xs text-slate-500">{insight.description}</p>
                  </div>
                </div>
              ))}
              {(!patient.shap || !patient.shap.insights || patient.shap.insights.length === 0) && (
                <p className="text-sm text-slate-500 italic">No AI insights generated for this patient.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="mt-8 bg-white border border-slate-200 rounded overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <span className="text-label-caps font-label-caps text-slate-500 uppercase tracking-widest">High-Fidelity Monitoring</span>
          <div className="flex gap-4">
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> ECG LEAD II</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-sky-500 rounded-full"></span> PLETH</span>
          </div>
        </div>
        <div className="p-6 h-32 relative">
          <svg className="w-full h-full">
            <path d="M 0 64 L 50 64 L 55 50 L 60 80 L 65 20 L 70 90 L 75 64 L 125 64 L 130 50 L 135 80 L 140 20 L 145 90 L 150 64 L 200 64" fill="none" stroke="#10b981" strokeWidth="1.5"></path>
            <path d="M 200 64 L 250 64 L 255 50 L 260 80 L 265 20 L 270 90 L 275 64 L 325 64 L 330 50 L 335 80 L 340 20 L 345 90 L 350 64 L 400 64" fill="none" stroke="#10b981" strokeWidth="1.5"></path>
            <path d="M 400 64 L 450 64 L 455 50 L 460 80 L 465 20 L 470 90 L 475 64 L 525 64 L 530 50 L 535 80 L 540 20 L 545 90 L 550 64 L 600 64" fill="none" stroke="#10b981" strokeWidth="1.5"></path>
          </svg>
        </div>
      </section>

      {/* Removed local FAB to avoid overlap with global Assistant */}

      {/* Interactive User Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-white/20 transform animate-in zoom-in-95 duration-300">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/5 bg-slate-900 p-8 text-white flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-white" data-icon="clinical_notes">clinical_notes</span>
                  </div>
                  <h3 className="text-xl font-bold leading-tight">Welcome to the SepsisGuard Portal</h3>
                  <p className="text-slate-400 text-sm mt-4 leading-relaxed">This short guide will help you navigate your new AI-powered clinical workspace.</p>
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">V 2.4.0 Clinical Release</div>
              </div>
              <div className="md:w-3/5 p-8">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Core Capabilities</h4>
                <div className="space-y-6">
                  {[
                    { title: 'Live Risk Stratification', desc: 'Monitor real-time sepsis risk scores for your entire ward at a glance.', icon: 'monitoring' },
                    { title: 'AI-Driven Insights', desc: 'Understand the "Why" behind the risk with our explainable AI feature importance.', icon: 'psychology' },
                    { title: 'One-Click SBAR', desc: 'Generate clinical handover notes instantly from the Patient Detail view.', icon: 'description' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-slate-900 text-lg" data-icon={item.icon}>{item.icon}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{item.title}</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-10">
                  <button 
                    onClick={closeGuide}
                    className="w-full py-3 bg-slate-900 text-white text-[11px] font-bold rounded-xl hover:bg-slate-800 transition-all uppercase tracking-widest shadow-lg shadow-slate-900/20"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
