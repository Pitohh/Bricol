import express from 'express';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Toggle reaction
router.post('/', authenticateToken, (req, res) => {
  const { phase_id, reaction_type } = req.body;

  try {
    const existing = db.prepare('SELECT * FROM reactions WHERE phase_id = ? AND user_id = ?')
      .get(phase_id, req.user.id);

    if (existing) {
      if (existing.reaction_type === reaction_type) {
        db.prepare('DELETE FROM reactions WHERE id = ?').run(existing.id);
        res.json({ action: 'removed' });
      } else {
        db.prepare('UPDATE reactions SET reaction_type = ? WHERE id = ?')
          .run(reaction_type, existing.id);
        res.json({ action: 'updated' });
      }
    } else {
      db.prepare('INSERT INTO reactions (phase_id, user_id, reaction_type) VALUES (?, ?, ?)')
        .run(phase_id, req.user.id, reaction_type);
      res.json({ action: 'added' });
    }

    const io = req.app.get('io');
    io.emit('reaction-changed', { phase_id, user_id: req.user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get reactions for phase
router.get('/phase/:phaseId', authenticateToken, (req, res) => {
  const { phaseId } = req.params;

  try {
    const reactions = db.prepare('SELECT * FROM reactions WHERE phase_id = ?').all(phaseId);
    res.json(reactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
