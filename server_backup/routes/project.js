import express from 'express';
import db from '../config/database.js';
const router = express.Router();
router.get('/', (req, res) => {
  try {
    const project = db.prepare('SELECT * FROM project WHERE id = 1').get();
    res.json(project || { id: 1, name: 'Projet', total_budget: 10000000 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;
