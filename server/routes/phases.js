import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// Get all phases
router.get('/', (req, res) => {
  try {
    const phases = db.prepare('SELECT * FROM phases ORDER BY phase_order').all();
    phases.forEach(phase => {
      phase.assigned_to = JSON.parse(phase.assigned_to || '[]');
    });
    res.json(phases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update phase budget
router.put('/:id/budget', (req, res) => {
  const { id } = req.params;
  const { estimated_cost } = req.body;

  try {
    db.prepare('UPDATE phases SET estimated_cost = ? WHERE id = ?')
      .run(estimated_cost, id);

    const phase = db.prepare('SELECT * FROM phases WHERE id = ?').get(id);
    phase.assigned_to = JSON.parse(phase.assigned_to || '[]');

    res.json(phase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update actual cost
router.put('/:id/actual-cost', (req, res) => {
  const { id } = req.params;
  const { actual_cost } = req.body;

  try {
    db.prepare('UPDATE phases SET actual_cost = ? WHERE id = ?')
      .run(actual_cost, id);

    const phase = db.prepare('SELECT * FROM phases WHERE id = ?').get(id);
    phase.assigned_to = JSON.parse(phase.assigned_to || '[]');

    res.json(phase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate technically (Coordinateur)
router.post('/:id/validate', (req, res) => {
  const { id } = req.params;

  try {
    db.prepare(`
      UPDATE phases 
      SET progression = 85, 
          status = 'en_attente_boss',
          validated_by = 2,
          validated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(id);

    const phase = db.prepare('SELECT * FROM phases WHERE id = ?').get(id);
    phase.assigned_to = JSON.parse(phase.assigned_to || '[]');

    res.json(phase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve final (Chef)
router.post('/:id/approve', (req, res) => {
  const { id } = req.params;

  try {
    db.prepare(`
      UPDATE phases 
      SET progression = 100,
          status = 'termine',
          approved_by = 1,
          approved_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(id);

    const phase = db.prepare('SELECT * FROM phases WHERE id = ?').get(id);
    phase.assigned_to = JSON.parse(phase.assigned_to || '[]');

    res.json(phase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
