import express from 'express';
import pool from '../config/database-pg.js';

const router = express.Router();

// Get project
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM project WHERE id = 1');
    
    if (result.rows.length === 0) {
      // Créer projet par défaut
      const newProject = await pool.query(
        `INSERT INTO project (name, total_budget, start_date, created_by)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        ['Rénovation Orphelinat', 10000000, '2024-11-25', 1]
      );
      return res.json(newProject.rows[0]);
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update budget
router.put('/budget', async (req, res) => {
  const { total_budget } = req.body;

  try {
    const result = await pool.query(
      `UPDATE project 
       SET total_budget = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = 1 
       RETURNING *`,
      [total_budget]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
