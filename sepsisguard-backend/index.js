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
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:Arpit@946040@db.posldhsqknqyybwlkzxj.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000
});

// --- API ROUTES FIRST ---
app.get('/api/patients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/patients/:id/simulate', async (req, res) => {
  const { id } = req.params;
  const { hr, map } = req.body;
  console.log(`Simulation requested for ${id}: HR=${hr}, MAP=${map}`);
  try {
    const result = await pool.query('SELECT * FROM patients WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    
    const patient = result.rows[0];
    const currentRisk = patient.riskScore;
    
    let predictedRisk = currentRisk;
    if (hr < patient.vitals.hr) predictedRisk -= (patient.vitals.hr - hr) * 0.2;
    if (map > patient.vitals.map) predictedRisk -= (map - patient.vitals.map) * 0.5;
    
    predictedRisk = Math.max(15, Math.min(95, Math.round(predictedRisk)));
    const improvement = currentRisk - predictedRisk;

    const intervention = {
      id: `SIM-${Date.now()}`,
      type: 'Simulated Intervention',
      details: `Simulated HR: ${hr}, MAP: ${map}. Predicted Risk: ${predictedRisk}%`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'PREDICTION'
    };

    const updatedInterventions = [intervention, ...(patient.interventions || [])];
    await pool.query('UPDATE patients SET interventions = $1 WHERE id = $2', [JSON.stringify(updatedInterventions), id]);

    res.json({
      currentRisk,
      predictedRisk,
      improvement,
      patient: { ...patient, riskScore: predictedRisk, interventions: updatedInterventions }
    });
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

app.post('/api/patients/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query('UPDATE patients SET status = $1 WHERE id = $2', [status, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- FRONTEND CATCH-ALL LAST ---
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../sepsisguard-react/dist/index.html'));
});

// Export for serverless / testing
module.exports = app;

// Start server if run directly
if (require.main === module) {
  const PORT = process.env.PORT || 7860;
  app.listen(PORT, () => {
    console.log(`🚀 SepsisGuard Backend running on port ${PORT}`);
  });
}
