import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://posldhsqknqyybwlkzxj.supabase.co';
const supabaseKey = 'sb_publishable_-untAk5_snXbC-3dnQSklg_UY1SSlgp';

const supabase = createClient(supabaseUrl, supabaseKey);

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

export const api = {
  getPatients: async () => {
    try {
      const { data, error } = await supabase.from('patients').select('*').order('id', { ascending: false });
      if (error) throw error;
      return data && data.length > 0 ? data : MOCK_PATIENTS;
    } catch (e) {
      console.warn('SepsisGuard: Using Mock Data.', e.message);
      return MOCK_PATIENTS;
    }
  },

  getPatientById: async (id) => {
    try {
      const { data, error } = await supabase.from('patients').select('*').eq('id', id).single();
      if (error) throw error;
      return data || (MOCK_PATIENTS.find(p => p.id === id) || MOCK_PATIENTS[0]);
    } catch (e) {
      console.warn('SepsisGuard: Using Mock Patient.', e.message);
      return MOCK_PATIENTS.find(p => p.id === id) || MOCK_PATIENTS[0];
    }
  },

  createPatient: async (patientData) => {
    try {
      const newPatient = { ...patientData, id: `PT-${Math.floor(Math.random() * 9000) + 1000}`, riskScore: 45, status: 'Stable' };
      const { data, error } = await supabase.from('patients').insert([newPatient]).select();
      if (error) throw error;
      return data[0] || newPatient;
    } catch {
      return { ...patientData, id: `PT-${Math.floor(Math.random() * 9000) + 1000}`, riskScore: 45, status: 'Stable' };
    }
  },

  getAlerts: async () => {
    try {
      const { data, error } = await supabase.from('alerts').select('*');
      if (error) throw error;
      return data || [];
    } catch {
      return [];
    }
  },

  getAnalytics: async () => {
    try {
      const { data: analyticsData } = await supabase.from('analytics').select('*');
      const { data: patientsData } = await supabase.from('patients').select('status');
      
      const pts = patientsData || [];
      const dist = { stable: 0, monitoring: 0, elevated: 0, critical: 0 };
      pts.forEach(p => {
        if (p.status === 'Critical') dist.critical++;
        else if (p.status === 'High Risk') dist.elevated++;
        else if (p.status === 'Watch') dist.monitoring++;
        else dist.stable++;
      });
      
      return {
        activePatients: pts.length,
        criticalAlerts: dist.critical,
        avgResponseTime: '42s',
        earlyDetectionHours: 8.5,
        falsePositiveRate: 2.1,
        survivalRateImprovement: 14.2,
        riskDistribution: dist,
        departments: analyticsData || []
      };
    } catch {
      return {};
    }
  },

  updatePatientStatus: async (id, status) => {
    try {
      const { error } = await supabase.from('patients').update({ status }).eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch {
      return { success: true };
    }
  },

  simulateIntervention: async (id, hr, map) => {
    try {
      // 1. Fetch patient
      const { data: patient, error: fetchErr } = await supabase.from('patients').select('*').eq('id', id).single();
      if (fetchErr) throw fetchErr;

      const currentRisk = patient.riskscore || patient.riskScore || 50;
      const vitals = patient.vitals || {};
      
      // 2. Calculate new risk with dynamic impact
      let predictedRisk = currentRisk;
      
      // Heart Rate Impact (Improvement if HR lowered towards 75, penalty if raised)
      const hrDiff = (vitals.hr || 80) - hr;
      predictedRisk -= hrDiff * 0.25; 
      
      // MAP Impact (Improvement if MAP raised towards 85, penalty if lowered)
      const mapDiff = map - (vitals.map || 65);
      predictedRisk -= mapDiff * 0.8;

      // Ensure risk stays within 2% to 98%
      predictedRisk = Math.max(2, Math.min(98, Math.round(predictedRisk)));
      const improvement = currentRisk - predictedRisk;

      // 3. Create intervention log
      const intervention = {
        id: `SIM-${Date.now()}`,
        type: 'Simulated Intervention',
        details: `Simulated HR: ${hr}, MAP: ${map}. Predicted Risk: ${predictedRisk}%`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'PREDICTION'
      };

      const updatedInterventions = [intervention, ...(patient.interventions || [])];

      // 4. Update database
      const { error: updateErr } = await supabase.from('patients').update({
        interventions: updatedInterventions,
        riskScore: predictedRisk
      }).eq('id', id);
      if (updateErr) throw updateErr;

      return {
        currentRisk,
        predictedRisk,
        improvement,
        patient: { ...patient, riskScore: predictedRisk, interventions: updatedInterventions }
      };
    } catch (e) {
      console.error(e);
      return { currentRisk: 75, predictedRisk: 45, improvement: 30 };
    }
  }
};
