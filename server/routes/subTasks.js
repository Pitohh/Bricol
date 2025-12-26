import express from 'express';
import pool from '../config/database-pg.js';

const router = express.Router();

// Get subtasks by phase
router.get('/phase/:phaseId', async (req, res) => {
  const { phaseId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM sub_tasks WHERE phase_id = $1 ORDER BY created_at ASC',
      [phaseId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create subtask
router.post('/', async (req, res) => {
  const { phase_id, task_name, description, estimated_cost, start_date } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO sub_tasks 
       (phase_id, task_name, description, estimated_cost, start_date, progression, status, created_by)
       VALUES ($1, $2, $3, $4, $5, 0, 'en_cours', 1)
       RETURNING *`,
      [phase_id, task_name, description, estimated_cost, start_date]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update progression
router.put('/:id/progression', async (req, res) => {
  const { id } = req.params;
  const { progression } = req.body;

  try {
    const result = await pool.query(
      `UPDATE sub_tasks 
       SET progression = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 
       RETURNING *`,
      [progression, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate subtask
router.post('/:id/validate', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE sub_tasks 
       SET status = 'termine',
           progression = 100,
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

// Delete subtask
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM sub_tasks WHERE id = $1', [id]);
    res.json({ success: true, message: 'Sous-tâche supprimée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
