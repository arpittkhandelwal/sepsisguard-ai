const API_URL = '/api';

// Fail-Safe Mock Data
const MOCK_PATIENTS = [
  {
    id: 'PT-8821', name: 'Eleanor Wright', age: 68, gender: 'F', bed: 'Bed 104',
    status: 'Critical', riskScore: 82, riskTrend: 'up', department: 'Medical ICU',
    bmi: 26.4, admissionDate: '2024-04-20', attending: 'Dr. Patel',
    vitals: { hr: 112, map: 62, temp: 101.2, spo2: 94, bpSystolic: 88, bpDiastolic: 58, wbc: 14.2, creatinine: 1.8, platelets: 110 },
    risk_history: [
      { time: '-12h', riskScore: 40 }, { time: '-8h', riskScore: 52 },
      { time: '-4h', riskScore: 65 }, { time: 'now', riskScore: 82 }
    ],
    shap: { insights: [
      { title: 'Elevated Lactate (4.2 mmol/L)', description: 'Primary driver — indicates tissue hypoperfusion.', severity: 'error' },
      { title: 'Tachycardia (HR > 110)', description: 'Sustained compensatory tachycardia suggests septic response.', severity: 'error' },
      { title: 'Hypotension (MAP < 65)', description: 'Hemodynamic instability requiring vasopressor support.', severity: 'error' }
    ]},
    interventions: [
      { id: 1, type: 'IV Fluids', details: '500mL Normal Saline bolus administered', time: '10:15 AM', status: 'DONE' },
      { id: 2, type: 'Antibiotics', details: 'Piperacillin-Tazobactam 4.5g IV commenced', time: '11:00 AM', status: 'DONE' }
    ],
    timeline_markers: [
      { type: 'Model Prediction', time: '-8h', label: 'AI Alert' },
      { type: 'Clinical Diagnosis', time: 'now', label: 'Dx Confirmed' }
    ]
  },
  {
    id: 'PT-8822', name: 'James Miller', age: 55, gender: 'M', bed: 'Bed 12',
    status: 'High Risk', riskScore: 65, riskTrend: 'up', department: 'Emergency Ward',
    bmi: 28.1, admissionDate: '2024-04-21', attending: 'Dr. Singh',
    vitals: { hr: 95, map: 78, temp: 99.8, spo2: 96, bpSystolic: 110, bpDiastolic: 72, wbc: 11.0, creatinine: 1.2, platelets: 160 },
    risk_history: [
      { time: '-12h', riskScore: 30 }, { time: '-8h', riskScore: 40 },
      { time: '-4h', riskScore: 55 }, { time: 'now', riskScore: 65 }
    ],
    shap: { insights: [
      { title: 'Rising WBC Count', description: 'Leukocytosis indicating systemic infection.', severity: 'warning' },
      { title: 'Fever (T > 38.5°C)', description: 'Persistent pyrexia consistent with sepsis criteria.', severity: 'warning' }
    ]},
    interventions: [
      { id: 1, type: 'Blood Cultures', details: '2 sets drawn before antibiotic initiation', time: '09:30 AM', status: 'DONE' }
    ],
    timeline_markers: [
      { type: 'Model Prediction', time: '-8h', label: 'AI Alert' }
    ]
  }
];

// Safe JSON parser — never throws on HTML responses
const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

export const api = {
  getPatients: async () => {
    try {
      const res = await fetch(`${API_URL}/patients`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await safeJson(res);
      if (!data || !Array.isArray(data)) throw new Error('Invalid response');
      return data;
    } catch (e) {
      console.warn('SepsisGuard: Using Mock Data.', e.message);
      return MOCK_PATIENTS;
    }
  },

  getPatientById: async (id) => {
    try {
      const res = await fetch(`${API_URL}/patients/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await safeJson(res);
      if (!data) throw new Error('Invalid response');
      return data;
    } catch (e) {
      console.warn('SepsisGuard: Using Mock Patient.', e.message);
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
      const data = await safeJson(res);
      return data || { ...patientData, id: `PT-${Math.floor(Math.random() * 9000) + 1000}`, riskScore: 45, status: 'Stable' };
    } catch {
      return { ...patientData, id: `PT-${Math.floor(Math.random() * 9000) + 1000}`, riskScore: 45, status: 'Stable' };
    }
  },

  getAlerts: async () => {
    try {
      const res = await fetch(`${API_URL}/alerts`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await safeJson(res);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  getAnalytics: async () => {
    try {
      const res = await fetch(`${API_URL}/analytics`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await safeJson(res);
      return data || {};
    } catch {
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
      return await safeJson(res) || { success: true };
    } catch {
      return { success: true };
    }
  },

  simulateIntervention: async (id, hr, map) => {
    try {
      const res = await fetch(`${API_URL}/patients/${id}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hr, map })
      });
      return await safeJson(res) || { currentRisk: 75, predictedRisk: 45, improvement: 30 };
    } catch {
      return { currentRisk: 75, predictedRisk: 45, improvement: 30 };
    }
  }
};
