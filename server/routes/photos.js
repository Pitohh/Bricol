import express from 'express';
import pool from '../config/database-pg.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'server/uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Upload photo
router.post('/subtask/:subTaskId', upload.single('photo'), async (req, res) => {
  const { subTaskId } = req.params;
  
  try {
    const result = await pool.query(
      `INSERT INTO photos (sub_task_id, filename, original_name, file_path, uploaded_by)
       VALUES ($1, $2, $3, $4, 1)
       RETURNING *`,
      [subTaskId, req.file.filename, req.file.originalname, req.file.path]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get photos
router.get('/subtask/:subTaskId', async (req, res) => {
  const { subTaskId } = req.params;
  
  try {
    const result = await pool.query(
      'SELECT * FROM photos WHERE sub_task_id = $1 ORDER BY uploaded_at DESC',
      [subTaskId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
