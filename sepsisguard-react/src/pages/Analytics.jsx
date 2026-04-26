import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Layout from '../components/Layout';

const Analytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await api.getAnalytics();
      setData(res);
    };
    fetchAnalytics();
  }, []);

  if (!data) return null;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-lg">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Clinical Intelligence Analytics</h1>
            <p className="text-on-surface-variant font-body-md max-w-2xl mt-xs">Comprehensive validation of SepsisGuard predictive accuracy and hospital-wide survival outcomes for Q3 performance review.</p>
          </div>
          <div className="flex gap-xs">
            <button className="bg-white border border-outline-variant text-on-surface px-md py-xs rounded font-label-caps uppercase flex items-center gap-xs">
              <span className="material-symbols-outlined text-[16px]">download</span>
              Export Report
            </button>
            <button className="bg-primary text-on-primary px-md py-xs rounded font-label-caps uppercase flex items-center gap-xs">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              Past 90 Days
            </button>
          </div>
        </div>

        <section className="grid grid-cols-12 gap-gutter">
          <div className="col-span-12 md:col-span-4 bg-white border border-[#E9ECEF] p-lg rounded-lg flex flex-col justify-between">
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Model Performance</span>
              <h3 className="font-headline-md text-headline-md mt-xs">Early Detection Advantage</h3>
            </div>
            <div className="mt-xl">
              <span className="font-vital-sign text-vital-sign text-primary">{data.earlyDetectionHours} hrs</span>
              <p className="text-on-surface-variant font-body-md mt-xs">Average clinical intervention lead time gained vs. standard SIRS protocols.</p>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 bg-white border border-[#E9ECEF] p-lg rounded-lg flex flex-col justify-between">
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Clinical Credibility</span>
              <h3 className="font-headline-md text-headline-md mt-xs">False Positive Rate</h3>
            </div>
            <div className="mt-xl">
              <span className="font-vital-sign text-vital-sign text-primary">{data.falsePositiveRate}%</span>
              <p className="text-on-surface-variant font-body-md mt-xs">Proven reduction in alert fatigue; 97.9% of triggers validated by biomarkers.</p>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 bg-slate-900 p-lg rounded-lg flex flex-col justify-between text-white shadow-xl">
            <div>
              <span className="font-label-caps text-label-caps text-slate-400 uppercase">Primary Outcome</span>
              <h3 className="font-headline-md text-headline-md mt-xs text-white">Survival Rate Improvement</h3>
            </div>
            <div className="mt-xl">
              <div className="flex items-center gap-xs">
                <span className="font-vital-sign text-vital-sign text-white">+{data.survivalRateImprovement}%</span>
                <span className="material-symbols-outlined text-[48px] text-emerald-400">trending_up</span>
              </div>
              <p className="text-slate-400 font-body-md mt-xs">Aggregated relative risk reduction across high-acuity wards since deployment.</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-12 gap-gutter">
          <div className="col-span-12 lg:col-span-7 bg-white border border-[#E9ECEF] rounded-lg p-lg">
            <div className="flex justify-between items-start mb-xl">
              <div>
                <h4 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Global Risk Distribution</h4>
                <p className="font-headline-md text-headline-md mt-xs">Active Population Stratification</p>
              </div>
              <span className="material-symbols-outlined text-outline">info</span>
            </div>
            <div className="h-64 flex items-end gap-xs">
              <div className="w-full bg-slate-50 h-[20%] rounded-sm relative group cursor-help">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">Stable: {data.riskDistribution.stable}</div>
              </div>
              <div className="w-full bg-slate-100 h-[45%] rounded-sm relative group cursor-help"></div>
              <div className="w-full bg-slate-200 h-[70%] rounded-sm relative group cursor-help"></div>
              <div className="w-full bg-sky-100 h-[90%] rounded-sm relative group cursor-help">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">Monitoring: {data.riskDistribution.monitoring}</div>
              </div>
              <div className="w-full bg-slate-400 h-[60%] rounded-sm relative group cursor-help"></div>
              <div className="w-full bg-slate-600 h-[35%] rounded-sm relative group cursor-help">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">Elevated: {data.riskDistribution.elevated}</div>
              </div>
              <div className="w-full bg-error h-[15%] rounded-sm relative group cursor-help">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">Critical: {data.riskDistribution.critical}</div>
              </div>
            </div>
            <div className="flex justify-between mt-md pt-md border-t border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Low Probability</span>
              <span>Moderate Risk</span>
              <span>Acute Sepsis State</span>
            </div>
          </div>
          
          <div className="col-span-12 lg:col-span-5 bg-white border border-[#E9ECEF] rounded-lg p-lg overflow-hidden relative">
            <div className="mb-xl">
              <h4 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Temporal Analysis</h4>
              <p className="font-headline-md text-headline-md mt-xs">System-wide Alert Trends</p>
            </div>
            <div className="relative h-48 mt-lg">
              <svg className="w-full h-full" viewBox="0 0 400 150">
                <path d="M0,120 Q50,110 100,80 T200,60 T300,100 T400,20" fill="none" stroke="#0F172A" strokeWidth="2"></path>
                <path d="M0,120 Q50,110 100,80 T200,60 T300,100 T400,20 L400,150 L0,150 Z" fill="url(#gradient)" opacity="0.1"></path>
                <defs>
                  <linearGradient id="gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#0F172A', stopOpacity:1}}></stop>
                    <stop offset="100%" style={{stopColor:'#0F172A', stopOpacity:0}}></stop>
                  </linearGradient>
                </defs>
                <circle cx="100" cy="80" fill="#0F172A" r="3"></circle>
                <circle cx="200" cy="60" fill="#0F172A" r="3"></circle>
                <circle cx="300" cy="100" fill="#0F172A" r="3"></circle>
                <circle cx="400" cy="20" fill="#ba1a1a" r="4"></circle>
              </svg>
              <div className="absolute top-2 right-2 flex flex-col items-end">
                <span className="text-[20px] font-black text-error">Current: High</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Fluctuation detected</span>
              </div>
            </div>
            <div className="mt-lg space-y-xs">
              <div className="flex justify-between items-center py-xs border-b border-slate-50">
                <span className="font-body-md text-on-surface-variant">Peak Alert Frequency</span>
                <span className="font-data-mono text-data-mono">03:00 - 05:00</span>
              </div>
              <div className="flex justify-between items-center py-xs border-b border-slate-50">
                <span className="font-body-md text-on-surface-variant">Model Confidence Floor</span>
                <span className="font-data-mono text-data-mono">94.8%</span>
              </div>
            </div>
          </div>
        </div>

        <section className="bg-white border border-[#E9ECEF] rounded-lg">
          <div className="p-lg border-b border-slate-100 flex justify-between items-center">
            <div>
              <h4 className="font-headline-md text-headline-md">Unit-Specific Credibility Index</h4>
              <p className="text-on-surface-variant font-body-md">Comparative analysis of model performance across hospital departments.</p>
            </div>
            <div className="flex gap-xs">
              <div className="flex items-center gap-xs px-md py-1 border border-slate-100 rounded text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Validated
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-label-caps uppercase text-[10px]">
                  <th className="px-lg py-md">DEPARTMENT</th>
                  <th className="px-lg py-md">AVG RISK SCORE</th>
                  <th className="px-lg py-md">SURVIVAL RATE</th>
                  <th className="px-lg py-md">FALSE POSITIVE RATE</th>
                  <th className="px-lg py-md">AVG RESPONSE TIME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-body-md text-slate-700">
                {data.departments && data.departments.map((dept, idx) => (
                  <tr key={idx}>
                    <td className="px-lg py-md font-bold text-slate-900">{dept.name}</td>
                    <td className={`px-lg py-md font-bold ${dept.riskAvg > 50 ? 'text-amber-600' : 'text-emerald-600'}`}>{dept.riskAvg}%</td>
                    <td className="px-lg py-md">{dept.survivalRate}%</td>
                    <td className="px-lg py-md">{dept.falsePositiveRate}%</td>
                    <td className="px-lg py-md">{dept.avgResponseTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-md bg-slate-50 flex justify-center">
            <button className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">VIEW ALL DEPARTMENTS</button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Analytics;
