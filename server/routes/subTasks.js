import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// Get all subtasks for a phase
router.get('/phase/:phaseId', (req, res) => {
  const { phaseId } = req.params;

  try {
    const subtasks = db.prepare(`
      SELECT * FROM sub_tasks 
      WHERE phase_id = ? 
      ORDER BY created_at ASC
    `).all(phaseId);

    res.json(subtasks);
  } catch (error) {
    console.error('Error getting subtasks:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a subtask
router.post('/', (req, res) => {
  const { phase_id, task_name, description, estimated_cost, start_date } = req.body;

  try {
    const result = db.prepare(`
      INSERT INTO sub_tasks (
        phase_id, task_name, description, estimated_cost, 
        start_date, progression, status, created_by
      ) VALUES (?, ?, ?, ?, ?, 0, 'en_cours', ?)
    `).run(phase_id, task_name, description, estimated_cost, start_date, 1);

    const subtask = db.prepare('SELECT * FROM sub_tasks WHERE id = ?').get(result.lastInsertRowid);
    res.json(subtask);
  } catch (error) {
    console.error('Error creating subtask:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update subtask progression
router.put('/:id/progression', (req, res) => {
  const { id } = req.params;
  const { progression } = req.body;

  try {
    db.prepare(`
      UPDATE sub_tasks 
      SET progression = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(progression, id);

    const subtask = db.prepare('SELECT * FROM sub_tasks WHERE id = ?').get(id);
    res.json(subtask);
  } catch (error) {
    console.error('Error updating progression:', error);
    res.status(500).json({ error: error.message });
  }
});

// Validate subtask (Tanguy)
router.post('/:id/validate', (req, res) => {
  const { id } = req.params;

  try {
    db.prepare(`
      UPDATE sub_tasks 
      SET status = 'termine',
          progression = 100,
          validated_by = 2,
          validated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(id);

    const subtask = db.prepare('SELECT * FROM sub_tasks WHERE id = ?').get(id);
    res.json(subtask);
  } catch (error) {
    console.error('Error validating subtask:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete subtask
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    db.prepare('DELETE FROM sub_tasks WHERE id = ?').run(id);
    res.json({ success: true, message: 'Sous-tâche supprimée' });
  } catch (error) {
    console.error('Error deleting subtask:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
