const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: 'postgres://postgres:Arpit@946040@db.posldhsqknqyybwlkzxj.supabase.co:5432/postgres'
});

// Lazy Simulation Logic: Runs one tick whenever patients are fetched
const runSimulationTick = async () => {
  try {
    const result = await pool.query('SELECT id, vitals, "riskScore" FROM patients');
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

      const historyRes = await pool.query('SELECT risk_history FROM patients WHERE id = $1', [p.id]);
      let currentHistory = historyRes.rows[0]?.risk_history || [];
      if (currentHistory.length > 0) {
        currentHistory[currentHistory.length - 1].riskScore = p.riskScore;
      }

      await pool.query(`
        UPDATE patients SET vitals = $1, "riskScore" = $2, status = $3, risk_history = $4
        WHERE id = $5
      `, [p.vitals, p.riskScore, status, JSON.stringify(currentHistory), p.id]);
    }
  } catch (err) {
    console.error('Lazy simulation error:', err);
  }
};

app.get('/patients', async (req, res) => {
  try {
    // Run a simulation tick before returning data to make the dashboard feel alive
    await runSimulationTick();
    const result = await pool.query('SELECT * FROM patients ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/patients/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients WHERE id = $1', [req.params.id]);
    if (result.rows.length > 0) res.json(result.rows[0]);
    else res.status(404).json({ message: 'Patient not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/alerts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alerts');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/analytics', async (req, res) => {
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

app.post('/simulate', async (req, res) => {
  try {
    const { patientId, targetHr, targetMap } = req.body;
    const result = await pool.query('SELECT * FROM patients WHERE id = $1', [patientId]);
    if (result.rows.length > 0) {
      let patient = result.rows[0];
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
      let reduction = 0;
      if (targetHr >= 60 && targetHr <= 90) reduction += 18;
      else if (targetHr < 100) reduction += 8;
      if (targetMap >= 70) reduction += 22;
      else if (targetMap >= 65) reduction += 12;

      const predictedRisk = Math.max(8, currentRisk - reduction);
      const improvement = currentRisk - predictedRisk;

      let interventionsList = Array.isArray(patient.interventions) ? patient.interventions : [];
      interventionsList.unshift({
        ...newIntervention,
        type: "Simulated Projection",
        status: "Calculated"
      });
      
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

app.post('/patients/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE patients SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length > 0) res.json(result.rows[0]);
    else res.status(404).json({ message: 'Patient not found' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports.handler = serverless(app);
