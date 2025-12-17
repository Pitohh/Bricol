#!/bin/bash

echo "🏗️  Installation Bricol v2.0"
echo "================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Créer les dossiers
echo -e "${BLUE}📁 Création des dossiers...${NC}"
mkdir -p server/{routes,models,middleware,uploads,config}
mkdir -p src/components/{BudgetManager,SubTasks,GanttChart}
mkdir -p src/utils

# 2. Installer les dépendances
echo -e "${BLUE}📦 Installation des dépendances...${NC}"
npm install better-sqlite3 multer jsonwebtoken bcryptjs socket.io socket.io-client uuid

# 3. Créer le fichier .env
echo -e "${BLUE}⚙️  Configuration .env...${NC}"
cat > .env << 'EOF'
# Backend
PORT=3001
NODE_ENV=development
JWT_SECRET=bricol_jwt_secret_super_securise_2025

# Frontend
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
EOF

# 4. Créer server/middleware/auth.js
echo -e "${BLUE}🔐 Création middleware auth...${NC}"
cat > server/middleware/auth.js << 'EOF'
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
EOF

# 5. Créer server/middleware/upload.js
echo -e "${BLUE}📤 Création middleware upload...${NC}"
cat > server/middleware/upload.js << 'EOF'
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});
EOF

# 6. Créer server/routes/auth.js
echo -e "${BLUE}🔑 Création route auth...${NC}"
cat > server/routes/auth.js << 'EOF'
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';

