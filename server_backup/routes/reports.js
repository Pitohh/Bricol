import express from 'express';
import db from '../config/database.js';
import { authenticateToken, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// Create report (Coordinateur)
router.post('/', authenticateToken, checkPermission('canWriteReports'), (req, res) => {
  const { sub_task_id, report_text } = req.body;

  try {
    const result = db.prepare(`
      INSERT INTO reports (sub_task_id, report_text, created_by)
      VALUES (?, ?, ?)
    `).run(sub_task_id, report_text, req.user.id);

    const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(result.lastInsertRowid);

    const io = req.app.get('io');
    io.emit('report-created', report);

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get reports for subtask
router.get('/subtask/:subTaskId', authenticateToken, (req, res) => {
  const { subTaskId } = req.params;

  try {
    const reports = db.prepare('SELECT * FROM reports WHERE sub_task_id = ? ORDER BY created_at DESC').all(subTaskId);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
