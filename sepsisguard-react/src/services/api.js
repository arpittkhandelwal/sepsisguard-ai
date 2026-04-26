const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  getPatients: async () => {
    try {
      const res = await fetch(`${API_URL}/patients`);
      if (!res.ok) throw new Error('Failed to fetch patients');
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
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
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  
  getPatient: async (id) => {
    try {
      const res = await fetch(`${API_URL}/patients/${id}`);
      if (!res.ok) throw new Error('Failed to fetch patient');
      return await res.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  getAlerts: async () => {
    try {
      const res = await fetch(`${API_URL}/alerts`);
      if (!res.ok) throw new Error('Failed to fetch alerts');
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getAnalytics: async () => {
    try {
      const res = await fetch(`${API_URL}/analytics`);
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return await res.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  simulateIntervention: async (patientId, targetHr, targetMap) => {
    try {
      const res = await fetch(`${API_URL}/simulate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientId, targetHr, targetMap })
      });
      if (!res.ok) throw new Error('Failed to simulate intervention');
      return await res.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  updatePatientStatus: async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/patients/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update patient status');
      return await res.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
};
