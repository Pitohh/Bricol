import express from 'express';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Upload photo for subtask
router.post('/subtask/:subTaskId', authenticateToken, upload.single('photo'), (req, res) => {
  const { subTaskId } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier fourni' });
  }

  try {
    const result = db.prepare(`
      INSERT INTO photos (sub_task_id, filename, original_name, file_path, mime_type, file_size, uploaded_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      subTaskId,
      req.file.filename,
      req.file.originalname,
      req.file.path,
      req.file.mimetype,
      req.file.size,
      req.user.id
    );

    const photo = db.prepare('SELECT * FROM photos WHERE id = ?').get(result.lastInsertRowid);

    const io = req.app.get('io');
    io.emit('photo-uploaded', photo);

    res.json(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get photos for subtask
router.get('/subtask/:subTaskId', authenticateToken, (req, res) => {
  const { subTaskId } = req.params;

  try {
    const photos = db.prepare('SELECT * FROM photos WHERE sub_task_id = ? ORDER BY uploaded_at DESC').all(subTaskId);
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
