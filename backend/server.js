require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. ON DÉFINIT LE POOL D'ABORD
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
// 2. ON TESTE LA CONNEXION ENSUITE
pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ Erreur de connexion à PostgreSQL (Docker) :', err.stack);
    }
    console.log('✅ Connexion réussie à PostgreSQL (Docker) !');
    release();
});

// 3. TES ROUTES API
app.get('/', (req, res) => {
    res.send("Le serveur est en ligne !");
});

app.listen(3000, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:3000`);
});

app.post("/signalements", async (req, res) => {
  const { title, description, location } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO signalements(title, description, location) VALUES($1,$2,$3) RETURNING *",
      [title, description, location]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});