import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('🔐 Login attempt:', username);

  try {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!user) {
      console.log('❌ User not found:', username);
      return res.status(401).json({ error: 'Utilisateur introuvable' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      console.log('❌ Wrong password for:', username);
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'bricol_secret_2025',
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    userWithoutPassword.permissions = JSON.parse(userWithoutPassword.permissions);

    console.log('✅ Login successful:', username);
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('💥 Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bricol_secret_2025');
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const { password: _, ...userWithoutPassword } = user;
    userWithoutPassword.permissions = JSON.parse(userWithoutPassword.permissions);

    res.json(userWithoutPassword);
  } catch (error) {
    res.status(403).json({ error: 'Token invalide' });
  }
});

export default router;
