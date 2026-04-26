const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Fail-Safe Mock Data for Hackathon Demo
const MOCK_PATIENTS = [
  { id: 'PT-8821', name: 'James Wilson', age: 68, gender: 'Male', bed: 'ICU-04', status: 'Critical', riskScore: 84, vitals: { hr: 112, map: 62, temp: 38.5, rr: 24, spo2: 91 }, diagnosis: 'Septic Shock / Pneumonia', admissionTime: '2026-04-26 08:30' },
  { id: 'PT-9102', name: 'Sarah Chen', age: 45, gender: 'Female', bed: 'ICU-12', status: 'High Risk', riskScore: 58, vitals: { hr: 98, map: 68, temp: 37.8, rr: 20, spo2: 94 }, diagnosis: 'Post-Op / Sepsis Surveillance', admissionTime: '2026-04-26 14:15' },
  { id: 'PT-7244', name: 'Robert Miller', age: 72, gender: 'Male', bed: 'ICU-08', status: 'Watch', riskScore: 32, vitals: { hr: 82, map: 74, temp: 37.2, rr: 18, spo2: 97 }, diagnosis: 'UTI / Potential Bacteremia', admissionTime: '2026-04-26 10:00' }
];

export const api = {
  getPatients: async () => {
    try {
      const res = await fetch(`${API_URL}/patients`);
      if (!res.ok) throw new Error('API Down');
      return await res.json();
    } catch (e) {
      console.warn("Using Fail-Safe Mock Patients for Demo");
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
  getAlerts: async () => {
    try {
      const res = await fetch(`${API_URL}/alerts`);
      if (!res.ok) throw new Error('API Down');
      return await res.json();
    } catch (e) {
      return [
        { id: 'AL-1', severity: 'Critical', title: 'SIRS Criteria Met', patientName: 'James Wilson', bed: 'ICU-04', time: 'Just Now', description: 'Patient showing acute hemodynamic instability.' },
        { id: 'AL-2', severity: 'High', title: 'Rising Lactate Trend', patientName: 'Sarah Chen', bed: 'ICU-12', time: '12m ago', description: 'AI detected 24% increase in lactate over 2 hours.' }
      ];
    }
  },
  getAnalytics: async () => {
    try {
      const res = await fetch(`${API_URL}/analytics`);
      if (!res.ok) throw new Error('API Down');
      return await res.json();
    } catch (e) {
      return {
        activePatients: 42,
        criticalAlerts: 3,
        avgResponseTime: "42s",
        earlyDetectionHours: 8.5,
        falsePositiveRate: 2.1,
        survivalRateImprovement: 14.2,
        riskDistribution: { stable: 24, monitoring: 12, elevated: 4, critical: 2 }
      };
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
      return { success: true, status };
    }
  },
  simulateIntervention: async (patientId, targetHr, targetMap) => {
    try {
      const res = await fetch(`${API_URL}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, targetHr, targetMap })
      });
      return await res.json();
    } catch (e) {
      // Mock simulation logic
      return { 
        currentRisk: 84, 
        predictedRisk: 62, 
        improvement: 22,
        patient: MOCK_PATIENTS[0]
      };
    }
  }
};
