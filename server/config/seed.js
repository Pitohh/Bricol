import db from './database.js';
import bcrypt from 'bcryptjs';

const hashPassword = (password) => bcrypt.hashSync(password, 10);

export const runSeed = () => {
  try {
    console.log('🌱 Seeding database...');

    // Clear tables
    db.exec(`
      DELETE FROM reactions;
      DELETE FROM photos;
      DELETE FROM sub_tasks;
      DELETE FROM phases;
      DELETE FROM project;
      DELETE FROM users;
    `);

    // Users
    const users = [
      ['michael', hashPassword('chantier2025'), 'Michael', 'chef_projet_chantier', 'Chef de Projet', null, JSON.stringify({canValidateTechnically:false,canApproveFinal:true,canViewAllTasks:true,canEditTasks:true,canViewCosts:true,canManageTeam:true,canEditBudget:true,canEditProject:true}), 'from-blue-600 to-indigo-700'],
      ['tanguy', hashPassword('coordinateur123'), 'Tanguy', 'coordinateur_travaux', 'Coordinateur Travaux', 'Coordination', JSON.stringify({canValidateTechnically:true,canApproveFinal:false,canViewAllTasks:true,canEditTasks:true,canViewCosts:true,canManageTeam:false,canEditBudget:false,canEditProject:false,canCreateSubTasks:true,canUploadPhotos:true,canWriteReports:true}), 'from-green-600 to-emerald-700'],
      ['yassa', hashPassword('menuiserie'), 'Yassa', 'artisan_menuisier', 'Menuisier', 'Menuiserie', JSON.stringify({canValidateTechnically:false,canApproveFinal:false,canViewAllTasks:true,canEditTasks:false,canViewCosts:false,canManageTeam:false,canUploadPhotos:true}), 'from-amber-600 to-orange-700']
    ];

    const insertUser = db.prepare('INSERT INTO users (username, password, name, role, role_label, specialty, permissions, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    users.forEach(u => insertUser.run(...u));

    // Project
    db.prepare('INSERT INTO project (name, total_budget, start_date, created_by) VALUES (?, ?, ?, ?)').run(
      'Rénovation Orphelinat Les Petits Anges de Dieu',
      10000000,
      '2024-11-25',
      1
    );

    // Phases
    const phases = [
      ['Préparation et Sécurisation', 'Sécurisation du chantier', 500000, 480000, 100, 'termine', '2024-11-25', '2024-12-01', 2, '2024-12-01 10:00:00', 1, '2024-12-01 14:00:00', JSON.stringify(['Tanguy']), 1],
      ['Menuiserie Générale', 'Installation portes et fenêtres', 2500000, 0, 85, 'en_attente_boss', '2024-12-02', null, 2, '2024-12-10 16:30:00', null, null, JSON.stringify(['Yassa']), 2],
      ['Électricité', 'Installation électrique', 1800000, 0, 70, 'en_cours', '2024-12-05', null, null, null, null, null, JSON.stringify(['Francis']), 3],
      ['Plomberie', 'Installation plomberie', 2200000, 0, 55, 'en_cours', '2024-12-08', null, null, null, null, null, JSON.stringify(['Borel']), 4],
      ['Vitrerie', 'Installation vitres', 1200000, 0, 30, 'en_cours', '2024-12-12', null, null, null, null, null, JSON.stringify(['Joël']), 5],
      ['Soudure', 'Travaux de soudure', 1500000, 0, 15, 'en_cours', '2024-12-14', null, null, null, null, null, JSON.stringify(['Rodrigue']), 6],
      ['Finitions', 'Peinture et nettoyage', 800000, 0, 0, 'a_faire', null, null, null, null, null, null, JSON.stringify(['Tanguy','Michael']), 7]
    ];

    const insertPhase = db.prepare('INSERT INTO phases (phase_name, description, estimated_cost, actual_cost, progression, status, start_date, end_date, validated_by, validated_at, approved_by, approved_at, assigned_to, phase_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    phases.forEach(p => insertPhase.run(...p));

    console.log('✅ Database seeded');
  } catch (error) {
    console.error('❌ Seed error:', error);
  }
};
