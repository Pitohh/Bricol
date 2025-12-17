import express from 'express';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get notifications for user
router.get('/', authenticateToken, (req, res) => {
  try {
    const notifications = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50')
      .all(req.user.id);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark as read
router.put('/:id/read', authenticateToken, (req, res) => {
  const { id } = req.params;

  try {
    db.prepare('UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?')
      .run(id, req.user.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