const router = express.Router();

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  try {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!user) {
      return res.status(401).json({ error: 'Nom d\'utilisateur incorrect' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    userWithoutPassword.permissions = JSON.parse(userWithoutPassword.permissions);

    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get current user
router.get('/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Non authentifié' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
EOF

# 7. Créer server/routes/project.js
echo -e "${BLUE}📊 Création route project...${NC}"
cat > server/routes/project.js << 'EOF'
import express from 'express';
import db from '../config/database.js';
import { authenticateToken, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// Get project info
router.get('/', authenticateToken, (req, res) => {
  try {
    const project = db.prepare('SELECT * FROM project WHERE id = 1').get();
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project budget (Chef de chantier only)
router.put('/budget', authenticateToken, checkPermission('canEditBudget'), (req, res) => {
  const { total_budget } = req.body;

  try {
    db.prepare('UPDATE project SET total_budget = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1')
      .run(total_budget);

    const project = db.prepare('SELECT * FROM project WHERE id = 1').get();
    
    // Notifier tous les utilisateurs
    const io = req.app.get('io');
    io.emit('project-updated', project);

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
EOF

# 8. Créer server/routes/phases.js
echo -e "${BLUE}📋 Création route phases...${NC}"
cat > server/routes/phases.js << 'EOF'
import express from 'express';
import db from '../config/database.js';
import { authenticateToken, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// Get all phases
router.get('/', authenticateToken, (req, res) => {
  try {
    const phases = db.prepare('SELECT * FROM phases ORDER BY phase_order').all();
    
    // Parse assigned_to JSON
    phases.forEach(phase => {
      phase.assigned_to = JSON.parse(phase.assigned_to);
    });

    res.json(phases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update phase budget (Chef only)
router.put('/:id/budget', authenticateToken, checkPermission('canEditBudget'), (req, res) => {
  const { id } = req.params;
  const { estimated_cost } = req.body;

  try {
    db.prepare('UPDATE phases SET estimated_cost = ? WHERE id = ?')
      .run(estimated_cost, id);

    const phase = db.prepare('SELECT * FROM phases WHERE id = ?').get(id);
    phase.assigned_to = JSON.parse(phase.assigned_to);

    const io = req.app.get('io');
    io.emit('phase-updated', phase);

    res.json(phase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate technically (Coordinateur)
router.post('/:id/validate', authenticateToken, checkPermission('canValidateTechnically'), (req, res) => {
  const { id } = req.params;

  try {
    db.prepare(`
      UPDATE phases 
      SET progression = 85, 
          status = 'en_attente_boss',
          validated_by = ?,
          validated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(req.user.id, id);

    const phase = db.prepare('SELECT * FROM phases WHERE id = ?').get(id);
    phase.assigned_to = JSON.parse(phase.assigned_to);

    const io = req.app.get('io');
    io.emit('phase-validated', phase);

    res.json(phase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve final (Chef)
router.post('/:id/approve', authenticateToken, checkPermission('canApproveFinal'), (req, res) => {
  const { id } = req.params;

  try {
    db.prepare(`
      UPDATE phases 
      SET progression = 100,
          status = 'termine',
          approved_by = ?,
          approved_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(req.user.id, id);

    const phase = db.prepare('SELECT * FROM phases WHERE id = ?').get(id);
    phase.assigned_to = JSON.parse(phase.assigned_to);

    const io = req.app.get('io');
    io.emit('phase-approved', phase);

    res.json(phase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
EOF

# 9. Créer server/routes/subTasks.js
echo -e "${BLUE}🔨 Création route subtasks...${NC}"
cat > server/routes/subTasks.js << 'EOF'
import express from 'express';
import db from '../config/database.js';
import { authenticateToken, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// Get subtasks for a phase
router.get('/phase/:phaseId', authenticateToken, (req, res) => {
  const { phaseId } = req.params;

  try {
    const subTasks = db.prepare('SELECT * FROM sub_tasks WHERE phase_id = ? ORDER BY task_order').all(phaseId);
    res.json(subTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create subtask (Coordinateur)
router.post('/', authenticateToken, checkPermission('canCreateSubTasks'), (req, res) => {
  const { phase_id, task_name, description, estimated_cost, start_date } = req.body;

  try {
    const maxOrder = db.prepare('SELECT MAX(task_order) as max FROM sub_tasks WHERE phase_id = ?').get(phase_id);
    const task_order = (maxOrder.max || 0) + 1;

    const result = db.prepare(`
      INSERT INTO sub_tasks (phase_id, task_name, description, estimated_cost, start_date, task_order, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(phase_id, task_name, description, estimated_cost, start_date, task_order, req.user.id);

    const subTask = db.prepare('SELECT * FROM sub_tasks WHERE id = ?').get(result.lastInsertRowid);

    const io = req.app.get('io');
    io.emit('subtask-created', subTask);

    res.json(subTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update subtask progression
router.put('/:id/progression', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { progression } = req.body;

  try {
    let status = 'a_faire';
    if (progression > 0 && progression < 100) status = 'en_cours';
    if (progression === 100) status = 'termine';

    db.prepare('UPDATE sub_tasks SET progression = ?, status = ? WHERE id = ?')
      .run(progression, status, id);

    const subTask = db.prepare('SELECT * FROM sub_tasks WHERE id = ?').get(id);

    const io = req.app.get('io');
    io.emit('subtask-updated', subTask);

    res.json(subTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate subtask (Coordinateur)
router.post('/:id/validate', authenticateToken, checkPermission('canValidateTechnically'), (req, res) => {
  const { id } = req.params;

  try {
    db.prepare(`
      UPDATE sub_tasks 
      SET status = 'termine',
          progression = 100,
          validated_by = ?,
          validated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(req.user.id, id);

    const subTask = db.prepare('SELECT * FROM sub_tasks WHERE id = ?').get(id);

    const io = req.app.get('io');
    io.emit('subtask-validated', subTask);

    res.json(subTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
EOF

# 10. Créer server/routes/photos.js
echo -e "${BLUE}📸 Création route photos...${NC}"
cat > server/routes/photos.js << 'EOF'
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
EOF

# 11. Créer server/routes/reports.js
echo -e "${BLUE}📝 Création route reports...${NC}"
cat > server/routes/reports.js << 'EOF'
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
EOF

# 12. Créer server/routes/reactions.js
echo -e "${BLUE}👍 Création route reactions...${NC}"
cat > server/routes/reactions.js << 'EOF'
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
EOF

# 13. Créer server/routes/notifications.js
echo -e "${BLUE}🔔 Création route notifications...${NC}"
cat > server/routes/notifications.js << 'EOF'
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
EOF

echo ""
echo -e "${GREEN}✅ Installation v2.0 terminée !${NC}"
echo ""
echo "Pour démarrer l'application :"
echo "  npm run dev:all"
echo ""

