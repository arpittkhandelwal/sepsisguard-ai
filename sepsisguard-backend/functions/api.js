const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Supabase Connection
const pool = new Pool({
  connectionString: 'postgres://postgres:Arpit@946040@db.posldhsqknqyybwlkzxj.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

// Lazy Simulation Logic
async function runLazySimulation() {
  try {
    const { rows: patients } = await pool.query('SELECT id, "riskScore" FROM patients');
    for (const p of patients) {
      const drift = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
      let newScore = Math.max(5, Math.min(95, p.riskScore + drift));
      let newStatus = 'Stable';
      if (newScore > 75) newStatus = 'Critical';
      else if (newScore > 50) newStatus = 'High Risk';
      else if (newScore > 25) newStatus = 'Watch';
      
      await pool.query('UPDATE patients SET "riskScore" = $1, status = $2 WHERE id = $3', [newScore, newStatus, p.id]);
    }
  } catch (e) { console.error("Sim error", e); }
}

// Endpoints
app.get('/patients', async (req, res) => {
  await runLazySimulation();
  const result = await pool.query('SELECT * FROM patients ORDER BY "riskScore" DESC');
  res.json(result.rows);
});

app.get('/patients/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM patients WHERE id = $1', [req.params.id]);
  res.json(result.rows[0]);
});

app.post('/patients', async (req, res) => {
  const p = req.body;
  const newId = `PT-${Math.floor(Math.random() * 9000) + 1000}`;
  const result = await pool.query(
    'INSERT INTO patients (id, name, age, gender, status, "riskScore", department, bed, bmi, vitals) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
    [newId, p.name, p.age, p.gender, 'Stable', 45, p.department, 'TBD', p.bmi, JSON.stringify({})]
  );
  res.json(result.rows[0]);
});

app.get('/alerts', async (req, res) => {
  const result = await pool.query('SELECT * FROM alerts ORDER BY time DESC');
  res.json(result.rows);
});

app.get('/analytics', async (req, res) => {
  const result = await pool.query('SELECT * FROM analytics');
  const stats = {
    activePatients: 42,
    criticalAlerts: 3,
    avgResponseTime: "42s",
    earlyDetectionHours: 8.5,
    falsePositiveRate: 2.1,
    survivalRateImprovement: 14.2,
    riskDistribution: { stable: 24, monitoring: 12, elevated: 4, critical: 2 }
  };
  res.json(stats);
});

module.exports.handler = serverless(app);
