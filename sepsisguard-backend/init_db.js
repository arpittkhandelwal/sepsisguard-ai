const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://postgres:Arpit@946040@db.posldhsqknqyybwlkzxj.supabase.co:5432/postgres'
});

const schema = `
  CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    name TEXT,
    age INTEGER,
    gender TEXT,
    "admissionDate" TEXT,
    status TEXT,
    "riskScore" INTEGER,
    "riskTrend" TEXT,
    department TEXT,
    bed TEXT,
    bmi NUMERIC,
    vitals JSONB,
    shap JSONB,
    interventions JSONB,
    recommendations JSONB,
    "risk_history" JSONB,
    "timeline_markers" JSONB
  );

  CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    severity TEXT,
    title TEXT,
    description TEXT,
    "patientId" TEXT,
    "patientName" TEXT,
    bed TEXT,
    time TEXT,
    metrics JSONB,
    map INTEGER,
    confidence INTEGER
  );

  CREATE TABLE IF NOT EXISTS analytics (
    name TEXT PRIMARY KEY,
    "riskAvg" INTEGER,
    "survivalRate" NUMERIC,
    "falsePositiveRate" NUMERIC,
    "avgResponseTime" TEXT
  );
`;

const initialPatients = [
  {
    id: "PT-8821",
    name: "Eleanor Wright",
    age: 68,
    gender: "F",
    admissionDate: "Oct 24, 2024 - 08:15 AM",
    status: "Critical",
    riskScore: 82,
    riskTrend: "up",
    department: "Medical ICU",
    bed: "Bed 104",
    bmi: 26.4,
    vitals: { hr: 112, bpSystolic: 88, bpDiastolic: 54, map: 65, spo2: 94, temp: 101.2, lactate: 2.4, wbc: 18.5, creatinine: 1.8, platelets: 120 },
    shap: {
      features: [
        { name: "Lactate", value: 2.4, impact: 0.35 },
        { name: "Heart Rate", value: 112, impact: 0.25 },
        { name: "MAP", value: 65, impact: 0.20 },
        { name: "WBC", value: 18.5, impact: 0.10 }
      ],
      insights: [
        { title: "Lactate Trend", description: "Lactate increased by 0.6 mmol/L in the last 2 hours.", severity: "error" },
        { title: "Hemodynamics", description: "Sustained hypotension despite fluid challenge.", severity: "error" },
        { title: "Infection", description: "Elevated WBC with left shift indicates severe infection.", severity: "warning" }
      ]
    },
    interventions: [
      { id: "IV-1", type: "Fluid Resuscitation", time: "10:30 AM", status: "Completed", details: "30ml/kg Lactated Ringers" },
      { id: "IV-2", type: "Antibiotics", time: "11:00 AM", status: "In Progress", details: "Vancomycin & Cefepime" }
    ],
    recommendations: [
      "Initiate Vasopressors if MAP < 65 after fluids",
      "Draw repeat Lactate in 2 hours",
      "Consider Central Line Placement"
    ],
    risk_history: [
      { time: "-12h", riskScore: 15 },
      { time: "-10h", riskScore: 22 },
      { time: "-8h", riskScore: 45 },
      { time: "-6h", riskScore: 58 },
      { time: "-4h", riskScore: 72 },
      { time: "-2h", riskScore: 78 },
      { time: "NOW", riskScore: 82 }
    ],
    timeline_markers: [
      { type: "Model Prediction", time: "-8h", label: "Model Detection Point" },
      { type: "Clinical Diagnosis", time: "NOW", label: "Diagnosis Point" }
    ]
  },
  {
    id: "PT-8822",
    name: "James Miller",
    age: 55,
    gender: "M",
    admissionDate: "Oct 24, 2024 - 10:45 AM",
    status: "High Risk",
    riskScore: 65,
    riskTrend: "up",
    department: "Emergency Ward",
    bed: "Bed 12",
    bmi: 28.1,
    vitals: { hr: 95, bpSystolic: 105, bpDiastolic: 65, map: 78, spo2: 96, temp: 99.8, lactate: 1.8, wbc: 14.2, creatinine: 1.1, platelets: 180 },
    shap: { features: [], insights: [] },
    interventions: [],
    recommendations: [],
    risk_history: [
      { time: "-12h", riskScore: 10 },
      { time: "-8h", riskScore: 25 },
      { time: "-4h", riskScore: 45 },
      { time: "NOW", riskScore: 65 }
    ],
    timeline_markers: [
      { type: "Model Prediction", time: "-4h", label: "Early Detection" }
    ]
  },
  {
    id: "PT-8823",
    name: "Sarah Jenkins",
    age: 72,
    gender: "F",
    admissionDate: "Oct 23, 2024 - 11:20 PM",
    status: "Watch",
    riskScore: 42,
    riskTrend: "flat",
    department: "Surgical ICU",
    bed: "Bed 205",
    bmi: 22.3,
    vitals: { hr: 82, bpSystolic: 118, bpDiastolic: 72, map: 87, spo2: 98, temp: 98.4, lactate: 1.1, wbc: 10.5, creatinine: 0.9, platelets: 210 },
    shap: { features: [], insights: [] },
    interventions: [],
    recommendations: [],
    risk_history: [
      { time: "-12h", riskScore: 38 },
      { time: "-6h", riskScore: 40 },
      { time: "NOW", riskScore: 42 }
    ],
    timeline_markers: []
  },
  {
    id: "PT-8824",
    name: "Robert Chen",
    age: 48,
    gender: "M",
    admissionDate: "Oct 24, 2024 - 02:15 PM",
    status: "Stable",
    riskScore: 18,
    riskTrend: "down",
    department: "General Ward",
    bed: "Bed 314",
    bmi: 25.6,
    vitals: { hr: 75, bpSystolic: 125, bpDiastolic: 80, map: 95, spo2: 99, temp: 98.6, lactate: 0.9, wbc: 7.2, creatinine: 0.8, platelets: 250 },
    shap: { features: [], insights: [] },
    interventions: [],
    recommendations: [],
    risk_history: [
      { time: "-12h", riskScore: 25 },
      { time: "-6h", riskScore: 20 },
      { time: "NOW", riskScore: 18 }
    ],
    timeline_markers: []
  }
];

