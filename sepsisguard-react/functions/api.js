const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 5000,
});

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
};

const respond = (code, body) => ({
  statusCode: code,
  headers: HEADERS,
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: HEADERS, body: '' };
  }

  const method = event.httpMethod;
  // Normalize path: strip leading /api so routes match regardless of rewrite
  const path = (event.path || '').replace(/^\/?api/, '') || '/';

  try {
    // GET /patients
    if (method === 'GET' && path === '/patients') {
      const r = await pool.query('SELECT * FROM patients ORDER BY id DESC');
      return respond(200, r.rows);
    }

    // GET /patients/:id
    if (method === 'GET' && /^\/patients\/[^/]+$/.test(path)) {
      const id = path.split('/').pop();
      const r = await pool.query('SELECT * FROM patients WHERE id = $1', [id]);
      if (!r.rows.length) return respond(404, { message: 'Not found' });
      return respond(200, r.rows[0]);
    }

    // POST /patients/:id/simulate
    if (method === 'POST' && /^\/patients\/[^/]+\/simulate$/.test(path)) {
      const id = path.split('/')[2];
      const { hr, map } = JSON.parse(event.body || '{}');
      const r = await pool.query('SELECT * FROM patients WHERE id = $1', [id]);
      if (!r.rows.length) return respond(404, { error: 'Not found' });
      const p = r.rows[0];
      const currentRisk = p.riskscore || p.riskScore || 50;
      const vitals = p.vitals || {};
      let predicted = currentRisk;
      if (hr < (vitals.hr || 80)) predicted -= ((vitals.hr || 80) - hr) * 0.2;
      if (map > (vitals.map || 65)) predicted -= (map - (vitals.map || 65)) * 0.5;
      predicted = Math.max(15, Math.min(95, Math.round(predicted)));
      return respond(200, { currentRisk, predictedRisk: predicted, improvement: currentRisk - predicted });
    }

    // POST /patients/:id/status
    if (method === 'POST' && /^\/patients\/[^/]+\/status$/.test(path)) {
      const id = path.split('/')[2];
      const { status } = JSON.parse(event.body || '{}');
      await pool.query('UPDATE patients SET status = $1 WHERE id = $2', [status, id]);
      return respond(200, { success: true });
    }

    // GET /alerts
    if (method === 'GET' && path === '/alerts') {
      const r = await pool.query('SELECT * FROM alerts');
      return respond(200, r.rows);
    }

    // GET /analytics
    if (method === 'GET' && path === '/analytics') {
      const pts = await pool.query('SELECT status FROM patients');
      const dist = { stable: 0, monitoring: 0, elevated: 0, critical: 0 };
      pts.rows.forEach(p => {
        if (p.status === 'Critical') dist.critical++;
        else if (p.status === 'High Risk') dist.elevated++;
        else if (p.status === 'Watch') dist.monitoring++;
        else dist.stable++;
      });
      return respond(200, {
        activePatients: pts.rows.length,
        criticalAlerts: dist.critical,
        avgResponseTime: '42s',
        earlyDetectionHours: 8.5,
        falsePositiveRate: 2.1,
        survivalRateImprovement: 14.2,
        riskDistribution: dist,
      });
    }

    return respond(404, { error: 'Route not found' });
  } catch (err) {
    console.error('Function error:', err.message);
    return respond(500, { error: err.message });
  }
};
