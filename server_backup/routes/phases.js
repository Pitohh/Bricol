import express from 'express';
import db from '../config/database.js';
const router = express.Router();
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
export default router;
