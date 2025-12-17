import jwt from 'jsonwebtoken';
import db from '../config/database.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

export const checkPermission = (permission) => {
  return (req, res, next) => {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const permissions = JSON.parse(user.permissions);
    
    if (!permissions[permission]) {
      return res.status(403).json({ error: 'Permission insuffisante' });
    }

    next();
  };
};
