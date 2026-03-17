const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /signalements
router.post('/', async (req, res) => {
    console.log("REQUETE REÇUE", req.body);
    console.log("POST /signalements HIT");
    console.log(req.body);

    
    const { title, description, location, user_id } = req.body;
    // validation simple
    if (!title || !description || !location || !user_id) {
    return res.status(400).json({
        error: "Tous les champs sont obligatoires"
    });
    }

    try {
        const result = await pool.query(
        "INSERT INTO signalements(title, description, location, user_id) VALUES($1,$2,$3,$4) RETURNING *",
        [title, description, location, user_id]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;

//router get
// GET /signalements
router.get('/', async (req, res) => {
    console.log("GET /signalements HIT");

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