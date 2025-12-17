import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/project.js';
import phasesRoutes from './routes/phases.js';

// Import database
import db from './config/database.js';
import { runSeed } from './config/seed.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers uploadés
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logger
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path}`);
  next();
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/phases', phasesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Bricol API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  console.log('❌ 404:', req.path);
  res.status(404).json({
    error: 'Not Found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('💥 Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Init database
try {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  
  if (userCount.count === 0) {
    console.log('📊 Database empty, running seed...');
    runSeed();
  } else {
    console.log('✅ Database ready');
  }
} catch (error) {
  console.error('❌ Database error:', error);
}

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('🏗️  ================================');
  console.log('    BRICOL API SERVER');
  console.log('   ================================');
  console.log('');
  console.log(`   🚀 Server: http://localhost:${PORT}`);
  console.log(`   📊 Health: http://localhost:${PORT}/api/health`);
  console.log(`   💾 Database: SQLite`);
  console.log('');
  console.log('   ✅ Routes loaded:');
  console.log('      POST /api/auth/login');
  console.log('      GET  /api/auth/me');
  console.log('      GET  /api/project');
  console.log('      GET  /api/phases');
  console.log('');
  console.log('   Press Ctrl+C to stop');
  console.log('   ================================');
  console.log('');
});

export default app;
