import express from 'express';
import db from '../config/database.js';
import { authenticateToken, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// Get subtasks for a phase
router.get('/phase/:phaseId', authenticateToken, (req, res) => {
  const { phaseId } = req.params;

  try {
    const subTasks = db.prepare('SELECT * FROM sub_tasks WHERE phase_id = ? ORDER BY task_order').all(phaseId);
    res.json(subTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create subtask (Coordinateur)
router.post('/', authenticateToken, checkPermission('canCreateSubTasks'), (req, res) => {
  const { phase_id, task_name, description, estimated_cost, start_date } = req.body;

  try {
    const maxOrder = db.prepare('SELECT MAX(task_order) as max FROM sub_tasks WHERE phase_id = ?').get(phase_id);
    const task_order = (maxOrder.max || 0) + 1;

    const result = db.prepare(`
      INSERT INTO sub_tasks (phase_id, task_name, description, estimated_cost, start_date, task_order, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(phase_id, task_name, description, estimated_cost, start_date, task_order, req.user.id);

    const subTask = db.prepare('SELECT * FROM sub_tasks WHERE id = ?').get(result.lastInsertRowid);

    const io = req.app.get('io');
    io.emit('subtask-created', subTask);

    res.json(subTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update subtask progression
router.put('/:id/progression', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { progression } = req.body;

  try {
    let status = 'a_faire';
    if (progression > 0 && progression < 100) status = 'en_cours';
    if (progression === 100) status = 'termine';

    db.prepare('UPDATE sub_tasks SET progression = ?, status = ? WHERE id = ?')
      .run(progression, status, id);

    const subTask = db.prepare('SELECT * FROM sub_tasks WHERE id = ?').get(id);

    const io = req.app.get('io');
    io.emit('subtask-updated', subTask);

    res.json(subTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate subtask (Coordinateur)
router.post('/:id/validate', authenticateToken, checkPermission('canValidateTechnically'), (req, res) => {
  const { id } = req.params;

  try {
    db.prepare(`
      UPDATE sub_tasks 
      SET status = 'termine',
          progression = 100,
          validated_by = ?,
          validated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(req.user.id, id);

    const subTask = db.prepare('SELECT * FROM sub_tasks WHERE id = ?').get(id);

    const io = req.app.get('io');
    io.emit('subtask-validated', subTask);

    res.json(subTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
