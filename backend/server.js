require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();

// ───────── 1. Middlewares ─────────
app.use(cors());
app.use(express.json());

// ───────── 2. Configuration PostgreSQL ─────────
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ensa',
    password: process.env.DB_PASSWORD || '12345678',
    port: process.env.DB_PORT || 5432,
});

// Test de connexion DB
pool.query('SELECT NOW()', (err) => {
    if (err) console.error("❌ Erreur DB:", err.message);
    else console.log("✅ Base de données 'ensa' connectée.");
});

// ───────── 3. ROUTES API (Strictes pour Node 22) ─────────

// A. Créer un signalement + Suggestion
app.post('/signalements', async (req, res) => {
    try {
        const { title, description, location, apogee, user_id } = req.body;
        const insertSignalement = await pool.query(
            `INSERT INTO signalements (title, description, location, apogee, status, user_id)
             VALUES ($1, $2, $3, $4, 'nouveau', $5) RETURNING id`,
            [title, description, location, apogee, user_id]
        );
        const signalementId = insertSignalement.rows[0].id;

        // Logique simple de suggestion
        let txt = "Vérifier et proposer une action.";
        if (title.toLowerCase().includes('fuite')) txt = "Réparer la fuite (économie d'eau).";
        if (title.toLowerCase().includes('lumière')) txt = "Installer des capteurs de mouvement.";

        await pool.query(
            `INSERT INTO suggestions (suggestion_text, signalement_id) VALUES ($1, $2)`,
            [txt, signalementId]
        );

        res.status(201).json({ message: "Succès", signalementId, suggestion: txt });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// B. Liste des signalements
app.get('/signalements', async (req, res) => {
    try {
        const result = await pool.query(`SELECT s.*, u.name FROM signalements s LEFT JOIN users u ON s.user_id = u.id ORDER BY s.created_at DESC`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// C. Liste des suggestions (Route avec paramètre nommé : obligatoire en Node 22)
app.get('/suggestions/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`SELECT * FROM suggestions WHERE signalement_id = $1`, [id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// ───────── 4. Fichiers Statiques ─────────

// Cette ligne gère déjà l'accès à tes fichiers (form.html, style.css, etc.)
app.use(express.static(path.join(__dirname, '../frontend')));

// AU LIEU DU WILDCARD (*), on utilise une route nommée simple
// Tu pourras accéder à ton app via http://localhost:3000/accueil
app.get('/accueil', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/form.html'));
});

// ───────── 5. Lancement ─────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 Serveur EnsaSignaler (Node 22) en ligne !`);
    console.log(`🔗 Formulaire : http://localhost:${PORT}/form.html`);
    console.log(`📊 API Suggestions : http://localhost:${PORT}/suggestions/1\n`);
});