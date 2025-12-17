import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// Get project info
router.get('/', (req, res) => {
  try {
    const project = db.prepare('SELECT * FROM project WHERE id = 1').get();
    if (!project) {
      // Si pas de projet, en créer un par défaut
      db.prepare('INSERT INTO project (name, total_budget, start_date, created_by) VALUES (?, ?, ?, ?)')
        .run('Rénovation Orphelinat', 10000000, '2024-11-25', 1);
      const newProject = db.prepare('SELECT * FROM project WHERE id = 1').get();
      return res.json(newProject);
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project budget
router.put('/budget', (req, res) => {
  const { total_budget } = req.body;

  try {
    db.prepare('UPDATE project SET total_budget = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1')
      .run(total_budget);

    const project = db.prepare('SELECT * FROM project WHERE id = 1').get();
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
