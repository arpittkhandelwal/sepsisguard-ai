const API_URL = '/api';

export const api = {
  getPatients: async () => {
    const res = await fetch(`${API_URL}/patients`);
    if (!res.ok) throw new Error('Failed to fetch patients');
    return await res.json();
  },
  getPatientById: async (id) => {
    const res = await fetch(`${API_URL}/patients/${id}`);
    if (!res.ok) throw new Error('Patient not found');
    return await res.json();
  },
  createPatient: async (patientData) => {
    const res = await fetch(`${API_URL}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData)
    });
    return await res.json();
  },
  getAlerts: async () => {
    const res = await fetch(`${API_URL}/alerts`);
    if (!res.ok) return [];
    return await res.json();
  },
  getAnalytics: async () => {
    const res = await fetch(`${API_URL}/analytics`);
    if (!res.ok) return {};
    return await res.json();
  },
  updatePatientStatus: async (id, status) => {
    const res = await fetch(`${API_URL}/patients/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await res.json();
  },
  simulateIntervention: async (id, hr, map) => {
    const res = await fetch(`${API_URL}/patients/${id}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hr, map })
    });
    if (!res.ok) throw new Error('Simulation failed');
    return await res.json();
  }
};
