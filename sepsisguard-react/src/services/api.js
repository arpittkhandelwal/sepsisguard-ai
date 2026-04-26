const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  getPatients: async () => {
    const res = await fetch(`${API_URL}/patients`);
    return res.json();
  },
  getPatientById: async (id) => {
    const res = await fetch(`${API_URL}/patients/${id}`);
    return res.json();
  },
  getAlerts: async () => {
    const res = await fetch(`${API_URL}/alerts`);
    return res.json();
  },
  getAnalytics: async () => {
    const res = await fetch(`${API_URL}/analytics`);
    return res.json();
  },
  updatePatientStatus: async (id, status) => {
    const res = await fetch(`${API_URL}/patients/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },
  simulateIntervention: async (patientId, targetHr, targetMap) => {
    const res = await fetch(`${API_URL}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, targetHr, targetMap })
    });
    return res.json();
  }
};
