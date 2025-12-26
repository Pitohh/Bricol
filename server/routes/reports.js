import express from 'express';
import pool from '../config/database-pg.js';

const router = express.Router();

// Create report
router.post('/', async (req, res) => {
  const { sub_task_id, report_text } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO reports (sub_task_id, report_text, created_by)
       VALUES ($1, $2, 1)
       RETURNING *`,
      [sub_task_id, report_text]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get reports
router.get('/subtask/:subTaskId', async (req, res) => {
  const { subTaskId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM reports WHERE sub_task_id = $1 ORDER BY created_at DESC',
      [subTaskId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
