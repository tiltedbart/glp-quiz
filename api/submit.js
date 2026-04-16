const { Pool } = require('pg');

let pool;
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 1
    });
  }
  return pool;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const q = req.body;
    const db = getPool();
    const result = await db.query(
      `INSERT INTO quiz_submissions (
        goal, height_ft, height_in, weight_lbs, target_weight_lbs, bmi,
        pace, prior_meds, sex, dob, age, state,
        contraindications_active, contraindications_history, compounding_preferences,
        first_name, last_name, email, phone, sms_consent,
        selected_med, selected_duration, selected_price_per_month, raw_quiz_data
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,
        $13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24
      ) RETURNING id`,
      [
        q.goal||null,
        q.heightFt ? parseInt(q.heightFt) : null,
        q.heightIn !== undefined ? parseInt(q.heightIn) : null,
        q.weight ? parseFloat(q.weight) : null,
        q.targetWeight ? parseFloat(q.targetWeight) : null,
        q.bmi ? parseFloat(q.bmi) : null,
        q.pace||null, q.priorMeds||null,
        q.sex||null, q.dob||null,
        q.age ? parseInt(q.age) : null,
        q.state||null,
        JSON.stringify(q.contraindications1||[]),
        JSON.stringify(q.contraindications2||[]),
        JSON.stringify(q.compoundingPreferences||[]),
        q.firstName||null, q.lastName||null,
        q.email||null, q.phone||null,
        q.smsConsent||false,
        q.selectedMed||null, q.selectedDuration||null,
        q.selectedPrice ? parseFloat(q.selectedPrice) : null,
        JSON.stringify(q)
      ]
    );
    res.status(200).json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('DB error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