const initialAlerts = [
  { id: "A-1", severity: "Critical", title: "Risk Increased", description: "Risk increased by 15% in last hour", patientId: "PT-8821", patientName: "Sarah Johnson", bed: "ICU-04", time: "2m ago" },
  { id: "A-2", severity: "High", title: "Labs Pending", description: "Lactate results pending > 2 hours", patientId: "PT-8822", patientName: "Robert Chen", bed: "ER-09", time: "15m ago" },
  { id: "A-3", severity: "High", title: "Sepsis Bundle", description: "Sepsis Bundle item \"Antibiotics\" overdue", patientId: "PT-8825", patientName: "Maria Garcia", bed: "ICU-12", time: "45m ago" }
];

const initialDepartments = [
  { name: 'Medical ICU', riskAvg: 42, survivalRate: 98.4, falsePositiveRate: 1.2, avgResponseTime: '8m 42s' },
  { name: 'Surgical ICU', riskAvg: 38, survivalRate: 99.1, falsePositiveRate: 0.8, avgResponseTime: '6m 15s' },
  { name: 'Emergency Dept', riskAvg: 55, survivalRate: 96.5, falsePositiveRate: 2.4, avgResponseTime: '12m 30s' },
  { name: 'Step-down Unit', riskAvg: 25, survivalRate: 99.8, falsePositiveRate: 0.5, avgResponseTime: '15m 10s' }
];

async function initDb() {
  try {
    await client.connect();
    console.log('Connected to Supabase DB');
    
    // Drop and recreate tables to ensure new columns are added
    await client.query('DROP TABLE IF EXISTS analytics');
    await client.query('DROP TABLE IF EXISTS alerts');
    await client.query('DROP TABLE IF EXISTS patients');
    
    // Create Tables
    await client.query(schema);
    console.log('Tables recreated with new schema');

    // Seed Patients
    for (const p of initialPatients) {
      await client.query(`
        INSERT INTO patients (id, name, age, gender, "admissionDate", status, "riskScore", "riskTrend", department, bed, bmi, vitals, shap, interventions, recommendations, risk_history, timeline_markers)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      `, [p.id, p.name, p.age, p.gender, p.admissionDate, p.status, p.riskScore, p.riskTrend, p.department, p.bed, p.bmi, JSON.stringify(p.vitals), JSON.stringify(p.shap), JSON.stringify(p.interventions), JSON.stringify(p.recommendations), JSON.stringify(p.risk_history), JSON.stringify(p.timeline_markers)]);
    }
    
    // Seed Alerts
    for (const a of initialAlerts) {
      await client.query(`
        INSERT INTO alerts (id, severity, title, description, "patientId", "patientName", bed, time, metrics, map, confidence)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [a.id, a.severity, a.title, a.description, a.patientId, a.patientName, a.bed, a.time, JSON.stringify(a.metrics || []), a.map || null, a.confidence || null]);
    }

    // Seed Analytics
    for (const d of initialDepartments) {
      await client.query(`
        INSERT INTO analytics (name, "riskAvg", "survivalRate", "falsePositiveRate", "avgResponseTime")
        VALUES ($1, $2, $3, $4, $5)
      `, [d.name, d.riskAvg, d.survivalRate, d.falsePositiveRate, d.avgResponseTime]);
    }

    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Error during init:', err);
  } finally {
    await client.end();
  }
}

initDb();
