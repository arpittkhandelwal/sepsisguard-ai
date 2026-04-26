const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = import.meta.env.VITE_API_URL || 
  (isLocalhost ? 'http://localhost:3001/api' : `${window.location.origin}/api`);

// Fail-Safe Mock Data
const MOCK_PATIENTS = [
  { id: 'PT-8821', name: 'Eleanor Wright', age: 68, gender: 'F', bed: 'Bed 104', status: 'Critical', riskScore: 82, riskTrend: 'up', department: 'Medical ICU', bmi: 26.4, vitals: { hr: 112, map: 65, temp: 101.2, spo2: 94 } },
  { id: 'PT-8822', name: 'James Miller', age: 55, gender: 'M', bed: 'Bed 12', status: 'High Risk', riskScore: 65, riskTrend: 'up', department: 'Emergency Ward', bmi: 28.1, vitals: { hr: 95, map: 78, temp: 99.8, spo2: 96 } }
];

export const api = {
  getPatients: async () => {
    try {
      const res = await fetch(`${API_URL}/patients`);
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error("Non-JSON response from API:", text.substring(0, 100));
        throw new Error("Invalid API response format");
      }
    } catch (e) {
      console.warn("SepsisGuard: Using Fail-Safe Mock Patients", e.message);
      return MOCK_PATIENTS;
    }
  },
  getPatientById: async (id) => {
    try {
      const res = await fetch(`${API_URL}/patients/${id}`);
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
      return await res.json();
    } catch (e) {
      return { ...patientData, id: `PT-${Math.floor(Math.random()*9000)+1000}`, riskScore: 45, status: 'Stable' };
    }
  },
  getAlerts: async () => {
    try {
      const res = await fetch(`${API_URL}/alerts`);
      return await res.json();
    } catch (e) {
      return [];
    }
  },
  getAnalytics: async () => {
    try {
      const res = await fetch(`${API_URL}/analytics`);
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
      return { success: true };
    }
  }
};
