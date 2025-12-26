import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import projectRoutes from './routes/project.js';
import projectResetRoutes from './routes/project-reset.js';
import phasesRoutes from './routes/phases.js';
import subTasksRoutes from './routes/subTasks.js';
import photosRoutes from './routes/photos.js';
import reportsRoutes from './routes/reports.js';
import reactionsRoutes from './routes/reactions.js';
import notificationsRoutes from './routes/notifications.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors({
  origin: isProduction
    ? [
        'https://bricol.open-road.tech',
        'https://*.netlify.app',
        'https://*.koyeb.app'
      ]
    : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('server/uploads'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Bricol API',
    database: 'PostgreSQL',
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/project', projectResetRoutes);
app.use('/api/phases', phasesRoutes);
app.use('/api/subtasks', subTasksRoutes);
app.use('/api/photos', photosRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/reactions', reactionsRoutes);
app.use('/api/notifications', notificationsRoutes);

app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════════╗
║         🏗️  BRICOL API SERVER v2.0            ║
╚════════════════════════════════════════════════╝

🚀 Server: http://0.0.0.0:${PORT}
💾 Database: PostgreSQL
🌍 Environment: ${process.env.NODE_ENV || 'development'}
   
✅ Ready
════════════════════════════════════════════════
  `);
});
