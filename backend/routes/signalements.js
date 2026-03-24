const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /signalements (Récupérer tout)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT s.*, u.name 
            FROM signalements s
            JOIN users u ON s.user_id = u.id
            ORDER BY s.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// POST /signalements (Créer)
router.post('/', async (req, res) => {
    const { title, description, location, user_id } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO signalements(title, description, location, user_id, status) VALUES($1,$2,$3,$4,'nouveau') RETURNING *",
            [title, description, location, user_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// PATCH /signalements/:id (Mettre à jour le statut - CRUCIAL)
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await pool.query(
            "UPDATE signalements SET status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Non trouvé" });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la mise à jour" });
    }
});

module.exports = router;