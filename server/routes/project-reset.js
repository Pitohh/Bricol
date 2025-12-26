import express from 'express';
import pool from '../config/database-pg.js';

const router = express.Router();

// Reset project - Seulement pour Chef de Projet
router.post('/reset', async (req, res) => {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting project reset...');
    
    await client.query('BEGIN');

    // Supprimer les données liées
    await client.query('DELETE FROM photos');
    await client.query('DELETE FROM reports');
    await client.query('DELETE FROM sub_tasks');
    await client.query('DELETE FROM reactions');

    // Reset les phases
    await client.query(`
      UPDATE phases SET 
        progression = 0,
        status = 'a_faire',
        actual_cost = 0,
        validated_by = NULL,
        validated_at = NULL,
        approved_by = NULL,
        approved_at = NULL,
        updated_at = CURRENT_TIMESTAMP
    `);

    await client.query('COMMIT');
    
    console.log('✅ Project reset successful');
    res.json({ 
      success: true, 
      message: 'Projet réinitialisé avec succès' 
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Reset error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

export default router;
