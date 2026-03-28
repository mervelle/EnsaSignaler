// services/suggestions.js
const express = require('express');
const router = express.Router();
const pool = require('./db'); // Assure-toi que tu as un pool PostgreSQL configuré

// Ajouter une suggestion
router.post('/', async (req, res) => {
    const { suggestion_text, signalement_id } = req.body;

    if (!suggestion_text || !signalement_id) {
        return res.status(400).json({ error: "Données manquantes" });
    }

    try {
        const query = `
            INSERT INTO suggestions (suggestion_text, signalement_id)
            VALUES ($1, $2) RETURNING *;
        `;
        const values = [suggestion_text, signalement_id];
        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur lors de l'ajout de la suggestion" });
    }
});

module.exports = router;