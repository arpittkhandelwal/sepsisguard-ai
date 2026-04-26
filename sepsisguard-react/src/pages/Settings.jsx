import React from 'react';
import Layout from '../components/Layout';

const Settings = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-lg">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">System Configuration</h1>
          <p className="text-on-surface-variant font-body-md max-w-2xl mt-xs">Manage your SepsisGuard AI preferences, clinical alert thresholds, and integration settings.</p>
        </div>

        <div className="bg-white border border-outline-variant rounded-lg p-lg">
          <h3 className="font-headline-md text-headline-md mb-md">Clinical Alert Thresholds</h3>
          <div className="space-y-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-on-surface">High Risk Threshold (%)</p>
                <p className="text-[12px] text-on-surface-variant">Triggers visual alerts on the dashboard when a patient's risk score exceeds this value.</p>
              </div>
              <input type="number" defaultValue={50} className="border border-outline-variant rounded px-sm py-xs w-20 text-center font-data-mono" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-on-surface">Critical Risk Threshold (%)</p>
                <p className="text-[12px] text-on-surface-variant">Triggers immediate SMS/pager alerts for attending physicians.</p>
              </div>
              <input type="number" defaultValue={75} className="border border-outline-variant rounded px-sm py-xs w-20 text-center font-data-mono" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-outline-variant rounded-lg p-lg">
          <h3 className="font-headline-md text-headline-md mb-md">Integrations & Data Sources</h3>
          <div className="space-y-md">
            <div className="flex items-center justify-between border-b border-outline-variant pb-sm">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">database</span>
                <div>
                  <p className="font-bold text-on-surface">EHR System Sync</p>
                  <p className="text-[12px] text-on-surface-variant">Epic Systems API Connection</p>
                </div>
              </div>
              <span className="px-sm py-[2px] bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded uppercase">Connected</span>
            </div>
            <div className="flex items-center justify-between border-b border-outline-variant pb-sm">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">science</span>
                <div>
                  <p className="font-bold text-on-surface">Lab Information System (LIS)</p>
                  <p className="text-[12px] text-on-surface-variant">Continuous webhook ingestion</p>
                </div>
              </div>
              <span className="px-sm py-[2px] bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded uppercase">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">monitor_heart</span>
                <div>
                  <p className="font-bold text-on-surface">Bedside Telemetry Hub</p>
                  <p className="text-[12px] text-on-surface-variant">Live high-frequency vitals stream</p>
                </div>
              </div>
              <span className="px-sm py-[2px] bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded uppercase">Connected</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-outline-variant rounded-lg p-lg">
          <h3 className="font-headline-md text-headline-md mb-md">User Preferences</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-on-surface">Mute non-critical alerts</p>
              <p className="text-[12px] text-on-surface-variant">Suppress push notifications for "Watch" status patients.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-sm">
          <button className="px-md py-xs rounded font-label-caps uppercase border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors">Cancel</button>
          <button className="bg-primary text-on-primary px-md py-xs rounded font-label-caps uppercase hover:opacity-90 transition-opacity">Save Configuration</button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
