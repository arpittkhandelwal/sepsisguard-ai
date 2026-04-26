const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 7860;

app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../sepsisguard-react/dist')));

const pool = new Pool({
  connectionString: 'postgres://postgres:Arpit@946040@db.posldhsqknqyybwlkzxj.supabase.co:5432/postgres'
});

app.get('/api/patients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/patients', async (req, res) => {
  try {
    const id = `PT-${Math.floor(1000 + Math.random() * 9000)}`;
    const admissionDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' - ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const status = 'Watch';
    const riskScore = Math.floor(40 + Math.random() * 20);
    const riskTrend = 'flat';
    const vitals = { hr: 85, bpSystolic: 120, bpDiastolic: 80, map: 93, spo2: 98, temp: 98.6, lactate: 1.2, wbc: 8.0, creatinine: 0.9, platelets: 250 };
    const shap = { features: [], insights: [] };
    const interventions = JSON.stringify([]);
    const recommendations = JSON.stringify([]);
    const bed = `Bed ${Math.floor(100 + Math.random() * 900)}`;

    const { name, age, gender, department, bmi } = req.body;

    const result = await pool.query(`
      INSERT INTO patients (id, name, age, gender, "admissionDate", status, "riskScore", "riskTrend", department, bed, bmi, vitals, shap, interventions, recommendations)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `, [id, name, age, gender, admissionDate, status, riskScore, riskTrend, department, bed, bmi, vitals, shap, interventions, recommendations]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/patients/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients WHERE id = $1', [req.params.id]);
    if (result.rows.length > 0) res.json(result.rows[0]);
    else res.status(404).json({ message: 'Patient not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/alerts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alerts');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/analytics', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM analytics');
    const patients = await pool.query('SELECT status FROM patients');
    
    const riskDist = { stable: 0, monitoring: 0, elevated: 0, critical: 0 };
    patients.rows.forEach(p => {
      if (p.status === 'Critical') riskDist.critical++;
      else if (p.status === 'High Risk') riskDist.elevated++;
      else if (p.status === 'Watch') riskDist.monitoring++;
      else riskDist.stable++;
    });

    res.json({
      activePatients: patients.rows.length,
      criticalAlerts: riskDist.critical,
      avgResponseTime: "42s",
      earlyDetectionHours: 8.5,
      falsePositiveRate: 2.1,
      survivalRateImprovement: 14.2,
      riskDistribution: riskDist,
      departments: result.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/simulate', async (req, res) => {
  try {
    const { patientId, targetHr, targetMap } = req.body;
    const result = await pool.query('SELECT * FROM patients WHERE id = $1', [patientId]);
    if (result.rows.length > 0) {
      let patient = result.rows[0];
      
      // Determine clinical type based on vitals change
      let type = "Hemodynamic Stabilization";
      let details = `Target HR: ${targetHr}, Target MAP: ${targetMap}`;
      
      if (targetMap > patient.vitals.map) {
        type = "Vasopressor Titration";
        details = `Increased MAP target to ${targetMap} mmHg via simulated Norepinephrine`;
      } else if (targetHr < patient.vitals.hr) {
        type = "Fluid Resuscitation";
        details = `Reduced HR to ${targetHr} bpm via simulated 500ml Bolus`;
      }

      const newIntervention = {
        id: `IV-${Math.floor(Math.random() * 1000)}`,
        type: type,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        status: "Completed",
        details: details
      };
      
      const currentRisk = patient.riskScore;
      
      // Clinical Heuristic: Predict risk reduction without permanently changing vitals
      let reduction = 0;
      if (targetHr >= 60 && targetHr <= 90) reduction += 18;
      else if (targetHr < 100) reduction += 8;
      
      if (targetMap >= 70) reduction += 22;
      else if (targetMap >= 65) reduction += 12;

      const predictedRisk = Math.max(8, currentRisk - reduction);
      const improvement = currentRisk - predictedRisk;

      // Log the simulation as a "What-If" event in the history
      let interventionsList = Array.isArray(patient.interventions) ? patient.interventions : [];
      interventionsList.unshift({
        ...newIntervention,
        type: "Simulated Projection",
        status: "Calculated"
      });
      
      // Update the log but NOT the vitals
      await pool.query(`
        UPDATE patients SET interventions = $1
        WHERE id = $2
      `, [JSON.stringify(interventionsList), patientId]);

      res.json({ 
        patient: { ...patient, interventions: interventionsList }, 
        currentRisk: currentRisk,
        predictedRisk: predictedRisk,
        improvement: improvement
      });
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Patient Status (Discharge/Transfer)
app.post('/api/patients/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE patients SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Real-time Simulation Loop hitting Supabase Database directly!
setInterval(async () => {
  try {
    const result = await pool.query('SELECT id, vitals, "riskScore" FROM patients');
    
    // We update all patients in a single transaction/loop to simulate live traffic
    // For large databases, we would batch this. Here it's small scale.
    for (let p of result.rows) {
      p.vitals.hr += Math.floor(Math.random() * 5) - 2;
      p.vitals.map += Math.floor(Math.random() * 5) - 2;
      
      if (p.id === 'PT-8821') {
        p.riskScore = Math.min(99, p.riskScore + (Math.random() > 0.5 ? 1 : 0));
      } else {
        p.riskScore += Math.floor(Math.random() * 3) - 1;
      }
      p.riskScore = Math.max(0, Math.min(100, p.riskScore));

      let status = 'Stable';
      if (p.riskScore > 75) status = 'Critical';
      else if (p.riskScore > 50) status = 'High Risk';
      else if (p.riskScore > 30) status = 'Watch';

      // Update the "NOW" entry in history
      const history = await pool.query('SELECT risk_history FROM patients WHERE id = $1', [p.id]);
      let currentHistory = history.rows[0]?.risk_history || [];
      if (currentHistory.length > 0) {
        currentHistory[currentHistory.length - 1].riskScore = p.riskScore;
      }

      await pool.query(`
        UPDATE patients SET vitals = $1, "riskScore" = $2, status = $3, risk_history = $4
        WHERE id = $5
      `, [p.vitals, p.riskScore, status, JSON.stringify(currentHistory), p.id]);
    }
  } catch (err) {
    console.error('Simulation loop error:', err);
  }
}, 5000); // 5s to avoid hitting Supabase free-tier limits too hard

// Catch-all to serve React App for any other routes (Express 5 syntax)
app.get('(.*)', (req, res) => {
  res.sendFile(path.join(__dirname, '../sepsisguard-react/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Unified SepsisGuard AI listening at port ${port}`);
});
