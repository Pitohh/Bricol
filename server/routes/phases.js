import express from 'express';
import pool from '../config/database-pg.js';

const router = express.Router();

// Get all phases
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM phases ORDER BY phase_order'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update budget
router.put('/:id/budget', async (req, res) => {
  const { id } = req.params;
  const { estimated_cost } = req.body;

  try {
    const result = await pool.query(
      'UPDATE phases SET estimated_cost = $1 WHERE id = $2 RETURNING *',
      [estimated_cost, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update actual cost
router.put('/:id/actual-cost', async (req, res) => {
  const { id } = req.params;
  const { actual_cost } = req.body;

  try {
    const result = await pool.query(
      'UPDATE phases SET actual_cost = $1 WHERE id = $2 RETURNING *',
      [actual_cost, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate (Tanguy - 85%)
router.post('/:id/validate', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE phases 
       SET progression = 85, 
           status = 'en_attente_boss',
           validated_by = 2,
           validated_at = CURRENT_TIMESTAMP
       WHERE id = $1 
       RETURNING *`,
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve (Michael - 100%)
router.post('/:id/approve', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE phases 
       SET progression = 100,
           status = 'termine',
           approved_by = 1,
           approved_at = CURRENT_TIMESTAMP
       WHERE id = $1 
       RETURNING *`,
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
