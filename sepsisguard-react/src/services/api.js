const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:3001/api' : '/api');

// Fail-Safe Mock Data for local dev if backend is not running
const MOCK_PATIENTS = [
  { id: 'PT-8821', name: 'James Wilson', age: 68, gender: 'Male', bed: 'ICU-04', status: 'Critical', riskScore: 84, riskTrend: 'up', vitals: { hr: 112, map: 62, temp: 38.5, rr: 24, spo2: 91 }, diagnosis: 'Septic Shock / Pneumonia', admissionTime: '2026-04-26 08:30', department: 'ICU Unit Alpha', bmi: 26.4 },
  { id: 'PT-9102', name: 'Sarah Chen', age: 45, gender: 'Female', bed: 'ICU-12', status: 'High Risk', riskScore: 58, riskTrend: 'flat', vitals: { hr: 98, map: 68, temp: 37.8, rr: 20, spo2: 94 }, diagnosis: 'Post-Op / Sepsis Surveillance', admissionTime: '2026-04-26 14:15', department: 'Emergency Ward', bmi: 22.8 }
];

export const api = {
  getPatients: async () => {
    try {
      const res = await fetch(`${API_URL}/patients`);
      if (!res.ok) throw new Error('API Down');
      return await res.json();
    } catch (e) {
      if (isLocalhost) return MOCK_PATIENTS;
      console.error("Live DB Error:", e);
      return MOCK_PATIENTS;
    }
  },
  getPatientById: async (id) => {
    try {
      const res = await fetch(`${API_URL}/patients/${id}`);
      if (!res.ok) throw new Error('API Down');
      return await res.json();
    } catch (e) {
      return MOCK_PATIENTS.find(p => p.id === id) || MOCK_PATIENTS[0];
    }
  },
  createPatient: async (patientData) => {
    try {
      const res = await fetch(`${API_URL}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData)
      });
      if (!res.ok) throw new Error('API Down');
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  },
  getAlerts: async () => {
    try {
      const res = await fetch(`${API_URL}/alerts`);
      if (!res.ok) throw new Error('API Down');
      return await res.json();
    } catch (e) {
      return [];
    }
  },
  getAnalytics: async () => {
    try {
      const res = await fetch(`${API_URL}/analytics`);
      if (!res.ok) throw new Error('API Down');
      return await res.json();
    } catch (e) {
      return {};
    }
  },
  updatePatientStatus: async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/patients/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  }
};
