import express from 'express';
const router = express.Router();
router.post('/', (req, res) => res.json({ success: true }));
router.get('/phase/:phaseId', (req, res) => res.json([]));
export default router;
