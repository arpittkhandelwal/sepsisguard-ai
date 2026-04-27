import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Layout from '../components/Layout';
import { useParams, useNavigate } from 'react-router-dom';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [simulatedHr, setSimulatedHr] = useState(85);
  const [simulatedMap, setSimulatedMap] = useState(78);
  const [simulationResult, setSimulationResult] = useState(null);

  const [loading, setLoading] = useState(true);
  const [showNote, setShowNote] = useState(false);

  const handleDischarge = async () => {
    if (window.confirm(`Are you sure you want to discharge ${patient.name}?`)) {
      await api.updatePatientStatus(id, 'Discharged');
      navigate('/patients');
    }
  };

  const handleTransfer = async () => {
    const unit = window.prompt("Enter target unit for transfer:", "ICU - Unit B");
    if (unit) {
      await api.updatePatientStatus(id, `Transferred to ${unit}`);
      alert(`Transfer request sent for ${patient.name} to ${unit}`);
    }
  };

  useEffect(() => {
    let isInitialLoad = true;
    const fetchPatient = async () => {
      const data = await api.getPatientById(id);
      if (data) {
        setPatient(data);
        if (isInitialLoad) {
          setSimulatedHr(data.vitals.hr);
          setSimulatedMap(data.vitals.map);
          isInitialLoad = false;
          setLoading(false);
        }
      }
    };
    fetchPatient();
    const interval = setInterval(fetchPatient, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const handleSimulate = async () => {
    try {
      const res = await api.simulateIntervention(id, simulatedHr, simulatedMap);
      setSimulationResult(res);
      // We no longer call setPatient(res.patient) here 
      // This keeps the "What-If" simulation from overriding the actual live vitals
    } catch (e) {
      console.error("Simulation failed:", e);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center pt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!patient) {
    return (
      <Layout>
        <div className="flex flex-col h-full items-center justify-center pt-20">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4" data-icon="search_off">search_off</span>
          <h2 className="text-xl font-bold text-slate-700">Patient Not Found</h2>
          <p className="text-slate-500 mt-2">The patient ID #{id} could not be found in the system. They may have been discharged.</p>
        </div>
      </Layout>
    );
  }

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'error': return 'border-error text-error';
      case 'warning': return 'border-tertiary-container text-on-surface';
      case 'info': return 'border-secondary text-on-surface';
      default: return 'border-slate-300 text-on-surface';
    }
  };

  return (
    <Layout>
      <header className="bg-white border-b border-slate-200 px-lg py-lg rounded-t-lg -mt-6 -mx-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between gap-lg">
          <div className="flex items-start gap-md">
            <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
              <span className="material-symbols-outlined text-4xl" data-icon="person">person</span>
            </div>
            <div>
              <div className="flex items-center gap-xs">
                <h1 className="font-headline-lg text-headline-lg text-on-surface">{patient.name}</h1>
                <span className={`${patient.riskScore > 75 ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-primary'} px-xs py-[2px] rounded text-[10px] font-bold uppercase tracking-widest`}>{patient.status}</span>
              </div>
              <p className="text-on-surface-variant font-body-md mt-1">ID: #{patient.id} • {patient.age} Y/O {patient.gender === 'M' ? 'Male' : 'Female'} • Bed {patient.bed}</p>
              <div className="flex gap-md mt-sm">
                <span className="text-label-caps text-on-surface-variant">ADMISSION: {patient.admissionDate.split('-')[0].trim()}</span>
                <span className="text-label-caps text-on-surface-variant">ATTENDING: {(patient.attending || 'UNASSIGNED').toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-sm">
            <div className="flex items-center gap-sm">
              <button onClick={handleTransfer} className="px-lg py-sm border border-outline-variant text-[11px] font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-sm" data-icon="move_down">move_down</span>
                TRANSFER
              </button>
              <button onClick={() => setShowNote(!showNote)} className="px-lg py-sm bg-primary/10 text-primary text-[11px] font-bold rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-2 border border-primary/20">
                <span className="material-symbols-outlined text-sm" data-icon="description">description</span>
                GENERATE SBAR
              </button>
              <button onClick={handleDischarge} className="px-lg py-sm bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-sm" data-icon="logout">logout</span>
                DISCHARGE
              </button>
            </div>
            {showNote && (
              <div className="mt-md p-md bg-sky-50 border border-sky-100 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex justify-between items-center mb-sm">
                  <h4 className="text-[10px] font-bold text-sky-800 uppercase tracking-widest">AI-GENERATED SBAR SUMMARY</h4>
                  <button onClick={() => setShowNote(false)} className="text-sky-400 hover:text-sky-600">
                    <span className="material-symbols-outlined text-sm" data-icon="close">close</span>
                  </button>
                </div>
                <div className="text-[11px] text-sky-900 font-mono space-y-2">
                  <p><strong>SITUATION:</strong> {patient.name} is showing a {patient.riskScore}% Sepsis risk with a {patient.riskTrend} trend.</p>
                  <p><strong>BACKGROUND:</strong> Admitted {patient.admissionDate.split('-')[0]} for query sepsis. Current attending: {patient.attending}.</p>
                  <p><strong>ASSESSMENT:</strong> Tachycardic at {patient.vitals.hr} BPM. Hypotensive with MAP {patient.vitals.map} mmHg. Elevated Lactate detected.</p>
                  <p><strong>RECOMMENDATION:</strong> Titrate vasopressors to target MAP &gt;65. Complete remaining Sepsis Bundle items.</p>
                </div>
                <button className="mt-sm w-full py-2 bg-sky-600 text-white text-[10px] font-bold rounded hover:bg-sky-700 transition-colors uppercase tracking-widest">Copy to EHR</button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-lg mt-sm">
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-on-surface-variant">HEART RATE</span>
              <div className={`flex items-baseline gap-1 ${patient.riskScore > 75 ? 'animate-pulse text-error' : 'text-on-surface'}`}>
                <span className="font-vital-sign text-[32px]">{patient.vitals.hr}</span>
                <span className="text-xs text-on-surface-variant font-bold">BPM</span>
              </div>
              <span className={`text-[10px] font-bold flex items-center gap-1 ${patient.vitals.hr > 100 ? 'text-error' : 'text-on-surface-variant'}`}>
                <span className="material-symbols-outlined text-xs" data-icon={patient.vitals.hr > 100 ? 'trending_up' : 'trending_flat'}>{patient.vitals.hr > 100 ? 'trending_up' : 'trending_flat'}</span> 
                {patient.vitals.hr > 100 ? 'Elevated' : 'Normal'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-on-surface-variant">BLOOD PRESSURE</span>
              <div className="flex items-baseline gap-1">
                <span className="font-vital-sign text-[32px] text-on-surface">{patient.vitals.bpSystolic}/{patient.vitals.bpDiastolic}</span>
                <span className="text-xs text-on-surface-variant">mmHg</span>
              </div>
              <span className={`text-[10px] font-medium ${patient.vitals.map < 65 ? 'text-error font-bold' : 'text-on-surface-variant'}`}>Mean Arterial: {patient.vitals.map}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-on-surface-variant">SPO2</span>
              <div className="flex items-baseline gap-1">
                <span className="font-vital-sign text-[32px] text-on-surface">{patient.vitals.spo2}</span>
                <span className="text-xs text-on-surface-variant">%</span>
              </div>
              <span className={`text-[10px] font-medium flex items-center gap-1 ${patient.vitals.spo2 < 95 ? 'text-error font-bold' : 'text-on-surface-variant'}`}>
                 <span className="material-symbols-outlined text-xs" data-icon={patient.vitals.spo2 < 95 ? 'trending_down' : 'trending_flat'}>{patient.vitals.spo2 < 95 ? 'trending_down' : 'trending_flat'}</span>
                 {patient.vitals.spo2 < 95 ? 'Low' : 'Stable'}
              </span>
            </div>
            <div className={`relative flex flex-col items-center justify-center rounded-xl p-md shadow-2xl overflow-hidden border transition-all duration-500 ${patient.riskScore > 75 ? 'bg-error border-error-container text-white scale-105 z-10' : 'bg-slate-900 border-white/10 text-white'}`}>
              {/* Background Glow/Pattern */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${patient.riskScore > 75 ? 'from-white/40 to-transparent' : 'from-sky-500/20 to-transparent'}`}></div>
              </div>
              
              <span className="relative z-10 font-label-caps text-[10px] text-white/50 tracking-[0.2em] mb-1">LIVE SEPSIS RISK</span>
              
              <div className="relative z-10 flex items-center gap-2">
                <span className="font-vital-sign text-[42px] leading-none tracking-tighter drop-shadow-md">{patient.riskScore}%</span>
                <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest shadow-sm ${patient.riskScore > 75 ? 'bg-white text-error' : 'bg-white/10 text-white border border-white/20'}`}>
                  {patient.riskScore > 75 ? 'CRITICAL' : patient.riskScore > 50 ? 'HIGH' : 'WATCH'}
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-1.5 mt-1">
                {(() => {
                  const history = patient.risk_history || [];
                  if (history.length < 2) return <span className="text-[9px] text-white/40">CALIBRATING...</span>;
                  const diff = patient.riskScore - history[history.length - 2].riskScore;
                  return (
                    <>
                      <span className={`material-symbols-outlined text-[14px] ${diff >= 0 ? 'text-error-container' : 'text-emerald-400'}`}>
                        {diff >= 0 ? 'trending_up' : 'trending_down'}
                      </span>
                      <p className="text-[9px] font-bold text-white/70 leading-tight">
                        Risk score {diff >= 0 ? 'increased' : 'decreased'} in last 2h
                      </p>
                    </>
                  );
                })()}
              </div>

              {/* Progress Pulse (Optional for high risk) */}
              {patient.riskScore > 75 && (
                <div className="absolute bottom-0 left-0 h-1 bg-white/40 animate-progress" style={{ width: '100%' }}></div>
              )}
            </div>
          </div>
        </header>

      <div className="grid grid-cols-12 gap-lg">
        <div className="col-span-12 lg:col-span-8 space-y-lg">
          <div className="bg-white border border-outline-variant rounded-lg p-lg relative overflow-hidden">
            <div className="flex justify-between items-center mb-lg">
              <div>
                <h2 className="font-headline-md text-headline-md">Patient Risk Trajectory</h2>
                <p className="text-[10px] text-primary font-bold mt-1 uppercase tracking-widest">
                  AI detected risk {patient.timeline_markers?.find(m => m.type === 'Model Prediction')?.time?.replace('-', '') || '8h'} earlier
                </p>
              </div>
              <div className="flex gap-sm">
                <button className="text-label-caps bg-surface-container-high px-md py-xs rounded">6H</button>
                <button className="text-label-caps bg-primary text-on-primary px-md py-xs rounded">24H</button>
                <button className="text-label-caps bg-surface-container-high px-md py-xs rounded">7D</button>
              </div>
            </div>
            <div className="h-64 waveform-bg relative flex items-end">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
                <defs>
                  <linearGradient id="riskGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.2"></stop>
                    <stop offset="100%" stopColor="#ba1a1a" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                
                {/* Generate Path from Real risk_history */}
                {(() => {
                  const history = patient.risk_history || [];
                  if (history.length < 2) return null;
                  
                  const points = history.map((h, i) => {
                    const x = (i / (history.length - 1)) * 800;
                    const y = 200 - (h.riskScore / 100) * 180;
                    return `${x},${y}`;
                  }).join(' L ');
                  
                  return (
                    <>
                      <path d={`M 0,200 L ${points} L 800,200 Z`} fill="url(#riskGrad)"></path>
                      <path d={`M ${points}`} fill="transparent" stroke="#ba1a1a" strokeWidth="3" strokeLinecap="round"></path>
                    </>
                  );
                })()}

                {/* Timeline Markers */}
                {patient.timeline_markers?.map((marker, i) => {
                  const historyIndex = (patient.risk_history || []).findIndex(h => h.time === marker.time);
                  const x = historyIndex !== -1 ? (historyIndex / (patient.risk_history.length - 1)) * 800 : 400;
                  return (
                    <g key={i}>
                      <line stroke="#e4e2e4" strokeDasharray="4" x1={x} x2={x} y1="0" y2="200"></line>
                      <circle cx={x} cy={200 - ((patient.risk_history?.[historyIndex]?.riskScore || 50) / 100) * 180} r="4" fill={marker.type === 'Model Prediction' ? '#0ea5e9' : '#ba1a1a'}></circle>
                      <text x={x} y="15" textAnchor="middle" className="text-[9px] font-bold fill-slate-400 uppercase">{marker.label}</text>
                    </g>
                  );
                })}

                <line stroke="#000" strokeWidth="2" x1="800" x2="800" y1="0" y2="200"></line>
              </svg>
              
              {/* Point Labels */}
              <div className="absolute top-4 right-4 px-sm py-xs bg-primary text-white text-[10px] font-bold rounded shadow-xl animate-pulse">
                LIVE: {patient.riskScore}% RISK
              </div>
            </div>
            <div className="mt-md flex justify-between text-[10px] text-on-surface-variant font-bold px-2">
              <span>-12h</span>
              <span>-8h</span>
              <span>-4h</span>
              <span>NOW</span>
              <span className="text-slate-300">+4h</span>
              <span className="text-slate-300">+6h</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-slate-900/10 rounded-xl p-xl shadow-sm">
            <div className="flex items-center justify-between mb-lg">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary" data-icon="bolt">bolt</span>
                <h2 className="font-headline-md text-headline-md">What-If Simulator Upgrade</h2>
              </div>
              <span className="text-label-caps text-primary font-bold">MODE: INTERVENTION SIMULATION</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
              <div className="space-y-lg">
                <div>
                  <div className="flex justify-between mb-xs">
                    <label className="text-label-caps text-on-surface-variant">SIMULATED HEART RATE (BPM)</label>
                    <span className="font-data-mono text-primary">{simulatedHr} BPM</span>
                  </div>
                  <input className="w-full h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary" max="150" min="60" type="range" value={simulatedHr} onChange={(e) => setSimulatedHr(Number(e.target.value))}/>
                  <div className="flex justify-between mt-xs text-[10px] text-slate-400">
                    <span>Current: {patient.vitals.hr}</span>
                    <span>Target: 70-90</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-xs">
                    <label className="text-label-caps text-on-surface-variant">SIMULATED MEAN ARTERIAL PRESSURE (MAP)</label>
                    <span className="font-data-mono text-primary">{simulatedMap} mmHg</span>
                  </div>
                  <input className="w-full h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary" max="110" min="40" type="range" value={simulatedMap} onChange={(e) => setSimulatedMap(Number(e.target.value))}/>
                  <div className="flex justify-between mt-xs text-[10px] text-slate-400">
                    <span>Current: {patient.vitals.map}</span>
                    <span>Target: &gt;65</span>
                  </div>
                </div>
                <button onClick={handleSimulate} className="w-full py-md bg-primary text-on-primary font-bold rounded flex items-center justify-center gap-md hover:opacity-90 transition-opacity">
                  <span className="material-symbols-outlined" data-icon="analytics">analytics</span>
                  CALCULATE OUTCOME
                </button>
              </div>

              {simulationResult && (
                <div className="bg-primary-container text-white p-lg rounded-lg flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 pointer-events-none waveform-bg"></div>
                  <span className="text-label-caps text-on-primary-container mb-sm">PREDICTED RISK REDUCTION</span>
                  <div className="flex items-center gap-lg">
                    <div className="flex flex-col">
                      <span className="text-[14px] text-slate-400">CURRENT</span>
                      <span className="text-headline-lg">{simulationResult.currentRisk}%</span>
                    </div>
                    <span className="material-symbols-outlined text-4xl text-slate-500" data-icon="arrow_forward">arrow_forward</span>
                    <div className="flex flex-col">
                      <span className="text-[14px] text-emerald-400">AFTER</span>
                      <span className="text-vital-sign">{simulationResult.predictedRisk}%</span>
                    </div>
                  </div>
                  <div className={`mt-lg ${simulationResult.improvement >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-error/20 text-error'} px-lg py-sm rounded-full font-bold flex items-center gap-2`}>
                    <span className="material-symbols-outlined" data-icon={simulationResult.improvement >= 0 ? 'keyboard_double_arrow_down' : 'keyboard_double_arrow_up'}>
                      {simulationResult.improvement >= 0 ? 'keyboard_double_arrow_down' : 'keyboard_double_arrow_up'}
                    </span>
                    {Math.abs(simulationResult.improvement)}% {simulationResult.improvement >= 0 ? 'RISK IMPROVEMENT' : 'RISK INCREASE'}
                  </div>
                  <p className="mt-md text-[11px] text-slate-400 max-w-[240px]">Based on current inflammatory markers and simulated hemodynamic stabilization.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-lg">
          <div className="bg-white border border-outline-variant rounded-lg overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-md py-sm border-b border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-slate-700 text-sm" data-icon="calculate">calculate</span>
                <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">SOFA SCORE MONITORING</h3>
              </div>
              <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${patient.riskScore > 70 ? 'bg-error-container text-error' : 'bg-emerald-100 text-emerald-700'}`}>
                SCORE: {Math.floor(patient.riskScore / 10)}
              </div>
            </div>
            <div className="p-md space-y-sm">
              {[
                { system: 'Respiration (PaO2/FiO2)', score: patient.vitals.spo2 < 92 ? 3 : 1 },
                { system: 'Coagulation (Platelets)', score: (patient.vitals.platelets || 180) < 100 ? 2 : 0 },
                { system: 'Liver (Bilirubin)', score: 1 },
                { system: 'Cardiovascular (MAP)', score: patient.vitals.map < 65 ? 3 : 0 },
                { system: 'CNS (GCS Score)', score: 0 },
                { system: 'Renal (Creatinine)', score: (patient.vitals.creatinine || 1.1) > 1.5 ? 2 : 0 }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-600">{item.system}</span>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map(s => (
                      <div key={s} className={`w-2 h-2 rounded-full ${item.score >= s ? (item.score >= 3 ? 'bg-error' : 'bg-warning') : 'bg-slate-100'}`}></div>
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-[9px] text-slate-400 mt-2 leading-tight italic">SOFA Score ≥ 2 indicates a 10% or greater risk of in-hospital mortality.</p>
            </div>
          </div>

          <div className="bg-white border border-outline-variant rounded-lg overflow-hidden shadow-sm">
            <div className="bg-slate-900 px-md py-sm border-b border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-sky-400 text-sm" data-icon="troubleshoot">troubleshoot</span>
                <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">AI EXPLAINABILITY (SHAP)</h3>
              </div>
              <span className="text-[9px] text-slate-400 font-bold">MODEL CONFIDENCE: 94%</span>
            </div>
            <div className="p-md space-y-md">
              <p className="text-[11px] text-slate-500 italic mb-2">Features driving current risk score:</p>
              <div className="space-y-sm">
                {[
                  { label: 'Lactate Level', value: 85, color: 'bg-error' },
                  { label: 'Heart Rate Trend', value: 70, color: 'bg-error' },
                  { label: 'WBC Count', value: 45, color: 'bg-warning' },
                  { label: 'MAP Stability', value: -30, color: 'bg-emerald-500' },
                  { label: 'SpO2 Level', value: -15, color: 'bg-emerald-500' }
                ].map((feature, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                      <span className="text-slate-600">{feature.label}</span>
                      <span className={feature.value > 0 ? 'text-error' : 'text-emerald-600'}>
                        {feature.value > 0 ? '+' : ''}{feature.value}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                      {feature.value > 0 ? (
                        <>
                          <div className="w-1/2"></div>
                          <div className={`${feature.color} h-full`} style={{ width: `${feature.value / 2}%` }}></div>
                        </>
                      ) : (
                        <>
                          <div className="w-1/2 flex justify-end">
                            <div className={`${feature.color} h-full`} style={{ width: `${Math.abs(feature.value) / 2}%` }}></div>
                          </div>
                          <div className="w-1/2"></div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-outline-variant rounded-lg overflow-hidden shadow-sm">
            <div className="bg-emerald-50 px-md py-sm border-b border-emerald-100 flex items-center gap-sm">
              <span className="material-symbols-outlined text-emerald-600 text-sm" data-icon="task_alt">task_alt</span>
              <h3 className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">SEPSIS BUNDLE COMPLIANCE</h3>
            </div>
            <div className="p-md space-y-md">
              {[
                { name: 'Lactate Measurement', status: 'Completed', time: '10:15 AM' },
                { name: 'Blood Cultures', status: 'Completed', time: '10:30 AM' },
                { name: 'Broad-Spectrum Antibiotics', status: 'Completed', time: '11:00 AM' },
                { name: 'Fluid Resuscitation (30mL/kg)', status: 'In Progress', time: 'Ongoing' },
                { name: 'Vasopressors (MAP < 65)', status: 'Pending', time: '-' }
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-sm">
                  <span className={`material-symbols-outlined text-sm ${step.status === 'Completed' ? 'text-emerald-500' : step.status === 'In Progress' ? 'text-amber-500 animate-pulse' : 'text-slate-300'}`} data-icon={step.status === 'Completed' ? 'check_circle' : 'radio_button_unchecked'}>
                    {step.status === 'Completed' ? 'check_circle' : step.status === 'In Progress' ? 'published_with_changes' : 'radio_button_unchecked'}
                  </span>
                  <div className="flex-grow min-w-0">
                    <p className="text-[11px] font-bold text-slate-800 truncate">{step.name}</p>
                    <p className="text-[9px] text-slate-500 uppercase">{step.time} • {step.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-outline-variant rounded-lg p-md">
            <h3 className="text-label-caps text-on-surface-variant mb-md">CRITICAL LAB TRENDS</h3>
            <div className="space-y-sm">
              <div className="flex justify-between items-center text-[12px]">
                <span className="font-medium">WBC Count</span>
                <div className="flex items-center gap-xs">
                  <span className="font-data-mono">{patient.vitals.wbc || 12.0}</span>
                  <span className="text-error material-symbols-outlined text-xs" data-icon="trending_up">trending_up</span>
                </div>
              </div>
              <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                <div className="bg-error h-full w-4/5"></div>
              </div>
              <div className="flex justify-between items-center text-[12px] mt-md">
                <span className="font-medium">Creatinine</span>
                <div className="flex items-center gap-xs">
                  <span className="font-data-mono">{patient.vitals.creatinine || 1.1}</span>
                  <span className="text-error material-symbols-outlined text-xs" data-icon="trending_up">trending_up</span>
                </div>
              </div>
              <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                <div className="bg-error h-full w-2/3"></div>
              </div>
              <div className="flex justify-between items-center text-[12px] mt-md">
                <span className="font-medium">Platelets</span>
                <div className="flex items-center gap-xs">
                  <span className="font-data-mono">{patient.vitals.platelets || 180}</span>
                  <span className="text-primary material-symbols-outlined text-xs" data-icon="trending_down">trending_down</span>
                </div>
              </div>
              <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                <div className="bg-primary h-full w-1/2"></div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-outline-variant rounded-lg p-sm flex flex-col h-[350px] overflow-hidden">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-sm px-xs flex-shrink-0">INTERVENTION LOG</h3>
            <div className="space-y-sm overflow-y-auto overflow-x-hidden flex-grow pr-xs custom-scrollbar">
              {Array.isArray(patient.interventions) && patient.interventions.map((intervention) => (
                <div key={intervention.id} className="border-b border-slate-50 pb-sm last:border-0 px-xs">
                  <div className="flex items-center gap-xs mb-1">
                    <span className="material-symbols-outlined text-primary/40 text-sm flex-shrink-0" data-icon={intervention.type === 'Simulated Intervention' ? 'bolt' : 'medical_services'}>{intervention.type === 'Simulated Intervention' ? 'bolt' : 'medical_services'}</span>
                    <span className="text-[11px] font-bold text-slate-900 truncate flex-grow">{intervention.type}</span>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded-sm uppercase flex-shrink-0">{intervention.status || 'DONE'}</span>
                  </div>
                  {intervention.details && (
                    <div className="text-[10px] text-slate-500 leading-[1.2] mb-1 pl-[18px] break-words">
                      {intervention.details}
                    </div>
                  )}
                  <div className="text-[9px] text-slate-400 pl-[18px] uppercase tracking-tighter">
                    {intervention.time}
                  </div>
                </div>
              ))}
              {(!patient.interventions || !Array.isArray(patient.interventions) || patient.interventions.length === 0) && (
                <p className="text-[12px] text-slate-500 italic">No recent interventions recorded.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <button className="fixed bottom-8 right-8 bg-primary text-on-primary w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-2xl" data-icon="emergency_share">emergency_share</span>
      </button>
    </Layout>
  );
};

export default PatientDetail;
