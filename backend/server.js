require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();

// ───────── Middleware ─────────
app.use(cors());
app.use(express.json());

// ───────── Servir le frontend ─────────
app.use(express.static(path.join(__dirname, '../frontend')));

// ───────── Configuration PostgreSQL ─────────
// Adapter selon ton docker ou Postgres local
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ensa',
    password: '12345678', // ton mot de passe
    port: 5432,
});

// ───────── ROUTES ─────────

// Créer un signalement + suggestion automatique
app.post('/signalements', async (req, res) => {
    try {
        const { title, description, location, apogee, user_id } = req.body;

        // 1️⃣ Insérer le signalement
        const insertSignalement = await pool.query(
            `INSERT INTO signalements (title, description, location, apogee, status, user_id)
             VALUES ($1,$2,$3,$4,'nouveau',$5) RETURNING id`,
            [title, description, location, apogee, user_id]
        );

        const signalementId = insertSignalement.rows[0].id;

        // 2️⃣ Générer suggestion automatique simple
        let suggestionText = '';
        const lowerTitle = title.toLowerCase();

        if (lowerTitle.includes('lumière')) {
            suggestionText = "Installer des capteurs de mouvement pour économiser l'électricité.";
        } else if (lowerTitle.includes('fuite')) {
            suggestionText = "Réparer la fuite pour éviter le gaspillage d'eau.";
        } else if (lowerTitle.includes('déchets')) {
            suggestionText = "Mettre en place des poubelles de tri à proximité.";
        } else if (lowerTitle.includes('bruit')) {
            suggestionText = "Limiter le bruit et installer des panneaux acoustiques.";
        } else {
            suggestionText = "Vérifier et proposer une action éco-responsable.";
        }

        // 3️⃣ Insérer la suggestion
        await pool.query(
            `INSERT INTO suggestions (suggestion_text, signalement_id)
             VALUES ($1, $2)`,
            [suggestionText, signalementId]
        );

        // 4️⃣ Retourner le signalement + suggestion
        res.status(201).json({
            message: "Signalement créé avec suggestion automatique ✅",
            signalementId,
            suggestion: suggestionText
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Récupérer tous les signalements
app.get('/signalements', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT s.*, u.name
            FROM signalements s
            LEFT JOIN users u ON s.user_id = u.id
            ORDER BY s.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Récupérer suggestions d’un signalement
app.get('/suggestions/:signalementId', async (req, res) => {
    const { signalementId } = req.params;
    try {
        const result = await pool.query(
            `SELECT * FROM suggestions WHERE signalement_id=$1`,
            [signalementId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Route test
app.get('/', (req, res) => {
    res.send("API EnsaSignaler en ligne 🚀");
});

// ───────── Démarrer serveur ─────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur sur http://localhost:${PORT}`);
});