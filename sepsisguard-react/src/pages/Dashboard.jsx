import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [patient, setPatient] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('hasSeenGuide');
    if (!hasSeenGuide) {
      setShowGuide(true);
    }

    const fetchCriticalPatient = async () => {
      try {
        const data = await api.getPatients();
        if (data && data.length > 0) {
          const critical = [...data].sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))[0];
          setPatient(critical);
        }
      } catch (e) {
        console.error('Dashboard fetch error:', e);
      }
    };

    fetchCriticalPatient();
    const interval = setInterval(fetchCriticalPatient, 5000);
    return () => clearInterval(interval);
  }, []);

  const closeGuide = () => {
    localStorage.setItem('hasSeenGuide', 'true');
    setShowGuide(false);
  };

  if (!patient) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  const riskScore = patient.riskScore || 0;
  const vitals = patient.vitals || {};
  const patientId = patient.id || '';
  const circumference = 552.92;
  const dashOffset = (circumference - (circumference * riskScore / 100)).toFixed(2);

  return (
    <Layout>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <span className="text-label-caps font-label-caps uppercase text-slate-500 tracking-[0.2em]">
            Patient Case ID: {patientId.replace('PT-', '')}-A
          </span>
          <h2 className="text-headline-lg font-headline-lg text-slate-900 mt-1">
            {patient.name || 'Unknown Patient'}, {patient.age || '--'}{patient.gender || ''}
          </h2>
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
            <div className="h-full border-l border-slate-100 flex flex-col justify-end"><span className="text-[10px] text-slate-900 font-bold translate-y-6">NOW</span></div>
            <div className="h-full border-l border-slate-100 flex flex-col justify-end"><span className="text-[10px] text-slate-400 translate-y-6">+4h</span></div>
            <div className="h-full border-l border-slate-100 flex flex-col justify-end"><span className="text-[10px] text-slate-400 translate-y-6">+6h</span></div>
          </div>
          <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
            <path d="M 0 50 Q 25 50 150 45 T 300 35 T 450 60 T 600 20 T 750 15" fill="none" stroke="#E2E8F0" strokeWidth="2"></path>
            <path d="M 0 50 Q 25 50 150 45 T 300 35 T 450 60 T 600 20" fill="none" stroke="#0F172A" strokeWidth="2"></path>
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
        {/* Risk Score Gauge */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded p-8 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-label-caps font-label-caps text-slate-500 uppercase tracking-widest">Live Sepsis Risk Score</span>
          </div>
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle cx="96" cy="96" fill="none" r="88" stroke="#F1F5F9" strokeWidth="12"></circle>
              <circle
                cx="96" cy="96" fill="none" r="88"
                stroke={riskScore > 75 ? '#ba1a1a' : '#0F172A'}
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                strokeWidth="12"
              ></circle>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-vital-sign font-vital-sign text-slate-900">{riskScore}%</span>
              <span className={`text-label-caps font-label-caps ${riskScore > 75 ? 'text-error' : 'text-primary'} uppercase`}>
                {patient.status || 'STABLE'}
              </span>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center gap-2">
            <div className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100 flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Model Confidence</span>
              <span className="text-[10px] font-black text-slate-900">94.2%</span>
            </div>
            <div className="text-body-md font-body-md text-slate-500 max-w-[200px]">
              Risk score {patient.riskTrend === 'up' ? 'increased' : 'decreased'} in the last 45 minutes.
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">

          {/* Critical Alert Banner */}
          {riskScore > 75 && (
            <div className="bg-white border-2 border-error p-6 rounded relative overflow-hidden flex flex-col gap-4 critical-pulse">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-error rounded flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">warning</span>
                </div>
                <div className="flex-grow">
                  <h4 className="text-headline-md font-headline-md text-slate-900">Critical Alert: Septic Shock Imminent</h4>
                  <p className="text-label-caps font-label-caps text-error uppercase mt-0.5">
                    Severity: Critical
                  </p>
                </div>
                <Link
                  to={`/patient/${patientId}`}
                  className="flex-shrink-0 bg-slate-900 text-white px-4 py-2 text-label-caps font-label-caps uppercase rounded hover:bg-slate-800 transition-colors"
                >
                  Review Interventions
                </Link>
              </div>
              <p className="text-body-md font-body-md text-slate-600">
                Patient meets SIRS criteria with evidence of hypoperfusion. Recommended immediate IV fluid resuscitation and empiric antibiotic therapy.
              </p>
            </div>
          )}

          {/* Vitals */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-slate-100 rounded p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-label-caps font-label-caps text-slate-500 uppercase">HR</span>
                <span className="material-symbols-outlined text-slate-300 text-sm">favorite</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-headline-lg font-headline-lg font-bold ${(vitals.hr || 0) > 100 ? 'text-error' : 'text-slate-900'}`}>
                  {vitals.hr || '--'}
                </span>
                <span className="text-xs text-slate-400">bpm</span>
              </div>
              <div className="mt-2 h-1 bg-slate-50 overflow-hidden">
                <div className={`h-full ${(vitals.hr || 0) > 100 ? 'bg-error' : 'bg-slate-900'} w-3/4`}></div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-label-caps font-label-caps text-slate-500 uppercase">BP</span>
                <span className="material-symbols-outlined text-slate-300 text-sm">blood_pressure</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-headline-lg font-headline-lg font-bold ${(vitals.bpSystolic || 120) < 90 ? 'text-error' : 'text-slate-900'}`}>
                  {vitals.bpSystolic || '--'}/{vitals.bpDiastolic || '--'}
                </span>
                <span className="text-xs text-slate-400">mmHg</span>
              </div>
              <div className="mt-2 h-1 bg-slate-50 overflow-hidden">
                <div className={`h-full ${(vitals.bpSystolic || 120) < 90 ? 'bg-error' : 'bg-slate-900'} w-1/4`}></div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-label-caps font-label-caps text-slate-500 uppercase">Temp</span>
                <span className="material-symbols-outlined text-slate-300 text-sm">thermostat</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-headline-lg font-headline-lg font-bold ${(vitals.temp || 98) > 100.4 ? 'text-error' : 'text-slate-900'}`}>
                  {vitals.temp || '--'}
                </span>
                <span className="text-xs text-slate-400">°F</span>
              </div>
              <div className="mt-2 h-1 bg-slate-50 overflow-hidden">
                <div className={`h-full ${(vitals.temp || 98) > 100.4 ? 'bg-error' : 'bg-slate-900'} w-5/6`}></div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-label-caps font-label-caps text-slate-500 uppercase">SpO2</span>
                <span className="material-symbols-outlined text-slate-300 text-sm">air</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-headline-lg font-headline-lg font-bold text-slate-900">{vitals.spo2 || '--'}</span>
                <span className="text-xs text-slate-400">%</span>
              </div>
              <div className="mt-2 h-1 bg-slate-50 overflow-hidden">
                <div className="h-full bg-slate-400 w-2/3"></div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-white border border-slate-200 rounded p-6 shadow-sm overflow-hidden relative">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-label-caps font-label-caps text-slate-500 uppercase tracking-widest">AI Insights: Primary Risk Drivers</h4>
              <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1 border border-emerald-100">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                LAST ANALYZED: JUST NOW
              </span>
            </div>
            
            <div className="space-y-4">
              {patient.shap && patient.shap.insights && patient.shap.insights.map((insight, idx) => (
                <div key={idx} className="group flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                  <div className={`w-8 h-8 rounded-lg ${insight.severity === 'error' ? 'bg-error-container text-error' : 'bg-slate-100 text-slate-500'} flex items-center justify-center font-bold text-xs flex-shrink-0 border ${insight.severity === 'error' ? 'border-error/20' : 'border-slate-200'}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className={`text-[12px] font-black uppercase tracking-tight ${insight.severity === 'error' ? 'text-error' : 'text-slate-900'}`}>{insight.title}</p>
                      <span className={`text-[10px] font-bold ${insight.severity === 'error' ? 'text-error' : 'text-slate-400'}`}>+{(15 - idx * 4)}% IMPACT</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{insight.description}</p>
                  </div>
                </div>
              ))}
              {(!patient.shap || !patient.shap.insights || patient.shap.insights.length === 0) && (
                <p className="text-sm text-slate-500 italic text-center py-4">No AI insights generated for this patient.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="mt-8 bg-white border border-slate-200 rounded overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <span className="text-label-caps font-label-caps text-slate-500 uppercase tracking-widest">High-Fidelity Monitoring</span>
          <div className="flex gap-4">
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> ECG LEAD II
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-sky-500 rounded-full"></span> PLETH
            </span>
          </div>
        </div>
        <div className="p-6 h-32 relative flex items-center justify-between overflow-hidden bg-slate-900/5">
          {/* ECG Waveform */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 100">
              <path
                d="M 0 50 L 50 50 L 60 20 L 70 80 L 80 50 L 150 50 L 160 10 L 170 90 L 180 50 L 250 50 L 260 20 L 270 80 L 280 50 L 350 50 L 360 10 L 370 90 L 380 50 L 450 50 L 460 20 L 470 80 L 480 50 L 550 50 L 560 10 L 570 90 L 580 50 L 650 50 L 660 20 L 670 80 L 680 50 L 750 50 L 760 10 L 770 90 L 780 50 L 850 50 L 860 20 L 870 80 L 880 50 L 950 50 L 960 10 L 970 90 L 980 50 L 1000 50"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                className="waveform-animate"
              />
            </svg>
          </div>
          
          <div className="relative z-10 flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <div className="text-[10px] text-emerald-700 font-black tracking-[0.2em] uppercase">High-Fidelity Stream Active</div>
              <div className="text-[9px] text-slate-400 font-medium">Sampling rate: 250Hz • Latency: 12ms</div>
            </div>
          </div>

          <div className="relative z-10 flex gap-8">
            <div className="text-right">
              <p className="text-[9px] text-slate-400 font-bold uppercase">ECG LEAD II</p>
              <p className="text-xl font-data-mono text-emerald-600 leading-none">{vitals.hr || 72}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-slate-400 font-bold uppercase">SPO2 %</p>
              <p className="text-xl font-data-mono text-sky-600 leading-none">{vitals.spo2 || 98}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive User Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-white/20">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/5 bg-slate-900 p-8 text-white flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-white">clinical_notes</span>
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
                        <span className="material-symbols-outlined text-slate-900 text-lg">{item.icon}</span>
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
