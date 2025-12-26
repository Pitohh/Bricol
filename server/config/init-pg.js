import pool from './database-pg.js';
import bcrypt from 'bcryptjs';

export async function initDatabase() {
  try {
    console.log('🔄 Initializing database...');

    // Créer les tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL,
        role_label VARCHAR(100) NOT NULL,
        specialty VARCHAR(100),
        permissions JSONB NOT NULL,
        color VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS project (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        total_budget BIGINT DEFAULT 10000000,
        start_date DATE,
        end_date DATE,
        status VARCHAR(50) DEFAULT 'en_cours',
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS phases (
        id SERIAL PRIMARY KEY,
        phase_name VARCHAR(255) NOT NULL,
        description TEXT,
        estimated_cost BIGINT DEFAULT 0,
        actual_cost BIGINT DEFAULT 0,
        start_date DATE,
        end_date DATE,
        progression INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'a_faire',
        assigned_to JSONB,
        validated_by INTEGER REFERENCES users(id),
        validated_at TIMESTAMP,
        approved_by INTEGER REFERENCES users(id),
        approved_at TIMESTAMP,
        phase_order INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS sub_tasks (
        id SERIAL PRIMARY KEY,
        phase_id INTEGER REFERENCES phases(id) ON DELETE CASCADE,
        task_name VARCHAR(255) NOT NULL,
        description TEXT,
        estimated_cost BIGINT DEFAULT 0,
        actual_cost BIGINT DEFAULT 0,
        start_date DATE,
        end_date DATE,
        progression INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'en_cours',
        created_by INTEGER REFERENCES users(id),
        validated_by INTEGER REFERENCES users(id),
        validated_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS photos (
        id SERIAL PRIMARY KEY,
        sub_task_id INTEGER REFERENCES sub_tasks(id) ON DELETE CASCADE,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        uploaded_by INTEGER REFERENCES users(id),
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        sub_task_id INTEGER REFERENCES sub_tasks(id) ON DELETE CASCADE,
        report_text TEXT NOT NULL,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reactions (
        id SERIAL PRIMARY KEY,
        phase_id INTEGER REFERENCES phases(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id),
        reaction_type VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        message TEXT NOT NULL,
        type VARCHAR(50),
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Database tables created');

    // Vérifier si seed nécessaire
    const { rows } = await pool.query('SELECT COUNT(*) as count FROM users');
    if (parseInt(rows[0].count) === 0) {
      console.log('🌱 Seeding database...');
      await seedDatabase();
    } else {
      console.log('✅ Database already seeded');
    }

  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

async function seedDatabase() {
  // Utilisateurs
  const users = [
    {
      username: 'michael',
      password: await bcrypt.hash('chantier2025', 10),
      name: 'Michael',
      role: 'chef_projet_chantier',
      role_label: 'Chef de Projet',
      specialty: null,
      permissions: {
        canValidateTechnically: false,
        canApproveFinal: true,
        canViewAllTasks: true,
        canEditTasks: true,
        canViewCosts: true,
        canManageTeam: true,
        canEditBudget: true,
        canEditProject: true
      },
      color: 'from-blue-600 to-indigo-700'
    },
    {
      username: 'tanguy',
      password: await bcrypt.hash('coordinateur123', 10),
      name: 'Tanguy',
      role: 'coordinateur_travaux',
      role_label: 'Coordinateur Travaux',
      specialty: 'Coordination',
      permissions: {
        canValidateTechnically: true,
        canApproveFinal: false,
        canViewAllTasks: true,
        canEditTasks: true,
        canViewCosts: true,
        canManageTeam: false,
        canEditBudget: false,
        canEditProject: false,
        canCreateSubTasks: true,
        canUploadPhotos: true,
        canWriteReports: true
      },
      color: 'from-green-600 to-emerald-700'
    },
    {
      username: 'yassa',
      password: await bcrypt.hash('menuiserie', 10),
      name: 'Yassa',
      role: 'ouvrier_specialise',
      role_label: 'Menuisier',
      specialty: 'Menuiserie',
      permissions: { canUploadPhotos: true },
      color: 'from-amber-600 to-orange-700'
    },
    {
      username: 'francis',
      password: await bcrypt.hash('electricite', 10),
      name: 'Francis',
      role: 'ouvrier_specialise',
      role_label: 'Électricien',
      specialty: 'Électricité',
      permissions: { canUploadPhotos: true },
      color: 'from-yellow-500 to-amber-600'
    },
    {
      username: 'borel',
      password: await bcrypt.hash('plomberie', 10),
      name: 'Borel',
      role: 'ouvrier_specialise',
      role_label: 'Plombier',
      specialty: 'Plomberie',
      permissions: { canUploadPhotos: true },
      color: 'from-blue-500 to-cyan-600'
    },
    {
      username: 'joel',
      password: await bcrypt.hash('vitrerie', 10),
      name: 'Joël',
      role: 'ouvrier_specialise',
      role_label: 'Vitrier',
      specialty: 'Vitrerie',
      permissions: { canUploadPhotos: true },
      color: 'from-cyan-500 to-sky-600'
    },
    {
      username: 'rodrigue',
      password: await bcrypt.hash('soudure', 10),
      name: 'Rodrigue',
      role: 'ouvrier_specialise',
      role_label: 'Soudeur',
      specialty: 'Soudure',
      permissions: { canUploadPhotos: true },
      color: 'from-red-600 to-rose-700'
    }
  ];

  for (const user of users) {
    await pool.query(
      `INSERT INTO users (username, password, name, role, role_label, specialty, permissions, color)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        user.username,
        user.password,
        user.name,
        user.role,
        user.role_label,
        user.specialty,
        JSON.stringify(user.permissions),
        user.color
      ]
    );
  }

  // Projet
  await pool.query(
    `INSERT INTO project (name, total_budget, start_date, created_by)
     VALUES ($1, $2, $3, $4)`,
    ['Rénovation Orphelinat "Les Petits Anges de Dieu"', 10000000, '2024-11-25', 1]
  );

  // Phases
  const phases = [
    { name: 'Préparation et Sécurisation', desc: 'Nettoyage, sécurisation, échafaudages', cost: 600000, progress: 100, status: 'termine', assigned: [2] },
    { name: 'Menuiserie Générale', desc: 'Portes, fenêtres, placards', cost: 2500000, progress: 100, status: 'termine', assigned: [3] },
    { name: 'Électricité', desc: 'Installation électrique complète', cost: 1800000, progress: 70, status: 'en_cours', assigned: [4] },
    { name: 'Plomberie', desc: 'Sanitaires, tuyauterie, évacuations', cost: 1500000, progress: 55, status: 'en_cours', assigned: [5] },
    { name: 'Vitrerie', desc: 'Vitres, miroirs, pare-douches', cost: 800000, progress: 30, status: 'en_cours', assigned: [6] },
    { name: 'Soudure', desc: 'Grilles, portails, structures métalliques', cost: 1200000, progress: 15, status: 'en_cours', assigned: [7] },
    { name: 'Finitions', desc: 'Peinture, carrelage, finitions', cost: 1600000, progress: 0, status: 'a_faire', assigned: [2, 3] }
  ];

  for (let i = 0; i < phases.length; i++) {
    const p = phases[i];
    await pool.query(
      `INSERT INTO phases (phase_name, description, estimated_cost, progression, status, assigned_to, phase_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [p.name, p.desc, p.cost, p.progress, p.status, JSON.stringify(p.assigned), i + 1]
    );
  }

  console.log('✅ Database seeded with 7 users and 7 phases');
}
