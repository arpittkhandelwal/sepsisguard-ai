import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const data = await api.getAlerts();
      setAlerts(data);
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const criticalAlerts = alerts.filter(a => a.severity === 'Critical');
  const highAlerts = alerts.filter(a => a.severity === 'High');
  const mainAlert = criticalAlerts[0] || alerts[0];
  const otherAlerts = alerts.filter(a => a.id !== (mainAlert ? mainAlert.id : null));

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg mb-xl">
        <div>
          <h1 className="font-headline-lg text-primary mb-xs">Active Clinical Warnings</h1>
          <p className="text-on-surface-variant max-w-xl">High-fidelity sepsis surveillance monitoring 42 active beds. Alerts are prioritized by SIRS and qSOFA scoring metrics.</p>
        </div>
        <div className="flex gap-xs">
          <button className="bg-primary text-on-primary px-lg py-sm rounded flex items-center gap-xs font-label-caps uppercase transition-opacity active:opacity-80">
            <span className="material-symbols-outlined text-sm" data-icon="filter_list">filter_list</span> Filter Priority
          </button>
          <button className="bg-white border border-outline-variant text-primary px-lg py-sm rounded flex items-center gap-xs font-label-caps uppercase hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-sm" data-icon="history">history</span> Archive
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-md mb-lg">
        <div className="px-lg py-sm bg-error-container text-on-error-container rounded flex items-center gap-xs border border-error/10">
          <span className="w-2 h-2 rounded-full bg-error"></span>
          <span className="font-label-caps">Critical ({criticalAlerts.length.toString().padStart(2, '0')})</span>
        </div>
        <div className="px-lg py-sm bg-tertiary-container text-tertiary-fixed rounded flex items-center gap-xs">
          <span className="w-2 h-2 rounded-full bg-tertiary-fixed"></span>
          <span className="font-label-caps">High ({highAlerts.length.toString().padStart(2, '0')})</span>
        </div>
        <div className="px-lg py-sm bg-surface-container-high text-on-surface-variant rounded flex items-center gap-xs">
          <span className="w-2 h-2 rounded-full bg-secondary"></span>
          <span className="font-label-caps">Watch (12)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-lg">
        {mainAlert && (
          <div className="xl:col-span-8 bg-white border-2 border-error critical-pulse rounded-lg p-lg shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start mb-lg gap-md">
              <div className="flex items-start gap-md">
                <div className="w-12 h-12 bg-error-container rounded flex items-center justify-center text-error">
                  <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>emergency</span>
                </div>
                <div>
                  <div className="flex items-center gap-xs mb-base">
                    <span className="font-label-caps text-error bg-error-container px-xs py-0.5 rounded">{mainAlert.severity} Severity</span>
                    <span className="font-data-mono text-on-surface-variant">{mainAlert.bed} • Patient: {mainAlert.patientName}</span>
                  </div>
                  <h2 className="font-headline-md text-primary">{mainAlert.title}</h2>
                </div>
              </div>
              <div className="font-data-mono text-on-surface-variant text-right">
                <div>Alert Triggered</div>
                <div className="text-primary font-bold">{mainAlert.time}</div>
              </div>
            </div>
            
            <p className="text-body-md text-on-surface-variant mb-lg">{mainAlert.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-lg">
              <div className="bg-surface-container-low p-md rounded border border-outline-variant/30">
                <div className="font-label-caps text-on-surface-variant mb-xs">Metrics</div>
                <div className="space-y-base">
                  {mainAlert.metrics && mainAlert.metrics.map((m, idx) => (
                    <div key={idx} className={`flex justify-between items-center ${m.trend === 'up' || m.trend === 'down' ? 'text-error font-bold' : 'text-on-surface-variant'}`}>
                      <span>{m.label}: {m.value}</span>
                      {m.trend === 'up' && <span className="material-symbols-outlined text-sm">arrow_upward</span>}
                      {m.trend === 'down' && <span className="material-symbols-outlined text-sm">arrow_downward</span>}
                    </div>
                  ))}
                  {(!mainAlert.metrics || mainAlert.metrics.length === 0) && (
                    <span className="text-sm text-slate-400">No specific metrics</span>
                  )}
                </div>
              </div>
              <div className="bg-surface-container-low p-md rounded border border-outline-variant/30">
                <div className="font-label-caps text-on-surface-variant mb-xs">Hemodynamics</div>
                <div className="font-vital-sign text-primary text-2xl">MAP: {mainAlert.map || 'N/A'}</div>
                {mainAlert.map && mainAlert.map < 65 && (
                  <div className="text-error font-bold text-xs mt-base flex items-center gap-xs">
                    <span className="material-symbols-outlined text-xs">warning</span> Below Threshold (&lt; 65)
                  </div>
                )}
              </div>
              <div className="bg-surface-container-low p-md rounded border border-outline-variant/30">
                <div className="font-label-caps text-on-surface-variant mb-xs">AI Confidence</div>
                <div className="font-vital-sign text-primary text-2xl">{mainAlert.confidence || '--'}%</div>
                <div className="text-on-surface-variant text-xs mt-base">Sepsis Likelihood Gradient</div>
              </div>
            </div>

            <div className="flex gap-md">
              <button className="flex-1 bg-primary text-on-primary py-sm rounded font-label-caps transition-all active:scale-[0.98]">Acknowledge & Respond</button>
              <Link to={`/patient/${mainAlert.patientId}`} className="flex-1 bg-white border border-outline text-primary py-sm rounded font-label-caps hover:bg-surface-container transition-all block text-center leading-loose">Review Full Chart</Link>
            </div>
          </div>
        )}

        <div className="xl:col-span-4 space-y-lg">
          <div className="bg-primary-container p-lg rounded-lg text-white">
            <div className="font-label-caps text-on-primary-container mb-lg">Unit Response Status</div>
            <div className="flex items-center justify-between mb-md">
              <span>Avg Ack Time</span>
              <span className="font-data-mono text-xl">42s</span>
            </div>
            <div className="w-full bg-on-primary-container/20 h-1.5 rounded-full overflow-hidden mb-lg">
              <div className="bg-white h-full w-[85%]"></div>
            </div>
            <div className="flex items-center gap-md">
              <div className="flex-1 bg-white/10 p-md rounded text-center">
                <div className="text-[10px] uppercase font-bold opacity-70">Active Code</div>
                <div className="text-lg font-black">{criticalAlerts.length}</div>
              </div>
              <div className="flex-1 bg-white/10 p-md rounded text-center">
                <div className="text-[10px] uppercase font-bold opacity-70">Rapid Resp</div>
                <div className="text-lg font-black">{highAlerts.length}</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-outline-variant rounded-lg overflow-hidden">
            <div className="p-md bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
              <span className="font-label-caps text-primary">Unit Census Maps</span>
              <span className="material-symbols-outlined text-sm">open_in_full</span>
            </div>
            <div className="h-40 bg-slate-100 flex items-center justify-center relative overflow-hidden">
              <img alt="ICU Floor Plan Map" className="w-full h-full object-cover grayscale opacity-50 absolute inset-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7nQM3tamkxMzMFEYrPSesyQ-LxFOdrt-mzNcy8O9yp2l3e_Jq13SQGLDl94sVWTvOQ-Ce3zHAyAV7-zOsdmknYwSETVWZFKgpLwYFD5ph88CUMO5MXAWMLTe14VDOlU7rcKtdA5wft53_sB9n10EQEBwsd2Vr8F82D30L8Qm4NRLxYg2KqhPti5tYixh12-NkMee6DCupxrureEuJZSIW7b3tUN8DdLeXpfONfltZZS0IG8ncaJSIHrhkXvRD-dA7oLkAIcQg4Zo"/>
              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-error rounded-full animate-ping"></div>
              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-error rounded-full"></div>
            </div>
          </div>
        </div>

        {otherAlerts.map(alert => (
          <div key={alert.id} className="xl:col-span-6 bg-white border border-outline-variant rounded-lg p-lg hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-md">
              <div className="flex gap-md">
                <div className="w-10 h-10 bg-tertiary-container rounded flex items-center justify-center text-tertiary-fixed">
                  <span className="material-symbols-outlined">warning</span>
                </div>
                <div>
                  <div className="flex items-center gap-xs mb-base">
                    <span className="font-label-caps text-tertiary-fixed bg-tertiary-container px-xs py-0.5 rounded">{alert.severity} Severity</span>
                    <span className="font-data-mono text-on-surface-variant">{alert.bed} • {alert.patientName}</span>
                  </div>
                  <h3 className="font-headline-md text-primary">{alert.title}</h3>
                </div>
              </div>
              <div className="text-right">
                <div className="font-data-mono text-xs text-on-surface-variant">{alert.time}</div>
              </div>
            </div>
            <p className="text-body-md text-on-surface-variant mb-lg">{alert.description}</p>
            {alert.metrics && alert.metrics.length > 0 && (
              <div className="flex gap-md mb-lg">
                {alert.metrics.map((m, idx) => (
                  <div key={idx} className={`bg-surface-container-low px-md py-xs rounded border ${m.trend === 'up' || m.trend === 'down' ? 'border-error/20 text-error' : 'border-outline-variant/30 text-on-surface-variant'} text-xs font-bold`}>
                    {m.label}: {m.value}
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-md">
              <button className="bg-primary text-on-primary px-lg py-sm rounded font-label-caps text-xs">Acknowledge</button>
              <Link to={`/patient/${alert.patientId}`} className="bg-white border border-outline text-primary px-lg py-sm rounded font-label-caps text-xs">View Patient</Link>
            </div>
          </div>
        ))}
        
      </div>
    </Layout>
  );
};

export default Alerts;
