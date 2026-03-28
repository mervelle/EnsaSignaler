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
// POST /signalements (Créer avec validation Apogée)
// GET /signalements
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM signalements ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error("Erreur GET /signalements :", error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération des signalements" });
    }
});

router.post('/', async (req, res) => {
    const { title, description, location, user_id, apogee } = req.body;

    try {
        // 1. VÉRIFICATION : Est-ce que le code Apogée appartient bien à cet user_id ?
        // On suppose que la table 'users' contient une colonne 'apogee_code'
        const userCheck = await pool.query(
            "SELECT apogee_code FROM users WHERE id = $1",
            [user_id]
        );

        if (userCheck.rows.length === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        const validApogee = String(userCheck.rows[0].apogee_code).trim();
        const typedApogee = String(apogee).trim();

        if (typedApogee !== validApogee) {
            // Ajoute les valeurs dans l'erreur pour debugger en direct sur ton écran
            return res.status(403).json({ 
                 error: `Code invalide. Reçu: ${typedApogee}, Attendu: ${validApogee} pour l'user ${user_id}` 
           });
        }

        // 2. INSERTION : Si c'est correct, on insère le signalement
        const result = await pool.query(
            "INSERT INTO signalements(title, description, location, user_id, apogee, status) VALUES($1, $2, $3, $4, $5, 'nouveau') RETURNING *",
            [title, description, location, user_id, apogee]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error("Erreur lors de la création :", err);
        res.status(500).json({ error: "Erreur serveur lors de la validation Apogée" });
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